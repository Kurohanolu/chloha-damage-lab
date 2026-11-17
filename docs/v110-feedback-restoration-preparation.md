# ES-LA feedback restoration preparation (not released)

This isolated preparation is based on pre.9 candidate `40dd147204989ee0e8209c0ef7c5f3f15c349745`, not an immutable released pre.9 tag. It must be rebased onto the completed pre.9 release before integration under a new release identity and its full independent quality gate.

- Production pause remains unchanged in `feedback-config-v0185.js`.
- Worker config exposes its actual shared validator's ten locales, without secrets.
- ES-LA UI additionally requires an exact, unique, canonical ten-locale capability list. Missing, old, aliased, mixed, duplicate and oversized lists fail closed. Other nine locales retain their prior behavior. Widget-loading failure clears capability state.
- Read-only release probe validates exact capabilities when a locale is required.
- Local Worker tests: 18/18 passed. Local production-readiness mock tests passed, including malformed lists.
- Capability browser regression added but NOT RUN: installed Chromium failed before page creation with `socket() failed: Operation not permitted`. Pause browser test also remains unrun in this recovery pass. No browser pass is claimed.
- No new release approval, merge, deployment, Cloudflare change, real report, or GitHub Issue was performed.

Next: obtain final pre.9 baseline; add new release identity/gates while preserving historical contracts; run exact-head CI and real-browser suite including new capability test and late-failure/cross-locale flows; independently review. Preserve current Worker vars, bindings, secrets, assets and rollback version. Deploy backend first, verify live exact capabilities/security, then release the frontend under the existing full gate. A public config response alone is not proof that a real ES-LA report is accepted. Use a consented synthetic no-personal-data report with real Turnstile and verify its private receipt, never a public Issue. Stop login attempts on HTTP 403.

## Independent review follow-up

Fixed missing-config optional access so ES-LA initialization cannot throw before controls are disabled. Strengthened browser regression: absent configuration with page-error capture; malformed capability tests use a valid draft plus a late valid challenge callback; positive capability must accept exactly one local ES-LA report; late widget failure is explicitly held until config parsing, observed as preparing in English, then released and awaited before checking capability reset with reconnect suppressed. Worker 18/18 and readiness tests rerun PASS; browser still blocked before launch, not claimed validated.
