# 6.1 Sol independent publication review — v1.1.0-pre.4

**Verdict: conditional-pass.** No blocking source, regression or release-policy finding remains in the exact reviewed candidate. Actual approved-source deployment, public browser verification and live acceptance remain required. This fresh review does not reuse the pre.3 verdict or acceptance receipt as approval of pre.4.

Reviewer: **6.1 Sol**.
Release tag: **v1.1.0-pre.4** (Singularity v1.1.0 Pre-Release 4).
Reviewed source commit: `cea64a6526156111b1e0a50ed3392a3dae6d44a3`.
Reviewed tree: `5351d4abc4759bec66ce8560dd9241ca383b09e6`.
Immutable predecessor and rollback source: `082ab180bc8835304d959f583d4968e0565bdea3`.
Predecessor tree: `acbfb36b179a29be7b7071821a4dd2c2a8c446cc`.

## Actual defect and correction

The previous selector-label correction left an ES-LA-specific mobile CSS rule that explicitly placed the control on a full-width second grid row. Overflow checks and a short selected label did not establish correct header layout. This review checks the geometry and rendered images of the replacement, rather than treating the earlier pass as evidence that the defect was absent.

The candidate removes those ES-LA-only header overrides and uses one common three-column grid with a bounded 90-pixel native selector. The canonical es-LA value, es-419 HTML/Intl identity, native control and accessible naming are retained. The ES-LA-specific feedback-sheet visibility rule is preserved independently. All languages therefore follow the same header rules.

The new regression first reproduces the defect from pinned pre.3 at 390 pixels: a 152.1875-pixel header and a 366-pixel-wide selector on row 2. Candidate geometry instead has a 90-by-44-pixel selector in the shared first row. The test requires ordered, nonoverlapping logo/control/version boxes, shared vertical intersection, containment in the header, no document overflow and equal geometry across all ten locales. It also checks saved ES-LA reload, three kinds of language roundtrip, localized recalculation and complete numerical-output parity.

I inspected the actual retained CI images for ES-LA at 320, 390 and 768 pixels, Japanese at 390 pixels, and the 1440-pixel full page. ES-LA is readable inside the compact selector and the version stays in the same row. The 390-pixel Japanese and ES-LA headers have identical placement. At 320 pixels the logo scales down substantially because its grid column has about 68 pixels available; this is the narrow-screen tradeoff visible in the evidence, not a claim of an unchanged logo size. I found no visual blocker in these inspected images.

## Scope and release safeguards

Calculation engine, game inventory, canonical IDs, translation dictionaries, persistence schema and production Worker implementation are unchanged from pre.3. The earlier canonical result/warning/history/terrain fix is retained. The bounded feedback formatter explicitly adds pre.4. ES-LA reporting remains paused and the existing nine reporting languages remain available. Private source captures are not added to distribution. The inherited terminology limitations remain 142/1,029 official Champions identities and 714 unverified fallbacks; none of this UI evidence establishes hardware mechanics accuracy.

Pre.4 has its own cleared pending review/live metadata, explicit policy entries and exact predecessor pin. Stale, retagged or copied earlier review/owner/live receipts cannot authorize it. The strict reviewed-source/tree/report-digest/owner-record binding remains intact, as does the protected-source inventory check and constrained A-to-B acceptance promotion.

The reviewed deployment template now exports the build-selected exact source SHA and checks out that same source in the deploy job after Pages deployment. It runs this same header test with `--public`, checks page title and actual served stylesheet hash against the checked-out candidate, blocks non-GET/HEAD requests and outside-origin page traffic, and retains public header evidence. There is no continue-on-error allowance. The two-job/current-attempt provenance verifier is unchanged and requires all deployment steps to succeed plus an exact reviewed workflow hash. A browser failure therefore prevents successful deployment provenance and final acceptance even though Pages may already have changed; such failure must be remediated or rolled back rather than relabeled as acceptance.

## Independent validation and evidence attribution

I inspected the complete candidate diff against immutable pre.3, including CSS, browser test, deployment output/checkout, release identity, publication/approval helpers, predecessor observation, historical test wrappers and required test discovery. I verified the exact SHA/tree and ran checks in an isolated clone; this review did not edit the source repository or publish anything.

Thirteen local nonbrowser checks passed: pre.4 publication lifecycle; release identity; artifact, locale, source and second-capture contracts; canonical result-source roundtrip; numerical equivalence; 300-case public baseline; deployment-proof cases; immutable release-publication cases; release gate; and target deployment gate. Numerical equivalence covered 4,520 complete-output comparisons. Deployment proof and immutable publication checks covered 19 and 14 mocked cases, respectively. These local results are direct reviewer execution, not production actions.

I independently inspected the retained GitHub API run receipt for the exact head: all **13 workflows completed successfully**, each with head SHA `cea64a6526156111b1e0a50ed3392a3dae6d44a3` and the reviewed tree. Relevant runs are ES-LA `43810664317` and quality remediation `43810664285`. Successful workflow names alone do not mean write jobs actually published on the PR; I make no such claim.

I read the raw candidate suite and header reports from early evidence artifact `14200796115` supplied by the retaining agent. All **23 candidate tests passed**, with a clean checkout and tree `5351d4abc4759bec66ce8560dd9241ca383b09e6`. The actual CI checkout is PR merge commit `9b9c34eb5877a99bd1a8cd303bef49f1b0fb9f7b`, whose recorded tree equals this reviewed candidate; this is tree-equivalent evidence, not an assertion that the two commit IDs are identical. I independently recomputed the downloaded early ZIP digest as `a152589c4a4d850e2cfaa6dca546833aeb70a6cb2513c1f0f854027f155a9e5e`; collection and GitHub artifact association are attributed to the retaining agent.

The raw header report contains 70 successful locale/width cases at 320, 360, 375, 390, 412, 430 and 768 pixels, 21 language cycles and seven saved ES-LA reloads. I inspected the geometry for all seven widths and compared Japanese/ES-LA boxes directly. The existing 60-case UI evidence also includes 1440 pixels, but the new invariant-geometry proof itself ends at 768 pixels. Browser execution and screenshots are CI Chromium evidence inspected by me, not my own successful local browser execution, physical-device certification or a live production observation. The final successful workflow receipt additionally covers the continued legacy checks after the early candidate artifact was retained.

## Remaining publication conditions

The user has authorized publication after quality gates; another permission question is unnecessary. Record that existing authorization against this exact source/tree and this fresh report digest, pass the strict source-bound approval gate, and obtain fresh approved-source CI. Do not copy pre.3 approval or live receipts.

Deploy approved A using the reviewed workflow and require successful actual public header-browser evidence, deployment-run provenance, complete public-file and exact cache-URL verification. Inspect the retained deployed header images/geometry and confirm the deployed ES-LA selector, language cycles, reloads and numerical parity. Preserve the feedback pause and nine-language reporting policy. Only after actual A acceptance may B add the constrained acceptance metadata; require final B checks and public-byte verification before creating the immutable pre.4 tag/Release. Preserve immutable pre.3 and its evidence as the rollback reference.

At this review's completion there is no claim of pre.4 production browser success, deployment, live acceptance, Release publication, Stable readiness or physical-device coverage.
