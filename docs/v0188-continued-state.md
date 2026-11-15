# Continued state and event audit

Baseline inspected before product edits: PR #67 candidate `8b37bddbb236fa1b7fbd13a7b2cebd1518995437`, published source `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`. Date: 2026-11-15 JST.

## C-S01 — valid Foul Play allocations cannot be saved (Medium)

The live UI replaces the defender's stored Attack allocation with the separate Foul Play Attack input when enforcing the 66-point budget. Persistence instead rejects any stored model whose unadjusted total exceeds 66. This loses an otherwise valid current calculation on reload; `save()` returns false without a storage-error message because schema validation fails before the write.

Before any product edit, execution of the actual `validateModels` function accepted defender HP32/Attack32/SpD32 and Foul Play Attack0: effective points are `32 + 32 + 32 - 32 + 0 = 66`. The persistence decoder rejected the same state. This is an inconsistency between existing UI rules and saved-state validation, not a new rule about Pokémon mechanics.

Expected correction: retain strict model shape, integer/range, privacy and ordinary budgets, but validate the defender's effective budget in the Foul Play context. Do not admit an effective budget of 67, an over-budget attacker or the same raw defender model for another automatic-mode move.

## C-S02 — manual Speed table edits do not reach calculation inputs (Medium)

In manual mode the actual-stat table writes HP or the currently referenced Attack/Defense to calculator controls. Speed falls through without updating `attSpeed` or `defSpeed`. The visible table is updated via `models[side].manual.speed`, while `read()` continues reading the previous Speed control. Both sides are affected. This can change Electro Ball or Gyro Ball calculations.

Before product edits, executing the actual input handler with attacker Speed122 / defender Speed81 and entering200 left the controls122/81 while the edited manual model became200. Expected correction: route each side's Speed edit to its corresponding speed control, preserving the other side, and make the manual table reflect the same canonical speed control after direct edits and reload.

The same display resolver reads the defender HP control but not attacker maximum HP. Direct manual `attMaxHp` edits therefore leave the attacker HP table stale. The proposed display correction reads both HP and Speed from their dedicated per-side canonical calculator controls. It retains model values as saved UI state but does not let stale model values override current calculation inputs.

## Existing mechanisms inspected

Storage captures only its explicit calculator allowlist plus models, stockpile count and conditional override. The save path does not invoke calculation or the UI restore bridge. Its unchanged text updates are already guarded, and existing tests cover debounce, pagehide, reset, quota denial/recovery, ignored feedback edits and untouched stale tabs. No speculative performance change is proposed from these observations.

## Evidence status

The initial reproductions execute real source handler bodies and the real persistence module in a deterministic VM. They are not browser or physical-device results. Further test and correction evidence will be appended after execution.

## C-P01 — feedback typing rebuilds the calculator UI (Low, performance)

Before this correction, the actual document input adapter was executed for 20 events each from feedback description, email and category. All60events called both `importBridge` and `refreshUI`, despite none being calculator inputs. `refreshUI` replaces type/base-stat DOM and writes calculator labels, which also wakes translation observers. This is work-count evidence, not a timing measurement.

The proposed narrow correction excludes inputs within `#feedbackPanel` from that calculator adapter. Existing feedback form validation/dirty handlers still process these events; calculator inputs, search exclusions, state storage privacy and attachment freshness remain under their own handlers. A same-run browser benchmark reconstructs the single old guard against otherwise identical candidate assets and records input-to-frame samples plus calculator DOM mutation counts; it is not a public-site or physical-phone comparison.

## Implemented correction and local checks

- C-S01: `validModels` accepts a bounded optional defender Attack replacement, used only for automatic Foul Play after control validation. Effective66 is accepted and effective67 rejected. Original model shapes, per-stat0–32, automatic ordinary/attacker66 limits, privacy exclusions and30-day envelope remain unchanged.
- C-S02: manual table Speed edits now write `attSpeed`/`defSpeed`; manual HP and Speed displays read canonical per-side controls. No formula, mechanic or fixed300 fixture changes.
- C-P01: the calculator's document input adapter now returns for descendants of the feedback panel. Actual-handler work-count regression observes60→0calculator refreshes over60feedback input events, while60ordinary calculator events still cause60refreshes. This is not a timing claim.
- Initial candidate `node tests/v0188-continued-state.cjs`:44/44checks passed before Sol’s applicability finding below. The initial39-case pre-fix run had10failures/29passes; additional HP-display and event-routing checks were added after their separate reproductions.
- Existing `v0188-persistence-schema.cjs`35checks, existing `v0188-astra-state.cjs` lifecycle/privacy checks, and exact historical inline contract pass locally.

New CI browser regressions cover nine-language valid-Foul-Play restoration and invalid67 preservation, Speed-table input via real `fill`/Tab actions, independent16-roll Electro Ball witnesses for Speed ratios122/81,200/81 and200/240 (power60,80,40), canonical HP/Speed display and full reload parity. The separate controlled-feedback benchmark uses five alternating contexts per variant per profile,20inputs each (100measurements per variant), desktop and390px/4×CPU; it records median, quartiles, IQR, min/max and DOM work counts with environment metadata. It asserts state/numeric/text/storage preservation but sets no flaky speed threshold.

Both new browser scripts pass syntax validation. Local Chromium cannot launch (`EPERM`), so browser and timing results require the exact-candidate CI evidence. No real-device result is claimed.

## Independent Sol follow-up: manual-mode aggregate applicability

Sol identified that the first C-S01 correction remained incomplete: after saving a valid automatic Foul Play state with raw98/effective66 points, switching to manual mode made persistence reject the state again. Live `validateModels` returns immediately in manual mode because stored point allocations are inactive. The previous test expectation that manual mode must reject this aggregate was incorrect; it did not match the live contract. This finding was reproduced before changing the implementation by new tests accepting both Foul Play and ordinary-move manual states and inactive per-stat maxima.

The follow-up correction applies aggregate budgets only in automatic mode, retaining all per-field shape, point/rank/nature/manual-value bounds, numeric controls and privacy validation in both modes. The browser regression additionally covers automatic Foul Play→manual→edit→reload, changing the selected move in manual mode and reloading, and rejection when re-enabling automatic calculation with an invalid aggregate.

Pre-correction follow-up test:3failed/49passed. After the applicability correction:52/52passed. The six manual-mode corruption/range negative checks remain rejected, and automatic attacker/ordinary/Foul Play aggregate negatives remain rejected. The original35schema and existing state-lifecycle tests also pass. Exact-candidate browser CI remains required for the added nine-language transition/reload cases.
