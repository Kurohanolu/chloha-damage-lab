# v0.186 Mechanics Coverage

生成元: `scripts/v0186-mechanics-coverage.cjs`。Issue #61 / Draft PR #62。新機能・新しいID・対応ルールの追加を目的としない監査。

**検証単位を分ける。** Pokémon行は6種族値・タイプ集合・体重、Move行は基礎データと記載条件のダメージ、Ability名行は登録名の対応範囲、役割別Ability/Item行は該当モデルの検査である。同じ実体が異なる役割に現れるため、総数はユニークな対戦効果数ではない。試験ケース数を分母にして検証率を水増ししない。

Verifiedは記載した自動検証の範囲内であり、Championsの全状況や実機一致の認証ではない。対応する最新コミットの必須CIが未完了・失敗なら、この表だけで公開可能とは判定しない。Partialは制限や手動前提が残る。Unsupportedは今回追加しない。

## 集計

| 状態 | 件数 |
|---|---:|
| Verified | 870 |
| Unverified | 2 |
| Incorrect | 0 |
| Partial | 153 |
| Unsupported | 143 |
| Not Applicable | 16 |
| 合計 | 1184 |

- 評価対象（Not Applicableを除く）: **1168**。実装存在数（Partial/Unverified/Incorrectを含む）: **1025**。存在としての対応率: **87.76%**。
- 完全にVerifiedとした項目 / 実装存在数: **870/1025 = 84.88%**。PartialをVerifiedに足さない。評価対象全体での検証率: **74.49%**。
- Pokémon/form **373**（メガ形態 **82**）: データ一致372、資料不一致1。335技のタイプ・分類・基礎威力は固定版のChampions/Gen9参照に一致。
- 計算可能な既存技: **321/334 = 96.11%**。残り13は従来から標準計算対象外。別に変化技1。除外技の新規実装はしない。
- 役割付き特性: 攻撃70 / 防御39、持ち物: 攻撃22 / 防御20（noneを除く）。名簿中の特性名: **222**。
- 過去の能力画面確認フラグ: **102**。これを実機ダメージ一致件数に加算しない。今回新たに収集した実機ダメージ証拠: **0**。
- Sheer Force: 明示的な既存5技ホワイトリストを維持。参照の対象候補124技に拡張せず **Partial** とする。

## カテゴリ別件数

| カテゴリ | 総数 | Verified | Unverified | Incorrect | Partial | Unsupported | Not Applicable |
|---|---:|---:|---:|---:|---:|---:|---:|
| Pokémon / forms | 373 | 372 | 1 | 0 | 0 | 0 | 0 |
| Moves | 335 | 264 | 0 | 0 | 57 | 0 | 14 |
| Attack abilities | 70 | 36 | 0 | 0 | 34 | 0 | 0 |
| Defense abilities | 39 | 30 | 0 | 0 | 7 | 0 | 2 |
| Roster ability names | 222 | 49 | 0 | 0 | 30 | 143 | 0 |
| Attack items | 22 | 21 | 0 | 0 | 1 | 0 | 0 |
| Defense items | 20 | 20 | 0 | 0 | 0 | 0 | 0 |
| Type chart | 18 | 18 | 0 | 0 | 0 | 0 | 0 |
| Core / routed mechanics | 47 | 24 | 0 | 0 | 23 | 0 | 0 |
| Weather | 4 | 4 | 0 | 0 | 0 | 0 | 0 |
| Terrain | 4 | 4 | 0 | 0 | 0 | 0 | 0 |
| Shared calculations | 20 | 18 | 1 | 0 | 1 | 0 | 0 |
| Locale regression | 9 | 9 | 0 | 0 | 0 | 0 | 0 |
| Feedback regression | 1 | 1 | 0 | 0 | 0 | 0 | 0 |

## 証拠・制限

- [不具合台帳](v0186-defect-register.md): 修正の入力・旧結果・期待結果・出典と24件の分類。原本300件を保持し、269件不変・26数値訂正・5トレース/付随情報訂正。
- 独立参照: `@smogon/calc@0.12.0` / `d7a69cf40616057ef40faf7623df7a628e58b535`。Champions generation 0 と Gen9 を区別する。
- 固定シード `0x0186ac`: 4,000条件 / Champions 494、Gen9 3506。登録技256件・657条件を追加照合。
- 役割別特性321条件、タグ2,680所属＋2,672数値、連続技126分布、体重2,068条件。これらの件数は上の項目検証率の分母に使わない。
- [Champions差分](v0186-champions-parity.md) / [実機検証計画](v0186-hardware-test-plan.md)。所有者がノココッチの現行Champions未登場・提示画像のSVモードを確認。H01の現行リリース保留を解除し、候補データの特攻58/85はUnverifiedのまま将来へ引き継ぐ。
- 極端な非実戦手入力値、未表現の状態変化・命中補正・全ヒット別能力変化は一律に検証済みとしない。

## 全数台帳

