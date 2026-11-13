'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const cases=[
   ['だいばくはつ','Explosion'],
   ['だいちのちから','Earth Power'],
   ['じしん','Earthquake']
  ];
  for(const [ja,en] of cases){
   for(const locale of ['en','fr','de','es','it','ko','zh-Hans','zh-Hant']){
    await page.locator('#chloha-locale').selectOption(locale);
    const actual=await page.evaluate(name=>window.ChlohaLocale.text('Garchomp '+name+' (165) → Tyranitar (130 / HP 175)'),ja);
    const registry=await page.evaluate(name=>{
     const table=window.ChlohaPokeAPILocalizedNames?.moves||{};
     return Object.values(table).find(row=>row?.ja===name)||null;
    },ja);
    assert.ok(registry,'missing move registry for '+ja);
    const expected=registry[locale]||registry.en;
    assert.ok(actual.includes(' '+expected+' (165)'),'untranslated move '+locale+' '+ja+': '+actual);
    assert.ok(!actual.includes(' '+ja+' (165)'),'Japanese move leaked '+locale+' '+ja);
    if(locale==='en')assert.ok(actual.includes(' '+en+' (165)'),ja+' English spelling mismatch: '+actual);
   }
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS battle result summaries translate three moves across eight non-Japanese locales');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
