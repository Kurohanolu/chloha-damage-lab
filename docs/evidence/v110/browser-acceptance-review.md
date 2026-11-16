# ES-LA browser acceptance — 215e5a1

Reviewed 2026-11-15. The assigned browser acceptance is successful for this candidate. Formal release remains the owner's decision.

- Head: `215e5a1a8af9e20591d077e6acfcabb234a53b7a`
- Matching source tree: `fa77eab91c520fc4e40f9d146b63c909f47d8c4f`
- CI checkout: `7fbfd7d904d27629bfa8a5df28cb61a40b4b54d7` (synthetic PR merge)
- Workflow: <https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755993>
- Job `132853300602`: success, all 19 steps successful

## Verified results

All 11 new acceptance test files pass. The browser recorded 110 rotating language transitions, 6 explicit regional transitions, 70 complete numerical comparisons, 15 reloads and all 11 sampled dynamic DOM scenarios with zero text failures. Canonical calculation/input equality assertions remained active throughout.

The three reload warning quotes now match their selected canonical IDs:

| Selected ID | Quoted ES-LA name | Result |
| --- | --- | --- |
| `earthquake` | Terremoto | Pass |
| `gw0169_p077` | Dracoflechas | Pass |
| `electroBall` | Electrobola | Pass |

Their quoted type/power/status text also passes the Spanish witness and English/Japanese leakage checks. The previously reported mixed-language initialization failures are resolved in this CI execution. Conditional damage, complete multi-hit distribution, KO, history estimate/mismatch warning, language switching and reload scenarios all reach their assertions.

Regional search passes 20 catalog alias queries and 14 browser cases. Ten-language feedback passes, including validation, consent, retries and canonical calculator parity. UI checks pass all 60 locale/viewport combinations. The separate dynamic renderer test passes 456 witnesses, 420 regional cases, 1680 roundtrips, 19440 legacy comparisons and 5 selected-warning identity cases. Engine comparison passes 4520 full output comparisons and all 13 protected-file checks.

The same workflow also passes the preserved nine-language 90-transition test, state restoration tests, 18 locale/viewport keyboard tests, 54 legacy mobile cases, 17 local Worker tests, and unpublished site/source packaging. No deployment was performed.

## Visual review

All six final PNGs are byte-identical to the individually reviewed images in `browser-cc5a-review.md`, confirmed with SHA256. The full language label is visible at 320/390 widths; advanced groups use readable dark surfaces; the sampled headings, stat labels and unavailable-sprite message are Spanish; the feedback form is not covered by the fixed damage bar. The 18 advanced-group text contrast measurements range from 8.87 to 15.84. The feedback tests additionally check email/submit hit targets after scrolling and restoration of the result bar when closing the form.

This review does not claim all compact native option labels fit at rest, full accessibility certification, or physical-device behavior. The fixed components shown inside stitched full-page images are positioned according to the captured scroll state.

## Evidence integrity and preservation

Early artifact `14166704773` is 1,753,797 bytes; verified SHA256 `6b4b8d9297e3334543f7b937122e5faaafe0438f47b8d12fba3393842e2f91e2`.

Full artifact `14166918126` is 7,346,143 bytes; verified SHA256 `24644102d55c6fbf7e5620672cebaa7c9286ea1aba13482982d92dfaf2a77a10`.

The final 11 new JSON reports and 6 PNGs match their early-artifact copies byte for byte. The source ZIP SHA256 is `6b98743884d6fa3b687d5bc03b24c787ebc1b753d0c40e7e850f21da8721d718`; its embedded checksum matches, and every one of its 442 Git blobs matches the reviewed head. Preserve only the receipt/digests and reports in the repository; the duplicate source ZIP is unnecessary.

Downloaded files:

- Full ZIP: `/workspace/scratch/8de3f6ca2399/v110-215-evidence.zip`
- Full extraction: `/workspace/scratch/8de3f6ca2399/v110-215-evidence/`
- Early extraction: `/workspace/scratch/8de3f6ca2399/v110-215-early-evidence/`
- Machine-readable receipt and exact safe report list: `/workspace/scratch/8de3f6ca2399/browser-215-receipt.json`
- Exact job/step conclusions: `/workspace/scratch/8de3f6ca2399/browser-215-workflow-job.json`

The 20 listed preservable report files contain canonical IDs, hashes, rendered test UI and non-personal test summaries. They include no raw Worker database, contact addresses, authentication material or request headers.

## Remaining limits

These results use local Chromium emulation in CI. Physical Android/iOS, native screen readers/IME, professional Spanish review, Champions hardware verification, exhaustive index.html template parsing and every dynamic battle combination remain unverified. Translation provenance/coverage and owner release approval remain separate conditions; this report does not promote provisional or fallback terms to official translations.
