# Astra state and portrait audit

## Frozen source and observations before changes

- Source: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7` (published v0.188-pre.1), tree `cf7af9334261b0cfbbde45929da9d217445fe526`.
- Audit date: 2026-11-15 JST. This file records findings before changing implementation code.
- The existing storage implementation uses an explicit calculator-control allowlist, schema 1, 30-day expiry, full-object shape validation, bounded numeric/select values, per-side model budgets, and a separate key from locale storage. Feedback content, contact information, snapshots and credentials are excluded.
- Existing portrait code resolves the selected locale from the canonical name resolver, updates on locale/species changes, and explicitly describes missing translations instead of silently using another language.
- Local Chromium execution is blocked by the environment (`process_singleton_posix.cc: socket() failed: Operation not permitted`). The browser regression was attempted with the installed `/usr/bin/chromium`; no browser PASS is claimed from that attempt.

## A-S01: manual attacker HP writes defender HP (Medium)

Found by reading the actual-stat input handler in `index.html` before modification. With automatic stat calculation disabled, editing the attacker's HP actual-stat field executes `k === 'hp' ? 'hp' : ...`, the same destination as the defender's HP field. Thus attacker HP 183 → 200 changes defender maximum HP 175 → 200 while attacker maximum HP remains 183. This changes percentage/KO context for the wrong Pokémon and does not update the attacker's HP-dependent calculation conditions.

Reproduction: turn off automatic stat calculation, edit the attacker's HP actual-stat input, inspect both maximum HP controls, then reload. The incorrect control values are otherwise valid and are eligible for persistence. This is an existing UI binding defect, not a damage-formula change.

Recommended correction: select `attMaxHp` for attacker HP and `hp` for defender HP. Preserve separate values on save/reload; add a regression that executes the real input-handler body with asymmetric sides. Original engine and baseline fixtures must remain unchanged.

## Correction and executed evidence

The one-line UI destination binding now selects `attMaxHp` for attacker HP and `hp` for defender HP. The engine, persistence module, portrait module and fixed baseline fixtures are unchanged. The existing exact-inline-change fixture includes the complete before/after line, so unrelated inline changes still fail its contract.

`tests/v0188-astra-state.cjs` extracts and executes the real input-handler body. Before the correction it failed with attacker HP actual `183` instead of expected `200`; after correction it passes both attacker and defender cases. With initial maxima attacker183/defender175, the old attacker edit produces attacker183/defender200; the corrected edit produces attacker200/defender175. For an unchanged damage roll, the incorrect denominator would display only 175/200 = 87.5% of the intended percentage. HP-dependent moves also read the wrong attacker's maximum before correction; the calculation formula itself is unchanged.

The same new test passes direct damage-input coverage against the persistence allowlist, exclusion of feedback/contact/history/uncommitted damage data, and the actual persistence module's event lifecycle: debounce, pagehide flush, no write from an untouched stale tab, ignored feedback edits, preserving a valid snapshot during incomplete input, reset cancelling pending writes, quota failure retaining current controls, later storage recovery and locale switching without state alteration. This fixture exercises real handlers and storage code; it is not represented as a rendered-browser test.

Additional local executions passed:

- `node tests/v0188-persistence-schema.cjs`: 35 schema/corruption/expiry/privacy/invalid-state assertions.
- `node tests/v0188-portrait-alt.cjs`: nine canonical locale names, locale event, species change, restored locale, explicit missing-name text and unchanged-attribute stability.
- `node tests/v0188-contract-and-approval.cjs`: exact inline UI-change contract and separate publication approval gate.

`tests/v0188-astra-state-browser.cjs` adds a real-browser regression at 390px for all nine languages. It edits asymmetric attacker/defender HP, waits for the normal event-driven save rather than invoking the save API, and compares complete control/model/input state plus 16 rolls after reload. CI execution is required because local Chromium is blocked as recorded above. The existing broader persistence browser suite continues to cover conditional moves, manual inputs, storage denial/corruption, immediate reload, multi-tab handling and privacy.

## Limitations

No further reproducible defect was found in the inspected M-01 or L-01 module. That statement is bounded by the reviewed control/model mappings and tests, not a proof of absence of all defects. CI browser outcomes must be attached to the final candidate SHA. Physical-device and screen-reader usage remain unverified.
