# Singularity v1.0.0 final main M — performance and finite memory evidence

Source `0b270c1452505268364659edd402209b00b28673`; tree `239c4cbd37aa6389f16dc81e7f9a861c09a723f2`. Baseline `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7`. Fresh push/main [quality run 43701633753](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43701633753). All three artifact and raw candidate identities are checked directly against M. No R2 timing data is reused.

The tables use independently recomputed conventional medians from raw samples. Parentheses contain min–max, IQR and n; Q1/Q3 use medians of the lower/upper halves. GitHub-hosted runner measurements are emulation, not physical-device results.

## Artifact provenance

|Artifact|ID|ZIP SHA-256|
|---|---:|---|
|v0188-controlled-memory-evidence|14156802797|`a3207d24b6dadce951a49049382ba3f727f1296a77aa0dfb9acf7296d85efa2f`|
|v0188-performance-audit-evidence|14156382851|`236eaf31f4fb4ed26ac0d58a29aa64e04aa4d251fb5dbb3704803dbf03092b3b`|
|v0188-quality-audit-evidence|14156239034|`e4ed87344fa7ec4e17e081f6293d49517a8eb040d11c90845d12b6b27ff3f7f4`|

API head SHA is M, recorded digest equals downloaded ZIP digest, and retained raw files match their archive entries. See `artifact-provenance.json` and the summary JSON for receipt metadata and per-file hashes.

## Feedback input / calculator DOM updates

Controlled guard reversal: controlled candidate guard reversal; all other bytes identical. Five independent contexts × 20 input operations = 100 timings per variant/profile. Only the C-P01 feedback-input guard is reversed for the before variant; this is a same-candidate causal check, not a historical-run timing comparison.

|Profile|Guard reversed (before), ms|Final M guard (after), ms|Median reduction|DOM records before → after|
|---|---|---|---:|---:|
|desktop|17.45 (16.50–22.60; IQR 1.25; n=100)|16.60 (16.20–17.30; IQR 0.30; n=100)|4.87%|400 → 0|
|mobile-390|64.55 (57.50–85.30; IQR 6.40; n=100)|21.25 (18.00–38.10; IQR 2.40; n=100)|67.08%|400 → 0|

Every before input produced at least four calculator child-list mutation records; every after input produced zero. The test passed with exit 0 and asserts unchanged calculation input, all damage rolls, saved state, expected feedback text, and no page errors. Zero production requests. Mutation records are observer notifications for four calculator panels, not a count of every possible DOM write.

Feedback environment: `{"node": "v22.23.4", "platform": "linux", "cpu": "INTEL(R) XEON(R) PLATINUM 8573C", "logicalCPUs": 4, "locale": "en", "network": "loopback; external HTTPS blocked; feedback API unconfigured", "samplesPerVariantPerProfile": 5, "operationsPerContext": 20, "metric": "feedback input dispatch to next frame, aligned to preceding frame", "cache": "routing disables cache equally for both variants", "order": "alternating before/after context order", "browser": "145.0.7632.6"}`

## Calculation, language switch and render

Five contexts per version/profile, 12 calculation and 12 locale operations each: n=60 per interaction metric. Cold and warm render metrics each use n=5 navigations. Baseline/candidate contexts alternate.

