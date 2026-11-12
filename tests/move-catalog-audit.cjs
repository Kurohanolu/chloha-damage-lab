// Structural catalog audit; external Pokémon Champions damage parity remains unverified.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const match=html.match(/const ChlohaMovesDB = (\{[^\n]+\});/);
assert.ok(match,'embedded moves DB present');
const db=JSON.parse(match[1]),moves=db.moves;
assert.equal(moves.length,335,'GameWith 212 physical + 122 special + 1 Protect');
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
assert.equal(added.filter(m=>m.calculationSupported===true).length,91);
assert.equal(added.filter(m=>m.calculationSupported===false).length,56);
for(const m of added){
 assert.ok(['https://gamewith.jp/pokemon-champions/546502','https://gamewith.jp/pokemon-champions/546503'].includes(m.source),'GameWith source: '+m.name);
 assert.equal(m.source.endsWith('546502')?'physical':'special',m.category,'source/category: '+m.name);
 assert.equal(m.verificationStatus,'gamewith_catalog_basic_fields_reviewed');
 assert.ok(m.unverifiedFields.includes('game_damage_parity'),'damage explicitly unverified: '+m.name);
 if(m.power===0&&m.name!=='ジャイロボール')assert.equal(m.calculationSupported,false,'zero power cannot default to calculation');
}
const expanded=moves.filter(m=>m.id.startsWith('gw0170_'));
assert.equal(expanded.length,60,'v0.170 new GameWith moves');
assert.equal(moves.filter(m=>m.category==='physical').length,212,'GameWith physical catalog total');
assert.equal(moves.filter(m=>m.category==='special').length,122,'GameWith special catalog total');
assert.equal(moves.filter(m=>m.category==='status').length,1,'existing Protect');
const extraPhysical=moves.filter(m=>m.id.startsWith('gw0170b_'));
const extraSpecial=moves.filter(m=>m.id.startsWith('gw0170c_'));
assert.equal(extraPhysical.length,26,'early physical omissions filled');
assert.equal(extraSpecial.length,4,'special omissions filled');
for(const m of [...extraPhysical,...extraSpecial]){
 assert.ok(m.source.startsWith('https://gamewith.jp/pokemon-champions/54650'),'GameWith source');
 assert.ok(m.unverifiedFields.includes('game_damage_parity'));
}
assert.equal(moves.find(m=>m.name==='ベノムショック').calculationSupported,false,'conditional poisoned-target power blocked');
assert.equal(moves.find(m=>m.name==='どろかけ').power,20);
assert.equal(moves.find(m=>m.name==='サイコカッター').calculationSupported,true,'Psycho Cut must calculate normally');
for(const name of ['DDラリアット','Gのちから','サイコファング','3ぼんのや','あなをほる','かわらわり','きりさく','クラブハンマー','クロスチョップ','クロスポイズン','ドラゴンダイブ','いびき','うずしお','ねらいうち','はなびらのまい','とびはねる']){
 assert.equal(moves.find(m=>m.name===name).calculationSupported,true,name+' baseline damage supported');
}
for(const name of ['ばくおんぱ','ふんえん','じならし','うたかたのアリア','パラボラチャージ']){
 assert.equal(moves.find(m=>m.name===name).calculationSupported,true,name+' standard damage supported');
}

assert.equal(expanded.filter(m=>m.calculationSupported).length,39,'new simple attacks');
assert.equal(expanded.filter(m=>!m.calculationSupported).length,21,'new gated conditional attacks');
for(const m of expanded){
 assert.ok(['https://gamewith.jp/pokemon-champions/546502','https://gamewith.jp/pokemon-champions/546503'].includes(m.source),'GameWith citation: '+m.name);
 assert.equal(m.verificationStatus,'gamewith_catalog_basic_fields_reviewed','source metadata: '+m.name);
 assert.ok(m.verifiedFields.includes('target'),'target metadata: '+m.name);
 assert.ok(m.unverifiedFields.includes('game_damage_parity'),'game parity unverified: '+m.name);
 if(m.power===0)assert.equal(m.calculationSupported,false,'variable damage unavailable: '+m.name);
}
for(const [name,type,power,supported] of [
 ['ドレインパンチ','かくとう',75,true],
 ['はたきおとす','あく',65,false],
 ['ネズミざん','ノーマル',20,false],
 ['ふんどのこぶし','ゴースト',50,false],
 ['ワイドフォース','エスパー',80,false],
 ['マッハパンチ','かくとう',40,true],
 ['むねんのつるぎ','ほのお',90,true]
]){
 const m=moves.find(m=>m.name===name);
 assert.ok(m,'new move exists: '+name);
 assert.equal(m.type,type,name+' type');
 assert.equal(m.power,power,name+' power');
 assert.equal(m.calculationSupported,supported,name+' safety gate');
}
assert.equal(moves.find(m=>m.name==='フリーズドライ').calculationSupported,false,'type special case gated');
assert.equal(moves.find(m=>m.name==='せいなるつるぎ').calculationSupported,false,'defense stage bypass must not silently use normal damage');
assert.equal(moves.find(m=>m.name==='パワージェム').calculationSupported,true,'simple attack calculable');
assert.equal(moves.find(m=>m.name==='ドラゴンアロー').calculationSupported,false,'multihit gated');
assert.equal(moves.find(m=>m.name==='ウェザーボール').calculationSupported,false,'variable type gated');
assert.equal(moves.find(m=>m.name==='りゅうのはどう').power,85);
assert.ok(html.includes('この技')||html.includes('計算未対応'));
console.log('PASS GameWith catalog',moves.length,'moves,',added.length+expanded.length+extraPhysical.length+extraSpecial.length,'new vs initial 98; v0.170 first-batch supported',expanded.filter(m=>m.calculationSupported).length,'gated',expanded.filter(m=>!m.calculationSupported).length);
