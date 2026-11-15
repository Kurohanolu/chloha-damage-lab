# v1.1.0 ES-LA Source Audit

- Verification date: 2026-11-15 (UTC).
- Audited repository baseline: `5d6a685ceab3cc1fd3db873bd5591a35f0e6fc03`.
- Stable release reference supplied by the owner: `0b270c1452505268364659edd402209b00b28673`.
- Product locale: `es-LA`; browser/HTML/Intl locale: `es-419`; existing `es` is retained.
- This document describes source evidence, not a claim that every registered entity has an independently verified ES-LA name. Runtime coverage is reported separately.

## Source priority and evidence rules

1. Official Pokémon Champions material in a confirmed Latin American regional route.
2. Official Pokémon Latin American material, with the actual game/scope recorded.
3. A reliable third-party comparison with an explicit regional column, attributed to that source and game.
4. Existing ES-ES names as a visibly classified fallback.

The official Champions site has a distinct `/es-mx/` route, while Pokémon's regional editorial pages use `/el/`. Search results sometimes substitute `/es-es/` or `/es/` articles. Those substitutions do **not** verify ES-LA wording. The Pokémon press site also has an `/es-MX/` route.

An `official` record means that the exact term was observed in official material within the recorded scope. It does not mean a physical-device test occurred. A `verified-secondary` record means that the term was checked in an identified secondary source; it does not mean official Champions verification. ES-ES fallback alone remains `unverified`, and a locally written UI translation is `provisional` unless independently checked.

Names and short factual mappings are recorded, rather than copies of source articles. URLs, retrieval date, target game, source identifier and numeric namespace accompany the records.

## Pokéxperto regional comparison

- URL: <https://www.pokexperto.net/index2.php?seccion=switch/leyendas_za/diferencias_espanol_latino>
- Source title: Diferencias en la Traducción al Español Latino.
- Source update label: 2025-10-15 21:27; timezone is not specified by the source.
- Target game: Pokémon LEGENDS Z-A.
- Source regional label: ES-MX. This is recorded as source terminology and mapped to the application's ES-LA profile, without changing the source's claimed scope.
- Retrieved HTML SHA-256: `1bab4f7f4f649378de336389e347ec92134a682b492d846e14212c4631cf5558`.
- Input encoding: Windows-1252. Extraction preserves Unicode accents in UTF-8 output.

The table contains six logical columns with two independently changing category headers. Extraction checked all row widths, duplicate category/ID combinations and encoding. Trainer classes, ribbons and marks are outside this calculator's requested scope and were excluded.

| Category | Attested difference records |
| --- | ---: |
| Moves | 264 |
| Items | 404 |
| Abilities | 51 |
| Types | 2 |
| Natures | 5 |
| Total | 726 |

The 404 item records comprise 400 game item IDs and four berry-index records. They are not necessarily 404 distinct registered calculator items. The full source includes many inventory items that the calculator does not expose; runtime coverage must intersect records with the actual registered inventory.

The page warns that some translated terms, especially abilities absent from Z-A gameplay, are unrevealed and may change. All these mappings retain `verified-secondary`, `targetGame: Pokémon LEGENDS Z-A` and `officialChampions: false`. The source's statement that omitted names match between variants is **not** used to count unlisted individual names as independently verified.

## Numeric namespaces and identity

| Record type | Namespace | Integration requirement |
| --- | --- | --- |
| Moves | `pokemon-game-move-id` | Check the existing canonical move before adoption. |
| Abilities | `pokemon-game-ability-id` | Check the existing canonical ability before adoption. |
| Items | `pokemon-game-item-id` | Do not assume equality with PokeAPI item IDs or Champions-specific item indices. |
| Berries | `pokemon-berry-index` | A berry index is not an item ID. |
| Types | `pokemon-game-type-id-zero-based` | Fighting is 1; Bug is 6. |
| Natures | `pokemon-game-nature-id-zero-based` | Preserve the actual source index namespace. |

