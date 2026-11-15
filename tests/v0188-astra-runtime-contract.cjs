'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{normalizeRuntime}=require('./helpers/v0188-astra-runtime-contract.cjs');
const fixture=require('./fixtures/v0188-astra-runtime-patches.json');
assert.deepEqual(Object.keys(fixture.files).sort(),['feedback-ui-v0185.js','i18n.js']);
for(const file of Object.keys(fixture.files)){
 const source=fs.readFileSync(file,'utf8');normalizeRuntime(file,source);
 assert.throws(()=>normalizeRuntime(file,source+'\n/* unrelated mutation */'),'additional changes cannot hide in the allowlist');
 const patch=fixture.files[file][0];assert.throws(()=>normalizeRuntime(file,source.replace(patch.after,patch.after+' ')),'changed patch bytes must fail');
}
console.log('PASS exact Astra UI deltas: complete historical reconstruction, no additional runtime changes or engine allowlist');
