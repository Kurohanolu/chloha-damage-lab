# ES-LA Champions owner-capture audit — 2026-11-16

This follow-up uses ten owner-provided Pokémon Champions screenshots as evidence for visible game terminology. It extends PR #68 from accepted checkpoint `a70b45674c66dcfd7b87321c9f012dd36637c3f2`. It does not authorize publication or verify damage mechanics on hardware.

## Evidence and privacy boundary

The owner identifies the captures as ES-LA; their regional vocabulary is consistent with that identification. The language-settings screen is not included. The date below is the date supplied and reviewed (JST); the capture timestamp itself is unknown. This qualification accompanies every source rather than silently treating a settings screen as observed.

The original images remain private. No image, image derivative, Library identifier, access token, private download link or player name is copied into this repository. The public evidence consists of readable terminology, canonical identity anchors, original filename, SHA-256 and this audit trail. Source URLs pointing here identify the public attestation document, not a publicly accessible original image.

Primary evidence is the official game's displayed text, supplied by the owner. The implementation review and the earlier [Sol visual transcription](evidence/v110-owner-captures/independent-transcription.md) record inspection of the originals. The subsequent [Sol code/data review](evidence/v110/sol-owner-capture-review.md) did not have the originals and does not constitute another image inspection. `official` / `officialChampions` apply only to terms with a secure canonical identity. This verifies names, not calculation support, damage values, game availability for the entire roster, or the correctness of all application UI copy.

## Decisions from direct inspection

- Farigiraf's central item field is **Baya Citrón**, and Sneasler's is **Hierba Blanca**. The handoff memo lists the six held items as a group; its list order is not a per-species mapping. An initial agent inference from that order was corrected using the originals.
- **Baya Drasi** is fully visible in the seventh berry row of `32684.jpg`. It is included. The next row below it is clipped and is excluded; it is not inferred from its icon or partial text.
- **Liviano** maps to `Unburden` / `かるわざ`, not `Levitate`. Its existing `unsupported:かるわざ` identity remains unsupported by the calculation engine.
- **Electrocañón** maps to `Zap Cannon`, **Ataque Centrado** to `Focus Blast`, and **Fuerza Psíquica** to `Psychic`. The selected species, displayed move type, PP and existing canonical dictionaries are corroborating anchors; translated labels do not become engine IDs.
- **Baya Hibis**, **Baya Acardo**, **Baya Pomaro** and **Baya Drasi** map to Roseli, Shuca, Chople and Kasib respectively. **Refleluz** maps to Light Clay in the existing broader name catalog; it does not add a new calculator item.
- The six selected Pokémon names are retained as identity context. Team-slot names can be individual nicknames; these images do not establish that default localized species labels are being shown. They do not promote species-name coverage. No additional screenshot request is made.
- Uppercase type labels are preserved verbatim in the observations. The existing title-case display uses explicitly recorded case-only normalization; accents and spelling are preserved.
- Game UI observations are stored separately from game-entity attestations and from the application's provisional UI inventory. An observed game menu label does not make an entire software UI translation official.

Two identity-sensitive move witnesses retain their visible numeric context here: capture `32690` shows **Electrocañón**, the Electric move icon and **8/8 PP**; capture `32692` shows **Fuerza Psíquica**, the Psychic move icon and **12/12 PP**. These are corroborating identity observations only. They do not change the calculator's power, accuracy, PP, learnset or mechanics data.

## Coverage and validation

The machine-readable [capture observations](data/v110-es-la-owner-captures.json) preserve deduplication, source placement, canonical IDs and dispositions. [Generated coverage](v110-es-la-translation-coverage.md) counts each registered identity once even when several captures or publications attest it. Terms outside the existing runtime inventory remain reference evidence; they do not increase calculator support or its coverage denominators.

The current follow-up's exact commit, CI conclusions and independent review are recorded with [PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68). Earlier acceptance evidence under `docs/evidence/v110/` remains explicitly bound to its original implementation and is not substituted for a new source-data run. The [test report](v110-es-la-test-report.md) records the follow-up validation scope.

## Before and after registered coverage

| Category | Total | Official before → after | Official Champions before → after | Unverified before → after |
|---|---:|---:|---:|---:|
| pokemon | 373 | 31 → 31 | 24 → 24 | 342 → 342 |
| moves | 335 | 23 → 34 | 22 → 33 | 202 → 194 |
| abilities | 245 | 13 → 19 | 13 → 19 | 190 → 184 |
| items | 41 | 0 → 9 | 0 → 9 | 21 → 13 |
| types | 18 | 17 → 18 | 12 → 17 | 0 → 0 |
| forms | 134 | 20 → 20 | 13 → 13 | 114 → 114 |
| natures | 11 | 4 → 4 | 4 → 4 | 6 → 6 |
| stats | 6 | 6 → 6 | 6 → 6 | 0 → 0 |
| ui | 1011 | 0 → 0 | 0 → 0 | 0 → 0 |
| warnings | 169 | 0 → 0 | 0 → 0 | 0 → 0 |

