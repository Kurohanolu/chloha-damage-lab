# Independent source review: Singularity v1.1.0-pre.14 integration

- Auditor: **6 Sol**
- Repository: `Kurohanolu/chloha-damage-lab`, PR #84
- Reviewed head: `76c76c601f07ddb4f7fdfda36a69aa3de64b4757`
- Git tree: `ba39233ad935b4fc515b841729571e7cc2ff8b1e`
- Parent: integration commit `d04cf876140e48b05e39efb4e481931ce8e52626` (tree `3ba8d3e3afba5ed10504d69eeb4073c9baa788a0`). That merge has parents prior UI review `bf8eec1506dc1d8258cfa939480706601c0ab7d7` and published pre.12 `828e906a3c460a4c55e3f8e79bcd973ead0dc93b` (tree `1921d6331b877830a5065f16f849925486f7b8c7`). The previous independent review covers the former parent's tree `24b685d9ffc7b8629a21f224c390f401472864c1`.
- Disposition: **conditional source-review pass**. No remaining blocking source defect found. All mandatory CI for this exact head, live deployment, owner decision, and metadata approval are separate gates. This report is not publication approval.

## Exact-head CI on the approval commit

The previous integration head had a blocking path filter on `.github/workflows/conditional-move-ui.yml`: a metadata-only approval commit on main would not start the dedicated acceptance run even though publication requires its exact SHA. The reviewed head changes only this workflow, replacing filtered PR/main triggers with unfiltered PR and main push triggers and adding `workflow_dispatch`. The other source bytes are unchanged from the integration parent. This resolves that scheduling gap for metadata commits. The publication workflow has a main push trigger for `release.json`; the ES-LA, migration and quality workflows have unfiltered main push triggers. The exact-source publish and target-deployment checks remain in place. CI must actually complete on the approval SHA; trigger coverage alone does not constitute a pass.

## Integration assessment

The merge retargets pre.14 observation, public baseline, rollback and publication lifecycle from pre.11 to immutable published pre.12. Its candidate `release.json` remains `awaiting-owner-approval`, with `liveTargetVerified=false`, pending 6 Sol review, no inherited receipt, and Community's pinned policy. The current UI scope guard compares root runtime and normalized HTML to pre.12, preserving feedback UI and Worker exactly; the feedback/weather successor test runs the historical pre.12 assertions in an immutable worktree and then pre.14 UI/weather guards. The published pre.12 capability integration adds an exact ten-locale service capability gate and browser regressions for malformed capabilities, old nine-locale operation, absent config, late widget failure and local-only report submission. I checked the principal local integration files' Git blob IDs against the remote commit tree; all matched. No separate UI/engine defect was found in the integration delta.

## Executed evidence on the reviewed head

GitHub Actions run `44092943825`, `Conditional move UI acceptance`, completed successfully on the integration parent `d04cf876...`. Its job executed the UI, weather and publication scope checks, 975 independently specified Showdown reference cases with 16 rolls each, 130 localized copy states, and a browser suite with 650 count cases, 150 reloads, 50 legacy saved-value cases and 150 Spit Up cases across ten locales and widths 320/360/390/430/1280. The sole subsequent change is the workflow trigger; those results are relevant source evidence, **not exact-head CI evidence for `76c76c...`**. The required workflows must finish successfully on `76c76c...` before relying on this review for release. I did not execute a separate local full repository test run or live production acceptance.

## Scope limits

The count fields are manual battle history. The locked reference calculator checks explicit power/damage vectors and KO probabilities; it does not establish Champions hardware parity or infer whether an in-game event counted. Publication requires all exact-head CI success, source-bound owner evidence, exact-source deployment, live acceptance, and publication gates. Recheck the PR head before reusing this report.
