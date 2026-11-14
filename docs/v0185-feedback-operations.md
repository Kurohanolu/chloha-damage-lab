# v0.185 feedback — local verification and production connection

**Current state: development candidate; production disabled.** No main merge or publication is authorized. The repository's public version remains v0.184 Pre-Release 30. New files use its current release cache key only to keep the unreleased branch consistent with `release.json`; all cache keys and public version metadata must be bumped together for a separately approved v0.185 release.

## Local demo, no external accounts/secrets

Requirements: Node 22.13+ (or Node 24), npm, and Chromium for browser tests.

```sh
npm ci --prefix services/feedback
node tests/v0185-feedback-contract.cjs
npm test --prefix services/feedback
WRANGLER_SEND_METRICS=false npm run check:bundle --prefix services/feedback
npm run dev --prefix services/feedback
```

The demo prints loopback-only calculator and `/admin/` URLs. It uses an in-memory SQLite database, generated test JWT keys, a simulated local Access edge, and mock GitHub/Turnstile responses. It does not contact the real admin or create real Issues. The demo form shows an explicit local-only notice and a local verification button. The demo site key is intentionally not a working public Turnstile site key; the test-only server injects a local widget, which is never part of the production page/Worker. Data is discarded on exit. Test helpers are not imported by the production Worker.

```sh
npm install --no-save --no-package-lock playwright@1.58.2
npx playwright install chromium
node tests/v0185-feedback-browser.cjs
node tests/v0184-engine-initialization.cjs
node tests/v0184-public-baseline.cjs
```

If a managed machine prevents browser launch/download, use the dedicated GitHub CI run; never skip or report the browser suite as passed. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can select an already installed test browser. CI uses the matching Playwright Chromium by default.

## Production setup requiring owner approval and account access

Do not run these steps automatically during this development task. Do not put secrets in the repository, screenshots, chat, browser config or GitHub Pages.

| Setting / resource | Where | Required value / purpose |
| --- | --- | --- |
| Cloudflare account and plan | Owner dashboard | Confirm Free-plan limits/cost policy; no paid upgrade is assumed |
| Dedicated D1 database | Cloudflare | Private feedback only; select data location/backup policy |
| `database_id` | `services/feedback/wrangler.jsonc` | Replace the all-zero placeholder with the approved database ID |
| Migrations | Approved D1 database | Apply `migrations/0001_feedback.sql`; never point at another existing database |
| HTTPS API hostname / routes | Cloudflare | Dedicated hostname; `workers_dev` and preview URLs are disabled by default |
| Turnstile widget | Cloudflare | Managed widget for `kurohanolu.github.io`; no public test keys |
| `TURNSTILE_SITE_KEY` | Worker public variable | Approved widget public key |
| `TURNSTILE_SECRET` | Worker secret | Matching private verification key |
| `RATE_LIMIT_SECRET` | Worker secret | At least 32 random characters; coordinate rotation with idempotency windows |
| Access applications | Cloudflare Access | Protect `/admin*` and `/v1/admin/*`; deny everyone except approved owner identities |
| `ACCESS_ISSUER` | Worker variable | Exact `https://TEAM.cloudflareaccess.com`, no trailing slash |
| `ACCESS_AUDIENCE` | Worker variable | Dedicated Access application's AUD (use one application covering both paths) |
| `ADMIN_EMAILS` | Worker secret | Comma-separated explicit administrator identity allowlist |
| `GITHUB_TOKEN` | Worker secret | Fine-grained token restricted to this repository, Issues read/write; no Contents/Admin scopes |
| `GITHUB_REPOSITORY` | Worker variable | Fixed `Kurohanolu/chloha-damage-lab` |
| `ALLOWED_ORIGINS` | Worker variable | Exact approved HTTPS frontend origin, currently `https://kurohanolu.github.io` |
| `TURNSTILE_HOSTNAMES` | Worker variable | Exact challenge hostnames, currently `kurohanolu.github.io` |
| `INTAKE_ENABLED` | Worker variable | Keep `false` until infrastructure/auth/retention checks finish |
| Daily Cron and alerts | Cloudflare | Verify 03:17 UTC purge schedule, failure alerts, storage/traffic limits and no body logging |
| `apiBase` | `feedback-config-v0185.js` | Approved HTTPS API origin only; no secret or path/query |

After approval, the owner/operator can create the dedicated D1 database, replace its ID, apply migrations remotely, and enter secrets with `wrangler secret put NAME`. Use interactive secret entry; do not include values in command history. Review the account's actual plan and spending/usage controls before any deployment. This repository adds no automatic deployment workflow.

## Connection acceptance before public release

1. Deploy the approved disabled Worker to the dedicated HTTPS hostname. Verify no unauthenticated access to reports, admin HTML/assets or mutations, including alternate routes. Confirm the real Access JWT issuer/AUD/allowlist.
2. Test with synthetic data and the real Turnstile widget; check allowed hostname/action, replay/limits, invalid requests and D1 outages. Confirm that no request bodies, email, IP or keys enter application logs.
3. Verify administrator list/detail/status/delete on synthetic reports. For the first real GitHub integration probe, obtain approval to create a clearly labeled synthetic Issue; inspect the exact public title/body before sending. Review ambiguous-result reconciliation without a second POST.
4. Verify the scheduled purge, expired-report denial and D1 backup retention. Confirm the privacy text matches the selected provider plan and actual operational policy.
5. Set the approved frontend `apiBase` and prepare v0.185 public metadata/cache keys/release notes. Run all five existing workflows, the v0.185 workflow and live-content checks. Review the dedicated Draft PR.
6. Obtain the owner's separate merge/publication approval. Only then enable intake and publish the approved release. Verify public endpoint errors/success, nine-language mobile/desktop behavior, and rollback.

## Incident and rollback

Set `INTAKE_ENABLED=false` to stop intake; never change an outage response to success. Keep drafts on the client. Disable the frontend API origin in an approved rollback if needed. Revoke compromised GitHub/Turnstile/rate-limit credentials through the provider; update secrets without committing values. Private reports and credentials must never be copied to public Issues or logs. To delete a report, use authenticated detail/revision/confirmation flow; production-data deletion needs owner approval. Do not restore a backup into the live database without reapplying expiry/purge and investigating privacy implications.

GitHub ambiguity: use the read-only reconciliation button first. If no marker is found, inspect repository history and operations manually. Do not clear `issue_state` to force a retry. Deleting private records never deletes public Issues. Monitor Cron failures; access is denied at expiry even if purge fails, but storage deletion still needs intervention.
