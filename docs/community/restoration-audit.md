# Community Edition restoration audit

Status: **candidate prepared; publication blocked by unresolved redistribution rights**.
Tracking: https://github.com/Kurohanolu/chloha-damage-lab/issues/73

## Provenance verified on 2026-11-16 JST

- Source and tag: `0b270c1452505268364659edd402209b00b28673` / `v1.0.0`.
- Original release: https://github.com/Kurohanolu/chloha-damage-lab/releases/tag/v1.0.0
- Original archive SHA-256: `dda8fdaaa2f0eab02fae16072cc2fa6e5185cd5e92b84134ab3e81ccdb7791c6`.
- Downloaded and extracted all 413 archive files; every file matched its Git blob at the stated commit. Existing tag/release assets were not changed.
- Actual legacy HTML and source branch: v0.186 Pre-Release 32, `pages-legacy` at `1f9612cf1e2b7d4d6581e6acf24b9291d5e465f1`; successful deployment run https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43663821437.
- Actual current Singularity: v1.1.0 Pre-Release 5. Observed publication repository main: `cbedfd4f583632dae2c79dff665b7312c5d9ed41`. No writes are made to that repository.

## Candidate design

`scripts/community/build.py` reads application bytes from the immutable stable commit, not current main. It produces a complete static frontend and a deterministic ZIP from the **same file map**. The calculation modules, embedded Pokemon/move registries, inline numerical/model handlers, localization tables and persistence bytes remain unchanged. There is no v1.1.0 or ES-LA import.

Only presentation and optional dependencies differ: the old Damage Lab identity, final-version label, README/terms navigation and nine-language candidate notice; no automatic redirect; no input reset; no Pokemon artwork, brand logos, font downloads or private feedback endpoint. Existing scope warnings are preserved. The ZIP includes editable HTML/CSS/JS, all runtime dictionaries/data, Japanese beginner guide, scoped original-code MIT notice, upstream notices, and a file-level rights inventory.

The application SHA-256 is computed from sorted per-application-file SHA-256/path lines. The ZIP SHA-256 includes additional README/license files and is recorded separately. No candidate ZIP is uploaded as a public Release asset or included in the verification artifact while rights remain unresolved.

## Rights audit and unresolved items

| Material | Evidence / disposition |
|---|---|
| Original Chloha Labs application, adapter and documentation contributions | Scoped MIT grant in `community/LICENSE`; no blanket relicensing of third-party data or brands. |
| Showdown-derived weights/flags and reference calculations | Upstream MIT license retrieved; full notice included. |
| PokéAPI CSV-derived multilingual name tables | Upstream BSD-3-Clause license retrieved; full notice included. |
| Pokemon sprites | Upstream `PokeAPI/sprites/LICENCE.txt` explicitly attributes image copyright to The Pokémon Company. Excluded, including automatic image loads. Repository CC0 is not treated as third-party image clearance. |
| Singularity/Tiara brands and logos | Excluded; names used for accurate project identification do not grant logo/brand reuse. |
| External fonts / npm runtime libraries | No fonts or runtime libraries bundled. Browser/system fonts only. Test dependencies are installed separately. |
| Embedded Pokemon and move registries | Records cite GameWith/AppMedia, including transcription/verification metadata. Public access and source links do not establish redistribution permission. GameWith Japanese terms retain third-party/company rights; English derivative-work guidelines expressly do not cover `gamewith.jp`. Full independent licensed provenance or suitable permission remains missing. |
| Supplemental form/new-ability name files | Mixed historic supplemental data; per-record evidence is incomplete. Keep unresolved, do not claim whole-package MIT permission. |

The full per-file candidate inventory is generated at `dist/community/site/rights-inventory.json`. Unresolved is a release-gate classification, not a legal determination of infringement. The owner's conditional publication approval does not resolve third-party permissions.

### Independent-source substitution investigation

The current Showdown Pokedex was retrieved as a possible independently licensed replacement. An initial exact-form-name normalization matched the six numerical base stats of 356/373 records. Sixteen remaining records required further form-name mapping; one mapped species, Dudunsparce, differed: stable Special Attack 58 versus Showdown 85. This conflict was already disclosed by the v1.0.0 numerical acceptance protocol. These are diagnostic counts, **not** a completed source replacement, full rights clearance or proof of all types/abilities/moves/translation data. No registered value was changed.

Replacing only filenames or source labels would not resolve provenance. Reconstructing the full required data from licensed or first-party evidence must preserve stable numerical compatibility or receive a separate explicit change decision for any incompatible value. Existing tagged source remains immutable.

## Validation and operational boundary

- Local original-source numerical gate: 4,520 complete comparisons passed; 300 frozen public baseline contracts passed (with the original 31 documented corrections).
- Candidate package gate: protected numerical/persistence bytes, every inline calculation/model handler, embedded registry and localization file matched the stable original; all ZIP files matched the web tree after a fresh extraction; 300 comparisons passed against the packaged engine.
- Browser execution in the local host could not launch because the environment denied Chromium process socket creation. Browser acceptance is executed on the ordinary GitHub Actions runner; this is not a browser-test pass.
- Community CI runs the unchanged existing Showdown assertions against the actual packaged app, then both web/ZIP nine-language rotation, reload, search, warnings, viewport and local-file checks. Evidence must show the actual outcome.
- The separate required publication-rights gate intentionally remains failing while rights are unresolved. No quality gate was disabled and no all-green/publication claim is made.

No production deploy, release-tag creation, legacy branch mutation, main rollback or overwrite of existing releases has occurred. Before any eventual legacy deployment, the latest Singularity migration checks also need compatibility review: historical dual-site checks expect the v0.186 legacy artifact. Deploying a new legacy site without updating that contract could break future release acceptance. This is a remaining deployment task, not an authorization to alter current production now.

## Data-free external record

Automatic approval review rejected pushing the complete candidate branch because its tree contains the unresolved third-party application data. The remote alternative is an separate data-free `audit/chloha-community-preparation` branch containing only newly authored tooling/UI/documentation/tests and the verified MIT/BSD license texts. No application data or built ZIP is included. CI reads the already-published immutable stable source for temporary verification and uploads reports only. The planned complete release branch remains local and must not be represented as published.
