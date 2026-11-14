# v0.187 — Singularity brand and URL migration preparation

Status: planning only. No product rename, repository creation/rename, Pages configuration, URL cutover, Cloudflare mutation or private-data operation is authorized by this document. Formal adoption/publication approval is required after the concrete preview and migration checks are reviewable.

Baseline: v0.186 Pre-Release32, release commit `4b2cde61f92610c5bb970618d34147a2c16a8d7b`, PR #62. Publication evidence is recorded in the v0.186 closure issue/PR and immutable release. Continue the existing restriction against expanding Pokémon, moves, abilities, items or rules until the owner reopens that scope.

## Direction already agreed

| Element | Candidate | Decision still required |
|---|---|---|
| Product | Singularity, an independent damage calculator | Formal adoption after review |
| Developer identity | Chloha Labs | Placement and attribution in all nine languages |
| Free public URL | `https://kurohanolu.github.io/singularity/` | Availability, deployment permissions, migration route and final adoption |
| Logo | Orbital S | Exact supplied asset / reviewed vector variant, small-size and light/dark legibility |
| Palette | Black, white, neon pink | Accessible contrast and focused accent usage on actual calculator controls |
| Existing users | Keep an explicit route from the old URL | Link/notice behavior, timing and rollback |

This is a presentation and hosting project. Preserve the v0.184 internal calculation API and v0.186 behavior, fixed fixtures, independent reference pins, supported/unsupported boundaries and private feedback system.

## Hosting options and recommendation

GitHub's official documentation describes project sites at `https://<owner>.github.io/<repositoryname>` and free Pages hosting for public repositories. It explicitly excludes project-site URLs from automatic repository-rename redirects. A repository redirect must never be treated as an old Pages URL migration strategy.

| Option | Benefit | Consequence |
|---|---|---|
| Keep `chloha-damage-lab`; use a new `singularity` project repository for the approved frontend | Old calculator, Issues, tokens, release history and rollback remain available; new URL can be verified before any old-URL change | Two public trees need a documented authoritative source and sync policy; new repository/Pages setup and connected-app access need approval and capability verification |
| Rename the current repository | Preserves project history in one repository | Pages URL changes are not automatically redirected; existing Issue export is restricted to the old exact repository name; legacy URL must be explicitly preserved; broader production changes and token permissions would need separate approval |

Recommendation for review: preserve the existing repository and production feedback service during a staged new-project rollout. First establish a reviewed migration design and source-of-truth policy; do not create the second repository merely to reserve the name. Keep the old audited calculator working while the new path is being tested. A later optional old-URL notice/link is safer for in-progress calculations and unsent feedback than an immediate forced navigation.

Current availability has not been reserved or guaranteed. Recheck the exact repository and URL immediately before any approved creation. Do not infer availability from a permission-filtered API 404.

## Repository findings and integration map

| Existing component | Observed dependency | Work before an approved cutover |
|---|---|---|
| `index.html`, `release.json`, `package.json` | Public title/badge/provenance/cache keys and manifest are linked | Change public branding as one reviewed release, keep internal API version distinct |
| `scripts/verify-release.cjs`, `tests/v0177-version-provenance.cjs` | Product name is an explicit release invariant | Add an explicit approved product label; preserve strict title/badge/manifest and runtime-cache consistency checks |
| `tests/pages-live-smoke.cjs` | Supports `PAGES_URL`; defaults to the old public URL and checks HTML/runtime hashes | Verify both old and proposed new URLs against the intended source; do not point the existing production gate at an unapproved target |
| `.github/workflows/publish-release.yml` | Archive prefix and release project identity contain the old name | Review archive naming, commit/tag immutability and exact-head CI requirements; retain all v0.186 gates |
| `feedback-config-v0185.js` | Public UI uses the existing private Worker | Reuse the approved API origin; never embed secrets or create another intake service |
| `services/feedback/wrangler.jsonc` | Approved origin `https://kurohanolu.github.io`, Turnstile hostname `kurohanolu.github.io` | Both candidate paths use that same origin/hostname. This suggests path-only migration can reuse those bindings; verify real challenge/delivery behavior after approval instead of claiming production readiness from config alone |
| `services/feedback/src/worker.js` | Issue export deliberately allows only `Kurohanolu/chloha-damage-lab`; matching Worker variable and repository-scoped secret already exist | Retaining the old Issue destination avoids a token/config change. Choosing a new Issue destination is a separate owner decision; current code will reject arbitrary repositories |
| `feedback-snapshot-v0185.js`, `feedback-contract-v0185.js` | Snapshot app version comes from the numeric title; engine version and schema are separate | Keep snapshot validation, optional consent/review, private storage and no automatic personal-data export intact |
| `i18n.js` | Locale key is `chloha.damageLab.locale`; browser storage is shared by these same-origin paths | Preserve the key initially and test all nine language reloads. Audit other keys before changing names; do not clear stored preferences during branding work |
| Feedback form | Draft lives in the current page; navigation can discard unsent text | Migration notice must not force users away while entering/sending a report; test error/retry and duplicate prevention on either frontend |

