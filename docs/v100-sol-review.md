# Independent 6.1 Sol — Singularity v1.0.0 stable promotion

**Final verdict: CONDITIONAL READY (`conditional-pass`) for the reviewed v1.0.0 frontend stable promotion.** No unresolved confirmed engineering blocker or failed mandatory gate remains in this reviewed candidate. Administrative, physical/native and long-session limits below remain explicit. This is engineering review, not owner impersonation or a claim that publication/cutover already occurred.

Completed 2026-11-15 about 09:13 UTC. Reviewer: independent **6.1 Sol**.

## Exact candidate and scope

- Release: `v1.0.0`, explicit stable channel, null prerelease number.
- Reviewed source R2: `b5ea506af27487a05cc7fbdc11371ac47778b06a`.
- Reviewed tree: `1e4d0d54c2013b22db3e15db144f8998cab1adfd`.
- Parent R1: `45cbeb5ccb06b68c1f358616422111e5dc620a93`, tree `bf9ad1dcefa4eae6cd56de10dd384402601bc866`.
- Preserved numerical/engine baseline: `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095`, tree `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b`.
- Current published rollback: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, immutable `v0.188-pre.1`.

Reviewer independently inspects source and CI/public evidence and runs read-only source/local fixture tests. No product edit, product commit, approval on the owner's behalf, merge, tag, release, deployment, production report POST, private-data read or database mutation was performed by this reviewer. Disposable fixture Git repositories and local synthetic SQLite reports are test-only.

The owner subsequently instructed 「公開まで進めてくれ」. This delegates completion of publication under the freshly reviewed candidate and known conditions, as recorded in the runbook; it does not constitute a claim that the owner manually typed the future source SHA. This report assesses engineering readiness and does not manufacture owner evidence.

## Source assessment

The stable promotion changes metadata/display/cache identity, explicit feedback transport compatibility and release/deployment gates; it does not reimplement the engine. Numerical/data/persistence and original reference bytes remain protected. The new numerical promotion suite compares complete old/current outputs, not merely min/max: 300 original contracts with the existing 269 unchanged / 26 numeric corrections / five trace or metadata corrections, 72 screen witnesses, 28 neutral BigInt speed boundaries, 2,048 fixed-seed inputs through both entrypoints (4,096 comparisons), and 21 multihit distributions total 4,520 complete comparisons. This establishes equivalence to c9c within a finite suite, not universal physical-game accuracy.

Stable identity is explicit: full three-part version and tag, stable channel and null prerelease marker. Unknown release policy cannot inherit historical authorization. Changed runtime URLs retain exact version/content cache hashes. The internal engine identifier remains historical and provenance distinguishes it from product v1.0.0.

The unchanged feedback service accepts two-part appVersion. The bounded adapter maps only exact title `Singularity v1.0.0` to wire `v1.0`; future patches and partial identities fail closed. A visible immutable `[Singularity release: v1.0.0]` header is always sent in description, including attachment-off reports. Its 31 UTF-16 code units include two newlines, leaving 4,969 user-input code units within the 5,000-character wire limit. All nine locale help/error messages and maxlength expose that budget. Snapshot and request wire versions agree; full stable identity persists in stored report description, while the database app_version field alone remains v1.0. Private report text and metadata are not automatically saved into calculator storage. Retry identity and consent freshness remain preserved. This documented compatibility adapter avoids an unverifiable backend deployment; it is deliberately not a generic semver protocol upgrade.

Approval/publication gates bind actual reviewed Git tree/source bytes, real report hash and structured owner evidence, and preserve the historical pre.1/pre.2 paths. Runtime/Worker/tests/scripts/workflows inventory and bytes cannot change during approval; only explicit release metadata and documentation can change. Actual stable fixture verifies approved A → full artifact receipt → accepted B; a boolean live flag alone cannot authorize publication. A's historical receipt does not prove B is currently public.

The target workflow accepts only a validated full source SHA via dispatch or a strict one-field deployment-request at the exact target commit. Both checkouts disable persisted credentials. Exact source HEAD, actual owner/review binding, all regression gates, clean builder/provenance and successful deployment are required. Publisher independently verifies the immutable target workflow/request, main event/run identity, current run attempt, successful required jobs/steps and available provenance artifact. Artifact metadata alone is not a content digest proof; audited assertions and exact current live-byte checks constrain that gap. Complete B public bytes and exact browser cache URLs are refreshed after CI polling immediately before publication.

The publisher packages exact UTC Git source, prevalidates both ZIP and checksum in a draft, preserves existing tag/assets and publishes stable with prerelease false. Existing mismatched/published assets are never overwritten; wrong tag bindings and races fail closed. All eleven workflows are required on final exact source before publication. Final live acceptance/publication must still actually occur after this R-stage review.

## Findings and rejected first candidate

