/* v0.183: adapt existing name catalogs into searchable records without changing game data. */
'use strict';
const ChlohaNameCatalogAdapter=(()=>{
 const categories=Object.freeze(['pokemon','moves','abilities','items']);
 function recordsFrom(names,localized){
  if(!names||typeof names!=='object')throw new TypeError('Name catalog required');
  const result=[];
  for(const category of categories){
   const entries=names[category]||{};
   for(const [sourceKey,englishName] of Object.entries(entries)){
    if(typeof englishName!=='string'||!englishName.trim())continue;
    // Preserve the source key as identity; do not guess Showdown IDs for Japanese keys.
    const isJapanese=/[\u3040-\u30ff\u3400-\u9fff]/u.test(sourceKey);
    const baseNames=isJapanese?{ja:sourceKey,en:englishName}:{en:englishName};
    const translations=localized?.[category]?.[sourceKey]||{};
    // Existing canonical source key always wins; only add names for this exact key.
    result.push({category,id:sourceKey,names:{...baseNames,...translations},aliases:[sourceKey]});
   }
  }
  return result;
 }
 function build(names,engine,localized){
  if(!engine||typeof engine.buildIndex!=='function')throw new TypeError('Search engine required');
  return engine.buildIndex(recordsFrom(names,localized));
 }
 return Object.freeze({categories,recordsFrom,build});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ChlohaNameCatalogAdapter;
if(typeof globalThis!=='undefined')globalThis.ChlohaNameCatalogAdapter=ChlohaNameCatalogAdapter;
