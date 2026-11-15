/* Calculator controls only. No report text, contact details, snapshots, history or credentials. */
(function(root){
 'use strict';
 const KEY='singularity.calculator.v1',VERSION=1,MAX_AGE=30*24*60*60*1000;
 const STATS=['hp','attack','defense','specialAttack','specialDefense','speed'];
 const IDS=('dbAttPokemon dbDefPokemon dbMove dbAuto dbFoulAttackEv dbFoulAttackNature ragingBullForm auraWheelForm conditionalPower terrain weather attGrounding defGrounding customMultiplier level power attack defense hp currentHp attackStage defenseStage moveType category attType1 attType2 defType1 defType2 attItem defItem attAbility defAbility stabMode burn poisoned thermalExchangeActivated angerPointActivated rattledActivated flashFireActivated critical helpingHand attMaxHp attCurrentHp forceLowHpAbility attSpeed defSpeed attSpeedStage defSpeedStage attParalyzed defParalyzed attTailwind defTailwind rageFistHits faintedAllies storedPower_atk storedPower_def storedPower_spa storedPower_spd storedPower_spe storedPower_accuracy storedPower_evasion defStatus battleFormat spread targetSwitchedIn allyBattery allyPowerSpot supremeOverlordFainted partnerOppositePlusMinus friendGuardCount screen flingPower dragonDartsHits beatUpStats').split(' ');
 const COPY={
  ja:['計算条件を初期化','計算条件は最終保存から30日以内に復元できます。期限切れの保存は次回読み込み時に削除します。初期化ですぐ削除できます。複数タブでは最後の保存を次回復元します。','計算条件を初期化しました。','この環境では条件を保存できません。計算は引き続き利用できます。'],
  en:['Reset calculation','Settings can be restored for 30 days after the last save. Expired settings are deleted on the next load; Reset deletes them immediately. With multiple tabs, the last saved settings are restored on the next load.','Calculation settings reset.','Settings cannot be saved in this environment. You can continue calculating.'],
  fr:['Réinitialiser le calcul','Les paramètres peuvent être restaurés pendant 30 jours après le dernier enregistrement. Les paramètres expirés sont supprimés au prochain chargement ; Réinitialiser les supprime immédiatement. Avec plusieurs onglets, le dernier enregistrement est restauré au prochain chargement.','Paramètres de calcul réinitialisés.','Les paramètres ne peuvent pas être enregistrés ici. Le calcul reste disponible.'],
  de:['Berechnung zurücksetzen','Einstellungen können 30 Tage nach dem letzten Speichern wiederhergestellt werden. Abgelaufene Einstellungen werden beim nächsten Laden gelöscht; Zurücksetzen löscht sie sofort. Bei mehreren Tabs wird beim nächsten Laden der zuletzt gespeicherte Stand wiederhergestellt.','Berechnungseinstellungen zurückgesetzt.','Die Einstellungen können hier nicht gespeichert werden. Berechnungen sind weiterhin möglich.'],
  es:['Restablecer el cálculo','Los ajustes se pueden restaurar durante 30 días desde el último guardado. Los ajustes caducados se eliminan al cargar de nuevo; Restablecer los elimina de inmediato. Con varias pestañas, se restauran los últimos ajustes guardados al cargar de nuevo.','Ajustes de cálculo restablecidos.','No se pueden guardar los ajustes aquí. Puedes seguir calculando.'],
  it:['Ripristina il calcolo','Le impostazioni possono essere ripristinate per 30 giorni dall’ultimo salvataggio. Quelle scadute vengono eliminate al caricamento successivo; Ripristina le elimina subito. Con più schede, al caricamento successivo viene ripristinato l’ultimo salvataggio.','Impostazioni di calcolo ripristinate.','Non è possibile salvare le impostazioni qui. Puoi continuare a calcolare.'],
  ko:['계산 조건 초기화','계산 조건은 마지막 저장 후 30일 이내에 복원할 수 있습니다. 기간이 지난 조건은 다음에 불러올 때 삭제되며, 초기화하면 즉시 삭제됩니다. 여러 탭에서는 마지막으로 저장된 조건이 다음에 불러와집니다.','계산 조건을 초기화했습니다.','이 환경에서는 조건을 저장할 수 없습니다. 계산은 계속 이용할 수 있습니다.'],
  'zh-Hans':['重置计算条件','计算条件可在最后保存后的30天内恢复。过期条件将在下次载入时删除；重置会立即删除。使用多个标签页时，下次载入将恢复最后保存的条件。','计算条件已重置。','此环境无法保存条件，仍可继续计算。'],
  'zh-Hant':['重設計算條件','計算條件可在最後儲存後的30天內還原。過期條件將在下次載入時刪除；重設會立即刪除。使用多個分頁時，下次載入將還原最後儲存的條件。','計算條件已重設。','此環境無法儲存條件，仍可繼續計算。']
 };
 const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
 const exact=(x,keys)=>object(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
 const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
 function validModels(models,defenderAttackOverride){
  if(defenderAttackOverride!==undefined&&!integer(defenderAttackOverride,0,32))return false;
  return exact(models,['att','def'])&&['att','def'].every(side=>{
   const m=models[side];return exact(m,['points','nature','rank','manual'])&&exact(m.points,STATS)&&exact(m.nature,STATS)&&exact(m.rank,STATS)&&
    STATS.every(k=>integer(m.points[k],0,32)&&['plus','neutral','minus'].includes(m.nature[k])&&integer(m.rank[k],-6,6))&&
    Object.values(m.points).reduce((a,b)=>a+b,0)+(side==='def'&&defenderAttackOverride!==undefined?defenderAttackOverride-m.points.attack:0)<=66&&object(m.manual)&&Object.keys(m.manual).every(k=>STATS.includes(k)&&integer(m.manual[k],1,9999));
  });
 }
 function validState(state,specs){
  if(!exact(state,['controls','models','spitUpCount','conditionalPowerOverride'])||!exact(state.controls,IDS)||!integer(state.spitUpCount,1,3)||typeof state.conditionalPowerOverride!=='boolean')return false;
  for(const id of IDS){
   const value=state.controls[id],spec=specs[id];if(!spec)return false;
   if(spec.kind==='boolean'){if(typeof value!=='boolean')return false;continue;}
   if(typeof value!=='string'||value.length>512)return false;
   if(spec.kind==='select'){if(!spec.values.includes(value))return false;continue;}
   if(id==='beatUpStats'){if(!/^\d{1,3}(\s*,\s*\d{1,3}){0,5}$/.test(value)||value.split(',').some(n=>!integer(Number(n),1,255)))return false;continue;}
   if(value.trim()===''||!Number.isFinite(Number(value)))return false;
   const n=Number(value);if(n<spec.min||n>spec.max||spec.integer&&!Number.isSafeInteger(n))return false;
  }
  const c=state.controls;
  if(Number(c.currentHp)>Number(c.hp)||Number(c.attCurrentHp)>Number(c.attMaxHp))return false;
  const move=specs.dbMove?.moves?.[c.dbMove];
  // Match the live UI budget: automatic Foul Play replaces the defender's
  // inactive Attack allocation with its dedicated target-Attack input.
  if(!validModels(state.models,c.dbAuto&&move?.mechanic==='foulPlay'?Number(c.dbFoulAttackEv):undefined))return false;
  if(c.dbAuto&&move){
   if(c.category!==move.category)return false;
  }
  return true;
 }
 function decode(raw,specs,now=Date.now()){
  try{if(typeof raw!=='string'||raw.length>32768)return null;const value=JSON.parse(raw);
   if(!exact(value,['schemaVersion','savedAt','state'])||value.schemaVersion!==VERSION||!integer(value.savedAt,0,now+60000)||now-value.savedAt>MAX_AGE||!validState(value.state,specs))return null;
   return value.state;
  }catch{return null;}
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={KEY,VERSION,MAX_AGE,IDS,STATS,validModels,validState,decode};
 if(!root.document)return;
 function init(){
  const doc=root.document,ui=root.ChlohaUI;if(!ui?.persistenceRestore)return;
  const el=id=>doc.getElementById(id),rules=ui.persistenceRules(),specs={};
  for(const id of IDS){
   const node=el(id);if(!node)return;
   if(node.type==='checkbox')specs[id]={kind:'boolean'};
   else if(node.tagName==='SELECT')specs[id]={kind:'select',values:['attAbility','defAbility'].includes(id)?rules.abilities:['attItem','defItem'].includes(id)?rules.items:[...node.options].map(o=>o.value)};
   else specs[id]={kind:'number',min:node.min!==''?Number(node.min):0,max:node.max!==''?Number(node.max):9999,integer:id!=='customMultiplier'};
  }
  specs.dbMove.moves=Object.fromEntries(root.ChlohaGameData.moves.map(move=>[move.id,{category:move.category,mechanic:typeof ChlohaMovePolicy!=='undefined'?ChlohaMovePolicy[move.id]?.mechanic:undefined}]));
  let failed=false,timer=null,applying=false,lastMessage='';
  const box=doc.createElement('div');box.id='calculatorStorage';box.setAttribute('data-no-translate','');box.className='calculator-storage';
  const button=doc.createElement('button');button.type='button';button.id='resetCalculation';
  const description=doc.createElement('small');description.id='calculatorStorageDescription';
  const message=doc.createElement('small');message.id='calculatorStorageStatus';message.setAttribute('role','status');
  button.setAttribute('aria-describedby',description.id);box.append(button,description,message);el('resetBoard').closest('.board-quick').after(box);
  const copy=()=>COPY[root.ChlohaLocale?.get?.()||'ja']||COPY.en;
  const putText=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
  function localize(){const c=copy();putText(button,c[0]);putText(description,c[1]);putText(message,failed?c[3]:lastMessage==='reset'?c[2]:'');}
  function storageError(){failed=true;localize();}
  const capture=()=>({controls:Object.fromEntries(IDS.map(id=>[id,el(id).type==='checkbox'?el(id).checked:el(id).value])),...ui.persistenceState()});
  const defaults=capture();
  function put(id,value){const node=el(id);if(node.type==='checkbox')node.checked=value;else{
   if(node.tagName==='SELECT'&&![...node.options].some(o=>o.value===value)){const option=doc.createElement('option');option.value=value;option.textContent=value;node.append(option);}
   node.value=value;
  }}
  function apply(state){
   applying=true;
   try{
    for(const id of ['dbAttPokemon','dbDefPokemon'])put(id,state.controls[id]);
    ui.persistencePrepare();
    for(const id of IDS)put(id,state.controls[id]);
    ui.persistenceRestore(state);
   }finally{applying=false;}
  }
  function save(){
   clearTimeout(timer);timer=null;if(applying)return false;
   const state=capture();if(!validState(state,specs))return false;
   try{root.localStorage.setItem(KEY,JSON.stringify({schemaVersion:VERSION,savedAt:Date.now(),state}));failed=false;lastMessage='';localize();return true;}catch{storageError();return false;}
  }
  function reset(){
   clearTimeout(timer);timer=null;apply(defaults);
   try{root.localStorage.removeItem(KEY);failed=false;}catch{storageError();}
   lastMessage='reset';localize();
  }
  try{const raw=root.localStorage.getItem(KEY);if(raw!==null){const state=decode(raw,specs);if(state)apply(state);else root.localStorage.removeItem(KEY);}}catch{storageError();}
  // Open tabs retain their current controls; the last successful save wins.
  // Do not write on pagehide unless an actual input operation is pending.
  function schedule(){if(applying)return;clearTimeout(timer);timer=setTimeout(save,80);}
  const modelInput=id=>/^(att|def)-(hp|attack|defense|specialAttack|specialDefense|speed)-(points|range|nature|actual)$/.test(id);
  for(const event of ['input','change'])doc.addEventListener(event,e=>{const id=e.target?.id;if(IDS.includes(id)||modelInput(id)||/^db(?:Att|Def)(?:Ev|HpEv|SpeedEv|Nature|SpeedNature)$/.test(id))schedule();});
  doc.addEventListener('click',e=>{const target=e.target.closest?.('button');if(target&&(target.closest('#attPresets,#defPresets,#spitUpChoices')||['swapSides','criticalToggle','resetBoard','battleCommit','battleUndo','battleReset'].includes(target.id)))schedule();});
  root.addEventListener('pagehide',()=>{if(timer!==null)save();});
  doc.addEventListener('visibilitychange',()=>{if(doc.visibilityState==='hidden'&&timer!==null)save();});
  doc.addEventListener('chloha:localechange',localize);button.addEventListener('click',reset);localize();
  root.ChlohaPersistence=Object.freeze({key:KEY,schemaVersion:VERSION,capture,save,reset,status:()=>({storageAvailable:!failed,pending:timer!==null})});
 }
 if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof window!=='undefined'?window:globalThis);
