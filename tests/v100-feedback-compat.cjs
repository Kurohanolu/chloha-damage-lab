'use strict';
// Real unchanged Worker + SQLite in the existing local harness. External
// Turnstile/GitHub are deterministic mocks; production requests are impossible.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const baseline='c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095';
for(const file of ['feedback-contract-v0185.js','services/feedback/src/worker.js'])assert.equal(fs.readFileSync(file,'utf8'),execFileSync('git',['show',baseline+':'+file],{encoding:'utf8'}),'compatibility must not alter the shared schema or production Worker: '+file);
function frontend(title='Singularity v1.0.0'){
 const privateMarker='PRIVATE_FIXTURE_MUST_NOT_ENTER_SNAPSHOT',nodes={dbAttPokemon:{value:'garchomp'},dbDefPokemon:{value:'tyranitar'},dbMove:{value:'earthquake'},attack:{value:'187'},output:{hidden:false},feedbackDescription:{value:privateMarker},feedbackEmail:{value:privateMarker+'@example.test'}};
 const context=vm.createContext({document:{title,getElementById:id=>nodes[id]||null}});
 vm.runInContext("window=globalThis;structuredClone=x=>JSON.parse(JSON.stringify(x));ChlohaLocale={get:()=> 'en'};ChlohaDamageEngine={version:'0.184'};read=()=>({attack:187,power:100});ChlohaLastCalculation={moveId:'earthquake',signature:JSON.stringify(read()),r:{rolls:[122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,146],base:96,attack:187,defense:120,effectivePower:100}}",context);
 for(const file of ['feedback-contract-v0185.js','feedback-release-v100.js','feedback-snapshot-v0185.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
 const snapshot=()=>JSON.parse(JSON.stringify(context.ChlohaFeedbackSnapshot.capture()));
 return {context,R:context.ChlohaFeedbackRelease,snapshot,privateMarker};
}
const front=frontend(),R=front.R,identity=R.identify('Singularity v1.0.0');
assert.equal(identity.fullVersion,'v1.0.0');assert.equal(identity.wireVersion,'v1.0');
assert.equal(identity.prefix,'[Singularity release: v1.0.0]\n\n');
assert.equal(identity.descriptionLimit,5000-identity.prefix.length);assert.ok(Object.isFrozen(identity));
assert.equal(R.wireDescriptionLimit,front.context.ChlohaFeedbackContract.limits.description);
const snapshot=front.snapshot();assert.equal(snapshot.appVersion,'v1.0');assert.equal(snapshot.engineVersion,'0.184');
assert.ok(!JSON.stringify(snapshot).includes(front.privateMarker),'capture excludes feedback text/contact even when those controls exist');
for(const title of ['Singularity v1.0.1','Singularity v1.0.0-pre.1','Singularity v1.0.00','Singularity v1.0','Singularity v1.0.0 trailing','prefix Singularity v1.0.0','Chloha Damage Lab v1.0.0','Singularity v0.188 Pre-Release 2 trailing','Singularity v0.188 Pre-Release 2\n',null]){
 assert.throws(()=>R.identify(title),/unsupported_report_version/,'unknown/malformed identity cannot be truncated: '+title);
 assert.throws(()=>R.description(title,'Cannot send unknown version'),/unsupported_report_version/);
 if(typeof title==='string')assert.throws(()=>frontend(title).snapshot(),/unsupported_report_version/);
}
for(const [title,version] of [['Singularity v0.188 Pre-Release 2','v0.188 Pre-Release 2'],['Chloha Damage Lab v0.186 Pre-Release 32','v0.186 Pre-Release 32']]){
 const historical=R.identify(title);assert.equal(historical.wireVersion,version);assert.equal(historical.fullVersion,version);assert.equal(historical.descriptionLimit,5000);assert.equal(historical.prefix,'');
 assert.equal(frontend(title).snapshot().appVersion,version);assert.equal(R.description(title,' historical fixture '),'historical fixture');
}
assert.throws(()=>R.description('Singularity v1.0.0',' '.repeat(2)),/requiredDescription/);
assert.throws(()=>R.description('Singularity v1.0.0','x'.repeat(identity.descriptionLimit+1)),/tooLong/);
assert.equal(R.description('Singularity v1.0.0','x'.repeat(identity.descriptionLimit)).length,5000);
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
assert.deepEqual(Object.keys(R.copy).sort(),[...locales].sort());
for(const locale of locales){for(const key of ['label','header','compatibility','unsupported'])assert.ok(R.text(locale,key).trim());assert.ok(R.text(locale,'compatibility').includes('v1.0.0'));if(locale!=='en')assert.notEqual(R.text(locale,'label'),R.text('en','label'));}
for(const file of ['feedback-release-v100.js','feedback-ui-v0185.js','feedback-snapshot-v0185.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/localStorage|sessionStorage|indexedDB/,'no automatic persistence in feedback adapter: '+file);
assert.doesNotMatch(fs.readFileSync('persistence-v0188.js','utf8'),/feedbackRelease|feedbackDescription|feedbackEmail/,'calculator allowlist does not include report metadata/contact');
(async()=>{
 const {createHarness,reportBody}=await import('../services/feedback/test/harness.mjs');
 let accepted=0,retries=0;
 for(const attach of [false,true]){
  const h=await createHarness();
  try{
   const userText='x'.repeat(identity.descriptionLimit),payload=reportBody({appVersion:identity.wireVersion,description:R.description('Singularity v1.0.0',userText),snapshot:attach?snapshot:null});
   const first=await h.request('/v1/reports',{method:'POST',body:payload});assert.equal(first.status,201,'unchanged Worker accepts exact boundary with attachment='+attach);const receipt=await first.json();accepted++;
   const row=h.db.sqlite.prepare('SELECT app_version,description,snapshot_json FROM reports').get();assert.equal(row.app_version,'v1.0');assert.equal(row.description,identity.prefix+userText);assert.equal(row.description.length,5000);
   if(attach)assert.equal(JSON.parse(row.snapshot_json).appVersion,'v1.0');else assert.equal(row.snapshot_json,null);
   // Lost response/retry reuses the immutable body and request ID; only the
   // one-use bot token is renewed. The real deduplication path must retain one row.
   const retry=await h.request('/v1/reports',{method:'POST',body:{...payload,turnstileToken:'valid-'+crypto.randomUUID()}});assert.equal(retry.status,201);assert.equal((await retry.json()).receipt,receipt.receipt);retries++;
   assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);
   const overflow=await h.request('/v1/reports',{method:'POST',body:reportBody({appVersion:'v1.0',description:identity.prefix+'x'.repeat(identity.descriptionLimit+1)})});assert.equal(overflow.status,400,'actual Worker still rejects >5000 characters');
   const directThreePart=await h.request('/v1/reports',{method:'POST',body:reportBody({appVersion:'v1.0.0',description:'Direct unsupported wire value'})});assert.equal(directThreePart.status,400,'backend grammar is unchanged, not bypassed');
   assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);
   assert.ok([401,403].includes((await h.request('/v1/admin/reports')).status),'anonymous administrator access remains denied');
   assert.equal(h.calls.github.length,0);assert.equal(h.calls.issues.length,0);
  }finally{h.close();}
 }
 console.log('PASS v1.0.0 feedback compatibility: strict full identity; unknown patches fail closed; immutable visible full-version header; 5000-character wire boundaries; '+accepted+' local SQLite reports with/without snapshots and '+retries+' idempotent retries; no production calls, Issues or automatic private-data storage.');
})().catch(error=>{console.error(error);process.exitCode=1;});
