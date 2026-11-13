'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const handlers={};
const option=(value,label)=>({value,textContent:label});
const selects=[
 {id:'dbAttPokemon',options:[option('dragonite','カイリュー')]},
 {id:'dbDefPokemon',options:[option('candidate093_01','ピカチュウ')]},
 {id:'attAbility',options:[option('いかく','いかく')]},
 {id:'defItem',options:[option('いのちのたま','いのちのたま')]},
 {id:'attMove',options:[option('じしん','じしん')]}
];
let locale='ja';
const document={
 readyState:'complete',
 querySelectorAll:selector=>selector==='select'?selects:[],
 getElementById:id=>id==='chloha-locale'?{addEventListener:(event,fn)=>handlers[event]=fn}:null,
 body:{}
};
const context={window:{ChlohaLocale:{get:()=>locale}},document,MutationObserver:class{observe(){}},queueMicrotask:fn=>fn()};
for(const file of ['locale-names-pokeapi-v0183.js','locale-names-v0183.js']){
 vm.runInNewContext(fs.readFileSync(require.resolve('../'+file),'utf8'),context);
}
context.window.ChlohaPokeAPILocalizedNames=context.ChlohaPokeAPILocalizedNames;
context.window.ChlohaLocalizedNames=context.ChlohaLocalizedNames;
vm.runInNewContext(fs.readFileSync(require.resolve('../names-ui-v0183.js'),'utf8'),context);
const original=selects.map(s=>s.options[0].textContent);
const values=selects.map(s=>s.options[0].value);
for(const [code,expected] of [
 ['fr',['Dracolosse','Pikachu','Intimidation','Orbe Vie','Séisme']],
 ['de',['Dragoran','Pikachu','Bedroher','Leben-Orb','Erdbeben']],
 ['ko',['망나뇽','피카츄','위협','생명의구슬','지진']],
 ['zh-Hans',['快龙','皮卡丘','威吓','生命宝珠','地震']],
 ['en',['Dragonite','Pikachu','Intimidate','Life Orb','Earthquake']],
 ['ja',original]
]){
 locale=code;handlers.change();
 assert.deepEqual(selects.map(s=>s.options[0].textContent),expected,code);
 assert.deepEqual(selects.map(s=>s.options[0].value),values,'Values must remain stable '+code);
}
console.log('PASS v0.183 nine-language select labels and Japanese roundtrip');
