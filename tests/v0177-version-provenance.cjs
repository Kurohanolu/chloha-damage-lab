const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
assert.match(html,/<title>Chloha Damage Lab v0\.182 Pre-Release 22<\/title>/);
assert.match(html,/id="versionProvenance"[^>]*>[^<]*公開UI版/);
assert.match(html,/計算コアの「v0\.162」は内部APIの基盤識別子/);
assert.match(html,/version:'0\.162'/);
console.log('PASS version provenance: public UI and engine API identifiers distinguished');
