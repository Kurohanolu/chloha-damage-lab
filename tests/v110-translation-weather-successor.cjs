'use strict';
// Current protection plus actual immutable pre19 proof. New evidence hashes are fixed candidate pins for independent review,
// not values learned from the candidate at runtime.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const {published,publishedTree,git,live,hash,expectedHTML}=require('./helpers/v110-translation-successor.cjs');
assert.equal(published,'016c5801bd63ed891c4c359d02748b3a66c26d0f');
assert.equal(git('rev-parse',published+'^{tree}').trim(),publishedTree);
const scope=p=>/^[^/]+\.(?:js|html|css)$/.test(p)||p.startsWith('data/')||p.startsWith('docs/data/')||p.startsWith('services/feedback/')||p.startsWith('tests/fixtures/');
const additions=['docs/data/v110-es-la-regional-batch14.json'];
// Fixed after bounded source integration; independent review must verify them. Never learned at runtime.
const pins={
 'feedback-release-v100.js':'30494e2fbc34639f3a18072b02fc97f7bf068b4528a531a21596c571699b6931',
 'damage-engine-v0184.js':'0e377f60330a1baf2821950c730aa6d9a21a5e8574a7bb0f35e45b2595a50f8b',
 'locale-es-la-data-v110.js':'b65dc7912aa4f26954099bec8c90bab385b4703ec700b5943fc299843a98fd15',
 'docs/data/v110-es-la-source-records.json':'e0a3cf58f59cf70c938dcacec0b2d79564b69fab6fcf0a07eaad39835c8c9d4d',
 'docs/data/v110-es-la-regional-batch14.json':'a6788b861a911076b6b67786364b7bdc6124a97b808b2fa38bfee4c113458b59'
};
const coveragePayloadSha256='55f22c7c01be63d402f968c17b91056a9abe8be5cfda7b416039abe88f934c1c';
const inventory=[...git('ls-tree','-r','--name-only',published).trim().split('\n').filter(scope),...additions].sort();
assert.deepEqual(git('ls-files','--cached','--others','--exclude-standard').trim().split('\n').filter(scope).sort(),inventory,'Only bounded owner batch14 evidence inventory may be added');
const uiFile='docs/data/v110-es-la-ui-inventory.json',coverageFile='docs/data/v110-es-la-coverage.json';
const ui=JSON.parse(live(uiFile));
for(const f of ['index.html','feedback-release-v100.js','docs/data/v110-es-la-source-records.json'])ui.sourceSha256[f]=hash(fs.readFileSync(f));
function check(file,bytes){
 if(file===uiFile){assert.deepEqual(JSON.parse(bytes),ui,'UI enumeration unchanged except exact source digests');return;}
 if(file===coverageFile){const coverage=JSON.parse(bytes);assert.deepEqual(coverage.uiInventory,{...ui,sha256:hash(fs.readFileSync(uiFile))});delete coverage.uiInventory;assert.equal(hash(JSON.stringify(coverage)),coveragePayloadSha256,'Exact reviewed coverage payload including all names, canonical IDs, statuses and counts');return;}
 if(Object.hasOwn(pins,file)){assert.equal(hash(bytes),pins[file],'Exact pinned regional batch14 bytes: '+file);return;}
 const expected=file==='index.html'?expectedHTML():file==='feedback-release-v100.js'?live(file).replace('8,9,11,12,14,15,16,17,18,19]','8,9,11,12,14,15,16,17,18,19,20]'):live(file);
 assert.equal(bytes.toString(),expected,'Published pre19 bytes remain exact: '+file);
}
for(const file of inventory)check(file,fs.readFileSync(file));
for(const file of ['index.html','feedback-release-v100.js',...Object.keys(pins),'locale-quality-v0188.js','ability-data-v0184.js','services/feedback/src/worker.js','feedback-ui-v0185.js','feedback-config-v0185.js'])assert.throws(()=>check(file,fs.readFileSync(file,'utf8')+'\n// tamper\n'));
const bad=JSON.parse(fs.readFileSync(coverageFile));bad.coverage.pokemon.official++;assert.throws(()=>check(coverageFile,JSON.stringify(bad)));
// Current contract validates canonical identity and exact limited record transformations.
for(const file of ['scripts/v110-es-la-coverage.cjs','scripts/v110-es-la-ui-inventory.cjs','tests/v110-weather-scope.cjs','tests/v110-feedback-weather-successor.cjs','tests/v110-pre14-ui-scope.cjs','tests/v110-pre14-weather-scope.cjs','tests/v110-count-moves-copy.cjs','tests/v110-count-moves-browser.cjs','tests/v110-count-moves-showdown.cjs','tests/v110-power-spot-browser.cjs','tests/v110-feedback-capability-browser.cjs','tests/v110-owner-batch4-browser.cjs','tests/v110-pokedex-batch5-successor-browser.cjs'])assert.equal(fs.readFileSync(file,'utf8'),file==='tests/v110-pre14-weather-scope.cjs'?live(file).replace("hash(old(file)),'Weather source","(file==='damage-engine-v0184.js'?'0e377f60330a1baf2821950c730aa6d9a21a5e8574a7bb0f35e45b2595a50f8b':hash(old(file))),'Weather source"):live(file),'Existing substantive test/generator preserved');
for(const file of ['tests/v110-regional-batch14-contract.cjs','tests/v110-pre14-weather-scope.cjs']){const result=spawnSync(process.execPath,[file],{stdio:'inherit',timeout:180000});assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Current precise delta and accepted weather guard: '+file);}
// Execute the complete previous strict guard from its pinned source, including its own
// nested pre14/pre12/pre11 proofs. Never treat these as current candidate acceptance.
const parent=fs.mkdtempSync(path.join(os.tmpdir(),'translation-pre19-history-')),worktree=path.join(parent,'source');let added=false;
try{git('worktree','add','--detach',worktree,published);added=true;const result=spawnSync(process.execPath,['tests/v110-translation-weather-successor.cjs'],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Immutable pre19 strict guard');assert.equal(require('node:child_process').execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');}
finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
console.log('PASS exact pre19 preservation plus pinned regional batch14; full current delta/weather checks and actual immutable pre19 proof');
