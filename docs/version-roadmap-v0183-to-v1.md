# Damage Lab — Consolidated Version Roadmap (2026-11-14)

Status: **proposed sequence**, subject to owner approval and CI/manual release gates. This supersedes the *future version numbering* in the older `v0183-internationalization-plan.md`, but does not erase its i18n requirements.

## Current position: v0.183 (closure)
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

## v0.185 — Full engine + nine-language integration audit
- Cross-validate refactored engine against baseline and Showdown differential fixtures.
- Browser regression across nine languages, mobile widths, reloads, search, native selectors, warning messages and result parity.
- Profile performance and startup size; fix regressions, not speculative optimizations.
- Require manual hardware comparison for claims of Pokémon Champions accuracy.

## v0.186 — Tester feedback intake (conditional)
- Decide hosted form versus trusted endpoint, considering privacy, spam, screenshots and maintenance.
- MVP: category, reproduction, expected/actual, optional screenshot and contact; explicit preview/consent for calculator inputs.
- Nine-language UI, mobile validation and private-by-default submissions. No client-side GitHub secrets.
- If scope or backend cost is too high, defer without blocking engine correctness.

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
The old i18n memo assigned v0.184 to translation expansion and v0.185 to browser audit. Translation expansion and initial browser audit have already been implemented within v0.183, although closure is still pending. Therefore this consolidated proposal reserves v0.184 for the engine and v0.185 for post-refactor integration verification. Do not silently treat this roadmap as a released version or an owner-approved milestone.

## Immediate action list
1. Repair failing v0.183 screenshot-label browser E2E and obtain a green UI workflow.
2. Recheck unresolved full-select candidate findings (distinguish valid same-spelling official labels from actual leaks).
3. Complete deployed manual acceptance.
4. Inventory engine boundaries and establish baseline before any v0.184 extraction.
