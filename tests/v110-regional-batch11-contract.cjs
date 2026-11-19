// Pre17 executes this unchanged historical proof against immutable published pre16.
if(['v1.1.0-pre.17','v1.1.0-pre.18','v1.1.0-pre.19','v1.1.0-pre.20'].includes(require('../release.json').tag)){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='a68b987d25d392076f36413e7f626ea3b71391c2',tree='c8292fafb8b927985d88ae7865ea8d755efdca76',file='tests/v110-regional-batch11-contract.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre17-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre16 historical proof '+file+'; current pre17 delta is checked separately');process.exit(0);
}
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process');
const base='66cae82e10d28ad6115acdacc964fd3e84f51b4a',git=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:32*1024*1024}),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const m=read('docs/data/v110-es-la-regional-batch11.json'),before=JSON.parse(git('docs/data/v110-es-la-coverage.json')),after=read('docs/data/v110-es-la-coverage.json');
const expected=[['りゅうのあぎと','dragonsMaw',"Dragon's Maw",'Mandíbula Dragón','regidrago','dragons-maw'],['かちき','unsupported:かちき','Competitive','Tenacidad','galarian-articuno','competitive'],['まけんき','unsupported:まけんき','Defiant','Competitivo','galarian-zapdos','defiant']];
assert.equal(m.baselineCommit,base);assert.equal(m.records.length,3);assert.equal(m.sources.length,3);
for(const [key,id,en,es,slug,rid] of expected){
 const r=m.records.find(x=>x.id==='batch11-swsh-'+rid),source=m.sources.find(x=>x.id==='batch11-swsh-'+slug);assert.ok(r&&source);
 assert.equal(r.category,'abilities');assert.equal(r.canonicalEnglish,en);assert.equal(r.esLA,es);assert.equal(r.rawObservedText,es);assert.equal(r.sourceEs,es);assert.equal(r.status,'official');assert.equal(r.officialChampions,false);assert.equal(r.targetGame,'Pokémon Sword and Pokémon Shield');assert.equal(r.verificationScope,'official-publication-not-physical-game-test');
 assert.deepEqual(r.canonicalMatches,[{category:'abilities',key,canonicalIds:[id]}]);assert.deepEqual(r.sourceIds,[source.id]);
 assert.equal(source.url,'https://swordshield.pokemon.com/es-mx/expansionpass/pokemon/'+slug+'/');assert.equal(source.englishIdentityUrl,source.url.replace('/es-mx/','/en-us/'));assert.equal(source.locale,'es-LA');assert.equal(source.websiteLocale,'es-MX');assert.equal(source.authority,'official');assert.equal(source.localeEvidence.regionControlObserved,true);assert.match(source.rawSha256,/^[a-f0-9]{64}$/);assert.match(source.englishRawSha256,/^[a-f0-9]{64}$/);
 const a=after.entries.abilities[key],b=before.entries.abilities[key];assert.equal(b.status,'unverified');assert.equal(a.name,es);assert.equal(a.status,'official');assert.equal(a.officialChampions,false);assert.deepEqual(a.canonicalIds,[id]);assert.deepEqual(a.sourceIds,[source.id]);assert.deepEqual(a.recordIds,[r.id]);assert.equal(a.fallback,false);
 if(id==='dragonsMaw'){assert.equal(b.name,"Dragon's Maw");assert.deepEqual(a.aliases,['Mandíbula Dragón',"Dragon's Maw"]);}else{assert.equal(a.name,b.name);assert.deepEqual(a.aliases,b.aliases);}
}
const oldSource=JSON.parse(git('docs/data/v110-es-la-source-records.json')),newSource=read('docs/data/v110-es-la-source-records.json');assert.deepEqual(newSource,{...oldSource,sources:[...oldSource.sources,...m.sources],records:[...oldSource.records,...m.records]},'Only three bounded source records added');
for(const [category,rows] of Object.entries(before.entries)){assert.deepEqual(Object.keys(after.entries[category]),Object.keys(rows));for(const [key,b]of Object.entries(rows)){const a=after.entries[category][key];assert.deepEqual(a.canonicalIds,b.canonicalIds);assert.equal(a.officialChampions,b.officialChampions);if(category!=='abilities'||!expected.some(x=>x[0]===key))assert.deepEqual(a,b,'Unchanged record '+category+'/'+key);}}
for(const category of Object.keys(before.coverage).filter(x=>!['ui','warnings'].includes(x))){const a=after.coverage[category],b=before.coverage[category];assert.equal(a.total,b.total);assert.equal(a.officialChampions,b.officialChampions);assert.equal(a.official,b.official+(category==='abilities'?3:0));assert.equal(a.unverified,b.unverified-(category==='abilities'?3:0));}
for(const file of ['i18n.js','ability-data-v0184.js','damage-engine-v0184.js','battle-data-v0184.js','names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-quality-v0188.js','locale-ui-es-la-v110.js','persistence-v0188.js','feedback-ui-v0185.js','services/feedback/src/worker.js'])assert.equal(fs.readFileSync(file,'utf8'),git(file),'Protected runtime '+file);
const html=fs.readFileSync('index.html','utf8'),oldHTML=git('index.html'),roster=h=>JSON.parse(h.match(/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s)[1]).pokemon;assert.deepEqual(roster(html),roster(oldHTML));assert.equal(roster(html).filter(p=>(p.abilities||[]).includes('りゅうのあぎと')).length,0,'No invented Dragon’s Maw roster association');
const c=vm.createContext({});vm.runInContext('window=globalThis',c);for(const f of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js','ability-data-v0184.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f});
assert.equal(c.ChlohaAbilityData.ABILITY_CATALOG.dragonsMaw.coverage,'supported');assert.equal(c.ChlohaNames.abilities['りゅうのあぎと'],undefined);
const index=c.ChlohaNameCatalogAdapter.build(c.ChlohaNames,c.ChlohaNameSearch,{});for(const query of ['Mandíbula Dragón','mandibula dragon','MANDÍBULA DRAGÓN',"Dragon's Maw",'りゅうのあぎと'])assert.equal(c.ChlohaNameSearch.search(index,'abilities',query).includes('りゅうのあぎと'),false,'No invented search membership');
for(const key of ['かちき','まけんき'])assert.equal(Object.values(c.ChlohaAbilityData.ABILITY_CATALOG).some(a=>a.ja===key),false,'Unsupported remains unsupported');
console.log('PASS batch11: exact 3 historical LATAM attestations, 1 latent dictionary change, 2 evidence-only records, all IDs/Champions flags/runtime membership preserved');
