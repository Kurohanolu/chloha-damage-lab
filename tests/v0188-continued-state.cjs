'use strict';
// Independent regressions for live-model/persisted-budget parity and manual Speed routing.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const box={module:{exports:{}}};vm.runInNewContext(fs.readFileSync(path.join(root,'persistence-v0188.js'),'utf8'),box);
const api=box.module.exports,now=1794708000000;
const specs=Object.fromEntries(api.IDS.map(id=>[id,{kind:'number',min:0,max:9999,integer:true}]));
specs.dbAuto={kind:'boolean'};
specs.dbMove={kind:'select',values:['foulPlay','ordinary'],moves:{foulPlay:{category:'physical',mechanic:'foulPlay'},ordinary:{category:'physical',mechanic:'none'}}};
specs.category={kind:'select',values:['physical','special']};
const model=()=>({points:Object.fromEntries(api.STATS.map(k=>[k,0])),nature:Object.fromEntries(api.STATS.map(k=>[k,'neutral'])),rank:Object.fromEntries(api.STATS.map(k=>[k,0])),manual:{}});
function state(){const s={controls:Object.fromEntries(api.IDS.map(id=>[id,'1'])),models:{att:model(),def:model()},spitUpCount:1,conditionalPowerOverride:false};Object.assign(s.controls,{dbAuto:true,dbMove:'foulPlay',category:'physical',beatUpStats:'100',dbFoulAttackEv:'0'});return s;}
const decode=s=>api.decode(JSON.stringify({schemaVersion:1,savedAt:now,state:s}),specs,now);
const validationBody=html.match(/function validateModels\(\)\{([\s\S]*?)\n \}/)?.[1];assert.ok(validationBody,'extract real live-model validation');
const liveValid=s=>vm.runInNewContext('(()=>{'+validationBody+'})()',{models:s.models,el:id=>id==='dbAuto'?{checked:s.controls.dbAuto}:{value:s.controls[id]},activeStat:side=>side==='att'&&s.controls.dbMove==='foulPlay'?'foulPlay':side==='att'?'attack':'defense'});
let checks=0;const failures=[];
function check(label,fn){try{fn();checks++;}catch(error){failures.push(label+': '+error.message);}}
for(const oldAttack of [0,1,16,32])for(const replacedAttack of [0,1,16,32]){
 const s=state();Object.assign(s.models.def.points,{hp:32,attack:oldAttack,specialDefense:32-replacedAttack,speed:2});s.controls.dbFoulAttackEv=String(replacedAttack);
 check('effective Foul Play budget66 old'+oldAttack+' replacement'+replacedAttack,()=>{assert.doesNotThrow(()=>liveValid(s));assert.ok(decode(s),'valid live allocation must survive persistence');});
 const over=structuredClone(s);over.models.def.points.speed=3;
 check('effective Foul Play budget67 old'+oldAttack+' replacement'+replacedAttack,()=>{assert.throws(()=>liveValid(over));assert.equal(decode(over),null,'effective over-budget allocation must be rejected');});
}
check('ordinary defender budget remains strict',()=>{const s=state();s.controls.dbMove='ordinary';Object.assign(s.models.def.points,{hp:32,attack:32,specialDefense:32});assert.equal(decode(s),null);});
check('attacker budget remains strict during Foul Play',()=>{const s=state();Object.assign(s.models.att.points,{hp:32,attack:32,speed:3});assert.equal(decode(s),null);});
check('manual mode does not activate automatic Foul Play exception',()=>{const s=state();s.controls.dbAuto=false;Object.assign(s.models.def.points,{hp:32,attack:32,specialDefense:32});assert.equal(decode(s),null);});
const handler=html.match(/for\(const kind of \['points','range','nature','actual'\]\)[\s\S]*?addEventListener\('input',\(\)=>\{([\s\S]*?)\n   \}\);\n   el\(`/)?.[1];assert.ok(handler,'extract real stat handler');
for(const side of ['att','def'])check(side+' manual Speed routing',()=>{
 const controls={dbAuto:{checked:false},[side+'-speed-actual']:{value:'200'},attSpeed:{value:'122'},defSpeed:{value:'81'},attack:{value:'150'},defense:{value:'100'}};
 const context={side,k:'speed',kind:'actual',models:{att:{manual:{}},def:{manual:{}}},el:id=>controls[id],activeStat:s=>s==='att'?'attack':'defense',render(){},refreshUI(){}};
 vm.runInNewContext('(()=>{'+handler+'})()',context);
 assert.equal(controls.attSpeed.value,side==='att'?'200':'122','canonical attacker Speed');assert.equal(controls.defSpeed.value,side==='def'?'200':'81','canonical defender Speed');assert.equal(context.models[side].manual.speed,200);
});
const statBody=html.match(/function statValue\(side,k\)\{([\s\S]*?)\n \}/)?.[1];assert.ok(statBody,'extract real displayed-stat resolver');
for(const side of ['att','def'])check(side+' manual Speed display follows canonical control',()=>{
 const context={side,k:'speed',models:{att:{manual:{speed:122}},def:{manual:{speed:81}}},el:id=>id==='dbAuto'?{checked:false}:{value:id==='attSpeed'?'200':id==='defSpeed'?'240':'100'},activeStat:s=>s==='att'?'attack':'defense',species(){throw Error('manual speed must not calculate species default');},calcStat(){throw Error('manual speed must not calculate species default');}};
 assert.equal(vm.runInNewContext('(()=>{'+statBody+'})()',context),side==='att'?200:240);
});
for(const side of ['att','def'])check(side+' manual HP display follows canonical control',()=>{
 const context={side,k:'hp',models:{att:{manual:{hp:183}},def:{manual:{hp:175}}},el:id=>id==='dbAuto'?{checked:false}:{value:id==='attMaxHp'?'200':id==='hp'?'240':'100'},activeStat:s=>s==='att'?'attack':'defense',species(){throw Error('manual HP must not calculate species default');},calcStat(){throw Error('manual HP must not calculate species default');}};
 assert.equal(vm.runInNewContext('(()=>{'+statBody+'})()',context),side==='att'?200:240);
});
const adapter=source=>source.match(/document.addEventListener\('input',e=>\{([\s\S]*?)\n \}\);\n for\(const side of \['att','def'\]\)/)?.[1];
const beforeSource=execFileSync('git',['show','8b37bddbb236fa1b7fbd13a7b2cebd1518995437:index.html'],{cwd:root,encoding:'utf8',maxBuffer:4*1024*1024});
function workCount(body,ids,insideFeedback){assert.ok(body,'extract real document adapter');let imports=0,refreshes=0;const ctx={busy:false,adapterError:false,dbInputs:new Set(),importBridge(){imports++;},refreshUI(){refreshes++;}};for(const id of ids)for(let i=0;i<20;i++){ctx.e={target:{id,closest:selector=>insideFeedback&&selector==='#feedbackPanel'?{}:null}};vm.runInNewContext('(()=>{'+body+'})()',ctx);}return {events:ids.length*20,imports,refreshes};}
check('historical feedback adapter reproduction',()=>assert.deepEqual(workCount(adapter(beforeSource),['feedbackDescription','feedbackEmail','feedbackCategory'],true),{events:60,imports:60,refreshes:60}));
check('feedback events no longer refresh calculator',()=>assert.deepEqual(workCount(adapter(html),['feedbackDescription','feedbackEmail','feedbackCategory'],true),{events:60,imports:0,refreshes:0}));
check('ordinary calculator events still refresh',()=>assert.deepEqual(workCount(adapter(html),['weather','attSpeed','attMaxHp'],false),{events:60,imports:60,refreshes:60}));
if(failures.length){console.error(failures.join('\n'));throw Error(failures.length+' continued-state regressions failed; '+checks+' passed');}
console.log('PASS: '+checks+' independent Foul Play budgets, manual Speed/HP routing/display and feedback-only refresh exclusion checks; feedback refresh work60→0, calculator work60→60');
