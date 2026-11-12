const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').resolve(__dirname,'../index.html'),'utf8');
const policy=JSON.parse(html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/)[1]);
const moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const groups={fixed_damage:["いかりのまえば","がむしゃら","ナイトヘッド","ちきゅうなげ","いのちがけ","はきだす"],counter_damage:["カウンター","ミラーコート","ほうふく","メタルバースト"],one_hit_ko:["じわれ","ぜったいれいど","ハサミギロチン","つのドリル"]};
for(const [kind,names] of Object.entries(groups)){for(const name of names){const m=moves.find(x=>x.name===name);assert.ok(m,'missing '+name);assert.equal(policy[m.id]?.priority,'P0',name);assert.equal(policy[m.id]?.reasonCode,kind,name);assert.equal(policy[m.id]?.standardDamageSupported,false,name);}}
assert.equal(Object.values(groups).flat().length,14);
for(const [name,mechanic] of [['フリーズドライ','freezeDry'],['せいなるつるぎ','sacredSword']]){const m=moves.find(x=>x.name===name);assert.ok(m,name);assert.equal(policy[m.id]?.priority,'P1',name+' must be available');assert.equal(policy[m.id]?.standardDamageSupported,true,name);assert.equal(policy[m.id]?.mechanic,mechanic,name+' correct special mechanic');}
const p0=Object.entries(policy).filter(([,v])=>v.priority==='P0').map(([id])=>moves.find(m=>m.id===id)?.name).filter(Boolean);
assert.deepEqual(p0.filter(n=>n!=='まもる').sort(),Object.values(groups).flat().sort(),'only 14 nonstandard damaging moves remain excluded');
console.log('PASS 14 special/fixed/OHKO moves excluded; Freeze-Dry and Sacred Sword enabled');
