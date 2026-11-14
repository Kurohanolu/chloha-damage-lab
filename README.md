# Chloha Damage Lab

Pokémon Champions damage calculator with nine-language UI and a preserved calculation-engine contract.

Public calculator: https://kurohanolu.github.io/chloha-damage-lab/

Release metadata is recorded in `release.json`. See `docs/v0184-engine-inventory.md` for engine boundaries and `docs/v0184-release-readiness.md` for publication checks and rollback.

Run the dependency-free preservation checks with:

```sh
node tests/v0184-engine-initialization.cjs
node tests/v0184-public-baseline.cjs
node scripts/verify-release.cjs
```

Full CI additionally compares Showdown results, browser/UI behavior, and nine-language switching. A prerelease archive and SHA256 are published only after all five required main-commit workflows succeed.
