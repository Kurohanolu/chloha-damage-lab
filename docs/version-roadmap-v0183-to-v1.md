# Damage Lab — Consolidated Version Roadmap (2026-11-14)

Status: **proposed sequence**, subject to owner approval and CI/manual release gates. This supersedes the *future version numbering* in the older `v0183-internationalization-plan.md`, but does not erase its i18n requirements.

## Current position: v0.186 Pre-Release32 released; v0.187 preparation

v0.185 Pre-Release 31 is published at `2fc88af6390f286fa7d1a531203f99c35dfa6767` (PR #59). All required CI, real private feedback delivery, signed-owner moderation, approved Issue export, duplicate prevention and the release archive were verified. Its existing production infrastructure is outside v0.186's mutation scope.

v0.186 Pre-Release32 is published at `4b2cde61f92610c5bb970618d34147a2c16a8d7b` (merged PR #62, Issue #61) following the owner's conditional progression approval. All seven mandatory workflows, live Pages smoke and release publication completed / success on the exact main SHA. Public HTML/manifest, all 28 runtime assets, the downloaded ZIP/checksum/digest and archive commit identity were verified. No current-scope confirmed P0/P1 remains; existing Unverified/Partial/Unsupported and hardware limits remain documented. See `v0186-release-readiness.md`.

## Historical v0.183 closure
- Finish nine-language localization, official-name and native-select audits; classify same-spelling official labels as valid rather than automatically calling them missing translations.
- Fix browser E2E regressions and rerun CI. Check reload persistence, dynamic notices, localized names, and no damage change on locale switching.
- Owner's deployed Chloha Labs mobile/manual sign-off remains required. CI green alone is not release approval.
- Avoid expanding the feature set until this gate closes.

## v0.184 — Engine inventory, baseline and staged refactoring
- Inventory authoritative calculation entry points, shared mutable state, modifier order, rounding, and UI coupling.
- Freeze a set of old/new deterministic damage vectors, including multihit distributions and Champions-specific exceptions.
- Introduce pure input/output contract with compatibility adapter; separate move power, abilities, item/field modifiers and localization gradually.
- Compare behavior after every extraction. No silent changes to numeric results or unsupported-mechanic warnings.
- See `docs/v0184-engine-refactor-plan.md`. Do not bump version simply to replace the historical core label.

## v0.185 — Anonymous Feedback System (owner-approved scope, 2026-11-14)
- Reuse the existing feedback backlog: four categories, private no-login reports, optional email, and optional reviewed calculation snapshots.
- Nine-language accessible UI retains drafts across language changes. Production intake remains disconnected until explicitly configured and approved.
- Worker + Turnstile + D1 intake, authenticated moderation, retention/deletion, and explicit technical-summary publication to GitHub Issues. No browser-side secrets.
- Dedicated deterministic local/CI security and browser tests, in addition to all five existing workflows and the frozen 300-case baseline.
- Issue #58 / PR #59; branch `feature/v0185-feedback-system`. The owner subsequently authorized publication; target v0.185 Pre-Release 31. Keep the PR in draft until production connection and real-service acceptance are complete.

### Integration audit retained within existing and v0.185 CI
- Cross-validate refactored engine against baseline and Showdown differential fixtures.
- Browser regression across nine languages, mobile widths, reloads, search, native selectors, warning messages and result parity.
- Profile performance and startup size; fix regressions, not speculative optimizations.
- Require manual hardware comparison for claims of Pokémon Champions accuracy.

## v0.186 — Accuracy & Mechanics Audit (confirmed, 2026-11-14)

- Inventory all existing roster/forms, moves, ability roles, items, types, field/stage/critical/screen/immunity/multi-hit/rounding/conditional paths. Publish explicit denominators and per-item evidence.
- Separate implementation coverage, independent automated verification and Champions hardware evidence. Use Verified / Unverified / Incorrect / Partial / Unsupported / Not Applicable.
- Extend independent Showdown sixteen-roll and fixed-seed combination checks; investigate every discrepancy before changing behavior. Preserve Champions exceptions until their actual provenance is established.
- Reproduce existing bugs with failing regressions, apply minimal evidence-based fixes, and account explicitly for any intentionally corrected old baseline behavior.
- Regress all nine languages, reload/state/search/warnings/numeric parity and the existing feedback system. Add dedicated audit CI while preserving the six existing mandatory workflows.
- No feature expansion until the owner decides the usable Pokémon pool has expanded. No new Pokémon/moves/abilities/items/rules, major redesign, rename or URL changes.
- Issue #61 / merged PR #62; release `v0.186-pre.32` published after final successful verification. Retain separate approval gates for production settings, unsupported-feature additions or insufficiently grounded specification changes.

## v0.187 — Singularity brand/URL migration preparation

Agreed direction, pending formal validation/adoption approval:

Issue #63 / Draft PR #64 / branch `prep/v0187-singularity-migration`. The 2026-11-15 execution brief now authorizes branch-only branding, logo/theme implementation and dedicated migration tests. See [the implementation and deployment plan](v0187-singularity-migration-preparation.md). The candidate includes a new-path artifact and an old calculator with a non-forcing migration notice, while preserving numerical behavior and private feedback. Actual name/logo adoption, Pages administration, repository creation/rename, URL cutover, production changes and main merge remain subject to final approval.

UI/runtime checkpoint `4410036663748cdc04e5feb7a59066af75200c01` passed all ten workflows. See [development/publication readiness](v0187-release-readiness.md) and [actual browser design previews](v0187-design-preview.md). This is a tested development candidate; production remains v0.186 and the proposed new URL is not live.

- Product: **Singularity**, an independent damage calculator developed by **Chloha Labs**.
- First free-URL candidate: `https://kurohanolu.github.io/singularity/`.
- Logo direction: **Orbital S**; design: black, white and neon pink.
- Preserve a migration route for old URLs/bookmarks and calculation users.
- Verify name/URL/design/hosting implications, then obtain owner approval before adoption. No implementation in v0.186.

## v1.0 readiness

Clear critical correctness defects, expose transparent support/verification limits, finish required hardware/manual acceptance and retain rollback/provenance. Passing CI does not certify all Champions mechanics.

## Sequencing and precedence

The latest owner brief fixes v0.186 as an existing-feature quality audit and v0.187 as migration preparation. This supersedes older provisional numbering and expansion plans. The v0.186 conditional approval is recorded separately from earlier v0.185 approval; actual v0.187 adoption still requires formal owner approval.