The 65 deduplicated system terms yield 41 registered identity attestations and 24 off-runtime references. Among registered identities, 27 newly become official and 31 newly gain official Champions evidence; these measures overlap and are not summed. The remaining ten of the 41 already had official Champions evidence and gain another source. Unverified registered names fall by 22. No registered display string, alias set, canonical ID or inventory denominator changes. Forms overlap Pokémon; warning sites overlap UI. The ledger now contains 1,139 records from 50 sources.

## Canonical term inventory

Only accepted system-owned observations appear in these tables. The six party labels and eighteen game UI observations remain separately classified in the JSON. “Reference only” means no registered calculator ID is added.

### moves

| Readable game text | Canonical identity | Existing runtime IDs | Capture numbers |
|---|---|---|---|
| Huracán | Hurricane / ぼうふう | `gw0170c_003` | 32686 |
| Viento Afín | Tailwind / おいかぜ | Reference only | 32686 |
| Somnífero | Sleep Powder / ねむりごな | Reference only | 32686 |
| Protección | Protect / まもる | `protect` | 32686, 32690, 32692, 32694, 32696 |
| Garra Nociva | Dire Claw / フェイタルクロー | `gw0170_s024` | 32688 |
| Cuerpo a Cuerpo | Close Combat / インファイト | `closeCombat` | 32688 |
| Avalancha | Rock Slide / いわなだれ | `rockSlide` | 32688 |
| Sorpresa | Fake Out / ねこだまし | `v096_095` | 32688 |
| Electrocañón | Zap Cannon / でんじほう | `gw0169_s032` | 32690 |
| Ataque Centrado | Focus Blast / きあいだま | `gw0169_s013` | 32690 |
| Otra Vez | Encore / アンコール | Reference only | 32690 |
| Fuerza Psíquica | Psychic / サイコキネシス | `psychic` | 32692 |
| Hipervoz | Hyper Voice / ハイパーボイス | `hyperVoice` | 32692 |
| Espacio Raro | Trick Room / トリックルーム | Reference only | 32692 |
| Genufendiente | Kowtow Cleave / ドゲザン | `gw0169_p075` | 32694 |
| Golpe Bajo | Sucker Punch / ふいうち | `suckerPunch` | 32694 |
| Patada Baja | Low Kick / けたぐり | `gw0169_p040` | 32694 |
| Ventisca | Blizzard / ふぶき | `blizzard` | 32696 |
| Liofilización | Freeze-Dry / フリーズドライ | `gw0169_s052` | 32696 |
| Esquirla Helada | Ice Shard / こおりのつぶて | `gw0170b_003` | 32696 |

### abilities

| Readable game text | Canonical identity | Existing runtime IDs | Capture numbers |
|---|---|---|---|
| Ojo Compuesto | Compound Eyes / ふくがん | `unsupported:ふくがん` | 32686 |
| Liviano | Unburden / かるわざ | `unsupported:かるわざ` | 32688 |
| Pararrayos | Lightning Rod / ひらいしん | `lightningRod` | 32690 |
| Cola Armadura | Armor Tail / テイルアーマー | `unsupported:テイルアーマー` | 32692 |
| General Supremo | Supreme Overlord / そうだいしょう | `supremeOverlord` | 32694 |
| Nevada | Snow Warning / ゆきふらし | `snowWarning` | 32696 |

### items

| Readable game text | Canonical identity | Existing runtime IDs | Capture numbers |
|---|---|---|---|
| Hierba Blanca | White Herb / しろいハーブ | Reference only | 32678, 32686, 32688, 32690, 32692, 32694, 32696 |
| Pañuelo Elección | Choice Scarf / こだわりスカーフ | Reference only | 32678, 32680 |
| Semilla Electro | Electric Seed / エレキシード | Reference only | 32678 |
| Semilla Psique | Psychic Seed / サイコシード | Reference only | 32678 |
| Semilla Bruma | Misty Seed / ミストシード | Reference only | 32678 |
| Semilla Césped | Grassy Seed / グラスシード | Reference only | 32678 |
| Pañuelo de Seda | Silk Scarf / シルクのスカーフ | Reference only | 32678, 32682 |
| Vidaesfera | Life Orb / いのちのたま | `lifeOrb` | 32680, 32686, 32688, 32690, 32692, 32694, 32696 |
| Baya Citrón | Sitrus Berry / オボンのみ | Reference only | 32680, 32686, 32688, 32690, 32692, 32694, 32696 |
| Baya Hibis | Roseli Berry / ロゼルのみ | `roseliBerry` | 32680 |
| Charizardita Y | Charizardite Y / リザードナイトＹ | Reference only | 32680 |
| Aerodactylita | Aerodactylite / プテラナイト | Reference only | 32680 |
| Refleluz | Light Clay / ひかりのねんど | Reference only | 32680 |
| Semilla Milagro | Miracle Seed / きせきのタネ | Reference only | 32682 |
| Carbón | Charcoal / もくたん | Reference only | 32682 |
| Agua Mística | Mystic Water / しんぴのしずく | Reference only | 32682 |
| Imán | Magnet / じしゃく | Reference only | 32682 |
| Polvo Plata | Silver Powder / ぎんのこな | Reference only | 32682 |
| Pico Afilado | Sharp Beak / するどいくちばし | Reference only | 32682 |
| Baya Alcho | Charti Berry / ヨロギのみ | `chartiBerry` | 32684 |
| Baya Kebia | Kebia Berry / ビアーのみ | `kebiaBerry` | 32684 |
| Baya Acardo | Shuca Berry / シュカのみ | `shucaBerry` | 32684 |
| Baya Rimoya | Yache Berry / ヤチェのみ | `yacheBerry` | 32684 |
| Baya Pomaro | Chople Berry / ヨプのみ | `chopleBerry` | 32684 |
| Baya Payapa | Payapa Berry / ウタンのみ | `payapaBerry` | 32684 |
| Baya Drasi | Kasib Berry / カシブのみ | `kasibBerry` | 32684 |
| Banda Aguante | Focus Sash / きあいのタスキ | Reference only | 32686, 32688, 32690, 32692, 32694, 32696 |
| Raichunita Y | Raichunite Y / ライチュウナイトＹ | Reference only | 32686, 32688, 32690, 32692, 32694, 32696 |
| Hielo Perpetuo | Never-Melt Ice / とけないこおり | Reference only | 32686, 32688, 32690, 32692, 32694, 32696 |