### Pokémon / forms

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| dragonite | カイリュー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| tyranitar | バンギラス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| garchomp | ガブリアス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| venusaur | フシギバナ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| charizard | リザードン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_charizard_x | メガリザードンX | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_charizard_y | メガリザードンY | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| hydreigon | サザンドラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| goodra | ヌメルゴン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| hisuian_goodra | ヒスイヌメルゴン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| kommo_o | ジャラランガ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| dragapult | ドラパルト | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| archaludon | ブリジュラス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| mega_venusaur | メガフシギバナ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| blastoise | カメックス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_blastoise | メガカメックス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| meganium | メガニウム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_meganium | メガメガニウム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| typhlosion | バクフーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| hisuian_typhlosion | ヒスイバクフーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| feraligatr | オーダイル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_feraligatr | メガオーダイル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_absol_z | メガアブソルZ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_garchomp_z | メガガブリアスZ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_lucario_z | メガルカリオZ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| mega_salamence | メガボーマンダ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_golisopod | メガグソクムシャ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_baxcalibur | メガセグレイブ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw091_01 | メガゲンガー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_02 | ゲンガー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_03 | メガカイリュー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_04 | メガメタグロス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_05 | メタグロス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_06 | ボーマンダ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_07 | メガライチュウY | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_08 | ライチュウ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_09 | メガスターミー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_10 | スターミー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_11 | ウルガモス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_12 | ギルガルド(シールド) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_13 | ギルガルド(ブレード) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_14 | ドヒドイデ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_15 | ゴリランダー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_16 | エースバーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_17 | マスカーニャ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw091_18 | パーモット | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw091_19 | ハッサム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_20 | ブラッキー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_21 | アローラキュウコン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw091_22 | ゲッコウガ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_01 | ドダイトス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_02 | ゴウカザル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_03 | エンペルト | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_04 | ジャローダ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw092_05 | エンブオー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw092_06 | メガエンブオー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw092_07 | ダイケンキ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw092_08 | ヒスイダイケンキ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw092_09 | ブリガロン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_10 | マフォクシー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_11 | ジュナイパー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_12 | ヒスイジュナイパー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_13 | ガオガエン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_14 | アシレーヌ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_15 | ラウドボーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw092_16 | ウェーニバル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw092_17 | メガガブリアス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_18 | ミミッキュ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_19 | エルフーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw092_20 | ラグラージ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_21 | メガラグラージ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_22 | サーナイト | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_23 | メガサーナイト | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_24 | コータス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_25 | ミロカロス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_26 | ムクホーク | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_27 | メガムクホーク | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_28 | ニンフィア | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_29 | メガゲッコウガ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw092_30 | メガハッサム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_01 | ピカチュウ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_02 | アローラライチュウ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_03 | ピクシー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_04 | キュウコン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_05 | ウインディ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_06 | ヒスイウインディ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_07 | ギャラドス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_08 | メガギャラドス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_09 | ラプラス | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| candidate093_10 | カビゴン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_11 | ヤドラン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_12 | メガヤドラン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_13 | デンリュウ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_14 | メガデンリュウ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_15 | ヘラクロス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_16 | メガヘラクロス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_17 | ハピナス | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| candidate093_18 | エアームド | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_19 | マリルリ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_20 | キノガッサ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| candidate093_21 | クチート | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_22 | メガクチート | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_23 | ボスゴドラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_24 | メガボスゴドラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_25 | チャーレム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_26 | メガチャーレム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_27 | チルタリス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_28 | メガチルタリス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| candidate093_29 | ユキノオー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_30 | メガユキノオー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_31 | ロトム(ウォッシュ) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_32 | ロトム(ヒート) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_33 | ロトム(カット) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_34 | ロトム(フロスト) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_35 | ロトム(スピン) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_36 | ロトム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_37 | トゲキッス | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| candidate093_38 | ドリュウズ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| candidate093_39 | ナットレイ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| candidate093_40 | シャンデラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| pelipper | ペリッパー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| indeedee_m | イエッサン(オス) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| indeedee_f | イエッサン(メス) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| basculegion_m | イダイトウ(オス) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| basculegion_f | イダイトウ(メス) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| ceruledge | ソウブレイズ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| sneasler | オオニューラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| bastiodon | トリデプス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| v097_001 | メガドリュウズ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| v097_002 | メガシビルドン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| v097_003 | メガカエンジシ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| v097_004 | メガスコヴィラン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| v098_133 | プクリン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| v098_134 | ペルシアン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| v098_135 | マルノーム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| v098_136 | ゴーゴート | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega_clefable_v0101 | メガピクシー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_01 | アローラペルシアン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_02 | カモネギ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_03 | バリヤード | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_04 | グソクムシャ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_05 | インテレオン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_06 | フォクスライ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_07 | ストリンダー(ハイ) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_08 | ストリンダー(ロー) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_09 | オトスパス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0103_10 | ニャイキング | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_11 | ネギガナイト | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_12 | バチンウニ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_13 | オリーヴァ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_14 | マフィティフ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_15 | セグレイブ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_16 | イキリンコ(グリーン) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_17 | イキリンコ(ブルー) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_18 | イキリンコ(イエロー) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0103_19 | イキリンコ(ホワイト) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0104_001 | メガスピアー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_002 | メガピジョット | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_003 | メガライチュウX | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_004 | メガフーディン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_005 | メガウツボット | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_006 | メガガルーラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_007 | メガカイロス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_008 | メガプテラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_009 | メガエアームド | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_010 | メガヘルガー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_011 | メガバンギラス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_012 | メガジュカイン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_013 | メガバシャーモ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_014 | メガライボルト | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_015 | メガブリガロン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_016 | メガマフォクシー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_017 | メガフラエッテ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_018 | メガミミロップ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_019 | メガヤミラミ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_020 | メガサメハダー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_021 | メガバクーダ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_022 | メガジュペッタ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_023 | メガチリーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_024 | メガオニゴーリ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_025 | メガエルレイド | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0104_026 | メガユキメノコ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0104_027 | メガタブンネ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0104_028 | メガペンドラー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0104_029 | メガズルズキン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_030 | メガシャンデラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_031 | メガゴルーグ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_032 | メガニャオニクス(オス) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_033 | メガニャオニクス(メス) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_034 | メガカラマネロ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_035 | メガガメノデス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_036 | メガドラミドロ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_037 | メガルチャブル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_038 | メガケケンカニ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_039 | メガジジーロン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_040 | メガタイレーツ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0104_041 | メガキラフロル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0104_042 | スピアー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_043 | ピジョット | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_044 | フーディン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_045 | ウツボット | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_046 | ガルーラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_047 | カイロス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_048 | プテラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_049 | ヘルガー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0104_050 | ジュカイン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_001 | ライボルト | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_002 | バシャーモ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_003 | ミミロップ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_004 | ヤミラミ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_005 | サメハダー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_006 | バクーダ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_007 | ジュペッタ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_008 | チリーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_009 | オニゴーリ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_010 | エルレイド | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_011 | ユキメノコ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_012 | タブンネ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_013 | ペンドラー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_014 | ズルズキン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_015 | ゴルーグ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_016 | ニャオニクス(オス) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_017 | ニャオニクス(メス) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_018 | カラマネロ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_019 | ガメノデス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_020 | ドラミドロ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_021 | ルチャブル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_022 | ケケンカニ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_023 | ジジーロン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_024 | タイレーツ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_025 | キラフロル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_026 | シビルドン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_027 | カエンジシ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_028 | スコヴィラン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_029 | フラエッテ(えいえんのはな) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_030 | アブソル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_031 | ルカリオ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_032 | マニューラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_033 | アーマーガア | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_034 | サーフゴー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_035 | ドドゲザン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_036 | カバルドン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_040 | オーロンゲ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_041 | ドータクン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0105_042 | クレベース | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_043 | ヒスイクレベース | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_044 | エレザード | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0105_045 | トリトドン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0105_046 | モロバレル | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0105_047 | デカヌチャン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_048 | イッカネズミ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_049 | コノヨザル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0105_050 | イーユイ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_001 | ラフレシア | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_002 | ハリーセン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_003 | ムシャーナ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0106_004 | ハリーマン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0106_005 | ハカドッグ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0106_006 | パルデアケンタロス(かくとう) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_007 | パルデアケンタロス(ほのお) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_008 | パルデアケンタロス(みず) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_009 | メタモン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_010 | シャワーズ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_011 | サンダース | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_012 | ブースター | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_013 | エーフィ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_014 | リーフィア | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0106_015 | グレイシア | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0106_016 | イーブイ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_017 | レントラー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_018 | ラムパルド | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_019 | ブロスター | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_020 | ガチゴラス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_021 | アマルルガ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_022 | カミツオロチ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0106_023 | クレッフィ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_024 | エレキブル | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_025 | ブーバーン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_026 | ポリゴン2 | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_027 | ポリゴンZ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_028 | ヤドキング | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_029 | ガラルヤドキング | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_030 | ガラルヤドラン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_031 | アローラガラガラ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_032 | アローラベトベトン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_033 | ガラルマタドガス | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_034 | ガラルサニーゴ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_035 | サニゴーン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_036 | バルジーナ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_037 | ウォーグル | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_038 | ヒスイウォーグル | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_039 | トリミアン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_040 | ビビヨン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_041 | ヒスイゾロアーク | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0106_042 | ゾロアーク | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0106_043 | ロズレイド | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_044 | メレシー | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0106_045 | ペロリーム | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_046 | フレフワン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_047 | アマージョ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_048 | ヤレユータン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_049 | ナゲツケサル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0106_050 | バンバドロ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0107_001 | バイバニラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_002 | ブリムオン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_003 | ハラバリー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_004 | アーボック | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0107_005 | サンドパン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_006 | アローラサンドパン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_007 | ニドクイン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_008 | ニドキング | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_009 | ゴルダック | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_010 | オコリザル | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_011 | ドククラゲ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_012 | ゴローニャ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_013 | アローラゴローニャ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_014 | ギャロップ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_015 | ガラルギャロップ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_016 | パルシェン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_017 | マルマイン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_018 | ヒスイマルマイン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_019 | ナッシー | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_020 | アローラナッシー | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_021 | サワムラー | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_022 | エビワラー | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_023 | カポエラー | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_024 | モルフォン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_025 | ケンタロス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| roster_v0107_026 | ラッキー | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_027 | モジャンボ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_028 | キングドラ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_029 | ドンファン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_030 | ヌオー | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_031 | キリンリキ | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_032 | リキキリン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_033 | ノココッチ | Unverified | 現行Champions未登場（所有者確認）。SV画像はSpA85/実数値105。既存58は未検証の候補データとして保持し、将来登場時に再監査。 | なし |
| roster_v0107_034 | ナマズン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_035 | ジーランス | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_036 | ドクロッグ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_037 | グライオン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_038 | マンムー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_039 | ヨノワール | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_040 | ダストダス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_041 | ワルビアル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_042 | デスカーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| roster_v0107_044 | ブルンゲル | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_045 | オノノクス | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| roster_v0107_046 | クリムガン | Verified | 6種族値・タイプ集合・体重 / Gen9データ一致 | なし |
| mega-absol | メガアブソル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega-lucario | メガルカリオ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| steelix | ハガネール | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| mega-steelix | メガハガネール | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | なし |
| gw_screen_006 | ドサイドン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_026 | ミルホッグ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_027 | レパルダス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_028 | ヤナッキー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_029 | バオッキー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_030 | ヒヤッキー | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_036 | ローブシン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_046 | ランクルス | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_052 | バリコオル | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_053 | デスバーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_054 | マホイップ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_060 | モルペコ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_062 | アヤシシ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_063 | バサギリ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_078 | キョジオーン | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_079 | グレンアルマ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_085 | クエスパトラ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_087 | イルカマン(ナイーブ) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_088 | イルカマン(マイティ) | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_089 | ミミズズ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |
| gw_screen_099 | ヤバソチャ | Verified | 6種族値・タイプ集合・体重 / Championsデータ一致 | 過去の能力画面確認フラグ。今回再実測なし。 |

