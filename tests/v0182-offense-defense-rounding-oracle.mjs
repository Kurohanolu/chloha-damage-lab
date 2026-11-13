import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const round=(v,m)=>Math.floor((v*m+2047)/4096);
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('file://'+resolve(dirname(fileURLToPath(import.meta.url)),'..','index.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>Boolean(window.ChlohaDamageEngine?.calculate));
 const cases=await page.evaluate(()=>{
  const a={level:50,power:90,attack:170,defense:125,hp:200,currentHp:200,attackStage:0,defenseStage:0,moveType:'ノーマル',category:'physical',attTypes:['ほのお'],defTypes:['みず'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'doubles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'none',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false};
  const result=[];
  for(const power of [40,65,90,120,160])
   for(const attAbility of ['none','hugePower'])
    for(const helpingHand of [false,true])
     for(const attItem of ['none','lifeOrb'])
      for(const defAbility of ['none','multiscale'])
       for(const screen of ['none','reflect'])
        for(const friendGuardCount of [0,1]){
         const input={...a,power,attAbility,helpingHand,attItem,defAbility,screen,friendGuardCount};
         const output=window.ChlohaDamageEngine.calculate(input);
         result.push({power,attAbility,helpingHand,attItem,defAbility,screen,friendGuardCount,base:output.base,rolls:output.rolls});
        }
  return result;
 });
 for(const c of cases){
  const effectivePower=c.helpingHand?round(c.power,6144):c.power;
  const attack=c.attAbility==='hugePower'?340:170;
  const expectedBase=Math.floor(Math.floor(Math.floor(22*effectivePower*attack/125)/50)+2);
  assert.equal(c.base,expectedBase,'base formula '+JSON.stringify(c));
  const expected=Array.from({length:16},(_,i)=>{
   let d=Math.floor(expectedBase*(85+i)/100);
   if(c.screen==='reflect'){
    let modifier=2732;
    if(c.friendGuardCount)modifier=round(modifier,3072);
    d=round(d,modifier);
   }else if(c.friendGuardCount)d=round(d,3072);
   if(c.defAbility==='multiscale')d=round(d,2048);
   if(c.attItem==='lifeOrb')d=round(d,5324);
   return Math.max(1,d);
  });
  assert.deepEqual(c.rolls,expected,'16-roll independent oracle '+JSON.stringify({power:c.power,attAbility:c.attAbility,helpingHand:c.helpingHand,attItem:c.attItem,defAbility:c.defAbility,screen:c.screen,friendGuardCount:c.friendGuardCount}));
 }
 console.log('PASS offensive/defensive independent fixed-point oracle: '+cases.length+' scenarios, '+cases.length*16+' rolls');
}finally{await browser.close();}
