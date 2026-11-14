'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const {root,reference,context,flags,compare,baseInput}=require('./helpers/v0186-reference.cjs');
const {moves,policies,ready}=require('./helpers/v0186-catalog.cjs');
const failures=[],tested=new Map();let comparisons=0;
const directMechanics=new Set(['none','psyshock','forcedCritical','bodyPress','foulPlay','sacredSword','hpScaledPower','electroBall','gyroBall','acrobatics','reversal','weatherBall','terrainPulse','freezeDry','hardPress','chargeSpABoost']);
function run(m,extra={}){
 const mechanic=policies[m.id]?.mechanic||'none';
 const input={power:m.power||1,moveType:m.type,moveId:m.id,moveMechanic:mechanic,category:m.category,attTypes:[m.type],defTypes:['みず'],attack:153,defense:117,attSpeed:100,defSpeed:150,spread:m.target==='spread'?'spread':'single',...extra};
 let generation=reference.Generations.get(0).moves.get(flags[m.id].showdownId)?0:9;
 if(input.attAbility&&['hugePower','unaware'].includes(input.attAbility))generation=9;
 const result=compare(input,{generation,nativeMove:true});comparisons++;
 if(!result.matches)failures.push({name:m.name,mechanic,...result});
 tested.set(m.id,(tested.get(m.id)||0)+1);
}
for(const m of moves.filter(ready)){
 const mechanic=policies[m.id]?.mechanic||'none';
 if(context.ChlohaMultiHit.hitDistribution(m.name)||context.ChlohaMultiHit.specialMoveSpec(m.name)||['けたぐり','くさむすび','ヘビーボンバー','ヒートスタンプ'].includes(m.name))continue;
 if(!directMechanics.has(mechanic))continue;
 for(const defTypes of [['ノーマル'],['みず']])run(m,{defTypes});
 if(['bodyPress','foulPlay'].includes(mechanic))for(const rank of [-3,0,3])for(const ability of ['none','unaware'])for(const critical of [false,true])run(m,{bodyPressDefenseStage:rank,foulPlayTargetStage:rank,attackStage:1,defAbility:ability,critical});
 if(mechanic==='sacredSword')for(const defenseStage of [-6,-3,0,3,6])run(m,{defenseStage});
 if(['hpScaledPower','reversal'].includes(mechanic))for(const attCurrentHp of [1,7,30,60,90,179,180])run(m,{attCurrentHp});
 if(mechanic==='hardPress')for(const currentHp of [1,27,60,90,179,180])run(m,{currentHp});
 if(['electroBall','gyroBall'].includes(mechanic))for(const attSpeed of [30,100,150,600])for(const defSpeed of [30,100,180])run(m,{attSpeed,defSpeed});
 if(mechanic==='weatherBall')for(const weather of ['sun','rain','sand','snow'])run(m,{weather});
 if(mechanic==='terrainPulse')for(const terrain of ['electric','grassy','misty','psychic'])run(m,{terrain});
 if(mechanic==='chargeSpABoost')run(m,{defAbility:'unaware'});
}
fs.mkdirSync(root+'/reports/v0186',{recursive:true});
fs.writeFileSync(root+'/reports/v0186/move-differential.json',JSON.stringify({moves:tested.size,comparisons,tested:Object.fromEntries(tested),mismatches:failures.length,failures},null,2)+'\n');
console.log('Move differential:',tested.size,'registered moves,',comparisons,'comparisons,',failures.length,'mismatches');
assert.equal(failures.length,0,'See reports/v0186/move-differential.json; do not silently bless unmatched mechanics');
