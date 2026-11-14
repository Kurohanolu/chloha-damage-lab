'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const weightNamespace=require('../pokemon-weights-v0181.js');
const weights=weightNamespace.default||globalThis.ChlohaPokemonWeights||weightNamespace;
const weightModule=require('../weight-power.js');
const power=weightModule.weightDependentPower||globalThis.ChlohaWeightPower?.weightDependentPower;
assert.equal(typeof power,'function','weight-power.js must expose weightDependentPower');
assert.match(html,/<script src="\.\/pokemon-weights-v0181\.js(?:\?v=[^"]+)?"><\/script><script src="\.\/weight-power\.js(?:\?v=[^"]+)?"><\/script>/);
assert.match(html,/assign\('power',mechanic==='spitUp'\?spitUpCount\*100:mechanic==='flingManual'\?Number\(\$\('flingPower'\)\.value\):weightMove\?weightPower:Math\.max\(1,m\.power\)\)/);
assert.match(html,/if\(weightMove&&weightPower===null\)throw Error/);
for(const id of ['charizard','mega_charizard_x','mega_charizard_y','garchomp','mega_garchomp_z','mega_lucario_z']){
 assert.ok(Number.isFinite(weights[id])&&weights[id]>0,'Missing form weight '+id);
}
assert.equal(power('くさむすび',weights.charizard,weights.mega_lucario_z),60);
assert.equal(power('くさむすび',weights.charizard,weights.charizard),80);
assert.equal(power('ヘビーボンバー',weights.mega_garchomp_z,weights.mega_lucario_z),60);
console.log('v0.181 UI integration and Mega weight boundary smoke: PASS');
