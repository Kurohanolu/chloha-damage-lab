# v0.188 Astra feedback and Cloudflare audit

Audit baseline: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7` (published v0.188 Pre-Release 1). The initial source inspection below was recorded before editing product code. Production Worker, D1 and authentication changes: none.

## Initial finding CF-01: attachment consent can survive changed calculator state (Medium)

`feedback-ui-v0185.js` invalidates an approved attachment only on `input`/`change` from `ChlohaFeedbackContract.controlIds`. The point-allocation preset handlers, side-swap handler and v0.188 reset handler update models and controls programmatically. They do not dispatch an event from those IDs. Six-stat model editors also have IDs outside the attachment control allowlist. Submission only checks the existing `stale` flag; it does not compare the approved snapshot with the current calculation.

Reproduction to verify: open feedback; attach and confirm a calculation snapshot; change allocation with an attacker preset (or swap sides/reset all calculation conditions); submit. The approved preview is old, but the prior implementation can still accept it. This affects correctness and clarity of explicitly approved diagnostic attachments, not automatic disclosure of private text or authentication bypass.

Proposed remedy: compare only calculation identity (versions, selection, controls and engine input) after calculator interactions and immediately before submission. Locale-only changes must preserve approval. A changed or unreadable calculation must require refreshing and confirming the preview. No polling, new storage or Worker change is needed.

## Initial security inspection

The existing Worker requires verified RS256 Access JWT issuer/audience/expiry/type/email allowlist and same-origin administrator mutations. Public intake has exact-origin CORS, bounded JSON, strict field/snapshot allowlists, Turnstile validation and atomic per-client/global rate limits. Issue creation has a revision lock and ambiguous-result reconciliation instead of blind retry. Administrative rendering uses textContent. These observations require local negative-path verification and do not prove live Access policy completeness.

Further evidence, reproduction outcome and verification limits will be appended after execution.

## Before-fix reproduction

The new independent VM handler test `node tests/v0188-astra-feedback-state.cjs` failed on the unchanged published frontend: `attPresetSynthetic must invalidate approved attachment`, actual stale hidden=true, expected=false. This executes the original feedback event handlers against a synthetic calculation state; it is not a real-browser result. Browser launch is unavailable in this local runtime; browser regression will be required in CI.

## Implemented remedy and local tests

The feedback UI now compares version, selection, controls and engine input after calculator `input`, `change` and `click` events, and once more immediately before submission. Locale and derived result rendering are excluded from the identity. Changed or unavailable calculation state clears approval and requires a fresh preview; it does not automatically replace what the user approved. The existing busy guard and request-id retry behavior remain.

- `tests/v0188-astra-feedback-state.cjs`: PASS after the recorded pre-fix failure. Covers preset/swap/reset, six-stat fields, locale-only preservation, silent changes caught at submit and failed snapshot capture.
- `tests/v0188-astra-feedback-browser.cjs`: added nine-locale real-browser integration for those interactions, using only the local Worker and mocked Turnstile; zero report submissions are expected. Pending CI execution because local Chromium cannot launch in this runtime.
- Existing Worker test suite: 15/15 PASS locally with in-memory SQLite and signed synthetic JWTs.
- `tests/v0188-astra-worker-security.cjs`: PASS additional tampered signature/missing identity, missing mutation header, conflicting concurrent submissions, UTC-midnight idempotent retry and malformed successful GitHub response reconciliation. All external services are mocked; exactly one simulated Issue POST is required after ambiguous success.
- Existing shared feedback contract and publication readiness contract tests: PASS.

## Current production observation — 2026-11-15 14:53 JST

Public readiness 10/10 PASS. Independent approved-Origin GET/OPTIONS returned200/204 with the exact allow-origin; disallowed Origin GET/OPTIONS returned403 without an allow-origin header. All four responses were `no-store, private`. Access public JWKS endpoint returned200 with two signing keys; key material was not copied into evidence.

GitHub's current public issue collection contained67 entries. The existing acceptance marker occurs once, on Issue #65. This confirms no second public Issue containing that marker in the fetched collection; it does not independently attribute the original operation to Worker logs.

**Current management authentication is unavailable.** Locked Wrangler4.162.0 `whoami --json` reports `loggedIn=false` and zero accounts in this runtime. The previous report's working OAuth observation at13:12 JST is historical and is not reused as current authentication evidence. No login screen retry, token extraction, credential request or scope change was attempted. D1 state and live Worker bindings/version could therefore not be independently re-read during this audit. Previous evidence records Accepted/created/65/revision4 and active Worker14f57433-090a-435a-b753-38d568308f75; those remain historical observations only.

No production reports, Issues, DB writes, deployments, secrets or authentication changes were performed. Sanitized receipt: `docs/evidence/v0188-astra-feedback-readonly.json`.

## Operation and rollback record

Worker code, Wrangler configuration, migrations and administrator assets are unchanged. A backend deployment is unnecessary for the confirmed frontend bug. The candidate feedback UI fix is for the development PR; publication remains owner-gated. If it later needs rollback, restore the published source commit4f068544e670a85a6a4d34dd2c26e2be66bd9cb7 through the existing Pages exact-source workflow. No D1 migration or data deletion is involved.

If a future backend incident requires management access, first restore the existing authorized Wrangler session using the official login flow; device authorization requires owner interaction and is not a substitute for an Access application identity. Do not change Access protection or recreate resources to regain access. Before a Worker change, record the actual current deployment/version and rollback target through authenticated API reads. A historically observed version is not sufficient to claim a current rollback point.

## Remaining verification limits

Current D1 state, deployed Worker byte identity/configuration, full Access application/policy settings and Turnstile administrative configuration could not be read without management authentication. Real Turnstile completion and authenticated production replay were not attempted, to avoid creating reports or Issues. These are not marked PASS. The frontend real-browser regression remains pending CI; VM handler tests are identified separately from browser evidence. No new Critical/High security defect was confirmed in inspected code or safe production checks.