### Moves

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| earthquake | じしん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| dragonClaw | ドラゴンクロー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| outrage | げきりん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| rockSlide | いわなだれ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| crunch | かみくだく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| flamethrower | かえんほうしゃ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| fireBlast | だいもんじ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| airSlash | エアスラッシュ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| solarBeam | ソーラービーム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| sludgeBomb | ヘドロばくだん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| leafStorm | リーフストーム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| hydroPump | ハイドロポンプ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| iceBeam | れいとうビーム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| thunderbolt | 10まんボルト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| protect | まもる | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| highHorsepower | 10まんばりき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| heatWave | ねっぷう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| icyWind | こごえるかぜ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| makeItRain | ゴールドラッシュ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| darkPulse | あくのはどう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| psychic | サイコキネシス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| psyshock | サイコショック | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| clearSmog | クリアスモッグ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| frostBreath | こおりのいぶき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| ancientPower | げんしのちから | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| ddLariat | DDラリアット | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gravApple | Gのちから | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| hyperVoice | ハイパーボイス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| closeCombat | インファイト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| shadowBall | シャドーボール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| moonblast | ムーンフォース | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| dazzlingGleam | マジカルシャイン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| waterfall | たきのぼり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| flareBlitz | フレアドライブ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| woodHammer | ウッドハンマー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| ironHead | アイアンヘッド | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| energyBall | エナジーボール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| dracoMeteor | りゅうせいぐん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| braveBird | ブレイブバード | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| suckerPunch | ふいうち | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| earthPower | だいちのちから | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| flashCannon | ラスターカノン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| playRough | じゃれつく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| surf | なみのり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| sludgeWave | ヘドロウェーブ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| auraSphere | はどうだん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| bodyPress | ボディプレス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| electroBall | エレキボール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| eruption | ふんか | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| waterSpout | しおふき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| thunder | かみなり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| blizzard | ふぶき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| discharge | ほうでん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| muddyWater | だくりゅう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| bugBuzz | むしのさざめき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| stoneEdge | ストーンエッジ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| liquidation | アクアブレイク | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| poisonJab | どくづき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| xScissor | シザークロス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| wildCharge | ワイルドボルト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_61 | アシッドボム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_62 | アーマーキャノン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_63 | エアカッター | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_64 | エレキネット | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_65 | チャージビーム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_66 | ねっさのだいち | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_67 | ボルトチェンジ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_68 | マジカルフレイム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_69 | マッドショット | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_70 | むしのていこう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_71 | メテオビーム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v095_72 | ほのおのまい | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_073 | アイアンテール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_074 | アイアンローラー | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| v096_075 | アイススピナー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_076 | アクアカッター | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_077 | アクアジェット | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_078 | アクアテール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_079 | アクセルロック | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_080 | アクロバット | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_081 | アームハンマー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_082 | イカサマ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_083 | かげうち | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_084 | きゅうけつ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_085 | サイコファング | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_086 | シェルブレード | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_087 | しねんのずつき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_088 | シャドークロー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_089 | しんそく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_090 | すてみタックル | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_091 | スマートホーン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_092 | タネばくだん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_093 | ダブルウイング | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| v096_094 | トリックフラワー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_095 | ねこだまし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_096 | バレットパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_097 | パワーウィップ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| v096_098 | ワイドブレイカー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p001 | 3ぼんのや | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p002 | アイスハンマー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p003 | アクアステップ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p004 | あなをほる | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p005 | あばれる | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p006 | いかりのまえば | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0169_p007 | ウェーブタックル | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p008 | うちおとす | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p009 | ウッドホーン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p010 | うっぷんばらし | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p011 | おはかまいり | Verified | 既存の変動威力境界テスト＋PSコールバックの仕様照合。 | なし |
| gw0169_p012 | オーラぐるま | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p013 | カウンター | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0169_p014 | かえんボール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p015 | かかとおとし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p016 | かげぬい | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p017 | かみつく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p018 | かみなりのキバ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p019 | かみなりパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p020 | がむしゃら | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0169_p021 | からげんき | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p022 | かわらわり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p023 | がんせきアックス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p024 | がんせきふうじ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p025 | がんせきほう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p026 | きあいパンチ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p027 | ギガインパクト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p028 | きしかいせい | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p029 | きょけんとつげき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p030 | キラースピン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p031 | きりさく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p032 | クイックターン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p033 | くさわけ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p034 | くちばしキャノン | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p035 | くらいつく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p036 | グラススライダー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p037 | クラブハンマー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p038 | クロスチョップ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p039 | クロスポイズン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p040 | けたぐり | Verified | 体重2,068条件照合。 | なし |
| gw0169_p041 | ゴッドバード | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p042 | コメットパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p043 | ゴーストダイブ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p044 | サイコカッター | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p045 | サンダーダイブ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p046 | じばく | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p047 | しめつける | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p048 | ジャイロボール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p049 | シャドーパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p050 | じわれ | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0169_p051 | スイープビンタ | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0169_p052 | スケイルショット | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0169_p053 | そらをとぶ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p054 | ソーラーブレード | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p055 | だいばくはつ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p056 | ダイビング | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p057 | だいふんげき | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p058 | ダストシュート | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p059 | タネマシンガン | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0169_p060 | ダブルアタック | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0169_p061 | つばめがえし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p062 | つららおとし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p063 | つららばり | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0169_p064 | であいがしら | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p065 | デカハンマー | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p066 | とっておき | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p067 | とどめばり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p068 | とびかかる | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p069 | とびつく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p070 | でんこうせっか | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p071 | でんこうそうげき | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p072 | とんぼがえり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p073 | どくどくのキバ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p074 | どくばりセンボン | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p075 | ドゲザン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p076 | なげつける | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_p077 | ドラゴンアロー | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0169_p078 | ドラゴンダイブ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_p079 | ドラゴンテール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s001 | アシストパワー | Verified | 既存の変動威力境界テスト＋PSコールバックの仕様照合。 | なし |
| gw0169_s003 | いのちがけ | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0169_s004 | いびき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s005 | ウェザーボール | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s006 | うずしお | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s007 | うたかたのアリア | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s008 | うらみつらみ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s009 | エレクトロビーム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s010 | オーバードライブ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s011 | オーバーヒート | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s012 | かふんだんご | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s013 | きあいだま | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s014 | ギガドレイン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s015 | きまぐレーザー | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s016 | くさむすび | Verified | 体重2,068条件照合。 | なし |
| gw0169_s017 | ゲップ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s018 | サイコノイズ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s019 | さわぐ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s020 | シェルアームズ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s021 | しっとのほのお | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s022 | シャカシャカほう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s023 | しんくうは | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s024 | じんつうりき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s025 | スケイルノイズ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s026 | ぜったいれいど | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0169_s027 | だいちのはどう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s028 | たたりめ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s029 | ツインビーム | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0169_s030 | てっていこうせん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s031 | トライアタック | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s032 | でんじほう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s033 | ナイトバースト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s034 | ナイトヘッド | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0169_s035 | ドレインキッス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s036 | ねっとう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s037 | ねらいうち | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s038 | ハイドロカノン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s039 | はかいこうせん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s040 | はきだす | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s041 | ばくおんぱ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s042 | はなびらのまい | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s043 | はめつのひかり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s044 | パラボラチャージ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s045 | パワージェム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s046 | バークアウト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s047 | ハードプラント | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s048 | ひゃっきやこう | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s049 | ひやみず | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s050 | ぶきみなじゅもん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s051 | ブラストバーン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s052 | フリーズドライ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s053 | フレアソング | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s054 | ふんえん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s055 | まとわりつく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s056 | みずあめボム | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s057 | みずしゅりけん | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0169_s058 | ミストバースト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s059 | みずのはどう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s060 | みらいよち | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s061 | ミラーコート | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0169_s062 | みわくのボイス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s063 | もえつきる | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s064 | ライジングボルト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s065 | りゅうのはどう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s066 | りんごさん | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s067 | りんしょう | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0169_s068 | ルミナコリジョン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0169_s069 | れんごく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s001 | ドラムアタック | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s002 | ドリルくちばし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s003 | ドリルライナー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s004 | ドレインパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s005 | どろぼう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s006 | ニトロチャージ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s007 | のしかかり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u008 | ネズミざん | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0170_s009 | はいよるいちげき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s010 | ばかぢから | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s011 | はがねのつばさ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s012 | ばくれつパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u013 | ハサミギロチン | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0170_u014 | はたきおとす | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170_s015 | はたく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s016 | はなふぶき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u017 | はやてがえし | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170_s018 | バリアーラッシュ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u019 | ハードプレス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s020 | ひけん・ちえなみ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s021 | ひょうざんおろし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s022 | びりびりちくちく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u023 | ヒートスタンプ | Verified | 体重2,068条件照合。 | なし |
| gw0170_s024 | フェイタルクロー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s025 | フェイント | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u026 | ふくろだたき | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170_s027 | ぶちかまし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u028 | フライングプレス | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s029 | ブレイククロー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s030 | ブレイズキック | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u031 | ふんどのこぶし | Verified | 既存の変動威力境界テスト＋PSコールバックの仕様照合。 | なし |
| gw0170_s032 | ぶんまわす | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u033 | ヘビーボンバー | Verified | 体重2,068条件照合。 | なし |
| gw0170_u034 | ほうふく | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0170_s035 | ほしがる | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s036 | ほっぺすりすり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s037 | ほのおのキバ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s038 | ほのおのパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s039 | ほのおのムチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u040 | ポルターガイスト | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170_s041 | ボルテッカー | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u042 | ボーンラッシュ | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0170_s043 | まきつく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s044 | マッハパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u045 | ミサイルばり | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0170_s046 | むしくい | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s047 | むねんのつるぎ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s048 | メガトンキック | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_s049 | メガホーン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u050 | メタルバースト | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0170_s051 | もろはのずつき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u052 | やけっぱち | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170_u053 | やまあらし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u054 | ゆきなだれ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170_s055 | リーフブレード | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u056 | レイジングブル | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170_s057 | れいとうパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u058 | ロックブラスト | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0170_s059 | ローキック | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170_u060 | ワイドフォース | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_001 | こうそくスピン | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_002 | こおりのキバ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_003 | こおりのつぶて | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_004 | ジェットパンチ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_005 | しおづけ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_006 | じごくづき | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_007 | じたばた | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_008 | じだんだ | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170b_009 | しっぺがえし | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170b_010 | じならし | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_011 | スターアサルト | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_012 | すなじごく | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_013 | せいなるつるぎ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_014 | ソウルクラッシュ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_015 | ダメおし | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170b_016 | ちきゅうなげ | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0170b_017 | ついばむ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_018 | つけあがる | Verified | 既存の変動威力境界テスト＋PSコールバックの仕様照合。 | なし |
| gw0170b_019 | つじぎり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_020 | つのドリル | Not Applicable | 既存方針で標準ダメージ計算対象外 | なし |
| gw0170b_021 | とびはねる | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_022 | とびひざげり | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_023 | ともえなげ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_024 | トラバサミ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170b_025 | トリプルアクセル | Partial | 126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。 | なし |
| gw0170b_026 | トロピカルキック | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170c_001 | どろかけ | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170c_002 | ベノムショック | Partial | 基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。 | なし |
| gw0170c_003 | ぼうふう | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |
| gw0170c_004 | ほのおのうず | Verified | 固定版の独立16乱数照合。定義済み条件内。 | なし |

