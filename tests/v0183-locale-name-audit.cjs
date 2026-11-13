'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{}};
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-name-audit.js']){
 vm.runInNewContext(fs.readFileSync(require.resolve('../'+file),'utf8'),context);
}
const audit=context.ChlohaNameLocaleAudit.audit;
const catalog=context.window.ChlohaNames;
const translations=context.ChlohaLocalizedNames;
const combined=Object.fromEntries(['pokemon','moves','abilities','items'].map(category=>[category,{...context.ChlohaPokeAPILocalizedNames[category],...translations[category]}]));
const result=audit(catalog,combined);
assert.equal(result.ok,true,JSON.stringify(Array.from(result.issues)));
assert.ok(Object.values(result.counts).reduce((sum,c)=>sum+c.records,0)>2500);
assert.ok(result.counts.moves.localized>=9);
assert.ok(result.counts.pokemon.localized>=9);
for(const locale of Array.from(context.ChlohaNameLocaleAudit.locales)){
 assert.ok(result.coverage.moves[locale].translated>=1);
 assert.ok(result.coverage.pokemon[locale].translated>=1);
 assert.ok(result.coverage.moves[locale].total>=1);
}
assert.ok(result.counts.abilities.localized>=9);
assert.ok(result.counts.items.localized>=9);
for(const locale of Array.from(context.ChlohaNameLocaleAudit.locales)){
 assert.ok(result.coverage.abilities[locale].translated>=1);
 assert.ok(result.coverage.items[locale].translated>=1);
}
const bad=audit(catalog,{moves:{'missing-id':{fr:'test'},'かえんほうしゃ':{xx:'wrong',en:'Not Flamethrower',ja:''}}});
assert.equal(bad.ok,false);
for(const code of ['unknown-id','unsupported-locale','english-mismatch','empty-name']){
 assert.ok(Array.from(bad.issues).some(x=>x.includes(code)),code);
}
console.log('PASS v0.183 locale name integrity audit');