|Profile / metric|Baseline|Final M|
|---|---|---|
|desktop / calculationToFrameMs|20.50 (13.00–34.60; IQR 7.60; n=60)|21.80 (13.90–47.40; IQR 9.75; n=60)|
|desktop / localeToFrameMs|50.05 (35.40–77.20; IQR 11.65; n=60)|53.25 (38.50–77.70; IQR 10.70; n=60)|
|desktop / cold.firstContentfulPaintMs|132.00 (124.00–160.00; IQR 36.00; n=5)|132.00 (132.00–160.00; IQR 26.00; n=5)|
|desktop / cold.domContentLoadedMs|155.90 (151.40–193.50; IQR 38.75; n=5)|160.40 (154.40–200.70; IQR 40.55; n=5)|
|desktop / cold.loadEventMs|165.40 (160.50–203.40; IQR 39.45; n=5)|170.20 (163.60–212.30; IQR 42.20; n=5)|
|desktop / warm.firstContentfulPaintMs|80.00 (72.00–136.00; IQR 48.00; n=5)|80.00 (76.00–88.00; IQR 8.00; n=5)|
|desktop / warm.domContentLoadedMs|107.50 (82.60–121.10; IQR 21.90; n=5)|113.80 (108.70–128.10; IQR 16.15; n=5)|
|desktop / warm.loadEventMs|117.70 (104.10–128.80; IQR 19.35; n=5)|121.30 (116.20–136.00; IQR 16.45; n=5)|
|mobile-390 / calculationToFrameMs|76.00 (25.20–125.90; IQR 31.50; n=60)|75.15 (22.90–122.10; IQR 34.90; n=60)|
|mobile-390 / localeToFrameMs|197.05 (133.40–305.70; IQR 67.30; n=60)|191.95 (136.00–348.30; IQR 38.85; n=60)|
|mobile-390 / cold.firstContentfulPaintMs|5044.00 (5024.00–5056.00; IQR 20.00; n=5)|5032.00 (5020.00–5044.00; IQR 16.00; n=5)|
|mobile-390 / cold.domContentLoadedMs|10443.70 (10434.00–10459.90; IQR 15.55; n=5)|10520.80 (10504.70–10533.40; IQR 24.70; n=5)|
|mobile-390 / cold.loadEventMs|10455.70 (10448.90–10471.10; IQR 19.95; n=5)|10532.30 (10514.70–10544.20; IQR 24.95; n=5)|
|mobile-390 / warm.firstContentfulPaintMs|296.00 (288.00–316.00; IQR 18.00; n=5)|292.00 (280.00–320.00; IQR 28.00; n=5)|
|mobile-390 / warm.domContentLoadedMs|475.20 (471.50–524.90; IQR 39.45; n=5)|480.30 (476.80–513.60; IQR 25.30; n=5)|
|mobile-390 / warm.loadEventMs|480.20 (476.90–531.70; IQR 40.35; n=5)|485.90 (482.70–519.70; IQR 25.30; n=5)|

Values above are milliseconds. Environment: `{"node": "v22.23.4", "platform": "linux", "arch": "x64", "cpu": "AMD EPYC 9V45 96-Core Processor", "logicalCPUs": 4, "samplesPerVersionPerProfile": 5, "operationSamplesPerNavigation": 12, "cachePolicy": "same local server max-age=600 and ETag", "network": "loopback; mobile emulation adds40ms RTT,1.6Mbit/s down,750kbit/s up and4x CPU slowdown", "thirdParty": "HTTPS blocked; embedded data images remain; external sprites/Turnstile omitted", "order": "alternating baseline/candidate between rounds", "browser": "145.0.7632.6"}`

Uncontrolled post-operation JS heap is diagnostic only; it is not comparable to a forced-GC retention result:

|Profile|Baseline heap bytes|Final M heap bytes|
|---|---|---|
|desktop|7253252.00 (7223204.00–7772912.00; IQR 338196.00; n=5)|7985104.00 (6200492.00–9629936.00; IQR 2693626.00; n=5)|
|mobile-390|8024456.00 (7657856.00–10385408.00; IQR 2333868.00; n=5)|8305300.00 (7548244.00–9527348.00; IQR 1746852.00; n=5)|

## Controlled GC and bounded retention

Two profiles × two versions × three independent contexts = 12 contexts. Each runs two warmup rounds plus six measured rounds, then three reload checks: 72 measured rounds and 36 reloads. Each round exercises allocation, all nine locales with numeric parity, local feedback interaction and persistence settling. Two full CDP GCs and task boundaries precede weak-probe pruning, then one cleanup GC precedes heap/counter capture.

