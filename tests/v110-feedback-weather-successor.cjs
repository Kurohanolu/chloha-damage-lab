'use strict';
// Current successor guard against published pre.11, preserving historical scope.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync,spawnSync}=require('node:child_process');
const ref='fbec6fd45b841c3465be903b25a14e909cc80ba5',tree='a38f294cddaf10c15e8cea147e57a7b6d6148142';
const reviewed='6d59ffaad3b23a95714e8eaafae047fbdb55673b';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
const read=p=>fs.readFileSync(p,'utf8'),old=p=>git('show',ref+':'+p);
assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
const historical='tests/v110-weather-scope.cjs';
assert.equal(read(historical),old(historical),'Original weather protection remains entirely unmodified');
const scope=p=>/^[^/]+\.(?:js|html)$/.test(p)||p.startsWith('data/')||p.startsWith('docs/data/')||(p.startsWith('services/feedback/')&&!p.startsWith('services/feedback/test/'))||p.startsWith('tests/fixtures/');
const baseline=git('ls-tree','-r','--name-only',ref).trim().split('\n').filter(scope).sort();
assert.deepEqual(git('ls-files').trim().split('\n').filter(scope).sort(),baseline,'Runtime/data/service inventory unchanged');
const exceptions=new Set(['feedback-ui-v0185.js','services/feedback/src/worker.js']);
const hash=b=>require('node:crypto').createHash('sha256').update(b).digest('hex');
const versionedHTML=old('index.html').replaceAll('1.1.0-pre.11','1.1.0-pre.12').replaceAll('Pre-Release 11','Pre-Release 12').replace(/((?:src|href)="\.\/([^"?]+)\?v=1\.1\.0-pre\.12)(?:&h=[a-f0-9]+)?/g,(_,prefix,file)=>prefix+(/\.(?:js|css)$/.test(file)?'&h='+hash(fs.readFileSync(file)).slice(0,16):''));
const inventoryFile='docs/data/v110-es-la-ui-inventory.json',coverageFile='docs/data/v110-es-la-coverage.json';
const inventory=JSON.parse(old(inventoryFile));for(const f of ['index.html','feedback-release-v100.js'])inventory.sourceSha256[f]=hash(fs.readFileSync(f));
const coverage=JSON.parse(old(coverageFile));coverage.uiInventory={...inventory,sha256:hash(fs.readFileSync(inventoryFile))};
function check(file,bytes){
 if(file===inventoryFile){assert.deepEqual(JSON.parse(bytes),inventory);return;}
 if(file===coverageFile){assert.deepEqual(JSON.parse(bytes),coverage);return;}
 const expected=file==='index.html'?versionedHTML:file==='feedback-release-v100.js'?old(file).replace('8,9,11]','8,9,11,12]'):exceptions.has(file)?git('show',reviewed+':'+file):old(file);
 assert.equal(bytes,expected,'Exact reviewed capability delta or preserved weather source: '+file);}
for(const file of baseline)check(file,read(file));
for(const file of ['index.html','feedback-release-v100.js','feedback-ui-v0185.js','services/feedback/src/worker.js','feedback-contract-v0185.js','ability-data-v0184.js','feedback-config-v0185.js'])assert.throws(()=>check(file,read(file)+'\n// mutated\n'),'Reject unreviewed change '+file);
const invalidInventory=structuredClone(inventory);invalidInventory.sourceSha256['index.html']='0'.repeat(64);assert.throws(()=>check(inventoryFile,JSON.stringify(invalidInventory)));
const invalidCoverage=structuredClone(coverage);invalidCoverage.coverage.pokemon.official++;assert.throws(()=>check(coverageFile,JSON.stringify(invalidCoverage)));
const parent=fs.mkdtempSync(path.join(os.tmpdir(),'weather-history-')),worktree=path.join(parent,'source');
try{
 git('worktree','add','--detach',worktree,ref);
 const result=spawnSync(process.execPath,[historical],{cwd:worktree,stdio:'inherit'});
 assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Unmodified weather scope must pass on pinned historical source');
 assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');
}finally{try{git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
console.log('PASS feedback successor: pinned merged weather history plus exact current protections; not release approval');
