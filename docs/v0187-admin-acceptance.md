# v0.187 — 残る管理者受入（合成レポート1件）

**2026-11-15受入完了：** 所有者が既存Workerの管理画面から[Issue #65](https://github.com/Kurohanolu/chloha-damage-lab/issues/65)を作成しました。D1の読み取り検証で `Accepted / created / Issue65 / revision4` を確認し、公開全65件中の対象マーカーはこの1件だけでした。同時送信・作成後再送時にも追加POSTを出さない回帰15件もPASS。以下は実施した手順の記録で、再操作や認証情報共有は不要です。本番への重複POSTは実行していません。

公開・名称・デザイン・mainマージの承認は既に記録済みです。追加の承認ではなく、実際の管理者画面から既存WorkerのIssue登録が動作することを確認するための操作です。Cloudflareログインの再試行や認証設定変更は行いません。

管理者画面：`https://chloha-private-feedback.kurohanolu-labs.workers.dev/admin/`

既存の本人認証でこの管理画面を開ける環境から、管理操作そのものを本人が実行できます。Workへのログイン引き継ぎ、Cookie/JWT・パスワード・トークンの共有は不要です。403で止まる場合は操作を繰り返さず、その時点で受入は未完了として保持します。

## 対象と3つの操作

対象は既に新URLから受け付けた合成レポートだけです。一般利用者のレポートは操作しません。

| 識別項目 | 値 |
|---|---|
| Report ID | `d6fcff21-c0d7-4075-9b87-6e302c2e4d55` |
| 合成マーカー | `migration-v0187-d33776b-20261115` |
| 版 / 言語 | `v0.187 Pre-Release 33` / `en` |
| 最後に読み取り確認した状態 | `New` / Issueなし（現在状態は管理画面で確認） |

1. 対象IDを開き、`Review status` を `Accepted` にして `Save status` を押す。
2. 以下の公開用タイトル・技術要約を入力する。`Public payload preview` がこの内容と自動追加された対象IDのマーカーだけであることを確認し、確認チェックを入れて `Create GitHub Issue` を1回押す。状態保存後はフォームが初期化されるため、本文の入力は状態保存の後に行う。
3. 表示されたIssueリンクを確認する。同じ対象を再読み込みして同じIssue番号と `created` 状態が保持され、作成ボタンが無効であることを確認する。返す情報は**公開IssueのURLだけ**で十分です。

Public title:

```text
Synthetic acceptance: Singularity v0.187 migration
```

Public technical summary:

```text
Synthetic integration acceptance for Singularity v0.187 Pre-Release 33.
Marker: migration-v0187-d33776b-20261115.

The calculator is available at https://kurohanolu.github.io/singularity/.
Verified UI checks include nine locales, default damage 108-128, removal of the standalone developer heading, and retained footer developer credit.

This is an operator integration test, not a user defect report. No contact information or calculation snapshot is included.
Expected result: one public Issue created through the existing protected feedback administration workflow.
```

`uncertain` / `creating` になった場合は新規作成を押し直さず、既存の `Check uncertain Issue creation` による照合対象です。私的本文・メール・スナップショットを公開要約へ転載しません。合成レポートは通常の保持期限まで残します。

## 操作後に開発側で確認する証跡

- 公開Issueに対象IDの `chloha-feedback` マーカーがあり、同じ対象のIssueが1件だけであること。
- 許可された読み取りだけで、その合成レポートのD1状態が `Accepted` / `created`、Issue番号/URLが公開Issueと一致すること。
- 既存のCIにある署名検証・管理者認可・リビジョン・重複登録防止の回帰が引き続きPASSであること。

この実サービス証跡を記録してから `liveTargetVerified=true` にします。その後の最終CI、新サイトの最終メタデータ、旧URL案内、mainマージ、リリース発行は[既存の公開切替手順](v0187-cutover-runbook.md)に従います。直接のD1状態変更や別経路で作成したIssueを、この受入の代わりにはしません。
