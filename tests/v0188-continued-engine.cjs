'use strict';
// Screen-breaking regressions use an integer oracle independent of the engine,
// then a locked external calculator. No fixture is regenerated from actuals.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {root,loadCurrent}=require('./helpers/v0184-engine-harness.cjs');
const {compare}=require('./helpers/v0186-reference.cjs');
const context=loadCurrent();
const baseline=require('./fixtures/v0184-public-baseline.json').cases[0].input;
const moves=[
 {id:'gw0169_p022',name:'Brick Break',power:75,type:'かくとう',immuneType:'ゴースト'},
 {id:'v096_085',name:'Psychic Fangs',power:85,type:'エスパー',immuneType:'あく'}
];
function inputFor(move,extra={}){
 return {...structuredClone(baseline),moveId:move.id,moveMechanic:'none',power:move.power,moveType:move.type,
  attTypes:['ノーマル'],defTypes:['ノーマル'],attack:153,defense:117,category:'physical',screen:'reflect',...extra};
}
const witnessRolls={
 gw0169_p022:[76,76,78,78,80,80,80,82,82,84,84,86,86,88,88,90],
 v096_085:[42,43,43,44,44,45,45,46,46,47,47,48,48,49,49,50]
};
// Fixed numeric witnesses fail on the old implementation before testing the
// larger matrix; neither expectation calls calculate() with screen='none'.
for(const move of moves)assert.deepEqual(Array.from(context.ChlohaDamageEngine.calculate(inputFor(move)).rolls),witnessRolls[move.id],move.name+' removes Reflect before damage');

