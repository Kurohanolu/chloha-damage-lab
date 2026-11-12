'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const moves=[['gw0169_p040','けたぐり'],['gw0169_s016','くさむすび'],['gw0170_u033','ヘビーボンバー'],['gw0170_u023','ヒートスタンプ']];
  await page.locator('#attSearch').fill('メガガブリアスZ');
  await page.locator('#attSuggestions').getByRole('option',{name:'メガガブリアスZ',exact:true}).click();
  await page.locator('#defSearch').fill('メガルカリオZ');
  await page.locator('#defSuggestions').getByRole('option',{name:'メガルカリオZ',exact:true}).click();
  await page.locator('.move-list-fallback summary').click();
  for(const [id,name] of moves){
   await page.locator('#dbMove').selectOption(id);
   const state=await page.evaluate(()=>({power:Number(document.querySelector('#power').value),status:document.querySelector('#dbStatus').textContent,rolls:window.ChlohaLastCalculation?.r?.rolls}));
   const expected=await page.evaluate(n=>window.ChlohaWeightPower.weightDependentPower(n,window.ChlohaPokemonWeights.mega_garchomp_z,window.ChlohaPokemonWeights.mega_lucario_z),name);
   assert.equal(state.power,expected,name+' power');
   assert.ok(state.rolls?.length===16,name+' damage rolls');
   assert.match(state.status,/威力/,name+' status');
   console.log('PASS v0.181 browser',name,'power',state.power,'rolls',state.rolls[0],state.rolls[15]);
  }
  assert.deepEqual(errors,[],'No browser script errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
