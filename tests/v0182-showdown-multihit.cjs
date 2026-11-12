'use strict';
// Independent reference: @smogon/calc (Showdown Gen9). Verify 2-5 hit
// total-damage bounds against the multi-hit convolution using Showdown's
// own per-hit 16-roll values; never assume a fixed hit count for all turns.
const assert=require('node:assert/strict');
const {calculate,Generations,Pokemon,Move,Field}=require('@smogon/calc');
const engine=require('../multi-hit.js');
const {totalDistribution,hitDistribution}=engine.default||globalThis.ChlohaMultiHit||engine;
const gen=Generations.get(9);
const attacker=new Pokemon(gen,'Cloyster',{level:50,ability:'Skill Link',evs:{atk:252}});
const defender=new Pokemon(gen,'Blissey',{level:50,evs:{hp:252,def:252}});
for(const [moveName,japanese] of [['Icicle Spear','つららばり'],['Rock Blast','ロックブラスト']]){
 const move=new Move(gen,moveName);
 const result=calculate(gen,attacker,defender,move,new Field());
 const raw=result.damage;
 assert.ok(Array.isArray(raw),moveName+' Showdown must return damage rolls');
 // @smogon/calc represents multi-hit moves with per-hit damage arrays;
 // extract the first hit, not the already aggregated total.
 const single=Array.isArray(raw[0])?raw[0]:raw;
 assert.equal(single.length,16,moveName+' Showdown per-hit rolls');
 const hitCounts=hitDistribution(japanese,{skillLink:true});
 assert.deepEqual(hitCounts,{5:1});
 const totals=totalDistribution(japanese,()=>single,{skillLink:true});
 assert.equal(Math.min(...totals.keys()),Math.min(...single)*5,moveName+' min');
 assert.equal(Math.max(...totals.keys()),Math.max(...single)*5,moveName+' max');
 assert.ok(Math.abs([...totals.values()].reduce((a,b)=>a+b,0)-1)<1e-10,moveName+' probability mass');
 console.log('PASS Showdown reference',moveName,'single hit',Math.min(...single),Math.max(...single),'five hits',Math.min(...totals.keys()),Math.max(...totals.keys()));
}

// Dragon Darts: two strikes against the same selected defender (single-target scenario).
assert.deepEqual(hitDistribution('ドラゴンアロー'),{2:1});
const dartsRolls=Array.from({length:16},(_,i)=>30+i);
const dartsTotals=totalDistribution('ドラゴンアロー',()=>dartsRolls);
assert.equal(Math.min(...dartsTotals.keys()),60);
assert.equal(Math.max(...dartsTotals.keys()),90);
assert.ok(Math.abs([...dartsTotals.values()].reduce((a,b)=>a+b,0)-1)<1e-10);
console.log('PASS Dragon Darts two-hit selected-target distribution');
