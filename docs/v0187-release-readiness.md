# v0.187 — development candidate, production cutover pending

## Owner-approved rollout in progress — 2026-11-15 JST

The owner approved the reviewed name/logo/UI, new repository/Pages configuration, production acceptance/publication and main merge after the ten-workflow green head `d0c00a7cde3f194b7afc3b46debf52c701a442dc`. See [approval scope](v0187-owner-approval.md). The public `Kurohanolu/singularity` target has been created and Pages management is available through the owner's management UI. Source approval flags are now approved; actual target acceptance remains false until independently verified. Current rollout checkpoints and exact-head CI are recorded in PR #64. The pre-approval checkpoint evidence and remaining operational tests below are retained as history, not a new approval request.

Approval checkpoint `d33776be1f24c20793be88527d20189954d73052` passed all ten workflows. The old site's source was saved as `pages-legacy`/root at `aac68ac8eb7a23a72f91d8045833baadd97ec0c3`; Pages deployment43647174221 succeeded and all30 old HTML/manifest/runtime files matched v0.186 by SHA256. The new repository is public and readable, but the connected GitHub App cannot write it. Its owner UI installs the canonical `deployment/singularity-pages.yml` as `.github/workflows/deploy.yml`; Pages uses that workflow's generated artifact instead of a second engine source. Native tests exercise its actual eight-workflow exact-source gate with missing/failed/wrong/stale metadata. No PAT, deploy key, permission expansion or Cloudflare change is introduced.

Issue #63 / Draft PR #64 / `prep/v0187-singularity-migration`. The existing branch/PR were reused instead of creating duplicates. Production main remains v0.186 Pre-Release32 at `4b2cde61f92610c5bb970618d34147a2c16a8d7b`.

## Implemented and verified

- Singularity product identity and localized Pokémon Damage Calculator explanation/developer attribution/language control in all nine languages; Chloha Labs remains the developer, not a renamed umbrella brand.
- User-supplied Orbital S reference preserved unchanged, with square/header/favicon review adaptations and a mobile PNG export. Native inputs, IDs, labels, keyboard/focus behavior and reduced-motion handling are retained. The black/white/neon-pink/purple CSS is separate from the calculation engine. See [actual browser previews](v0187-design-preview.md).
- All28 original runtime modules, inline logic/data outside the presentation template, existing control IDs, backend Worker, 300 immutable fixtures and explicit v0.186 errata are checked against the released source. No formula, move, ability, item, roster or rule is expanded or changed.
- Nine-locale proposed-path browser checks plus a legacy-path pass compare 3,000 full numeric contracts. Search, reload, input/result preservation, logo loading, 320px/390px/desktop geometry, language touch size and header overlap are covered.
- Local real Worker/SQLite feedback acceptance in all nine languages, optional/frozen preview and consent, language draft retention, pending-send duplicate prevention, outage/retry, anonymous administrator denial and no old-to-new draft transfer passed. The unchanged v0.185 workflow separately covers signed administrator authorization, private data, approved technical-only Issue export and duplicate Issue prevention with reproducible mocks.
- Offline artifact preparation produces a new `/singularity/` site and the frozen v0.186 old calculator plus a localized separate-tab notice. The owner keeps source/Issues/PR/CI/history and Issue-token destination in this repository; an approved new project would serve generated static output only.
- Final publication gates reject the pending design/cutover/actual-target state before any public verification or mutation. After later approval, both actual public artifacts and the old-site notice must match source hashes; missing/stale old or new content blocks publication. Mock tests verify this without accessing production.
- A concrete [approval-only cutover/rollback runbook](v0187-cutover-runbook.md) specifies the two publishing branches, clean-source artifact inventory, Pages-management capability limits, staged old-source isolation before main merge, actual-service acceptance and final-metadata redeployment. The supplied full logo is checked by its exact SHA256 rather than file size alone.
- Lifecycle follow-up separates owner/design-authorized new-target acceptance from final dual-site publication. `--accept-new-target` can verify the new site's complete static files while `liveTargetVerified` is still false and the old notice is not yet deployed; it cannot set approval flags or publish. Final publication still requires all approvals, recorded real-service acceptance and both deployed trees. Tests synthesize pending/design-approved/accepted states instead of requiring the repository to remain pending forever. Empty/incomplete/unsafe inventories and local corruption fail before any public read; redirects, missing and stale public files fail acceptance.

