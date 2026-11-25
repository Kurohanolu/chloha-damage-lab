// Pre20 preserves the entire historical proof on immutable published pre19.
if(['v1.1.0-pre.20','v1.1.0'].includes(require('../release.json').tag)){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='016c5801bd63ed891c4c359d02748b3a66c26d0f',tree='cb30edc6da5ba49b15532ecc7998621996ed7572',file='tests/v110-regional-batch13-contract.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre20-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre19 historical proof '+file+'; pre20 delta checked separately');process.exit(0);
}
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const baseline='c52a65f4487fa8b4ceb2cd1ac5d85a2334697854';
const old=p=>cp.execFileSync('git',['show',baseline+':'+p],{maxBuffer:32*1024*1024});
const before=JSON.parse(old('docs/data/v110-es-la-coverage.json')),after=JSON.parse(fs.readFileSync('docs/data/v110-es-la-coverage.json'));
const m=JSON.parse(fs.readFileSync('docs/data/v110-es-la-regional-batch13.json'));
const selected=['マイペース','リーフガード'];
assert.equal(m.records.length,2);assert.equal(m.sources.length,2);
for(const r of m.records){assert.equal(r.officialChampions,false);assert.equal(r.targetGame,'Pokémon Sword and Pokémon Shield');assert.equal(r.verificationScope,'official-publication-not-physical-game-test');const k=r.canonicalMatches[0].key;assert.ok(selected.includes(k));assert.deepEqual(r.canonicalMatches[0].canonicalIds,['unsupported:'+k]);assert.equal(after.entries.abilities[k].status,'official');assert.equal(before.entries.abilities[k].status,'unverified');}
for(const [cat,entries] of Object.entries(before.entries))for(const [k,b]of Object.entries(entries)){const a=after.entries[cat][k];assert.equal(a.name,b.name);assert.deepEqual(a.aliases,b.aliases);assert.deepEqual(a.canonicalIds,b.canonicalIds);assert.equal(a.officialChampions,b.officialChampions);if(cat!=='abilities'||!selected.includes(k))assert.deepEqual(a,b,cat+'/'+k);}
const totals=j=>Object.entries(j.entries).filter(([c])=>c!=='forms').flatMap(([,e])=>Object.values(e));const es=totals(after);assert.equal(es.length,1029);assert.equal(es.filter(e=>e.status==='official').length,518);assert.equal(es.filter(e=>e.status==='unverified').length,355);assert.equal(es.filter(e=>e.officialChampions).length,195);
for(const p of ['i18n.js','battle-data-v0184.js','ability-data-v0184.js','feedback-config-v0185.js','services/feedback/src/worker.js'])assert.deepEqual(fs.readFileSync(p),old(p));
assert.equal(fs.readFileSync('index.html','utf8'),require('./helpers/v110-translation-successor.cjs').expectedHTML(),'Only exact predecessor version/cache bytes may change');
assert.equal(after.entries.abilities['せいしんりょく'].name,'Fuerza Mental');assert.equal(after.entries.abilities['せいしんりょく'].status,'unverified');
console.log('PASS batch13: two historical publication attestations; display, aliases, canonical IDs, support, Champions status, other entries and protected files unchanged; exact counts 518/1029, 355 unverified, 195 Champions');
