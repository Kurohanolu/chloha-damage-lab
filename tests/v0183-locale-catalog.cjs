'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const registryContext={};
vm.runInNewContext(fs.readFileSync(require.resolve('../locale-registry.js'),'utf8'),registryContext);
const registry=registryContext.ChlohaLocales;
const catalogContext={};
vm.runInNewContext(fs.readFileSync(require.resolve('../locale-catalog.js'),'utf8'),catalogContext);
const catalogs=catalogContext.ChlohaLocaleCatalog;
const codes=Array.from(registry.entries,x=>x.code);
assert.deepEqual(Object.keys(catalogs),codes);
const keys=Object.keys(catalogs.ja);
assert.ok(keys.length>=12);
for(const code of codes){
 assert.deepEqual(Object.keys(catalogs[code]),keys,'locale key parity: '+code);
 assert.deepEqual(Array.from(registry.missing(catalogs,code,keys)),[],'missing locale entries: '+code);
 for(const key of keys){
  assert.equal(registry.lookup(catalogs,code,key),catalogs[code][key]);
  assert.ok(catalogs[code][key].trim());
 }
}
assert.equal(registry.lookup(catalogs,'fr','missing-key'),'missing-key');
assert.equal(registry.lookup({ja:{damage:'ダメージ'},en:{damage:'Damage'}},'ko','damage'),'Damage');
assert.equal(registry.lookup({ja:{damage:'ダメージ'}},'ko','damage'),'ダメージ');
console.log('PASS v0.183 nine-language initial UI key parity and fallback');
