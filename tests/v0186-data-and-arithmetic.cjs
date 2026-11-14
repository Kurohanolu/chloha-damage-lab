'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {root,context,reference,compare,typeName,baseInput,abilityName,flags}=require('./helpers/v0186-reference.cjs');
const {html,pokemon,moves,names,findSpecies,isMega,speciesDifference,weights,statNames}=require('./helpers/v0186-catalog.cjs');
const g9=reference.Generations.get(9),g0=reference.Generations.get(0);
assert.equal(pokemon.length,373);assert.equal(moves.length,335);
assert.equal(pokemon.filter(isMega).length,82,'count resolved Mega forms; do not count Meganium by substring');
for(const p of pokemon)assert.equal(isMega(p),(names.pokemon[p.id]||'').startsWith('Mega '),p.id+': independent display/form classification');
assert.equal(new Set(pokemon.map(p=>p.id)).size,pokemon.length);
assert.equal(new Set(moves.map(m=>m.id)).size,moves.length);
assert.deepEqual(Object.keys(flags).sort(),moves.map(m=>m.id).sort(),'every mapped move ID must refer to exactly one existing record');
for(const m of moves){
 const id=flags[m.id].showdownId,ref=g0.moves.get(id)||g9.moves.get(id);
 assert.ok(ref,m.id+': independent move record must exist');
 assert.equal(typeName[m.type],ref.type,m.id+': registered type');
 assert.equal(m.category,ref.category.toLowerCase(),m.id+': registered category');
 assert.equal(m.power,ref.basePower,m.id+': registered base power, using Champions before Gen9');
}
for(const p of pokemon){assert.ok(p.types.every(t=>typeName[t]));assert.ok(Object.values(p.baseStats).every(n=>Number.isInteger(n)&&n>0));assert.ok(Number.isFinite(weights[p.id])&&weights[p.id]>0);}
const speciesReview=[];
for(const p of pokemon){const ref=findSpecies(p,0)||findSpecies(p,9),differences=speciesDifference(p,ref);if(differences.length)speciesReview.push({id:p.id,differences});}
// This historical candidate-data conflict remains visible. The owner confirmed
// Dudunsparce is absent from current Champions and the supplied image is SV.
// It is deferred outside the current rule scope, not promoted to Verified or
// silently normalized to Gen9; re-audit before any future roster adoption.
assert.deepEqual(speciesReview,[{id:'roster_v0107_033',differences:['specialAttack: 58 vs 85']}]);
const source=html.match(/function natureFactor\([^\n]+\nfunction calcStat\([^\n]+/);
assert.ok(source,'public stat functions must be extracted without copying their implementation');
vm.runInContext(source[0],context);
const Stats=require('./reference/node_modules/@smogon/calc/dist/stats').Stats;
const nature={attack:{plus:'Adamant',minus:'Modest'},defense:{plus:'Bold',minus:'Hasty'},specialAttack:{plus:'Modest',minus:'Adamant'},specialDefense:{plus:'Calm',minus:'Naughty'},speed:{plus:'Timid',minus:'Brave'}};
let statCases=0;
for(const p of pokemon)for(const [local,key] of Object.entries(statNames))for(let points=0;points<=32;points++)for(const adjustment of ['neutral','plus','minus']){
 const expected=Stats.calcStat(g0,key,p.baseStats[local],31,points,50,adjustment==='neutral'||local==='hp'?'Serious':nature[local][adjustment]);
 assert.equal(context.calcStat(p,local,points,adjustment),expected,p.id+'/'+local+'/'+points+'/'+adjustment);statCases++;
}
let typeCases=0;
for(const attack of context.ChlohaBattleData.TYPES)for(const defense of context.ChlohaBattleData.TYPES){
 const expected=g9.types.get(reference.toID(typeName[attack])).effectiveness[typeName[defense]];
 assert.equal(context.ChlohaBattleData.EFFECT[attack]?.[defense]??1,expected,attack+'/'+defense);
 const c=compare({moveType:attack,attTypes:[attack],defTypes:[defense],power:91,attack:151,defense:119},{generation:9});
 assert.deepEqual(c.actual,c.expected,'single-type 16 rolls '+attack+'/'+defense);typeCases++;
}
const roundReference=require('./reference/node_modules/@smogon/calc/dist/mechanics/util').pokeRound;
let roundingCases=0;
for(const modifier of [1024,2048,2732,3072,4096,4506,4915,5120,5324,5325,5448,5461,5734,6144,8192])for(let value=1;value<=1024;value++){
 assert.equal(context.ChlohaDamageEngine.pokeRound(value,modifier),roundReference(value*modifier/4096),value+'/'+modifier);roundingCases++;
}
const itemCases=[];
for(const role of ['attack','defense']){
 const ids=context.ChlohaBattleData[role==='attack'?'ATTACKER_ITEM_IDS':'DEFENDER_ITEM_IDS'];
 for(const id of ids){
  if(['none','loadedDice'].includes(id))continue;
  const type=context.ChlohaBattleData.TYPE_PLATES[id]||context.ChlohaBattleData.RESIST_BERRIES[id]||'かくとう';
  const weakness=type==='ノーマル'?'ノーマル':context.ChlohaBattleData.TYPES.find(t=>g9.types.get(reference.toID(typeName[type])).effectiveness[typeName[t]]===2);
  for(const category of ['physical','special']){
   const input={moveType:type,attTypes:[type],defTypes:[weakness],category,power:91,attack:153,defense:117,[role==='attack'?'attItem':'defItem']:id};
   const c=compare(input,{generation:9});assert.deepEqual(c.actual,c.expected,role+'/'+id+'/'+category);itemCases.push({role,id,category});
  }
 }
}
for(const [id,type] of Object.entries(context.ChlohaBattleData.RESIST_BERRIES)){
 const c=compare({moveType:type,defTypes:[type],defItem:id},{generation:9});assert.deepEqual(c.actual,c.expected,id+': non-effective berry must not activate');
}
fs.mkdirSync(root+'/reports/v0186',{recursive:true});
fs.writeFileSync(root+'/reports/v0186/data-and-arithmetic.json',JSON.stringify({pokemon:pokemon.length,megaForms:pokemon.filter(isMega).length,moves:moves.length,moveDataChecks:moves.length,speciesReview,statCases,typeCases,roundingCases,itemCases},null,2)+'\n');
console.log('PASS v0.186 data/arithmetic:',JSON.stringify({moveDataChecks:moves.length,statCases,typeCases,roundingCases,itemCases:itemCases.length,sourceConflicts:speciesReview.length}));
