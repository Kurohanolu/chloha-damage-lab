# Singularity v0.188 Final Release Gate Report

Prepared 2026-11-15 JST. Development lead: Astra. Independent final reviewer: **6.1 Sol**. Publication authority: the project owner.

**Working report — final candidate execution and independent verdict pending.** This document is not an approval receipt. The tested source, CI results and final decision will be fixed below before this report is submitted.

## 1. Source identity and PR state

| Object | Fixed identity |
|---|---|
| Published source/main and immutable tag `v0.188-pre.1` | `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7` |
| Published Git tree | `cf7af9334261b0cfbbde45929da9d217445fe526` |
| Previous continued-audit candidate | `5f88e471d5a8a3374181ce0d37deb211c1dd9f26` / `695db47cc2fe7d727de246702cdafc16cff40893` |
| Immutable final-gate baseline checkpoint | `3b06f82db5db595e8bce2ae39ad3bbc6dab29c4c` |
| Final candidate / tree | `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095` / `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b` |
| CI merge object / tree | `3bb9c9a300fe20b98338bfb6d58ae2409062617f` / `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b` (identical tree) |
| Public repository | `Kurohanolu/singularity` at `b30c0f1863f3262574cf5365721be87c42ffa3e9` |

[PR #67](https://github.com/Kurohanolu/chloha-damage-lab/pull/67) is reused; no duplicate PR was created. It remains open, draft and unmerged. The candidate identifies itself as **v0.188 Pre-Release 2**, with a fresh pending Sol/owner decision and no inherited pre.1 live acceptance. No new tag or Release exists as a result of this audit. The final documentation is saved separately from the tested source so writing the results does not silently move its CI target.

## 2. Findings, corrections and scope

The eight continued-audit correction groups remain in scope. Their full reproducers and earlier independent review are recorded in the [continued audit](https://github.com/Kurohanolu/chloha-damage-lab/blob/27f59a345d7bf7985aa239af96dffafeec7b1b91/docs/v0188-continued-quality-audit-report.md). They were not reimplemented.

| Finding | Priority | Reproducer / corrected behavior |
|---|---|---|
| C-E01 | High | Brick Break/Psychic Fangs under Reflect previously received screen reduction; the current hit now bypasses screens while other modifiers and selected field state remain. |
| C-S02 | High | Edit either manual Speed value, use a Speed-dependent move and reload; the actual engine input, display and saved value now agree. |
| C-S01 / SOL-02 | Medium | Foul Play and automatic-to-manual allocation changes now restore valid effective state without relaxing individual bounds. |
| SOL-01 | Medium | Change or invalidate a calculated result after attachment consent; consent is revoked and submission requires fresh confirmation. |
| C-U01 | Medium | Initial ArrowUp selects the last search result; stale active-descendant references are cleared. |
| C-L01 / C-L02 | Low | Variable power and unsupported/unverified warnings use canonical localized wording. These are two correction groups. |
| C-P01 | Low | Feedback typing no longer rebuilds calculator panels; calculator inputs still update calculations. |
| SOL-GATE-01 | Medium, release preparation | A successor approval needed actual commit/tree/report/owner/bytes binding and a distinct Sol-reviewed pre.2 path. The new helper verifies real evidence, preserves pre.1 checks and rejects changed protected files or release identity. |
| SOL-GATE-02 | Medium, test infrastructure | The new positive approval fixture failed in a clean checkout because its disposable commit had no changed files. An explicit empty fixture commit preserves the real Git-object test without depending on development edits. Final clean execution must pass. |
| SOL-GATE-03 | Medium, promotion lifecycle | Removing the draft marker after real owner approval would reject the still-live pre.1, leave draft-only fixture assumptions, stop requiring content cache hashes and select the wrong performance baseline. Pre.2 now has a narrow approved-before-live transition with exact prior-manifest checks; synthetic draft fixtures are separated from actual-current approval checks, and pre.2 hash/baseline requirements remain stable. Older or mutated public releases remain rejected. |
| FINAL-L01 | Low, localization | Korean screenshot retained the English `The on-screen` prefix in the version notice. The corrected localized notice is checked after locale restoration and switching. |
| FINAL-L02 | Medium, verification wording | Eight translated version notices used a positive hardware-comparison statement and a default54-case count absent from current Japanese copy, while omitting current support limits. The notices are aligned to the canonical current explanation, retaining software/game distinctions and partial support without asserting new hardware validation. Historical owner observations are not denied or promoted into current-candidate certification. |

Sol also identified that cumulative WeakRef audit metadata could distort the proposed memory trend. Collected probes are now pruned, history is kept outside the renderer, and a cleanup GC precedes measurement. This was corrected in the instrumentation before its first CI execution; it is not a product-memory defect.

No new feature or backend/configuration change is included. Main, existing tags, Releases, Cloudflare resources and public sites were not mutated.

## 3. Calculation precision

**PASS for the executed supported numerical paths at exact final `c9c52e1f`.** All16 local numerical/state commands, the direct Raging Bull16-roll witness and coverage inventory passed. Source worktree was clean before/after; HEAD/tree and ten captured source/reference/fixture hashes remained stable. Newly unexplained numerical differences: **0**.

| Independent/reference coverage | Result |
|---|---|
| Fixed baseline and prior numeric corrections | 300 contracts;26 independently revalidated corrections |
| C-E01 and C-S02 | 216 BigInt vectors;456 locked screen comparisons;52 state/handler cases |
| Stats/types/rounding/items | 221,562 /324 type pairs with16rolls /15,360 /82 cases |
| Moves/abilities/seeded combinations | 657 /321 /4,000; zero mismatches |
| Move flags/weight/multi-hit | 2,672 effect comparisons /2,068 /126 distributions |
| Historical engine comparison | 3,600 complete-output comparisons plus independent rank/immunity/threshold witnesses |

The original 300 fixtures remain unchanged. Their 269 unchanged expectations, 26 previously established numeric corrections and five trace/metadata corrections are checked separately; the original expected file is not silently replaced. Independent BigInt witnesses and locked `@smogon/calc` Champions/Gen9 references are used in addition to existing expectations.

The representative screen-breaking conditions are Lv50, Attack153, Defense117, no STAB/other modifiers, Normal defender and doubles Reflect. Brick Break changes 51–60 to 76–90; Psychic Fangs changes 28–33 to 42–50. These are examples for these exact conditions, not universal damage ranges. All 16 rolls are checked. Manual Speed coverage includes both sides, Electro Ball/Gyro Ball, HP/Speed display and save/reload.

Raging Bull remains explicitly outside screen-removal support. The policy and runtime agree: in its recorded witness it produces 90–106 without a screen and 60–71 under doubles Reflect. This is consistency with the declared limitation, not complete game parity.

The preserved Dudunsparce Special Attack conflict (local58 / locked Gen9 reference85; no locked Champions record) remains **Unverified** under the historical modeled-roster disposition. It is not a confirmed Champions stat change and must be reopened before adoption into a supported roster. Partial/unsupported mechanics, including restricted Sheer Force and certain multi-hit/Multiscale cases, remain explicit. No physical-game equivalence or exhaustive combinatorial proof is claimed.

See [calculation evidence](v0188-final-calculation.md) and [raw executed commands](evidence/v0188-final-calculation-local.json).

## 4. Nine languages, state and feedback

PENDING_FINAL_LOCALE_STATE_RESULT

The suite covers Japanese, English, French, German, Spanish, Italian, Korean, Simplified Chinese and Traditional Chinese. It preserves 90 language transitions, 54 combinations of nine languages and six widths, and 18 additional search/viewport cases. Pokemon/move/ability/item/type/form names, selected-move status, variable power, warnings, reload and numerical parity are checked at their existing defined coverage. Dictionary presence and representative UI correctness do not establish an exhaustive professional linguistic review of every string.

Persistence checks include automatic/manual mode, Foul Play, HP/Speed, moves, 30-day expiration, corrupt/schema-invalid data, denied/quota storage, reset and multiple-tab behavior. The privacy allowlist excludes feedback text/contact information, tokens and private snapshots. Local feedback tests cover changed/invalid results, consent expiry, pre-submit reconfirmation, language-only transitions, duplicate submission and errors. Production report submissions and new Issues are zero; mock/fixture verification is not a real Turnstile or authenticated D1 replay.

## 5. UI and accessibility

PENDING_FINAL_UI_RESULT

Widths are 320, 360, 390, 430, 768 and 1440px. Added coverage exercises 27 synthetic composition/combobox cases and nine feedback name/focus cycles, including Escape, keyboard reopening, focus return, accessible names and no unsolicited POSTs. Three representative screenshots are inspected. These browser events do not certify an actual OS IME, touch device or native screen reader. Complete contrast and exhaustive assistive-technology review remain outside the demonstrated evidence.

## 6. Performance and memory

PENDING_FINAL_PERFORMANCE_RESULT

Matched Chromium measurements use baseline/candidate in the same job with desktop and 390px mobile/4xCPU profiles. Raw samples, counts, median and IQR must accompany the final comparisons. The samples are clustered browser contexts, not independent physical devices; no statistical significance or universal speed guarantee is inferred.

The controlled-GC protocol uses 12 isolated contexts (two profiles x two versions x three repeats), two warmup plus six measured nine-language rounds per context, 36 reloads, positive/negative GC controls, sampled retired DOM/calculation WeakRefs and complete post-warmup heap/DOM/listener trends. It prunes its own collected metadata. This finite experiment can identify sampled persistent retention; it cannot prove absence of every leak or hours-long stability. See [protocol](v0188-final-memory.md).

## 7. Cloudflare and existing Issue #65

Fresh anonymous read-only production checks pass Worker readiness10/10 and CORS4/4. Administrator endpoints and public report listing deny anonymous access. The approved origin receives an exact CORS origin and no-store/private caching; an unrelated origin is denied. Public configuration matches enabled production intake, non-test Turnstile key and 90-day retention. The public Access JWKS is reachable; this does not certify every Access policy.

Wrangler reports `loggedIn:false`. No authorized management connection is available. Current deployed Worker bytes/bindings/version, D1 state/linkage, full Access policies/audiences, Turnstile administration and actual challenge/authenticated production replay are **INCOMPLETE**. Older authenticated observations are not reclassified as current evidence. Public Issue #65 exists uniquely; that alone does not establish current private D1 linkage or live GitHub-token permission.

No backend source/configuration difference or public failure required a production change. Deployments, D1 writes/deletions, new reports, new Issues, private-report reads, secret changes and authentication relaxations are all zero. Current autonomous backend rollback capability cannot be certified without management access. See [operations report](v0188-final-operations.md) and [raw sanitized evidence](evidence/v0188-final-operations.json).

## 8. Public assets, legacy URL and recovery

Fresh checks at 16:13:20–16:20:42 JST verify 73 static files through212 HTTP/hash checks across both public URLs. All match the published source. The 371 external sprites return200; two sprites are embedded. The actual existing Release ZIP has319 entries and2,530,855 bytes; every entry, commit comment and published checksum match an exact UTC Git archive. SHA-256: `60ec01af456a251eec006833ade16bddf5b5ef8e209c939d518879ebb2f4d500`.

The public repository contains only its workflow and README. Its workflow matches the source deployment template, takes an exact source SHA, enforces approval and exact-source CI, and builds the single source engine. It does not contain a second calculator implementation.

The unpublished candidate source ZIP uses the exact workflow prefix `chloha-damage-lab/`:367files plus24directories,2,708,567bytes, SHA-256 `543b35a33ba8fee8d70e774f56aebf8c1dbc248188b06972f88b2fa01347a275`. Every file equals the exact final Git blob; the archive comment is the full candidate SHA, timestamps use UTC, CRC/unique-entry checks pass, and independent regeneration is byte-identical. Sol independently repeated this comparison. This is a candidate review archive; later approved metadata produces a distinct future Release archive. See [archive evidence](evidence/v0188-final-candidate-archive.json).

PENDING_FINAL_DEPLOYMENT_ARTIFACT_RESULT

The legacy calculator and migration notice remain in the prepared dual-site build. The separate complete notice-free legacy rollback artifact is checked against frozen `4b2cde61f92610c5bb970618d34147a2c16a8d7b`. The current published pre.1 source/archive provides the primary current-site rollback reference. Build/hash comparison is a non-destructive recovery rehearsal; no production rollback was executed.

## 9. Exact-candidate CI

PENDING_FINAL_CI_TABLE

All ten named mandatory workflows, plus release validation, must succeed for the final candidate. The Quality workflow includes three required jobs: complete regressions, performance and controlled memory. The runner executes later tests after any failure and returns failure for any failed file. Required test steps are not treated as passing when skipped. Production publishing and optional status-posting skips are distinguished from validation.

The initial final-gate candidate `c895a8219d90a4b158db251af946c7a1e9715abf` failed33/34 quality files on the clean fixture and was superseded after SOL-GATE-02/03. Intermediate `18798cf25b6edcedcd61d021d473c0194ae1544c` fixes those gates; `1df8157b88c355ed648431cc26c6bc6c5233cbfa` additionally corrects FINAL-L01/02, but an existing English UI contract still required the explicit game-hardware name. Final `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095` clarifies that negative caveat while preserving the old test and new factual-scope assertions. Its successful subsets cannot approve the corrected candidate. The final record preserves the failure/correction trail and fresh exact-source results.

## 10. Remaining limits and owner decision

| Limit | Release impact / required disposition |
|---|---|
| Current Cloudflare administration, D1 linkage, full deployed identity and backend recovery | Public safeguards pass and backend is unchanged, but full live administrative certification is unavailable. Owner must explicitly accept this limited visibility for a frontend-only prerelease, or hold release until an authorized management inspection is possible. |
| Physical phones, native screen readers and actual OS IME | Emulated browser behavior is demonstrated; physical/native behavior is not. Owner must accept this prerelease limitation or require those checks first. |
| Finite memory/performance run | No hours-long or universal memory/performance claim. Retention/trends are interpreted only for measured workloads. |
| Full translation/contrast and all game mechanics | Representative automated checks pass within declared support. Existing unverified/partial/unsupported cases and game/device limits remain explicit. |
| Candidate not publicly deployed | Expected before owner approval. Actual candidate public-byte acceptance must occur after an authorized cutover and before publishing its Release as verified. |

PENDING_SOL_AND_FINAL_DECISION

Owner authorization must separately cover the exact candidate, residual conditions, PR #67 main merge, a new `v0.188-pre.2` tag/Release and planned public cutover. No such authorization has been recorded by this audit. The prepared publication helper binds the real Sol report hash and exact source/tree to a structured owner receipt, verifies protected files and limits metadata promotion. Approval metadata changes require their own CI; protected-source changes require renewed independent review. The existing pre.1 tag must never be overwritten.

## 11. Handoff and next steps

The owner-facing decision is limited to the conditions above and the exact reviewed candidate. After explicit approval, follow the [prepared promotion sequence](v0188-final-release-preparation.md), retain tested source bytes, rerun metadata-promotion CI, verify new/legacy live assets after authorized deployment, and only then issue the new Release under the approved sequence. If approval is withheld, the current pre.1 production remains coherent and unchanged.

For subsequent versions, prioritize authorized Cloudflare management visibility/recovery evidence, physical Android/iOS and native screen-reader passes, longer memory sessions, systematic contrast/linguistic review, and reopening unverified roster/mechanic cases only with suitable primary/game evidence. No unsupported item should be relabeled as supported merely because CI is green.
