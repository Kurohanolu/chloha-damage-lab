/* v0.183: locale registry contract, no unsupported locale advertised as complete. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../i18n.js'),'utf8');
const match=source.match(/const ChlohaLocaleRegistry=Object\.freeze\((\{[\s\S]*?\})\);\nconst key=/);
assert.ok(match,'locale registry must be defined before persistence');
const registry=vm.runInNewContext('('+match[1]+')');
const expected=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
assert.deepEqual(Object.keys(registry),expected);
for(const [code,info] of Object.entries(registry)){
 assert.ok(info.name&&info.nativeName,'missing locale label: '+code);
 assert.equal(typeof info.ready,'boolean');
 assert.equal(Object.isFrozen(info),true,'locale metadata must be immutable: '+code);
}
assert.deepEqual(Object.keys(registry).filter(code=>registry[code].ready),['ja','en']);
assert.ok(source.includes("locale=next==='en'?'en':'ja'"),'incomplete locales must not be selectable through setLocale');
console.log('PASS v0.183 nine-locale registry; only audited languages enabled');
