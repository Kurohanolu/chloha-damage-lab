# v0.185 — Private anonymous feedback design

Baseline: public main `4444dce9e560026ee26c20e0677d182155aa19af`, v0.184 Pre-Release 30. Issue #58, branch `feature/v0185-feedback-system`. **Draft development only. No merge, deployment, external accounts, billing, or production secrets are authorized.** Public release metadata stays at v0.184 until a separately approved release is prepared.

## Delivered boundaries

| Component | Responsibility |
| --- | --- |
| `feedback-contract-v0185.js` | Shared categories, statuses, size limits, and strict snapshot allowlists |
| `feedback-locales-v0185.js` | 42 explicit keys in the existing registry's nine locales; no fallback for supported languages |
| `feedback-config-v0185.js` | Public API origin only, empty by default; never a private credential |
| `feedback-snapshot-v0185.js` | Read controls/current UI input and valid numeric result without calling or changing the engine |
| `feedback-ui-v0185.js` | Nonmodal form, validation, preview/consent, challenge, delivery state and in-memory draft |
| `services/feedback/src/worker.js` | Private intake, server validation, Bot verification, limits, authenticated moderation and controlled Issue creation |
| `services/feedback/admin/` | Access-protected list/detail/filter/status/delete/public-summary UI |
| `services/feedback/migrations/` | Private reports and expiring abuse/idempotency records |
| `services/feedback/test/` | Real SQLite and signed JWT test harness; external Turnstile/GitHub mocks only |

The form supports bug, calculation, translation, and feature categories. Description and category are required; no name, account, email registration or GitHub login is required. Optional email is private. Draft text stays in memory while the page is open, including language changes/closing/reopening; it is not persisted to localStorage, analytics or URLs. The form does not cover or disable calculator controls. Pending requests disable only the feedback fields and submit action.

Attachment is off by default. The user sees a frozen JSON preview with canonical technical IDs, then explicitly confirms it. Calculator changes mark it stale and require refresh/reconfirmation. Search text, user agent, page URL/referrer, history, images, account identifiers and contact fields are excluded. Missing controls are omitted; invalid captures fail rather than invent values. A stale/invalid result is `null`. Snapshot locale records capture time; the form can subsequently change language without silently rewriting approved data.

## Infrastructure decision

| Option | Fit for these requirements | Decision |
| --- | --- | --- |
| Hosted generic form | Simple intake, but provider-specific API/admin/retention/Issue bridge and consent UX would still need integration | Not chosen |
| GitHub Issues/Discussions directly | Public by default and requires a GitHub account | Does not meet the brief |
| Workers + Turnstile + D1 + Access | Separate private store, server validation, explicit owner moderation, no frontend tokens; small operational surface | Chosen; no account or paid plan enabled |

Pricing reference checked 2026-11-14: Workers Free advertises 100,000 requests/day; D1 Free 5 million rows read/day, 100,000 rows written/day and 5 GB total storage; Turnstile Free includes unlimited challenges. The application applies a much lower global intake quota. These are provider limits, not a promise that a particular account or paid plan is configured or necessary. D1 queries fail after free-plan limits; intake then returns failure. Account plan, Access identity policy, data location and usage alerts must be reviewed before activation.

Primary references:

- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/d1/sql-api/sql-statements/
- https://developers.cloudflare.com/turnstile/plans/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://github.com/panva/jose (pinned JWT/JWKS implementation)

## Security and data flow

- HTTPS is mandatory outside loopback-only local mode. Exact configured public origins; no wildcard/credentialed CORS. CORS is not considered authentication or Bot protection.
- 32 KiB streaming body cap, strict JSON fields/types, 5,000-character description, 254-character optional email, prepared SQL. User text is rendered as text, never interpolated HTML. No request-body/credential logging; private responses use `no-store`.
- Each submission is server-verified with Turnstile including action, hostname and age. Raw IP is not sent as `remoteip` to Siteverify. Tokens are HMAC-hashed in an expiring local replay table to cover close concurrent redemptions.
- Atomic D1 rate counters: 6 attempts/client/10-minute fixed window, 25/client/day, 100 global/10 minutes, 1,000 global/day. Counters count attempted submissions and can reject retries during abuse; the draft remains intact. NAT users share a limit. Provider quotas/outages fail closed. Edge-level traffic controls are still necessary if attacked at infrastructure scale.
- IP is processed only to derive a secret HMAC scoped to a UTC day. No raw IP, user agent or fingerprint is stored in a report. Temporary counters, challenge hashes and request deduplication are segregated and expire after 10 minutes–24 hours, with daily purge (at most approximately 48 hours including purge lag). Daily pseudonyms are not anonymous to the infrastructure provider itself.
- Idempotency keys are random UUIDs, valid for 24 hours and bound to a payload HMAC and client pseudonym. Concurrent retries create one report. A lost response can be retried with a fresh challenge and the same draft/key. No public report/detail/status endpoint exists; a receipt cannot read a report.
- Cloudflare Access JWTs are verified using pinned `jose`, RS256 only, trusted issuer/JWKS, audience, expiry and required claims; email allowlist and application-token type are also checked. Unprotected alternate routes still fail authentication in the Worker. The admin HTML and assets receive the same authentication and restrictive CSP.
- Admin mutations require same-origin JSON requests, a custom header and authenticated identity. Revisions prevent stale updates. No browser-side GitHub/Admin/Turnstile secret; all privileges are server-side.
- GitHub creation requires Accepted status, a separately written public title/body and explicit approval. Private report description/email/snapshot are never automatically copied. Email-like strings, contact email and common credential patterns are rejected in the public summary. An administrator still must review free text for names and contextual personal information; pattern matching is not a universal PII detector.
- A durable compare-and-set lock permits only one GitHub POST. Successful Issues carry a generated report marker. A timeout/ambiguous upstream result is blocked from reposting; a read-only reconcile action can locate the existing marker. If not found among 1,000 recent Issues, manual investigation is required; there is no automatic unlock/retry that could duplicate an Issue.

## Retention

Report access ends at 90 days regardless of Cron success. Daily Cron deletes expired rows (normal purge lag at most 24 hours); deleting a private report also removes its deduplication record. Published, reviewed GitHub Issues are independently public and are not deleted with private records. D1 Time Travel backups may retain deleted data for another 7 days on Free or 30 days on Paid; avoid exports and require a separate policy if backups/exports are introduced. Monitor scheduled purge failures and account-level logs. Current source contains no production data.

## Verification

`npm test --prefix services/feedback` exercises actual SQLite SQL/transactions, cryptographically signed/validated administrator JWTs, rate races, bad requests, replay, idempotency, CSRF, private-field exclusion, GitHub uncertainty and expiry. `node tests/v0185-feedback-contract.cjs` checks every locale's own entries and strict capture fields. `node tests/v0185-feedback-browser.cjs` drives the real form/admin UI and Worker handler over loopback; external services are mocked. `wrangler deploy --dry-run` bundles without deployment. All 300 frozen calculation results and the five existing workflows remain required. No Cloudflare account, live Turnstile, real GitHub POST, hardware accuracy or production delivery is claimed by mocks.
