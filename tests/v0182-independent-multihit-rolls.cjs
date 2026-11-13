'use strict';
// Independent exhaustive two-hit 16x16 convolution audit.
// The oracle enumerates 256 equally likely pairs rather than using the
// implementation's convolution/distribution helpers.
const assert=require('node:assert/strict');
const multiHitModule=require('../multi-hit.js');
const {totalDistribution,convolve,koProbability}=multiHitModule.default||globalThis.ChlohaMultiHit||multiHitModule;
const first=Array.from({length:16},(_,i)=>11+Math.floor(i/3));
const second=Array.from({length:16},(_,i)=>17+Math.floor(i/4));
const counts=new Map();
for(const a of first)for(const b of second)counts.set(a+b,(counts.get(a+b)||0)+1);
const oracle=new Map([...counts].sort((a,b)=>a[0]-b[0]).map(([d,n])=>[d,n/256]));
const observed=convolve([first,second],2);
assert.deepEqual([...observed].sort((a,b)=>a[0]-b[0]),[...oracle],'independent 256-pair exact probabilities');
for(let hp=1;hp<=60;hp++){
 const expected=[...counts].reduce((n,[damage,count])=>n+(damage>=hp?count:0),0)/256;
 assert.ok(Math.abs(koProbability(observed,hp)-expected)<1e-12,'KO probability at HP '+hp);
}
assert.equal([...observed.values()].reduce((a,b)=>a+b,0),1,'all 256 outcomes conserved');
// A fixed two-hit move should preserve the same 256-pair reference.
const darts=totalDistribution('ドラゴンアロー',i=>i===0?first:second);
assert.deepEqual([...darts],[...oracle],'Dragon Darts independent per-hit rolls');
// Standard 2-5 hits: independently enumerate 16^2 and 16^3 outcomes,
// and compare their exact hit-count weights to the production distribution.
const identical=Array.from({length:16},(_,i)=>8+Math.floor(i/4));
const perHitCounts=new Map([[0,1]]);
function independentHits(hits){
 let m=new Map([[0,1]]);
 for(let h=0;h<hits;h++){
  const next=new Map();
  for(const [total,count] of m)for(const d of identical)next.set(total+d,(next.get(total+d)||0)+count);
  m=next;
 }
 const denominator=16**hits;
 return new Map([...m].map(([d,count])=>[d,count/denominator]));
}
const combined=new Map();
for(const [hits,weight] of [[2,.35],[3,.35],[4,.15],[5,.15]]){
 for(const [damage,p] of independentHits(hits))combined.set(damage,(combined.get(damage)||0)+p*weight);
}
const observedVariable=totalDistribution('タネマシンガン',()=>identical);
for(const damage of new Set([...combined.keys(),...observedVariable.keys()]))
 assert.ok(Math.abs((combined.get(damage)||0)-(observedVariable.get(damage)||0))<1e-12,'Bullet Seed distribution at '+damage);
console.log('PASS independent 256-pair / 2-5-hit distributions and KO thresholds');
