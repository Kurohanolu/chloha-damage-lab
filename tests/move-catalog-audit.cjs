// Structural catalog audit; external Pokémon Champions damage parity remains unverified.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const engine=fs.readFileSync(path.resolve(__dirname,'../damage-engine-v0184.js'),'utf8');
const source=html+'\n'+engine;
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
assert.equal(added.filter(m=>m.calculationSupported===true).length,106);
assert.equal(added.filter(m=>m.calculationSupported===false).length,41);
for(const m of added){
 assert.ok(['https://gamewith.jp/pokemon-champions/546502','https://gamewith.jp/pokemon-champions/546503'].includes(m.source),'GameWith source: '+m.name);
 assert.equal(m.source.endsWith('546502')?'physical':'special',m.category,'source/category: '+m.name);
 assert.equal(m.verificationStatus,'gamewith_catalog_basic_fields_reviewed');
 assert.ok(m.unverifiedFields.includes('game_damage_parity'),'damage explicitly unverified: '+m.name);
 if(m.power===0&&!['ジャイロボール','きしかいせい','なげつける'].includes(m.name))assert.equal(m.calculationSupported,false,'zero power cannot default to calculation');
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

assert.equal(expanded.filter(m=>m.calculationSupported).length,45,'new simple attacks');
assert.equal(expanded.filter(m=>!m.calculationSupported).length,15,'new gated conditional attacks');
for(const m of expanded){
 assert.ok(['https://gamewith.jp/pokemon-champions/546502','https://gamewith.jp/pokemon-champions/546503'].includes(m.source),'GameWith citation: '+m.name);
 assert.equal(m.verificationStatus,'gamewith_catalog_basic_fields_reviewed','source metadata: '+m.name);
 assert.ok(m.verifiedFields.includes('target'),'target metadata: '+m.name);
 assert.ok(m.unverifiedFields.includes('game_damage_parity'),'game parity unverified: '+m.name);
 if(m.power===0&&m.name!=='ハードプレス')assert.equal(m.calculationSupported,false,'variable damage unavailable: '+m.name);
}
for(const [name,type,power,supported] of [
 ['ドレインパンチ','かくとう',75,true],
 ['はたきおとす','あく',65,false],
 ['ネズミざん','ノーマル',20,false],
 ['ふんどのこぶし','ゴースト',50,true],
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
for(const name of ['きあいパンチ','であいがしら','とっておき','デカハンマー','ポルターガイスト','ゲップ'])assert.equal(moves.find(m=>m.name===name).calculationSupported,true,name+' activation assumed');
const mechanics=fs.readFileSync(path.resolve(__dirname,'../move-mechanics-data-v0184.js'),'utf8');
const context={window:{}};
vm.runInNewContext(mechanics,context,{filename:'move-mechanics-data-v0184.js'});
const mechanicIDs=context.window.ChlohaMoveMechanicsData.MOVE_MECHANIC_IDS;
assert.ok(Array.isArray(mechanicIDs)&&Object.isFrozen(mechanicIDs),'core mechanic IDs must be an immutable array');
assert.equal(mechanicIDs.length,45,'existing core mechanic count, including none');
const acceptedMechanics=new Set(mechanicIDs);
assert.equal(acceptedMechanics.size,45,'core mechanic IDs must be unique');
assert.ok(mechanicIDs.every(id=>typeof id==='string'),'core mechanic IDs must be strings');
assert.match(engine,/if\(!MOVE_MECHANIC_IDS\.includes\(a\.moveMechanic\|\|'none'\)\)/,'engine must use core mechanic IDs and preserve its fallback');
assert.ok(acceptedMechanics.has('none'),'normal damage mechanic must remain accepted');
for(const id of ['gravApple','shellSideArm','futureSight','unknownMechanic','constructor'])
 assert.ok(!acceptedMechanics.has(id),'preserve existing core mechanic rejection: '+id);
for(const mechanic of ['activationAssumed','freezeDry','hardPress','acrobatics'])assert.ok(acceptedMechanics.has(mechanic),'validator accepts '+mechanic);
for(const name of ['ウェザーボール','だいちのはどう'])assert.equal(moves.find(m=>m.name===name).calculationSupported,true,name+' dynamic type and power supported');
assert.ok(source.includes("a.moveMechanic==='weatherBall'"),'Weather Ball dynamic weather typing');
assert.ok(source.includes("a.moveMechanic==='terrainPulse'"),'Terrain Pulse dynamic terrain typing');
assert.equal(moves.find(m=>m.name==='レイジングブル').calculationSupported,true,'Raging Bull enabled');
assert.ok(source.includes("a.moveMechanic==='ragingBull'"),'Raging Bull form typing');
assert.ok(source.includes('id="ragingBullForm"'),'Raging Bull form selector');
assert.ok(source.includes("combat:'かくとう',blaze:'ほのお',aqua:'みず'"),'Raging Bull three form types');
assert.equal(moves.find(m=>m.name==='オーラぐるま').calculationSupported,true,'Aura Wheel form-dependent typing supported');
assert.ok(source.includes("a.auraWheelForm==='hangry'?'あく':'でんき'"),'Aura Wheel form type switching');
assert.ok(source.includes('id="auraWheelForm"'),'Aura Wheel form UI');
assert.equal(moves.find(m=>m.name==='フライングプレス').calculationSupported,true,'Flying Press dual effectiveness supported');
assert.ok(source.includes("(EFFECT['かくとう']?.[t]??1)*(EFFECT['ひこう']?.[t]??1)"),'Flying Press multiplies fighting and flying type effectiveness');
assert.equal(moves.find(m=>m.name==='フリーズドライ').calculationSupported,true,'Freeze-Dry supported');
assert.ok(source.includes("a.moveMechanic==='freezeDry'&&t==='みず'?2"),'Freeze-Dry Water matchup override');
assert.equal(moves.find(m=>m.name==='つけあがる').calculationSupported,true,'Power Trip positive boost scaling supported');
assert.ok(source.includes('"gw0170b_018":{"priority":"P1","standardDamageSupported":true,"mechanic":"storedPower"'),'Power Trip uses Stored Power mechanic');
assert.equal(moves.find(m=>m.name==='ハードプレス').calculationSupported,true,'Hard Press target HP power supported');
assert.ok(source.includes("a.moveMechanic==='hardPress'?Math.max(1,Math.floor(100*a.currentHp/a.hp))"),'Hard Press uses target remaining HP');
assert.equal(moves.find(m=>m.name==='やまあらし').calculationSupported,true,'Storm Throw guaranteed critical enabled');
assert.ok(source.includes("a.moveMechanic==='sacredSword')ds=Math.min(0,ds)"),'Sacred Sword must ignore positive defense stages');
assert.equal(moves.find(m=>m.name==='フリーズドライ').calculationSupported,true,'Freeze-Dry type override enabled');
assert.equal(moves.find(m=>m.name==='せいなるつるぎ').calculationSupported,true,'Sacred Sword defense-stage bypass enabled');
assert.equal(moves.find(m=>m.name==='パワージェム').calculationSupported,true,'simple attack calculable');
assert.equal(moves.find(m=>m.name==='ドラゴンアロー').calculationSupported,false,'multihit gated');
assert.equal(moves.find(m=>m.name==='ウェザーボール').calculationSupported,true,'variable type supported');
assert.equal(moves.find(m=>m.name==='りゅうのはどう').power,85);
assert.ok(source.includes('この技')||source.includes('計算未対応'));

// Runtime readiness audit: catalog flags alone do not determine UI calculability.
// The 321-move coverage denominator excludes fixed-damage / OHKO / counter moves.
const policyMatch=html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/);
assert.ok(policyMatch,'embedded move policy present');
const policies=JSON.parse(policyMatch[1]);
const damaging=moves.filter(m=>m.category==='physical'||m.category==='special');
const excluded=damaging.filter(m=>policies[m.id]?.priority==='P0');
const candidates=damaging.filter(m=>policies[m.id]?.priority!=='P0');
const legacyFlagMismatch=candidates.filter(m=>m.calculationSupported===false&&policies[m.id]?.mechanic&&policies[m.id]?.standardDamageSupported===true);
assert.ok(legacyFlagMismatch.length>0,'legacy catalog flags are not runtime readiness');
const missingRuntimeMechanic=candidates.filter(m=>policies[m.id]?.standardDamageSupported===true&&!policies[m.id]?.mechanic&&m.calculationSupported!==true);
assert.equal(moves.find(m=>m.name==='メテオビーム').calculationSupported,true,'Meteor Beam hit-turn damage is supported');
assert.equal(policies['v095_71'].mechanic,'chargeSpABoost','Meteor Beam auto SpA boost');
assert.equal(policies['gw0169_s009'].mechanic,'chargeSpABoost','Electro Shot shares SpA boost');
assert.equal(moves.find(m=>m.name==='エレクトロビーム').calculationSupported,true,'Electro Shot enabled');
assert.equal(moves.find(m=>m.name==='シェルアームズ').calculationSupported,true,'Shell Side Arm enabled');
assert.equal(moves.find(m=>m.name==='みらいよち').calculationSupported,true,'Future Sight delayed hit estimate enabled');
assert.equal(moves.find(m=>m.name==='なげつける').calculationSupported,true,'Fling manual power enabled');
assert.equal(policies['gw0169_p076'].mechanic,'flingManual','Fling manual mechanic');
assert.ok(source.includes("flingPowerChoices=[10,30,40,50,60,70,80,90,100,130]"),'Fling power choices');
assert.ok(source.includes("mechanic==='flingManual'?Number($('flingPower').value)"),'Fling power used for damage');
assert.equal(policies['gw0169_s060'].mechanic,'activationAssumed','Future Sight uses activation-assumed normal damage');
assert.ok(!source.includes("a.moveMechanic==='futureSight'"),'Future Sight has no custom damage branch');
assert.equal(policies['gw0169_s020'].mechanic,'shellSideArm','Shell Side Arm adaptive category');
assert.ok(source.includes("physicalChosen=mean(physical.rolls)>mean(special.rolls)"),'Shell Side Arm damage comparison');
assert.ok(source.includes("if(a.moveMechanic==='chargeSpABoost')as=Math.min(6,as+1)"),'pre-hit stage applied');
assert.ok(!missingRuntimeMechanic.some(m=>m.name==='メテオビーム'),'Meteor Beam is no longer an unsupported flagged move');
console.log('Coverage audit: catalog='+damaging.length+', P0 excluded='+excluded.length+', candidates='+candidates.length+', legacy flags overridden='+legacyFlagMismatch.length+', policy without runtime mechanic='+missingRuntimeMechanic.map(m=>m.name).join('/'));
console.log('PASS GameWith catalog',moves.length,'moves,',added.length+expanded.length+extraPhysical.length+extraSpecial.length,'new vs initial 98; v0.170 first-batch supported',expanded.filter(m=>m.calculationSupported).length,'gated',expanded.filter(m=>!m.calculationSupported).length);
