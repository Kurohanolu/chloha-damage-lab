/* ES-LA presentation only. Canonical calculation IDs and existing locale catalogs stay unchanged. */
'use strict';
const ChlohaEsLa=(()=>{
 const data=typeof globalThis!=='undefined'?globalThis.ChlohaEsLaData:null;
 if(!data||data.locale!=='es-LA')throw new Error('ES-LA name data must load first');
 const own=(category,key)=>typeof key==='string'&&Object.prototype.hasOwnProperty.call(data.entries[category]||{},key)?data.entries[category][key]:null;
 function metadata(category,key){return own(category,key);}
 function entity(category,key,fallback){return own(category,key)?.name||fallback;}
 function aliases(category,key){return own(category,key)?.aliases.slice()||[];}
 function translateUi(text,baseJapanese){
  // Exact canonical labels only. Never replace arbitrary substrings or infer an ID from a translated name.
  for(const category of ['types','forms','natures','stats']){
   const record=own(category,baseJapanese);
   if(record)return record.name;
  }
  return text;
 }
 return Object.freeze({entity,metadata,aliases,translateUi,coverage:data.coverage});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ChlohaEsLa;
if(typeof globalThis!=='undefined')globalThis.ChlohaEsLa=ChlohaEsLa;
