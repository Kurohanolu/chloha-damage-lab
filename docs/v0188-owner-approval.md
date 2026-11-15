# v0.188 owner approval and resolved audit conditions

Recorded on 2026-11-15 (JST). Applies to Singularity v0.188 Pre-Release 1 and the reviewed implementation at `64adc9eea8927fc72dbcb8cc1d5402b4917dff78`, tree `543fd64c78e775352a858939534419dacdc4180b`.

## Explicit decision

The owner was asked: 「この性能差と未検証範囲を了承し、候補 `64adc9e` のmainマージ・公開を承認する？」

The owner replied: 「続行してくれブラザー」

This resolves the prior condition by explicit acceptance in context. The owner authorizes main merge, deployment to the existing Singularity Pages project, and publication of v0.188 Pre-Release 1 through the existing exact-commit CI and live-verification process. Existing repositories, Cloudflare resources, authentication and the old calculator remain protected.

## Preserved independent finding and scope

Terra's independent conclusion remains **CONDITIONAL PASS for candidate code readiness**, not an unconditional production, hardware or security certification. The original report is preserved unchanged at `docs/v0188-independent-reaudit.md`. For the publication gate, `auditStatus=passed` records acceptance of this conditional code-readiness finding after the owner's disposition; `auditOutcome=conditional-pass` preserves the actual audit result.

Accepted measurement: same-run four-times-CPU mobile emulation calculation-to-next-frame median73.5→89.6ms (+16.1ms, +21.9%); desktop18→23ms. Five contexts per profile, no prior pass threshold, not a real-phone guarantee. Sampled heap is not a controlled leak test.

Accepted verification limits: no physical smartphone or full screen-reader test; no complete all-gradient contrast/native-linguistic audit; no deployed Worker whole-byte identity, full Access administration-policy inspection, live Turnstile challenge or authenticated production replay. Existing read-only service evidence and local/CI tests are distinct. No new production feedback or Issue is authorized or needed for this release.

## Release procedure

1. Preserve every application/engine/Worker/fixture byte from the reviewed implementation; only approval evidence, release metadata and narrowly scoped release-observer lifecycle tests may change.
2. Require successful workflows for the exact approved branch SHA, including the v0.188 quality workflow. Synchronize the publishing repository's prepared deployment workflow so it also requires the v0.188 gate.
3. Deploy that approved clean SHA with `liveTargetVerified=false`. Verify the actual new URL with the existing new-target read-only checker and retain both the old site and the v0.187 rollback source `7210be99c39d75b49ea8200aad91d75801eb300a`.
4. Set `liveTargetVerified=true` only after the first real acceptance. Re-run exact-SHA CI, re-deploy the final metadata tree, and require the full dual-site byte/cache checks plus production feedback readiness.
5. Merge the verified PR without source-tree changes. Require main's exact-SHA CI and verified release publication; inspect tag, ZIP digest, live files, locale/reload behavior and old URL before reporting completion.

No gate is waived by this approval. Actual rollout, CI and release identifiers are recorded in PR #66 as they become available. If any required check fails, fix or roll back using the retained known-good source; do not report publication complete prematurely.
