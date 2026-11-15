# v0.188 locale and feedback evidence

This evidence describes the candidate branch. It does not authorize production publication or certify all dictionary entries as official spellings.

## Reproducible checks

- `node tests/v0188-locale-reference.cjs`: PASS locally. Seven representative entities × nine languages = 63 externally sourced name comparisons and catalog-search checks; two type labels × nine languages additionally compared.
- `node tests/v0188-locale-quality.cjs`: PASS locally. Nine-language Spit Up charge labels/power notes and stat-point range/budget error copy; canonical move names reused; explicit localized missing-name text.
- `node tests/v0188-locale-feedback-browser.cjs`: added for CI. Local launch is blocked by the managed environment's Chromium socket restriction, so no local browser PASS is claimed.
- Existing `tests/v0183-nine-locale-roundtrip.cjs` remains intact and retains its 90-transition coverage.
- `npm test --prefix services/feedback`: 15/15 PASS, zero skipped/cancelled, on 2026-11-15. This is the local Worker/SQLite harness with synthetic Turnstile, JWT and GitHub behavior; it is not a new real-service acceptance.
- `node scripts/feedback-production-check.cjs`: read-only production readiness 10/10 PASS on 2026-11-15. The command only performs GET requests, sends no admin credentials and creates no report.

The new browser test exercises all nine locales: real Pokémon/move autocomplete queries using external reference names, corresponding selections, native ability/item option labels and values, external type labels, empty searches, localized provisional warnings, reload and full numeric output equivalence, invalid stat allocation, three Spit Up charge states, feedback required-field/email errors, local 503 failure with no false success, pending duplicate-submit suppression, local-only successful receipt, calculator invariance, and exclusion of feedback descriptions/email/tokens from browser persistence.

Ability and item inputs are native select controls. Their translated option labels and selection are tested in the browser; multilingual free-text lookup of their catalog entries is separately tested at the common search-engine layer. This does not claim that an additional dedicated free-text ability/item widget exists.

## Independently retrieved name reference

`tests/v0188-locale-reference.json` was transcribed programmatically from the upstream PokeAPI repository, not regenerated from the application's own dictionaries. Source retrieved on 2026-11-15 and pinned to commit:

`8a92bfa7dab2f12b84b5d151562f9857c133ff30`

- [Pokémon species names](https://github.com/PokeAPI/pokeapi/blob/8a92bfa7dab2f12b84b5d151562f9857c133ff30/data/v2/csv/pokemon_species_names.csv): Garchomp (#445), Dragonite (#149).
- [Move names](https://github.com/PokeAPI/pokeapi/blob/8a92bfa7dab2f12b84b5d151562f9857c133ff30/data/v2/csv/move_names.csv): Earthquake (#89), Flamethrower (#53).
- [Ability names](https://github.com/PokeAPI/pokeapi/blob/8a92bfa7dab2f12b84b5d151562f9857c133ff30/data/v2/csv/ability_names.csv): Intimidate (#22), Levitate (#26).
- [Item names](https://github.com/PokeAPI/pokeapi/blob/8a92bfa7dab2f12b84b5d151562f9857c133ff30/data/v2/csv/item_names.csv): Life Orb (#247).
- [Type names](https://github.com/PokeAPI/pokeapi/blob/8a92bfa7dab2f12b84b5d151562f9857c133ff30/data/v2/csv/type_names.csv): Ground (#5), Dragon (#16).
- [PokeAPI documentation](https://pokeapi.co/docs/v2): describes the localized-name resources.

PokeAPI is a community-maintained primary dataset, not the Pokémon publisher. The application bulk dictionary historically used PokeAPI; this fresh pinned retrieval is an independent version-and-spelling comparison, not a wholly independent linguistic authority.

The Japanese [official Pokémon Pokédex page for #445](https://zukan.pokemon.co.jp/detail/0445) was directly checked and confirmed ガブリアス, ドラゴン and じめん. French/German pokemon.com pages encountered Imperva checks; their inaccessible live content was not used as proof, and no bypass was attempted. Remaining entities/locales were not all independently confirmed against publisher-controlled pages. Prose translations in the new UI-only module are reviewable text, not claimed as publisher-authorized terminology.

## Additional defects addressed

Source inspection found the Spit Up panel used English-only branching and Japanese text for the other seven non-Japanese locales inside a translation-excluded subtree. The new `locale-quality-v0188.js` uses the current locale and the existing canonical Spit Up move-name dictionary, then supplies localized descriptive charge/count/power text. This avoids a second entity-name catalog.

The same UI module localizes the existing stat-point 0–32 integer errors and 66-total budget errors in the result/error/status presentation. It observes only the relevant UI nodes and does not change validation rules or calculations. Unsupported error kinds continue through the existing renderer. Tests retain invalid-input rejection and hiding of stale results.

The first candidate CI also exposed a latent summary-translation gap after persistence retained Charizard across reload. The old summary translator requires a space before numeric brackets; the original UI emits none before its fullwidth brackets and looks up species by Japanese name against an ID-keyed dictionary. The new UI-only module resolves displayed summary names from canonical selected IDs, accepts both bracket styles, and preserves every numeric group. Targeted tests assert English Charizard/Earthquake summaries before reload, after reload and after Japanese/English switching, with identical calculation state.

The first added browser-test run failed because its native-ability setup asked Tyranitar to expose Intimidate/Levitate. The setup now selects the appropriate species through localized defender search (Gyarados/Hydreigon) before checking those options. The requested value is explicitly asserted rather than silently becoming an empty selection. Spit Up is selected through its actual localized search result and canonical value is asserted.

## Real-service boundary

Read-only readiness verified public configuration, production-enabled intake without known Turnstile test keys, retention=90, exact frontend CORS origin, no-store, denial of anonymous access to three administrator endpoints, and absence of a public reports listing.

A separate read-only CORS probe on 2026-11-15 returned:

| Origin | GET configuration | OPTIONS report endpoint | Access-Control-Allow-Origin |
| --- | --- | --- | --- |
| Allowed frontend origin | 200 | 204 | Exact requested origin |
| Untrusted test origin | 403 | 403 | Absent |

All four responses specified `no-store, private`. No POST was made.

[Issue #65](https://github.com/Kurohanolu/chloha-damage-lab/issues/65) remains the existing synthetic acceptance record. Its current public state was checked as open with unchanged update timestamp 2026-11-15T01:14:16Z. This work created no new production report/Issue and did not modify D1, Access, Worker or authentication settings. The earlier v0.187 D1 acceptance evidence is reused; this phase does not claim a fresh D1 re-query, authenticated admin replay, real Turnstile submission or deployed-Worker byte comparison.

CI execution links and browser evidence must be attached to the final candidate SHA by the release owner before independent re-audit. The presence of the test files alone is not a PASS.

