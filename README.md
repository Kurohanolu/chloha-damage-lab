# Singularity — v0.187 migration candidate

Pokémon Damage Calculator by **Chloha Labs**. This development branch prepares the supplied Orbital S identity, black/pink/purple interface and a new GitHub Pages project. Main merge, final logo/design adoption and production cutover require the owner's approval.

The [published calculator](https://kurohanolu.github.io/chloha-damage-lab/) remains **Chloha Damage Lab v0.186 Pre-Release32** at `4b2cde61f92610c5bb970618d34147a2c16a8d7b`. The proposed `/singularity/` URL is not yet published or reserved. Source/Issues/PR/CI/history and private feedback stay in this repository; a separately approved project would serve generated static files.

- [Design preview and actual browser screenshots](docs/v0187-design-preview.md)
- [Development/readiness report](docs/v0187-release-readiness.md)
- [Migration/deployment/rollback plan](docs/v0187-singularity-migration-preparation.md)
- [Concrete post-approval cutover runbook](docs/v0187-cutover-runbook.md)
- [Bounded name-collision review](docs/v0187-name-check.md)
- [Draft PR #64](https://github.com/Kurohanolu/chloha-damage-lab/pull/64) / [Issue #63](https://github.com/Kurohanolu/chloha-damage-lab/issues/63)

The v0.184 calculation API, all28 original runtime modules, registered data/control logic and the 300 frozen fixtures with explicit v0.186 corrections are preserved. Branding does not certify unverified hardware behavior or add Pokémon/moves/abilities/items/rules. See the [v0.186 coverage](docs/v0186-mechanics-coverage.md) and [hardware plan](docs/v0186-hardware-test-plan.md).

Dependency-free preservation and migration checks (Node22+ and full repository history for the pinned legacy commit):

```sh
node tests/v0184-engine-initialization.cjs
node tests/v0184-public-baseline.cjs
node tests/v0187-migration-contract.cjs
node tests/v0187-live-readiness.cjs
node scripts/verify-release.cjs
```

Build both proposed public trees into a fresh, empty output directory and preview locally:

```sh
node scripts/v0187-build-sites.cjs --output dist/v0187
node scripts/v0187-preview-server.cjs dist/v0187
```

The loopback server exposes `/singularity/` and `/chloha-damage-lab/`. This is a static preview, not a deployment or a false-success feedback demo. Real production intake intentionally rejects unapproved local origins; reproducible browser tests use the local Worker/SQLite harness and mocked challenge/GitHub services. No credential is needed for those tests.

After recorded owner cutover/design approval, `node scripts/v0187-live-migration-check.cjs --accept-new-target` performs read-only new-site hash acceptance before the verified flag or old-site notice exists. It cannot publish or record its own approval. The default command remains the strict final check of both sites. See the cutover runbook for actual feedback acceptance and final-metadata redeployment; the current pending manifest blocks both modes before network access.

Eight required regression/migration workflows preserve Showdown, engine baseline, UI/nine-language, private-feedback and v0.186 audit coverage. Pages live smoke and release-metadata validation provide supplementary gates. PR publication is skipped. A later approved release also requires exact-commit CI, actual new/legacy public file hashes, private-service readiness and explicit design/cutover approval; the current manifest blocks publication. Final exact-head results are recorded in the Draft PR rather than inferred from an older green commit.