### types

| Readable game text | Canonical identity | Existing runtime IDs | Capture numbers |
|---|---|---|---|
| INSECTO | Bug / むし | `むし` | 32686 |
| VOLADOR | Flying / ひこう | `ひこう` | 32686 |
| PELEA | Fighting / かくとう | `かくとう` | 32688 |
| VENENO | Poison / どく | `どく` | 32688 |
| ELÉCTRICO | Electric / でんき | `でんき` | 32690 |
| NORMAL | Normal / ノーマル | `ノーマル` | 32692 |
| PSÍQUICO | Psychic / エスパー | `エスパー` | 32692 |
| SINIESTRO | Dark / あく | `あく` | 32694 |
| ACERO | Steel / はがね | `はがね` | 32694 |
| HIELO | Ice / こおり | `こおり` | 32696 |

## Capture 32678

- File: `32678.jpg`; 119,651 bytes.
- SHA-256: `96218d638601b75eded57b257aff97c95b4bec65750a13438591c49ac848ae37`.
- Screen: held-item-selection.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32678`.

## Capture 32680

- File: `32680.jpg`; 118,134 bytes.
- SHA-256: `210166f846d62d3582b53fb3c31b6d757738c8ceaf1ae4e178fba7c2a285c8d4`.
- Screen: held-item-selection.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32680`.

## Capture 32682

- File: `32682.jpg`; 117,465 bytes.
- SHA-256: `30df61c23bad36b8a13033502477156fce973e9d1aba6248ae6208808cccdeb7`.
- Screen: held-item-selection.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32682`.

## Capture 32684

- File: `32684.jpg`; 117,367 bytes.
- SHA-256: `1d21245a766ac212f7941d0e1432bbaf176efa37f2bf0072304a68c6c504861a`.
- Screen: held-item-selection.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32684`.

## Capture 32686

- File: `32686.jpg`; 227,098 bytes.
- SHA-256: `2b576788790872570ab40ce547d4e61aba96b3ba71289ea30bc11207ef937a30`.
- Screen: battle-party-details.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32686`.

## Capture 32688

- File: `32688.jpg`; 227,042 bytes.
- SHA-256: `2e92005752cb8a14841849d000ca7283641034f1f04d86d9fbb627ddbf4ade89`.
- Screen: battle-party-details.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32688`.

## Capture 32690

- File: `32690.jpg`; 225,324 bytes.
- SHA-256: `5bc870da195d8069f7c3ff7de0444d4a6f574eab2f7cef28d86334d68f376115`.
- Screen: battle-party-details.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32690`.

## Capture 32692

- File: `32692.jpg`; 227,980 bytes.
- SHA-256: `04b634f176254d36caefb2ce719f5672a5719ee416265aa9412f367044103381`.
- Screen: battle-party-details.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32692`.

## Capture 32694

- File: `32694.jpg`; 229,267 bytes.
- SHA-256: `1df3113c76d427a78f8dbc803360c6bf052766f671bfcf75839bb77e3567f396`.
- Screen: battle-party-details.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32694`.

## Capture 32696

- File: `32696.jpg`; 227,479 bytes.
- SHA-256: `55f512b00ccee84f967c90627e4d3776e7bf5395d8d6b5d2380ce07ebb034de8`.
- Screen: battle-party-details.
- Supplied/reviewed: 2026-11-16 (Asia/Tokyo); capture time unknown. Original image privately retained, not published.
- Exact visible fields and canonical associations: [capture manifest](data/v110-es-la-owner-captures.json), `captureId: 32696`.
