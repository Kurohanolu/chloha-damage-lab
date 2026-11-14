# v0.185 Pre-Release 31 — publication readiness

The owner authorized proceeding through publication on 2026-11-14. PR #59 is the release candidate. This supersedes its original draft-only authorization boundary; it does not manufacture provider access, credentials or paid-plan consent.

## Ready in source

- Anonymous/private feedback UI, nine locales, reviewed optional calculation snapshots and authenticated moderation are implemented.
- The provisioned-resource head `48ebb73cb43dc238b7ab9fd3933accfc1cfdc839` passed all five existing workflows, dedicated v0.185 CI, release validation and the current-public-base smoke. Any subsequent commit must receive its own exact-head CI verification.
- Public metadata, package metadata, release notes and runtime cache keys are prepared for v0.185 Pre-Release 31; internal calculation API stays v0.184.
- A read-only production gate blocks archive publication when intake is missing, in demo mode, unsafe, unavailable, or exposes admin routes. Its deterministic tests run in CI; real readiness is a separate actual-service check.
- Main/live Pages checks must include the deployed feedback controls and their native labels without generating a public report or bypassing Bot protection.

## Concrete blocker observed

The candidate frontend now uses the actual HTTPS API origin. The existing Access application's real issuer/AUD are configured in the deployed Worker, and three admin paths redirect to that application without exposing content. Intake remains off and `GITHUB_TOKEN` is absent. The real-service readiness check therefore correctly blocks publication. These observations establish **remaining secret and authenticated acceptance pending**, not release completion.

Wrangler authentication has now succeeded. The owner already approved its account/user-read, Workers-script, D1 and Turnstile scopes; authenticated `whoami` and read-only API calls verified access to one account. Do not request the same scope approval again. Earlier background attempts encountered execution-policy denials, but fresh endpoint checks succeeded and the foreground device flow completed. The exact earlier failure cause is not established.

The owner subsequently approved the concrete production resources, APAC placement and completing v0.185 publication within Free allowances and zero incremental cost. The dedicated D1, Worker, Workers namespace and Turnstile are created; the DB migration and three secrets are registered. The dedicated workers.dev URL is now active with previews disabled and intake stopped. The existing Access application was reused; no additional application, Worker or database was created. Direct registration of the Issues-only GitHub token remains necessary; see `docs/v0185-feedback-owner-setup.md`. No paid-plan or subscription change has been made. Do not request already-received scope, resource or publication approvals again.

Cloud Browser dashboard sign-in returned HTTP 403, while Wrangler/API deployment continues to work. The Access page currently offers Cloudflare login only; real owner sign-in, moderation and approved Issue export are unverified. A generic library User-Agent separately caused workers.dev error 1010; a truthful descriptive application User-Agent reaches the service, and the read-only release checker now uses it. No browser impersonation, protection change or network-path change was used.

Required operator work is listed in `docs/v0185-feedback-operations.md`. Use secure provider sign-in/secret entry, never paste passwords, Turnstile secrets or GitHub tokens into a public file or chat. A new account's agreement or paid plan needs explicit owner action.

## Final release gate

1. Complete the approved private backend setup and a synthetic real-service acceptance report/admin review.
2. Configure the approved HTTPS API origin and verify `node scripts/feedback-production-check.cjs` reports `ready: true`.
3. Verify all five existing workflows, v0.185 CI, release validation and current public-base smoke for the final PR head.
4. Merge with the verified head SHA only, then verify main CI, deployed HTML/assets/calculation/feedback labels, and the immutable release archive/checksum.
5. Report the actual live version and connection state. Do not publish a disconnected form as a completed feedback system.

Rollback: complete v0.184 Pre-Release 30 tree at `4444dce9e560026ee26c20e0677d182155aa19af`, with feedback intake disabled as necessary.
