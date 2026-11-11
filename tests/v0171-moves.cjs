// v0.171 conditional-move source regression checks (Node.js, no dependencies).
const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const cases = [
  ['はたきおとす', 'gw0170_u014', 'knockOff', "a.conditionalPower?Math.floor(a.power*1.5)"],
  ['ワイドフォース', 'gw0170_u060', 'expandingForce', "a.terrain==='psychic'&&isGrounded(a,'att')?Math.floor(a.power*1.5)"],
  ['ライジングボルト', 'gw0169_s064', 'risingVoltage', "a.terrain==='electric'&&isGrounded(a,'def')?a.power*2"],
  ['ミストバースト', 'gw0169_s058', 'mistyExplosion', "a.terrain==='misty'&&isGrounded(a,'att')?Math.floor(a.power*1.5)"]
];
for (const [name,id,mechanic,expression] of cases) {
  assert(source.includes('"id":"'+id+'","name":"'+name+'"'), name+' catalog entry');
  assert(source.includes('"'+id+'":{'), name+' policy entry');
  assert(source.includes('"mechanic":"'+mechanic+'"'), name+' mechanic mapping');
  assert(source.includes(expression), name+' conditional power');
}
assert(source.includes("c.a.battleFormat==='doubles'&&c.a.spread==='spread'"), 'doubles spread modifier');
assert(source.includes("mechanic==='expandingForce'&&$('terrain').value==='psychic'"), 'Expanding Force spread selection');
console.log('PASS: v0.171 four-move source regression checks (static only; not damage parity).');