const FP=4096n;
const roundDownTie=(n,modifier)=>(n*modifier+2047n)/FP;
function ranked(n,rank){
 return BigInt(n)*BigInt(rank>=0?2+rank:2)/BigInt(rank>=0?2:2-rank);
}
function oracle(a,effectiveness){
 let attack=ranked(a.attack,a.critical?Math.max(0,a.attackStage):a.attackStage);
 let defense=ranked(a.defense,a.critical?Math.min(0,a.defenseStage):a.defenseStage);
 attack=attack||1n;defense=defense||1n;
 let base=22n*BigInt(a.power)*attack/defense/50n+2n;
 if(a.critical)base=base*3n/2n;
 let finalModifier=FP;
 for(const modifier of [a.friendGuardCount?3072n:null,a.attItem==='lifeOrb'?5324n:null,a.defItem==='autoResistBerry'&&effectiveness>1?2048n:null]){
  if(modifier!==null)finalModifier=(finalModifier*modifier+2048n)/FP;
 }
 return Array.from({length:16},(_,index)=>{
  let damage=base*BigInt(85+index)/100n;
  if(a.stabMode!=='none'&&a.attTypes.includes(a.moveType))damage=roundDownTie(damage,6144n);
  damage*=BigInt(effectiveness);
  if(a.burn)damage/=2n;
  if(finalModifier!==FP)damage=roundDownTie(damage||1n,finalModifier);
  return Number(damage||1n);
 });
}
let arithmeticCases=0,referenceCases=0,unaffectedCases=0,immunityCases=0;
for(const move of moves)for(const battleFormat of ['singles','doubles'])for(const screen of ['none','reflect','lightScreen'])
for(const critical of [false,true])for(const [attack,defense,attackStage,defenseStage] of [[101,99,-1,2],[153,117,0,0],[197,203,2,-1]])
for(const profile of [
 {},
 {burn:true,attItem:'lifeOrb',attTypes:[move.type]},
 {friendGuardCount:battleFormat==='doubles'?1:0,attItem:'lifeOrb',defItem:'autoResistBerry',defTypes:move.id==='gw0169_p022'?['ノーマル']:['かくとう']}
]){
 const a=inputFor(move,{battleFormat,screen,critical,attack,defense,attackStage,defenseStage,...profile});
 const effect=move.id==='gw0169_p022'||a.defTypes[0]==='かくとう'?2:1;
 const before=JSON.stringify(a);
 const actual=Array.from(context.ChlohaDamageEngine.calculate(a).rolls);
 assert.deepEqual(actual,oracle(a,effect),'independent screen-break arithmetic '+JSON.stringify(a));
 assert.equal(JSON.stringify(a),before,'calculator must not clear the caller\'s selected screen');
 arithmeticCases++;
 for(const generation of [0,9]){
  const r=compare(a,{generation,nativeMove:true});
  assert.deepEqual(r.actual,r.expected,'locked reference '+generation+'/'+move.name+'/'+screen+'/'+battleFormat);
  referenceCases++;
 }
}
// Interactions outside the small arithmetic oracle retain their own modifiers.
for(const move of moves)for(const generation of [0,9])for(const extra of [
 {attAbility:'strongJaw'}, {attAbility:'toughClaws',defAbility:'fluffy'},
 {attAbility:'moldBreaker',defAbility:'furCoat'}, {defAbility:'filter'},
 {defAbility:'multiscale',friendGuardCount:1}, {attAbility:'infiltrator'}
]){
 const r=compare(inputFor(move,extra),{generation,nativeMove:true});
 assert.deepEqual(r.actual,r.expected,'other modifiers survive '+generation+'/'+move.name+'/'+JSON.stringify(extra));
 referenceCases++;
}
// Immune targets stay immune, rather than being clamped to minimum one damage.
for(const move of moves)for(const screen of ['none','reflect','lightScreen']){
 const a=inputFor(move,{defTypes:[move.immuneType],screen,attItem:'lifeOrb',friendGuardCount:1});
 assert.deepEqual(Array.from(context.ChlohaDamageEngine.calculate(a).rolls),Array(16).fill(0));
 immunityCases++;
}
// Stable identifiers, not names/substring matches, determine screen bypass.
for(const move of moves)for(const moveId of ['',move.name,move.id+'-other'])for(const battleFormat of ['singles','doubles']){
 const a=inputFor(move,{moveId,battleFormat});
 const actual=Array.from(context.ChlohaDamageEngine.calculate(a).rolls);
 const finalModifier=battleFormat==='singles'?2048n:2732n;
 assert.deepEqual(actual,witnessRolls[move.id].map(n=>Number(roundDownTie(BigInt(n),finalModifier))));
 unaffectedCases++;
}
for(const generation of [0,9])for(const category of ['physical','special'])for(const battleFormat of ['singles','doubles']){
 const a=inputFor(moves[0],{moveId:'',category,battleFormat,screen:category==='physical'?'reflect':'lightScreen'});
 const r=compare(a,{generation});assert.deepEqual(r.actual,r.expected,'unrelated moves keep screens');unaffectedCases++;
}
// Prove both numeric witnesses fail against the exact pre-correction source.
const old=loadCurrent(),priorHead='8b37bddbb236fa1b7fbd13a7b2cebd1518995437';
vm.runInContext(execFileSync('git',['show',priorHead+':damage-engine-v0184.js'],{cwd:root,encoding:'utf8'}),old);
for(const move of moves)assert.notDeepEqual(Array.from(old.ChlohaDamageEngine.calculate(inputFor(move)).rolls),witnessRolls[move.id],'old source must reproduce '+move.name);
const report={audit:'v0188-continued-engine',priorHead,arithmeticCases,referenceCases,unaffectedCases,immunityCases,oldFailingWitnesses:2,physicalGameVerified:false,ragingBullScreenBreaking:'documented unsupported; unchanged'};
fs.mkdirSync(path.join(root,'reports/v0188-continued'),{recursive:true});
fs.writeFileSync(path.join(root,'reports/v0188-continued/engine.json'),JSON.stringify(report,null,2)+'\n');
console.log('PASS '+JSON.stringify(report));
