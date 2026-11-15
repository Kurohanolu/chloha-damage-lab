# v0.188 Final Release Gate — operational verification

This workstream performs fresh read-only checks for the final release gate. It does not authorize a merge, tag, Release, production cutover or backend change. The inspected starting candidate is `5f88e471d5a8a3374181ce0d37deb211c1dd9f26`; production remains `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7` (`v0.188-pre.1`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`).

## Current observations

Fresh public metadata at 2026-11-15 16:14 JST confirms:

| Target | Observed state |
|---|---|
| Source `main` | `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7` |
| Existing release | `v0.188-pre.1`, published, prerelease, target is the exact main above |
| Publishing repository main | `b30c0f1863f3262574cf5365721be87c42ffa3e9` |
| Publishing repository complete tree | Only `.github/workflows/deploy.yml` and `README.md`; no separate calculator engine |
| Worker/backend source and connection configuration | No diff between the inspected candidate and the published source |

The existing tag was only read. No tag, release, branch of production or deployment was modified.

The publishing workflow at the exact repository commit above requires a full source SHA, checks owner adoption and release contracts, checks exact-source regression runs, and builds `dist/deploy/singularity` with `scripts/v0187-build-sites.cjs`. Its [latest run](https://github.com/Kurohanolu/singularity/actions/runs/43680927016) completed successfully. The run head identifies the publishing workflow repository; the asset byte comparison below establishes correspondence to the application source. The public repository holds no separate calculator engine.

## Public Worker and authentication boundary

`node scripts/feedback-production-check.cjs` was executed again and passed **10/10**. It uses anonymous GET requests only. Production intake is enabled, its public Turnstile key is not a known test key, the retention contract is 90 days, and anonymous access to the administrator API/page/script and public report listing is denied.

Additional GET/OPTIONS checks all passed:

| Origin | Method | Status | Allow-Origin | Cache-Control |
|---|---|---:|---|---|
| Approved frontend | GET | 200 | Exact approved origin | no-store, private |
| Approved frontend | OPTIONS | 204 | Exact approved origin | no-store, private |
| Unapproved origin | GET | 403 | absent | no-store, private |
| Unapproved origin | OPTIONS | 403 | absent | no-store, private |

The API's public production mode, enabled flag, public site key and 90-day retention match the committed expectations. Site-key values are not retained in the report. These observable values do not establish all live Worker bindings or D1/Access settings. The configured Access issuer's public JWKS endpoint returned 200 and two keys; key material was discarded. A reachable JWKS endpoint is not evidence that every Access policy is correct.

Locked Wrangler 4.162.0 `whoami --json` was run once: `loggedIn:false`, exit 1. Presence-only checks found no API token/key/email/account environment bindings or either known Wrangler configuration path. No credentials were read or printed. The previously observed dashboard sign-in wall remains historical evidence; no new browser login attempt, token request or authentication bypass was made in this final check.

Accordingly, **Cloudflare administrative certification remains INCOMPLETE**: current Worker deployment/version, full deployed bytes and bindings; current D1 state; complete Access applications/policies/audiences; Turnstile administration and real challenge execution; and authenticated production replay are not verified. Earlier authenticated configuration/D1 observations are not relabeled as current results.

## Existing Issue #65

Fresh public GitHub reads confirmed that Issue #65 exists, is open, has one acceptance marker, and is the only matching issue in the complete 67-entry public collection. The issue body and marker value were not copied into this evidence. No new Issue or report was created.

This supports uniqueness of the existing public counterpart. It does **not** independently prove current D1 linkage, the original Worker operation, a current status/revision in the private database or live GitHub-token permission. Those require authenticated management/D1 evidence that is currently unavailable.

## Public assets and existing release archive

The complete fresh GET-only scan ran from **2026-11-15 16:13:20 JST** to **2026-11-15 16:20:42 JST**, against an isolated clean checkout of the immutable published source. This is a new final scan; the earlier continued-audit scan is not substituted for it.

| Check | Result |
|---|---|
| Packaged public files | **73** across both URLs |
| Static HTTP/SHA-256 comparisons | **212/212 matched**, including raw, versioned and fresh-query URLs |
| New site | 41 files, 118 matching requests |
| Legacy site | 32 files, 94 matching requests |
| Embedded sprites | 2 decoded and hashed |
| External sprites | **371/371 HTTP 200** |
| Existing release ZIP | **319 file entries**, 2,530,855 bytes; archive bytes, entry paths/bytes, archive commit comment and published checksum all match |

ZIP SHA-256: `60ec01af456a251eec006833ade16bddf5b5ef8e209c939d518879ebb2f4d500`.

The scan compares HTML, bundled JavaScript/CSS, logos, favicon, manifest, local images and packaged dynamic resources. Two `.nojekyll` build markers are excluded from application-resource requests. External sprites use mutable upstream `master` URLs: this establishes availability and records observed hashes, but cannot establish equivalence to bytes pinned by the application source. Their residual dependency risk remains explicit.

The two URLs return the matching published artifacts. Functional legacy calculation, migration notice interactions and candidate behavior belong to the separate browser/UI workstream; these byte and availability results alone are not a substitute for it. The existing release ZIP was downloaded and compared with a UTC `git archive` of the published commit, not inferred from release metadata.

Complete per-resource receipts, cache headers, observed hashes and scope limitations are saved in [the final operations evidence](evidence/v0188-final-operations.json).

## Changes and rollback boundaries

Production mutations, deployments, D1 writes/deletions, new reports, new Issues, private-report reads, login submissions, secret operations and authentication relaxations: **all 0**.

No backend correction was required by the observed public checks or source comparison, so no configuration change or deployment was made. The final frontend fixes and any new release identity are handled by the candidate review; this operational check does not make them live.

For the frontend, the immutable published source and its verified release archive are the rollback reference. Building and comparing those artifacts is non-destructive. An actual rollback/cutover was not rehearsed on production. The legacy URL and migration notice must stay in the prepared dual-site build.

For a future backend incident, first obtain an existing authorized management connection, read the actual active deployment/version and bindings, record the current rollback target, and then perform only the necessary approved correction. Do not treat an old Worker version as a newly verified rollback target. Do not drop D1 data, recreate resources or weaken Access to recover management access. With management authentication unavailable now, immediate autonomous backend recovery cannot be claimed.

## Operational release interpretation

- **PASS** for demonstrated public availability, exact-origin CORS, anonymous administrator/report-listing protection, public configuration agreement, existing public Issue #65 uniqueness, both published artifact sets and existing release ZIP integrity.
- **INCOMPLETE** for current Cloudflare administration, live D1 linkage, full deployed-code identity and actual backend rollback capability.
- No new operational defect requiring a production change has been confirmed. A frontend-only next prerelease with unchanged backend may be considered **CONDITIONAL READY** only if the owner explicitly accepts these concrete visibility/verification limits and the final candidate's independent code/CI gate passes. This is a conditional recommendation, not an inferred acceptance or full security certification.
- If complete live management verification is mandatory before this release, that requirement remains unmet and the release gate must remain INCOMPLETE. The independent reviewer and owner retain that judgment.
