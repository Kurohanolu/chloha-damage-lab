# Singularity v0.188 continued operational audit

## Fixed scope and current outcome

This is a fresh, read-only continuation of the existing PR #67 audit. Published source: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`; tree `cf7af9334261b0cfbbde45929da9d217445fe526`; immutable release `v0.188-pre.1`. The candidate inspected at the start was `8b37bddbb236fa1b7fbd13a7b2cebd1518995437`. Neither the Worker source/configuration nor the public feedback connection settings differ from the published source. No backend deployment was necessary or attempted.

**PASS for the demonstrated public asset, release-byte and anonymous-protection checks. INCOMPLETE for Cloudflare administrative certification.** These are scoped operational findings, not an independent final quality verdict or owner permission to merge/publish. Historical OAuth success is not substituted for current authentication.

Public asset audit ran from `2026-11-15T06:28:10.100405+00:00` to `2026-11-15T06:34:48.005284+00:00` (UTC; 2026-11-15 JST). Sanitized machine-readable evidence: [v0188-continued-operations.json](evidence/v0188-continued-operations.json). Private report bodies, contact information, snapshots, credential values and public signing-key material were not retained.

## Fresh public assets and Release ZIP

An isolated checkout of the exact published commit was rebuilt with the existing site builder. The full audit script ran without editing the working tree or any public service:

```text
python3 scripts/v0188-audit-public-assets.py --commit 4f068544e670a85a6a4d34dd2c26e2be66bd9cb7 --external-sprites --output <scratch receipt>
```

| Verification | Current result |
| --- | --- |
| New and old GitHub Pages packaged public files | 73 files; 212/212 raw, cache-busting and versioned GET responses match source-derived SHA-256 |
| HTML/JS/CSS, logo/favicon, manifest and browser-referenced static assets | All packaged checks match; old calculator and migration HTML remain byte-identical to the approved published build |
| External sprite availability | 371/371 HTTP 200; measured hashes recorded; 2 embedded images decoded |
| Release ZIP | 319 files; whole ZIP bytes and all paths/content match exact UTC `git archive`; archive comment equals the published commit |
| ZIP SHA-256 | `60ec01af456a251eec006833ade16bddf5b5ef8e209c939d518879ebb2f4d500` |
| Downloaded checksum file | Matches the downloaded ZIP and expected release filename |

The two empty `.nojekyll` files are GitHub Pages build markers, excluded from public HTTP application-content scanning. External sprites still use mutable upstream `master` URLs. Their returned bytes and hashes are current observations, not source-pinned equivalence or a permanent availability guarantee. A later change could pin an upstream revision or package these assets to make that guarantee possible; this continuation does not alter sprite distribution.

## Fresh Worker protection checks

`node scripts/feedback-production-check.cjs` passed all 10 checks. It used public GET requests only: enabled production intake, a non-test public Turnstile key, 90-day retention, exact frontend CORS, no-store, protected administrator API/page/script, and no public report listing. It neither solved a real challenge nor submitted a report.

Additional independent GET/OPTIONS observations:

| Origin | Method | Status | Access-Control-Allow-Origin | Cache-Control |
| --- | --- | --- | --- | --- |
| Approved frontend | GET | 200 | Exact approved origin | no-store, private |
| Approved frontend | OPTIONS | 204 | Exact approved origin | no-store, private |
| Unapproved origin | GET | 403 | Absent | no-store, private |
| Unapproved origin | OPTIONS | 403 | Absent | no-store, private |

The configured Access issuer's public JWKS endpoint returned HTTP 200 with two keys. This demonstrates public reachability, not completeness of Access policies or authenticated administrator access. Source inspection continues to show signed Access JWT checks and same-origin administrator mutation requirements; current deployed full-byte identity is not established by those observations.

## Management authentication and limits

The locked Wrangler 4.162.0 `whoami --json` was run once and returned `{"loggedIn":false}` (exit 1). Presence-only checks found no Cloudflare API token/key/email/account environment variables and neither documented local Wrangler configuration path. No credential value was requested or printed.

A direct inspection of the shared browser found no existing tabs. The Cloudflare dashboard navigation redirected to `https://dash.cloudflare.com/login` and rendered the sign-in form. No sign-in button, credential field, CAPTCHA, login retry or permission flow was used. This confirms that this inspected browser did not supply an authenticated management session. No suitable Cloudflare connector was available from the task's discovery.

Consequently, current Worker deployment/version and bindings, D1 state, full Access applications/policies, Turnstile administrative settings, real challenge execution and authenticated production replay remain **unverified**. The earlier successful OAuth and Worker version observations remain historical. They do not establish a current rollback target or authorize changing protection to recover access.

## Changes, rollback and restart point

Production changes: **0**. New reports: **0**. New Issues: **0**. Private-report reads: **0**. Login submissions: **0**. No Worker deployment, D1 write/deletion, secret operation, Access change, Turnstile change or public calculator cutover occurred.

The existing published frontend source `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7` remains the verified frontend rollback reference. For a future backend change, first restore the existing authorized management session through the official flow, obtain the actual active deployment/version and rollback target through read-only management APIs, and record those before making any change. Do not treat the historical Worker version as a fresh current rollback point.

The next operational step is authenticated read-only management verification when that existing connection is available. Public protection and static-release evidence can be reviewed now; full administrative certification is not inferred from it.
