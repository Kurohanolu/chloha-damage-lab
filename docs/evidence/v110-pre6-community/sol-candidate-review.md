# 6.1 Sol independent Community policy review: v1.1.0-pre.6

Reviewed source commit: `eb7eb6195cd205a43350681352ca03353831d1b9`

Reviewed source tree: `7ad2d65d7b56f48f2820172a5cccff43557d6237`

Outcome: **pass** for the exact reviewed candidate. No unresolved candidate-CI condition or blocking implementation defect remains. This report does not authorize publication. Fresh source/owner approval binding, deployment proof and actual two-site live acceptance remain mandatory subsequent gates; old review/live receipts cannot authorize this revision.

## Scope and baseline integrity

This is the explicitly owner-approved Community baseline transition, not an implicit change prompted by a failed live check. The explicit `community-pinned-v1` marker opts in; unknown/malformed marker values fail closed. Unmarked historical releases retain the original frozen calculator/notice behavior.

Independently loaded and hashed all 44 files from Community source `5ac31cbd9d128f82c42121b2c1fc12fcdc4c24ed`, tree `c641405fe8a33e8a4568049f0a5396373c3817f6`. Independently verified latest matching audit commit `7ea318542e41de622fc7976e1ac5c1fce94c8b11`, tree `3baba1496902200befeb0a59b6af5acee29fda9f`, and rights-clearance evidence SHA-256 `39a1182181cee4dbf5d7ff666b2486179692a7fd995663df1b8f0512dc559470`. Its 44-file hash inventory equals the pinned manifest exactly. The 32-file application subset recomputes to `55096a2490a4505b84f821f1108bed0ee877cfa03c53a07019c00c34bc819dbd`. The manifest itself is hash-pinned in protected executable code, so a docs-only substitution cannot bypass reviewed-source binding. Only ordinary Git blobs are loaded; symlinks/submodules, missing/extra files and modified bytes are rejected.

This verifies binding to the prior rights assessment, not an independent legal guarantee or a newly granted right. That assessment retains permitted-with-conditions scope and notices. Community README/TERMS/license/rights materials are included, not silently excluded as non-runtime content.

All relative HTML references must resolve within the pinned 44-file inventory; hash-bearing references bind exact digests. Local packaging copies exact Community bytes for verification only. The unchanged target Pages workflow uploads `dist/deploy/singularity`, not the Community copy. No deployment path overwriting the existing Community URL was added. Historical notice-free rollback remains pinned to its original legacy commit independently of the new public baseline.

## Review, security and historical gates

Current Singularity HTML/runtime/engine/dictionaries, Worker implementation, deployment workflow and existing CI workflow files are unchanged by this policy revision. Live validators still require full current-target inventories, exact cache-bearing browser URLs, approvals and publication/live proof. Community validation now checks every one of its 44 files including documentation, at bare and fresh URLs, plus actual HTML cache URLs. Tests reject missing/extra/mutated inventory, stale exact-cache bytes and modified live HTML. Transport-only test mocks do not replace production approval checks; separate lifecycle tests require them.

The prior accepted Singularity frontend is pinned at `a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9`, tree `604f0632eaf2d28e2fbd40012d68133050f72f30`. This is a website observation baseline, not a claim that the previously blocked GitHub Release exists. The entire predecessor manifest is compared, not merely its unchanged version string. New source bytes/policy cannot reuse that same-version approval: release metadata is cleared to pending, old liveAcceptance fields removed, old review/live receipts rejected, and accepted new-policy observation cannot fall back to old proof.

Historical pre.6 lifecycle and v0.187 live-readiness tests execute unmodified immutable historical trees. The migration browser keeps current Singularity/private-Worker coverage while its old-notice section uses an explicitly labeled local-only historical fixture. New required Community contract/browser tests cover the new baseline separately. No historical fixture is asserted to be current Community acceptance.

## Corrected rollback compatibility defect and delta review

Prior candidate `3c3cad1dc6838ed5409693c7fb17929c76f01b7e` failed the migration CI rollback path: the current-artifact legacyCommit correctly described Community, while rollback preparation still required it to equal the historical rollback commit. This was a real uncovered integration defect; prior conditional static review was not a full CI pass.

The reviewed exact candidate changes only `scripts/v0187-prepare-rollback.cjs` and `tests/v0187-rollback.cjs` relative to that prior candidate (10 insertions, four deletions). Independently reviewed the complete diff and current rollback core. Community current-artifact source and every provenance field must equal the independently pinned source/tree/audit/tree/evidence/application digest, 44-file count and readOnlyBaseline flag. Historical unmarked artifacts retain the prior requirement. Independently pinned 31-file historical rollback inventory, rollback commit, fixed artifact path, every-byte SHA-256, source/output isolation, new-output-only requirement and path-component symlink rejection remain unchanged. All bytes are validated before the first output write. The function still performs only local preparation; the added result explicitly says no legacy-site overwrite authorized and historical-only for a Community current artifact. It intentionally does not require damaged current-site bytes to be healthy to recover an independently verified historical fixture. Two negative tests additionally reject wrong current-source and current-provenance metadata; existing corruption, rehashed corruption, missing/truncated/unsafe inventory, wrong rollback release and symlink cases remain.