`sourceCatalogMatches` are unique case-folded exact matches against the existing ES name catalog. They are candidate evidence for mapping, **not** runtime canonical identifiers. Only the integration step may populate `canonicalMatches` using the actual registered runtime IDs. A translated display string must never become a calculation-engine key.

The interim secondary dataset has 112 move, 283 item and 37 ability records with one exact ES catalog match, and no ambiguous matches. These counts concern the broad existing name catalog, not the actual selector inventory.

## Representative regional differences

| Category | ES-ES | ES-LA | Evidence scope |
| --- | --- | --- | --- |
| Type | Lucha | Pelea | Z-A regional table; official Champions strategy text also attests Pelea. |
| Type | Bicho | Insecto | Z-A regional table. |
| Move | Envite Ígneo | Erupción | Z-A table, move 394; official Champions regional article corroborates the term. |
| Move | A Bocajarro | Cuerpo a Cuerpo | Z-A table and official Champions regional article. |
| Move | Vozarrón | Hipervoz | Z-A table and official Champions regional article. |
| Ability | Mar Llamas | Mar de Llamas | Z-A table and official Champions regional article. |
| Item | Baya Zidra | Baya Citrón | Z-A table and official Champions regional article. |

Identity disambiguation matters: `Erupción` here refers to Flare Blitz, not to the English move Eruption. The existing ES name for Eruption is `Estallido`. The mappings must follow canonical IDs, rather than an English-looking translation.

## Final source inventory

`docs/data/v110-es-la-source-records.json` contains **1,074 attestation records from 40 source records**, not 1,074 distinct supported entities. The same entity can appear in multiple independent or historical attestations. Only the runtime inventory intersection determines product coverage.

| Evidence group | Records | Interpretation |
| --- | ---: | --- |
| Official Champions publications | 101 | Exact regional wording observed in official Champions material; no physical-device claim. |
| Official Z-A publications | 17 | Exact wording observed, with Z-A-only scope retained. |
| Pokéxperto Z-A regional table | 726 | Secondary, potentially unrevealed or game-specific names. |
| Pokéxperto Champions regional records | 219 | Explicit regional differences or individually inspected MX labels. |
| WikiDex Champions paired item names | 11 | Explicit `es-419` name spans, all agreeing with the Z-A comparison. |
| Total | 1,074 | Attestations, including overlap and off-inventory names. |

The 118 official records comprise 33 moves, 13 abilities, 9 items, 13 Pokémon, 23 forms, 17 types, 4 natures and 6 stat labels. Of these, 101 concern Champions and 17 retain Z-A-only provenance. `officialChampions` is true only for the former. Bug/Insecto has no accepted primary attestation in this pass.

Primary Champions evidence includes the official Latin American Mega-Emboar team article, `/es-MX/` launch announcements and Nintendo Americas' Champions release notes. The six Nintendo move names were checked against the paired English release notes to identify the entities. Parallel English/Portuguese material is identity evidence, not ES-LA wording evidence. Search-index retrieval was used when an official editorial page returned an anti-bot iframe; that limitation is recorded in the source entry. No authentication or access protection was bypassed.

Sources with direct entity wording include:

- <https://www.pokemon.com/el/destacados/pokemon-champions-como-crear-un-equipo-con-mega-emboar>
- <https://press.pokemon.com/es-MX/Pokemon-Champions-Launches-April-8-on-Nintendo-Switch>
- <https://press.pokemon.com/es-MX/Pokemon-Champions-Launches-June-17-on-iOS-and-Android-Devices-The-Poke>
- <https://es-americas-support.nintendo.com/app/answers/detail/a_id/71627/p/1076/c/950>
- <https://www.pokexperto.net/index2.php?seccion=pokemonchampions/movimientos>
- <https://www.pokexperto.net/index2.php?seccion=pokemonchampions/habilidades>
- <https://www.pokexperto.net/index2.php?seccion=pokemonchampions/objetos>
- <https://www.wikidex.net/wiki/Lista_de_objetos_de_Pok%C3%A9mon_Champions>

