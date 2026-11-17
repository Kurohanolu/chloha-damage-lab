'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {compare,baseInput}=require('./helpers/v0186-reference.cjs');
const html=fs.readFileSync('index.html','utf8'),moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const spout=moves.find(m=>m.name==='しおふき');assert.ok(spout);
const setters={drizzle:'rain',drought:'sun',sandStream:'sand',snowWarning:'snow'};let cases=0;
for(const side of ['attAbility','defAbility'])for(const ability of Object.keys(setters))for(const weather of ['none','rain','sun','sand','snow'])for(const defTypes of [['いわ','あく'],['じめん'],['はがね'],['こおり','ゴースト'],['くさ','こおり'],['こおり','フェアリー'],['いわ','こおり']])for(const category of ['physical','special'])for(const hp of [180,90,1]){
 const a={...baseInput,[side]:ability,weather,defTypes,category,stabMode:'none',attTypes:['みず'],moveType:'みず',attack:150,defense:101,attMaxHp:180,attCurrentHp:hp,moveId:spout.id,moveMechanic:'hpScaledPower',power:150};
 const result=compare(a,{nativeMove:true});assert.equal(result.matches,true,JSON.stringify({side,ability,weather,defTypes,category,hp,expected:result.expected,actual:result.actual,trace:result.trace}));cases++;
}
const report={passed:true,cases,reference:'locked tests/reference @smogon/calc Champions generation 0',allSixteenRolls:true,hardwareVerified:false};fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/weather-showdown.json',JSON.stringify(report,null,2)+'\n');console.log('PASS weather Showdown '+cases+' complete vectors');
