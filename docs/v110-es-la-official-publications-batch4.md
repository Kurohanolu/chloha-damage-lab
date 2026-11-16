# ES-LA official publication expansion, batch 4

Baseline: published pre.5 `82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74`. Scope: existing canonical names only.

## Result and scope

52 new publication attestations cover 51 existing name identities. There are 49 newly official entries and one existing official entry upgraded to Champions-specific evidence. The overlapping Pokémon/forms view is not double-counted. Display names and aliases change for zero entries.

| Metric | Before | After |
|---|---:|---:|
| Registered denominator | 1,029 | 1,029 |
| Official evidence, all stated scopes | 156 (15.16%) | 205 (19.92%) |
| Official Champions evidence | 147 (14.29%) | 152 (14.77%) |
| Unverified names after publication evidence only | 712 | 663 |

**28 of the new confirmations are generic official franchise spellings**, not game-specific evidence. They explicitly retain `targetGame: Generic Pokémon franchise`, `officialChampions: false`. Other non-Champions additions are official Z-A material. The Champions press subsection confirms exactly Mega-Lucario Z, Mega-Garchomp Z, Mega-Absol Z, Baxcalibur and Rillaboom. Heatran is mentioned but is not added to the inventory.

The Charizard gift pairs exact ES-MX move names with the same official English gift: Rayo Solar / Solar Beam, Lanzallamas / Flamethrower, Corte Aéreo / Air Slash. Explicit secondary Champions evidence for Corte Aéreo still outranks the added official Z-A attestation, so its selected status remains verified-secondary. No different game, regional page, announcement of availability or descriptive attack prose is silently treated as Champions name confirmation.

## Sources

