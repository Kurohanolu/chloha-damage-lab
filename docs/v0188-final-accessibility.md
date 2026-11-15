# v0.188 final accessibility supplement

This supplement belongs to the Final Release Gate Report and PR #67. It adds targeted checks to the existing 90 locale transitions, 54 locale/viewport combinations, and 18 search UI combinations; it does not replace them.

## Target and execution evidence

- Product baseline: `5f88e471d5a8a3374181ce0d37deb211c1dd9f26`.
- Test: `tests/v0188-final-accessibility-browser.cjs` (automatically discovered by `scripts/v0188-run-tests.cjs`).
- Each execution writes its exact `git rev-parse HEAD`, passed/failed status, completed cases, and failure message to `reports/v0188-final/accessibility.json`.
- Initial local validation: JavaScript syntax check passed. Local Chromium is unavailable in the Work environment due to socket sandbox restrictions; **browser execution and visual review remain pending until CI artifacts are inspected**. Syntax validation is not a browser PASS.
- CI must retain `reports/v0188-final/`. An interrupted run or missing JSON is incomplete, not a pass.

## Additional checks

All nine supported locales are exercised. Three comboboxes (move, attacker species, defender species) each receive both `KeyboardEvent.isComposing` and composition-session events. ArrowDown, ArrowUp, and Enter must leave the selected entities, active descendant, and complete numeric input/result unchanged during composition. After compositionend, ordinary arrow navigation must resume. Escape must collapse the list, clear aria-activedescendant, and retain input focus. This supplies 27 combobox cases, each exercising both composition guards.

The feedback UI is a **nonmodal named region**, not a modal dialog. For each locale the test checks its heading association; computed accessible names on search and feedback controls; opening focus on category; Escape and close-button return to the trigger; keyboard reopening; retained draft text; and unchanged calculation. It does not impose a modal focus trap on the existing region design.

All feedback configuration and Turnstile resources are local browser fixtures. The report endpoint is intercepted and counted, and the test requires zero report submissions. External nonfixture resources are blocked by the shared helper. No production report, Issue, data deletion, or authenticated API action is involved.

Three full-page screenshots are emitted for visual inspection: Japanese at 320 CSS px, Korean at 390 CSS px, and Traditional Chinese at 1440 CSS px. Capture is not equivalent to human visual review. The existing full six-width audit remains the main responsive-layout evidence.

## Scope limits and gate interpretation

- Synthetic composition events verify event-handler guards; they do not establish physical-keyboard, operating-system IME, or real touch-device behavior.
- Chromium computed accessibility snapshots verify names/associations and focus behavior. They do not establish native screen-reader pronunciation, reading order in every AT, or cross-browser accessibility.
- Presence of localized accessible names does not establish translation accuracy. Native-language review remains distinct.
- This supplement makes no full contrast-compliance claim. The existing sampled text contrast checks and their exclusions remain applicable.
- Screenshot files and successful CI assertions must be reviewed against the final candidate SHA; earlier candidate results cannot authorize a changed product candidate.

The initial test-only supplement made no product runtime changes. The later screenshot-confirmed FINAL-L01 and independent-review FINAL-L02 corrections are documented below. No defect was inferred solely from unavailable local browser execution.

## FINAL-L01: Korean version notice prefix (Low)

Visual inspection of the first final-gate artifact reproduced an English fragment in the Korean footer. At 390 CSS px, select Korean and inspect `#versionProvenance` near the bottom. The screenshot and source both showed `버전 안내: The on-screen “v0.188 Pre-Release 2”는 ...`. The omission also exists in product baseline `5f88e471d5a8a3374181ce0d37deb211c1dd9f26`; it is not a new pre.2 regression.

The final Korean template begins `버전 안내: 화면에 표시되는 “v0.188 Pre-Release 2”는 공개 UI 버전입니다.`. An initial prefix-only fix was subsequently replaced by the complete eight-language factual correction below; the intermediate observation that the other eight locales were unchanged does not describe the final patch.

## FINAL-L02: Version notice misstates verification evidence (Medium)

Independent review identified a factual mismatch between the canonical Japanese notice and all eight translations. The prior translations claimed partial Pokémon Champions hardware comparisons, injected a fallback count of 54 Showdown comparisons, and omitted the current weight-move, multi-hit, and unsupported Multiscale scope. The current candidate does not have evidence authorizing those translated claims. This is a discrepancy in the explanation of verification evidence, not a newly observed calculation error.

The correction is confined to the version footer. A central `localizedVersionProvenance` function supplies complete English, French, German, Spanish, Italian, Korean, Simplified Chinese, and Traditional Chinese templates. Each preserves the public UI/internal API distinction, says that hardware accuracy verification is not thereby complete, describes the automated regression, four weight-dependent moves and multi-hit browser checks plus Showdown differential tests, identifies unsupported conditions including multi-hit Multiscale, and states that confirmed Champions-specific differences are handled separately with Showdown as the calculation reference. It neither invents a case count nor makes a claim about whether any historical hardware comparisons ever occurred.

The English accuracy caveat explicitly names Pokémon Champions hardware, preserving the existing localization regression contract while retaining the negative verification caveat. The Japanese source is unchanged. Public version, internal core identifier, and regression version are extracted independently from that canonical source. The existing PokeAPI name corpus supplies the localized Multiscale names, including Spanish `Multiescamas`. The final i18n SHA-256 cache prefix is `65672cc5e00a98b2`. Exact reversible fixture entries preserve historical-byte reconstruction and rejection of unrelated source changes; no approval, engine, or backend protection is relaxed.

The browser test now checks all nine notices for the factual warning/scope fragments, absence of the fabricated 54 count and previous positive hardware-comparison statements, version identities, and the Korean prefix. Each locale is checked on initial restoration, after a language round trip, and after reload, with identical complete numeric calculation data. The raw notice is included in each evidence case.

Local validation passes: syntax, exact runtime contract, inline/approval contract, release/cache consistency, legacy version provenance, and 59 continued-locale source-function assertions. The new source-only regression independently exercises all nine notices with current and distinct synthetic version/core/regression identifiers, preserves the Japanese text exactly, and reproduces the previous factual-scope failure for all eight non-Japanese translations. Independent Sol semantic review found no blocker; this does not amount to native-language certification. Browser execution and screenshot review against the final corrected candidate remain required.

## First final-candidate evidence (historical, superseded after FINAL-L01/L02)

Run `43689633719`, quality job `132737332354`, workflow head `c895a8219d90a4b158db251af946c7a1e9715abf`: all 27 composition cases and nine feedback name/focus cycles passed, with zero report POSTs. Artifact `14152026906` ZIP SHA-256 is `2f9019408a240edf2a055f9eec1ad26312ab146a893c2dcdc05a7ffd849454cd`. The JSON records the checked-out PR merge commit `edac9d7ba1edbaab5499a42b59a4e5d54ecd0f0b`; tree equivalence to the workflow head must be established separately for source attribution.

All three screenshots were visually inspected. The Japanese 320px and Korean 390px layouts stack controls and results within the viewport; Traditional Chinese 1440px uses two columns. The large Japanese damage caption wraps at 320px but remains readable. The mobile fixed result strip is captured at the viewport-bottom position in a full-page screenshot; a static image does not verify every scroll/occlusion state. CJK glyphs and main labels render. The Korean prefix above was the concrete Low finding.

The full quality job failed solely in a separate pre.2 synthetic approval fixture (`nothing to commit`), so its downstream 90-transition and private-feedback steps were skipped. The successful accessibility subset does not make that workflow or the release gate pass, and these results must not be reused as verification of the changed final candidate.
