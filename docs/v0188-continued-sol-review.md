# Independent Sol review — final scoped verdict

Recorded 2026-11-15. Reviewer: independent 6.1 Sol. No product edits, commits, pushes, production submissions or release actions were performed by this reviewer.

## Verdict and exact scope

| Scope | Verdict |
| --- | --- |
| Candidate source corrections and demonstrated automated regression behavior | **PASS** |
| Draft release safeguards, exact candidate/artifact binding and retained historical contracts | **PASS** |
| Demonstrated feedback-input work reduction under controlled browser emulation | **PASS**, bounded to the measured guard experiment |
| Universal performance/memory improvement, every game interaction, physical-device/accessibility/language certification | **INCOMPLETE** |
| Full current production/Cloudflare administrative certification or deployment of this candidate | **INCOMPLETE** |

The exact reviewed candidate is `5f88e471d5a8a3374181ce0d37deb211c1dd9f26`, tree `695db47cc2fe7d727de246702cdafc16cff40893`, PR #67. Final local source was clean. CI checks out synthetic PR merge `398c61545e34e4d7b4d9127d8a5d92dabcf75054`; I independently verified that its tree is exactly the candidate tree. The published comparison remains `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`, tree `cf7af9334261b0cfbbde45929da9d217445fe526`.

No unresolved confirmed defect remains in the reviewed changes. This is a bounded engineering PASS, not permission to merge, replace the immutable pre.1 tag, release or publish. The follow-up marker still blocks publication. Owner decisions and any later release identity remain separate.

## Independent findings and dispositions

**SOL-01 — Medium — invalid calculation retained snapshot confirmation: FIXED.** In starting candidate `8b37bdd`, an inactive six-stat change from valid66 to invalid67 points clears the result before the bridge updates. Controls and engineInput remain identical, but result becomes null. The proposed freshness identity excluded result, so confirmation remained checked and submit passed the attachment guard. I reproduced both source paths independently with actual UI functions and feedback handlers. Final source includes result in identity; locale remains excluded. Final CI passed the nine-language real-browser case proving unchanged controls/input, null result, stale warning, revoked consent and zero report POSTs, plus event and submit-time handler regressions.

**SOL-02 — Medium — automatic Foul Play to manual mode silently stopped persistence: FIXED.** Candidate `2824c6e` saved valid Foul Play raw98/effective66 allocations but rejected the same state after disabling automatic mode. The UI validator returns immediately in manual mode, while persistence still required the inactive raw aggregate to be66 or less. I independently confirmed `{live:true,saveable:true}` before and `{live:true,saveable:false}` after the toggle. The final correction enforces aggregate budgets only when automatic mode consumes those allocations. Individual point/rank/nature/manual-value/shape/control/privacy validation remains active in both modes. The incorrect test expectation that manual aggregate excess must be rejected was removed. Final source52 checks, schema35 checks and real-browser nine-language transitions passed, including manual edits/reload, another manual move/reload and rejection when invalid aggregate is reactivated automatically.

Other reviewed changes:

- Screen correction excludes exactly Brick Break `gw0169_p022` and Psychic Fangs `v096_085` from the screen modifier for the current hit. Input/screen state is not mutated and other final modifiers remain. Independent arithmetic and locked external-reference witnesses passed. This does not implement persistent screen removal across battle turns; Raging Bull screen breaking remains explicitly unsupported.
- Manual HP/Speed table edits and displays use the correct per-side canonical controls. Attacker HP preserves defender HP; Speed changes reach `attSpeed`/`defSpeed`. The final state browser artifact proves distinct controls, all16 independent Electro Ball rolls and full reload equality in nine languages.
- Selected-move warnings derive from canonical readiness/verification metadata, and variable power uses the shared translator. Initial ArrowUp selects the final suggestion, and rebuilding each of the three comboboxes clears stale active descendants. Actual source-function and browser checks passed. Translation matching is established; exhaustive native-language quality is not.
- Feedback-panel inputs bypass the calculator document adapter. Actual source work counts change60 feedback refreshes to0, while60 calculator refreshes remain60. Feedback validation and consent handlers remain independent.
- The four changed external scripts have verified content cache keys. Exact reversible contracts admit only documented source changes and retain unrelated-mutation negatives. The initial missing-key integration failure was repaired and final checks passed. Original300 fixtures and Worker source remain unchanged.

## Independently inspected final CI evidence

Final run: [43686630714](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43686630714).

I fetched GitHub job steps directly and confirmed both quality job `132728360552` and performance job `132728360669` completed successfully. Quality includes actual browser installation, locked reference installation, all mandatory v0.188 tests, the preserved90-transition test, Worker tests, clean-source asset build and artifact upload. I also fetched the candidate-associated workflow list: all11 listed workflows completed successfully, including the ten required verification workflows. The publication workflow's green result is validation only: publish job `132728388872` is explicitly **skipped**. Pages smoke checks the historical published base; it does not establish candidate deployment.

I independently fetched the artifact API metadata, matched the run head to exact5f88, and recomputed the downloaded ZIP hashes:

| Artifact | API ID | SHA-256 |
| --- | --- | --- |
| Quality | `14150244937` | `222654fcfc32edbda638e46c19858d716967a325f573c63d00fa73f9e645a074` |
| Performance | `14150033002` | `5860ab3303d0e0c25ea936d60345c6eded8fe652ee266d34ce03d921b4caa57e` |

