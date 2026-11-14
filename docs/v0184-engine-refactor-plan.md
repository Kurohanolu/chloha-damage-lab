# v0.184 Engine Refactoring — Planning Memo (Draft)

Status: implementation in progress on Draft PR #56. Public UI remains **v0.183 Pre-Release 28**; the internal engine API is v0.184. Preserve calculator behavior throughout extraction.

## Current data boundaries

| File | Responsibility |
| --- | --- |
| `battle-data-v0184.js` | Type effectiveness, type plates, resist berries, and existing game-data references |
| `move-mechanics-data-v0184.js` | Stable move ID sets, core mechanic validation IDs, and skin ability type mappings |
| `ability-data-v0184.js` | Existing ability catalog, Japanese ID lookup, attacker/defender validation IDs, Mold Breaker family/bypass sets, and weather/terrain mappings |
| `damage-engine-v0184.js` | Validation, calculation functions, modifier registration, and the public engine API |

Data files keep their declarations in isolated scopes and expose explicit `window` namespaces. They load synchronously before the engine; existing inline UI consumers retain their catalog bindings.

Validation preserves the original 71 attacker IDs and 40 defender IDs, including `none`, in separate frozen arrays. These lists are not generated from the 70-entry display catalog: catalog presence alone does not imply that an ID is accepted for either role. Rejection messages and validation order remain unchanged.

Core move validation keeps its original 45 mechanic IDs, including `none`, in a frozen array. This list is independent of catalog/policy classifications; existing falsy inputs still fall back to `none` through `a.moveMechanic || 'none'`. Special calculation branches and their input requirements are unchanged.

The weather/terrain maps preserve explicit field choices and the existing attacker-first lookup order. Current validation permits the eight field-setting abilities only on the attacking side: the defender fallback lookup exists, but those IDs are rejected as defender inputs. Expanding defender support is a separate behavior change, outside this extraction.

`tests/v0184-engine-initialization.cjs` checks script presence/order, isolated data bindings, UI metadata access, and fixed sixteen-roll vectors before browser dependency installation. Its ability-bypass probes preserve Levitate bypass, Shadow Shield protection, and Flying-type immunity for the three Mold Breaker family abilities. The browser baseline and all five required CI workflows remain mandatory. Engine/data file changes must trigger the Showdown comparison and UI regression workflows even when `index.html` is unchanged.

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
