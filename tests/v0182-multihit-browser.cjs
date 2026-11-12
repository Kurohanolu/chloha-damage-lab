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
  const special=await page.evaluate(()=>{
    const api=window.ChlohaMultiHit;
    const population=api.specialMoveDistribution('ネズミざん',()=>Array(16).fill(10),{accuracies:Array(10).fill(1)});
    const triple=api.specialMoveDistribution('トリプルアクセル',i=>Array(16).fill(10*(i+1)),{accuracies:[1,.5,1]});
    return {population:[...population],triple:[...triple],populationUnsupported:api.hitDistribution('ネズミざん')===null,tripleUnsupported:api.hitDistribution('トリプルアクセル')===null};
  });
  assert.deepEqual(special.population,[[100,1]],'browser special engine supports ten sequential hits');
  assert.deepEqual(special.triple,[[10,.5],[60,.5]],'browser special engine stops after missed second hit');
  assert.equal(special.populationUnsupported,true,'Population Bomb is not a standard fixed-hit move');
  assert.equal(special.tripleUnsupported,true,'Triple Axel is not a standard fixed-hit move');
  const catalogGuards=await page.evaluate(()=>{
    const options=[...document.querySelector('#dbMove').options];
    return ['ネズミざん','トリプルアクセル'].map(name=>{
      const option=options.find(o=>o.textContent.includes(name));
      return {name,found:!!option,unsupported:option?option.textContent.includes('計算未対応'):null};
    });
  });
  for(const guard of catalogGuards){
    if(guard.found)assert.equal(guard.unsupported,false,guard.name+' must be selectable with special-hit UI calculation');
  }
  const specialUI=await page.evaluate(()=>{
    const output=[];
    for(const name of ['ネズミざん','トリプルアクセル']){
      const move=[...document.querySelector('#dbMove').options].find(x=>x.textContent.includes(name));
      if(!move)throw Error('Missing special move '+name);
      document.querySelector('#attItem').value='none';
      document.querySelector('#attItem').dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelector('#dbMove').value=move.value;
      document.querySelector('#dbMove').dispatchEvent(new Event('input',{bubbles:true}));
      const last=window.ChlohaLastCalculation,dist=last?.r?.multiHitDistribution;
      output.push({name,selected:window.ChlohaSpecialMultiHitMove,hidden:document.querySelector('#output').hidden,error:document.querySelector('#error').textContent,mass:dist?[...dist.values()].reduce((a,b)=>a+b,0):null,hitPowers:last?.r?.hitRolls?.length,zero:dist?.has(0),ko:document.querySelector('#ko').textContent});
    }
    return output;
  });
  for(const item of specialUI){
    assert.equal(item.selected,item.name,JSON.stringify(item));
    assert.equal(item.hidden,false,JSON.stringify(item));
    assert.ok(Math.abs(item.mass-1)<1e-9,JSON.stringify(item));
    assert.equal(item.hitPowers,item.name==='ネズミざん'?10:3,JSON.stringify(item));
    assert.equal(item.zero,true,'a first-hit miss must yield zero damage');
    assert.match(item.ko,/連続技合計KO率/,JSON.stringify(item));
  }
  const powerAudit=await page.evaluate(()=>{
    const result=[];
    for(const name of ['ネズミざん','トリプルアクセル']){
      const option=[...document.querySelector('#dbMove').options].find(x=>x.textContent.includes(name));
      document.querySelector('#dbMove').value=option.value;
      document.querySelector('#dbMove').dispatchEvent(new Event('input',{bubbles:true}));
      const last=window.ChlohaLastCalculation,spec=window.ChlohaMultiHit.specialMoveSpec(name);
      const expected=spec.powers.map(power=>window.ChlohaDamageEngine.calculate({...last.a,power}).rolls);
      const actual=last.r.hitRolls;
      const actualDist=last.r.multiHitDistribution;
      const expectedDist=window.ChlohaMultiHit.specialMoveDistribution(name,i=>expected[i],{accuracies:Array(spec.hits).fill(spec.accuracy)});
      result.push({name,powers:spec.powers,perHitCorrect:JSON.stringify(actual)===JSON.stringify(expected),
       distributionCorrect:JSON.stringify([...actualDist])===JSON.stringify([...expectedDist]),
       firstMissProbability:actualDist.get(0)||0,
       noErrors:!document.querySelector('#error').textContent});
    }
    return result;
  });
  for(const item of powerAudit){
    assert.equal(item.perHitCorrect,true,JSON.stringify(item));
    assert.equal(item.distributionCorrect,true,JSON.stringify(item));
    assert.ok(Math.abs(item.firstMissProbability-.1)<1e-9,JSON.stringify(item));
    assert.equal(item.noErrors,true,JSON.stringify(item));
  }
  assert.deepEqual(errors,[]);
  console.log('PASS v0.182 browser engine, normal damage regression and special multi-hit UI');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
