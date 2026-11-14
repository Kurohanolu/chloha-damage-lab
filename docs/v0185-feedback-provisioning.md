# v0.185 feedback — production resources for owner review

Status on 2026-11-14: **Wrangler authenticated; production resources not created.** The owner already approved publication and the Wrangler account/user-read, Workers-script, D1 and Turnstile scopes. Successful CLI completion and an authenticated `whoami` response establish access to one account. Never request the same scope approval again.

The execution approval review separately rejected creation of the dedicated D1 database because the specific production resource and its APAC placement had not received explicit approval. Do not retry the creation through a different client. Obtain one approval covering the concrete plan below before starting production mutations.

## Proposed resources

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

## Verified starting state and rollout

The authenticated inspection found no Worker scripts, D1 databases or Turnstile widgets. The account had no `workers.dev` subdomain, and the Access API reported that Access was not enabled. No production report has been accepted. The frontend API origin is still empty and the production readiness check must continue to fail until the actual service is connected.

After approval, create the dedicated resources sequentially, verify each result and save only non-secret IDs in the repository. Reuse a resource only after checking its ownership/configuration; do not repeat an ambiguous creation blindly. Verify migrations on the dedicated empty database before binding it. Register the provider secrets securely, complete owner-only setup, then run the real-service acceptance and release gates in `v0185-feedback-operations.md` and `v0185-release-readiness.md`.

Reports expire at 90 days and are purged daily. D1 Free Time Travel can retain a recoverable copy for a further seven days; confirm the selected plan and operational privacy notice. Creating infrastructure is not equivalent to testing actual anonymous receipt, administrator login or GitHub Issue export.
