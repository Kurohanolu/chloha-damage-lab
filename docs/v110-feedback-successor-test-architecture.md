# Feedback successor test architecture (preparation only)

This is an additive design, not a release approval. PR #80's observed browser
passes do not resolve its runtime identity or inherited approval failures.
No previous report or receipt may be relabelled pre.10.

## What is executable now

`tests/v110-feedback-worker-scope.cjs` pins the published pre.9 source commit
`46f930797e662be0d01e974f98ddde6de7b414c0` and tree
`1ea3163c8a8f4de8d68951b28c061a855461468c` as its immutable baseline.
It permits exactly one Worker expression change: adding supportedLocales from
the validator's own C.locales to the existing public configuration response.
It freezes all other production service files/inventory, root-level shared
validator `feedback-contract-v0185.js`, and production pause. A negative mutation
proves that changing accepted locales in that shared validator is rejected.
Negative checks reject absent/fabricated capability exports and further Worker
changes. The original batch-6 contract is also checked byte-for-byte unchanged.
This new test supplements, never replaces, Worker security/unit/browser tests.

## Successor release integration, after pre.9 publication is verified

1. Pin actual published pre.9 commit AND tree from the successful publisher.
   Reject a moving main ref, arbitrary SHA, unverified tag, or candidate-only ref.
2. Preserve original pre.9 batch-6 contract in its exact historical tree. Run it
   there using the existing detached-worktree historical test pattern. Record
   historical role explicitly and propagate subprocess failure. Do not delete
   its Worker equality assertion or report historical success as current success.
3. Add mandatory current-candidate guards alongside historical dispatch:
   - Narrow Worker delta above (repinned to actual published predecessor).
   - Full protected source/data/engine/nine-language equality against predecessor.
   - All current capability, security, ten-language, mobile, pause, calculation,
     privacy/admin and interrupted/repeated flow tests.
   - A missing successor guard must fail aggregate inventory validation.
4. Introduce pre.10 explicit identity and lifecycle policies consistently in
   release validator, publication validator, binding helper, baseline selector,
   observer and CI identity lists. Keep previous policies unchanged.
5. Reset review, owner and live acceptance fields to pending/false; regenerate
   final content identity only after runtime changes are fixed. New protected
   inventory must receive a new exact-source/tree independent review.

## Approval and enablement are separate from test compatibility

For preparation with production pause preserved, existing semantic pause policy
can remain, but a new pre.10 receipt still must bind its own source and report.
Actual enabling requires an explicit successor feedback policy tied to backend
verification evidence, not a broad optional field or acceptance of any string.
The owner restoration request must be faithfully recorded; no invented approval.

Negative approval tests must reject: old receipt retagging; mixed reviewed source
and tree; stale protected inventory; copied audit hash; unsupported policy; live
flag without evidence; enabling receipt without exact backend version/config
and security evidence; moving predecessor; production UI removing pause without
matching enablement evidence. Backend /config alone is not proof of report intake.

Deploy backend through existing authorized path preserving secrets, bindings,
vars, assets and rollback version. Verify capabilities and security first. Then
validate/approve frontend enablement for its exact source. A real synthetic
submission uses covered consent and real Turnstile, contains no personal payload,
creates no public Issue, and must yield a verified private receipt. Stop on 403.

## Current non-actions

The pre.10 preparation now includes historical dispatch and pending release identity.
Production config, pause, deployment and all accepted historical approvals are unchanged.
New review, owner receipt and live acceptance remain pending; no historical receipt
is reused. The restored-capability UI remains behind the explicit production pause.
