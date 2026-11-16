# Singularity v1.1.0 — ES-LA handoff

## Current checkpoint — 2026-11-16 JST

- Branch: `feature/v110-es-la-localization`; [compare with main](https://github.com/Kurohanolu/chloha-damage-lab/compare/main...feature/v110-es-la-localization).
- History/review record: [PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68), already merged. It cannot be reopened; do not create a duplicate PR.
- Published first-batch baseline: `83af29133927a19fc7e0f9273c0e194c54384ae5`, tree `cc196155bdb69a5e45b6ddb76b1c49987d4a9f3b`, release `v1.1.0-pre.1`.
- Stable numerical reference: `0b270c1452505268364659edd402209b00b28673`.
- Current work: second-batch terminology/provenance integration, **not yet published**. All 20 original owner images have been visually inspected. Original images remain private.
- Verified source: `41e5ad156f0e19f46b342c28353e36e37f46d7a7`, tree `bc565c1918cf99e3df83e0322cb64551692dcd71`. **13/13 workflows and 17/17 ES-LA acceptance tests PASS**, with independent Sol technical acceptance. Raw reports and API receipts are linked from the [test report](v110-es-la-test-report.md). The later documentation/evidence checkpoint does not alter tested runtime/data/tests.

## Completed evidence integration

The [20-image evidence audit](v110-es-la-owner-screenshot-evidence.md) and [second-batch manifest](data/v110-es-la-owner-captures-batch2.json) record visible names, locations, canonical bindings, exclusions and effect descriptions. The second batch has 58 system-name observations: 56 registered and two off-runtime, including three abbreviation-only witnesses. Fourteen existing owner records gain new witnesses; 44 records are added. The combined ledger has 1,183 records from 60 sources. Across both owner batches there are 109 distinct system-name identities, of which 84 are registered and 25 off-runtime.

Official Champions names increase **112 → 142 (+30)** and unverified names decrease **739 → 714 (−25)**. Overall official names increase 121 → 151. The unchanged denominator is 1,029 names in seven non-overlapping categories; forms overlap Pokémon and UI/warnings are separate. Remaining unverified counts are Pokémon 338/373, moves 186/335, abilities 182/245, items 3/41 and natures 5/11. Types and stats have no unverified entries; 17/18 types have official Champions evidence. The forms view has 111/134 unverified entries and is not added again.

Only `firme` → `Firme` changes a display name. Added aliases are `Floette Flor Eterna`, `At. Esp.` and `Def. Esp.`; no aliases are removed. `Expl. Metálica` and the two stat abbreviations remain short-form evidence, not proof of unseen full wording. Existing nine-language dictionaries, canonical IDs, game inventory, state compatibility and calculation-engine behavior are unchanged. General UI remains 1,011 provisional authored/reused sites, including 169 overlapping warnings.

No second-batch accepted name has an unresolved canonical binding. **Additional owner screenshots requested: 0.** No request to translate the remaining inventory is needed. Language settings, capture date/build and physical calculator testing remain explicitly outside the image evidence.

## Resume procedure

1. Fetch latest main and the existing feature branch, preserve the user-authored handoff commit `7759a90`, and inspect any newer changes before writing.
2. Keep source evidence, generated coverage, aliases and cache hashes synchronized. The original ten-image manifest is immutable; additional witnesses extend existing records instead of duplicating them.
3. The current second-capture contracts, browser regressions and all 13 workflows are complete on the verified source above. Any subsequent implementation change needs fresh relevant checks; do not substitute historical receipts.
4. Preserve the retained raw reports, their hashes, the 13-workflow receipt and final independent Sol review under `docs/evidence/v110-second-captures/`. PR #68 records the branch comparison and exact verified source.
5. Preserve the live `v1.1.0-pre.1` release and its immutable tag. Any later publication of these follow-up changes needs a distinct release identity and fresh release evidence; the unpublished follow-up marker rejects reuse of the first publication's approval.

## Publication state

The first-batch release is already public at <https://kurohanolu.github.io/singularity/>. This follow-up has not changed main, the public repository, release tags or the production Worker. The published temporary ES-LA feedback restriction remains unchanged; the other nine locales retain their existing feedback behavior. Do not describe the production Worker as supporting ES-LA submissions until independently verified.

The owner's earlier instruction authorized publication, but historical approval and acceptance receipts apply to their recorded source/tree. No additional permission request is created by this handoff. Complete the current audit and establish any future release's exact identity and fresh evidence before publication; do not overwrite the issued prerelease tag.

## Historical checkpoints

The initial accepted implementation was `215e5a1a8af9e20591d077e6acfcabb234a53b7a`, tree `fa77eab91c520fc4e40f9d146b63c909f47d8c4f`, with 13/13 workflows and 11/11 ES-LA tests passing. The first owner-capture source-data candidate `9560399385349d0f62cba57a96c146bc08b7663b` passed all 13 workflows and twelve candidate acceptance files. The [first capture audit](v110-es-la-capture-audit.md), [historical test evidence](v110-es-la-test-report.md), and retained `docs/evidence/v110/` records preserve these results. First publication is the exact baseline listed above.

The owner instruction below is retained from handoff commit `7759a90`. Its caution not to assume ingestion described the starting condition. The current checkpoint now records actual inspection and integration; its requirements for canonical identity, privacy, minimum screenshot burden and fresh validation remain in force.

## Owner instruction — second ES-LA capture batch and minimum screenshot requests (2026-11-16 JST)

The owner supplied a **second set of 10 Pokémon Champions ES-LA screenshots** in the conversation, after the first 10 captures already referenced by the capture audit. This second batch includes move-selection and move-description screens (e.g. `Golpe Pesado`, `Inversión`, `Patada Baja`), ability descriptions (`Filtro`, `Aura Feérica`), Pokémon details, natures/stats, and berry inventories. **Do not assume the second batch has already been ingested, attached to this Work session, or committed to GitHub.** First compare the existing capture audit and provenance inventory with the new batch, and avoid double-counting repeated names. If the image bytes are inaccessible, use the owner's supplied evidence memo where available; mark any image not directly inspected as pending rather than claiming first-hand verification. Do not publish screenshots without the owner's explicit permission.

**Mandatory next actions for Astra:** (1) inspect the latest PR #68 head and existing evidence inventory; (2) inventory second-batch visible strings with screenshot index, display position and exact spelling; (3) map each item to a registered canonical ID using Pokémon/move type/item icon and existing canonical data, never string resemblance alone; (4) add only supported, nonduplicate Champions evidence with correct provenance; (5) regenerate coverage and report changes in official Champions counts separately from generic display fallback; (6) rerun 10-language search, switching, persistence, numeric parity and all required CI against the *new* exact candidate; (7) request independent Sol review and update the test report and this handoff. Do not alter the Stable calculation engine or deploy to production.

**Owner screenshot burden: default zero additional screenshots.** Exhaust existing 20 owner captures, official regional Pokémon materials, Pokéxperto and the existing catalogs before requesting anything. Only ask for an additional screenshot if a specific unresolved canonical ID is release-relevant, cannot be resolved through accessible evidence, and a particular game screen is likely to settle it. Batch all essential requests into **at most three screenshots in the first follow-up**, with canonical ID, Japanese/ES-ES name, ES-LA candidate, reason and exact screen to capture. Do not request captures merely to raise the official-confirmation percentage, do not ask the owner to translate the unresolved catalog, and do not block implementation solely for safe, disclosed ES-ES fallbacks.

## Continuing limits

Physical Android/iOS calculator testing, native screen readers and OS IME, exhaustive native-language review, all dynamic combinations, long-duration memory stability, and partially/unimplemented Champions mechanics are not certified. Browser emulation and terminology screenshots do not establish those properties. Unverified fallbacks remain disclosed rather than inferred as official.
