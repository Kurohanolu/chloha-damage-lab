# v0.187 公開切替手順 — 承認後にのみ実行

この手順の実行は2026-11-15に所有者から承認されました。[承認範囲](v0187-owner-approval.md)。基準となる旧公開版は `4b2cde61f92610c5bb970618d34147a2c16a8d7b`（v0.186 Pre-Release32）。採用対象はPR #64のレビュー済みロゴ・画面・移行方式であり、実URL/本番受付の検証完了は別途記録します。以下の手順は完了を自己申告するものではありません。

## 配信先と正本

| 用途 | リポジトリ | 配信元として設定する候補 | 配信内容 |
|---|---|---|---|
| 開発・Issue・PR・CI・リリースの正本 | `Kurohanolu/chloha-damage-lab` | `main`は開発元。旧サイトの配信元から分離する | 完全なソース・検証履歴 |
| 旧URL | 同上 | 専用生成ブランチ `pages-legacy` の `/ (root)` | v0.186の固定済み計算機。新サイト受入後に案内だけ追加 |
| 新URL | 作成済み `Kurohanolu/singularity` | GitHub Actions：所有者が確定ソースSHAを指定 | ソースから生成した `singularity/` の静的成果物だけを配信 |

既存計画の「分離した配信元」を、専用生成ブランチとGitHub標準Pagesビルドで具体化した案です。どちらの配信ブランチも手編集する独立エンジンにしません。公開物は一つの承認済みソースから生成し、ソースSHA・配信先コミット・ファイルハッシュ・デプロイrunを正本のIssue/PRに記録します。既存リポジトリの改名・削除、旧URL停止、有料ドメイン購入は不要です。

Pages設定には管理権限が必要です。既存リポジトリのソース/Issue/PR/Actionsは既存のGitHub接続を使用します。新リポジトリへの接続機能の書き込みは権限不足だったため、所有者の管理画面から配信workflowを設置します。正本は `deployment/singularity-pages.yml`、配置先は新リポジトリの `.github/workflows/deploy.yml`。エンジンを二重保守せず、workflow_dispatchで所有者が指定した確定SHAを取得・検証・生成します。8系統の回帰CIと所有者/デザイン承認が必須で、公開内容検査とリリース判定は配信後に行います。通常のPages用ジョブ権限を使い、PAT・deploy key・接続アプリの権限追加は行いません。配信成功は実際のHTTPS検査で確認します。

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

4. 生成先は新しい空ディレクトリを使う。`migration-artifacts.json`、新旧の静的ツリー、v0.186の元ツリー/不変リリースを切り戻し用に保持する。旧URLの案内JS/CSSはそれぞれの内容のSHA256先頭16文字をキャッシュキーにする。旧計算機の版番号/既存資産は固定したまま、案内の更新だけを確実に区別する。各サイトの中身を配信ブランチのルートへ配置し、親の `dist/` や二つのサイトをまとめて公開しない。Worker、D1、認証情報、テスト、開発依存は含めない。
5. mainをマージする前に、旧サイトの配信元を切り離す。最初の `pages-legacy` は案内を含まないv0.186の正確な公開ツリーとし、Pagesをそのブランチのルートへ変更する。旧URLのHTML/全ランタイムがv0.186と一致し、計算/言語切替が動くことを確認する。ここに失敗したらmainを変更しない。

## 新サイトの受入と案内追加

1. 所有者の公開/デザイン承認をIssue/PRに記録してから、`release.json` の `migration.status` と `designApproval` だけを `approved` にする。`liveTargetVerified` は `false` のままにする。この承認記録コミットで全CIを取得し、クリーンな同一コミットから生成物を作り直す。承認記録と実URL受入の記録を混同しない。
2. 新リポジトリに正本と同一の配信workflowを配置し、PagesのSourceをGitHub Actionsにする。Run workflowに承認済みの完全なソースSHAを指定し、8系統の当該SHA回帰CI成功後に生成済みの新フロントエンドだけを配信する。ビルドrun、provenance成果物と実際のHTTPS応答を確認する。ブランチpushの成功を公開成功と扱わず、フィードバック用のIssues専用トークンを配信に代用しない。
3. 次の読み取り専用コマンドで、新サイトのHTML・全ランタイム・ロゴ・release metadataをハッシュ照合する。公開/デザイン承認がなければ通信前に停止する。新URLの初回受入では「検証済み」フラグや旧URLの移行案内を先に要求しない。

   ```sh
   node scripts/v0187-live-migration-check.cjs --accept-new-target
   ```

   このモードの成功は新サイトの静的ファイル検証を意味する。結果は `publicationReady: false` であり、フラグ更新・公開・送信を行わない。HTMLが参照する実際の版付きURLと検査用のキャッシュ回避URLの両方を照合し、通常URLが古いのに検査用URLだけ新しい状態も失敗にする。照合したブラウザ用URLの件数も記録する。空/不完全なファイル一覧、危険なパス、ローカルハッシュ不一致は通信前に失敗する。HTTP転送・404・古い配信物も成功にしない。
