'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {root,baseInput,context,reference,build,flags}=require('./helpers/v0186-reference.cjs');
const {moves,policies}=require('./helpers/v0186-catalog.cjs');
// Independently construct generating polynomials from the reference hit rolls;
// never use the app's convolve/totalDistribution to produce expectations.
function polynomial(arrays){
 let p=[1];
 for(const rolls of arrays){const q=Array(p.length+Math.max(...rolls)).fill(0);for(let i=0;i<p.length;i++)if(p[i])for(const d of rolls)q[i+d]+=p[i]/16;p=q;}
 return p;
}
function expectedDistribution(perHit,counts,accuracy=1,sequential=false){
 const total=new Map();
 const add=(arrays,weight)=>polynomial(arrays).forEach((prob,damage)=>{if(prob)total.set(damage,(total.get(damage)||0)+prob*weight);});
 if(sequential){for(let count=0;count<perHit.length;count++)add(perHit.slice(0,count),(1-accuracy)*accuracy**count);add(perHit,accuracy**perHit.length);}
 else {total.set(0,1-accuracy);for(const [count,prob] of Object.entries(counts))add(perHit.slice(0,+count),accuracy*prob);}
 return total;
}
const failures=[];let comparisons=0;
for(const m of moves){
 const multi=context.ChlohaMultiHit.hitDistribution(m.name),special=context.ChlohaMultiHit.specialMoveSpec(m.name);
 if(!multi&&!special)continue;
 for(const mode of ['ordinary','skillLink','loadedDice'])for(const defense of ['none','berry','shadowShield']){
  const input={...baseInput,moveId:m.id,power:m.power,moveType:m.type,category:m.category,moveMechanic:policies[m.id]?.mechanic||'none',attTypes:[m.type],defTypes:['みず'],attack:153,defense:117,attAbility:mode==='skillLink'?'skillLink':'none',attItem:mode==='loadedDice'?'loadedDice':'none',defItem:defense==='berry'?'autoResistBerry':'none',defAbility:defense==='shadowShield'?'shadowShield':'none'};
  // A super-effective target makes the optional resistance Berry active.
  if(defense==='berry'&&m.type!=='ノーマル'){
   const t=context.ChlohaBattleData.TYPES.find(t=>reference.Generations.get(9).types.get(reference.toID(require('./helpers/v0186-reference.cjs').typeName[m.type])).effectiveness[require('./helpers/v0186-reference.cjs').typeName[t]]===2);
   input.defTypes=[t];
  }
  const b=build(input,{generation:9,nativeMove:true});b.move.hits=special?.hits||5;
  const rr=reference.calculate(b.gen,b.attacker,b.defender,b.move,b.field).damage;
  const referenceHits=Array.isArray(rr[0])?rr:[rr];
  const fixed=Object.keys(multi||{}).length===1&&+Object.keys(multi)[0]===2;
  const count=special?.hits||(fixed?2:5);
  const perHit=Array.from({length:count},(_,i)=>referenceHits[i]||referenceHits[0]);
  const counts=special?(mode==='loadedDice'&&count===10?Object.fromEntries([4,5,6,7,8,9,10].map(n=>[n,1/7])):{[count]:1}):fixed?{2:1}:mode==='skillLink'?{5:1}:mode==='loadedDice'?{4:.5,5:.5}:{2:.35,3:.35,4:.15,5:.15};
  const expected=expectedDistribution(perHit,counts,special?.accuracy||1,!!special&&mode==='ordinary');
  try{
   const r=context.ChlohaDamageCalculator.calculate(input,{multiHitMove:multi?m.name:null,specialMultiHitMove:special?m.name:null});
   const actual=r.multiHitDistribution||new Map();
   if(!r.multiHitDistribution)for(const d of r.rolls)actual.set(d,(actual.get(d)||0)+1/r.rolls.length);
   const keys=new Set([...actual.keys(),...expected.keys()]);
   for(const damage of keys)assert.ok(Math.abs((actual.get(damage)||0)-(expected.get(damage)||0))<1e-10,m.name+'/'+mode+'/'+defense+' damage '+damage);
   assert.ok(Math.abs([...actual.values()].reduce((a,b)=>a+b,0)-1)<1e-9);
   const ko=[...expected].reduce((p,[damage,chance])=>p+(damage>=input.currentHp?chance:0),0);
   assert.ok(Math.abs(r.koProbability-ko)<1e-9,'KO probability');
  }catch(error){failures.push({move:m.id,name:m.name,mode,defense,error:error.message,input});}
  comparisons++;
 }
}
fs.mkdirSync(root+'/reports/v0186',{recursive:true});fs.writeFileSync(root+'/reports/v0186/multihit-differential.json',JSON.stringify({comparisons,mismatches:failures.length,failures},null,2)+'\n');
console.log('Multi-hit differential:',comparisons,'probability distributions,',failures.length,'mismatches',failures.map(f=>f.name+'/'+f.mode+'/'+f.defense).join(', '));
assert.equal(failures.length,0,'Per-hit effects and complete distributions must agree with the independent reference');
