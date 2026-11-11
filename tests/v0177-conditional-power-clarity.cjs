const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.waitForFunction(()=>document.querySelector('#dbMove')?.options.length>0);
  const outcome=await page.evaluate(()=>{
   const get=()=>({state:document.querySelector('#conditionalPowerState').textContent,detail:document.querySelector('#conditionalPowerDetail').textContent});
   const move=document.querySelector('#dbMove'),check=document.querySelector('#conditionalPower');
   const facade=[...move.options].find(o=>o.textContent.startsWith('からげんき'));
   if(!facade)throw Error('Facade not in move list');
   move.value=facade.value;move.dispatchEvent(new Event('change',{bubbles:true}));
   const off=get();
   check.checked=true;check.dispatchEvent(new Event('change',{bubbles:true}));
   const on=get();
   return {off,on};
  });
  assert.match(outcome.off.state,/70 → 70/);
  assert.match(outcome.on.state,/70 → 140/);
  assert.match(outcome.on.detail,/手動指定/);
  console.log('PASS conditional power display',outcome);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
