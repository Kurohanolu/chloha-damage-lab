# ES-LA regional evidence batch 10 (unpublished preparation)

Prepared atop reviewed batch 9 `08f43de8c5d09157a03efbb3b1ea127a85bbb3bf`; published comparison baseline pre.11 `fbec6fd45b841c3465be903b25a14e909cc80ba5`. Checked 2026-11-17.

| Existing name | Canonical English | Canonical ID | Official LATAM source |
| --- | --- | --- | --- |
| Regeneración | Regenerator | `unsupported:さいせいりょく` | [Gossifleur](https://swordshield.pokemon.com/es-mx/pokemon-galar-region/gossifleur/) |
| Gula | Gluttony | `unsupported:くいしんぼう` | [Galarian Zigzagoon](https://swordshield.pokemon.com/es-mx/pokemon-galar-region/zigzagoon/) |

The visible ability fields say “Pelusa o Regeneración” and “Recogida o Gula”; the matching en-us profiles identify Cotton Down / Regenerator and Pickup/Gluttony. The es-mx pages explicitly expose the América Latina selector. [Manifest](data/v110-es-la-regional-batch10.json) records original page SHA-256 hashes and exact canonical bindings.

Official regional coverage increases 482 → 484 / 1,029 (46.84% → 47.04%); unverified decreases 386 → 384. Champions-specific remains 162 and provisional remains 2. Across batches 7–10 this adds 14 attestations over published pre.11. These historical regional marketing attestations do not prove Champions wording or historical in-game ES-LA support.

Both ability IDs remain unsupported; no supported calculator ability is added. Display names, aliases, canonical IDs, mechanics, other-language data and feedback behavior are unchanged. Stonjourner's regional “Fuente Energía” was observed but deliberately not included here: it would change the existing Power Spot fallback and needs separate display-change QA rather than an evidence-only promotion.

Deterministic rebuild, source contract and batch 7–10 focused contracts pass. Full exact-head CI, independent audit and release gates remain pending. No publication performed; keep isolated from feedback #82.
