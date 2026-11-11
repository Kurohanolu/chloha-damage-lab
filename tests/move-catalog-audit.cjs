// Structural catalog audit; external Pokémon Champions damage parity remains unverified.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const match=html.match(/const ChlohaMovesDB = (\{[^\n]+\});/);
assert.ok(match,'embedded moves DB present');
const db=JSON.parse(match[1]),moves=db.moves;
assert.equal(moves.length,245,'expected GameWith batch 01 size');
const byId=new Set(),byName=new Set();
for(const m of moves){
 assert.ok(m.id&&m.name,'name/id required');
 assert.ok(!byId.has(m.id),'duplicate id: '+m.id);byId.add(m.id);
 assert.ok(!byName.has(m.name),'duplicate name: '+m.name);byName.add(m.name);
 assert.ok(['physical','special','status'].includes(m.category),'category '+m.name);
 assert.ok(Number.isInteger(m.power)&&m.power>=0&&m.power<=250,'valid power '+m.name);
 assert.ok(['single','spread'].includes(m.target),'valid target '+m.name);
}
const added=moves.filter(m=>m.id.startsWith('gw0169_'));
assert.equal(added.length,147);
assert.equal(added.filter(m=>m.category==='physical').length,79);
assert.equal(added.filter(m=>m.category==='special').length,68);
assert.equal(added.filter(m=>m.calculationSupported===true).length,72);
assert.equal(added.filter(m=>m.calculationSupported===false).length,75);
for(const m of added){
 assert.ok(['https://gamewith.jp/pokemon-champions/546502','https://gamewith.jp/pokemon-champions/546503'].includes(m.source),'GameWith source: '+m.name);
 assert.equal(m.source.endsWith('546502')?'physical':'special',m.category,'source/category: '+m.name);
 assert.equal(m.verificationStatus,'gamewith_catalog_basic_fields_reviewed');
 assert.ok(m.unverifiedFields.includes('game_damage_parity'),'damage explicitly unverified: '+m.name);
 if(m.power===0)assert.equal(m.calculationSupported,false,'zero power cannot default to calculation');
}
assert.equal(moves.find(m=>m.name==='フリーズドライ').calculationSupported,false,'type special case gated');
assert.equal(moves.find(m=>m.name==='パワージェム').calculationSupported,true,'simple attack calculable');
assert.equal(moves.find(m=>m.name==='ドラゴンアロー').calculationSupported,false,'multihit gated');
assert.equal(moves.find(m=>m.name==='ウェザーボール').calculationSupported,false,'variable type gated');
assert.equal(moves.find(m=>m.name==='りゅうのはどう').power,85);
assert.ok(html.includes('この技')||html.includes('計算未対応'));
console.log('PASS GameWith catalog',moves.length,'moves,',added.length,'new; new basic',added.filter(m=>m.calculationSupported).length,'new gated',added.filter(m=>!m.calculationSupported).length);
