# Localization data source policy — v0.179

## Reference sources
- Pokémon Showdown damage calculator and `smogon/damage-calc`: English naming conventions, canonical battle identifiers and calculation comparisons.
- PokéAPI localized `names` fields: Japanese/English species, moves, abilities, items and types where available.
- Official game text and human review: fallback for new Pokémon Champions forms, Mega Evolutions, missing names or source conflicts.

## Architecture
- Keep an immutable internal battle ID independent of display language.
- Maintain explicit `id -> {ja,en}` display-name maps for species/forms, moves, abilities and items.
- Search by either language and aliases, but calculate only with canonical IDs.
- Never infer learnsets, legality, availability or damage mechanics from a translation record.
- Track source/version, missing entries and collisions; do not guess translations.
- Cache validated name tables with the release instead of fetching them on every calculation.

## Acceptance checks
- Japanese/English switching preserves selections, calculated damage and all sixteen rolls.
- Japanese and English queries resolve to the same ID.
- Alternate forms (including Mega) map uniquely.
- Missing translations remain clearly marked and do not break calculations.

Sources: https://github.com/smogon/damage-calc and https://pokeapi.co/docs/v2
