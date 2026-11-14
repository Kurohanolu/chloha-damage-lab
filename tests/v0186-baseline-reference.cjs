'use strict';
const assert=require('node:assert/strict');
const {compare}=require('./helpers/v0186-reference.cjs');
const original=require('./fixtures/v0184-public-baseline.json');
const errata=require('./fixtures/v0186-baseline-corrections.json');
let checked=0;
for(const c of errata.cases)if(c.referenceGeneration!==null){
 const f=original.cases.find(f=>f.name===c.name),r=compare(f.input,{generation:c.referenceGeneration});
 assert.deepEqual(c.expected.output.rolls,r.expected,c.name+': corrected baseline must match an independent pinned reference');
 assert.deepEqual(r.actual,r.expected,c.name+': current engine must match the same reference');checked++;
}
assert.equal(checked,26);
console.log('PASS v0.186 baseline errata: all 26 changed numeric vectors independently revalidated');
