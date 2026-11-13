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
for(const lang of ['fr','de','es','it','ko','zh-Hans','zh-Hant']){
 for(const label of ['Stat points: 0–32 per stat, 66 total maximum. Blank means zero. Disable auto-fill to edit stats, types and power.','Level (fixed at 50)','Move power','Attack / Sp. Atk stat','Defense / Sp. Def stat','Move type','Move category','Type 1','Type 2','The 373 Pokémon and 335 moves include candidates. Learnsets are unverified. Unsupported abilities stop calculation. Complex interactions, Terastallization and hardware rounding order remain unverified.']){
  assert.ok(screenshotContext.screenshot[label]?.[lang],lang+' missing '+label);
 }
}
const normalizerStart=source.indexOf('const reverseLocalePhrases=new Map();');
const normalizerEnd=source.indexOf('const original=new WeakMap();',normalizerStart);
assert.ok(normalizerStart>0&&normalizerEnd>normalizerStart,'locale rerender normalization missing');
const normalizerCode=source.slice(normalizerStart,normalizerEnd);
assert.ok(normalizerCode.includes('recoverJapanese(source||value)'),'rerendered translations must recover canonical source');
assert.ok(source.includes('original.set(node,normalizeFreshLocaleText(trim))'),'DOM rerenders must normalize translated text');
assert.ok(source.includes('normalizeFreshLocaleText(value)'),'translated attributes must normalize too');
// Execute real locale transitions for the dynamic HP summary rather than
// merely checking that the implementation contains a normalizer.
const liveStart=source.indexOf('function localizedLiveSummary(');
const liveEnd=source.indexOf('const localizedTypeNames=',liveStart);
assert.ok(liveStart>0&&liveEnd>liveStart);
const liveContext={localeUiPhrases:ctx.phrases};
vm.runInNewContext(source.slice(liveStart,liveEnd)+'\nthis.live=localizedLiveSummary;',liveContext);
const orders=[
 ['ja','en','ko','zh-Hans','fr','ja'],
 ['fr','es','de','it','zh-Hant','ko','en','ja'],
 ['zh-Hans','zh-Hant','es','ko','it','de','fr','en','ja']
];
for(const order of orders){
 let value='最大HPに対する割合：61.7–73.1%';
 for(const lang of order){
  value=liveContext.live(value,lang);
  const prefix=lang==='ja'?'最大HPに対する割合：':lang==='en'?'Of max HP:':ctx.phrases['Of max HP:'][lang];
  assert.ok(value.startsWith(prefix+' ' )||value.startsWith(prefix+'61'),lang+' wrong prefix: '+value);
  assert.ok(value.includes('61.7–73.1%'),lang+' lost damage percentage');
 }
 assert.equal(value,'最大HPに対する割合：61.7–73.1%');
}
console.log('PASS v0.183 damage result phrase catalog across seven additional languages');
