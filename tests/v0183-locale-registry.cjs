'use strict';
const assert=require('node:assert/strict');
const locale=require('../locale-registry.js');
assert.deepEqual(locale.entries.map(x=>x.code),['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant']);
assert.equal(new Set(locale.entries.map(x=>x.code)).size,9);
assert.deepEqual(locale.chain('ja'),['ja']);
assert.deepEqual(locale.chain('en'),['en','ja']);
for(const code of ['fr','de','es','it','ko','zh-Hans','zh-Hant'])
 assert.deepEqual(locale.chain(code),[code,'en','ja']);
assert.deepEqual(locale.chain('invalid'),['ja']);
const catalogs={ja:{attack:'攻撃',onlyJa:'日本語'},en:{attack:'Attack'},fr:{attack:'Attaque'}};
assert.equal(locale.lookup(catalogs,'fr','attack'),'Attaque');
assert.equal(locale.lookup(catalogs,'de','attack'),'Attack');
assert.equal(locale.lookup(catalogs,'fr','onlyJa'),'日本語');
assert.equal(locale.lookup(catalogs,'ko','notYetTranslated'),'notYetTranslated');
assert.deepEqual(locale.missing(catalogs,'fr',['attack','onlyJa']),['onlyJa']);
assert.deepEqual(locale.missing(catalogs,'ko',['attack','onlyJa']),['attack','onlyJa']);
assert.throws(()=>locale.lookup(catalogs,'ja',''),TypeError);
console.log('PASS v0.183 nine-language registry, fallback, and missing-translation audit');
