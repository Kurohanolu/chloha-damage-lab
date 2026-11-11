// Phase 1: engine contract audit. Structural guards are NOT game parity.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const engine=html.slice(html.indexOf('function calculate(a){'),html.indexOf('const DamageEngine='));
assert.ok(engine.startsWith('function calculate(a){'),'engine entry point');
assert.match(engine,/for\(let r=85;r<=100;r\+\+\)/,'16 random rolls 85-100');
assert.match(engine,/if\(a\.critical\)\{as=Math\.max\(0,as\);ds=Math\.min\(0,ds\);\}/,'critical stage bypass');
assert.match(engine,/if\(immune\)\{rolls\.push\(0\);continue;\}/,'immunity zero rolls');
assert.match(engine,/a\.moveMechanic==='knockOff'&&a\.conditionalPower\?Math\.floor\(a\.power\*1\.5\)/,'Knock Off 1.5x floored');
assert.match(engine,/\['stompingTantrum','hex','facade','venoshock'/,'Facade in conditional double-power group');
assert.match(engine,/for\(const first of hitRolls\)for\(const second of hitRolls\)/,'two-hit 256 combinations');
assert.match(engine,/applyLayer\('postRandom'/,'post-random modifiers');
assert.match(engine,/applyLayer\('final'/,'final modifiers');
assert.ok(html.includes('実機未照合'),'game parity disclaimer');
console.log('PASS v0.177 phase 1 engine structural audit');