### Attack abilities

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| moldBreaker | Mold Breaker | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| teravolt | Teravolt | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| turboblaze | Turboblaze | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| skillLink | Skill Link | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| technician | Technician | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| sheerForce | Sheer Force | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| megaLauncher | Mega Launcher | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| sharpness | Sharpness | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| hugePower | Huge Power | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| purePower | Pure Power | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| hustle | Hustle | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| solarPower | Solar Power | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| flareBoost | Flare Boost | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| toxicBoost | Toxic Boost | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| fireMane | Fire Mane | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| flashFire | Flash Fire | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| defeatist | Defeatist | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| orichalcumPulse | Orichalcum Pulse | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| hadronEngine | Hadron Engine | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| waterBubble | Water Bubble | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| fairyAura | Fairy Aura | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| darkAura | Dark Aura | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| auraBreak | Aura Break | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| ironFist | Iron Fist | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| strongJaw | Strong Jaw | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| transistor | Transistor | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| dragonsMaw | Dragon's Maw | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| analytic | Analytic | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| reckless | Reckless | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| toughClaws | Tough Claws | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| steelworker | Steelworker | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| steelSpirit | Steely Spirit | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| plus | Plus | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| minus | Minus | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| infiltrator | Infiltrator | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| scrappy | Scrappy | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| thermalExchange | Thermal Exchange | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| angerPoint | Anger Point | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| rattled | Rattled | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| drizzle | Drizzle | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| drought | Drought | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| sandStream | Sand Stream | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| snowWarning | Snow Warning | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| electricSurge | Electric Surge | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| grassySurge | Grassy Surge | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| mistySurge | Misty Surge | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| psychicSurge | Psychic Surge | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| sniper | Sniper | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| neuroforce | Neuroforce | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| stakeout | Stakeout | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| supremeOverlord | Supreme Overlord | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| rockyPayload | Rocky Payload | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| sandForce | Sand Force | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| punkRock | Punk Rock | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| pixilate | Pixilate | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| aerilate | Aerilate | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| refrigerate | Refrigerate | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| galvanize | Galvanize | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| dragonize | Dragonize | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| normalize | Normalize | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| overgrow | Overgrow | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| blaze | Blaze | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| torrent | Torrent | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| swarm | Swarm | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| guts | Guts | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| adaptability | Adaptability | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| tintedLens | Tinted Lens | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| levitate | Levitate | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| unaware | Unaware | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| clearBody | Clear Body | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |

