'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const {loadPublicContracts}=require('./helpers/public-release-contract.cjs');
const {loadCurrent,observe}=require('./helpers/v0184-engine-harness.cjs');
const corrected=loadPublicContracts();
// A PR smoke test against a pre-audit public base must not import the PR's
// newer errata. Emulate the absence of that file in the selected source tree.
const historical=loadPublicContracts({exists:()=>false});
assert.equal(corrected.cases.length,300);assert.equal(historical.cases.length,300);
const context=loadCurrent();
for(const name of ['neutral','Shell Side Arm tie','special ネズミざん/dice']){
 const fixture=corrected.cases.find(item=>item.name===name);
 assert.deepEqual(observe(context,fixture.entry,structuredClone(fixture.input),structuredClone(fixture.options)),fixture.expected,'current public smoke contract: '+name);
}
const name='Shell Side Arm tie';
const current=corrected.cases.find(item=>item.name===name),old=historical.cases.find(item=>item.name===name);
assert.notDeepEqual(current.expected,old.expected,'the old smoke expectation must reproduce the release-check defect');
assert.deepEqual(old.expected,JSON.parse(fs.readFileSync('tests/fixtures/v0184-public-baseline.json')).cases.find(item=>item.name===name).expected,'historical deployments retain their original contract');
assert.throws(()=>loadPublicContracts({readFile:file=>file.endsWith('v0184-public-baseline.json')?Buffer.from(fs.readFileSync(file)+' '):fs.readFileSync(file)}),/immutable baseline/,'corrupt or changed frozen evidence must block the smoke check');
console.log('PASS public release contracts: corrected live vectors, historical PR-base isolation, immutable evidence guard');
