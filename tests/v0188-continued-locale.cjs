'use strict';
// Exercise actual UI source functions; fixtures contain no alternative implementation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),ref=process.argv.includes('--baseline')?'8b37bddbb236fa1b7fbd13a7b2cebd1518995437':null;
const read=file=>ref?require('node:child_process').execFileSync('git',['show',ref+':'+file],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}):fs.readFileSync(path.join(root,file),'utf8');
const html=read('index.html'),i18n=read('i18n.js');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
// These are also the existing nine search-suggestion translations; same-spelling
// French/Spanish/English are valid, and are not rejected by language heuristics.
const variable={ja:'可変',en:'Variable',fr:'Variable',de:'Variabel',es:'Variable',it:'Variabile',ko:'가변','zh-Hans':'可变','zh-Hant':'可變'};
function segment(start,end){assert.equal(html.split(start).length,2,'unique source start '+start);const value=html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));assert.ok(value.length>start.length);return value;}
const failures=[];let assertions=0;
function check(name,run){try{run();assertions++;}catch(error){failures.push(name+': '+error.message);}}
function element(value=''){
 return {value,attrs:{},children:[],hidden:false,textContent:'',setAttribute(k,v){this.attrs[k]=String(v)},getAttribute(k){return this.attrs[k]??null},removeAttribute(k){delete this.attrs[k]},replaceChildren(){this.children=[]},append(...nodes){this.children.push(...nodes)}};
}
const option={value:'electroBall',textContent:'エレキボール（でんき / 可変）［計算試算・実機未照合］',label:''};
const select={id:'dbMove',options:[option],closest:()=>null};
const doc={readyState:'loading',addEventListener(){},getElementById:id=>id==='app'?{}:null,querySelectorAll:()=>[select]};
const scope={window:{},document:doc,localStorage:{getItem:()=>null}};
const anchor='function initialize(){';assert.equal(i18n.split(anchor).length,2);
vm.runInNewContext(i18n.replace(anchor,'window.__audit={set(value){locale=value},text:localizedUi,options:translateOptions};'+anchor),scope);
const api=scope.window.__audit;
const summarySource=segment(' function syncMovePicker(){',' // This status is composed bilingually');
for(const locale of locales){
 api.set(locale);api.options();
 check(locale+' native variable option',()=>assert.ok(option.textContent.includes(' / '+variable[locale]),option.textContent));
 const selected=element(),move={id:'electroBall',name:'エレキボール',type:'でんき',power:0};
 const summaryScope={window:{ChlohaLocale:{get:()=>locale,text:api.text,typeName:()=> 'TYPE'}},movesById:new Map([['electroBall',move]]),moveSelect:{value:'electroBall',selectedOptions:[option]},localizedName:()=> 'MOVE',moveEnglishAliases:{},el:()=>selected,moveCalculationReady:()=>true};
 vm.runInNewContext(summarySource+';syncMovePicker();',summaryScope);
 check(locale+' selected variable summary',()=>assert.ok(selected.textContent.includes(' / '+variable[locale]),selected.textContent));
}
const statusWords={
 ja:['計算未対応','基本ダメージのみ・実機未照合','計算試算・実機未照合'],
 en:['Unsupported','Basic damage only; unverified','Estimated; not hardware-verified'],
 fr:['Non pris en charge','Dégâts de base uniquement ; non vérifié','Estimation non vérifiée sur console'],
 de:['Nicht unterstützt','Nur Grundschaden; ungeprüft','Schätzung; nicht auf Hardware geprüft'],
 es:['No compatible','Solo daño básico; sin verificar','Estimación sin verificar en consola'],
 it:['Non supportato','Solo danno base; non verificato','Stima non verificata su console'],
 ko:['미지원','기본 데미지만; 미검증','추정값 · 실기기 미검증'],
 'zh-Hans':['暂不支持','仅基础伤害；未经验证','估算值，未经实机验证'],
 'zh-Hant':['暫不支援','僅基礎傷害；未經驗證','估算值，未經實機驗證']
};
for(const locale of locales)for(const statusIndex of [0,1,2]){
 api.set(locale);
 const selected=element(),move={id:'fixture',name:'NAME',type:'TYPE',power:100,verificationStatus:statusIndex===1?'gamewith_catalog_basic_fields_reviewed':'requires_field_review'};
 // An already-localized option is deliberately unusable as a canonical status.
 const summaryScope={window:{ChlohaLocale:{get:()=>locale,text:api.text,typeName:x=>x}},movesById:new Map([['fixture',move]]),moveSelect:{value:'fixture',selectedOptions:[{textContent:'fully localized option'}]},localizedName:()=> 'MOVE',moveEnglishAliases:{},el:()=>selected,moveCalculationReady:()=>statusIndex!==0};
 vm.runInNewContext(summarySource+';syncMovePicker();',summaryScope);
 check(locale+' canonical status '+statusIndex,()=>assert.ok(selected.textContent.includes(statusWords[locale][statusIndex]),selected.textContent));
}
for(const kind of ['move','pokemon']){
 const source=kind==='move'?segment(" moveInput.addEventListener('keydown',e=>{"," moveInput.addEventListener('blur'"):segment("  input.addEventListener('keydown',e=>{","  input.addEventListener('blur'");
 for(const count of [1,2,5])for(const key of ['ArrowUp','ArrowDown']){
  let listener,chosen,prevented=false;
  const scope={moveInput:{addEventListener:(_,f)=>listener=f},input:{addEventListener:(_,f)=>listener=f},moveList:{hidden:false},list:{hidden:false},moveHits:Array(count).fill({}),matches:Array(count).fill({}),moveActive:-1,active:-1,moveComposing:false,composing:false,setMoveActive:i=>chosen=i,setActive:i=>chosen=i};
  vm.runInNewContext(source,scope);listener({key,preventDefault(){prevented=true}});
  check(kind+' '+count+' initial '+key,()=>{assert.ok(chosen===(key==='ArrowUp'?count-1:0),'expected '+(key==='ArrowUp'?count-1:0)+', got '+chosen);assert.equal(prevented,true)});
 }
 const input=element('no-match'),list=element();input.setAttribute('aria-activedescendant','removed-option');
 const scope={moveInput:input,input,moveList:list,list,moveSelect:{options:[]},options:[],moveActive:3,active:3,moveHits:[],matches:[],normalizeMove:x=>x,normalize:x=>x,window:{ChlohaLocale:{get:()=> 'en'}},node:(_tag,_class,text)=>({textContent:text})};
 const sourceUpdate=kind==='move'?segment(' function renderMoveSuggestions(){'," document.addEventListener('chloha:localechange',()=>{if(!moveList.hidden"):segment('  const update=()=>{','  // Keep an already-open search list');
 vm.runInNewContext(sourceUpdate+(kind==='move'?';renderMoveSuggestions();':';update();'),scope);
 check(kind+' no-result rerender clears active descendant',()=>assert.equal(input.getAttribute('aria-activedescendant'),null));
}
if(failures.length){console.error(failures.join('\n'));throw Error(failures.length+' continued locale/keyboard assertions failed');}
console.log('PASS continued locale and keyboard source-function checks: '+assertions+' assertions; no real browser or native-screen-reader claim');
module.exports={locales,variable,statusWords};