### Defense abilities

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| thickFat | Thick Fat | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| multiscale | Multiscale | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| furCoat | Fur Coat | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| iceScales | Ice Scales | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| punkRock | Punk Rock | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| fluffy | Fluffy | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| auraGuard | Aura Guard | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| bulletproof | Bulletproof | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| soundproof | Soundproof | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| overcoat | Overcoat | Not Applicable | この単発直接ダメージの対象外。 | なし |
| unaware | Unaware | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| clearBody | Clear Body | Not Applicable | この単発直接ダメージの対象外。 | なし |
| intimidate | Intimidate | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| purifyingSalt | Purifying Salt | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| shellArmor | Shell Armor | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| battleArmor | Battle Armor | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| grassPelt | Grass Pelt | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| marvelScale | Marvel Scale | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| wonderGuard | Wonder Guard | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| drySkin | Dry Skin | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| heatproof | Heatproof | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| waterBubble | Water Bubble | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| prismArmor | Prism Armor | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| shadowShield | Shadow Shield | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| levitate | Levitate | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| waterAbsorb | Water Absorb | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| voltAbsorb | Volt Absorb | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| lightningRod | Lightning Rod | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| motorDrive | Motor Drive | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| sapSipper | Sap Sipper | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| stormDrain | Storm Drain | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| earthEater | Earth Eater | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| wellBakedBody | Well-Baked Body | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| flashFire | Flash Fire | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| filter | Filter | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| solidRock | Solid Rock | Verified | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| fairyAura | Fairy Aura | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| darkAura | Dark Aura | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |
| auraBreak | Aura Break | Partial | 役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。 | なし |

