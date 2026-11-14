'use strict';
const assert=require('node:assert/strict');
const {compare}=require('./helpers/v0186-reference.cjs');
const fixture=require('./fixtures/v0186-confirmed-regressions.json');
const failures=[];
for(const c of fixture.cases){
 const result=compare(c.input,{generation:c.generation});
 assert.deepEqual(result.expected,c.expected,c.id+': independent reference must remain pinned');
 assert.notDeepEqual(c.actual,c.expected,c.id+': fixture must demonstrate the pre-fix defect');
 if(!result.matches)failures.push(c.id+': '+JSON.stringify({expected:result.expected,actual:result.actual}));
}
assert.equal(failures.length,0,failures.join('\n'));
console.log('PASS v0.186 confirmed regressions: '+fixture.cases.length+' independent 16-roll witnesses');
