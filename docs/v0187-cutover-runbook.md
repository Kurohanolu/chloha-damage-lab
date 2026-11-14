# v0.187 公開切替手順 — 承認後にのみ実行

この手順は実行準備資料です。現時点でmainマージ、新リポジトリ作成、Pages設定変更、正式公開、ロゴ最終採用は行っていません。基準となる旧公開版は `4b2cde61f92610c5bb970618d34147a2c16a8d7b`（v0.186 Pre-Release32）。[Draft PR #64](https://github.com/Kurohanolu/chloha-damage-lab/pull/64)の承認対象コミット、ロゴ、画面を確定してから進めます。

## 配信先と正本

| 用途 | リポジトリ | 配信元として設定する候補 | 配信内容 |
|---|---|---|---|
| 開発・Issue・PR・CI・リリースの正本 | `Kurohanolu/chloha-damage-lab` | `main`は開発元。旧サイトの配信元から分離する | 完全なソース・検証履歴 |
| 旧URL | 同上 | 専用生成ブランチ `pages-legacy` の `/ (root)` | v0.186の固定済み計算機。新サイト受入後に案内だけ追加 |
| 新URL | 承認後に作成または所有確認する `Kurohanolu/singularity` | `main` の `/ (root)` | `dist/v0187/singularity/` 内の生成済み静的ファイル |

既存計画の「分離した配信元」を、専用生成ブランチとGitHub標準Pagesビルドで具体化した案です。どちらの配信ブランチも手編集する独立エンジンにしません。公開物は一つの承認済みソースから生成し、ソースSHA・配信先コミット・ファイルハッシュ・デプロイrunを正本のIssue/PRに記録します。既存リポジトリの改名・削除、旧URL停止、有料ドメイン購入は不要です。

Pages設定には管理権限が必要です。現在の接続はソース/Issue/PR/Actions操作を提供しますが、リポジトリ新規作成やPages管理は提供していません。承認後に利用できる管理手段を確認し、必要なら所有者がPagesの配信元を設定します。未確認の権限を前提に完了を約束しません。

## 切替前

1. 所有者が名称、[ロゴと画面](v0187-design-preview.md)、対象コミット、新旧URLとこの配信方式を承認する。[名称調査](v0187-name-check.md)にある同名ゲームの先行使用は未解決です。名称の独占権・法的利用可能性は主張しません。
2. `singularity`の正確な所有/作成可否とPages管理手段を確認する。404だけで空きと判断しない。既存の非公開リポジトリが見つかった場合は上書きしない。無料運用は公開リポジトリの標準Pagesを用いる。
3. 承認済みソースをクリーンな作業ツリーで取得し、対象SHAと最新の全10系統CI結果を確認する。新しい変更があれば新headの結果を待つ。次を実行し、出力の `uncommittedPreview: false` と `sourceCommit` を確認する。

   ```sh
   node scripts/verify-release.cjs
   node tests/v0187-migration-contract.cjs
   node tests/v0187-live-readiness.cjs
   node scripts/v0187-build-sites.cjs --output dist/v0187
   ```

4. 生成先は新しい空ディレクトリを使う。`migration-artifacts.json`、新旧の静的ツリー、v0.186の元ツリー/不変リリースを切り戻し用に保持する。各サイトの中身を配信ブランチのルートへ配置し、親の `dist/` や二つのサイトをまとめて公開しない。Worker、D1、認証情報、テスト、開発依存は含めない。
5. mainをマージする前に、旧サイトの配信元を切り離す。最初の `pages-legacy` は案内を含まないv0.186の正確な公開ツリーとし、Pagesをそのブランチのルートへ変更する。旧URLのHTML/全ランタイムがv0.186と一致し、計算/言語切替が動くことを確認する。ここに失敗したらmainを変更しない。

## 新サイトの受入と案内追加

1. 新リポジトリに承認済み生成物のみを配置し、Pagesの配信元を設定する。ビルドrunと実際のHTTPS応答を確認する。`GITHUB_TOKEN`での単なるブランチpushはPagesビルドを起動しないため、push成功を公開成功と扱わない。配信権限をフィードバック用のIssues専用トークンで代用しない。
2. 新URLでロゴ・全ランタイム・版番号/キャッシュキー・9言語・検索・再読み込み・入力/数値を確認する。本物のTurnstileと匿名受付、管理者Access、許可した技術要約のみのIssue登録/重複防止を確認する。必要な合成レポート送信/公開Issue作成は、承認済み受入試験の範囲で行う。私的本文・メール・スナップショットは自動転載しない。
3. 新URL受入に失敗したら旧URLに案内を追加しない。Worker/D1/Access/Turnstileの既存資源と保存データを維持する。同じorigin/hostnameでも実サービス確認を省略しない。
4. 受入成功後、旧配信ブランチをビルダーの `chloha-damage-lab/` に置き換え、別タブで開く9言語の移行案内を追加する。強制転送は行わず、旧画面の入力・未送信フィードバックを保持する。案内リンクに入力や私的下書きを付加しない。
5. 所有者の承認記録と実サービス受入証跡をIssue/PRに記録してから、`release.json` の `migration.status` / `designApproval` / `liveTargetVerified` を更新する。自己申告フラグだけを実サービス証拠にしない。このメタデータ変更は別のレビュー対象コミットとし、全CIを再取得する。
6. 最終メタデータは公開ファイル自体を変えるため、その最終コミットから再生成し、新旧配信物を再同期する。承認されたmainマージ後もそのマージSHAから再生成して照合する。異なるコミットのHTML/JS/manifestを混ぜない。
7. 次の最終ゲートは公開承認・デザイン承認・実URL受入が全て記録された後で実行する。両サイトの全公開ファイルハッシュ、既存受付API、当該コミットのCIが一致するまでv0.187リリースを発行しない。

   ```sh
   node scripts/verify-publication-approval.cjs
   node scripts/v0187-live-migration-check.cjs
   node scripts/feedback-production-check.cjs
   ```

現在のmanifestは最初の公開承認ゲートで停止します。PRのpublisherチェック成功はメタデータ検証であり、公開jobはskipです。既存mainのリリースworkflowが配信完了より先に起動して失敗した場合もゲートを緩めず、最終配信照合後にその同じコミットを再実行します。

## 切り戻しと継続運用

- 新URLが未受入なら、v0.186の旧配信をそのまま維持し、案内/外部リンクを切り替えない。
- 案内追加後に問題が出たら、`pages-legacy`へv0.186の完全な静的ツリーを通常の新しいコミットとして再配置する。履歴は書き換えず、案内だけ取り除いた状態を検証する。mainへ古いソースを直接戻して自動配信に頼らない。
- 新サイトは記録した直前の完全な静的ツリーへ戻す。認証を緩めたり、D1を初期化/複製/削除したりしない。障害時の問題URL/コミット/版番号を記録する。
- 以後の製品変更も正本のPR/CIで検証し、承認された同一ソースから新サイトの生成物を更新する。旧版の更新は移行案内の必要な修正に限定し、計算ロジックを二重保守しない。

GitHub公式資料確認日：2026-11-15。[配信元ブランチと設定権限、GITHUB_TOKEN制約](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[公開プロジェクトの無料PagesとURL構造](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。
