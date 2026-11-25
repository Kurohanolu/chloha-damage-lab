# 参照系
指定Git SHA abdce0c64597284c8c463b7f71a38dc4dc55cd10 の calc/ を npm ci --ignore-scripts と TypeScript 4.9.5 でコンパイルした。calc.ts の添字0は calculateChampions。生成物はプロダクトに同梱しない。既存ブラウザ比較のルート ^0.10.0 は0.10.0に解決し、tests/showdown-compare.mjs と tests/showdown-differential.mjs は第9世代を指定する。tests/reference/package-lock.json は0.12.0を固定する。npm 0.12.0パッケージと指定SHAの src/ を再帰比較した結果、data/moves.ts、mechanics/gen12.ts、gen3.ts、gen56.ts、util.ts が異なる。champions.ts が一致しても util.ts とデータを共有するため同一のバイナリと扱えない。

Aは製品のHTMLにある読込順でロードしたランタイム。Bは独立に構築した種族、能力ポイント、技、フィールドによる指定Git版の実行。Cは補正の分母4096に対して整数除算で丸めを実装した。重点条件だけを対象とする。既存アダプターは実数値から種族値を逆算し、型や特性を上書きするため、その結果は合法パーティの存在証明に使えない。参照独自の不確定性はOVERFLOW_AUDIT.mdに記載。
