'use strict';
// v0.184 characterization gate: preserve the public engine contract before extraction.
// This test deliberately makes no UI or translation changes.
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');

const base={
 level:50,power:100,attack:150,defense:120,hp:180,currentHp:180,
 attackStage:0,defenseStage:0,attAbility:'none',defAbility:'none',
 attItem:'none',defItem:'none',stabMode:'auto',attMaxHp:180,attCurrentHp:180,
 helpingHand:false,friendGuardCount:0,battleFormat:'singles',spread:'single',
 weather:'none',terrain:'none',category:'physical',screen:'none',
 burn:false,critical:false,moveMechanic:'none',moveId:'',
 attTypes:['じめん'],defTypes:['ノーマル'],moveType:'じめん',
 customMultiplier:1,attGrounding:'auto',defGrounding:'auto'
};
const fixtures=[
 ['neutral',{}],
 ['resisted',{defTypes:['くさ']}],
 ['super-effective',{defTypes:['でんき']}],
 ['immune',{defTypes:['ひこう']}],
 ['rain water',{moveType:'みず',attTypes:['みず'],weather:'rain'}],
 ['sun fire',{moveType:'ほのお',attTypes:['ほのお'],weather:'sun'}],
 ['physical stage',{attackStage:2,defenseStage:1}],
 ['burn',{burn:true}],
 ['critical',{critical:true}],
 ['life orb',{attItem:'lifeOrb'}],
 ['reflect',{screen:'reflect'}],
 ['friend guard doubles',{battleFormat:'doubles',friendGuardCount:1}],
 ['spread doubles',{battleFormat:'doubles',spread:'spread'}],
 ['special',{category:'special',moveType:'エスパー',attTypes:['エスパー']}]
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'),{waitUntil:'load'});
  await page.waitForFunction(()=>typeof window.ChlohaDamageEngine?.calculate==='function');
  const observed=new Map();
  for(const [name,overrides] of fixtures){
   const args={...base,...overrides};
   const result=await page.evaluate(a=>{
    const input=structuredClone(a);
    const before=JSON.stringify(input);
    const first=window.ChlohaDamageEngine.calculate(input);
    const second=window.ChlohaDamageEngine.calculate(structuredClone(a));
    return {first,second,unchanged:JSON.stringify(input)===before};
   },args);
   assert.equal(result.unchanged,true,name+': must not mutate caller input');
   assert.deepEqual(result.first.rolls,result.second.rolls,name+': deterministic rolls');
   assert.equal(result.first.rolls.length,16,name+': sixteen rolls');
   assert.ok(result.first.rolls.every(x=>Number.isInteger(x)&&x>=0),name+': nonnegative integer damage');
   assert.ok(result.first.rolls.every((x,i,a)=>i===0||x>=a[i-1]),name+': sorted rolls');
   observed.set(name,result.first.rolls);
   console.log('PASS ENGINE BASELINE '+name+' '+result.first.rolls.join(','));
  }
  const mean=name=>observed.get(name).reduce((a,b)=>a+b,0)/16;
  assert.ok(observed.get('immune').every(x=>x===0),'type immunity must yield zero damage');
  assert.ok(mean('super-effective')>mean('neutral'),'super effective must exceed neutral');
  assert.ok(mean('resisted')<mean('neutral'),'resisted must be below neutral');
  assert.ok(mean('physical stage')>mean('neutral'),'attack boost must increase damage');
  assert.ok(mean('burn')<mean('neutral'),'burn must reduce physical damage');
  assert.ok(mean('life orb')>mean('neutral'),'life orb must increase damage');
  assert.ok(mean('reflect')<mean('neutral'),'reflect must reduce physical damage');
  assert.ok(mean('friend guard doubles')<mean('neutral'),'friend guard must reduce damage');
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS v0.184 engine contract baseline '+fixtures.length+' cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
