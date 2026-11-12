'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const whitelist=html.match(/\[([^\]]+)\]\.includes\(a\.attAbility\)/);
assert.ok(whitelist,'attacker ability validation whitelist');
const allowed=new Set([...whitelist[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
for(const id of ['none','skillLink','technician','sheerForce','megaLauncher','sharpness','hugePower','purePower','hustle','solarPower','ironFist','strongJaw','transistor','dragonsMaw','guts','adaptability','tintedLens','levitate'])
 assert.ok(allowed.has(id),'Attacker ability must pass validation: '+id);
for(const id of ['technician','sheerForce','megaLauncher','sharpness','hugePower','purePower','hustle','solarPower','ironFist','strongJaw','transistor','dragonsMaw'])
 assert.match(html,new RegExp("registerModifier\\('(?:power|stat)','"+id+"'"),'damage modifier must exist: '+id);
console.log('PASS attacker ability validation and modifier registration');
