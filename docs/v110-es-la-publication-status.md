# v1.1.0 publication execution — 2026-11-16 JST

The owner instructed **「公開作業まで進めてくれ」**. Publication work is authorized; no second approval is needed for the disclosed release scope. The owner subsequently selected **ES-LAの送信だけ停止して公開** after Cloudflare login returned 403. Publication now proceeds as `v1.1.0-pre.1` with ES-LA reporting paused and the original nine report locales preserved. No Cloudflare login retry is requested.

## Completed preparation

- Source checkpoint `73302401ca0d68914c7bac42a88a96f2af8444cc`: all 13 PR workflows completed successfully.
- Existing ES-LA implementation already preserves ten report locales locally, including `es-LA`; this is not evidence that production has those bytes.
- Added `supportedLocales` to the public Worker configuration, derived directly from its intake contract. No private report, configuration secret or administrator information is exposed.
- Added a read-only release preflight requirement for all ten locales for version 1.1.0. A missing capability list, nine-locale backend, or `es-419` in place of internal `es-LA` blocks publication. No production report is submitted to test compatibility.
- Local validation: Worker API 18/18, new production-readiness negatives, legacy production-readiness tests, ten-locale contract, Worker dry-run bundle, and 4,520 numeric comparisons passed. Independent Sol review: [readiness review](evidence/v110/sol-feedback-readiness-review.md).

## Confirmed blocker

Locked Wrangler reports `loggedIn:false`. No Cloudflare credential was supplied. A read-only GET of the production `/v1/config` returned HTTP 200, enabled production intake, and no `supportedLocales` declaration. This does not prove the exact deployed validator; it means ten-locale production support cannot currently be certified.

The earlier full-ten-language feedback gate is superseded by the explicit owner-selected pause: the production frontend blocks ES-LA submission with a visible notice and permits the original nine locales. The production Worker source is restored unchanged. The public preflight retains all existing authentication/CORS/retention checks; declaring ES-LA support remains required if the pause is ever removed. Existing v1.0.0 stays public. No Worker deployment, D1 migration, production report, tag, GitHub Release or frontend cutover was performed in this execution.

## Future restoration of ES-LA reporting

From the exact reviewed PR checkout, run `npm ci --prefix services/feedback --no-audit --no-fund`. Authenticate Wrangler to the account owning `chloha-private-feedback`, inspect its current version/bindings/secrets and record the rollback version before deployment. Deploy with `cd services/feedback && npx wrangler deploy`, preserving existing secrets and D1 data; no schema migration is required. Do not paste tokens into chat or commit them.

Then run `node scripts/feedback-production-check.cjs` at repository root and require all checks to pass. Finish the explicit v1.1.0 release identity, source/tree/report/owner-delegation binding, independent release review, exact-source CI, public-artifact deployment, current live-byte/browser checks and immutable tag/Release creation. The existing publication policy still correctly rejects the development manifest; no authorization flags were forged to bypass it.

## Current publication plan

The v1.1.0-pre.1 release policy binds the independent Sol-reviewed source and Git tree, report SHA-256, owner delegation and explicit feedback scope. Protected code/workflows/tests must remain byte-identical after review. Public deployment requires the ten-language CI gate in addition to existing regressions. Live acceptance and final Release publication retain complete public-file and exact browser-cache URL checks and deployment-run proof. No gate is satisfied by manually renaming old approval evidence. The prerelease label and incomplete terminology/native-device verification remain disclosed.

## Additional confirmed publication blocker

Updating `Kurohanolu/singularity/.github/workflows/deploy.yml` through the connected GitHub app returned HTTP 403 `Resource not accessible by integration`. The reviewed update adds mandatory ES-LA exact-source CI and is retained as `deployment/singularity-pages.yml`. The public workflow was not changed and no deployment was triggered. Owner publication authorization is present; the missing capability is the integration permission to write the public deployment workflow. No authentication or CI gate was weakened in response.

## Permission recovery

Owner updated GitHub access. The public repository workflow write succeeded. The deployment route now uses the same version-specific historical/current migration checks as source CI; the refreshed independent review and owner receipt bind this correction. Publication execution continues under existing authorization.
