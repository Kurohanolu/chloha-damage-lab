# Singularity v0.188 final release preparation

## Scope and decision boundary

This release-engineering inspection begins at PR #67 commit `5f88e471d5a8a3374181ce0d37deb211c1dd9f26`, Git tree `695db47cc2fe7d727de246702cdafc16cff40893`. The final-gate baseline was recorded separately at `3b06f82db5db595e8bce2ae39ad3bbc6dab29c4c`. Subsequent changes prepare an **unpublished `v0.188-pre.2` draft**. The final report must record the resulting candidate SHA/tree and the new CI/Sol result; the earlier result is not approval of the changed candidate.

No main merge, tag creation/update, GitHub Release, Pages deployment, Cloudflare deployment, production report, Issue, or database mutation was performed in this work unit. The existing `v0.188-pre.1` remains pinned to `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`.

An owner approval intentionally left pending is an authorization gate, not itself evidence of a product defect. Missing required test/evidence is a separate audit limitation. Until the new candidate's complete CI and independent Sol evaluation finish, this work unit does not assign RELEASE READY. The final gate report must separately state code/CI readiness, live observations, Cloudflare management visibility, physical-device/native-assistive-technology limitations, and the owner decision still required.

## Findings and preparation

The prior follow-up helper required an exact copy of published pre.1 metadata with pending Terra follow-up fields. The publication gate required Terra for every v0.188-or-later release. The historic 42-file binding test also treated every unmarked manifest as the pre.1 approval. Consequently merely changing the pre-release number or removing the draft marker could not produce a valid Sol-reviewed successor.

The preparation now uses a distinct pre.2 name/tag/notes path and matching HTML title, publish marker, visible version, and every versioned asset URL. It changes no calculation/UI-control logic. The exact pending manifest contains a fresh Sol review with no commit/tree/report/owner evidence yet, owner approval pending, migration approval pending, live acceptance false, and no inherited pre.1 live-acceptance fields. `followupAudit` retains the immutable pre.1 base SHA/tree and blocks every deployment/publication operation regardless of its claimed field values.

The historical pre.1 Terra review, owner decision and 42-file approved byte binding remain checked against the exact historical Git objects. Existing historical tests retain their historic identity; synthetic migration lifecycle fixtures explicitly load the historical release. Cache regressions now derive the candidate version from the manifest instead of assuming pre.1.

The new actual pre.2 approval helper validates:

- The reviewed Git commit exists, its actual tree equals the recorded tree, and its manifest is the exact pending pre.2 candidate schema.
- The actual Sol report file hashes to the recorded SHA-256 and identifies Sol, the new tag, source commit, and tree.
- A structured owner receipt explicitly binds the tag, reviewed source/tree, report digest, reviewer, outcome, condition disposition, approval timestamp, and all four authorized actions.
- All tracked source files except `release.json` and `docs/` have the same inventory and bytes as the reviewed commit. This covers runtime/branding, Worker, fixtures, tests, scripts and workflows. Approval metadata/report/receipt can be added after review without a self-referential full-tree hash.

The actual cutover/publication paths invoke this helper. Merely supplying syntactically valid hashes or nonempty evidence strings cannot publish. The metadata-only helper remains separately unit-testable using synthetic objects; these objects do not pass actual publication authorization.

`tests/v0188-pre2-actual-approval.cjs` constructs a disposable local Git candidate with a real tree, real report digest and structured receipt. The positive actual-gate fixture and tamper negatives passed locally, covering 286 protected files at this work unit. The fixture rejects missing/nonexistent commits and files, mismatched tree/report, altered receipt source/tag/hash/time/conditions/actions, modified runtime/Worker/workflow/script/test bytes, and an additional tracked runtime file. These are synthetic local approvals only and produce no real owner approval.

## Offline build and rollback verification

At `2026-11-15T07:14:38Z`, a clean isolated checkout of the initial candidate `5f88e471d5a8a3374181ce0d37deb211c1dd9f26` produced and verified:

| Artifact | Result |
|---|---|
| Current Singularity tree | 42 files; all manifest SHA-256 values matched |
| Legacy URL tree | 33 files; frozen calculator plus migration notice |
| Complete notice-free legacy rollback | 31 files; every hash matched frozen `4b2cde61f92610c5bb970618d34147a2c16a8d7b` |
| Source archive | 355 tracked files; every ZIP entry byte matched the selected Git object |
| Source archive size | 2,681,958 bytes |
| Source archive SHA-256 | `cfc28982937dc20a4134501dee9ab9124d83a8887bc4cd0ebb7451e4fdbd0ff8` |
| Artifact manifest SHA-256 | `87d0ae67f7f9d52f8e2a73f886aae9b0c81b56ad250717b448a5e3d3883a1b07` |
| Mutations | Zero production changes; source checkout remained clean |

