# v1.1.0 ES-LA Source Audit

## Current evidence checkpoint — second batch, 2026-11-16 JST

All **20 original owner screenshots were visually inspected** by the implementation/review team. Original image bytes remain private. The [20-image evidence audit](v110-es-la-owner-screenshot-evidence.md) and [second-batch manifest](data/v110-es-la-owner-captures-batch2.json) record exact visible text, source images, screen positions, existing canonical IDs, exclusions and effect-description context. No language-settings screen was supplied; the owner's ES-LA attestation and consistent regional vocabulary are the recorded locale evidence. Capture dates, game build and platform are not independently established.

The second batch contains 58 system-name observations: 56 registered identities and two off-runtime references, including three abbreviation-only witnesses. Fourteen existing owner records gain additional source references; 44 new records bring the ledger to **1,183 attestations from 60 sources**. Across both batches, deduplication by category and canonical English identity leaves **109 system-name identities: 84 registered and 25 off-runtime**. Six editable party labels from batch one remain context only. Base Floette is an off-runtime species component supporting its registered forms, not a new inventory entry.

Against the published first-batch baseline `83af29133927a19fc7e0f9273c0e194c54384ae5`, official Champions coverage increases **112 → 142 (+30)** and unverified names decrease **739 → 714 (−25)**. Overall official names increase 121 → 151. The unchanged denominator is 1,029 registered names across Pokémon, moves, abilities, items, types, natures and stats. The forms view overlaps Pokémon; UI/warnings are separate and are not added to these totals.

The only display-name change is `firme` → `Firme`, preserving the game field's capitalization. Added aliases are `Floette Flor Eterna`, `At. Esp.` and `Def. Esp.`. Existing parentheses in `Floette (Flor Eterna)` are application composition of separate visible species/form fields, not claimed as an exact single game label. `Expl. Metálica`, `At. Esp.` and `Def. Esp.` attest abbreviations only; they do not upgrade unseen full-name wording. Previous valid evidence remains attached.

Canonical checks resolve `Karatazo` to Brick Break, `Ataque Centrado` to Focus Blast, `Baya Tamar` to Rindo Berry and `Baya Yecana` to Tanga Berry. The eight recorded effect descriptions belong only to the selected move, displayed ability or separate `Baya Caquic` detail panel. They do not verify mechanics or authorize engine changes. `Baya Anjiro` is now fully visible in 32727; the clipped first-batch row remains excluded.

No accepted second-batch name has an unresolved canonical identity. **Additional screenshots requested: 0.** Unverified inventory names remain honestly classified, rather than becoming official through spelling agreement. Existing nine-language dictionaries, registered game data and calculation-engine behavior are unchanged. Fresh CI and final independent review are tracked in the [test report](v110-es-la-test-report.md); older passes below are historical evidence only.

## Historical source audit through first publication

The following sections retain the original web and first-batch evidence checkpoints. Their record counts describe those earlier stages, not the current ledger above.

- Web-source verification: 2026-11-15 (UTC); owner-capture follow-up: 2026-11-16 (JST).
- Audited repository baseline: `5d6a685ceab3cc1fd3db873bd5591a35f0e6fc03`.
- Stable release reference supplied by the owner: `0b270c1452505268364659edd402209b00b28673`.
- Product locale: `es-LA`; browser/HTML/Intl locale: `es-419`; existing `es` is retained.
- This document describes source evidence, not a claim that every registered entity has an independently verified ES-LA name. Runtime coverage is reported separately.

## First owner-capture follow-up

Ten privately retained owner-provided Champions captures add 65 deduplicated system-name attestations, bringing the ledger to **1,139 records from 50 sources**. Forty-one terms intersect the registered inventory; 24 remain reference-only. There are 27 newly official identities and 31 new official Champions confirmations, with no changes to display names, aliases, canonical IDs or support denominators. See the [capture audit](v110-es-la-capture-audit.md) for exact rows, hashes, before/after counts and the language-settings limitation. Six party labels remain identity context because nicknames cannot be excluded. The eighteen observed game UI labels do not upgrade the application UI inventory. Original screenshots are not published.

## Source priority and evidence rules

1. Official Pokémon Champions game wording in reviewed owner-provided ES-LA captures (with locale attestation/settings limitations recorded), or official material in a confirmed Latin American regional route.
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

## Web source inventory at the accepted baseline

Before the owner-capture follow-up, `docs/data/v110-es-la-source-records.json` contained **1,074 attestation records from 40 source records**, not 1,074 distinct supported entities. The same entity can appear in multiple independent or historical attestations. Only the runtime inventory intersection determines product coverage.

| Evidence group | Records | Interpretation |
| --- | ---: | --- |
| Official Champions publications | 101 | Exact regional wording observed in official Champions material; no physical-device claim. |
| Official Z-A publications | 17 | Exact wording observed, with Z-A-only scope retained. |
| Pokéxperto Z-A regional table | 726 | Secondary, potentially unrevealed or game-specific names. |
| Pokéxperto Champions regional records | 219 | Explicit regional differences or individually inspected MX labels. |
| WikiDex Champions paired item names | 11 | Explicit `es-419` name spans, all agreeing with the Z-A comparison. |
| Total | 1,074 | Attestations, including overlap and off-inventory names. |

The 118 official records comprise 33 moves, 13 abilities, 9 items, 13 Pokémon, 23 forms, 17 types, 4 natures and 6 stat labels. Of these, 101 concern Champions and 17 retain Z-A-only provenance. `officialChampions` is true only for the former. Bug/Insecto had no accepted primary attestation in the web-only pass; capture 32686 now supplies game wording.

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

- All 1,074 web-baseline record IDs are unique; all source references resolve; no replacement characters were introduced.
- Every `officialChampions: true` record has `status: official` and `targetGame: Pokémon Champions`.
- Numeric namespaces were reviewed: item/nature IDs initially supplied under a PokeAPI label were corrected to their actual main-series game namespaces, with no conflation of IDs.
- Accepted primary type records do not contain the excluded Bicho/Lucha labels.
- Source data and the audit report are separate from runtime engine files; this research made no calculation-engine change.
- Exact coverage and unresolved-name lists are generated from the registered runtime inventory in the translation coverage report, not from the source table's size.
- Names inherited only from the existing ES dictionary require honest fallback classification.
- No physical Champions screen was inspected in the web-only phase. The follow-up independently inspected ten owner-provided game captures for terminology; no damage-mechanics or physical-device testing of the calculator is claimed.
- No claim is made that third-party Z-A names are a complete or authoritative Champions terminology list.

## Continuation audit (2026-11-15)

The continuation audit re-opened the official Latin American March launch announcement and Nintendo Americas release notes and independently retrieved the indexed Latin American Mega-Emboar article. Representative regional terms and their identities matched the existing source records. All selected and related source-to-runtime mappings were checked for explicit canonical-English identity disagreement; none were found. The compiler now rejects such mismatches even when an ES-ES spelling happens to agree, and generated coverage exposes official Champions counts separately from official Z-A evidence. UI/warning denominators derive from the current inventory instead of fixed prose counts.

Additional official Latin American Feraligatr, Meganium, Malamar, Raichu X, Mawile and regulation M-C article links were followed from <https://champions.pokemon.com/es-mx/news/>. Their bodies returned an anti-bot iframe in this pass. Search results substituted Spain `/es/features/` or English pages for the Feraligatr/Meganium requests; those results were excluded from ES-LA attestations. No new official terms are claimed from unavailable article bodies, and no access protection was bypassed.
