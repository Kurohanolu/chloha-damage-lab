/* v0.183 multilingual option labels; does not change option values or battle data. */
(()=>{
'use strict';
const originals=new WeakMap();
const categories=['pokemon','moves','abilities','items'];
function category(select){
 const id=select.id||'';
 if(id==='dbAttPokemon'||id==='dbDefPokemon')return 'pokemon';
 if(/ability/i.test(id))return 'abilities';
 if(/item/i.test(id))return 'items';
 if(/move/i.test(id))return 'moves';
 return null;
}
function translated(category,key,locale){
 const bulk=window.ChlohaPokeAPILocalizedNames?.[category]||{};
 const curated=window.ChlohaLocalizedNames?.[category]||{};
 return curated[key]?.[locale]||bulk[key]?.[locale]||null;
}
function render(){
 const locale=window.ChlohaLocale?.get?.()||'ja';
 if(!categories.length)return;
 for(const select of document.querySelectorAll('select')){
  const kind=category(select);
  if(!kind)continue;
  for(const option of select.options){
   if(!originals.has(option))originals.set(option,option.textContent);
   const original=originals.get(option);
   const key=kind==='pokemon'?option.value:original.trim();
   // Preserve native labels and suffixes when no exact translation exists.
   const name=locale==='ja'?null:translated(kind,key,locale);
   const next=name||original;
   if(option.textContent!==next)option.textContent=next;
  }
 }
}
let queued=false;
function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render()})}
function init(){
 render();
 document.getElementById('chloha-locale')?.addEventListener('change',schedule);
 new MutationObserver(records=>{
  if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&(n.matches?.('option,select')||n.querySelector?.('option,select')))))schedule();
 }).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
 window.ChlohaMultilingualNames=Object.freeze({refresh:render});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
