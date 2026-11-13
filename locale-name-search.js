/* v0.183 multilingual entity-name search foundation. IDs are canonical; no battle data changes. */
'use strict';
const ChlohaNameSearch=(()=>{
 const supported=Object.freeze(['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant']);
 const categories=Object.freeze(['pokemon','moves','abilities','items']);
 function normalize(value){
  return String(value??'').normalize('NFKC').toLocaleLowerCase('und').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[\s\u3000\-_.'’]/g,'');
 }
 function buildIndex(records){
  if(!Array.isArray(records))throw new TypeError('Records must be an array');
  const result=[];
  for(const record of records){
   if(!record||!categories.includes(record.category)||typeof record.id!=='string'||!record.id)throw new TypeError('Invalid entity identity');
   const names=record.names||{};
   const aliases=new Set();
   for(const code of supported){
    const name=names[code];
    if(typeof name==='string'&&name.trim())aliases.add(normalize(name));
   }
   if(Array.isArray(record.aliases))for(const alias of record.aliases){
    if(typeof alias==='string'&&alias.trim())aliases.add(normalize(alias));
   }
   result.push(Object.freeze({id:record.id,category:record.category,aliases:Object.freeze([...aliases])}));
  }
  return Object.freeze(result);
 }
 function search(index,category,query){
  if(!categories.includes(category))throw new TypeError('Invalid category');
  const term=normalize(query);
  if(!term)return [];
  return index.filter(entry=>entry.category===category&&entry.aliases.some(alias=>alias.includes(term))).map(entry=>entry.id);
 }
 return Object.freeze({supported,categories,normalize,buildIndex,search});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ChlohaNameSearch;
if(typeof globalThis!=='undefined')globalThis.ChlohaNameSearch=ChlohaNameSearch;
