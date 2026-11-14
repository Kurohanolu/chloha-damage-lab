'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const engine=fs.readFileSync(path.resolve(__dirname,'../damage-engine-v0184.js'),'utf8');
const mechanics=fs.readFileSync(path.resolve(__dirname,'../move-mechanics-data-v0184.js'),'utf8');
const abilities=fs.readFileSync(path.resolve(__dirname,'../ability-data-v0184.js'),'utf8');
const source=html+'\n'+engine+'\n'+mechanics+'\n'+abilities;
const context={window:{}};
vm.runInNewContext(abilities,context,{filename:'ability-data-v0184.js'});
const {ATTACKER_ABILITY_IDS,DEFENDER_ABILITY_IDS}=context.window.ChlohaAbilityData;
for(const [name,ids,count] of [['attacker',ATTACKER_ABILITY_IDS,71],['defender',DEFENDER_ABILITY_IDS,40]]){
 assert.ok(Array.isArray(ids)&&Object.isFrozen(ids),name+' validation IDs must be an immutable array');
 assert.equal(ids.length,count,name+' existing validation count, including none');
 assert.equal(new Set(ids).size,count,name+' validation IDs must be unique');
 assert.ok(ids.every(id=>typeof id==='string'),name+' validation IDs must be strings');
}
const allowed=new Set(ATTACKER_ABILITY_IDS);
const defenderAllowed=new Set(DEFENDER_ABILITY_IDS);
assert.match(engine,/!ATTACKER_ABILITY_IDS\.includes\(a\.attAbility\)/,'engine must use attacker validation IDs');
assert.match(engine,/!DEFENDER_ABILITY_IDS\.includes\(a\.defAbility\)/,'engine must use defender validation IDs');
for(const id of ['none','thickFat','multiscale','shadowShield','levitate','unaware','clearBody','intimidate'])
 assert.ok(defenderAllowed.has(id),'Defender ability must pass validation: '+id);
for(const id of ['moldBreaker','drizzle','drought','sandStream','snowWarning','electricSurge','grassySurge','mistySurge','psychicSurge'])
 assert.ok(!defenderAllowed.has(id),'Preserve existing defender validation boundary: '+id);
for(const id of ['battery','powerSpot','unknownAbility','unsupported:unknownAbility','','constructor']){
 assert.ok(!allowed.has(id),'Preserve existing attacker rejection: '+id);
 assert.ok(!defenderAllowed.has(id),'Preserve existing defender rejection: '+id);
}
for(const id of ['none','skillLink','technician','sheerForce','megaLauncher','sharpness','hugePower','purePower','hustle','solarPower','ironFist','strongJaw','transistor','dragonsMaw','analytic','reckless','toughClaws','steelworker','rockyPayload','sandForce','punkRock','pixilate','aerilate','refrigerate','galvanize','dragonize','normalize','overgrow','blaze','torrent','swarm','guts','adaptability','tintedLens','levitate'])
 assert.ok(allowed.has(id),'Attacker ability must pass validation: '+id);
for(const id of ['technician','sheerForce','megaLauncher','sharpness','hugePower','purePower','hustle','solarPower','ironFist','strongJaw','transistor','dragonsMaw','reckless','toughClaws','steelworker','rockyPayload','sandForce','punkRock','overgrow','blaze','torrent','swarm'])
 assert.match(source,new RegExp("registerModifier\\('(?:power|stat)','"+id+"'"),'damage modifier must exist: '+id);
assert.match(source,/registerModifier\('final','analytic',41,/,'Analytic final-damage modifier must exist');
assert.match(source,/アナライズ：発動条件を満たした前提/,'Analytic assumed-active warning must exist');
assert.match(source,/RECKLESS_MOVES=new Set/,'Reckless move list exists');
assert.doesNotMatch(source.match(/const RECKLESS_MOVES=new Set\([^;]+;/)[0],/gw0169_s030/,'Steel Beam must not be boosted');
assert.match(source,/TOUGH_CLAWS_CONTACT_MOVES=new Set/,'contact move set exists');
assert.doesNotMatch(source.match(/const TOUGH_CLAWS_CONTACT_MOVES=new Set\([^;]+;/)[0],/'earthquake'/,'Earthquake is not a contact move');
const snapshot=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../data/showdown-ability-flags-v0182.json'),'utf8'));
const contactSet=source.match(/const TOUGH_CLAWS_CONTACT_MOVES=new Set\((\[[^;]+\])\);/);
assert.ok(contactSet,'Tough Claws contact list');
const actual=new Set(JSON.parse(contactSet[1]));
const expected=Object.entries(snapshot.moves).filter(([,move])=>move.flags.includes('contact')).map(([id])=>id);
assert.equal(Object.keys(snapshot.moves).length,335,'complete move flag coverage');
assert.equal(expected.length,149,'Showdown contact move count');
assert.deepEqual([...actual].sort(),expected.sort(),'Tough Claws set must match pinned Showdown contact flags');
assert.match(source,/toughClaws:\{ja:'かたいツメ',en:'Tough Claws',coverage:'supported'\}/);
assert.match(source,/registerModifier\('power','sandForce',1,c=>c\.a\.attAbility==='sandForce'&&c\.a\.weather==='sand'&&\['いわ','じめん','はがね'\]\.includes\(c\.a\.moveType\)/);
assert.match(source,/PUNK_ROCK_SOUND_MOVES=new Set/);
assert.match(source,/registerModifier\('power','punkRock'/);
assert.doesNotMatch(source.match(/const PUNK_ROCK_SOUND_MOVES=new Set\([^;]+;/)[0],/'earthquake'/);
assert.match(source,/SKIN_ABILITY_TYPES=Object.freeze\(\{pixilate:'フェアリー',aerilate:'ひこう',refrigerate:'こおり',galvanize:'でんき',dragonize:'ドラゴン'\}\)/);
assert.match(source,/registerModifier\('power','skinAbility',0,c=>c\.a\.skinBoost===true/);
assert.match(source,/a\.moveType==='ノーマル'&&Object\.hasOwn\(SKIN_ABILITY_TYPES,a\.attAbility\)/);
assert.match(source,/SKIN_TYPE_EXCLUDED_MOVES=new Set/);
assert.match(source,/a\.attAbility==='normalize'/);
assert.match(source,/\['weatherBall','terrainPulse'\]\.includes\(a\.moveMechanic\)/);
for(const id of ['overgrow','blaze','torrent','swarm'])assert.match(source,new RegExp("registerModifier\\('power','"+id+"',1,c=>c\\.a\\.attAbility==='"+id+"'"));
assert.match(source,/c\.a\.attCurrentHp\*3<=c\.a\.attMaxHp/);
console.log('PASS attacker ability validation and modifier registration');
