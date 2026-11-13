# v0.184 Engine Refactoring — Planning Memo (Draft)

Status: proposal only; **do not change version numbers or calculator behavior in v0.183**.

## Objective
Separate the damage calculation core, move-specific rules, ability modifiers, item/field modifiers, data access, and presentation/localization without changing validated results. A historical `v0.162` core label is not proof that calculation logic is frozen at v0.162. Audit version provenance before renaming anything.

## Non-goals
- No blanket engine rewrite.
- No automatic claims of Pokémon Champions hardware parity.
- No new move/ability behavior mixed into mechanical refactoring.
- No change to the public release version until release gates pass.

## Proposed migration sequence
1. **Inventory & baseline:** enumerate current entry points, global state, modifier ordering, rounding sites, and UI-to-engine dependencies. Capture representative deterministic vectors, including immunities, critical hits, doubles, multi-hit, variable-power moves, weather, terrain, and defensive abilities.
2. **Characterization tests:** lock down v0.183 outputs (including damage roll distributions and error/warning states). Compare against Showdown where rules agree; separately mark Champions-specific exceptions and hardware-unverified cases.
3. **Pure core boundary:** introduce an explicit input/output contract; keep the legacy entry point as an adapter. Ensure no localization strings enter calculations.
4. **Extract one subsystem at a time:** move power and multi-hit rules, ability effects, item and field effects, then rounding. After each extraction, compare old and new paths over the same vectors.
5. **UI and data separation:** move localized labels outside calculation logic; keep canonical IDs for Pokémon, moves, types and abilities. Verify nine-language search, switching and reload persistence.
6. **Cleanup:** remove obsolete code only after all callers have migrated and parity tests pass. Record internal core version separately from public UI version.

## Mandatory gates
- No new page errors or blank screen; all existing CI suites green.
- Byte-for-byte or numerically identical outputs for existing verified vectors; any intentional bug fix gets a separate change and test.
- Showdown differential audit stable, with documented known differences.
- Nine-language browser roundtrip and persistence stable; native select labels and dynamic warnings tested.
- Rollback possible at each extraction step.

## Open design questions
- Which functions are the authoritative damage entry point today?
- Which effects are currently applied in multiple places?
- Which rounding rules are backed by hardware evidence versus Showdown only?
- Should the core expose detailed modifier traces for future debugging?

**Decision rule:** first deliver an inventory and baseline test report; do not begin large-scale extraction based only on this memo.
