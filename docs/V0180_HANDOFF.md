# Damage Lab v0.180 — Development Handoff (2026-11-12)

## Source of truth
- Repository: https://github.com/Kurohanolu/chloha-damage-lab
- Public GitHub Pages: https://kurohanolu.github.io/chloha-damage-lab/
- Main/public version: v0.179 Pre-Release 18. Do NOT publish or merge incomplete v0.180.
- Development branch: `fix/v0179-mobile-english-ui`
- Draft PR: https://github.com/Kurohanolu/chloha-damage-lab/pull/40
- Last verified passing code commit BEFORE this documentation: `f294d1f0d165cc86357ac4331d1061ccb8d85973`.
- Verified CI for that commit: UI & damage regression #188 SUCCESS (run 43144267484); Showdown differential tests #81 SUCCESS (43144267936); Showdown differential audit #125 SUCCESS (43144267503).
- CI success means existing checks pass, NOT that full English coverage or real Android UI acceptance is complete.

## Version plan (agreed with owner)
- v0.180 Pre-Release 19: complete English localization and bilingual switching, including mobile UI. Do not raise the public version before completion.
- v0.181 Pre-Release 20: weight-based moves.
- v0.182 Pre-Release 21: multi-hit moves.
- Do not divert into v0.181/v0.182 while v0.180 localization is incomplete.

## Actual Android findings motivating PR #40
- Pokémon search placeholder `名前を入力して選択` remained Japanese.
- Move search placeholder `例：じしん、10まんボルト` remained Japanese.
- Search results mixed languages (`Rockなだれ`, `Flamethrower / かえんほうしゃ`, Japanese move names, Japanese type/status).
- Ability options, items, weather, terrain, battle format showed Japanese.
- Defender stat-toggle button showed `能力値を表示`.
- `Stat points 0 / 66 (remaining66)` spacing problem.
- Screenshots came from real Android English-mode display. Do not claim fixed on-device until rechecked.

## PR #40 edits to date
- `i18n.js`: translated select options using entity/dictionary/runtime rules, reversible placeholder/attribute localization, English ability status suffixes.
- `index.html`: dynamic move suggestions now use English name when known, English statuses, and explicit translation of all 18 types.
- `tests/v0179-localization.cjs`: Android-derived tests for select options, placeholders, move suggestion labels and roundtrip.
- The branch has three successful CI workflows at commit `f294d1f`.

## Progress after initial handoff (2026-11-12)
- Fixed selected move summary in `index.html`: locale-aware move name, type, power and status instead of mixed-language text.
- Added regression assertions in `tests/v0179-localization.cjs` for English selected-move summary.
- Latest code commit at this handoff update: `aa2ad26013e0b7cd0dbdf415fee31c4fd14a12bf` (CI result must be checked; previous verified passing commit remains `f294d1f`).

- CI on handoff commit `2fc0bf635dca4e81d780421a3173e7cf5165f81d`: UI regression, Showdown differential tests, Showdown differential audit all SUCCESS.
- Fixed English stat-point counter spacing (`remaining 66` rather than `remaining66`), with regression assertion. Latest code commit `d257836c1887b9c7f7b525f218b3ad6a283490fc`; CI pending at time of documentation update.

- Added explicit translations for held-item modifier labels, battle format, grounding, spread-target settings, and ally count in `i18n.js` (code commit `d0b9e343`). Added regression assertions (code commit `80112782767295919e7b1b7359a1ca819f50a65d`). Verify CI before declaring success.
- Previous CI for `521bdc4` showed Showdown tests/audit PASS, UI regression still running at initial check; recheck final result.

- Source-data audit: all 335/335 move names, all 373/373 Pokémon entries, and all abilities referenced by those Pokémon have entries in the combined English name dictionaries; zero missing in these checked sets. This does not prove every rendered UI label is English.
- Fixed composite `#dbMove` selector options (move/type/power/status) and added a full 300+ options Japanese-leakage regression test. Code commit `46bfed38d97d6f55c24a01ca9cab366242d04e37`; CI not yet verified.

## Remaining work — important
1. Audit every visible English-mode string on mobile and desktop: options, dynamic search suggestions, selected move summary, abilities, items, terrain/weather, advanced settings, stat toggles, result status, alerts, ARIA labels, and placeholders.
2. Audit completeness of `window.ChlohaNames` across `names-v0179.js`, `names-ja-en.js`, `names-catalog-v0179.js`, `names-forms-v0179.js`; ensure actual available Pokémon/moves/abilities/items are mapped. Prevent substring replacements from producing mixed Japanese-English words.
3. Ensure both Japanese→English and English→Japanese switching restores correct original strings, and language choice survives reload.
4. Add regression tests for any uncovered Android issues; do not rely on one passing smoke test as proof of full localization.
5. Confirm all required CI checks pass at final commit. Ask for Android screenshot verification when a candidate is ready.
6. Only after all acceptance criteria pass, finalize v0.180 version, PR, merge, deploy and verify GitHub Pages; then advance roadmap.

## How to resume in a new chat
Tell assistant: "Continue Chloha Damage Lab v0.180 English localization using docs/V0180_HANDOFF.md on branch fix/v0179-mobile-english-ui, PR #40. Check latest GitHub commits and CI before editing. Do not merge or deploy until English UI is complete and Android verified."
