# Independent review: Singularity v1.1.0-pre.16

- Auditor: **6.1 Sol** (`gpt-6.1-sol`, independent reviewer instance).
- Reviewed release tag: `v1.1.0-pre.16`.
- Reviewed source commit: `3a3abd88682a903c7dd094c9defc1c05ce6b86d0`.
- Reviewed source tree: `f35061047b3984256c97b9702cc0acfae9aff406`.
- Published predecessor: `66cae82e10d28ad6115acdacc964fd3e84f51b4a`, tree `85c51a15b93f5da3bc81e0183ca1a3742a79966e`.
- Review date: 2026-11-17 UTC.
- Disposition: **conditional-pass**. Independent source, canonical-evidence, exact-tree CI and browser-artifact review passed; no remaining blocking source defect found. Owner authorization binding, metadata-head CI, exact-source deployment, fresh live acceptance and formal publication gates remain separate conditions. This report does not record owner approval or authorize a production mutation.
- Final verification cutoff: 2026-11-17 22:33 UTC.

## Source scope and canonical evidence

The implementation adds exactly three historical official LATAM ability-name attestations. Dragon's Maw (`りゅうのあぎと` / `dragonsMaw`) changes its English dictionary fallback to **Mandíbula Dragón** and retains the English alias. Competitive (`かちき` / `unsupported:かちき`) remains **Tenacidad**; Defiant (`まけんき` / `unsupported:まけんき`) remains **Competitivo**. The latter two are evidence-only changes, not supported-mechanics additions.

I independently retrieved all six paired official Sword/Shield pages through public web retrieval. Each English and ES-MX page names the same Pokémon and its exact ability field. The ES-MX pages also expose the América Latina region selector:

