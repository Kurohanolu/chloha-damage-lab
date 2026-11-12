/* v0.182 multi-hit probability and independent per-hit damage rolls. */
const ChlohaMultiHit = (() => {
 'use strict';
 const STANDARD_HITS = Object.freeze({2:0.35,3:0.35,4:0.15,5:0.15});
 const LOADED_DICE_HITS = Object.freeze({4:0.5,5:0.5});
 const FIXED_TWO = Object.freeze({2:1});
 const FIXED_THREE = Object.freeze({3:1});
 const FIXED_TEN = Object.freeze({10:1});
 const variableMoves=new Set(['タネマシンガン','つららばり','ロックブラスト','みだれづき','スイープビンタ','ミサイルばり','みだれひっかき','れんぞくパンチ','Bullet Seed','Icicle Spear','Rock Blast','Fury Attack','Double Slap','Pin Missile','Fury Swipes','Comet Punch']);
 const fixedTwoMoves=new Set(['ダブルウイング','ダブルアタック','ダブルチョップ','にどげり','ホネブーメラン','Dual Wingbeat','Double Hit','Dual Chop','Double Kick','Bonemerang']);
 const fixedThreeMoves=new Set(['トリプルアクセル','Triple Axel']);
 const tenMoves=new Set(['ネズミざん','Population Bomb']);
 variableMoves.add('スケイルショット');variableMoves.add('Scale Shot');
 function hitDistribution(name,{skillLink=false,loadedDice=false}={}){
  if(tenMoves.has(name))return FIXED_TEN; // Maximum only; accuracy/early stop modeled separately.
  if(fixedTwoMoves.has(name))return FIXED_TWO;
  if(fixedThreeMoves.has(name))return FIXED_THREE; // Maximum only; later hits have accuracy checks.
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
 return {hitDistribution,convolve,totalDistribution};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ChlohaMultiHit;
if(typeof globalThis!=='undefined')globalThis.ChlohaMultiHit=ChlohaMultiHit;
