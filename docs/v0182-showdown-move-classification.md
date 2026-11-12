# Showdown技分類の照合基準（v0.182）

Showdownの技分類（physical / special / status）は基礎情報にすぎない。技の実際のダメージ計算には、以下のメタデータを個別に確認する。

- `id`, `name`, `type`, `category`, `basePower`, `target`
- `flags`（slicing, pulse, punch, bite, contact, sound 等）
- `multihit`, `critRatio`, `willCrit`, `secondary`, `secondaries`
- `overrideOffensiveStat`, `overrideDefensiveStat`, `useTargetOffensive` 等の能力参照例外
- 威力・タイプ・命中の変動条件、フィールド、天候、ターン順、状態異常、持ち物
- ダメージ計算に用いない変化技、固定ダメージ技、通常ダメージ式を使わない技

## 最優先の回帰例

| 技 | Showdown照合の重点 |
| --- | --- |
| サイコカッター | physical / slicing / 急所ランク |
| サイコショック | special / 防御側ぼうぎょ参照 |
| ボディプレス | physical / 使用者ぼうぎょ参照 |
| イカサマ | physical / 対象こうげき参照 |
| こおりのいぶき | special / 確定急所 |
| トリックフラワー | physical / 確定急所 |
| せいなるつるぎ | physical / 防御ランクの扱い |
| フリーズドライ | special / みずタイプへの相性例外 |
| ダブルウイング | physical / 2ヒット |
| ワイドフォース | special / サイコフィールドと範囲変化 |

## 判定ルール

1. Showdownデータ上の存在とPokémon Championsの採用範囲は分けて管理する。
2. `calculationSupported=true` は完全なShowdown一致を意味しない。基本計算と特殊効果の検証状況を分離する。
3. 技データを更新した際は、名称だけでなくShowdown IDを照合する。日本語・英語は表示層で切り替える。
4. Showdownのデータや処理に対して回帰テストを追加し、差分を明示する。未検証の仕様を黙って正確と扱わない。
5. v0.182は計算エンジンとデータ品質を優先し、v0.183でグローバル化する。
