# Singularity v0.188 Astra comprehensive audit — fixed starting state

Recorded 2026-11-15 (JST), before this audit's product changes.

- Source main and released v0.188-pre.1: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`; tree `cf7af9334261b0cfbbde45929da9d217445fe526`.
- Previous audit baseline: v0.187-pre.33 `7210be99c39d75b49ea8200aad91d75801eb300a`.
- PR #66 is already merged; the user's instruction naming v0.187 as current predates publication. M-01 and L-01 fixes are already present; this work audits and extends them without duplicate implementation.
- Publishing repository main: `b30c0f1863f3262574cf5365721be87c42ffa3e9`. Production deployment run43680927016 built source `d69a46f013fd9d1a8ca855c4f76194388f4816e9`, whose tree equals source main.
- Exact-main ten required workflows and release publication all completed successfully, re-fetched at audit start.
- No open v0.188 PR exists. Historical open PRs #38 and #46 are unrelated and left intact. Previous development branch feature/v0188-quality-remediation is preserved.
- New work branch: audit/v0188-astra-quality. Main, existing release tag and public sites remain fixed during this follow-up.

## Scope and execution

1. Independently inspect calculation mechanisms and add boundary tests; retain the fixed 300 fixtures.
2. Inspect state persistence and portrait alternatives; reproduce before fixing.
3. Inspect nine-language UI/search/errors/accessibility and six viewport widths.
4. Inspect Worker/admin/CORS/idempotency and existing production configuration using read-only evidence first.
5. Preserve source/public/ZIP provenance and distinguish actual observations from prior evidence.
6. Record defects before edits, commit small reviewable steps, run exact-candidate CI, and hand off to independent Terra.

Each workstream records its own before/after evidence in docs/v0188-astra-*.md. No new production report/Issue, destructive DB operation, authentication weakening or secret disclosure is permitted. Cloudflare operational fixes are authorized only when necessary, with a recorded rollback and verification. No new frontend main merge, release or publication is authorized by this follow-up.

## Initial limitations retained

Physical phones and full screen-reader use, full native-linguistic review, all gradient contrast states, deployed Worker full-byte identity, full Access policy inspection, live Turnstile and authenticated production replay were not established by prior evidence. They are not automatically counted as passed here. The previous conditional audit and owner decision remain historical records.

## Recorded findings and candidate corrections

- A-S01 Medium: manual attacker HP edits wrote defender HP. One input-routing line corrected, with old-failing handler and nine-locale browser regression. No damage formula changed.
- UI-01 Medium: double-escaped dynamic-label regular expressions left English accessibility labels in seven other locales; fullwidth budget parentheses were missed. Existing dictionaries reused and missing short UI explanations added.
- CF-01 Medium: programmatic calculator edits could retain approval of an obsolete feedback snapshot. Compare calculation identity at edit/click and at submit; require re-preview and confirmation. Backend unchanged.

Exact reversible patch fixtures retain every old runtime/inline-byte invariant outside these documented UI changes. The two modified external JS assets carry content hashes, tested for missing/stale hash rejection. The published tag and original approval are historical; followupAudit blocks all deployment/publication paths unconditionally. Any later release needs a new immutable identity, Terra's new review and owner approval.

New regression commands use the existing v0188 runner and are not optional. Required browser coverage includes 54 language/viewport combinations and nine-locale manual-HP and feedback-consent cases. The existing 90-transition and 300-case tests remain. Local Chromium restrictions mean browser results must come from actual CI artifacts, not from successful syntax checks.

Astra's engine audit added 1,627 independent arithmetic/mechanic witnesses plus 3,600 full-output comparisons against two fixed historical releases; all passed locally. Source engine remains unchanged. Current public feedback readiness is 10/10; management authentication is unavailable and current D1/Access/Turnstile administration remain unverified. No Cloudflare production change is needed for the confirmed frontend defect.

Follow-up performance compares published v0.188 (4f068544...) to the candidate on the same CI runner, with original sample counts/profiles intact. Current public measurements remain separate.

Candidate CI and independent Terra outcome will be linked in PR #67 after exact-commit results are available. Do not infer completion from this progress checkpoint.
