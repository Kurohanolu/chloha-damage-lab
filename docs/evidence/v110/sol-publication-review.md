# 6.1 Sol publication review — v1.1.0-pre.1

Reviewer: 6.1 Sol. Outcome: **conditional-pass**.
Reviewed source commit: `3a39482a149809b8a827017b06ca8d980b343081`.
Reviewed tree: `6fbe427aa6402d08db3f6beb4f116e6ae226cbfc`.
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
