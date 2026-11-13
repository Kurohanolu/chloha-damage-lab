/* v0.183: reject inconsistent localized entity names before bulk ingestion. */
'use strict';
const ChlohaNameLocaleAudit=(()=>{
 const categories=Object.freeze(['pokemon','moves','abilities','items']);
 const locales=Object.freeze(['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant']);
 function audit(catalog,translations){
  if(!catalog||!translations)throw new TypeError('Catalog and translations required');
  const issues=[];
  const counts={};
  const coverage={};
  for(const category of categories){
   counts[category]={records:0,localized:0};
   coverage[category]=Object.fromEntries(locales.map(locale=>[locale,{translated:0,total:Object.keys(catalog[category]||{}).length}]));
   const source=catalog[category]||{};
   const entries=translations[category]||{};
   for(const [id,names] of Object.entries(entries)){
    counts[category].records++;
    // PokeAPI uses species IDs while the calculator may use candidate/form IDs.
    // Accept an alias only when its English name identifies exactly one catalog entry.
    // Unknown IDs without an unambiguous canonical match remain errors.
    const canonicalMatches=names&&typeof names.en==='string'
     ?Object.entries(source).filter(([,english])=>english===names.en)
     :[];
    const knownId=Object.prototype.hasOwnProperty.call(source,id);
    const canonicalId=knownId?id:(canonicalMatches.length===1?canonicalMatches[0][0]:null);
    if(!canonicalId)issues.push(category+':'+id+':unknown-id');
    if(!names||typeof names!=='object'||Array.isArray(names)){issues.push(category+':'+id+':invalid-names');continue;}
    for(const [locale,name] of Object.entries(names)){
     if(!locales.includes(locale))issues.push(category+':'+id+':unsupported-locale:'+locale);
     else if(typeof name!=='string'||!name.trim())issues.push(category+':'+id+':empty-name:'+locale);
     else {counts[category].localized++;coverage[category][locale].translated++;}
    }
    if(names.en&&knownId&&names.en!==source[id])issues.push(category+':'+id+':english-mismatch');
   }
  }
  return {ok:issues.length===0,issues,counts,coverage};
 }
 return Object.freeze({categories,locales,audit});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ChlohaNameLocaleAudit;
if(typeof globalThis!=='undefined')globalThis.ChlohaNameLocaleAudit=ChlohaNameLocaleAudit;
