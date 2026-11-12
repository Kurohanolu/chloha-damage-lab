const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
assert.match(html,/<title>Chloha Damage Lab v0\.182 Pre-Release 22<\/title>/);
assert.match(html,/id="versionProvenance"[^>]*>[^<]*公開UI版/);
assert.match(html,/計算コアの「v0\.162」は内部APIの基盤識別子/);
assert.match(html,/version:'0\.162'/);

// Pre-Release 22: Technician is selectable and modifies per-hit effective move power.
assert.match(html, /'テクニシャン':'technician'/);
const technicianLine=html.split('\n').find(line=>line.startsWith("registerModifier('power','technician',"));
assert.ok(technicianLine,'Technician power-layer registration exists');
const vm=require('node:vm');
let technician;
vm.runInNewContext(technicianLine,{
  registerModifier:(layer,id,priority,applies,run)=>{technician={layer,id,priority,applies,run};},
  pokeRound:(v,mod)=>Math.floor((v*mod+2047)/4096)
});
assert.equal(technician.layer,'power');
assert.equal(technician.applies({a:{attAbility:'technician',power:25}}),true);
assert.equal(technician.applies({a:{attAbility:'none',power:25}}),false);
assert.equal(technician.run({a:{attAbility:'technician',power:25}},25),37);
assert.equal(technician.run({a:{attAbility:'technician',power:60}},60),90);
assert.equal(technician.run({a:{attAbility:'technician',power:65}},65),65);

console.log('PASS version provenance: public UI and engine API identifiers distinguished');
