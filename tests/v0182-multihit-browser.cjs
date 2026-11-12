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
    return {...initial,diceHitMin:dice?Math.min(...dice.keys()):null,diceMass:dice?[...dice.values()].reduce((a,b)=>a+b,0):null,afterError:document.querySelector('#error').textContent,afterHidden:document.querySelector('#output').hidden,mechanic:window.ChlohaMultiHitMove,selected:document.querySelector('#dbMove').selectedOptions[0]?.textContent};
  });
  assert.equal(ui.hidden,false,'damage panel must display: '+JSON.stringify(ui));
  assert.match(ui.ko,/連続技合計KO率/);
  assert.ok(Math.abs(ui.probability-1)<1e-9);
  assert.match(ui.range,/ダメージ/,'multi-hit total damage range should render');
  assert.ok(ui.ko.includes('%'),'KO probability must be shown as a percentage');
  assert.ok(Math.abs(ui.diceMass-1)<1e-9,JSON.stringify(ui));
  assert.ok(ui.diceHitMin>0);
  const boundaries=await page.evaluate(()=>{
    const engine=window.ChlohaMultiHit;
    const distribution=window.ChlohaLastCalculation.r.multiHitDistribution;
    const min=Math.min(...distribution.keys()),max=Math.max(...distribution.keys());
    const fixed=engine.totalDistribution('ダブルウイング',()=>Array(16).fill(10));
    const unknown=engine.hitDistribution('ネズミざん');
    return {min,max,atMin:engine.koProbability(distribution,min),aboveMax:engine.koProbability(distribution,max+1),fixed:[...fixed],unknown};
  });
  assert.equal(boundaries.atMin,1,'minimum total damage always KOs at matching HP');
  assert.equal(boundaries.aboveMax,0,'KO probability above maximum damage must be zero');
  assert.deepEqual(boundaries.fixed,[[20,1]],'fixed two-hit moves sum exactly two hits');
  assert.equal(boundaries.unknown,null,'Population Bomb must remain unsupported');
  assert.deepEqual(errors,[]);
  console.log('PASS v0.182 browser engine, normal damage regression and unsupported UI guard');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
