'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const reference=require('./v0188-locale-reference.json'),context={window:{}};
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js']){
 vm.runInNewContext(fs.readFileSync(require.resolve('../'+file),'utf8'),context);
}
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const localized=Object.fromEntries(['pokemon','moves','abilities','items'].map(category=>[category,{...context.ChlohaPokeAPILocalizedNames[category],...context.ChlohaLocalizedNames[category]}]));
const index=context.ChlohaNameCatalogAdapter.build(context.window.ChlohaNames,context.ChlohaNameSearch,localized);
let checks=0;
for(const record of reference.cases){
 assert.equal(Object.keys(record.names).length,9,'upstream reference must cover every supported locale');
 for(const locale of locales){
  const actual=localized[record.category][record.key]?.[locale];
  assert.equal(actual,record.names[locale],record.category+'/'+record.key+'/'+locale+' differs from pinned external reference');
  assert.ok(context.ChlohaNameSearch.search(index,record.category,record.names[locale]).includes(record.key),'multilingual lookup failed: '+record.key+'/'+locale);
  checks++;
 }
}
assert.equal(reference.officialCrossCheck.verified.name,localized.pokemon.garchomp.ja);
const typeSource=fs.readFileSync(require.resolve('../i18n.js'),'utf8');
const typeNames=JSON.parse(typeSource.match(/const localizedTypeNames=(\{[^;]+\});/)[1]);
for(const [type,expected] of Object.entries(reference.types))for(const locale of locales){
 assert.equal(locale==='ja'?type:typeNames[type][locale],expected[locale],'external type name: '+type+'/'+locale);
}
console.log('PASS v0.188 independent upstream representative name and multilingual-search reference: '+checks+' names; '+reference.sourceCommit);

