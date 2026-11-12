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
  await page.locator('#dbMove').waitFor({state:'attached'});
  const outcome=await page.evaluate(()=>{
   const move=[...document.querySelector('#dbMove').options].find(o=>o.textContent.includes('ふくろだたき'));
   if(!move)throw Error('Beat Up missing');
   const select=document.querySelector('#dbMove');
   select.value=move.value;select.dispatchEvent(new Event('input',{bubbles:true}));
   const input=document.querySelector('#beatUpStats');
   const initial={visible:!document.querySelector('#beatUpPanel').hidden,mechanic:window.ChlohaMoveMechanic,output:!document.querySelector('#output').hidden};
   const sample=(value)=>{
    input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));
    const last=window.ChlohaLastCalculation;
    return {error:document.querySelector('#error').hidden?'':document.querySelector('#error').textContent,
     visible:!document.querySelector('#output').hidden,
     powers:last?.r?.hitRolls?.length,
     distribution:last?.r?.multiHitDistribution?[...last.r.multiHitDistribution]:null,
     attack:last?.a?.attack,basePower:last?.a?.power};
   };
   const one=sample('100'),three=sample('100,120,80'),six=sample('10,20,30,40,50,60');
   const invalid=[sample(''),sample('0'),sample('100,120,80,90,110,130,140'),sample('abc')];
   return {initial,one,three,six,invalid};
  });
  assert.equal(outcome.initial.visible,true,JSON.stringify(outcome));
  assert.equal(outcome.initial.mechanic,'beatUpManual',JSON.stringify(outcome));
  for(const [key,hits] of [['one',1],['three',3],['six',6]]){
   const result=outcome[key];
   assert.equal(result.error,'',key+': '+JSON.stringify(result));
   assert.equal(result.visible,true,key+': '+JSON.stringify(result));
   assert.equal(result.powers,hits,key+': '+JSON.stringify(result));
   assert.ok(result.distribution&&result.distribution.length>0,key+': distribution');
   assert.ok(Math.abs(result.distribution.reduce((sum,entry)=>sum+entry[1],0)-1)<1e-8,key+': mass');
  }
  for(const result of outcome.invalid)assert.ok(result.error.length>0&&!result.visible,'invalid input must block calculation: '+JSON.stringify(result));
  await page.locator('#chloha-locale').selectOption('en');
  assert.equal(await page.locator('#beatUpStats').getAttribute('placeholder'),'100,120,80');
  assert.deepEqual(errors,[],'browser errors: '+errors.join('; '));
  console.log('PASS Beat Up manual hit counts, distribution, validation and English placeholder');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
