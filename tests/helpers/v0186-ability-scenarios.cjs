'use strict';
const {context,flags,reference,abilityName}=require('./v0186-reference.cjs');
function move(name,more={}){
 const showdownId=reference.toID(name),id=Object.keys(flags).find(k=>flags[k].showdownId===showdownId);
 if(!id)throw Error('Unregistered audit move '+name);
 const m=reference.Generations.get(9).moves.get(showdownId);
 const jp=context.ChlohaBattleData.TYPES[['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'].indexOf(m.type)];
 return {moveId:id,power:m.basePower||80,moveType:jp,category:m.category.toLowerCase(),...more};
}
const attack={
 moldBreaker:{defAbility:'furCoat'},teravolt:{defAbility:'furCoat'},turboblaze:{defAbility:'furCoat'},
 technician:{power:60},sheerForce:move('Flamethrower'),megaLauncher:move('Aura Sphere'),sharpness:move('Slash',{power:80}),
 hugePower:{},purePower:{},hustle:{},solarPower:{category:'special',weather:'sun'},flareBoost:{category:'special',burn:true},toxicBoost:{poisoned:true},
 fireMane:{moveType:'ほのお'},flashFire:{moveType:'ほのお',flashFireActivated:true},defeatist:{attCurrentHp:80},
 orichalcumPulse:{weather:'sun'},hadronEngine:{category:'special',terrain:'electric'},waterBubble:{moveType:'みず'},
 fairyAura:{moveType:'フェアリー'},darkAura:{moveType:'あく'},auraBreak:{defAbility:'fairyAura',moveType:'フェアリー'},
 ironFist:move('Fire Punch'),strongJaw:move('Crunch'),transistor:{moveType:'でんき'},dragonsMaw:{moveType:'ドラゴン'},analytic:{},reckless:move('Flare Blitz'),toughClaws:move('Iron Head'),steelworker:{moveType:'はがね'},steelSpirit:{moveType:'はがね'},
 plus:{category:'special',partnerOppositePlusMinus:true},minus:{category:'special',partnerOppositePlusMinus:true},
 infiltrator:{screen:'reflect'},scrappy:{moveType:'ノーマル',defTypes:['ゴースト']},
 thermalExchange:{thermalExchangeActivated:true},angerPoint:{angerPointActivated:true},rattled:move('Electro Ball',{moveMechanic:'electroBall',rattledActivated:true}),
 drizzle:{moveType:'みず'},drought:{moveType:'ほのお'},sandStream:{defTypes:['いわ'],category:'special'},snowWarning:{defTypes:['こおり']},
 electricSurge:{moveType:'でんき'},grassySurge:{moveType:'くさ'},mistySurge:{moveType:'ドラゴン'},psychicSurge:{moveType:'エスパー'},
 sniper:{critical:true},neuroforce:{moveType:'かくとう'},stakeout:{targetSwitchedIn:true},supremeOverlord:{supremeOverlordFainted:3},rockyPayload:{moveType:'いわ'},sandForce:{weather:'sand'},punkRock:move('Hyper Voice'),
 pixilate:{moveType:'ノーマル'},aerilate:{moveType:'ノーマル'},refrigerate:{moveType:'ノーマル'},galvanize:{moveType:'ノーマル'},dragonize:{moveType:'ノーマル'},normalize:{moveType:'かくとう'},
 overgrow:{moveType:'くさ',attCurrentHp:30},blaze:{moveType:'ほのお',attCurrentHp:30},torrent:{moveType:'みず',attCurrentHp:30},swarm:{moveType:'むし',attCurrentHp:30},guts:{burn:true},adaptability:{},tintedLens:{defTypes:['くさ']},levitate:{moveType:'くさ',terrain:'grassy'},unaware:{defenseStage:3},clearBody:{defAbility:'intimidate'}
};
const defense={
 thickFat:{moveType:'ほのお'},multiscale:{},furCoat:{},iceScales:{category:'special'},punkRock:move('Hyper Voice'),fluffy:move('Iron Head'),auraGuard:move('Iron Head'),bulletproof:move('Aura Sphere'),soundproof:move('Hyper Voice'),
 unaware:{attackStage:3},clearBody:{},intimidate:{},purifyingSalt:{moveType:'ゴースト',defTypes:['エスパー']},shellArmor:{critical:true},battleArmor:{critical:true},grassPelt:{terrain:'grassy'},marvelScale:{defStatus:'poison'},wonderGuard:{},drySkin:{moveType:'ほのお'},heatproof:{moveType:'ほのお'},waterBubble:{moveType:'ほのお'},prismArmor:{moveType:'かくとう'},shadowShield:{},
 levitate:{},waterAbsorb:{moveType:'みず'},voltAbsorb:{moveType:'でんき'},lightningRod:{moveType:'でんき'},motorDrive:{moveType:'でんき'},sapSipper:{moveType:'くさ'},stormDrain:{moveType:'みず'},earthEater:{},wellBakedBody:{moveType:'ほのお'},flashFire:{moveType:'ほのお'},filter:{moveType:'かくとう'},solidRock:{moveType:'かくとう'},fairyAura:{moveType:'フェアリー'},darkAura:{moveType:'あく'},auraBreak:{attAbility:'fairyAura',moveType:'フェアリー'}
};
function generation(input){
 const zero=reference.Generations.get(0);
 return ['attAbility','defAbility'].every(k=>!input[k]||input[k]==='none'||zero.abilities.get(reference.toID(abilityName(input[k]))))?0:9;
}
function scenarios(){
 const cases=[];
 for(const [role,definitions] of Object.entries({attack,defense}))for(const [id,input] of Object.entries(definitions))for(const power of [55,90,121]){
  const a={...input,[role==='attack'?'attAbility':'defAbility']:id,power,attack:157,defense:123};
  cases.push({id:role+'/'+id+'/'+power,role,ability:id,input:a,generation:generation(a),nativeMove:id==='rattled'});
 }
 return cases;
}
module.exports={scenarios,attack,defense,move,generation};
