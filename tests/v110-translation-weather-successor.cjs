'use strict';
// Current protection plus actual immutable pre17 proof. New evidence hashes are fixed candidate pins for independent review,
// not values learned from the candidate at runtime.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const {published,publishedTree,git,live,hash,expectedHTML}=require('./helpers/v110-translation-successor.cjs');
assert.equal(published,'6360fa3a243c234993e032a415540b2c4691afeb');
assert.equal(git('rev-parse',published+'^{tree}').trim(),publishedTree);
const scope=p=>/^[^/]+\.(?:js|html|css)$/.test(p)||p.startsWith('data/')||p.startsWith('docs/data/')||p.startsWith('services/feedback/')||p.startsWith('tests/fixtures/');
const additions=['docs/data/v110-es-la-owner-captures-batch5.json'];
// Fixed after bounded source integration; independent review must verify them. Never learned at runtime.
const pins={
 'locale-es-la-data-v110.js':'98a0dcab9c41bcc6c719e4c9b6a6bdc58fe278861bde6962857d8f47027611b8',
 'docs/data/v110-es-la-source-records.json':'980c880cfa9db4072feea04dab34878c8accb1ab73e89b21f413cfaeb9b91ba0',
 'docs/data/v110-es-la-owner-captures-batch5.json':'a951863f73a3232f55dec86aaeede41a3c16847e19495f82a88fedd218c27798'
};
const coveragePayloadSha256='8e4b8e4bbf6f0ffdb5e808db3027bd0d2a9c62ed9562ada4303173a3acb938ab';
const inventory=[...git('ls-tree','-r','--name-only',published).trim().split('\n').filter(scope),...additions].sort();
assert.deepEqual(git('ls-files','--cached','--others','--exclude-standard').trim().split('\n').filter(scope).sort(),inventory,'Only bounded owner batch5 evidence inventory may be added');
const uiFile='docs/data/v110-es-la-ui-inventory.json',coverageFile='docs/data/v110-es-la-coverage.json';
const ui=JSON.parse(live(uiFile));
for(const f of ['index.html','feedback-release-v100.js','docs/data/v110-es-la-source-records.json'])ui.sourceSha256[f]=hash(fs.readFileSync(f));
function check(file,bytes){
 if(file===uiFile){assert.deepEqual(JSON.parse(bytes),ui,'UI enumeration unchanged except exact source digests');return;}
 if(file===coverageFile){const coverage=JSON.parse(bytes);assert.deepEqual(coverage.uiInventory,{...ui,sha256:hash(fs.readFileSync(uiFile))});delete coverage.uiInventory;assert.equal(hash(JSON.stringify(coverage)),coveragePayloadSha256,'Exact reviewed coverage payload including all names, canonical IDs, statuses and counts');return;}
 if(Object.hasOwn(pins,file)){assert.equal(hash(bytes),pins[file],'Exact pinned owner batch5 bytes: '+file);return;}
 const expected=file==='index.html'?expectedHTML():file==='feedback-release-v100.js'?live(file).replace('8,9,11,12,14,15,16,17]','8,9,11,12,14,15,16,17,18]'):live(file);
 assert.equal(bytes.toString(),expected,'Published pre17 bytes remain exact: '+file);
}
for(const file of inventory)check(file,fs.readFileSync(file));
for(const file of ['index.html','feedback-release-v100.js',...Object.keys(pins),'locale-quality-v0188.js','ability-data-v0184.js','services/feedback/src/worker.js','feedback-ui-v0185.js','feedback-config-v0185.js'])assert.throws(()=>check(file,fs.readFileSync(file,'utf8')+'\n// tamper\n'));
const bad=JSON.parse(fs.readFileSync(coverageFile));bad.coverage.pokemon.official++;assert.throws(()=>check(coverageFile,JSON.stringify(bad)));
// Current contract validates canonical identity and exact limited record transformations.
for(const file of ['scripts/v110-es-la-coverage.cjs','scripts/v110-es-la-ui-inventory.cjs','tests/v110-weather-scope.cjs','tests/v110-feedback-weather-successor.cjs','tests/v110-pre14-ui-scope.cjs','tests/v110-pre14-weather-scope.cjs','tests/v110-count-moves-copy.cjs','tests/v110-count-moves-browser.cjs','tests/v110-count-moves-showdown.cjs','tests/v110-power-spot-browser.cjs','tests/v110-feedback-capability-browser.cjs','tests/v110-owner-batch4-browser.cjs','tests/v110-pokedex-batch5-successor-browser.cjs'])assert.equal(fs.readFileSync(file,'utf8'),live(file),'Existing substantive test/generator preserved');
for(const file of ['tests/v110-owner-batch5-contract.cjs','tests/v110-pre14-weather-scope.cjs']){const result=spawnSync(process.execPath,[file],{stdio:'inherit',timeout:180000});assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Current precise delta and accepted weather guard: '+file);}
// Execute the complete previous strict guard from its pinned source, including its own
// nested pre14/pre12/pre11 proofs. Never treat these as current candidate acceptance.
const parent=fs.mkdtempSync(path.join(os.tmpdir(),'translation-pre17-history-')),worktree=path.join(parent,'source');let added=false;
try{git('worktree','add','--detach',worktree,published);added=true;const result=spawnSync(process.execPath,['tests/v110-translation-weather-successor.cjs'],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Immutable pre17 strict guard');assert.equal(require('node:child_process').execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');}
finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
console.log('PASS exact pre17 preservation plus pinned owner batch5; full current delta/weather checks and actual immutable pre17 proof');
