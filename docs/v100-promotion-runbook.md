# Singularity v1.0.0 promotion and recovery

## Fixed starting point and authorization

The audited source is `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095`, tree `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b`. Its prior independent verdict is CONDITIONAL READY, recorded at [be01f25](https://github.com/Kurohanolu/chloha-damage-lab/blob/be01f25ae9597b16551a5fa963e093b2247eff9f/docs/v0188-final-release-gate-report.md). The immutable [promotion-start checkpoint](https://github.com/Kurohanolu/chloha-damage-lab/blob/21fbad2835076e6a7fbcf2e55518af7003c287f8/docs/v100-promotion-baseline.md) records the pre-edit refs and existing CI. Those results are not stable acceptance.

The owner initially authorized stable-promotion preparation and required fresh independent review and risk disposition. During execution, after the remaining administrative/physical limits and the feedback compatibility approach were explained, the owner explicitly instructed: **「公開まで進めてくれ」** (continue through publication). This delegates completion of the reviewed stable release, including the needed merge, new tag, Release and public cutover. It does not waive a newly discovered serious defect or permit authentication relaxation, private data disclosure or destructive D1 operations.

The final structured owner receipt will bind the concrete Sol-reviewed source/tree and actual report hash as the execution of this instruction. It must not claim the owner manually supplied that future SHA. A separate final record will retain the exact instruction, known conditions and time the receipt was recorded. Until a new stable candidate is fixed and independently reviewed, the real manifest retains pending review/approval fields and a draft block.

## Supported scope and compatibility

The engine/model/data are preserved and compared directly to the audited candidate. The independent BigInt, locked Showdown, original 300 contracts, explicit historical corrections and existing language/state regressions remain mandatory. Unsupported Raging Bull screen breaking and other declared partial/unverified cases remain explicit.

The existing feedback backend accepts a two-part `appVersion` protocol. The stable frontend has a bounded explicit adapter: only full `v1.0.0` maps to wire `v1.0`, while full version metadata is always visible before submission and retained in the report description, including reports without attachments. Length budgets include that prefix; snapshots and requests agree; unsupported future patch identities must fail safely. The unchanged Worker, private-data rules, D1 schema and authentication are tested locally against actual adapted payloads. This does not certify current private D1 linkage or real Turnstile challenge completion.

## Three immutable source stages

1. **Reviewed candidate R:** stable metadata is pending; freeze its SHA/tree. Run all ten named mandatory workflows and `v1.0.0 Stable Promotion`. Sol independently checks actual source, numerical parity, CI steps and artifact hashes. No earlier green SHA substitutes for R.
2. **Approved pre-acceptance A:** add the actual Sol report/hash and structured owner receipt; remove the draft marker; record migration approval with `liveTargetVerified:false`. Only release metadata and documentation may differ from R. Finalize release notes/date and remove `RELEASE_PENDING` only under the recorded authorization. Run exact A CI before deployment. Its public-observation gates may inspect the immutable old pre.1 while awaiting cutover.
3. **Accepted metadata B:** after A is actually deployed, the GET-only `scripts/v100-live-acceptance.cjs --record-preacceptance` verifies every dual-site artifact and browser asset URL. It records A SHA/tree, all expected SHA-256 values, observed JST time, actual target deployment run and the old rollback source. Add only the four bound acceptance fields and `liveTargetVerified:true` to the release manifest. The real gate verifies A and the exact receipt; a true flag alone is insufficient. Run B CI, deploy B, rerun exact B live checks, and complete final CI before publishing B's Release.

The B Pages smoke expects B and may need retry after its metadata deployment. The target deployment workflow requires all source regression workflows including stable promotion, but intentionally does not require the pre-deployment Pages smoke: exact public-content acceptance follows deployment. This avoids a CI/deployment dependency cycle. The Release publisher requires **all** mandatory workflows including Pages, and rechecks exact current public bytes before release creation. A's historical receipt never substitutes for B's current live-byte checks.

## Deployment entry points and provenance

The public repository contains only deployment administration/documentation and generated site delivery; it does not maintain a second calculation engine. The audited `deployment/singularity-pages.yml` supports two equivalent owner-authorized entry points:

- Manual `workflow_dispatch` with a full source SHA.
- A main-branch push changing `deployment-request.json`, whose entire content must be an object with only `source_sha` and a lowercase full 40-character SHA.

The request is read from the exact target Git commit before the separate source checkout. No branch name, arbitrary path, script or additional option is accepted. Both checkouts disable persisted credentials. The source checkout must equal the validated SHA, pass actual source/owner/Sol binding and exact-source CI, and generate a clean artifact before Pages deployment. Updating the target workflow alone does not deploy; a request is written only after source approval and CI.

The final publisher checks the recorded target run's repository, main branch, event, exact input/request identity, immutable workflow bytes, latest successful run attempt, every required job/step and available source-provenance artifact. Artifact metadata alone does not establish artifact contents; audited workflow source assertions plus exact current live-byte verification provide the independent constraints. A rerun changing attempt/state during verification is rejected.

## Release immutability and failure handling

The publisher requires actual live acceptance and the private service's safe readiness checks. It packages the exact UTC Git commit, binds any existing lightweight or annotated tag to that exact SHA, and creates a **draft** Release first. Both ZIP and checksum are uploaded and independently verified by size/digest or bytes before the Release is published with `prerelease:false`. Missing/different assets, wrong channel, changed tag, upload failure or pending release notes stop publication. Existing published assets/tags are never overwritten. The new tag is `v1.0.0`; `v0.188-pre.1` remains unchanged.

If deployment or acceptance fails, stop publication and investigate. The current-site rollback baseline is immutable source `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`, tag `v0.188-pre.1`. Its verified Release ZIP SHA-256 is `60ec01af456a251eec006833ade16bddf5b5ef8e209c939d518879ebb2f4d500`. Rebuild/redeploy that already approved source through the same protected deployment path if recovery is needed; record it as recovery, not successful v1 acceptance. The frozen legacy calculator and migration notice remain operational. The separate notice-free 31-file legacy rollback comes from `4b2cde61f92610c5bb970618d34147a2c16a8d7b`.

No backend change is needed for this promotion. Current Cloudflare management, deployed Worker identity, private D1 linkage, backend recovery execution, physical phones/game hardware, native AT/OS IME, exhaustive language/contrast and long-session memory remain qualified limits. Public availability/anonymous safeguards and finite software tests must not be described as complete verification of these scopes.

## Interrupted-session resume

Read PR #67, source/main/target refs, actual latest run attempts, the current manifest and immutable reports first. Determine whether the last completed stage is R, A or B. Do not create duplicate PRs/tags/Releases, synthesize a passed receipt, or infer a cutover from a prepared artifact. The final report must name all stage SHAs, target deployment runs, exact current live receipt, final main/tag/Release identity, known limits and the actual outcome.
