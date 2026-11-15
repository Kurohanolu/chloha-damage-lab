'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const fixture=require('../fixtures/v0188-astra-runtime-patches.json');
const engineFixture=require('../fixtures/v0188-continued-engine-patches.json');
// Reverse only exact documented UI/consent deltas and the independently tested
// screen-breaking correction. Unrelated engine and backend bytes stay protected.
function normalizeRuntime(file,source){
 for(const patch of engineFixture.files[file]||[]){
  assert.equal(source.split(patch.after).length-1,1,'Exact independently witnessed engine correction: '+file);
  source=source.replace(patch.after,patch.before);
 }
 if(engineFixture.files[file])assert.equal(source,execFileSync('git',['show',engineFixture.baselineCommit+':'+file],{encoding:'utf8',maxBuffer:16*1024*1024}),'All other engine bytes must retain historical identity: '+file);
 for(const patch of fixture.files[file]||[]){
  assert.equal(source.split(patch.after).length-1,1,'Exact Astra UI patch: '+file);
  source=source.replace(patch.after,patch.before);
 }
 if(fixture.files[file])assert.equal(source,execFileSync('git',['show',fixture.baselineCommit+':'+file],{encoding:'utf8',maxBuffer:16*1024*1024}),'Only recorded patches may differ: '+file);
 return source;
}
module.exports={normalizeRuntime};
