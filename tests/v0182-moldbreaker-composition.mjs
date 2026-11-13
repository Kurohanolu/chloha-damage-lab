import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('file://'+resolve(dirname(fileURLToPath(import.meta.url)),'..','index.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>Boolean(window.ChlohaDamageEngine?.calculate));
 const cases=await page.evaluate(()=>{
  const base={level:50,power:90,attack:170,defense:125,hp:200,currentHp:200,attackStage:0,defenseStage:0,moveType:'ほのお',category:'special',attTypes:['ほのお'],defTypes:['くさ'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,moveId:'',customMultiplier:1,attGrounding:'grounded',defGrounding:'grounded',terrain:'none',weather:'none',spread:'single',battleFormat:'doubles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'auto',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false};
  const profiles=[
   {moveType:'じめん',defTypes:['でんき'],defAbility:'levitate',defItem:'none',terrain:'none'},
   {moveType:'みず',defTypes:['ほのお'],defAbility:'waterAbsorb',defItem:'none',terrain:'none'},
   {moveType:'ほのお',defTypes:['くさ'],defAbility:'flashFire',defItem:'none',terrain:'none'},
   {moveType:'ほのお',defTypes:['くさ'],defAbility:'thickFat',defItem:'none',terrain:'none'},
   {moveType:'ほのお',defTypes:['くさ'],defAbility:'heatproof',defItem:'none',terrain:'none'},
   {moveType:'ほのお',defTypes:['くさ'],defAbility:'filter',defItem:'none',terrain:'none'},
   {moveType:'でんき',defTypes:['みず'],defAbility:'multiscale',defItem:'none',terrain:'electric'},
   {moveType:'ほのお',defTypes:['くさ'],defAbility:'filter',defItem:'autoResistBerry',terrain:'none'},
   {moveType:'でんき',defTypes:['みず'],defAbility:'multiscale',defItem:'autoResistBerry',terrain:'electric'},
   {moveType:'ほのお',defTypes:['くさ'],defAbility:'none',defItem:'autoResistBerry',terrain:'none'}
  ];
  const out=[];
  for(const profile of profiles)
   for(const attAbility of ['none','moldBreaker','teravolt','turboblaze'])
    for(const helpingHand of [false,true]){
     const input={...base,...profile,attAbility,helpingHand};
     const r=window.ChlohaDamageEngine.calculate(input);
     const noDef=window.ChlohaDamageEngine.calculate({...input,defAbility:'none'});
     out.push({profile,attAbility,helpingHand,rolls:r.rolls,noDef:noDef.rolls});
    }
  return out;
 });
 for(const c of cases){
  assert.equal(c.rolls.length,16);
  assert.equal(c.noDef.length,16);
  if(['moldBreaker','teravolt','turboblaze'].includes(c.attAbility))
   assert.deepEqual(c.rolls,c.noDef,'Mold Breaker must bypass defensive ability while preserving item/terrain: '+JSON.stringify(c));
  if(c.profile.defAbility==='none')assert.deepEqual(c.rolls,c.noDef,'no defensive ability');
  if(c.attAbility==='none'&&['levitate','waterAbsorb','flashFire'].includes(c.profile.defAbility))
   assert.deepEqual(c.rolls,Array(16).fill(0),'defensive immunity '+JSON.stringify(c));
 }
 console.log('PASS Mold Breaker family with resist berry, terrain and Helping Hand: '+cases.length+' cases / '+cases.length*16+' rolls');
}finally{await browser.close();}
