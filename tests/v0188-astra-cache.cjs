'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const script=fs.readFileSync('scripts/verify-release.cjs','utf8'),html=fs.readFileSync('index.html','utf8');
const requireVerifier=require('node:module').createRequire(require('node:path').resolve('scripts/verify-release.cjs'));
function verify(input){vm.runInNewContext(script,{URL,require(name){if(name==='node:fs')return {...fs,readFileSync(file,...args){return file==='index.html'?input:fs.readFileSync(file,...args);}};return requireVerifier(name);},console:{log(){}}});}
verify(html);
for(const file of ['i18n.js','feedback-ui-v0185.js','damage-engine-v0184.js','persistence-v0188.js']){
 const version=require('../release.json').tag.slice(1).replaceAll('.','\\.');
 const expression=new RegExp('('+file.replaceAll('.','\\.')+'\\?v='+version+')&h=[a-f0-9]{16}');
 assert.match(html,expression);
 assert.throws(()=>verify(html.replace(expression,'$1')),'missing content key must fail: '+file);
 assert.throws(()=>verify(html.replace(expression,'$1&h=0000000000000000')),'stale content key must fail: '+file);
}
console.log('PASS follow-up cache keys: exact changed assets, missing and stale hashes rejected');
