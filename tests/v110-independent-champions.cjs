'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {gzipSync} = require('node:zlib');
const {context, baseInput, typeName} = require('./helpers/v0186-reference.cjs');
const {moves} = require('./helpers/v0186-catalog.cjs');
const checkout = fs.realpathSync(process.env.CHAMPIONS_REFERENCE);
const pinned = 'abdce0c64597284c8c463b7f71a38dc4dc55cd10';
assert.equal(execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim(), pinned);
const ref = require(path.join(checkout, 'calc/dist'));
const gen = ref.Generations.get(0);
const jp = Object.fromEntries(Object.entries(typeName).map(([j,e]) => [e,j]));
const directory = process.env.AUDIT_OUTPUT || 'reports/v110-independent';
fs.mkdirSync(directory, {recursive:true});
const seed = 0x1102026;
let state = seed;
function draw(n) {
  state ^= state << 13;
  state ^= state >>> 17;
  state ^= state << 5;
  return (state >>> 0) % n;
}
const teams = [
  ['Garchomp','Sand Veil','sandVeil','Earthquake','earthquake'],
  ['Garchomp','Sand Veil','sandVeil','Bulldoze','gw0170b_010'],
  ['Charizard','Blaze','blaze','Flamethrower','flamethrower'],
  ['Blastoise','Torrent','torrent','Hydro Pump','hydroPump'],
  ['Gardevoir','Synchronize','synchronize','Psychic','psychic'],
  ['Gengar','Cursed Body','cursedBody','Shadow Ball','shadowBall'],
];
const defenders = ['Dragonite','Charizard','Lucario','Abomasnow','Gengar','Blastoise','Tyranitar','Clefable','Garchomp'];
const defensiveAbilities = ['Inner Focus','Blaze','Steadfast','Soundproof','Cursed Body','Torrent','Unnerve','Magic Guard','Sand Veil'];
const weathers = ['none','sun','rain','snow','sand'];
const terrains = ['none','electric','grassy','psychic','misty'];
const items = ['none','expertBelt','lifeOrb'];
const englishItems = ['', 'Expert Belt','Life Orb'];
const keys = new Set(), records = [], ledger = [];
let duplicates = 0, differingRolls = 0;
while (records.length < 12000) {
  const [attName, ability, attAbility, moveName, moveId] = teams[draw(teams.length)];
  const defIndex = draw(defenders.length), defName = defenders[defIndex];
  const registered = moves.find(m => m.id === moveId);
  const special = registered.category === 'special', atk = special ? 'spa' : 'atk', def = special ? 'spd' : 'def';
  const attackStage = draw(13)-6, defenseStage = draw(13)-6;
  const attackPoints = draw(33), defensePoints = draw(33), itemIndex = draw(items.length);
  const critical = !draw(5), doubles = !!draw(2), helpingHand = doubles && !draw(3);
  const weather = weathers[draw(5)], terrain = terrains[draw(5)];
  const screen = draw(2) ? 'none' : special ? 'lightScreen' : 'reflect';
  const burn = !special && !draw(4);
  const attacker = new ref.Pokemon(gen, attName, {level:50, ability, nature:'Serious', evs:{[atk]:attackPoints}, boosts:{[atk]:attackStage}, item:englishItems[itemIndex], status:burn?'brn':''});
  const defender = new ref.Pokemon(gen, defName, {level:50, ability:defensiveAbilities[defIndex], nature:'Serious', evs:{[def]:defensePoints}, boosts:{[def]:defenseStage}});
  const move = new ref.Move(gen, moveName, {isCrit:critical});
  assert.equal(move.bp, registered.power);
  const field = new ref.Field({gameType:doubles?'Doubles':'Singles',weather:({sun:'Sun',rain:'Rain',snow:'Snow',sand:'Sand'})[weather],terrain:({electric:'Electric',grassy:'Grassy',psychic:'Psychic',misty:'Misty'})[terrain],attackerSide:{isHelpingHand:helpingHand},defenderSide:{isReflect:screen==='reflect',isLightScreen:screen==='lightScreen'}});
  const input = {moveId, power:registered.power, category:registered.category, spread:doubles?registered.target:"single", moveType:registered.type, attTypes:attacker.types.map(t=>jp[t]), defTypes:defender.types.map(t=>jp[t]), attack:attacker.rawStats[atk],defense:defender.rawStats[def],hp:defender.maxHP(),currentHp:defender.maxHP(),attMaxHp:attacker.maxHP(),attCurrentHp:attacker.maxHP(),attAbility:['blaze','torrent'].includes(attAbility)?attAbility:'none',defAbility:'none',attItem:items[itemIndex],attackStage,defenseStage,critical,battleFormat:doubles?'doubles':'singles',helpingHand,weather,terrain,screen,burn};
  const key = JSON.stringify(input);
  if (keys.has(key)) { duplicates++; continue; }
  keys.add(key);
  const actual = Array.from(context.ChlohaDamageEngine.calculate({...baseInput,...input}).rolls);
  const raw = ref.calculate(gen,attacker,defender,move,field).damage;
  const expected = typeof raw === 'number' ? Array(16).fill(raw) : raw;
  assert.equal(expected.length,16);
  const differences = expected.filter((n,i)=>n!==actual[i]).length;
  const id = records.length;
  records.push({id,attName,defName,attackPoints,defensePoints,input,actual,expected});
  if (differences) ledger.push({id,differences,status:'UNRESOLVED'});
  differingRolls += differences;
}
fs.writeFileSync(path.join(directory,'cases.jsonl.gz'),gzipSync(records.map(r=>JSON.stringify(r)).join('\n')+'\n'));
fs.writeFileSync(path.join(directory,'MISMATCH_LEDGER.json'),JSON.stringify(ledger));
const summary = {pinned,generation:0,seed,defaultInputs:'tests/fixtures/v0184-public-baseline.json#/cases/0/input',scope:'Native Champions species/moves and level-50 stat points. Field states are scenario inputs; tournament roster and turn-history legality not independently certified.',cases:records.length,rolls:records.length*16,differingRolls,differingCases:ledger.length,duplicates,excluded:0};
fs.writeFileSync(path.join(directory,'DIFFERENTIAL_RESULTS.json'),JSON.stringify(summary,null,2)+'\n');
console.log(summary);
assert.equal(ledger.length,0);