Inspected `/workspace/scratch/8e0c644c2ae3/continued-final-quality` and `/workspace/scratch/8e0c644c2ae3/continued-final-performance`:

- Test-run report records **31/31 files passed, failed0**, all exit0. This includes the new browser suites and existing persistence, portrait,54-combination locale/viewport, mobile, Worker and release tests; passing-file counts are not assertions or exhaustive scenario counts.
- New state report contains nine each of automatic Foul Play reloads, manual Foul Play reloads, manual move-change reloads, automatic invalid-budget rejections and Speed reloads. Its numerical cases contain the expected60/80/40-power16-roll vectors for each language.
- New locale report contains18 passed language/viewport cases (nine languages ×390/1440px), three comboboxes, three warning categories and reload/numeric parity. Existing broader viewport tests also passed.
- All75 migration artifact manifest SHA-256 entries match their extracted files. All42 files packaged under `singularity/`, including index, four changed scripts and release manifest, match exact5f88 source bytes. Preview is marked approval-required, clean, and `publicCutoverPerformed:false`.
- Historical42-file owner-approval binding remains explicitly historical. Its PASS is not an assertion that the old owner approved new candidate bytes. Candidate artifact matching and exact-delta checks are separate.

Independently executed meaningful local checks throughout review: new engine/state/locale/feedback regressions, schema35, existing state lifecycle, locale90, runtime/inline/cache/release/follow-up gates, fixed300 baseline, portrait checks, Worker security and test-runner failure behavior. I also reran move differential657, seeded differential4,000 and ability witnesses321: zero mismatches. New engine coverage passed216 independent arithmetic vectors,456 locked reference comparisons,20 unaffected-move/ID witnesses and six immunity witnesses. Existing Astra1,627 arithmetic/mechanic witnesses and3,600 historical comparisons passed. These finite references do not certify all game mechanics or physical-game behavior.

Local browser execution was blocked by socket EPERM; I do not claim a local browser PASS. Actual browser evidence above comes from the verified final CI artifact with exactly matching source tree and packaged bytes.

## Performance interpretation

I recomputed medians from raw artifact samples. General baseline/candidate measurements use five isolated contexts per version/profile,12 operations per context, alternating order, loopback Chromium emulation. Mobile adds network shaping and4×CPU; external HTTPS is blocked. Pooled60 operations are clustered within five contexts, not60 independent devices.

| Median metric | Published baseline → candidate |
| --- | --- |
| Desktop calculation-to-frame | 19.45 →19.10ms |
| Mobile calculation-to-frame | 77.65 →73.75ms |
| Desktop locale-to-frame | 46.55 →48.30ms |
| Mobile locale-to-frame | 195.10 →191.20ms |
| Desktop post-operation JS heap | 7,310,760 →9,561,356 bytes (+30.8%) |
| Mobile post-operation JS heap | 7,768,068 →9,656,040 bytes (+24.3%) |

Context ranges overlap. These measurements do not establish statistical significance or a general speed improvement. Heap was sampled without forced/control-matched GC or a long-running leak test: the increase must remain visible as a limitation; it is neither proof of a leak nor evidence of memory improvement. Public-CDN observations must not be compared directly with this loopback experiment.

The separate controlled guard-reversal experiment keeps other candidate bytes identical and uses five alternating contexts ×20 inputs per variant/profile (100 pooled samples). I recomputed its median and IQR using its stated quartile rule:

| Feedback input-to-frame | Old guard →new guard |
| --- | --- |
| Desktop median / IQR | 18.05 /2.05 →16.80 /0.10ms |
| Mobile390px4×CPU median / IQR | 83.15 /7.85 →27.40 /3.75ms |
| Observed calculator panel mutations per100 inputs | 400 →0 in each profile |

The test also asserts complete calculator state/input/roll equality, unchanged calculator storage and preserved feedback text. This supports removing that specific avoidable work under the measured conditions; it is not a physical-phone or complete application performance guarantee.

## Production and remaining limits

The public-performance artifact identifies existing `v0.188-pre.1`, permits GET/HEAD only and records zero mutations and zero feedback forms opened. It observes the released application, not this candidate. I reviewed the separate operations evidence as reported evidence rather than independently reperforming its212 asset requests,371 sprite fetches or Release ZIP download. Those observations concern the historical source. Mutable external sprite URLs do not provide permanent source-pinned identity.

Current Cloudflare management access is unavailable. Current deployed Worker full-byte identity/version/bindings, D1 state, complete Access policies, Turnstile administrative settings, real Turnstile challenge execution and authenticated production replay remain unverified. Public readiness/CORS/JWKS checks and local signed-JWT/security tests do not replace these checks. Physical smartphones, full native screen-reader experience, exhaustive native-linguistic review, every contrast state and every mechanics interaction also remain unverified.

Confidence is high for the narrow corrected paths because their old failures were reproduced, the source deltas were independently inspected, local contracts and independent references passed, and final browser/artifact evidence matches the exact candidate tree. That confidence does not extend to the explicit unverified scopes above. No unresolved known source finding remains; full production certification and publication authorization remain **INCOMPLETE**.
