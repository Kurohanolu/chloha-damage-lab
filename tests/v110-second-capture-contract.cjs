'use strict';
// Preserve the exact published second capture batch lifecycle test in its immutable source tree.
// It verifies real approved bytes there; current batch 3 has a separate provenance and preservation gate.
if(require('node:fs').existsSync('docs/data/v110-es-la-owner-captures-batch3.json')){
 const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='61d87e82995bc60d4564aaf57a52dfc1fd859e4c',tree='213c12af29c002e9344b018e6be69e568a251dff';
 assert.equal(execFileSync('git',['rev-parse',ref+'^{tree}'],{encoding:'utf8'}).trim(),tree);
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre3-history-')),worktree=path.join(parent,'source');
 let status=1;
 try{
  execFileSync('git',['worktree','add','--detach',worktree,ref],{stdio:'pipe'});
  const result=spawnSync(process.execPath,['tests/v110-second-capture-contract.cjs'],{cwd:worktree,stdio:'inherit'});
  assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Unmodified published second capture batch lifecycle must pass');
  assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');
  fs.mkdirSync('reports/v110',{recursive:true});
  const report=JSON.parse(fs.readFileSync(path.join(worktree,'reports/v110/second-capture-contract.json'),'utf8'));
  fs.writeFileSync('reports/v110/second-capture-contract.json',JSON.stringify({...report,role:'historical immutable second capture batch, not current candidate acceptance',sourceCommit:ref,sourceTree:tree},null,2)+'\n');
  status=0;
 }finally{
  try{execFileSync('git',['worktree','remove','--force',worktree],{stdio:'pipe'});}finally{fs.rmSync(parent,{recursive:true,force:true});}
 }
 process.exit(status);
}
'use strict';
// Fixed witnesses from the reviewed second capture batch, independent of the
// generator. CI checks the attestation and identity bindings, not private image
// pixels or physical game mechanics. The first publication is immutable.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline='83af29133927a19fc7e0f9273c0e194c54384ae5';
const read=file=>fs.readFileSync(path.join(root,file),'utf8'),plain=value=>JSON.parse(JSON.stringify(value));
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const old=file=>git('show',baseline+':'+file),hash=body=>crypto.createHash('sha256').update(body).digest('hex');
const manifestFile='docs/data/v110-es-la-owner-captures-batch2.json',sourceFile='docs/data/v110-es-la-source-records.json',coverageFile='docs/data/v110-es-la-coverage.json';
const M=JSON.parse(read(manifestFile)),S=JSON.parse(read(sourceFile)),C=JSON.parse(read(coverageFile));
const previous=JSON.parse(old(coverageFile)),previousSources=JSON.parse(old(sourceFile));
const records=new Map(S.records.map(x=>[x.id,x])),sources=new Map(S.sources.map(x=>[x.id,x]));
const previousRecords=new Map(previousSources.records.map(x=>[x.id,x]));
assert.equal(git('rev-parse',baseline+'^{tree}').trim(),'cc196155bdb69a5e45b6ddb76b1c49987d4a9f3b');
assert.equal(read('docs/data/v110-es-la-owner-captures.json'),old('docs/data/v110-es-la-owner-captures.json'),'Original capture manifest is immutable');
assert.equal(M.schemaVersion,1);assert.equal(M.batch,2);assert.equal(M.locale,'es-LA');assert.equal(M.browserLocale,'es-419');
assert.equal(M.targetGame,'Pokémon Champions');assert.equal(M.baseline.commit,baseline);assert.deepEqual(M.baseline.coverage,previous.coverage);
assert.equal(previousSources.sources.length,50);assert.equal(previousSources.records.length,1139);
assert.equal(S.sources.length,60);assert.equal(S.records.length,1183);assert.equal(sources.size,60);assert.equal(records.size,1183);

