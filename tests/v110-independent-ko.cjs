'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {context} = require('./helpers/v0186-reference.cjs');
const witness = require('../docs/verification/v110-final-audit/ko-discriminator.json');
const checkout = fs.realpathSync(process.env.CHAMPIONS_REFERENCE);
assert.equal(execFileSync('git',['-C',checkout,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),'abdce0c64597284c8c463b7f71a38dc4dc55cd10');
const ref = require(path.join(checkout,'calc/dist'));
const gen = ref.Generations.get(0);
const a = witness.input;
const attacker = new ref.Pokemon(gen,'Gardevoir',{nature:'Serious',level:50,boosts:a.storedPowerBoosts,item:'Life Orb',evs:{spa:14}});
const defender = new ref.Pokemon(gen,'Sneasler',{nature:'Serious',level:50,boosts:{spd:-4},evs:{spd:5}});
const move = new ref.Move(gen,'Stored Power');
const field = new ref.Field({terrain:'Psychic',gameType:'Doubles',attackerSide:{isHelpingHand:true}});
assert.deepEqual([attacker.rawStats.spa, defender.rawStats.spd, defender.rawStats.hp],[159,105,155]);
const expected = ref.calculate(gen,attacker,defender,move,field).damage;
assert.deepEqual(expected,witness.expected);
const rolls = Array.from(context.ChlohaDamageCalculator.calculate(a,{}).rolls);
assert.deepEqual(rolls,expected);
assert.deepEqual([Math.min(...rolls),Math.max(...rolls),rolls.filter(d=>d>=a.currentHp).length],[57,64839,15]);
console.log(JSON.stringify({rolls,oneHitKO:'15/16',percent:93.75}));
// Independent second attacks use all 256 equally likely pairs, including 57+57.
const pairs = context.ChlohaMultiHit.convolve([rolls,rolls],2);
assert.equal(context.ChlohaMultiHit.koProbability(pairs,155),255/256);
const counts = new Map();
for(const x of expected)for(const y of expected)counts.set(x+y,(counts.get(x+y)||0)+1);
assert.equal(counts.size,pairs.size);
for(const [damage,count] of counts)assert.equal(pairs.get(damage),count/256);

// Expose private production primitives only inside an isolated test VM.
const vm = require('node:vm');
const engineSource = fs.readFileSync(path.resolve(__dirname,'../damage-engine-v0184.js'),'utf8');
const marker = 'window.ChlohaDamageEngine=DamageEngine;';
assert.equal(engineSource.split(marker).length,2);
vm.runInContext(engineSource.replace(marker,'window.testWidths={of16,of32,roundProduct32};'),context);
const util = require(path.join(checkout,'calc/dist/mechanics/util'));
for(const edge of [65535,65536,2**31,2**32]){
 for(const n of [edge-1,edge,edge+1]){
  assert.equal(context.testWidths.of16(n),util.OF16(n));
  assert.equal(context.testWidths.of32(n),util.OF32(n));
  assert.equal(context.testWidths.roundProduct32(n,1),util.pokeRound(util.OF32(n)/4096));
 }
}
