'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {compare,baseInput,context}=require('./helpers/v0186-reference.cjs');
let cases=0;
const specs=[{id:'gw0169_p011',mechanic:'lastRespects',field:'faintedAllies',max:5},{id:'gw0170_u031',mechanic:'rageFist',field:'hitsTaken',max:6}];
const scenarios=[
 {defTypes:['ドラゴン','じめん']},
 {defTypes:['エスパー'],attItem:'expertBelt',attAbility:'adaptability'},
 {defTypes:['あく'],attItem:'lifeOrb',critical:true},
 {defTypes:['こおり'],attAbility:'ironFist',defAbility:'furCoat'},
 {defTypes:['ノーマル']}
];
for(const spec of specs)for(let n=0;n<=spec.max;n++)for(const weather of ['none','rain','sun','sand','snow'])for(const rank of [-1,0,2])for(const scenario of scenarios){
 const a={...baseInput,power:50,moveId:spec.id,moveMechanic:spec.mechanic,[spec.field]:n,attTypes:['ゴースト'],moveType:'ゴースト',attack:157,defense:103,attackStage:rank,defenseStage:-rank,weather,...scenario};
 // Reference gets independently specified power, not this engine's computed power
 // or automatic battle-history counters. Counter qualification is a manual input.
 const expectedPower=50+50*n,result=compare(a,{moveOverrides:{basePower:expectedPower}});
 assert.equal(result.matches,true,JSON.stringify({spec,n,weather,rank,scenario,actual:result.actual,expected:result.expected}));
 const actual=context.ChlohaDamageEngine.calculate(a);assert.equal(actual.effectivePower,expectedPower);
 for(const hp of [1,result.expected[0],result.expected[15],result.expected[15]+1].filter(x=>x>0)){
  const distribution=context.ChlohaMultiHit.convolve([Array.from(actual.rolls)],1);
  assert.equal(context.ChlohaMultiHit.koProbability(distribution,hp),result.expected.filter(d=>d>=hp).length/16);
 }
 cases++;
}
const report={passed:true,cases,rollsPerCase:16,reference:'locked Champions calc, independent explicit base power',hardwareVerified:false};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/count-moves-showdown.json',JSON.stringify(report,null,2)+'\n');console.log('PASS count move Showdown '+JSON.stringify(report));
