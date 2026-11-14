# v0.185 feedback — production resources for owner review

Status on 2026-11-14: **existing D1, Worker, Turnstile and Access reused; four secrets registered; intake enabled; authenticated backend/readiness checks passed; deployed-form acceptance pending.** The owner explicitly approved the concrete resources, APAC placement hint and proceeding through v0.185 publication under a zero-incremental-cost/Free-plan condition. Wrangler scope and publication approvals also remain valid. Never request the same approvals again.

The earlier execution-review rejection was resolved by that explicit resource approval. The subsequent creation succeeded through the normal Wrangler/API clients. Do not recreate the resources below or treat the historical rejection as a current blocker.

## Verified provisioned resources

| Resource | Verified state |
| --- | --- |
| D1 | `chloha-private-feedback`, ID `17330885-dc0f-4dfd-a703-89cd34547e6c`, created in APAC; `0001_feedback.sql` applied successfully |
| Database contents | Required tables/indexes present; `reports` count is zero |
| Account namespace | `kurohanolu-labs` |
| Worker | `chloha-private-feedback`, deployed with the dedicated DB and admin assets; `INTAKE_ENABLED=true` |
| Public routing | Dedicated workers.dev URL deployed; preview URLs remain disabled; anonymous configuration returns production readiness; invalid submissions are rejected |
| Turnstile | Managed widget, public site key `0x4AAAAAAGAh8_mA5oJtA6fs`, hostname `kurohanolu.github.io` only |
| Secrets | Provider confirms `TURNSTILE_SECRET`, `RATE_LIMIT_SECRET`, `ADMIN_EMAILS`, `GITHUB_TOKEN` as `secret_text`; values have not been committed or printed |
| Cron | Provider confirms `17 3 * * *` |
| Existing Access application | `Chloha Feedback Admin`; `/admin/`, `/admin/admin.js` and `/v1/admin/reports` all redirect to the same real Access issuer/AUD; no duplicate created |
| Owner setup | GitHub secret registration and real Access owner authentication completed; no repeated setup requested |

No paid-plan or subscription change was made. The minimal remaining Japanese owner steps are in `v0185-feedback-owner-setup.md`. The API hostname is `chloha-private-feedback.kurohanolu-labs.workers.dev`; its public URL and intake are active. Worker version `14f57433-090a-435a-b753-38d568308f75` preserves the actual Access issuer/AUD and four secrets. Actual readiness and negative-input checks pass; successful real-widget delivery/Issue export still require the deployed form.

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

## Existing Access configuration and owner-only secret

Saved application details and actual edge responses verify an existing application. Do not repeat Zero Trust enrollment or application creation. The current Wrangler grant has Workers/D1/Turnstile permissions but no Access-specific read grant: an empty Access API list is not evidence that the saved application is absent. Actual protected-path redirects identify `https://billowing-fog-54f4.cloudflareaccess.com` and AUD `4427567a8c8371ea5d07e641f92105ec0ef0697d33c7611bc124c0e57b1fe1b9`. Its public signing-key endpoint returns RS256 keys. These public settings are now in the Worker configuration.

Cloud Browser dashboard sign-in returned a generic login HTTP 403. No credential failure or bot-detection cause was established, and automatic login retries were stopped. The Access sign-in page currently offers Cloudflare login only; the owner subsequently completed an encrypted Access CLI-protocol transfer, and Work verified the application JWT signature, issuer/AUD, owner and expiry before successfully reading the real private API. Do not disable authentication or request session cookies, cURL exports or verification codes in chat.

The existing API connection can deploy and read secret **names**, but cannot issue a repository-restricted GitHub credential on behalf of the owner. The owner has now registered that secret directly. For future rotation, use a fine-grained GitHub token restricted to `Kurohanolu/chloha-damage-lab`, with **Issues: read and write** and default Metadata read only, then register it directly as `GITHUB_TOKEN` in the existing Worker. Set an explicit expiry and record its renewal date privately. Do not send the value in chat or reuse the GitHub connector's credentials. See `v0185-feedback-owner-setup.md`.

## Starting state and remaining rollout

The initial authenticated inspection found no Worker scripts, D1 databases or Turnstile widgets. The dedicated resources listed above have since been created. The owner's existing Access application is now connected without recreation. No production report has been accepted. The candidate frontend points at the verified HTTPS API origin; the real production readiness check now passes all ten checks. No successful report delivery or Issue export is inferred from that read-only result.

Continue from the verified resources and registered GitHub secret. Check ownership/configuration before changing a resource and do not repeat ambiguous creation requests blindly. Intake was enabled after the four-secret/configuration/anonymous-access checks. Owner authentication and actual private reads subsequently succeeded. Complete the deployed-form acceptance and release gates in `v0185-feedback-operations.md` and `v0185-release-readiness.md`.

Reports expire at 90 days and are purged daily. D1 Free Time Travel can retain a recoverable copy for a further seven days; confirm the selected plan and operational privacy notice. Creating infrastructure is not equivalent to testing actual anonymous receipt, administrator login or GitHub Issue export.
