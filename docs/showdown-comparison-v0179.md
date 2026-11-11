# Showdown comparison protocol (v0.179)

This document defines the baseline for future automated differential tests. It does **not** claim Showdown parity.

## Case data
For every case record: generation/ruleset, attacker and defender species/forms, level, raw stats, stat stages, ability, item, move, move category, base power, weather, terrain, screens, side conditions, spread-target count, critical hit, status, and expected sixteen damage rolls. Capture the reference calculator version/commit and the game-hardware observation separately.

## Comparison rules
1. Compare all sixteen damage rolls (including duplicates) before min/max, percentages or KO probabilities.
2. Distinguish rounding/order-of-operations defects from incorrect conditions or incorrect stat derivation.
3. Do not treat a Showdown difference as a Champions bug without confirming that the mechanics are the same.
4. Mark unverified learnsets and game-specific mechanics as *unverified*; do not silently substitute reference values.
5. Fail CI only for previously confirmed and supported mechanics; report unresolved comparisons separately.

## Initial regression matrix
- Neutral single-target physical and special attacks
- Rain: Water and Fire damage changes
- Friend Guard on defending side
- Expanding Force with terrain and spread targeting
- Mega Delphox form and Special Attack values
- Levitate and Ground-type immunity
- Combined weather + Friend Guard and spread modifiers
- Facade with burn, paralysis and poison

## Release gate
Japanese/English locale switching must not change the calculation input state, result or the sixteen rolls. English coverage is incremental; unsupported labels remain in Japanese until translated and validated.
