'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const whitelist=html.match(/\[([^\]]+)\]\.includes\(a\.attAbility\)/);
assert.ok(whitelist,'attacker ability validation whitelist');
const allowed=new Set([...whitelist[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
for(const id of ['none','skillLink','technician','sheerForce','megaLauncher','sharpness','hugePower','purePower','hustle','solarPower','ironFist','strongJaw','transistor','dragonsMaw','analytic','reckless','guts','adaptability','tintedLens','levitate'])
 assert.ok(allowed.has(id),'Attacker ability must pass validation: '+id);
for(const id of ['technician','sheerForce','megaLauncher','sharpness','hugePower','purePower','hustle','solarPower','ironFist','strongJaw','transistor','dragonsMaw','reckless'])
 assert.match(html,new RegExp("registerModifier\\('(?:power|stat)','"+id+"'"),'damage modifier must exist: '+id);
assert.match(html,/registerModifier\('final','analytic',41,/,'Analytic final-damage modifier must exist');
assert.match(html,/アナライズ：発動条件を満たした前提/,'Analytic assumed-active warning must exist');
assert.match(html,/RECKLESS_MOVES=new Set/,'Reckless move list exists');
assert.doesNotMatch(html.match(/const RECKLESS_MOVES=new Set\([^;]+;/)[0],/gw0169_s030/,'Steel Beam must not be boosted');
console.log('PASS attacker ability validation and modifier registration');