## Historical preview allowlist correction

The immediately preceding candidate `362688058f8d7b1919bd15094df94b5b40d7b781` exposed a further local historical-fixture integration defect: its files were copied but the preview server's allowlist still described Community, so the historical feedback script returned 404. The new exact delta is one test-helper file only. It changes only a temporary local preview inventory: current Singularity entries remain exact, legacy entries come from the pinned historical builder, the required historical feedback script is asserted present, and the mixed artifact receives an explicit historical-fixture/local-only mode. No browser assertion, app, production builder, deployment or approval gate was changed.

Independently built this mixed preview and recomputed all 79 file hashes; all match the preview manifest. All 46 current Singularity inventory entries remain identical, and historical feedback code is available. The helper's immutable historical source/tree, temporary-directory guard and cleanup remain. This correction restores execution of prior assertions rather than skipping them. A mixed local fixture is not current Community acceptance.

## Final test-harness and memory corrections

Independently reviewed the complete four-file delta from `7bbd63af495a99bd2fd3ddea0b8798728342a0c5` to this exact head. No app or Community pinned bytes changed. The Community browser now reads actual first-span visible move text and compares it exactly to the pinned locale dictionary, then retains its selected-summary assertion. Accessible names remain separately recorded and asserted nonempty. This corrects an invalid assumption that aria-label equals visible text; it does not certify localized accessible names. The artifact truthfully shows inherited English accessible names for several non-English locales (for example French visible Séisme with accessible Earthquake). This known immutable baseline limitation is not repaired or concealed by this revision.

Controlled memory now explicitly serves `comparisonRef:BASELINE` rather than declaring a pinned baseline while using the helper default. The original exact-baseline assertion remains, with an additional lifecycle assertion for the explicit call. Release-identity tests retain every original historical pre.6-vs-pre.5 assertion using the immutable original pre.6 manifest; an added equality assertion confirms current policy-only release identity. The separate current Community lifecycle continues exact predecessor and stale-review rejection tests. These corrections restore relevant intended assertions; they do not skip failing gates. Earlier candidate CI failures are not claimed as passes.

## Independently executed local evidence

PASS on the new exact head: 31-file rollback including all negative cases, Community pinned contract, revision lifecycle, immutable historical pre.6 publication, immutable historical live-readiness, current deployment gate, artifact contract, numerical equivalence, ten-locale contract and release verifier. Community contract independently exercises complete 44-file/app/audit binding, mutation/missing/extra/unknown-policy rejection, full public transport mocks and historical rollback/acceptance. Numerical equivalence passes 300 fixed cases, 31 documented corrections, 2,048 seeded inputs, 4,096 seeded comparisons and 4,520 complete-output comparisons. These are regression checks, not physical game mechanics verification.

## Final independently verified exact-source CI and browser evidence

Independent GitHub connector queries for exact source `eb7eb6195cd205a43350681352ca03353831d1b9` returned **13/13 workflows completed/success**. Independently fetched ES-LA Localization run 43858287288: every step passed, including all candidate tests, legacy ninety-transition, nine-language state/mobile, local Worker, unpublished packaging and artifact upload. Independently fetched Quality Remediation run 43858287424: all performance, quality-candidate and controlled-memory jobs/steps passed, including controlled-GC recovery, independent reference and state/accessibility/locale/mobile checks. Both Showdown workflows and migration workflow also completed/success. A candidate Publish workflow success is not an actual publication claim.

Independently inspected downloaded artifact 14222387716 from https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43858287288 . The runner reports **33/33 tests status 0**, clean preview, synthetic PR merge commit `788534afe73adb97928298f53baf886254dbbe4c`, exact reviewed tree `7ad2d65d7b56f48f2820172a5cccff43557d6237`. This establishes exact-tree evidence, not equality of merge SHA and source head. Community browser passes 27 width/locale/search/save/reload/numerical cases at 320/390/1440 and nine locales, 900 complete public contract comparisons, exact 44-file/app/source binding, three deliberate blocked privacy-safe links, no non-read attempts and zero production requests/mutations. Evidence explicitly says liveAcceptance false. This is Chromium emulation, not physical-device testing or public-URL live acceptance.

Inspected artifact evidence SHA-256:
- test-run.json: `ebb59eec9ac39c91f12e8c4ab27051d9eab7c0f4342565ed34b5fb4c0b26d06f`
- community-browser.json: `4b81a29e1aefcfa0bfac2986435dfa617d1240178c08ade935fe6c70a94698ec`
- community-revision-lifecycle.json: `065279352f717ec080c4e017fbdcca24757a2155ca9ccfaf0e3ed93cf3e69a8a`

Locally reran exact-head release identity, Community lifecycle, full Community pin contract and all 31-file rollback negative cases: PASS. All candidate-CI conditions are resolved; subsequent fresh approval, deployment and two-site live checks remain required.

No merge, tag, release, deployment, live metadata update or public cutover was performed by this reviewer.
