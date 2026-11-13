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
const screenshotStart=source.indexOf('const screenshotLocalePhrases=');
const screenshotEnd=source.indexOf('const localeUiPhrases=',screenshotStart);
assert.ok(screenshotStart>0&&screenshotEnd>screenshotStart,'screenshot locale catalog missing');
const screenshotContext={};
vm.runInNewContext(source.slice(screenshotStart,screenshotEnd)+'\nthis.screenshot=screenshotLocalePhrases;',screenshotContext);
for(const lang of ['ko','zh-Hans','zh-Hant']){
 for(const label of ['Stat points: 0–32 per stat, 66 total maximum. Blank means zero. Disable auto-fill to edit stats, types and power.','Level (fixed at 50)','Move power','Attack / Sp. Atk stat','Defense / Sp. Def stat','Move type','Move category','Type 1','Type 2','The 373 Pokémon and 335 moves include candidates. Learnsets are unverified. Unsupported abilities stop calculation. Complex interactions, Terastallization and hardware rounding order remain unverified.']){
  assert.ok(screenshotContext.screenshot[label]?.[lang],lang+' missing '+label);
 }
}
console.log('PASS v0.183 damage result phrase catalog across seven additional languages');
