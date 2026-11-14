'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const {root,compare,context}=require('./helpers/v0186-reference.cjs');
const {scenarios,attack,defense}=require('./helpers/v0186-ability-scenarios.cjs');
for(const [role,definitions,excluded] of [['attack',attack,['none','skillLink']],['defense',defense,['none','overcoat']]]){
 const ids=context.ChlohaAbilityData[role==='attack'?'ATTACKER_ABILITY_IDS':'DEFENDER_ABILITY_IDS'];
 assert.deepEqual([...ids].filter(id=>!excluded.includes(id)).sort(),Object.keys(definitions).sort(),role+': every existing role must have an explicit scenario or separate non-single-hit scope');
}
const failures=[],cases=scenarios();
for(const c of cases){const r=compare(c.input,{generation:c.generation,nativeMove:c.nativeMove});if(!r.matches)failures.push({id:c.id,...r});}
fs.mkdirSync(root+'/reports/v0186',{recursive:true});
fs.writeFileSync(root+'/reports/v0186/ability-differential.json',JSON.stringify({cases:cases.length,mismatches:failures.length,failures},null,2)+'\n');
console.log('Ability witnesses:',cases.length,'mismatches:',failures.length,failures.map(f=>f.id).join(', '));
assert.equal(failures.length,0,'Every ability witness must match the pinned independent reference');
