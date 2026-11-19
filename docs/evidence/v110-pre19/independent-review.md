# Independent release audit: v1.1.0-pre.19

Auditor: 6.1 Sol, independent release reviewer, not implementer.
Outcome: **conditional-pass** for this bounded prerelease candidate. No release-blocking source defect found. All required source-tree CI has now passed. This report is not owner authorization, a deployment receipt, or evidence that pre.19 is already public.

## Exact binding and provenance

- Repository: `Kurohanolu/chloha-damage-lab`, draft PR #88.
- Reviewed source commit: `94e9add40e75a31fd4a9beb91b07655a7b5a981e`.
- Reviewed tree: `ed1e3a9899785d4731867f4b49e066f299e15e9d`.
- Immutable published pre.18 predecessor: `c52a65f4487fa8b4ceb2cd1ac5d85a2334697854`, tree `beacee500cd7cd651bd312645d31417f1b47940f`.
- Local source was clean at inspection and after verification. The full 54-file predecessor-to-candidate diff, release policies, runner, targeted browser test, historical wrappers and negative gates were inspected.
- GitHub PR jobs checked out synthetic merge `6b35b6120c1424e6d07203a1c7ec7eee319fec4e`, not the raw branch commit. The GitHub Git commit API independently confirms its tree is exactly the reviewed tree above, with the exact published predecessor and reviewed head as parents. Downloaded aggregate evidence also records that tree and a clean checkout. These are exact-source-tree PR results; they must not be described as execution on a different raw commit.

## Scope and source findings

PASS: Only two existing regional ability names gain historical official-publication attestations: Own Tempo / マイペース / `unsupported:マイペース` / Ritmo Propio, and Leaf Guard / リーフガード / `unsupported:リーフガード` / Defensa Hoja. Display names, aliases, canonical IDs, supported ability inventory, engine, roster, other nine dictionaries and feedback implementation remain unchanged. Inline HTML changes are exactly release identity and asset-cache references. The feedback release adapter only adds pre.19 identity compatibility.

I recomputed the six supplied raw HTML hashes, independently extracted visible text excluding scripts/styles, and inspected the region links. Slowpoke's official es-mx ability field contains Ritmo Propio and its same-profile en-us counterpart contains Own Tempo; Zarude's pair contains Defensa Hoja and Leaf Guard. The América Latina selector links to `/es-mx/`. Adopted source hashes match the manifest:

- Slowpoke es-mx: `c7cd346d4be116841ee0cf5773ab5a71ea46c10c18430ab24fd221b9380eece8`.
- Slowpoke en-us: `12d4bed1e66d05b53d0886971d71a8c14a70feb901361b183e2cb31131f32ef1`.
- Zarude es-mx: `0387fb005a9f26f4afd7073977492ac9400b02c983a5749abcb607eac9080943`.
- Zarude en-us: `debe422ef0b71fb0b2471d9770d2fa6759040580e092984547a26f343f719b29`.

These are historical Pokémon Sword/Shield regional marketing publications, not physical-game tests or Champions wording/support proof. The records correctly use `official-publication-not-physical-game-test` and `officialChampions:false`. Kubfu's Foco Interno / Inner Focus versus existing Fuerza Mental discrepancy is explicitly excluded and remains unverified. Counts are independently reproduced: official 518/1029, unverified 355, Champions-specific 195 unchanged; overlapping forms are excluded from that denominator.

## Lifecycle and gate findings

PASS: pre.19 starts with cleared pending independent review, owner decision and live acceptance. Complete immutable pre.18 metadata is the observation baseline. Receipt writer and verifier both pin the exact pre.18 rollback commit/tree and full dual-site asset inventory. Old receipts, retagged receipts at production boundaries, pending publication, unaudited live flags, arbitrary/stale baselines and follow-up markers are rejected. Approval binding still checks reviewed source/tree, report hash, owner evidence and protected bytes. No approval or publication boundary was bypassed.

Existing assertions and historical proofs are retained and executed on their immutable historical sources; new exact current-delta protections are separate. The runner still discovers all v110 tests, adds the three new required files, retains all earlier requirements, and records failures rather than silently skipping them. Existing timeouts, quality/performance protocols and mandatory workflows were not weakened. Publication/deployment negative gates reject missing, failed, wrong-head, wrong-event and newer-pending/failed CI before consequential boundaries.

## Verification personally performed

