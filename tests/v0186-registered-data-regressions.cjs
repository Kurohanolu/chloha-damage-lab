'use strict';
const assert=require('node:assert/strict');
const {pokemon}=require('./helpers/v0186-catalog.cjs');
const {context,baseInput}=require('./helpers/v0186-reference.cjs');
// Official Pokédex https://zukan.pokemon.co.jp/detail/0398-1 (checked 2026-11-14)
// confirms Fighting/Flying; both pinned Champions and Gen9 records agree.
const staraptor=pokemon.find(p=>p.id==='gw092_27');
assert.deepEqual(staraptor.types,['かくとう','ひこう'],'existing Mega Staraptor type data');
const run=type=>context.ChlohaDamageEngine.calculate({...baseInput,moveType:type,defTypes:staraptor.types,attTypes:['みず']});
assert.equal(run('ゴースト').effectiveness,1,'Mega Staraptor is not immune to Ghost');
assert.ok(run('ゴースト').rolls.every(n=>n>0));
assert.equal(run('いわ').effectiveness,1,'Fighting resistance cancels Flying weakness');
console.log('PASS v0.186 registered-data regression: Mega Staraptor types, Ghost and Rock damage');