### Roster ability names

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| あくしゅう | あくしゅう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| あついしぼう | あついしぼう | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| あとだし | あとだし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| あまのじゃく | あまのじゃく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| あめうけざら | あめうけざら | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| あめふらし | あめふらし | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| いかく | いかく | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| いかりのつぼ | いかりのつぼ | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| いしあたま | いしあたま | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| いたずらごころ | いたずらごころ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| いやしのこころ | いやしのこころ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| いろめがね | いろめがね | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| うなぎのぼり | うなぎのぼり | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| うるおいボイス | うるおいボイス | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| うるおいボディ | うるおいボディ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| えんかく | えんかく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| おうごんのからだ | おうごんのからだ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| おみとおし | おみとおし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| おもてなし | おもてなし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| おやこあい | おやこあい | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かいりきバサミ | かいりきバサミ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かがくのちから | かがくのちから | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かがくへんかガス | かがくへんかガス | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かげふみ | かげふみ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かそく | かそく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かたいツメ | かたいツメ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| かたやぶり | かたやぶり | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| かちき | かちき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かるわざ | かるわざ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かわりもの | かわりもの | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かんそうはだ | かんそうはだ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| かんつうドリル | かんつうドリル | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| かんろなミツ | かんろなミツ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| がんじょう | がんじょう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| がんじょうあご | がんじょうあご | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ききかいひ | ききかいひ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| きけんよち | きけんよち | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| きみょうなくすり | きみょうなくすり | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| きもったま | きもったま | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| きゅうばん | きゅうばん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| きょううん | きょううん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| きょうせい | きょうせい | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| きよめのしお | きよめのしお | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| きれあじ | きれあじ | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| きんちょうかん | きんちょうかん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ぎゃくじょう | ぎゃくじょう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| くいしんぼう | くいしんぼう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| くさのけがわ | くさのけがわ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| くだけるよろい | くだけるよろい | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| げきりゅう | げきりゅう | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| こぼれダネ | こぼれダネ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| こんじょう | こんじょう | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| さいせいりょく | さいせいりょく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| さまようたましい | さまようたましい | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| さめはだ | さめはだ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| しぜんかいふく | しぜんかいふく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| しめりけ | しめりけ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| しゅうかく | しゅうかく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| しろいけむり | しろいけむり | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| しんりょく | しんりょく | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| じきゅうりょく | じきゅうりょく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| じしんかじょう | じしんかじょう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| じゅうなん | じゅうなん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| じょおうのいげん | じょおうのいげん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| じりょく | じりょく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| すいすい | すいすい | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| すじがねいり | すじがねいり | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| すてみ | すてみ | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| すなおこし | すなおこし | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| すなかき | すなかき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| すながくれ | すながくれ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| すなのちから | すなのちから | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| すりぬけ | すりぬけ | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| するどいめ | するどいめ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| せいぎのこころ | せいぎのこころ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| せいしんりょく | せいしんりょく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| せいでんき | せいでんき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| そうしょく | そうしょく | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| そうだいしょう | そうだいしょう | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| たいねつ | たいねつ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| だっぴ | だっぴ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ちからずく | ちからずく | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ちからもち | ちからもち | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ちくでん | ちくでん | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ちどりあし | ちどりあし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ちょすい | ちょすい | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| てきおうりょく | てきおうりょく | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| てつのこぶし | てつのこぶし | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| てつのトゲ | てつのトゲ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| てんねん | てんねん | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| てんのめぐみ | てんのめぐみ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| でんきにかえる | でんきにかえる | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| でんきエンジン | でんきエンジン | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| とうそうしん | とうそうしん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| とびだすなかみ | とびだすなかみ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| とびだすハバネロ | とびだすハバネロ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| どくげしょう | どくげしょう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| どくしゅ | どくしゅ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| どくのトゲ | どくのトゲ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| どしょく | どしょく | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| どんかん | どんかん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| にげあし | にげあし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ぬめぬめ | ぬめぬめ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ねつこうかん | ねつこうかん | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ねんちゃく | ねんちゃく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| のろわれボディ | のろわれボディ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| はがねのせいしん | はがねのせいしん | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| はっこう | はっこう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| はとむね | はとむね | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| はどうのぼうご | はどうのぼうご | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| はやあし | はやあし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| はやおき | はやおき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| はらぺこスイッチ | はらぺこスイッチ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| はりきり | はりきり | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| はりこみ | はりこみ | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| はんすう | はんすう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ばけのかわ | ばけのかわ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ばんけん | ばんけん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ひでり | ひでり | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ひとでなし | ひとでなし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ひらいしん | ひらいしん | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| びびり | びびり | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| びんじょう | びんじょう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ふかしのこぶし | ふかしのこぶし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ふくがん | ふくがん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ふくつのこころ | ふくつのこころ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ふしぎなうろこ | ふしぎなうろこ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ふしょく | ふしょく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ふみん | ふみん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ふゆう | ふゆう | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ぶきよう | ぶきよう | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| へんげんじざい | へんげんじざい | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ほうし | ほうし | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ほおぶくろ | ほおぶくろ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ほのおのからだ | ほのおのからだ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ほのおのたてがみ | ほのおのたてがみ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ほろびのボディ | ほろびのボディ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ぼうおん | ぼうおん | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ぼうじん | ぼうじん | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ぼうだん | ぼうだん | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| まけんき | まけんき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| むしのしらせ | むしのしらせ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| めんえき | めんえき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| もうか | もうか | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| もふもふ | もふもふ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| もらいび | もらいび | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| やるき | やるき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ゆうばく | ゆうばく | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ゆきかき | ゆきかき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ゆきがくれ | ゆきがくれ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ゆきふらし | ゆきふらし | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ようりょくそ | ようりょくそ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| よちむ | よちむ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| よびみず | よびみず | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| りんぷん | りんぷん | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| わざわいのたま | わざわいのたま | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| わるいてぐせ | わるいてぐせ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| アイスボディ | アイスボディ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| アナライズ | アナライズ | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| アロマベール | アロマベール | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| イリュージョン | イリュージョン | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| エレキスキン | エレキスキン | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| エレキメイカー | エレキメイカー | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| カブトアーマー | カブトアーマー | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| クイックドロウ | クイックドロウ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| クリアボディ | クリアボディ | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| グラスメイカー | グラスメイカー | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| サイコメイカー | サイコメイカー | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| サンパワー | サンパワー | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| サーフテール | サーフテール | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| シェルアーマー | シェルアーマー | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| シンクロ | シンクロ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| スイートベール | スイートベール | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| スカイスキン | スカイスキン | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| スキルリンク | スキルリンク | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| スナイパー | スナイパー | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ダウンロード | ダウンロード | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| テイルアーマー | テイルアーマー | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| テクニシャン | テクニシャン | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| テレパシー | テレパシー | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| トレース | トレース | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ドラゴンスキン | ドラゴンスキン | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ノーてんき | ノーてんき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ノーガード | ノーガード | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ハードロック | ハードロック | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| バトルスイッチ | バトルスイッチ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| バリアフリー | バリアフリー | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| パステルベール | パステルベール | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| パンクロック | パンクロック | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ファーコート | ファーコート | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| フィルター | フィルター | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| フェアリーオーラ | フェアリーオーラ | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| フェアリースキン | フェアリースキン | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| フラワーベール | フラワーベール | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| フリーズスキン | フリーズスキン | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| フレンドガード | フレンドガード | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| プラス | プラス | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| プレッシャー | プレッシャー | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ヘドロえき | ヘドロえき | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ヘヴィメタル | ヘヴィメタル | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ポイズンヒール | ポイズンヒール | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| マイティチェンジ | マイティチェンジ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| マイナス | マイナス | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| マイペース | マイペース | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| マグマのよろい | マグマのよろい | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| マジシャン | マジシャン | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| マジックガード | マジックガード | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| マジックミラー | マジックミラー | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| マルチスケイル | マルチスケイル | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ミイラ | ミイラ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ミストメイカー | ミストメイカー | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ミラクルスキン | ミラクルスキン | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ミラーアーマー | ミラーアーマー | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ムラっけ | ムラっけ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| メガソーラー | メガソーラー | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| メガランチャー | メガランチャー | Partial | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| メロメロボディ | メロメロボディ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| ヨガパワー | ヨガパワー | Verified | 上記の役割別範囲のみ。全役割・全世代の効果保証ではない。 | なし |
| ライトメタル | ライトメタル | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| リベロ | リベロ | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| リーフガード | リーフガード | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |
| レシーバー | レシーバー | Unsupported | 登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。 | なし |