// Original source objects must not be rewritten to claim new evidence. Only
// the fourteen reused owner records may gain references to this batch.
const reused=M.observations.filter(x=>x.recordReusedFromBatch1),reusedIds=new Set(reused.map(x=>x.sourceRecordId));
assert.equal(reused.length,14);assert.equal(reusedIds.size,14);
const stripRefs=record=>{const {sourceIds,captureObservationIds,...rest}=record;return rest;};
for(const source of previousSources.sources)assert.deepEqual(sources.get(source.id),source,'Preserve original source '+source.id);
for(const original of previousSources.records){
 const current=records.get(original.id);assert.ok(current);
 if(!reusedIds.has(original.id)){assert.deepEqual(current,original,'Unrelated source record '+original.id);continue;}
 assert.equal(original.verificationScope,'owner-provided-game-capture-name-only');
 assert.deepEqual(stripRefs(current),stripRefs(original),'Reused record changes are additive references only');
 assert.ok(original.sourceIds.every(id=>current.sourceIds.includes(id)));assert.equal(new Set(current.sourceIds).size,current.sourceIds.length);
 assert.ok(current.captureObservationIds.includes(original.captureObservationId));
 assert.equal(new Set(current.captureObservationIds).size,current.captureObservationIds.length);
}
assert.equal(S.records.filter(x=>!previousRecords.has(x.id)).length,44);

const imageHashes={
 '32711':['18231ca5e12f6b895ab53202719cb1a29ea8d8b908613e113cde6beb8ca12bad',157197],
 '32713':['fb7038135fb9b0af4b39df53e54d5e46beccae381e965ef21939510df10fd979',147887],
 '32715':['a71c95eefcb5a4f565cb81edb1996fbfad2912a4a11ad9434d8b8865820f2382',146619],
 '32717':['9047642d5c3888de213f580c657745fd01e61469dd4e6cdf3d04d09d0cfebfbd',92062],
 '32719':['3e16f0992a10cbe049aab03eafa6bb4e223ca7e6ff986763aef324be226f3e25',154137],
 '32721':['4d26677a836a11e7d7733b17591ae51a0130f50e71225a74ab2222290c7f6efe',96880],
 '32723':['5104ad3a69be50dbdeb414620c0253c4232ca32939043200698f527100d6a955',129949],
 '32725':['219ff74522796d3e5036352b49a725cf50f25604774e6d13cc603d83d4362a57',130244],
 '32727':['14e6b7122b281d5ed935e5b9b8c46d87fb71106b82fe67a7d6a06573e7a8f31b',129017],
 '32729':['f0637c9d817f519ab52583898de4f61e3869180d220fd448286ff03628d200ab',136606]
};
assert.deepEqual(M.captures.map(x=>x.id).sort(),Object.keys(imageHashes).sort());
const captures=new Map(M.captures.map(x=>[x.id,x])),captureSourceIds=new Set(M.captures.map(x=>x.sourceId));
const attestation=read('docs/v110-es-la-owner-screenshot-evidence.md');
for(const capture of M.captures){
 const [sha,size]=imageHashes[capture.id],source=sources.get(capture.sourceId);
 assert.equal(capture.sha256,sha);assert.equal(capture.byteLength,size);assert.equal(capture.filename,capture.id+'.jpg');
 assert.equal(capture.sourceId,'owner-champions-capture-'+capture.id);assert.equal(capture.privateImage,true);assert.equal(capture.imagePublished,false);
 assert.equal(capture.capturedAt,null);assert.equal(capture.providedAt,'2026-11-16');assert.equal(capture.checkedAt,'2026-11-16');assert.equal(capture.dateTimezone,'Asia/Tokyo');
 assert.equal(capture.localeEvidence.languageSettingsScreenSupplied,false);assert.equal(capture.mechanicsVerified,false);
 assert.equal(capture.verificationScope,'owner-provided-game-capture-name-only');assert.equal(source.rawSha256,sha);assert.equal(source.byteLength,size);
 assert.equal(source.authority,'official');assert.equal(source.targetGame,'Pokémon Champions');assert.equal(source.evidenceAccess,'private-owner-provided');assert.equal(source.imagePublished,false);
 assert.equal(source.urlRole,'public-attestation-document-not-image');assert.ok(source.url.endsWith('/docs/v110-es-la-owner-screenshot-evidence.md#capture-'+capture.id));
 assert.ok(new RegExp('^#{1,6} Capture '+capture.id+'$','m').test(attestation),'Attestation fragment exists for '+capture.id);
}
const tracked=git('ls-files','-z').split('\0');
for(const id of [...Object.keys(imageHashes),...JSON.parse(old('docs/data/v110-es-la-owner-captures.json')).captures.map(x=>x.id)])assert.ok(!tracked.some(file=>new RegExp('(^|/)'+id+'\\.(jpg|jpeg|png|webp)$','i').test(file)),'Do not publish private capture '+id);

