# Independent 6.1 Sol — Final Release Candidate Audit / Pre-Release Gate

Recorded 2026-11-15, completed about 08:00 UTC. Reviewer: independent **6.1 Sol**. No product source edits, product commits/pushes, main merge, tag/release operation, deployment, production submission, private-report read, database write or authentication change was performed by this reviewer. Git fixture commits occurred only inside disposable local test repositories.

## Final verdict

**CONDITIONAL READY — for owner consideration of the narrowly scoped frontend prerelease.** There is no unresolved confirmed source defect or failed mandatory engineering gate in the reviewed final candidate. This is not publication approval, full production/security certification, or a finding that all physical-game behavior is correct.

| Exact identity | Reviewed value |
| --- | --- |
| Proposed release | `v0.188-pre.2` — unpublished draft |
| PR | [#67](https://github.com/Kurohanolu/chloha-damage-lab/pull/67) |
| Final source commit | `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095` |
| Final source tree | `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b` |
| Actual CI merge checkout | `3bb9c9a300fe20b98338bfb6d58ae2409062617f` |
| Published comparison | `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`, immutable `v0.188-pre.1` |

I independently verified that the merge checkout has exactly the final source tree. The final source worktree was clean. Final CI and artifact results below apply to this identity; earlier `5f88`, `c895`, `18798` and `1df` results do not substitute for it.

| Scope | Disposition |
| --- | --- |
| Reviewed source corrections, preserved contracts and finite numerical references | **PASS** |
| All ten required exact-candidate workflows and required quality/performance/memory jobs | **PASS** |
| Final CI archives, packaged source, legacy recovery artifacts and unpublished source ZIP | **PASS** |
| Demonstrated browser state/locale/search/accessibility regressions | **PASS within tested Chromium emulation** |
| Controlled sampled-object retention assertions | **PASS within the bounded protocol**; residual heap growth remains visible |
| Current demonstrated public availability/integrity and anonymous protection | **PASS within stated read-only observations** |
| Full current Cloudflare administration, D1/deployed-code identity and backend recovery | **INCOMPLETE** |
| Physical devices/game verification, native screen readers and exhaustive native-language/contrast review | **UNVERIFIED** |
| Owner authorization and actual candidate deployment/release | **PENDING / NOT PERFORMED** |

Conditional readiness is justified because the demonstrated fixes are frontend changes, backend/configuration bytes remain unchanged from the published source, current public checks are healthy, exact-candidate regressions and artifact provenance pass, and no confirmed new memory leak or unexplained numerical regression remains. It would be unjustified to call the unavailable management or physical scopes passed. If the owner requires those scopes completed before release, their absence remains a release condition, not a waiver by this report.

## Independent execution and source findings

I reran 29 meaningful source/mechanics/security/release checks during this gate, including the new regression handlers, persistence schema/privacy boundaries, exact runtime/inline contracts, cache negatives, historical approval binding, follow-up rejection, Worker security negatives and independent numeric comparisons. Move differential 657, seeded differential 4,000 and ability witnesses 321 produced zero mismatches. New engine checks passed 216 independent arithmetic cases, 456 locked reference comparisons, 20 unaffected move/ID witnesses and six immunity witnesses; existing Astra checks passed 1,627 mechanic/arithmetic witnesses and 3,600 historical comparisons. Fixed original 300 fixtures remain unchanged, with the established 269 unchanged / 26 documented numeric corrections / five trace or metadata corrections contract.

On the exact final clean checkout I independently executed the actual pre.2 approval fixture to completion: real Git/tree/report/owner receipt binding, 286 protected files, tamper negatives, observer/Pages/baseline transitions, and **26 mandatory source-contract child runs across both pre-acceptance and accepted phases** passed. I separately executed final nine-language notice source checks, synthetic distinct UI/core/regression identities, the retained v0.179 disclaimer assertions, exact runtime binding and release/cache checks. Browser execution is unavailable in this local environment; actual browser conclusions come from the verified final CI artifact, not a local browser PASS.

The calculation workstream additionally records 16 successful commands on exact final `c9c52e1`, with source hashes I independently recomputed and matched. Its unverified Dudunsparce special-attack source conflict is retained rather than certified as Champions data. No new unexplained numerical difference is confirmed. These finite software references do not prove every mechanics interaction or physical-game rounding.

Inspected fixes retain their intended boundaries: only Brick Break/Psychic Fangs stable IDs bypass the current-hit screen modifier; input/battle state is not mutated. Raging Bull screen breaking remains explicitly unsupported. HP/Speed edits route to the intended side; automatic Foul Play uses its effective defender budget, while valid manual calculations can preserve inactive allocations. Numeric/null result is part of feedback snapshot identity, so invalidation revokes consent even when controls/input are unchanged. Locale alone preserves consent. Feedback-only input avoids calculator refresh while calculator inputs still refresh. Runtime content hashes match changed bytes.

Additional final-gate findings were corrected rather than hidden:

| Finding | Severity | Final disposition |
| --- | --- | --- |
| SOL-GATE-01: pre.2 approval fields initially validated formats instead of actual source/report/owner evidence; historical binding assumed pre.1 | Medium | **FIXED**: actual commit/tree and report hash, structured exact owner receipt, protected inventory/bytes and a narrowly constrained manifest promotion; original pre.1 path preserved |
| SOL-GATE-02: new real-Git fixture failed on a clean checkout because its commit had no changes | Medium | **FIXED**: disposable commit permits empty changes; clean final execution and CI pass; test was not skipped |
| SOL-GATE-03: approved pre.2 pre-cutover CI rejected the still-published pre.1, creating a deployment dependency cycle | Medium | **FIXED**: only genuinely bound approved pre.2 with live acceptance false may observe the complete immutable pre.1 manifest; old/altered releases reject after acceptance |
| SOL-GATE-04: required fixtures/cache/comparison helpers assumed the draft marker would exist forever | Medium | **FIXED**: explicit historical/pending fixtures plus actual current-state validation; pre.2 content hashes and pre.1 comparison persist across promotion; real child-contract phase matrix passes |
| SOL-GATE-05 / FINAL-L02: eight translated version notices introduced an unsupported current hardware-verification assurance, a default 54-case count and omitted canonical limitations | Medium | **FIXED**: eight full translations align with the unchanged Japanese notice; explicit incomplete Champions hardware verification, supported software checks, unsupported multihit Multiscale and reference-policy limits retained |
| FINAL-L01: Korean version footer retained an English prefix | Low | **FIXED** with the same canonical notice path and restored/switch/reload checks |

Intermediate `c895` CI exposed the clean-fixture failure. Intermediate `1df` UI CI exposed loss of the explicit “Pokémon Champions hardware” caveat expected by the original v0.179 test. The source wording was clarified; the existing test was preserved. The final candidate passes both. Historical screenshots/reports are not treated as traceable hardware validation of this candidate, and the correction does not assert that no historical comparison ever occurred.

## Exact final CI and browser evidence

I refreshed the commit-associated workflow list and fetched every run's job/step summaries independently. All ten required workflows completed successfully:

| Required workflow | Final run |
| --- | --- |
| Showdown differential tests | `43691428041` |
| Showdown differential audit | `43691428099` |
| v0.184 engine baseline | `43691428027` |
| Damage Lab CI and status ledger | `43691428229` |
| UI & damage regression | `43691428053` |
| v0.185 anonymous feedback | `43691428096` |
| v0.186 Accuracy & Mechanics Audit | `43691428044` |
| v0.187 Singularity Migration | `43691428061` |
| GitHub Pages live smoke | `43691428114` |
| v0.188 Quality Remediation | [43691428060](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43691428060) |

The quality run has successful `quality-candidate` job `132742711195`, `performance` job `132742711054` and required `controlled-memory` job `132742711207`. Browser installation, all tests, 90-transition regression, Worker tests, clean build and upload actually executed. No important test was skipped. Expected PR-only nonexecution is limited to the publication job, status-ledger report job and UI status-posting step. Publication run `43691428158` validates successfully but its **publish job is skipped**; green validation is not deployment.

The final runner records **34/34 files passed, zero failures, every exit zero**. I compared its file set with the prior 31-suite report: all original suites remain present. Artifact evidence retains 90 language transitions, 54 locale/viewport cases, 18 continued search/locale viewport cases, nine each of automatic/manual Foul Play and manual-move reloads, automatic invalid-budget rejection and Speed reloads, with full 16-roll numerical cases.

New accessibility evidence has nine passed locales, 27 synthetic IME combobox cases, nine feedback name/focus cycles, and 27 restored/switch/reload footer states with complete numerical parity and zero report POSTs. Synthetic composition events and Chromium accessibility names are not OS IME or native-screen-reader certification. I inspected the final Japanese 320px, Korean 390px and Traditional Chinese 1440px images: text is present/readable within the captured layout and the corrected Korean/footer limitations appear. The Japanese narrow damage caption wraps; these captures do not certify every scroll or contrast state.

## Independently verified final artifacts

I fetched artifact API metadata, confirmed exact run head `c9c52e1`, and recomputed all three downloaded ZIP hashes:

| Artifact | API ID | SHA-256 |
| --- | --- | --- |
| Quality | `14152748139` | `585d95c201f4146118d307ae47dd86e040054f4faabdcfe996afc45718c71186` |
| Performance | `14152418491` | `5d007cdc723193147ae9b91367aae49217096cb0b16d1abbac1b71e044ad1077` |
| Controlled memory | `14152533305` | `4b8b869a00fbee9ed5380ec6fd48f934ded81acd8ccb86f2354b595373545311` |

All **75** build-manifest hashes match extracted files. All **42** packaged Singularity files match exact final source bytes. All **31** notice-free legacy rollback files match both their manifest and frozen legacy Git bytes. The build is clean, `approval-required-preview`, source merge `3bb9c9a`, and `publicCutoverPerformed:false`.

I independently regenerated UTC `git archive` and compared the unpublished final source ZIP byte for byte: **367 file entries**, 2,708,567 bytes, full commit comment, correct paths/bytes and clean CRC. SHA-256 is `543b35a33ba8fee8d70e774f56aebf8c1dbc248188b06972f88b2fa01347a275`. It is an unpublished candidate archive, not a new GitHub Release.

## Performance and controlled-memory interpretation

I recomputed conventional medians and IQRs from raw final samples. General comparison uses five isolated contexts per version/profile, 12 operations each, alternating baseline/candidate order; pooled 60 operations are clustered within five contexts. Mobile is Chromium 390px emulation with 4× CPU and shaped loopback networking. Ranges overlap; no statistical significance or universal improvement is established.

| Median, baseline → final candidate | Desktop | Mobile emulation |
| --- | --- | --- |
| Calculation-to-frame | 24.15 → 24.50 ms | 101.10 → 102.75 ms |
| Locale-to-frame | 61.65 → 63.40 ms | 271.80 → 281.65 ms |
| Uncontrolled post-operation JS heap | 7,607,932 → 9,182,352 bytes | 8,724,704 → 9,540,432 bytes |

These uncontrolled heap increases (+20.7% / +9.35%) remain visible, alongside the earlier historical +30.8% / +24.3% observation. They are not a controlled leak measurement. Different CI hosts/runs and the public CDN must not be directly compared.

The separate guard-reversal experiment changes only the candidate's feedback guard, with five contexts ×20 inputs per variant/profile. I recomputed feedback input-to-frame median/IQR: desktop **17.70/1.45 →16.70/0.15 ms**; mobile **75.75/8.10 →25.60/2.40 ms**. Calculator panel mutations fall **400→0 per 100 inputs** in each profile; state/input/roll/storage equality remains asserted. This demonstrates removal of specific unnecessary work, not general product speed.

The final controlled-GC raw JSON SHA-256 is `c4dd09ad521c23d774aaf033fad687589df42d6b3a26c4df1deac3e56f3431f0`. I independently recomputed its summaries: 12 isolated contexts, 96 nine-language rounds (two warmup + six measured per context), 36 exact state/input/16-roll reloads, and **13,248 sampled weak probes all collected**. Held/released calibration controls pass in all contexts. Audit metadata is pruned before cleanup GC; a growing probe array does not manufacture the reported trend.

| Controlled post-GC metric, baseline → candidate | Desktop | Mobile emulation |
| --- | --- | --- |
| Median of three context heap medians | 4,776,616 →4,747,988 bytes | 4,848,096 →4,786,910 bytes |
| Median first-to-last growth over six measured rounds | 76,940 →31,328 bytes | 82,672 →33,640 bytes |

Continuous document/node/connected-element counts stay at 1 /10,947 /2,260. Listeners stay at 262 baseline and 263 candidate, consistent with the additional document-click freshness handler. End inspection finds 16 detached OPTION trees in each version, consistent with the unchanged strong Map retaining 17 plate options while one is attached. Individual option identities/full retaining paths were not recorded, so that attribution remains qualified.

Positive retained-heap growth remains, and no heap snapshot attributes every byte. Separate three-reload series have median growth +18,034 baseline /+26,514 candidate bytes and follow detached-DOM inspection. This bounded evidence supports **no persistent retention detected among the sampled retired objects**, not a plateau, long-session leak-free certification, or universal memory improvement. No product memory fix is justified by the observed data.

## Current public operations and explicit remaining conditions

I inspected the fresh full operational receipt: 212/212 static responses across 73 files match, 371/371 external sprites are available, approved/unapproved-origin GET/OPTIONS checks pass, and public Issue #65 has one matching counterpart. I independently rebuilt the clean published dual-site artifacts and matched all 212 receipt hashes to expected source bytes; I did not independently repeat all 212/371 network requests. Mutable upstream sprite URLs remain a dependency risk, not source-pinned identity.

I independently downloaded the existing pre.1 ZIP and checksum again: 2,530,855 bytes, 319 file entries, exact UTC Git archive bytes/paths/comment and checksum match; SHA-256 `60ec01af456a251eec006833ade16bddf5b5ef8e209c939d518879ebb2f4d500`.

A fresh independent readiness attempt initially stopped at an unclassified configuration-fetch exception. I retained that failed attempt rather than labeling it PASS. At **07:49:27 UTC**, separate Python and Node GETs returned configuration HTTP200 with the correct origin/no-store, production/enabled and 90-day contract; a subsequent complete original GET-only readiness run passed **10/10**, zero blockers. No failure cause or product incident was established. Final public-performance evidence at 07:49:56 UTC observes immutable pre.1 using GET only, zero forms/submissions. These checks do not establish candidate deployment or administrative completeness.

The owner must decide explicitly whether to accept these remaining bounds:

1. **Cloudflare administration remains INCOMPLETE:** current full Worker bytes/version/bindings, D1 state and Issue linkage, full Access applications/policies/audiences, Turnstile administration/real challenge, authenticated replay and a current backend rollback target were not verified. Management authentication is unavailable. Healthy anonymous protection/CORS/JWKS and local signed-JWT tests do not replace these reads. No backend change is included.
2. **Physical/native and exhaustive scope remains unverified:** real phones/game hardware, OS IME, native screen readers, all language wording/contrast states, every mechanic combination and long-running/process/GPU memory are not certified. Existing unsupported mechanics/data conflicts remain explicit.
3. **Publication remains owner-controlled:** the current manifest intentionally retains pending Sol/owner fields, pending migration approval, live acceptance false and an unconditional draft publication block. Prior pre.1 owner acceptance is historical only. This report must not be converted into a real owner receipt without an explicit decision on this exact candidate, residual conditions and requested actions.
4. **Any authorized promotion still requires its own exact-SHA CI and actual live acceptance:** preserve reviewed protected source bytes; bind this exact report hash and real owner receipt; never overwrite pre.1. Confirm new/old public bytes, cache keys, numerical/locale behavior and feedback readiness through the existing gates before claiming cutover/release complete. Any protected code change requires renewed review.

No confirmed unresolved engineering blocker remains in the final reviewed scope. The conditional status preserves the concrete limits above; it grants no main-merge, tag, GitHub Release or public-cutover authority.
