# v0.185 公開に必要な本人設定

専用D1・Worker・Turnstileは作成済みです。Workerへの3つの秘密情報の登録とDB初期化も完了しています。一般向け受付、workers.devルート、プレビューURLはまだ無効です。公開版は引き続きv0.184 Pre-Release 30です。

本番基盤の新設、APAC配置希望、追加課金0円・無料枠内での作業、v0.185のマージと公開は承認済みです。同じ承認を繰り返し求める必要はありません。以下の規約・支払情報とGitHubトークンの発行は、本人がサービスの画面で直接操作します。

## 1. Cloudflare Access Freeの初期登録

1. 認証できたスマホのブラウザーから https://dash.cloudflare.com/ を開き、Zero Trust / Cloudflare Oneへ進みます。
2. チーム名を選びます。候補は `chloha-damage-lab` です。使用済みなら別の利用可能な名前を選んでください。この名前から `https://チーム名.cloudflareaccess.com` が決まります。
3. **Free**を選び、料金と規約を本人が確認します。Cloudflareの公式案内ではFreeでも支払情報の登録が必要です。支払情報はCloudflareの入力欄へ直接入力します。追加課金0円の承認は、有料プランや有料オプションの契約を許可するものではありません。

公式手順: https://developers.cloudflare.com/cloudflare-one/setup/

## 2. 管理者だけが入れるAccessアプリ

Zero TrustのAccess controls → Applicationsから、新しいSelf-hostedアプリを作成します。画面によって種類の表示はSelf-hosted and privateです。

| 入力項目 | 設定値 |
| --- | --- |
| アプリ名 | `Chloha Feedback Admin` |
| 公開ホスト名 | `chloha-private-feedback.kurohanolu-labs.workers.dev` |
| 同じアプリで保護するパス1 | `/admin*` |
| 同じアプリで保護するパス2 | `/v1/admin/*` |
| ポリシーの動作 | Allow |
| 許可する条件 | Emails：Cloudflareにログインした本人のメールアドレス1件 |
| ログイン方法 | 本人のメールを検証できるCloudflareアカウント、またはメールのワンタイムPIN |

同じアプリ内に2つの公開ホスト名・パスを追加します。ホスト名は同じで、パスだけが異なります。ドメイン候補にworkers.devが表示されない場合はカスタム入力を使います。保護範囲は上の2パスに限定し、匿名受付の `/v1/config` と `/v1/reports` は公開のまま使える構成にします。workers.devでもパス単位のAccess保護が利用でき、ドメイン購入は不要です。

作成後、チーム名とアプリ詳細の **Application Audience (AUD)** を控えます。この2つは公開設定値であり、チャットで共有できます。本人の認証情報やメールの確認コードを共有する必要はありません。

公式手順:

- https://developers.cloudflare.com/workers/configuration/cloudflare-access/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/
- https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/

## 3. GitHubのIssues限定トークンをWorkerへ直接登録

GitHubの設定 → Developer settings → Personal access tokens → Fine-grained tokensで、新しいトークンを作成します。作成画面: https://github.com/settings/personal-access-tokens/new

| 入力項目 | 設定値 |
| --- | --- |
| 名前 | `Chloha Feedback` |
| 所有者 | `Kurohanolu` |
| 有効期限 | 90日など、明示的な期限を選ぶ。更新日を本人の非公開の管理場所に控える |
| リポジトリの選択 | Only select repositories → `chloha-damage-lab` だけ |
| リポジトリ権限 | Issues：Read and write |
| 自動で付く権限 | Metadata：Read-only |

発行したトークンをコピーし、CloudflareのWorkers & Pages → `chloha-private-feedback` → Settings → Variables and Secrets → Addへ進みます。

| 入力項目 | 設定値 |
| --- | --- |
| 種類 | Secret |
| 変数名 | `GITHUB_TOKEN` |
| 値 | 今発行したトークンを直接貼り付ける |

Deployで反映します。既に登録してある `TURNSTILE_SECRET`、`RATE_LIMIT_SECRET`、`ADMIN_EMAILS` はそのまま使います。トークンはチャット、公開Issue、ソース、スクリーンショットに掲載しません。

公式手順:

- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- https://developers.cloudflare.com/workers/configuration/secrets/

## 設定後に共有するもの

チーム名、アプリのAUD、`GITHUB_TOKEN` の登録完了を伝えてください。秘密値そのものは不要です。接続側でAccessの設定、秘密情報の登録名、認証拒否、実サービスの受付と管理操作を検証し、最終コミットの5系統CIとv0.185専用CI、公開後の画面・配布物を確認してから公開完了を報告します。
