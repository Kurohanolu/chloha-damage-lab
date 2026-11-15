'use strict';
// Validate provenance independently of display availability. A fallback is not
// an ES-LA translation, and a third-party ZA record is not official Champions.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const c=vm.createContext({});vm.runInContext('window=globalThis',c);for(const file of ['locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file});
const D=c.ChlohaEsLaData,A=c.ChlohaEsLa,sources=new Map(D.sources.map(source=>[source.id,source]));
assert.equal(D.locale,'es-LA');assert.equal(D.browserLocale,'es-419');assert.equal(D.sourceSha256,crypto.createHash('sha256').update(fs.readFileSync('docs/data/v110-es-la-source-records.json')).digest('hex'),'Generated provenance must correspond to exact reviewed source records');
const counts={};
for(const [category,records] of Object.entries(D.entries)){
 const count=counts[category]={total:0,official:0,'verified-secondary':0,provisional:0,unverified:0,fallback:0};
 for(const [key,record] of Object.entries(records)){
  assert.ok(typeof record.name==='string'&&record.name.trim(),category+'/'+key);assert.ok(['official','verified-secondary','provisional','unverified'].includes(record.status));count.total++;count[record.status]++;if(record.fallback)count.fallback++;
  assert.equal(A.entity(category,key,'fallback'),record.name);assert.deepEqual(JSON.parse(JSON.stringify(A.metadata(category,key))),JSON.parse(JSON.stringify(record)));
  assert.ok(Array.isArray(record.canonicalIds)&&record.canonicalIds.length,'Every name maps to canonical IDs');
  for(const id of record.sourceIds)assert.ok(sources.has(id),'Known provenance source '+id);
  if(['official','verified-secondary'].includes(record.status)){assert.ok(record.sourceIds.length,'Attestation needs sources');assert.equal(record.fallback,false,'Displayed fallback is not verified translation');}
  if(record.status==='official')assert.ok(record.sourceIds.some(id=>sources.get(id).authority==='official'),'Official classification needs primary-source authority');
  if(record.officialChampions){assert.equal(record.status,'official');assert.equal(record.targetGame,'Pokémon Champions');assert.ok(record.sourceIds.some(id=>sources.get(id).authority==='official'&&sources.get(id).targetGame==='Pokémon Champions'));}
  if(record.fallback){assert.ok(['provisional','unverified'].includes(record.status));assert.equal(record.officialChampions,false);}
 }
 assert.equal(count.total,count.official+count['verified-secondary']+count.provisional+count.unverified);
}
for(const [category,key,name,status] of [['moves','のしかかり','Golpe de Cuerpo','verified-secondary'],['moves','フレアドライブ','Erupción','official'],['abilities','ちょすい','Absorbeagua','verified-secondary'],['items','いのちのたま','Vidaesfera','verified-secondary'],['pokemon','gw092_05','Emboar','official']]){
 assert.equal(A.entity(category,key,null),name,'Independently transcribed source witness');assert.equal(A.metadata(category,key).status,status);
}
const missing='not-a-canonical-entity';assert.equal(A.entity('moves',missing,'Spain fallback'),'Spain fallback');assert.equal(A.metadata('moves',missing),null,'Unknown fallback may not gain an attestation');
assert.equal(counts.types.total,18,'All 18 type records accounted for');
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/source-contract.json',JSON.stringify({checkedAt:D.checkedAt,sourceSha256:D.sourceSha256,counts,physicalGameVerified:false,passed:true},null,2)+'\n');
console.log('PASS v1.1.0 provenance: exact source hash, canonical IDs, status/source distinctions, fallback exclusions and independently transcribed regional witnesses');
