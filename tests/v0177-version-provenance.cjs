const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
assert.match(html,/<title>Chloha Damage Lab v0\.182 Pre-Release 23<\/title>/);
assert.match(html,/id="versionProvenance"[^>]*>[^<]*公開UI版/);
assert.match(html,/計算コアの「v0\.162」は内部APIの基盤識別子/);
assert.match(html,/version:'0\.162'/);

// Pre-Release 23: Technician is selectable and modifies per-hit effective move power.
assert.match(html, /technician:\{ja:'テクニシャン',en:'Technician',coverage:'supported'\}/);
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
assert.match(html, /sheerForce:\{ja:'ちからずく',en:'Sheer Force',coverage:'partial'\}/);
const sheerForceLine=html.split('\n').find(line=>line.startsWith("registerModifier('power','sheerForce',"));
assert.ok(sheerForceLine,'Sheer Force power modifier exists');
let sheerForce;
vm.runInNewContext("const SHEER_FORCE_VERIFIED_MOVES=new Set(['flamethrower','fireBlast','iceBeam','thunderbolt','sludgeBomb']);\n"+sheerForceLine,{
 registerModifier:(layer,id,priority,applies,run)=>{sheerForce={layer,id,priority,applies,run};},
 pokeRound:(v,mod)=>Math.floor((v*mod+2047)/4096)
});
assert.equal(sheerForce.applies({a:{attAbility:'sheerForce',moveId:'flamethrower'}}),true);
assert.equal(sheerForce.applies({a:{attAbility:'sheerForce',moveId:'earthquake'}}),false);
assert.equal(sheerForce.applies({a:{attAbility:'none',moveId:'flamethrower'}}),false);
assert.equal(sheerForce.run({},90),117);


console.log('PASS version provenance: public UI and engine API identifiers distinguished');
