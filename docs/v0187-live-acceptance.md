# v0.187 actual-site acceptance checkpoints — 2026-11-15 JST

**Actual new-site and protected feedback acceptance are complete.** The owner created [Issue #65](https://github.com/Kurohanolu/chloha-damage-lab/issues/65) through the existing protected Worker administrator UI. Read-only D1 verification matched the exact report's Accepted/created state, Issue65 URL and revision4. The report marker appears in exactly one Issue across all65 public repository entries. Fresh public security readiness10/10 and unchanged Worker security/idempotency tests15/15 pass. Production duplicate writes were not attempted; concurrency and repeated-POST suppression were exercised locally. Final metadata, dual-site publication, exact-head/main CI and immutable release follow the approved runbook.

The credential-free [final administrator verification receipt](v0187-preview/admin-acceptance-verified.json) records only synthetic metadata and public Issue identifiers. No private existing reports or credentials were inspected or published.

## Latest verified UI publication

- Source `999acc96d380938e9d8e38d357f5e4deeaeb1b1f` removed the independent CHLOHA LABS paragraph and compacted the title spacing while retaining the footer credit. All ten exact-head workflows passed.
- [Deployment43657571334](https://github.com/Kurohanolu/singularity/actions/runs/43657571334) built and deployed that exact clean source. All37 required public files and33 exact browser-reference URLs matched after deployment.
- Actual public browser switches passed all nine locales: product title, localized description/footer, absent developer heading,20px desktop leading space, damage108–128 and Attack165 preservation. The [read-only DOM receipt](v0187-preview/header-cleanup-live-checks.json) contains only synthetic/default calculator values and public UI text.
- CI [migration run43657154860](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43657154860) verified27 layouts across320/390/1280px,3,000 numeric contracts and local anonymous-feedback regression with zero production requests. Its PR merge tree is identical to the deployed source tree. The artifact retains current desktop/phone screenshots.

## Initial deployment and real intake checkpoint

| Evidence | Actual result |
|---|---|
| New URL | `https://kurohanolu.github.io/singularity/`, title `Singularity v0.187 Pre-Release 33` |
| Deployed source | `d33776be1f24c20793be88527d20189954d73052`, all ten source workflows successful |
| Canonical deployment implementation | `2123237dc74f131bee2ff4caea7d39b7a28aa7d1`, all ten source workflows successful |
| Target workflow | `Kurohanolu/singularity@481f2a2d847a0d66487f10dacf56b1865392adc1`, byte-identical to the canonical source template |
| Actual new-site deployment | [Run43648999989](https://github.com/Kurohanolu/singularity/actions/runs/43648999989), build and deploy completed/success; provenance artifact retained |
| New-site hashes | All37 required public files match the clean approved-source artifact, including all original runtime scripts and supplied/adapted logos |
| Real browser locales | Japanese, English, French, German, Spanish, Italian, Korean, simplified and traditional Chinese; visible product heading always Singularity and product explanation localized |
| Numeric/input/reload | Default damage108–128 and attacker Attack165 retained during all locale changes; English retained after actual reload |
| Real anonymous intake | Existing production Turnstile-backed form displayed its private-report received-success message; no email or optional calculation snapshot supplied |
| Persistence | Authenticated read-only D1 query, restricted to the exact synthetic test description, confirmed one matching record: v0.187 Pre-Release33, locale en, status New, no Issue yet. No database row was changed by verification |
| Existing security readiness | All ten actual read-only checks pass; all three administrator paths redirect anonymous requests to the existing Access issuer. An earlier unconfirmed `/admin/` check was investigated and not treated as success |
| Old-site source | `pages-legacy`/root, `aac68ac8eb7a23a72f91d8045833baadd97ec0c3`; [run43647174221](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43647174221) successful; all30 old HTML/manifest/runtime files match v0.186 |

The uniquely labeled synthetic test is `migration-v0187-d33776b-20261115`. Its receipt text is synthetic technical data, not a real user's feedback. No existing private descriptions, emails, credential values or signed authentication URLs are copied into this report. The synthetic record is retained for audit and normal expiry; no production data deletion is performed.

## Historical initial public screen

![Actual new-site calculator](v0187-preview/live-singularity-ja.jpg)

This is the actual initial HTTPS deployment, before the separately verified header cleanup above; its old developer heading is historical evidence, not the current public UI. Current desktop/phone screenshots are retained in the linked migration CI artifact and the completed work result. Earlier review-time evidence remains in [design previews](v0187-design-preview.md).

## Historical authentication diagnosis and final publication

The protected administrator URL redirects to the existing Access application, which offers Cloudflare sign-in. The current dashboard login page reports403 from its login API. Stop repeated browser sign-in attempts. Existing Wrangler OAuth authentication, Worker secret-binding metadata and the read-only synthetic D1 query all succeed; all ten current source workflows and public read-only readiness checks pass. Development/API verification can continue without a new token or dashboard login. See [the bounded authentication diagnosis](v0187-cloudflare-auth-diagnostics.md).

The owner completed the application identity and real moderation/Issue round trip independently. Existing management OAuth was used only for a SELECT of that exact synthetic report. The Worker, Access policy, existing data and secrets remain unchanged. The dashboard403 diagnosis is historical and is not a remaining publication blocker.

The exact target ID, safe public payload and minimal owner administration actions are in [the one-report acceptance packet](v0187-admin-acceptance.md). No new report or credential sharing is needed.

The verified flag is now true based on the recorded real-service evidence. Rerun final-head CI, dispatch the same clean source to the new target, then deploy the generated old-site notice after final PR-base CI. Verify both exact public trees before the approved main merge and verify exact-main CI/immutable publication afterward. Deployment/merge/release results are recorded in PR #64, without adding a new source commit between old-notice deployment and merge. Follow the [cutover/rollback runbook](v0187-cutover-runbook.md).
