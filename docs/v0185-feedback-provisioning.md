# v0.185 feedback — production resources for owner review

Status on 2026-11-14: **dedicated D1, Worker and Turnstile created; intake and public routes disabled; owner-only setup pending.** The owner explicitly approved the concrete resources, APAC placement hint and proceeding through v0.185 publication under a zero-incremental-cost/Free-plan condition. Wrangler scope and publication approvals also remain valid. Never request the same approvals again.

The earlier execution-review rejection was resolved by that explicit resource approval. The subsequent creation succeeded through the normal Wrangler/API clients. Do not recreate the resources below or treat the historical rejection as a current blocker.

## Verified provisioned resources

| Resource | Verified state |
| --- | --- |
| D1 | `chloha-private-feedback`, ID `17330885-dc0f-4dfd-a703-89cd34547e6c`, created in APAC; `0001_feedback.sql` applied successfully |
| Database contents | Required tables/indexes present; `reports` count is zero |
| Account namespace | `kurohanolu-labs` |
| Worker | `chloha-private-feedback`, deployed with the dedicated DB and admin assets; `INTAKE_ENABLED=false` |
| Public routing | Workers API confirms `enabled=false` and `previews_enabled=false` |
| Turnstile | Managed widget, public site key `0x4AAAAAAGAh8_mA5oJtA6fs`, hostname `kurohanolu.github.io` only |
| Secrets | Provider confirms `TURNSTILE_SECRET`, `RATE_LIMIT_SECRET`, `ADMIN_EMAILS` as `secret_text`; values have not been committed or printed |
| Cron | Provider confirms `17 3 * * *` |
| Remaining owner setup | Zero Trust Free onboarding and owner-only Access application; repository-restricted `GITHUB_TOKEN` directly registered in the Worker |

No paid-plan or subscription change was made. The detailed Japanese owner steps are in `v0185-feedback-owner-setup.md`. The intended API hostname is `chloha-private-feedback.kurohanolu-labs.workers.dev`; it is not yet an enabled public intake.

## Approved resource configuration

| Resource | Proposed configuration | Exposure / cost boundary |
| --- | --- | --- |
| D1 database | `chloha-private-feedback`; location hint `apac` (Asia Pacific); binding `DB`; apply `migrations/0001_feedback.sql` only to this new database | Private report storage. APAC is a placement hint, not a legal data-residency guarantee. One database within Free-plan allowances; no paid upgrade |
| Workers namespace | Reuse the account subdomain if one exists; otherwise request `kurohanolu-labs` if available | New account namespace; do not rename an existing subdomain or purchase a domain |
| Worker | `chloha-private-feedback`; bind the dedicated D1 database and admin assets | Create with `INTAKE_ENABLED=false`, `workers_dev=false`, preview URLs and application logging disabled. Select/verify the exact HTTPS origin before enabling it |
| Turnstile widget | Name `Chloha Damage Lab feedback`; Managed mode; allow only `kurohanolu.github.io`; no pre-clearance, ephemeral IDs or enterprise-only options | One Free widget. Public site key in configuration; matching secret only in Worker secrets |
| Access application | Name `Chloha Feedback Admin`; one self-hosted application protecting the chosen Worker hostname at `/admin*` and `/v1/admin/*`; allow only the verified owner identity | Activate Zero Trust Free first. Keep anonymous `/v1/config` and `/v1/reports` outside Access. Never enable whole-Worker authentication on the public intake |
| Worker secrets | `TURNSTILE_SECRET`, random `RATE_LIMIT_SECRET` (at least 32 characters), owner-only `ADMIN_EMAILS`, and repository-restricted `GITHUB_TOKEN` | Private Cloudflare secrets only; no secret values in chat, Git, Pages, logs or screenshots |

The proposed incremental budget is **zero**: do not subscribe to a paid plan, enable billable add-ons or enter payment details on the owner's behalf. The current OAuth grant cannot read account subscriptions, so the actual plan has not been verified through that endpoint. Verify the Free-plan selections and allowances before activation. If the provider requires an upgrade or a cost cannot be established, stop for the owner.

D1 Free includes 10 databases, 5 GB total storage, 5 million daily row reads and 100,000 daily row writes. Free limits stop excess usage instead of requiring an automatic upgrade. Turnstile Free includes up to 20 widgets and unlimited challenges. Recheck current official limits before enabling public traffic:

- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/turnstile/plans/

## Owner-only setup

Cloudflare's current Zero Trust onboarding requires choosing a team name and a subscription, and says payment details are required even for Free. This includes an account/subscription agreement and payment information; the owner must complete that step directly. Do not sign up, accept terms, supply billing details or select a paid subscription automatically.

1. In the owner's Cloudflare dashboard, open Zero Trust / Cloudflare One and select the **Free** plan. Choose an available team name such as `chloha-damage-lab`. Review and complete any agreement/payment step personally. The resulting team hostname is public configuration; payment information and credentials must remain private.
2. Configure the owner-only Access application after the final Worker hostname is known. Obtain its issuer/team domain and AUD from the actual application; do not invent them. If the Wrangler grant lacks Access-management permissions, the owner configures the application directly rather than broadening the token silently.
3. Create a fine-grained GitHub token restricted to `Kurohanolu/chloha-damage-lab`, with **Issues: read and write** and the required default Metadata permission only. Set an explicit expiry and record its renewal date privately. Enter it directly into the Cloudflare Worker's `GITHUB_TOKEN` secret; do not send it in chat or reuse the GitHub connector's credentials.

Official Zero Trust onboarding: https://developers.cloudflare.com/cloudflare-one/setup/.

## Starting state and remaining rollout

The initial authenticated inspection found no Worker scripts, D1 databases or Turnstile widgets. The account had no `workers.dev` subdomain, and Access was not enabled. The dedicated resources listed above have since been created. No production report has been accepted. The frontend API origin is still empty and the production readiness check must continue to fail until the actual service is connected.

Continue from the verified resources, complete owner-only setup and register the remaining GitHub secret. Check ownership/configuration before changing a resource and do not repeat ambiguous creation requests blindly. Keep intake and public routing disabled until the actual Access configuration is selected and verified. Then run the real-service acceptance and release gates in `v0185-feedback-operations.md` and `v0185-release-readiness.md`.

Reports expire at 90 days and are purged daily. D1 Free Time Travel can retain a recoverable copy for a further seven days; confirm the selected plan and operational privacy notice. Creating infrastructure is not equivalent to testing actual anonymous receipt, administrator login or GitHub Issue export.