const context=vm.createContext({});vm.runInContext('window=globalThis',context);vm.runInContext(read('locale-es-la-data-v110.js'),context);
const D=context.ChlohaEsLaData;assert.equal(D.sourceSha256,hash(read(sourceFile)));assert.equal(C.sourceSha256,D.sourceSha256);
assert.equal(M.observations.length,58);assert.equal(new Set(M.observations.map(x=>x.id)).size,58);
assert.equal(new Set(M.observations.map(x=>x.category+'\0'+x.canonicalAnchor.en)).size,58);
const registered=M.observations.filter(x=>x.canonicalAnchor.registered),abbreviations=M.observations.filter(x=>x.nameForm==='abbreviation');
assert.equal(registered.length,56);assert.equal(abbreviations.length,3);
for(const [category,total,runtime]of [['moves',20,20],['abilities',4,4],['items',20,18],['natures',2,2],['stats',6,6],['types',2,2],['pokemon',4,4]]){assert.equal(M.observations.filter(x=>x.category===category).length,total);assert.equal(registered.filter(x=>x.category===category).length,runtime);}
for(const o of M.observations){
 const anchor=o.canonicalAnchor,record=records.get(o.sourceRecordId);assert.ok(record);assert.equal(anchor.category,o.category);
 assert.equal(o.mechanicsVerified,false);assert.equal(o.softwareUiCoverageCredit,false);assert.equal(o.officialChampions,true);
 assert.equal(record.category,o.category);assert.equal(record.canonicalEnglish,anchor.en);assert.equal(record.esLA,o.esLA);
 assert.equal(record.status,'official');assert.equal(record.officialChampions,true);assert.equal(record.targetGame,'Pokémon Champions');assert.equal(record.verificationScope,'owner-provided-game-capture-name-only');
 assert.ok(o.observationRefs.length);assert.equal(new Set(o.observationRefs.map(x=>[x.captureId,x.location,x.rawObservedText].join('\0'))).size,o.observationRefs.length);
 for(const ref of o.observationRefs){assert.equal(captures.get(ref.captureId)?.sourceId,ref.sourceId);assert.ok(ref.location);assert.ok(ref.rawObservedText);assert.ok(record.sourceIds.includes(ref.sourceId));}
 if(o.recordReusedFromBatch1)assert.ok(record.captureObservationIds.includes(o.id));else assert.equal(record.captureObservationId,o.id);
 if(!anchor.registered){assert.equal(anchor.key,null);assert.deepEqual(anchor.canonicalIds,[]);assert.deepEqual(record.canonicalMatches,[]);assert.ok(!Object.values(C.entries[o.category]).some(x=>x.en===anchor.en));continue;}
 const entry=C.entries[o.category][anchor.key],runtime=D.entries[o.category][anchor.key];assert.ok(entry);assert.ok(runtime);
 assert.deepEqual(entry.canonicalIds,anchor.canonicalIds);assert.deepEqual(plain(runtime.canonicalIds),anchor.canonicalIds);
 assert.ok(record.canonicalMatches.some(x=>x.category===o.category&&x.key===anchor.key));assert.ok(entry.relatedRecordIds.includes(record.id));
 if(o.nameForm==='abbreviation'){
  assert.equal(o.decision,'accepted-system-abbreviation');assert.equal(record.nameForm,'abbreviation');
  assert.ok(!entry.recordIds.includes(record.id),'A short form cannot attest a full display name');
  assert.equal(entry.name,previous.entries[o.category][anchor.key].name);assert.deepEqual(entry.recordIds,previous.entries[o.category][anchor.key].recordIds);
  assert.deepEqual(entry.sourceIds,previous.entries[o.category][anchor.key].sourceIds);
  assert.ok(entry.abbreviationEvidence.some(x=>x.recordId===record.id&&x.name===o.esLA));assert.ok(runtime.aliases.includes(o.esLA));
 }else{
  assert.equal(o.decision,'accepted-system-term');assert.equal(runtime.name,o.esLA);assert.equal(runtime.status,'official');assert.equal(runtime.officialChampions,true);assert.equal(runtime.fallback,false);
  assert.ok(entry.recordIds.includes(record.id));assert.ok(o.observationRefs.every(ref=>runtime.sourceIds.includes(ref.sourceId)));
 }
}
assert.equal(S.records.filter(x=>x.sourceIds.some(id=>captureSourceIds.has(id))).length,58);

