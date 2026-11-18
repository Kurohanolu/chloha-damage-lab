# ES-LA batch 12: official Champions LAIC 2027 terminology

Status: integrated in an unpublished successor candidate alongside owner captures batch 4.
Baseline: `a68b987d25d392076f36413e7f626ea3b71391c2` (released pre.16).
Checked: 2026-11-18. Additional owner screenshots requested: zero.

## Finding

The official [LATAM LAIC 2027 page](https://championships.pokemon.com/es-la/events/internationals/2027/sao-paulo) announces Francesco Pio Pero’s Sylveon for Pokémon Champions. Its [English counterpart](https://championships.pokemon.com/en-us/events/internationals/2027/sao-paulo) identifies the same distribution and the same fields. Both direct HTTP responses were retrieved successfully. The site’s `encodedData` string was parsed as a string literal, decoded as HTML entities, then parsed as JSON without executing remote JavaScript. The relevant `middleCopy_html` content field and raw response hashes are recorded in the manifest. This is primary publication content, not a browser screenshot, actual gift receipt, or physical game test.

| Existing identity | LATAM name | Change proposed |
|---|---|---|
| `pixilate` / フェアリースキン | Piel Feérica | Unverified → official Champions |
| `gw0169_p070` / でんこうせっか | Ataque Rápido | Unverified → official Champions |
| `gw092_28` | Sylveon | Generic official → official Champions |
| `modest` / ひかえめ | Modesta | Corroboration only; retain established display case |
| `hyperVoice` / ハイパーボイス | Hipervoz | Corroboration only |

The first two are real user-visible runtime identities, not hidden unattached catalog entries. However, their displayed spelling is already correct: **zero display-name fixes are claimed**. Detección and Bostezo are excluded because they are not registered move identities in this calculator; no support is added.

LAIC-only projected counts (before adding owner captures batch 4): official 488 → 490 / 1,029 (47.42% → 47.62%); unverified 380 → 378; Champions-specific 162 → 165. These are projections, not published counts.

## Verification and next step

`node tests/v110-regional-batch12-evidence.cjs` passes all five canonical bindings, preserved spellings, projected promotions, excluded identities, Sylveon’s actual Pixilate roster association, and Quick Attack’s native move inventory. A separate read-only reviewer independently retrieved both primary pages and confirmed the same interpretation. This narrow evidence review is not a formal Sol release audit.

The owner subsequently supplied all requested images. This publication evidence is now integrated with [capture batch 4](v110-es-la-owner-captures-batch4.md); the combined candidate has 497 official names and 176 Champions confirmations. Main, tags and deployment are unchanged. Such a successor still needs regeneration, cache hashes, exact-head CI, ten-language display/search/save tests, numeric equivalence, formal independent audit, standing-authorization binding and actual live acceptance. Existing pre.16 receipts cannot approve a new source tree.

## Other research outcome

The current official Champions news index exposes additional LATAM strategy URLs. Several direct Pokemon.com article fetches returned only a challenge page or empty indexed content. No text was inferred from English or ES-ES versions, and no access control was bypassed. Further names from those pages remain excluded until the actual LATAM wording is available. Cloudflare was not contacted; no user PC or browser session was used.

### Follow-up triage

The current 12 unverified abilities whose display equals English have **zero roster associations** in the released source (Teravolt, Turboblaze, Flare Boost, Toxic Boost, Defeatist, Orichalcum Pulse, Hadron Engine, Steelworker, Neuroforce, Battery, Rocky Payload and Normalize). Translating those first would repeat hidden-catalog work rather than repair a reachable picker. The UI inventory reports no known `remainingGaps`; that bounded inventory is not a claim of exhaustive UI completeness.

Additional official es-la championship team-list results have Spanish interface labels but English Pokémon move/ability fields. They are not LATAM term evidence and were excluded. Searches for current Champions regional strategy wording yielded no further directly inspectable primary term evidence in this pass. This is a bounded research result, not a claim that the entire web is exhausted.

Historical request, now fulfilled by capture batch 4: to unlock corrections of frequently visible fallback names, request at most these three ES-LA Champions move-detail screenshots, only when already available on their Pokémon (no acquisition or paid training requested):

1. Gengar’s Shadow Ball (シャドーボール): existing `shadowBall`, currently Bola Sombra without individual ES-LA attestation. Open Gengar’s move selection/summary and its move-details panel, with full name and description visible.
2. Gengar’s Sludge Bomb (ヘドロばくだん): existing `sludgeBomb`, currently Bomba Lodo. Same move-details location. If both full names and identity/context fit one screenshot, combine and reduce the request.
3. Gyarados’s Crunch (かみくだく): existing `crunch`, currently Triturar. Open the move-details panel with full name, Dark type and description visible.

These are evidence requests, not assertions that current Spanish spellings are wrong. Clear full names plus Pokémon/move context prevent swapped identities. If these Pokémon or moves are unavailable, do not ask the owner to acquire them just for this audit.
