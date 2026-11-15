# v0.188 final release gate: controlled memory

## Final candidate and evidence

The controlled-memory assertions **PASS** on the final candidate. In this bounded
run, none of the sampled retired calculator DOM nodes or superseded calculation
result wrappers remained reachable after collection. This is not a certification
that the entire application is leak-free or that heap use has reached a plateau.

- Source candidate: `c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095`.
- CI pull-request merge checkout: `3bb9c9a300fe20b98338bfb6d58ae2409062617f`.
- Both have Git tree `bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b`. The CI working tree was clean.
- Published baseline: `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`,
  tree `cf7af9334261b0cfbbde45929da9d217445fe526`.
- [CI run 43691428060](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43691428060),
  `controlled-memory` job `132742711207`, successful measurement step.
- Artifact `14152533305`, `v0188-controlled-memory-evidence`, ZIP SHA-256:
  `4b8b869a00fbee9ed5380ec6fd48f934ded81acd8ccb86f2354b595373545311`.
- Exact archived [raw JSON](evidence/v0188-final-memory.json), SHA-256:
  `c4dd09ad521c23d774aaf033fad687589df42d6b3a26c4df1deac3e56f3431f0`.
- Started `2026-11-15T07:47:16.437Z`; test elapsed **286.147 seconds**.

The earlier `c895a82` execution validated the method, but its PASS and measurements
are not reused for this candidate. The local Work environment could only perform
syntax/source checks: Chromium launch failed with `EPERM`. All browser conclusions
here come from the successful final CI artifact above.

## Environment and fixed protocol

Node `v22.23.4`, Playwright `1.58.2`,
Headless Chromium `145.0.7632.6`, CDP 1.3, Linux x64
(kernel `7.0.0-1014-aws`), four logical CPUs,
`Intel(R) Xeon(R) 6975P-C`.

Both versions ran in the same CI job, under the same browser and operation sequence.
Desktop used 1440×900 and 1× CPU; mobile emulation used 390×844, touch enabled,
and 4× CPU slowdown. Each profile/version had three isolated contexts: **12 contexts**
total, with baseline/candidate order alternated. Results from the earlier AMD/Azure
runner and this Intel/AWS runner were not pooled or treated as a time comparison.

Each context had two complete warmup rounds and six measured rounds without
reloading. Each round visited all nine locales, changed an allocation and
calculated, opened/typed/closed disabled local feedback, and returned to English
with the same allocation value. Checkpoints waited for the save timer and two
animation frames. Two `HeapProfiler.collectGarbage` passes, separated by a task
boundary, preceded weak-probe inspection. Collected WeakRefs/metadata were pruned;
a third cleanup GC preceded heap and DOM counters. Only live probes and scalar
counts remained in the browser; full history stayed in the Node controller.

Strongly held detached-node and plain-object positive controls survived GC;
removing their strong references cleared both weak controls in **12/12 contexts**.
No cache eviction, worker termination, or `Memory.prepareForLeakDetection` was used.
The temporary DOM observer disconnected before GC. No element handles or strong
references to retired sampled nodes were retained by the audit.

The run completed:

| Coverage | Final count |
|---|---:|
| Complete nine-language rounds | 96 (24 warmup, 72 measured) |
| Locale assignments / numerical locale-parity checks | 960 / 864 |
| Round allocation inputs / round feedback text inputs | 960 / 960 |
| Feedback open/close cycles | 864 |
| Sampled removed DOM-root entries | 12,288 |
| Observed DOM-root removals / removals beyond sampling cap | 23,040 / 10,752 |
| Sampled superseded result-wrapper entries | 960 |
| Total weak-probe entries / surviving entries at any checkpoint | 13,248 / 0 |
| Exact state, engine-input and 16-roll reload comparisons | 36 / 36 passed |
| Browser page errors / mutating network requests | 0 / 0 |

The DOM sample cap was 128 removed roots per round, from `attTypes`, `defTypes`,
`attBaseStats`, and `defBaseStats`. Counts represent probe/removal entries, not a
claim that every object allocation was inspected. Older surviving probes would
have failed the check for investigation; none survived even the initial two-GC
inspection. Calculator storage excluded the identifiable feedback text, and
feedback text did not restore in any of the 36 reloads. Those privacy checks add
36 marker inputs outside the 960 round feedback inputs listed above.

Requests were confined to the local snapshot server. External GETs were blocked,
feedback configuration was disabled locally, and submission was never invoked.
Production Worker, Turnstile, D1, private reports and GitHub Issues were untouched.

## Post-warmup retained-heap observations

For each context, the heap median uses six measured post-GC checkpoints. Table
medians then aggregate the three context values; brackets give their minimum and
maximum. Delta is checkpoint 6 minus checkpoint 1 within a context. Slopes are
least-squares bytes per complete round; they are descriptive, not leak thresholds.

