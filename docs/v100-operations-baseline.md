# Singularity v1.0.0 promotion — operations and published baseline

This workstream performs fresh read-only checks against the existing published release. It does not make v1.0.0 live or grant publication authority. The audited frontend baseline is `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095`, tree `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b`. Production remains the immutable source `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`, tag `v0.188-pre.1`.

## Fresh repository and publication state

GitHub metadata was read again on 2026-11-15 JST. Source main and the existing tag still identify the published source above. The existing Release remains published and prerelease. The public repository main remains `b30c0f1863f3262574cf5365721be87c42ffa3e9`, tree `35c3cddd658b712dc8d191f2567cb4f8e9a069f0`; its complete tree contains only the deployment workflow and README, with no second calculation engine.

The current publishing workflow was fetched at that exact commit and matches the audited source template byte-for-byte, SHA-256 `db7f0ed12072052f872b70f361a48f56ce09d84689c681eee118db5d6b7bd2b8`. Its latest deployment run remains [43680927016](https://github.com/Kurohanolu/singularity/actions/runs/43680927016), successful. That run's head identifies the publishing repository, not the calculator source. Public-byte comparisons establish the calculator source identity separately.

## Public feedback and authentication boundary

The first fresh invocation of the original `feedback-production-check.cjs` stopped at an unclassified configuration-fetch exception. That unsuccessful attempt is retained in the raw record. Its cause was not established, and it is not classified as a demonstrated production incident. Independent Python GET/OPTIONS checks then succeeded, the complete original Node check succeeded **10/10**, and a separate direct Node GET returned HTTP 200 with the expected origin/no-store contract.

The successful read-only check confirms enabled production intake, absence of a known Turnstile test key, 90-day retention, exact frontend CORS, noncacheable public configuration, denial of anonymous administrator API/page/script access, and no public report-listing route.

| Origin / method | Result | Allow-Origin | Cache-Control |
|---|---:|---|---|
| Approved frontend / GET | 200 | Exact frontend origin | no-store, private |
| Approved frontend / OPTIONS | 204 | Exact frontend origin | no-store, private |
| Unapproved origin / GET | 403 | Absent | no-store, private |
| Unapproved origin / OPTIONS | 403 | Absent | no-store, private |

All four checks pass. Public configuration agrees with committed production/enabled settings, public site key and retention policy. The public Access JWKS endpoint returns 200 with two keys; key values are discarded. These are bounded public observations, not verification of complete Access/Turnstile administration or live Worker bindings.

Locked Wrangler 4.162.0 `whoami --json` returns `loggedIn:false` (exit 1). Presence-only checks find no Cloudflare token/key/email/account environment entries or known Wrangler credential files. No credential value was read, login attempted, or protection bypassed. This workstream has no authenticated management evidence.

**Cloudflare management remains INCOMPLETE:** current full Worker version/bytes/bindings, D1 data/linkage, complete Access application/policy/audience configuration, Turnstile administration/actual challenge, authenticated replay and current backend rollback target are not verified. Historical authenticated observations are not promoted to current evidence.

## Existing Issue #65 and privacy

Fresh public GitHub reads find Issue #65 open, not a PR, with one feedback marker. The complete 67-entry public issue collection contains one corresponding marker, in #65 only. Neither issue body nor marker value is reproduced in the evidence. This confirms public counterpart uniqueness; it does not establish current D1 linkage, live GitHub-token permission or the original backend operation. No new report or Issue was created, and no private report was read.

## Published assets and rollback archive

A new complete GET-only sweep ran **2026-11-15 17:21:07 JST–2026-11-15 17:29:15 JST**, using an isolated clean checkout of the immutable published source. Earlier audit network results are not substituted.

| Fresh check | Result |
|---|---|
| Static application files across new and legacy URLs | 73 |
| Raw, versioned and fresh-query HTTP/SHA-256 checks | **212/212 matched** |
| New site | 41 files / 118 matching requests |
| Legacy site | 32 files / 94 matching requests |
| External sprites | **371/371 HTTP 200**, observed hashes retained |
| Embedded sprites | 2 decoded and hashed |
| Existing pre.1 Release ZIP | 319 file entries; 2,530,855 bytes; byte-identical to UTC Git archive, including paths, full commit comment and published checksum |

Existing Release ZIP SHA-256: `60ec01af456a251eec006833ade16bddf5b5ef8e209c939d518879ebb2f4d500`. The scan includes HTML, JS/CSS, logos, favicon, release manifest, local images and packaged dynamic resources. Two `.nojekyll` build markers are excluded from application-resource requests. This is an actual byte comparison of the downloaded ZIP, not release-metadata inference.

Both sites' byte checks concern the build from existing pre.1 source, not a v1.0.0 candidate. The legacy calculator intentionally retains its frozen older engine/release identity. The browser workstream must separately demonstrate calculator, locale, save/reload and feedback behavior. External sprites remain mutable upstream resources; availability and observed hashes do not make them pinned application-source bytes.

The immutable pre.1 source and byte-verified Release archive are the current frontend rollback basis. The build preserves the old calculator and migration notice; frozen legacy source `4b2cde61f92610c5bb970618d34147a2c16a8d7b` remains the separate notice-free legacy recovery artifact. No actual production rollback or cutover was executed. A current backend rollback target cannot be certified without authorized management access.

## Stable-release workflow compatibility

The publisher already accepts an exact full source SHA and invokes that source's owner/release contracts, exact-source CI and dual-site builder. Its major-version test includes the v0.188 Quality workflow for 1.0.0. Before eventual stable deployment, the development workstream must update source and publisher required-CI lists to include the new v1 stable promotion gate and ensure stable Release creation sets `prerelease:false`; the historical source publisher hardcodes true. Source identity/approval contracts also need a stable path while retaining real evidence/protected-byte checks. This workstream only inspected those paths and did not edit or deploy them. The final candidate must separately prove its updated workflows and exact artifact hashes.

## Change log and interpretation

Source-only comparison of `services/feedback` and `feedback-config-v0185.js` from published pre.1 to the audited c9c candidate is empty. That is not a live deployed-byte comparison. No public failure or backend source change in the inspected scope justified Cloudflare changes.

Production mutations, deployments, D1 writes/deletions, reports, Issues, private-report reads, login submissions, secret operations and authentication relaxations are all **zero**.

Demonstrated public protections and existing source/artifact integrity may support a conditional frontend-only stable promotion, subject to the fresh v1 candidate's independent quality gate and explicit owner acceptance. Missing administrative visibility must remain a known operational limitation. This workstream does not assign the overall stable release verdict or infer owner acceptance. If management completeness is required before release, that requirement remains unmet.

The reproducible per-request headers, hashes, source/archive provenance, failed/successful readiness attempts and management presence-only results are retained in `v1-operations.json`.
