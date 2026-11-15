'use strict';
// Additional audit checks: independent integer arithmetic and exact historical
// public contracts. No expected vectors are regenerated from today's engine.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {root,loadCurrent,observe}=require('./helpers/v0184-engine-harness.cjs');
const context=loadCurrent();
const original=require('./fixtures/v0184-public-baseline.json').cases[0].input;
const base={...structuredClone(original),moveType:'ノーマル',attTypes:['ノーマル'],defTypes:['ノーマル'],stabMode:'none'};
const calculate=extra=>context.ChlohaDamageEngine.calculate({...structuredClone(base),...extra});
const vector=extra=>Array.from(calculate(extra).rolls);
const histories=['4b2cde61f92610c5bb970618d34147a2c16a8d7b','7210be99c39d75b49ea8200aad91d75801eb300a'];
const runtimeFiles=['battle-data-v0184.js','move-mechanics-data-v0184.js','ability-data-v0184.js','damage-engine-v0184.js','multi-hit.js','variable-power.js','damage-calculator-v0184.js'];
function historic(sha){
 const ctx=vm.createContext({});vm.runInContext('window=globalThis',ctx);
 for(const file of runtimeFiles){const source=execFileSync('git',['show',sha+':'+file],{cwd:root,encoding:'utf8',maxBuffer:5*1024*1024});vm.runInContext(source,ctx,{filename:sha+'/'+file,timeout:1000});}
 return ctx;
}
// Independent rational arithmetic: floor at integer boundaries; no production
// rounding helper, trace or type chart is consulted for the neutral oracle.
function stage(value,rank){return Number(BigInt(value)*BigInt(rank>=0?2+rank:2)/BigInt(rank>=0?2:2-rank))||1;}
function oracle({power,attack,defense,attackStage=0,defenseStage=0,critical=false,stab=1}){
 const a=stage(attack,critical?Math.max(0,attackStage):attackStage),d=stage(defense,critical?Math.min(0,defenseStage):defenseStage);
 let n=22n*BigInt(power)*BigInt(a)/BigInt(d)/50n+2n;
 if(critical)n=n*3n/2n;
 return Array.from({length:16},(_,index)=>{
  let damage=n*BigInt(85+index)/100n;
  if(stab===1.5)damage=damage*3n/2n;
  else if(stab===2)damage*=2n;
  return Number(damage<1n?1n:damage);
 });
}
let neutralCases=0,rankCases=0,immunityCases=0,thresholdCases=0;
for(const power of [1,2,40,59,60,61,99,100,101,499,500])for(const attack of [1,2,31,50,101,199,350])for(const defense of [1,2,31,50,101,199,350]){
 const input={power,attack,defense};assert.deepEqual(vector(input),oracle(input),'neutral integer oracle '+JSON.stringify(input));neutralCases++;
}
for(let attackStage=-6;attackStage<=6;attackStage++)for(let defenseStage=-6;defenseStage<=6;defenseStage++)for(const critical of [false,true])for(const stab of [1,1.5,2]){
 const input={power:61,attack:153,defense:117,attackStage,defenseStage,critical,stabMode:stab===1?'none':'auto',attAbility:stab===2?'adaptability':'none'};
 const result=vector(input);assert.deepEqual(result,oracle({...input,stab}),'stage/critical/STAB '+JSON.stringify(input));
 if(critical)assert.deepEqual(vector({...input,screen:'reflect'}),result,'critical bypasses Reflect');
 rankCases++;
}
// Distinct base stats cannot turn an immunity into the minimum one damage.
const immunities=[{moveType:'ノーマル',defTypes:['ゴースト']},{moveType:'でんき',defTypes:['じめん']},{moveType:'どく',defTypes:['はがね']},{moveType:'じめん',defAbility:'levitate'},{moveType:'みず',defAbility:'waterAbsorb'},{moveType:'でんき',defAbility:'voltAbsorb'},{moveType:'くさ',defAbility:'sapSipper'},{moveType:'ほのお',defAbility:'flashFire'}];
for(const immunity of immunities)for(const power of [1,60,500])for(const critical of [false,true]){
 assert.deepEqual(vector({...immunity,power,critical,attack:333,defense:99,customMultiplier:10,attItem:'lifeOrb'}),Array(16).fill(0));immunityCases++;
}
for(const attack of [101,152,197])for(const defense of [99,113,201]){
 // Threshold behavior: exactly one-third HP activates Overgrow; one point
 // above does not. Compare a manually supplied integer stat, not a copy of
 // the low-HP branch in the production engine.
 const input={attack,defense,power:80,moveType:'くさ',attAbility:'overgrow',attMaxHp:180};
 assert.deepEqual(vector({...input,attCurrentHp:60}),vector({...input,attAbility:'none',attack:Math.floor(attack*1.5)}));
 assert.deepEqual(vector({...input,attCurrentHp:61}),vector({...input,attAbility:'none'}));
 thresholdCases+=2;
}
for(const [att,def,power] of [[99,100,40],[100,100,60],[199,100,60],[200,100,80],[299,100,80],[300,100,120],[399,100,120],[400,100,150]]){
 assert.equal(context.ChlohaDamageEngine.electroBallPower(att,def),power);thresholdCases++;
}
// Independent seed and case construction; not the existing 4,000-case seed.
let state=0x188a57;
const random=n=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)%n;};
const pick=a=>a[random(a.length)];
const old=histories.map(historic),types=Array.from(context.ChlohaBattleData.TYPES);
let historicalInputs=0,historicalComparisons=0;
for(let index=0;index<1800;index++){
 const input={...structuredClone(original),power:pick([1,30,59,60,61,91,120,250,500]),attack:50+random(301),defense:50+random(301),attackStage:random(13)-6,defenseStage:random(13)-6,critical:!!random(2),category:pick(['physical','special']),moveType:pick(types),attTypes:[pick(types)],defTypes:[pick(types)],weather:pick(['none','sun','rain','sand','snow']),terrain:pick(['none','electric','grassy','misty','psychic']),screen:pick(['none','reflect','lightScreen']),spread:pick(['single','spread']),burn:!!random(2),attAbility:pick(['none','technician','adaptability','hugePower','sniper','infiltrator','unaware']),defAbility:pick(['none','thickFat','furCoat','filter','levitate','iceScales','battleArmor','unaware']),attItem:pick(['none','lifeOrb','choiceBand','choiceSpecs','expertBelt']),defItem:pick(['none','assaultVest','autoResistBerry'])};
 const expected=observe(context,'core',structuredClone(input));assert.ok(expected.output,'generated condition must be supported');
 for(let h=0;h<old.length;h++){assert.deepEqual(observe(old[h],'core',structuredClone(input)),expected,histories[h]+' input '+index);historicalComparisons++;}
 historicalInputs++;
}
const engineSourceChanged=runtimeFiles.some(file=>fs.readFileSync(path.join(root,file),'utf8')!==execFileSync('git',['show',histories[0]+':'+file],{cwd:root,encoding:'utf8',maxBuffer:5*1024*1024}));
const summary={audit:'v0188-astra-engine',referencePhysicalGameVerified:false,historicalRefs:histories,historicalInputs,historicalComparisons,neutralCases,rankCases,immunityCases,thresholdCases,engineSourceChanged};
fs.mkdirSync(path.join(root,'reports/v0188-astra'),{recursive:true});
fs.writeFileSync(path.join(root,'reports/v0188-astra/engine-independent.json'),JSON.stringify(summary,null,2)+'\n');
console.log('PASS '+JSON.stringify(summary));
