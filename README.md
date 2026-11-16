# Chloha Damage Lab Community Edition — audit tooling only

This independent branch contains **only newly authored review/build/test/UI/documentation files and verified upstream license notices**. It has no application HTML, Pokemon/move/ability/item registry, translation dataset, image, logo, ZIP, private backend, token or credential. The new Git tree contains none of those materials; the immutable stable commit remains an existing historical reference.

The already-public stable source remains at `v1.0.0`, commit `0b270c1452505268364659edd402209b00b28673`. CI reads that existing source into a temporary runner, applies the original tools, and validates a **local review candidate**. Only test reports/screenshots are retained. The app and ZIP are never uploaded or deployed by this workflow.

The complete Community Edition remains blocked by unresolved third-party redistribution provenance. A successful technical verification is not publication clearance. The required publication-rights job remains red until evidence and an appropriate release implementation are reviewed. No original source branch, main, Pages branch, stable tag, or Singularity production asset is modified.

- [Audit and remaining blockers](docs/community/restoration-audit.md)
- [Candidate beginner guide](community/README.md)
- [Scoped license](community/LICENSE)
- [Third-party findings](community/THIRD-PARTY-NOTICES.md)
- Tracking: https://github.com/Kurohanolu/chloha-damage-lab/issues/73

The prepared release branch was not pushed: automatic approval review rejected transmission of a tree containing unresolved application data. This data-free tooling branch is the materially narrower alternative, not a deployment or a workaround for application publication.
