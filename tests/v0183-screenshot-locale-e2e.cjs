'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const selector=page.locator('#chloha-locale');
  const labels=['Level (fixed at 50)','Move power','Attack / Sp. Atk stat','Defense / Sp. Def stat','Move type','Move category','Type 1','Type 2'];
  const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
  const sequences=[
   ['ja','en','ko','zh-Hans','fr','ja'],
   ['fr','es','de','it','zh-Hant','ko','en','ja'],
   ['zh-Hans','zh-Hant','es','ko','it','de','fr','en','ja']
  ];
  const expected=await page.evaluate(labels=>{
   const catalog=window.ChlohaLocale;
   const output={};
   for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant']){
    catalog.set(locale);
    output[locale]=labels.map(label=>catalog.text(label));
   }
   return output;
  },labels);
  for(const locale of locales.slice(2)){
   for(const [i,label] of labels.entries()){
    if(!(['Type 1','Type 2'].includes(label)&&['fr','es','it'].includes(locale)))
     assert.notEqual(expected[locale][i],label,'untranslated '+locale+' '+label);
   }
  }
  for(const sequence of sequences){
   for(const locale of sequence){
    await selector.selectOption(locale);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    const actual=await page.evaluate(labels=>labels.map(label=>window.ChlohaLocale.text(label)),labels);
    assert.deepEqual(actual,expected[locale],'translation changed after locale hops: '+locale);
    assert.equal(await page.locator('#chloha-locale').inputValue(),locale);
   }
  }
  await selector.selectOption('zh-Hans');
  await page.reload();
  assert.equal(await page.locator('#chloha-locale').inputValue(),'zh-Hans','reload lost selected language');
  assert.equal(await page.locator('html').getAttribute('lang'),'zh-Hans');
  assert.deepEqual(errors,[],'browser errors after repeated language switching');
  console.log('PASS screenshot label translation, multi-hop switching and reload persistence');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
