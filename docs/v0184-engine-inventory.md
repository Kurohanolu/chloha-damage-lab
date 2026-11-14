# v0.184 engine boundary and preservation inventory

Reference release: v0.183 Pre-Release 28, commit `6fe0e8b0f85c30dde029c617254b75b86dd4636b`.

## Calculation entry points

| Entry | Input | Output / responsibility |
| --- | --- | --- |
| `window.ChlohaDamageEngine.calculate(a)` | Existing level, stats, canonical database types, move mechanic, item, ability, field, and activation inputs | Existing rolls, per-hit rolls, KO probability, trace, effective power, stats, base damage, STAB, and effectiveness |
| `window.ChlohaDamageCalculator.calculate(a, options)` | Core input plus Shell Side Arm stat alternatives, Beat Up base-stat text, canonical multi-hit move name, and Dragon Darts hit selection | Core result with existing category selection and multi-hit distributions applied |
| `damage-ui-adapter-v0184.js` | Exported engine and reference-data namespaces | Explicit legacy UI bindings for `DamageEngine`, types, plates, ability labels, rounding audit, and grounding |

`index.html` reads controls, synchronizes the Expanding Force spread control, calls the move calculator, and renders the result. It no longer calls the core calculator directly. The move calculator reads no DOM and does not mutate caller inputs/options. Existing errors and trace text are preserved verbatim so current localization adapters keep working.

## State, ordering, and rounding

- Reference data lives in scoped battle/move/ability modules. Existing `GameData` maps and the public modifier-registration API remain available for compatibility; ordinary calculation does not write them.
- The modifier pipeline is private to the engine. `registerModifier` retains its existing priority ordering and remains exposed through the engine API. Internal `calculate`, `validate`, `pipeline`, and layer helpers do not become globals.
- Calculation applies attack/defense stat layers, effective move power, base damage, pre-random effects, the sixteen 85–100 random values, post-random effects, and final modifiers in the original order.
- `pokeRound` retains `floor((value * modifier + 2047) / 4096)`. Existing floor sites, modifier constants, priority values, and repeated trace probes are unchanged.
- Existing `multi-hit.js` and `variable-power.js` remain authoritative specialized helpers. Probability distributions preserve their original insertion order, floating-point values, hit accuracy, and KO thresholds.

## Frozen evidence

`tests/fixtures/v0184-public-baseline.json` contains 300 results/errors generated from the immutable reference commit, not from the new implementation. Coverage includes core mechanics, abilities, items, fields, Champions power overrides, Shell Side Arm category selection/ties, Beat Up validation, standard/special multi-hit distributions, Loaded Dice, Skill Link, zero target HP, and existing Multiscale rejection paths.

`tests/v0184-public-baseline.cjs` checks complete outputs, traces, distributions, KO probabilities, errors, and input immutability without a browser. The generator is `scripts/generate-v0184-engine-baseline.cjs`; regeneration requires explicit access to the reference Git commit and verifies the current implementation against it before writing fixtures.

## Preserved limits

This iteration does not expand accepted IDs, add mechanics, change translations, or claim new hardware validation. Defender weather/terrain setters remain rejected by the existing validator. Existing unsupported multi-hit/Multiscale combinations still stop with the same errors. Migration of database type IDs and legacy trace localization can proceed separately without coupling it to this release.