// These witnesses guard common plausible-but-wrong canonical associations.
const anchors=[
 ['moves','Brick Break','かわらわり','gw0169_p022','Karatazo','32713','move-list.row-3'],
 ['moves','Focus Blast','きあいだま','gw0169_s013','Ataque Centrado','32715','move-list.row-6'],
 ['moves','Heavy Slam','ヘビーボンバー','gw0170_u033','Golpe Pesado','32711','move-list.row-5'],
 ['moves','Reversal','きしかいせい','gw0169_p028','Inversión','32713','move-list.row-4'],
 ['moves','Low Kick','けたぐり','gw0169_p040','Patada Baja','32715','move-list.row-5'],
 ['moves','Metal Burst','メタルバースト','gw0170_u050','Expl. Metálica','32711','move-list.row-6'],
 ['moves','Light of Ruin','はめつのひかり','gw0169_s043','Luz Aniquiladora','32719','summary.move-3'],
 ['abilities','Filter','フィルター','filter','Filtro','32717','ability-modal.name'],
 ['abilities','Fairy Aura','フェアリーオーラ','fairyAura','Aura Feérica','32721','ability-modal.name'],
 ['abilities','Flower Veil','フラワーベール','unsupported:フラワーベール','Velo Florido','32719','summary.ability'],
 ['abilities','Rough Skin','さめはだ','unsupported:さめはだ','Piel Tosca','32729','summary.ability'],
 ['items','Rindo Berry','リンドのみ','rindoBerry','Baya Tamar','32723','item-list.row-3'],
 ['items','Tanga Berry','タンガのみ','tangaBerry','Baya Yecana','32723','item-list.row-7'],
 ['items','Haban Berry','ハバンのみ','habanBerry','Baya Anjiro','32727','item-list.row-4'],
 ['natures','Adamant','いじっぱり','adamant','Firme','32729','summary.nature'],
 ['natures','Timid','おくびょう','timid','Miedosa','32719','summary.nature']
];
const observation=(category,en)=>{const rows=M.observations.filter(x=>x.category===category&&x.canonicalAnchor.en===en);assert.equal(rows.length,1);return rows[0];};
for(const [category,en,key,id,text,captureId,location]of anchors){const o=observation(category,en);assert.equal(o.canonicalAnchor.key,key);assert.deepEqual(o.canonicalAnchor.canonicalIds,[id]);assert.equal(o.esLA,text);assert.ok(o.observationRefs.some(x=>x.captureId===captureId&&x.location===location&&x.rawObservedText===text));}
assert.ok(!D.entries.items['リンドのみ'].aliases.includes('Baya Yecana'));assert.ok(!D.entries.items['タンガのみ'].aliases.includes('Baya Tamar'));
for(const [text,id]of [['Karatazo','gw0169_p022'],['Ataque Centrado','gw0169_s013']])assert.deepEqual(Object.values(C.entries.moves).filter(x=>x.aliases.includes(text)).flatMap(x=>x.canonicalIds),[id]);
assert.equal(observation('items','Sitrus Berry').canonicalAnchor.registered,false);assert.equal(observation('items','Persim Berry').canonicalAnchor.registered,false);
assert.equal(D.entries.items['オボンのみ'],undefined);assert.equal(D.entries.items['キーのみ'],undefined);
const flower=observation('pokemon','Floette (Eternal Flower)');assert.equal(flower.canonicalAnchor.key,'roster_v0105_029');
assert.equal(flower.rawObservedText,'Floette | Flor Eterna');assert.deepEqual(flower.rawObservedComponents,['Floette','Flor Eterna']);
assert.equal(C.entries.pokemon.roster_v0105_029.name,'Floette (Flor Eterna)');assert.ok(D.entries.pokemon.roster_v0105_029.aliases.includes('Floette Flor Eterna'));
for(const [en,key,captureId,location]of [['Floette (Eternal Flower)','roster_v0105_029','32719','summary.system-species-and-form'],['Mega Floette','roster_v0104_017','32721','summary.system-form'],['Aggron','candidate093_23','32717','summary.system-species'],['Mega Aggron','candidate093_24','32717','summary.system-form']]){
 const o=observation('pokemon',en);assert.equal(o.canonicalAnchor.key,key);assert.ok(o.observationRefs.some(x=>x.captureId===captureId&&x.location===location));
}