The same-host observation is a code/config inference, not a claim that no future production verification is necessary. Existing Cloudflare Access, D1, Turnstile, Worker, secrets, rate limits and retention remain untouched throughout preparation.

## Concrete preview and acceptance work

1. Reuse the actual calculator layout and current interactions in a reviewable branch-only preview. Apply the candidate wordmark/logo and limited palette changes without moving core inputs or adding gameplay controls.
2. Compare phone and desktop views in all nine languages, including long labels, type badges, search results, focus states, warnings, numeric ranges and feedback states. Verify logo legibility at header/icon sizes and text contrast against the chosen surfaces.
3. Keep a single canonical, reviewed logo asset with provenance; do not assume a generated concept sheet is the final production logo. Final design/asset adoption remains an owner decision.
4. Before cutover, test relative assets, nested path reloads, release manifest/cache keys, old links, locale persistence, calculation snapshots and exact numeric parity against the v0.186 baseline plus justified errata.
5. Require the six legacy workflows plus v0.186 audit, release validation and actual live-content checks. Run private-feedback mocks and nine-language/admin regressions. Real synthetic feedback delivery, if needed, must use an explicitly approved test report and must never export private text/email automatically.
6. Review rollback with the old audited tree intact, immutable release archives available, and no feedback database migration or deletion required.

## Rollout checkpoints

- [x] Read-only feasibility and code dependency survey; reuse the existing v0.186/v0.185 work.
- [ ] Verify exact repository/URL availability and available GitHub Pages administration capability without creating resources.
- [ ] Branch-only branded preview and exact logo selection for owner review.
- [ ] Source-of-truth/sync plan, old-URL migration behavior and Issue destination agreed.
- [ ] All calculation, nine-language, accessibility and feedback regression checks on the actual preview head.
- [ ] Formal owner approval of product/design/URL and the concrete rollout changes.
- [ ] Approved repository/Pages work, actual target-site and existing-backend acceptance.
- [ ] Approved old-URL notice/cutover; post-release verification and rollback evidence.

## Carry-forward accuracy limits

Do not relabel these as solved by a redesign: historical Dudunsparce candidate SpA58 versus SV85 (absent from current Champions; reopen before future adoption), extreme non-battle manual-stat overflow, existing Partial/Unsupported mechanics including the five-move Sheer Force whitelist and explicit Multiscale/multi-hit rejection. Hardware verification remains separate from software-reference parity. Refer to the v0.186 coverage, parity and hardware-plan documents for exact denominators and evidence.

## Primary sources checked 2026-11-14

- [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages): project-site URL structure, public-repository availability and site types.
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits): free public hosting is subject to size, bandwidth, build and usage limits; a free URL is not unlimited hosting.
- [Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository): project-site URLs are excluded from automatic renaming redirects.
- Existing repository source/config paths listed above; no secret values or private report records were read for this survey.
