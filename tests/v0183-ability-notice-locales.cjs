'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../i18n.js'),'utf8');
const a=source.indexOf('const localeUiPhrases='),b=source.indexOf('// Verdicts are UI-only:',a);
assert.ok(a>0&&b>a);
const ctx={};vm.runInNewContext(source.slice(a,b)+'\nthis.phrases=localeUiPhrases;',ctx);
const notices=['Punk Rock:','Tough Claws:','Reckless:','Analytic:'];
for(const notice of notices){
 const key=Object.keys(ctx.phrases).find(k=>k.startsWith(notice));
 assert.ok(key,notice);
 for(const lang of ['fr','de','es','it','ko','zh-Hans','zh-Hant']){
  assert.ok(ctx.phrases[key][lang]?.length>30,notice+' '+lang);
  assert.match(ctx.phrases[key][lang],/1[.,][23]/,notice+' modifier '+lang);
 }
}
console.log('PASS ability notice translations across seven additional languages');
