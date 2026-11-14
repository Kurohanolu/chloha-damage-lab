'use strict';
// Regenerate only from the immutable public v0.183 source commit, never from new engine output.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {root,loadLegacy,loadCurrent,observe}=require('../tests/helpers/v0184-engine-harness.cjs');
const sourceCommit='6fe0e8b0f85c30dde029c617254b75b86dd4636b';
const read=file=>execFileSync('git',['show',sourceCommit+':'+file],{cwd:root,encoding:'utf8',maxBuffer:4*1024*1024});
const legacy=loadLegacy(read),current=loadCurrent({legacyUI:process.argv.includes('--legacy-ui')});
const base={level:50,power:80,attack:150,defense:120,hp:180,currentHp:180,attackStage:0,defenseStage:0,attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',stabMode:'auto',attMaxHp:180,attCurrentHp:180,helpingHand:false,friendGuardCount:0,battleFormat:'doubles',spread:'single',weather:'none',terrain:'none',category:'physical',screen:'none',burn:false,critical:false,moveMechanic:'none',moveId:'',attTypes:['じめん'],defTypes:['ノーマル'],moveType:'じめん',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:150,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false,hitsTaken:2,faintedAllies:2,storedPowerBoosts:{atk:2,def:0,spa:1,spd:0,spe:0,accuracy:0,evasion:0},ragingBullForm:'combat',auraWheelForm:'hangry'};
const cases=[];
function add(name,overrides={},options={},entry='core'){
 const input=structuredClone({...base,...overrides});
 const expected=observe(legacy,entry,structuredClone(input),structuredClone(options),true);
 const actual=observe(current,entry,structuredClone(input),structuredClone(options),process.argv.includes('--legacy-ui'));
 assert.deepEqual(actual,expected,name+': existing branch must match public baseline before freezing');
 cases.push({name,entry,input,options,expected});
}
add('neutral');
const oldData=vmValue=>require('node:vm').runInContext(vmValue,legacy);
for(const type of oldData('TYPES'))add('type '+type,{moveType:type,attTypes:[type],defTypes:[type]});
for(const attAbility of oldData("['none',...Object.keys(ABILITY_CATALOG),'unaware','clearBody']"))add('attacker '+attAbility,{attAbility});
const defense=oldData("['none','thickFat','multiscale','furCoat','iceScales','punkRock','fluffy','auraGuard','bulletproof','soundproof','overcoat','unaware','clearBody','intimidate','purifyingSalt','shellArmor','battleArmor','grassPelt','marvelScale','wonderGuard','drySkin','heatproof','waterBubble','prismArmor','shadowShield','levitate','waterAbsorb','voltAbsorb','lightningRod','motorDrive','sapSipper','stormDrain','earthEater','wellBakedBody','flashFire','filter','solidRock','fairyAura','darkAura','auraBreak']");
for(const defAbility of defense)add('defender '+defAbility,{defAbility});
for(const attItem of oldData("['none','loadedDice','lifeOrb','choiceBand','choiceSpecs','expertBelt',...Object.keys(TYPE_PLATES)]"))add('attacker item '+attItem,{attItem});
for(const defItem of oldData("['none','assaultVest','autoResistBerry',...Object.keys(RESIST_BERRIES)]"))add('defender item '+defItem,{defItem});
const html=read('index.html');
const mechanics=[...html.match(/if\(!\[([^\]]+)\]\.includes\(a\.moveMechanic\|\|'none'\)\)/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
for(const moveMechanic of mechanics)add('mechanic '+moveMechanic,{moveMechanic,terrain:'psychic',conditionalPower:true,critical:true});
for(const weather of ['none','rain','sun','sand','snow'])for(const terrain of ['none','electric','grassy','misty','psychic'])add('field '+weather+'/'+terrain,{weather,terrain,attItem:'lifeOrb',defItem:'autoResistBerry',moveType:'みず',attTypes:['みず'],defTypes:['ほのお'],category:'special',critical:true,helpingHand:true,friendGuardCount:1,spread:'spread'});
const catalog=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]);
const flags=JSON.parse(read('data/showdown-ability-flags-v0182.json'));
for(const id of Object.keys(flags.championsPowerOverrides||{})){
 const move=catalog.moves.find(m=>m.id===id);
 add('Champions override '+id,{moveId:id,power:move.power,moveType:move.type,category:move.category,attAbility:'sharpness'});
}
for(const overrides of [{attItem:'assaultVest'},{defItem:'lifeOrb'},{attAbility:'unsupported:test'},{defAbility:'drizzle'},{moveMechanic:'unknown'},{power:0},{terrain:'invalid'}])add('rejection '+JSON.stringify(overrides),overrides);
const stats={physical:{attack:250,defense:80},special:{attack:100,defense:200}};
add('Shell Side Arm physical',{moveMechanic:'shellSideArm'},{shellSideArmStats:stats},'move');
add('Shell Side Arm special',{moveMechanic:'shellSideArm'},{shellSideArmStats:{physical:stats.special,special:stats.physical}},'move');
add('Shell Side Arm tie',{moveMechanic:'shellSideArm'},{shellSideArmStats:{physical:{attack:150,defense:120},special:{attack:150,defense:120}}},'move');
add('Shell Side Arm missing stats',{moveMechanic:'shellSideArm'},{},'move');
for(const beatUpStats of ['1','255','55,125,95','255,255,255,255,255,255','','0','256','1,2,3,4,5,6,7','1,,2','x'])add('Beat Up '+beatUpStats,{moveMechanic:'beatUpManual'},{beatUpStats},'move');
add('Beat Up zero target HP',{moveMechanic:'beatUpManual',currentHp:0},{beatUpStats:'55,125'},'move');
add('Beat Up Multiscale guard',{moveMechanic:'beatUpManual',defAbility:'multiscale'},{beatUpStats:'55,125'},'move');
for(const multiHitMove of ['タネマシンガン','つららばり','ロックブラスト','みずしゅりけん','ツインビーム','ドラゴンアロー'])for(const mode of ['normal','dice','link'])add('multi '+multiHitMove+'/'+mode,{power:25,attItem:mode==='dice'?'loadedDice':'none',attAbility:mode==='link'?'skillLink':'none'},{multiHitMove},'move');
add('Dragon Darts one target hit',{power:50},{multiHitMove:'ドラゴンアロー',dragonDartsHits:'1'},'move');
add('multi Multiscale guard',{defAbility:'multiscale'},{multiHitMove:'タネマシンガン'},'move');
for(const specialMultiHitMove of ['ネズミざん','トリプルアクセル'])for(const mode of ['normal','dice','link','both'])add('special '+specialMultiHitMove+'/'+mode,{power:20,attItem:['dice','both'].includes(mode)?'loadedDice':'none',attAbility:['link','both'].includes(mode)?'skillLink':'none'},{specialMultiHitMove},'move');
add('special Multiscale guard',{defAbility:'multiscale'},{specialMultiHitMove:'ネズミざん'},'move');
const output=path.join(root,'tests/fixtures/v0184-public-baseline.json');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify({sourceCommit,sourceRelease:'v0.183 Pre-Release 28',cases},null,2)+'\n');
console.log('PASS froze '+cases.length+' public-baseline cases, including full traces and probability distributions');
