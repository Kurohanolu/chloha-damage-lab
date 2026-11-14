'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const runtimeFiles=new Set(['battle-data-v0184.js','move-mechanics-data-v0184.js','ability-data-v0184.js','damage-engine-v0184.js','damage-calculator-v0184.js','damage-ui-adapter-v0184.js','multi-hit.js','variable-power.js']);
const local=file=>fs.readFileSync(path.join(root,file),'utf8');
function createContext(){
 const context=vm.createContext({});
 vm.runInContext('window=globalThis',context);
 return context;
}
function run(context,source,file){vm.runInContext(source,context,{filename:file,timeout:1000});}
function legacyCalculator(context,html){
 const start=html.indexOf('let r;',html.indexOf('function render()'));
 const end=html.indexOf('const lo=Math.min(...r.rolls)',start);
 assert.ok(start>=0&&end>start,'legacy render calculation boundary');
 const source=`(function(a,options={}){
  window.ChlohaShellSideArmStats=options.shellSideArmStats;
  window.ChlohaMultiHitMove=options.multiHitMove;
  window.ChlohaSpecialMultiHitMove=options.specialMultiHitMove;
  const $=id=>({value:id==='beatUpStats'?(options.beatUpStats??''):(options.dragonDartsHits??'2')});
  ${html.slice(start,end)}
  return r;
 })`;
 context.legacyCalculateMove=vm.runInContext(source,context);
}
function loadLegacy(reader){
 const context=createContext(),html=reader('index.html');
 const start=html.indexOf('const GameData='),marker='window.ChlohaDamageEngine=DamageEngine;';
 const end=html.indexOf(marker,start)+marker.length;
 assert.ok(start>=0&&end>start,'legacy engine boundary');
 run(context,html.slice(start,end),'v0183-legacy-engine.js');
 for(const file of ['multi-hit.js','variable-power.js'])run(context,reader(file),file);
 legacyCalculator(context,html);
 return context;
}
function loadCurrent({legacyUI=false}={}){
 const context=createContext(),html=local('index.html');
 for(const match of html.matchAll(/<script\b[^>]*\bsrc=["'](?:\.\/)?([^"']+)["'][^>]*>/g)){
  if(runtimeFiles.has(match[1]))run(context,local(match[1]),match[1]);
 }
 if(legacyUI)legacyCalculator(context,html);
 else assert.equal(typeof context.ChlohaDamageCalculator?.calculate,'function','DOM-independent calculator API must initialize');
 return context;
}
function normalize(value){
 return JSON.parse(JSON.stringify(value,(_,item)=>Object.prototype.toString.call(item)==='[object Map]'?{mapEntries:[...item]}:item));
}
function observe(context,entry,input,options={},legacy=false){
 const snapshot=structuredClone({input,options});
 let observed;
 try{
  const output=entry==='core'?context.ChlohaDamageEngine.calculate(input):(legacy?context.legacyCalculateMove(input,options):context.ChlohaDamageCalculator.calculate(input,options));
  observed={output:normalize(output)};
 }catch(error){observed={error:{name:error.name,message:error.message}};}
 assert.deepEqual({input,options},snapshot,'calculator must not mutate caller input or options');
 return observed;
}
module.exports={root,loadLegacy,loadCurrent,observe};
