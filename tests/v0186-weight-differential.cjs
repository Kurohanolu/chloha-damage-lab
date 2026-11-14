'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const {root,context,compare}=require('./helpers/v0186-reference.cjs');
const {moves,pokemon,weights}=require('./helpers/v0186-catalog.cjs');
const targets=moves.filter(m=>['けたぐり','くさむすび','ヘビーボンバー','ヒートスタンプ'].includes(m.name));
assert.equal(targets.length,4);
const boundaries=[.1,9.9,10,24.9,25,49.9,50,99.9,100,199.9,200,999.9];
const pairs=boundaries.flatMap(a=>boundaries.map(d=>[a,d]));
for(let i=0;i<pokemon.length;i++)pairs.push([weights[pokemon[i].id],weights[pokemon[(i*97+23)%pokemon.length].id]]);
let comparisons=0;
for(const m of targets)for(const [attWeight,defWeight] of pairs){
 const power=context.ChlohaWeightPower.weightDependentPower(m.name,attWeight,defWeight);
 const r=compare({power,moveId:m.id,moveType:m.type,category:m.category,attWeight,defWeight},{generation:0,nativeMove:true});
 assert.deepEqual(r.actual,r.expected,m.name+'/'+attWeight+'/'+defWeight);comparisons++;
}
fs.mkdirSync(root+'/reports/v0186',{recursive:true});fs.writeFileSync(root+'/reports/v0186/weight-differential.json',JSON.stringify({moves:4,boundaryPairs:144,rosterPairs:373,comparisons},null,2)+'\n');
console.log('PASS existing weight mechanics:',comparisons,'Champions reference comparisons, every registered form represented');
