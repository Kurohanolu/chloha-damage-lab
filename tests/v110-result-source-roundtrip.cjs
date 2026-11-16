'use strict';
// Execute the real display producers and DOM translator. Browser layout and
// event-order coverage live in v110-ja-return-browser.cjs.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {literalAfter}=require('../scripts/v110-es-la-ui-inventory.cjs');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('index.html'),i18n=read('i18n.js');
function segment(source,start,end){assert.equal(source.split(start).length,2,'Unique anchor: '+start);const at=source.indexOf(start),stop=source.indexOf(end,at);assert.ok(stop>at,'End anchor: '+end);return source.slice(at,stop);}
const moves=JSON.parse(literalAfter(html,'const ChlohaMovesDB = ').expression);
const policy=JSON.parse(literalAfter(html,'const ChlohaMovePolicy = ').expression);
const controls=new Map();
function control(id){if(!controls.has(id))controls.set(id,{value:'',textContent:'',hidden:false,selectedOptions:[{textContent:'DISPLAY MUST NOT BE A CANONICAL SOURCE'}],listeners:{},addEventListener(type,callback){this.listeners[type]=callback},replaceChildren(...children){this.children=children}});return controls.get(id);}
const document={readyState:'loading',addEventListener(){},getElementById:control,createElement:()=>({textContent:''})};
const c=vm.createContext({document,localStorage:{getItem:()=>null},NodeFilter:{SHOW_TEXT:4},ChlohaMovesDB:moves,ChlohaMovePolicy:policy,ChlohaGameData:moves,$:control});c.window=c;
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-pokeapi-v0183.js','locale-form-species-v0183.js','locale-names-v0183.js','locale-registry.js','locale-catalog.js','locale-es-la-data-v110.js','locale-es-la-v110.js','locale-ui-es-la-v110.js'])vm.runInContext(read(file),c,{filename:file});
vm.runInContext(i18n.replace('function initialize(){','window.__ui={translate,set(value){locale=value}};function initialize(){'),c,{filename:'i18n.js'});
vm.runInContext(segment(html,'function moveCalculationReady(m){','function refreshCandidateMoves(){'),c);
vm.runInContext(segment(html,'function assessReliability(a,selection={}){','window.ChlohaAssessReliability='),c);
function textRoot(text){const root={nodeType:1,closest:()=>null,querySelectorAll:()=>[],hasAttribute:()=>false};root.node={nodeValue:text,parentElement:root};return root;}
document.createTreeWalker=root=>{let node=root.node;return {nextNode(){const current=node;node=null;return current;}}};
function roundtrip(text,locale){const node=textRoot(text);c.__ui.set(locale);c.__ui.translate(node);const localized=node.node.nodeValue;c.__ui.set('ja');c.__ui.translate(node);assert.equal(node.node.nodeValue,text,'Japanese source restored after '+locale);return localized;}
const locales=c.ChlohaLocales.entries.map(entry=>entry.code),input={currentHp:200,hp:200,terrain:'psychic',moveMechanic:'none',customMultiplier:1,attAbility:'none',defAbility:'none',screen:'none'};
control('dbMove').value='earthquake';
const canonical=c.canonicalMoveLabel('earthquake');assert.match(canonical,/^じしん（じめん \/ 100）/);assert.equal(c.canonicalMoveLabel('missing'),'');
for(const locale of locales){
 // Reproduce refreshUI while the main results already contain foreign text.
 const mainDamage=textRoot('100〜118 ダメージ'),mainPercent=textRoot('最大HPの 50.0〜59.0%');c.__ui.set(locale);c.__ui.translate(mainDamage);c.__ui.translate(mainPercent);
 control('damage').textContent=mainDamage.node.nodeValue;control('percent').textContent=mainPercent.node.nodeValue;
 const result={a:input,r:{rolls:[100,118]}};c.r=result;c.a=input;c.lo=100;c.hi=118;c.el=control;
 const before=JSON.stringify(result);
 vm.runInContext(segment(html,"  el('miniDamage').textContent=","  el('gaugeMin').style.width="),c);
 assert.equal(control('miniDamage').textContent,'100〜118 ダメージ');assert.equal(control('miniPercent').textContent,'最大HPの 50.0〜59.0%');
 for(const id of ['miniDamage','miniPercent'])roundtrip(control(id).textContent,locale);
 // Use render's actual move-source statement with deliberately localized options.
 const moveName=vm.runInContext('(function(){'+segment(html,'const moveName=canonicalMoveLabel(',"const selection=")+'return moveName;})()',c);
 const warning=c.assessReliability(input,{moveName}).warnings.find(text=>text.startsWith('選択技「'));
 assert.ok(warning.includes(canonical));roundtrip(warning,locale);assert.equal(JSON.stringify(result),before,'Rendering must not mutate calculation values');
}
const commit=segment(html,"$('battleCommit').addEventListener('click',()=>{","$('battleUndo').addEventListener");
c.read=()=>input;c.render=()=>{};c.ChlohaLastCalculation={a:input,r:{rolls:[100,118]},signature:JSON.stringify(input),moveId:'earthquake'};
vm.runInContext(segment(html,'const ChlohaBattleHistory=[];',"$('battleCommit').addEventListener")+commit,c);
control('battleObservedDamage').value='100';control('terrain').value='psychic';control('battleCommit').listeners.click();
const history=control('battleHistory').children[0].textContent,status=control('battleStatus').textContent;
assert.match(history,/1手目：じしん（じめん \/ 100）/);assert.match(status,/フィールド：サイコフィールド/);
for(const locale of locales){roundtrip(history,locale);roundtrip(status,locale);}
// Run the actual initializer's option construction, with and without registry.
const choices=segment(i18n,' const localeChoices='," select.addEventListener('change'");
for(const registry of [c.ChlohaLocales,undefined]){const options=[],scope={ChlohaLocales:registry,document:{createElement:()=>({})},select:{append:option=>options.push(option)}};vm.runInNewContext(choices,scope);assert.equal(options.find(option=>option.value==='es-LA').textContent,'ES-LA');assert.equal(options.length,10);}
const result={passed:true,locales:[...locales],canonicalMoveId:'earthquake',canonicalResultSources:true,historyAndTerrainSources:true,selectorLabel:'ES-LA',numericValuesUnchanged:true,browserClaim:false};
fs.mkdirSync(path.join(root,'reports/v110'),{recursive:true});fs.writeFileSync(path.join(root,'reports/v110/result-source-roundtrip.json'),JSON.stringify(result,null,2)+'\n');
console.log('PASS canonical result source roundtrips '+JSON.stringify(result));
