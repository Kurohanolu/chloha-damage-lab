# v0.185 feedback — local verification and production connection

**Current state: release candidate; production connection pending.** The owner authorized continuing through merge and publication on 2026-11-14. The candidate is v0.185 Pre-Release 31 with updated metadata/cache keys; the actual public site remains v0.184 until backend acceptance and merge. Publication permission does not supply Cloudflare account access, secrets or consent to a paid plan.

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

## Production account access and protected setup

The publication task authorizes necessary setup within the existing scope. First obtain access to the owner's Cloudflare account, and keep any new paid service or legal/account agreement for explicit owner action. Do not put secrets in the repository, screenshots, chat, browser config or GitHub Pages.

### Approved authentication and environment prerequisite

On 2026-11-14 the owner explicitly approved Wrangler access for account/user information, Workers scripts, D1 and Turnstile management. The owner subsequently completed the official device-authorization screen, which reported that authorization was granted to Wrangler. Do not ask for the same permission again.

The local client did **not** finish connecting: the execution environment stopped its request to `https://dash.cloudflare.com:443` with a network-policy denial. A subsequent presence-only check found no Wrangler credential file or Cloudflare API token in the environment. This is a separate environment-access blocker; it does not establish that the owner's approval failed or that the password was incorrect. No production resource has been provisioned or connected.

Before another attempt, the environment operator must permit outbound HTTPS to `dash.cloudflare.com` for device authorization/token exchange and `api.cloudflare.com` for the intended Cloudflare API operations. Only the former has produced a directly observed policy denial; the latter is a prerequisite for subsequent operations. No environment network-policy editing tool is available in this session. Apply changes through the environment's supported settings, then verify a fresh connection. Do not change proxies, disable TLS checks, relay requests through another service, or repeatedly retry the blocked destination.

After the missing network grant is applied, start a new official device flow if the previous request expired. Use the installed, locked Wrangler version and the already-approved scope set:

```sh
cd services/feedback
umask 077
WRANGLER_SEND_METRICS=false node node_modules/wrangler/bin/wrangler.js login \
  --device --browser=false \
  --scopes account:read user:read workers_scripts:write d1:write challenge-widgets.write
```

Give the owner the freshly printed verification URL and short user code immediately through the private authentication conversation; never commit a live code, credentials or a token. The owner reviews and approves on their device. Device authorization is designed to connect the CLI on a different machine; an ordinary browser login alone does not connect it. The supported flow and expiry behavior are documented at https://developers.cloudflare.com/workers/wrangler/commands/general/#use-wrangler-login-without-a-local-callback-server.

Require the CLI's successful completion, then verify the account with `wrangler whoami`. Never use `wrangler auth token` or print stored credentials as a verification step. The selected OAuth permissions can affect existing resources of those types; restrict actual operations to the dedicated Damage Lab service. The Access application/administrator configuration and every production-readiness gate below still apply after Wrangler authentication succeeds.

| Setting / resource | Where | Required value / purpose |
| --- | --- | --- |
| Cloudflare account and plan | Owner dashboard | Confirm Free-plan limits/cost policy; no paid upgrade is assumed |
| Dedicated D1 database | Cloudflare | Private feedback only; select data location/backup policy |
| `database_id` | `services/feedback/wrangler.jsonc` | Replace the all-zero placeholder with the approved database ID |
| Migrations | Approved D1 database | Apply `migrations/0001_feedback.sql`; never point at another existing database |
| HTTPS API hostname / routes | Cloudflare | Dedicated approved `workers.dev` or custom hostname; `workers_dev` and preview URLs stay disabled until that hostname/Access configuration is selected |
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

The owner/operator can create the dedicated D1 database, replace its ID, apply migrations remotely, and enter secrets with `wrangler secret put NAME` or the provider's secure dashboard. Use interactive secret entry; do not include values in command history. Review the account's actual plan and spending/usage controls before any deployment. This repository adds no automatic backend deployment workflow.

Cloudflare's current Workers Access documentation permits hostname/path-specific protection on `workers.dev` as well as custom domains: https://developers.cloudflare.com/workers/configuration/cloudflare-access/. Protect the admin paths while leaving the anonymous intake paths public. Do not enable whole-Worker authentication on the public intake. A domain purchase is not a prerequisite merely to prepare this connection; choose the actual account hostname after sign-in.

## Connection acceptance before public release

1. Deploy the approved disabled Worker to the dedicated HTTPS hostname. Verify no unauthenticated access to reports, admin HTML/assets or mutations, including alternate routes. Confirm the real Access JWT issuer/AUD/allowlist.
2. Test with synthetic data and the real Turnstile widget; check allowed hostname/action, replay/limits, invalid requests and D1 outages. Confirm that no request bodies, email, IP or keys enter application logs.
3. Verify administrator list/detail/status/delete on synthetic reports. For the first real GitHub integration probe, obtain approval to create a clearly labeled synthetic Issue; inspect the exact public title/body before sending. Review ambiguous-result reconciliation without a second POST.
4. Verify the scheduled purge, expired-report denial and D1 backup retention. Confirm the privacy text matches the selected provider plan and actual operational policy.
5. Set the approved frontend `apiBase`. Run `node scripts/feedback-production-check.cjs`; it must report `ready: true`. This read-only check requires HTTPS production configuration, exact CORS/retention, denied anonymous admin access, and no public report listing. It never posts a report, solves a challenge, or supplies administrator credentials. Dedicated tests exercise its failure cases using mocks.
6. Run all five existing workflows, the v0.185 workflow and live-content checks on the updated release candidate. Publication authorization has already been received; merge only after real backend acceptance and readiness. The release workflow independently runs the production check before packaging. Verify public endpoint errors/success, nine-language mobile/desktop behavior, and rollback.

## Incident and rollback

Set `INTAKE_ENABLED=false` to stop intake; never change an outage response to success. Keep drafts on the client. Disable the frontend API origin in an approved rollback if needed. Revoke compromised GitHub/Turnstile/rate-limit credentials through the provider; update secrets without committing values. Private reports and credentials must never be copied to public Issues or logs. To delete a report, use authenticated detail/revision/confirmation flow; production-data deletion needs owner approval. Do not restore a backup into the live database without reapplying expiry/purge and investigating privacy implications.

GitHub ambiguity: use the read-only reconciliation button first. If no marker is found, inspect repository history and operations manually. Do not clear `issue_state` to force a retry. Deleting private records never deletes public Issues. Monitor Cron failures; access is denied at expiry even if purge fails, but storage deletion still needs intervention.
