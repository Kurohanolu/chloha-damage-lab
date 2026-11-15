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

No product runtime source changes were made by this supplement. No defect was inferred solely from unavailable local browser execution.
