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
const nameGroups=window.ChlohaNames||{};
const entityNames=Object.assign({},...Object.values(nameGroups));
const reverseNames=Object.fromEntries(Object.entries(entityNames).map(([ja,en])=>[en,ja]));
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
 const selects=[...root.querySelectorAll('select'),...['ragingBullForm','auraWheelForm'].map(id=>document.getElementById(id)).filter(Boolean)];
 for(const select of selects){
  if(select.id==='chloha-locale')continue;
  for(const option of select.options){
   if(!optionOriginal.has(option))optionOriginal.set(option,reverseNames[option.textContent]||option.textContent);
   const base=optionOriginal.get(option);
   const ability=base.match(/^(.+?)（(一部技のみ対応|対応|効果未対応|未対応)）$/);
   const abilityEnglish={'トランジスタ':'Transistor','りゅうのあぎと':"Dragon's Maw",'アナライズ':'Analytic','すてみ':'Reckless','ねつぼうそう':'Flare Boost','すいほう':'Water Bubble','よわき':'Defeatist','ひひいろのこどう':'Orichalcum Pulse','ハドロンエンジン':'Hadron Engine','フェアリーオーラ':'Fairy Aura','ダークオーラ':'Dark Aura','オーラブレイク':'Aura Break','はがねのせいしん':'Steely Spirit','プラス':'Plus','マイナス':'Minus','かたいツメ':'Tough Claws','はがねつかい':'Steelworker','いわはこび':'Rocky Payload','すなのちから':'Sand Force','パンクロック':'Punk Rock','フェアリースキン':'Pixilate','スカイスキン':'Aerilate','フリーズスキン':'Refrigerate','エレキスキン':'Galvanize','ドラゴンスキン':'Dragonize','ノーマルスキン':'Normalize','しんりょく':'Overgrow','もうか':'Blaze','げきりゅう':'Torrent','むしのしらせ':'Swarm'};
   const move=base.match(/^(.+?)（([^（）]+) \/ ([^（）]+)）(［[^］]+］)$/);
   const moveStatuses={'［計算未対応］':' [Unsupported]','［基本ダメージのみ・実機未照合］':' [Basic damage only; unverified]','［計算試算・実機未照合］':' [Estimated; unverified]'};
   const typeNames={'ノーマル':'Normal','ほのお':'Fire','みず':'Water','でんき':'Electric','くさ':'Grass','こおり':'Ice','かくとう':'Fighting','どく':'Poison','じめん':'Ground','ひこう':'Flying','エスパー':'Psychic','むし':'Bug','いわ':'Rock','ゴースト':'Ghost','ドラゴン':'Dragon','あく':'Dark','はがね':'Steel','フェアリー':'Fairy'};
   const pokemonOption=/^db(?:Att|Def)Pokemon$/.test(select.id);
   const pokemonEnglish=pokemonOption?nameGroups.pokemon?.[option.value]:null;
   const typeEnglish=typeNames[base];
   const next=locale==='en'?(pokemonEnglish||typeEnglish||(ability
    ? (abilityEnglish[ability[1]]||entityNames[ability[1]]||dictionary[ability[1]]||translateRuntime(ability[1]))+
      (ability[2]==='対応'?' (supported)':ability[2]==='一部技のみ対応'?' (partially supported)':' (unsupported)')
    : move
     ? (entityNames[move[1]]||move[1])+' ('+(typeNames[move[2]]||move[2])+' / '+(move[3]==='可変'?'Variable':move[3])+')'+(moveStatuses[move[4]]||move[4])
     : (selectLabels[base]||entityNames[base]||dictionary[base]||translateRuntime(base)))):base;
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
 if(/^\d+[–-]\d+ damage$/.test(value))return value.replace(' damage',' ダメージ').replace('–','〜');
 if(/^Guaranteed survival\s*[·・]/.test(value))return value.replace('Guaranteed survival','確定耐え');
 let result=value;
 for(const [en,ja] of reverseUiEntries)result=result.split(en).join(ja);
 return result;
}
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
  if(cached===undefined||(trim!==cached&&trim!==cachedRendered))original.set(node,recoverJapanese(trim));
  const base=original.get(node);
  const next=locale==='en'?translateRuntime(base):base;
  if(trim!==next)node.nodeValue=value.replace(trim,next);
 }
 for(const element of [root,...root.querySelectorAll('[title],[aria-label],[placeholder]')]){
  for(const attr of ['title','aria-label','placeholder']){
   if(!element.hasAttribute(attr))continue;
   const value=element.getAttribute(attr);
   let originals=originalAttributes.get(element);
   if(!originals){originals={};originalAttributes.set(element,originals);}
   const previous=originals[attr];
   const previousEnglish=previous===undefined?null:(translateAccessibilityLabel(previous));
   if(previous===undefined||(value!==previous&&value!==previousEnglish))originals[attr]=attributeLabels[value]?value:recoverJapanese(value);
   const base=originals[attr];
   const next=locale==='en'?(translateAccessibilityLabel(base)):base;
   if(next!==value)element.setAttribute(attr,next);
  }
 }
}
function setLocale(next){
 locale=next==='en'?'en':'ja';
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
 window.ChlohaLocale=Object.freeze({get:()=>locale,set:setLocale});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
else initialize();
})();