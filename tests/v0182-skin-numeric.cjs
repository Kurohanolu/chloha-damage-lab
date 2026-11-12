'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const result=await page.evaluate(()=>{
   const engine=window.ChlohaDamageEngine;
   const base={
    level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ノーマル',moveId:'testNormal',moveMechanic:'none',
    category:'special',attTypes:['ノーマル'],defTypes:['ドラゴン'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'auto',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1
   };
   const run=(overrides)=>engine.calculate({...base,...overrides});
   const normal=run({});
   const skins=[
    ['pixilate','フェアリー'],['aerilate','ひこう'],
    ['refrigerate','こおり'],['galvanize','でんき'],
    ['dragonize','ドラゴン']
   ].map(([ability,type])=>({ability,type,output:run({attAbility:ability})}));
   const normalize=run({attAbility:'normalize',moveType:'ドラゴン'});
   const noSkin=run({attAbility:'pixilate',moveType:'フェアリー'});
   const weatherBall=run({attAbility:'pixilate',moveMechanic:'weatherBall',moveType:'ノーマル',weather:'rain',power:50});
   const normalBaseline=run({attAbility:'none',moveType:'ノーマル'});
   const normalBoost=run({attAbility:'normalize',moveType:'ノーマル'});
   return {normal,skins,normalize,noSkin,weatherBall,normalBaseline,normalBoost};
  });
  const {normal,skins,normalize,noSkin,weatherBall,normalBaseline,normalBoost}=result;
  for(const {ability,type,output} of skins){
   assert.equal(output.effectiveness,type==='フェアリー'?2:type==='ドラゴン'?1:1,'type effectiveness '+ability);
   assert.equal(output.effectivePower,80,'original power remains 80 '+ability);
   assert.ok(output.trace.some(t=>t.includes('power/skinAbility: 80 → 96')),'1.2x base power '+ability);
   assert.ok(output.rolls.every(Number.isInteger),'integer damage rolls '+ability);
  }
  assert.equal(normal.effectiveness,1);
  assert.equal(normalize.effectiveness,1,'Normalize converts Dragon move to Normal');
  assert.ok(normalize.trace.some(t=>t.includes('power/skinAbility: 80 → 96')));
  assert.ok(!noSkin.trace.some(t=>t.includes('power/skinAbility')),'no boost for already-Fairy move');
  assert.ok(!weatherBall.trace.some(t=>t.includes('power/skinAbility')),'weather ball exempt');
  assert.equal(weatherBall.effectiveness,0.5,'rain weather ball stays Water vs Dragon');
  assert.ok(normalBoost.rolls[0]>normalBaseline.rolls[0],'Normalize increases Normal move damage');
  assert.ok(skins.find(s=>s.ability==='pixilate').output.rolls[0]>normal.rolls[0],'Fairy conversion increases damage against Dragon');
  console.log('PASS v0.182 six skin abilities numeric damage and type conversion');
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
