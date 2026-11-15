# Continued locale and keyboard audit — pre-change record

Baseline inspected: PR #67 candidate `8b37bddbb236fa1b7fbd13a7b2cebd1518995437`, published `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`. Recorded 2026-11-15 JST before product edits. Previous UI-01 accessible-label and L-01 portrait corrections are retained.

## C-L01 — variable-power copy bypasses the selected locale (Low)

`syncMovePicker()` uses literal `Variable` for every non-Japanese language and its output is excluded from generic translation. The native move-option translator references `localeUiPhrases.Variable`, but that key is missing. A Korean selection of Electro Ball therefore contains `Variable` in both the selected-move summary and native option; German, Italian, Simplified Chinese and Traditional Chinese also require different text. French and Spanish legitimately share the spelling `Variable`; English-word detection alone would misclassify them.

The existing search-suggestion renderer already supplies the nine localized variable-power words. Reuse those translations in the shared UI catalog and route the selected summary through the catalog. No numerical power, move policy or damage formula should change.

## C-U01 — autocomplete active option becomes stale (Medium accessibility)

Move and Pokémon suggestion rerenders clear their option children and reset internal active indices but leave `aria-activedescendant` on the combobox. After ArrowDown then replacing a query with a no-match query, the combobox refers to a removed option. Changing to a different nonempty query can point to a new unselected result at the old index. Additionally, initial ArrowUp calculates `( -1 - 1 + count ) % count`, choosing the penultimate result rather than the final result for lists longer than one. Both move and Pokémon paths contain these behaviors.

Correct by clearing the active-descendant attribute when rebuilding results and handling the initial ArrowUp as the last result. Preserve IME composition handling, Escape dismissal, numeric state and selection behavior. Tests must execute the real source handlers with literal expected positions, and browser tests must verify all nine locales plus no-match/reload/state preservation.

## Execution boundary

Attempted local headless browser execution with installed `/usr/bin/chromium` failed before navigation: `process_singleton_posix.cc: socket() failed: Operation not permitted`. No local browser success is claimed. Source-function VM regressions can execute locally; complete browser checks require actual CI execution. No native screen reader, physical smartphone or exhaustive native-linguistic certification is claimed.

## C-L02 — selected-move verification warning is lost after translation (Low)

The same summary renderer extracted the Japanese fullwidth-bracket warning from the **already localized** native option. English and most other translated options use ASCII brackets, causing the summary to omit its unsupported/basic-only/unverified status; Chinese fullwidth translated warnings were wrapped again in ASCII brackets. This was found and reported before the summary edit. The warning elsewhere in the UI and the actual calculation-readiness policy remain unchanged; this finding concerns the selected-move summary.

The correction derives the warning from the existing canonical `moveCalculationReady()` and `verificationStatus`, then localizes its text. Existing native-option warning wording supplies the previously missing shared catalog entries; no new claim of mechanics support or game verification is introduced.

## Implemented changes and local evidence

- `index.html`: selected-move power uses the shared translator; warning classification uses canonical move metadata. Both autocomplete renderers clear the active-descendant attribute on rebuild; initial ArrowUp selects the final result.
- `i18n.js`: shared catalog receives `Variable`, `Unsupported`, and `Basic damage only; unverified` using existing suggestion/native-option translations. English, French and Spanish legitimately share `Variable`.
- Every inline and translator delta is represented by an exact reversible patch in the existing historical-contract fixtures. Cache-key updates are handled by the coordinating change after all runtime edits.
- `node tests/v0188-continued-locale.cjs`: **59 source-function assertions PASS**, including nine native-option and nine summary variable words, 27 canonical status witnesses, initial up/down positions for both autocomplete handlers at 1/2/5 results, and clearing removed active descendants on zero-result rerenders.
- `node tests/v0188-continued-locale.cjs --baseline`: intentionally FAILS against the immutable starting candidate. Its actual localized-option cases reproduce the variable-copy defects; source-handler witnesses reproduce initial ArrowUp and stale active descendants. The added canonical-status fixture also deliberately supplies option text without Japanese status markup, proving the corrected renderer no longer depends on that markup.
- Existing `v0188-contract-and-approval`, `v0188-astra-runtime-contract`, and `v0188-astra-ui-locale` tests PASS locally, retaining strict historical reconstruction and 90 existing translator/cache transitions.
- New required `v0188-continued-locale-browser.cjs` covers nine locales × 390/1440px, three warning classes, native option and selected-summary variable copy, all three comboboxes, no-result and populated rerenders, full numeric parity and reload. Its syntax check passed; actual CI results must be recorded by the coordinating audit. Existing six-width mobile coverage is retained separately.

No standalone dictionary-presence test is presented as linguistic proof. These corrections reuse existing reviewed application terminology; full native-speaker evaluation, physical phones and real assistive-technology experience remain unverified.
