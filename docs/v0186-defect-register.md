# v0.186 defect register

Status: development checkpoint, not a release approval. Public v0.185 and Cloudflare configuration are unchanged. Issue #61 / Draft PR #62.

## Reproducible evidence

The audit-only reference is `@smogon/calc` **0.12.0**, npm `gitHead` **d7a69cf40616057ef40faf7623df7a628e58b535**. Its lockfile pins the published integrity. Generation **0** is Champions; generation **9** is a separately identified legacy comparison for existing records absent from Champions. Neither means hardware verification.

- [Champions implementation](https://github.com/smogon/damage-calc/blob/d7a69cf40616057ef40faf7623df7a628e58b535/calc/src/mechanics/champions.ts)
- [Gen9 implementation](https://github.com/smogon/damage-calc/blob/d7a69cf40616057ef40faf7623df7a628e58b535/calc/src/mechanics/gen789.ts)
- [Shared rounding / category selection](https://github.com/smogon/damage-calc/blob/d7a69cf40616057ef40faf7623df7a628e58b535/calc/src/mechanics/util.ts)

`tests/fixtures/v0186-confirmed-regressions.json` records complete inputs, all 16 old/expected rolls and the source head before fixes. Its 17 witnesses failed before correction. They are witnesses, not 17 necessarily independent root causes. Runtime, registered-data and Shell Side Arm regressions separately reproduce their failures. No private feedback reports are used.

## Corrected defects

| ID | Priority | Existing defect | Correction / evidence |
|---|---|---|---|
| A186-01 | P0 | Advertised Grav Apple checkbox always reached a rejected core mechanic ID | Admit the already implemented `gravApple` ID; execute the existing 90→135 path. Runtime contract test. |
| A186-02 | P1 | Grass Pelt also increased Special Defense | Apply only when the move uses physical Defense. Independent `grassPeltSpecial` witness. |
| A186-03 | P1 | Marvel Scale also increased Special Defense | Apply only when the move uses physical Defense. `marvelScaleSpecial`. |
| A186-04 | P1 | Fur Coat did not affect Psyshock's Defense input | Select the defending stat independently of move category. `furCoatPsyshock`. |
| A186-05 | P1 | Sacred Sword retained negative Defense stages | Ignore all Defense stages. `sacredSwordNegative`. |
| A186-06 | P1 | A Plate could raise power above 60 before Technician's eligibility check | Determine eligibility from move power before other power modifiers. `technicianPlate`. |
| A186-07 | P1 | Sniper multiplied damage before the random factor | Move it to the final modifier chain. `sniper`, all 16 rolls. |
| A186-08 | P1 | Flash Fire multiplied final damage | Apply its one active multiplier to the attack stat. `flashFire`. There was one registration; an initial inspection showed an overlapping line twice, not a duplicate source registration. |
| A186-09 | P1 | Supreme Overlord, Analytic, ally Battery and Power Spot used final damage; other existing attack modifiers used power | Restore power/attack layers and exact factors to the pinned references. Dedicated active witnesses, ability matrix and seeded combinations. |
| A186-10 | P1 | Guts ignored the already available poison/paralysis conditions | Reuse existing status inputs. `gutsPoison` and ability regressions. |
| A186-11 | P1 | Multiple power/stat/final modifiers rounded each intermediate damage value | Compose fixed-point factors first, rounding composition ties up and application ties down. Full-chain / Life Orb+Filter witnesses and seeded comparisons. |
| A186-12 | P1 | Burn rounded half damage and could run after Friend Guard | Floor the burn reduction before the final chain. `burnFriendGuard`. |
| A186-13 | P1 | Heatproof, defensive Water Bubble and Purifying Salt used final damage | Apply attack-stat reduction, with the existing type conditions. `heatproof`, ability matrix. |
| A186-14 | P1 | Body Press/Foul Play incorrectly suppressed existing offensive ability/item modifiers | Change the stat source while retaining attack modifiers. Dedicated Huge Power witnesses. |
| A186-15 | P1 | Shell Side Arm chose the larger final damage after walls/abilities | Choose ranked Atk/Def versus SpA/SpD before damage modifiers. Independent wall/Fur Coat/critical witnesses. Preserve the existing special tie convention. |
| A186-16 | P1 | Physical Shell Side Arm never counted as contact | Derive contact from the selected category. Tough Claws/Fluffy witnesses. |
| A186-17 | P1 | Mega Staraptor was Normal/Flying | Existing record corrected to Fighting/Flying, confirmed by the [official Pokédex](https://zukan.pokemon.co.jp/detail/0398-1) and both pinned references. Ghost/Rock regression. No roster addition. |
| A186-18 | P2 | Returned effectiveness metadata differed from the move-specific calculation | Use the same Freeze-Dry/Flying Press/Scrappy chart for damage, effectiveness and conditional reductions. |
| A186-19 | P1 | Body Press/Foul Play stat-source ranks and Meteor Beam/Electro Shot's pre-hit boost overwrote Unaware's stage suppression | Resolve the attacking stat/rank first, then apply defender Unaware. Eight failed 16-roll witnesses are retained in `v0186-move-regressions.json`; all registered-move comparisons rerun. |
| A186-20 | P0 | Dual Wingbeat was processed twice when selected in the UI, producing a 256-roll vector where the outer layer expected 16 | Preserve the existing core's two-hit result without convolving it again. UI-path regression and complete distribution comparison. |
| A186-21 | P1 | A consumed resistance Berry reduced every hit of a multi-hit move | Apply the Berry to the first damaging hit only, including the existing standard, sequential, Beat Up and Dual Wingbeat paths. |
| A186-22 | P1 | Shadow Shield's full-HP reduction persisted on later hits | Remove the reduction on subsequent damaging hits. All 14 existing multi-hit moves × three hit-count modes × three defender conditions are compared, including full distributions and KO probabilities. |
| A186-23 | P1 | Imported move-tag sets missed contact, punching, biting, recoil/crash and Champions slicing memberships | Correct 32 memberships in existing registered moves and abilities. Compare all 2,680 memberships and 2,672 corresponding 16-roll effects against the pinned reference. No new move/ability IDs. |
| A186-24 | P3 | The historic move-flag snapshot's source commit returned GitHub 404 | Preserve the historical pin in audit metadata and revalidate base flags from resolvable PS commit `7e743761cd13cdb361fc0f58eb5a866284894f5b`; preserve power-history metadata separately. |

## Frozen baseline policy

The original 300-case `tests/fixtures/v0184-public-baseline.json`, sourced from `6fe0e8b0f85c30dde029c617254b75b86dd4636b`, is **not regenerated or edited**. Its original byte digest and per-corrected-output digests are asserted. The separate reviewed correction file checks complete outputs: **269 unchanged**, **26 numeric corrections independently rechecked against the pinned reference**, **5 trace/metadata corrections**. No case is skipped. Existing browser matrices retain their scenarios; formulas asserting the demonstrated old rounding errors are corrected rather than disabled.

## Open source conflict — do not guess

**Dudunsparce / `roster_v0107_033`: local Special Attack 58; Gen9 reference 85; no record in the pinned Champions generation.** The imported AppMedia source also reports 58, while other mechanics references report 85. This is **Unverified**, not a proven Champions-specific change or an automatically justified correction. On 2026-11-14 the owner confirmed Dudunsparce is absent from current Champions and the supplied stat screenshot is SV mode (Lv50, IV31, EV0, neutral nature, SpA105). This corroborates the SV value 85, not Champions hardware parity. Preserve the existing candidate value and its Unverified status without extending the roster/rules. H01 no longer blocks the current Champions release; reopen it before any future roster adoption. See the hardware test plan. Do not count this disposition as a verified stat correction.

Partially modeled effects (turn prerequisites, wall removal explicitly excluded by existing policy, multi-hit interactions that deliberately raise errors) are inventoried separately. They are not silently promoted to full support. In particular, Sheer Force's explicitly restricted five-move whitelist is not extended; the reference has more eligible moves, recorded as Partial. This differs from repairing false move-tag imports that claimed coverage of the existing catalog.

Current primary-source flag evidence: [base moves](https://github.com/smogon/pokemon-showdown/blob/7e743761cd13cdb361fc0f58eb5a866284894f5b/data/moves.ts), [Champions flag overrides](https://github.com/smogon/pokemon-showdown/blob/7e743761cd13cdb361fc0f58eb5a866284894f5b/data/mods/champions/moves.ts), [hit-count distributions](https://github.com/smogon/pokemon-showdown/blob/7e743761cd13cdb361fc0f58eb5a866284894f5b/sim/battle-actions.ts). The checked 35/35/15/15 hit counts and Loaded Dice behavior remain unchanged.
