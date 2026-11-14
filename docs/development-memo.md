## 2026-11-14: v0.186 audit results — development candidate, final owner approval pending

- Issue #61 / Draft PR #62 / `audit/v0186-accuracy-mechanics`. Public main remains v0.185 Pre-Release 31 at `2fc88af6390f286fa7d1a531203f99c35dfa6767`. No Cloudflare production changes, roster expansion, new mechanic implementation, rename or URL changes.
- The [complete inventory](v0186-mechanics-coverage.md) has 1,184 scoped audit entries: Verified 870, Unverified 2, Partial 153, Unsupported 143, Not Applicable 16, current confirmed Incorrect 0. Partial/unsupported entries are not added as features to increase the figures. Presence and verification rates have separate, explicit denominators.
- [24 recorded corrections](v0186-defect-register.md) cover two calculation failures, existing modifier/order/rounding issues, Unaware stat-source precedence, multi-hit consumable/full-HP effects, move tags and existing Mega Staraptor type data. The original 300 fixtures remain immutable: 269 unchanged, 26 independently justified numeric corrections, 5 trace/metadata corrections.
- The audit-only reference is pinned to `@smogon/calc@0.12.0`, including Champions generation 0 and separately identified Gen9 comparisons. All 335 registered move type/category/power records match those references. All 15 known Champions power differences are retained, not overwritten with Gen9 values.
- Checkpoint `05c043a823af09efac6007384f9f8515a50ba5eb` was retrieved directly from GitHub: all six existing mandatory workflows plus the new v0.186 audit completed successfully. Additional test/document commits still require their own exact-head CI checks; this checkpoint does not substitute for them.
- [Champions parity](v0186-champions-parity.md) and [hardware plan](v0186-hardware-test-plan.md) separate software parity from real-game evidence. **Owner clarification (2026-11-14): Dudunsparce is absent from current Champions; the supplied SpA105 image is SV mode. H01 no longer blocks the current release. Keep candidate SpA58 Unverified and reopen before future roster adoption; do not infer a Champions stat or rule change.** Extreme non-battle manual-stat overflow boundaries are also not certified.
- The current-rule source-scope hold is resolved. The development candidate remains subject to exact-head CI and the owner's final merge/publication approval. v0.187 Singularity branding/URL preparation is the next theme after v0.186 review; no branding work is performed in v0.186.

## 2026-11-14: v0.186 Accuracy & Mechanics Audit — confirmed owner scope

- Baseline/public release: v0.185 Pre-Release 31, `2fc88af6390f286fa7d1a531203f99c35dfa6767`; PR #59 / Issue #58 completed. Actual private intake, owner moderation, approved Issue export and duplicate prevention were verified; production remains intact.
- Issue #61; branch `audit/v0186-accuracy-mechanics`. Audit all registered data and existing calculation paths; reproduce and fix existing defects with independently justified expectations.
- No new Pokémon, moves, abilities, items, rules, major UI changes, rename, repository/URL changes or Cloudflare production changes. Main merge and publication require a new final owner approval for v0.186.
- Required evidence: `v0186-mechanics-coverage.md`, `v0186-champions-parity.md`, `v0186-hardware-test-plan.md`, deterministic seeded differential tests, nine-language numeric/feedback regressions and dedicated CI alongside all six existing mandatory workflows.
- Verified/Unverified/Incorrect/Partial/Unsupported/Not Applicable describe defined automated coverage. Hardware evidence is a separate column; imported data and passing regressions are not hardware certification.
- v0.187 prepares the agreed Singularity direction: independent calculator under Chloha Labs, candidate free `/singularity/` URL, Orbital S, black/white/neon pink and legacy-user migration. Validate and obtain formal adoption approval then; implement none of it in v0.186.

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

**Status:** implemented in PR #59 (Issue #58); the owner subsequently authorized publication. Release candidate: v0.185 Pre-Release 31. Private production connection and real-service acceptance remain prerequisites. See `docs/v0185-feedback-design.md`, `docs/v0185-feedback-operations.md` and `docs/v0185-release-readiness.md`. The latest owner brief replaces screenshot uploads with optional, explicitly reviewed calculation snapshots and optional email. No file upload or public report/status lookup is included.

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
