/* v0.183: language-independent locale registry. No calculation inputs are modified. */
'use strict';
const ChlohaLocales=(()=>{
 const entries=Object.freeze([
  Object.freeze({code:'ja',label:'日本語',fallback:'ja'}),
  Object.freeze({code:'en',label:'English',fallback:'ja'}),
  Object.freeze({code:'fr',label:'Français',fallback:'en'}),
  Object.freeze({code:'de',label:'Deutsch',fallback:'en'}),
  Object.freeze({code:'es',label:'Español',fallback:'en'}),
  Object.freeze({code:'it',label:'Italiano',fallback:'en'}),
  Object.freeze({code:'ko',label:'한국어',fallback:'en'}),
  Object.freeze({code:'zh-Hans',label:'简体中文',fallback:'en'}),
  Object.freeze({code:'zh-Hant',label:'繁體中文',fallback:'en'})
 ]);
 const byCode=new Map(entries.map(entry=>[entry.code,entry]));
 function normalize(code){return byCode.has(code)?code:'ja';}
 function chain(code){
  const result=[],seen=new Set();
  let current=normalize(code);
  while(current&&!seen.has(current)){
   result.push(current);seen.add(current);
   current=byCode.get(current)?.fallback;
  }
  return result;
 }
 function lookup(catalogs,code,key){
  if(typeof key!=='string'||!key)throw new TypeError('Translation key required');
  for(const candidate of chain(code)){
   const value=catalogs?.[candidate]?.[key];
   if(typeof value==='string'&&value.trim())return value;
  }
  return key;
 }
 function missing(catalogs,code,keys){
  const own=catalogs?.[normalize(code)]||{};
  return keys.filter(key=>typeof own[key]!=='string'||!own[key].trim());
 }
 return Object.freeze({entries,normalize,chain,lookup,missing});
})();
if(typeof module!=='undefined'&&module.exports)module.exports={entries:ChlohaLocales.entries,normalize:ChlohaLocales.normalize,chain:ChlohaLocales.chain,lookup:ChlohaLocales.lookup,missing:ChlohaLocales.missing};
if(typeof globalThis!=='undefined')globalThis.ChlohaLocales=ChlohaLocales;
