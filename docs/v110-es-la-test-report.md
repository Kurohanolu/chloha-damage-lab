# Singularity v1.1.0 — ES-LA test report

## Pre-Release 2 candidate verification — 2026-11-16 JST

Exact source `95e61b419f7e348fe5ec59b4355692bf81f335a6`, tree `85cbdbd46d4d76086f7e739a67960cff9ba62816`: **13/13 workflows and 18/18 acceptance tests PASS**. This adds release identity, cache-key, feedback compatibility and explicit publication lifecycle checks to the accepted 20-image integration. No engine, canonical game inventory or additional terminology changes are included.

- [Exact-source CI receipt](evidence/v110-pre2/candidate-ci-receipt.json), [test results](evidence/v110-pre2/candidate/test-run.json), and [independent Sol review](evidence/v110-pre2/sol-publication-review.md).
- [Retained raw evidence](evidence/v110-pre2/candidate/retained-files.json) and [final artifact verification](evidence/v110-pre2/candidate/final-artifact-receipt.json): all 526 source blobs, 79 site files and 31 rollback files matched. Historical reports below remain evidence of their original commits.
- Numerical comparisons: 4,520, zero differences. Browser checks: 110 rotating transitions, 15 reloads, 86 added-name queries and 60 mobile viewport cases. Legacy state/locale/mobile, controlled memory, performance and local Worker regressions all passed. Production Worker was not changed and no production feedback report was submitted.

Publication and live acceptance are recorded separately in the [publication status](v110-es-la-publication-status.md).

## Historical second-batch verification — 2026-11-16 JST

Status: **technical acceptance PASS on exact source `41e5ad156f0e19f46b342c28353e36e37f46d7a7`**, tree `bc565c1918cf99e3df83e0322cb64551692dcd71`. All **13/13 workflows succeeded**, including all **17/17 v1.1.0 acceptance tests**. This is the additional ten screenshots and combined 20-image audit, not a reuse of historical test results. The following evidence-only documentation checkpoint does not change runtime, source data, workflows or tests.

- [Exact-source localization run](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43787168916) and [13-workflow API receipt](evidence/v110-second-captures/ci-receipt.json).
- [Raw report hash manifest](evidence/v110-second-captures/retained-files.json), [test runner report](evidence/v110-second-captures/test-run.json) and [independent Sol review](evidence/v110-second-captures/sol-independent-review.md).
- Early artifact `14190738790`, ZIP SHA-256 `8fd354ed7c16f25a646338f926ed5d85845a5d1e69b6c9a0750ea0cc67e5b23a`. All 15 retained JSON reports match its exact bytes and hashes. The archive digest also matches GitHub metadata. No owner image bytes are retained in Git.
- [Final artifact and legacy report verification](evidence/v110-second-captures/final-retained-files.json): artifact `14190539887`, ZIP SHA-256 `c973c105af2b01f7bb65bc077f2da57f2837e13261feb6c8a84ba5e04a7ea6bd`. Three legacy reports are retained; all 15 candidate reports match the early artifact. The embedded source archive matches all 503 Git blobs, and the build manifest verifies 79 site files plus 31 rollback files. This is package verification without deployment.

The comparison baseline for this evidence addition is published `83af29133927a19fc7e0f9273c0e194c54384ae5`, tree `cc196155bdb69a5e45b6ddb76b1c49987d4a9f3b`. Stable numerical reference remains `0b270c1452505268364659edd402209b00b28673`.

| Verification | Observed result |
|---|---|
| Candidate acceptance | 17/17 tests PASS; no discovery exclusions |
| Stable numerical equivalence | 4,520 complete outputs agree; 13 protected engine/data/fixture files unchanged |
| Ten-language browser checks | 110 rotating transitions, 6 explicit transitions, 15 reloads, 70 numerical cases |
| Dynamic DOM | 11 scenarios; zero reported translation failures |
| Additional name search | 86 alias queries; 8 move, 8 ability, 4 form and 2 nature cases across 390/1440 px |
| Resistance berries | 36 name/ID/type checks in the actual page registries; 2 automatic-selector UI roundtrips |
| Unsupported abilities | Flower Veil/Rough Skin preserve null output, visible error and disabled actions across locale switches |
| Existing nine languages | Dynamic-output comparisons and separate legacy switching/state/mobile regression passed |
| Mobile UI | 10 locales × 6 widths; 60 cases passed |
| Feedback | Local Worker/browser contracts and existing ES-LA pause passed; no production report submitted |
| Quality | Full state/accessibility/locale/mobile, controlled memory and performance jobs passed |
| Packaging and public observation | Unpublished artifacts built; public site remains the pinned pre.1; publishing jobs skipped |

