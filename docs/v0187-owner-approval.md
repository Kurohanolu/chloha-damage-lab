# v0.187 owner approval — 2026-11-15 JST

The owner explicitly replied **「許可する 進めてくれ」** to the concrete approval request covering product-name/logo/UI adoption, the new repository and Pages configuration, production acceptance/publication and main merge. The reviewed development head was `d0c00a7cde3f194b7afc3b46debf52c701a442dc` in PR #64, with all ten workflows successful.

## Authorized rollout

- Adopt **Singularity** as the calculator product and **Chloha Labs** as its developer, with the reviewed Orbital S reference/adaptations, black/white/neon-pink/purple UI and nine-language presentation. Reference SHA256: `21f3c4ae7b0216936a227979134236dd51a1ecbe8028d7db39ba2f1865f1969c`. Adaptation limits and the bounded name-collision research remain documented; adoption is not a trademark-clearance or exclusive-rights claim.
- Create the public `Kurohanolu/singularity` static deployment repository and configure standard free GitHub Pages at `https://kurohanolu.github.io/singularity/`.
- Retain `Kurohanolu/chloha-damage-lab` as the authoritative source, Issues/PR/CI/release history and private-feedback Issue destination. Isolate its old Pages site on the generated `pages-legacy` branch before a branded main merge; retain the working v0.186 calculator and add the reviewed non-forcing notice only after new-target acceptance.
- Perform production acceptance, including a clearly labeled synthetic account-free feedback report, owner-authorized moderation and a reviewed technical-only integration Issue. Do not publish private description, email, stored authentication material or arbitrary existing reports. Existing Issue idempotency/reconciliation protections remain mandatory.
- After actual-site/service acceptance and exact-head CI, merge PR #64, synchronize exact generated public artifacts and publish the immutable v0.187 Pre-Release33 with post-deployment checks.

## Conditions retained

No existing repository rename/deletion, old-URL shutdown, paid domain/plan, Cloudflare resource duplication, production database deletion or authentication weakening is included. Preserve calculation behavior, the original300 fixtures plus documented v0.186 errata, nine languages, private feedback and all CI gates.

`migration.status` and `designApproval` can now be `approved`. **`liveTargetVerified` remains false until real target/service acceptance is recorded.** The approval itself is not evidence of a completed deployment. See [cutover runbook](v0187-cutover-runbook.md) and [readiness evidence](v0187-release-readiness.md).
