'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('.move-list-fallback summary').click();
  await page.locator('#dbMove').selectOption('gw0169_s040');
  await page.locator('#spitUpPanel').waitFor({state:'visible'});
  for(const [count,power] of [[1,100],[2,200],[3,300],[1,100]]){
   await page.locator('#spitUpPanel [data-stockpile="'+count+'"]').click();
   const state=await page.evaluate(()=>({power:Number(document.querySelector('#power').value),rolls:window.ChlohaLastCalculation?.r?.rolls,pressed:[...document.querySelectorAll('#spitUpPanel [data-stockpile]')].filter(x=>x.getAttribute('aria-pressed')==='true').map(x=>x.dataset.stockpile),error:document.querySelector('#error').textContent}));
   assert.equal(state.power,power,'stockpile '+count+' power');
   assert.deepEqual(state.pressed,[String(count)],'selected button');
   assert.equal(state.rolls?.length,16,'16 damage rolls');
   assert.ok(state.rolls[0]>0,'nonzero damage');
   assert.ok(!state.error,'no error: '+state.error);
  }
  await page.locator('#dbMove').selectOption('flamethrower');
  assert.equal(await page.locator('#spitUpPanel').isVisible(),false,'hide on other moves');
  await page.locator('#dbMove').selectOption('gw0169_s040');
  assert.equal(Number(await page.locator('#power').inputValue()),100,'reset to one stack on reselect');
  assert.deepEqual(errors,[],'no browser exceptions');
  console.log('PASS Spit Up stockpile 1/2/3 controls, 16 rolls, reset and hide');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
