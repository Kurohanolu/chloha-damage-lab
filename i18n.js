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

"選択したポケモンは将来実装用の暫定登録です。種族値・特性などの確認が必要です。":"The selected Pokémon is a provisional entry. Its base stats and abilities require verification.",
"手入力モード：選択した技の固有効果は維持します。値・タイプ・分類・威力は自動更新されません。ボディプレス・イカサマ等では参照能力の実数値を入力してください。":"Manual mode: move-specific effects remain active, but stats, types, category and power are not updated automatically. Enter the relevant stat for Body Press, Foul Play and similar moves.",
"フィールド：接地と威力補正に対応。先制技無効・回復・状態異常・一部技固有変化は未対応です。実機の丸め順序は未照合です。":"Terrain: grounding and power modifiers are supported. Priority immunity, recovery, status and certain move effects are not supported. Hardware rounding remains unverified.",
"アイアンローラー：フィールド存在時のみ計算します。実測ダメージを入力して「技の使用を確定」を押すとフィールドが解除されます。":"Steel Roller: calculation requires active terrain. Enter observed damage and confirm the move to remove terrain.",
"ダブルウイング：各ヒットの16乱数を独立とした256通りでKO率を算出。命中・2発目の特性変化などは未対応です。":"Dual Wingbeat: KO chance uses 256 independent two-hit roll combinations. Accuracy and ability changes before the second hit are unsupported.",
"エレキボールは素早さ比により威力40/60/80/120/150に変化します。まひ・おいかぜ・能力ランク以外の素早さ補正（特性・持ち物・場の効果）は未対応です。":"Electro Ball power changes with Speed ratio (40/60/80/120/150). Speed modifiers other than paralysis, Tailwind and stages are unsupported.",
"確定急所技：急所補正を自動適用します。急所無効特性との相互作用は未対応です。":"Guaranteed-critical moves: critical modifiers apply automatically. Interactions with critical-hit immunity abilities are unsupported.",
"アクロバット：持ち物が「なし／未適用」の場合のみ威力2倍。持ち物を消費した状況は未検証です。":"Acrobatics: power doubles only when held item is None / Not applied. Consumed-item scenarios remain unverified.",
"特性「なし／未適用」は特性効果が存在しないことを保証しません。":"Ability set to None / Not applied does not guarantee that no ability effect exists.",
"タイプ一致補正が手動で無効になっています。":"Same-type attack bonus (STAB) is manually disabled.",
"急所の細かな例外・特性との相互作用は実機未照合です。":"Critical-hit exceptions and ability interactions are not hardware-verified.",
"壁・味方支援・範囲技の複合補正は内部テスト済みですが実機未照合です。":"Combined screen, ally support and spread modifiers passed internal tests but are not hardware-verified.",
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
'天候・フィールド・壁をなしに戻す':'Clear weather, terrain and screens',
'コピーしました':'Copied to clipboard','コピー失敗':'Copy failed',
'手入力モード：実数値・タイプ・威力を編集できます。選択技の固有効果は維持します。':'Manual mode: edit stats, types and power. Selected move effects remain active.',
'入力を確認しました。計算結果を更新しました。':'Inputs validated. Damage results updated.',
'能力':'Stat','ポイント':'Points','性格':'Nature','実数値':'Actual stat',
'攻撃実数値':'Attack stat','防御実数値':'Defense stat','乱数前':'Before random factor',
'現在の盤面':'Current battlefield','種族値':'Base stats',
'確定KO':'Guaranteed KO','乱数KO':'Possible KO','対象外':'N/A',
'入力を確認してください':'Check your inputs',
'有効なダメージ計算結果がありません。':'No valid damage calculation is available.',
'盤面が変更されています。再計算してから確定してください。':'The battle state has changed. Recalculate before confirming.',
'相手は既にひんし状態です。技の使用を確定できません。':'The target has already fainted. Cannot confirm move use.',
'実際のダメージは0〜9999の整数で入力してください。':'Enter observed damage as an integer from 0 to 9999.',
'HPまたはフィールドが手動変更されています。取り消し前に確定直後の状態へ戻すか、履歴を消去してください。':'HP or terrain was changed manually. Restore the state after confirmation or clear history before undoing.',
'直前の1手を取り消しました。':'Undid the previous turn.',
'履歴を消去しました。現在のHP・フィールドは維持しています。':'History cleared. Current HP and terrain were preserved.',
'対象は既にひんし（KO率の算出対象外）':'Target has already fainted (KO probability not applicable)'
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
 if(/^\d+手目：/.test(base))return base.replace(/^(\d+)手目：/,(_,n)=>'Turn '+n+': ').replace(/ \/ (\d+)ダメージ/,(_,n)=>' / '+n+' damage').replace(' / フィールド解除',' / Terrain removed').replace(' / 予測と不一致・要照合',' / Prediction mismatch; verify');
 if(base.startsWith('追加倍率×'))return base.replace('追加倍率×','Additional multiplier ×').replace('を最終ダメージに適用しています。既存補正との二重適用に注意してください。',' is applied to final damage. Avoid double-counting existing modifiers.');
 if(base.startsWith('選択技「'))return base.replace('選択技「','Selected move “').replace('」の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。','”: learnset, effects, variable power and accuracy are unverified. Treat results as provisional until compared against hardware.');
 if(base.startsWith('HP依存威力技：'))return base.replace('HP依存威力技：','HP-dependent move: ').replace('。攻撃側現在HPを変更すると威力が再計算されます。','. Power is recalculated when attacker current HP changes.');
 if(base.startsWith('特殊能力値参照技：'))return base.replace('特殊能力値参照技：','Alternative-stat move: ').replace('。攻撃ランク欄は参照能力のランクとして扱います。','. The Attack stage field represents the relevant stat stage.');
 if(base.startsWith('技監査 '))return base.replace('技監査 ','Move audit ').replace('（自動計算を停止）',' (automatic calculation disabled)');
 if(base.startsWith('検証状況：'))return 'Verification status: '+(dictionary[base.slice(5)]||({'未実機検証':'Not hardware-verified','検証済み':'Verified','要注意':'Caution'}[base.slice(5)]||base.slice(5)));
 if(base.startsWith('入力エラー: '))return 'Input error: '+base.slice('入力エラー: '.length).replace(/現在HP/g,'Current HP').replace(/最大HP/g,'Max HP').replace(/技威力/g,'Move power').replace(/威力/g,'Power').replace(/入力してください/g,'is required').replace(/範囲外/g,'out of range');
 if(base.startsWith('タイプ相性 ×'))return base.replace('タイプ相性 ×','Type effectiveness ×');
 if(/^\d+〜\d+ ダメージ$/.test(base))return base.replace(' ダメージ',' damage').replace('〜','–');
 if(base.startsWith('最大HPの '))return base.replace('最大HPの ','Of max HP: ').replace('〜','–');
 if(base.startsWith('現在の盤面：天候 '))return base.replace('現在の盤面：天候 ','Current battlefield: Weather ').replace(' ／ フィールド ',' / Terrain ').replace(' ／ 壁 ',' / Screen ');
 if(base.includes('を確定。相手HP '))return base.replace('を確定。相手HP ',' confirmed. Target HP ').replace('、フィールド：',', Terrain: ').replace('。予測と不一致です。条件・実測値を記録して照合してください。','. Prediction mismatch. Record and verify conditions and observed damage.');
 if(base.startsWith('種族値 '))return base.replace('種族値 ','Base stat ');
 if(base.startsWith('現在HP '))return base.replace('現在HP ','Current HP ').replace('KO率 ','KO chance ').replace('対象外','N/A');
 if(base.startsWith('現在HPに対する1発KO率: '))return base.replace('現在HPに対する1発KO率: ','OHKO chance against current HP: ');
 if(base.startsWith('能力ポイント '))return base.replace('能力ポイント ','Stat points ').replace('残り','remaining').replace('個体値','IV');
 if(base.startsWith('攻撃実数値: '))return base.replace('攻撃実数値: ','Attack stat: ');
 if(base.startsWith('防御実数値: '))return base.replace('防御実数値: ','Defense stat: ');
 if(base.startsWith('乱数前: '))return base.replace('乱数前: ','Before random factor: ');
 if(base==='無効')return 'Immune';
 if(base==='確定1発')return 'Guaranteed OHKO';
 if(base==='ひんし（HP 0）')return 'Fainted (0 HP)';
 if(/^\d+〜\d+発（目安・回復等なし）$/.test(base))return base.replace('発（目安・回復等なし）',' hits (estimate; no recovery)').replace('〜','–');
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
  if(!parent||parent.closest('script,style,textarea,option,[data-no-translate]'))continue;
  const value=node.nodeValue,trim=value.trim();
  if(!trim)continue;
  const cached=original.get(node);
  const cachedRendered=cached===undefined?null:translateRuntime(cached);
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