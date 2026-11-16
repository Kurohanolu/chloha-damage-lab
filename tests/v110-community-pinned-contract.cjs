'use strict';
// Pure offline contract; no production writes, network requests or deployments.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm'),crypto=require('node:crypto'),cp=require('node:child_process');
const {communityPolicy,loadCommunityBaseline,verifyCommunityFiles}=require('../scripts/helpers/community-pinned-baseline.cjs');
const {buildSites,assetReferences,legacyCommit}=require('../scripts/v0187-build-sites.cjs');
const {checkStableAssets}=require('../scripts/v100-live-acceptance.cjs');
const {acceptanceFiles}=require('../scripts/helpers/v100-live-acceptance.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const release=require('../release.json'),{manifest,files}=loadCommunityBaseline();
assert.equal(communityPolicy(release),true);assert.equal(files.size,44);assert.equal(verifyCommunityFiles(manifest,files).files,44);
assert.equal(communityPolicy({migration:{}}),false);
for(const bad of [null,false,true,{},'', 'community-pinned-v2','community-pinned-v1 '])assert.throws(()=>communityPolicy({migration:{...release.migration,legacyPolicy:bad}}));
assert.throws(()=>communityPolicy({migration:{...release.migration,legacyUrl:'https://example.com/'}}));
for(const mutate of [m=>m.delete('README.html'),m=>m.set('extra.js',Buffer.alloc(0)),m=>m.set('index.html',Buffer.from('changed')),m=>m.set('README.md',Buffer.from('changed')),m=>m.set('application-manifest.json',Buffer.from('{}'))]){const changed=new Map(files);mutate(changed);assert.throws(()=>verifyCommunityFiles(manifest,changed));}
for(const change of [{sourceCommit:'0'.repeat(40)},{sourceTree:'0'.repeat(40)},{auditCommit:'0'.repeat(40)},{applicationSHA256:'0'.repeat(64)},{files:{...manifest.files,'extra.js':'0'.repeat(64)}}])assert.throws(()=>verifyCommunityFiles({...manifest,...change},files));
// Historical unmarked acceptance remains the exact frozen calculator+notice.
const historical='a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9';
const old=acceptanceFiles(historical);assert.ok(old['chloha-damage-lab/legacy-notice-v0187.js']);assert.equal(old['chloha-damage-lab/community.js'],undefined);
(async()=>{
 const out=fs.mkdtempSync(path.join(os.tmpdir(),'community-contract-'));try{
  const built=buildSites(out).manifest;
  assert.equal(built.legacyCommit,manifest.sourceCommit);assert.equal(built.legacyProvenance.applicationSHA256,manifest.applicationSHA256);assert.equal(built.rollback.legacyCommit,legacyCommit,'Historical notice-free rollback stays frozen');
  const actual=Object.fromEntries(Object.entries(built.files).filter(([f])=>f.startsWith('chloha-damage-lab/')).map(([f,v])=>[f.slice('chloha-damage-lab/'.length),v]));assert.deepEqual(actual,manifest.files);
  for(const [file,body]of files)assert.deepEqual(fs.readFileSync(path.join(out,'chloha-damage-lab',file)),body);
  // Exercise acceptanceFiles with an explicit uncommitted release fixture, while
  // all other source bytes are read from an immutable real source SHA.
  const filename=path.resolve('scripts/helpers/v100-live-acceptance.cjs'),mod={exports:{}};
  const localRequire=require('node:module').createRequire(filename);
  const fixtureRequire=name=>name==='node:child_process'?{...cp,execFileSync:(cmd,args,options)=>cmd==='git'&&args[0]==='show'&&args[1]===historical+':release.json'?Buffer.from(JSON.stringify(release)):cp.execFileSync(cmd,args,options)}:localRequire(name);
  vm.runInNewContext('(function(require,module,exports){'+fs.readFileSync(filename,'utf8')+'\n})',{Buffer})(fixtureRequire,mod,mod.exports);
  const accepted=mod.exports.acceptanceFiles(historical);
  assert.deepEqual(Object.fromEntries(Object.entries(accepted).filter(([f])=>f.startsWith('chloha-damage-lab/'))),Object.fromEntries(Object.entries(manifest.files).map(([f,v])=>['chloha-damage-lab/'+f,v])));
  const requested=[];
  const fetchImpl=async(url,options)=>{assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');const u=new URL(url),site=u.pathname.startsWith('/singularity/')?'singularity':'chloha-damage-lab';assert.equal(u.origin,'https://kurohanolu.github.io');const rel=u.pathname.slice(('/'+site+'/').length)||'index.html';requested.push(url);const body=fs.readFileSync(path.join(out,site,rel));return {status:200,arrayBuffer:async()=>body};};
  const result=await checkStableAssets(out,built.files,{fetchImpl});assert.equal(result.status,'passed');
  for(const file of files.keys()){const url=new URL(file==='index.html'?'':file,manifest.publicUrl).href;assert.ok(requested.includes(url),'Bare URL verified '+file);assert.ok(requested.some(x=>x.startsWith(url+'?stable-check=')),'Fresh URL verified '+file);}
  for(const ref of assetReferences(files.get('index.html').toString()))assert.ok(requested.includes(new URL(ref,manifest.publicUrl).href),'Exact HTML cache URL verified '+ref);
  const manifestFile=path.join(out,'migration-artifacts.json'),originalManifest=fs.readFileSync(manifestFile);
  for(const change of [m=>delete m.files['chloha-damage-lab/README.html'],m=>m.files['chloha-damage-lab/extra.js']='0'.repeat(64),m=>m.files['chloha-damage-lab/README.md']='0'.repeat(64)]){
   const changed=structuredClone(built);change(changed);fs.writeFileSync(manifestFile,JSON.stringify(changed));await assert.rejects(()=>checkStableAssets(out,built.files,{fetchImpl}));
  }
  fs.writeFileSync(manifestFile,originalManifest);
  const exactCache=assetReferences(files.get('index.html').toString()).map(ref=>new URL(ref,manifest.publicUrl).href).find(url=>new URL(url).search);
  assert.ok(exactCache,'Pinned site must exercise an actual cache-bearing browser URL');
  await assert.rejects(()=>checkStableAssets(out,built.files,{fetchImpl:async(url,options)=>url===exactCache?{status:200,arrayBuffer:async()=>Buffer.from('stale exact-cache asset')}:fetchImpl(url,options)}));
  // Approval is independently tested by the release lifecycle; this isolated
  // transport fixture reaches the inventory/GET logic without inventing approval.
  const liveFilename=path.resolve('scripts/v0187-live-migration-check.cjs'),liveModule={exports:{}},liveRequire=require('node:module').createRequire(liveFilename);
  const transportRequire=name=>name==='./verify-publication-approval.cjs'?{verifyCutoverApproval:()=>{},verifyPublication:()=>{}}:liveRequire(name);
  vm.runInNewContext('(function(require,module,exports){'+fs.readFileSync(liveFilename,'utf8')+'\n})',{Buffer,URL,AbortSignal,process,Map})(transportRequire,liveModule,liveModule.exports);
  const transport=await liveModule.exports.checkLiveSites(out,{fetchImpl});assert.equal(transport.ready,true);assert.equal(transport.checkedSites.length,2);
  for(const change of [m=>delete m.files['chloha-damage-lab/README.html'],m=>m.files['chloha-damage-lab/extra.js']='0'.repeat(64),m=>m.files['chloha-damage-lab/README.md']='0'.repeat(64)]){
   const changed=structuredClone(built);change(changed);fs.writeFileSync(manifestFile,JSON.stringify(changed));await assert.rejects(()=>liveModule.exports.checkLiveSites(out,{fetchImpl}));
  }
  fs.writeFileSync(manifestFile,originalManifest);
  await assert.rejects(()=>liveModule.exports.checkLiveSites(out,{fetchImpl:async(url,options)=>url===exactCache?{status:200,arrayBuffer:async()=>Buffer.from('stale exact-cache asset')}:fetchImpl(url,options)}));
  await assert.rejects(()=>checkStableAssets(out,built.files,{fetchImpl:async(url,options)=>url===manifest.publicUrl?{status:200,arrayBuffer:async()=>Buffer.from('mutated live HTML')}:fetchImpl(url,options)}));
  console.log('PASS Community pinned policy: exact44 files/latest audit/application digest, full bare+fresh+HTML-cache URL checks; mutation/missing/extra/invalid policies rejected; historical acceptance/rollback preserved; zero network/deployments');
 }finally{fs.rmSync(out,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
