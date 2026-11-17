# Provisional pre.13 translation successor preparation

This isolated candidate builds on published pre.11 and PR #83 translation source `88439ff3881e30da8e7b4986513b82b94b664a23` (tree `d5925abb7b6c39128ceac663ccee882a41659d0d`). It does not contain PR #82 feedback capability changes or claim pre.12 publication. If #82 lands first, rebase and redo source binding, independent review and exact-head CI before publication.

## Scope

- Fresh pending pre.13 identity and approval fields. Previous live acceptance/audit receipts are not reused.
- Exact identity/content-cache updates; release/deployment quality checks explicitly include pre.13.
- Published pre.11 stays immutable as observation/rollback baseline.
- Original weather scope remains byte-identical and executes in pinned published source. Current successor separately freezes reviewed translation runtime/data, all previous-language/mechanics/backend bytes and fixture membership.
- Five translation source contracts accept only the exact version/cache-only HTML successor, not arbitrary normalized HTML.
- Regenerated UI inventory now records the already-implemented Fuente Energía binding in rendered text and witnesses and the current source-record hash. Authored source text and verification status remain unchanged.

## Local checks

Passed: release metadata/cache validation; pre.13 pending lifecycle and stale-receipt rejection; pre.11 historical publication; current/historical weather scope; source provenance; Power Spot and batch7–10 contracts; deterministic UI inventory and coverage; private artifact packaging; 300 baseline contracts; 2,592 weather cases with 16 rolls each; publisher/deployment exact-head gate mock tests; diff whitespace check.

Full browser acceptance and required exact-head CI for this successor have not run. The older PR #83 run is not successor proof. Its weather browser passed 220 locale/reload/mobile cases, but stale release/cache/scope/inventory failures blocked publication. Independent source review is required for this preparation; it does not constitute release audit approval.

No merge, deployment, backend changes, feedback enablement or production mutation was performed.
