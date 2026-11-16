# Community baseline transition: explicit owner-approved scope

During pre.6's final publisher wait, a separate owner-authorized project restored the legacy URL as Chloha Damage Lab v1.0.0 Community Edition. The exact old v0.186 live-byte contract correctly stopped publication. Singularity's accepted frontend remained live; no v1.1.0-pre.6 tag or GitHub Release was created by that attempt.

The owner subsequently explicitly agreed to this proposal: preserve the Community site, pin its exact public contents as the verification baseline, delete no checks, independently audit the baseline change, run all CI and repeat live acceptance. This authorizes the policy transition, not an overwrite of the legacy site or weaker release conditions. Issue 75 is supporting coordination evidence, not the source of authorization.

## Exact scope

- `migration.legacyPolicy: community-pinned-v1` is an explicit opt-in. Unknown values fail closed. Releases without the marker retain the original migration behavior.
- Community source is `5ac31cbd9d128f82c42121b2c1fc12fcdc4c24ed`, tree `c641405fe8a33e8a4568049f0a5396373c3817f6`.
- Latest matching rights-file inventory is at audit commit `7ea318542e41de622fc7976e1ac5c1fce94c8b11`. All 44 published files, the 32-file application hash, audit evidence hash and source trees are pinned in `docs/data/v110-community-pinned-baseline.json`. The raw manifest hash is itself pinned in protected executable code, so a documentation-only substitution cannot evade the review binding.
- The already deployed Singularity observation baseline is exact commit `a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9`, tree `604f0632eaf2d28e2fbd40012d68133050f72f30`. This is an accepted website state, not an assertion that its blocked GitHub Release exists.
- Current frontend, translation dictionary, supported identities, calculation engine and nine-language runtime bytes are unchanged by this policy revision.
- The v0.186 notice and rollback remain immutable historical fixtures. The existing migration browser still exercises its current Singularity/private Worker path, with the old legacy-notice portion explicitly using that historical local fixture. A separate required browser contract tests the pinned current Community calculator. Neither fixture may be reported as the other site's acceptance.
- Full current-target inventories, real browser cache URLs, source/owner/reviewer byte binding, deployment proof, private-feedback checks, required CI and actual public fetches remain required. The target deployment still publishes only the Singularity artifact. It does not deploy the generated Community verification copy.

All prior pre.6 approval and live evidence remains historical and is not reused for the modified protected scripts. This candidate clears audit and live acceptance metadata and must earn a fresh independent Sol PASS, all exact-source CI, a new scoped approval binding and new two-site live acceptance before publication.
