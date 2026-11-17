# ES-LA Power Spot successor (unpublished)

Base: reviewed batch10 `3fc0959f5a1447d4c241c4db4071452d2e97559d`. Checked 2026-11-17.

The official [LATAM Stonjourner profile](https://swordshield.pokemon.com/es-mx/pokemon-galar-region/stonjourner/) names its ability **Fuente Energía**; the [English counterpart](https://swordshield.pokemon.com/en-us/pokemon-galar-region/stonjourner/) names **Power Spot**. The regional selector says América Latina. Original HTML hashes and exact canonical binding are retained in `data/v110-es-la-power-spot.json`.

This changes only the existing `パワースポット` / `powerSpot` name from its English fallback to Fuente Energía. It adds Fuente Energía and Power Spot aliases to that same record. Historical official regional marketing is not Champions or in-game ES-LA evidence. No mechanics or ability availability changes.

Existing canonical bindings translate the hidden legacy ally checkbox, error message and trace name without any renderer change. The ally checkbox is not mounted into reachable UI in either baseline or candidate. This is a dictionary and latent-binding correction, **not a reachable UI correction or a newly usable ability**. **Power Spot is not a member of the shared name search catalog**: all accent/case/English queries correctly remain absent there, rather than inventing a picker or roster association. The alias data is retained for consumers of this existing canonical record; it must not be advertised as a new searchable picker entry.

Unique-name coverage: official 484 → 485 / 1,029 (47.04% → 47.13%); unverified 384 → 383. Champions official remains 162. Forms overlap and are excluded.

## Verification

- PASS deterministic rebuild and `--check`, source contract, new Power Spot contract, and batch7–10 contracts.
- PASS all other coverage records byte-equivalent at parsed-object level, original nine-locale resources and protected engine/feedback/source files unchanged.
- PASS 2,592 independent weather numeric cases.
- Historical batch7–10 guards now require the exact single successor name/aliases/source for Power Spot rather than permitting arbitrary display changes. All other existing name/alias comparisons remain mandatory.
- The first browser test incorrectly attempted to click the hidden legacy checkbox and failed in CI. Corrected test explicitly asserts hidden status and injects legacy input change events, retaining ten locales, two widths, repeated on/off, full numeric state comparison and save/reload. This validates persisted-state integration, not user click accessibility. The corrected test requires fresh execution and exact-head CI; the earlier failed run is not a pass.
- Exact-head CI, independent review, approved release metadata, release gates and live verification remain pending. No push, merge or publication performed. Keep separate from feedback #82.

## Connector publication provenance

Remote comparison base `3fc0959f5a1447d4c241c4db4071452d2e97559d` has the exact reviewed batch10 tree `3d7ed5ce9d6bc15fb549e6c7a68ccd5012986eda` of local `ac776b4022e0913d1bf90279aff4a19d94e290b4`. Connector-generated commit identity differs; successor baseline references use that reachable remote parent. Draft PR is for CI discovery only. Release identity is pending; no merge or deployment is requested.
