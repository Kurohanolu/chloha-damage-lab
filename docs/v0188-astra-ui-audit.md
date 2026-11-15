# Astra UI / locale audit — pre-change record

Baseline: published `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, inspected 2026-11-15 JST. This record was created before changing the translator.

## Confirmed finding UI-01 (Medium)

Seven non-Japanese/non-English locales retain English accessible names for stat controls. For example, `Attacker Attackstat points` and `HP nature modifier` remain unchanged in French, German, Spanish, Italian, Korean and both Chinese locales. The published browser accessibility snapshot also showed English navigation, role/preset labels and stat-budget text in Traditional Chinese. Numerical calculation is not implicated.

Root causes in `i18n.js`: regular-expression literals in `localizedDynamicControl` use double-escaped `\\s` and `Sp\\.`; these match literal backslashes instead of whitespace/periods. The existing translated stat-name/role/kind tables are consequently unreachable for real control names. The budget pattern accepts ASCII parentheses only, while the actual renderer emits fullwidth parentheses. Several accessible action/overview/edit/preset phrases have English conversion but no secondary-language rendering.

Reproduction uses the actual unchanged translator in a Node VM, exposing its internal locale selector and text/ARIA transformations only in the test process. No production instrumentation is added. The actual HTML renderer emits `能力ポイント 20 / 66（残り46） · Lv.50 / 個体値31`; it becomes mixed English in the seven other locales. The regression will exercise those exact renderer strings, dynamic updates, all nine starting locales, and Japanese recovery.

## Verification boundary

The existing UI suite covers 9 locales × 6 widths (320, 360, 390, 430, 768, 1440), search, details, feedback errors, focus, state restoration and selected contrast checks; it does not assert these accessible names. Local Chromium launch is unavailable in this execution environment, so new actual browser checks must run in GitHub Actions. Physical phones, full screen-reader use and all gradient/pixel contrast remain unverified. No production form submissions are needed.

## Implemented correction and reproducible verification

Only `i18n.js` is changed in this subtask. Corrected literal-regex escaping, accepted the actual renderer's fullwidth budget parentheses and negative remaining values, and filled accessible navigation/edit/overview/preset descriptions using the existing stat/role tables and translation pipeline. No new observer, duplicate Pokémon terminology catalog, numeric-input mutation or calculation-engine change is introduced.

- `node tests/v0188-astra-ui-locale.cjs --baseline` intentionally fails against the published baseline at `fr: English control leaked: Attacker Attackstat points`.
- `node tests/v0188-astra-ui-locale.cjs` passes the corrected translator: 90 language/cache transitions, all six stats × four control kinds × three role forms × seven additional locales, dynamic rerender, exact Japanese restoration, preset digits and over-budget numbers.
- Existing `v0188-locale-quality`, `v0188-portrait-alt`, `v0188-locale-reference`, `v0183-locale-registry`, `v0183-result-locale-phrases`, and `v0183-ko-verdict-locale` tests pass locally.
- `node tests/v0188-astra-ui-locale.cjs --browser` adds 54 real-browser locale/viewport checks of actual control attributes, overflow, identical numeric inputs/results and reload. GitHub Actions must supply its actual result. Local system Chromium fails to launch; the existing 90-transition browser test also cannot start without the matching browser installation. These are not recorded as test passes.

New short accessibility phrases are authored translations; full native-speaker review remains open. Existing localized Pokémon/move/type references were reused and their separate representative reference tests remain passing. The new test does not claim every catalog entity or every UI phrase has been linguistically reviewed.

## Initial CI test correction

The first added browser test failed its aggregate `aria-label` count before reaching locale assertions. Source inspection showed that the 48 detailed stat inputs are named by native wrapping labels, not `aria-label` attributes. The test now checks all 48 controls by explicit ID and requires a nonempty associated `.sr-only` label, plus exact counts and nonempty names for 12 preview buttons, 10 presets, 2 stat overviews and 4 navigation/summary controls. This expands the actual inspected names to 76 rather than lowering the original arbitrary count. No product code was changed for this test correction. The VM fixture also now uses the renderer's exact `の6能力ポイント` phrase. Actual CI rerun is required.
