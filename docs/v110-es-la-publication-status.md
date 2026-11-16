# v1.1.0 publication execution — 2026-11-16 JST

## Pre-Release 2 public acceptance

The owner explicitly requested the next prerelease be published. The fresh candidate is `95e61b419f7e348fe5ec59b4355692bf81f335a6`, tree `85cbdbd46d4d76086f7e739a67960cff9ba62816`: **13/13 CI workflows and 18/18 ES-LA acceptance tests passed**. [Current CI receipt](evidence/v110-pre2/candidate-ci-receipt.json), [independent review](evidence/v110-pre2/sol-publication-review.md), and [owner decision](v110-pre2-owner-publication-decision.md) are specific to `v1.1.0-pre.2`.

The target deployment workflow enforces the explicit pre.2 contracts. Fresh Sol conditional-pass and the owner decision bind the candidate and report hash. Approved source `127b1da04765fc2e0b3a873a64ac22892ae3ccf5`, tree `af5bdaa8a537ee751a1eb31d95d26dca5da3056a`, passed its own **13/13 workflows**, then [deployed successfully](https://github.com/Kurohanolu/singularity/actions/runs/43791451633). [Approved-source CI](evidence/v110-pre2/approved-a-ci-receipt.json), [artifact checks](evidence/v110-pre2/approved-a-artifact-receipt.json), and [deployment provenance](evidence/v110-pre2/approved-a-deployment-verification.json) are retained.

[Actual live acceptance](evidence/v110-pre2/live-acceptance-receipt.json) and [all observations](evidence/v110-pre2/live-public-assets.json) prove **79 files / 228 GET requests matched**, including bare and browser cache-key URLs; production mutations: zero. Cloud Chrome [UI observations](evidence/v110-pre2/live-browser.json) confirm the Pre-Release 2 label, all ten language displays, unchanged 108–128 damage / 61.7–73.1%, persisted settings after reload, disabled ES-LA reporting and restored English form fields. [Public screenshot](evidence/v110-pre2/live-public-screen.jpg). No report was submitted.

This acceptance promotion changes only release metadata and documentation. Its own source CI and deployment must succeed before main integration. The main publisher then independently checks exact-main CI, complete public bytes and successful A deployment provenance before creating the new immutable tag and GitHub prerelease. The public UI is already Pre-Release 2; the automated publisher is authoritative for final tag/Release completion. The prior pre.1 records below remain historical and immutable. ES-LA feedback remains paused; the production Worker and original screenshots are unchanged.

## Historical Pre-Release 1 execution

The owner authorized public publication and selected **ES-LAの送信だけ停止して公開** after Cloudflare login returned 403. The public prerelease is `v1.1.0-pre.1`: ten-language calculation, search and display; ES-LA feedback temporarily paused; the original nine report locales preserved. The production Worker and database are unchanged. Original game screenshots remain private.

## Completed public acceptance

- Reviewed source `4760cd59503b2ff46a502e83420cf2111412ada3`, tree `8122cda5bda8ddaf3bdf991bab766aefb8f6d05b`; independent 6.1 Sol conditional-pass and accepted owner conditions remain bound by the unchanged review digest and decision receipt.
- Approved deployment source `f161866096baa2964489ece5fd912ab37db20b1e`, tree `b32d3875c6c437ba109b0aee2cc469922d0ad262`: all 13 PR workflows passed.
- The GitHub workflow-write permission issue was resolved by the owner. The target workflow includes exact-source ES-LA CI and version-specific migration contracts; no gate was bypassed.
- [Actual public deployment](https://github.com/Kurohanolu/singularity/actions/runs/43777582461) completed successfully.
- [Live receipt](evidence/v110/live-acceptance-receipt.json): all 79 new/legacy public files matched, including 228 bare, cache-busted and exact browser-cache URLs. The check was GET-only and made zero production mutations.
- Live Chrome UI confirmed the v1.1.0 Pre-Release 1 label, ES-LA type/result display, unchanged 108–128 example damage, persistence after reload, visible ES-LA feedback pause and disabled fields, and restoration of editable feedback fields after switching to English. No feedback report was submitted. [Live screenshot](evidence/v110/live-es-la-calculation.jpg).
- Production read-only preflight passed: enabled intake, production Turnstile key configuration, 90-day retention, exact-origin CORS, no-store, denied anonymous administrator access, and no public report listing.

## Candidate verification evidence

The early [ES-LA artifact](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43776815550/artifacts/14186289724) has SHA-256 `6e776a050be999c491a1369f7dad2e7c7804bbf7b06995f25c58a77783e3bee3`, independently matched to GitHub metadata. Its expected PR merge commit `d4f6fb162fc7d0547a16dfdbba777cd5aa3a4a8d` has exactly the approved A tree, with no uncommitted changes.

- New candidate tests: 14/14 passed.
- Numerical comparison: 4,520 completed; zero unexplained differences.
- Ten-language switching: 110 transitions and 15 reloads passed.
- Mobile: 10 locales × 6 widths, 60 cases passed.
- Feedback pause: zero POST requests, restored form on locale switch, draft preserved.
- Existing nine-language regression, state/mobile checks, controlled memory and comparative performance all completed in the 13 successful workflows.

## Final publication boundary

This metadata-only acceptance promotion adds the live receipt and its four release-manifest bindings. Reviewed runtime, engine, dictionaries, tests and workflows remain byte-identical. Before merge, the promoted candidate must pass its own CI and be deployed, and its current public bytes must match. The main publisher separately requires exact-main CI, current complete public hashes and the successful deployment provenance before creating the immutable tag and GitHub prerelease. Those final promotion steps are not claimed complete by this receipt.

## Scope and deferred feedback restoration

Coverage retains incomplete official terminology and physical-device/native-language limitations. Registered official Champions counts rose from 81 to 112, and unverified registered names fell from 761 to 739; overlapping forms are excluded from these aggregate counts. Individual categories are in the capture audit and generated coverage report.

ES-LA feedback restoration remains separate: authenticate to the existing Cloudflare account, inspect and record the current Worker version/bindings/secrets, deploy the reviewed ten-locale validator without schema changes, then require the public capability declaration before removing the frontend pause. No credential is requested in chat and no Cloudflare login retry is required for this publication.
