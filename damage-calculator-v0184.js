'use strict';
// DOM-independent orchestration of existing move and multi-hit calculations.
(()=>{
 const DamageEngine=window.ChlohaDamageEngine;
 function calculateMove(a,options={}){
let r;
 if(a.moveMechanic==='shellSideArm'){
  const stats=options.shellSideArmStats;
  if(!stats)throw Error('シェルアームズはポケモンDBの能力値設定で計算してください');
  for(const pair of [stats.physical,stats.special])if(!pair||!['attack','defense'].every(k=>Number.isSafeInteger(pair[k])&&pair[k]>=1&&pair[k]<=9999))throw Error('シェルアームズの能力値が不正です');
  const ranked=(value,rank)=>Math.max(1,Math.floor(value*(rank>=0?(2+rank)/2:2/(2-rank))));
  let physicalStage=a.attackStage;
  if(a.defAbility==='intimidate'&&!['clearBody','whiteSmoke','hyperCutter','fullMetalBody','innerFocus','oblivious','ownTempo','scrappy'].includes(a.attAbility))physicalStage=Math.max(-6,physicalStage-1);
  if(a.attAbility==='thermalExchange'&&a.thermalExchangeActivated)physicalStage=Math.min(6,physicalStage+1);
  if(a.attAbility==='angerPoint'&&a.angerPointActivated)physicalStage=6;
  // Category is chosen from ranked Atk/Def vs SpA/SpD before critical,
  // ability, item, screen and other damage modifiers (pinned reference util).
  const physicalChosen=ranked(stats.physical.attack,physicalStage)*ranked(stats.special.defense,a.defenseStage)>ranked(stats.special.attack,a.attackStage)*ranked(stats.physical.defense,a.defenseStage);
  r=DamageEngine.calculate({...a,...(physicalChosen?stats.physical:stats.special),category:physicalChosen?'physical':'special',moveMechanic:'none'});
  r.trace.unshift('シェルアームズ: 物理・特殊の能力比を比較し、'+(physicalChosen?'物理':'特殊')+'方式を採用（同値は特殊）。');
 }else r=DamageEngine.calculate(a);const multiName=options.multiHitMove||null;
const specialName=options.specialMultiHitMove||null;
if(a.moveMechanic==='beatUpManual'){
 if(a.defAbility==='multiscale')throw Error('ふくろだたきとマルチスケイルのヒット別処理は未対応です');
 const raw=(options.beatUpStats??'').trim();
 if(!/^\d{1,3}(\s*,\s*\d{1,3}){0,5}$/.test(raw))throw Error('ふくろだたきは参加1〜6匹の攻撃種族値をカンマ区切りで入力してください');
 const baseAttacks=raw.split(',').map(x=>Number(x.trim()));
 if(baseAttacks.some(n=>n<1||n>255))throw Error('攻撃種族値は1〜255の範囲で入力してください');
 const powers=baseAttacks.map(n=>5+Math.floor(n/10));
 const hitRolls=powers.map(power=>DamageEngine.calculate({...a,power,moveMechanic:'none'}).rolls);
 const dist=window.ChlohaMultiHit.convolve(hitRolls,hitRolls.length);
 r={...r,rolls:[...dist.keys()],hitRolls,multiHitDistribution:dist,koProbability:a.currentHp===0?null:window.ChlohaMultiHit.koProbability(dist,a.currentHp)};
}
if(specialName){
 if(a.defAbility==='multiscale')throw Error('特殊連続技とマルチスケイルのヒット別処理は未対応です');

 const engine=window.ChlohaMultiHit,spec=engine.specialMoveSpec(specialName);
 const hitRolls=spec.powers.map(power=>DamageEngine.calculate({...a,power}).rolls);
 const dist=engine.specialItemDistribution(specialName,i=>hitRolls[i],{accuracy:spec.accuracy,skillLink:a.attAbility==='skillLink',loadedDice:a.attItem==='loadedDice'});
 const koProbability=a.currentHp===0?null:engine.koProbability(dist,a.currentHp);
 r={...r,rolls:[...dist.keys()],hitRolls,multiHitDistribution:dist,koProbability};
}
if(multiName&&!(multiName==='ドラゴンアロー'&&(options.dragonDartsHits??'2')==='1')){
 if(a.defAbility==='multiscale')throw Error('連続技とマルチスケイルのヒット別処理は未対応です');
 const engine=window.ChlohaMultiHit,dist=engine.totalDistribution(multiName,()=>r.rolls,{skillLink:a.attAbility==='skillLink',loadedDice:a.attItem==='loadedDice'});
 const totals=[...dist.keys()],koProbability=a.currentHp===0?null:engine.koProbability(dist,a.currentHp);
 r={...r,rolls:totals,hitRolls:r.rolls.slice(),multiHitDistribution:dist,koProbability};
}
 return r;
 }
 window.ChlohaDamageCalculator=Object.freeze({calculate:calculateMove,version:'0.184'});
})();
