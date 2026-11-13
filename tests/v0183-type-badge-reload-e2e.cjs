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
   await page.waitForFunction(()=>{
    const badges=[...document.querySelectorAll('#attTypes .type-pill')];
    return document.querySelector('#dbAttPokemon')?.value==='dragapult'&&badges.length===2&&badges[0].dataset.jaType==='ドラゴン'&&badges[1].dataset.jaType==='ゴースト';
   });
   await page.waitForFunction(()=>[...document.querySelectorAll('#attTypes .type-pill')].every(el=>el.textContent.trim()===(window.ChlohaLocale?.typeName?.(el.dataset.jaType)||el.dataset.jaType)));
   const before=await page.locator('#attTypes .type-pill').allTextContents();
   assert.equal(before.length,2,'missing type badges '+locale);
   await page.reload();
   assert.equal(await page.locator('#chloha-locale').inputValue(),locale,'locale lost on reload '+locale);
   await page.locator('#dbAttPokemon').evaluate(el=>{el.value='dragapult';el.dispatchEvent(new Event('change',{bubbles:true}));});
   await page.waitForFunction(expected=>{
    const badges=[...document.querySelectorAll('#attTypes .type-pill')].map(el=>el.textContent.trim());
    const nodes=[...document.querySelectorAll('#attTypes .type-pill')];
    return document.querySelector('#dbAttPokemon')?.value==='dragapult'&&nodes.length===2&&nodes[0].dataset.jaType==='ドラゴン'&&nodes[1].dataset.jaType==='ゴースト'&&badges.length===expected.length&&badges.every((value,i)=>value===expected[i]);
   },before,{timeout:20000}).catch(async error=>{const snapshot=await page.evaluate(()=>({locale:document.querySelector('#chloha-locale')?.value,pokemon:document.querySelector('#dbAttPokemon')?.value,badges:[...document.querySelectorAll('#attTypes .type-pill')].map(el=>({text:el.textContent,jaType:el.dataset.jaType,expected:window.ChlohaLocale?.typeName?.(el.dataset.jaType)}))}));throw new Error('type reload '+locale+' '+JSON.stringify(snapshot)+' '+error.message);});
   const after=await page.locator('#attTypes .type-pill').allTextContents();
   assert.deepEqual(after,before,'type badges changed language on reload '+locale+': '+JSON.stringify({before,after}));
   assert.ok(!after.includes('ドラゴン')&&!after.includes('ゴースト'),'Japanese type badges leaked after reload '+locale);
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS: Pokémon type badges retain all eight non-Japanese locales after reload');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
