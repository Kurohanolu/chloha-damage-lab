'use strict';
// Independent fixed identity/wording witnesses from the seven reviewed originals.
// Prior sources, manifests, dictionaries and calculation data must remain intact.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const baseline='61d87e82995bc60d4564aaf57a52dfc1fd859e4c',tree='213c12af29c002e9344b018e6be69e568a251dff';
const read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',baseline+':'+f],{encoding:'utf8',maxBuffer:32*1024*1024}),json=f=>JSON.parse(read(f));
assert.equal(execFileSync('git',['rev-parse',baseline+'^{tree}'],{encoding:'utf8'}).trim(),tree);
const S=json('docs/data/v110-es-la-source-records.json'),C=json('docs/data/v110-es-la-coverage.json'),M=json('docs/data/v110-es-la-owner-captures-batch3.json'),B=JSON.parse(old('docs/data/v110-es-la-coverage.json')),BS=JSON.parse(old('docs/data/v110-es-la-source-records.json'));
const anchors=[
 ['32751','Aura Guard','はどうのぼうご','auraGuard','Aura Protectora','03d8f20e563eefb83e38e9daf19a1d29463d1de20a478d8ee6cbbc8572d9b112'],
 ['32753','Fire Mane','ほのおのたてがみ','fireMane','Melena de Fuego','84d285d033769a3f48b0bc563fe71d25316ea1641e3248e8e6efec3e154ed0e0'],
 ['32755','Mega Sol','メガソーラー','unsupported:メガソーラー','Megasolar','5abd38196e87d1b400dd43e04374c4f4a63ab4b7ff6a856bcf5ff91cdbdee84c'],
 ['32757','Eelevate','うなぎのぼり','unsupported:うなぎのぼり','Impulso Anguila','51d88f4065d251c6eda44f3af4f9ced86e10a0acebaf7fbea95cdd65c49686ca'],
 ['32759','Dragonize','ドラゴンスキン','dragonize','Piel Dracónica','2b6d2d2066016c8b763ae323aa6eeb3d745514cb3dce3050fdec18812295ed60'],
 ['32761','Piercing Drill','かんつうドリル','unsupported:かんつうドリル','Turbotaladro','942ff8605d6d8efdc9468e48bce8bee4e97d44fa3302442323b4925806d3ec71'],
 ['32763','Spicy Spray','とびだすハバネロ','unsupported:とびだすハバネロ','Salpicante','45d0a209dc3645c8b3796d179f23b3f5d9866c6ffae6fb93329dcb9db10bfcd0']
];
assert.equal(M.batch,3);assert.equal(M.locale,'es-LA');assert.equal(M.browserLocale,'es-419');assert.equal(M.baseline.commit,baseline);assert.equal(M.baseline.tree,tree);assert.deepEqual(M.baseline.coverage,B.coverage);
assert.equal(S.sources.length,BS.sources.length+7);assert.equal(S.records.length,BS.records.length+7);assert.equal(M.captures.length,7);assert.equal(M.observations.length,7);
for(const field of ['sources','records']){const map=new Map(S[field].map(x=>[x.id,x]));assert.equal(map.size,S[field].length);for(const b of BS[field])assert.deepEqual(map.get(b.id),b,'Prior evidence unchanged: '+b.id);}
const keys=new Set(anchors.map(x=>x[2]));let newlyOfficial=0,unverifiedRemoved=0;
for(const [captureId,en,key,id,name,sha] of anchors){
 const cap=M.captures.find(x=>x.id===captureId),o=M.observations.find(x=>x.captureId===captureId),s=S.sources.find(x=>x.id===o.sourceId),r=S.records.find(x=>x.id===o.sourceRecordId),entry=C.entries.abilities[key];
 assert.match(sha,/^[a-f0-9]{64}$/);assert.equal(cap.sha256,sha);assert.equal(cap.privateImage,true);assert.equal(cap.imagePublished,false);assert.equal(cap.mechanicsVerified,false);assert.equal(s.rawSha256,sha);assert.equal(s.localeEvidence.languageSettingsScreenSupplied,false);assert.equal(s.authority,'official');assert.equal(s.evidenceAccess,'private-owner-provided');
 assert.equal(o.canonicalAnchor.en,en);assert.equal(o.canonicalAnchor.key,key);assert.deepEqual(o.canonicalAnchor.canonicalIds,[id]);assert.equal(o.canonicalAnchor.registered,true);assert.equal(o.canonicalAnchor.calculationSupported,!id.startsWith('unsupported:'));
 assert.equal(r.esLA,name);assert.equal(r.canonicalEnglish,en);assert.equal(r.status,'official');assert.equal(r.officialChampions,true);assert.equal(r.verificationScope,'owner-provided-game-capture-name-only');assert.deepEqual(r.canonicalMatches,[{category:'abilities',key,canonicalIds:[id]}]);
 assert.equal(entry.name,name);assert.equal(entry.status,'official');assert.equal(entry.officialChampions,true);assert.deepEqual(entry.canonicalIds,[id]);assert.ok(entry.sourceIds.includes(s.id));assert.ok(entry.recordIds.includes(r.id));assert.ok(B.entries.abilities[key].relatedRecordIds.every(x=>entry.relatedRecordIds.includes(x)));
 if(B.entries.abilities[key].status!=='official')newlyOfficial++;if(B.entries.abilities[key].status==='unverified')unverifiedRemoved++;
}
for(const [category,entries] of Object.entries(B.entries)){
 assert.deepEqual(Object.keys(C.entries[category]),Object.keys(entries),'No registered identity additions');
 for(const [key,before] of Object.entries(entries)){const after=C.entries[category][key];assert.equal(after.name,before.name,'No display-name change');assert.deepEqual(after.aliases,before.aliases,'No invented alias');assert.deepEqual(after.canonicalIds,before.canonicalIds);if(category!=='abilities'||!keys.has(key))assert.deepEqual(after,before,'Unobserved names preserve all provenance');}
}
assert.equal(newlyOfficial,5);assert.equal(unverifiedRemoved,2);assert.equal(C.coverage.abilities.total,245);
const categories=['pokemon','moves','abilities','items','types','natures','stats'],aggregate=x=>Object.fromEntries(['total','official','unverified','officialChampions'].map(field=>[field,categories.reduce((sum,c)=>sum+x.coverage[c][field],0)]));
assert.deepEqual(aggregate(B),{total:1029,official:151,unverified:714,officialChampions:142});assert.deepEqual(aggregate(C),{total:1029,official:156,unverified:712,officialChampions:147});
const protectedFiles=['docs/data/v110-es-la-owner-captures.json','docs/data/v110-es-la-owner-captures-batch2.json','battle-data-v0184.js','move-mechanics-data-v0184.js','ability-data-v0184.js','damage-engine-v0184.js','damage-calculator-v0184.js','damage-ui-adapter-v0184.js','multi-hit.js','variable-power.js','pokemon-weights-v0181.js','weight-power.js','tests/fixtures/v0184-public-baseline.json','tests/fixtures/v0186-baseline-corrections.json','i18n.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-form-species-v0183.js','names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','names-ui-v0179.js','names-ui-v0183.js','locale-registry.js','locale-catalog.js','locale-name-search.js','locale-ui-es-la-v110.js'];
for(const file of protectedFiles)assert.equal(read(file),old(file),'Protected file changed: '+file);
const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0');for(const [id]of anchors)assert.ok(!tracked.some(f=>f.endsWith('/'+id+'.jpg')||f===id+'.jpg'),'No private originals in Git');
const report={passed:true,baseline,tree,sourceSha256:crypto.createHash('sha256').update(read('docs/data/v110-es-la-source-records.json')).digest('hex'),captures:7,registered:7,mechanicsSupported:3,rosterOnly:4,newlyOfficial,unverifiedRemoved,displayNamesChanged:0,aliasesChanged:0,before:aggregate(B),after:aggregate(C),protectedFiles:protectedFiles.length,originalPixelsRequiredInCI:false,physicalMechanicsVerified:false};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/third-capture-contract.json',JSON.stringify(report,null,2)+'\n');console.log('PASS batch 3 provenance/preservation '+JSON.stringify(report));
