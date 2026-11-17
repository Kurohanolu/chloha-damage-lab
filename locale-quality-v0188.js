/* UI-only locale repairs; canonical names and engine values remain in existing catalogs. */
(()=>{
 'use strict';
 const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
 const words={
  ja:{title:m=>m+'：たくわえる回数',count:n=>n+'回',power:n=>'威力'+n+'で計算',missing:'技名未登録',invalidStats:'能力ポイントは0〜32の整数で入力してください',budget:'能力ポイント合計は66以内',budgetAtt:'攻撃側の能力ポイント合計は66以内',budgetDef:'防御側の能力ポイント合計は66以内',error:'入力エラー: '},
  en:{title:m=>m+': stored charges',count:n=>n+(n===1?' use':' uses'),power:n=>'Power '+n+' applied',missing:'Move name unavailable',invalidStats:'Stat points must be integers between 0 and 32.',budget:'Stat points must total at most 66.',budgetAtt:'Attacker stat points must total at most 66.',budgetDef:'Defender stat points must total at most 66.',error:'Input error: '},
  fr:{title:m=>m+' : charges accumulées',count:n=>n+(n===1?' utilisation':' utilisations'),power:n=>'Puissance appliquée : '+n,missing:'Nom de capacité indisponible',invalidStats:'Les points de stats doivent être des entiers de 0 à 32.',budget:'Le total des points de stats ne doit pas dépasser 66.',budgetAtt:'Le total des points de stats de l’attaquant ne doit pas dépasser 66.',budgetDef:'Le total des points de stats du défenseur ne doit pas dépasser 66.',error:'Erreur de saisie : '},
  de:{title:m=>m+': gespeicherte Ladungen',count:n=>n+(n===1?' Einsatz':' Einsätze'),power:n=>'Stärke '+n+' angewendet',missing:'Attackenname nicht verfügbar',invalidStats:'Statuspunkte müssen ganze Zahlen zwischen 0 und 32 sein.',budget:'Die Summe der Statuspunkte darf höchstens 66 betragen.',budgetAtt:'Die Summe der Statuspunkte des Angreifers darf höchstens 66 betragen.',budgetDef:'Die Summe der Statuspunkte des Verteidigers darf höchstens 66 betragen.',error:'Eingabefehler: '},
  es:{title:m=>m+': cargas acumuladas',count:n=>n+(n===1?' uso':' usos'),power:n=>'Potencia aplicada: '+n,missing:'Nombre del movimiento no disponible',invalidStats:'Los puntos de estadísticas deben ser enteros entre 0 y 32.',budget:'El total de puntos de estadísticas no puede superar 66.',budgetAtt:'El total de puntos de estadísticas del atacante no puede superar 66.',budgetDef:'El total de puntos de estadísticas del defensor no puede superar 66.',error:'Error de entrada: '},
  'es-LA':{title:m=>m+': cargas acumuladas',count:n=>n+(n===1?' uso':' usos'),power:n=>'Potencia aplicada: '+n,missing:'Nombre del movimiento no disponible',invalidStats:'Los puntos de estadísticas deben ser enteros entre 0 y 32.',budget:'El total de puntos de estadísticas no puede superar 66.',budgetAtt:'El total de puntos de estadísticas del atacante no puede superar 66.',budgetDef:'El total de puntos de estadísticas del defensor no puede superar 66.',error:'Error de entrada: '},
  it:{title:m=>m+': cariche accumulate',count:n=>n+(n===1?' utilizzo':' utilizzi'),power:n=>'Potenza applicata: '+n,missing:'Nome della mossa non disponibile',invalidStats:'I punti statistiche devono essere interi tra 0 e 32.',budget:'Il totale dei punti statistiche non può superare 66.',budgetAtt:'Il totale dei punti statistiche dell’attaccante non può superare 66.',budgetDef:'Il totale dei punti statistiche del difensore non può superare 66.',error:'Errore di inserimento: '},
  ko:{title:m=>m+': 비축 횟수',count:n=>n+'회',power:n=>'위력 '+n+' 적용',missing:'기술 이름을 사용할 수 없습니다',invalidStats:'능력치 포인트는 0~32 사이의 정수여야 합니다.',budget:'능력치 포인트 합계는 66 이하여야 합니다.',budgetAtt:'공격 측 능력치 포인트 합계는 66 이하여야 합니다.',budgetDef:'방어 측 능력치 포인트 합계는 66 이하여야 합니다.',error:'입력 오류: '},
  'zh-Hans':{title:m=>m+'：蓄力次数',count:n=>n+'次',power:n=>'按威力'+n+'计算',missing:'招式名称不可用',invalidStats:'能力点数必须是0至32之间的整数。',budget:'能力点数总计不得超过66。',budgetAtt:'攻击方能力点数总计不得超过66。',budgetDef:'防御方能力点数总计不得超过66。',error:'输入错误：'},
  'zh-Hant':{title:m=>m+'：蓄力次數',count:n=>n+'次',power:n=>'以威力'+n+'計算',missing:'招式名稱無法使用',invalidStats:'能力點數必須是0至32之間的整數。',budget:'能力點數總計不得超過66。',budgetAtt:'攻擊方能力點數總計不得超過66。',budgetDef:'防禦方能力點數總計不得超過66。',error:'輸入錯誤：'}
 };
 const language=locale=>locales.includes(locale)?locale:'ja';
 const moveName=(key,locale)=>{const fallback=globalThis.ChlohaLocalizedNames?.moves?.[key]?.[locale]||globalThis.ChlohaPokeAPILocalizedNames?.moves?.[key]?.[locale]||(locale==='es-LA'?(globalThis.ChlohaLocalizedNames?.moves?.[key]?.es||globalThis.ChlohaPokeAPILocalizedNames?.moves?.[key]?.es):null)||words[locale].missing;return locale==='es-LA'?(globalThis.ChlohaEsLa?.entity?.('moves',key,fallback)||fallback):fallback;};
 function stockpile(locale,count){locale=language(locale);const w=words[locale];return {title:w.title(moveName('はきだす',locale)),count:w.count(count),power:w.power(count*100)};}

 // Product UI copy; move names remain in the existing canonical dictionaries.
 const countWords={
  ja:['味方のひんし数','攻撃を受けた回数',n=>n+'匹',n=>n+'回','6回以上'],
  en:['Fainted allies','Hits taken',n=>n+(n===1?' ally':' allies'),n=>n+(n===1?' hit':' hits'),'6+ hits'],
  fr:['Alliés K.O.','Coups reçus',n=>n+(n===1?' allié':' alliés'),n=>n+(n===1?' coup':' coups'),'6 coups ou plus'],
  de:['Besiegte Verbündete','Erlittene Treffer',n=>n+' Verbündete',n=>n+' Treffer','6+ Treffer'],
  es:['Aliados debilitados','Golpes recibidos',n=>n+(n===1?' aliado':' aliados'),n=>n+(n===1?' golpe':' golpes'),'6 golpes o más'],
  'es-LA':['Aliados debilitados','Golpes recibidos',n=>n+(n===1?' aliado':' aliados'),n=>n+(n===1?' golpe':' golpes'),'6 golpes o más'],
  it:['Alleati esausti','Colpi subiti',n=>n+(n===1?' alleato':' alleati'),n=>n+(n===1?' colpo':' colpi'),'6 o più colpi'],
  ko:['기절한 아군 수','공격받은 횟수',n=>n+'마리',n=>n+'회','6회 이상'],
  'zh-Hans':['陷入昏厥的同伴数量','受到攻击的次数',n=>n+'只',n=>n+'次','6次以上'],
  'zh-Hant':['陷入瀕死的同伴數量','受到攻擊的次數',n=>n+'隻',n=>n+'次','6次以上']
 };
 const countSpecs=[
  {panel:'lastRespectsPanel',input:'faintedAllies',move:'おはかまいり',max:5,kind:0},
  {panel:'rageFistPanel',input:'rageFistHits',move:'ふんどのこぶし',max:6,kind:1}
 ];
 function countCopy(locale,spec,value){
  locale=language(locale);const w=countWords[locale],n=Math.min(spec.max,Math.max(0,Number(value)||0));
  return {title:(locale==='ja'?spec.move:moveName(spec.move,locale))+(locale==='ja'?'：':': ')+w[spec.kind],count:spec.kind===1&&n===6?w[4]:w[spec.kind+2](n),power:words[locale].power(50+50*n)};
 }
 function mountCounts(){
  const anchor=document.getElementById('spitUpPanel');if(!anchor)return;
  for(const spec of [...countSpecs].reverse()){
   const panel=document.getElementById(spec.panel),input=document.getElementById(spec.input);
   if(!panel||!input||panel.querySelector('[data-move-count]'))continue;
   panel.setAttribute('data-no-translate','');panel.setAttribute('role','group');
   input.closest('.fields').hidden=true;
   const choices=document.createElement('div');choices.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-top:8px';
   for(let n=0;n<=spec.max;n++){
    const b=document.createElement('button');b.type='button';b.dataset.moveCount=String(n);
    b.style.cssText='min-height:44px;min-width:44px;flex:1 0 44px;white-space:normal';
    b.addEventListener('click',()=>{input.value=String(n);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));schedule();});
    choices.append(b);
   }
   const note=document.createElement('small');note.id=spec.panel+'PowerNote';note.setAttribute('aria-live','polite');
   panel.append(choices,note);anchor.after(panel);
  }
 }
 function renderCounts(){
  const locale=language(globalThis.ChlohaLocale?.get?.());
  for(const spec of countSpecs){
   const panel=document.getElementById(spec.panel),input=document.getElementById(spec.input);
   if(!panel||!input||!panel.querySelector('[data-move-count]'))continue;
   const value=Math.min(spec.max,Math.max(0,Number(input.value)||0)),copy=countCopy(locale,spec,value);
   const set=(node,text)=>{if(node&&node.textContent!==text)node.textContent=text;};
   if(panel.getAttribute('aria-label')!==copy.title)panel.setAttribute('aria-label',copy.title);
   set(panel.querySelector('h2'),copy.title);
   for(const b of panel.querySelectorAll('[data-move-count]')){
    const n=Number(b.dataset.moveCount),pressed=String(n===value);
    if(b.getAttribute('aria-pressed')!==pressed)b.setAttribute('aria-pressed',pressed);
    b.style.fontWeight=n===value?'700':'400';b.style.outline=n===value?'2px solid currentColor':'none';
    set(b,countCopy(locale,spec,n).count);
   }
   set(document.getElementById(spec.panel+'PowerNote'),copy.power);
  }
 }

 const errorKinds=['invalidStats','budgetAtt','budgetDef','budget'];
 function errorKind(value){
  const text=String(value||'');
  for(const kind of errorKinds)for(const locale of locales)if(text===words[locale][kind]||text===words[locale].error+words[locale][kind])return kind;
  // The legacy observer may translate a newly inserted message before this
  // observer runs. Reuse its current-locale rendering of the canonical source
  // as an alias, rather than duplicating a second table of legacy phrases.
  const translate=globalThis.ChlohaLocale?.text;
  if(typeof translate==='function')for(const kind of errorKinds){
   for(const source of [words.ja[kind],words.ja.error+words.ja[kind]]){
    if(text===translate(source))return kind;
   }
  }
  if(text.includes('能力ポイントは0〜32'))return 'invalidStats';
  if(text.includes('攻撃側の能力ポイント合計は66以内'))return 'budgetAtt';
  if(text.includes('防御側の能力ポイント合計は66以内'))return 'budgetDef';
  if(text.includes('能力ポイント合計は66以内'))return 'budget';
  return null;
 }
 // The legacy renderer can omit the space before a fullwidth numeric bracket.
 // Resolve entities from canonical selections instead of parsing their words:
 // localized species/move names can themselves contain spaces and brackets.
 function summary(value,names,locale){
  const match=String(value||'').match(/^(.+?)[（(](\d+)[）)]\s*→\s*(.+?)[（(](\d+)\s*\/\s*HP\s*(\d+)[）)](.*)$/u);
  if(!match||!names.attacker||!names.move||!names.defender)return null;
  const open=locale==='ja'?'（':' (',close=locale==='ja'?'）':')';
  return names.attacker+' '+names.move+open+match[2]+close+' → '+names.defender+open+match[4]+' / HP '+match[5]+close+match[6];
 }
 const api=Object.freeze({locales:Object.freeze(locales),stockpile,countCopy,countSpecs:Object.freeze(countSpecs),errorKind,summary,errorText:(locale,kind)=>words[language(locale)][kind]});
 globalThis.ChlohaLocaleQuality=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(!globalThis.document)return;
 const owned=new WeakSet();
 function own(node){
  if(!node.hasAttribute('data-no-translate')){node.setAttribute('data-no-translate','');owned.add(node);}
 }
 function delegate(node){
  if(!owned.has(node))return;
  owned.delete(node);node.removeAttribute('data-no-translate');
  // A previous owned state can suppress the legacy observer's first pass after
  // the calculator replaces its text. Delegate the new raw message explicitly.
  const next=globalThis.ChlohaLocale?.text?.(node.textContent);
  if(typeof next==='string'&&next!==node.textContent)node.textContent=next;
 }
 function render(){
  renderCounts();
  const locale=language(globalThis.ChlohaLocale?.get?.()),panel=document.getElementById('spitUpPanel');
  if(panel){
   const selected=Number(panel.querySelector('[data-stockpile][aria-pressed=true]')?.dataset.stockpile||1),copy=stockpile(locale,selected);
   const set=(node,value)=>{if(node&&node.textContent!==value)node.textContent=value;};
   if(panel.getAttribute('aria-label')!==copy.title)panel.setAttribute('aria-label',copy.title);
   set(panel.querySelector('strong'),copy.title);
   for(const button of panel.querySelectorAll('[data-stockpile]'))set(button,stockpile(locale,Number(button.dataset.stockpile)).count);
   set(panel.querySelector('#spitUpPowerNote'),copy.power);
  }
  for(const id of ['error','dbStatus']){
   const node=document.getElementById(id);if(!node)continue;const kind=errorKind(node.textContent);if(!kind){if(id==='error')delegate(node);continue;}
   own(node);
   const next=(id==='dbStatus'?words[locale].error:'')+words[locale][kind];if(node.textContent!==next)node.textContent=next;
  }
  const status=document.getElementById('dbStatus');
  if(status&&globalThis.ChlohaLastCalculation){
   const selected=id=>document.getElementById(id)?.value;
   const species=(id,portrait)=>locale==='ja'?document.getElementById(portrait)?.dataset.pokemonJa:globalThis.ChlohaLocalePokemonName?.(selected(id),locale);
   const moves=typeof ChlohaMovesDB!=='undefined'?ChlohaMovesDB.moves:[];
   const canonical=moves.find(move=>move.id===selected('dbMove'))?.name;
   const names={attacker:species('dbAttPokemon','attPortrait'),defender:species('dbDefPokemon','defPortrait'),move:locale==='ja'?canonical:canonical?moveName(canonical,locale):null};
   const next=summary(status.textContent,names,locale);
   if(next!==null){own(status);if(status.textContent!==next)status.textContent=next;}else if(!errorKind(status.textContent))delegate(status);
  }else if(status&&!errorKind(status.textContent))delegate(status);
 }
 let queued=false;
 const schedule=()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;render();});}};
 function init(){
  mountCounts();document.addEventListener('input',schedule);document.addEventListener('change',schedule);
  render();document.addEventListener('chloha:localechange',schedule);
  const observer=new MutationObserver(schedule);
  for(const id of ['spitUpPanel','error','dbStatus']){const node=document.getElementById(id);if(node)observer.observe(node,{childList:true,subtree:true,characterData:true,attributes:id==='spitUpPanel',attributeFilter:id==='spitUpPanel'?['aria-pressed']:undefined});}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

