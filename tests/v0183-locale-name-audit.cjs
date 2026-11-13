'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{}};
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-v0183.js','locale-name-audit.js']){
 vm.runInNewContext(fs.readFileSync(require.resolve('../'+file),'utf8'),context);
}
const audit=context.ChlohaNameLocaleAudit.audit;
const catalog=context.window.ChlohaNames;
const translations=context.ChlohaLocalizedNames;
const result=audit(catalog,translations);
assert.equal(result.ok,true,JSON.stringify(Array.from(result.issues)));
assert.equal(result.counts.moves.localized,9);
assert.equal(result.counts.pokemon.localized,9);
for(const locale of Array.from(context.ChlohaNameLocaleAudit.locales)){
 assert.equal(result.coverage.moves[locale].translated,1);
 assert.equal(result.coverage.pokemon[locale].translated,1);
 assert.ok(result.coverage.moves[locale].total>=1);
}
assert.equal(result.counts.abilities.localized,9);
assert.equal(result.counts.items.localized,9);
for(const locale of Array.from(context.ChlohaNameLocaleAudit.locales)){
 assert.equal(result.coverage.abilities[locale].translated,1);
 assert.equal(result.coverage.items[locale].translated,1);
}
const bad=audit(catalog,{moves:{'missing-id':{fr:'test'},'かえんほうしゃ':{xx:'wrong',en:'Not Flamethrower',ja:''}}});
assert.equal(bad.ok,false);
for(const code of ['unknown-id','unsupported-locale','english-mismatch','empty-name']){
 assert.ok(Array.from(bad.issues).some(x=>x.includes(code)),code);
}
console.log('PASS v0.183 locale name integrity audit');
