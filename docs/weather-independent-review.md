# 天候特性と防御補正の独立監査（修正前）

2026-11-17 時点の埋め込み図鑑、`ability-data-v0184.js`、`damage-engine-v0184.js` を確認した。これは修正の承認ではない。修正後の動作検証は別途必要。

## 登録済みの「ゆきふらし」候補

`index.html` 内の `ChlohaPokemonDB.pokemon`（373件）の形態別能力欄を UTF-8 で解析した。タイプ欄は日本語の `types` 配列で、以下のとおり。

| 図鑑ID | 形態 | タイプ | 能力欄 |
| --- | --- | --- | --- |
| `gw091_21` | アローラキュウコン | こおり、フェアリー | ゆきがくれ、ゆきふらし |
| `candidate093_29` | ユキノオー | くさ、こおり | ゆきふらし、ぼうおん |
| `candidate093_30` | メガユキノオー | くさ、こおり | ゆきふらし |
| `roster_v0104_026` | メガユキメノコ | こおり、ゴースト | ゆきふらし |
| `roster_v0106_021` | アマルルガ | いわ、こおり | フリーズスキン、ゆきふらし |
| `roster_v0107_001` | バイバニラ | こおり | アイスボディ、ゆきふらし、くだけるよろい |

対照：`roster_v0105_011` の通常ユキメノコ（こおり、ゴースト）は「ゆきがくれ、のろわれボディ」で、ゆきふらしを持たない。公式図鑑も通常形態に Snow Cloak、メガ形態に Snow Warning を記載する：https://www.pokemon.com/us/pokedex/0478 。公式 Champions 記事はアローラキュウコンの Snow Warning と雪による防御 50% 増を明記する：https://www.pokemon.com/us/features/pokemon-champions-how-to-build-a-mega-malamar-team 。公式世界大会のチーム表にもバイバニラ、アローラキュウコンの Snow Warning が載る：https://championships.pokemon.com/en-us/events/team-list?division=masters&game=vg&listId=uzDKzXEQ7V49A8kynuq2 、https://championships.pokemon.com/en-us/events/team-list?division=masters&game=vg&listId=X5Q7iBoFsLWpBYCNXFXd 。ユキノオーとメガユキノオーは公式解説に双方の Snow Warning が記載される：https://www.pokemon.com/us/features/rejuvenate-old-favorites-with-mega-evolution 。アマルルガの現行 Champions における能力については独立の公式資料を確認できていないため、上表はローカル図鑑の登録内容を示す。

## 修正前の再現

`tests/helpers/v0184-engine-harness.cjs` の `loadCurrent()` でスクリプトを読み込み、レベル50・威力80・攻撃150・防御101・防御側こおりタイプ・天候なし・他の特性なし等を与えた。同じ入力で防御側能力を `none` にすると16段階のダメージ `[67,69,69,70,72,72,73,73,75,75,76,76,78,78,79,81]` を返す。防御側能力を `snowWarning` に替えると `持ち物・特性・タイプ一致補正の指定が不正` を投げる。修正前の `DEFENDER_ABILITY_IDS` に天候特性4種がなく、`validate()` が拒否することと一致する。`index.html` の `defensiveAbilities` は当初から対応する日本語名を ID に写しているため、UI 上の選択値とエンジンの許可リストが食い違う。

## 計算仕様と修正後の検証点

`damage-engine-v0184.js` の防御側天候補正は、砂嵐中のいわタイプ特防、雪中のこおりタイプ防御に1.5倍を適用する。ランク適用後、他の防御補正より先に `pokeRound(v, 6144)` を実行する。整数101の結果は151（0.5を切り捨て）。特殊技でも `psyshock` は防御参照として雪補正の対象、砂の特防補正の対象外。Champions 対応の Pokémon Showdown 計算機実装でも段階適用後に `pokeRound(defense * 3 / 2)` を直接適用し、`hitsPhysical` で判定する：https://github.com/smogon/damage-calc/blob/master/calc/src/mechanics/champions.ts 。同計算機の丸め関数はちょうど0.5を切り捨てる：https://github.com/smogon/damage-calc/blob/master/calc/src/mechanics/util.ts 。

修正後に確認すべきもの：上表の6形態を防御側にして Snow Warning を選択でき、天候「なし」から雪が推定されること。通常ユキメノコに Snow Warning を出さないこと。砂嵐・雪の特防／防御と `psyshock`、奇数値101の丸め、明示した天候が特性推定より優先されること。防御側のほかの天候特性3種とフィールド生成特性4種も同じ許可リストの不整合がないこと。変更後にエンジンと UI の双方を通して再試験するまで合格とはしない。

補足の境界：両側に異なる天候生成特性があり天候「なし」のとき、現行推定は攻撃側を無条件に優先する。実戦の発動順はこの入力だけでは決定できない。また Champions 計算機は攻撃側の Mega Sol による砂・雪の防御補正無効化を特別扱いするが、現行エンジンにはこの特性自体がない。どちらも今回の防御側能力 ID 拒否の修正範囲とは区別して追跡する。
