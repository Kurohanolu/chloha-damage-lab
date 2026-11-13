# v0.182 comprehensive audit → v0.183 release gate

Status: IN PROGRESS. Do not change the version or claim completion until the gate is satisfied.

## Verified CI milestones
- `69f5d47`: 9 Showdown comparison scenarios (16 rolls each); UI and differential PASS.
- `cd04b63`: 24 Mold Breaker-family cross-feature checks; UI and differential PASS.
- `4e6d6eb`: 14 critical/screen/weather/item checks; UI and differential PASS.
- `09b6433`: 6 terrain/grounding checks; UI and differential PASS.
- `2c5c7a8`: JA→EN→JA calculation/form-preservation regression added; **latest CI outcome not yet confirmed**.

## Release blockers / acceptance criteria
- [ ] Latest HEAD: UI & damage regression PASS.
- [ ] Latest HEAD: Showdown differential audit PASS.
- [ ] Audit attack and defense ability catalogs for missing, unimplemented, or misleading "supported" entries.
- [ ] Audit damaging move coverage, conditional move assumptions, and unsupported mechanics.
- [ ] Audit held item coverage and stacked modifier rounding against Showdown.
- [ ] Verify critical-hit, terrain, screen, weather and type-immunity interactions with independent reference vectors.
- [ ] Verify Japanese/English search, labels, mobile layout, switching without reload, and no changes in calculated rolls.
- [ ] Distinguish Showdown reference results from Pokémon Champions hardware-confirmed results; do not claim hardware parity without evidence.
- [ ] Publish an explicit final PASS/OPEN-ISSUES summary and receive authorization before changing version to v0.183.

## v0.183 design scope (planning only)
- Isolate language dictionaries from calculation state and immutable identifiers.
- Establish stable translation keys, missing-translation detection, fallback rules and locale roundtrip tests.
- Preserve numeric calculation results and selected Pokémon/move/ability/item across locale changes.
- Prepare for v0.184 expansion (including Korean/Hangul). Prefer official Pokémon names; cross-check terminology against Korean Pokémon Champions resources and seek native-speaker review for UI prose.
- No new languages or version bump in this audit commit.

## Known limits of current differential
- Nine scenarios, not exhaustive coverage. Passing 16 rolls per scenario is not proof of full engine correctness.
- Engine-level invariant tests do not replace independent Showdown reference comparisons.
