# v0.185 Pre-Release 31 — publication readiness

The owner authorized proceeding through publication on 2026-11-14. PR #59 is the release candidate. This supersedes its original draft-only authorization boundary; it does not manufacture provider access, credentials or paid-plan consent.

## Ready in source

- Anonymous/private feedback UI, nine locales, reviewed optional calculation snapshots and authenticated moderation are implemented.
- The development head `01884ca3c2f37846e24adef09aaac4ca670ee80b` passed all five existing workflows, dedicated v0.185 CI and release validation.
- Public metadata, package metadata, release notes and runtime cache keys are prepared for v0.185 Pre-Release 31; internal calculation API stays v0.184.
- A read-only production gate blocks archive publication when intake is missing, in demo mode, unsafe, unavailable, or exposes admin routes. Its deterministic tests run in CI; real readiness is a separate actual-service check.
- Main/live Pages checks must include the deployed feedback controls and their native labels without generating a public report or bypassing Bot protection.

## Concrete blocker observed

The configured frontend API origin is empty; Worker intake is off, the D1 ID is all-zero, and Turnstile/Access configuration is empty. No Cloudflare API/account credential or Wrangler login is present in the workspace. The provider dashboard shows its sign-in screen. No suitable Cloudflare connector was found in the current plugin search. These observations establish **production connection pending**, not release completion.

Required operator work is listed in `docs/v0185-feedback-operations.md`. Use secure provider sign-in/secret entry, never paste passwords, Turnstile secrets or GitHub tokens into a public file or chat. A new account's agreement or paid plan needs explicit owner action.

## Final release gate

1. Complete the approved private backend setup and a synthetic real-service acceptance report/admin review.
2. Configure the approved HTTPS API origin and verify `node scripts/feedback-production-check.cjs` reports `ready: true`.
3. Verify all five existing workflows, v0.185 CI, release validation and current public-base smoke for the final PR head.
4. Merge with the verified head SHA only, then verify main CI, deployed HTML/assets/calculation/feedback labels, and the immutable release archive/checksum.
5. Report the actual live version and connection state. Do not publish a disconnected form as a completed feedback system.

Rollback: complete v0.184 Pre-Release 30 tree at `4444dce9e560026ee26c20e0677d182155aa19af`, with feedback intake disabled as necessary.
