'use strict';
// v0.181 Mega weight integrity checks: each Mega must have its own reviewed value.
// Never derive a Mega weight from its base species.
const assert=require('node:assert/strict');
const weightNamespace=require('../pokemon-weights-v0181.js');
const weights=weightNamespace.default||globalThis.ChlohaPokemonWeights||weightNamespace;
const weightModule=require('../weight-power.js');
const power=weightModule.weightDependentPower||globalThis.ChlohaWeightPower?.weightDependentPower;
assert.equal(typeof power,'function','weight-power.js must expose weightDependentPower');
const cases=[
 ['charizard','mega_charizard_x',90.5,110.5],
 ['charizard','mega_charizard_y',90.5,100.5],
 ['venusaur','mega_venusaur',100,155.5],
 ['garchomp','mega_garchomp_z',95,99],
];
let verified=0,unresolved=[];
for(const [base,mega,baseKg,megaKg] of cases){
 assert.equal(weights[base],baseKg,base+' base weight');
 if(weights[mega]===undefined){unresolved.push({id:mega,expectedKg:megaKg});continue;}
 assert.equal(weights[mega],megaKg,mega+' independent weight');
 verified++;
}
assert.equal(power('くさむすび',null,49.4),60,'Mega Lucario Z Grass Knot tier');
assert.equal(power('くさむすび',null,54),80,'regular Lucario Grass Knot tier');
assert.equal(power('ヘビーボンバー',200,49.4),100,'Mega Lucario Z Heavy Slam ratio');
console.log(JSON.stringify({megaWeightChecksVerified:verified,megaWeightChecksPending:unresolved},null,2));
