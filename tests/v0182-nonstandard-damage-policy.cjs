const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').resolve(__dirname,'../index.html'),'utf8');
const policy=JSON.parse(html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/)[1]);
const moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const groups={fixed_damage:["いかりのまえば","がむしゃら","ナイトヘッド","ちきゅうなげ","いのちがけ","はきだす"],counter_damage:["カウンター","ミラーコート","ほうふく","メタルバースト"],one_hit_ko:["じわれ","ぜったいれいど","ハサミギロチン","つのドリル"]};
for(const [kind,names] of Object.entries(groups)){for(const name of names){const m=moves.find(x=>x.name===name);assert.ok(m,'missing '+name);assert.equal(policy[m.id]?.priority,'P0',name);assert.equal(policy[m.id]?.reasonCode,kind,name);assert.equal(policy[m.id]?.standardDamageSupported,false,name);}}
assert.equal(Object.values(groups).flat().length,14);
console.log('PASS 14 special/fixed/OHKO moves explicitly excluded from ordinary damage calculation');
