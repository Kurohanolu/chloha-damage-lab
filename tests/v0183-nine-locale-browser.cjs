'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const selector=page.locator('#chloha-locale');
  const supported=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
  assert.deepEqual(await selector.locator('option').evaluateAll(nodes=>nodes.map(n=>n.value)),supported);
  const move=page.locator('#moveSearch');
  const results=page.locator('#moveSuggestions [role="option"]');
  for(const [code,query,label] of [['fr','Séisme','Séisme'],['de','Erdbeben','Erdbeben'],['ko','지진','지진'],['zh-Hans','地震','地震'],['en','Earthquake','Earthquake'],['ja','じしん','じしん']]){
   await selector.selectOption(code);
   assert.equal(await page.locator('html').getAttribute('lang'),code);
   assert.equal(await page.evaluate(()=>window.ChlohaLocale.get()),code);
   await move.fill(query);
   const text=await results.allTextContents();
   assert.ok(text.some(t=>t.includes(label)),code+': '+JSON.stringify(text));
  }
  console.log('PASS v0.183 nine-language selector and search roundtrip');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