SOL-V100-01 (Medium) is FIXED: initial publisher checked complete live bytes before a possible 20-minute CI wait. It now repeats the GET-only hash check after exact CI and deployment-run verification immediately before publishArchive. ZIP creation uses ignored dist/release and UTC to preserve strict clean-source checks. Independently inspected actual order and reran the CI contract.

R1's mandatory feedback and accuracy workflows failed because the old feedback browser test compared stable 4,969-character help against the raw 5,000-character dictionary. R2 changes only that test plus progress documentation. Independent diff confirms exact translated comparisons remain for every key, only the two length-related keys are version-aware; maxlength and actual request/database full-prefix/wire-version assertions are added. No runtime correction or skipped test hides this failure. R1 results do not substitute for fresh R2 CI.

## Explicit limits

Current full Cloudflare administrative settings, deployed Worker identity/bindings, private D1/Issue linkage and backend recovery remain incomplete. Physical phones/game hardware, OS IME/native screen readers, exhaustive language/contrast/mechanic combinations and long-session/process/GPU memory remain unverified. Backend/configuration bytes are unchanged. Existing declared partial/unsupported mechanics and data conflicts remain explicit, including unsupported Raging Bull screen breaking and unverified Champions hardware/data claims.

Prior bounded controlled-memory work supports no persistent retention among sampled retired objects; it does not certify a long-session plateau or eliminate positive residual heap growth. Fresh CI performance/memory evidence below is interpreted with the same bounds. Finite software references and Chromium emulation do not certify all physical-game behavior or real devices.

Local browser executable is absent: `npm run test:showdown` was attempted on R1 and failed to launch for that environmental reason. No local browser PASS is claimed. Browser conclusions require independently verified final CI evidence.

## Final exact-R2 execution, workflows and artifact provenance

Exact clean-R2 independent execution passed: release metadata, stable UI, strict transport/unchanged Worker with local SQLite, 4,520 complete numerical comparisons, stable CI contract, historical runtime reconstruction and mutation negatives, 19 deployment-proof cases, 14 publication cases, five full live-asset cases, binary Git blob framing/current-byte negatives, pending identity policy, cache missing/stale negatives, feedback consent freshness and 35 persistence schema/privacy cases. Additional original 300 contracts, continued 216 arithmetic +456 locked references +20 unaffected +six immunity witnesses, and Astra 3,600 historical comparisons +1,627 mechanic/arithmetic witnesses passed. Actual stable fixture independently passed 307 protected files and 42 real approval/acceptance child-contract runs; retained pre.2 fixture passed as well.

GitHub API independently confirmed latest stable artifact ID `14155017608` belongs to run `43697304182`, head R2, unexpired. Independently downloaded ZIP SHA-256 `7675f4bae5b44b53c9c93e4398d6854d8fad3d54cbae4e9d47622b20b3b44274` matches its API digest. All 76 manifest hashes match extracted bytes; all 42 current-site Git files match R2; all 31 notice-free rollback files match manifest and frozen legacy Git. Source archive is 395 files, 2,826,422 bytes, SHA-256 `49a45764f21d4130d50912877b418f7d5e11c73109a5c7b6d8ab72a1f5e22f0b`; every path/byte matches R2 and CRC is clean. Its actual CI merge comment is `d12aa4e00187c4dc9f7bcfc47c0e3f6749b4dd2d`. Independently verified that merge tree equals R2, and regenerated its UTC git archive byte for byte. Build is clean approval-required-preview, publicCutoverPerformed false. Runner actually passed 11/11 stable suites, zero exit failures. Browser evidence passed 18 nine-language attachment cases using unchanged Worker/SQLite, 36 local POSTs and 18 stored synthetic reports, zero production requests/mutations.

Fresh independent GET-only production-readiness attempt initially failed at an unclassified config-fetch exception. A separate subsequent config GET returned HTTP200 enabled production/90-day settings, and the complete original readiness gate subsequently passed 10/10. The failed attempt is retained; no product incident/cause was established. This demonstrates current anonymous safeguards within that read-only scope, not backend administrative completeness.

All eleven latest exact-R2 mandatory workflows subsequently completed successfully; I independently refreshed their job/step payloads after completion. The delayed original synchronize runs and later reopened runs share R2; the highest run ID per name below is used, matching the publication gate. No earlier R1 or lower-ID success substitutes for them.

| Required workflow | Latest R2 run |
| --- | --- |
| Showdown differential tests | 43697304237 |
| Showdown differential audit | 43697304178 |
| v0.184 engine baseline | 43697304186 |
| Damage Lab CI and status ledger | 43697304185 |
| UI & damage regression | 43697304273 |
| v0.185 anonymous feedback | 43697304198 |
| v0.186 Accuracy & Mechanics Audit | 43697304209 |
| v0.187 Singularity Migration | 43697304181 |
| GitHub Pages live smoke | 43697304253 |
| v0.188 Quality Remediation | 43697304319 |
| v1.0.0 Stable Promotion | 43697304182 |

