# Pre.17 CI expectation corrections

The first candidate `7ddf95a225e1517e954cccb710e4d36dbdf1b7b2`, tree `73b8363319a8cdee40be0198f30fa24d920aac94`, is **not eligible for release**. Localization run [44215892393](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/44215892393) found 70 passing and two failing tests out of 72. The independent Sol reviewer reproduced the evidence interpretation and blocked publication. Early artifact 14388704622 has SHA-256 `f3f030272efe098a95702e74782cac01d94c8993b083cbce8c80d6b4370ae17f`. Its merge source `d537863b352277a569927b653f71a7bb79b6c692` has the same exact tree.

## Avalanche expectation, not a mechanics change

The new browser test incorrectly inferred fail-closed behavior from the raw catalog's `calculationSupported: false`. Published pre.16 already has a higher-priority `ChlohaMovePolicy.gw0170_u054` entry: `manual_conditional_double`, `standardDamageSupported: true`, `mechanic: avalanche`. `moveCalculationReady` checks that policy before the raw flag. The unchanged conditional-power control and engine implement the manual 60/120-power choice. The failed CI assertion itself captured a real pre.16 16-roll result at effective power 60.

No product behavior is changed to satisfy a test. The corrected test preserves all six moves, ten locales, two viewport widths, 120 native numerical/state/save/reload cases and 12 ES-LA visible search cases. It additionally executes 20 Avalanche condition-enabled cases at power 120, checking exact predecessor/candidate inputs, full outputs, persisted checkbox, exact policy and localized disclosure equality. This is stronger than deleting the false null assertion. Assertions against all 16 rolls and the immutable predecessor remain.

The earlier phrase “unsupported Avalanche” in the draft PR was incorrect; the existing manual policy, not the stale catalog flag alone, defines calculator behavior. These screenshots still establish only terminology, not correctness of game mechanics.

## Pokédex metadata expectation, not weaker regional evidence

The original 225-species browser test requires every generic Pokédex attestation to have `officialChampions: false`. This is still correct for its historical source, but now conflicts with independently verified current evidence for precisely Sylveon, Gengar and Gyarados.

The entire original browser test remains byte-for-byte as the suffix of `tests/v110-pokedex-batch5-browser.cjs` and executes against immutable published pre.16 `a68b987d25d392076f36413e7f626ea3b71391c2`, tree `c8292fafb8b927985d88ae7865ea8d755efdca76`. It is explicitly labeled historical, not current acceptance. Separately, `tests/v110-pokedex-batch5-successor-browser.cjs` runs the full current 450-row / 4,500 locale-state checks and 450 save/reload coverage. The three promotions are bound to exact canonical records, source IDs, evidence scopes and hashes. The other 222 metadata objects must remain exactly equal to the predecessor, including false Champions status.

No test was deleted, skipped, marked optional or removed from discovery. The new current test is explicitly required. No engine, roster, translation data or workflow quality threshold is altered in this correction. All mandatory CI must run on the corrected exact head, and the real independent Sol reviewer must check the correction and its new artifacts before issuing any eligible verdict. The earlier blocked report and old release receipts are not acceptance of this new candidate.