### Attack items

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| loadedDice | loadedDice | Partial | 126分布。命中・回避ランク、マルチスケイル等は対象外。 | なし |
| lifeOrb | lifeOrb | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| choiceBand | choiceBand | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| choiceSpecs | choiceSpecs | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| expertBelt | expertBelt | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| flamePlate | flamePlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| splashPlate | splashPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| zapPlate | zapPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| meadowPlate | meadowPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| iciclePlate | iciclePlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| fistPlate | fistPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| toxicPlate | toxicPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| earthPlate | earthPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| skyPlate | skyPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| mindPlate | mindPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| insectPlate | insectPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| stonePlate | stonePlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| spookyPlate | spookyPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| dracoPlate | dracoPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| dreadPlate | dreadPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| ironPlate | ironPlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| pixiePlate | pixiePlate | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |

### Defense items

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| assaultVest | assaultVest | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| autoResistBerry | autoResistBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| chilanBerry | chilanBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| occaBerry | occaBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| passhoBerry | passhoBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| wacanBerry | wacanBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| rindoBerry | rindoBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| yacheBerry | yacheBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| chopleBerry | chopleBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| kebiaBerry | kebiaBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| shucaBerry | shucaBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| cobaBerry | cobaBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| payapaBerry | payapaBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| tangaBerry | tangaBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| chartiBerry | chartiBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| kasibBerry | kasibBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| habanBerry | habanBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| colburBerry | colburBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| babiriBerry | babiriBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |
| roseliBerry | roseliBerry | Verified | 82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。 | なし |

