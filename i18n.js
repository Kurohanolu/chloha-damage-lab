/* Damage Lab v0.179: bilingual presentation layer. No calculation inputs or values are modified. */
(()=>{
'use strict';
const dictionary={
 '該当する技がありません':'No matching moves',
 '該当するポケモンがありません':'No matching Pokémon',
"アシストパワー／つけあがる：攻撃側能力ランク":"Stored Power / Power Trip: attacker stat stages",
"急所（詳細設定）":"Critical hit (advanced)",
"通常ダメージ":"Normal damage",
"急所ダメージ ×1.5":"Critical hit damage ×1.5",
// Full-screen static Japanese copy audited against pre-script HTML.
"v0.162：373件を登録（未内定・未検証候補を含む）。実機一致は未確認です。":"v0.162: 373 entries registered (including unconfirmed and unverified candidates). Hardware accuracy is unverified.",
"v0.162 Pre-Release 1 — 限定検証用":"v0.162 Pre-Release 1 — Limited testing",
"計算結果はPokémon Champions実機と未照合です。登録373件は候補であり、収録・習得技・ダメージ精度を保証しません。実戦の確定判断には使用しないでください。":"Results have not been fully compared against Pokémon Champions hardware. The 373 entries are candidates; availability, learnsets and damage accuracy are not guaranteed. Do not use for definitive competitive decisions.",
"確認できた実測ダメージは、技・能力値・HP・天候・フィールドなどの条件とともに記録してください。個人情報・アカウントIDは記入不要です。":"Record verified observed damage together with move, stats, HP, weather, terrain and other conditions. Do not include personal information or account IDs.",
"v0.162 検証中":"v0.162 Under verification",
"：登録373件。未内定ポケモンも残す方針です。技習得可否・実機ダメージ一致は未検証です。":": 373 registered entries. Unconfirmed Pokémon remain listed. Learnsets and hardware damage accuracy are unverified.",
"v0.162 開発版・精度未保証":"v0.162 Development build — Accuracy not guaranteed",
"登録373件／技335件。未検証・名簿のみの候補を含みます。技習得可否・特性/道具の全補正・実機ダメージ一致は未検証です。対戦の確定判断に使用しないでください。":"373 Pokémon / 335 moves registered, including unverified candidates and roster-only entries. Learnsets, all ability/item modifiers and hardware accuracy are unverified. Do not use for definitive battle decisions.",
"データ検証状況":"Data verification status",
"登録373件。個別データ照合は未完了。":"373 entries registered. Individual data verification is incomplete.",
"Champions収録一覧（GameWith）":"Champions roster (GameWith)",
"収録データは継続照合中です。":"Roster data verification is ongoing.",
"特殊連続技の命中率は各回90%を基準に計算しています。命中・回避ランクや命中率補正アイテム・特性は未対応です。":"Each hit of this special multi-hit move uses 90% base accuracy. Accuracy/evasion stages and modifiers from items or abilities are unsupported.",
"ふくろだたきは入力された参加ポケモンの攻撃種族値で各ヒットを算出。参加可否は手動指定で、ヒット別急所・耐久特性・追加効果は未検証です。":"Beat Up calculates each hit from the entered participants' base Attack stats. Eligibility is manual; per-hit critical hits, defensive abilities and secondary effects are unverified.",
"実測ダメージを確認し「技の使用を確定」を押してください。フィールド解除は確定時に反映されます。":"Check the observed damage and select Confirm move use. Terrain removal is applied on confirmation.",
"攻守を入れ替えたため履歴を消去しました。":"Battle history cleared because attacker and defender were swapped.",
"天候・フィールド・壁を「なし」に戻しました。対戦形式・その他の設定は維持します。":"Weather, terrain and screens were reset to None. Battle format and other settings were preserved.",
"この実数値は現在の性格・ポイント0〜32では設定できません。「入力モード」で自動反映をオフにすると手入力できます。":"This stat value cannot be reached with the current nature and 0–32 points. Disable auto-fill in Input mode to enter it manually.",
"攻守を入れ替えました。技・天候・フィールド・壁は維持します。移動先で未対応の特性・持ち物は計算を停止します。":"Attacker and defender swapped. Move, weather, terrain and screens were preserved. Calculation stops if an unsupported ability or item is selected.",
"習得可否は未検証。計算は対応技のみ。":"Learnsets are unverified. Only supported moves can be calculated.",
"Pokémon Champions向け計算機・検証版（実測一致未保証）":"Pokémon Champions damage calculator — experimental build (hardware accuracy unverified)",
"検証用エンジンです。Championsの能力ポイント方式に対応しましたが、ダメージ計算の実測一致は未確認です。未実装の特性・技・持ち物もあります。競技上の判断には使用しないでください。":"Experimental engine. Champions stat-point allocation is supported, but damage accuracy has not been fully verified on hardware. Some abilities, moves and items remain unsupported. Do not rely on this tool for definitive competitive decisions.",
"登録373件の候補を維持。未照合データも含むため、実機一致は保証しません。他の未検証フォルムは引き続き要照合。技候補の習得可否は未検証です。技の習得を保証しません。Lv50・個体値31固定、能力ポイント（各0〜32、合計66以内）から実数値を算出します。":"The 373 candidate entries include unverified data; hardware accuracy is not guaranteed. Additional forms require verification. Move learnsets are provisional and not guaranteed. Level 50 and IV 31 are fixed; actual stats are calculated from stat points (0–32 each, up to 66 total).",
"⚔ 攻撃側":"⚔ Attacker",
"🛡 防御側":"🛡 Defender",
"イカサマ用・相手の攻撃ポイント":"Target Attack points for Foul Play",
"相手の攻撃の性格補正":"Target Attack nature modifier",
"※表示していない能力への配分は省略しています。入力済みポイントの合計が66を超えないことを検証します。空欄は0として計算します。性格補正は各欄の参照能力だけに適用します。ただし合計66ポイントの範囲内で配分してください。":"Points for unshown stats are omitted. The entered total must not exceed 66. Blank fields count as zero. Nature modifiers apply only to the referenced stat in each field. Keep all allocations within 66 points.",
"※特性は選択式ですが、自動計算できるものは限定的です。未対応特性を選ぶと計算を停止します。メガシンカも別フォルムとして手動選択。ドータクン・ポリゴン2・ポリゴンZは将来実装用の暫定登録です。全技を選択できますが、技候補は暫定リストであり、Championsでの習得可否は未検証です。一部の技固有効果に対応していますが、命中・追加効果は未対応です。こだわり系の技固定・とつげきチョッキの変化技制限は計算対象外です。計算結果は監査・実測照合前の参考値です。":"Ability selection is available, but automatic calculations support only a subset. Unsupported abilities stop calculation. Mega Evolutions must be selected as separate forms. Bronzong, Porygon2 and Porygon-Z are provisional future entries. All moves can be selected, but learnsets in Champions are unverified. Some move-specific effects are supported; accuracy and secondary effects are not. Choice-item move locking and Assault Vest status-move restrictions are not simulated. Results are provisional pending audit and hardware comparison.",
"天候とフィールドは両側の共通条件です。接地条件を確認してください。フィールドの威力補正とミストのドラゴン半減に対応。先制技の無効化・状態異常防止・回復・技ごとの特殊変化（だいちのはどう等）は未対応です。":"Weather and terrain are shared by both sides. Verify grounding. Terrain power modifiers and Misty Terrain's Dragon damage reduction are supported. Priority immunity, status prevention, recovery and certain move-specific terrain effects (e.g. Terrain Pulse) are unsupported.",
"追加倍率は最終ダメージに適用します。既存の道具・特性・天候補正と重複しないよう入力してください。":"Additional multiplier applies to final damage. Avoid duplicating existing item, ability or weather modifiers.",
"参照能力ランク（ボディプレスは自分の防御、イカサマは相手の攻撃）":"Referenced stat stage (own Defense for Body Press; target Attack for Foul Play)",
"いかさまダイス（連続技4〜5回）":"Loaded Dice (4–5 hits)",
"いのちのたま（ダメージ×1.3）":"Life Orb (damage ×1.3)",
"こだわりハチマキ（物理攻撃×1.5）":"Choice Band (physical Attack ×1.5)",
"こだわりメガネ（特殊攻撃×1.5）":"Choice Specs (special Attack ×1.5)",
"たつじんのおび（効果抜群時×1.2）":"Expert Belt (super-effective damage ×1.2)",
"🛡 防御側・場":"🛡 Defender / Field",
"とつげきチョッキ（特防×1.5）":"Assault Vest (Sp. Def ×1.5)",
"1匹":"1 ally",
"てだすけとフレンドガードは明示的な味方支援として入力します。ダブルでのフレンドガードは最大1匹、範囲技補正は複数対象の場合のみ適用します。いかくは攻撃ランクに反映してください（自動発動は未対応）。特性・持ち物は限定的な実装です。こだわり系の技固定・とつげきチョッキの変化技制限は計算対象外です。一部技固有効果を除き、複雑な特性の相互作用、テラスタルは非対応です。防御特性は発動条件が明確な一部のみ対応します。":"Helping Hand and Friend Guard must be entered explicitly as ally support. In doubles, at most one Friend Guard ally is supported; spread reduction applies only when multiple targets are present. Reflect Intimidate in the Attack stage (automatic activation unsupported). Ability and item support is limited. Choice-item move locking and Assault Vest status-move restrictions are not simulated. Complex ability interactions and Terastallization are unsupported except for certain move-specific effects. Only some defensive abilities with explicit activation conditions are supported.",
"計算結果を確認後、実際に出たダメージを入力して確定。相手HPとフィールドを次の計算へ引き継ぎます。":"After reviewing the result, enter and confirm the actual damage dealt. The target's remaining HP and terrain carry over to the next calculation.",
"Chloha Official Sites — 非公式検証ツール。入力はブラウザ内で処理されます。":"Chloha Official Sites — Unofficial experimental tool. Inputs are processed in your browser.",
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
'どく／もうどく（どくぼうそう）':'Poisoned / badly poisoned (Toxic Boost)',
'もらいび発動済み（ほのお技を受けた）':'Flash Fire activated (hit by a Fire move)',
'ねつこうかん発動済み（攻撃+1）':'Thermal Exchange activated (Attack +1)',
'いかりのつぼ発動済み（攻撃+6）':'Anger Point activated (Attack +6)',
'びびり発動済み（素早さ+1・ダメージ補正なし）':'Rattled activated (Speed +1; no direct damage boost)',
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
'味方のバッテリー（特殊技×1.3）':'Ally Battery (special damage ×1.3)',
'味方のパワースポット（技×1.3）':'Ally Power Spot (damage ×1.3)',
'そうだいしょう：ひんしになった味方の数（0〜5）':'Supreme Overlord: fainted allies (0–5)',
'相手がこのターン交代で出てきた（はりこみ）':'Target switched in this turn (Stakeout)',
'味方に反対の特性（プラス／マイナス）がいる':'Ally has opposite ability (Plus / Minus)',
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
// The PokeAPI catalog uses canonical species IDs, while our calculator roster
// also uses legacy IDs. Resolve exact Japanese names without guessing forms.
// Form names are derived from verified base-species translations. They are
// provisional until individual form spellings are checked against official UI.
function localizedMegaForm(id,ja,locale){
 const form=window.ChlohaFormSpeciesBases?.[id];
 const base=form?.base?.[locale];
 if(!base)return null;
 const suffix=/[XY]$/.exec(ja)?.[0]||'';
 const prefix={en:'Mega ',fr:'Méga-',de:'Mega-',es:'Mega-',it:'Mega ',
  ko:'메가','zh-Hans':'超级','zh-Hant':'超級'}[locale];
 return prefix?prefix+base+suffix:null;
}
// For forms absent from the exact-name catalog, retain the verified localized
// base species name and a transparent provisional form descriptor.
function localizedProvisionalForm(id,ja,locale){
 const entry=window.ChlohaFormSpeciesBases?.[id];
 const base=entry?.base?.[locale];
 if(!base)return null;
 if(/^メガ/.test(ja))return localizedMegaForm(id,ja,locale);
 const prefix=[
  ['ヒスイ',{en:'Hisuian ',fr:'Hisui ',de:'Hisui-',es:'Hisui ',it:'Hisui ',ko:'히스이 ','zh-Hans':'洗翠','zh-Hant':'洗翠'}],
  ['アローラ',{en:'Alolan ',fr:'Alola ',de:'Alola-',es:'Alola ',it:'Alola ',ko:'알로라 ','zh-Hans':'阿罗拉','zh-Hant':'阿羅拉'}],
  ['ガラル',{en:'Galarian ',fr:'Galar ',de:'Galar-',es:'Galar ',it:'Galar ',ko:'가라르 ','zh-Hans':'伽勒尔','zh-Hant':'伽勒爾'}],
  ['パルデア',{en:'Paldean ',fr:'Paldea ',de:'Paldea-',es:'Paldea ',it:'Paldea ',ko:'팔데아 ','zh-Hans':'帕底亚','zh-Hant':'帕底亞'}]
 ].find(([jaPrefix])=>ja.startsWith(jaPrefix));
 if(prefix)return (prefix[1][locale]||prefix[1].en)+base;
 const suffix=ja.slice(entry.baseJa.length).replace(/^\(|^（/,'').replace(/\)|）$/,'');
 if(!suffix)return base;
 // German appliance Rotom forms use the form descriptor before the species name.
 if(locale==='de'&&entry.baseJa==='ロトム'&&suffix==='フロスト')return 'Frost-Rotom';
 const formLabels={
  'オス':{en:'Male',fr:'Mâle',de:'Männlich',es:'Macho',it:'Maschio',ko:'수컷','zh-Hans':'雄性','zh-Hant':'雄性'},
  'メス':{en:'Female',fr:'Femelle',de:'Weiblich',es:'Hembra',it:'Femmina',ko:'암컷','zh-Hans':'雌性','zh-Hant':'雌性'},
  'ウォッシュ':{en:'Wash',fr:'Lavage',de:'Wasch',es:'Lavado',it:'Lavaggio',ko:'워시','zh-Hans':'清洗','zh-Hant':'清洗'},
  'ヒート':{en:'Heat',fr:'Chaleur',de:'Hitze',es:'Calor',it:'Calore',ko:'히트','zh-Hans':'加热','zh-Hant':'加熱'},
  'カット':{en:'Mow',fr:'Tonte',de:'Schneid',es:'Corte',it:'Taglio',ko:'커트','zh-Hans':'切割','zh-Hant':'切割'},
  'フロスト':{en:'Frost',fr:'Gel',de:'Frost',es:'Frío',it:'Gelo',ko:'프로스트','zh-Hans':'结冰','zh-Hant':'結冰'},
  'スピン':{en:'Fan',fr:'Hélice',de:'Wirbel',es:'Ventilador',it:'Ventola',ko:'스핀','zh-Hans':'旋转','zh-Hant':'旋轉'},
  'シールド':{en:'Shield',fr:'Bouclier',de:'Schild',es:'Escudo',it:'Scudo',ko:'실드','zh-Hans':'盾牌','zh-Hant':'盾牌'},
  'ブレード':{en:'Blade',fr:'Lame',de:'Klinge',es:'Filo',it:'Lama',ko:'블레이드','zh-Hans':'刀剑','zh-Hant':'刀劍'}
 };
 const additionalFormLabels={
 'ハイ':{en:'Amped',fr:'Aiguë',de:'Hoch',es:'Aguda',it:'Forma acuta',ko:'하이','zh-Hans':'高调','zh-Hant':'高調'},
 'ロー':{en:'Low Key',fr:'Grave',de:'Tief',es:'Grave',it:'Forma grave',ko:'로우','zh-Hans':'低调','zh-Hant':'低調'},
 'グリーン':{en:'Green',fr:'Vert',de:'Grün',es:'Verde',it:'Verde',ko:'그린','zh-Hans':'绿色','zh-Hant':'綠色'},
 'ブルー':{en:'Blue',fr:'Bleu',de:'Blau',es:'Azul',it:'Blu',ko:'블루','zh-Hans':'蓝色','zh-Hant':'藍色'},
 'イエロー':{en:'Yellow',fr:'Jaune',de:'Gelb',es:'Amarillo',it:'Giallo',ko:'옐로','zh-Hans':'黄色','zh-Hant':'黃色'},
 'ホワイト':{en:'White',fr:'Blanc',de:'Weiß',es:'Blanco',it:'Bianco',ko:'화이트','zh-Hans':'白色','zh-Hant':'白色'}
 };
 const desc=(formLabels[suffix]||additionalFormLabels[suffix])?.[locale]||(formLabels[suffix]||additionalFormLabels[suffix])?.en;
 return desc?base+' ('+desc+')':null;
}
const pokemonByJapanese=new Map(Object.values(window.ChlohaPokeAPILocalizedNames?.pokemon||{})
 .filter(entry=>entry?.ja)
 .map(entry=>[entry.ja,entry]));
const nameGroups=window.ChlohaNames||{};
const entityNames=Object.assign({},...Object.values(nameGroups));
const reverseNames=Object.fromEntries(Object.entries(entityNames).map(([ja,en])=>[en,ja]));
const nativeOptionTranslations={
 "接地":{"en":"Grounded","fr":"Au sol","de":"Am Boden","es":"En el suelo","it":"A terra","ko":"지면에 있음","zh-Hans":"接地","zh-Hant":"接地"},
 "非接地":{"en":"Airborne","fr":"En l’air","de":"In der Luft","es":"En el aire","it":"In aria","ko":"공중에 있음","zh-Hans":"未接地","zh-Hant":"未接地"},
 "単体":{"en":"Single target","fr":"Cible unique","de":"Einzelziel","es":"Objetivo único","it":"Bersaglio singolo","ko":"단일 대상","zh-Hans":"单一目标","zh-Hant":"單一目標"},
 "範囲技（複数対象）":{"en":"Spread move (multiple targets)","fr":"Capacité de zone (plusieurs cibles)","de":"Flächenattacke (mehrere Ziele)","es":"Movimiento de área (varios objetivos)","it":"Mossa ad area (più bersagli)","ko":"범위 기술 (여러 대상)","zh-Hans":"范围招式（多个目标）","zh-Hant":"範圍招式（多個目標）"},
 "1匹":{"en":"1 ally","fr":"1 allié","de":"1 Verbündeter","es":"1 aliado","it":"1 alleato","ko":"아군 1마리","zh-Hans":"1名队友","zh-Hant":"1名隊友"},

 "選択した相手に2回命中":{"en":"2 hits on selected target","fr":"2 coups sur la cible choisie","de":"2 Treffer auf das gewählte Ziel","es":"2 golpes al objetivo seleccionado","it":"2 colpi sul bersaglio scelto","ko":"선택한 대상에게 2회 명중","zh-Hans":"对选定目标命中2次","zh-Hant":"對選定目標命中2次"},
 "選択した相手に1回命中":{"en":"1 hit on selected target","fr":"1 coup sur la cible choisie","de":"1 Treffer auf das gewählte Ziel","es":"1 golpe al objetivo seleccionado","it":"1 colpo sul bersaglio scelto","ko":"선택한 대상에게 1회 명중","zh-Hans":"对选定目标命中1次","zh-Hant":"對選定目標命中1次"},
 "補正なし（1.0倍）":{"en":"Neutral (1.0×)","fr":"Neutre (×1,0)","de":"Neutral (×1,0)","es":"Neutra (×1,0)","it":"Neutra (×1,0)","ko":"무보정 (1.0배)","zh-Hans":"无修正（1.0倍）","zh-Hant":"無修正（1.0倍）"},
 "半減きのみ（技タイプに自動対応）":{"en":"Resistance Berry (auto-matched to move type)","fr":"Baie de résistance (selon le type de capacité)","de":"Resistenzbeere (automatisch nach Attackentyp)","es":"Baya reductora (según el tipo del movimiento)","it":"Bacca riduzione danni (in base al tipo della mossa)","ko":"반감열매 (기술 타입에 자동 대응)","zh-Hans":"抗性树果（自动匹配招式属性）","zh-Hant":"抗性樹果（自動匹配招式屬性）"},
 "フラエッテ(えいえんのはな)":{"en":"Floette (Eternal Flower)","fr":"Floette (Fleur Éternelle)","de":"Floette (Ewigblütler)","es":"Floette (Flor Eterna)","it":"Floette (Fiore Eterno)","ko":"플라엣테 (영원의 꽃)","zh-Hans":"花叶蒂（永恒之花）","zh-Hant":"花葉蒂（永恆之花）"},
 "イルカマン(ナイーブ)":{"en":"Palafin (Zero Form)","fr":"Superdofin (Forme Ordinaire)","de":"Delfinator (Alltagsform)","es":"Palafin (Forma Ingenua)","it":"Palafin (Forma Ingenua)","ko":"돌핀맨 (나이브폼)","zh-Hans":"海豚侠（全能形态前）","zh-Hant":"海豚俠（全能形態前）"},
 "イルカマン(マイティ)":{"en":"Palafin (Hero Form)","fr":"Superdofin (Forme Héroïque)","de":"Delfinator (Heldenform)","es":"Palafin (Forma Heroica)","it":"Palafin (Forma Possente)","ko":"돌핀맨 (마이티폼)","zh-Hans":"海豚侠（全能形态）","zh-Hant":"海豚俠（全能形態）"},

 'まひ':{en:'Paralysis',fr:'Paralysie',de:'Paralyse',es:'Parálisis',it:'Paralisi',ko:'마비','zh-Hans':'麻痹','zh-Hant':'麻痺'},
 'ねむり':{en:'Sleep',fr:'Sommeil',de:'Schlaf',es:'Dormido',it:'Sonno',ko:'잠듦','zh-Hans':'睡眠','zh-Hant':'睡眠'},
 'コンバット種（かくとう）':{en:'Combat Breed (Fighting)',fr:'Race Combative (Combat)',de:'Kampf-Form (Kampf)',es:'Raza Combatiente (Lucha)',it:'Razza Combattiva (Lotta)',ko:'컴뱃종 (격투)','zh-Hans':'斗战种（格斗）','zh-Hant':'鬥戰種（格鬥）'},
 'ブレイズ種（ほのお）':{en:'Blaze Breed (Fire)',fr:'Race Flamboyante (Feu)',de:'Flammen-Form (Feuer)',es:'Raza Ardiente (Fuego)',it:'Razza Infuocata (Fuoco)',ko:'블레이즈종 (불꽃)','zh-Hans':'火炽种（火）','zh-Hant':'火熾種（火）'},
 'ウォーター種（みず）':{en:'Aqua Breed (Water)',fr:'Race Aquatique (Eau)',de:'Wasser-Form (Wasser)',es:'Raza Acuática (Agua)',it:'Razza Acquatica (Acqua)',ko:'워터종 (물)','zh-Hans':'水澜种（水）','zh-Hant':'水瀾種（水）'},
 'まんぷくもよう（でんき）':{en:'Full Belly Mode (Electric)',fr:'Mode Rassasié (Électrik)',de:'Pappsatt-Modus (Elektro)',es:'Modo Saciado (Eléctrico)',it:'Motivo Pancia Piena (Elettro)',ko:'배부른 모양 (전기)','zh-Hans':'满腹花纹（电）','zh-Hant':'滿腹花紋（電）'},
 'はらぺこもよう（あく）':{en:'Hangry Mode (Dark)',fr:'Mode Affamé (Ténèbres)',de:'Kohldampf-Modus (Unlicht)',es:'Modo Voraz (Siniestro)',it:'Motivo Pancia Vuota (Buio)',ko:'배고픈 모양 (악)','zh-Hans':'空腹花纹（恶）','zh-Hant':'空腹花紋（惡）'}
};
const selectLabels={
 'コンバット種（かくとう）':'Combat Breed (Fighting)',
 'ブレイズ種（ほのお）':'Blaze Breed (Fire)',
 'ウォーター種（みず）':'Aqua Breed (Water)',
 'まんぷくもよう（でんき）':'Full Belly Mode (Electric)',
 'はらぺこもよう（あく）':'Hangry Mode (Dark)',
 '選択した相手に2回命中':'2 hits on selected target',
 '選択した相手に1回命中':'1 hit on selected target',
 'なし':'None','晴れ':'Sun','雨':'Rain','砂嵐':'Sandstorm','雪':'Snow',
 'エレキフィールド':'Electric Terrain','グラスフィールド':'Grassy Terrain','ミストフィールド':'Misty Terrain','サイコフィールド':'Psychic Terrain',
 'リフレクター':'Reflect','ひかりのかべ':'Light Screen','ダブル':'Doubles','シングル（検証用）':'Singles (testing only)',
 'とつげきチョッキ（特防×1.5）':'Assault Vest (Sp. Def ×1.5)',
 'なし／未適用':'None',
 'すなおこし（未対応）':'Sand Stream (unsupported)',
 'きんちょうかん（未対応）':'Unnerve (unsupported)',
 'ダブル':'Doubles','シングル':'Singles',
 'シングル（検証用）':'Singles (testing only)',
 '通常タイプから自動':'Automatic from types',
 'タイプ・特性から自動':'Automatic from type and ability',
 '接地':'Grounded','非接地':'Airborne',
 '単体':'Single target','範囲技（複数対象）':'Spread move (multiple targets)',
 '1匹':'1 ally',
 'いのちのたま（ダメージ×1.3）':'Life Orb (damage ×1.3)',
 'こだわりハチマキ（物理攻撃×1.5）':'Choice Band (Attack ×1.5)',
 'こだわりメガネ（特殊攻撃×1.5）':'Choice Specs (Sp. Atk ×1.5)',
 'たつじんのおび（効果抜群時×1.2）':'Expert Belt (super-effective ×1.2)',
 'とつげきチョッキ（特防×1.5）':'Assault Vest (Sp. Def ×1.5)',

 '補正＋（1.1倍）':'Positive (1.1×)','補正なし（1.0倍）':'Neutral (1.0×)','補正－（0.9倍）':'Negative (0.9×)'
};
const attributeLabels={
 '名前を入力して選択':'Type a name to select',
 '例：じしん、10まんボルト':'e.g. Earthquake, Thunderbolt',
 '例：じしん、10まんボルト':'e.g. Earthquake, Thunderbolt'
};
const originalAttributes=new WeakMap();
const lastRenderedAttributes=new WeakMap();
function translateAccessibilityLabel(base){
 if(Object.prototype.hasOwnProperty.call(attributeLabels,base))return attributeLabels[base];
 base=translateRuntime(base);
 if(base==='例：Earthquake、10まんボルト')return 'e.g. Earthquake, Thunderbolt';
 const overview=base.match(/^(Attacker|Defender)の6(?:能力値|stat points)$/);
 if(overview)return overview[1]+' six stats';
 const edit=base.match(/^(Attacker|Defender) (.+?) (\d+)ポイント。編集する$/);
 if(edit)return edit[1]+' '+edit[2]+' '+edit[3]+' points. Edit';
 if(base==='計算結果の要約')return 'Damage calculation summary';
 return attributeLabels[base]||dictionary[base]||translateRuntime(base);
}

function translateOptions(){
 const root=document.getElementById('app');
 if(!root)return;
 // Legacy move-form selectors live outside #app; include them in native option localization.
 const selects=[...document.querySelectorAll('select')];
 for(const select of selects){
  if(select.id==='chloha-locale')continue;
  for(const option of select.options){
   if(!optionOriginal.has(option))optionOriginal.set(option,reverseNames[option.textContent]||option.textContent);
   const base=optionOriginal.get(option);
   const ability=base.match(/^(.+?)（(一部技のみ対応|対応|効果未対応|未対応)）$/);
   const abilityEnglish={'トランジスタ':'Transistor','りゅうのあぎと':"Dragon's Maw",'アナライズ':'Analytic','すてみ':'Reckless','ねつぼうそう':'Flare Boost','どくぼうそう':'Toxic Boost','すりぬけ':'Infiltrator','ねつこうかん':'Thermal Exchange','いかりのつぼ':'Anger Point','びびり':'Rattled','あめふらし':'Drizzle','ひでり':'Drought','すなおこし':'Sand Stream','ゆきふらし':'Snow Warning','エレキメイカー':'Electric Surge','グラスメイカー':'Grassy Surge','ミストメイカー':'Misty Surge','サイコメイカー':'Psychic Surge','きもったま':'Scrappy','ほのおのたてがみ':'Fire Mane','もらいび':'Flash Fire','すいほう':'Water Bubble','よわき':'Defeatist','ひひいろのこどう':'Orichalcum Pulse','ハドロンエンジン':'Hadron Engine','フェアリーオーラ':'Fairy Aura','ダークオーラ':'Dark Aura','オーラブレイク':'Aura Break','はがねのせいしん':'Steely Spirit','プラス':'Plus','マイナス':'Minus','スナイパー':'Sniper','ブレインフォース':'Neuroforce','はりこみ':'Stakeout','そうだいしょう':'Supreme Overlord','バッテリー':'Battery','パワースポット':'Power Spot','かたいツメ':'Tough Claws','はがねつかい':'Steelworker','いわはこび':'Rocky Payload','すなのちから':'Sand Force','パンクロック':'Punk Rock','フェアリースキン':'Pixilate','スカイスキン':'Aerilate','フリーズスキン':'Refrigerate','エレキスキン':'Galvanize','ドラゴンスキン':'Dragonize','ノーマルスキン':'Normalize','しんりょく':'Overgrow','もうか':'Blaze','げきりゅう':'Torrent','むしのしらせ':'Swarm'};
   const move=base.match(/^(.+?)（([^（）]+) \/ ([^（）]+)）(［[^］]+］)$/);
   const moveStatuses={'［計算未対応］':' [Unsupported]','［基本ダメージのみ・実機未照合］':' [Basic damage only; unverified]','［計算試算・実機未照合］':' [Estimated; unverified]'};
   const typeNames={'ノーマル':'Normal','ほのお':'Fire','みず':'Water','でんき':'Electric','くさ':'Grass','こおり':'Ice','かくとう':'Fighting','どく':'Poison','じめん':'Ground','ひこう':'Flying','エスパー':'Psychic','むし':'Bug','いわ':'Rock','ゴースト':'Ghost','ドラゴン':'Dragon','あく':'Dark','はがね':'Steel','フェアリー':'Fairy'};
   const berryType={chilanBerry:'Normal',occaBerry:'Fire',passhoBerry:'Water',wacanBerry:'Electric',rindoBerry:'Grass',yacheBerry:'Ice',chopleBerry:'Fighting',kebiaBerry:'Poison',shucaBerry:'Ground',cobaBerry:'Flying',payapaBerry:'Psychic',tangaBerry:'Bug',chartiBerry:'Rock',kasibBerry:'Ghost',habanBerry:'Dragon',colburBerry:'Dark',babiriBerry:'Steel',roseliBerry:'Fairy'}[option.value];
   const berryJapanese=berryType&&base.match(/^(.+?)（[^（）]+技半減）$/);
   const berryEnglish=berryJapanese&&((window.ChlohaNames?.items?.[berryJapanese[1]])||entityNames[berryJapanese[1]]);
   const autoBerryEnglish=select.id==='defItem'&&option.value==='autoResistBerry'?'Resist Berry (auto-matches move type)':null;
   const plateJapanese=select.id==='attItem'&&base.match(/^(.+プレート)（([^（）]+)技×1\.2）$/);
   const plateEnglish=plateJapanese&&((window.ChlohaNames?.items?.[plateJapanese[1]])||entityNames[plateJapanese[1]]);
   const plateLabel=plateEnglish?plateEnglish+' ('+(typeNames[plateJapanese[2]]||plateJapanese[2])+' moves ×1.2)':null;
   // Localize every Plate and resistance Berry by canonical Japanese item name
   // plus the localized type; avoid English-only effect suffixes.
   const itemDictionary=window.ChlohaPokeAPILocalizedNames?.items||{};
   const plateName=plateJapanese&&itemDictionary[plateJapanese[1]]?.[locale];
   const berryName=berryJapanese&&itemDictionary[berryJapanese[1]]?.[locale];
   const plateType=plateJapanese&&localizedPokemonType(plateJapanese[2],locale);
   const berryTypeLocalized=berryJapanese&&localizedPokemonType(
    Object.keys(berryType).length?Object.entries(typeNames).find(([,en])=>en===berryType)?.[0]:null,locale);
   const itemEffectSuffix={
    fr:[' (capacités ',' ×1,2)',' (dégâts ',' ×0,5)'],
    de:[' (','-Attacken ×1,2)',' (','-Schaden ×0,5)'],
    es:[' (movimientos ',' ×1,2)',' (daño de ',' ×0,5)'],
    it:[' (mosse ',' ×1,2)',' (danni ',' ×0,5)'],
    ko:[' (','타입 기술 ×1.2)',' (','타입 기술 데미지 ×0.5)'],
    'zh-Hans':['（','属性招式×1.2）','（','属性伤害×0.5）'],
    'zh-Hant':['（','屬性招式×1.2）','（','屬性傷害×0.5）']
   }[locale];
   const localizedPlate=plateName&&plateType&&itemEffectSuffix?
    plateName+itemEffectSuffix[0]+plateType+itemEffectSuffix[1]:null;
   const localizedBerry=berryName&&berryTypeLocalized&&itemEffectSuffix?
    berryName+itemEffectSuffix[2]+berryTypeLocalized+itemEffectSuffix[3]:null;
   const pokemonOption=/^db(?:Att|Def)Pokemon$/.test(select.id);
   const pokemonEnglish=pokemonOption?nameGroups.pokemon?.[option.value]:null;
   const typeEnglish=typeNames[base];
   const englishOption=plateLabel||autoBerryEnglish||(berryEnglish?berryEnglish+' ('+berryType+' damage ×0.5)':null)||pokemonEnglish||typeEnglish||(ability
    ? (abilityEnglish[ability[1]]||entityNames[ability[1]]||dictionary[ability[1]]||translateRuntime(ability[1]))+
      (ability[2]==='対応'?' (supported)':ability[2]==='一部技のみ対応'?' (partially supported)':' (unsupported)')
    : move
     ? (entityNames[move[1]]||move[1])+' ('+(typeNames[move[2]]||move[2])+' / '+(move[3]==='可変'?'Variable':move[3])+')'+(moveStatuses[move[4]]||move[4])
     : (selectLabels[base]||entityNames[base]||dictionary[base]||translateRuntime(base)));
   const localizedEntity=window.ChlohaLocalizedNames?.[pokemonOption?'pokemon':/ability/i.test(select.id)?'abilities':/item/i.test(select.id)?'items':'moves']?.[pokemonOption?option.value:base]?.[locale]||window.ChlohaPokeAPILocalizedNames?.[pokemonOption?'pokemon':/ability/i.test(select.id)?'abilities':/item/i.test(select.id)?'items':'moves']?.[pokemonOption?option.value:base]?.[locale]||(pokemonOption?pokemonByJapanese.get(base)?.[locale]:null)
    ||(pokemonOption?localizedProvisionalForm(option.value,base,locale):null);
   const abilityStatusLabels={
    fr:[' (pris en charge)',' (partiellement pris en charge)',' (non pris en charge)'],
    de:[' (unterstützt)',' (teilweise unterstützt)',' (nicht unterstützt)'],
    es:[' (compatible)',' (parcialmente compatible)',' (no compatible)'],
    it:[' (supportata)',' (parzialmente supportata)',' (non supportata)'],
    ko:[' (지원)',' (일부 지원)',' (미지원)'],
    'zh-Hans':['（支持）','（部分支持）','（不支持）'],
    'zh-Hant':['（支援）','（部分支援）','（不支援）']
   };
   const abilityName=ability&&(window.ChlohaLocalizedNames?.abilities?.[ability[1]]?.[locale]||window.ChlohaPokeAPILocalizedNames?.abilities?.[ability[1]]?.[locale]||abilityEnglish[ability[1]]||entityNames[ability[1]]||translateRuntime(ability[1]));
   const abilityStatus=ability&&(ability[2]==='対応'?0:ability[2]==='一部技のみ対応'?1:2);
   const localizedAbility=ability&&abilityName+(abilityStatusLabels[locale]?.[abilityStatus]||'');
   const moveName=move&&(window.ChlohaLocalizedNames?.moves?.[move[1]]?.[locale]||window.ChlohaPokeAPILocalizedNames?.moves?.[move[1]]?.[locale]||entityNames[move[1]]||move[1]);
   const moveStatusLocalized={
    '［計算未対応］':{fr:' [Non pris en charge]',de:' [Nicht unterstützt]',es:' [No compatible]',it:' [Non supportato]',ko:' [미지원]','zh-Hans':'［暂不支持］','zh-Hant':'［暫不支援］'},
    '［基本ダメージのみ・実機未照合］':{fr:' [Dégâts de base uniquement ; non vérifié]',de:' [Nur Grundschaden; ungeprüft]',es:' [Solo daño básico; sin verificar]',it:' [Solo danno base; non verificato]',ko:' [기본 데미지만; 미검증]','zh-Hans':'［仅基础伤害；未经验证］','zh-Hant':'［僅基礎傷害；未經驗證］'},
    '［計算試算・実機未照合］':{fr:' [Estimation ; non vérifiée]',de:' [Schätzung; ungeprüft]',es:' [Estimado; sin verificar]',it:' [Stima; non verificata]',ko:' [추정치; 미검증]','zh-Hans':'［估算；未经验证］','zh-Hant':'［估算；未經驗證］'}
   };
   const moveType=localizedTypeNames[move?.[2]]?.[locale]||typeNames[move?.[2]]||move?.[2];
   const localizedMove=move&&moveName+' ('+moveType+' / '+(move[3]==='可変'?(localeUiPhrases['Variable']?.[locale]||'Variable'):move[3])+')'+(moveStatusLocalized[move[4]]?.[locale]||moveStatuses[move[4]]||move[4]);
   const next=locale==='ja'?base:(nativeOptionTranslations[base]?.[locale]||null)|| (locale==='en'?englishOption:(localizedPlate||localizedBerry||localizedItemOptionPhrases[englishOption]?.[locale]||localizedEntity||localizedAbility||localizedMove||battlefieldNames[base]?.[locale]||localeUiPhrases[base]?.[locale]||localizedUi(base)));
   if(option.textContent!==next)option.textContent=next;
   // Android's native select sheet may read option.label instead of textContent.
   if(option.label!==next)option.label=next;
  }
 }
}

// English-only fallback for short UI labels and mixed dynamic status lines.
// Exact dictionary and named entities still take precedence.
const uiTerms={
 'ポケモンを探す':'Search Pokémon','技名を検索':'Search moves',
 'ドラゴン':'Dragon','じめん':'Ground','いわ':'Rock','あく':'Dark',
 '攻撃側の能力値':'Attacker stats','防御側の能力値':'Defender stats',
 '能力値を表示':'Show stats','能力値を折りたたむ':'Collapse stats','一括配分':'Quick allocation','全て0':'Reset all to 0',
 '攻撃':'Attack','防御':'Defense','特攻':'Sp. Atk','特防':'Sp. Def','素早さ':'Speed',
 '能力ポイント':'stat points','性格補正':'nature modifier','実数値':'actual stat',
 'スライダー':'slider','攻撃側':'Attacker','防御側':'Defender',
 '確定耐え':'Guaranteed survival','最大HPに対するダメージ':'Damage relative to max HP',
 'じしん':'Earthquake','ガブリアス':'Garchomp','バンギラス':'Tyranitar',
 '計算試算・実機未照合':'Estimated; not hardware-verified',
 'GameWith物理技':'GameWith physical moves','特殊技':'Special moves',
 '習得可否は未検証':'Learnsets are unverified','計算は対応技のみ':'Only supported moves can be calculated',
 '最終ダメージ':'Final damage','乱数':'roll',
 '非公式検証ツール':'Unofficial experimental tool','入力はブラウザ内で処理':'Inputs are processed locally in your browser',
 'Pokémon Champions実機のダメージ値・丸め順序との一致は未検証です':'Damage values and rounding order have not been verified against Pokémon Champions hardware'
};
const uiTermPattern=new RegExp(Object.keys(uiTerms).sort((a,b)=>b.length-a.length).join('|'),'g');
function translateMixedText(value){
 // Translate complete stat-control phrases before individual terms to avoid
 // hybrids such as "Attackのnature modifier" or "HPstat pointsのslider".
 const statNames={'HP':'HP','攻撃':'Attack','防御':'Defense','特攻':'Sp. Atk','特防':'Sp. Def','素早さ':'Speed'};
 const stat='(?:HP|攻撃|防御|特攻|特防|素早さ)';
 const nature=new RegExp('('+stat+')の性格補正','g');
 const slider=new RegExp('('+stat+')能力ポイントのスライダー','g');
 return value
  .replace(nature,(_,name)=>statNames[name]+' nature modifier')
  .replace(slider,(_,name)=>statNames[name]+' stat points slider')
  .replace(uiTermPattern,match=>uiTerms[match]||match);
}
// Runtime output is not always an exact dictionary key.
function translateBattleMoveLabel(value){
 const match=value.match(/^(.+?)（([^（）]+) \/ ([^（）]+)）(［[^］]+］)$/);
 if(!match)return entityNames[value]||dictionary[value]||value;
 const types={'ノーマル':'Normal','ほのお':'Fire','みず':'Water','でんき':'Electric','くさ':'Grass','こおり':'Ice','かくとう':'Fighting','どく':'Poison','じめん':'Ground','ひこう':'Flying','エスパー':'Psychic','むし':'Bug','いわ':'Rock','ゴースト':'Ghost','ドラゴン':'Dragon','あく':'Dark','はがね':'Steel','フェアリー':'Fairy'};
 const statuses={'［計算未対応］':' [Unsupported]','［基本ダメージのみ・実機未照合］':' [Basic damage only; unverified]','［計算試算・実機未照合］':' [Estimated; unverified]'};
 return (entityNames[match[1]]||match[1])+' ('+(types[match[2]]||match[2])+' / '+(match[3]==='可変'?'Variable':match[3])+')'+(statuses[match[4]]||match[4]);
}
function translateRuntime(base){
 if(base==='パンクロック：音技の威力1.3倍に対応しています。音技の被ダメージ半減は防御側特性として未対応です。')return 'Punk Rock: Boosts sound-based move power by 1.3x. Halving incoming sound damage is not yet supported as a defending ability.';
 if(base==='かたいツメ：登録済み335技の接触判定をShowdownデータで照合し、接触技に威力1.3倍を適用します。')return 'Tough Claws: Applies a 1.3x power boost to contact moves, based on Showdown contact flags checked across all 335 catalog moves.';
 if(base==='すてみ：反動ダメージを受ける確認済みの攻撃技のみ威力1.2倍です。反動以外のHP消費技は対象外です。')return 'Reckless: Boosts verified recoil moves by 1.2x. Moves that consume HP without recoil are excluded.';
 if(base==='アナライズ：発動条件を満たした前提でダメージを1.3倍にしています。行動順や交代の自動判定は行いません。')return 'Analytic: Damage is multiplied by 1.3 assuming the ability activates. Turn order and switching are not checked automatically.';
 const darts=base.match(/^ドラゴンアローは選択した相手への(\d+)回分のダメージを表示します。相手2体のまもる・無効・対象判定は手動指定です。$/);
 if(darts)return 'Dragon Darts shows '+darts[1]+' hit(s) on the selected target. Protect, immunities and targeting across both opponents must be set manually.';
 if(base.startsWith('現在の盤面：天候 ')){
  const options={'なし':'None','晴れ':'Sun','雨':'Rain','砂嵐':'Sandstorm','雪':'Snow','エレキフィールド':'Electric Terrain','グラスフィールド':'Grassy Terrain','ミストフィールド':'Misty Terrain','サイコフィールド':'Psychic Terrain','リフレクター':'Reflect','ひかりのかべ':'Light Screen'};
  return base.replace(/^現在の盤面：天候\s+(.+?)\s*／\s*フィールド\s+(.+?)\s*／\s*壁\s+(.+)$/,(_,w,t,sc)=>'Current battlefield: Weather '+(options[w]||w)+' / Terrain '+(options[t]||t)+' / Screen '+(options[sc]||sc));
 }
 if(base.startsWith('最大HPに対する割合：'))return base.replace('最大HPに対する割合：','Of max HP: ');
 if(base.startsWith('バージョンについて：画面の「')){
  const release=base.match(/画面の「([^」]+)」/);
  const core=base.match(/計算コアの「([^」]+)」/);
  const regression=base.match(/(v[\d.]+)の自動回帰監査/);
  const cases=base.match(/Showdown比較(\d+)ケース/);
  return 'About versions: The on-screen “'+(release?.[1]||'current release')+
   '” is the public UI version. The calculation core “'+(core?.[1]||'internal core')+
   '” identifies the internal API foundation; it does not indicate the current public version or that verification is complete. Automated regression checks for '+
   (regression?.[1]||'the public release')+' and '+(cases?.[1]||'54')+
   ' Showdown comparison cases have passed. Only some conditions have been compared against Pokémon Champions hardware; matching results under all conditions are not guaranteed.';
 }
 if(attributeLabels[base])return attributeLabels[base];
 if(dictionary[base])return dictionary[base];
 if(uiTerms[base])return uiTerms[base];
 if(/^\d+手目：/.test(base))return base.replace(/^(\d+)手目：/,(_,n)=>'Turn '+n+': ').replace(/^(Turn \d+: )(.+?)(?= \/ \d+ダメージ)/,(_,prefix,move)=>prefix+translateBattleMoveLabel(move)).replace(/ \/ (\d+)ダメージ/,(_,n)=>' / '+n+' damage').replace(' / フィールド解除',' / Terrain removed').replace(' / 予測と不一致・要照合',' / Prediction mismatch; verify');
 if(base.startsWith('ミストバースト: '))return base.replace('ミストバースト: ','Misty Explosion: ').replace('ミストフィールド＋使用者接地（威力1.5倍）','Misty Terrain + grounded user (1.5× power)').replace('通常威力','normal power').replace('。使用後の自身のひんしは自動反映しません','; self-KO after use is not applied automatically');
 if(base.startsWith('ライジングボルト: '))return base.replace('ライジングボルト: ','Rising Voltage: ').replace('エレキフィールド＋対象接地（威力2倍）','Electric Terrain + grounded target (2× power)').replace('通常威力','normal power');
 if(base.startsWith('ワイドフォース: '))return base.replace('ワイドフォース: ','Expanding Force: ').replace('接地＋サイコフィールド（威力1.5倍・範囲化）','grounded + Psychic Terrain (1.5× power, spread)').replace('通常威力・単体対象','normal power, single target');
 if(base.startsWith('エレキボール: 素早さ '))return base.replace('エレキボール: 素早さ ','Electro Ball: Speed ').replace(' → 威力 ',' → power ');
 if(base.startsWith('アクロバット: 持ち物 '))return base.replace('アクロバット: 持ち物 ','Acrobatics: held item ').replace('なし（威力2倍）','none (2× power)').replace('あり（通常威力）','held (normal power)');
 if(base.startsWith('HP依存威力: '))return base.replace('HP依存威力: ','HP-scaled power: ');
 if(base.startsWith('2発合計の最小〜最大: '))return base.replace('2発合計の最小〜最大: ','Two-hit total min–max: ').replace('〜','–');
 if(base.startsWith('2発合計KO率（256組）: '))return base.replace('2発合計KO率（256組）: ','Two-hit KO chance (256 combinations): ').replace('対象がひんし','target already fainted');
 // A trace is a multiline text node. Translate each line, not only the first.
 if(base.includes('\n')&&base.includes('最終ダメージ（乱数100')){
  const traceLabels={'攻撃実数値:':'Attack stat:','防御実数値:':'Defense stat:','乱数前:':'Before random factor:'};
  return base.split('\n').map(line=>{
   for(const [ja,en] of Object.entries(traceLabels)){
    if(line.startsWith(ja))return en+line.slice(ja.length);
   }
   if(line.startsWith('最終ダメージ（乱数100')){
    return line.replace('最終ダメージ（乱数100）','Final damage (roll 100)').replace('・2発合計','; two-hit total');
   }
   return line;
  }).join('\n');
 }
 if(base.startsWith('最終ダメージ（乱数100'))return base.replace('最終ダメージ（乱数100','Final damage (roll 100').replace('・2発合計','; two-hit total');
 if(base==='確定急所: 急所補正を強制適用')return 'Guaranteed critical: critical modifier forced';
 if(base==='ダブルウイング: 各ヒットを威力40で独立計算（各16乱数、計256組）')return 'Dual Wingbeat: each hit calculated independently at power 40 (16 rolls each; 256 combinations)';
 if(base==='無効判定: タイプまたは特性によってダメージ0')return 'Immunity: type or ability reduces damage to zero';
 if(base.startsWith('追加倍率×'))return base.replace('追加倍率×','Additional multiplier ×').replace('を最終ダメージに適用しています。既存補正との二重適用に注意してください。',' is applied to final damage. Avoid double-counting existing modifiers.');
 // Move labels may embed Japanese names, types and full-width audit annotations.
 // Normalize the full embedded label before composing status messages.
 if(base.startsWith('選択中：'))return 'Selected: '+translateMixedText(base.slice(4)).replace(/（/g,' (').replace(/）/g,')').replace(/［/g,' [').replace(/］/g,']');
 if(base.startsWith('選択技「'))return base.replace(/選択技「([^」]+)」/,(_,name)=>'Selected move “'+translateMixedText(entityNames[name]||name)+'”').replace('の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。',': learnset, effects, variable power and accuracy are unverified. Treat results as provisional until compared against hardware.');
 if(base.startsWith('HP依存威力技：'))return base.replace('HP依存威力技：','HP-dependent move: ').replace('。攻撃側現在HPを変更すると威力が再計算されます。','. Power is recalculated when attacker current HP changes.');
 if(base.startsWith('特殊能力値参照技：'))return base.replace('特殊能力値参照技：','Alternative-stat move: ').replace('。攻撃ランク欄は参照能力のランクとして扱います。','. The Attack stage field represents the relevant stat stage.');
 if(base.startsWith('技監査 '))return base.replace('技監査 ','Move audit ').replace('（自動計算を停止）',' (automatic calculation disabled)');
 if(base.startsWith('検証状況：'))return 'Verification status: '+(dictionary[base.slice(5)]||({'未実機検証':'Not hardware-verified','検証済み':'Verified','要注意':'Caution'}[base.slice(5)]||base.slice(5)));
 if(base.startsWith('入力エラー: '))return 'Input error: '+base.slice('入力エラー: '.length).replace(/現在HP/g,'Current HP').replace(/最大HP/g,'Max HP').replace(/技威力/g,'Move power').replace(/威力/g,'Power').replace(/入力してください/g,'is required').replace(/範囲外/g,'out of range');
 if(base.startsWith('タイプ相性 ×'))return base.replace('タイプ相性 ×','Type effectiveness ×');
 if(/^\d+〜\d+ ダメージ$/.test(base))return base.replace(' ダメージ',' damage').replace('〜','–');
 if(base.startsWith('最大HPの '))return base.replace('最大HPの ','Of max HP: ').replace('〜','–');
 if(base.startsWith('現在の盤面：天候 '))return base.replace('現在の盤面：天候 ','Current battlefield: Weather ').replace(' ／ フィールド ',' / Terrain ').replace(' ／ 壁 ',' / Screen ').replace(/(Weather |Terrain |Screen )(晴れ|雨|砂嵐|あられ|雪|なし|エレキフィールド|グラスフィールド|ミストフィールド|サイコフィールド|リフレクター|ひかりのかべ)/g,(_,label,value)=>label+({晴れ:'Sun',雨:'Rain',砂嵐:'Sandstorm',あられ:'Hail',雪:'Snow',なし:'None',エレキフィールド:'Electric Terrain',グラスフィールド:'Grassy Terrain',ミストフィールド:'Misty Terrain',サイコフィールド:'Psychic Terrain',リフレクター:'Reflect',ひかりのかべ:'Light Screen'}[value]||value));
 if(base.includes('を確定。相手HP ')){const split=base.indexOf('を確定。相手HP ');return translateBattleMoveLabel(base.slice(0,split))+base.slice(split).replace('を確定。相手HP ',' confirmed. Target HP ').replace(/、フィールド：([^。]+)/,(_,terrain)=>', Terrain: '+(selectLabels[terrain]||entityNames[terrain]||terrain)).replace('。予測と不一致です。条件・実測値を記録して照合してください。','. Prediction mismatch. Record and verify conditions and observed damage.');}
 if(base.startsWith('種族値 '))return base.replace('種族値 ','Base stat ');
 if(base.startsWith('現在HP '))return base.replace('現在HP ','Current HP ').replace('KO率 ','KO chance ').replace('対象外','N/A');
 if(base.startsWith('現在HPに対する1発KO率: '))return base.replace('現在HPに対する1発KO率: ','OHKO chance against current HP: ');
 if(base.startsWith('能力ポイント '))return base.replace('能力ポイント ','Stat points ').replace(/残り\s*(\d+)/g,'remaining $1').replace('残り','remaining ').replace(/remaining\s*(\d+)/g,'remaining $1').replace('個体値','IV');
 if(base.startsWith('攻撃実数値: '))return base.replace(/攻撃実数値:/g,'Attack stat:').replace(/防御実数値:/g,'Defense stat:').replace(/乱数前:/g,'Before random factor:');
 if(base.startsWith('防御実数値: '))return base.replace('防御実数値: ','Defense stat: ');
 if(base.startsWith('乱数前: '))return base.replace('乱数前: ','Before random factor: ');
 if(base==='無効')return 'Immune';
 if(base==='確定1発')return 'Guaranteed OHKO';
 if(base==='ひんし（HP 0）')return 'Fainted (0 HP)';
 if(/^\d+〜\d+発（目安・回復等なし）$/.test(base))return base.replace('発（目安・回復等なし）',' hits (estimate; no recovery)').replace('〜','–');
 if(base==='2発合計の256通りのダメージ（重複を含む）')return '256 two-hit damage combinations (including duplicates)';
 if(base==='技を選択してください')return 'Select a move';
 if(base.startsWith('選択中：'))return 'Selected: '+base.slice(4).replace('可変','Variable');
 return translateMixedText(base);
}
const reverse=Object.fromEntries(Object.entries(dictionary).map(([a,b])=>[b,a]));
const reverseUiTerms=Object.fromEntries(Object.entries(uiTerms).map(([ja,en])=>[en,ja]));
const reverseUiEntries=Object.entries(reverseUiTerms).sort((a,b)=>b[0].length-a[0].length);
function recoverJapanese(value){
 // Dynamic calculator summaries can be rebuilt from English native-select
 // labels after a locale change. Normalize the entire summary, not just
 // dictionary fragments, before caching it as Japanese source text.
 const board=value.match(/^現在の盤面：天候\s+(.+?)\s*[／/]\s*フィールド\s+(.+?)\s*[／/]\s*壁\s+(.+)$/);
 if(board){
  const japaneseChoice=label=>reverseUiTerms[label]||Object.fromEntries(Object.entries(selectLabels).map(([ja,en])=>[en,ja]))[label]||label;
  return '現在の盤面：天候 '+japaneseChoice(board[1])+' ／ フィールド '+japaneseChoice(board[2])+' ／ 壁 '+japaneseChoice(board[3]);
 }
 if(value==='ATTACKER')return '攻撃側';
 if(value==='DEFENDER')return '防御側';
 if(/^Of max HP:\s*/.test(value))return value.replace(/^Of max HP:\s*/,'最大HPに対する割合：');
 if(reverse[value])return reverse[value];
 if(value.startsWith('Selected: ')){
  const selected=value.slice('Selected: ').replace(/\bVariable\b/g,'可変');
  return '選択中：'+selected.replace(/\b(?:Earthquake|Garchomp|Tyranitar)\b/g,name=>reverseNames[name]||reverse[name]||name);
 }
 const range=String(value).match(/^(\d+)\s*[〜–-]\s*(\d+)\s*(?:ダメージ|damage|dégâts|Schaden|de daño|danni|데미지|伤害|傷害)$/);
 if(range)return range[1]+'〜'+range[2]+' ダメージ';
 if(/^Guaranteed survival\s*[·・]/.test(value))return value.replace('Guaranteed survival','確定耐え');
 let result=value;
 for(const [en,ja] of reverseUiEntries)result=result.split(en).join(ja);
 return result;
}
const key='chloha.damageLab.locale';
const supportedLocales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
let locale='ja';try{const saved=localStorage.getItem(key);locale=supportedLocales.includes(saved)?saved:'ja';}catch{}
// v0.183: reviewed high-visibility labels, separate from damage engine.
const expandedSettingsTranslations={
 "Attack and damage modifiers": {
  "fr": "Modificateurs d’attaque et de dégâts",
  "de": "Angriffs- und Schadensmodifikatoren",
  "es": "Modificadores de ataque y daño",
  "it": "Modificatori di attacco e danno",
  "ko": "공격 및 피해 보정",
  "zh-Hans": "攻击与伤害修正",
  "zh-Hant": "攻擊與傷害修正"
 },
 "HP, attack modifiers and Speed": {
  "fr": "PV, modificateurs d’attaque et Vitesse",
  "de": "KP, Angriffsmodifikatoren und Initiative",
  "es": "PS, modificadores de ataque y Velocidad",
  "it": "PS, modificatori di attacco e Velocità",
  "ko": "HP, 공격 보정 및 스피드",
  "zh-Hans": "HP、攻击修正与速度",
  "zh-Hant": "HP、攻擊修正與速度"
 },
 "HP, ally support and Speed": {
  "fr": "PV, soutien allié et Vitesse",
  "de": "KP, Unterstützung und Initiative",
  "es": "PS, apoyo aliado y Velocidad",
  "it": "PS, supporto alleato e Velocità",
  "ko": "HP, 아군 지원 및 스피드",
  "zh-Hans": "HP、队友支援与速度",
  "zh-Hant": "HP、隊友支援與速度"
 },
 "HP and bulk adjustments": {
  "fr": "Ajustements des PV et de la résistance",
  "de": "KP- und Defensivanpassungen",
  "es": "Ajustes de PS y resistencia",
  "it": "Regolazioni di PS e resistenza",
  "ko": "HP 및 내구 조정",
  "zh-Hans": "HP与耐久调整",
  "zh-Hant": "HP與耐久調整"
 },
 "Speed and action state": {
  "fr": "Vitesse et état des actions",
  "de": "Initiative und Aktionsstatus",
  "es": "Velocidad y estado de acción",
  "it": "Velocità e stato delle azioni",
  "ko": "스피드 및 행동 상태",
  "zh-Hans": "速度与行动状态",
  "zh-Hant": "速度與行動狀態"
 },
 "Defensive modifiers and ally support": {
  "fr": "Modificateurs défensifs et soutien allié",
  "de": "Defensivmodifikatoren und Unterstützung",
  "es": "Modificadores defensivos y apoyo aliado",
  "it": "Modificatori difensivi e supporto alleato",
  "ko": "방어 보정 및 아군 지원",
  "zh-Hans": "防御修正与队友支援",
  "zh-Hant": "防禦修正與隊友支援"
 },
 "Critical hit (advanced)": {
  "fr": "Coup critique (avancé)",
  "de": "Volltreffer (erweitert)",
  "es": "Golpe crítico (avanzado)",
  "it": "Brutto colpo (avanzato)",
  "ko": "급소 (고급)",
  "zh-Hans": "击中要害（高级）",
  "zh-Hant": "擊中要害（進階）"
 },
 "Helping Hand (ally support)": {
  "fr": "Coup d’Main (soutien allié)",
  "de": "Rechte Hand (Unterstützung)",
  "es": "Refuerzo (apoyo aliado)",
  "it": "Altruismo (supporto alleato)",
  "ko": "도우미 (아군 지원)",
  "zh-Hans": "帮助（队友支援）",
  "zh-Hant": "幫助（隊友支援）"
 },
 "Defender grounding": {
  "fr": "Contact au sol du défenseur",
  "de": "Bodenkontakt des Verteidigers",
  "es": "Contacto con el suelo del defensor",
  "it": "Contatto col terreno del difensore",
  "ko": "방어 측 지면 접촉",
  "zh-Hans": "防御方着地状态",
  "zh-Hant": "防禦方著地狀態"
 },
 "Attacker grounding": {
  "fr": "Contact au sol de l’attaquant",
  "de": "Bodenkontakt des Angreifers",
  "es": "Contacto con el suelo del atacante",
  "it": "Contatto col terreno dell’attaccante",
  "ko": "공격 측 지면 접촉",
  "zh-Hans": "攻击方着地状态",
  "zh-Hant": "攻擊方著地狀態"
 },
 "Additional damage multiplier (0.01–10)": {
  "fr": "Multiplicateur de dégâts supplémentaire (0,01–10)",
  "de": "Zusätzlicher Schadensmultiplikator (0,01–10)",
  "es": "Multiplicador de daño adicional (0,01–10)",
  "it": "Moltiplicatore di danno aggiuntivo (0,01–10)",
  "ko": "추가 피해 배율 (0.01–10)",
  "zh-Hans": "额外伤害倍率（0.01–10）",
  "zh-Hant": "額外傷害倍率（0.01–10）"
 },
 "Ally Friend Guard (max 1 in doubles)": {
  "fr": "Garde Amie alliée (1 max. en duo)",
  "de": "Verbündeter Freundeshutzeffekt (max. 1 im Doppelkampf)",
  "es": "Compiescolta aliada (máx. 1 en dobles)",
  "it": "Amicoscudo alleato (max 1 in doppio)",
  "ko": "아군 프렌드가드 (더블 최대 1)",
  "zh-Hans": "队友友情防守（双打最多1个）",
  "zh-Hant": "隊友友情防守（雙打最多1個）"
 },
 "Copy": {
  "fr": "Copier",
  "de": "Kopieren",
  "es": "Copiar",
  "it": "Copia",
  "ko": "복사",
  "zh-Hans": "复制",
  "zh-Hant": "複製"
 },
 "Targets": {
  "fr": "Cibles",
  "de": "Ziele",
  "es": "Objetivos",
  "it": "Bersagli",
  "ko": "대상",
  "zh-Hans": "目标",
  "zh-Hant": "目標"
 },
 "Defense stage": {
  "fr": "Niveau de Défense",
  "de": "Verteidigungsstufe",
  "es": "Nivel de Defensa",
  "it": "Livello Difesa",
  "ko": "방어 랭크",
  "zh-Hans": "防御等级",
  "zh-Hant": "防禦等級"
 }
};
const expandedLongTextTranslations={
 'Auto-fill stats, types and moves from selected data':{fr:'Remplir automatiquement les statistiques, types et capacités à partir des données sélectionnées',de:'Werte, Typen und Attacken automatisch aus den ausgewählten Daten übernehmen',es:'Completar automáticamente estadísticas, tipos y movimientos según los datos seleccionados',it:'Compila automaticamente statistiche, tipi e mosse dai dati selezionati',ko:'선택한 데이터에서 능력치, 타입, 기술 자동 입력','zh-Hans':'根据所选数据自动填入能力值、属性和招式','zh-Hant':'依據所選資料自動填入能力值、屬性與招式'},
 'Carry over battle state (manual confirmation)':{fr:'Conserver l’état du combat (confirmation manuelle)',de:'Kampfzustand übernehmen (manuelle Bestätigung)',es:'Conservar el estado del combate (confirmación manual)',it:'Mantieni lo stato della lotta (conferma manuale)',ko:'배틀 상태 이어받기 (수동 확인)','zh-Hans':'继承对战状态（手动确认）','zh-Hant':'繼承對戰狀態（手動確認）'},
 'After reviewing the result, enter and confirm the actual damage dealt. The target\'s remaining HP and terrain carry over to the next calculation.':{fr:'Après avoir vérifié le résultat, saisissez et confirmez les dégâts réels. Les PV restants de la cible et le terrain seront conservés pour le prochain calcul.',de:'Nach Prüfung des Ergebnisses den tatsächlich verursachten Schaden eingeben und bestätigen. Verbleibende KP des Ziels und das Feld werden in die nächste Berechnung übernommen.',es:'Tras revisar el resultado, introduce y confirma el daño real. Los PS restantes del objetivo y el campo se conservan para el siguiente cálculo.',it:'Dopo aver controllato il risultato, inserisci e conferma i danni effettivi. I PS rimanenti del bersaglio e il campo passano al calcolo successivo.',ko:'결과를 확인한 뒤 실제 피해량을 입력하고 확정하세요. 대상의 남은 HP와 필드 상태가 다음 계산에 이어집니다.','zh-Hans':'查看结果后，输入并确认实际伤害。目标剩余HP和场地状态将继承到下次计算。','zh-Hant':'查看結果後，輸入並確認實際傷害。目標剩餘HP與場地狀態將繼承至下次計算。'},
 'Move-specific effects remain active in manual mode. Check category, power and relevant stat.':{fr:'Les effets propres aux capacités restent actifs en mode manuel. Vérifiez la catégorie, la puissance et la statistique utilisée.',de:'Attackenspezifische Effekte bleiben im manuellen Modus aktiv. Kategorie, Stärke und verwendeten Wert prüfen.',es:'Los efectos específicos de los movimientos siguen activos en modo manual. Comprueba la categoría, potencia y estadística correspondiente.',it:'Gli effetti specifici delle mosse restano attivi in modalità manuale. Controlla categoria, potenza e statistica pertinente.',ko:'수동 모드에서도 기술별 효과가 적용됩니다. 분류, 위력, 참조 능력치를 확인하세요.','zh-Hans':'手动模式下仍会应用招式特有效果。请检查分类、威力和对应能力值。','zh-Hant':'手動模式下仍會套用招式特有效果。請檢查分類、威力及對應能力值。'}
};
const expandedPanelTranslations={
 'Input mode and manual stats':{fr:'Mode de saisie et statistiques manuelles',de:'Eingabemodus und manuelle Werte',es:'Modo de entrada y estadísticas manuales',it:'Modalità di inserimento e statistiche manuali',ko:'입력 방식 및 수동 능력치','zh-Hans':'输入模式与手动能力值','zh-Hant':'輸入模式與手動能力值'},
 'Observed damage and battle-state carryover':{fr:'Dégâts observés et report de l’état du combat',de:'Beobachteter Schaden und Übernahme des Kampfzustands',es:'Daño observado y continuidad del estado de combate',it:'Danni osservati e mantenimento dello stato di lotta',ko:'실측 피해 및 배틀 상태 이어받기','zh-Hans':'实测伤害与对战状态继承','zh-Hant':'實測傷害與對戰狀態繼承'},
 'Verification status and calculation model notes':{fr:'État de vérification et remarques sur le modèle de calcul',de:'Prüfstatus und Hinweise zum Berechnungsmodell',es:'Estado de verificación y notas del modelo de cálculo',it:'Stato della verifica e note sul modello di calcolo',ko:'검증 상태 및 계산 모델 참고 사항','zh-Hans':'验证状态与计算模型说明','zh-Hant':'驗證狀態與計算模型說明'},
 'Confirm move use':{fr:'Confirmer l’utilisation de la capacité',de:'Attackeneinsatz bestätigen',es:'Confirmar el uso del movimiento',it:'Conferma l’uso della mossa',ko:'기술 사용 확정','zh-Hans':'确认使用招式','zh-Hant':'確認使用招式'},
 'Undo one turn':{fr:'Annuler un tour',de:'Einen Zug rückgängig machen',es:'Deshacer un turno',it:'Annulla un turno',ko:'한 턴 되돌리기','zh-Hans':'撤销一回合','zh-Hant':'復原一回合'},
 'Clear history':{fr:'Effacer l’historique',de:'Verlauf löschen',es:'Borrar historial',it:'Cancella cronologia',ko:'기록 지우기','zh-Hans':'清除历史记录','zh-Hant':'清除歷史記錄'},
 'Observed damage':{fr:'Dégâts observés',de:'Beobachteter Schaden',es:'Daño observado',it:'Danni osservati',ko:'실측 피해','zh-Hans':'实测伤害','zh-Hant':'實測傷害'},
 'Collapse stats':{fr:'Réduire les statistiques',de:'Werte einklappen',es:'Contraer estadísticas',it:'Comprimi statistiche',ko:'능력치 접기','zh-Hans':'收起能力值','zh-Hant':'收合能力值'},
 'Stat':{fr:'Statistique',de:'Wert',es:'Estadística',it:'Statistica',ko:'능력치','zh-Hans':'能力值','zh-Hant':'能力值'},
 'Points':{fr:'Points',de:'Punkte',es:'Puntos',it:'Punti',ko:'포인트','zh-Hans':'点数','zh-Hant':'點數'},
 'Nature':{fr:'Nature',de:'Wesen',es:'Naturaleza',it:'Natura',ko:'성격','zh-Hans':'性格','zh-Hant':'性格'},
 'Actual stat':{fr:'Statistique réelle',de:'Tatsächlicher Wert',es:'Valor real',it:'Valore effettivo',ko:'실제 능력치','zh-Hans':'实际能力值','zh-Hant':'實際能力值'},
 'Validate every move.':{fr:'Vérifiez chaque capacité.',de:'Jede Attacke überprüfen.',es:'Verifica cada movimiento.',it:'Verifica ogni mossa.',ko:'각 기술을 확인하세요.','zh-Hans':'请核对每个招式。','zh-Hant':'請核對每個招式。'},
 'Experimental build; not fully verified on hardware.':{fr:'Version expérimentale, non entièrement vérifiée sur console.',de:'Experimentelle Version; nicht vollständig auf Hardware geprüft.',es:'Versión experimental; no verificada completamente en consola.',it:'Versione sperimentale; non completamente verificata su console.',ko:'실험 버전으로 실기 검증이 완료되지 않았습니다.','zh-Hans':'实验版本，尚未完成实机验证。','zh-Hant':'實驗版本，尚未完成實機驗證。'},
 'Damage results, availability and learnsets are not guaranteed.':{fr:'Les dégâts, la disponibilité et les capacités apprises ne sont pas garantis.',de:'Schadenswerte, Verfügbarkeit und erlernbare Attacken sind nicht garantiert.',es:'No se garantizan los daños, la disponibilidad ni los movimientos aprendidos.',it:'Danni, disponibilità e mosse apprendibili non sono garantiti.',ko:'피해량, 사용 가능 여부 및 기술 습득 여부는 보장되지 않습니다.','zh-Hans':'伤害结果、可用性和可学招式均不保证准确。','zh-Hant':'傷害結果、可用性與可學招式均不保證準確。'},
 'Show calculation trace':{fr:'Afficher les étapes du calcul',de:'Berechnungsschritte anzeigen',es:'Mostrar los pasos del cálculo',it:'Mostra i passaggi del calcolo',ko:'계산 과정 표시','zh-Hans':'显示计算过程','zh-Hant':'顯示計算過程'}
};
const localeUiPhrases={
 'Swap sides':{fr:'Inverser les côtés',de:'Seiten tauschen',es:'Intercambiar lados',it:'Scambia lati',ko:'양쪽 교체','zh-Hans':'交换双方','zh-Hant':'交換雙方'},
 'e.g. Earthquake, Thunderbolt':{fr:'Ex. : Séisme, Tonnerre',de:'z. B. Erdbeben, Donnerblitz',es:'p. ej., Terremoto, Rayo',it:'es. Terremoto, Fulmine',ko:'예: 지진, 10만볼트','zh-Hans':'例如：地震、十万伏特','zh-Hant':'例如：地震、十萬伏特'},
 'Attack':{fr:'Attaque',de:'Angriff',es:'Ataque',it:'Attacco',ko:'공격','zh-Hans':'攻击','zh-Hant':'攻擊'},
 'Defense':{fr:'Défense',de:'Verteidigung',es:'Defensa',it:'Difesa',ko:'방어','zh-Hans':'防御','zh-Hant':'防禦'},
 'Sp. Atk':{fr:'Att. Spé.',de:'Sp.-Ang.',es:'At. Esp.',it:'Att. Sp.',ko:'특수공격','zh-Hans':'特攻','zh-Hant':'特攻'},
 'Sp. Def':{fr:'Déf. Spé.',de:'Sp.-Vert.',es:'Def. Esp.',it:'Dif. Sp.',ko:'특수방어','zh-Hans':'特防','zh-Hant':'特防'},
 'Speed':{fr:'Vitesse',de:'Initiative',es:'Velocidad',it:'Velocità',ko:'스피드','zh-Hans':'速度','zh-Hant':'速度'},
 'Attacker':{fr:'Attaquant',de:'Angreifer',es:'Atacante',it:'Attaccante',ko:'공격 측','zh-Hans':'攻击方','zh-Hant':'攻擊方'},
 'Defender':{fr:'Défenseur',de:'Verteidiger',es:'Defensor',it:'Difensore',ko:'방어 측','zh-Hans':'防御方','zh-Hant':'防禦方'},
 'Guaranteed survival':{fr:'Survie garantie',de:'Überlebt garantiert',es:'Supervivencia garantizada',it:'Sopravvivenza garantita',ko:'확정 생존','zh-Hans':'必定存活','zh-Hant':'必定存活'},
 'Estimated; not hardware-verified':{fr:'Estimation non vérifiée sur console',de:'Schätzung; nicht auf Hardware geprüft',es:'Estimación sin verificar en consola',it:'Stima non verificata su console',ko:'추정값 · 실기기 미검증','zh-Hans':'估算值，未经实机验证','zh-Hant':'估算值，未經實機驗證'},
 'Choose from list':{fr:'Choisir dans la liste',de:'Aus Liste wählen',es:'Elegir de la lista',it:'Scegli dall’elenco',ko:'목록에서 선택','zh-Hans':'从列表选择','zh-Hant':'從清單選擇'},
 'Choose from move list':{fr:'Choisir une capacité',de:'Attacke aus Liste wählen',es:'Elegir de la lista de movimientos',it:'Scegli una mossa dall’elenco',ko:'기술 목록에서 선택','zh-Hans':'从招式列表选择','zh-Hant':'從招式清單選擇'},
 'Attacker advanced settings':{fr:'Paramètres avancés de l’attaquant',de:'Erweiterte Angreifereinstellungen',es:'Ajustes avanzados del atacante',it:'Impostazioni avanzate attaccante',ko:'공격 측 상세 설정','zh-Hans':'攻击方高级设置','zh-Hant':'攻擊方進階設定'},
 'Defender advanced settings':{fr:'Paramètres avancés du défenseur',de:'Erweiterte Verteidigereinstellungen',es:'Ajustes avanzados del defensor',it:'Impostazioni avanzate difensore',ko:'방어 측 상세 설정','zh-Hans':'防御方高级设置','zh-Hant':'防禦方進階設定'},
 'Attacker stats':{fr:'Stats de l’attaquant',de:'Angreiferwerte',es:'Estadísticas del atacante',it:'Statistiche attaccante',ko:'공격 측 능력치','zh-Hans':'攻击方能力值','zh-Hant':'攻擊方能力值'},
 'Defender stats':{fr:'Stats du défenseur',de:'Verteidigerwerte',es:'Estadísticas del defensor',it:'Statistiche difensore',ko:'방어 측 능력치','zh-Hans':'防御方能力值','zh-Hant':'防禦方能力值'},
 'Show stats':{fr:'Afficher les stats',de:'Werte anzeigen',es:'Mostrar estadísticas',it:'Mostra statistiche',ko:'능력치 표시','zh-Hans':'显示能力值','zh-Hant':'顯示能力值'},
 'Quick allocation':{fr:'Répartition rapide',de:'Schnellverteilung',es:'Distribución rápida',it:'Distribuzione rapida',ko:'빠른 배분','zh-Hans':'快速分配','zh-Hant':'快速分配'},
 'Reset all to 0':{fr:'Tout remettre à 0',de:'Alles auf 0 setzen',es:'Restablecer todo a 0',it:'Azzera tutto',ko:'모두 0으로 초기화','zh-Hans':'全部重置为0','zh-Hant':'全部重設為0'},
 'Learnsets are unverified. Only supported moves can be calculated.':{fr:'Les capacités apprises ne sont pas vérifiées. Seules les capacités prises en charge peuvent être calculées.',de:'Erlernbare Attacken sind nicht verifiziert. Nur unterstützte Attacken können berechnet werden.',es:'Los movimientos aprendidos no están verificados. Solo se pueden calcular los movimientos compatibles.',it:'Le mosse apprendibili non sono verificate. Si possono calcolare solo le mosse supportate.',ko:'배울 수 있는 기술 목록은 검증되지 않았습니다. 지원하는 기술만 계산할 수 있습니다.','zh-Hans':'可学习招式尚未验证。只能计算已支持的招式。','zh-Hant':'可學習招式尚未驗證。只能計算已支援的招式。'},
 'Battlefield settings':{fr:'Paramètres du terrain',de:'Kampffeld-Einstellungen',es:'Configuración del campo',it:'Impostazioni del campo',ko:'배틀 필드 설정','zh-Hans':'对战场地设置','zh-Hant':'對戰場地設定'},
 'Change weather, terrain and screens here':{fr:'Modifier la météo, le champ et les protections',de:'Wetter, Feld und Schutzschilde ändern',es:'Cambia el clima, el campo y las pantallas',it:'Modifica meteo, campo e barriere',ko:'날씨, 필드, 벽을 변경하세요','zh-Hans':'在此更改天气、场地和屏障','zh-Hant':'在此變更天氣、場地和屏障'},
 'Reset battlefield':{fr:'Réinitialiser le terrain',de:'Kampffeld zurücksetzen',es:'Restablecer campo',it:'Ripristina campo',ko:'배틀 필드 초기화','zh-Hans':'重置对战场地','zh-Hant':'重設對戰場地'},
 'Screens':{fr:'Protections',de:'Schutzschilde',es:'Pantallas',it:'Barriere',ko:'벽','zh-Hans':'屏障','zh-Hant':'屏障'},
 'Battle format':{fr:'Format du combat',de:'Kampfformat',es:'Formato de combate',it:'Formato lotta',ko:'배틀 형식','zh-Hans':'对战形式','zh-Hant':'對戰形式'},
 'Swap sides':{fr:'Inverser les côtés',de:'Seiten tauschen',es:'Intercambiar lados',it:'Scambia lati',ko:'양쪽 교체','zh-Hans':'交换双方','zh-Hant':'交換雙方'},
 'Results ↓':{fr:'Résultats ↓',de:'Ergebnisse ↓',es:'Resultados ↓',it:'Risultati ↓',ko:'결과 ↓','zh-Hans':'结果 ↓','zh-Hant':'結果 ↓'},
 'Search Pokémon':{fr:'Rechercher un Pokémon',de:'Pokémon suchen',es:'Buscar Pokémon',it:'Cerca Pokémon',ko:'포켓몬 검색','zh-Hans':'搜索宝可梦','zh-Hant':'搜尋寶可夢'},
 'Search moves':{fr:'Rechercher une capacité',de:'Attacke suchen',es:'Buscar movimientos',it:'Cerca mosse',ko:'기술 검색','zh-Hans':'搜索招式','zh-Hant':'搜尋招式'},
 'Type a name to select':{fr:'Saisissez un nom',de:'Namen eingeben',es:'Escribe un nombre',it:'Inserisci un nome',ko:'이름을 입력하세요','zh-Hans':'输入名称以选择','zh-Hant':'輸入名稱以選擇'},
 'Punk Rock: Boosts sound-based move power by 1.3x. Halving incoming sound damage is not yet supported as a defending ability.':{fr:'Punk Rock : puissance des capacités sonores ×1,3. La réduction des dégâts sonores reçus n’est pas encore prise en charge.',de:'Punk Rock: Schall-Attacken ×1,3. Die Halbierung eingehender Schallschäden wird noch nicht unterstützt.',es:'Punk Rock: potencia de movimientos sonoros ×1,3. La reducción del daño sonoro recibido aún no está implementada.',it:'Punk Rock: potenza delle mosse sonore ×1,3. La riduzione dei danni sonori subiti non è ancora supportata.',ko:'펑크록: 소리 기술 위력 1.3배. 방어 측 소리 기술 피해 반감은 아직 지원하지 않습니다.','zh-Hans':'庞克摇滚：声音招式威力×1.3。暂不支持防御方受到声音招式伤害减半。','zh-Hant':'龐克搖滾：聲音招式威力×1.3。暫不支援防禦方受到聲音招式傷害減半。'},
 'Tough Claws: Applies a 1.3x power boost to contact moves, based on Showdown contact flags checked across all 335 catalog moves.':{fr:'Griffe Dure : puissance des capacités de contact ×1,3 selon les indicateurs Showdown vérifiés pour 335 capacités.',de:'Krallenwucht: Kontakt-Attacken ×1,3 gemäß geprüften Showdown-Kontaktdaten für 335 Attacken.',es:'Garra Dura: potencia de movimientos de contacto ×1,3 según datos de contacto de Showdown comprobados para 335 movimientos.',it:'Unghiedure: potenza delle mosse da contatto ×1,3 secondo i dati Showdown verificati per 335 mosse.',ko:'단단한발톱: Showdown의 접촉 판정을 확인한 335개 기술 중 접촉 기술 위력 1.3배.','zh-Hans':'硬爪：依据已核对的335个Showdown招式接触标记，接触招式威力×1.3。','zh-Hant':'硬爪：依據已核對的335個Showdown招式接觸標記，接觸招式威力×1.3。'},
 'Reckless: Boosts verified recoil moves by 1.2x. Moves that consume HP without recoil are excluded.':{fr:'Téméraire : puissance des capacités à contrecoup vérifiées ×1,2. Les capacités consommant des PV sans contrecoup sont exclues.',de:'Achtlos: geprüfte Rückstoß-Attacken ×1,2. Attacken mit KP-Verbrauch ohne Rückstoß sind ausgeschlossen.',es:'Audaz: potencia de movimientos con retroceso verificados ×1,2. Se excluyen los que consumen PS sin retroceso.',it:'Temerarietà: potenza delle mosse con contraccolpo verificate ×1,2. Escluse le mosse che consumano PS senza contraccolpo.',ko:'이판사판: 확인된 반동 기술 위력 1.2배. 반동 없이 HP만 소비하는 기술은 제외합니다.','zh-Hans':'舍身：已确认的反作用力招式威力×1.2。不包括仅消耗HP而无反作用力的招式。','zh-Hant':'捨身：已確認的反作用力招式威力×1.2。不包括僅消耗HP而無反作用力的招式。'},
 'Analytic: Damage is multiplied by 1.3 assuming the ability activates. Turn order and switching are not checked automatically.':{fr:'Analyste : dégâts ×1,3 si le talent est activé. L’ordre des actions et les changements ne sont pas vérifiés automatiquement.',de:'Analyse: Schaden ×1,3 bei angenommener Aktivierung. Zugreihenfolge und Wechsel werden nicht automatisch geprüft.',es:'Cálculo Final: daño ×1,3 suponiendo que se activa. No se comprueban automáticamente el orden de turno ni los cambios.',it:'Ponderazione: danno ×1,3 se l’abilità si attiva. Ordine delle azioni e sostituzioni non sono verificati automaticamente.',ko:'애널라이즈: 발동을 가정하여 데미지 1.3배. 행동 순서와 교체는 자동 판정하지 않습니다.','zh-Hans':'分析：假定特性发动，伤害×1.3。不自动判断行动顺序或替换。','zh-Hant':'分析：假定特性發動，傷害×1.3。不自動判斷行動順序或替換。'},
 'Guaranteed KO':{fr:'KO garanti',de:'Garantierter K. o.',es:'KO garantizado',it:'KO garantito',ko:'확정 KO','zh-Hans':'必定击倒','zh-Hant':'必定擊倒'},
 'Possible KO':{fr:'KO possible',de:'Möglicher K. o.',es:'Posible KO',it:'KO possibile',ko:'난수 KO','zh-Hans':'可能击倒','zh-Hant':'可能擊倒'},
 'No damage':{fr:'Aucun dégât',de:'Kein Schaden',es:'Sin daño',it:'Nessun danno',ko:'데미지 없음','zh-Hans':'无伤害','zh-Hant':'無傷害'},
 'Target already fainted':{fr:'La cible est déjà K.O.',de:'Ziel ist bereits kampfunfähig',es:'El objetivo ya está debilitado',it:'Il bersaglio è già esausto',ko:'대상은 이미 기절함','zh-Hans':'目标已经昏厥','zh-Hant':'目標已經昏厥'},
 'Current HP':{fr:'PV actuels',de:'Aktuelle KP',es:'PS actuales',it:'PS attuali',ko:'현재 HP','zh-Hans':'当前HP','zh-Hant':'目前HP'},
 'KO chance':{fr:'Probabilité de KO',de:'K.-o.-Chance',es:'Probabilidad de KO',it:'Probabilità di KO',ko:'KO 확률','zh-Hans':'击倒概率','zh-Hant':'擊倒機率'},
 'Not applicable':{fr:'Sans objet',de:'Nicht anwendbar',es:'No aplicable',it:'Non applicabile',ko:'해당 없음','zh-Hans':'不适用','zh-Hant':'不適用'},
 'Damage relative to max HP':{fr:'Dégâts en % des PV max',de:'Schaden relativ zu max. KP',es:'Daño respecto a los PS máximos',it:'Danno rispetto ai PS massimi',ko:'최대 HP 대비 데미지','zh-Hans':'占最大HP的伤害','zh-Hant':'佔最大HP的傷害'},
 'Final damage':{fr:'Dégâts finaux',de:'Endschaden',es:'Daño final',it:'Danno finale',ko:'최종 데미지','zh-Hans':'最终伤害','zh-Hant':'最終傷害'},
 'Normal damage':{fr:'Dégâts normaux',de:'Normaler Schaden',es:'Daño normal',it:'Danno normale',ko:'일반 데미지','zh-Hans':'普通伤害','zh-Hant':'普通傷害'},
 'Critical hit damage ×1.5':{fr:'Dégâts critiques ×1,5',de:'Volltrefferschaden ×1,5',es:'Daño crítico ×1,5',it:'Danno da brutto colpo ×1,5',ko:'급소 데미지 ×1.5','zh-Hans':'要害伤害 ×1.5','zh-Hant':'要害傷害 ×1.5'},
 'Of max HP:':{fr:'Des PV max :',de:'Von max. KP:',es:'De los PS máximos:',it:'Dei PS massimi:',ko:'최대 HP 대비:','zh-Hans':'占最大HP：','zh-Hant':'佔最大HP：'},
 'No matching moves':{fr:'Aucune capacité correspondante',de:'Keine passenden Attacken',es:'No hay movimientos coincidentes',it:'Nessuna mossa corrispondente',ko:'일치하는 기술 없음','zh-Hans':'没有匹配的招式','zh-Hant':'沒有符合的招式'},
 'No matching Pokémon':{fr:'Aucun Pokémon correspondant',de:'Keine passenden Pokémon',es:'No hay Pokémon coincidentes',it:'Nessun Pokémon corrispondente',ko:'일치하는 포켓몬 없음','zh-Hans':'没有匹配的宝可梦','zh-Hant':'沒有符合的寶可夢'},
 'なし':{fr:'Aucun',de:'Keine',es:'Ninguno',it:'Nessuno',ko:'없음','zh-Hans':'无','zh-Hant':'無'},
 'ダブル':{fr:'Duo',de:'Doppel',es:'Doble',it:'Doppio',ko:'더블','zh-Hans':'双打','zh-Hant':'雙打'},
 'シングル（検証用）':{fr:'Solo (expérimental)',de:'Einzel (experimentell)',es:'Individual (experimental)',it:'Singolo (sperimentale)',ko:'싱글 (실험용)','zh-Hans':'单打（实验性）','zh-Hant':'單打（實驗性）'},
 'シングル':{fr:'Solo',de:'Einzel',es:'Individual',it:'Singolo',ko:'싱글','zh-Hans':'单打','zh-Hant':'單打'}
};
// Verdicts are UI-only: preserve HP values and calculated KO percentages.
const verdictSource={
 '確定KO':'Guaranteed KO','乱数KO':'Possible KO','ダメージなし':'No damage',
 '対象はすでにひんし':'Target already fainted'
};
function localizedVerdict(base,target){
 const source=String(base);
 const label=verdictSource[source]||source;
 if(localeUiPhrases[label]){
  return target==='ja'?Object.keys(verdictSource).find(key=>verdictSource[key]===label)||source:
   target==='en'?label:localeUiPhrases[label][target]||label;
 }
 const detail=source.match(/^現在HP\s*(\d+)\s*\/\s*KO率\s*(対象外|(?:\d+(?:\.\d+)?)%)$/);
 if(detail){
  const hp=detail[1],chance=detail[2];
  if(target==='ja')return '現在HP '+hp+' / KO率 '+chance;
  const name=key=>target==='en'?key:localeUiPhrases[key]?.[target]||key;
  return name('Current HP')+' '+hp+' / '+name('KO chance')+' '+(chance==='対象外'?name('Not applicable'):chance);
 }
 const mini=source.match(/^(確定KO|乱数KO|ダメージなし|対象はすでにひんし)\s*[·・]\s*(\d+(?:\.\d+)?%)$/);
 if(mini)return localizedVerdict(mini[1],target)+' · '+mini[2];
 return null;
}
// Numeric damage ranges are localized without touching battle calculation values.
const damageRangeSuffix={
 ja:'ダメージ',en:'damage',fr:'dégâts',de:'Schaden',es:'de daño',it:'danni',ko:'데미지','zh-Hans':'伤害','zh-Hant':'傷害'
};
function localizedDamageRange(base,target){
 const source=String(base).match(/^(\d+)\s*[〜–-]\s*(\d+)\s*(?:ダメージ|damage)$/);
 if(!source)return null;
 const range=source[1]+(target==='ja'?'〜':'–')+source[2];
 return range+' '+damageRangeSuffix[target];
}
const battlefieldNames={
 'なし':{en:'None',fr:'Aucun',de:'Keine',es:'Ninguno',it:'Nessuno',ko:'없음','zh-Hans':'无','zh-Hant':'無'},
 '晴れ':{en:'Sun',fr:'Soleil',de:'Sonne',es:'Sol',it:'Sole',ko:'쾌청','zh-Hans':'晴天','zh-Hant':'晴天'},
 '雨':{en:'Rain',fr:'Pluie',de:'Regen',es:'Lluvia',it:'Pioggia',ko:'비','zh-Hans':'下雨','zh-Hant':'下雨'},
 '砂嵐':{en:'Sandstorm',fr:'Tempête de sable',de:'Sandsturm',es:'Tormenta de arena',it:'Terrempesta',ko:'모래바람','zh-Hans':'沙暴','zh-Hant':'沙暴'},
 '雪':{en:'Snow',fr:'Neige',de:'Schnee',es:'Nieve',it:'Neve',ko:'눈','zh-Hans':'下雪','zh-Hant':'下雪'},
 'エレキフィールド':{en:'Electric Terrain',fr:'Champ Électrifié',de:'Elektrofeld',es:'Campo Eléctrico',it:'Campo Elettrico',ko:'일렉트릭필드','zh-Hans':'电气场地','zh-Hant':'電氣場地'},
 'グラスフィールド':{en:'Grassy Terrain',fr:'Champ Herbu',de:'Grasfeld',es:'Campo de Hierba',it:'Campo Erboso',ko:'그래스필드','zh-Hans':'青草场地','zh-Hant':'青草場地'},
 'ミストフィールド':{en:'Misty Terrain',fr:'Champ Brumeux',de:'Nebelfeld',es:'Campo de Niebla',it:'Campo Nebbioso',ko:'미스트필드','zh-Hans':'薄雾场地','zh-Hant':'薄霧場地'},
 'サイコフィールド':{en:'Psychic Terrain',fr:'Champ Psychique',de:'Psychofeld',es:'Campo Psíquico',it:'Campo Psichico',ko:'사이코필드','zh-Hans':'精神场地','zh-Hant':'精神場地'},
 'リフレクター':{en:'Reflect',fr:'Protection',de:'Reflektor',es:'Reflejo',it:'Riflesso',ko:'리플렉터','zh-Hans':'反射壁','zh-Hant':'反射壁'},
 'ひかりのかべ':{en:'Light Screen',fr:'Mur Lumière',de:'Lichtschild',es:'Pantalla de Luz',it:'Schermoluce',ko:'빛의장막','zh-Hans':'光墙','zh-Hant':'光牆'}
};
const battlefieldHeadings={
 en:['Current battlefield: Weather ',' / Terrain ',' / Screen '],
 fr:['Terrain actuel : Météo ',' / Champ ',' / Protection '],
 de:['Aktuelles Kampffeld: Wetter ',' / Feld ',' / Schild '],
 es:['Campo actual: Clima ',' / Campo ',' / Pantalla '],
 it:['Campo attuale: Meteo ',' / Campo ',' / Barriera '],
 ko:['현재 배틀 필드: 날씨 ',' / 필드 ',' / 벽 '],
 'zh-Hans':['当前对战场地：天气 ',' / 场地 ',' / 屏障 '],
 'zh-Hant':['目前對戰場地：天氣 ',' / 場地 ',' / 屏障 ']
};
function localizedBattlefield(base,target){
 const m=String(base).match(/^現在の盤面：天候\s+(.+?)\s*[／/]\s*フィールド\s+(.+?)\s*[／/]\s*壁\s+(.+)$/);
 if(!m)return null;
 if(target==='ja')return base;
 const labels=battlefieldHeadings[target]||battlefieldHeadings.en;
 const choice=value=>battlefieldNames[value]?.[target]||value;
 return labels[0]+choice(m[1])+labels[1]+choice(m[2])+labels[2]+choice(m[3]);
}
function localizedLiveSummary(base,target){
 const value=String(base);
 const max=value.match(/^(?:最大HPに対する割合：|Of max HP:)\s*(.+)$/);
 if(max){
  if(target==='ja')return '最大HPに対する割合：'+max[1];
  const label=target==='en'?'Of max HP:':localeUiPhrases['Of max HP:']?.[target]||'Of max HP:';
  return label+' '+max[1];
 }
 const survival=value.match(/^(?:確定耐え|Guaranteed survival)\s*[·・]\s*(\d+(?:\.\d+)?%)$/);
 if(survival){
  if(target==='ja')return '確定耐え · '+survival[1];
  const label=target==='en'?'Guaranteed survival':localeUiPhrases['Guaranteed survival']?.[target]||'Guaranteed survival';
  return label+' · '+survival[1];
 }
 return null;
}
const localizedTypeNames={"ノーマル":{"en":"Normal","fr":"Normal","de":"Normal","es":"Normal","it":"Normale","ko":"노말","zh-Hans":"一般","zh-Hant":"一般"},"ほのお":{"en":"Fire","fr":"Feu","de":"Feuer","es":"Fuego","it":"Fuoco","ko":"불꽃","zh-Hans":"火","zh-Hant":"火"},"みず":{"en":"Water","fr":"Eau","de":"Wasser","es":"Agua","it":"Acqua","ko":"물","zh-Hans":"水","zh-Hant":"水"},"でんき":{"en":"Electric","fr":"Électrik","de":"Elektro","es":"Eléctrico","it":"Elettro","ko":"전기","zh-Hans":"电","zh-Hant":"電"},"くさ":{"en":"Grass","fr":"Plante","de":"Pflanze","es":"Planta","it":"Erba","ko":"풀","zh-Hans":"草","zh-Hant":"草"},"こおり":{"en":"Ice","fr":"Glace","de":"Eis","es":"Hielo","it":"Ghiaccio","ko":"얼음","zh-Hans":"冰","zh-Hant":"冰"},"かくとう":{"en":"Fighting","fr":"Combat","de":"Kampf","es":"Lucha","it":"Lotta","ko":"격투","zh-Hans":"格斗","zh-Hant":"格鬥"},"どく":{"en":"Poison","fr":"Poison","de":"Gift","es":"Veneno","it":"Veleno","ko":"독","zh-Hans":"毒","zh-Hant":"毒"},"じめん":{"en":"Ground","fr":"Sol","de":"Boden","es":"Tierra","it":"Terra","ko":"땅","zh-Hans":"地面","zh-Hant":"地面"},"ひこう":{"en":"Flying","fr":"Vol","de":"Flug","es":"Volador","it":"Volante","ko":"비행","zh-Hans":"飞行","zh-Hant":"飛行"},"エスパー":{"en":"Psychic","fr":"Psy","de":"Psycho","es":"Psíquico","it":"Psico","ko":"에스퍼","zh-Hans":"超能力","zh-Hant":"超能力"},"むし":{"en":"Bug","fr":"Insecte","de":"Käfer","es":"Bicho","it":"Coleottero","ko":"벌레","zh-Hans":"虫","zh-Hant":"蟲"},"いわ":{"en":"Rock","fr":"Roche","de":"Gestein","es":"Roca","it":"Roccia","ko":"바위","zh-Hans":"岩石","zh-Hant":"岩石"},"ゴースト":{"en":"Ghost","fr":"Spectre","de":"Geist","es":"Fantasma","it":"Spettro","ko":"고스트","zh-Hans":"幽灵","zh-Hant":"幽靈"},"ドラゴン":{"en":"Dragon","fr":"Dragon","de":"Drache","es":"Dragón","it":"Drago","ko":"드래곤","zh-Hans":"龙","zh-Hant":"龍"},"あく":{"en":"Dark","fr":"Ténèbres","de":"Unlicht","es":"Siniestro","it":"Buio","ko":"악","zh-Hans":"恶","zh-Hant":"惡"},"はがね":{"en":"Steel","fr":"Acier","de":"Stahl","es":"Acero","it":"Acciaio","ko":"강철","zh-Hans":"钢","zh-Hant":"鋼"},"フェアリー":{"en":"Fairy","fr":"Fée","de":"Fee","es":"Hada","it":"Folletto","ko":"페어리","zh-Hans":"妖精","zh-Hant":"妖精"}};
// Pokémon records can contain either Japanese or English type identifiers.
// Normalize both before resolving the active locale, including search results.
const englishTypeToJapanese=Object.fromEntries(
 Object.entries(localizedTypeNames).map(([ja,names])=>[names.en.toLowerCase(),ja])
);
function localizedPokemonType(value,target){
 const raw=String(value||'').trim();
 const ja=localizedTypeNames[raw]?raw:englishTypeToJapanese[raw.toLowerCase()];
 if(!ja)return raw;
 return target==='ja'?ja:(localizedTypeNames[ja][target]||localizedTypeNames[ja].en);
}
const localizedPlateOptions={
 'だいちのプレート':{
  fr:'Plaque Terre (capacités Sol ×1,2)',de:'Erdtafel (Boden-Attacken ×1,2)',
  es:'Tabla Terra (movimientos Tierra ×1,2)',it:'Lastrageo (mosse Terra ×1,2)',
  ko:'대지플레이트 (땅타입 기술 ×1.2)','zh-Hans':'大地石板（地面属性招式×1.2）',
  'zh-Hant':'大地石板（地面屬性招式×1.2）'
 }
};
const localizedItemOptionPhrases={
 'Loaded Dice (4–5 hits)':{fr:'Dé Pipé (4 à 5 coups)',de:'Gezinkter Würfel (4–5 Treffer)',es:'Dado Trucado (4–5 golpes)',it:'Dado Truccato (4–5 colpi)',ko:'속임수주사위 (4~5회 명중)','zh-Hans':'机变骰子（命中4～5次）','zh-Hant':'機變骰子（命中4～5次）'},
 'Life Orb (damage ×1.3)':{fr:'Orbe Vie (dégâts ×1,3)',de:'Leben-Orb (Schaden ×1,3)',es:'Vidasfera (daño ×1,3)',it:'Assorbisfera (danni ×1,3)',ko:'생명의구슬 (데미지 ×1.3)','zh-Hans':'生命宝珠（伤害×1.3）','zh-Hant':'生命寶珠（傷害×1.3）'},
 'Assault Vest (Sp. Def ×1.5)':{fr:'Veste de Combat (Déf. Spé. ×1,5)',de:'Offensivweste (Spezial-Verteidigung ×1,5)',es:'Chaleco Asalto (Def. Esp. ×1,5)',it:'Corpetto assalto (Dif. Sp. ×1,5)',ko:'돌격조끼 (특수방어 ×1.5)','zh-Hans':'突击背心（特防×1.5）','zh-Hant':'突擊背心（特防×1.5）'},
 'Choice Band (Attack ×1.5)':{fr:'Bandeau Choix (Attaque ×1,5)',de:'Wahlband (Angriff ×1,5)',es:'Cinta Elección (Ataque ×1,5)',it:'Bendascelta (Attacco ×1,5)',ko:'구애머리띠 (공격 ×1.5)','zh-Hans':'讲究头带（攻击×1.5）','zh-Hant':'講究頭帶（攻擊×1.5）'},
 'Choice Specs (Sp. Atk ×1.5)':{fr:'Lunettes Choix (Att. Spé. ×1,5)',de:'Wahlglas (Spezial-Angriff ×1,5)',es:'Gafas Elección (At. Esp. ×1,5)',it:'Lentiscelta (Att. Sp. ×1,5)',ko:'구애안경 (특수공격 ×1.5)','zh-Hans':'讲究眼镜（特攻×1.5）','zh-Hant':'講究眼鏡（特攻×1.5）'},
 'Expert Belt (super-effective ×1.2)':{fr:'Ceinture Pro (super efficace ×1,2)',de:'Expertengurt (sehr effektiv ×1,2)',es:'Cinta Experto (supereficaz ×1,2)',it:'Abilcintura (superefficace ×1,2)',ko:'달인의띠 (효과가 굉장함 ×1.2)','zh-Hans':'达人带（效果绝佳×1.2）','zh-Hant':'達人帶（效果絕佳×1.2）'}
};
const localizedControlPhrases={
 'Defender ability':{fr:'Talent du défenseur',de:'Fähigkeit des Verteidigers',es:'Habilidad del defensor',it:'Abilità del difensore',ko:'방어 측 특성','zh-Hans':'防御方特性','zh-Hant':'防禦方特性'},
 'Attacker ability':{fr:'Talent de l’attaquant',de:'Fähigkeit des Angreifers',es:'Habilidad del atacante',it:'Abilità dell’attaccante',ko:'공격 측 특성','zh-Hans':'攻击方特性','zh-Hant':'攻擊方特性'},
 'Held item':{fr:'Objet tenu',de:'Getragenes Item',es:'Objeto equipado',it:'Strumento tenuto',ko:'지닌 도구','zh-Hans':'携带道具','zh-Hant':'攜帶道具'},
 'HP attack modifiers and Speed':{fr:'PV, modificateurs d’attaque et Vitesse',de:'KP, Angriffsmodifikatoren und Initiative',es:'PS, modificadores de ataque y Velocidad',it:'PS, modificatori d’attacco e Velocità',ko:'HP, 공격 보정 및 스피드','zh-Hans':'HP、攻击修正与速度','zh-Hant':'HP、攻擊修正與速度'},
 'None / Not applied':{fr:'Aucun / Non appliqué',de:'Keine / Nicht angewendet',es:'Ninguna / No aplicada',it:'Nessuna / Non applicata',ko:'없음 / 미적용','zh-Hans':'无 / 未应用','zh-Hant':'無 / 未套用'}
};
function localizedDynamicControl(base,target){
 const english=translateRuntime(base);
 if(target!=='ja'&&target!=='en'){
  const swap=String(english).match(/^(⇄\s*)Swap sides$/);
  if(swap)return swap[1]+localeUiPhrases['Swap sides'][target];
  const controls={'Defender ability':'Defender ability','Attacker ability':'Attacker ability','None / Not applied':'None / Not applied'};
  if(controls[english]&&localizedControlPhrases[english]?.[target])return localizedControlPhrases[english][target];
 }

 if(target==='ja'||target==='en')return null;
 const exact=localizedControlPhrases[base]?.[target];
 if(exact)return exact;
 const statNames={
  'HP':['PV','KP','PS','PS','HP','HP','HP'],
  'Attack':['Attaque','Angriff','Ataque','Attacco','공격','攻击','攻擊'],
  'Defense':['Défense','Verteidigung','Defensa','Difesa','방어','防御','防禦'],
  'Sp. Atk':['Attaque Spé.','Spezial-Angriff','Ataque Especial','Attacco Speciale','특수공격','特攻','特攻'],
  'Sp. Def':['Défense Spé.','Spezial-Verteidigung','Defensa Especial','Difesa Speciale','특수방어','特防','特防'],
  'Speed':['Vitesse','Initiative','Velocidad','Velocità','스피드','速度','速度']
 };
 const order=['fr','de','es','it','ko','zh-Hans','zh-Hant'];
 const idx=order.indexOf(target);
 const compound=String(english).match(/^(Attacker|Defender)?\\s*(HP|Attack|Defense|Sp\\. Atk|Sp\\. Def|Speed)\\s*(stat points|nature modifier|actual stat|stat points slider|stat|stage|max HP|remaining HP|points)$/);
 if(compound&&idx>=0){
  const role=compound[1],stat=statNames[compound[2]][idx],kind=compound[3];
  const roles={Attacker:['Attaquant','Angreifer','Atacante','Attaccante','공격 측','攻击方','攻擊方'],Defender:['Défenseur','Verteidiger','Defensor','Difensore','방어 측','防御方','防禦方']};
  const kinds={
   'stat points':['points de statistique','Statuspunkte','puntos de estadística','punti statistica','능력 포인트','能力点','能力點'],
   'nature modifier':['modificateur de nature','Wesen-Modifikator','modificador de naturaleza','modificatore natura','성격 보정','性格修正','性格修正'],
   'actual stat':['statistique réelle','tatsächlicher Wert','estadística real','statistica effettiva','실제 능력치','实际能力值','實際能力值'],
   'stat points slider':['curseur de points','Punkte-Schieberegler','control de puntos','cursore punti','능력 포인트 슬라이더','能力点滑块','能力點滑桿'],
   stat:['statistique','Wert','estadística','statistica','능력치','能力值','能力值'],
   stage:['niveau','Stufe','nivel','livello','랭크','等级','等級'],
   'max HP':['PV max.','max. KP','PS máximos','PS massimi','최대 HP','最大HP','最大HP'],
   'remaining HP':['PV restants','verbleibende KP','PS restantes','PS rimanenti','남은 HP','剩余HP','剩餘HP'],
   points:['points','Punkte','puntos','punti','포인트','点数','點數']
  };
  const prefix=role?roles[role][idx]+' ':'';
  return prefix+stat+' '+kinds[kind][idx];
 }
 // Normalize composite labels generated from adjacent stat widgets. The original
 // DOM often has no whitespace between the stat name and its suffix.
 const normalized=String(english).replace(/(HP|Attack|Defense|Sp\\. Atk|Sp\\. Def|Speed)(?=(?:actual stat|stat points))/g,'$1 ');
 const extra=normalized.match(/^(Attacker|Defender)?\\s*(HP|Attack|Defense|Sp\\. Atk|Sp\\. Def|Speed)\\s*(nature modifier|actual stat|stat points|stat points slider|stat|stage|points)$/);
 if(extra&&idx>=0){
  const role=extra[1],stat=statNames[extra[2]][idx],kind=extra[3];
  const roles={Attacker:['Attaquant','Angreifer','Atacante','Attaccante','공격 측','攻击方','攻擊方'],Defender:['Défenseur','Verteidiger','Defensor','Difensore','방어 측','防御方','防禦方']};
  const labels={
   'nature modifier':['modificateur de nature','Wesen-Korrektur','modificador de naturaleza','modificatore natura','성격 보정','性格修正','性格修正'],
   'actual stat':['valeur réelle','tatsächlicher Wert','valor real','valore effettivo','실제 능력치','实际能力值','實際能力值'],
   'stat points':['points de statistique','Statuspunkte','puntos de estadística','punti statistica','능력 포인트','能力点','能力點'],
   'stat points slider':['curseur des points','Punkte-Regler','control de puntos','cursore punti','능력 포인트 슬라이더','能力点滑块','能力點滑桿'],
   stat:['statistique','Statuswert','estadística','statistica','능력치','能力值','能力值'],
   stage:['niveau','Stufe','nivel','livello','랭크','等级','等級'],
   points:['points','Punkte','puntos','punti','포인트','点数','點數']
  };
  return (role?roles[role][idx]+' ':'')+stat+' '+labels[kind][idx];
 }
 const maxHp=String(english).match(/^Of max HP:\s*(.+)$/);
 if(maxHp){
  const label={fr:'Des PV max. :',de:'Von max. KP:',es:'De los PS máximos:',it:'Dei PS massimi:',ko:'최대 HP 대비:','zh-Hans':'占最大HP：','zh-Hant':'佔最大HP：'}[target];
  return label+' '+maxHp[1];
 }
 const effectiveness=String(english).match(/^Type effectiveness\s*(×[\d.]+)\s*\/\s*STAB\s*(×[\\d.]+)$/);
 if(effectiveness){
  const label={fr:'Efficacité du type',de:'Typenwirksamkeit',es:'Eficacia de tipo',it:'Efficacia del tipo',ko:'타입 상성','zh-Hans':'属性克制','zh-Hant':'屬性克制'}[target];
  return label+' '+effectiveness[1]+' / STAB '+effectiveness[2];
 }
 const ohko=String(english).match(/^OHKO chance against current HP:\s*(.+)$/);
 if(ohko){
  const label={fr:'Probabilité de K.O. en un coup avec les PV actuels :',de:'Chance auf einen K.O. mit einem Treffer bei aktuellen KP:',es:'Probabilidad de debilitar de un golpe con los PS actuales:',it:'Probabilità di KO in un colpo con i PS attuali:',ko:'현재 HP 기준 일격 KO 확률:','zh-Hans':'当前HP下一击击倒概率：','zh-Hant':'目前HP下一擊擊倒機率：'}[target];
  return label+' '+ohko[1];
 }
 const verify=String(english).match(/^Verification status:\s*(.+)$/);
 if(verify){
  const label={fr:'État de vérification :',de:'Prüfstatus:',es:'Estado de verificación:',it:'Stato della verifica:',ko:'검증 상태:','zh-Hans':'验证状态：','zh-Hant':'驗證狀態：'}[target];
  const pending={fr:'Non vérifié sur console',de:'Nicht auf Hardware geprüft',es:'No verificado en consola',it:'Non verificato su console',ko:'실기 미검증','zh-Hans':'尚未实机验证','zh-Hant':'尚未實機驗證'}[target];
  return label+' '+(verify[1]==='Not hardware-verified'?pending:verify[1]);
 }
 const baseStat=String(english).match(/^Base stat\s+(\d+)$/);
 if(baseStat){
  const label={fr:'Statistique de base',de:'Basiswert',es:'Estadística base',it:'Statistica base',ko:'종족값','zh-Hans':'种族值','zh-Hant':'種族值'}[target];
  return label+' '+baseStat[1];
 }
 const dynamicStat=String(english).match(/^(HP|Attack|Defense|Sp\. Atk|Sp\. Def|Speed)\s+(\d+)$/);
 if(dynamicStat){
  const label=localeUiPhrases[dynamicStat[1]]?.[target]||dynamicStat[1];
  return label+' '+dynamicStat[2];
 }
 const point=String(base).match(/^(HP|Attack|Defense|Sp\. Atk|Sp\. Def|Speed)\s+(\d+)$/);
 if(point){
  const ja={'HP':'HP','Attack':'攻撃','Defense':'防御','Sp. Atk':'特攻','Sp. Def':'特防','Speed':'素早さ'}[point[1]];
  return (localizedTypeNames[ja]?.[target]||localeUiPhrases[point[1]]?.[target]||point[1])+' '+point[2];
 }
 const budget=String(base).match(/^Stat points\s+(\d+)\s*\/\s*(\d+)\s*\(remaining\s+(\d+)\)(.*)$/);
 if(budget){
  const labels={fr:['Points','restants'],de:['Punkte','übrig'],es:['Puntos','restantes'],it:['Punti','rimanenti'],ko:['능력 포인트','남음'],'zh-Hans':['能力点','剩余'],'zh-Hant':['能力點','剩餘']};
  const [name,remaining]=labels[target]||labels.fr;
  return name+' '+budget[1]+' / '+budget[2]+' ('+remaining+' '+budget[3]+')'+budget[4];
 }
 return null;
}
function localizedUi(base){
 const catalog=globalThis.ChlohaLocaleCatalog;
 if(locale==='ja')return base;
 if(localizedTypeNames[base]?.[locale])return localizedTypeNames[base][locale];
 const reviewed={
 'Referenced stat stage (own Defense for Body Press; target Attack for Foul Play)':['Niveau de la statistique utilisée (Défense du lanceur pour Big Splash ; Attaque de la cible pour Tricherie)','Stufe des verwendeten Werts (eigene Verteidigung für Body Press; gegnerischer Angriff für Schmarotzer)','Nivel de la estadística usada (Defensa propia para Plancha Corporal; Ataque del objetivo para Juego Sucio)','Livello della statistica usata (Difesa propria per Schiacciacorpo; Attacco del bersaglio per Ripicca)','참조 능력 랭크 (바디프레스는 자신의 방어, 속임수는 대상의 공격)','引用能力等级（扑击使用自身防御；欺诈使用目标攻击）','引用能力等級（撲擊使用自身防禦；欺詐使用目標攻擊）'],
 'Residual damage (Stealth Rock, weather, poison, etc.) is not calculated automatically. Adjust current HP manually.':['Les dégâts résiduels (Piège de Roc, météo, poison, etc.) ne sont pas calculés automatiquement. Ajustez les PV actuels manuellement.','Restschaden (Tarnsteine, Wetter, Gift usw.) wird nicht automatisch berechnet. Aktuelle KP manuell anpassen.','El daño residual (Trampa Rocas, clima, veneno, etc.) no se calcula automáticamente. Ajusta los PS actuales manualmente.','I danni residui (Levitoroccia, meteo, veleno, ecc.) non sono calcolati automaticamente. Regola manualmente i PS attuali.','스텔스록, 날씨, 독 등의 지속 피해는 자동 계산되지 않습니다. 현재 HP를 직접 조정하세요.','隐形岩、天气、中毒等持续伤害不会自动计算。请手动调整当前HP。','隱形岩、天氣、中毒等持續傷害不會自動計算。請手動調整目前HP。'],
 '16 damage rolls':['16 jets de dégâts','16 Schadenswerte','16 tiradas de daño','16 valori di danno','16가지 데미지 난수','16种伤害随机值','16種傷害隨機值'],
 'Damage values and rounding order have not been verified against Pokémon Champions hardware。':['Les dégâts et l’ordre des arrondis n’ont pas été vérifiés sur Pokémon Champions.','Schadenswerte und Rundungsreihenfolge wurden nicht auf Pokémon Champions geprüft.','Los daños y el orden de redondeo no se han verificado en Pokémon Champions.','I danni e l’ordine degli arrotondamenti non sono stati verificati su Pokémon Champions.','데미지 수치와 반올림 순서는 Pokémon Champions 실기에서 검증되지 않았습니다.','伤害数值和取整顺序尚未通过Pokémon Champions实机验证。','傷害數值與取整順序尚未透過Pokémon Champions實機驗證。'],
 'Ability set to None / Not applied does not guarantee that no ability effect exists.':['Choisir Aucun / Non appliqué ne garantit pas l’absence d’effet de talent.','Keine / Nicht angewendet garantiert nicht, dass kein Fähigkeitseffekt vorliegt.','Elegir Ninguna / No aplicada no garantiza que no haya efectos de habilidad.','Selezionare Nessuna / Non applicata non garantisce l’assenza di effetti dell’abilità.','특성을 없음 / 미적용으로 설정해도 특성 효과가 없다고 보장할 수 없습니다.','特性设为无／不适用，不代表一定不存在特性效果。','特性設為無／不適用，不代表一定不存在特性效果。'],
 'Combined screen, ally support and spread modifiers passed internal tests but are not hardware-verified.':['Les modificateurs combinés des murs, du soutien allié et des attaques de zone ont passé les tests internes, mais pas la vérification sur console.','Kombinierte Effekte von Schutzschirmen, Partnerhilfe und Flächenattacken bestanden interne Tests, sind aber nicht auf Hardware geprüft.','Los modificadores combinados de pantallas, apoyo aliado y ataques de área pasaron pruebas internas, pero no se verificaron en consola.','I modificatori combinati di schermi, supporto alleato e mosse ad area hanno superato i test interni, ma non la verifica su console.','벽, 아군 지원, 전체 공격 보정 조합은 내부 테스트를 통과했지만 실기 검증은 완료되지 않았습니다.','墙壁、队友支援及范围招式的组合修正已通过内部测试，但尚未实机验证。','牆壁、隊友支援及範圍招式的組合修正已通過內部測試，但尚未實機驗證。'],
 'Pokémon images: PokeAPI / Pokémon sprites. Calculations still work if images are unavailable.':['Images Pokémon : PokeAPI / sprites Pokémon. Les calculs fonctionnent même sans images.','Pokémon-Bilder: PokeAPI / Pokémon-Sprites. Berechnungen funktionieren auch ohne Bilder.','Imágenes Pokémon: PokeAPI / sprites Pokémon. Los cálculos funcionan aunque no haya imágenes.','Immagini Pokémon: PokeAPI / sprite Pokémon. I calcoli funzionano anche senza immagini.','포켓몬 이미지: PokeAPI / 포켓몬 스프라이트. 이미지가 없어도 계산할 수 있습니다.','宝可梦图片：PokeAPI／宝可梦图像。即使图片无法显示，也能正常计算。','寶可夢圖片：PokeAPI／寶可夢圖像。即使圖片無法顯示，也能正常計算。'],
 'Unofficial experimental tool · Inputs are processed locally in your browser':['Outil expérimental non officiel · Les données sont traitées localement dans votre navigateur','Inoffizielles experimentelles Tool · Eingaben werden lokal im Browser verarbeitet','Herramienta experimental no oficial · Los datos se procesan localmente en tu navegador','Strumento sperimentale non ufficiale · I dati vengono elaborati localmente nel browser','비공식 실험 도구 · 입력값은 브라우저 내에서 처리됩니다','非官方实验工具 · 输入数据仅在浏览器本地处理','非官方實驗工具 · 輸入資料僅在瀏覽器本機處理'],
 'Defender paralyzed (Speed halved)':['Défenseur paralysé (Vitesse divisée par 2)','Verteidiger paralysiert (Initiative halbiert)','Defensor paralizado (Velocidad a la mitad)','Difensore paralizzato (Velocità dimezzata)','방어 측 마비 (스피드 절반)','防御方麻痹（速度减半）','防禦方麻痺（速度減半）'],
 'Attacker paralyzed (Speed halved)':['Attaquant paralysé (Vitesse divisée par 2)','Angreifer paralysiert (Initiative halbiert)','Atacante paralizado (Velocidad a la mitad)','Attaccante paralizzato (Velocità dimezzata)','공격 측 마비 (스피드 절반)','攻击方麻痹（速度减半）','攻擊方麻痺（速度減半）'],
 'Defender Tailwind (Speed ×2)':['Vent arrière du défenseur (Vitesse ×2)','Rückenwind des Verteidigers (Initiative ×2)','Viento Afín del defensor (Velocidad ×2)','Ventoincoda del difensore (Velocità ×2)','방어 측 순풍 (스피드 ×2)','防御方顺风（速度×2）','防禦方順風（速度×2）'],
 'Attacker Tailwind (Speed ×2)':['Vent arrière de l’attaquant (Vitesse ×2)','Rückenwind des Angreifers (Initiative ×2)','Viento Afín del atacante (Velocidad ×2)','Ventoincoda dell’attaccante (Velocità ×2)','공격 측 순풍 (스피드 ×2)','攻击方顺风（速度×2）','攻擊方順風（速度×2）']
 };
 const reviewedEntry=reviewed[translateRuntime(base)]||reviewed[base];
 if(reviewedEntry){
  const index=['fr','de','es','it','ko','zh-Hans','zh-Hant'].indexOf(locale);
  if(index>=0)return reviewedEntry[index];
 }
 const dynamic=localizedDynamicControl(base,locale)||localizedBattlefield(base,locale)||localizedLiveSummary(base,locale)||localizedVerdict(base,locale)||localizedDamageRange(base,locale);
 if(dynamic)return dynamic;
 const direct=expandedSettingsTranslations[base]?.[locale]||expandedSettingsTranslations[translateRuntime(base)]?.[locale]||expandedLongTextTranslations[base]?.[locale]||expandedLongTextTranslations[translateRuntime(base)]?.[locale]||expandedPanelTranslations[base]?.[locale]||expandedPanelTranslations[translateRuntime(base)]?.[locale]||localeUiPhrases[base]?.[locale]||localeUiPhrases[translateRuntime(base)]?.[locale];
 if(direct)return direct;
 if(!catalog)return translateRuntime(base);
 const source=catalog.ja||{};
 const entry=Object.keys(source).find(key=>source[key]===base||catalog.en?.[key]===base);
 if(entry&&catalog[locale]?.[entry])return catalog[locale][entry];
 return translateRuntime(base);
}
const original=new WeakMap();
const lastRenderedText=new WeakMap();
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
  const cachedRendered=lastRenderedText.get(node);
  // Preserve original Japanese when switching between non-English locales.
  // Treat a changed value as fresh calculator output, not a translation.
  if(cached===undefined||(trim!==cached&&trim!==cachedRendered))original.set(node,recoverJapanese(trim));
  const base=original.get(node);
  const next=locale==='ja'?base:localizedUi(base);
  if(trim!==next)node.nodeValue=value.replace(trim,next);
  lastRenderedText.set(node,next);
 }
 for(const element of [root,...root.querySelectorAll('[title],[aria-label],[placeholder]')]){
  for(const attr of ['title','aria-label','placeholder']){
   if(!element.hasAttribute(attr))continue;
   const value=element.getAttribute(attr);
   let originals=originalAttributes.get(element);
   if(!originals){originals={};originalAttributes.set(element,originals);}
   const previous=originals[attr];
   const rendered=lastRenderedAttributes.get(element)?.[attr];
   if(previous===undefined||(value!==previous&&value!==rendered))originals[attr]=attributeLabels[value]?value:recoverJapanese(value);
   const base=originals[attr];
   const next=locale==='ja'?base:localizedUi(translateAccessibilityLabel(base));
   if(next!==value)element.setAttribute(attr,next);
   let renderedAttributes=lastRenderedAttributes.get(element);
   if(!renderedAttributes){renderedAttributes={};lastRenderedAttributes.set(element,renderedAttributes);}
   renderedAttributes[attr]=next;
  }
 }
}
function setLocale(next){
 locale=supportedLocales.includes(next)?next:'ja';
 document.documentElement.lang=locale;
 try{localStorage.setItem(key,locale);}catch{}
 translate(document.getElementById('app')||document.body);
 // Legacy verification notes live in the original document outside the v0.182 app.
 const legacyAudit=document.getElementById('auditSummary')?.closest('details');
 if(legacyAudit)translate(legacyAudit);
 translateOptions();
 // Dragon Darts controls are appended directly to body, outside #app.
 // Keep their native Android select labels synchronized with the active locale.
 const panelLabels={
  flingPowerPanel:['なげつけるの威力（持ち物に応じて手動指定） ','Fling power (select manually based on held item) '],
  beatUpPanel:['ふくろだたき：参加ポケモンの攻撃種族値（カンマ区切り・ひんし／状態異常は除外） ','Beat Up: participating Pokémon base Attack stats (comma-separated; exclude fainted or statused Pokémon) ']
 };
 for(const [id,labels] of Object.entries(panelLabels)){
  const panel=document.getElementById(id);
  if(panel?.firstChild?.nodeType===3)panel.firstChild.nodeValue=labels[locale==='en'?1:0];
 }
 const darts=document.getElementById('dragonDartsHits');
 if(darts){
  for(const option of darts.options){
   const ja=option.value==='2'?'選択した相手に2回命中':'選択した相手に1回命中';
   const en=option.value==='2'?'2 hits on selected target':'1 hit on selected target';
   const label=locale==='en'?en:ja;
   option.textContent=label;
   option.label=label;
  }
 }
 const dartsPanel=document.getElementById('dragonDartsPanel');
 if(dartsPanel?.firstChild?.nodeType===3){
  dartsPanel.firstChild.nodeValue=locale==='en'?'Dragon Darts: hits on selected target (choose based on both opposing Pokémon in doubles) ':'ドラゴンアロー：選択した相手への命中回数（ダブルでは相手2体の状況から選択） ';
 }

 const select=document.getElementById('chloha-locale');
 if(select)select.value=locale;
 const localeLabel=document.getElementById('chloha-locale-control');
 if(localeLabel?.firstChild?.nodeType===3)localeLabel.firstChild.nodeValue=locale==='en'?'Language ':'Language / 言語 ';
 if(select)select.setAttribute('aria-label',locale==='en'?'Language':'Language / 言語');
 document.dispatchEvent(new CustomEvent('chloha:localechange',{detail:{locale}}));
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
 for(const [value,title] of [['ja','日本語'],['en','English'],['fr','Français'],['de','Deutsch'],['es','Español'],['it','Italiano'],['ko','한국어'],['zh-Hans','简体中文'],['zh-Hant','繁體中文']]){
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
     if(parent&&!parent.closest('script,style,textarea,option,[data-no-translate]'))translate(parent);
    }
    if(record.type==='attributes'&&record.target.nodeType===1)translate(record.target);
    for(const added of record.addedNodes){
     if(added.nodeType===1&&added.id!=='chloha-locale-control')translate(added);
     else if(added.nodeType===3&&added.parentElement)translate(added.parentElement);
    }
   }
   translateOptions();
  });
  observer.observe(app,{childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder'],subtree:true});
  // Refresh immediately before Android/Brave opens the native select sheet.
  app.addEventListener('pointerdown',event=>{if(event.target.closest('select'))translateOptions();},true);
  app.addEventListener('focusin',event=>{if(event.target.closest('select'))translateOptions();},true);
 }
 window.ChlohaLocale=Object.freeze({get:()=>locale,set:setLocale,typeName:name=>localizedPokemonType(name,locale),text:localizedUi});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
else initialize();
})();