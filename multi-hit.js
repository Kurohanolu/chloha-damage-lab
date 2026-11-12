/* v0.182 multi-hit probability and independent per-hit damage rolls. */
const ChlohaMultiHit = (() => {
 'use strict';
 const STANDARD_HITS = Object.freeze({2:0.35,3:0.35,4:0.15,5:0.15});
 const LOADED_DICE_HITS = Object.freeze({4:0.5,5:0.5});
 const FIXED_TWO = Object.freeze({2:1});
 const variableMoves=new Set(['タネマシンガン','つららばり','ロックブラスト','みだれづき','スイープビンタ','ミサイルばり','みだれひっかき','れんぞくパンチ','Bullet Seed','Icicle Spear','Rock Blast','Fury Attack','Double Slap','Pin Missile','Fury Swipes','Comet Punch']);
 const fixedTwoMoves=new Set(['ダブルウイング','ダブルアタック','ダブルチョップ','にどげり','ホネブーメラン','Dual Wingbeat','Double Hit','Dual Chop','Double Kick','Bonemerang']);
 variableMoves.add('スケイルショット');variableMoves.add('Scale Shot');
 function hitDistribution(name,{skillLink=false,loadedDice=false}={}){
  if(fixedTwoMoves.has(name))return FIXED_TWO;
  if(variableMoves.has(name))return skillLink?Object.freeze({5:1}):loadedDice?LOADED_DICE_HITS:STANDARD_HITS;
  return null;
 }
 function validateRolls(rolls){
  if(!Array.isArray(rolls)||rolls.length!==16||rolls.some(n=>!Number.isInteger(n)||n<0))throw Error('Expected 16 nonnegative integer damage rolls');
 }
 function convolve(perHitRolls,hits){
  if(!Array.isArray(perHitRolls)||perHitRolls.length!==hits||hits<1||!Number.isInteger(hits))throw Error('One 16-roll array per hit is required');
  let distribution=new Map([[0,1]]);
  for(const rolls of perHitRolls){
   validateRolls(rolls);
   const next=new Map();
   for(const [total,p] of distribution)for(const damage of rolls)next.set(total+damage,(next.get(total+damage)||0)+p/16);
   distribution=next;
  }
  return distribution;
 }
 function totalDistribution(name,rollsForHit,options={}){
  const hits=hitDistribution(name,options);
  if(!hits)throw Error('Unsupported multi-hit move: '+name);
  if(typeof rollsForHit!=='function')throw Error('rollsForHit must be a function');
  const totals=new Map();
  for(const [count,prob] of Object.entries(hits)){
   const arrays=Array.from({length:Number(count)},(_,i)=>rollsForHit(i,Number(count)));
   for(const [damage,p] of convolve(arrays,Number(count)))totals.set(damage,(totals.get(damage)||0)+p*prob);
  }
  return new Map([...totals].sort((a,b)=>a[0]-b[0]));
 }
 // Sequential attacks stop on the first miss. Per-hit damage rolls may differ.
 // This models hit accuracy and damage only; move-specific effects are separate.
 function sequentialDistribution(rollsForHit,accuracies){
  if(typeof rollsForHit!=='function')throw Error('rollsForHit must be a function');
  if(!Array.isArray(accuracies)||accuracies.length<1||accuracies.length>10||
     accuracies.some(p=>!Number.isFinite(p)||p<0||p>1))throw Error('Expected 1-10 hit accuracies between zero and one');
  let active=new Map([[0,1]]);
  const finished=new Map();
  for(let i=0;i<accuracies.length;i++){
   if(active.size===0)break; // A miss already terminated every possible attack sequence.
   const rolls=rollsForHit(i,accuracies.length);
   validateRolls(rolls);
   const p=accuracies[i],next=new Map();
   for(const [damage,probability] of active){
    if(p<1)finished.set(damage,(finished.get(damage)||0)+probability*(1-p));
    if(p>0)for(const roll of rolls)next.set(damage+roll,(next.get(damage+roll)||0)+probability*p/16);
   }
   active=next;
  }
  for(const [damage,probability] of active)finished.set(damage,(finished.get(damage)||0)+probability);
  return new Map([...finished].sort((a,b)=>a[0]-b[0]));
 }
 // Gen9 Showdown data/moves.ts reference: Population Bomb has 10 attempts at
 // 90% accuracy; Triple Axel has 3 attempts at 90% and 20/40/60 power.
 // Actual hit probabilities may change with abilities, items and field effects.
 const SPECIAL_MOVE_SPECS=Object.freeze({
  'ネズミざん':Object.freeze({hits:10,accuracy:0.9,powers:Object.freeze(Array(10).fill(20))}),
  'Population Bomb':Object.freeze({hits:10,accuracy:0.9,powers:Object.freeze(Array(10).fill(20))}),
  'トリプルアクセル':Object.freeze({hits:3,accuracy:0.9,powers:Object.freeze([20,40,60])}),
  'Triple Axel':Object.freeze({hits:3,accuracy:0.9,powers:Object.freeze([20,40,60])})
 });
 function specialMoveSpec(name){return SPECIAL_MOVE_SPECS[name]||null;}
 // Special multi-hit moves require per-hit accuracy and damage supplied by the caller.
 // Do not expose these moves through hitDistribution until the UI supplies correct rolls.
 function specialMoveDistribution(name,rollsForHit,{accuracies}={}){
  const counts={'ネズミざん':10,'Population Bomb':10,'トリプルアクセル':3,'Triple Axel':3};
  const count=counts[name];
  if(!count)throw Error('Unsupported special multi-hit move: '+name);
  if(!Array.isArray(accuracies)||accuracies.length!==count)throw Error('Expected '+count+' per-hit accuracy values');
  return sequentialDistribution(rollsForHit,accuracies);
 }
 function koProbability(distribution,currentHp){
  if(!(distribution instanceof Map)||distribution.size===0)throw Error('Expected nonempty damage distribution');
  if(!Number.isSafeInteger(currentHp)||currentHp<1)throw Error('Target HP must be a positive integer');
  let total=0,ko=0;
  for(const [damage,probability] of distribution){
   if(!Number.isSafeInteger(damage)||damage<0||!Number.isFinite(probability)||probability<0)throw Error('Invalid damage distribution');
   total+=probability;
   if(damage>=currentHp)ko+=probability;
  }
  if(Math.abs(total-1)>1e-9)throw Error('Damage distribution probabilities must sum to one');
  return Math.max(0,Math.min(1,ko));
 }
 return {hitDistribution,convolve,totalDistribution,sequentialDistribution,specialMoveSpec,specialMoveDistribution,koProbability};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ChlohaMultiHit;
if(typeof globalThis!=='undefined')globalThis.ChlohaMultiHit=ChlohaMultiHit;
