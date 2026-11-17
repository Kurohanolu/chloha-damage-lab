'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process');
const baseline='3fc0959f5a1447d4c241c4db4071452d2e97559d',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=JSON.parse(cp.execFileSync('git',['show',baseline+':docs/data/v110-es-la-coverage.json'],{maxBuffer:32*1024*1024})),after=read('docs/data/v110-es-la-coverage.json');
const c=vm.createContext({});vm.runInContext('window=globalThis',c);
for(const f of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-es-la-data-v110.js','locale-es-la-v110.js','locale-ui-es-la-v110.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f});
const key='パワースポット',e=after.entries.abilities[key];
assert.equal(before.entries.abilities[key].name,'Power Spot');assert.equal(e.name,'Fuente Energía');assert.equal(e.status,'official');assert.equal(e.officialChampions,false);assert.deepEqual(e.canonicalIds,['powerSpot']);assert.deepEqual(e.aliases,['Fuente Energía','Power Spot']);assert.equal(e.fallback,false);
for(const [cat,rows]of Object.entries(before.entries))for(const [k,b]of Object.entries(rows)){const a=after.entries[cat][k];if(cat!=='abilities'||k!==key)assert.deepEqual(a,b,cat+'/'+k+' must be unchanged');else {assert.deepEqual(a.canonicalIds,b.canonicalIds);assert.equal(a.officialChampions,b.officialChampions);}}
assert.equal(c.ChlohaEsLaUi.text('Ally Power Spot (damage ×1.3)'),'Fuente Energía de un aliado (daño ×1,3)');assert.equal(c.ChlohaEsLaUi.dynamic('パワースポット条件が不正'),'La condición de Fuente Energía no es válida');
const member=Object.hasOwn(c.ChlohaNames.abilities,key);const index=c.ChlohaNameCatalogAdapter.build(c.ChlohaNames,c.ChlohaNameSearch,{});
for(const query of ['Fuente Energía','fuente energia','FUENTE ENERGÍA','Fuente Energi\u0301a','Power Spot',key])assert.equal(c.ChlohaNameSearch.search(index,'abilities',query).includes(key),member,'Search must preserve real catalog membership: '+query);
for(const p of ['index.html','i18n.js','locale-ui-es-la-v110.js','locale-name-catalog-adapter.js','locale-name-search.js','names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','damage-engine-v0184.js','battle-data-v0184.js','ability-data-v0184.js','feedback-config-v0185.js','services/feedback/src/worker.js'])assert.deepEqual(fs.readFileSync(p),cp.execFileSync('git',['show',baseline+':'+p],{maxBuffer:32*1024*1024}),p+' changed');
console.log('PASS Power Spot: one exact display/alias change, canonical UI binding, accent/case search membership='+member+', all other records and protected files unchanged');
