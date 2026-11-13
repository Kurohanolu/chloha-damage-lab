import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const round=(value,modifier)=>Math.floor((value*modifier+2047)/4096);
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('file://'+resolve(dirname(fileURLToPath(import.meta.url)),'..','index.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>Boolean(window.ChlohaDamageEngine?.calculate));
 const cases=await page.evaluate(()=>{
  const base={level:50,power:90,attack:170,defense:125,hp:200,currentHp:200,attackStage:0,defenseStage:0,moveType:'ノーマル',category:'physical',attTypes:['ほのお'],defTypes:['みず'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'doubles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'none',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false};
  const out=[];
  for(const power of [40,65,90,120,160]){
   for(const format of ['singles','doubles']){
    for(const defAbility of ['none','multiscale','shadowShield']){
     for(const screen of ['none','reflect']){
      for(const friendGuardCount of [0,1]){
       if(format==='singles'&&friendGuardCount>0)continue;
       const a={...base,power,battleFormat:format,defAbility,screen,friendGuardCount};
       const r=window.ChlohaDamageEngine.calculate(a);
       out.push({power,format,defAbility,screen,friendGuardCount,base:r.base,rolls:r.rolls});
      }
     }
    }
   }
  }
  return out;
 });
 for(const c of cases){
  const expected=Array.from({length:16},(_,i)=>{
   let d=Math.floor(c.base*(85+i)/100);
   if(c.screen==='reflect'){
    let modifier=c.format==='singles'?2048:2732;
    if(c.friendGuardCount)modifier=round(modifier,3072);
    d=round(d,modifier);
   }else if(c.friendGuardCount)d=round(d,3072);
   if(c.defAbility!=='none')d=round(d,2048);
   return Math.max(1,d);
  });
  assert.deepEqual(c.rolls,expected,JSON.stringify({power:c.power,format:c.format,defAbility:c.defAbility,screen:c.screen,friendGuardCount:c.friendGuardCount}));
 }
 console.log('PASS independent defensive fixed-point rounding audit: '+cases.length+' scenarios x 16 rolls');
}finally{await browser.close();}
