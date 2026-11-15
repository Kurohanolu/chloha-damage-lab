# Astra follow-up audit: release gate findings

## State recorded before changes

The immutable published release is `v0.188-pre.1`, source `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`. Its independent conditional audit and owner acceptance apply to the previously reviewed runtime at `64adc9eea8927fc72dbcb8cc1d5402b4917dff78`. That approval does not cover newly discovered follow-up fixes.

The existing approved-release binding test correctly rejects runtime changes against the old reviewed source. The existing Pages PR selector and public-performance observer assume a candidate with the same release identity is already approved; those assumptions no longer describe a new audit of an already-published release. Reusing the old approval or replacing the existing tag would be unsafe.

## Follow-up design

Keep the published identity and original approval evidence as historical data. Add an explicit draft `followupAudit` pinned to the exact published source and tree, with Terra and owner decisions pending, and set the candidate's live-target flag false. Any presence of `followupAudit` unconditionally blocks deployment and publication, even if someone changes its status strings. This branch cannot republish the immutable pre.1 tag. A later release requires its own concrete identity, independent review and owner approval.

For read-only QA, validate the complete pinned historical manifest and inspect its exact public content. Pages PR verification must name the same immutable published base; it cannot silently fall back after a bad live claim. Public performance observations must match the complete historical release manifest and title, with stable identity across samples. Original 42-file approval binding is retained against the immutable historical source, while the current follow-up is separately required to fail publication. Existing lifecycle positives and negatives are retained on their historical fixtures; new follow-up mutation tests prove that changed flags, base refs, metadata, or public manifests fail closed.

No workflow, published tag, production configuration or deployment is changed by this work.

## Verification after implementation

Seven local checks passed: new follow-up gates, historical approved-release binding, Pages lifecycle, public-observation lifecycle, inline/approval contract, synthetic live readiness, and release metadata validation. The new test also clones the pinned release locally, mutates an actual runtime file, and proves the original reviewed-runtime hash check rejects it. No network or production mutation is used by these tests. Follow-up performance comparison is explicitly pinned to the published v0.188 source rather than the older v0.187 comparison.