The browser test was corrected to respect two existing behaviors: unsupported abilities intentionally have no calculation result, and named resistance berries are engine/catalog identities while the UI exposes automatic selection. These corrections do not add support or selector options. All 18 berry name bindings remain independently tested.

Data checkpoint: 1,183 source records/60 sources; second batch 58 system observations, 56 registered and 2 off-runtime, including 3 abbreviation-only witnesses. Official Champions **112 → 142**, unverified **739 → 714**, unchanged denominator **1,029**. Forms overlap Pokémon and are not counted twice. The [20-image audit](v110-es-la-owner-screenshot-evidence.md) retains exact screen positions, canonical matches and exclusions. Additional screenshots requested: **0**.

All 20 originals were visually inspected for terminology. Browser results above are CI emulation; they are not physical-device calculation tests or exhaustive native-language certification. Local Chromium launch was blocked by the environment; successful browser claims refer to the exact CI reports. Remaining 714 unverified fallback names and provisional software UI copy remain disclosed.

Work is saved on `feature/v110-es-la-localization`. [PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68) is already merged, so the [branch comparison](https://github.com/Kurohanolu/chloha-damage-lab/compare/main...feature/v110-es-la-localization) is the review surface. This follow-up has not changed main, the public repository, the immutable `v1.1.0-pre.1` tag or the production Worker. A future publication needs a distinct release identity and current release evidence; this is technical acceptance, not a claim that a new version is live.

## Historical verification records

The following results belong to earlier exact source commits. Wording such as “unpublished” or “production remains v1.0.0” describes those historical checkpoints, not today's already published first-batch release.

## Owner-capture follow-up — 2026-11-16 JST

Baseline for the evidence update: `a70b45674c66dcfd7b87321c9f012dd36637c3f2`. Source record SHA-256: `d97ee7339ab128ec669cf22f0d8705f07c59f3a8a7a3f45f858f9b762b42a427`. Capture manifest SHA-256: `fad28b34817effafb6096fb5c3c35f430b4ad70015e517ca7da5adcb4d6ecd8e`. This is a new source-data candidate; the older accepted checkpoint below is retained as history.

Local preflight PASS: generated source/coverage/UI inventory, exact cache hashes, provenance, owner-capture canonical mapping and deduplication, ten-language contract, 4,520 full numerical comparisons, 13 protected files, 456 dynamic/static witnesses, 19,440 original-nine output comparisons and prerelease approval guards. These local tests ran against an uncommitted preview and are not labeled an exact committed CI pass.

The acceptance suite now requires twelve files, adding `v110-owner-capture-contract.cjs`. The new gate binds ten private image hashes and 71 observations to 65 deduplicated system records, 41 registered identities and 24 off-runtime references; it checks nine independently transcribed critical anchors, 22 name-search queries, six nickname-capable species exclusions and the clipped-row exclusion. It verifies all names, alias sets, IDs and inventory sizes are unchanged. A separate regression distinguishes valid older evidence superseded by a higher-priority source from a genuine missing canonical identity.

Regional browser coverage adds Electrocañón, Fuerza Psíquica and Esquirla Helada, including uppercase/accent-stripped queries, for 29 catalog queries and 20 planned browser cases. The immutable ES dictionary is the source of the Spain-name expectations. The existing 110 rotating transitions, reload/state checks, ten-language numeric and feedback checks, original-nine regressions and local Worker checks remain active.

**Source-data candidate CI: PASS for `9560399385349d0f62cba57a96c146bc08b7663b`.** All 13 workflows completed successfully. The [ES-LA acceptance run](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43736481172) passed all twelve candidate acceptance files, existing nine-language transitions/state/mobile checks, local Worker validation and unpublished packaging. The [API receipt](evidence/v110-owner-captures/ci-receipt.json) binds the workflow and step conclusions to that exact source commit. Local source, owner-capture, ten-locale, dynamic UI and 4,520-comparison numeric checks were also rerun successfully. The subsequent receipt/review documentation commit is not itself represented as this tested source commit; production changes remain prohibited. The [capture audit](v110-es-la-capture-audit.md) records the final coverage changes and privacy limits.

## Historical implementation acceptance

Status: technical development-candidate acceptance PASS. All thirteen workflows, including all eleven ES-LA acceptance tests, passed for the implementation commit below. This is an unpublished development candidate, not release authorization.

## Exact candidate and evidence

- Source candidate: `215e5a1a8af9e20591d077e6acfcabb234a53b7a`.
- Source tree: `fa77eab91c520fc4e40f9d146b63c909f47d8c4f`.
- CI synthetic merge: `7fbfd7d904d27629bfa8a5df28cb61a40b4b54d7`, with the same tree.
- Immutable Stable baseline: `0b270c1452505268364659edd402209b00b28673`, tree `239c4cbd37aa6389f16dc81e7f9a861c09a723f2`.
- Review: [Draft PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68).

The final ES-LA artifact is [14166918126](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755993/artifacts/14166918126), ZIP SHA-256 `24644102d55c6fbf7e5620672cebaa7c9286ea1aba13482982d92dfaf2a77a10`. The embedded source ZIP has SHA-256 `6b98743884d6fa3b687d5bc03b24c787ebc1b753d0c40e7e850f21da8721d718`; all 442 Git blobs match the candidate. The early diagnostic ZIP (`6b4b8d9297e3334543f7b937122e5faaafe0438f47b8d12fba3393842e2f91e2`) contains the same eleven report JSONs and six PNGs byte-for-byte.

Core [reports and screenshots](evidence/v110/retained-files.json) are retained in Git, with per-file hashes, so the evidence does not depend solely on expiring Actions artifacts. They contain synthetic test inputs, not real feedback submissions or credentials.

Independent GPT-6.1 Sol review accepted this implementation's technical development scope after checking the final source/package bytes, raw browser reports and all thirteen CI workflows. No unresolved critical, high or medium issue was confirmed. The [independent review](evidence/v110/sol-independent-review.md) and [browser acceptance review](evidence/v110/browser-acceptance-review.md) retain the observations and limits. This is not owner release approval or complete official Champions terminology verification.

## Observed results

| Scope | Result |
|---|---|
| New v1.1.0 acceptance | All 11 tests PASS; no test discovery exclusions |
| Locale switching and persistence | 110 rotating transitions, 6 explicit transitions over two ES/ES-LA routes, 15 reloads |
| Numerical equivalence | 4,520 complete comparisons against Stable; 13 protected files (10 runtime engine/data, 2 fixtures, 1 reference lock) byte-identical |
| Ten-language browser numbers | 70 complete input/result comparisons, including 16-roll single-hit results and full multi-hit distributions |
| Regional search | 20 canonical alias queries; 14 browser cases across 390/1440 px, including Pokémon/forms, moves and native ability/item typeahead |
| Dynamic browser text | All 11 sampled DOM scenarios PASS; zero collected text failures |
| Reload-specific quoted names | Terremoto, Dracoflechas and Electrobola match the actual selected canonical move IDs |
| Authored dynamic UI | 456 witnesses; 1,680 source roundtrips; 19,440 original-nine output comparisons; 5 identity-sensitive warning cases |
| Smartphone/desktop emulation | 10 locales × 6 widths = 60 cases PASS; no document overflow in tested states |
| Feedback | 10 locales against local Worker/SQLite; private-snapshot consent, stale consent and duplicate handling; Worker API tests 17/17 |
| Packaging | Unpublished dual-site artifacts, cache hashes, preserved legacy recovery assets and pending publication guard PASS |

The ES-LA selector shows the full regional language name at 320–430 px. All 18 measured advanced-setting headings/labels pass their contrast thresholds (ratios 8.87–15.84). The fixed result bar is hidden while feedback is open and returns on close; email and submit center hit targets are unobstructed, and submit is exercised by a click. Six screenshots were visually reviewed. Gradient/image text contrast and every possible UI surface are not claimed as certified.

The current reproducible UI inventory covers 1,011 source/template sites, 79 sampled dynamic branches, 33 bounded result DOM labels and 169 overlapping warning/error sites. Executed English/Japanese UI fallback gaps are zero within this declared inventory. All this software copy remains `provisional`; these counts are neither official game-term confirmation nor exhaustive enumeration of arbitrary DOM combinations.

## Workflow results

All thirteen workflows completed successfully. The [CI receipt](evidence/v110/ci-acceptance.json) preserves run, job and step results for this exact implementation commit.

| Workflow | Conclusion |
|---|---|
| [UI & damage regression](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755837) | PASS |
| [v0.188 Quality Remediation](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755870) | PASS |
| [Showdown differential audit](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755843) | PASS |
| [Publish verified release](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755945) | PASS |
| [GitHub Pages live smoke](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755852) | PASS |
| [v0.184 engine baseline](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755846) | PASS |
| [Showdown differential tests](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755896) | PASS |
| [v1.0.0 Stable Promotion](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755918) | PASS |
| [v0.185 anonymous feedback](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755920) | PASS |
| [v0.186 Accuracy & Mechanics Audit](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727756103) | PASS |
| [Damage Lab CI and status ledger](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727756077) | PASS |
| [v0.187 Singularity Migration](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755924) | PASS |
| [v1.1.0 ES-LA Localization](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755993) | PASS |

The publication job, CI-ledger write job and UI verdict publication step are intentionally skipped on this PR; validation runs. In the historical Stable workflow, immutable v1.0.0 tests and packaging run in the explicit historical step. Its two current-Stable-only steps are skipped for this development identity. Current candidate acceptance and packaging run separately in the ES-LA workflow. No failed required test is reclassified as a pass.

## Latest performance and bounded memory evidence

The performance artifact `14167276920` has ZIP SHA-256 `fb3e7bfa41f44f23cadc205aa4b47abc2d3527060130428b3e01c259f82e9ca9`; controlled-memory artifact `14166999366` has SHA-256 `c5bc857faddf6dcf4bafc43522f1bea15ce97e7e906ed908ff7cc7ba90dc36c9`. Independent Sol review checked metadata, downloaded bytes, candidate/tree binding and raw samples.

| Within-run median | Stable | Candidate |
|---|---:|---:|
| Desktop calculation to frame | 22.9 ms | 22.4 ms |
| Desktop locale change to frame | 55.5 ms | 56.3 ms |
| Emulated mobile calculation to frame | 86.1 ms | 86.6 ms |
| Emulated mobile locale change to frame | 237.5 ms | 247.1 ms |

The candidate adds 332,650 decoded JavaScript bytes. These controlled measurements primarily switch English/French; they do not establish ES-LA worst-case performance or real mobile network behavior. Public observation was GET/HEAD-only against Stable v1.0.0, with no production mutation.

The memory protocol completed 12 isolated contexts, 96 nine-language rounds and 36 exact reloads with calibrated garbage collection. Measured DOM/listener/backing counts remained constant within each measured context, and aged sampled-object retention was zero. Candidate paired steady-state heap was about 311–315 KB above Stable. Both versions retained additional backing storage across reloads and had occasional node-count spikes. No new blocking retention regression was established; this does not justify a leak-free or long-duration guarantee. ES-LA-specific long-duration memory is unverified. Separately, the ES-LA source-recovery cache is tested with 6,000 variable inputs and capped at 512 entries.

## Resolved failures and preserved checkpoints

- `1536a297…`: initial ES-LA tests passed 7/9. Fixes corrected invalid species/multi-hit test assumptions, historical dependency-directory cleanliness, the explicit Stable memory baseline and unpublished-candidate public observation. Its artifact hash is `f74ccfdd632e1166d019451fa3475f2d836732282676fb3acce8311e8fcf2763`.
- `cc5a7576…`: 12/13 workflows and 9/11 ES-LA tests passed. A collapsed species selector and a detector falsely matching Spanish `Daño final` were corrected without weakening required behavior. Artifact hash: `c9d169b045b03e423efee833b2f14b89eaba46740251a81eef223855138da559`.
- `e7453c1e…`: 12/13 workflows and 10/11 ES-LA tests passed. All eleven DOM scenarios ran and exposed two actual reload-only mixed-language reliability quotes. Artifact hash: `a3e270876a2a8f6565c1ad46300c3ec61fecaca32a127886d6d7f6e324fdeb7d`. The correction resolves the native selection's canonical ID before rendering its quote. It preserves power/status and rejects ambiguous translated-label identity inference.

Earlier dynamic warnings/history gaps, a Carámbano cross-region collision, missing estimated-history annotations and ES-LA mobile readability problems were also fixed and given concrete regression witnesses. Prior checkpoint successes are not substituted for the current runtime's results.

## Verification and publication limits

Browser results come from actual Chromium in GitHub Actions; local Chromium could not create a platform socket. Phone viewports are emulation. Physical Android/iOS, native screen readers/OS IME, exhaustive native-language review, all dynamic combinations and Champions hardware mechanics are not certified.

Official Champions, official Z-A, secondary attestations and unverified name fallbacks remain separate in the [coverage report](v110-es-la-translation-coverage.md). The unregistered Stockpile reference retains an English fallback rather than an invented official translation.

Production remains v1.0.0. No main merge, deployment, tag, Release, real feedback report or public Issue was created. Owner judgment on the disclosed translation scope is pending. A later authorized release requires the production feedback validator's `es-LA` compatibility and explicit v1.1 review/evidence publication policy; current publication is fail-closed. See the [handoff](v110-es-la-handoff.md).