- `pre6-za-mega-pokemon`: [Official Z-A Latin American Pokémon names](https://legends.pokemon.com/es-mx/mega-pokemon); Pokémon LEGENDS Z-A. Official regional page text retrieved through web search/open; direct HTTP can return a script-only response.
- `pre6-za-dlc`: [Official Z-A Latin American Pokémon names](https://legends.pokemon.com/es-mx/dlc); Pokémon LEGENDS Z-A. Official regional page text retrieved through web search/open; direct HTTP can return a script-only response.
- `pre6-za-mega-stones`: [Official Z-A Latin American Pokémon names](https://legends.pokemon.com/es-mx/news/mega-stones); Pokémon LEGENDS Z-A. Official regional page text retrieved through web search/open; direct HTTP can return a script-only response.
- `pre6-generic-mega`: [Official Latin American Mega Evolution name gallery](https://mega.pokemon.com/es-mx/); Generic Pokémon franchise. Direct official HTML and independently read parsed web page; visible América Latina region label.
  Accepted direct HTML SHA256: `ab3b6375ae3d70ed24a6456a1b1f5a2c30ed4384330d5b3c0c99e1179095f493`.
- `pre6-champions-worlds`: [PokémonXP and Worlds 2026 announcement: Champions subsection](https://press.pokemon.com/es-MX/releases/Pokemon-Celebrates-30-Years-with-New-Announcements-at-Inaugural-Pokemo); Pokémon Champions. Direct official ES-MX HTML; only the Champions subsection is used.
  Accepted direct HTML SHA256: `a9d9bcf83985af3d829f450b60f18ca9bbb530e876bad94752f46df99d3ce2af`.
- `pre6-za-charizard-gift`: [Receive an Alpha Charizard: named Pokémon and moves](https://legends.pokemon.com/es-mx/news/get-alpha-charizard); Pokémon LEGENDS Z-A. Official regional page text retrieved through web search/open; direct HTTP can return a script-only response.
- `pre6-za-charizard-gift-en`: [Same Charizard gift: canonical English move identities](https://legends.pokemon.com/en-us/news/get-alpha-charizard?pubDate=20251209); Pokémon LEGENDS Z-A. Official regional page text retrieved through web search/open; direct HTTP can return a script-only response.
- `pre6-za-battle-club`: [Z-A Battle Club: Sceptile, Blaziken and Swampert](https://legends.pokemon.com/es-mx/news/z-a-battle-club-ranked-battles); Pokémon LEGENDS Z-A. Official regional page text retrieved through web search/open; direct HTTP can return a script-only response.
- `pre6-za-vivillon`: [Z-A Spewpa gift and Vivillon challenge](https://legends.pokemon.com/es-mx/news/vivillon-challenge); Pokémon LEGENDS Z-A. Official regional page text retrieved through web search/open; direct HTTP can return a script-only response.

Web-index/parsed-page extraction was used where the direct HTTP response was script-only. Such rejected response hashes are not represented as article hashes. The Mega gallery and Worlds press article were also retrieved as full official HTML. Region labels or regional publication routes were checked. The English gift page confirms identity only, never Spanish wording.

## Canonical observations

| Category | Existing ID | Exact observed name | Evidence scope |
|---|---|---|---|
| pokemon | `mega_charizard_x` | Mega-Charizard X | Pokémon LEGENDS Z-A |
| pokemon | `gw092_23` | Mega-Gardevoir | Pokémon LEGENDS Z-A |
| pokemon | `candidate093_14` | Mega-Ampharos | Pokémon LEGENDS Z-A |
| pokemon | `candidate093_28` | Mega-Altaria | Pokémon LEGENDS Z-A |
| pokemon | `roster_v0104_006` | Mega-Kangaskhan | Pokémon LEGENDS Z-A |
| pokemon | `roster_v0104_019` | Mega-Sableye | Pokémon LEGENDS Z-A |
| pokemon | `mega-absol` | Mega-Absol | Pokémon LEGENDS Z-A |
| pokemon | `mega_garchomp_z` | Mega-Garchomp Z | Pokémon LEGENDS Z-A |
| pokemon | `mega_baxcalibur` | Mega-Baxcalibur | Pokémon LEGENDS Z-A |
| pokemon | `roster_v0104_023` | Mega-Chimecho | Pokémon LEGENDS Z-A |
| pokemon | `roster_v0104_016` | Mega-Delphox | Pokémon LEGENDS Z-A |
| pokemon | `mega_venusaur` | Mega-Venusaur | Generic Pokémon franchise |
| pokemon | `mega_blastoise` | Mega-Blastoise | Generic Pokémon franchise |
| pokemon | `mega_salamence` | Mega-Salamence | Generic Pokémon franchise |
| pokemon | `gw091_01` | Mega-Gengar | Generic Pokémon franchise |
| pokemon | `gw091_04` | Mega-Metagross | Generic Pokémon franchise |
| pokemon | `gw092_17` | Mega-Garchomp | Generic Pokémon franchise |
| pokemon | `gw092_30` | Mega-Scizor | Generic Pokémon franchise |
| pokemon | `candidate093_08` | Mega-Gyarados | Generic Pokémon franchise |
| pokemon | `candidate093_12` | Mega-Slowbro | Generic Pokémon franchise |
| pokemon | `candidate093_16` | Mega-Heracross | Generic Pokémon franchise |
| pokemon | `candidate093_26` | Mega-Medicham | Generic Pokémon franchise |
| pokemon | `candidate093_30` | Mega-Abomasnow | Generic Pokémon franchise |
| pokemon | `roster_v0104_001` | Mega-Beedrill | Generic Pokémon franchise |
| pokemon | `roster_v0104_002` | Mega-Pidgeot | Generic Pokémon franchise |
| pokemon | `roster_v0104_004` | Mega-Alakazam | Generic Pokémon franchise |
| pokemon | `roster_v0104_007` | Mega-Pinsir | Generic Pokémon franchise |
| pokemon | `roster_v0104_008` | Mega-Aerodactyl | Generic Pokémon franchise |
| pokemon | `roster_v0104_010` | Mega-Houndoom | Generic Pokémon franchise |
| pokemon | `roster_v0104_011` | Mega-Tyranitar | Generic Pokémon franchise |
| pokemon | `roster_v0104_014` | Mega-Manectric | Generic Pokémon franchise |
| pokemon | `roster_v0104_018` | Mega-Lopunny | Generic Pokémon franchise |
| pokemon | `roster_v0104_020` | Mega-Sharpedo | Generic Pokémon franchise |
| pokemon | `roster_v0104_021` | Mega-Camerupt | Generic Pokémon franchise |
| pokemon | `roster_v0104_022` | Mega-Banette | Generic Pokémon franchise |
| pokemon | `roster_v0104_024` | Mega-Glalie | Generic Pokémon franchise |
| pokemon | `roster_v0104_025` | Mega-Gallade | Generic Pokémon franchise |
| pokemon | `roster_v0104_027` | Mega-Audino | Generic Pokémon franchise |
| pokemon | `mega-steelix` | Mega-Steelix | Generic Pokémon franchise |
| pokemon | `mega_lucario_z` | Mega-Lucario Z | Pokémon Champions |
| pokemon | `mega_garchomp_z` | Mega-Garchomp Z | Pokémon Champions |
| pokemon | `mega_absol_z` | Mega-Absol Z | Pokémon Champions |
| pokemon | `roster_v0103_15` | Baxcalibur | Pokémon Champions |
| pokemon | `gw091_15` | Rillaboom | Pokémon Champions |
| moves | `solarBeam` | Rayo Solar | Pokémon LEGENDS Z-A |
| moves | `flamethrower` | Lanzallamas | Pokémon LEGENDS Z-A |
| moves | `airSlash` | Corte Aéreo | Pokémon LEGENDS Z-A |
| pokemon | `charizard` | Charizard | Pokémon LEGENDS Z-A |
| pokemon | `gw092_20` | Swampert | Pokémon LEGENDS Z-A |
| pokemon | `roster_v0104_050` | Sceptile | Pokémon LEGENDS Z-A |
| pokemon | `roster_v0105_002` | Blaziken | Pokémon LEGENDS Z-A |
| pokemon | `roster_v0106_040` | Vivillon | Pokémon LEGENDS Z-A |

## Exclusions and remaining gaps

Five Champions strategy articles have official LATAM links but their full LATAM bodies could not be retrieved. Search results substituting Spain articles were rejected. Mega-Greninja’s descriptive water shuriken is not a named-move attestation. No unattested phrase, base species inferred solely from a Mega name, or absent mechanic is added.

Three held-item names remain unverified: Choice Band (こだわりハチマキ), Expert Belt (たつじんのおび), Assault Vest (とつげきチョッキ). If additional game captures are supplied, a separate binding should record exact visible name, description, locale attestation and canonical item. This publication manifest does not claim to have inspected new private images.

All earlier sources and records, all 27 capture bindings, nine-language dictionaries, engine and content IDs are preserved. Historical batch-3 acceptance still runs at its immutable pre.5 commit; current fourth-batch tests enforce preservation and truthful source distinctions. New browser coverage targets 51 identities at two widths, all ten languages, search and saved reload; CI results and final independent review remain prerequisites, not claims made by this document.

A separate [owner-selected item update](v110-es-la-owner-provisional-items.md) reclassifies two remaining item fallbacks as provisional, leaving 661 unverified and two provisional names in the combined candidate. It adds no official confirmations.
