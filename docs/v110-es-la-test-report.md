# Singularity v1.1.0 — ES-LA test report

Status: INCOMPLETE — corrected candidate and final independent browser acceptance pending. No production publication authorized.

## Fixed references

- Stable baseline: `0b270c1452505268364659edd402209b00b28673`, tree `239c4cbd37aa6389f16dc81e7f9a861c09a723f2`.
- First PR head: `1536a29783f98652dc92b40273c94cd0ff075362`, tree `6f4c2839ad8ca9a2d9f39654f83475ef4ef75e96`.
- Initial CI synthetic merge: `f3332e2cc7bdf712c0cef9eede42e0a6062cf8b5`, same tree as the PR head. Results below apply to that checkpoint only.
- Review: [PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68).

## Initial observed results

The new [ES-LA run](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43720887105) executed all nine initial tests: seven passed and two failed. Its artifact SHA-256 is `f74ccfdd632e1166d019451fa3475f2d836732282676fb3acce8311e8fcf2763`; the downloaded bytes and checkout tree were verified.

Passed scopes included 4,520 complete numerical comparisons, 13 unchanged numerical/data files, source/provenance contracts, independent locale catalogs, unpublished packaging and publication rejection, ten-language local Worker/SQLite feedback and 60 viewport-language cases. The transition test completed 110 rotating changes, explicit ES/ES-LA routes and 12 reloads before its multi-hit fixture assertion failed. This partial result is not represented as a full test pass.

The existing nine-language UI workflow, engine baseline, Showdown comparisons, mechanics audit, feedback workflow and live Stable smoke all passed on the initial head. Local Worker API tests passed 17/17 without production submissions.

## Initial failures and corrections

| Failure | Cause | Correction |
|---|---|---|
| Regional native ability search | Water Absorb was requested while the selected species did not offer that ability | Select a matching registered species and verify availability before testing native typeahead |
| Dragon Darts numerical test | The test incorrectly required an aggregated multi-hit distribution to contain at least 16 distinct totals | Preserve strict single-hit 16-roll checks; validate full multi-hit distribution, probabilities and per-hit rolls |
| Migration browser feedback | Expected display version in a compatibility wire field | Independently check exact wire version, full visible version and stored description prefix |
| Historical Stable packaging | A node_modules directory symlink appeared as an untracked file | Use ignored real dependency directories with internal links; retain strict clean-tree check |
| Controlled memory startup | Old v0.188 fixed baseline conflicted with the new Stable comparison | Preserve the old release-line baseline; explicitly select immutable v1.0.0 for this candidate |
| Public performance observation | An unpublished candidate was incorrectly subjected to current-release cutover approval | Permit GET-only observation of the full immutable Stable manifest; reject changed manifests and any candidate cutover claim |

Expanded UI inventory and screenshot review also found actual ES-LA untranslated dynamic messages, an ambiguous truncated language selector, image-failure Japanese text and insufficient detail-panel contrast. These are tracked as product defects and require corrected-candidate verification, separate from the test-fixture fixes.

## Verification limits

Local browser execution is unavailable because the installed Chromium fails to create a platform socket. Browser results are from actual Chromium in GitHub Actions. Viewports emulate phones; no physical Android/iOS, native screen reader or OS IME certification is claimed. Feedback uses local Worker/SQLite and a mocked Turnstile provider; the production Worker has not been deployed. No real feedback report or public Issue was created.

Final acceptance must bind all successful workflow and job/step results, generated inventory, screenshot review and Sol's independent review to the corrected candidate. Prior passes cannot authorize a changed runtime.

## Corrected runtime checkpoint

Runtime checkpoint `cc5a7576e1e4043b3e94ccf865c4517f65331451`, tree `157f266eec35a896309847c9438e35a4e722aef9`, ran as synthetic merge `76d20a575287c0d7a04961dd3c283c0d8693088d` with the same tree. Twelve of thirteen workflows succeeded. The ES-LA suite executed all eleven tests: nine succeeded, while regional search and the new DOM text audit exposed two remaining test defects. A closed species-selection panel prevented Playwright from selecting the registered species; a raw-engine-ID detector incorrectly matched the Spanish phrase `Daño final/Vidaesfera`. The next test-only commit opens the existing panel and matches raw modifier identifiers only at the start of a trace line. Text failures are collected across all DOM witnesses and still cause a mandatory final failure.

