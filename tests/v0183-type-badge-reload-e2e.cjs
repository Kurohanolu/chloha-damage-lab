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
  const locales=['en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
  await page.locator('#dbAttPokemon').evaluate(el=>{el.value='dragapult';el.dispatchEvent(new Event('change',{bubbles:true}));});
  for(const locale of locales){
   await page.locator('#chloha-locale').selectOption(locale);
   await page.waitForFunction(()=>document.querySelector('#dbAttPokemon')?.value==='dragapult'&&document.querySelectorAll('#attTypes .type-pill').length===2);
   const before=await page.locator('#attTypes .type-pill').allTextContents();
   assert.equal(before.length,2,'missing type badges '+locale);
   await page.reload();
   assert.equal(await page.locator('#chloha-locale').inputValue(),locale,'locale lost on reload '+locale);
   await page.locator('#dbAttPokemon').evaluate(el=>{el.value='dragapult';el.dispatchEvent(new Event('change',{bubbles:true}));});
   await page.waitForFunction(expected=>{
    const badges=[...document.querySelectorAll('#attTypes .type-pill')].map(el=>el.textContent.trim());
    return badges.length===expected.length&&badges.every((value,i)=>value===expected[i]);
   },before,{timeout:10000});
   const after=await page.locator('#attTypes .type-pill').allTextContents();
   assert.deepEqual(after,before,'type badges changed language on reload '+locale+': '+JSON.stringify({before,after}));
   assert.ok(!after.includes('ドラゴン')&&!after.includes('ゴースト'),'Japanese type badges leaked after reload '+locale);
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS: Pokémon type badges retain all eight non-Japanese locales after reload');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