| Profile | Version | Context heap medians, bytes: median [range] | Within-context delta, bytes: median [range] | Slope, bytes/round: median [range] |
|---|---|---:|---:|---:|
| desktop | baseline | 4,776,616 [4,775,130–4,780,646] | 76,940 [76,888–77,880] | 17,875.54 [17,871.77–17,946.51] |
| desktop | candidate | 4,747,988 [4,747,656–4,748,232] | 31,328 [19,088–31,744] | 7,012.34 [5,228.46–7,070.63] |
| mobile-emulation | baseline | 4,848,096 [4,824,584–4,848,574] | 82,672 [77,052–86,804] | 17,802.06 [16,516.80–18,683.66] |
| mobile-emulation | candidate | 4,786,910 [4,767,302–4,787,498] | 33,640 [31,784–35,460] | 7,460.34 [6,993.71–7,725.14] |

Matched candidate-minus-baseline context-median differences were **−0.68% to
−0.58% on desktop**, and **−1.67% to −0.77% under mobile emulation**. Thus this run
does not reproduce the earlier uncontrolled +30.8% / +24.3% heap difference under
the new controlled protocol. The protocols are different; this is not proof that
those earlier measurements were wrong, nor a universal memory improvement claim.

**Residual positive heap growth remains visible.** Candidate median first-to-last
growth was 31,328 bytes on desktop and 33,640 bytes on mobile, with positive slopes.
The baseline also grew, by 76,940 and 82,672 bytes respectively. No retaining-path
heap snapshot was taken to attribute every additional byte. JIT/runtime caches or
other causes have not been demonstrated. These data do not prove a plateau or
rule out growth over a much longer session.

## DOM, listener and detached-node observations

All 72 measured continuous-operation checkpoints had one document, 10,947 total
DOM nodes and 2,260 connected elements. The baseline had 262 event listeners and
the candidate 263; neither count grew within any context. All 96 checkpoints,
including warmup, had zero surviving sampled weak probes.

End-only `DOM.getDetachedDomNodes` inspection was available in all contexts and
reported exactly **16 detached `OPTION` trees** in each baseline and candidate
context, each with one retained node and a two-node tree. This inspection ran
after the continuous time series, so its DevTools references did not affect that
series.

There is a concrete source-consistent explanation: `index.html`'s `plateOptions`
strong Map intentionally keeps the 17 type-plate option nodes to preserve their
translation metadata; `syncPlateChoice` detaches them and reattaches only the one
matching the selected move type. `battle-data-v0184.js` defines those 17 plates.
This code is identical in the published baseline and final candidate. Keeping 16
inactive plate choices is consistent with the observed count. However, the raw
CDP summary records node kinds/counts, not individual option values or full
retaining paths, so exact identity attribution of all 16 observed nodes remains
unproven. The evidence does not justify classifying these fixed counts as a leak.

## Separate reload observations

All 36 reloads restored the exact full calculator state, engine input and all
16 damage rolls. Reload checkpoints remained at one document and 2,260 connected
elements, with 275 baseline / 276 candidate listeners. Total DOM nodes ranged
from 10,952 to 12,992 in both versions. These reload samples follow detached-DOM
inspection and are kept separate from the continuous-operation series.

Across the six contexts per version, reload-1-to-reload-3 retained-heap change had
median +18,034 bytes for baseline (range +15,192 to +25,140) and +26,514 bytes for
candidate (range +16,852 to +28,344). That small positive reload-series growth is
recorded, not discarded or converted into a leak verdict. Three reloads and the
post-inspection protocol cannot establish long-term document/runtime retention.

## Scope of conclusion and independent handoff

The successful assertions support **no persistent retention detected among the
sampled retired calculator objects during this protocol**, with no accumulation
in continuous-run DOM/document/listener counters. They do not certify every object,
all input combinations, hours of use, native screen readers, physical mobile
devices, GPU/process memory, extensions, or production feedback services.

The final gate should retain the positive residual heap trends, the bounded
sampling horizon, reload-series limits, and qualified detached-option attribution.
No product memory fix was justified by these observations. Sol receives the exact
raw JSON, hashes, environment and protocol for an independent final interpretation.
The source branch's pre-execution protocol remains unchanged; this analysis and
raw copy are recorded only in the final-report branch.

Primary protocol references:
[GC](https://chromedevtools.github.io/devtools-protocol/tot/HeapProfiler/#method-collectGarbage),
[DOM counters](https://chromedevtools.github.io/devtools-protocol/tot/Memory/#method-getDOMCounters),
[detached DOM](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#method-getDetachedDomNodes).