The complete source list, individual source references, exact dates, target games and retrieval hashes where available are in the JSON. A broad PokeChamps `es-419` catalog was investigated but not adopted because its localization provenance could not be established. Pokéxperto's robots declaration disallows ChatGPT-User, so no bulk direct crawl was launched. Already retrieved master lists and bounded publicly indexed detail-page verification supplied the Champions records. Single-name master-list rows were not blanket-counted as verified ES-LA agreement.

## Resolved conflicts and scope priority

Official status and game applicability are separate dimensions. A generic official web label must not silently override a newer game-specific regional label.

| Entity | Earlier or conflicting evidence | Adopted Champions wording | Resolution |
| --- | --- | --- | --- |
| Fighting type | Generic/older marketing `Lucha` | `Pelea` | Official Champions team article confirms Pelea. |
| Bug type | Generic official Pokédex `Bicho` | `Insecto` | Regional Z-A table and Champions item description agree; retained as secondary, not primary. |
| Iron Defense, move 334 | Z-A `Defensa Hierro` | `Defensa de Hierro` | Explicit MX label on the Champions detail page. |
| Leaf Storm, move 437 | Z-A `Tormenta Hojas` | `Tormenta de Hojas` | Explicit MX label on the Champions detail page. |
| Petal Blizzard, move 572 | Z-A `Tormenta Pétalos` | `Tormenta de Pétalos` | Explicit MX label on the Champions detail page. |

The three older Z-A move records are retained with `supersededForChampionsBy`; they are historical or search-alias evidence, not preferred display wording. The two excluded official-web labels live in `observedConflicts`, outside accepted term records. Runtime integration must honor this distinction.

Bounded detail verification also confirmed the following mappings that the existing bulk ES catalog could not reliably supply: Thunderbolt → Atactrueno; Darkest Lariat → Lariat Oscuro; High Horsepower → Fuerza Equina; Grav Apple → Fuerza G; Triple Arrows → Triple Flecha. New ability identities were disambiguated as Eelevate → Impulso Anguila (313), Fire Mane → Melena de Fuego (316), and Aura Guard → Aura Protectora (319). These are secondary Champions attestations, not newly claimed official names.

## Validation and remaining limits

- All 1,074 record IDs are unique; all source references resolve; no replacement characters were introduced.
- Every `officialChampions: true` record has `status: official` and `targetGame: Pokémon Champions`.
- Numeric namespaces were reviewed: item/nature IDs initially supplied under a PokeAPI label were corrected to their actual main-series game namespaces, with no conflation of IDs.
- Accepted primary type records do not contain the excluded Bicho/Lucha labels.
- Source data and the audit report are separate from runtime engine files; this research made no calculation-engine change.
- Exact coverage and unresolved-name lists are generated from the registered runtime inventory in the translation coverage report, not from the source table's size.
- Names inherited only from the existing ES dictionary require honest fallback classification.
- No physical Champions screen was inspected in this source audit.
- No claim is made that third-party Z-A names are a complete or authoritative Champions terminology list.

## Continuation audit (2026-11-15)

The continuation audit re-opened the official Latin American March launch announcement and Nintendo Americas release notes and independently retrieved the indexed Latin American Mega-Emboar article. Representative regional terms and their identities matched the existing source records. All selected and related source-to-runtime mappings were checked for explicit canonical-English identity disagreement; none were found. The compiler now rejects such mismatches even when an ES-ES spelling happens to agree, and generated coverage exposes official Champions counts separately from official Z-A evidence. UI/warning denominators derive from the current inventory instead of fixed prose counts.

Additional official Latin American Feraligatr, Meganium, Malamar, Raichu X, Mawile and regulation M-C article links were followed from <https://champions.pokemon.com/es-mx/news/>. Their bodies returned an anti-bot iframe in this pass. Search results substituted Spain `/es/features/` or English pages for the Feraligatr/Meganium requests; those results were excluded from ES-LA attestations. No new official terms are claimed from unavailable article bodies, and no access protection was bypassed.
