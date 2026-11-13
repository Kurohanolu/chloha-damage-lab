import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('file://'+resolve(dirname(fileURLToPath(import.meta.url)),'..','index.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>Boolean(window.ChlohaDamageEngine?.calculate));
 const result=await page.evaluate(()=>{
  const base={level:50,power:70,attack:155,defense:115,hp:200,currentHp:200,attackStage:-2,defenseStage:2,moveType:'くさ',category:'physical',attTypes:['ノーマル'],defTypes:['みず'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'singles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'none',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false};
  const calc=overrides=>window.ChlohaDamageEngine.calculate({...base,...overrides});
  return ['shellArmor','battleArmor'].map(defAbility=>{
   const forced=calc({defAbility,moveMechanic:'forcedCritical'});
   const ordinary=calc({defAbility,moveMechanic:'none',critical:false});
   const manuallyCritical=calc({defAbility,moveMechanic:'none',critical:true});
   const unprotected=calc({defAbility:'none',moveMechanic:'forcedCritical'});
   const moldBreaker=calc({attAbility:'moldBreaker',defAbility,moveMechanic:'forcedCritical'});
   return {defAbility,forced:forced.rolls,ordinary:ordinary.rolls,manuallyCritical:manuallyCritical.rolls,unprotected:unprotected.rolls,moldBreaker:moldBreaker.rolls,trace:forced.trace};
  });
 });
 for(const r of result){
  assert.deepEqual(r.forced,r.ordinary,r.defAbility+' must block guaranteed critical');
  assert.deepEqual(r.manuallyCritical,r.ordinary,r.defAbility+' must block manual critical');
  assert.ok(Math.max(...r.unprotected)>Math.max(...r.forced),r.defAbility+' must change critical damage');
  assert.deepEqual(r.moldBreaker,r.unprotected,'Mold Breaker should ignore '+r.defAbility);
  assert.ok(r.trace.some(x=>x.includes('急所無効')),r.defAbility+' trace must disclose critical immunity');
  console.log('PASS forced-critical immunity '+r.defAbility);
 }
}finally{await browser.close();}
