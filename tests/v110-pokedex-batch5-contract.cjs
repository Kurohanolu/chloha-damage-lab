'use strict';
// Preserve the exact published pre.8 Pokédex batch5 contract test in its immutable source tree.
// It verifies real approved bytes there; current pre.9 evidence must pass its separate current-batch contract.
if(require('../release.json').tag!=='v1.1.0-pre.8'){
 const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='0b1f8fffea3b1d063036d00fd712b0a0e9695111',tree='701fbae7b142ba2ac5e5e23f1755a84f39d82b6c';
 assert.equal(execFileSync('git',['rev-parse',ref+'^{tree}'],{encoding:'utf8'}).trim(),tree);
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre8-history-')),worktree=path.join(parent,'source');
 let status=1;
 try{
  execFileSync('git',['worktree','add','--detach',worktree,ref],{stdio:'pipe'});
  const result=spawnSync(process.execPath,['tests/v110-pokedex-batch5-contract.cjs'],{cwd:worktree,stdio:'inherit'});
  assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Unmodified published pre.8 Pokédex batch5 contract must pass');
  assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');
  fs.mkdirSync('reports/v110',{recursive:true});
  const report=JSON.parse(fs.readFileSync(path.join(worktree,'reports/v110/pokedex-batch5-contract.json'),'utf8'));
  fs.writeFileSync('reports/v110/pokedex-batch5-contract.json',JSON.stringify({...report,role:'historical immutable pre.8, not current candidate acceptance',sourceCommit:ref,sourceTree:tree},null,2)+'\n');
  status=0;
 }finally{
  try{execFileSync('git',['worktree','remove','--force',worktree],{stdio:'pipe'});}finally{fs.rmSync(parent,{recursive:true,force:true});}
 }
 process.exit(status);
}
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const baseline='66a085ba325655bc9369656ea0645f7f6f997127',tree='531c22a3fd647f674a287808a7a63b74010ccb58',read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',baseline+':'+f],{encoding:'utf8',maxBuffer:32*1024*1024}),json=f=>JSON.parse(read(f));
assert.equal(execFileSync('git',['rev-parse',baseline+'^{tree}'],{encoding:'utf8'}).trim(),tree);
const M=json('docs/data/v110-es-la-official-pokedex-batch5.json'),S=json('docs/data/v110-es-la-source-records.json'),BS=JSON.parse(old('docs/data/v110-es-la-source-records.json')),C=json('docs/data/v110-es-la-coverage.json'),B=JSON.parse(old('docs/data/v110-es-la-coverage.json'));
assert.equal(M.baselineCommit,baseline);assert.equal(M.baselineTree,tree);assert.equal(M.records.length,225);assert.equal(new Set(M.records.map(o=>o.key)).size,225);assert.equal(M.sources.length,2);assert.equal(S.sources.length,BS.sources.length+2);assert.equal(S.records.length,BS.records.length+226);
for(const group of ['sources','records'])for(const r of BS[group])assert.deepEqual(S[group].find(x=>x.id===r.id),r,'All prior provenance preserved '+r.id);
for(const source of M.sources)assert.deepEqual(S.sources.find(s=>s.id===source.id),source);
const source=M.sources.find(s=>s.id==='pre8-official-latam-pokedex');assert.equal(source.url,'https://www.pokemon.com/el/pokedex');assert.equal(source.authority,'official');assert.equal(source.locale,'es-LA');assert.equal(source.targetGame,'Generic Pokémon franchise');assert.equal(source.localeEvidence.sourceSpecificFooterObserved,false);
const changed=new Set(M.records.map(o=>o.key));
for(const o of M.records){
 const r=S.records.find(r=>r.id===o.recordId),before=B.entries.pokemon[o.key],after=C.entries.pokemon[o.key];
 assert.equal(o.recordId,'pre8-pokedex-'+o.key);assert.equal(o.category,'pokemon');assert.equal(o.sourceURL,source.url);assert.equal(o.officialChampions,false);assert.equal(o.statusAtAudit,'unverified');assert.equal(o.proposedStatus,'official');assert.equal(o.targetGame,'Generic Pokémon franchise');
 assert.equal(o.rawObservedText,o.esLA);assert.equal(o.observedSourceLine,o.nationalDexNumber+' - '+o.esLA);assert.ok(Number.isInteger(o.nationalDexNumber)&&o.nationalDexNumber>0&&o.nationalDexNumber<=1025);assert.equal(o.canonicalEnglish,o.esLA,'Whole species identity only; no translated form suffix inference');assert.equal(o.canonicalEnglish,before.en);assert.equal(o.ja,before.ja);assert.equal(before.status,'unverified');assert.deepEqual(o.canonicalIds,before.canonicalIds);assert.ok(o.sourceRetrievals.length>0);
 for(const retrieval of o.sourceRetrievals){assert.match(retrieval.sha256,/^[a-f0-9]{64}$/);assert.ok(o.sourceEvidenceFiles.includes(retrieval.file));assert.equal(M.rawRetrievalHashes[retrieval.file],retrieval.sha256);}
 assert.equal(r.category,'pokemon');assert.equal(r.esLA,o.esLA);assert.equal(r.rawObservedText,o.esLA);assert.equal(r.canonicalEnglish,o.canonicalEnglish);assert.equal(r.nationalDexNumber,o.nationalDexNumber);assert.equal(r.displayNormalization,'none');assert.equal(r.status,'official');assert.equal(r.officialChampions,false);assert.equal(r.targetGame,'Generic Pokémon franchise');assert.deepEqual(r.sourceIds,[source.id]);assert.deepEqual(r.canonicalMatches,[{category:'pokemon',key:o.key,canonicalIds:o.canonicalIds}]);assert.equal(after.status,'official');assert.equal(after.officialChampions,false);assert.ok(after.relatedRecordIds.includes(r.id));
}
const za=S.records.find(r=>r.id==='pre8-za-canari-eelektross');assert.equal(za.esLA,'Eelektross');assert.equal(za.rawObservedText,'Eelektross');assert.equal(za.status,'official');assert.equal(za.targetGame,'Pokémon LEGENDS Z-A');assert.equal(za.officialChampions,false);assert.deepEqual(za.sourceIds,['pre8-za-canari']);assert.deepEqual(za.canonicalMatches,[{category:'pokemon',key:'roster_v0105_026',canonicalIds:['roster_v0105_026']}]);assert.ok(C.entries.pokemon.roster_v0105_026.relatedRecordIds.includes(za.id));
let gains=0;for(const [category,rows] of Object.entries(B.entries)){assert.deepEqual(Object.keys(C.entries[category]),Object.keys(rows),'No catalog additions');for(const [key,before] of Object.entries(rows)){const after=C.entries[category][key];for(const field of ['name','aliases','canonicalIds','ja','en','es'])assert.deepEqual(after[field],before[field],'No display/alias/identity changes '+category+'/'+key+'/'+field);if(category==='pokemon'&&changed.has(key)){assert.equal(before.status,'unverified');assert.equal(after.status,'official');gains++;assert.ok(before.relatedRecordIds.every(id=>after.relatedRecordIds.includes(id)));}else assert.deepEqual(after,before,'All unrelated entries including forms unchanged '+category+'/'+key);}}assert.equal(gains,225);
const aggregate=x=>Object.fromEntries(['total','official','unverified','officialChampions','provisional'].map(f=>[f,['pokemon','moves','abilities','items','types','natures','stats'].reduce((sum,c)=>sum+x.coverage[c][f],0)]));assert.deepEqual(aggregate(B),{total:1029,official:206,unverified:660,officialChampions:153,provisional:2});assert.deepEqual(aggregate(C),{total:1029,official:431,unverified:435,officialChampions:153,provisional:2});
assert.equal(C.entries.items['たつじんのおび'].name,'Cinturón de Experto');assert.deepEqual(C.entries.items['たつじんのおび'].aliases,['Cinta Experto','Cinturón de Experto']);assert.equal(C.entries.items['たつじんのおび'].officialChampions,true);for(const key of ['こだわりハチマキ','とつげきチョッキ'])assert.equal(C.entries.items[key].status,'provisional');
const protectedFiles=['docs/data/v110-es-la-owner-captures.json','docs/data/v110-es-la-owner-captures-batch2.json','docs/data/v110-es-la-owner-captures-batch3.json','docs/data/v110-es-la-official-publications-batch4.json','docs/data/v110-es-la-owner-provisional-items.json','docs/data/v110-es-la-expert-belt-capture.json','docs/data/v110-community-pinned-baseline.json','battle-data-v0184.js','move-mechanics-data-v0184.js','ability-data-v0184.js','damage-engine-v0184.js','damage-calculator-v0184.js','damage-ui-adapter-v0184.js','multi-hit.js','variable-power.js','pokemon-weights-v0181.js','weight-power.js','i18n.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-form-species-v0183.js','names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','names-ui-v0179.js','names-ui-v0183.js','locale-registry.js','locale-catalog.js','locale-name-search.js','locale-ui-es-la-v110.js'];for(const file of protectedFiles)assert.equal(read(file),old(file),file);
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pokedex-batch5-contract.json',JSON.stringify({passed:true,baseline,tree,records:225,corroboration:1,newlyOfficial:gains,before:aggregate(B),after:aggregate(C),displayNamesChanged:0,aliasesChanged:0,protectedFiles:protectedFiles.length,physicalMechanicsVerified:false,directHtmlRetrieved:false},null,2)+'\n');console.log('PASS batch5 exact generic species identities, 225 status promotions, no Champions/form inference, old provenance/display/mechanics preserved');
