# Singularity v1.1.0 — ES-LA implementation report

Status: development in progress; not a release authorization.

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

Results and exact candidate SHA bindings will be recorded in `v110-es-la-test-report.md` after CI. Historical exact-nine identity assertions remain attributable to the immutable Stable commit; existing functional nine-language regressions continue on the candidate, with new ten-language tests in addition. No test failure is accepted as a release pass.
