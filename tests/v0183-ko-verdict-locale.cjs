'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../i18n.js'),'utf8');
const a=source.indexOf('const localeUiPhrases='),b=source.indexOf('// Numeric damage ranges',a);
assert.ok(a>0&&b>a);
const ctx={};vm.runInNewContext(source.slice(a,b)+'\nthis.verdict=localizedVerdict;',ctx);
for(const locale of ['fr','de','es','it','ko','zh-Hans','zh-Hant']){
 for(const verdict of ['確定KO','乱数KO','ダメージなし','対象はすでにひんし']){
  const translated=ctx.verdict(verdict,locale);
  assert.ok(translated&&translated!==verdict,locale+' '+verdict);
 }
 const detail=ctx.verdict('現在HP 145 / KO率 43.75%',locale);
 assert.ok(detail.includes('145')&&detail.includes('43.75%')&&!detail.includes('現在HP'),locale+' detail');
 const mini=ctx.verdict('乱数KO · 43.75%',locale);
 assert.ok(mini.includes('43.75%')&&!mini.includes('乱数KO'),locale+' mini');
}
assert.equal(ctx.verdict('現在HP 145 / KO率 43.75%','ja'),'現在HP 145 / KO率 43.75%');
assert.equal(ctx.verdict('確定KO','en'),'Guaranteed KO');
console.log('PASS v0.183 KO verdict labels and numeric detail across nine languages');