Quality run required controlled-memory job `132760597987`, quality-candidate `132760598130` and performance `132760598141` all completed success with no skipped steps. Every important test/build/upload executed. Expected PR-only skips are publication job, status report job and UI verdict-posting step. Publisher run `43697304184` validated successfully but its actual publish job was skipped; green validation is not deployment/publication.

Independently downloaded quality artifact `14154749293`, ZIP SHA-256 `b5e11a2721ed64feb662668fb8a541adf8262e7642a0af4e715fa0aaa38cdff1`, matching exact-R2 API metadata. Actual quality runner passed 34/34 files with every exit zero. All 76 quality manifest hashes match extracted bytes and its complete artifact/rollback manifest equals the separately verified stable artifact. Retained evidence includes 54 locale/viewport cases, 18 continued locale/search cases, nine each automatic/manual Foul Play, manual-move, budget-rejection and Speed reload paths, full numerical cases, plus nine-locale synthetic IME/accessibility/consent/footer checks and preserved 90-transition regression.

I visually inspected the final Japanese 320px, Korean 390px and Traditional Chinese 1440px captures. Exact stable version and localized scope/caveats remain present; Korean/full-language footer text is visible. The Japanese narrow damage caption wraps across lines as in the prior candidate; this is not a calculation failure. Screenshots and synthetic Chromium events do not certify every scroll/contrast state, OS IME, native AT or physical device.

Raw independent run/job/step evidence is saved alongside this report in `v1-sol-r2-ci-proof.json`; independent API artifact metadata and verification summaries are in `v1-sol-r2-artifact-proof.json` and `v1-sol-r2-quality-proof.json`. These were fetched independently rather than copied from the coordinator's PASS.

## Fresh performance interpretation

Independently downloaded latest quality-run performance artifact `14154633815`, ZIP SHA-256 `65c4e35148ba3f642dce082e347958b144b139c1b925b75bd46367a1908e9bc4`, matching exact-R2 API metadata. It records clean CI merge/tree. Independently recomputed medians from raw five contexts ×12 operations per version/profile (operations remain clustered within contexts):

| Median baseline → stable candidate | Desktop | Mobile 390px emulation |
| --- | --- | --- |
| Calculation to frame | 23.00 →25.10 ms | 100.85 →102.60 ms |
| Locale to frame | 57.70 →61.45 ms | 262.30 →266.40 ms |
| Uncontrolled post-operation JS heap | 7,755,828 →7,850,448 bytes | 7,972,000 →9,675,932 bytes |

Ranges overlap; no statistical significance or universal improvement is established. Mobile uses 4×CPU and shaped loopback networking, not a phone. Uncontrolled mobile heap increase remains visible and is not a controlled leak measurement. The separate public-performance observation at 09:07:15 UTC still observes immutable pre.1 using GET only, zero forms or mutations; CDN figures must not be compared directly with loopback candidate measurements.

## Fresh bounded controlled memory

Latest controlled-memory artifact `14154524655` ZIP SHA-256 `cf02dfc09a5b0143ed50e62b96abd846b3ded4c5ff150d8c93ec32a4a4deb2d1` independently matches API metadata and R2 head. Raw memory JSON SHA-256 is `8aa56bb10ff36aca8906411212541b92fb4a89068b4fe027664b6fde2de9c629`. Independently recomputed 12 completed contexts, 96 rounds and 13,248 probes all collected. All held/released calibration controls behave correctly; no aged sampled survivors, page errors, mutating requests or reported issues occur.

| Controlled post-GC metric, baseline → candidate | Desktop | Mobile emulation |
| --- | --- | --- |
| Median of three context heap medians | 4,797,418 →4,756,596 bytes | 4,846,636 →4,799,820 bytes |
| Median first-to-last growth over six measured rounds | 77,052 →25,588 bytes | 79,596 →25,728 bytes |

Within each version, document/node/connected/listener counts remain constant: baseline 1/10,947/2,260/262; candidate 1/10,953/2,263/263, consistent with three new metadata elements and retained existing freshness handler. Both retain 16 detached OPTION trees; exact retaining paths/identities are not proven by this protocol. Positive heap growth remains. The evidence supports no persistent retention detected among sampled retired objects within the bounded protocol; it does not certify a plateau or long-session leak-free behavior, and does not justify a new product memory fix.

## Promotion disposition

The engineering gate is conditionally passed for exact source `b5ea506af27487a05cc7fbdc11371ac47778b06a`, tree `1e4d0d54c2013b22db3e15db144f8998cab1adfd`. No confirmed unresolved High/Critical finding exists in this reviewed scope; the Medium timing issue was fixed and the real R1 CI failure corrected with fresh exact-R2 CI.

The recorded user publication delegation may now be bound honestly to this concrete reviewed source/report. Approved A and accepted B must preserve the reviewed protected inventory/bytes, obtain their own exact-source required CI, and complete actual target deployment/current public acceptance and immutable publication gates before any completion claim. Any protected-source change invalidates this review and requires renewed review. The known residual limits must accompany stable publication; conditional readiness does not convert them into passed scopes.
