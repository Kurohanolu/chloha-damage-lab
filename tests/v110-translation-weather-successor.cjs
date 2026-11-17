'use strict';
// Current translation scope is exact, while the original weather scope executes
// unmodified on its immutable published tree. Neither is a release approval.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const {ref,tree,git,old,hash,expectedHTML}=require('./helpers/v110-translation-successor.cjs');
const published='fbec6fd45b841c3465be903b25a14e909cc80ba5',publishedTree='a38f294cddaf10c15e8cea147e57a7b6d6148142',historical='tests/v110-weather-scope.cjs';
assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);assert.equal(git('rev-parse',published+'^{tree}').trim(),publishedTree);
assert.equal(fs.readFileSync(historical,'utf8'),git('show',published+':'+historical));
const scope=p=>/^[^/]+\.(?:js|html)$/.test(p)||p.startsWith('data/')||p.startsWith('docs/data/')||p.startsWith('services/feedback/')||p.startsWith('tests/fixtures/');
const inventory=git('ls-tree','-r','--name-only',ref).trim().split('\n').filter(scope).sort();
assert.deepEqual(git('ls-files').trim().split('\n').filter(scope).sort(),inventory,'No runtime/data/feedback/fixture membership changes');
const uiFile='docs/data/v110-es-la-ui-inventory.json',coverageFile='docs/data/v110-es-la-coverage.json';
const ui=JSON.parse(old(uiFile).replaceAll('Power Spot de un aliado (daño ×1,3)','Fuente Energía de un aliado (daño ×1,3)').replaceAll('La condición de Power Spot no es válida','La condición de Fuente Energía no es válida'));
// Authored source text remains the same; only bound rendered terminology changes.
for(const record of ui.records||[])if(record.text==='Fuente Energía de un aliado (daño ×1,3)'&&record.renderedText)record.text='Power Spot de un aliado (daño ×1,3)';
ui.sourceSha256['docs/data/v110-es-la-source-records.json']=hash(fs.readFileSync('docs/data/v110-es-la-source-records.json')); for(const f of ['index.html','feedback-release-v100.js'])ui.sourceSha256[f]=hash(fs.readFileSync(f));
const coverage=JSON.parse(old(coverageFile));coverage.uiInventory={...ui,sha256:hash(fs.readFileSync(uiFile))};
function check(file,bytes){
 if(file===uiFile){assert.deepEqual(JSON.parse(bytes),ui);return;}
 if(file===coverageFile){assert.deepEqual(JSON.parse(bytes),coverage);return;}
 const expected=file==='index.html'?expectedHTML():file==='feedback-release-v100.js'?old(file).replace('8,9,11]','8,9,11,13]'):old(file);
 assert.equal(bytes.toString(),expected,'Exact audited translation content or explicit identity-only change: '+file);
}
for(const file of inventory)check(file,fs.readFileSync(file));
// Every protected mechanics, old-language and backend file remains pre.11 exact.
for(const file of inventory.filter(p=>/^(?:ability-data|battle-data|damage-|move-mechanics-data|multi-hit|variable-power|pokemon-weights|weight-power|names-|i18n\.js|locale-(?!es-la-data)|services\/feedback\/|tests\/fixtures\/|feedback-(?!release)|persistence-)/.test(p)))assert.equal(fs.readFileSync(file,'utf8'),git('show',published+':'+file),'Published mechanics/other locales/feedback unchanged: '+file);
for(const file of ['index.html','feedback-release-v100.js','locale-es-la-data-v110.js','ability-data-v0184.js','services/feedback/src/worker.js'])assert.throws(()=>check(file,fs.readFileSync(file,'utf8')+'\n// tamper\n'));
const bad=structuredClone(coverage);bad.coverage.pokemon.official++;assert.throws(()=>check(coverageFile,JSON.stringify(bad)));
const parent=fs.mkdtempSync(path.join(os.tmpdir(),'translation-weather-history-')),worktree=path.join(parent,'source');
try{git('worktree','add','--detach',worktree,published);const result=spawnSync(process.execPath,[historical],{cwd:worktree,stdio:'inherit'});assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0);assert.equal(require('node:child_process').execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');}
finally{try{git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
console.log('PASS exact translation successor, published mechanics/backend preservation and unmodified historical weather scope');
