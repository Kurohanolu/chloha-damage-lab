/* v0.179: display-only translations for native selects. */
(()=>{
'use strict';
const norm=x=>String(x||'').normalize('NFKC').trim();
const original=new WeakMap();
const catalog=()=>window.ChlohaNames;
function english(option,select){
 const ja=original.get(option)||option.textContent;
 const data=catalog();if(!data)return null;
 if(select.id==='dbAttPokemon'||select.id==='dbDefPokemon'){
  return data.pokemon[option.value]||null;
 }
 if(/ability/i.test(select.id))return data.abilities[norm(ja)]||null;
 if(/item/i.test(select.id))return data.items[norm(ja)]||null;
 return null;
}
function render(){
 const en=window.ChlohaLocale?.get()==='en';
 for(const select of document.querySelectorAll('select')){
  for(const option of select.options){
   if(!original.has(option))original.set(option,option.textContent);
   const ja=original.get(option),translated=english(option,select);
   const label=en&&translated?translated+' / '+ja:ja;
   if(option.textContent!==label)option.textContent=label;
  }
 }
}
let queued=false;
function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render();});}
function init(){
 render();
 document.getElementById('chloha-locale')?.addEventListener('change',schedule);
 new MutationObserver(records=>{
  if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('option,select')||n.querySelector?.('option,select')))))schedule();
 }).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
 window.ChlohaNameDisplay=Object.freeze({refresh:render});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();