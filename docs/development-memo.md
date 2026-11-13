## 2026-11-14: v0.183 full-select audit follow-up (latest green baseline)

- Verified main commit `830a86d9baddba2b5a353fdcfa53e3b4fec8787d`, Damage Lab CI https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43492628658 **success**; UI & damage regression https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43492628713 **success**.
- The full browser audit compared **11,472** stable native select entries (1,434 per non-Japanese locale). **Zero Japanese-kana findings**, zero known-English UI regressions, and no native-label mismatch findings were reported.
- **1,288 English-equal review candidates remain**, distributed as French 82, German 79, Spanish 493, Italian 634. These are *not* 1,288 confirmed missing translations. Most come from Pokémon selectors repeated for attacker and defender. Spanish and Italian Pokémon names often legitimately equal their English official names.
- Official canonical-name cross-check: **558 verified, 0 mismatches**. Form structure: **73 verified, 0 pending** in the existing audit's defined scope. This is not a full national-dex or hardware-accuracy certification.
- Review next: deduplicate mirrored Pokémon selectors; compare each unique locale/species/form candidate against official name references, prioritizing French/German cases and actual UI labels. Keep same-spelling official names unchanged. Avoid bulk translating Spanish/Italian Pokémon names simply because they match English.
- Release gate: CI green does not replace manual acceptance of the deployed Chloha Labs version. Follow `docs/v0183-release-closure.md`.

# Damage Lab — Development memo

## 2026-11-13: Full nine-language select-option audit

- Audit workflow: `tests/v0183-all-select-options-audit.cjs`, integrated into `.github/workflows/damage-lab-ci.yml`.
- CI: **failure**, commit `65bb6b9dbec99f1cab0832e28d745f074ae1439c`, run https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43420293214 .
- Compared 1,434 stable native select options in each of eight non-Japanese locales (11,472 comparisons).
- Flagged 3,135 candidate findings: 1,945 Japanese-kana residues and 1,190 English-equal labels. **Candidate findings, not 3,135 confirmed translation errors**: official names may legitimately coincide across languages.
- Frequent candidates in Pokémon and alternate-form selectors: Mega forms, Rotom, Indeedee, Basculegion, regional forms, etc. Classify true missing translations versus shared official names before bulk changes.
- Previously green narrower audit: commit `447b398197723e57f54067c8bd3c30e8d00931ae`, https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43419811238 ; 17 Plate labels × seven locales and 18 resistance Berry names × seven locales.
- **v0.183 release closure remains blocked** until exhaustive audit is triaged, corrected, and rerun.

## Backlog: tester feedback and bug-report interface (after engine refactor)

**Status:** planned, not implemented. **Priority:** after engine cleanup/stabilization; target before v1.0 if feasible. Avoid adding a complex submission backend during the v0.183 localization closure.

**Purpose:** let testers report damage mismatches, UI defects, translations, and feature requests directly from Damage Lab, similar to a blog comment form but structured for reproduction.

**MVP requirements:**
1. Entry point: unobtrusive `Report a problem / Feedback` button; localized for all nine languages.
2. Categories: calculation mismatch, UI/behavior defect, localization error, feature request.
3. Description, expected vs actual behavior, optional contact information and optional screenshot attachment.
4. Automatically attach **version, locale, relevant calculation inputs and selected Pokémon/move/abilities/items/weather/field** with an explicit preview and user consent. Never silently collect sensitive personal data.
5. Submission backend with spam/rate limiting, validation, moderation and abuse reporting. GitHub Issues integration **must use a trusted server or authenticated integration**; never embed a GitHub token in client-side JavaScript.
6. Show confirmation with a reference ID; optional status tracking: received, investigating, fixed. Keep reports private by default; publish only after review.
7. Acceptance tests for mobile/Android, all nine locales, empty/invalid input, duplicate submissions, privacy, and error handling.

**Design decision to revisit after engine refactor:** hosted form vs dedicated issue intake endpoint vs GitHub Discussions/Issues. Compare maintenance burden, screenshot support, privacy, spam protection, and moderation cost before implementation.

**Release order:** complete v0.183 localization audit → refactor/stabilize calculation engine → implement minimal tester feedback intake → test → consider v1.0 readiness.
