# Singularity v1.1.0 — ES-LA handoff

## Current checkpoint

- Branch: `feature/v110-es-la-localization`.
- Review: [Draft PR #68](https://github.com/Kurohanolu/chloha-damage-lab/pull/68).
- Starting main: `5d6a685ceab3cc1fd3db873bd5591a35f0e6fc03`.
- Stable numerical reference: `0b270c1452505268364659edd402209b00b28673`.
- Candidate: `v1.1.0-pre.1` development metadata, not a published tag.
- Scope: ES-LA data/provenance, locale integration, search, UI/state/feedback compatibility, ten-language verification.
- Current public environment remains v1.0.0. No Cloudflare configuration/deployment or production feedback submissions performed.

## Resume procedure

Fetch source main and PR #68 before changing files. Reuse this branch/PR; do not duplicate. Read source audit, coverage, implementation and test reports. Bind subsequent results to the exact new head/tree; never reuse a prior candidate PASS after code changes.

Remaining work: finish canonical provenance coverage; run all candidate workflows and browser acceptance; resolve failures; request independent Sol review of the committed candidate; complete the five development reports. Owner release approval is still pending.

## Publication boundary

No main merge, production cutover, tag or Release is authorized by the v1.1.0 development instruction. The publication metadata remains pending. A future owner decision must explicitly consider unresolved ES-LA terminology and verification limits. The production feedback validator must support `es-LA` before a frontend with this locale is released.

Technical acceptance is not a prepared one-click publication. The current publication policy deliberately rejects v1.1.0, including a manifest with approval flags manually added. An authorized release task must implement an explicit v1.1 review/evidence policy, bind the exact source/tree and independent audit hash to the owner's decision, update the formal release identity and artifacts, rerun the release checks, and verify live acceptance. Merely adding a reviewer to the allowlist is insufficient because the existing evidence-binding rules are release-specific. These prerequisites are recorded rather than bypassed in this development PR.

General UI copy remains provisional. Registered game-name fallbacks are listed in the coverage JSON; the unregistered Stockpile reference also retains its existing English fallback instead of inventing an official ES-LA term. No blanket request for the owner to translate these names is made.

Unchanged known limitations: physical Android/iOS coverage, native screen readers and OS IME, exhaustive native-language terminology review, long-duration memory stability, and partially/unimplemented Champions mechanics. Browser emulation is not physical-device verification.
