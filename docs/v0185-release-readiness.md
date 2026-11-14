# v0.185 Pre-Release 31 — publication readiness

The owner authorized proceeding through publication on 2026-11-14. PR #59 is the release candidate. This supersedes its original draft-only authorization boundary; it does not manufacture provider access, credentials or paid-plan consent.

## Ready in source

- Anonymous/private feedback UI, nine locales, reviewed optional calculation snapshots and authenticated moderation are implemented.
- The resource-review head `8e5fcfbc3c6c718f604105b5ed70d41ce6aa7b53` passed all five existing workflows, dedicated v0.185 CI, release validation and the current-public-base smoke. Any subsequent commit must receive its own exact-head CI verification.
- Public metadata, package metadata, release notes and runtime cache keys are prepared for v0.185 Pre-Release 31; internal calculation API stays v0.184.
- A read-only production gate blocks archive publication when intake is missing, in demo mode, unsafe, unavailable, or exposes admin routes. Its deterministic tests run in CI; real readiness is a separate actual-service check.
- Main/live Pages checks must include the deployed feedback controls and their native labels without generating a public report or bypassing Bot protection.

## Concrete blocker observed

The frontend API origin is empty, Worker intake and public routes are off, and Access issuer/AUD and the GitHub secret remain unconfigured. The D1 ID and public Turnstile key now refer to actual dedicated resources. These observations establish **owner setup and production connection pending**, not release completion.

Wrangler authentication has now succeeded. The owner already approved its account/user-read, Workers-script, D1 and Turnstile scopes; authenticated `whoami` and read-only API calls verified access to one account. Do not request the same scope approval again. Earlier background attempts encountered execution-policy denials, but fresh endpoint checks succeeded and the foreground device flow completed. The exact earlier failure cause is not established.

The owner subsequently approved the concrete production resources, APAC placement and completing v0.185 publication within Free allowances and zero incremental cost. The dedicated D1, Worker, Workers namespace and Turnstile are created; the DB migration and three secrets are registered. Provider reads verified routing disabled, intake disabled, expected bindings, Cron and zero reports. The remaining owner steps are in `docs/v0185-feedback-owner-setup.md`: Zero Trust Free enrollment, an owner-only Access application covering the two admin paths, and direct registration of the Issues-only GitHub token. No paid-plan or subscription change has been made. Do not request already-received scope, resource or publication approvals again.

Required operator work is listed in `docs/v0185-feedback-operations.md`. Use secure provider sign-in/secret entry, never paste passwords, Turnstile secrets or GitHub tokens into a public file or chat. A new account's agreement or paid plan needs explicit owner action.

## Final release gate

1. Complete the approved private backend setup and a synthetic real-service acceptance report/admin review.
2. Configure the approved HTTPS API origin and verify `node scripts/feedback-production-check.cjs` reports `ready: true`.
3. Verify all five existing workflows, v0.185 CI, release validation and current public-base smoke for the final PR head.
4. Merge with the verified head SHA only, then verify main CI, deployed HTML/assets/calculation/feedback labels, and the immutable release archive/checksum.
5. Report the actual live version and connection state. Do not publish a disconnected form as a completed feedback system.

Rollback: complete v0.184 Pre-Release 30 tree at `4444dce9e560026ee26c20e0677d182155aa19af`, with feedback intake disabled as necessary.
