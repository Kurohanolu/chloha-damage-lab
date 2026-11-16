# Singularity v1.1.0 — ES-LA implementation report

## Current implementation — second batch, 2026-11-16 JST

The additional ten screenshots are integrated with the original ten as private terminology evidence. The [20-image audit](v110-es-la-owner-screenshot-evidence.md) is the current implementation record. The published baseline is `83af29133927a19fc7e0f9273c0e194c54384ae5` (`v1.1.0-pre.1`); this follow-up is **not yet published**. Work continues on `feature/v110-es-la-localization`. [PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68) is already merged and is retained as the review/history record; no duplicate PR is created. The [branch comparison](https://github.com/Kurohanolu/chloha-damage-lab/compare/main...feature/v110-es-la-localization) exposes subsequent changes.

The source ledger now contains 1,183 records from 60 sources. The second batch contributes 58 system-name observations (56 registered, two off-runtime), reuses 14 existing owner records and adds 44 records. Three observations are abbreviation evidence only. Coverage across the unchanged 1,029-name denominator is official Champions 112 → 142 and unverified 739 → 714; overlapping form and UI views are excluded from that aggregate.

Implementation changes are limited to ES-LA terminology/provenance, generated coverage, cache identity and regression/publication checks. `Firme` adopts the observed initial capital. Search gains `Floette Flor Eterna`, `At. Esp.` and `Def. Esp.` while retaining all existing aliases. The compiler distinguishes abbreviation-only evidence from full display-name evidence and accepts only exact case differences at an otherwise conflicting evidence rank. Distinct names, accents or punctuation still fail conflict validation. Existing nine-language data, canonical IDs, game inventory and the calculation engine remain unchanged.

The original ten-image manifest stays immutable; later witnesses are additive. Effect-description transcriptions are kept separately from engine support. No owner screenshot bytes are added to Git. No additional screenshots are requested.

All 13 validation workflows can run on the existing feature branch. Publication and person-directed CI result steps remain restricted to main. The follow-up manifest records an unpublished audit and clears reusable live/review acceptance. Historical public observation stays pinned to the already published source/tree. A future publication must use a distinct release identity with fresh evidence; this audit cannot overwrite `v1.1.0-pre.1` or reuse its approval.

Focused local checks have passed; fresh committed CI and final Sol review are still pending at this checkpoint. The [test report](v110-es-la-test-report.md) will bind them to the resulting commit/tree. The live site stays at the published baseline. Its existing temporary ES-LA feedback restriction remains in place; other nine locales and the production Worker are unchanged.

## Historical implementation and first-batch checkpoints

The sections below preserve the development record before the first publication. Their earlier pending-release statements and counts are historical, superseded for current status by the checkpoint above.

Status: implementation and technical acceptance complete for the disclosed development scope; terminology coverage and owner release approval remain open. Reviewable draft: [PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68).

Accepted implementation commit: `215e5a1a8af9e20591d077e6acfcabb234a53b7a`, tree `fa77eab91c520fc4e40f9d146b63c909f47d8c4f`. The following documentation/evidence commit does not change runtime behavior. Exact test results are retained in the [test report](v110-es-la-test-report.md).

## Owner-capture evidence update — 2026-11-16 JST

Ten owner-provided screenshots add 65 deduplicated official game-name attestations (41 registered identities, 24 off-runtime references). Existing display strings, alias sets, canonical IDs and inventory sizes are unchanged. Twenty-seven registered identities newly become official, and 31 gain official Champions evidence. Names observed in editable Pokémon party slots remain context only; game UI observations remain separate. Originals are private. The compiler retains the union of selected evidence scopes in the full audit while preserving its existing singular field and compact runtime metadata. Source coverage and content-cache hashes are regenerated.

The source ledger now has 1,139 records from 50 sources. Capture-specific identity, evidence, alias normalization and privacy contracts are added to acceptance; the existing ten-language, numerical, persistence, search and feedback gates remain active. The [capture audit](v110-es-la-capture-audit.md) and [test report](v110-es-la-test-report.md) distinguish this follow-up from the accepted implementation checkpoint below.

## Fixed starting point

- Source main observed on 2026-11-15: `5d6a685ceab3cc1fd3db873bd5591a35f0e6fc03`.
- Starting Git tree: `5a4fcb566a5cb38ea4016080b306dad01be0589e`.
- Stable `v1.0.0`: `0b270c1452505268364659edd402209b00b28673`, tree `239c4cbd37aa6389f16dc81e7f9a861c09a723f2`.
- Since Stable, main contained development-memo updates only. No existing ES-LA PR or branch was found.
- Work branch: `feature/v110-es-la-localization`.
- Public mirror remains `cede7831cc010fe5ad46e8c30a67e39a509474f0`; no production mutations are part of this task.
- Stable v1.0.0 and the preserved legacy calculator remain the recovery references. Historical tags are not modified.

## Scope

Internal locale `es-LA` is separate from existing `es`. HTML/Intl uses `es-419`; the Turnstile provider uses its supported Spanish identifier `es`. Canonical game/control IDs remain unchanged. The audited numerical engine and game-data bytes are protected against the Stable commit by a new independent comparison gate.

Regional name differences retain per-record provenance and verification levels. Inherited Spain-Spanish names are explicitly unverified ES-LA fallbacks. Authored UI copy is classified separately from official game terminology. The source audit and coverage report describe limitations.

Candidate metadata is `Singularity v1.1.0 Pre-Release 1`, tag name `v1.1.0-pre.1`. This is a development identifier, not an issued tag or Release. Prior owner approval, audit bindings and live acceptance metadata are cleared; publication must fail closed pending a new owner decision.

## Backend compatibility

The shared feedback validation contract adds the internal `es-LA` locale without changing authentication, privacy filtering, storage or the Worker logic. Candidate requests retain the full product version in an explicit description header and a bounded two-part compatibility version in the existing wire field. The production Worker has not been deployed. A future authorized release must deploy/verify the compatible locale contract before exposing the new frontend; sending ES-LA to the old production validator is not declared supported.

## Verification

The initial source compilation maps 1,074 attestation records from 40 sources to the registered runtime inventory. All 18 types have individual attestations; 133/335 moves and 55/245 abilities are attested. Per-game official scope, unresolved fallbacks and overlapping form/UI-warning counts remain explicit in the coverage report.

All thirteen candidate CI workflows passed, including eleven new ES-LA tests, ten-language browser acceptance, 4,520 numerical comparisons and the existing functional nine-language regressions. Thirteen protected files (ten runtime engine/data files, two fixtures and one reference lock) remain byte-identical to Stable. Historical exact-nine identity assertions remain attributable to the immutable Stable commit; new ten-language tests run in addition. No test failure is accepted as a release pass. The [test report](v110-es-la-test-report.md) records exact source/tree bindings, reports, screenshots and verification limits.

## Continued integration audit

The first committed candidate was `1536a29783f98652dc92b40273c94cd0ff075362`, tree `6f4c2839ad8ca9a2d9f39654f83475ef4ef75e96`. Its PR CI checkout was synthetic merge `f3332e2cc7bdf712c0cef9eede42e0a6062cf8b5` with the same tree. It is a checkpoint, not final acceptance.

Independent Sol review caught and closed legacy name-audit fixture scope, catalog ordering and normalizer compatibility failures. Existing nine-language tests remain active on candidate code. CI additionally exposed historical dependency symlinks falsely marking a worktree dirty, a prior-version memory baseline assertion and an obsolete migration feedback wire-version expectation. Corrections preserve the original fixed baselines for their original release lines and explicitly validate the new candidate contract.

An expanded UI inventory audit found English fallback in dynamic condition, multi-hit, KO, trace and battle-history messages. These product defects are corrected by an ES-LA-only renderer operating on canonical source templates. The renderer preserves numeric tokens, resolves names from canonical metadata and bounds source-recovery storage to 512 entries. Its separate regression gate compares existing nine-language output to the immutable Stable renderer. Authored reason/error copy is included in the provisional UI inventory.

Independent review additionally found a Spanish alias collision (Carámbano), an estimated-move history annotation left in Japanese and a hardcoded Spain-Spanish type name. Canonical name binding and explicit history annotations address these cases; regression witnesses preserve the distinction between Icicle Crash and Icicle Spear. Translation text is never used as a calculation identifier.

ES-LA mobile styling makes the full regional locale label readable, gives advanced settings a dark surface with measurable text contrast, and temporarily hides the fixed result bar while feedback is open. Final browser acceptance verified all three changes and restoration of the result bar on close. All 60 locale/viewport cases passed; six screenshots were visually reviewed.

The final reload audit exposed two mixed-language selected-move reliability quotes. The ES-LA UI renderer now receives the actual selected canonical move record and translates the complete quote before generic text substitution. Ambiguous display aliases cannot choose an identity. Tests explicitly bind Terremoto, Dracoflechas and Electrobola to their selected move IDs after reload, and cover colliding Spanish aliases. All eleven DOM scenarios pass on the accepted implementation.

The declared UI inventory contains 1,011 source/template sites, 169 overlapping warning/error sites, 79 sampled dynamic branches and 33 bounded DOM labels. Scoped English/Japanese UI fallback gaps are zero; all general software copy remains provisional. This does not upgrade unverified game-name fallbacks to official translations or certify arbitrary dynamic combinations. Production feedback deployment, physical-device review and formal publication are outside the completed development scope; see the [handoff](v110-es-la-handoff.md).
