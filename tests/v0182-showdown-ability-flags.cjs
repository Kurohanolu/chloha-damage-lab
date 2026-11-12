// Regression guard for Showdown slicing/pulse move-flag mapping in v0.182.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const db=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]);
const catalog=new Map(db.moves.map(m=>[m.id,m]));
function moveSet(name){
 const match=html.match(new RegExp('const '+name+'=new Set\\(\\[([^\\]]+)\\]\\)'));
 assert.ok(match,name+' exists');
 return new Set([...match[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
}
const slicing=moveSet('SHARPNESS_MOVES');
const pulse=moveSet('MEGA_LAUNCHER_MOVES');
const expectedSlicing={
 'airSlash':'エアスラッシュ','gw0170b_019':'つじぎり','gw0170_s055':'リーフブレード',
 'gw0169_p044':'サイコカッター','gw0170b_013':'せいなるつるぎ',
 'v096_086':'シェルブレード','v096_076':'アクアカッター',
 'gw0169_p061':'つばめがえし','v095_63':'エアカッター','xScissor':'シザークロス',
 'gw0169_p039':'クロスポイズン','gw0169_p031':'きりさく',
 'gw0169_p054':'ソーラーブレード','gw0169_p075':'ドゲザン',
 'gw0170_s020':'ひけん・ちえなみ','gw0170_u008':'ネズミざん',
 'gw0170_s047':'むねんのつるぎ'
};
const expectedPulse={
 'darkPulse':'あくのはどう','auraSphere':'はどうだん',
 'gw0169_s059':'みずのはどう','gw0169_s065':'りゅうのはどう',
 'gw0169_s027':'だいちのはどう'
};
for(const [id,name] of Object.entries(expectedSlicing)){
 assert.equal(catalog.get(id)?.name,name,'slicing ID mismatch: '+id);
 assert.ok(slicing.has(id),'missing Sharpness move: '+name);
}
for(const [id,name] of Object.entries(expectedPulse)){
 assert.equal(catalog.get(id)?.name,name,'pulse ID mismatch: '+id);
 assert.ok(pulse.has(id),'missing Mega Launcher move: '+name);
}
for(const [name,ids] of [['Sharpness',slicing],['Mega Launcher',pulse]]){
 for(const id of ids)assert.ok(catalog.has(id),name+' references missing move '+id);
}
assert.equal(slicing.size,Object.keys(expectedSlicing).length,'slicing coverage changed: review Showdown tags');
assert.equal(pulse.size,Object.keys(expectedPulse).length,'pulse coverage changed: review Showdown tags');
const showdown=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../data/showdown-ability-flags-v0182.json'),'utf8'));
const categoryMap={Physical:'physical',Special:'special',Status:'status'};
assert.equal(Object.keys(showdown.moves).length,77,'Showdown coverage snapshot count');
for(const [id,record] of Object.entries(showdown.moves)){
 const move=catalog.get(id);
 assert.ok(move,'missing mapped Showdown move '+id);
 // Never overwrite Champions values with default Showdown values without verification.
 const override=showdown.championsPowerOverrides?.[id];
 const unresolved=showdown.unverifiedPowerDifferences?.[id];
 if(override)assert.equal(move.power,override.power,'verified Champions power: '+move.name);
 else if(unresolved)assert.equal(move.power,unresolved.championsCatalogPower,'unverified catalog value changed: '+move.name);
 else assert.equal(move.power,record.basePower,'base power mismatch: '+move.name);
 assert.equal(move.category,categoryMap[record.category],'category mismatch: '+move.name);
 assert.equal(slicing.has(id),record.flags.includes('slicing'),'slicing flag mismatch: '+move.name);
 assert.equal(pulse.has(id),record.flags.includes('pulse'),'pulse flag mismatch: '+move.name);
}
console.log('PASS Showdown flag audit: slicing',slicing.size,'pulse',pulse.size);
