# Chloha Damage Lab Community Edition — audit tooling only

This independent branch contains **only newly authored review/build/test/UI/documentation files and verified upstream license notices**. It has no application HTML, Pokemon/move/ability/item registry, translation dataset, image, logo, ZIP, private backend, token or credential. The new Git tree contains none of those materials; the immutable stable commit remains an existing historical reference.

The already-public stable source remains at `v1.0.0`, commit `0b270c1452505268364659edd402209b00b28673`. CI reads that existing source into a temporary runner, applies the original tools, and validates a **local review candidate**. Only test reports/screenshots are retained. The app and ZIP are never uploaded or deployed by this workflow.

The complete Community Edition is now intended for **owner/community-only ZIP distribution**, with no public download link, public Release asset or public application fork. Individual customization and member-only sharing of modifications are permitted under the package terms; outside redistribution, public derivatives and commercial sale are prohibited within the owner's licensing scope. Existing MIT/BSD grants remain intact. This data-free audit tooling remains covered by the root LICENSE; it is not the complete application.

Public Web delivery and limited community ZIP delivery have separate rights assessments and required gates. Both are now evaluated through an individual content/license assessment and exact-file evidence. General ZIP redistribution is disabled by policy, not merely waiting for clearance. A successful technical verification is not publication clearance. No original source branch, main, Pages branch, stable tag, or Singularity production asset is modified. The build places ZIP files under `dist/community/private/` and only app/docs under `dist/community/site/`; neither is published by this workflow.

- [Audit and remaining blockers](docs/community/restoration-audit.md)
- [Candidate beginner guide](community/README.md)
- [Scoped license](community/LICENSE)
- [Third-party findings](community/THIRD-PARTY-NOTICES.md)
- [Distribution-scope assessment](docs/community/distribution-scope-review.md)
- Tracking: https://github.com/Kurohanolu/chloha-damage-lab/issues/73

The prepared release branch was not pushed: automatic approval review rejected transmission of a tree containing unresolved application data. This data-free tooling branch is the materially narrower alternative, not a deployment or a workaround for application publication.

The earlier blanket stop based on source references is superseded by `docs/community/individual-rights-assessment.md`. The runtime registry is reduced to its factual/identifying fields; numerical values and calculation code remain frozen. `rights-clearance.json` pins every reviewed delivery file. The original raw registries are not included in this tooling branch.
