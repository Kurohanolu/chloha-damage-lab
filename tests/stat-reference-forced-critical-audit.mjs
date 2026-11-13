import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch({headless:true});
const stage = n => n>=0 ? (2+n)/2 : 2/(2-n);
const expected = (a) => {
  const atk = Math.max(1,Math.floor(a.attack*stage(a.attackStage)));
  const def = Math.max(1,Math.floor(a.defense*stage(a.defenseStage)));
  const base = Math.floor(Math.floor((Math.floor(2*a.level/5)+2)*a.power*atk/def)/50)+2;
  return Array.from({length:16},(_,i)=>Math.max(1,Math.floor(base*(85+i)/100)));
};
const base = {
 level:50,power:80,attack:150,defense:110,hp:200,currentHp:200,
 attackStage:0,defenseStage:0,moveType:'エスパー',category:'special',
 attTypes:['ノーマル'],defTypes:['みず'],attItem:'none',attAbility:'none',
 defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,
 moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',
 terrain:'none',weather:'none',spread:'single',battleFormat:'singles',
 screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,
 stabMode:'none',moveMechanic:'none',conditionalPower:false,
 bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,
 attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,
 attTailwind:false,defTailwind:false
};
let count=0;
try {
 const page=await browser.newPage();
 await page.goto('file://'+resolve(root,'index.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>Boolean(window.ChlohaDamageEngine?.calculate));
 const calc = async overrides=>page.evaluate(input=>window.ChlohaDamageEngine.calculate(input),{...base,...overrides});
 const compare = (name, actual, reference) => {
   assert.deepEqual(actual,reference,name+' all 16 rolls');
   console.log('PASS '+name); count++;
 };
 // Neutral Water defender avoids Fighting-vs-Normal 2x type effectiveness in the independent baseline.
 // Body Press uses the user's Defense as the attacking stat; a dedicated stage input governs it.
 for (const s of [-2,0,2]) {
   const a={...base,category:'physical',moveType:'かくとう',power:80,attack:160,attackStage:-4,bodyPressDefenseStage:s,moveMechanic:'bodyPress'};
   const actual=await calc(a);
   compare('Body Press stage '+s,actual.rolls,expected({...a,attackStage:s}));
 }
 // Foul Play must use the target's Attack stat/stage, not the user's attack stage.
 for (const s of [-2,0,2]) {
   const a={...base,category:'physical',moveType:'あく',power:95,attack:170,attackStage:-4,foulPlayTargetStage:s,moveMechanic:'foulPlay'};
   const actual=await calc(a);
   compare('Foul Play target stage '+s,actual.rolls,expected({...a,attackStage:s}));
 }
 // Psyshock is Special, but must take the target's physical Defense input.
 const psy={...base,moveMechanic:'psyshock',power:80,attack:155,defense:125,defenseStage:1};
 compare('Psyshock physical-defense input', (await calc(psy)).rolls,expected(psy));
 // Forced-critical mechanic should match explicit critical, including negative attack/positive defense stage bypass.
 for (const move of ['Frost Breath','Flower Trick']) {
   const a={...base,power:move==='Frost Breath'?60:70,moveType:move==='Frost Breath'?'こおり':'くさ',category:move==='Frost Breath'?'special':'physical',attackStage:-2,defenseStage:2};
   const forced=await calc({...a,moveMechanic:'forcedCritical',critical:false});
   const explicit=await calc({...a,moveMechanic:'none',critical:true});
   compare(move+' forced critical',forced.rolls,explicit.rolls);
   assert.equal(forced.attack,a.attack);
   assert.equal(forced.defense,a.defense);
 }
 console.log('Stat-reference / forced-critical audit: '+count+' scenarios passed');
} finally {await browser.close();}
