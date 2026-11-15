# v0.188 Pre-Release 1 — quality remediation and audit handoff

Status: development candidate; independent Terra review and owner approval pending. This branch must not be merged or published on the strength of Sol's report.

## Scope and immutable reference

Baseline: `7210be99c39d75b49ea8200aad91d75801eb300a` (v0.187-pre.33). The source repository remains authoritative. The publishing repository and both existing public sites are unchanged by this PR. The 28 pre-migration runtime modules, Worker source, original 300 fixtures and v0.186 corrections remain byte-identical.

M-01 adds versioned calculator-operation storage, including inactive six-stat models, manual inputs, move-specific controls and battle modifiers. L-01 synchronizes portrait accessible descriptions with the existing multilingual Pokémon-name resolver. Additional UI localization fixes and tests address gaps discovered during the audit.

## Calculator storage policy

The only new storage key is `singularity.calculator.v1`. Schema version 1 validates an exact allowlist of control values and model fields, stable IDs, supported options, numeric ranges, allocation budgets, and timestamps. Records expire 30 days after successful save. Malformed, expired, unknown-schema, unknown-field and invalid-value records are discarded; the calculator starts with defaults. A storage exception leaves calculation available and displays a localized storage status.

Only calculator operation state is eligible. No feedback body, contact address, feedback snapshot envelope, authentication material, battle log or arbitrary storage content is read or saved. Language remains under its existing independent preference key. Level 50 and IV31 are fixed in this product; no new level/IV editing is introduced.

Edits are debounced; pending edits are flushed on visibility/page exit. The last successfully saved tab wins for a future load. Existing open tabs retain their own active controls and never change underneath the user. An inactive tab does not rewrite storage just by closing. The new localized reset action clears saved calculator state and restores current-tab defaults while retaining the language preference. Another open tab can save again only through a later deliberate edit. Invalid/incomplete editing is not saved; the last valid saved state remains available.

## Meaning of unchanged-code assertions

v0.187 checked all inline code for byte identity outside its presentation template. v0.188 requires small UI bridges for persistence and portrait metadata. The updated check reverses only complete exact strings listed in `tests/fixtures/v0188-ui-inline-patches.json`, then retains the original byte-identity comparison. Mutation-negative tests reject changed bridge blocks, extra inserted control code and engine changes. Runtime engine modules remain immutable. Existing tests are retained; version assertions follow release metadata.

## Tests and evidence

The new quality workflow executes every `tests/v0188-*.cjs`, asset-checker unit tests, original90-transition language cycles, fixed300 baseline, private-feedback tests, candidate generation, and browser timing scripts. Existing eight CI workflows remain required. The generated candidate tree and reports are attached as `v0188-quality-audit-evidence`.

Local browser execution is blocked by the managed environment's Chromium socket permission. Local unit/schema/contract results and remote browser CI results must be reported separately. Browser emulation is not smartphone hardware evidence.

Production-asset verification is deliberately pinned to existing v0.187, never compared against the unpublished v0.188 candidate. See [public asset methodology](v0188-public-asset-audit.md) for full static and versioned URL hashes, release ZIP contents, and external mutable sprites. See [UI/performance methodology](v0188-ui-performance-method.md) for same-machine comparison conditions and all exclusions.

Representative translation references are independently pinned upstream, not generated from the application's dictionaries. Coverage is representative, not a claim of native review of every catalog entry.

## Security and production boundaries

No Worker/D1/Access/Turnstile resource, production configuration or secret is changed. Local mocked API/form tests are not production acceptance evidence. Issue65 and existing D1 read-only acceptance evidence remain the existing actual service record. No new production report or public Issue is submitted. New publication approval metadata is explicitly pending and cannot inherit v0.187's approval. Release and deployment gates require independent Terra evidence and owner approval for this release tag.

## Terra checklist

1. Inspect the exact candidate SHA, all changed UI blocks and storage allowlist independently.
2. Reproduce M-01 and L-01 before/after, including manual values, hidden stats, special moves, failed storage, reset and multi-tab behavior.
3. Inspect the latest SHA's eight existing workflows and new quality workflow; do not reuse earlier commit PASS.
4. Download candidate artifacts and JSON evidence; distinguish emulator, synthetic loopback comparison and production GET evidence.
5. Verify public v0.187 remains unchanged; inspect raw/fresh/versioned hashes and Release ZIP evidence.
6. Retain explicitly unverified real phone/screen-reader/production authenticated replay/configuration items. No production test writes are authorized by this handoff.

Exact final SHA, PR URL, run URLs, measured values and remaining limitations will be recorded in the PR after CI completes.

