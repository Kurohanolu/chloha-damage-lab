'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{}};
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js']){
 vm.runInNewContext(fs.readFileSync(require.resolve('../'+file),'utf8'),context);
}
for(const file of ['locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js']){
 vm.runInNewContext(fs.readFileSync(require.resolve('../'+file),'utf8'),context);
}
const names=context.window.ChlohaNames;
const adapter=context.ChlohaNameCatalogAdapter;
const search=context.ChlohaNameSearch;
const records=Array.from(adapter.recordsFrom(names));
assert.ok(records.length>100,'Expected bulk catalog, got '+records.length);
for(const category of ['pokemon','moves','abilities','items'])assert.ok(records.some(x=>x.category===category),'Missing '+category);
const index=adapter.build(names,search,context.ChlohaLocalizedNames);
assert.deepEqual(Array.from(search.search(index,'moves','かえんほうしゃ')),['かえんほうしゃ']);
assert.ok(search.search(index,'moves','Flamethrower').includes('かえんほうしゃ'));
assert.ok(search.search(index,'pokemon','Charizard').length>0);
assert.ok(search.search(index,'abilities','Intimidate').length>0);
assert.ok(search.search(index,'items','Life Orb').length>0);
for(const name of Object.values(context.ChlohaLocalizedNames.moves['かえんほうしゃ']))assert.ok(search.search(index,'moves',name).includes('かえんほうしゃ'),'Missing translation '+name);
for(const name of Object.values(context.ChlohaLocalizedNames.pokemon.candidate093_01))assert.ok(search.search(index,'pokemon',name).includes('candidate093_01'),'Missing Pokémon translation '+name);
for(const category of ['abilities','items']){
 const [id,translations]=Object.entries(context.ChlohaLocalizedNames[category])[0];
 for(const name of Object.values(translations))assert.ok(search.search(index,category,name).includes(id),'Missing '+category+' translation '+name);
}
assert.deepEqual(Array.from(search.search(index,'moves','')),[]);
console.log('PASS v0.183 existing bulk name catalog adapter: '+records.length+' records');
