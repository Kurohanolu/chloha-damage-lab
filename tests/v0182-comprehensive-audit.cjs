'use strict';
// Release-readiness audit: CI coverage and evidence, not a claim of hardware parity.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const workflow=fs.readFileSync(path.join(root,'.github/workflows/ui-smoke.yml'),'utf8');
const packageJson=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const lines=workflow.split(/\r?\n/);
const runs=[...workflow.matchAll(/^\s+- run: node (tests\/[^\s]+)$/gm)].map(m=>m[1]);
const duplicates=runs.filter((p,i)=>runs.indexOf(p)!==i);
assert.deepEqual(duplicates,[],'CI must not run duplicate test scripts');
for(const script of runs)assert.ok(fs.existsSync(path.join(root,script)),'CI script missing: '+script);
const sections={};
let current='';
for(const line of lines){
 if(/^  (push|pull_request):\s*$/.test(line))current=line.trim().slice(0,-1);
 else if(/^  [a-z_]+:\s*$/.test(line))current='';
 if((current==='push'||current==='pull_request')&&/^      - /.test(line)){
  const value=line.trim().slice(2).replace(/^['"]|['"]$/g,'');
  (sections[current]??=[]).push(value);
 }
}
for(const event of ['push','pull_request']){
 const filters=sections[event]||[];
 for(const required of ['index.html','i18n.js','names-*.js','weight-power.js','variable-power.js','multi-hit.js','tests/**','data/**','.github/workflows/ui-smoke.yml'])
  assert.ok(filters.includes(required),event+' missing CI trigger: '+required);
}
const suites={
 numeric:['tests/v0177-independent-vectors.cjs','tests/v0182-conditional-power-rolls.mjs','tests/v0182-defensive-rounding-oracle.mjs','tests/v0182-offense-defense-rounding-oracle.mjs','tests/v0182-field-type-rounding-oracle.mjs','tests/v0182-dualtype-defensive-ability-oracle.mjs'],
 moves:['tests/v0182-move-coverage-inventory.cjs','tests/v0182-four-move-policy-engine.mjs','tests/v0182-remaining-37-ui-wiring.mjs','tests/v0182-variable-power.cjs'],
 multiHit:['tests/v0182-independent-multihit-rolls.cjs','tests/v0182-special-multihit-independent.cjs','tests/v0182-multihit-browser.cjs'],
 abilities:['tests/v0182-showdown-ability-flags.cjs','tests/v0182-forced-critical-immunity.mjs','tests/v0182-moldbreaker-composition.mjs'],
 ui:['tests/ui-smoke.cjs','tests/v0182-stat-reference-ui-wiring.mjs','tests/v0182-all-select-locale-roundtrip.cjs'],
 locale:['tests/v0179-localization-coverage.cjs','tests/v0182-bilingual-move-search.cjs','tests/v0182-move-status-locale-toggle.cjs','tests/v0182-source-labels-i18n.cjs'],
 data:['tests/v0181-weight-data-audit.cjs','tests/v0181-mega-weight-integrity.cjs','tests/v0181-sprite-coverage.cjs']
};
for(const [group,required] of Object.entries(suites))for(const script of required)
 assert.ok(runs.includes(script),'release audit lacks '+group+' suite: '+script);
const evidence={
 versionTarget:'v0.182',status:'pre-release / evidence collection',
 checks:{ciScriptCount:runs.length,uniqueCiScripts:new Set(runs).size,groups:Object.fromEntries(Object.entries(suites).map(([k,v])=>[k,v.length])),triggerParity:true},
 observations:[
  {severity:'review',subject:'package.json version',detail:'Package metadata '+packageJson.version+' differs from v0.182 app release label; confirm intentional tooling-only version before v0.183'},
  {severity:'review',subject:'move catalog',detail:'calculationSupported flags and runtime-policy overrides are not proof of in-game parity; review generated move inventory'},
  {severity:'review',subject:'language coverage',detail:'CI contains Japanese/English locale tests; independently verify Korean completeness and live toggle behavior before release'},
  {severity:'review',subject:'hardware parity',detail:'Automated engine/reference parity does not replace Champions hardware test vectors'}
 ],
 decision:'NOT_RELEASE_APPROVED: open review items remain; CI passing only confirms automated checks'
};
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports/v0182-comprehensive-audit.json'),JSON.stringify(evidence,null,2)+'\n');
console.log('PASS v0.182 comprehensive CI coverage gate',JSON.stringify(evidence.checks));
console.log('RELEASE_REVIEW',JSON.stringify(evidence.observations));
console.log(evidence.decision);
