// Pre20 preserves the entire historical proof on immutable published pre19.
if(['v1.1.0-pre.20','v1.1.0'].includes(require('../release.json').tag)){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='016c5801bd63ed891c4c359d02748b3a66c26d0f',tree='cb30edc6da5ba49b15532ecc7998621996ed7572',file='tests/v110-regional-batch12-evidence.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre20-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre19 historical proof '+file+'; pre20 delta checked separately');process.exit(0);
}
// Pre19 preserves the entire historical proof on immutable published pre18.
if(require('../release.json').tag==='v1.1.0-pre.19'){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='c52a65f4487fa8b4ceb2cd1ac5d85a2334697854',tree='beacee500cd7cd651bd312645d31417f1b47940f',file='tests/v110-regional-batch12-evidence.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre19-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre18 historical proof '+file+'; pre19 delta checked separately');process.exit(0);
}
// Pre18 executes the complete original proof on immutable published pre17.
if(require('../release.json').tag==='v1.1.0-pre.18'){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='6360fa3a243c234993e032a415540b2c4691afeb',tree='bfb5619c528b396877f7c9e5a1f77aec664f106b',file='tests/v110-regional-batch12-evidence.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre18-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre17 historical proof '+file+'; full current pre18 delta is checked separately');process.exit(0);
}
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const m=read('docs/data/v110-es-la-regional-batch12.json'),c=JSON.parse(execFileSync('git',['show','a68b987d25d392076f36413e7f626ea3b71391c2:docs/data/v110-es-la-coverage.json'],{encoding:'utf8',maxBuffer:32*1024*1024}));
assert.equal(m.baselineCommit,'a68b987d25d392076f36413e7f626ea3b71391c2');
assert.equal(m.status,'integrated-candidate-not-released');
assert.equal(m.sources.length,1);assert.equal(m.records.length,5);
const s=m.sources[0];
assert.equal(s.url,'https://championships.pokemon.com/es-la/events/internationals/2027/sao-paulo');
assert.equal(s.englishIdentityUrl,s.url.replace('/es-la/','/en-us/'));
assert.equal(s.websiteLocale,'es-la');assert.equal(s.targetGame,'Pokémon Champions');
for(const k of ['rawSha256','englishRawSha256'])assert.match(s[k],/^[a-f0-9]{64}$/);
const expected=[['abilities','フェアリースキン','pixilate','Pixilate','Piel Feérica'],['moves','でんこうせっか','gw0169_p070','Quick Attack','Ataque Rápido'],['pokemon','gw092_28','gw092_28','Sylveon','Sylveon'],['natures','ひかえめ','modest','Modest','Modesta'],['moves','ハイパーボイス','hyperVoice','Hyper Voice','Hipervoz']];
let promotions=0,champions=0;
for(const [cat,key,id,en,es] of expected){
 const r=m.records.find(x=>x.canonicalEnglish===en),b=c.entries[cat][key];
 assert.equal(r.category,cat);assert.equal(r.esLA,es);assert.equal(r.rawObservedText,es);assert.equal(r.status,'official');assert.equal(r.officialChampions,true);
 assert.equal(r.targetGame,'Pokémon Champions');assert.deepEqual(r.sourceIds,[s.id]);assert.deepEqual(r.canonicalMatches,[{category:cat,key,canonicalIds:[id]}]);
 assert.equal(b.en,en);assert.deepEqual(b.canonicalIds,[id]);assert.equal(b.name.toLocaleLowerCase('es-419'),es.toLocaleLowerCase('es-419'),'No new spelling claimed');
 assert.equal(b.status,r.baseline.status);assert.equal(b.officialChampions,r.baseline.officialChampions);
 if(b.status!=='official')promotions++;if(!b.officialChampions)champions++;
}
assert.equal(promotions,2);assert.equal(champions,3);
for(const x of m.excluded)assert.equal(Object.values(c.entries.moves).some(r=>r.en===x.english),false);
const html=fs.readFileSync('index.html','utf8'),roster=JSON.parse(html.match(/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s)[1]).pokemon,moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
assert.ok(roster.some(p=>p.id==='gw092_28'&&(p.abilities||[]).includes('フェアリースキン')),'Pixilate has a real roster association');
assert.ok(moves.some(m=>m.id==='gw0169_p070'&&m.name==='でんこうせっか'),'Quick Attack exists in native move inventory');
console.log('PASS batch12 evidence: 5 canonical bindings, 2 proposed official upgrades, 3 proposed Champions upgrades, no spelling or runtime changes; not release acceptance');