Local PASS: release manifest/cache verification; regional batch13 contract; pre19 lifecycle and rollback; source provenance; deterministic coverage and UI inventory checks; locale/search contract; release identity; complete nested immutable successor proof; publication and deployment negative gates. Numeric equivalence passed 4,520 complete-output comparisons, independent BigInt weather 2,592 cases, locked Showdown 1,680 vectors. Protected engine/model files remain exact. Local Chromium socket restrictions were not bypassed, and no local browser pass is claimed.

I independently fetched final GitHub results for the reviewed head. All 14 PR workflows concluded success:

| Workflow | Run |
|---|---:|
| Showdown differential tests | 44350533723 |
| Showdown differential audit | 44350533313 |
| v0.184 engine baseline | 44350533106 |
| Damage Lab CI and status ledger | 44350532966 |
| UI & damage regression | 44350533067 |
| GitHub Pages live smoke | 44350533170 |
| v0.185 anonymous feedback | 44350533396 |
| v0.186 Accuracy & Mechanics Audit | 44350533631 |
| v0.187 Singularity Migration | 44350533005 |
| v0.188 Quality Remediation | 44350533510 |
| v1.0.0 Stable Promotion | 44350533326 |
| Conditional move UI acceptance | 44350533262 |
| v1.1.0 ES-LA Localization | 44350533443 |
| Publish verified release, PR validation only | 44350533779 |

The main ES-LA run is https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/44350533443 . Both jobs passed, including later nine-language 90-transition, state/locale/mobile, local Worker and clean artifact-build steps. The named publish workflow's green PR validation is not an actual release.

I downloaded the final candidate evidence artifact #14455280123 and independently matched ZIP SHA-256 `4b8a1584d2ba0dbd60159502d3c146b3fc87ea7c4ec7ffbb28c6d9c059f8e67e`. Its test-run JSON has all **83/83** statuses zero, no signal/error, `passed:true`, clean checkout, and exact reviewed tree. The new targeted browser JSON genuinely passes **40 unsupported selection/save/reload cases + 20 supported numerical/save/reload cases**, ten locales at 390/1440 widths, six canonical catalog searches and four ES-LA native typeahead cases. Both promoted ability IDs remain blocked, with no calculated output or copy activation. Labels, aliases and persisted canonical state match pre.18. This is browser automation, not real-device testing. The weather job independently passes 220 locale/reload/mobile cases.

I inspected Quality Remediation's completed jobs and performance logs and downloaded controlled-memory artifact #14448717346, matching ZIP SHA-256 `2a4c8a047554e6fc94748a09a0910c0df63673e42f506d233ec065cacfa40a6c`. Raw data binds the exact source tree and predecessor: calibrated GC, 12 contexts, 96 rounds, 36 reloads, issues empty, no aged sampled retention. Across measured rounds documents=1, nodes=10994 and listeners=278 remain stable; candidate heap drift closely tracks baseline. Sixteen detached OPTION diagnostic trees occur in both versions. This does not establish universal leak freedom. Matched performance medians show desktop cold FCP 140→148ms, warm 80→80ms; throttled 390px cold 5064→5076ms, warm 312→316ms. No material regression is indicated by these bounded samples; CDN measurements are not compared directly with loopback.

## Conditions and remaining release boundaries

1. Preserve truthful historical-publication scope: no new mechanics, availability, Champions confirmation or physical-device assurance. Unverified names and provisional UI remain disclosed; ES-LA feedback stays paused while the other nine paths remain preserved.
2. Accept the existing verification limits: automated Linux Chromium/emulation is not actual Android/iOS, native assistive technology or physical game validation. Short calibrated memory/performance runs do not prove indefinite-session leak freedom or all-device performance. No production mutation or feedback submission was performed by this auditor.
3. Before any publication, independently record valid authorization and bind this report's actual bytes/hash to this exact source/tree through the existing workflow. Only allowed review/owner/live metadata may change thereafter. The auditor does not grant permission. Any substantive source change needs fresh affected review and exact-source CI.
4. After authorized cutover, run the existing real deployment and exact current/legacy asset-cache acceptance and bind the genuine deployment receipt before claiming public success. Pending pre.19 has not earned live acceptance from this review; pre.18 remains the immutable rollback baseline.

No condition permits a failed, missing or timed-out gate to be waived. With these explicit limits and the existing publication boundaries intact, this bounded candidate is conditionally acceptable for the prerelease process.
