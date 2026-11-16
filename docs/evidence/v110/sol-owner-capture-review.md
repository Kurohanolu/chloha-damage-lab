# Sol owner-capture follow-up review

Reviewed commit: `9560399385349d0f62cba57a96c146bc08b7663b`.
Comparison baseline: `a70b45674c66dcfd7b87321c9f012dd36637c3f2`.
Scope: PR #68 owner-capture data, source selection, canonical identity bindings, coverage, regional isolation, and acceptance tests. This report and the accompanying audit attribution clarification are uncommitted review additions beyond that reviewed commit.

## Conclusion

No blocking code/data defects found in the reviewed changes. Acceptance is limited to the repository's recorded evidence and implementation; original screenshot pixels were not available to this review.

- The 71 unique identity observations split into 65 system terms and six nickname-capable species labels. Of the system terms, 41 bind to existing runtime identities and 24 remain off-runtime. Repeated capture occurrences contribute provenance, not extra coverage identities.
- Existing registered names, aliases, canonical IDs and denominators remain unchanged. Unburden stays unsupported; Zap Cannon, Psychic, Ice Shard and the berry bindings retain their distinct canonical identities. No engine support is inferred from observed terminology.
- Prior source records are preserved. New capture sources aggregate into one record per system identity; lower-priority Psychic evidence remains related provenance with an explicit superseded disposition. Selected verification scopes retain their full union in the audit.
- The baseline comparison and locale contract confirm nine existing dictionaries, including ES-ES, remain isolated. Name/search assertions exercise regional, Spain, uppercase and accent-folded aliases against canonical keys.
- Counts reconcile: 27 newly official identities, 31 newly official Champions identities and 22 fewer unverified names; these overlapping measures are not summed. Game UI observations, species context, off-runtime terms and the clipped row receive no completion credit. UI remains provisional and mechanics remain outside evidence scope.

## Finding and resolution

The audit's prior phrase “implementation and Sol reviewers” could be read as claiming fresh image inspection by this review. The existing independent-transcription JSON explicitly attributes an earlier ten-original visual inspection to Sol. The accompanying audit edit preserves that recorded earlier attribution with a direct link and distinguishes this subsequent code/data review. This review verifies consistency with that prior attestation, not the authenticity or pixel accuracy of the originals.

## Checks performed

Passed locally: `node tests/v110-owner-capture-contract.cjs`, `node tests/v110-source-contract.cjs`, `node scripts/v110-es-la-coverage.cjs --check`, `node tests/v110-locale-contract.cjs`, and `node tests/v110-engine-equivalence.cjs` (4,520 complete-output comparisons).

`node tests/v110-regional-search-browser.cjs` could not run locally: the default Playwright Chromium executable is missing; retrying with `/usr/bin/chromium` aborted because socket creation is prohibited by the environment. This is an execution limitation, not a passing browser result. The PR's separate CI receipt is outside these local results.

## Limitations

No original screenshot was inspected, downloaded, or republished in this review. Hashes and transcription assertions are checked as recorded metadata, not recomputed from absent originals. Owner-attested locale is not an observed language-settings screen; capture time remains unknown. This review does not authenticate device/build/locale, establish default species names, validate mechanical effects on hardware, or authorize release/publication.
