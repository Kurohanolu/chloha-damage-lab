# Singularity v1.1.0 — ES-LA handoff

## Current checkpoint

- Branch: `feature/v110-es-la-localization`.
- Review: [Draft PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68).
- Starting main: `5d6a685ceab3cc1fd3db873bd5591a35f0e6fc03`.
- Stable numerical reference: `0b270c1452505268364659edd402209b00b28673`.
- Candidate: `v1.1.0-pre.1` development metadata, not a published tag.
- Accepted implementation: `215e5a1a8af9e20591d077e6acfcabb234a53b7a`, tree `fa77eab91c520fc4e40f9d146b63c909f47d8c4f`.
- Technical verification: 13/13 workflows and 11/11 new ES-LA tests passed. Existing nine-language regression, 110 rotating transitions, 15 reloads, 60 viewport cases and 4,520 Stable numerical comparisons passed. All 13 protected files (10 runtime engine/data, 2 fixtures, 1 reference lock) are byte-identical to Stable.
- Scope: ES-LA data/provenance, locale integration, search, UI/state/feedback compatibility, ten-language verification.
- Current public environment remains v1.0.0. No Cloudflare configuration/deployment or production feedback submissions performed.

## Owner-capture update — 2026-11-16 JST

The [capture audit](v110-es-la-capture-audit.md) adds official Champions name evidence without changing displayed strings or calculation support. The prior accepted implementation above remains a historical checkpoint. Fresh capture provenance and regression results are bound to the subsequent PR head; consult the [test report](v110-es-la-test-report.md) and PR checks rather than applying an older PASS to new source data. No additional owner screenshot request is pending.

## Owner instruction — second ES-LA capture batch and minimum screenshot requests (2026-11-16 JST)

The owner supplied a **second set of 10 Pokémon Champions ES-LA screenshots** in the conversation, after the first 10 captures already referenced by the capture audit. This second batch includes move-selection and move-description screens (e.g. `Golpe Pesado`, `Inversión`, `Patada Baja`), ability descriptions (`Filtro`, `Aura Feérica`), Pokémon details, natures/stats, and berry inventories. **Do not assume the second batch has already been ingested, attached to this Work session, or committed to GitHub.** First compare the existing capture audit and provenance inventory with the new batch, and avoid double-counting repeated names. If the image bytes are inaccessible, use the owner's supplied evidence memo where available; mark any image not directly inspected as pending rather than claiming first-hand verification. Do not publish screenshots without the owner's explicit permission.

**Mandatory next actions for Astra:** (1) inspect the latest PR #68 head and existing evidence inventory; (2) inventory second-batch visible strings with screenshot index, display position and exact spelling; (3) map each item to a registered canonical ID using Pokémon/move type/item icon and existing canonical data, never string resemblance alone; (4) add only supported, nonduplicate Champions evidence with correct provenance; (5) regenerate coverage and report changes in official Champions counts separately from generic display fallback; (6) rerun 10-language search, switching, persistence, numeric parity and all required CI against the *new* exact candidate; (7) request independent Sol review and update the test report and this handoff. Do not alter the Stable calculation engine or deploy to production.

**Owner screenshot burden: default zero additional screenshots.** Exhaust existing 20 owner captures, official regional Pokémon materials, Pokéxperto and the existing catalogs before requesting anything. Only ask for an additional screenshot if a specific unresolved canonical ID is release-relevant, cannot be resolved through accessible evidence, and a particular game screen is likely to settle it. Batch all essential requests into **at most three screenshots in the first follow-up**, with canonical ID, Japanese/ES-ES name, ES-LA candidate, reason and exact screen to capture. Do not request captures merely to raise the official-confirmation percentage, do not ask the owner to translate the unresolved catalog, and do not block implementation solely for safe, disclosed ES-ES fallbacks.

## Resume procedure

Fetch source main and PR #68 before changing files. Reuse this branch/PR; do not duplicate. Read source audit, coverage, implementation and test reports. Bind subsequent results to the exact new head/tree; never reuse a prior candidate PASS after code changes.

Implementation, browser acceptance, CI and the five development reports are complete for the disclosed candidate scope. Reports/screenshots, CI receipts and independent review are retained under `docs/evidence/v110/`. A subsequent documentation/evidence-only commit preserves the source-bound acceptance above and must also have its own CI checked before handoff.

Remaining decisions concern release readiness, not an unexecuted test queue: reduce or explicitly accept the disclosed unverified terminology; complete any required physical-device/native-language review; authorize the release-specific backend and publication work below. Owner release approval is still pending.

## Translation scope for the owner decision

All inventoried names can be displayed, but fallback availability is not verified ES-LA translation. The [coverage report](v110-es-la-translation-coverage.md) and its machine-readable inventory list each canonical ID, Japanese/ES-ES name, candidate, evidence and unresolved reason. Current unverified registered counts after the owner-capture follow-up are 342/373 Pokémon, 194/335 moves, 184/245 abilities, 13/41 items and 6/11 natures. The 114/134 unverified form records overlap Pokémon and must not be added again. All 18 types are individually attested, with official Champions confirmation for 17. Official Z-A and secondary evidence remain distinct from official Champions confirmation.

The general UI inventory has 1,011 provisional authored/reused sites, including 169 overlapping warnings, with zero detected English/Japanese UI gaps in its bounded executed scope. This is not professional native-language certification. The source audit now records 1,139 attestations from 50 sources; nothing is promoted to official merely because it matches the existing Spanish dictionary. Ten owner game captures were added with exact canonical anchors, original-file hashes, provided/reviewed dates and screen locations. They verify 65 system terms, of which 41 are registered identities; no screenshot was published. Further evidence can use the same method. No request to translate the full unresolved inventory is required for this handoff.

## Publication boundary

No main merge, production cutover, tag or Release is authorized by the v1.1.0 development instruction. The publication metadata remains pending. A future owner decision must explicitly consider unresolved ES-LA terminology and verification limits. The production feedback validator must support `es-LA` before a frontend with this locale is released.

Technical acceptance is not a prepared one-click publication. The current publication policy deliberately rejects v1.1.0, including a manifest with approval flags manually added. An authorized release task must implement an explicit v1.1 review/evidence policy, bind the exact source/tree and independent audit hash to the owner's decision, update the formal release identity and artifacts, rerun the release checks, and verify live acceptance. Merely adding a reviewer to the allowlist is insufficient because the existing evidence-binding rules are release-specific. These prerequisites are recorded rather than bypassed in this development PR.

General UI copy remains provisional. Registered game-name fallbacks are listed in the coverage JSON; the unregistered Stockpile reference also retains its existing English fallback instead of inventing an official ES-LA term. No blanket request for the owner to translate these names is made.

Unchanged known limitations: physical Android/iOS coverage, native screen readers and OS IME, exhaustive native-language terminology review, long-duration memory stability, and partially/unimplemented Champions mechanics. Browser emulation is not physical-device verification.
