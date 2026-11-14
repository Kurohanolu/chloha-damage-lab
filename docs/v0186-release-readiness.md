# v0.186 Pre-Release32 — verified publication

Issue #61 / merged PR #62 / `audit/v0186-accuracy-mechanics`.

## Publication verified — 2026-11-14

- Published release: [v0.186 Pre-Release32](https://github.com/Kurohanolu/chloha-damage-lab/releases/tag/v0.186-pre.32), `draft:false`, `prerelease:true`. Public URL: <https://kurohanolu.github.io/chloha-damage-lab/>.
- Main, tag target and the downloaded ZIP's git-archive commit comment all equal `4b2cde61f92610c5bb970618d34147a2c16a8d7b`. PR #62's final source head was `47d055ec092fa8374b6069ae97377d04b8aae94f`.
- All seven mandatory regression/audit workflows, live Pages smoke and verified-prerelease publication completed / success on that exact main commit. Pages deployment itself also completed / success. Full run links are recorded in the release body and Issue #61.
- Public `release.json` and HTML returned HTTP200 and matched the release source byte-for-byte. All 28 published runtime assets matched their source SHA256; live browser smoke passed nine languages and selected calculation/feedback checks without submitting a report.
- The release job's real read-only feedback checks passed: intake enabled with a production Turnstile key, correct origin/retention/no-store policy, no public report listing and anonymous access denied for all three administrator routes. API/security/browser regression tests also passed; this release did not create a synthetic production report or change Cloudflare settings/data.
- Independently downloaded archive: 846,824 bytes; SHA256 `ebed13066faa6b782b6bb0e59091437875ceff913d2922e2d11f77d2c408a7ab`, matching both the checksum asset and GitHub's asset digest. The archive's manifest tag is `v0.186-pre.32`.
- No confirmed unresolved current-scope P0/P1 remains. The documented Unverified/Partial/Unsupported limits and hardware plan are retained. See [v0.187 preparation](v0187-singularity-migration-preparation.md) / Issue #63 for the next stage; no name/URL adoption or feature expansion occurred in this release.

## Conditional publication authorization — 2026-11-14

After the completed development-candidate report and its final approval gate, the owner instructed: 「バグが見つからなさそうなら次に進めてくれ」. This is recorded as approval to proceed with v0.186 publication provided no unresolved critical known defect remains and the final exact-head checks succeed. It does not authorize actual Singularity adoption, a URL/repository migration, new features, production feedback configuration changes or data deletion. The earlier SV clarification alone was not publication approval.

Target metadata: v0.186 Pre-Release32, tag `v0.186-pre.32`. Metadata preparation is not evidence of a completed deployment. Release creation is gated on the exact main commit's seven mandatory regression/audit workflows and Pages live smoke, with a separate read-only production feedback check.

## Owner evidence and scope disposition — 2026-11-14

The owner explicitly confirmed that Dudunsparce is absent from current Champions and the supplied calculator screenshot is **SV mode**. The screenshot shows base SpA85, Lv50, IV31, EV0, neutral nature and actual SpA105. This is third-party SV calculator evidence, not a Champions game stat screen or damage measurement. No attachment or personal file identifier is published with this record.

H01's current-rule release hold is resolved by that availability clarification. Do not ask for an unobtainable current Champions stat screen. The historical candidate record (`roster_v0107_033`, SpA58 versus Gen9 reference85) remains **Unverified**; no data value, roster filter or rule support is changed. Reopen H01 before adopting this species if it becomes available under a future rule. Existing coverage counts remain unchanged; no item is promoted to Verified to improve a rate.

## Pre-publication gates (historical preparation record)

- The 24 recorded corrections, exhaustive inventory, fixed references, nine-language and feedback regression gates remain in Draft PR #62.
- No remaining confirmed P0/P1 defect has been identified within the current modeled rule scope. Existing Partial/Unsupported boundaries remain documented, including the five-move Sheer Force whitelist and explicit Multiscale/multi-hit rejection.
- Extreme non-battle manual-stat overflow remains Unverified; software reference parity is not full hardware certification.
- All seven required workflows and publisher PR validation passed on checkpoint `93cbfbba4d37ac8b62ed5ad1687247cd8a8205f7`. The new release-metadata head must complete its own checks; earlier green commits do not substitute for that check.
- The release publisher also requires the v0.186 audit workflow on the exact main release commit whenever that audit workflow exists, in addition to its existing CI and live-content gates. A PR run validates the release metadata but does not publish.
- Conditional final approval is recorded above. Merge only after final PR checks pass; verify main CI, actual deployed bytes and release/tag/assets afterward. Do not claim publication while checks or deployment are pending.
- This change prepares public metadata and all runtime cache keys for Pre-Release32. Cloudflare infrastructure remains unchanged. The public site remains Pre-Release31 until the main release operation completes.
- Pre-publication inspection found an obsolete live-smoke expectation for the corrected Shell Side Arm tie case. The smoke test now resolves digest-checked errata from the same tree as the deployed HTML; an older PR base keeps its original expectation. A native regression verifies current vectors, historical isolation and immutable-evidence failure. No damage formula is changed for this release-check correction.

## v0.187 handoff

Prepare the agreed Singularity brand and URL migration (Chloha Labs, Orbital S, black/white/neon pink, candidate `/singularity/`, old-URL migration route) for validation and formal owner approval. Carry the candidate-data conflict and other partial/unverified boundaries as separate follow-up records. No rename, URL migration or functionality expansion is performed in v0.186.
