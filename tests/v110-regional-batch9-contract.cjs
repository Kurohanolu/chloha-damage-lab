// Pre16 executes this unchanged historical proof against immutable published pre15.
if(require('../release.json').tag==='v1.1.0-pre.16'){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='66cae82e10d28ad6115acdacc964fd3e84f51b4a',tree='85c51a15b93f5da3bc81e0183ca1a3742a79966e',file='tests/v110-regional-batch9-contract.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre16-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre15 historical proof '+file+'; current pre16 delta is checked separately');process.exit(0);
}
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const baseline='fbec6fd45b841c3465be903b25a14e909cc80ba5';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=JSON.parse(cp.execFileSync('git',['show',baseline+':docs/data/v110-es-la-coverage.json'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const after=read('docs/data/v110-es-la-coverage.json'),m=read('docs/data/v110-es-la-regional-batch9.json');
assert.equal(m.records.length,3);assert.equal(new Set(m.records.map(r=>r.canonicalEnglish )).size,3);
for(const r of m.records){assert.equal(r.officialChampions,false);assert.equal(r.targetGame,'Pokémon Sword and Pokémon Shield');for(const b of r.canonicalMatches){assert.equal(before.entries[b.category][b.key].status,'unverified');assert.equal(after.entries[b.category][b.key].status,'official');assert.deepEqual(after.entries[b.category][b.key].canonicalIds,b.canonicalIds);}}
for(const [cat,entries] of Object.entries(before.entries))for(const [key,b]of Object.entries(entries)){const a=after.entries[cat][key];if(cat==='abilities'&&key==='パワースポット'){assert.equal(b.name,'Power Spot');assert.deepEqual(b.aliases,[]);assert.equal(a.name,'Fuente Energía');assert.deepEqual(a.aliases,['Fuente Energía','Power Spot']);assert.equal(a.status,'official');assert.deepEqual(a.sourceIds,['power-spot-swsh-stonjourner']);}else{assert.equal(a.name,b.name,cat+'/'+key+' display');assert.deepEqual(a.aliases,b.aliases,cat+'/'+key+' aliases');}assert.deepEqual(a.canonicalIds,b.canonicalIds);assert.equal(a.officialChampions,b.officialChampions);}
for(const p of ['index.html','i18n.js','battle-data-v0184.js','ability-data-v0184.js','feedback-config-v0185.js','services/feedback/src/worker.js'])assert.deepEqual(p==='index.html'?require('./helpers/v110-translation-successor.cjs').historicalHTML(fs.readFileSync(p)):fs.readFileSync(p),cp.execFileSync('git',['show',(p==='services/feedback/src/worker.js'?require('./helpers/v110-translation-successor.cjs').published:baseline)+':'+p],{maxBuffer:32*1024*1024}),p+' changed');
for(const r of m.records)assert.ok(!/Herbogénesis|Fitoimpulso/.test(r.esLA));
console.log('PASS batch9: three exact historical regional attestations; historical names/aliases protected except exact tested Power Spot successor; canonical identities, Champions status and protected files unchanged');
