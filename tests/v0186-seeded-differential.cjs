'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {root,compare,reference,abilityName,context}=require('./helpers/v0186-reference.cjs');
const SEED=0x0186ac;
function generate(count=4000){
 let state=SEED;
 const random=n=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)%n;};
 const pick=a=>a[random(a.length)],bit=()=>random(2)===1;
 const types=Array.from(context.ChlohaBattleData.TYPES);
 const attackers=['none','technician','hugePower','purePower','hustle','guts','solarPower','sniper','analytic','adaptability','tintedLens','overgrow','blaze','torrent','swarm','flashFire','supremeOverlord','waterBubble','plus','minus','steelworker','transistor','dragonsMaw','rockyPayload','stakeout','defeatist'];
 const defenders=['none','furCoat','thickFat','heatproof','multiscale','marvelScale','grassPelt','shellArmor','battleArmor','unaware','filter','solidRock','shadowShield','prismArmor','iceScales','levitate','waterAbsorb','voltAbsorb','sapSipper','flashFire','wonderGuard','drySkin','waterBubble','purifyingSalt'];
 const result=[];
 for(let i=0;i<count;i++){
  const input={power:pick([40,55,60,65,80,90,95,100,120,150]),attack:100+random(160),defense:70+random(160),moveType:pick(types),attTypes:[pick(types)],defTypes:[pick(types)],attAbility:pick(attackers),defAbility:pick(defenders),category:bit()?'physical':'special',attackStage:random(7)-3,defenseStage:random(7)-3,critical:random(5)===0,helpingHand:bit(),friendGuardCount:random(2),spread:bit()?'spread':'single',screen:pick(['none','reflect','lightScreen']),weather:pick(['none','sun','rain','sand','snow']),terrain:pick(['none','electric','grassy','misty','psychic']),attItem:pick(['none','lifeOrb','choiceBand','choiceSpecs','expertBelt']),defItem:pick(['none','assaultVest','autoResistBerry']),burn:random(4)===0,poisoned:random(4)===0,defStatus:pick(['none','burn','poison','paralysis','sleep','freeze']),attCurrentHp:pick([30,80,180]),currentHp:pick([80,180]),forceLowHpAbility:bit(),flashFireActivated:bit(),supremeOverlordFainted:random(6),partnerOppositePlusMinus:bit(),targetSwitchedIn:bit(),stabMode:random(4)?'auto':'none'};
  // A single status at a time; Water Bubble's burn prevention is an existing
  // application convention, not a realizable burned reference Pokemon.
  if(input.burn)input.poisoned=false;
  if(input.attAbility==='waterBubble')input.burn=false;
  if(bit())input.attTypes=[input.moveType];
  if(random(4)===0){const t=pick(types);if(t!==input.defTypes[0])input.defTypes.push(t);}
  const gen0=reference.Generations.get(0);
  const available=(!input.allyBattery&&!input.allyPowerSpot)&&['attAbility','defAbility'].every(k=>input[k]==='none'||gen0.abilities.get(reference.toID(abilityName(input[k]))))&&['attItem','defItem'].every(k=>['none','autoResistBerry'].includes(input[k])||gen0.items.get(reference.toID(input[k])));
  result.push({id:'seed-'+i,input,generation:available&&i%2===0?0:9});
 }
 return result;
}
function run(){
 const failures=[],counts={0:0,9:0};
 for(const c of generate()){
  const r=compare(c.input,{generation:c.generation});counts[c.generation]++;
  if(!r.matches)failures.push({id:c.id,...r});
 }
 const report={seed:SEED,cases:4000,generations:counts,mismatches:failures.length,failures};
 fs.mkdirSync(path.join(root,'reports/v0186'),{recursive:true});
 fs.writeFileSync(path.join(root,'reports/v0186/seeded-differential.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({...report,failures:failures.slice(0,5).map(r=>({id:r.id,generation:r.generation,input:r.input,expected:r.expected,actual:r.actual}))},null,2));
 assert.equal(failures.length,0,'Seeded differences must be investigated; see reports/v0186/seeded-differential.json');
}
if(require.main===module)run();
module.exports={generate,SEED};
