// Pre18 executes the complete original proof on immutable published pre17.
if(require('../release.json').tag==='v1.1.0-pre.18'){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='6360fa3a243c234993e032a415540b2c4691afeb',tree='bfb5619c528b396877f7c9e5a1f77aec664f106b',file='tests/v110-owner-batch4-contract.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre18-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre17 historical proof '+file+'; full current pre18 delta is checked separately');process.exit(0);
}
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const base='a68b987d25d392076f36413e7f626ea3b71391c2',git=p=>execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:32*1024*1024}),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=JSON.parse(git('docs/data/v110-es-la-coverage.json')),after=read('docs/data/v110-es-la-coverage.json'),m=read('docs/data/v110-es-la-owner-captures-batch4.json'),l=read('docs/data/v110-es-la-regional-batch12.json');
assert.equal(m.baselineCommit,base);assert.equal(m.sources.length,5);assert.equal(m.records.length,23);
const expected=[['moves','かみくだく','crunch','Triturar'],['moves','シャドーボール','shadowBall','Bola Sombra'],['moves','ヘドロばくだん','sludgeBomb','Bomba Lodo'],['moves','たきのぼり','waterfall','Cascada'],['moves','ゆきなだれ','gw0170_u054','Alud'],['moves','パワーウィップ','v096_097','Latigazo'],['natures','わんぱく','impish','Agitada']];
for(const [cat,key,id,name]of expected){const a=after.entries[cat][key];assert.equal(before.entries[cat][key].status,'unverified');assert.equal(a.name,name);assert.equal(a.status,'official');assert.equal(a.officialChampions,true);assert.deepEqual(a.canonicalIds,[id]);assert.ok(a.verificationScopes.includes('owner-provided-game-capture-name-only'));}
for(const s of m.sources){assert.equal(s.imagePublished,false);assert.equal(s.evidenceAccess,'private-owner-provided');assert.match(s.rawSha256,/^[a-f0-9]{64}$/);assert.equal(s.locale,'es-LA');assert.equal(s.targetGame,'Pokémon Champions');assert.equal(s.localeEvidence.languageSettingsScreenSupplied,false);assert.ok(s.byteLength>0);}
const oldSource=JSON.parse(git('docs/data/v110-es-la-source-records.json')),newSource=read('docs/data/v110-es-la-source-records.json');assert.deepEqual(newSource,{...oldSource,sources:[...oldSource.sources,...l.sources,...m.sources],records:[...oldSource.records,...l.records,...m.records]},'Only bounded source records added');
const touched=new Set([...l.records,...m.records].flatMap(r=>r.canonicalMatches.map(x=>x.category+'/'+x.key)));
let names=0;
for(const [cat,rows]of Object.entries(before.entries)){assert.deepEqual(Object.keys(after.entries[cat]),Object.keys(rows));for(const [key,b]of Object.entries(rows)){const a=after.entries[cat][key];assert.deepEqual(a.canonicalIds,b.canonicalIds);if(a.name!==b.name){assert.equal(cat+'/'+key,'natures/ひかえめ');assert.equal(b.name,'modesta');assert.equal(a.name,'Modesta');names++;}if(!touched.has(cat+'/'+key))assert.deepEqual(a,b,'Unrelated record unchanged '+cat+'/'+key);}}
assert.equal(names,1);const aggregate=x=>Object.fromEntries(['total','official','unverified','officialChampions','provisional'].map(f=>[f,['pokemon','moves','abilities','items','types','natures','stats'].reduce((s,c)=>s+x.coverage[c][f],0)]));
assert.deepEqual(aggregate(before),{total:1029,official:488,unverified:380,officialChampions:162,provisional:2});assert.deepEqual(aggregate(after),{total:1029,official:497,unverified:371,officialChampions:176,provisional:2});
for(const [cat,delta,champions]of [['pokemon',0,3],['moves',7,7],['abilities',1,2],['items',0,0],['types',0,1],['natures',1,1],['stats',0,0]]){assert.equal(after.coverage[cat].official,before.coverage[cat].official+delta);assert.equal(after.coverage[cat].officialChampions,before.coverage[cat].officialChampions+champions);assert.equal(after.coverage[cat].total,before.coverage[cat].total);}
for(const f of ['i18n.js','ability-data-v0184.js','damage-engine-v0184.js','battle-data-v0184.js','names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-quality-v0188.js','locale-ui-es-la-v110.js','persistence-v0188.js','feedback-ui-v0185.js','services/feedback/src/worker.js'])assert.equal(fs.readFileSync(f,'utf8'),git(f),'Protected runtime '+f);
const html=fs.readFileSync('index.html','utf8'),roster=h=>JSON.parse(h.match(/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s)[1]),moves=h=>JSON.parse(h.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]);assert.deepEqual(roster(html),roster(git('index.html')));assert.deepEqual(moves(html),moves(git('index.html')));assert.equal(moves(html).moves.some(m=>m.name==='ほろびのうた'),false);
const c=vm.createContext({});vm.runInContext('window=globalThis',c);for(const f of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f});
const index=c.ChlohaNameCatalogAdapter.build(c.ChlohaNames,c.ChlohaNameSearch,{});
for(const [cat,key,id,name]of expected.filter(x=>x[0]==='moves'))for(const q of [name,name.toLowerCase(),name.toUpperCase(),key])assert.ok(c.ChlohaNameSearch.search(index,cat,q).includes(key),'Existing native search: '+q);
console.log('PASS owner batch4+LAIC: 9 new official names,14 new Champions confirmations,one case correction,exact canonical inventory and protected runtime preserved');
