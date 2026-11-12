/* Damage Lab v0.179: bilingual presentation layer. No calculation inputs or values are modified. */
(()=>{
'use strict';
const dictionary={
'対戦の一手を、確かめる。':'Validate every move.',
"HP・味方支援・素早さ":"HP, ally support and Speed",
"HP・耐久調整":"HP and bulk adjustments",
"防御側の補正・味方支援":"Defensive modifiers and ally support",
"定数ダメージ（ステルスロック・天候・毒など）の自動計算は未対応です。現在HPへ手動で反映してください。":"Residual damage (Stealth Rock, weather, poison, etc.) is not calculated automatically. Adjust current HP manually.",
"入力モード・手動ステータス":"Input mode and manual stats",
"実測ダメージ・盤面の引き継ぎ":"Observed damage and battle-state carryover",
"検証状況・計算モデルの注意":"Verification status and calculation model notes",
"一覧から選ぶ":"Choose from list",
"技一覧から選ぶ":"Choose from move list",
"HP・攻撃補正・素早さ":"HP, attack modifiers and Speed",
"技名・威力・タイプの追加参照：":"Additional move name, power and type reference:",
"能力ポイント方式：各0〜32、合計66以内。空欄は0。自動反映オフでは実数値・タイプ・威力を編集できます。":"Stat points: 0–32 per stat, 66 total maximum. Blank means zero. Disable auto-fill to edit stats, types and power.",
"選択した技の固有効果は手入力でも維持します。技に合う分類・威力・参照能力を確認してください。":"Move-specific effects remain active in manual mode. Check category, power and relevant stat.",
"373件・技335件は候補を含みます。技の習得可否は保証しません。未対応の特性は計算を停止します。複雑な相互作用・テラスタル・実機の丸め順序は未検証です。":"The 373 Pokémon and 335 moves include candidates. Learnsets are unverified. Unsupported abilities stop calculation. Complex interactions, Terastallization and hardware rounding order remain unverified.",
"ポケモン画像：PokeAPI / Pokémon sprites。画像を取得できない場合も計算できます。":"Pokémon images: PokeAPI / Pokémon sprites. Calculations still work if images are unavailable.",
"防御側の詳細設定 ":"Defender advanced settings ",
"攻撃側の詳細設定 ":"Attacker advanced settings ",
"防御側の詳細設定":"Defender advanced settings",
"攻撃側の詳細設定":"Attacker advanced settings",

// v0.179: main calculator labels, controls and result sections.
'ポケモンを検索':'Search Pokémon','技を検索':'Search moves',
'検索':'Search','コピー':'Copy','計算':'Calculate','計算する':'Calculate',
'最大HP':'Max HP','現在HP':'Current HP','HP':'HP','威力':'Power',
'物理':'Physical','特殊':'Special','単体':'Single target','ダブル':'Doubles',
'シングル':'Singles','範囲技':'Spread move','急所':'Critical hit','やけど':'Burn',
'タイプ1':'Type 1','タイプ2':'Type 2','技タイプ':'Move type','技分類':'Move category',
'攻撃側特性':'Attacker ability','防御側特性':'Defender ability',
'防御側・場':'Defender / Field','共通の対戦条件':'Shared battle conditions',
'対戦形式':'Battle format','対象':'Targets','壁':'Screens',
'リフレクター':'Reflect','ひかりのかべ':'Light Screen',
'エレキフィールド':'Electric Terrain','グラスフィールド':'Grassy Terrain',
'ミストフィールド':'Misty Terrain','サイコフィールド':'Psychic Terrain',
'接地':'Grounded','非接地':'Airborne','タイプ・特性から自動':'Auto from type / ability',
'通常タイプから自動':'Auto from types','なし／未適用':'None / Not applied',
'レベル（50固定）':'Level (fixed at 50)','技威力':'Move power',
'攻撃/特攻 実数値':'Attack / Sp. Atk stat',
'防御/特防 実数値':'Defense / Sp. Def stat',
'攻撃側最大HP':'Attacker max HP','攻撃側残りHP':'Attacker remaining HP',
'攻撃側・素早さ実数値':'Attacker Speed stat','防御側・素早さ実数値':'Defender Speed stat',
'攻撃側・素早さランク':'Attacker Speed stage','防御側・素早さランク':'Defender Speed stage',
'防御ランク':'Defense stage','素早さの性格補正':'Speed nature modifier',
'使用能力の性格補正':'Relevant stat nature modifier',
'攻撃側・素早さポイント':'Attacker Speed points',
'防御側・素早さポイント':'Defender Speed points',
'攻撃側・HPポイント':'Attacker HP points','HP能力ポイント':'HP points',
'攻撃側・使用能力ポイント（0〜32）':'Attacker relevant stat points (0–32)',
'防御側・使用能力ポイント（0〜32）':'Defender relevant stat points (0–32)',
'ポケモン・技選択（v0.162）':'Pokémon and move selection (v0.162)',
'ポケモン選択':'Pokémon selection',
'計算モデルの注意':'Calculation model notes','計算トレースを表示':'Show calculation trace',
'検証状況：未実機検証':'Verification status: Not hardware-verified','検証状況':'Verification status','16通りのダメージ':'16 damage rolls',
'技の使用を確定':'Confirm move use','1手戻す':'Undo one turn',
'履歴を消去':'Clear history','実際のダメージ':'Observed damage',
'盤面引き継ぎ（手動確定）':'Carry over battle state (manual confirmation)',
'条件付き威力上昇':'Conditional power boost',
'通常威力で計算中':'Calculating at normal power',
'アイアンローラー：使用確定へ':'Steel Roller: confirm use',
'追加ダメージ倍率（0.01〜10）':'Additional damage multiplier (0.01–10)',
'攻撃側の接地':'Attacker grounding','防御側の接地':'Defender grounding',
'攻撃側まひ（素早さ半減）':'Attacker paralyzed (Speed halved)',
'防御側まひ（素早さ半減）':'Defender paralyzed (Speed halved)',
'攻撃側おいかぜ（素早さ2倍）':'Attacker Tailwind (Speed ×2)',
'防御側おいかぜ（素早さ2倍）':'Defender Tailwind (Speed ×2)',
'てだすけ（味方の支援）':'Helping Hand (ally support)',
'味方のフレンドガード（ダブル最大1匹）':'Ally Friend Guard (max 1 in doubles)',
'シングル（検証用）':'Singles (experimental)',
'範囲技（複数対象）':'Spread move (multiple targets)',
'攻撃側・詳細設定':'Attacker advanced settings',
'防御側・詳細設定':'Defender advanced settings',
'ポケモン・技選択':'Pokémon and move selection',
'技を変更すると初期状態に戻ります。実機未照合。':'Changing the move resets this option. Not hardware-verified.',
'条件成立は手動指定です。チェックONで威力上昇、OFFで通常威力を計算します。':'Set the condition manually. Checked: boosted power; unchecked: normal power.',

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
// One source of truth for battle display names. The battle IDs are never changed.
const optionOriginal=new WeakMap();
const nameGroups=window.ChlohaNames||{};
const entityNames=Object.assign({},...Object.values(nameGroups));
const reverseNames=Object.fromEntries(Object.entries(entityNames).map(([ja,en])=>[en,ja]));
function translateOptions(){
 const root=document.getElementById('app');
 if(!root)return;
 for(const select of root.querySelectorAll('select')){
  if(select.id==='chloha-locale')continue;
  for(const option of select.options){
   if(!optionOriginal.has(option))optionOriginal.set(option,reverseNames[option.textContent]||option.textContent);
   const base=optionOriginal.get(option);
   const next=locale==='en'?(entityNames[base]||base):base;
   if(option.textContent!==next)option.textContent=next;
  }
 }
}

// Runtime output is not always an exact dictionary key.
function translateRuntime(base){
 if(dictionary[base])return dictionary[base];
 if(base.startsWith('検証状況：'))return 'Verification status: '+(dictionary[base.slice(5)]||({'未実機検証':'Not hardware-verified','検証済み':'Verified','要注意':'Caution'}[base.slice(5)]||base.slice(5)));
 if(base.startsWith('入力エラー: '))return 'Input error: '+base.slice(7);
 if(base.startsWith('タイプ相性 ×'))return base.replace('タイプ相性 ×','Type effectiveness ×');
 if(base==='無効')return 'Immune';
 if(base==='確定1発')return 'Guaranteed OHKO';
 if(base==='ひんし（HP 0）')return 'Fainted (0 HP)';
 if(/^\\d+〜\\d+発（目安・回復等なし）$/.test(base))return base.replace('発（目安・回復等なし）',' hits (estimate; no recovery)').replace('〜','–');
 if(base==='2発合計の256通りのダメージ（重複を含む）')return '256 two-hit damage combinations (including duplicates)';
 if(base==='技を選択してください')return 'Select a move';
 if(base.startsWith('選択中：'))return 'Selected: '+base.slice(4).replace('可変','Variable');
 return base;
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
  const cached=original.get(node);
  const cachedRendered=cached===undefined?null:(locale==='en'?translateRuntime(cached):cached);
  // Calculator updates existing text nodes in place; detect new source content.
  if(cached===undefined||(trim!==cached&&trim!==cachedRendered))original.set(node,reverse[trim]||trim);
  const base=original.get(node);
  const next=locale==='en'?translateRuntime(base):base;
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
 translateOptions();

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
   for(const record of records){
    if(record.type==='characterData'){
     const parent=record.target.parentElement;
     if(parent&&!parent.closest('script,style,textarea,option,[data-no-translate],#battleHistory'))translate(parent);
    }
    for(const added of record.addedNodes){
     if(added.nodeType===1&&added.id!=='chloha-locale-control')translate(added);
     else if(added.nodeType===3&&added.parentElement)translate(added.parentElement);
    }
   }
   translateOptions();
  });
  observer.observe(app,{childList:true,characterData:true,subtree:true});
 }
 window.ChlohaLocale=Object.freeze({get:()=>locale,set:setLocale});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
else initialize();
})();