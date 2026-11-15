# Singularity v0.188 Continued Quality Audit Report

Status: INCOMPLETE — candidate corrections implemented; final CI, same-run performance and independent Sol conclusion pending. This is a development assessment, not owner approval or a publication decision.

## Exact baseline and continuation

Published v0.188 Pre-Release1: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`. Existing draft PR67 input: `8b37bddbb236fa1b7fbd13a7b2cebd1518995437`, tree `e2ca5d4c2ce0cbbfae36b58f1d27b0fb4f0c3b3d`. Current remote baseline snapshot: `a866b98068443bf27198071a82e2737633b3aec7`, branch `audit/v0188-continued-baseline`. New corrections reuse PR67. Start-state evidence records actual main Actions, release metadata/digest and publisher main.

Prior M-01/L-01 and PR67 A-S01/UI-01/CF-01 changes were read and retained. Existing Terra reviews remain immutable historical evidence. This round specifically appoints6.1Sol for independent review.

## New findings

| ID | Priority | Reproduction and resulting correction |
|---|---|---|
| C-E01 | High | Brick Break/Psychic Fangs against Reflect received reduction. Stable move IDs now bypass screens for the hit; all other modifiers retained. |
| C-S01 | Medium | Foul Play defender raw budget98/effective66 was valid live but rejected from storage. Contextual schema validation now follows the effective allocation and actual automatic/manual budget applicability. |
| C-S02 | High | Manual Speed-table edits left attSpeed/defSpeed unchanged and speed-dependent damage stale. Canonical per-side Speed routing and HP/Speed display corrected. |
| SOL-01 | Medium | An inactive point producing total67 cleared the result without changing input bridge; feedback consent remained. Numeric/null result now participates in attachment freshness, including submit-time validation. |
| C-U01 | Medium | Initial ArrowUp skipped last autocomplete result and rerenders left dangling active-descendant. All three comboboxes now clear and select consistently. |
| C-L01 | Low | Variable power text leaked English in five locales. Existing localized terms reused for summary/native option. |
| C-L02 | Low | Selected move verification warning disappeared in non-Japanese summaries. Status now derives from canonical move metadata before localization. |
| C-P01 | Low | Feedback typing unnecessarily rebuilt calculator controls. The adapter now excludes feedback-only inputs while preserving calculator events. |

Full before/after reproductions, scope and commands: [engine](v0188-continued-engine.md), [state](v0188-continued-state.md), [locale/UI](v0188-continued-locale.md), [feedback](v0188-continued-feedback.md). All correction witnesses were observed failing before product changes. No fixed300 fixture has been rewritten. Exact reversible source contracts admit only documented changes; unrelated engine changes still fail.

## Verification recorded so far

- Engine:216 independent BigInt vectors;456 locked Champions/Gen9 comparisons;20 unaffected/ID witnesses;6 immunity witnesses. All16rolls compared. Existing300,657move and4000seeded comparisons retained. No physical-game agreement claimed.
- State:52 independent contextual-budget and canonical-control assertions; legacy35schema and event-lifecycle checks. Nine-language browser state+reload+ElectroBall numerical tests added.
- Locale:59 actual-source function assertions; required18locale/viewport browser combinations added while retaining existing90transitions and54six-width checks. Semantic corrections reuse existing terminology; no exhaustive native-language certification.
- Feedback: invalid-result handler test failed before correction and passes after; nine-language browser case requires zero report POSTs. Worker source/configuration unchanged.
- CI: mandatory v0.188 runner auto-discovers new tests; locked external calculator is installed and continued audit reports included in artifact. Final exact-head results will replace pending status.

## Production and release boundaries

The followupAudit marker continues to block publication unconditionally. Existing pre.1 tag must not be overwritten; a later owner-approved release needs its own identity. New/old public calculators remain published at the historical source. No main merge, release, deployment, production report/Issue, D1 write or authentication change is performed.

Current public Worker readiness10/10 and CORS4/4 passed. Access public JWKS responded normally. Wrangler reports loggedIn=false and the dashboard redirects to sign-in. Current Worker version/bindings, D1, Access policies and Turnstile management are therefore unverified. Historical administrative snapshots do not substitute for current management reads. No credential values or private reports were obtained.

## Performance and remaining risk

Final same-run baseline/candidate measurements pending CI. A separate exact-guard A/B browser experiment measures feedback input latency and DOM mutations with five alternating contexts ×20inputs per variant/profile, while checking state and text preservation. Source-handler work counts decrease60→0 calculator refreshes for60feedback inputs; calculator inputs remain60→60. Counts are not elapsed-time claims. Existing4xCPUmobile73.5→89.6ms observation remains historical owner-accepted evidence; it is not copied as this candidate result. Current browser launch is blocked locally by socket EPERM, so browser validation requires actual CI artifacts.

Physical phones, full native screen-reader use, complete language semantics, every gradient/image contrast state, current Cloudflare administrative state, real Turnstile and authenticated production replay remain unverified. Raging Bull screen breaking is explicitly unsupported and unchanged. Existing broad comparisons are finite witnesses, not proof of every game interaction.

## Independent mode-transition correction

Sol independently confirmed an additional C-S01 boundary (SOL-02): after valid automatic Foul Play raw98/effective66, switching to manual mode produced a valid calculation but stopped saving. The first new test incorrectly required rejecting this inactive aggregate. The corrected policy matches live validation: automatic mode enforces relevant aggregate budgets; manual mode preserves unused allocations while every individual shape/type/range and control bound remains strict. New tests failed3/52before the change and pass52/52after. Real nine-language mode-transition/reload tests are mandatory in the revised candidate.

## Resume point

Run final exact-candidate CI, inspect job steps/artifacts, repair any genuine failures without weakening expectations, record performance distributions, recheck PR/source identity, and obtain independent Sol final assessment. Publish/merge decisions remain with the owner.
