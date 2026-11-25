# v1.1.0 Stable 候補の監査

2026-11-25 の追加指示に従い、固定参照 abdce0c64597284c8c463b7f71a38dc4dc55cd10 の Champions 実装を採用した。以下は計算エンジン 726ab93ffb00d4834590825888bf16e42b1ad738 の実行結果。Stable 表記の候補は最終 CI 待ち。

| 検査 | 結果 |
|---|---|
| Champions 単発 | 12,000/12,000、順序付き192,000/192,000、除外0 |
| 既存単発 | 4,000/4,000（Champions 494、第9世代 3,506） |
| 独立算術 | 480/480、7,680点 |
| 連続技 | Champions 56分布、第9世代126分布が一致。56件は同じシナリオを別世代で実行 |
| オーバーフロー | 修正前33件506点不一致、修正後62/62件992/992点 |
| 追加KO判定 | サーナイトのアシストパワー、最小57・最大64,839、15/16。ブラウザ表示93.75% |
| 反復攻撃 | 同じ非単調分布2回の256組を独立合算、HP155に対して255/256 |
| 素早さ | 指定参照の上限999、ランク途中のU16、追い風とまひの順序を実行比較 |
| ブラウザ | 10言語110遷移、再読込15回、6画面幅×10言語 |

62件と追加のKO例は別集計。ビット幅単体検査はケース総数に加算しない。元監査20件の生データは取得できず、独立境界値で論点を検証した。実機バージョンとHP回復現象の詳細は HARDWARE_OVERFLOW_RESEARCH_BACKLOG.md に記録した。

旧安定版 v1.0.0 のソースは 0b270c1452505268364659edd402209b00b28673。直前の公開版 Pre.20 のデプロイ元は 8343afafc1915fd82a765d0655742819f14fe5f8。公開ロールバックは対象の監査済み SHA を公開リポジトリの deployment-request.json に指定し、Pagesのデプロイと実ファイル照合を行う。

## 方針変更前の監査記録

# Independent audit checkpoint, 2026-11-25
Source main a7389a01d3b309a71e3a0c6413243700d445e263. Production release.json returned v1.1.0-pre.20. Deployment repository main ee778eef9478e434ebb1cbdaa87d331a640023fa requests 8343afafc1915fd82a765d0655742819f14fe5f8, which has the same tree as source main. Baseline PRs open: 80, 46, 38. Prior 17 Actions results recorded separately. No deployment authorized until the new release gates pass.

## Differential and regression
12,000 unique native Champions single-hit tests, 192,000 ordered roll points. Same seed/inputs before and after. Grassy Terrain omitted Bulldoze from its half-power rule, causing all 16 rolls in each of 329 cases to differ. Corrected the supported move predicate. Zero remaining differences in this corpus. MISMATCH_LEDGER.json contains the pre-fix IDs and diagnosis. Records include input overrides on the fixed baseline (see DIFFERENTIAL_RESULTS.json), species, points and the A/B vectors. Synthetic arithmetic tests are separate.

Original 20 raw tuples were not located. Their original results are unverified. Replaced with 480 synthetic tri-oracle comparisons (240 Champions and 240 Gen 9). Reference SHA abdce0c64597284c8c463b7f71a38dc4dc55cd10 built using calc/tsconfig.json. Actual and reference each agree with independent integer arithmetic. Hustle, sand and snow apply a separate rounding step. Analytic selection models activation, and the legacy adapter explicitly sets abilityOn. Base power 70 becomes 136 in the reference order Analytic / Dry Skin / item. Swapping the latter two yields 137. Choice Band and Assault Vest are absent from this Champions reference, so their combinations are only tested in Gen 9. Charcoal models the equal-factor fire item on the reference side.

Baseline legacy 4,000 matched (494 Champions, 3,506 Gen 9). Older npm reference 0.10.0 resolves for root browser comparisons (Gen 9); fixed audit package 0.12.0 is not the pinned git source. Five source files differ: data/moves.ts, mechanics/{gen12,gen3,gen56,util}.ts. Reference calc.test.ts: 349 passed, including its Champions block. Legacy move, ability, flag, weight and multi-hit differential suites passed locally, including 126 multi-hit distributions. Historical v1.0.0 equivalence: 4,520 complete output comparisons passed with the exact reviewed predicate change accounted for.

## Reproduction
Use Node 22 or 24. Check out the reference at the SHA above and run npm install --ignore-scripts and npm run compile in its calc directory. In the project run npm ci --prefix tests/reference. Set CHAMPIONS_REFERENCE to the reference checkout; run node tests/v110-independent-boundaries.cjs and node tests/v110-independent-champions.cjs. Reports are regenerated in reports/v110-independent/. Reproduce the pre-fix ledger by running the same scripts against the baseline engine. Run node tests/v0186-seeded-differential.cjs separately.

## Release decision
INCONCLUSIVE for the complete supported surface. The native corpus covers six move/species combinations and scenario fields; it cannot certify all supported moves, roster and turn-history legality, extreme integer behavior, or public browser behavior. No stable release or tag at this checkpoint. Outstanding: overflow reachability and calculations, full UI/locale assessment, final CI and evidence, stable packaging, rollback and live verification.

## Final release decision for this audit
**INCONCLUSIVE — hold Stable.** One confirmed engine defect (grounded Bulldoze) fixed. One separate release-blocking uncertainty remains in integer overflow and HP semantics. 33/62 directed overflow inputs disagree with the reference (506/992 roll points; 13 native-model, 20 artificial cases). The reference itself predicts a positive result for a historically observed healing setup. A trial matching B was discarded. See OVERFLOW_AUDIT.md, overflow.json, signed-hp-witness.json and the classified mismatch ledger. The ordinary single-hit agreement rate is 100% for its stated corpus, and does not include these failing directed cases. All three original audit concerns are documented separately. The current covered browser results, undeployed release identity and previous stable source have their own reports. No official release, tag or deployment was performed.

The next discriminating observation is a current-game HP transition near the overflow boundary: record build, HP before/after, battle log and sufficient conditions to discriminate signed HP arithmetic from a display-only wrap. Do not adopt the reference-parity prototype on the strength of its differential score. Existing pre.20 published-inventory approval must not be reused for different runtime bytes.

Additional acceptance evidence: 41/41 live pre.20 files including exact browser URLs matched the immutable baseline byte-for-byte. An additional directed KO discriminator (outside the 62-case count) produces 16/16 KO in Singularity versus 15/16 in the reference, including 65,593 vs 57 at the 87 roll. Input, all vector values and denominator are in ko-discriminator.json. The classified 329 pre-fix records (including inputs and both original roll arrays) are archived separately.
