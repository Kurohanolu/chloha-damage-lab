# v0.185 本人設定と更新手順

専用D1・Worker・TurnstileとDB初期化、GitHub用を含む4つの秘密情報は準備済みです。既存の `Chloha Feedback Admin` も確認し、実際の認証先とAUDをWork側で取得してWorkerへ反映しました。Accessアプリ、Worker、DBの再作成やチーム名・AUDの転記は不要です。

専用URLと受付APIは有効です。本番準備チェックは全10項目を通過し、本人認証済みの管理API接続も確認しました。公開版は引き続き **v0.184 Pre-Release 30** で、v0.185のマージ・完全公開は未実施です。本番接続、追加課金0円・無料枠内での作業、マージと公開は承認済みです。同じ承認は繰り返し求めません。

## 登録完了：Issues限定トークン（更新時のみ以下を使う）

2026年11月14日、本人が既存Workerへ `GITHUB_TOKEN` をSecretとして登録・デプロイし、Work側も登録名と本番APIの準備状態を確認しました。再発行・再登録は不要です。下の手順は有効期限が近い場合や失効時の更新用です。秘密値は引き続きサービス内で直接扱います。

GitHubの設定 → Developer settings → Personal access tokens → Fine-grained tokensを開きます。既に同じ用途のトークンがあれば、権限と対象を確認して再利用し、不要な重複発行を避けます。新規作成画面: https://github.com/settings/personal-access-tokens/new

| 入力項目 | 設定値 |
| --- | --- |
| 名前 | `Chloha Feedback` |
| 所有者 | `Kurohanolu` |
| 有効期限 | 90日など明示的な期限。更新日を本人の非公開の管理場所に控える |
| リポジトリの選択 | Only select repositories → `chloha-damage-lab` だけ |
| リポジトリ権限 | Issues：Read and write |
| 自動で付く権限 | Metadata：Read-only |

トークンをコピーし、CloudflareのWorkers & Pages → **既存の `chloha-private-feedback`** → Settings → Variables and Secrets → Addへ進みます。

| 入力項目 | 設定値 |
| --- | --- |
| 種類 | Secret |
| 変数名 | `GITHUB_TOKEN` |
| 値 | GitHubで発行したトークンを直接貼り付ける |

Deployで反映します。既存の `TURNSTILE_SECRET`、`RATE_LIMIT_SECRET`、`ADMIN_EMAILS` とAccess設定は維持します。更新時は稼働中の `INTAKE_ENABLED` と他の既存設定を確認し、意図せず上書きしないでください。

**トークン、パスワード、確認コード、Cookie、認証付きcURLをチャットやスクリーンショットで送る必要はありません。** 完了後は「GITHUB_TOKEN登録済み」とだけ伝えてください。Work側は秘密値を読まず、登録名をAPIで確認します。

公式手順:

- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- https://developers.cloudflare.com/workers/configuration/secrets/

## Work側で続ける検証

残る公開検証では、既存リソースを再利用して、実際の匿名受付、Turnstile、非公開保存、管理者操作、承認した技術情報だけのIssue登録と重複防止を検証します。本人は暗号化転送によるAccess認証を完了しました。Work側で署名・対象アプリ・本人・有効期限を検証し、管理APIへ接続できています。セッション期限が切れた場合だけ新しい本人認証を案内します。別ブラウザーのCookieを共有する方式ではありません。

最後に本番準備チェック、最終コミットの主要5系統とv0.185専用CIを確認し、マージ後のCI・公開画面・配布物を検証します。停止中や送信できない状態を、公開完了・送信成功とは報告しません。
