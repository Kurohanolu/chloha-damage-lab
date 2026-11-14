# v0.185 Pre-Release 31 — publication readiness

The owner authorized merge/publication and zero-incremental-cost operation on 2026-11-14. PR #59 is the candidate. Existing D1, Worker, Turnstile and Access resources are reused; no repeated enrollment, resource creation, credential sharing or protection disablement is needed.

## Verified production connection

- The owner registered the repository-restricted `GITHUB_TOKEN` directly; the provider confirms all four expected secret names without exposing values.
- The deployed Worker has the existing dedicated DB, real Access issuer/AUD, owner-only allowlist and `INTAKE_ENABLED=true`. Previews and application logging remain disabled.
- The real read-only production gate passes all ten checks, including exact-origin CORS, no-store caching, production Turnstile configuration, denied anonymous admin access and no public report listing.
- Nine actual negative-input cases reject malformed/unknown/oversized/script-category/PII-snapshot/media-type/origin/invalid-Turnstile requests; no report was stored.
- The owner completed an encrypted Access transfer. Work verified the real application JWT signature, issuer, audience, owner and expiry, then successfully read the private API. Credential values and org tokens are not published or used as a substitute for authorization.
- Actual admin CSRF checks deny missing/foreign Origin. A platform Assets `/index.html` canonical redirect was detected with the authenticated session, reproduced in tests, and fixed by requesting the canonical asset root while retaining the outer protected admin path. The handler continues to authenticate every HTML/asset request.
- Local API/security tests now cover 15 cases, including that platform redirect regression. All 300 frozen full calculation outputs remain identical.

## Candidate and CI

The last verified source head `4d57520ca7618c7ad1d2a96051012b2d56726c79` passed all five existing workflows, dedicated v0.185 CI, release validation and current-public-base smoke. The subsequent intake/Assets fix must receive its own exact-head CI before merge. PR smoke checks the public base; its release publish job is skipped.

Release metadata, nine-language UI, optional reviewed snapshots, immutable package/cache keys and internal v0.184 calculation API are prepared. Main/public Pages are still v0.184 Pre-Release 30 until the authorized candidate deployment.

## Final deployment and acceptance

1. Verify final PR head CI: all five required workflows plus v0.185 and release validation/current-base smoke must be completed/success.
2. Merge only that expected head, then directly verify main CI and deployed HTML/assets/calculation/feedback labels.
3. Immediately exercise successful synthetic delivery with the real Turnstile widget on the approved Pages origin, then authenticated review/status/approved technical-summary Issue creation and duplicate prevention. The widget hostname stays restricted; this successful form round trip requires the candidate to be deployed on that origin. Read-only readiness and mocks do not establish delivery or GitHub write permission.
4. Verify the actual prerelease tag/archive/checksum targets the successful merge commit. Report publication complete only after the real-service round trip and deployed-content/main-CI checks finish.
5. On failure, retain client drafts, report the actual error, fix and reverify; use the approved rollback if required. Never show false success or disable tests.

A synthetic production report is retained for audit and normal expiry; do not permanently delete production data merely to clean up a verification run. No paid-plan or subscription change is authorized.

Rollback: complete v0.184 Pre-Release 30 tree at `4444dce9e560026ee26c20e0677d182155aa19af`, with feedback intake disabled as necessary.
