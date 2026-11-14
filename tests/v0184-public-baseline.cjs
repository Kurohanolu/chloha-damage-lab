'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {root,loadCurrent,observe}=require('./helpers/v0184-engine-harness.cjs');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/v0184-public-baseline.json'),'utf8'));
assert.equal(baseline.sourceCommit,'6fe0e8b0f85c30dde029c617254b75b86dd4636b','immutable public reference commit');
assert.equal(baseline.cases.length,300,'review changes to frozen case coverage explicitly');
const context=loadCurrent();
for(const fixture of baseline.cases){
 const actual=observe(context,fixture.entry,structuredClone(fixture.input),structuredClone(fixture.options));
 assert.deepEqual(actual,fixture.expected,fixture.name+': public v0.183 output must be preserved');
}
console.log('PASS v0.184 public baseline: '+baseline.cases.length+' exact results/errors, full traces, hit distributions, and KO probabilities');
