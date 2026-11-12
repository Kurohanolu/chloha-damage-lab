const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const titleMatch=html.match(/<title>Chloha Damage Lab (v0\.\d+) (Pre-Release \d+)<\/title>/);
assert.ok(titleMatch,'public title must contain version and pre-release');
const [,publicVersion,preRelease]=titleMatch;
assert.equal(publicVersion,'v0.182','release series must stay v0.182');
assert.ok(html.includes('class="version">'+publicVersion+' <span>'+preRelease+'</span>'),'visible release badge must match title');
assert.ok(html.includes('Pages publish: '+publicVersion+' '+preRelease),'publish marker must match title');
assert.match(html,/id="versionProvenance"[^>]*>[^<]*公開UI版/);
assert.match(html,/計算コアの「v0\.162」は内部APIの基盤識別子/);
assert.match(html,/version:'0\.162'/);

// Regression coverage: Technician is selectable and modifies per-hit effective move power.
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
for(const [ability,move,expected] of [
 ['megaLauncher','darkPulse',true],['megaLauncher','auraSphere',true],['megaLauncher','earthquake',false],
 ['sharpness','airSlash',true],['sharpness','gw0170_s055',true],['sharpness','earthquake',false]
]){
 const id=ability==='megaLauncher'?'megaLauncher':'sharpness';
 const line=html.split('\n').find(x=>x.startsWith("registerModifier('power','"+id+"',"));
 assert.ok(line,id+' modifier registered');
 let modifier;
 vm.runInNewContext(
 "const MEGA_LAUNCHER_MOVES=new Set(['darkPulse','auraSphere','gw0169_s059','gw0169_s065']);\n"+
 "const SHARPNESS_MOVES=new Set(['airSlash','gw0170b_019','gw0170_s055','gw0169_p044','gw0170b_013','v096_086','v096_076']);\n"+line,
 {registerModifier:(layer,name,priority,applies,run)=>{modifier={layer,name,applies,run};},
  pokeRound:(v,mod)=>Math.floor((v*mod+2047)/4096)});
 assert.equal(modifier.applies({a:{attAbility:ability,moveId:move}}),expected,ability+'/'+move);
 assert.equal(modifier.run({},80),120,id+' boost 1.5x');
}



console.log('PASS version provenance: public UI and engine API identifiers distinguished');
