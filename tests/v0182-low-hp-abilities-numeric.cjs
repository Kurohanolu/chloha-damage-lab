'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  // Ability choices are species-dependent. Isolate the visibility control by
  // supplying its supported values instead of waiting for a specific species.
  await page.evaluate(()=>{
   const select=document.getElementById('attAbility');
   for(const ability of ['overgrow','blaze','torrent','swarm']){
    if(!Array.from(select.options).some(option=>option.value===ability)){
     select.add(new Option(ability,ability));
    }
   }
  });
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
  const flare=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ゴースト',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ゴースト'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   // Normal typing is immune to Ghost; use a neutral defender for numeric comparison.
   base.defTypes=['みず'];
   const calc=extra=>window.ChlohaDamageEngine.calculate({...base,...extra});
   return {normal:calc({}),burned:calc({attAbility:'flareBoost',burn:true}),
    unburned:calc({attAbility:'flareBoost'}),
    physical:calc({attAbility:'flareBoost',burn:true,category:'physical'}),
    solar:calc({attAbility:'solarPower',weather:'sun'})};
  });
  assert.deepEqual(flare.unburned.rolls,flare.normal.rolls,'Flare Boost requires burn');
  assert.deepEqual(flare.burned.rolls,flare.solar.rolls,'Flare Boost special stat matches Solar Power 1.5x');
  assert.ok(flare.burned.rolls[0]>flare.normal.rolls[0],'Flare Boost increases special damage');
  assert.ok(!flare.physical.trace.some(x=>x.includes('stat/flareBoost')),'Flare Boost does not modify physical attack');
  console.log('PASS v0.182 Flare Boost burn and category numeric checks');
  console.log('PASS v0.182 four low HP ability numeric thresholds');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