4. 新URLで版番号/キャッシュキー・9言語・検索・再読み込み・入力/数値を確認する。本物のTurnstileと匿名受付、管理者Access、許可した技術要約のみのIssue登録/重複防止を確認する。必要な合成レポート送信/公開Issue作成は、承認済み受入試験の範囲で行う。私的本文・メール・スナップショットは自動転載しない。受入に失敗したら旧URLに案内を追加しない。Worker/D1/Access/Turnstileの既存資源と保存データを維持し、同じorigin/hostnameでも実サービス確認を省略しない。
5. 実サービス受入証跡をIssue/PRに記録してから、`liveTargetVerified` を `true` にする。自己申告フラグだけを証拠にしない。このメタデータ変更もレビュー対象コミットとし、全CIを再取得する。メタデータは公開ファイル自体を変えるため、その最終コミットから再生成して新サイトを再同期する。PRのPages smokeは旧公開版を検査するため、この最終PR CIが成功するまでは旧URLへ案内を追加しない。
6. 最終PR CI成功後、旧配信ブランチを同じソースから生成した `chloha-damage-lab/` に置き換え、別タブで開く9言語の移行案内を追加する。案内の各言語の見出し/リンク名、320px画面の操作領域、旧URLのクエリ/フラグメントが新タブへ渡らないことをブラウザ回帰で検査する。案内リンクは `noopener noreferrer` を指定し、Refererヘッダーや `document.referrer` 経由でも旧URLを渡さないことを検査する。強制転送は行わず、旧画面の入力・未送信フィードバックを保持する。案内リンクに入力や私的下書きを付加しない。両サイトの最終ハッシュ照合後に承認済みmainマージを行い、そのマージSHAでも生成物/当該CIを確認する。異なるコミットのHTML/JS/manifestを混ぜない。
7. 次の最終ゲートは公開承認・デザイン承認・実URL受入が全て記録された後で実行する。引数なしの検査は新旧両サイトと旧URLの案内を必須とする。両サイトの全公開ファイルハッシュ、既存受付API、当該コミットのCIが一致するまでv0.187リリースを発行しない。

   ```sh
   node scripts/verify-publication-approval.cjs
   node scripts/v0187-live-migration-check.cjs
   node scripts/feedback-production-check.cjs
   ```

承認記録後も、実URL受入が未記録なら最終公開ゲートで停止します。PRのpublisherチェック成功はメタデータ検証であり、公開jobはskipです。既存mainのリリースworkflowが配信完了より先に起動して失敗した場合もゲートを緩めず、最終配信照合後にその同じコミットを再実行します。

## 切り戻しと継続運用

- 新URLが未受入なら、v0.186の旧配信をそのまま維持し、案内/外部リンクを切り替えない。
- 案内追加後に問題が出たら、`pages-legacy`へv0.186の完全な静的ツリーを通常の新しいコミットとして再配置する。履歴は書き換えず、案内だけ取り除いた状態を検証する。mainへ古いソースを直接戻して自動配信に頼らない。
- 新サイトは記録した直前の完全な静的ツリーへ戻す。認証を緩めたり、D1を初期化/複製/削除したりしない。障害時の問題URL/コミット/版番号を記録する。
- 以後の製品変更も正本のPR/CIで検証し、承認された同一ソースから新サイトの生成物を更新する。旧版の更新は移行案内の必要な修正に限定し、計算ロジックを二重保守しない。

GitHub公式資料確認日：2026-11-15。[配信元ブランチと設定権限、GITHUB_TOKEN制約](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[公開プロジェクトの無料PagesとURL構造](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。
