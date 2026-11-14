'use strict';
const assert=require('node:assert/strict');
const {baseInput,context,build,reference}=require('./helpers/v0186-reference.cjs');
const fixtures=[
 {name:'Reflect must not choose the category',input:{screen:'reflect'},physical:{attack:200,defense:100},special:{attack:150,defense:100}},
 {name:'Light Screen must not choose the category',input:{screen:'lightScreen'},physical:{attack:100,defense:100},special:{attack:200,defense:100}},
 {name:'Fur Coat must not choose the category',input:{defAbility:'furCoat'},physical:{attack:200,defense:100},special:{attack:150,defense:100}},
 {name:'physical Shell Side Arm makes contact',input:{defAbility:'fluffy'},physical:{attack:200,defense:100},special:{attack:150,defense:100}},
 {name:'special Shell Side Arm does not make contact',input:{defAbility:'fluffy'},physical:{attack:100,defense:100},special:{attack:200,defense:100}},
 {name:'Tough Claws applies to physical category',input:{attAbility:'toughClaws'},physical:{attack:200,defense:100},special:{attack:150,defense:100}},
 {name:'critical does not bypass ranks while choosing category',input:{critical:true,attackStage:-2},physical:{attack:300,defense:100},special:{attack:120,defense:100}},
 {name:'equal ratios retain existing special tie convention',input:{},physical:{attack:150,defense:100},special:{attack:150,defense:100}}
];
for(const f of fixtures){
 const a={...baseInput,...f.input,moveMechanic:'shellSideArm',moveId:'gw0169_s020',power:90,moveType:'どく',category:'special'};
 const b=build(a,{generation:0,nativeMove:true});
 b.attacker.boosts.atk=a.attackStage;b.attacker.boosts.spa=a.attackStage;b.defender.boosts.def=a.defenseStage;b.defender.boosts.spd=a.defenseStage;
 Object.assign(b.attacker.species.baseStats,{atk:f.physical.attack-20,spa:f.special.attack-20});
 Object.assign(b.defender.species.baseStats,{def:f.physical.defense-20,spd:f.special.defense-20});
 const expected=reference.calculate(b.gen,b.attacker.clone(),b.defender.clone(),b.move,b.field);
 const actual=context.ChlohaDamageCalculator.calculate(a,{shellSideArmStats:{physical:f.physical,special:f.special}});
 assert.deepEqual(Array.from(actual.rolls),expected.damage,f.name);
}
console.log('PASS v0.186 Shell Side Arm: '+fixtures.length+' independent category/contact witnesses');
