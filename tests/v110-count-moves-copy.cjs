'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const sandbox={module:{exports:{}}};vm.runInNewContext(fs.readFileSync('locale-quality-v0188.js','utf8'),sandbox);
const api=sandbox.module.exports;
let cases=0;
for(const locale of api.locales)for(const spec of api.countSpecs)for(let n=0;n<=spec.max;n++){
 const copy=api.countCopy(locale,spec,n);
 assert.ok(copy.title&&copy.count&&copy.power);
 assert.ok(copy.power.includes(String(50+50*n)));
 if(locale!=='ja')assert.ok(!/[ぁ-ゖァ-ヺ]/u.test(copy.title+copy.count+copy.power));
 cases++;
}
for(const locale of api.locales){
 assert.equal(api.countCopy(locale,api.countSpecs[1],99).power,api.countCopy(locale,api.countSpecs[1],6).power);
 for(let n=1;n<=3;n++)assert.ok(api.stockpile(locale,n).power.includes(String(n*100)));
}
console.log('PASS count UI copy',cases,'localized count states; capped restored hits and Spit Up retained');
