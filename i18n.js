/* Damage Lab v0.179: bilingual presentation layer. No calculation inputs or values are modified. */
(()=>{
'use strict';
const dictionary={
'対戦の一手を、確かめる。':'Validate every move.',
'実機未照合の検証版です。':'Experimental build; not fully verified on hardware.',
'計算結果・収録・習得技は未保証。':'Damage results, availability and learnsets are not guaranteed.',
'攻撃側':'Attacker','防御側':'Defender','結果 ↓':'Results ↓','⇄ 攻守を入れ替え':'⇄ Swap sides',
'盤面の基本設定':'Battlefield settings','天候・フィールド・壁はここから変更':'Change weather, terrain and screens here',
'盤面をリセット':'Reset battlefield','攻撃側の詳細設定 ':'Attacker advanced settings ',
'防御側の詳細設定 ':'Defender advanced settings ',
'攻撃・ダメージ補正':'Attack and damage modifiers','攻撃側のHP':'Attacker HP',
'素早さ・行動状態':'Speed and action state','HP・攻撃補正・素早さ':'HP, attack modifiers and Speed',
'ポケモン':'Pokémon','技':'Move','天候':'Weather','フィールド':'Terrain',
'持ち物':'Held item','特性':'Ability','性格':'Nature','タイプ':'Type',
'ダメージ':'Damage','計算結果':'Calculation result','詳細設定':'Advanced settings',
'なし':'None','晴れ':'Sun','雨':'Rain','砂嵐':'Sandstorm','雪':'Snow',
'まもる':'Protect','フレンドガード':'Friend Guard','ワイドフォース':'Expanding Force',
'条件付き威力上昇':'Conditional power boost',
'選択したデータから実数値・タイプ・技を自動反映':'Auto-fill stats, types and moves from selected data',
'公開UI版。内部計算コアはv0.162を基盤に継続改修中':'Public UI release; calculation core based on v0.162',
'計算機の操作':'Calculator navigation','攻撃側と防御側を入れ替える':'Swap attacker and defender',
'天候・フィールド・壁をなしに戻す':'Clear weather, terrain and screens'
};
// Curated bilingual battle names. Display text only: select values and battle IDs stay unchanged.
const battleNames=Object.freeze({
 'リザードン':'Charizard','マフォクシー':'Delphox','ガブリアス':'Garchomp',
 'カイリュー':'Dragonite','バンギラス':'Tyranitar','フシギバナ':'Venusaur',
 'カメックス':'Blastoise','ドラパルト':'Dragapult','サザンドラ':'Hydreigon',
 'ペリッパー':'Pelipper','ブリジュラス':'Archaludon','イッカネズミ':'Maushold',
 'フレンドガード':'Friend Guard','ふゆう':'Levitate','いかく':'Intimidate',
 'てきおうりょく':'Adaptability','マルチスケイル':'Multiscale',
 'こだわりメガネ':'Choice Specs','こだわりハチマキ':'Choice Band',
 'いのちのたま':'Life Orb','きあいのタスキ':'Focus Sash',
 'たべのこし':'Leftovers','オボンのみ':'Sitrus Berry',
 'ワイドフォース':'Expanding Force','じしん':'Earthquake',
 'からげんき':'Facade','10まんボルト':'Thunderbolt',
 'ねっぷう':'Heat Wave','まもる':'Protect'
});
const reverseBattleNames=Object.fromEntries(Object.entries(battleNames).map(([ja,en])=>[en,ja]));
function translateBattleOptions(){
 for(const select of document.querySelectorAll('select')){
  if(select.id==='chloha-locale')continue;
  for(const option of select.options){
   const text=option.textContent, base=reverseBattleNames[text]||text;
   const next=locale==='en'?(battleNames[base]||base):base;
   if(text!==next)option.textContent=next;
  }
 }
}
const reverse=Object.fromEntries(Object.entries(dictionary).map(([a,b])=>[b,a]));
const key='chloha.damageLab.locale';
let locale='ja';try{locale=localStorage.getItem(key)==='en'?'en':'ja';}catch{}
const original=new WeakMap();
function translate(root){
 if(!root||root.nodeType!==1)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())){
  const parent=node.parentElement;
  if(!parent||parent.closest('script,style,textarea,option,[data-no-translate],#battleHistory'))continue;
  const value=node.nodeValue,trim=value.trim();
  if(!trim)continue;
  if(!original.has(node))original.set(node,reverse[trim]||trim);
  const base=original.get(node);
  const next=locale==='en'?(dictionary[base]||base):base;
  if(trim!==next)node.nodeValue=value.replace(trim,next);
 }
 for(const element of [root,...root.querySelectorAll('[title],[aria-label],[placeholder]')]){
  for(const attr of ['title','aria-label','placeholder']){
   if(!element.hasAttribute(attr))continue;
   const value=element.getAttribute(attr);
   const base=reverse[value]||value;
   const next=locale==='en'?(dictionary[base]||base):base;
   if(next!==value)element.setAttribute(attr,next);
  }
 }
}
function setLocale(next){
 locale=next==='en'?'en':'ja';
 document.documentElement.lang=locale;
 try{localStorage.setItem(key,locale);}catch{}
 translate(document.getElementById('app')||document.body);
 translateBattleOptions();
 const select=document.getElementById('chloha-locale');
 if(select)select.value=locale;
}
function initialize(){
 const header=document.querySelector('.lab-header');
 if(!header)return;
 const label=document.createElement('label');
 label.id='chloha-locale-control';
 label.style.cssText='display:inline-flex;align-items:center;gap:6px;margin-left:auto;font-size:12px';
 label.textContent='Language / 言語 ';
 const select=document.createElement('select');
 select.id='chloha-locale';
 select.setAttribute('aria-label','Language / 言語');
 select.style.cssText='width:auto;min-height:36px;padding:5px 8px';
 for(const [value,title] of [['ja','日本語'],['en','English']]){
  const option=document.createElement('option');option.value=value;option.textContent=title;select.append(option);
 }
 select.addEventListener('change',()=>setLocale(select.value));
 label.append(select);
 header.insertBefore(label,header.querySelector('.version'));
 const style=document.createElement('style');
 style.textContent='@media(max-width:550px){.lab-header{flex-wrap:wrap;padding:10px 0}.lab-header .brand{flex:1}.lab-header #chloha-locale-control{margin-left:0}}';
 document.head.append(style);
 setLocale(locale);
 const app=document.getElementById('app');
 if(app){
  const observer=new MutationObserver(records=>{
   for(const record of records)for(const added of record.addedNodes){
    if(added.nodeType===1&&added.id!=='chloha-locale-control')translate(added);
   }
  });
  observer.observe(app,{childList:true,subtree:true});
 }
 window.ChlohaLocale=Object.freeze({get:()=>locale,set:setLocale});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
else initialize();
})();