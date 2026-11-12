'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.waitForFunction(()=>Array.from(document.querySelector('#attAbility').options).some(o=>o.value==='overgrow'));
  const ui=await page.evaluate(()=>{
   const select=document.getElementById('attAbility');
   const label=document.getElementById('lowHpAbilityForceLabel');
   const checkbox=document.getElementById('forceLowHpAbility');
   const setAbility=value=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));};
   return ['overgrow','blaze','torrent','swarm'].map(ability=>{
    setAbility(ability);
    const shown=!label.hidden;
    checkbox.checked=true;
    setAbility('none');
    const hidden=label.hidden;
    const reset=!checkbox.checked;
    return {ability,shown,hidden,reset};
   });
  });
  for(const result of ui){
   assert.deepEqual(result,{ability:result.ability,shown:true,hidden:true,reset:true},result.ability+' checkbox visibility and reset');
  }
  const results=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:201,attCurrentHp:67,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'くさ',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['くさ'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'auto',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const run=x=>window.ChlohaDamageEngine.calculate({...base,...x});
   return ['overgrow','blaze','torrent','swarm'].map((ability,i)=>{
    const type=['くさ','ほのお','みず','むし'][i];
    return {ability,
     active:run({attAbility:ability,moveType:type}),
     inactive:run({attAbility:ability,moveType:type,attCurrentHp:68}),
     wrongType:run({attAbility:ability,moveType:'ノーマル'}),
     forced:run({attAbility:ability,moveType:type,attCurrentHp:201,forceLowHpAbility:true})};
   });
  });
  for(const {ability,active,inactive,wrongType,forced} of results){
   assert.ok(active.trace.some(x=>x.includes('power/'+ability+': 80 → 120')),ability+' boosts at exactly 1/3 HP');
   assert.ok(!inactive.trace.some(x=>x.includes('power/'+ability)),ability+' inactive above threshold');
   assert.ok(!wrongType.trace.some(x=>x.includes('power/'+ability)),ability+' ignores other types');
   assert.ok(forced.trace.some(x=>x.includes('power/'+ability+': 80 → 120')),ability+' checkbox overrides HP');
   assert.deepEqual(forced.rolls,active.rolls,ability+' forced rolls equal natural activation');
   assert.ok(active.rolls[0]>inactive.rolls[0],ability+' increases actual damage');
  }
  console.log('PASS v0.182 four low HP ability numeric thresholds');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
