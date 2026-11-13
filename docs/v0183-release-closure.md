# v0.183 — Release candidate closure gate

Status: **CI-qualified; awaiting manual browser acceptance**. Do not call this a final release until the owner signs off.

## CI evidence (main)

- Commit: `6659cc61df96e95687694b44f9fd58070369be58`
- Workflow: https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43416162241
- Result: **success**
- Includes: Showdown calculation comparisons; nine-locale rotation and state preservation; official-source reference checks for English, French, German, Spanish, Italian, Korean, Simplified Chinese, and Traditional Chinese type names; registered Asian species dictionary audit.
- Scope caveat: CI passing does **not** establish official spelling verification of every Pokémon, move, ability, item or form. Registered species coverage is not full National Pokédex coverage.

## Final manual acceptance checklist

Use the **deployed Chloha Labs Damage Lab** (not only local file:// or GitHub Pages).

- [ ] Check displayed version is v0.183 and deployment reflects the latest main commit.
- [ ] Start in Japanese; select an attacker, defender, move, abilities, item, weather and field; record damage result.
- [ ] Switch Japanese → English → French → German → Spanish → Italian → Korean → Simplified Chinese → Traditional Chinese → Japanese, without refreshing. Confirm no leftover previous-language type, move, ability or item labels.
- [ ] Confirm chosen Pokémon, move, stats, toggles and damage result remain consistent through language changes.
- [ ] Search by localized Pokémon and move names in each language; verify no Japanese-only leftovers or empty labels.
- [ ] Inspect all 18 type labels in the attacker/defender and detailed settings dropdowns in Korean, Simplified Chinese and Traditional Chinese.
- [ ] Check mobile layout, overflow and controls in all nine languages.
- [ ] Check at least one Mega/form and one damage-immunity or defensive-ability scenario.
- [ ] Capture screenshots and report any issue with language, field, expected/actual, and reproduction steps.

## Go / no-go

**GO** only when current-main CI is green, manual checks above are signed off, and there are no known release-blocking localization or calculation defects.

**NO-GO** if a type remains in the wrong language, language switching changes damage without changing battle settings, a selected form disappears, or the deployed version is stale.

Unverified official spelling coverage remains tracked as separate follow-up work, not falsely marked as fully verified. Keep v0.184 for the next development scope; do not quietly add new v0.183 features while closing this release.

## Owner sign-off

- Manual acceptance: **PENDING**
- Release approval: **PENDING**
