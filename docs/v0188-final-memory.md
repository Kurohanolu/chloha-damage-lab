# v0.188 final release gate: controlled memory protocol

Protocol recorded before execution and before any product change for this check.
Initial candidate: `5f88e471d5a8a3374181ce0d37deb211c1dd9f26`, tree
`695db47cc2fe7d727de246702cdafc16cff40893`. Released comparison:
`4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`. A later candidate must be
identified by its own commit/tree in the raw output; this document does not
transfer a previous candidate's result to a changed commit.

## Purpose and scope

The previous uncontrolled heap changes (+30.8% desktop, +24.3% mobile) are
observations, not evidence of a memory leak. This check compares the published
v0.188 baseline and the current candidate under the same repeated operations,
with explicit Chromium garbage collection. It also checks whether retired
calculator DOM subtrees and calculation result objects remain reachable.
No product modification is part of this protocol.

Run `node scripts/v0188-final-memory.cjs` in a separate required CI job, with
the repository's Playwright Chromium installed and the baseline commit fetched.
The local Work container cannot launch Chromium (`EPERM`); syntax checks there
are not browser or memory results. The raw report is
`reports/v0188-final/memory.json`, including a failure record if execution fails.

## Fixed protocol

- Two profiles: desktop 1440×900 / 1× CPU, mobile emulation 390×844 / 4× CPU.
  Three isolated browser contexts per version per profile (12 contexts total),
  with baseline/candidate order alternated. One fresh page per context.
- Two complete warmup rounds, then six measured rounds without reloading.
  Each round visits all nine locales, changes an allocation and calculates,
  opens/types/closes local feedback, and ends in the same English calculator
  state. Results must have 16 rolls and remain identical across locale changes.
- Checkpoints wait for persistence's pending timer and two animation frames,
  then request two `HeapProfiler.collectGarbage` passes separated by a task
  boundary. Record weak-probe survivors and prune collected WeakRefs/metadata;
  a third cleanup GC then precedes heap use, DOM/document/listener counters and
  connected DOM size. Full measurement history stays outside the browser; only
  live probes needed for aging and scalar counts remain in it. This avoids
  manufacturing heap growth by retaining the audit's own growing arrays.
  No forced cache eviction, worker
  termination, or Chromium `Memory.prepareForLeakDetection` is used.
- Before measurement, positive/negative controls prove that a strongly retained
  detached node and object survive GC, and that removing the strong references
  lets their weak references clear. A failed control invalidates measurement.
- A temporary observer samples removed element roots only from `attTypes`,
  `defTypes`, `attBaseStats`, and `defBaseStats`. It disconnects before GC.
  Calculation result wrapper objects are sampled immediately before replacement.
  Probes keep only WeakRefs and scalar metadata, not DOM handles or strong JS
  references. Capped sampling and its coverage are recorded.
- Detached-node protocol inspection runs only after the continuous time series,
  so any DevTools inspection references cannot affect earlier measurements.
  Experimental protocol support or its absence is explicitly recorded.
- Three subsequent reloads check exact persisted state, calculation input and
  all 16 rolls; their post-GC metrics form a separate series. Feedback text must
  never appear in calculator storage or return after reload.
- Requests are confined to the local snapshot server. Feedback configuration is
  disabled locally; submission is never invoked. Production APIs, Turnstile,
  private reports and Issues are not involved.

## Interpretation and acceptance

The report keeps every checkpoint, environment, operation count and timing.
Summaries give per-context post-warmup first/last values, ranges, median, and
least-squares slope per round, plus matched baseline/candidate comparisons.
Percentage or slope thresholds alone do not establish a leak or a pass.

Required functional/instrumentation assertions are: calibrated collection,
unchanged results across locales and reloads, privacy, no page errors, and no
mutating requests. Retired probes surviving two further complete rounds of
operations and GC are unexpected retained objects and require investigation;
this fails the audit check without claiming an unbounded leak. A surviving
recent probe is recorded but is not by itself a leak verdict. Listener, document,
DOM and heap trends remain evidence for reviewer inspection, including any
growth not explained by probe results. A clean bounded run only supports
**no persistent retention detected in the sampled objects during this protocol**.

This test cannot certify hours of use, all input combinations, native screen
readers, physical mobile devices, GPU/process memory, extension interactions,
or every possible retained object. A plateau is not inferred from one endpoint.
CI evidence and Sol's independent interpretation are required for the final gate.

Primary protocol references:
[GC](https://chromedevtools.github.io/devtools-protocol/tot/HeapProfiler/#method-collectGarbage),
[DOM counters](https://chromedevtools.github.io/devtools-protocol/tot/Memory/#method-getDOMCounters),
[detached DOM](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#method-getDetachedDomNodes).

## Execution record

Pending CI execution. No browser PASS or memory conclusion is asserted by this
pre-execution protocol. The final gate report must identify the exact candidate,
CI run, attached raw JSON, observed retention trends and remaining limitations.
