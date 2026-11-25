'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {context, baseInput} = require('./helpers/v0186-reference.cjs');
const checkout = fs.realpathSync(process.env.CHAMPIONS_REFERENCE);
assert.equal(require('node:child_process').execFileSync('git',['-C',checkout,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),'abdce0c64597284c8c463b7f71a38dc4dc55cd10');
const ref = require(path.join(checkout,'calc/dist'));
const gen = ref.Generations.get(0);
const records = [];
for(const defenseStage of [0,-2,-4,-6]) for(const attackStage of [0,2,4,6]) for(const critical of [false,true]){
 const boosts={atk:6,def:6,spa:attackStage,spd:6,spe:6};
 const attacker=new ref.Pokemon(gen,'Gardevoir',{level:50,nature:'Modest',evs:{spa:32},boosts,ability:'Synchronize',item:'Life Orb'});
 const defender=new ref.Pokemon(gen,'Sneasler',{level:50,nature:'Naughty',boosts:{spd:defenseStage},ability:'Unburden'});
 const move=new ref.Move(gen,'Stored Power',{isCrit:critical});
 const field=new ref.Field({terrain:'Psychic',attackerSide:{isHelpingHand:true},gameType:'Doubles'});
 const input={...baseInput,power:20,attack:attacker.rawStats.spa,defense:defender.rawStats.spd,attackStage,defenseStage,critical,moveId:'gw0169_s001',moveMechanic:'storedPower',storedPowerBoosts:boosts,category:'special',attTypes:['エスパー','フェアリー'],defTypes:['かくとう','どく'],moveType:'エスパー',helpingHand:true,terrain:'psychic',attItem:'lifeOrb'};
 const actual=Array.from(context.ChlohaDamageEngine.calculate(input).rolls);
 const expected=ref.calculate(gen,attacker,defender,move,field).damage;
 records.push({input,actual,expected});
}
// Raw-stat overrides deliberately explore the calculator's manual input range.
for(const attack of [100,8191,8192,8193,9999]) for(const defense of [1,23,9999]) for(const attackStage of [0,6]){
 const baseStats={hp:105,atk:attack-20,def:80,spa:80,spd:80,spe:80};
 const attacker=new ref.Pokemon(gen,'Clefable',{level:50,nature:'Serious',ability:'No Ability',boosts:{atk:attackStage},overrides:{baseStats,types:['Water']}});
 const defender=new ref.Pokemon(gen,'Clefable',{level:50,nature:'Serious',ability:'No Ability',overrides:{baseStats:{...baseStats,atk:80,def:defense-20},types:['Normal']}});
 assert.equal(attacker.rawStats.atk,attack);
 assert.equal(defender.rawStats.def,defense);
 const move=new ref.Move(gen,'Artificial Hit',{isCrit:true,overrides:{flags:{},type:'Normal',basePower:500,category:'Physical',target:'normal'}});
 const input={...baseInput,power:500,attack,defense,attackStage,critical:true,moveType:'ノーマル',attTypes:['みず'],defTypes:['ノーマル']};
 const expected=ref.calculate(gen,attacker,defender,move,new ref.Field()).damage;
 const actual=Array.from(context.ChlohaDamageEngine.calculate(input).rolls);
 records.push({scope:'artificial',input,actual,expected});
}
const dir=process.env.AUDIT_OUTPUT||'reports/v110-independent';
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'overflow.json'),JSON.stringify(records));
// Reconstruct the published Power Trip experiment from its numeric inputs.
// Only the observed direction of the HP change is an observation. Numerical
// signed values are predictions, not a measurement of each of the 16 rolls.
const util=require(path.join(checkout,'calc/dist/mechanics/util'));
const base=22n*990n*1536n/13n/50n+2n;
const experiment=Array.from({length:16},(_,i)=>{
 const rolled=base*BigInt(85+i)/100n;
 const stab=(rolled*6144n+2047n)/4096n;
 const product=stab*4n*8192n;
 return {roll:85+i,signedPrediction:Number(BigInt.asIntN(32,product)/4096n),reference:util.getFinalDamage(Number(base),i,4,false,6144,8192,false)};
});
assert.ok(experiment.every(r=>r.signedPrediction<0&&r.reference>0));
fs.writeFileSync(path.join(dir,'signed-hp-witness.json'),JSON.stringify({primary:'https://www.youtube.com/watch?v=MEc9So7IwEY',arithmetic:'https://tetspond.hatenablog.com/entry/2026/10/11/193146',observation:'target healed in historical gameplay',experiment},null,2));
const failures=records.filter(r=>JSON.stringify(r.actual)!==JSON.stringify(r.expected));
console.log(JSON.stringify({cases:records.length,failures:failures.length,first:failures[0]},null,2));
assert.equal(failures.length,0);
