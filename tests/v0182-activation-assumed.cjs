const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').resolve(__dirname,'../index.html'),'utf8');
const policy=JSON.parse(html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/)[1]);
const moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const names=["きあいパンチ","であいがしら","ゲップ","とっておき","デカハンマー","はやてがえし","ポルターガイスト","くちばしキャノン","ゴッドバード","そらをとぶ","ダイビング","ゴーストダイブ","ソーラーブレード","だいふんげき","あばれる","さわぐ","もえつきる","じばく","だいばくはつ","でんこうそうげき"];
for(const name of names){const m=moves.find(x=>x.name===name);assert.ok(m,'missing '+name);assert.ok(m.power>0,'nonpositive '+name);assert.ok(['physical','special'].includes(m.category),'invalid category '+name);assert.equal(policy[m.id].standardDamageSupported,true,name);assert.equal(policy[m.id].mechanic,'activationAssumed',name);assert.notEqual(policy[m.id].priority,'P0',name);}
assert.match(html,/if\(policy\?\.mechanic&&policy\.standardDamageSupported===true\)return true;/,'ready function must accept verified policy');
console.log('PASS 20 activation-gated moves accepted as successful-use damage calculations');
