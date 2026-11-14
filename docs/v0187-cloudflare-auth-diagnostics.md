# v0.187 Cloudflare authentication diagnosis — 2026-11-15 JST

**Continue development and read-only production verification with the existing Wrangler OAuth session. Stop dashboard login retries. No new credential or Cloudflare resource is required for that work.**

## Observed failure and diagnostic limits

The existing browser page reports `API Request Failed: post https://dash.cloudflare.com/api/v4/login (403)`. This identifies the rejected dashboard login request, not a failure response from the feedback Worker. The page supplies no specific rejection reason or request identifier. The cause cannot be narrowed to an incorrect password, browser filtering, account restriction or another provider-side decision from this message alone.

This diagnosis did not submit credentials, retry login, solve a challenge, change browser/network behavior or relax any protection. No credential-page screenshot, password, OAuth/refresh token, Access cookie/JWT or signed authentication URL is retained in this report. A detailed provider explanation remains unconfirmed; working API authentication does not prove why dashboard login was rejected.

## Measured existing authentication and service state

Checks completed on 2026-11-14 UTC / 2026-11-15 JST, against source `7e872c4d4f32f8aeb57c7f3ff34f70c128b5264f`:

| Check | Result and limit |
|---|---|
| Locked Wrangler | Version4.162.0; `whoami --json` completed successfully with OAuth authentication and one available account. Account email and credential values were suppressed |
| Existing local authentication | OAuth/refresh credentials already present in the private global Wrangler config, mode0600. No environment API token or global API key was configured. Only presence/mode/scope metadata was inspected |
| Granted OAuth scopes | Existing user/account read, offline access, Workers Scripts, D1 and challenge-widget scopes. No Access-management scope was present. No permission was added; production writes were not exercised |
| Existing Worker | `wrangler secret list` succeeded. All four expected secret bindings exist; only names/counts were checked, never secret values |
| Existing D1 | Exact synthetic-record aggregate SELECT succeeded: matching record count1, v0.187 Pre-Release33, status New, Issue state none; rows read1, rows written0, `changed_db=false`. No other report body/email/snapshot was read |
| Existing Access issuer | Public signing-key endpoint returned200 and two signing keys. This proves reachability, not successful administrator authentication |
| Public feedback readiness | `node scripts/feedback-production-check.cjs`: all ten checks passed, including exact frontend CORS origin, enabled intake, retention, no-store, no public report listing and denial on all three administrator paths |
| Source GitHub Actions | All ten workflows completed/success on exact source7e872c4d. The publisher's PR validation succeeded; its publication job was skipped |
| Target Pages deployment | [Run43648999989](https://github.com/Kurohanolu/singularity/actions/runs/43648999989) completed/success using approved source d33776be; no Cloudflare credential is needed for GitHub Pages |

The D1 check inspected the previously approved synthetic acceptance record only. It did not submit another report, change its moderation status, create an Issue or delete anything. Worker, D1, Access, Turnstile and their existing data/settings remain intact.

## GitHub Actions and tasks that can continue

The existing [feedback workflow](../.github/workflows/v0185-feedback.yml) runs local Worker/security/browser tests and an undeployed bundle check. It does not deploy the production backend or reference a Cloudflare API credential. The canonical [new-site deployment](../deployment/singularity-pages.yml) uses GitHub's short-lived workflow/Pages identity and the exact-source regression gates; it does not need Cloudflare login either. Secret values in GitHub were not requested. This review makes no claim about unused secret names outside those workflow definitions.

Brand/UI implementation, calculation regressions, nine-language checks, local feedback/security tests, static builds, CI review, existing Workers/D1 API reads and authorized Pages operations can therefore continue without the dashboard login screen. Existing OAuth scopes allow more than the reads used here; that is not a reason to change production authentication or deploy an unchanged Worker.

## Protected administrator acceptance remains separate

The production Worker requires a real Access application JWT in `Cf-Access-Jwt-Assertion`, with the configured issuer/audience, RS256 signature, expiry and permitted administrator email; it also requires `type=app` and same-origin mutation protection. See [the existing authentication implementation](../services/feedback/src/worker.js). A management API OAuth token or API token does not establish this application/user identity.

Consequently, Device Login or a new management API token would not complete the remaining real administrator moderation / reviewed technical-only Issue creation / duplicate-prevention round trip. A machine Access service token is also not a drop-in replacement for the Worker's current email/type checks; adding a service policy or a new authorization path would change production security. No such change is made.

Keep `liveTargetVerified=false`. Do not bypass the protected route through direct D1 moderation or manual Issue creation and report that as Worker end-to-end acceptance. Owner rollout approval remains recorded; administrator acceptance is a technical prerequisite, not a new permission request. No owner action is needed to continue the API/CI work described above.

## Recovery only if existing API authentication becomes unusable

1. First use the existing Wrangler session and its normal refresh behavior. Do not log out or replace functioning credentials to investigate an unrelated dashboard403.
2. If that session actually fails and cannot refresh, the installed CLI and official documentation support `wrangler login --device --browser=false`. This is an OAuth recovery option without a local callback listener. It still requires owner approval on Cloudflare's official verification page; it is not a promise to avoid a dashboard rejection. Start it only when recovery is necessary and the owner can approve the short-lived request. Do not post its code, signed URL or resulting credentials to GitHub/chat.
3. If noninteractive management access is actually needed, use an expiring API token limited to the required account, resources and actions. Store it through a private credential/secret channel and use `CLOUDFLARE_API_TOKEN`; never use a global API key, commit a value or request a token in chat. Any needed Access-management read permission must be explicit. This token still cannot substitute for the protected application's administrator identity.

No new Device Login session, token issuance, permission expansion, resource recreation or authentication setting change was needed or performed during this diagnosis.

Official references: [Wrangler general/login commands](https://developers.cloudflare.com/workers/wrangler/commands/general/), [Access application JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/), [Access service tokens](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/), [Workers external CI/CD](https://developers.cloudflare.com/workers/ci-cd/external-cicd/).
