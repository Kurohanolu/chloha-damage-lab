'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {root,loadCurrent,observe}=require('./helpers/v0184-engine-harness.cjs');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/v0184-public-baseline.json'),'utf8'));
assert.equal(baseline.sourceCommit,'6fe0e8b0f85c30dde029c617254b75b86dd4636b','immutable public reference commit');
assert.equal(baseline.cases.length,300,'review changes to frozen case coverage explicitly');
const context=loadCurrent();
// Keep all 300 original fixtures immutable. v0.186 corrected demonstrated
// defects; each explicit erratum has an original-output digest and a full
// replacement contract. Independent numeric parity is an additional CI gate.
const errata=require('./fixtures/v0186-baseline-corrections.json');
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
assert.equal(digest(fs.readFileSync(path.join(root,'tests/fixtures/v0184-public-baseline.json'))),errata.frozenBaselineSha256);
const corrections=new Map(errata.cases.map(c=>[c.name,c]));
assert.equal(corrections.size,31,'review every added baseline correction explicitly');
for(const fixture of baseline.cases){
 const actual=observe(context,fixture.entry,structuredClone(fixture.input),structuredClone(fixture.options));
 const correction=corrections.get(fixture.name);
 if(correction){assert.equal(digest(JSON.stringify(fixture.expected)),correction.originalExpectedSha256,fixture.name+': original evidence must stay immutable');assert.ok(correction.reason);assert.notDeepEqual(correction.expected,fixture.expected);}
 assert.deepEqual(actual,correction?.expected||fixture.expected,fixture.name+': full public contract or documented v0.186 correction');
}
assert.ok([...corrections.keys()].every(name=>baseline.cases.some(f=>f.name===name)),'no unused correction');
console.log('PASS 300 baseline contracts: 269 unchanged, 26 independent numeric corrections, 5 trace/metadata corrections; original fixtures retained');
