# 6.1 Sol publication review — v1.1.0-pre.1

Reviewer: 6.1 Sol. Outcome: **conditional-pass**.
Current reviewed source commit: `4760cd59503b2ff46a502e83420cf2111412ada3`.
Original reviewed source commit: `3a39482a149809b8a827017b06ca8d980b343081`.
Current reviewed tree: `8122cda5bda8ddaf3bdf991bab766aefb8f6d05b`.
Original reviewed tree: `6fbe427aa6402d08db3f6beb4f116e6ae226cbfc`.
Release tag: `v1.1.0-pre.1` (public prerelease, not Stable).
ES-LA source-record SHA-256: `d97ee7339ab128ec669cf22f0d8705f07c59f3a8a7a3f45f858f9b762b42a427`.

## Findings and publication conditions

No blocking correctness or security defect found in the reviewed source. This review includes the prior ES-LA implementation and owner-capture evidence handling, plus the publication follow-up since `7163c1c`.

The owner-selected policy is to pause ES-LA report submission while retaining the other nine report languages. The production config disables exactly `es-LA` and displays an explicit Spanish notice. Fieldset, submit handler, connection and widget guards cover opening directly in ES-LA and switching into it. Returning to an enabled language restores availability without discarding the draft. This is a product-level reporting pause, not a new server security boundary. The Worker deployment is unchanged by this publication follow-up; no unavailable Cloudflare deployment is presumed.

The publication binding verifies the reviewed Git tree, exact protected source inventory and bytes, report hash, explicit reviewer and tag, owner decision and permitted publication actions. Only review/owner/live-acceptance metadata and documentation may differ after review. The approval test fixture passed, and 13 independent negative mutations were rejected: altered release payload, tree, report digest/content, owner status, auditor, timezone, unsafe evidence path, premature acceptance field, owner policy/actions/tree, and protected source bytes. Temporary fixtures were removed; no real owner approval was fabricated or retained.

Publication and deployment explicitly require the ES-LA workflow for this tag. The acceptance extension retains exact asset and cache-URL checking, deployment-run provenance and the pinned v1.0.0 rollback source `0b270c1452505268364659edd402209b00b28673`. Pending review metadata cannot authorize cutover. Final Release publication additionally requires actual live acceptance; this report alone does not establish deployed bytes.

Conditions for publication are: owner acceptance of the ES-LA reporting pause and remaining translation limitations; successful exact-source CI including the browser pause/locale/mobile coverage; and the existing production-readiness, deployment-provenance and live-byte gates before final Release publication. The frontend may be deployed under approved cutover metadata to obtain live acceptance; final Release publication must remain gated on that acceptance. Enabling ES-LA reporting later requires verified backend locale support and a separately reviewed config change.

## Local verification

Passed locally:

- v1.1.0 feedback readiness, artifact contract, release identity, owner-capture contract, source contract, locale contract and generated-coverage byte check.
- Numeric equivalence: 4,520 complete-output comparisons, 13 protected calculation files.
- Approval-binding positive fixture and 13 mutation negatives described above.
- Deployment proof: 19 mocked provenance/current-attempt cases.
- Immutable release publication: 14 mocked lifecycle cases, including tag races, retries and failure isolation.
- Existing feedback production gate negative cases; all checks remain read-only.

The new feedback-pause browser test was attempted but Chromium headless-shell revision 1208 is absent locally. No local browser pass is claimed. Exact-source CI results must supply that evidence. No production report, credential, deployment, tag or Release was created by this review.

## Evidence limits

Original owner screenshots are absent in this review. Earlier independent visual transcription remains attributed to its recorded inspection; this review checks its repository consistency and canonical/provenance contracts, not the original pixels. Owner-attested ES-LA locale is not an observed settings screen. Name evidence does not validate physical-device mechanics or complete translation coverage. Prior review findings on canonical IDs, deduplication, off-runtime exclusions, nickname-capable species and provisional UI remain applicable.

## Supplemental review — corrected gate fixtures

Reviewer: **6.1 Sol**. Release tag: `v1.1.0-pre.1`. Outcome remains **conditional-pass**, with the publication conditions and limitations above unchanged.