The checkpoint's ES-LA artifact ZIP SHA-256 is `c9d169b045b03e423efee833b2f14b89eaba46740251a81eef223855138da559`. Passing scopes include 4,520 numerical comparisons, 19,413 legacy-renderer output comparisons, 453 dynamic/static witnesses, 1,664 source roundtrips, ten-language local feedback and all 60 viewport cases. Six ES-LA PNGs were visually reviewed. The mobile locale selector shows the complete regional name; 18 advanced-setting text measurements have contrast ratios 8.87–15.84; the feedback panel hides the fixed result bar and restores it after closing. These observations do not certify every UI contrast surface or a physical device.

The reproducible inventory contains 1,008 source/template sites, 76 dynamic witnesses, 33 selected result DOM labels and 166 warning/error sites. All inventoried UI wording is provisional authored/reused copy; it is not official terminology. Executed English/Japanese UI fallback gaps in this declared inventory are zero. Full DOM enumeration and arbitrary dynamic combinations remain outside this count.

## Performance and bounded memory observation

The subsequent test-only candidate `e7453c1eee5642c257499e03fad76906669a3487` completed twelve successful workflows and 10/11 new acceptance tests. Regional search passed 20 catalog queries and 14 browser cases. All eleven DOM samples ran, exposing two real reload-only warning defects: the selected-move quote retained an English label or mixed Japanese/English text. Its 110 rotating transitions, six explicit transitions, 70 numerical comparisons, 15 reloads and 60 viewport cases completed; the text failures correctly kept the candidate unaccepted. Artifact SHA-256: `a3e270876a2a8f6565c1ad46300c3ec61fecaca32a127886d6d7f6e324fdeb7d`.

The correction resolves the selected native control's canonical move ID through the existing game-data registry before rendering the ES-LA warning. It does not infer identity from a translated label or change calculation logic. Three reload witnesses now also require the correct independent ES-LA name for the actual selected ID. New static cases cover the English/mixed reload labels, variable power and the two different canonical moves sharing `Carámbano` across Spanish regions. Updated local checks pass 456 witnesses, 1,680 source roundtrips, 19,440 old-nine output comparisons and five explicit canonical warning cases; the current inventory is 1,011 provisional UI sites and 169 warning/error sites. Corrected browser/CI execution remains required.

The [checkpoint quality workflow](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43722836346) completed all three jobs. Independent review checked the downloaded performance artifact (`185e937b1ae89d10d8918ce1ef89cb6aff3c18e71627aef770e134022ab58673`) and controlled-memory artifact (`2bfb66dd0b469310a684bd2c5ea67142b839b5f58725525c2443fbf5c74f00b0`) against the exact candidate tree and immutable Stable baseline.

| Measured median | Stable | Candidate |
|---|---:|---:|
| Desktop calculation to frame | 32.7 ms | 33.4 ms |
| Desktop locale change to frame | 80.6 ms | 82.2 ms |
| Emulated mobile calculation to frame | 136.2 ms | 137.1 ms |
| Emulated mobile locale change to frame | 355.9 ms | 367.5 ms |

The candidate adds 330,952 decoded JavaScript bytes (about 30.3%). These measurements use controlled emulation and principally English/French switching; they do not establish ES-LA-specific performance or real mobile network behavior.

The memory protocol completed 12 isolated contexts, 96 nine-language rounds and 36 exact reloads with calibrated garbage collection. Measured DOM/listener counts remained constant within each context and aged sampled-object retention was zero. Candidate steady-state heap was about 309–328 KB above Stable. Both versions showed increasing retained backing storage across reloads; this evidence does not justify a leak-free claim. Long-duration and ES-LA-specific memory behavior remain unverified. Separately, the ES-LA source-recovery cache is tested with 6,000 variable inputs and is capped at 512 entries.

Public performance observation was GET-only against v1.0.0 Stable. No production feedback submission, configuration change or deployment occurred.
