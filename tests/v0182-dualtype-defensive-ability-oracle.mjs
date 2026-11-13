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
  const base={level:50,power:90,attack:170,defense:125,hp:200,currentHp:200,attackStage:0,defenseStage:0,moveType:'ほのお',category:'special',attTypes:['ノーマル'],defTypes:['くさ'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'doubles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'none',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false};
  const profiles=[
   {moveType:'ほのお',defTypes:['くさ','はがね'],factor:4},
   {moveType:'ほのお',defTypes:['みず','ドラゴン'],factor:0.25},
   {moveType:'ほのお',defTypes:['くさ','みず'],factor:1},
   {moveType:'じめん',defTypes:['でんき','はがね'],factor:4},
   {moveType:'じめん',defTypes:['ひこう','はがね'],factor:0},
   {moveType:'みず',defTypes:['ほのお','じめん'],factor:4},
   {moveType:'みず',defTypes:['くさ','ドラゴン'],factor:0.25},
   {moveType:'こおり',defTypes:['ドラゴン','ひこう'],factor:4},
   {moveType:'でんき',defTypes:['みず','ひこう'],factor:4}
  ];
  const out=[];
  for(const profile of profiles)
   for(const defAbility of ['none','levitate','waterAbsorb','flashFire','thickFat','filter','solidRock','heatproof'])
    for(const power of [50,90,130]){
     const input={...base,...profile,defAbility,power};
     const result=window.ChlohaDamageEngine.calculate(input);
     out.push({...profile,defAbility,power,rolls:result.rolls,base:result.base});
    }
  return out;
 });
 for(const c of cases){
  const immune=c.factor===0||(c.defAbility==='levitate'&&c.moveType==='じめん')||(c.defAbility==='waterAbsorb'&&c.moveType==='みず')||(c.defAbility==='flashFire'&&c.moveType==='ほのお');
  let attack=170;
  if(c.defAbility==='thickFat'&&['ほのお','こおり'].includes(c.moveType))attack=round(attack,2048);
  const expectedBase=Math.floor(Math.floor(Math.floor(22*c.power*attack/125)/50)+2);
  assert.equal(c.base,expectedBase,'base '+JSON.stringify(c));
  const expected=Array.from({length:16},(_,i)=>{
   if(immune)return 0;
   let d=Math.floor(expectedBase*(85+i)/100);
   d=Math.floor(d*c.factor);
   if(c.defAbility==='heatproof'&&c.moveType==='ほのお')d=round(d,2048);
   if(['filter','solidRock'].includes(c.defAbility)&&c.factor>1)d=round(d,3072);
   return Math.max(1,d);
  });
  assert.deepEqual(c.rolls,expected,'dual-type and defensive ability '+JSON.stringify({moveType:c.moveType,defTypes:c.defTypes,defAbility:c.defAbility,power:c.power}));
 }
 console.log('PASS dual-type and defensive immunity/reduction oracle: '+cases.length+' cases / '+cases.length*16+' rolls');
}finally{await browser.close();}
