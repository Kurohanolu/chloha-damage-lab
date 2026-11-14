'use strict';
// Fail before browser setup when a classic script is missing, reordered, or leaks data bindings.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const engineFile='damage-engine-v0184.js';
const modules=new Map([
 ['battle-data-v0184.js','ChlohaBattleData'],
 ['move-mechanics-data-v0184.js','ChlohaMoveMechanicsData'],
 ['ability-data-v0184.js','ChlohaAbilityData']
]);
const scripts=[...html.matchAll(/<script\b([^>]*)>/gi)].flatMap(match=>{
 const src=match[1].match(/\bsrc\s*=\s*["']([^"']+)["']/i);
 return src?[{file:src[1].replace(/^\.\//,''),attributes:match[1]}]:[];
});
for(const file of [...modules.keys(),engineFile]){
 const matches=scripts.filter(script=>script.file===file);
 assert.equal(matches.length,1,file+' must load exactly once');
 assert.doesNotMatch(matches[0].attributes,/(?:\b(?:async|defer)\b|\btype\s*=)/i,file+' must execute as a synchronous classic script');
}
const engineIndex=scripts.findIndex(script=>script.file===engineFile);
for(const file of modules.keys()){
 assert.ok(scripts.findIndex(script=>script.file===file)<engineIndex,file+' must load before the engine');
}

const context=vm.createContext({});
vm.runInContext('window=globalThis',context);
for(const {file} of scripts){
 if(!modules.has(file)&&file!==engineFile)continue;
 vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file,timeout:1000});
 if(modules.has(file)){
  const data=context[modules.get(file)];
  assert.ok(data&&Object.isFrozen(data),file+' must expose its data namespace');
  for(const key of Object.keys(data)){
   assert.equal(vm.runInContext('typeof '+key,context),'undefined',file+' must keep '+key+' inside its own scope');
  }
 }
}
assert.equal(typeof context.ChlohaDamageEngine?.calculate,'function','engine must initialize');
assert.equal(context.ChlohaDamageEngine.version,'0.184','internal engine version');
const {ABILITY_CATALOG,ABILITY_ID_BY_JA}=context.ChlohaAbilityData;
assert.equal(Object.keys(ABILITY_CATALOG).length,70,'existing ability catalog size');
assert.equal(Object.keys(ABILITY_ID_BY_JA).length,70,'one Japanese lookup per catalog entry');
for(const [id,ability] of Object.entries(ABILITY_CATALOG)){
 assert.equal(ABILITY_ID_BY_JA[ability.ja],id,'Japanese ability lookup: '+id);
}
assert.ok(vm.runInContext('ABILITY_CATALOG===window.ChlohaAbilityData.ABILITY_CATALOG&&ABILITY_ID_BY_JA===window.ChlohaAbilityData.ABILITY_ID_BY_JA',context),'inline UI must retain access to the same ability metadata');

const input={
 level:50,power:100,attack:150,defense:120,hp:180,currentHp:180,
 attackStage:0,defenseStage:0,attAbility:'none',defAbility:'none',
 attItem:'none',defItem:'none',stabMode:'auto',attMaxHp:180,attCurrentHp:180,
 helpingHand:false,friendGuardCount:0,battleFormat:'singles',spread:'single',
 weather:'none',terrain:'none',category:'physical',screen:'none',
 burn:false,critical:false,moveMechanic:'none',moveId:'',
 attTypes:['じめん'],defTypes:['ノーマル'],moveType:'じめん',
 customMultiplier:1,attGrounding:'auto',defGrounding:'auto'
};
const snapshot=JSON.stringify(input);
const result=context.ChlohaDamageEngine.calculate(input);
const standardRolls=[72,73,73,75,75,76,76,78,79,79,81,81,82,82,84,85];
assert.deepEqual(Array.from(result.rolls),standardRolls,'initialization must preserve the characterized sixteen-roll vector');
assert.equal(JSON.stringify(input),snapshot,'initialization probe must not mutate its input');

// Characterized boundaries: ability immunity is bypassed; type immunity and Shadow Shield remain.
const zeroRolls=Array(16).fill(0);
const shieldRolls=[36,36,36,37,37,38,38,39,39,39,40,40,41,41,42,42];
const bypassProbes=[
 ['Levitate blocks Ground',{defAbility:'levitate'},zeroRolls],
 ['Shadow Shield halves full-HP damage',{defAbility:'shadowShield'},shieldRolls]
];
for(const attAbility of ['moldBreaker','teravolt','turboblaze']){
 bypassProbes.push(
  [attAbility+' bypasses Levitate',{attAbility,defAbility:'levitate'},standardRolls],
  [attAbility+' preserves Shadow Shield',{attAbility,defAbility:'shadowShield'},shieldRolls],
  [attAbility+' preserves Flying type immunity',{attAbility,defAbility:'levitate',defTypes:['ひこう']},zeroRolls]
 );
}
for(const [name,overrides,expected] of bypassProbes){
 const probe={...input,...overrides};
 const before=JSON.stringify(probe);
 assert.deepEqual(Array.from(context.ChlohaDamageEngine.calculate(probe).rolls),expected,name);
 assert.equal(JSON.stringify(probe),before,name+': caller input must remain unchanged');
}
console.log('PASS v0.184 engine initialization: scoped data modules, UI metadata, sixteen-roll vector, and '+bypassProbes.length+' ability-bypass probes');
