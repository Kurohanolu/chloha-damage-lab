# ES-LA implementation evidence

This directory preserves technical acceptance for implementation commit `215e5a1a8af9e20591d077e6acfcabb234a53b7a`, tree `fa77eab91c520fc4e40f9d146b63c909f47d8c4f`. The records are not formal release approval. The enclosing documentation-only commit has its own CI; it does not replace these exact source bindings.

Start with the [test report](../../v110-es-la-test-report.md), [CI receipt](ci-acceptance.json), [Sol review](sol-independent-review.md) and [browser review](browser-acceptance-review.md). [retained-files.json](retained-files.json) records SHA-256 and size for every retained file except itself. Raw reports and reviewer records are copied without rewriting their original paths, hashes or checkpoint observations.

## Retained path mapping

The original workspace paths in review notes describe where verification occurred. They are not required to read this Git record. The final browser artifact is `14166918126` from [run 43727755993](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43727755993); its ZIP hash and all source/archive checks are in the browser receipt and test report.

| Original artifact or reviewer path | Retained location here |
|---|---|
| `v110-215-evidence/reports/v110/*.json` | Same JSON basename in this directory (11 reports) |
| `v110-215-evidence/reports/v110/*.png` | Same PNG basename (6 screenshots) |
| `v110-215-evidence/reports/v0188/{continued-state-browser,continued-locale-browser,ui-mobile}.json` | Same JSON basename (3 original-nine reports) |
| `browser-215-review.md` | [browser-acceptance-review.md](browser-acceptance-review.md) |
| `browser-215-receipt.json` | [browser-acceptance-receipt.json](browser-acceptance-receipt.json) |
| `browser-215-workflow-job.json` | [browser-workflow-job.json](browser-workflow-job.json) |
| `browser-cc5a-review.md` | [browser-cc5a-review.md](browser-cc5a-review.md), historical review containing the individual visual observations |
| `candidate215-performance/browser-performance.json` | [browser-performance.json](browser-performance.json) |
| `candidate215-performance/public-performance.json` | [public-performance.json](public-performance.json) |
| `candidate215-memory/memory.json` | [memory.json](memory.json) |
| `sol-review.md` | [sol-independent-review.md](sol-independent-review.md) |

The six current screenshots are byte-identical to those individually reviewed at the older `cc5a7576` checkpoint. Only those visual observations carry forward; its failed test verdict is historical and is superseded by the independently verified final runtime reports. Other older local artifacts referenced in the chronological Sol record are not retained here and are not used as substitutes for current acceptance. Final source ZIP bytes were compared against all 442 Git blobs; a duplicate of the source repository ZIP is intentionally not stored.

All data here is synthetic test output, source hashes, UI captures or public read-only observation. No raw feedback database, real submitted report, contact address or authentication material is retained.
