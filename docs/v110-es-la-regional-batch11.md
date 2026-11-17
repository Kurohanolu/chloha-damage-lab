# ES-LA regional batch 11 (pre.16 candidate, unpublished)

Baseline: published pre.15 `66cae82e10d28ad6115acdacc964fd3e84f51b4a`.

## Independently checked official identities

All six pages were retrieved again on 2026-11-17. The three ES-MX pages have the América Latina region selector; paired EN-US ability fields establish identity. Per-fetch raw HTML hashes and URLs are in [the batch manifest](data/v110-es-la-regional-batch11.json). Dynamic HTML can produce different raw hashes across requests; the exact observed ability fields were unchanged. These are historical Sword/Shield regional publications, **not Champions or physical-game verification**.

| Existing identity | Official LATAM name | English identity source | Change |
|---|---|---|---|
| `りゅうのあぎと` / `dragonsMaw` | [Mandíbula Dragón](https://swordshield.pokemon.com/es-mx/expansionpass/pokemon/regidrago/) | [Dragon’s Maw](https://swordshield.pokemon.com/en-us/expansionpass/pokemon/regidrago/) | Replace English dictionary fallback; retain English alias |
| `かちき` / `unsupported:かちき` | [Tenacidad](https://swordshield.pokemon.com/es-mx/expansionpass/pokemon/galarian-articuno/) | [Competitive](https://swordshield.pokemon.com/en-us/expansionpass/pokemon/galarian-articuno/) | Evidence only; existing name unchanged |
| `まけんき` / `unsupported:まけんき` | [Competitivo](https://swordshield.pokemon.com/es-mx/expansionpass/pokemon/galarian-zapdos/) | [Defiant](https://swordshield.pokemon.com/en-us/expansionpass/pokemon/galarian-zapdos/) | Evidence only; existing name unchanged |

The similar English/Spanish labels do not identify the same ability: **Competitive → Tenacidad; Defiant → Competitivo**. Pairing the same Pokémon's exact ability field, not translating the English word, establishes these bindings.

## Actual product scope

Dragon’s Maw is already in the supported engine catalog, but has **no existing roster association, shared name-search membership or native picker option**. This update corrects its dictionary and latent trace name; it does not make the ability reachable or add Pokémon/abilities. Its stored aliases are `Mandíbula Dragón` and `Dragon's Maw`; absent picker/search membership remains absent.

Competitive and Defiant already occur in roster ability options, but their mechanics are unsupported. Both remain fail-closed when selected. Their names and aliases are unchanged; only the evidence status becomes official historical regional publication. No new reachable display names are claimed.

Unique-name coverage, excluding overlapping forms and authored UI: **485 → 488 / 1,029 (47.13% → 47.42%)** official; **383 → 380** unverified. Champions-specific official count stays **162**. Denominators, canonical IDs, other nine-language resources, mechanics, count controls and feedback protections remain unchanged.

## Verification

- PASS bounded batch11 contract: exactly three additive records/sources, one exact dictionary/alias change, two evidence-only changes, all other entry data and Champions flags preserved.
- PASS browser-test syntax. Added 60 browser cases: 20 catalog-only numerical/state/save cases plus 40 native unsupported/save cases across ten locales and two widths. Local execution was attempted but stopped at browser launch: the bundled Chromium executable is missing, and the available system Chromium is blocked by the environment socket restriction even on an approved escalated retry. No browser assertions ran. Fresh CI/browser execution remains required; test creation is not a pass.
- Generated dictionary, UI inventory and coverage rebuilt; metadata changes require a final regeneration/check.
- Independent final release audit, all required CI, formal publication gates and live verification remain pending. No publication is claimed.
