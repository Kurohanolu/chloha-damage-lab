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
  const base={level:50,power:90,attack:170,defense:125,hp:200,currentHp:200,attackStage:0,defenseStage:0,moveType:'ほのお',category:'special',attTypes:['ほのお'],defTypes:['くさ'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,moveId:'',customMultiplier:1,attGrounding:'grounded',defGrounding:'grounded',terrain:'none',weather:'none',spread:'single',battleFormat:'doubles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'none',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false};
  const out=[];
  const profiles=[
   {moveType:'ほのお',defTypes:['くさ'],weather:'sun',terrain:'none',typeFactor:2,weatherFactor:6144,terrainFactor:4096},
   {moveType:'みず',defTypes:['ほのお'],weather:'rain',terrain:'none',typeFactor:2,weatherFactor:6144,terrainFactor:4096},
   {moveType:'でんき',defTypes:['みず'],weather:'none',terrain:'electric',typeFactor:2,weatherFactor:4096,terrainFactor:5325},
   {moveType:'ほのお',defTypes:['みず'],weather:'rain',terrain:'none',typeFactor:0.5,weatherFactor:2048,terrainFactor:4096},
   {moveType:'みず',defTypes:['くさ'],weather:'sun',terrain:'none',typeFactor:0.5,weatherFactor:2048,terrainFactor:4096},
   {moveType:'でんき',defTypes:['くさ'],weather:'none',terrain:'electric',typeFactor:0.5,weatherFactor:4096,terrainFactor:5325}
  ];
  for(const profile of profiles)
   for(const power of [40,65,90,120,160])
    for(const stab of [false,true])
     for(const helpingHand of [false,true])
      for(const defAbility of ['none','multiscale']){
       const input={...base,...profile,power,attTypes:stab?[profile.moveType]:['ノーマル'],stabMode:stab?'normal':'none',helpingHand,defAbility};
       const r=window.ChlohaDamageEngine.calculate(input);
       out.push({...profile,power,stab,helpingHand,defAbility,base:r.base,rolls:r.rolls});
      }
  return out;
 });
 for(const c of cases){
  let power=c.power;
  if(c.terrainFactor!==4096)power=round(power,c.terrainFactor);
  if(c.helpingHand)power=round(power,6144);
  const raw=Math.floor(Math.floor(Math.floor(22*power*170/125)/50)+2);
  const expectedBase=c.weatherFactor===4096?raw:round(raw,c.weatherFactor);
  assert.equal(c.base,expectedBase,'independent base '+JSON.stringify(c));
  const expected=Array.from({length:16},(_,i)=>{
   let d=Math.floor(expectedBase*(85+i)/100);
   if(c.stab)d=round(d,6144);
   d=Math.floor(d*c.typeFactor);
   if(c.defAbility==='multiscale')d=round(d,2048);
   return Math.max(1,d);
  });
  assert.deepEqual(c.rolls,expected,'independent 16-roll weather/terrain/type oracle '+JSON.stringify({moveType:c.moveType,power:c.power,weather:c.weather,terrain:c.terrain,stab:c.stab,helpingHand:c.helpingHand,defAbility:c.defAbility}));
 }
 console.log('PASS weather/terrain/type/STAB independent oracle: '+cases.length+' cases, '+cases.length*16+' rolls');
}finally{await browser.close();}
