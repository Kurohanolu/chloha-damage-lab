# Astra calculation audit — v0.188

## Frozen starting state

Recorded before any engine or test modification. Published source: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`. Audit working branch: `audit/v0188-astra-quality`. The engine/calculator/multi-hit/variable-power files have no diff against the v0.186 release `4b2cde61f92610c5bb970618d34147a2c16a8d7b`.

The original 300-case fixture and v0.186 explicit errata remain immutable. Existing tests cover a pinned `@smogon/calc@0.12.0` reference, including Champions generation 0 and generation 9; a matching reference result does not prove physical-game agreement. Known partial support (including multi-hit plus Multiscale, restricted Sheer Force membership and Shell Side Arm ties) must not silently become verified.

## Investigation record

Initial read-only inspection covered the fixed-point modifier pipeline, stat stages, critical and screen conditions, terrain and weather, stat-source moves, type/immunity selection, single-hit 16-roll generation and multi-hit orchestration. No confirmed new defect at this initial checkpoint. Independent boundary checks and exact historical comparisons will be recorded below after execution.

## Executed results

All commands below were executed locally against this audit worktree, using the existing pinned audit-only reference dependency. No engine source, original fixture, erratum or production resource was edited. Every listed command exited successfully.

| Command / scope | Observed result |
|---|---|
| `node tests/v0184-public-baseline.cjs` | 300 contracts: 269 unchanged, 26 documented numeric corrections and 5 trace/metadata corrections retained |
| `node tests/v0186-data-and-arithmetic.cjs` | 335 move records; 221,562 stat cases; 324 type pairs; 15,360 rounding cases; 82 item witnesses PASS |
| `node tests/v0186-confirmed-regressions.cjs` | 17 independent 16-roll witnesses PASS |
| `node tests/v0186-runtime-contract.cjs` | Registered policy/engine contract and conditional Grav Apple PASS |
| `node tests/v0186-baseline-reference.cjs` | All 26 changed numeric vectors match the independent reference |
| `node tests/v0186-shell-side-arm.cjs` | Eight category/contact witnesses PASS |
| `node tests/v0186-ability-differential.cjs` | 321 attack/defense ability witnesses, zero mismatches |
| `node tests/v0186-move-differential.cjs` | 256 registered moves / 657 comparisons, zero mismatches |
| `node tests/v0186-multihit-differential.cjs` | 126 probability distributions, zero mismatches |
| `node tests/v0186-weight-differential.cjs` | 2,068 comparisons covering every registered form PASS |
| `node tests/v0186-seeded-differential.cjs` | 4,000 cases: Champions 494 / Gen9 3,506, zero mismatches |
| `node tests/v0186-move-flag-audit.cjs` | 2,680 memberships and 2,672 independent 16-roll effect comparisons PASS; Sheer Force remains Partial |
| `node tests/v0188-astra-engine.cjs` | New audit checks listed below PASS |

The new independent test uses BigInt rational arithmetic for 539 neutral formula cases and 1,014 combinations covering all attack/defense ranks from -6 to +6, critical behavior and three STAB modes. It does not consult the engine's rounding helper, trace or type chart to construct those expected numbers. It adds 48 immunity checks under extreme supported damage multipliers, 18 one-third-HP boundary checks and eight Electro Ball speed thresholds. These 1,627 witnesses check current behavior separately from historical equality.

An independent seed `0x188a57` generates 1,800 valid inputs with varied types, ranks, weather, terrain, screens, physical/special categories, abilities, items and critical status. Every full current output (including all 16 rolls and metadata) is compared against both the exact v0.186 release and exact v0.187 release: **3,600 historical comparisons passed**. Input non-mutation is checked by the harness. This extends the previously reported Terra comparison; it does not replace or relabel that earlier evidence. The seven loaded runtime files are also observed byte-identical to v0.186.

Machine-readable new-test output is generated at `reports/v0188-astra/engine-independent.json`; the existing commands generate their usual `reports/v0186/` evidence. Reproduction requires complete Git history (`actions/checkout` with `fetch-depth: 0`) and `npm ci --prefix tests/reference --ignore-scripts --no-audit --no-fund` before executing the commands.

## Findings and boundaries

No new confirmed calculation defect or v0.188 numerical regression was found in the inspected and executed scope; no calculation-engine change is proposed. A historical comparison alone cannot establish game correctness, so the independent arithmetic witnesses and pinned reference comparisons are kept distinct.

Existing source conflicts and partial support remain explicit: Dudunsparce SpA58 versus Gen9 SpA85 is outside the currently adopted Champions roster scope; Sheer Force remains a restricted supported subset; multi-hit plus Multiscale rejects unsupported input; Shell Side Arm equal-ratio selection retains the existing special-category convention; arbitrary extreme integer-overflow combinations are not certified. The registered catalog and test counts are not proof that every possible interaction or all of Pokémon Champions is supported.

Reference implementation reviewed locally: audit-only `@smogon/calc@0.12.0`, pinned by `tests/reference/package-lock.json`, including `src/mechanics/gen789.ts`, `champions.ts` and `util.ts`. Public upstream source links remain recorded in `docs/v0186-champions-parity.md`. Attempts to retrieve the exact upstream GitHub pages through web search returned `DisabledError` in this environment; no claim of fresh upstream-page validation is made. No reference version was updated. **No new physical-game measurements were performed.**
