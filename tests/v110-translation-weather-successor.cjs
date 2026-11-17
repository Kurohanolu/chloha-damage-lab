'use strict';
// Strict union of immutable published pre14 and independently reviewed translation data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const {published,publishedTree,ref,tree,git,old,live,hash,expectedHTML}=require('./helpers/v110-translation-successor.cjs');
assert.equal(git('rev-parse',published+'^{tree}').trim(),publishedTree);assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
const scope=p=>/^[^/]+\.(?:js|html)$/.test(p)||p.startsWith('data/')||p.startsWith('docs/data/')||p.startsWith('services/feedback/')||p.startsWith('tests/fixtures/');
const translation=new Set(['locale-es-la-data-v110.js','docs/data/v110-es-la-source-records.json','docs/data/v110-es-la-power-spot.json',...[7,8,9,10].map(n=>'docs/data/v110-es-la-regional-batch'+n+'.json')]);
const inventory=[...new Set([...git('ls-tree','-r','--name-only',published).trim().split('\n').filter(scope),...translation])].sort();
assert.deepEqual(git('ls-files','--cached','--others','--exclude-standard').trim().split('\n').filter(scope).sort(),inventory,'Only reviewed translation evidence inventory may be added');
const uiFile='docs/data/v110-es-la-ui-inventory.json',coverageFile='docs/data/v110-es-la-coverage.json';
const ui=JSON.parse(old(uiFile));for(const f of ['index.html','feedback-release-v100.js','locale-quality-v0188.js','docs/data/v110-es-la-source-records.json'])ui.sourceSha256[f]=hash(fs.readFileSync(f));
const coverage=JSON.parse(old(coverageFile));coverage.uiInventory={...ui,sha256:hash(fs.readFileSync(uiFile))};
function check(file,bytes){
 if(file===uiFile){assert.deepEqual(JSON.parse(bytes),ui);return;}
 if(file===coverageFile){assert.deepEqual(JSON.parse(bytes),coverage);return;}
 const expected=file==='index.html'?expectedHTML():file==='feedback-release-v100.js'?live(file).replace('8,9,11,12,14]','8,9,11,12,14,15]'):translation.has(file)?old(file):live(file);
 assert.equal(bytes.toString(),expected,'Exact published pre14 preservation or reviewed translation: '+file);
}
for(const file of inventory)check(file,fs.readFileSync(file));
for(const file of ['index.html','feedback-release-v100.js','locale-es-la-data-v110.js','locale-quality-v0188.js','ability-data-v0184.js','services/feedback/src/worker.js','feedback-ui-v0185.js','feedback-config-v0185.js'])assert.throws(()=>check(file,fs.readFileSync(file,'utf8')+'\n// tamper\n'));
const bad=structuredClone(coverage);bad.coverage.pokemon.official++;assert.throws(()=>check(coverageFile,JSON.stringify(bad)));
// Both original guards remain byte-identical; execute on immutable publication snapshots.
for(const file of ['tests/v110-weather-scope.cjs','tests/v110-feedback-weather-successor.cjs','tests/v110-pre14-ui-scope.cjs','tests/v110-pre14-weather-scope.cjs','tests/v110-count-moves-copy.cjs','tests/v110-count-moves-browser.cjs','tests/v110-count-moves-showdown.cjs'])assert.equal(fs.readFileSync(file,'utf8'),live(file),'Historical guard is immutable');
const parent=fs.mkdtempSync(path.join(os.tmpdir(),'translation-pre14-history-')),worktree=path.join(parent,'source');
try{git('worktree','add','--detach',worktree,published);for(const historical of ['tests/v110-feedback-weather-successor.cjs','tests/v110-pre14-ui-scope.cjs','tests/v110-pre14-weather-scope.cjs']){const result=spawnSync(process.execPath,[historical],{cwd:worktree,stdio:'inherit',timeout:120000});assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Immutable pre14 guard: '+historical);}assert.equal(require('node:child_process').execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');}
finally{try{git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
const current=spawnSync(process.execPath,['tests/v110-pre14-weather-scope.cjs'],{stdio:'inherit',timeout:120000});assert.equal(current.error,undefined);assert.equal(current.signal,null);assert.equal(current.status,0,'Current accepted weather arithmetic guard');
console.log('PASS exact pre14 count/feedback/weather preservation plus audited translation; historical feedback/weather guards unchanged and executed');
