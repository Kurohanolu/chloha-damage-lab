# Singularity v0.188 — final calculation gate evidence

Recorded 2026-11-15 (UTC), as the calculation workstream of the final release-gate audit. This is an executed local numerical check, not the independent Sol verdict and not permission to publish.

## Fixed inspected candidate

- Candidate: `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095`.
- Git tree: `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b`.
- Released baseline: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`.
- Locked independent reference: `@smogon/calc@0.12.0`, using Champions and Gen9 separately where specified by each suite.
- Engine SHA-256: `9b774ac4d55f0c7c82bdd2ce9089fda6b431d29c9c7d482017e9f9b61ac491c9`.
- Immutable 300-fixture SHA-256: `ffc88f9684ef16f2d67b319ab427ae1f8fa89e54ebb30b5075de3fe1f8165ebd`.

All 16 captured test commands were freshly re-executed on candidate `c9c52e1f` after the final English caveat wording adjustment, and exited zero. HEAD and source-worktree cleanliness were checked before and after execution; the recorded source hashes remained stable during the run and match the earlier `1df8157b` calculation sources. Evidence was written only to the separate final-report worktree. The additional direct policy/runtime witness and the coverage-inventory check also passed. No source, test, expected vector or fixed fixture was changed by this workstream. Complete command output, durations, reference version, source hashes and known limits are in [v0188-final-calculation-local.json](evidence/v0188-final-calculation-local.json).

## Executed coverage

| Suite | Observed result |
|---|---|
| Fixed public baseline | 300 contracts PASS: 269 unchanged; existing v0.186 corrections comprise 26 numerical and 5 trace/metadata cases; original fixture unchanged |
| Independent baseline correction reference | All 26 changed numerical vectors revalidated |
| Registered data, stats, types, rounding, items | 335 move-data checks; 221,562 stat cases; 324 type pairs with 16 rolls; 15,360 rounding cases; 82 item cases; one preserved known data conflict described below |
| Confirmed historical defects | 17 independent 16-roll witnesses PASS |
| Registered-form regressions | Mega Staraptor type, Ghost and Rock damage PASS |
| Runtime policy contract | Existing policies and Grav Apple execution PASS |
| Shell Side Arm | Eight independent category/contact witnesses PASS |
| C-E01 screen-breaking regression | 216 independent BigInt vectors; 456 locked Champions/Gen9 comparisons; 20 unaffected-move/ID witnesses; six immunity witnesses; both old defects reproduced from immutable old source |
| C-S02/state bridge regression | 52 source-handler/schema cases PASS, including both manual Speed destinations, canonical HP/Speed display and Foul Play automatic/manual state applicability |
| Earlier independent engine audit | 539 neutral, 1,014 rank, 48 immunity, 26 threshold witnesses; 3,600 complete historical-output comparisons PASS |
| Attack/defense abilities | 321 witnesses; zero mismatches |
| Registered move differential | 256 registered moves, 657 comparisons; zero mismatches |
| Move-flag membership/effects | 2,680 membership checks, zero differences; 2,672 independent 16-roll effect comparisons PASS; restricted Sheer Force coverage remains Partial |
| Multi-hit distributions | 126 distributions; zero mismatches, including probability/consumable/KO cases in the existing suite |
| Weight-dependent moves | 2,068 Champions reference comparisons; every registered form represented |
| Fixed-seed combinations | Seed100012, 4,000 cases (494 Champions / 3,506 Gen9), zero mismatches |

These suites collectively exercise base formula, 16 rolls, rounding, modifier order, type/STAB, criticals/ranks, abilities/items, weather/terrain, screens/reductions, immunities, multi-hit and variable power. They are finite, explicitly scoped witnesses and do not establish every combination or physical-game agreement. The manual Speed real-browser path, all-nine-language numeric transitions and final exact-candidate CI must be evaluated in the parent release-gate run; successful local source-handler checks do not substitute for them.

## C-E01 and C-S02 assessment

The two screen-breaking IDs remain the only new screen bypass: Brick Break `gw0169_p022` and Psychic Fangs `v096_085`. The numeric witnesses use Lv50, Attack153, Defense117, no STAB/other modifiers, Normal defender and doubles Reflect. Brick Break's old51–60 becomes76–90; Psychic Fangs' old28–33 becomes42–50. All16 rolls match the independent witnesses and external references. The test also proves that existing caller screen state, unrelated moves, Friend Guard and other modifiers are not erased by the correction. Physical Light Screen has no applicable reduction; critical and immunity interactions retain their own expected behavior.

The actual stat-table handler sends manual Speed edits to `attSpeed` or `defSpeed`, while HP/Speed displays read the same canonical per-side controls. The numerical move suite covers Electro Ball and Gyro Ball across asymmetric Speed values. Local state tests verify the real event-handler path, but actual editing/reload interactions remain a browser-CI obligation for the final candidate.

## Raging Bull is intentionally not promoted to screen-breaking support

Registered ID `gw0170_u056`, power90, policy:

> パルデアケンタロスのフォルムに応じて技タイプを変更。壁破壊効果は計算対象外

A direct runtime witness uses the same Lv50/Attack153/Defense117 baseline, Combat form, physical damage, Normal attacker/defender and doubles. Without a screen it produces90–106. With Reflect it produces60–71; every roll equals independent integer rounding `(damage ×2732 +2047) /4096`. Physical Light Screen equals the no-screen vector. Thus the runtime preserves the **documented unsupported screen-removal behavior** and does not falsely apply the new Brick Break/Psychic Fangs bypass to Raging Bull. This is policy/runtime consistency, not a claim of complete Raging Bull game parity. No feature extension was made.

## Preserved known data conflict and support boundaries

The data suite deliberately reports one source conflict: Dudunsparce / ノココッチ `roster_v0107_033`, local Special Attack58 versus locked Gen9 reference85; no record exists in the locked Champions generation. Existing [v0.186 release disposition](v0186-release-readiness.md) records the owner's prior confirmation that it was absent from the modeled current Champions rule and that supplied third-party stat evidence was SV mode. That historical disposition excludes it from the current modeled-rule release hold; it does **not** verify58 as a Champions-specific stat. The record remains **Unverified** and must be reopened before future roster adoption. This final workstream did not obtain new physical-game or current-availability evidence.

The existing coverage inventory check passes without changing its counts: 1,184 entries =870Verified,2Unverified,153Partial,143Unsupported,16Not Applicable;0Incorrect within that inventory. These inventory labels are not an exhaustive support guarantee. Sheer Force intentionally retains its five-move whitelist despite124 eligible reference candidates; multi-hit/Multiscale unsupported combinations remain explicitly rejected. None of these existing boundaries was silently promoted to full support or hidden by updating expectations.

## Gate recommendation

**PASS for the executed calculation witnesses and supported paths at exact `c9c52e1f`, with zero newly unexplained numerical differences.** No new calculation defect was found and no correction was required by this workstream.

The known Unverified record and documented partial/unsupported mechanics remain explicit limitations. Overall release classification belongs to the parent audit and independent Sol review. Any later product change requires a new fixed candidate and execution of the mandatory checks at that candidate; this local PASS must not be relabelled as an execution against a later SHA.