## CI evidence

UI/runtime checkpoint `4410036663748cdc04e5feb7a59066af75200c01`: all ten workflows below were retrieved directly and completed / success. Later documentation/evidence heads have their own exact-head results in Draft PR #64; an earlier green head is never substituted for a pending head.

| Workflow | Checkpoint result |
|---|---|
| [Showdown differential tests](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635685) | completed / success |
| [Showdown differential audit](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635725) | completed / success |
| [v0.184 engine baseline](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635687) | completed / success |
| [Damage Lab CI and status ledger](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635721) | completed / success |
| [UI & damage regression](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635835) | completed / success |
| [v0.185 anonymous feedback](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635678) | completed / success |
| [v0.186 Accuracy & Mechanics Audit](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635679) | completed / success |
| [v0.187 Singularity Migration](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635903) | completed / success |
| [GitHub Pages live smoke](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635674) | completed / success against published PR base |
| [Publish verified prerelease](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43611635735) | PR validation success; publication job skipped |

The first new migration run exposed a test using the hidden native move select. It was corrected to use visible search. Screenshot review also corrected header overlap and residual light panels; CJK fonts were installed on the CI runner for readable visual evidence. No test was disabled. Existing workflow path filters were extended to keep migration-related assets, tests and review documents covered; the publisher's production push trigger remains restricted.

Local Chromium launch was restricted by the managed environment; it was not reported as a browser PASS. Actual browser results and screenshots above came from GitHub CI. No new hardware damage measurements are claimed.

## Real-service checks and current publication state

- Existing production feedback read-only readiness passed all ten checks: configured approved HTTPS origin, reachable enabled intake with a non-test Turnstile key, retention90days, exact frontend CORS origin, no-store, no public report listing, and denial on three administrator routes. No production report, Issue export, authenticated report read/deletion, secret or Cloudflare setting mutation was performed.
- The candidate path and old path share `https://kurohanolu.github.io` and the same Turnstile hostname. Existing code/config supports reuse; no CORS or authentication protection was relaxed. Local path/API tests do not replace future real new-target challenge/delivery/Issue acceptance.
- Public recheck on 2026-11-15: `/singularity/` returned404; the old calculator returned200 and matched the v0.186 source bytes. No target repository/URL was created or reserved. Connected repository GET404 may be permission-filtered; it is not a guarantee of name availability.
- Existing Pages deployments use the built-in `dynamic/pages/pages-build-deployment` flow from main. The approved rollout must deliberately control that publishing source before merging branded code, deploy the isolated legacy artifact to the old URL and deploy the new artifact to the approved target. Do not let the existing branch-based mechanism accidentally publish the prototype root.
- Main was not merged, v0.187 was not released, and no existing infrastructure was recreated. Prepared metadata says `awaiting-owner-approval`, design approval is pending and actual target verification is false.

## Outstanding decisions and acceptance

1. Owner review and adoption of the exact logo and phone/desktop design. Adaptation limits are explicit.
2. Name-collision decision: Activision has a same-name game with trademark attribution. The bounded [name check](v0187-name-check.md) does not establish legal clearance or exclusive rights.
3. After approval, confirm the exact intended repository/Pages capability, create or reuse the target, configure the two publishing sources/identities and preserve the old working calculator. Do not reuse the private Worker's Issues-only token as a deployment credential.
4. Verify actual new/old HTTPS content, all runtime assets, native challenge/CORS/private delivery and authorized Issue export/duplicate prevention before setting the target acceptance flag and publishing. Any necessary synthetic production report must be part of the explicitly approved acceptance operation.
5. Main merge and public cutover require the owner's final approval. Keep the working v0.186 site until both destinations and rollback are accepted. No old URL shutdown, paid domain, repository rename/deletion, production data deletion or Cloudflare authentication change is included.

Existing v0.186 Unverified/Partial/Unsupported and hardware limits carry forward unchanged. They are not resolved or newly implemented by this migration. Code and automated verification can be complete while official target construction, design/name adoption and publication remain pending; these states must be reported separately.