|Profile / version|Context heap medians, bytes|First→last measured heap delta, bytes|Heap slope, bytes/round|Reload heap delta, bytes|
|---|---|---|---|---|
|desktop / baseline|4776656.00 (4775130.00–4797418.00; IQR 22288.00; n=3)|76936.00 (76932.00–77068.00; IQR 136.00; n=3)|17857.03 (16514.86–17897.49; IQR 1382.63; n=3)|25220.00 (25140.00–30596.00; IQR 5456.00; n=3)|
|desktop / candidate|4755900.00 (4755472.00–4757716.00; IQR 2244.00; n=3)|25848.00 (25804.00–25920.00; IQR 116.00; n=3)|5518.97 (5181.71–5556.11; IQR 374.40; n=3)|27624.00 (27596.00–27768.00; IQR 172.00; n=3)|
|mobile-emulation / baseline|4843802.00 (4840836.00–4846306.00; IQR 5470.00; n=3)|79172.00 (78164.00–83788.00; IQR 5624.00; n=3)|17046.17 (16748.34–18192.00; IQR 1443.66; n=3)|15224.00 (9800.00–15720.00; IQR 5920.00; n=3)|
|mobile-emulation / candidate|4798872.00 (4797652.00–4798896.00; IQR 1244.00; n=3)|25632.00 (25492.00–25656.00; IQR 164.00; n=3)|5397.94 (5369.37–5410.29; IQR 40.91; n=3)|18016.00 (17968.00–29460.00; IQR 11492.00; n=3)|

All 12 calibration controls and finite scenarios passed. Sampled retired probes: 13,248; collected by each context's final checkpoint: 13,248; retained entries: 0; aged retained probes: 0. Removed element instances: 23,040; sampled: 12,288; outside the cap: 10,752; calculation probes: 960. Detached-tree counts observed across contexts: [16].

The full memory harness lasted 369.06 seconds. The six measured checkpoints span 7.24–28.62 seconds per context; this is finite repetition, not a long-running soak. Document, DOM-node and event-listener first-to-last deltas are recorded per context in the JSON.

Bounded sampled-retention check only. All probes in the finite sampled set clearing does not establish universal object collection, a heap plateau, absence of memory leaks, or hours-long real-device stability. Positive post-GC heap/reload growth is retained in the statistics. Fixed detached OPTION trees require source/retainer interpretation; a count alone does not establish their identity or harmlessness.

Memory environment: `{"node": "v22.23.4", "platform": "linux", "arch": "x64", "kernel": "7.0.0-1017-azure", "cpus": 4, "cpuModel": "AMD EPYC 9V74 80-Core Processor", "playwright": "1.58.2", "browserVersion": "145.0.7632.6", "chromium": {"protocolVersion": "1.3", "product": "HeadlessChrome/145.0.7632.6", "revision": "@47e20adcc15fc15f01825aa17e570c8f5492ac0f", "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/145.0.7632.6 Safari/537.36", "jsVersion": "14.5.201.2"}}`

Raw memory protocol, context-level document/node/listener/connected-element trends, reload statistics, and harness limitations are retained in the summary JSON.

## Public observation and operational limits

The performance job also made a read-only public observation. Its actual observed release metadata is `{"version": "1.0.0", "preRelease": null, "tag": "v1.0.0", "name": "Singularity v1.0.0", "product": "Singularity", "developer": "Chloha Labs", "publicUrl": "https://kurohanolu.github.io/singularity/"}`. Three samples per profile and 12 operations per sample are separate CDN observations; they are not an identical-environment baseline/candidate comparison or by themselves full publication acceptance. Zero production mutations and zero feedback forms opened.

Public availability and boundary behavior are separate from authenticated Cloudflare management verification. The prior safe browser check reached the Cloudflare sign-in wall; current Workers/D1/Access/Turnstile management settings remain unverified. No login bypass, private report access, new production report, backend deployment, or authentication change was performed for this evidence task. Physical Android/iOS, native screen readers and OS IME, unrestricted long-session memory, and all Champions mechanics remain outside this bounded performance evidence.
