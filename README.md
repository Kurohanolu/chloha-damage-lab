# Singularity — Pokémon Damage Calculator

Pokémon Damage Calculator by **Chloha Labs**, available at **https://kurohanolu.github.io/singularity/**. The approved Orbital S identity and mobile black/pink/purple interface retain the existing calculation engine, all nine languages and anonymous private feedback.

Source, Issues, PRs, CI and releases remain in `Kurohanolu/chloha-damage-lab`. The `Kurohanolu/singularity` project deploys generated frontend files through the [exact-source Pages workflow](deployment/singularity-pages.yml), after all required exact-source regression gates, including the stable-promotion gate. The [old URL](https://kurohanolu.github.io/chloha-damage-lab/) retains the audited v0.186 calculator and a non-forcing, separate-tab migration route; inputs and private drafts stay in the original page.

The current development target is **Singularity v1.0.0**, promoted from the independently audited v0.188 candidate. [Stable release notes](docs/releases/v1.0.0.md) describe supported behavior and known limits; the actual publication record is maintained in [PR #67](https://github.com/Kurohanolu/chloha-damage-lab/pull/67). A prepared version label does not mean the release has already been published.

Historical migration approvals and synthetic Issue #65 acceptance remain in [approval scope](docs/v0187-owner-approval.md) and [live acceptance](docs/v0187-live-acceptance.md). They do not certify the current D1 state or authorize a new stable release. Current Cloudflare administrative visibility, physical devices/native assistive technology, and long-session memory limits remain explicitly disclosed.
- [Design preview and actual browser screenshots](docs/v0187-design-preview.md)
- [Development/readiness report](docs/v0187-release-readiness.md)
- [Migration/deployment/rollback plan](docs/v0187-singularity-migration-preparation.md)
- [Concrete post-approval cutover runbook](docs/v0187-cutover-runbook.md)
- [Bounded name-collision review](docs/v0187-name-check.md)
- [Draft PR #64](https://github.com/Kurohanolu/chloha-damage-lab/pull/64) / [Issue #63](https://github.com/Kurohanolu/chloha-damage-lab/issues/63)

The v0.184 calculation API and the 300 frozen fixtures with explicit documented corrections are preserved. Stable promotion additionally compares complete numerical output and protected calculation/model bytes against audited c9c52e1. Branding does not certify unverified hardware behavior or add Pokémon/moves/abilities/items/rules. See the [v0.186 coverage](docs/v0186-mechanics-coverage.md) and [hardware plan](docs/v0186-hardware-test-plan.md).

Dependency-free preservation and migration checks (Node22+ and full repository history for the pinned legacy commit):

```sh
node tests/v0184-engine-initialization.cjs
node tests/v0184-public-baseline.cjs
node tests/v0187-migration-contract.cjs
node tests/v0187-live-readiness.cjs
node tests/v0187-deployment-gate.cjs
node tests/v0187-rollback.cjs
node scripts/verify-release.cjs
```

Build both proposed public trees into a fresh, empty output directory and preview locally:

```sh
node scripts/v0187-build-sites.cjs --output dist/v0187
node scripts/v0187-preview-server.cjs dist/v0187
```

The loopback server exposes `/singularity/` and `/chloha-damage-lab/`. This is a static preview, not a deployment or a false-success feedback demo. Real production intake intentionally rejects unapproved local origins; reproducible browser tests use the local Worker/SQLite harness and mocked challenge/GitHub services. No credential is needed for those tests.

The same artifact also retains a notice-free v0.186 backup under `rollback/chloha-damage-lab/`, outside both publishable sites. Prepare a fresh local rollback candidate from it without network access, deployment or overwriting any existing output:

```sh
node scripts/v0187-prepare-rollback.cjs --artifacts dist/v0187 --output dist/v0187-rollback-candidate
```

All31 files must match the independent frozen release hashes before the first destination write. Missing, corrupt, rewritten, incomplete and symlinked evidence is rejected. Protected administrator acceptance completed with [one existing synthetic report and Issue #65](docs/v0187-admin-acceptance.md), without sharing credentials.

After recorded owner cutover/design approval, `node scripts/v0187-live-migration-check.cjs --accept-new-target` performs read-only new-site hash acceptance before the verified flag or old-site notice exists. It checks the exact versioned asset URLs in the HTML as well as fresh cache-busting probes; stale browser URLs cannot be hidden by a fresh probe. It cannot publish or record its own approval. The default command remains the strict final check of both sites. Legacy notice assets use their own content hashes for cache keys while the audited v0.186 calculator stays frozen. See the cutover runbook for actual feedback acceptance and final-metadata redeployment; the accepted manifest now permits final dual-site verification.

Ten required regression/migration workflows plus the v1.0.0 Stable Promotion workflow preserve Showdown, engine baseline, UI/nine-language, private-feedback and v0.186 audit coverage. Pages live smoke and release-metadata validation provide supplementary gates. PR publication is skipped. Release publication requires exact-commit CI, actual new/legacy public file hashes, private-service readiness and the recorded design/cutover/actual-target acceptance. Final exact-head results are recorded in the Draft PR rather than inferred from an older green commit.
