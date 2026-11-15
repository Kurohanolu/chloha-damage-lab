# v1.0.0 browser operations confirmation

Recorded 2026-11-15T18:14:04.639299+09:00. This is a bounded read-only supplement to the operations baseline.

## Source GitHub Pages: directly verified

The existing signed-in GitHub browser session opens [source repository Pages settings](https://github.com/Kurohanolu/chloha-damage-lab/settings/pages). The visible selected settings are **Deploy from a branch → pages-legacy → / (root)**. GitHub explicitly says the site is currently built from `pages-legacy` and is live at the old URL. The latest displayed deployment is [43663821437](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43663821437). HTTPS is checked and required for the default domain; the custom-domain input is empty. Save is disabled because no setting was changed.

This closes the previous direct-configuration-read gap for the source repository's Pages source. Preserve `pages-legacy` and its frozen legacy calculator while merging the new application's source into main. This observation does not authorize changing that branch or the old URL's publishing source. The inspected settings tab is retained for review.

## Cloudflare: authenticated management unavailable

Opening the normal Cloudflare dashboard redirects to `https://dash.cloudflare.com/login`. The rendered page shows **Cloudflare にサインイン** and empty email/password inputs. There is no authenticated dashboard available in this browser session.

No login button or identity provider was selected, no credential/token was entered or requested, and no user handoff was initiated. Consequently current Worker/deployment identity, D1 bindings/metadata, Access and Turnstile administration, and backend rollback target remain **INCOMPLETE**. Public Worker/CORS observations are separate bounded evidence and do not replace those management reads.

## Side effects and scope

Production writes, GitHub setting changes, Cloudflare changes, SQL writes, private-report row reads, secret-value reads and deployments are all **zero**. Root-owned target/template tabs were not touched; this workstream created its own observation tabs. The frozen source repository was not modified. Sanitized evidence is in `v1-browser-operations.json`.
