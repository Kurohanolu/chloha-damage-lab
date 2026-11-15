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
