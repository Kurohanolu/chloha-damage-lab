'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#attStats .stat-row').first().waitFor();
  const result=await page.evaluate(()=>{
   const engine=window.ChlohaMultiHit;
   if(!engine)throw Error('ChlohaMultiHit missing from browser');
   const samples=Array(16).fill(12);
   const baseline=window.ChlohaDamageEngine.calculate(window.ChlohaLastCalculation.a);
   const distribution=engine.totalDistribution('タネマシンガン',()=>samples);
   const dice=engine.totalDistribution('タネマシンガン',()=>samples,{loadedDice:true});
   const link=engine.totalDistribution('タネマシンガン',()=>samples,{skillLink:true});
   const moves=[...document.querySelector('#dbMove').options];
   const bullet=moves.find(x=>x.textContent.includes('タネマシンガン'));
   return {baselineRolls:baseline.rolls.length,distribution:[...distribution],dice:[...dice],link:[...link],bulletExists:!!bullet,bulletMarkedUnsupported:bullet?.textContent.includes('計算未対応'),bulletText:bullet?.textContent,hitRule:engine.hitDistribution('タネマシンガン')};
  });
  assert.equal(result.baselineRolls,16,'ordinary move damage remains 16 rolls');
  assert.deepEqual(result.distribution.map(x=>x[0]),[24,36,48,60]);
  assert.deepEqual(result.dice.map(x=>x[0]),[48,60]);
  assert.deepEqual(result.link.map(x=>x[0]),[60]);
  assert.equal(result.bulletExists,true);
  assert.equal(result.bulletMarkedUnsupported,false,'multi-hit move should be selectable: '+JSON.stringify(result));
  const ui=await page.evaluate(()=>{
    const move=[...document.querySelector('#dbMove').options].find(x=>x.textContent.includes('タネマシンガン'));
    document.querySelector('#dbMove').value=move.value;
    document.querySelector('#dbMove').dispatchEvent(new Event('input',{bubbles:true}));
    const last=window.ChlohaLastCalculation;
    const initial={error:document.querySelector('#error').textContent,hidden:document.querySelector('#output').hidden,range:document.querySelector('#damage').textContent,ko:document.querySelector('#ko').textContent,probability:last?.r?.multiHitDistribution?[...last.r.multiHitDistribution.values()].reduce((a,b)=>a+b,0):null};
    document.querySelector('#attItem').value='loadedDice';
    document.querySelector('#attItem').dispatchEvent(new Event('input',{bubbles:true}));
    const dice=window.ChlohaLastCalculation?.r?.multiHitDistribution;
    return {...initial,diceHitMin:Math.min(...dice.keys()),diceMass:[...dice.values()].reduce((a,b)=>a+b,0)};
  });
  assert.equal(ui.hidden,false,'damage panel must display');
  assert.match(ui.ko,/連続技合計KO率/);
  assert.ok(Math.abs(ui.probability-1)<1e-9);
  assert.ok(Math.abs(ui.diceMass-1)<1e-9);
  assert.ok(ui.diceHitMin>0);
  assert.deepEqual(errors,[]);
  console.log('PASS v0.182 browser engine, normal damage regression and unsupported UI guard');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