- [Regidrago, LATAM](https://swordshield.pokemon.com/es-mx/expansionpass/pokemon/regidrago/) / [Regidrago, English](https://swordshield.pokemon.com/en-us/expansionpass/pokemon/regidrago/): Mandíbula Dragón / Dragon’s Maw.
- [Galarian Articuno, LATAM](https://swordshield.pokemon.com/es-mx/expansionpass/pokemon/galarian-articuno/) / [Galarian Articuno, English](https://swordshield.pokemon.com/en-us/expansionpass/pokemon/galarian-articuno/): Tenacidad / Competitive.
- [Galarian Zapdos, LATAM](https://swordshield.pokemon.com/es-mx/expansionpass/pokemon/galarian-zapdos/) / [Galarian Zapdos, English](https://swordshield.pokemon.com/en-us/expansionpass/pokemon/galarian-zapdos/): Competitivo / Defiant.

These support historical regional publication only. They are not Champions wording, hardware/in-game verification, roster availability or mechanics evidence. I verified the current fields, not reproduction of the author's per-fetch dynamic raw-HTML hashes. All three `officialChampions` flags remain false. Independently summed unique-name coverage is **488/1029 official, 380 unverified, Champions-specific official 162**, excluding overlapping forms and authored UI.

Dragon's Maw remains an existing supported engine record with no roster association, shared name-search membership or native picker option. Stored aliases do not invent searchable membership. The two other abilities remain absent from the supported ability catalog, and retain their unsupported canonical identities. The new contract expressly checks these distinctions and accent/case/English/Japanese Dragon's Maw queries. The inspected successful browser acceptance validates latent catalog parity and real unsupported-option save/reload behavior; it does not pretend that Dragon's Maw can be picked natively.

## Preservation and successor safeguards

An independently written comparison, separate from the repository's assertions, verified 65 existing runtime/data/feedback/fixture files against immutable published pre.15. Apart from the generated ES-LA dictionary, their only admitted differences were the exact release/header/cache transformation and the bounded pre.16 feedback wire-identity addition. The generated dictionary's entry inventory and every canonical ID remain unchanged; precisely the three named records differ. Existing-nine-language resources, engine, roster, numeric data, count-control implementation, backend, feedback capability/security and the ES-LA intake pause remain preserved.

I inspected the complete changed-file inventory, successor helper, strict scope guard, source/coverage/UI-inventory generators, lifecycle wrappers and publication/deployment changes. The strict current guard pins the bounded translation payload and evidence inventory, permits only exact pre.15 identity/cache changes, rejects tampering and executes the immutable pre.15 guard, including its nested historical proofs. Historical Power Spot/batch7–10 and pre12/pre14/pre15 lifecycle tests preserve the original assertions and actually execute them on immutable worktrees. They are explicitly historical proofs, not substitutes for current candidate acceptance. Existing substantive count, weather, Power Spot browser and feedback capability tests remain unchanged. I found no gate weakening.

Fresh release metadata clears audit, owner and live-acceptance fields. Both observation and rollback receipt boundaries pin the full published pre.15 commit/tree. Pending, stale, retagged old receipts and unapproved live flags are rejected. The existing exact-reviewed-source/report-hash/owner-evidence binding extends to pre.16. Publisher and deployment gates require ES-LA Localization and Conditional move UI acceptance for this release, and retain exact-source CI and production-acceptance requirements. Dedicated acceptance workflows retain unfiltered PR triggers.

## Independently executed local evidence

Passed on the clean reviewed candidate:

- Exact bounded batch11 contract and independently written runtime/dictionary/count comparisons.
- Strict successor scope and actual nested immutable historical chain.
- Pre.16 lifecycle, rollback writer/verifier binding and stale-approval rejection.
- Historical pre15, pre14 and pre12 lifecycle wrappers; Power Spot and batch7–10 contracts.
- Artifact contract, release identity, source provenance, generated coverage/UI-inventory checks, the UI-inventory test and release verification.
- Publisher and target deployment fail-closed gate mocks, with zero production mutations.
- Numeric equivalence: **4520 complete-output comparisons**, including 300 fixed contracts, 2048 seeded inputs / 4096 seeded comparisons, 72 screen cases, 28 speed boundaries and 21 multi-hit cases. The suite records the existing 32 documented corrections; this release adds no mechanics correction.
- Independent weather arithmetic: 2592 cases, all sixteen rolls; 130 localized count-copy states; ten-locale contract including unchanged nine dictionaries and canonical search.
- Whitespace validation (`git diff --check`).

I did not run a successful local browser suite. The implementation task reports local Chromium launch blocked by the cloud socket sandbox; that is not a browser pass. My local count-Showdown attempt stopped at a missing `tests/reference/node_modules/@smogon/calc` dependency; the fresh remote acceptance below supplies actual independent-reference evidence instead. No source or production setting was changed by this review.

## Fresh exact-tree CI and inspected artifacts

GitHub job logs show checkout of PR synthetic merge `6decae3e45e290ee0529d601142761fb52982f95`. I independently resolved its Git tree to `f35061047b3984256c97b9702cc0acfae9aff406`, exactly the reviewed tree. Its parents are published pre.15 and reviewed candidate `3a3abd88682a903c7dd094c9defc1c05ce6b86d0`.

All **14 workflows** associated with the reviewed head completed successfully, including [ES-LA Localization run 44185820087](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/44185820087), [Conditional move UI acceptance run 44185820348](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/44185820348), [Quality Remediation run 44185820356](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/44185820356) and [Pages live smoke run 44185819906](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/44185819906). The complete ES-LA candidate job, including all separate preservation, Worker and packaging steps, is successful. I verified current workflow status through GitHub, not a local summary. Pages live smoke success at this pending phase observes the published predecessor, not a pre.16 deployment. A PR workflow named Publish verified release succeeding likewise does not establish publication.

Independently downloaded and inspected final ES-LA artifact `14377410553`, `v110-es-la-candidate-evidence`. Its locally computed ZIP SHA-256 is `ca275ca076a9b3d07017b2bc7ec2a31d57d654edf5a8609879b532f1dff3f570`, matching GitHub's advertised digest. The final test-run and batch11 reports are byte-identical to the inspected early reports below. Final evidence includes successful nine-language continued-state, 18 locale/viewport keyboard/browser combinations and 54 mobile cases. Logs independently confirm the original 90-transition nine-language regression and local Worker **18/18 tests, zero failures**. Packaging is an approval-required preview, binds the exact clean synthetic commit, explicitly records `publicCutoverPerformed:false`, and all **90 packaged file digests** independently match the included manifest. This is not evidence of deployment.

Independently downloaded and inspected the early aggregate artifact `14375079701` from ES-LA run `44185820087`. Its ZIP SHA-256 `2f91c8f24e35382d044ed51f24d72f1f9a5f867929b9d32367758e2c08c33599` matches GitHub's advertised digest. The test-run report binds the exact synthetic merge/tree above, a clean checkout, and **68 successful tests**, with no failed status, signal or error. The batch11 report passes all 60 cases: 20 latent Dragon's Maw catalog numeric/state/save/reload cases and 40 real native-option unsupported/save/reload cases, across ten locales and two widths. The ten-locale report passes 110 rotation transitions, six explicit transitions, 70 numeric cases, 15 reloads and eleven dynamic DOM cases without failures. Regional search evidence passes 29 index queries and 20 browser cases. Feedback capability and pause tests succeed; the pause report records zero posts, retained draft and restoration on locale switch. I also visually inspected the phone initial-layout screenshot. None of these claims relies on merely creating a test.

Independently downloaded and inspected [Conditional move UI acceptance run 44185820348](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/44185820348), artifact `14375121312`. The ZIP SHA-256 matches GitHub's advertised digest `73a4e530220d15a1d8942c8bb8c62e93d5dd68cf8a301391d2f3d9fe3d9a0f63`. Reports pass 650 count cases, 150 reloads, 50 legacy saved-count cases and 150 Spit Up cases across ten locales and five widths, with no browser errors; 975 locked independent-reference cases compare sixteen rolls. Logs confirm actual successful execution on the synthetic merge.

The weather job in [ES-LA Localization run 44185820087](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/44185820087) is successful. Downloaded artifact `14374871219` has independently computed ZIP SHA-256 `d2301e0c51c3f50d69b0a4bc445d7488f85236f5c3f19525b9e50f2e5e028040`, matching GitHub. It passes 220 browser locale/reload/mobile cases across ten locales and two widths without errors, 2592 independent integer-arithmetic cases and 1680 locked Showdown vectors. Logs also pass 27 pinned Community locale/width search and saved sixteen-roll parity cases with zero production requests/mutations. These establish browser/reference regression evidence, not physical Champions hardware parity or native assistive-technology coverage.

## Remaining release conditions

1. Bind this finalized report and the owner's genuine authorization basis to this exact reviewed source/tree through the existing fail-closed metadata workflow. This auditor does not approve on the owner's behalf. Any protected-source change requires renewed review.
2. Require complete fresh CI for approval/metadata heads, including Conditional move UI acceptance. This candidate's successful CI and historical receipts do not authorize new source bytes.
3. Preserve the ES-LA intake pause and existing nine-language behavior. Require exact-source deployment, fresh dual-site exact assets/live acceptance, the pinned pre.15 rollback inventory and all formal publication gates before declaring release completion. A failed condition blocks publication; it must not be waived by this conditional-pass.

No merge, push, tag, GitHub release, deployment, backend change, owner approval or production report submission was performed by this review.
