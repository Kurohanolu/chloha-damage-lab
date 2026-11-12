'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').waitFor();
  const check=async(locale,expected)=>{
   await page.locator('#chloha-locale').selectOption(locale);
   const result=await page.evaluate(()=>{
    const s=document.querySelector('#dragonDartsHits');
    return [...s.options].map(o=>({text:o.textContent,label:o.label}));
   });
   assert.deepEqual(result.map(x=>x.text),expected,locale+' text');
   assert.deepEqual(result.map(x=>x.label),expected,locale+' Android native labels');
   for(const id of ['dragonDartsPanel','flingPowerPanel','beatUpPanel']){
    const label=await page.locator('#'+id).evaluate(el=>el.firstChild?.nodeValue||'');
    assert.ok(locale==='ja'?/[ぁ-んァ-ン一-龯]/.test(label):!/[ぁ-んァ-ン一-龯]/.test(label),id+' panel language '+locale+': '+label);
   }
  };
  await check('ja',['選択した相手に2回命中','選択した相手に1回命中']);
  await check('en',['2 hits on selected target','1 hit on selected target']);
  await check('ja',['選択した相手に2回命中','選択した相手に1回命中']);
  console.log('PASS Dragon Darts native select JA/EN/JA');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
