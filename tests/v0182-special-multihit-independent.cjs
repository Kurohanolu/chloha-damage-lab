'use strict';
// Independent oracle for sequential accuracy and varying per-hit damage.
// Enumerate hit/miss branches and all 16 damage rolls without using production helpers.
const assert=require('node:assert/strict');
const api=require('../multi-hit.js');
const {specialMoveDistribution,specialItemDistribution,koProbability}=api.default||globalThis.ChlohaMultiHit||api;
const tolerance=1e-11;
function oracle(rolls,accuracy){
 let active=new Map([[0,1]]);
 const finished=new Map();
 for(let i=0;i<rolls.length;i++){
  const next=new Map();
  for(const [total,p] of active){
   finished.set(total,(finished.get(total)||0)+p*(1-accuracy[i]));
   for(const damage of rolls[i])
    next.set(total+damage,(next.get(total+damage)||0)+p*accuracy[i]/16);
  }
  active=next;
 }
 for(const [total,p] of active)finished.set(total,(finished.get(total)||0)+p);
 return finished;
}
function verify(label,actual,expected){
 for(const d of new Set([...actual.keys(),...expected.keys()]))
  assert.ok(Math.abs((actual.get(d)||0)-(expected.get(d)||0))<tolerance,label+' damage '+d);
 const mass=[...actual.values()].reduce((a,b)=>a+b,0);
 assert.ok(Math.abs(mass-1)<tolerance,label+' probability mass '+mass);
 for(const hp of [1,20,50,100,200,500]){
  const expectedKO=[...expected].reduce((sum,[d,p])=>sum+(d>=hp?p:0),0);
  assert.ok(Math.abs(koProbability(actual,hp)-expectedKO)<tolerance,label+' KO HP '+hp);
 }
 console.log('PASS '+label);
}
const rolls=Array.from({length:10},(_,i)=>Array.from({length:16},(_,j)=>4+i*2+Math.floor(j/4)));
for(const name of ['トリプルアクセル','ネズミざん']){
 const hits=name==='ネズミざん'?10:3;
 const hitRolls=rolls.slice(0,hits);
 for(const accuracy of [0,0.5,0.9,1]){
  const accuracies=Array(hits).fill(accuracy);
  verify(name+' accuracy '+accuracy,specialMoveDistribution(name,i=>hitRolls[i],{accuracies}),oracle(hitRolls,accuracies));
 }
 // A miss in the middle must preserve the preceding damage and stop future hits.
 const accuracies=Array(hits).fill(1);
 accuracies[1]=0.5;
 verify(name+' second-hit miss',specialMoveDistribution(name,i=>hitRolls[i],{accuracies}),oracle(hitRolls,accuracies));
}
// One-check accuracy items: independent mixture of a miss and the full-hit convolution.
function fullHitOracle(rolls){
 let totals=new Map([[0,1]]);
 for(const hit of rolls){
  const next=new Map();
  for(const [total,p] of totals)for(const d of hit)next.set(total+d,(next.get(total+d)||0)+p/16);
  totals=next;
 }
 return totals;
}
for(const name of ['トリプルアクセル','ネズミざん']){
 const hits=name==='ネズミざん'?10:3;
 const hitRolls=rolls.slice(0,hits);
 const full=fullHitOracle(hitRolls);
 const expected=new Map([[0,.1]]);
 for(const [damage,p] of full)expected.set(damage,(expected.get(damage)||0)+.9*p);
 verify(name+' Skill Link single accuracy check',specialItemDistribution(name,i=>hitRolls[i],{accuracy:.9,skillLink:true}),expected);
}
// Population Bomb + Loaded Dice: one accuracy check, then uniformly 4-10 hits.
// Compute the mixture independently rather than reusing the production distribution.
{
 const name='ネズミざん',accuracy=.9;
 const expected=new Map([[0,1-accuracy]]);
 for(let hits=4;hits<=10;hits++){
  const partial=fullHitOracle(rolls.slice(0,hits));
  for(const [damage,p] of partial)
   expected.set(damage,(expected.get(damage)||0)+accuracy*p/7);
 }
 verify('Population Bomb Loaded Dice 4-10 hits',specialItemDistribution(name,i=>rolls[i],{accuracy,loadedDice:true}),expected);
 const allHit=fullHitOracle(rolls);
 const skillExpected=new Map([[0,.1]]);
 for(const [damage,p] of allHit)skillExpected.set(damage,(skillExpected.get(damage)||0)+.9*p);
 verify('Population Bomb Skill Link overrides Loaded Dice',specialItemDistribution(name,i=>rolls[i],{accuracy,skillLink:true,loadedDice:true}),skillExpected);
}
console.log('PASS independent special multi-hit accuracy and KO audit');
