# Continued engine audit: screen-breaking moves

## State recorded before the correction

Audited PR #67 input head: `8b37bddbb236fa1b7fbd13a7b2cebd1518995437`.
Published baseline: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`.
The calculation engine is still byte-identical between these revisions.

### C-E01 — screen reduction incorrectly applied to Brick Break and Psychic Fangs (High)

The existing move differential checks both registered moves with no active
screen. The seeded suite varies screens but uses a generic move, so neither
suite checks this intersection. Reading `hasActiveScreen` confirms that it
only excludes Infiltrator and critical hits, with no move-ID exclusion.

Read-only reproduction before editing the engine, with Lv50, Attack153,
Defense117, no ranks/STAB/abilities/items/weather/terrain, a Normal defender,
physical damage and a doubles battle:

| Registered move | Reflect on: incorrect current range | Expected range after breaking Reflect |
|---|---:|---:|
| Brick Break (`gw0169_p022`, Fighting75) | 51–60 | 76–90 |
| Psychic Fangs (`v096_085`, Psychic85) | 28–33 | 42–50 |

Expected mechanics are independently supported by both upstream calculator
implementations, which remove Reflect and Light Screen before these moves'
damage, and the simulator's `onTryHit` handlers:

- https://github.com/smogon/damage-calc/blob/master/calc/src/mechanics/champions.ts
- https://github.com/smogon/damage-calc/blob/master/calc/src/mechanics/gen789.ts
- https://github.com/smogon/pokemon-showdown/blob/master/data/moves.ts

These primary sources were freshly read on 2026-11-15 (JST). The executable
reference will remain the repository's locked `@smogon/calc@0.12.0`, separately
from the mutable upstream pages. No physical-game agreement is claimed.

The same numeric omission exists for Raging Bull, but its policy explicitly
states that screen breaking is outside supported calculation. That is a
documented remaining limitation, not a newly undisclosed regression; this
focused correction does not change its policy or behavior.

## Planned bounded correction

Exclude the two stable move IDs from the screen modifier. Do not edit the
selected screen control, mutate the caller's input, remove Friend Guard or
other final modifiers, or change any other move. This is a one-attack damage
calculator, not a stateful battle simulator: subsequent-turn field changes
remain outside this correction. The original 300-case baseline is immutable;
neither affected ID appears in it.

New regression coverage must fail against the unmodified engine, compare all
16 rolls with independent integer arithmetic and the pinned reference,
exercise both battle formats and screen choices, preserve other reductions,
and prove unrelated physical/special moves still receive their screens.

## Correction and execution evidence

`damage-engine-v0184.js` now excludes exactly `gw0169_p022` and `v096_085`
from `hasActiveScreen`. No caller state is mutated. The complete before/after
delta is in `tests/fixtures/v0188-continued-engine-patches.json`; reversing
that exact delta restores the published engine byte for byte. Raging Bull,
the selected UI screen and all other engine bytes remain unchanged.

The new test first failed against the unmodified engine at the fixed Brick
Break witness above. After the correction, the following passed locally:

| Command | Executed evidence |
|---|---|
| `node tests/v0188-continued-engine.cjs` | 216 independent BigInt arithmetic vectors; 456 comparisons with locked Champions/Gen9 reference; 20 unaffected-move/ID witnesses; 6 type-immunity witnesses; both old numeric defects reproduced from immutable prior source |
| `node tests/v0184-public-baseline.cjs` | All 300 unchanged baseline contracts retained with the original documented v0.186 errata |
| `node tests/v0186-move-differential.cjs` | 256 moves / 657 comparisons, zero mismatches |
| `node tests/v0186-seeded-differential.cjs` | 4,000 cases, zero mismatches |
| `node tests/v0188-astra-engine.cjs` | Original independent arithmetic witnesses and 3,600 historical-output comparisons retained; `engineSourceChanged: true` correctly records this new bounded correction |

The 216 arithmetic vectors vary both moves, both battle formats, all three
screen selections, critical hits, ranks, three asymmetric attack/defense pairs,
burn, STAB, Life Orb, Friend Guard and resistance berries. Their expected
vectors use standalone rational/integer arithmetic and do not call the
production engine to obtain a screen-free expected result. The external
comparisons add Strong Jaw, Tough Claws/Fluffy, Mold Breaker/Fur Coat, Filter,
Multiscale/Friend Guard and Infiltrator. All 16 rolls are compared. Exact input
serialization before/after confirms that this calculation does not clear a
screen selected for another attack. Bogus IDs and display names cannot gain
the screen bypass; unrelated physical and special moves retain reduction.

The new test is discovered automatically by the existing mandatory v0.188
test runner. Machine-readable output is
`reports/v0188-continued/engine.json`. Final exact-head CI and independent
Sol review remain the parent's release-evidence responsibility.

## Boundaries

This correction computes the damage of a successful hit. It does not implement
accuracy/protection simulation, a battle turn sequence, Aurora Veil (not an
available screen input), or persistent removal of screens from subsequent
attacks. Immunities remain zero damage. Raging Bull's documented screen-break
limitation remains visible in its policy and is recommended for a separately
scoped support extension. These executable results are not new physical-game
measurements and do not certify every combination in Champions.
