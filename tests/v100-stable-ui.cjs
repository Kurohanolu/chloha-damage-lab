'use strict';
// Stable identity and truthful scope checks complement the existing nine-language
// browser/reload/numeric regressions. Historical prerelease fixtures stay separate.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const release=JSON.parse(fs.readFileSync('release.json','utf8'));
assert.equal(release.version,'1.0.0');assert.equal(release.tag,'v1.0.0');
assert.equal(release.channel,'stable');assert.equal(release.preRelease,null);
assert.equal(release.name,'Singularity v1.0.0');
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.includes('<title>Singularity v1.0.0</title>'));
assert.ok(html.includes('Pages publish: v1.0.0'));
assert.ok(html.includes('<span class="version" data-no-translate>v1.0.0</span>'));
const presentation=html.match(/app\.innerHTML=`([\s\S]*?)<\/aside>`;/)[1];
assert.doesNotMatch(presentation,/Pre-Release|CHLOHA LABS|Experimental build|実機未照合の検証版です/);
assert.match(presentation,/id="versionProvenance">[^<]*画面の「v1\.0\.0」[^<]*内部API識別子は「v0\.184」/);
assert.match(presentation,/data-singularity="scope" data-no-translate/);
assert.match(presentation,/data-singularity="credit" data-no-translate>開発元：Chloha Labs/);
for(const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)(\?[^"#]+)?"/g)){
 const url=new URL(match[1]+(match[2]||''),'https://preview.invalid/');
 assert.equal(url.searchParams.get('v'),'1.0.0','every current local asset has the stable cache version: '+url.pathname);
 if(url.searchParams.has('h')){
  const digest=crypto.createHash('sha256').update(fs.readFileSync(url.pathname.slice(1))).digest('hex').slice(0,16);
  assert.equal(url.searchParams.get('h'),digest,'changed-content cache identity: '+url.pathname);
 }
}
const scopeNode={textContent:''},creditNode={textContent:''},descriptionNode={textContent:''};
let locale='ja',refresh;
const context={window:{ChlohaLocale:{get:()=>locale}},document:{readyState:'complete',addEventListener:(name,fn)=>{if(name==='chloha:localechange')refresh=fn;},querySelectorAll:selector=>selector==='[data-singularity="scope"]'?[scopeNode]:selector==='[data-singularity="credit"]'?[creditNode]:selector==='[data-singularity="description"]'?[descriptionNode]:[],querySelector:()=>null,getElementById:()=>null}};
vm.runInNewContext(fs.readFileSync('brand-v0187.js','utf8'),context);
const brand=context.window.SingularityBrand;
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
assert.deepEqual(Object.keys(brand.scopeNotices).sort(),[...locales].sort());
assert.ok(Object.isFrozen(brand.scopeNotices));
const required={
 ja:['対応範囲と制限','未検証の項目'],
 en:['supported scope and limitations','remain unverified'],
 fr:['fonctionnalités prises en charge et leurs limites','restent à vérifier'],
 de:['unterstützten Umfang und die Einschränkungen','noch ungeprüft'],
 es:['funciones compatibles y sus limitaciones','siguen sin verificarse'],
 it:['funzioni supportate e i relativi limiti','restano da verificare'],
 ko:['지원 범위와 제한 사항','아직 검증되지 않은 항목'],
 'zh-Hans':['支持范围与限制','仍有未经验证的项目'],
 'zh-Hant':['支援範圍與限制','仍有未經驗證的項目']
};
for(const target of locales){
 locale=target;refresh();
 for(const fragment of required[target])assert.ok(scopeNode.textContent.includes(fragment),'truthful localized support scope: '+target+'/'+fragment);
 assert.doesNotMatch(scopeNode.textContent,/Pre-Release|Experimental build|実機未照合の検証版です/);
 assert.ok(creditNode.textContent.includes('Chloha Labs'),'developer credit: '+target);
 assert.equal(descriptionNode.textContent,brand.descriptions[target]);
}
assert.equal(brand.product,'Singularity');assert.equal(brand.developer,'Chloha Labs');
console.log('PASS v1.0.0 stable UI: exact title/badge/provenance/cache identity; nine localized truthful scope notices and preserved developer/brand identities. Browser parity is checked separately.');
