import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('file://'+resolve(dirname(fileURLToPath(import.meta.url)),'..','index.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>Boolean(window.ChlohaDamageEngine?.calculate));
 const results=await page.evaluate(()=>{
  const a={level:50,power:90,attack:170,defense:125,hp:200,currentHp:200,attackStage:0,defenseStage:0,moveType:'ノーマル',category:'physical',attTypes:['ノーマル'],defTypes:['みず'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'doubles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'none',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false};
  const calc=changes=>window.ChlohaDamageEngine.calculate({...a,...changes}).rolls;
  const cases=[];
  for(const defAbility of ['multiscale','shadowShield']){
   const full=calc({defAbility});
   const injured=calc({defAbility,currentHp:199});
   const plain=calc({});
   const fullGuard=calc({defAbility,friendGuardCount:1});
   const injuredGuard=calc({defAbility,currentHp:199,friendGuardCount:1});
   cases.push({name:defAbility,full,injured,plain,fullGuard,injuredGuard});
  }
  for(const screen of ['reflect','lightScreen']){
   for(const category of ['physical','special']){
    const normal=calc({screen:'none',category});
    const protectedRolls=calc({screen,category});
    const crit=calc({screen,category,critical:true});
    const critNoScreen=calc({screen:'none',category,critical:true});
    const infiltrator=calc({screen,category,attAbility:'infiltrator'});
    const infiltratorNoScreen=calc({screen:'none',category,attAbility:'infiltrator'});
    cases.push({name:screen+'/'+category,normal,protectedRolls,crit,critNoScreen,infiltrator,infiltratorNoScreen});
   }
  }
  const fg0=calc({});
  const fg1=calc({friendGuardCount:1});
  const fgScreen=calc({friendGuardCount:1,screen:'reflect'});
  const screenOnly=calc({screen:'reflect'});
  cases.push({name:'friendGuard',fg0,fg1,fgScreen,screenOnly});
  return cases;
 });
 const lessOrEqual=(a,b)=>a.every((v,i)=>v<=b[i]);
 for(const r of results){
  for(const [key,value] of Object.entries(r))if(Array.isArray(value))assert.equal(value.length,16,r.name+'/'+key+' 16 rolls');
  if(['multiscale','shadowShield'].includes(r.name)){
   assert.deepEqual(r.injured,r.plain,r.name+' inactive below full HP');
   assert.ok(lessOrEqual(r.full,r.plain),r.name+' reduces full-HP damage');
   assert.ok(lessOrEqual(r.fullGuard,r.full),r.name+' stacks with Friend Guard');
   assert.ok(lessOrEqual(r.injuredGuard,r.injured),r.name+' Friend Guard below full HP');
  }else if(r.name==='friendGuard'){
   assert.ok(lessOrEqual(r.fg1,r.fg0),'Friend Guard reduces damage');
   assert.ok(lessOrEqual(r.fgScreen,r.screenOnly),'Friend Guard stacks with Reflect');
   assert.ok(lessOrEqual(r.fgScreen,r.fg1),'Reflect stacks with Friend Guard');
  }else{
   const [screen,category]=r.name.split('/');
   const applies=(screen==='reflect'&&category==='physical')||(screen==='lightScreen'&&category==='special');
   if(applies)assert.ok(lessOrEqual(r.protectedRolls,r.normal),r.name+' screen protection');
   else assert.deepEqual(r.protectedRolls,r.normal,r.name+' mismatched screen must not apply');
   assert.deepEqual(r.crit,r.critNoScreen,r.name+' critical bypasses screen');
   assert.deepEqual(r.infiltrator,r.infiltratorNoScreen,r.name+' Infiltrator bypasses screen');
  }
  console.log('PASS defensive modifier composition '+r.name);
 }
}finally{await browser.close();}
