# Singularity v1.1.0 Pre-Release 3 — UI correction handoff

Prepared: 2026-11-16 (JST). Status: runtime correction implemented; fresh committed CI and release validation pending.

## Starting point and confirmed problems

- Review: [PR #69](https://github.com/Kurohanolu/chloha-damage-lab/pull/69).
- Initial PR commit: `7899487af4442e731229e5da5e151c920152938d`.
- Immutable published Pre-Release 2 baseline: `aba2d0558948e2a4dd375074fb11fd428edf6222`.
- New candidate identity: **v1.1.0 Pre-Release 3**, tag `v1.1.0-pre.3`.

The initial PR changed the registry label to `ES-LA`, while `i18n.js` still built the visible selector using its separate `Español (Latinoamérica)` literal. The implemented initializer now reads the locale registry and also uses `ES-LA` in its fallback list. It retains `es-LA` storage/events and `es-419` HTML/Intl identity.

The text-residue path was reproduced in a VM: `miniPercent` copied already translated DOM text, allowing a translated string to become the next canonical-text-cache input. Selected-move reliability warnings and battle-history rendering also consumed localized move option text. The fix generates the compact result from the existing computed numbers and uses `canonicalMoveLabel` / `canonicalTerrainLabel` for picker, warning, history and confirmation text. A translated display label no longer supplies those canonical source values. The numerical engine and game data are unchanged.

## Authorized scope

The owner authorized the UI correction and publication. Pre-Release 3 is the distinct release identity chosen to preserve the issued Pre-Release 2 tag. No further permission question is pending. Keep the issued Pre-Release 2 tag and its acceptance evidence intact; prepare new source/tree-bound release receipts for this candidate.

This is a UI/release correction. It does not introduce screenshot evidence, canonical mappings, new game inventory or calculation-engine changes. Preserve the accepted 20-image audit, official Champions coverage of 142/1,029 names, and 714 unverified fallbacks. Keep private screenshots out of Git. The production Worker remains unchanged; ES-LA feedback stays paused and feedback for the existing nine languages remains available.

## Required completion evidence

1. Confirm the actual visible selector uses `ES-LA` on mobile and desktop without changing locale identity or saved settings.
2. Exercise locale changes and reloads through the compact percentage, selected-move warning and battle-history cases; verify text follows the active locale and canonical state/numerical results remain unchanged.
3. Run fresh ten-language and existing nine-language regressions, calculation comparisons, persistence, feedback and publication checks against the exact Pre-Release 3 candidate. Record the current CI commit/tree and raw results; Pre-Release 2 passes do not cover this revision.
4. Obtain independent Sol review of the final diff and evidence, bind the existing owner authorization to that reviewed source/tree, then pass the release gates.
5. Publish the distinct Pre-Release 3 identity and verify the actual deployed files and affected UI. Record live acceptance only after observing that outcome.

Local validation passed 4,520 numerical-equivalence comparisons and 300 baseline cases on an uncommitted preview. These checks do not constitute committed CI or live acceptance. Runtime fixes are implemented; fresh CI, final Sol review, the source-bound owner receipt and live acceptance remain **pending**. No publication result is asserted by this handoff.