Updated reviewed source commit: `bd5c9fc1fd4b1c183a82f8b9d32cafb88982c8c6`.
Updated reviewed tree: `a6d70bd0f0bd3512db694c054559ad15e39dc17c`.
ES-LA source-record SHA-256 remains `d97ee7339ab128ec669cf22f0d8705f07c59f3a8a7a3f45f858f9b762b42a427`.

The source coordinator supplied the remote commit above; the independently inspected local candidate `3b20d6e8fa33f3bb6360eb2e62536cb8b41e60da` has exactly the reviewed tree above. Compared with the original reviewed source, only two protected lines change: the synthetic workflow lists in `tests/v0186-release-gate.cjs` and `tests/v0187-deployment-gate.cjs` now include the required ES-LA workflow for this tag. These changes make complete mock CI fixtures reflect the already-reviewed production gates; they do not weaken the gates, change runtime behavior or modify deployment workflows. Additional differences are review/owner-decision documentation; the release manifest remains pending and cannot publish without fresh approval bound to this updated source and report digest. Earlier approval evidence remains historical.

Independently reran both corrected gate tests and `tests/v110-release-identity.cjs`: all passed. Missing/failed/stale workflow fixtures remain rejected, and complete exact-head fixtures reach their intended publication boundary without real mutations. No new blocking finding. This supplement does not claim a new local browser run or successful remote CI/deployment.

## Supplemental review — fieldset browser assertion

Reviewer: **6.1 Sol**. Tag: `v1.1.0-pre.1`. Current source: `209a6e09af743b8f6981c8bfa7e8209a0bc790a5`. Current tree: `824ad4e379a887a312a9891fde2a741d1ab7201f`. Outcome remains **conditional-pass** under the same conditions above.

Independently resolved the remote commit's Git tree and confirmed it matches the inspected local candidate `7a2c0cf1e6753fdb5ecdf42c208c6b6bdd750db3`. The only change since the previous reviewed candidate is in `tests/v110-feedback-pause-browser.cjs`: it checks the native fieldset `disabled` property, checks a descendant textarea through Playwright `isDisabled()`, and checks the native fieldset property becomes false after restoring an enabled language. This checks both the control state and its practical descendant effect. It preserves visible-notice, submit guard, zero-POST, locale restoration and retained-draft assertions. No runtime, backend, publication policy or workflow changes are present. No new blocking finding.

Locally passed syntax validation plus the release gate, deployment gate and release-identity checks. The corrected browser test has not passed locally; exact-source CI/browser success remains an explicit publication condition. Prior CI failure described by the coordinator is not treated as a passing result, and this supplement does not attest an unobserved CI outcome. Previous approval records must not authorize this changed tree; fresh approval must bind the current source/tree and updated report digest.

## Supplemental review — deployment migration contract routing

Reviewer: **6.1 Sol**. Tag: `v1.1.0-pre.1`. Current reviewed source: `4760cd59503b2ff46a502e83420cf2111412ada3`. Current reviewed tree: `8122cda5bda8ddaf3bdf991bab766aefb8f6d05b`. Outcome remains **conditional-pass**, with all publication conditions above retained.

Independently resolved the remote source tree and confirmed it matches the inspected local candidate `541a2d2a715b53234d7219783e148ba1501f0e47`. The sole protected source difference since the previous reviewed candidate changes the migration-contract step in `deployment/singularity-pages.yml`. For the exact `v1.1.0-pre.1` tag, it now runs the pinned historical migration contract plus the current v1.1.0 artifact contract, matching the source CI's existing division. Other tags retain the original migration contract. The historical helper pins both the immutable v1.0.0 commit and tree, labels its evidence historical, and rejects failed historical tests. The current artifact contract separately verifies the candidate. Approval, exact-source CI, live-readiness and artifact-generation checks remain in place. No runtime, feedback policy or backend change is present. No blocking finding.

Independently ran the historical migration suite, current v1.1.0 artifact contract, target deployment gate and release gate: all four passed. Earlier successful CI/browser results on a prior head are historical context, not proof that this changed workflow has passed exact-source deployment. The current source must still satisfy exact-source CI, fresh digest-bound owner approval, production checks, real deployment provenance and final live acceptance before final Release publication. No deployment or browser success is newly attested by this supplement.
