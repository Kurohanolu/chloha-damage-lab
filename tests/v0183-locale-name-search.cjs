'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={};
vm.runInNewContext(fs.readFileSync(require.resolve('../locale-name-search.js'),'utf8'),context);
const search=context.ChlohaNameSearch;
assert.deepEqual(Array.from(search.supported),['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant']);
const records=[
 {category:'moves',id:'flamethrower',names:{ja:'かえんほうしゃ',en:'Flamethrower',fr:'Lance-Flammes',de:'Flammenwurf',es:'Lanzallamas',it:'Lanciafiamme',ko:'화염방사','zh-Hans':'喷射火焰','zh-Hant':'噴射火焰'}},
 {category:'pokemon',id:'pikachu',names:{ja:'ピカチュウ',en:'Pikachu',fr:'Pikachu',ko:'피카츄'}},
 {category:'abilities',id:'intimidate',names:{ja:'いかく',en:'Intimidate'}},
 {category:'items',id:'lifeorb',names:{ja:'いのちのたま',en:'Life Orb'}}
];
const index=search.buildIndex(records);
for(const name of Object.values(records[0].names))assert.deepEqual(search.search(index,'moves',name),['flamethrower']);
assert.deepEqual(search.search(index,'moves','lance flammes'),['flamethrower']);
assert.deepEqual(search.search(index,'moves','LANCE-FLAMMES'),['flamethrower']);
assert.deepEqual(search.search(index,'moves','flamme'),['flamethrower']);
assert.deepEqual(search.search(index,'pokemon','피카츄'),['pikachu']);
assert.deepEqual(search.search(index,'abilities','Intimidate'),['intimidate']);
assert.deepEqual(search.search(index,'items','Life Orb'),['lifeorb']);
assert.deepEqual(search.search(index,'pokemon','Flamethrower'),[]);
assert.deepEqual(search.search(index,'moves',''),[]);
assert.throws(()=>search.buildIndex([{category:'moves',id:''}]),TypeError);
console.log('PASS v0.183 multilingual canonical-ID entity-name search');
