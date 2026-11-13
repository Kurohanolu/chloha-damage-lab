'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').resolve(__dirname,'../i18n.js'),'utf8');
const start=source.indexOf('const localeUiPhrases=');
const end=source.indexOf('\nfunction localizedUi(',start);
assert.ok(start>0&&end>start);
const vm=require('node:vm');
const ctx={};vm.runInNewContext(source.slice(start,end)+'\nthis.phrases=localeUiPhrases;',ctx);
for(const label of ['Guaranteed survival','Damage relative to max HP','Final damage','Normal damage','Critical hit damage ×1.5','No matching moves','No matching Pokémon']){
 for(const locale of ['fr','de','es','it','ko','zh-Hans','zh-Hant']){
  assert.ok(ctx.phrases[label]?.[locale],label+' missing '+locale);
 }
}
console.log('PASS v0.183 damage result phrase catalog across seven additional languages');
