# v0.183 — European official Pokédex audit protocol

## Confirmed findings

The official Pokémon website has regional Pokédex pages for French, German,
Spanish and Italian. The URL path contains the **localized species slug**, not
necessarily the English slug. For example, the official French entry for
National Pokédex #0006 is
https://www.pokemon.com/fr/pokedex/dracaufeu/ and displays “Dracaufeu”.
Do not derive a French/German URL by replacing the locale in an English URL.

## Matching and provenance

1. Match species across languages by National Pokédex number, **not** name.
2. Read each regional official Pokédex listing/detail to obtain the localized
   species name and page URL. Keep the exact URL as provenance.
3. Compare names using Unicode NFC normalization; preserve accents, case,
   punctuation and form designators. Never silently transliterate.
4. Treat base species and Mega/other forms as distinct display-name checks.
   Some form names appear on the same base-species detail page.
5. Record each observation as {nationalDex,locale,officialName,sourceUrl,
   checkedAt}; mark missing/unavailable entries as unverified, not passed.
6. For move/ability/item names, find a separate official source where the
   Pokédex does not provide a complete list. Do not call PokeAPI an official
   Pokémon Company source; it is a useful secondary cross-check.
7. Keep live website access out of the required CI: rate limits, redirects,
   consent flows and site redesigns must not make the build flaky. Use
   reviewed, provenance-backed snapshots as CI fixtures, and run a separate
   optional official-source refresh job only when implemented.

## Existing automated coverage

- 4 European languages × 18 types = 72 official-name assertions.
- Species smoke tests in tests/v0183-nine-locale-roundtrip.cjs.
- 9-locale UI roundtrip, type dropdowns, and damage regression checks.

## Next implementation gates

- Collect numbered official species samples in each of fr/de/es/it.
- Expand reviewed fixtures by National Pokédex number and form.
- Report unverified species, moves, abilities and items separately.
- Start Korean and Simplified/Traditional Chinese official-site audits only
  after the EU audit result is reviewed.
