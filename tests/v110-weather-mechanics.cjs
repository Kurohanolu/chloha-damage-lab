'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {loadCurrent}=require('./helpers/v0184-engine-harness.cjs');
const context=loadCurrent(),engine=context.ChlohaDamageEngine;
const base={...require('./fixtures/v0184-public-baseline.json').cases[0].input,stabMode:'none',attack:150,defense:101,attTypes:['みず'],defTypes:['ノーマル'],moveType:'みず',category:'special'};
const setters={drizzle:'rain',drought:'sun',sandStream:'sand',snowWarning:'snow'};
// Independent positive-integer, nearest/ties-down oracle. No engine helpers.
const round=(n,m)=>(BigInt(n)*BigInt(m)+2047n)/4096n;
function oracle(a){
 const weather=a.weather!=='none'?a.weather:(setters[a.attAbility]||setters[a.defAbility]||'none');
 const defenseHit=a.category==='physical'||a.moveMechanic==='psyshock';
 let defense=BigInt(a.defense);
 if((weather==='sand'&&!defenseHit&&a.defTypes.includes('いわ'))||(weather==='snow'&&defenseHit&&a.defTypes.includes('こおり')))defense=round(defense,6144);
 const power=a.moveMechanic==='hpScaledPower'?Math.max(1,Math.floor(150*a.attCurrentHp/a.attMaxHp)):a.power;
 let damage=22n*BigInt(power)*BigInt(a.attack)/defense/50n+2n;
 if(['sun','rain'].includes(weather)&&['ほのお','みず'].includes(a.moveType))damage=round(damage,((weather==='rain')===(a.moveType==='みず'))?6144:2048);
 const effectiveness=a.moveType==='みず'?a.defTypes.reduce((n,t)=>n*({いわ:2,じめん:2,ほのお:2,みず:.5,くさ:.5,ドラゴン:.5}[t]||1),1):1;
 const rolls=Array.from({length:16},(_,i)=>Math.max(1,Math.floor(Number(damage*BigInt(85+i)/100n)*effectiveness)));
 return {weather,defense:Number(defense),power,rolls};
}
let cases=0;
function check(a,label){const input={...base,...a},snapshot=structuredClone(input),expected=oracle(input),actual=engine.calculate(input);assert.deepEqual(input,snapshot,'No input mutation '+label);assert.deepEqual(Array.from(actual.rolls),expected.rolls,label+' exact sixteen rolls');assert.equal(actual.defense,expected.defense,label+' effective defense');assert.equal(actual.effectivePower,expected.power,label+' HP power');assert.equal(actual.rolls.length,16);assert.equal(actual.trace.filter(x=>/^stat\/(sandRockSpD|snowIceDef):/.test(x)).length,expected.defense!==input.defense?1:0,label+' exactly one weather stat modifier');cases++;return actual;}
// Four setters, either side, manual override, Water Spout HP boundaries, dual
// types, ordinary attacks and Psyshock's actual defensive-stat reference.
for(const side of ['attAbility','defAbility'])for(const ability of Object.keys(setters))for(const weather of ['none','sun','rain','sand','snow'])for(const defTypes of [['いわ','あく'],['じめん'],['はがね'],['いわ','こおり'],['こおり','ゴースト'],['くさ','こおり'],['こおり','フェアリー'],['ノーマル']])for(const category of ['physical','special'])for(const hp of [180,90,1])check({[side]:ability,weather,defTypes,category,moveMechanic:'hpScaledPower',power:150,attCurrentHp:hp},JSON.stringify({side,ability,weather,defTypes,category,hp}));
for(const defTypes of [['いわ'],['こおり'],['いわ','こおり'],['じめん']])for(const weather of ['sand','snow'])for(const moveMechanic of ['none','psyshock'])check({defTypes,weather,moveMechanic},'defensive stat reference');
for(const attAbility of Object.keys(setters))for(const defAbility of Object.keys(setters))for(const weather of ['none','sun','rain','sand','snow'])check({attAbility,defAbility,weather,defTypes:['いわ','こおり']},'existing manual > attacker > defender precedence');
// Explicit user reproduction witnesses and KO boundaries use every roll.
const megaTyranitar=check({defAbility:'sandStream',defTypes:['いわ','あく'],moveMechanic:'hpScaledPower',power:150},'Mega Tyranitar Water Spout');
const megaFroslass=check({defAbility:'snowWarning',defTypes:['こおり','ゴースト'],category:'physical'},'Mega Froslass physical');
check({defAbility:'snowWarning',defTypes:['こおり','ゴースト']},'Mega Froslass special: no Def bonus');
check({defAbility:'sandStream',defTypes:['じめん']},'Hippowdon: no SpD bonus');
for(const result of [megaTyranitar,megaFroslass])for(const currentHp of [1,Math.min(...result.rolls),Math.max(...result.rolls),Math.max(...result.rolls)+1]){const distribution=context.ChlohaMultiHit.convolve([result.rolls],1);assert.equal(context.ChlohaMultiHit.koProbability(distribution,currentHp),result.rolls.filter(n=>n>=currentHp).length/16);cases++;}
// Prove the exact original validation defect fails before the fix, rather
// than relying only on successful calculations in the changed implementation.
const historical=vm.createContext({});vm.runInContext('window=globalThis',historical);
for(const file of ['battle-data-v0184.js','move-mechanics-data-v0184.js','ability-data-v0184.js','damage-engine-v0184.js','variable-power.js']){let source=fs.readFileSync(file,'utf8');if(file==='ability-data-v0184.js'){assert.equal(source.split(',...Object.keys(WEATHER_BY_ABILITY)').length,2);source=source.replace(',...Object.keys(WEATHER_BY_ABILITY)','');}vm.runInContext(source,historical);}
for(const ability of Object.keys(setters)){assert.throws(()=>historical.ChlohaDamageEngine.calculate({...base,defAbility:ability}),/持ち物・特性/);check({defAbility:ability},'old validation rejects '+ability);}
assert.throws(()=>engine.calculate({...base,defAbility:'notARealAbility'}),/持ち物・特性/,'Unknown IDs remain rejected');
const report={passed:true,cases,oldImplementationFailures:4,oracle:'independent BigInt integer arithmetic',rollsPerCase:16,defenseRounding:'nearest, ties down after stages',precedence:'explicit weather, then attacker setter, then defender setter; entry order is not modeled',hardwareVerified:false};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/weather-mechanics.json',JSON.stringify(report,null,2)+'\n');console.log('PASS weather mechanics '+JSON.stringify(report));
