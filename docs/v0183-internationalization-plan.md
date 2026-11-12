# Chloha Damage Lab — v0.183 Internationalization Plan

Status: PLANNED. Do not begin until v0.182 multi-hit implementation, Showdown comparison, regression tests and production release are complete.

## Goal
Build a scalable internationalization (i18n) foundation. Preserve all calculation semantics while making UI and Pokémon-related names locale-aware. v0.183 is an infrastructure release, not a promise that every translation is complete.

## Target languages (9 total)
- Japanese (ja)
- English (en)
- French (fr)
- German (de)
- Spanish (es)
- Italian (it)
- Korean (ko)
- Simplified Chinese (zh-Hans)
- Traditional Chinese (zh-Hant)

## Data architecture
1. Use stable language-independent move, Pokémon, item and ability identifiers in all calculation inputs.
2. Keep the existing Showdown-based mechanics and reference tests independent of displayed names.
3. Audit Pokémon Showdown translation resources and PokéAPI language-specific name coverage before choosing a canonical dictionary. Do not assume either has all Pokémon Champions-specific forms or new Mega Evolutions.
4. Maintain a reviewed local fallback dictionary for absent names, including alternate forms.
5. Extract interface strings, errors, labels, options, tooltips and dynamically generated result messages into keyed locale resources.
6. Change locale without reloading or resetting Pokémon, moves, stats, items, abilities or calculated results. Persist the selected locale only when the UI explicitly supports it.

## Verification gates
- Japanese and English parity regression.
- Switching en -> ja -> en must leave no stale labels or changed selections.
- Every target language must produce identical numeric damage and KO probabilities for the same underlying inputs.
- Validate missing translations, fallback behavior, long-label overflow, mobile layout, and special characters.
- Do not label a locale complete until names, UI, errors and calculation results pass browser checks.

## Sequencing
- v0.182: finish and publish multi-hit calculations safely.
- v0.183: locale architecture, stable identifiers, translation audit and initial tests.
- v0.184: expand translations into all target languages.
- v0.185: full 9-language browser, layout and calculation-parity audit.

Production must stay on the last validated release until its successor passes release gates.
