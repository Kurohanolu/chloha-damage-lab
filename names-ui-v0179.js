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
 if(select.id==='attItem' && /Plate$/.test(option.value)){
  const plateType={flamePlate:'Fire',splashPlate:'Water',zapPlate:'Electric',meadowPlate:'Grass',iciclePlate:'Ice',fistPlate:'Fighting',toxicPlate:'Poison',earthPlate:'Ground',skyPlate:'Flying',mindPlate:'Psychic',insectPlate:'Bug',stonePlate:'Rock',spookyPlate:'Ghost',dracoPlate:'Dragon',dreadPlate:'Dark',ironPlate:'Steel',pixiePlate:'Fairy'}[option.value];
  const plateName=data.items[norm(ja.split('（')[0])];
  if(plateName&&plateType)return plateName+' ('+plateType+' moves ×1.2)';
 }
 if(select.id==='defItem' && /Berry$/.test(option.value)){
  const berryType={chilanBerry:'Normal',occaBerry:'Fire',passhoBerry:'Water',wacanBerry:'Electric',rindoBerry:'Grass',yacheBerry:'Ice',chopleBerry:'Fighting',kebiaBerry:'Poison',shucaBerry:'Ground',cobaBerry:'Flying',payapaBerry:'Psychic',tangaBerry:'Bug',chartiBerry:'Rock',kasibBerry:'Ghost',habanBerry:'Dragon',colburBerry:'Dark',babiriBerry:'Steel',roseliBerry:'Fairy'}[option.value];
  const berryName=data.items[norm(ja.split('（')[0])];
  if(berryName&&berryType)return berryName+' ('+berryType+' damage ×0.5)';
 }
 if(/item/i.test(select.id))return data.items[norm(ja)]||null;
 return null;
}
function render(){
 const en=window.ChlohaLocale?.get()==='en';
 for(const select of document.querySelectorAll('select')){
  for(const option of select.options){
   if(!original.has(option))original.set(option,option.textContent);
   const ja=original.get(option),translated=english(option,select);
   const label=en&&translated?translated:ja;
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