// The right pane describes only its selected row: especially not Karatazo,
// Ataque Centrado or any resistance berry visible alongside that pane.
const selectedEffects=[['32711','Heavy Slam','gw0170_u033'],['32713','Reversal','gw0169_p028'],['32715','Low Kick','gw0169_p040'],['32717','Filter','filter'],['32721','Fairy Aura','fairyAura'],['32723','Persim Berry',null],['32725','Persim Berry',null],['32727','Persim Berry',null]];
assert.equal(M.effectObservations.length,selectedEffects.length);
for(const [captureId,en,id]of selectedEffects){const matches=M.effectObservations.filter(x=>x.captureId===captureId);assert.equal(matches.length,1);const effect=matches[0];assert.equal(effect.canonicalEnglish,en);assert.deepEqual(effect.canonicalIds,id?[id]:[]);assert.equal(effect.mechanicsVerified,false);assert.equal(effect.engineChangeAuthorized,false);assert.equal(effect.nameEvidenceOnly,true);assert.ok(effect.rawObservedText.length>20);assert.equal(effect.sourceId,captures.get(captureId).sourceId);}
assert.ok(!observation('moves','Focus Blast').observationRefs.some(x=>x.captureId==='32713'),'The clipped Focus Blast row is not accepted as an independent witness');
assert.ok(!M.observations.some(x=>x.canonicalAnchor.en==='Icy Wind'));
assert.equal(M.excludedObservations.length,5);assert.ok(M.excludedObservations.every(x=>x.decision==='excluded-clipped-row'));
assert.equal(M.uiObservations.length,28);assert.ok(M.uiObservations.every(x=>x.decision==='game-ui-observation-only'&&x.softwareUiCoverageCredit===false));
assert.equal(M.contextObservations.length,2);assert.ok(M.contextObservations.every(x=>x.decision==='off-runtime-species-component'));

