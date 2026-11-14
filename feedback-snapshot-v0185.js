(()=>{
 'use strict';
 const C=globalThis.ChlohaFeedbackContract;
 function capture(){
  const byId=id=>document.getElementById(id),selection={};
  for(const [key,id] of [['attacker','dbAttPokemon'],['defender','dbDefPokemon'],['move','dbMove']])if(byId(id)?.value)selection[key]=byId(id).value;
  const controls={};for(const id of C.controlIds){const node=byId(id);if(node)controls[id]=node.type==='checkbox'?node.checked:node.value;}
  let engineInput=null;try{if(typeof window.read==='function')engineInput=structuredClone(window.read());}catch{}
  const last=window.ChlohaLastCalculation;
  let result=null;
  if(last&&engineInput&&last.signature===JSON.stringify(engineInput)&&last.moveId===selection.move&&!byId('output')?.hidden){
   const r=last.r;
   result={minimumDamage:Math.min(...r.rolls),maximumDamage:Math.max(...r.rolls),koProbability:r.koProbability??null,baseDamage:r.base,attackStat:r.attack,defenseStat:r.defense,effectivePower:r.effectivePower};
  }
  const snapshot={schemaVersion:1,appVersion:document.title.match(/v\d+\.\d+(?: Pre-Release \d+)?/)?.[0]||'',engineVersion:window.ChlohaDamageEngine?.version||'',locale:window.ChlohaLocale?.get?.()||'ja',selection,controls,engineInput,result};
  if(!C.validateSnapshot(snapshot))throw Error('snapshot_unavailable');
  return JSON.parse(JSON.stringify(snapshot));
 }
 globalThis.ChlohaFeedbackSnapshot=Object.freeze({capture});
})();
