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
console.log('PASS Showdown flag audit: slicing',slicing.size,'pulse',pulse.size);
