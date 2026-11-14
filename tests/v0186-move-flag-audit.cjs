'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const {root,reference,context,flags,compare,abilityName}=require('./helpers/v0186-reference.cjs');
const mapping={IRON_FIST_MOVES:'punch',STRONG_JAW_MOVES:'bite',MEGA_LAUNCHER_MOVES:'pulse',SHARPNESS_MOVES:'slicing',TOUGH_CLAWS_CONTACT_MOVES:'contact',BULLETPROOF_BALL_MOVES:'bullet',PUNK_ROCK_SOUND_MOVES:'sound',RECKLESS_MOVES:'recoil'};
const differences=[],counts={};let membershipChecks=0,sheerForceReferenceEligible=0;
for(const [set,key] of Object.entries(mapping)){
 const actual=context.ChlohaMoveMechanicsData[set];counts[set]=actual.size;
 for(const [id,m] of Object.entries(flags)){
  const ref=reference.Generations.get(0).moves.get(m.showdownId)||reference.Generations.get(9).moves.get(m.showdownId);
  const expected=key==='recoil'?!!ref.recoil||!!ref.hasCrashDamage:!!ref.flags[key];
  if(actual.has(id)!==expected)differences.push({set,id,showdownId:m.showdownId,expected,actual:actual.has(id)});
  membershipChecks++;
 }
}
for(const [id,m] of Object.entries(flags)){
 const ref=reference.Generations.get(0).moves.get(m.showdownId)||reference.Generations.get(9).moves.get(m.showdownId);
 const eligible=!!ref.secondaries||ref.name==='Electro Shot';
 if(eligible)sheerForceReferenceEligible++;
 if(context.ChlohaMoveMechanicsData.SHEER_FORCE_VERIFIED_MOVES.has(id))assert.equal(eligible,true,'existing Sheer Force whitelist must be valid: '+id);
}
// An explicit pre-existing five-move partial implementation is not expanded.
assert.equal(context.ChlohaMoveMechanicsData.SHEER_FORCE_VERIFIED_MOVES.size,5);
fs.mkdirSync(root+'/reports/v0186',{recursive:true});
fs.writeFileSync(root+'/reports/v0186/move-flag-audit.json',JSON.stringify({membershipChecks,counts,differences,sheerForce:{implemented:5,referenceEligible:sheerForceReferenceEligible,status:'Partial'}},null,2)+'\n');
console.log('Flag membership audit:',membershipChecks,'checks,',differences.length,'differences; Sheer Force remains explicitly Partial');
assert.equal(differences.length,0,'Incorrect imported move flags must be corrected, not hidden');
const roles={IRON_FIST_MOVES:{attAbility:'ironFist'},STRONG_JAW_MOVES:{attAbility:'strongJaw'},MEGA_LAUNCHER_MOVES:{attAbility:'megaLauncher'},SHARPNESS_MOVES:{attAbility:'sharpness'},TOUGH_CLAWS_CONTACT_MOVES:{attAbility:'toughClaws'},BULLETPROOF_BALL_MOVES:{defAbility:'bulletproof'},PUNK_ROCK_SOUND_MOVES:{attAbility:'punkRock'},RECKLESS_MOVES:{attAbility:'reckless'}};
let numericChecks=0;
for(const role of Object.values(roles))for(const [id,m] of Object.entries(flags)){
 if(m.category==='Status')continue;
 const gen0=reference.Generations.get(0);
 const generation=gen0.moves.get(m.showdownId)&&Object.values(role).every(a=>gen0.abilities.get(reference.toID(abilityName(a))))?0:9;
 const r=compare({moveId:id,category:m.category.toLowerCase(),power:91,attack:157,defense:123,...role},{generation});
 assert.deepEqual(r.actual,r.expected,id+': ability-tag damage, '+JSON.stringify(role));numericChecks++;
}
console.log('PASS all registered move-tag effects:',numericChecks,'independent 16-roll comparisons');
