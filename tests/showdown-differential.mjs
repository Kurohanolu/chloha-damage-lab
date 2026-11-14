// Compare Chloha's 16 damage rolls against @smogon/calc in a real browser.
// Run: npm install --no-save @smogon/calc playwright && npx playwright install chromium && node tests/showdown-differential.mjs
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { Generations, Pokemon, Move, Field, calculate } from '@smogon/calc';

const gen=Generations.get(9);
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
let failures=0;
let caseCount=0;
try{
 await page.goto(new URL('../index.html',import.meta.url).href,{waitUntil:'load'});
 await page.waitForFunction(()=>!!window.ChlohaDamageEngine?.calculate,{timeout:15000});
 const cases=[
  {name:'neutral physical / Earthquake',att:'Garchomp',def:'Tyranitar',move:'Earthquake',type:'じめん',category:'physical',power:100,weather:'none',attTypes:['ドラゴン','じめん'],defTypes:['いわ','あく']},
  {name:'neutral special / Flamethrower',att:'Charizard',def:'Blastoise',move:'Flamethrower',type:'ほのお',category:'special',power:90,weather:'none',attTypes:['ほのお','ひこう'],defTypes:['みず']},
  {name:'rain / Flamethrower',att:'Charizard',def:'Blastoise',move:'Flamethrower',type:'ほのお',category:'special',power:90,weather:'rain',attTypes:['ほのお','ひこう'],defTypes:['みず']},
  {name:'rain / Surf',att:'Blastoise',def:'Charizard',move:'Surf',type:'みず',category:'special',power:90,weather:'rain',attTypes:['みず'],defTypes:['ほのお','ひこう']},
  {name:'attack +1 / Earthquake',att:'Garchomp',def:'Tyranitar',move:'Earthquake',type:'じめん',category:'physical',power:100,weather:'none',attTypes:['ドラゴン','じめん'],defTypes:['いわ','あく'],attackStage:1},
  {name:'defense +2 / Earthquake',att:'Garchomp',def:'Tyranitar',move:'Earthquake',type:'じめん',category:'physical',power:100,weather:'none',attTypes:['ドラゴン','じめん'],defTypes:['いわ','あく'],defenseStage:2},
  {name:'burned attacker / Earthquake',att:'Garchomp',def:'Tyranitar',move:'Earthquake',type:'じめん',category:'physical',power:100,weather:'none',attTypes:['ドラゴン','じめん'],defTypes:['いわ','あく'],burn:true},
  {name:'Life Orb / Earthquake',att:'Garchomp',def:'Tyranitar',move:'Earthquake',type:'じめん',category:'physical',power:100,weather:'none',attTypes:['ドラゴン','じめん'],defTypes:['いわ','あく'],attItem:'lifeOrb'},
  {name:'Choice Specs / Flamethrower',att:'Charizard',def:'Blastoise',move:'Flamethrower',type:'ほのお',category:'special',power:90,weather:'none',attTypes:['ほのお','ひこう'],defTypes:['みず'],attItem:'choiceSpecs'}
 ];
 caseCount=cases.length;
 for(const c of cases){
  const attacker=new Pokemon(gen,c.att,{level:50,nature:'Serious',ability:'',item:({lifeOrb:'Life Orb',choiceSpecs:'Choice Specs'}[c.attItem]||''),status:c.burn?'brn':'',boosts:{atk:c.attackStage||0},evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0}});
  const defender=new Pokemon(gen,c.def,{level:50,nature:'Serious',ability:'',item:'',boosts:{def:c.defenseStage||0},evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0}});
  const move=new Move(gen,c.move,{});
  const field=new Field({gameType:'Singles',weather:c.weather==='rain'?'Rain':undefined});
  const reference=calculate(gen,attacker,defender,move,field);
  const expected=Array.isArray(reference.damage)?reference.damage:[reference.damage];
  const statKey=c.category==='physical'?'atk':'spa',defKey=c.category==='physical'?'def':'spd';
  const args={
   level:50,power:c.power,attack:attacker.stats[statKey],defense:defender.stats[defKey],
   hp:defender.stats.hp,currentHp:defender.stats.hp,
   attackStage:c.attackStage||0,defenseStage:c.defenseStage||0,attAbility:'none',defAbility:'none',
   attItem:c.attItem||'none',defItem:'none',stabMode:'auto',attMaxHp:attacker.stats.hp,
   attCurrentHp:attacker.stats.hp,helpingHand:false,friendGuardCount:0,
   battleFormat:'singles',spread:'single',weather:c.weather,terrain:'none',
   category:c.category,screen:'none',burn:!!c.burn,critical:false,
   moveMechanic:'none',attTypes:c.attTypes,defTypes:c.defTypes,moveType:c.type
  };
  try{
   const actual=await page.evaluate(x=>window.ChlohaDamageEngine.calculate(x).rolls,args);
   assert.deepEqual(actual,expected, 'all 16 damage rolls must match');
   console.log('PASS',c.name,actual.join(','));
  }catch(error){failures++;console.error('DIFF',c.name,error.message,'expected:',expected);}
 }
}finally{await browser.close();}
if(failures){console.error(failures+' Showdown comparisons failed');process.exitCode=1;}
else console.log(`All ${caseCount} Showdown differential cases matched.`);