### Type chart

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| ノーマル | ノーマル | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| ほのお | ほのお | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| みず | みず | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| でんき | でんき | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| くさ | くさ | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| こおり | こおり | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| かくとう | かくとう | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| どく | どく | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| じめん | じめん | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| ひこう | ひこう | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| エスパー | エスパー | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| むし | むし | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| いわ | いわ | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| ゴースト | ゴースト | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| ドラゴン | ドラゴン | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| あく | あく | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| はがね | はがね | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |
| フェアリー | フェアリー | Verified | 18×18セルと各16乱数。複合タイプは別途組合せテスト。 | なし |

### Core / routed mechanics

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| rageFist | rageFist | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| reversal | reversal | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| lastRespects | lastRespects | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| gyroBall | gyroBall | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| storedPower | storedPower | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| none | none | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| psyshock | psyshock | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| bodyPress | bodyPress | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| foulPlay | foulPlay | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| hpScaledPower | hpScaledPower | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| electroBall | electroBall | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| forcedCritical | forcedCritical | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| sacredSword | sacredSword | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| activationAssumed | activationAssumed | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| weatherBall | weatherBall | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| terrainPulse | terrainPulse | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| auraWheel | auraWheel | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| ragingBull | ragingBull | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| flyingPress | flyingPress | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| freezeDry | freezeDry | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| hardPress | hardPress | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| acrobatics | acrobatics | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| ironRoller | ironRoller | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| dualWingbeat | dualWingbeat | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| knockOff | knockOff | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| stompingTantrum | stompingTantrum | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| hex | hex | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| facade | facade | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| venoshock | venoshock | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| barbBarrage | barbBarrage | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| infernalParade | infernalParade | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| assurance | assurance | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| payback | payback | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| avalanche | avalanche | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| lashOut | lashOut | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| temperFlare | temperFlare | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| round | round | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| fickleBeam | fickleBeam | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| expandingForce | expandingForce | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| risingVoltage | risingVoltage | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| mistyExplosion | mistyExplosion | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| beatUpManual | beatUpManual | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| flingManual | flingManual | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| spitUp | spitUp | Partial | 既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。 | なし |
| chargeSpABoost | chargeSpABoost | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| gravApple | gravApple | Verified | 独立差分／境界テスト／受付契約。実機とは別。 | なし |
| shellSideArm | shellSideArm | Partial | 独立8条件。能力比・接触を修正。同値は従来の特殊採用規約。 | なし |

### Weather

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| sun | sun | Verified | 役割別・固定シード差分。砂の特防、雪の防御も対象。 | なし |
| rain | rain | Verified | 役割別・固定シード差分。砂の特防、雪の防御も対象。 | なし |
| sand | sand | Verified | 役割別・固定シード差分。砂の特防、雪の防御も対象。 | なし |
| snow | snow | Verified | 役割別・固定シード差分。砂の特防、雪の防御も対象。 | なし |

### Terrain

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| electric | electric | Verified | 固定シード・技別・接地条件の差分。 | なし |
| grassy | grassy | Verified | 固定シード・技別・接地条件の差分。 | なし |
| misty | misty | Verified | 固定シード・技別・接地条件の差分。 | なし |
| psychic | psychic | Verified | 固定シード・技別・接地条件の差分。 | なし |

### Shared calculations

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| base_formula | base_formula | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| sixteen_rolls | sixteen_rolls | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| fixed_point_rounding | fixed_point_rounding | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| modifier_order | modifier_order | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| STAB | STAB | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| critical_rank_bypass | critical_rank_bypass | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| Reflect | Reflect | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| Light_Screen | Light_Screen | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| Friend_Guard | Friend_Guard | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| Helping_Hand | Helping_Hand | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| burn | burn | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| type_immunity | type_immunity | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| ability_immunity | ability_immunity | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| Mold_Breaker | Mold_Breaker | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| stat_sources | stat_sources | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| HP_thresholds | HP_thresholds | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| ability_activation_flags | ability_activation_flags | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| stat_point_formula | stat_point_formula | Verified | 独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。 | なし |
| manual_multiplier | 追加倍率 | Partial | 利用者指定の実験用倍率。公式対戦効果との同一性は対象外。 | なし |
| extreme_manual_stats | 極端な手入力値 | Unverified | 1〜9999の入力受付は検査。実戦範囲外の全オーバーフロー挙動までは独立認証しない。 | なし |

### Locale regression

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| ja | ja | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |
| en | en | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |
| fr | fr | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |
| de | de | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |
| es | es | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |
| it | it | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |
| ko | ko | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |
| zh-Hans | zh-Hans | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |
| zh-Hant | zh-Hant | Verified | 9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。 | なし |

### Feedback regression

| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |
|---|---|---|---|---|
| v0185 | 匿名フィードバック | Verified | 既存API・管理者権限・非公開データ・9言語ブラウザー回帰。モック環境のみ。本番無変更。 | なし |
