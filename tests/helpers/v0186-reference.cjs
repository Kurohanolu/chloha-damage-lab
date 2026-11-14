'use strict';
// Audit-only adapter. The public application never imports the reference package.
const fs=require('node:fs');
const path=require('node:path');
const {root,loadCurrent}=require('./v0184-engine-harness.cjs');
const reference=require('../reference/node_modules/@smogon/calc');
const context=loadCurrent();
const TYPES_EN=['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'];
const typeName=Object.fromEntries(context.ChlohaBattleData.TYPES.map((name,i)=>[name,TYPES_EN[i]]));
const flags=JSON.parse(fs.readFileSync(path.join(root,'data/showdown-ability-flags-v0182.json'),'utf8')).moves;
const baseInput=require('../fixtures/v0184-public-baseline.json').cases[0].input;
const abilityNames={none:'',...Object.fromEntries(Object.entries(context.ChlohaAbilityData.ABILITY_CATALOG).map(([id,a])=>[id,a.en])),auraGuard:'Aura Guard',wellBakedBody:'Well-Baked Body'};
function abilityName(id){return abilityNames[id]??id.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase());}
function itemName(id,gen,input){
 if(id==='none')return '';
 if(id==='autoResistBerry')id=Object.keys(context.ChlohaBattleData.RESIST_BERRIES).find(k=>context.ChlohaBattleData.RESIST_BERRIES[k]===input.moveType);
 const item=gen.items.get(reference.toID(id));
 if(!item)throw Error('Reference item is unavailable: '+id+' in generation '+gen.num);
 return item.name;
}
const status={none:'',burn:'brn',poison:'psn',paralysis:'par',sleep:'slp',freeze:'frz'};
function pokemon(gen,types,stats,options){
 const full={hp:180,atk:100,def:100,spa:100,spd:100,spe:100,...stats};
 // With neutral nature, zero points/EVs, IV31 and Lv50, both references
 // give base+20 (HP base+75). Species overrides survive reference cloning.
 const baseStats=Object.fromEntries(Object.entries(full).map(([k,v])=>[k,v-(k==='hp'?75:20)]));
 // Start from a monotype reference record: upstream's deep array merge would
 // otherwise retain a second type from the anchor species.
 const expectedTypes=types.map(t=>typeName[t]||t);
 const p=new reference.Pokemon(gen,'Clefable',{level:50,nature:'Serious',...options,overrides:{types:expectedTypes,baseStats}});
 if(JSON.stringify(p.types)!==JSON.stringify(expectedTypes))throw Error('Reference type adapter failed');
 for(const [stat,value] of Object.entries(full))if(p.rawStats[stat]!==value)throw Error('Reference stat adapter failed for '+stat);
 return p;
}
function build(input,options={}){
 const a={...structuredClone(baseInput),...structuredClone(input)},gen=reference.Generations.get(options.generation??0);
 const attAbility=abilityName(a.attAbility),defAbility=abilityName(a.defAbility);
 const attackStat=a.category==='special'?'spa':'atk',defenseStat=a.category==='physical'||a.moveMechanic==='psyshock'?'def':'spd';
 const atkStats={hp:a.attMaxHp,spe:a.attSpeed,[attackStat]:a.attack};
 if(a.moveMechanic==='bodyPress')atkStats.def=a.attack;
 const defStats={hp:a.hp,spe:a.defSpeed,[defenseStat]:a.defense};
 if(a.moveMechanic==='foulPlay')defStats.atk=a.attack;
 const triggeredStage=a.attAbility==='angerPoint'&&a.angerPointActivated&&a.category==='physical'?6:a.attAbility==='thermalExchange'&&a.thermalExchangeActivated&&a.category==='physical'?Math.min(6,a.attackStage+1):a.attackStage;
 const speedStage=a.attAbility==='rattled'&&a.rattledActivated?Math.min(6,a.attSpeedStage+1):a.attSpeedStage;
 const attacker=pokemon(gen,a.stabMode==='none'?(a.attTypes.filter(t=>t!==a.moveType).length?a.attTypes.filter(t=>t!==a.moveType):['???']):a.attTypes,atkStats,{ability:attAbility||'No Ability',item:itemName(a.attItem,gen,a),curHP:a.forceLowHpAbility&&['overgrow','blaze','torrent','swarm'].includes(a.attAbility)?1:a.attCurrentHp,status:a.burn?'brn':a.poisoned?'psn':a.attParalyzed?'par':'',alliesFainted:a.supremeOverlordFainted||0,abilityOn:(a.attAbility==='flashFire'&&a.flashFireActivated)||(['plus','minus'].includes(a.attAbility)&&a.partnerOppositePlusMinus)||(a.attAbility==='stakeout'&&a.targetSwitchedIn)||a.attAbility==='analytic',boosts:{[attackStat]:triggeredStage,spe:speedStage,...(a.moveMechanic==='bodyPress'?{def:a.bodyPressDefenseStage}:{}),...(a.moveMechanic==='storedPower'?a.storedPowerBoosts:{})}});
 // storedPowerBoosts belongs only to Stored Power; do not overwrite normal ranks.
 if(a.moveMechanic!=='storedPower')attacker.boosts[attackStat]=triggeredStage;
 const defender=pokemon(gen,a.defTypes,defStats,{ability:defAbility||'No Ability',abilityOn:a.defAbility==='intimidate',item:itemName(a.defItem,gen,a),curHP:a.currentHp||1,status:status[a.defStatus||'none'],boosts:{[defenseStat]:a.defenseStage,spe:a.defSpeedStage,...(a.moveMechanic==='foulPlay'?{atk:a.foulPlayTargetStage}: {})}});
 const mapped=flags[a.moveId],registered=mapped&&(gen.moves.get(mapped.showdownId)||reference.Generations.get(9).moves.get(mapped.showdownId));
 const native=options.nativeMove===true;
 const move=new reference.Move(gen,native&&registered?registered.name:'Audit Strike',{ability:attAbility,hits:1,isCrit:a.critical||a.moveMechanic==='forcedCritical',overrides:{basePower:a.power,type:typeName[a.moveType],category:a.category==='physical'?'Physical':'Special',flags:registered?.flags||{},secondaries:registered?.secondaries,recoil:registered?.recoil,hasCrashDamage:registered?.hasCrashDamage,target:a.spread==='spread'?'allAdjacentFoes':'normal',...(a.moveMechanic==='psyshock'?{overrideDefensiveStat:'def'}:{}),...(a.moveMechanic==='sacredSword'?{ignoreDefensive:true}:{}),...(options.moveOverrides||{})}});
 const weather=a.weather!=='none'?a.weather:({drizzle:'rain',drought:'sun',sandStream:'sand',snowWarning:'snow'}[a.attAbility]||{drizzle:'rain',drought:'sun',sandStream:'sand',snowWarning:'snow'}[a.defAbility]||'none');
 const terrain=a.terrain!=='none'?a.terrain:({electricSurge:'electric',grassySurge:'grassy',mistySurge:'misty',psychicSurge:'psychic'}[a.attAbility]||{electricSurge:'electric',grassySurge:'grassy',mistySurge:'misty',psychicSurge:'psychic'}[a.defAbility]||'none');
 const field=new reference.Field({gameType:a.battleFormat==='singles'?'Singles':'Doubles',weather:{sun:'Sun',rain:'Rain',sand:'Sand',snow:'Snow'}[weather],terrain:{electric:'Electric',grassy:'Grassy',misty:'Misty',psychic:'Psychic'}[terrain],attackerSide:{isHelpingHand:a.helpingHand,isBattery:a.allyBattery,isPowerSpot:a.allyPowerSpot,isTailwind:a.attTailwind},defenderSide:{isReflect:a.screen==='reflect',isLightScreen:a.screen==='lightScreen',isFriendGuard:a.friendGuardCount>0,isTailwind:a.defTailwind,isSwitching:a.targetSwitchedIn?'out':undefined}});
 return {a,gen,attacker,defender,move,field};
}
function compare(input,options={}){
 const b=build(input,options),actual=context.ChlohaDamageEngine.calculate(b.a);
 const result=reference.calculate(b.gen,b.attacker,b.defender,b.move,b.field);
 const expected=typeof result.damage==='number'?Array(16).fill(result.damage):result.damage;
 if(!Array.isArray(expected)||expected.length!==16||expected.some(n=>!Number.isInteger(n)))throw Error('Expected a single-hit reference vector');
 return {input:b.a,generation:b.gen.num,expected,actual:Array.from(actual.rolls),matches:JSON.stringify(expected)===JSON.stringify(actual.rolls),trace:Array.from(actual.trace)};
}
module.exports={root,reference,context,TYPES_EN,typeName,flags,baseInput,abilityName,build,compare};
