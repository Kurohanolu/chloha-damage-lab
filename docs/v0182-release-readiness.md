# v0.182 Multi-hit — release readiness audit

## Verified by CI
- Independent 16-roll damage convolution for fixed two-hit and 2–5-hit moves.
- Skill Link maximum hit count; Loaded Dice 4/5-hit distribution for standard 2–5-hit moves.
- Population Bomb (10 attempts, 90% accuracy) and Triple Axel (20/40/60 power, 3 attempts at 90%).
- Loaded Dice Population Bomb: one accuracy check, uniformly 4–10 hits (Showdown battle-actions.ts).
- Skill Link special moves: one accuracy check with maximum hit count (Showdown abilities.ts).
- KO probability includes first-hit miss and early termination.
- Browser UI selection, per-hit damage verification, total probability conservation, and stale-result protection.
- Showdown differential and audit workflows.

## Explicit limitations / release gate
- **Multiscale on any multi-hit move**: intentionally blocked in the UI because damage and HP must be updated after each hit. Do not silently use a first-hit modifier for later hits.
- **Accuracy modifiers**: the special-move model uses 90% per accuracy check. Accuracy/evasion stages and accuracy-modifying items/abilities are not included. UI discloses this limitation.
- Other move-specific per-hit effects, including damage-dependent abilities and state changes, have not been verified by live-game tests.
- All three CI workflows must pass on the **final commit**, not an earlier commit.
- Review the final PR diff and merge only after all CI checks pass; do not call a draft PR a released version.
- After merging, verify the published GitHub Pages version and complete an independent UI smoke test.
- Keep v0.183 localization separate until v0.182 is released.

## Primary reference
- Pokemon Showdown: data/moves.ts, data/items.ts, data/abilities.ts, sim/battle-actions.ts.
