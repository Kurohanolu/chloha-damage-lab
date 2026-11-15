# v0.188 final accessibility supplement

This supplement belongs to the Final Release Gate Report and PR #67. It adds targeted checks to the existing 90 locale transitions, 54 locale/viewport combinations, and 18 search UI combinations; it does not replace them.

## Target and execution evidence

- Product baseline: `5f88e471d5a8a3374181ce0d37deb211c1dd9f26`.
- Final reviewed source: `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095`; Git tree `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b`.
- CI checkout: PR merge `3bb9c9a300fe20b98338bfb6d58ae2409062617f`; independently verified to have the identical Git tree.
- Test: `tests/v0188-final-accessibility-browser.cjs` (automatically discovered by `scripts/v0188-run-tests.cjs`).
- Each execution writes its exact `git rev-parse HEAD`, passed/failed status, completed cases, and failure message to `reports/v0188-final/accessibility.json`.
- Local syntax/source checks passed. Local Chromium remains unavailable due to socket restrictions. **Final browser CI and inspection of its raw JSON and all three screenshots are complete and pass within the documented scope.** The evidence comes from CI, not a claimed local browser run.
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

Local validation passes: syntax, exact runtime contract, inline/approval contract, release/cache consistency, legacy version provenance, and 59 continued-locale source-function assertions. The new source-only regression independently exercises all nine notices with current and distinct synthetic version/core/regression identifiers, preserves the Japanese text exactly, and reproduces the previous factual-scope failure for all eight non-Japanese translations. Independent Sol semantic review found no blocker; this does not amount to native-language certification. Final corrected-candidate browser execution and all three screenshot reviews are complete; the exact evidence and scope are recorded below.

## Final candidate result and retained evidence

**PASS for the finite automated checks and three inspected screenshot states.** Native screen-reader, physical-device, operating-system IME, and complete contrast certification remain unverified.

Final quality workflow [43691428060](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43691428060), job `132742711195`, completed successfully. The regression runner reports **34/34 files passed**. The accessibility JSON reports the exact PR merge above, which has the same tree as the final source. The final quality ZIP was independently hashed here as `585d95c201f4146118d307ae47dd86e040054f4faabdcfe996afc45718c71186` (3,299,280 bytes), matching GitHub artifact `14152748139`.

| Verified coverage | Final result |
|---|---|
| Nine locales × three comboboxes; 162 synthetic composing key events | 27 cases passed; no selected-value or numeric change during composition |
| Ordinary navigation after composition and Escape focus retention | Passed in all 27 cases |
| Feedback region naming, 90 named-control snapshots, focus/reopen/draft retention | Nine locale cycles passed |
| Version-notice factual scope and identities on initial locale, switch, and reload | 27 states passed with complete numeric equality |
| Report submissions and production mutations | Zero |
| Japanese 320px, Korean 390px, Traditional Chinese 1440px screenshots | All three final images visually inspected |

The final Korean screenshot displays the translated prefix and the corrected evidence caveat; the Traditional Chinese screenshot displays the updated verification scope and unsupported-condition warning. The Japanese footer is unchanged. Both mobile layouts stack controls within width and the desktop view uses two columns. No new clipping or horizontal spill is visible in these states. The Japanese 320px large damage label wraps across two lines but remains readable. The mobile fixed result strip is visible at the initial viewport bottom of the full-page captures; these images do not establish all scroll/occlusion or touch interactions.

Retained, byte-preserved final evidence:

- [Raw accessibility JSON](evidence/v0188-final-ui/accessibility.json), containing all nine rendered version notices and computed control names.
- [Visual review and SHA-256 receipt](evidence/v0188-final-ui/review.json).
- [Japanese 320px screenshot](evidence/v0188-final-ui/ui-ja-320.png).
- [Korean 390px screenshot](evidence/v0188-final-ui/ui-ko-390.png).
- [Traditional Chinese 1440px screenshot](evidence/v0188-final-ui/ui-zh-Hant-1440.png).

These results are limited to the frozen final source and do not authorize publication or replace Sol’s independent overall release-gate decision.

## First final-candidate evidence (historical, superseded after FINAL-L01/L02)

Run `43689633719`, quality job `132737332354`, workflow head `c895a8219d90a4b158db251af946c7a1e9715abf`: all 27 composition cases and nine feedback name/focus cycles passed, with zero report POSTs. Artifact `14152026906` ZIP SHA-256 is `2f9019408a240edf2a055f9eec1ad26312ab146a893c2dcdc05a7ffd849454cd`. The JSON records the checked-out PR merge commit `edac9d7ba1edbaab5499a42b59a4e5d54ecd0f0b`; tree equivalence to the workflow head must be established separately for source attribution.

All three screenshots were visually inspected. The Japanese 320px and Korean 390px layouts stack controls and results within the viewport; Traditional Chinese 1440px uses two columns. The large Japanese damage caption wraps at 320px but remains readable. The mobile fixed result strip is captured at the viewport-bottom position in a full-page screenshot; a static image does not verify every scroll/occlusion state. CJK glyphs and main labels render. The Korean prefix above was the concrete Low finding.

The full quality job failed solely in a separate pre.2 synthetic approval fixture (`nothing to commit`), so its downstream 90-transition and private-feedback steps were skipped. The successful accessibility subset does not make that workflow or the release gate pass, and these results must not be reused as verification of the changed final candidate.
