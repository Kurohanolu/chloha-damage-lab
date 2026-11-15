'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{normalizeRuntime}=require('./helpers/v0188-astra-runtime-contract.cjs');
const fixture=require('./fixtures/v0188-astra-runtime-patches.json');
const stableFeedback=require('./fixtures/v100-feedback-runtime-patches.json');
assert.deepEqual(Object.keys(stableFeedback.files).sort(),['feedback-snapshot-v0185.js','feedback-ui-v0185.js']);
for(const file of Object.keys(stableFeedback.files)){
 const source=fs.readFileSync(file,'utf8');normalizeRuntime(file,source);
 assert.throws(()=>normalizeRuntime(file,source+'\n/* unrelated stable-feedback mutation */'));
 const patch=stableFeedback.files[file][0];assert.throws(()=>normalizeRuntime(file,source.replace(patch.after,patch.after+' ')));
}
assert.deepEqual(Object.keys(fixture.files).sort(),['feedback-ui-v0185.js','i18n.js']);
for(const file of Object.keys(fixture.files)){
 const source=fs.readFileSync(file,'utf8');normalizeRuntime(file,source);
 assert.throws(()=>normalizeRuntime(file,source+'\n/* unrelated mutation */'),'additional changes cannot hide in the allowlist');
 const patch=fixture.files[file][0];const after=source.includes(patch.after)?patch.after:stableFeedback.files[file][0].after;assert.throws(()=>normalizeRuntime(file,source.replace(after,after+' ')),'changed patch bytes must fail');
}
const engine=require('./fixtures/v0188-continued-engine-patches.json');
assert.deepEqual(Object.keys(engine.files),['damage-engine-v0184.js']);
for(const file of Object.keys(engine.files)){
 const source=fs.readFileSync(file,'utf8');normalizeRuntime(file,source);
 assert.throws(()=>normalizeRuntime(file,source+'\n/* unrelated engine mutation */'));
 assert.throws(()=>normalizeRuntime(file,source.replace(engine.files[file][0].after,engine.files[file][0].after+' ')));
}
console.log('PASS exact UI/consent and screen-breaking deltas: historical bytes reconstructed; unrelated engine changes rejected');