// Protect all inherited languages and calculation sources byte for byte. The
// canonical roster/moves inline data is checked separately from cache hashes.
const protectedFiles=['battle-data-v0184.js','move-mechanics-data-v0184.js','ability-data-v0184.js','damage-engine-v0184.js','damage-calculator-v0184.js','damage-ui-adapter-v0184.js','multi-hit.js','variable-power.js','pokemon-weights-v0181.js','weight-power.js','tests/fixtures/v0184-public-baseline.json','tests/fixtures/v0186-baseline-corrections.json','tests/reference/package-lock.json','i18n.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-form-species-v0183.js','names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','names-ui-v0179.js','names-ui-v0183.js','locale-registry.js','locale-catalog.js','locale-name-search.js','locale-ui-es-la-v110.js'];
// Pre.3 authorizes only the compact ES-LA label and actual selector's registry
// wiring. All remaining bytes, including the nine dictionaries, stay protected.
const selectorChanges={
 'locale-registry.js':["label:'ES-LA'","label:'Español (Latinoamérica)'"],
 'i18n.js':[" const localeChoices=globalThis.ChlohaLocales?.entries?.map(entry=>[entry.code,entry.label])||[['ja','日本語'],['en','English'],['fr','Français'],['de','Deutsch'],['es','Español'],['it','Italiano'],['ko','한국어'],['zh-Hans','简体中文'],['zh-Hant','繁體中文'],['es-LA','ES-LA']];\n for(const [value,title] of localeChoices){\n"," for(const [value,title] of [['ja','日本語'],['en','English'],['fr','Français'],['de','Deutsch'],['es','Español'],['it','Italiano'],['ko','한국어'],['zh-Hans','简体中文'],['zh-Hant','繁體中文'],['es-LA','Español (Latinoamérica)']]){\n"]
};
for(const file of protectedFiles){
 let current=read(file);const change=selectorChanges[file];
 if(change){assert.equal(current.split(change[0]).length-1,1,'One exact compact selector delta: '+file);current=current.replace(change[0],change[1]);}
 assert.equal(current,old(file),'Unchanged numeric/data/other-language source outside exact selector change: '+file);
}

