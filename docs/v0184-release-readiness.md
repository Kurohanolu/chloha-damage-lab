# v0.184 Pre-Release 29 — publication record

The owner authorized finishing the remaining engine work and publishing this release on 2026-11-14. This supersedes the original draft-only/no-deployment boundary of the engine-extraction task.

## Delivered scope

- Scoped calculation core and battle/move/ability reference modules.
- Explicit compatibility adapter for existing UI bindings.
- DOM-independent orchestration for Shell Side Arm, Beat Up, and standard/special multi-hit moves.
- A frozen 300-case baseline generated from public v0.183 commit `6fe0e8b0f85c30dde029c617254b75b86dd4636b`.
- Preserved formulas, rounding order, accepted IDs, errors, translations, and unsupported interactions.

The final structural commit `8383ada246d01266da1177488b08a111a392eeca` passed all five required PR workflows before release metadata was updated. The final release commit must independently pass the same five checks before merge. Main also runs all five, and the release workflow waits for their exact-commit success before creating the immutable prerelease/tag and source archive.

## Verification and artifacts

- `node scripts/verify-release.cjs`: manifest, public title, package version, notes, and runtime file presence.
- `node tests/v0184-engine-initialization.cjs`: script order, scope isolation, UI bindings, item roles, fixed rolls, and rejection boundaries.
- `node tests/v0184-public-baseline.cjs`: exact core/orchestration outputs, traces, distributions, KO probabilities, and caller immutability.
- Five required GitHub workflows: Showdown differential tests, Showdown differential audit, v0.184 engine baseline, Damage Lab CI and status ledger, UI & damage regression.
- GitHub Pages live smoke: exact HTML and JavaScript hashes, live calculation probes, nine languages, and no uncaught page errors.
- Published source archive and SHA256: attached to `v0.184-pre.29` only after main CI succeeds.

Public URL: https://kurohanolu.github.io/chloha-damage-lab/

Release URL: https://github.com/Kurohanolu/chloha-damage-lab/releases/tag/v0.184-pre.29

Rollback restores the complete pre-release source tree at `6fe0e8b0f85c30dde029c617254b75b86dd4636b`; do not mix old HTML with new runtime files. Historical v0.183 manual-acceptance notes remain historical and do not assert new hardware verification. No additional Pokémon Champions hardware parity is claimed.
