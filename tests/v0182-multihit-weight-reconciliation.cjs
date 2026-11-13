'use strict';
// Reconcile the 17 multi-hit/weight moves with tested capabilities.
// A helper's existence does not imply full UI or hardware parity.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const policies=JSON.parse(html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/)[1]);
const api=require('../multi-hit.js');
const mh=api.default||globalThis.ChlohaMultiHit||api;
const weight=require('../weight-power.js');
const weightPower=weight.weightDependentPower||globalThis.ChlohaWeightPower?.weightDependentPower;
const multi=['スイープビンタ','スケイルショット','タネマシンガン','ダブルアタック','つららばり','ドラゴンアロー','ツインビーム','みずしゅりけん','ネズミざん','ボーンラッシュ','ミサイルばり','ロックブラスト','トリプルアクセル'];
const weighted=['けたぐり','くさむすび','ヒートスタンプ','ヘビーボンバー'];
const rows=[];
for(const name of multi){
 const m=moves.find(x=>x.name===name);
 assert.ok(m,'missing multi-hit move '+name);
 assert.equal(m.calculationSupported,true===false,'multi-hit catalog status unexpectedly changed: '+name);
 const hits=mh.hitDistribution(name);
 const special=['ネズミざん','トリプルアクセル'].includes(name);
 if(special){
  assert.equal(hits,null,name+' must not be modeled by fixed-hit helper');
  assert.equal(typeof mh.specialMoveDistribution,'function',name+' special probability engine');
 }else{
  assert.ok(hits&&Object.keys(hits).length>0,name+' missing hit distribution');
  assert.ok(Math.abs(Object.values(hits).reduce((a,b)=>a+b,0)-1)<1e-12,name+' invalid hit probabilities');
 }
 rows.push({name,id:m.id,family:'multiHit',status:special?'specialEngineExistsUiParityReview':'hitDistributionExistsUiParityReview',catalogSupported:false});
}
for(const name of weighted){
 const m=moves.find(x=>x.name===name);
 assert.ok(m,'missing weight move '+name);
 assert.equal(m.calculationSupported,false,'weight move catalog status unexpectedly changed: '+name);
 const result=weightPower(name,100,25);
 assert.ok(Number.isInteger(result)&&result>=20&&result<=120,name+' invalid weight-dependent power');
 rows.push({name,id:m.id,family:'weightDependent',status:'powerHelperAndBrowserRegressionPresent',catalogSupported:false,examplePower:result});
}
// Exact weight breakpoints and attacker/defender ratio boundaries.
for(const name of ['けたぐり','くさむすび']){
 for(const [kg,expected] of [[9.9,20],[10,40],[24.9,40],[25,60],[49.9,60],[50,80],[99.9,80],[100,100],[199.9,100],[200,120]]){
  assert.equal(weightPower(name,100,kg),expected,name+' defender '+kg+'kg');
 }
}
for(const name of ['ヒートスタンプ','ヘビーボンバー']){
 for(const [att,def,expected] of [[199.9,100,40],[200,100,60],[299.9,100,60],[300,100,80],[399.9,100,80],[400,100,100],[499.9,100,100],[500,100,120]]){
  assert.equal(weightPower(name,att,def),expected,name+' '+att+'/'+def+'kg');
 }
}
for(const name of weighted){
 assert.equal(weightPower(name,100,0),null,name+' zero defender weight rejected');
 assert.equal(weightPower(name,100,NaN),null,name+' NaN defender weight rejected');
}
assert.equal(rows.length,17);
const excluded=['まもる','いかりのまえば','カウンター','がむしゃら','じわれ','いのちがけ','ぜったいれいど','ナイトヘッド','ミラーコート','ハサミギロチン','ほうふく','メタルバースト','ちきゅうなげ','つのドリル'];
for(const name of excluded){
 const m=moves.find(x=>x.name===name);assert.ok(m,name);
 assert.equal(policies[m.id]?.priority,'P0','excluded policy: '+name);
}
const spit=moves.find(x=>x.name==='はきだす');
assert.ok(spit,'Spit Up missing');
assert.equal(policies[spit.id]?.priority,'P1','Spit Up enabled policy');assert.equal(policies[spit.id]?.mechanic,'spitUp','Spit Up mechanic');
const report={version:'v0.182',scope:'17 move helper reconciliation, not a claim of full in-game parity',summary:{multiHit:multi.length,weightDependent:weighted.length,specialMultiHit:2,excludedByPolicy:excluded.length,spitUpBrowserRegressionEnabled:1},rows,reviewItems:[{name:'はきだす',reason:'Stockpile 1/2/3 power UI and damage engine are enabled and covered by browser regression; hardware parity remains unverified'},{name:'ネズミざん',reason:'Sequential accuracy engine exists but standard hit distribution intentionally unavailable; verify UI and per-hit behavior'},{name:'トリプルアクセル',reason:'Sequential accuracy and varying power engine exists; verify UI and per-hit behavior'}]};
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports/v0182-multihit-weight-reconciliation.json'),JSON.stringify(report,null,2)+'\n');
console.log('PASS v0.182 multi-hit/weight reconciliation',JSON.stringify(report.summary));
console.log('REVIEW',JSON.stringify(report.reviewItems));
