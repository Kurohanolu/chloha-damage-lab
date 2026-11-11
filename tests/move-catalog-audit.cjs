// Structural catalog audit; external Pokémon Champions damage parity remains unverified.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const match=html.match(/const ChlohaMovesDB = (\{[^\n]+\});/);
assert.ok(match,'embedded moves DB present');
const db=JSON.parse(match[1]),moves=db.moves;
assert.equal(db.status,'v0170_gamewith_physical_expansion_and_safe_unsupported_labels','catalog version/status');
assert.equal(moves.length,304,'expected GameWith batch 02 catalog size');
const byId=new Set(),byName=new Set();
for(const m of moves){
 assert.ok(m.id&&m.name,'name/id required');
 assert.ok(!byId.has(m.id),'duplicate id: '+m.id);byId.add(m.id);
 assert.ok(!byName.has(m.name),'duplicate name: '+m.name);byName.add(m.name);
 assert.ok(['physical','special','status'].includes(m.category),'category '+m.name);
 assert.ok(Number.isInteger(m.power)&&m.power>=0&&m.power<=250,'valid power '+m.name);
 assert.ok(['single','spread','all'].includes(m.target),'valid target '+m.name);
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
const batch2=moves.filter(m=>m.id.startsWith('gw0170_p'));
assert.equal(batch2.length,59,'new physical moves in GameWith batch 02');
assert.equal(batch2.filter(m=>m.category==='physical').length,59);
assert.equal(batch2.filter(m=>m.calculationSupported).length,37,'basic damage ready');
assert.equal(batch2.filter(m=>!m.calculationSupported).length,22,'complex moves gated');
for(const m of batch2){
 assert.equal(m.source,'https://gamewith.jp/pokemon-champions/546502','physical catalog URL');
 assert.equal(m.verificationStatus,'gamewith_catalog_basic_fields_reviewed');
 assert.ok(m.unverifiedFields.includes('game_damage_parity'),'no unverified game parity claims');
 assert.ok(Number.isInteger(m.accuracy)&&m.accuracy>=0&&m.accuracy<=100,'accuracy '+m.name);
 assert.ok(Number.isInteger(m.pp)&&m.pp>0,'PP '+m.name);
 if(m.power===0)assert.equal(m.calculationSupported,false,'variable/unfixed power blocked');
 if(!m.calculationSupported)assert.match(m.catalogNote,/未対応/,'unsupported reason '+m.name);
}
assert.equal(moves.find(m=>m.name==='ドレインパンチ').power,75);
assert.equal(moves.find(m=>m.name==='ドレインパンチ').calculationSupported,true);
assert.equal(moves.find(m=>m.name==='はたきおとす').calculationSupported,false,'item-driven power gated');
assert.equal(moves.find(m=>m.name==='ネズミざん').calculationSupported,false,'multi-hit gated');
assert.equal(moves.find(m=>m.name==='フリーズドライ').calculationSupported,false,'type special case gated');
assert.equal(moves.find(m=>m.name==='パワージェム').calculationSupported,true,'simple attack calculable');
assert.equal(moves.find(m=>m.name==='ドラゴンアロー').calculationSupported,false,'multihit gated');
assert.equal(moves.find(m=>m.name==='ウェザーボール').calculationSupported,false,'variable type gated');
assert.equal(moves.find(m=>m.name==='りゅうのはどう').power,85);
assert.ok(html.includes('この技')||html.includes('計算未対応'));
console.log('PASS GameWith catalog',moves.length,'moves; batch1',added.length,'batch2',batch2.length,'batch2 basic',batch2.filter(m=>m.calculationSupported).length,'batch2 gated',batch2.filter(m=>!m.calculationSupported).length);
