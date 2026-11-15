'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const fixture=require('../fixtures/v0188-astra-runtime-patches.json');
// Exact reversible presentation/consent corrections only. All other bytes,
// including the engine and feedback backend, remain under the original contract.
function normalizeRuntime(file,source){
 for(const patch of fixture.files[file]||[]){
  assert.equal(source.split(patch.after).length-1,1,'Exact Astra UI patch: '+file);
  source=source.replace(patch.after,patch.before);
 }
 if(fixture.files[file])assert.equal(source,execFileSync('git',['show',fixture.baselineCommit+':'+file],{encoding:'utf8',maxBuffer:16*1024*1024}),'Only recorded patches may differ: '+file);
 return source;
}
module.exports={normalizeRuntime};