The archive deliberately used the prefix `Singularity-v0.188-pre.1-UNPUBLISHED-CANDIDATE/`, so it cannot be confused with the historical Release ZIP or the later pre.2 artifact. These hashes document the initial candidate only. Rebuild from the final clean pre.2 SHA for final candidate provenance; do not reuse these hashes as pre.2 evidence.

The offline migration contract proves that the legacy calculator bytes remain frozen and only the explicit migration notice is added. The build includes a complete notice-free legacy recovery tree. This is a non-destructive artifact/recovery rehearsal, not a real production rollback or real-device runtime test. Live new/old URL hash checks belong to the separate public-environment evidence.

Local checks passed after preparation: release manifest/assets; pre.2 pending/metadata gate; actual pre.2 binding; follow-up tamper gates; historical approved binding; exact inline contract; Pages baseline; public-release observer; cache-key negatives; migration contract; live-readiness mocks; target deployment gate; release gate; fixed 300-case baseline. CI must execute the two new pre.2 tests on the final source candidate along with the ten mandatory workflows.

## Public repository deployment contract

The currently fetched `Kurohanolu/singularity/.github/workflows/deploy.yml` is manual `workflow_dispatch`, requires a full source SHA, checks out `Kurohanolu/chloha-damage-lab` at that SHA, runs cutover approval/release/baseline/migration checks, requires exact-source successful regression workflows, generates the isolated artifact, records provenance, then deploys the generated Singularity tree. It does not create an independent calculation engine. Public-content/live checks and Release validation follow deployment; absence of a candidate deployment is expected before owner approval.

The source `publish-release.yml` validates pull requests but only publishes on main pushes with successful validation and approval/live gates. It waits for exact-source mandatory CI and refuses to repoint an existing release tag or replace an asset with different bytes. The current draft cannot pass its approval step. The tag `v0.188-pre.1` must never be reassigned.

## Concrete owner-controlled promotion sequence

1. Freeze the final unpublished pre.2 SHA/tree. Complete required CI and independent Sol review against that candidate, including its final metadata and all protected source files.
2. Record the exact Sol report and SHA-256. Present the final gate judgment and specific residual limitations to the owner. Keep all approval fields pending until an explicit decision arrives.
3. After explicit authorization of the exact candidate and actions, record a structured receipt at a new `docs/` JSON path. Populate the new review/source/tree/report/owner fields, clear the draft marker, and record migration approval. Keep `liveTargetVerified: false` until actual new-target acceptance. This promotion may change only metadata/documentation; the actual-binding helper rejects protected-file changes.
4. Re-run candidate CI after promotion metadata changes. The independent source binding must continue to identify the original Sol-reviewed pre.2 runtime; any protected source change requires a new review and CI. Merge only when authorized by the owner.
5. After the owner-authorized public cutover, run exact-source new-target hash/cache/numeric checks and legacy checks. Record live acceptance only after the actual results. Then authorize/perform the new pre.2 tag/Release sequence as requested by the owner. Never overwrite pre.1, and never claim the local preview is already public.
6. Preserve the previous exact public source and artifacts. Prefer redeploying the last approved known-good source for a recovery; the notice-free frozen legacy artifact is separately available if legacy notice removal is necessary. Do not execute a live recovery during this audit merely to test it.

Receipt schema (values below are descriptive placeholders, not approval):

```json
{
  "schemaVersion": 1,
  "releaseTag": "v0.188-pre.2",
  "reviewedSourceCommit": "<exact Sol-reviewed commit>",
  "reviewedTree": "<its Git tree>",
  "auditReportSha256": "<actual Sol report SHA-256>",
  "auditor": "6.1 Sol",
  "auditOutcome": "<pass or conditional-pass>",
  "conditionsDisposition": "<explicit disposition>",
  "decision": "approved",
  "approvedActions": ["main-merge", "new-tag", "github-release", "public-cutover"],
  "recordedAtJST": "<actual owner decision timestamp>"
}
```

No such receipt exists for the real candidate at preparation time. Automatic verification binds recorded evidence; it does not replace the project owner's explicit authorization or Sol's independent judgment.