function inheritedAdapterRecords(reader){
 const c=vm.createContext({});vm.runInContext('window=globalThis',c);
 for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-name-catalog-adapter.js'])vm.runInContext(reader(file),c,{filename:file});
 const localized={};
 for(const category of ['pokemon','moves','abilities','items']){localized[category]={};for(const table of [c.ChlohaPokeAPILocalizedNames[category],c.ChlohaLocalizedNames[category]])for(const [key,value]of Object.entries(table||{}))localized[category][key]={...localized[category][key],...value};}
 // Without the ES-LA extension, the shared adapter must produce the identical
 // complete inherited catalog, including all nine-language names and aliases.
 return plain(c.ChlohaNameCatalogAdapter.recordsFrom(c.ChlohaNames,localized));
}
const inheritedRecords=inheritedAdapterRecords(read);assert.deepEqual(inheritedRecords,inheritedAdapterRecords(old),'ES-LA alias integration preserves the complete inherited catalog');
for(const expression of [/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s,/const ChlohaMovesDB = (\{[^\n]+\});/])assert.equal(read('index.html').match(expression)?.[1],old('index.html').match(expression)?.[1],'Inline canonical game data remains unchanged');
const nameDelta=[],aliasDelta=[];
const observedKeys=new Set(registered.map(x=>x.category+'\0'+x.canonicalAnchor.key));
for(const o of registered.filter(x=>x.category==='pokemon'))observedKeys.add('forms\0'+o.canonicalAnchor.key);
for(const [category,entries]of Object.entries(previous.entries)){
 assert.deepEqual(Object.keys(C.entries[category]),Object.keys(entries),'No inventory expansion in '+category);
 for(const [key,before]of Object.entries(entries)){
  const after=C.entries[category][key];assert.deepEqual(after.canonicalIds,before.canonicalIds);assert.equal(after.es,before.es,'ES-ES spelling unchanged');assert.equal(after.en,before.en);assert.equal(after.ja,before.ja);
  if(!observedKeys.has(category+'\0'+key))assert.deepEqual(after,before,'Unobserved entry keeps its complete provenance: '+category+'/'+key);
  if(after.name!==before.name)nameDelta.push({category,key,before:before.name,after:after.name});
  const added=after.aliases.filter(x=>!before.aliases.includes(x)),removed=before.aliases.filter(x=>!after.aliases.includes(x));
  if(added.length||removed.length)aliasDelta.push({category,key,added,removed});
 }
}
assert.deepEqual(nameDelta,[{category:'natures',key:'いじっぱり',before:'firme',after:'Firme'}]);assert.deepEqual(M.nameAliasDelta.registeredNamesChanged,nameDelta);
const expectedAliases=[{category:'pokemon',key:'roster_v0105_029',added:['Floette Flor Eterna'],removed:[]},{category:'stats',key:'とくこう',added:['At. Esp.'],removed:[]},{category:'stats',key:'とくぼう',added:['Def. Esp.'],removed:[]}];
// The form view overlaps the Pokémon inventory and shares the same aliases.
assert.deepEqual(aliasDelta.filter(x=>x.category!=='forms'),expectedAliases);assert.deepEqual(M.nameAliasDelta.registeredAliasSetsChanged,expectedAliases);
assert.ok(aliasDelta.every(x=>x.removed.length===0));
const categories=['pokemon','moves','abilities','items','types','natures','stats'];
const aggregate=report=>{const result={total:0,official:0,'verified-secondary':0,unverified:0,officialChampions:0};for(const category of categories)for(const entry of Object.values(report.entries[category])){result.total++;if(entry.status in result)result[entry.status]++;if(entry.officialChampions)result.officialChampions++;}return result;};
const before=aggregate(previous),after=aggregate(C);
assert.deepEqual(before,{total:1029,official:121,'verified-secondary':169,unverified:739,officialChampions:112});
assert.deepEqual(after,{total:1029,official:151,'verified-secondary':164,unverified:714,officialChampions:142});
assert.deepEqual(M.aggregateBefore,before);assert.deepEqual(M.aggregateAfter,after);assert.deepEqual(M.afterCoverage,C.coverage);
for(const category of categories){const rows=Object.values(C.entries[category]),coverage=C.coverage[category];assert.equal(coverage.total,rows.length);assert.equal(coverage.officialChampions,rows.filter(x=>x.officialChampions).length);for(const status of ['official','verified-secondary','provisional','unverified'])assert.equal(coverage[status],rows.filter(x=>x.status===status).length);}
assert.deepEqual(C.coverage.ui,previous.coverage.ui);assert.deepEqual(C.coverage.warnings,previous.coverage.warnings);
assert.deepEqual(M.summary,{captures:10,systemObservations:58,registeredObservations:56,offRuntimeObservations:2,abbreviations:3,existingOwnerRecordsExtended:14,newSourceRecords:44,extraScreenshotsRequested:0,unresolvedCanonicalIdentities:0,newlyOfficialChampions:30,unverifiedReduction:25});
const report={passed:true,baseline,manifestSha256:hash(read(manifestFile)),sourceSha256:D.sourceSha256,privateCaptures:10,observations:58,registered:56,offRuntime:2,abbreviationOnly:3,reusedRecords:14,newRecords:44,independentAnchors:anchors.length,effectBindings:selectedEffects.length,protectedFiles:protectedFiles.length,before,after,nameDelta,aliasDelta,privateImagesPublished:false,physicalMechanicsVerified:false};
fs.mkdirSync(path.join(root,'reports/v110'),{recursive:true});fs.writeFileSync(path.join(root,'reports/v110/second-capture-contract.json'),JSON.stringify(report,null,2)+'\n');
console.log('PASS v1.1.0 second capture contract: '+JSON.stringify(report));
