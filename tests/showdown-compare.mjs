import {chromium} from '@playwright/test';
import {calculate, Pokemon, Move, Field} from '@smogon/calc';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const fixtures=[
 {name:'neutral physical Earthquake',att:'Mew',def:'Mew',move:'Earthquake',type:'じめん',category:'physical',power:100},
 {name:'neutral special Psychic',att:'Mew',def:'Mew',move:'Psychic',type:'エスパー',category:'special',power:90},
 {name:'rain boosted Surf',att:'Mew',def:'Mew',move:'Surf',type:'みず',category:'special',power:90,weather:'Rain'},
 {name:'rain weakened Flamethrower',att:'Mew',def:'Mew',move:'Flamethrower',type:'ほのお',category:'special',power:90,weather:'Rain'},
 {name:'Reflect physical Earthquake',att:'Mew',def:'Mew',move:'Earthquake',type:'じめん',category:'physical',power:100,reflect:true}
];
const typeMap={'ノーマル':'Normal','ほのお':'Fire','みず':'Water','でんき':'Electric','くさ':'Grass','こおり':'Ice','かくとう':'Fighting','どく':'Poison','じめん':'Ground','ひこう':'Flying','エスパー':'Psychic','むし':'Bug','いわ':'Rock','ゴースト':'Ghost','ドラゴン':'Dragon','あく':'Dark','はがね':'Steel','フェアリー':'Fairy'};
const report=[];
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 page.on('pageerror',e=>console.error('[browser]',e.message));
 await page.goto('file://'+resolve(root,'index.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>Boolean(window.ChlohaDamageEngine?.calculate),{timeout:20000});
 for(const f of fixtures){
  const gen=9;
  const attacker=new Pokemon(gen,f.att,{level:50,nature:'Hardy',ability:'Synchronize'});
  const defender=new Pokemon(gen,f.def,{level:50,nature:'Hardy',ability:'Synchronize'});
  const field=new Field({weather:f.weather,defenderSide:{isReflect:!!f.reflect}});
  const showdown=calculate(gen,attacker,defender,new Move(gen,f.move),field);
  const reference=Array.isArray(showdown.damage)?showdown.damage.flat():[showdown.damage];
  const a=attacker.stats[f.category==='physical'?'atk':'spa'];
  const d=defender.stats[f.category==='physical'?'def':'spd'];
  const input={
   level:50,power:f.power,attack:a,defense:d,hp:defender.stats.hp,currentHp:defender.stats.hp,
   attackStage:0,defenseStage:0,moveType:f.type,category:f.category,
   attTypes:attacker.types.map(t=>Object.keys(typeMap).find(k=>typeMap[k]===t)),
   defTypes:defender.types.map(t=>Object.keys(typeMap).find(k=>typeMap[k]===t)),
   attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',
   attCurrentHp:attacker.stats.hp,attMaxHp:attacker.stats.hp,moveId:'',
   customMultiplier:1,attGrounding:'auto',defGrounding:'auto',
   terrain:'none',weather:f.weather==='Rain'?'rain':'none',
   spread:'single',battleFormat:'singles',screen:f.reflect?'reflect':'none',
   helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'auto',
   moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,
   attSpeed:attacker.stats.spe,defSpeed:defender.stats.spe,
   attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false
  };
  let observed,error;
  try{observed=await page.evaluate(a=>window.ChlohaDamageEngine.calculate(a).rolls,input);}
  catch(e){error=String(e);}
  const same=!error&&Array.isArray(observed)&&reference.length===16&&observed.length===16&&observed.every((v,i)=>v===reference[i]);
  report.push({case:f.name,match:same,showdown:reference,lab:observed,error:error||null});
  console.log((same?'PASS':'DIFF')+' '+f.name+(error?' '+error:''));
 }
 const fs=await import('node:fs');
 fs.mkdirSync(resolve(root,'test-results'),{recursive:true});
 fs.writeFileSync(resolve(root,'test-results/showdown-comparison.json'),JSON.stringify({reference:'@smogon/calc',generation:9,results:report},null,2));
 const mismatches=report.filter(r=>!r.match);
 console.log('Comparison:',report.length-mismatches.length+'/'+report.length,'matched');
 if(mismatches.length){console.error(JSON.stringify(mismatches,null,2));process.exitCode=1;}
}finally{await browser.close();}
