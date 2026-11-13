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
  const locale=page.locator('#chloha-locale');
  for(const [code,none] of [['es','Ninguno'],['fr','Aucun'],['de','Keine'],['ko','없음'],['zh-Hans','无'],['zh-Hant','無'],['ja','なし']]){
   await locale.selectOption(code);
   const option=await page.locator('#weather option[value="none"]').textContent();
   assert.equal(option,none,code+' weather option');
   assert.equal(await page.locator('html').getAttribute('lang'),code);
  }
  assert.deepEqual(errors,[],'No browser JS errors');
  console.log('PASS v0.183 native weather option localization roundtrip');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
