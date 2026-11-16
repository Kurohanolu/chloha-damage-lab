'use strict';
// Independently transcribed image witnesses. CI validates the public attestation
// and canonical bindings; private screenshots are deliberately not required or published.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const baseline='a70b45674c66dcfd7b87321c9f012dd36637c3f2',plain=x=>JSON.parse(JSON.stringify(x)),read=p=>fs.readFileSync(p,'utf8');
const firstPublication='83af29133927a19fc7e0f9273c0e194c54384ae5';
const manifestFile='docs/data/v110-es-la-owner-captures.json',M=JSON.parse(read(manifestFile)),S=JSON.parse(read('docs/data/v110-es-la-source-records.json')),C=JSON.parse(read('docs/data/v110-es-la-coverage.json'));
const old=p=>execFileSync('git',['show',baseline+':'+p],{encoding:'utf8',maxBuffer:32*1024*1024});
const published=p=>execFileSync('git',['show',firstPublication+':'+p],{encoding:'utf8',maxBuffer:32*1024*1024});
const previous=JSON.parse(old('docs/data/v110-es-la-coverage.json')),previousSources=JSON.parse(old('docs/data/v110-es-la-source-records.json'));
const firstCoverage=JSON.parse(published('docs/data/v110-es-la-coverage.json')),firstSources=JSON.parse(published('docs/data/v110-es-la-source-records.json')),firstRecords=new Map(firstSources.records.map(x=>[x.id,x]));
assert.equal(execFileSync('git',['rev-parse',firstPublication+'^{tree}'],{encoding:'utf8'}).trim(),'cc196155bdb69a5e45b6ddb76b1c49987d4a9f3b','First-batch results remain bound to the immutable publication');
assert.equal(read(manifestFile),published(manifestFile),'The original ten-capture manifest must remain byte-identical');
const c=vm.createContext({});vm.runInContext('window=globalThis',c);
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','ability-data-v0184.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(read(file),c,{filename:file});
const D=c.ChlohaEsLaData;
const withoutScopeUnion=record=>{const {verificationScopes,...rest}=record;return rest;};
const imageHashes={
 '32678':'96218d638601b75eded57b257aff97c95b4bec65750a13438591c49ac848ae37',
 '32680':'210166f846d62d3582b53fb3c31b6d757738c8ceaf1ae4e178fba7c2a285c8d4',
 '32682':'30df61c23bad36b8a13033502477156fce973e9d1aba6248ae6208808cccdeb7',
 '32684':'1d21245a766ac212f7941d0e1432bbaf176efa37f2bf0072304a68c6c504861a',
 '32686':'2b576788790872570ab40ce547d4e61aba96b3ba71289ea30bc11207ef937a30',
 '32688':'2e92005752cb8a14841849d000ca7283641034f1f04d86d9fbb627ddbf4ade89',
 '32690':'5bc870da195d8069f7c3ff7de0444d4a6f574eab2f7cef28d86334d68f376115',
 '32692':'04b634f176254d36caefb2ce719f5672a5719ee416265aa9412f367044103381',
 '32694':'1df3113c76d427a78f8dbc803360c6bf052766f671bfcf75839bb77e3567f396',
 '32696':'55f512b00ccee84f967c90627e4d3776e7bf5395d8d6b5d2380ce07ebb034de8'
};
assert.equal(M.schemaVersion,1);assert.equal(M.locale,'es-LA');assert.equal(M.browserLocale,'es-419');assert.equal(M.targetGame,'Pokémon Champions');assert.equal(M.baseline.commit,baseline);
assert.deepEqual(M.baseline.coverage,previous.coverage);
assert.equal(M.captures.length,10);assert.deepEqual(M.captures.map(x=>x.id).sort(),Object.keys(imageHashes).sort());
const sources=new Map(S.sources.map(x=>[x.id,x])),records=new Map(S.records.map(x=>[x.id,x])),captures=new Map(M.captures.map(x=>[x.id,x]));
assert.equal(sources.size,S.sources.length);assert.equal(records.size,S.records.length);
for(const capture of M.captures){
 assert.equal(capture.filename,capture.id+'.jpg');assert.equal(capture.sha256,imageHashes[capture.id]);assert.ok(capture.byteLength>0);
 assert.equal(capture.sourceId,'owner-champions-capture-'+capture.id);assert.equal(capture.privateImage,true);assert.equal(capture.imagePublished,false);
 assert.equal(capture.verificationScope,'owner-provided-game-capture-name-only');assert.equal(capture.mechanicsVerified,false);
 assert.equal(capture.capturedAt,null,'An unestablished capture time must not become a fabricated date');
 assert.equal(capture.providedAt,'2026-11-16');assert.equal(capture.checkedAt,'2026-11-16');assert.equal(capture.dateTimezone,'Asia/Tokyo');
 assert.equal(capture.localeEvidence.languageSettingsScreenSupplied,false,'Owner locale attestation is not a supplied settings screenshot');
 const source=sources.get(capture.sourceId);assert.ok(source);assert.equal(source.rawSha256,capture.sha256);assert.equal(source.byteLength,capture.byteLength);
 assert.equal(source.authority,'official');assert.equal(source.targetGame,'Pokémon Champions');assert.equal(source.evidenceAccess,'private-owner-provided');assert.equal(source.imagePublished,false);
 assert.equal(source.urlRole,'public-attestation-document-not-image');assert.match(source.url,new RegExp('/docs/v110-es-la-capture-audit\\.md#capture-'+capture.id+'$'));
 assert.ok(read('docs/v110-es-la-capture-audit.md').split('\n').includes('## Capture '+capture.id),'Public attestation URL fragment has a real capture heading');
}
const captureSourceIds=new Set(M.captures.map(x=>x.sourceId)),ownerRecords=S.records.filter(x=>x.sourceIds.some(id=>captureSourceIds.has(id)));
assert.equal(ownerRecords.length,65,'Repeated observations produce one source record per system identity');
assert.equal(firstSources.sources.length,previousSources.sources.length+10);assert.equal(firstSources.records.length,previousSources.records.length+65);
assert.ok(S.sources.length>=firstSources.sources.length);assert.ok(S.records.length>=firstSources.records.length);
for(const original of previousSources.sources)assert.deepEqual(sources.get(original.id),original,'Keep previous source provenance');
for(const original of previousSources.records)assert.deepEqual(records.get(original.id),original,'Keep previous evidence records');
for(const original of firstSources.sources)assert.deepEqual(sources.get(original.id),original,'Keep all first-publication source provenance');
const firstOwnerRecords=firstSources.records.filter(x=>x.sourceIds.some(id=>captureSourceIds.has(id)));
assert.deepEqual(ownerRecords.map(x=>x.id).sort(),firstOwnerRecords.map(x=>x.id).sort(),'Later captures must reuse, not duplicate, first-batch identity records');
const withoutAdditiveRefs=record=>{const {sourceIds,captureObservationIds,...rest}=record;return rest;};
for(const original of firstOwnerRecords){
 const current=records.get(original.id);
 assert.deepEqual(withoutAdditiveRefs(current),withoutAdditiveRefs(original),'Only additive capture references may change a first-batch record');
 assert.equal(new Set(current.sourceIds).size,current.sourceIds.length);assert.ok(original.sourceIds.every(id=>current.sourceIds.includes(id)),'Original capture sources remain attached');
 for(const id of current.sourceIds){const source=sources.get(id);assert.ok(source);assert.equal(source.authority,'official');assert.equal(source.targetGame,'Pokémon Champions');}
 if(current.captureObservationIds!==undefined){assert.ok(Array.isArray(current.captureObservationIds));assert.equal(new Set(current.captureObservationIds).size,current.captureObservationIds.length);assert.ok(current.captureObservationIds.includes(original.captureObservationId),'Additive observation list retains the original witness');}
}
assert.equal(M.observations.length,71);assert.equal(new Set(M.observations.map(x=>x.id)).size,71);
const identities=M.observations.map(x=>x.category+'\0'+x.canonicalAnchor.en);assert.equal(new Set(identities).size,71,'Deduplicate canonical identities, not translated spellings');
const accepted=M.observations.filter(x=>x.decision==='accepted-system-term'),context=M.observations.filter(x=>x.decision==='identity-context-only');
assert.equal(accepted.length,65);assert.equal(context.length,6);
const registered=accepted.filter(x=>x.canonicalAnchor.registered),offRuntime=accepted.filter(x=>!x.canonicalAnchor.registered);
assert.equal(registered.length,41);assert.equal(offRuntime.length,24);
for(const [category,observed,runtime] of [['moves',20,16],['abilities',6,6],['items',29,9],['types',10,10]]){
 assert.equal(accepted.filter(x=>x.category===category).length,observed);assert.equal(registered.filter(x=>x.category===category).length,runtime);
}
for(const observation of M.observations){
 const anchor=observation.canonicalAnchor;assert.equal(anchor.category,observation.category);assert.equal(observation.mechanicsVerified,false);assert.equal(observation.softwareUiCoverageCredit,false);
 assert.ok(observation.observationRefs.length);const refs=observation.observationRefs.map(x=>[x.captureId,x.location,x.rawObservedText].join('\0'));assert.equal(new Set(refs).size,refs.length);
 for(const ref of observation.observationRefs){assert.equal(captures.get(ref.captureId)?.sourceId,ref.sourceId);assert.ok(ref.location);assert.ok(ref.rawObservedText);}
 if(observation.category==='types'){assert.equal(observation.rawObservedText,observation.esLA.toLocaleUpperCase('es-419'),'Type labels preserve exact case evidence');}
 else assert.equal(observation.rawObservedText,observation.esLA);
 if(observation.decision==='identity-context-only'){
  assert.equal(observation.category,'pokemon');assert.equal(observation.sourceRecordId,null);assert.equal(observation.officialChampions,false);
  assert.deepEqual(withoutScopeUnion(firstCoverage.entries.pokemon[anchor.key]),previous.entries.pokemon[anchor.key],'First-batch nickname-capable labels did not promote official species names');continue;
 }
 assert.equal(observation.decision,'accepted-system-term');const record=records.get(observation.sourceRecordId);assert.ok(record);
 assert.equal(record.captureObservationId,observation.id);assert.equal(record.category,observation.category);assert.equal(record.canonicalEnglish,anchor.en);assert.equal(record.esLA,observation.esLA);
 assert.equal(record.status,'official');assert.equal(record.officialChampions,true);assert.equal(record.targetGame,'Pokémon Champions');assert.equal(record.verificationScope,'owner-provided-game-capture-name-only');
 assert.ok(observation.observationRefs.every(ref=>record.sourceIds.includes(ref.sourceId)),'Every original witness remains in the current source record');
 if(anchor.registered){
  const runtime=D.entries[observation.category][anchor.key];assert.ok(runtime);assert.equal(runtime.name,observation.esLA);assert.equal(runtime.status,'official');assert.equal(runtime.officialChampions,true);assert.equal(runtime.fallback,false);
  assert.deepEqual(plain(runtime.canonicalIds),anchor.canonicalIds);assert.ok(record.canonicalMatches.some(x=>x.category===observation.category&&x.key===anchor.key));
  assert.ok(observation.observationRefs.every(ref=>runtime.sourceIds.includes(ref.sourceId)),'Current runtime retains all original capture sources');
  const entry=C.entries[observation.category][anchor.key];assert.ok(entry.recordIds.includes(record.id));
  const scopeUnion=[...new Set(entry.recordIds.map(id=>records.get(id)?.verificationScope).filter(Boolean))];assert.deepEqual(entry.verificationScopes||[],scopeUnion,'Current original-name audit scopes correspond to selected source records');
 }else{assert.equal(anchor.key,null);assert.deepEqual(anchor.canonicalIds,[]);assert.deepEqual(record.canonicalMatches,[]);assert.ok(!Object.values(C.entries[observation.category]).some(x=>x.en===anchor.en),'Off-runtime evidence cannot create a calculator identity');}
}
// Critical anchors are copied from the visible system fields, independently of
// the manifest. They prevent plausible-looking but incorrect canonical mappings.
const anchors=[
 ['abilities','Unburden','かるわざ','unsupported:かるわざ','Liviano','32688','details.ability-value'],
 ['moves','Zap Cannon','でんじほう','gw0169_s032','Electrocañón','32690','details.move-1'],
 ['moves','Psychic','サイコキネシス','psychic','Fuerza Psíquica','32692','details.move-1'],
 ['moves','Ice Shard','こおりのつぶて','gw0170b_003','Esquirla Helada','32696','details.move-3'],
 ['items','Life Orb','いのちのたま','lifeOrb','Vidaesfera','32680','item-list.row-2'],
 ['items','Roseli Berry','ロゼルのみ','roseliBerry','Baya Hibis','32680','item-list.row-4'],
 ['items','Shuca Berry','シュカのみ','shucaBerry','Baya Acardo','32684','item-list.row-3'],
 ['items','Chople Berry','ヨプのみ','chopleBerry','Baya Pomaro','32684','item-list.row-5'],
 ['items','Kasib Berry','カシブのみ','kasibBerry','Baya Drasi','32684','item-list.row-7']
];
const observation=(category,en)=>{const rows=M.observations.filter(x=>x.category===category&&x.canonicalAnchor.en===en);assert.equal(rows.length,1);return rows[0];};
for(const [category,en,key,id,text,captureId,location] of anchors){const o=observation(category,en);assert.equal(o.esLA,text);assert.equal(o.canonicalAnchor.key,key);assert.deepEqual(o.canonicalAnchor.canonicalIds,[id]);assert.ok(o.observationRefs.some(x=>x.captureId===captureId&&x.location===location&&x.rawObservedText===text));}
assert.equal(c.ChlohaAbilityData.ABILITY_CATALOG.levitate.ja,'ふゆう');assert.ok(!Object.values(c.ChlohaAbilityData.ABILITY_CATALOG).some(x=>x.ja==='かるわざ'),'Observed Unburden stays unsupported');
assert.ok(!D.entries.abilities['ふゆう'].aliases.includes('Liviano'));assert.ok(!D.entries.moves['かみなり'].aliases.includes('Electrocañón'));assert.ok(!D.entries.moves['ワイドフォース'].aliases.includes('Fuerza Psíquica'));
for(const [en,text,key,captureId,location] of [['Light Clay','Refleluz','ひかりのねんど','32680','item-list.row-7'],['White Herb','Hierba Blanca','しろいハーブ','32688','details.item-value'],['Sitrus Berry','Baya Citrón','オボンのみ','32692','details.item-value']]){
 const o=observation('items',en);assert.equal(o.esLA,text);assert.equal(o.canonicalAnchor.registered,false);assert.equal(o.canonicalAnchor.catalogKey,key);assert.equal(D.entries.items[key],undefined);assert.ok(o.observationRefs.some(x=>x.captureId===captureId&&x.location===location&&x.rawObservedText===text));
}
assert.equal(M.excludedObservations.length,1);assert.equal(M.excludedObservations[0].captureId,'32684');assert.equal(M.excludedObservations[0].location,'item-list.row-8-clipped-below-Baya-Drasi');assert.equal(M.excludedObservations[0].decision,'excluded-clipped-row');
assert.ok(!accepted.some(x=>x.esLA==='Baya Anjiro'),'The first batch\'s clipped next row cannot provide an adopted name');assert.ok(!ownerRecords.some(x=>x.canonicalEnglish==='Haban Berry'),'Haban Berry must not cite a first-batch capture');
assert.equal(M.uiObservations.length,18);for(const o of M.uiObservations){assert.equal(o.decision,'game-ui-observation-only');assert.equal(o.softwareUiCoverageCredit,false);}
const registeredKeys=new Set(registered.map(x=>x.category+'\0'+x.canonicalAnchor.key));let changedStatus=0,newlyOfficial=0,newlyOfficialChampions=0;
// Later batches may add evidence, names and aliases. Attribute these historical
// totals only to the published first batch; live witnesses remain checked above.
for(const [category,entries] of Object.entries(previous.entries)){
 assert.deepEqual(Object.keys(firstCoverage.entries[category]),Object.keys(entries),'First batch did not expand inventory/engine identities');
 for(const [key,before] of Object.entries(entries)){
  const after=firstCoverage.entries[category][key];assert.deepEqual(after.canonicalIds,before.canonicalIds);assert.equal(after.name,before.name,'The first capture batch added attestation, not invented names');assert.deepEqual([...after.aliases].sort(),[...before.aliases].sort(),'First batch retained existing aliases');
  const scopeUnion=[...new Set(after.recordIds.map(id=>firstRecords.get(id)?.verificationScope).filter(Boolean))];assert.deepEqual(after.verificationScopes||[],scopeUnion,'Published first-batch audit scopes correspond only to its selected source records');
  if(!registeredKeys.has(category+'\0'+key))assert.deepEqual(withoutScopeUnion(after),before,'Unobserved names retain their provenance');
  if(before.status!==after.status||before.officialChampions!==after.officialChampions)changedStatus++;
  if(before.status!=='official'&&after.status==='official')newlyOfficial++;
  if(!before.officialChampions&&after.officialChampions)newlyOfficialChampions++;
 }
}
assert.equal(newlyOfficial,27);assert.equal(newlyOfficialChampions,31);assert.equal(changedStatus,31);
// A stronger primary source must not erase or mislabel an earlier valid identity.
const psychic=C.entries.moves['サイコキネシス'],secondaryId='pokexperto-champions-moves-94';
assert.equal(psychic.name,'Fuerza Psíquica');assert.ok(psychic.recordIds.includes('owner-champions-2026-11-16-moves-psychic'));
assert.ok(psychic.relatedRecordIds.includes(secondaryId));assert.ok(!psychic.recordIds.includes(secondaryId));
const superseded=C.unmatchedSourceRecords.find(record=>record.id===secondaryId);assert.ok(superseded);
assert.equal(superseded.selectionReason,'superseded-by-higher-priority-evidence');assert.deepEqual(superseded.canonicalMatches,[{category:'moves',key:'サイコキネシス'}]);
assert.equal(Object.values(C.entries.moves).filter(record=>record.canonicalIds.includes('psychic')).length,1);
const offRuntimeRecord=C.unmatchedSourceRecords.find(record=>record.id===observation('items','Light Clay').sourceRecordId);
assert.equal(offRuntimeRecord.selectionReason,'no-runtime-canonical-match');assert.deepEqual(offRuntimeRecord.canonicalMatches,[]);
assert.equal(M.summary.newlyOfficial,newlyOfficial);assert.equal(M.summary.newlyOfficialChampions,newlyOfficialChampions);assert.equal(M.summary.statusOrGameScopeChanged,changedStatus);
assert.deepEqual(M.nameAliasDelta.registeredNamesChanged,[]);assert.deepEqual(M.nameAliasDelta.registeredAliasSetsChanged,[]);
const combined={};for(const category of ['pokemon','moves','abilities','items']){combined[category]={};for(const table of [c.ChlohaPokeAPILocalizedNames[category],c.ChlohaLocalizedNames[category]])for(const [key,names]of Object.entries(table||{}))combined[category][key]={...combined[category][key],...names};}
const index=c.ChlohaNameCatalogAdapter.build(c.ChlohaNames,c.ChlohaNameSearch,combined);let aliasQueries=0;
for(const [category,,key,,text]of anchors)for(const query of new Set([text,text.toUpperCase(),text.normalize('NFD').replace(/[\u0300-\u036f]/g,''),previous.entries[category][key].es])){assert.ok(c.ChlohaNameSearch.search(index,category,query).includes(key),'Observed/Spain/case/accent alias remains canonical: '+query);aliasQueries++;}
const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0');for(const id of Object.keys(imageHashes))assert.ok(!tracked.some(p=>p===id+'.jpg'||p.endsWith('/'+id+'.jpg')),'Private capture bytes must stay out of Git');
const evidence={passed:true,baseline,firstPublication,aggregateScope:'immutable first-batch publication; original witnesses also checked against current sources/runtime',manifestSha256:crypto.createHash('sha256').update(read(manifestFile)).digest('hex'),sourceSha256:D.sourceSha256,privateCaptures:10,uniqueNameObservations:71,systemTerms:65,registeredTerms:41,offRuntimeTerms:24,speciesContextOnly:6,clippedExcluded:1,independentAnchors:anchors.length,aliasQueries,newlyOfficial,newlyOfficialChampions,statusOrGameScopeChanged:changedStatus,registeredNamesChanged:0,registeredAliasSetsChanged:0,ownerProvidedTerminologyCapturesVerified:true,physicalMechanicsVerified:false,privateImagesPublished:false};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/owner-capture-contract.json',JSON.stringify(evidence,null,2)+'\n');console.log('PASS v1.1.0 owner capture provenance: '+JSON.stringify(evidence));
