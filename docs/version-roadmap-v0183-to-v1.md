# Damage Lab — Consolidated Version Roadmap (2026-11-14)

Status: **proposed sequence**, subject to owner approval and CI/manual release gates. This supersedes the *future version numbering* in the older `v0183-internationalization-plan.md`, but does not erase its i18n requirements.

## Current position: v0.184 publication

The owner authorized completion and publication of the engine-extraction iteration as v0.184 Pre-Release 30. Entry-point inventory, isolated modules, compatibility bindings, DOM-independent move orchestration, and 300 frozen public-baseline cases are implemented. Exact-commit PR/main CI and deployed-content checks gate publication. See `docs/v0184-release-readiness.md`.

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

## v0.186 — Not assigned
The proposed feedback milestone moved into v0.185 by explicit owner instruction. Choose the next milestone after the feedback candidate and production connection are reviewed.

## v0.187+ — v1.0 readiness (provisional, not committed)
- Clear remaining critical correctness defects, accessibility/mobile issues, documentation and provenance.
- Publish a transparent support/verification matrix. Separate tested Showdown parity from Pokémon Champions hardware validation.
- Final release requires green CI, owner manual acceptance, rollback plan and documented known limitations.

## Singularity — potential v1.0 branding (not approved)

- **Working name:** Singularity. This is a proposed future public name for Damage Lab, **not a confirmed rename**.
- **Timing:** consider the name before the v1.0 public release; do not rename v0.183, v0.184, or the repository/site automatically.
- **Decision gate:** owner approval after checking brand fit, naming conflicts, domain/URL implications, search discoverability, and user migration.
- **Migration checklist if approved:** visible title, site navigation, metadata, favicons/logos, docs, GitHub README, screenshots, release notes, feedback form, and legacy-name redirects. Preserve existing bookmarks and calculation functionality.
- **Versioning:** rebranding is independent of engine version; do not claim an engine upgrade solely because of a name change.
- **Open:** whether the final product name should be just `Singularity` or include a qualifier, and whether the Chloha Labs umbrella remains in the header.

## Sequencing and precedence
The latest explicit owner brief assigns v0.185 to private anonymous feedback, superseding the earlier proposed v0.185 audit / v0.186 feedback numbering. Existing integration audits remain required CI. Development completion is separate from owner-approved production connection and publication.

## Next iteration
Connect the private production service, pass its readiness/live acceptance checks, and rerun required CI for v0.185 Pre-Release 31. Publication authorization is already recorded; main stays at the verified v0.184 Pre-Release 30 until those connection prerequisites pass.
