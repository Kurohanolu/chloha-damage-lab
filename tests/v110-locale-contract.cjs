'use strict';
// Candidate contracts extend (rather than rewrite) immutable nine-language acceptance.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline='0b270c1452505268364659edd402209b00b28673';
const previous=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'],locales=[...previous,'es-LA'];
const json=value=>JSON.parse(JSON.stringify(value));
const old=file=>execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
function load(read,files){const c=vm.createContext({console});vm.runInContext('window=globalThis',c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c;}
const files=['locale-registry.js','locale-catalog.js','locale-name-search.js','feedback-contract-v0185.js','feedback-locales-v0185.js'];
const now=load(file=>fs.readFileSync(path.join(root,file),'utf8'),files),before=load(old,files);
assert.deepEqual(json(now.ChlohaLocales.entries.map(x=>x.code)),locales,'ES-LA is the tenth distinct locale; preserve existing order/IDs');
assert.equal(now.ChlohaLocales.entries.find(x=>x.code==='es-LA').label,'ES-LA');
assert.equal(now.ChlohaLocales.normalize('es-LA'),'es-LA');assert.equal(now.ChlohaLocales.normalize('es'),'es');
assert.equal(now.ChlohaLocales.browserLocale('es-LA'),'es-419','Internal custom ID must never leak into HTML/Intl');
assert.equal(new Intl.Locale(now.ChlohaLocales.browserLocale('es-LA')).toString(),'es-419');
assert.ok(json(now.ChlohaLocales.chain('es-LA')).includes('es'),'Explicit Spain Spanish fallback is retained');
for(const locale of previous){
 assert.deepEqual(json(now.ChlohaLocales.entries.find(x=>x.code===locale)),json(before.ChlohaLocales.entries.find(x=>x.code===locale)),'Existing locale registry record: '+locale);
 assert.deepEqual(json(now.ChlohaLocaleCatalog[locale]),json(before.ChlohaLocaleCatalog[locale]),'Existing UI catalog preserved: '+locale);
 assert.deepEqual(json(now.ChlohaFeedbackLocales.catalogs[locale]),json(before.ChlohaFeedbackLocales.catalogs[locale]),'Existing feedback catalog preserved: '+locale);
 assert.equal(now.ChlohaLocales.browserLocale(locale),locale);
}
assert.deepEqual(Object.keys(now.ChlohaLocaleCatalog).sort(),[...locales].sort());
for(const locale of locales){
 assert.deepEqual(Object.keys(now.ChlohaLocaleCatalog[locale]).sort(),Object.keys(now.ChlohaLocaleCatalog.ja).sort());
 for(const [key,value] of Object.entries(now.ChlohaLocaleCatalog[locale]))assert.ok(typeof value==='string'&&value.trim(),locale+'/'+key+' own translation');
}
assert.deepEqual(json(now.ChlohaNameSearch.supported),locales);
const fixture=[
 {id:'species-1',category:'pokemon',names:{ja:'ピカチュウ',en:'Pikachu',es:'Pikachu','es-LA':'Pikachu'},aliases:['025']},
 {id:'move-33',category:'moves',names:{ja:'たいあたり',en:'Tackle',es:'Placaje','es-LA':'Tacleada'},aliases:['tackle']},
 {id:'ability-test',category:'abilities',names:{es:'Nombre español','es-LA':'Nombre regional'},aliases:[]},
 {id:'item-test',category:'items',names:{es:'Objeto español','es-LA':'Objeto regional'},aliases:[]}
];
// The two synthetic labels test canonical ID routing, not game translation accuracy.
const index=now.ChlohaNameSearch.buildIndex(fixture);
for(const [category,query,id] of [['pokemon','PIKÁCHU','species-1'],['moves','TACLEADA','move-33'],['moves','placaje','move-33'],['abilities','nombre-regional','ability-test'],['items','OBJETO REGIONAL','item-test']])assert.deepEqual(json(now.ChlohaNameSearch.search(index,category,query)),[id]);
const C=now.ChlohaFeedbackContract,L=now.ChlohaFeedbackLocales;
assert.deepEqual(json(C.locales),locales);assert.equal(C.categories.length,4);assert.equal(C.statuses.length,5);
for(const locale of locales){
 assert.deepEqual(Object.keys(L.catalogs[locale]).sort(),[...L.keys].sort());
 for(const key of L.keys){assert.ok(L.catalogs[locale][key].trim());assert.equal(L.text(locale,key),L.catalogs[locale][key]);if(locale!=='ja')assert.ok(!/[\u3040-\u30ff]/.test(L.catalogs[locale][key]),locale+'/'+key+' contains Japanese kana');}
}
const input=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/v0184-public-baseline.json'))).cases.find(x=>x.name==='neutral').input;
const sample={schemaVersion:1,appVersion:'v0.184 Pre-Release 30',engineVersion:'0.184',locale:'es-LA',selection:{attacker:'garchomp',defender:'tyranitar',move:'earthquake'},controls:{dbAttNature:'neutral',power:'100',critical:false},engineInput:input,result:{minimumDamage:1,maximumDamage:100,koProbability:null}};
const serialized=JSON.stringify(sample);vm.runInContext('sample=JSON.parse('+JSON.stringify(serialized)+')',now);
assert.equal(C.validateSnapshot(now.sample),true,'ES-LA snapshot is recognized');assert.equal(JSON.stringify(now.sample),serialized,'Validation is immutable');
for(const mutation of ["sample.email='private@example.test'","sample.controls.feedbackEmail='private@example.test'","sample.controls.pokemonSearch='private query'","sample.controls.dbAttPokemon='private@example.test'","sample.engineInput.ip='127.0.0.1'","sample.result.rawTrace='<script>bad</script>'","sample.engineInput.attack=NaN","sample.locale='es-XX'"]){vm.runInContext('sample=JSON.parse('+JSON.stringify(serialized)+');'+mutation,now);assert.equal(C.validateSnapshot(now.sample),false,mutation);}
assert.ok(!fs.readFileSync(path.join(root,'feedback-ui-v0185.js'),'utf8').includes('localStorage'),'Private feedback remains outside automatic persistence');
for(const file of ['tests/v0183-locale-registry.cjs','tests/v0183-locale-name-search.cjs','tests/v0183-nine-locale-browser.cjs','tests/v0183-nine-locale-roundtrip.cjs','tests/v0185-feedback-contract.cjs','tests/v100-stable-ui.cjs'])assert.equal(fs.readFileSync(path.join(root,file),'utf8'),old(file),'Historical acceptance assertions must not be rewritten: '+file);
const evidence={baseline,locales,previousCatalogsUnchanged:true,canonicalSearchRouting:true,privateSnapshotAllowlist:true,historicalAssertionsUnchanged:true,passed:true};
fs.mkdirSync(path.join(root,'reports/v110'),{recursive:true});fs.writeFileSync(path.join(root,'reports/v110/locale-contract.json'),JSON.stringify(evidence,null,2)+'\n');
console.log('PASS v1.1.0 ten-locale contract: regional identity/HTML locale, unchanged nine dictionaries, canonical search, ten feedback catalogs and private snapshot rejection');
