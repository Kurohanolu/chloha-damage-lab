# v1.0.0 R2 performance and operations evidence supplement

**The feedback-input optimization remains effective in the fresh R2 experiment.** Mobile emulation median is **64.40 → 21.25 ms**, with calculator-panel DOM mutation records **400 → 0 per 100 inputs**. The historical 83.15 → 27.40 ms figure is from a different run; it is not reused as the v1 result.

## Exact evidence and scope

- Reviewed R2 source: `b5ea506af27487a05cc7fbdc11371ac47778b06a`; tree `1e4d0d54c2013b22db3e15db144f8998cab1adfd`.
- CI checkout: `d12aa4e00187c4dc9f7bcfc47c0e3f6749b4dd2d`; independently checked to have the identical tree; clean checkout.
- [Quality workflow 43697304319](https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43697304319) completed successfully. Its quality runner passes the feedback-performance test with exit 0.
- Performance artifact `14154633815`: SHA-256 `65c4e35148ba3f642dce082e347958b144b139c1b925b75bd46367a1908e9bc4`.
- Quality artifact `14154749293`, containing feedback-specific measurements: SHA-256 `b5e11a2721ed64feb662668fb8a541adf8262e7642a0af4e715fa0aaa38cdff1`.
- Both ZIPs match fresh GitHub artifact metadata. The three extracted raw files used here were checked byte-for-byte against their ZIP entries.

These are R2 measurements, not a claim that a later approval-metadata commit has already completed its own CI or that v1.0.0 is live. All reported statistics below were recomputed from raw arrays using the conventional median and lower/upper-half median IQR. Pooled operations are clustered within browser contexts; they are not independent physical devices.

## Feedback input: controlled one-change experiment

This experiment reverses only the C-P01 feedback-input guard in the candidate while retaining all other bytes. It is not a complete old-version/new-version comparison. Timing starts at input-event dispatch after an animation frame and ends at the next frame. Five isolated contexts ×20 inputs give **100 samples per variant/profile**; variant order alternates between contexts.

Environment: Node 22.23.4, Chromium 145.0.7632.6, Linux, AMD EPYC 9V74, 4 logical CPUs. Desktop 1440px/1×CPU and mobile 390px/4×CPU; context height 900px. Local loopback server, external HTTPS blocked, feedback API unconfigured; routing disables cache equally. No production report requests are sent.

| Profile | Before median [min–max], ms | After median [min–max], ms | IQR before → after, ms | DOM records before → after | n per variant |
|---|---:|---:|---:|---:|---:|
| desktop | 17.20 [16.40–20.60] | 16.70 [16.40–17.50] | 1.15 → 0.10 | 400 → 0 | 100 |
| mobile-390 | 64.40 [54.00–89.70] | 21.25 [17.20–29.40] | 9.50 → 3.15 | 400 → 0 | 100 |

Every before input produces four observed child-list mutation records across attacker/defender type and base-stat panels; every after input produces zero. The successful test also requires no page errors, unchanged complete calculator state, engine input and 16 damage rolls, unchanged calculator-storage bytes, and preserved feedback text. Thus the reduced DOM work does not come from dropping calculator state or feedback input. The measurements demonstrate this specific avoided work, not universal product speed.

Raw file: `reports/v0188/continued-feedback-performance.json` within the quality ZIP; SHA-256 `a3f1264c2234bfe784d638a578f9ac76f58bec7863227367e04e5c17ee88ca96`.

## Calculation, language switching and first render

The matched whole-version benchmark compares published pre.1 `4f068544e670a85a6a4d34dd2c26e2be66bd9cb7` with R2. Environment: Node 22.23.4, Chromium 145.0.7632.6, Linux x64, AMD EPYC 9V45, 4 logical CPUs. Five contexts per version/profile alternate baseline/candidate order. Each context has 12 calculation and 12 locale operations (**60 observations per metric/version/profile**), plus one cold and one warm navigation (**5 each**). Desktop width 1440px; mobile 390px with 4×CPU, 40ms added RTT,1.6Mbit/s down and 750kbit/s up. Same local server cache/ETag policy, external HTTPS resources blocked equally.

| Profile / metric | Baseline median [min–max], ms | R2 median [min–max], ms | IQR baseline → R2, ms | n/version |
|---|---:|---:|---:|---:|
| desktop / calculation to frame | 23.00 [9.50–64.40] | 25.10 [13.50–46.50] | 11.10 → 11.10 | 60 |
| desktop / locale to frame | 57.70 [40.60–91.40] | 61.45 [40.00–95.30] | 12.50 → 14.30 | 60 |
| desktop / cold FCP | 160.00 [140.00–180.00] | 148.00 [144.00–180.00] | 34.00 → 20.00 | 5 |
| desktop / warm FCP | 100.00 [84.00–140.00] | 88.00 [84.00–140.00] | 36.00 → 30.00 | 5 |
| desktop / cold DOMContentLoaded | 193.50 [167.40–224.80] | 180.20 [175.00–216.10] | 46.30 → 22.80 | 5 |
| desktop / cold load event | 205.20 [177.40–237.50] | 190.70 [185.80–227.30] | 48.10 → 23.35 | 5 |
| desktop / warm DOMContentLoaded | 133.20 [107.00–137.90] | 125.80 [105.60–130.70] | 21.60 → 15.95 | 5 |
| desktop / warm load event | 143.40 [132.80–147.30] | 134.50 [131.30–139.20] | 12.75 → 6.80 | 5 |
| mobile-390 / calculation to frame | 100.85 [33.50–157.70] | 102.60 [32.20–162.60] | 33.80 → 38.40 | 60 |
| mobile-390 / locale to frame | 262.30 [169.10–406.10] | 266.40 [186.90–425.50] | 63.60 → 61.35 | 60 |
| mobile-390 / cold FCP | 5080.00 [5076.00–5108.00] | 5068.00 [5060.00–5104.00] | 16.00 → 26.00 | 5 |
| mobile-390 / warm FCP | 352.00 [336.00–360.00] | 360.00 [336.00–376.00] | 14.00 → 28.00 | 5 |
| mobile-390 / cold DOMContentLoaded | 10535.80 [10511.50–10600.80] | 10594.30 [10579.90–10716.20] | 55.80 → 76.40 | 5 |
| mobile-390 / cold load event | 10547.50 [10524.00–10602.60] | 10615.40 [10592.40–10727.40] | 50.45 → 80.10 | 5 |
| mobile-390 / warm DOMContentLoaded | 604.50 [592.50–615.00] | 618.10 [572.60–627.30] | 15.70 → 41.55 | 5 |
| mobile-390 / warm load event | 612.90 [600.10–622.90] | 626.00 [580.80–636.00] | 16.10 → 42.05 | 5 |

Calculation medians are +2.10ms desktop and +1.75ms mobile; locale medians are +3.75ms and +4.10ms. Ranges overlap substantially. No statistical significance, causal explanation or general speedup is established. Shaped cold-mobile FCP is about 5.1s and full load about 10.6s in both versions; these are synthetic bandwidth/CPU conditions, not measured real-phone promises. The first-render and feedback experiments ran on different CPU models, so their absolute timings must not be pooled.

Raw `browser-performance.json` SHA-256: `e9e2e7a6a335520735c50f7465977020679da28da675e6a83168503c3e52f35e`.

Uncontrolled post-operation heap medians remain 7,755,828 →7,850,448 bytes desktop and 7,972,000 →9,675,932 bytes mobile. This benchmark does not force GC. Keep the independent controlled-memory findings and positive residual retained-heap trends separate; neither uncontrolled allocation growth nor sampled-object collection establishes a universal leak verdict.

## Public observation and operational limits

The public-performance artifact was observed at **2026-11-15 18:07:15 JST** and still identifies **v0.188-pre.1**. It uses three contexts/profile ×12 operations, GET/HEAD-only interception, zero feedback-form openings and zero production mutations. Its CDN/network path differs from loopback; its timings are not evidence that R2 is deployed and should not be compared directly with local candidate latency. Raw `public-performance.json` SHA-256: `1c9a31c4c704dd7d27d464b2df7a289a07476f0d2f54c8d9929f101a03c3a8ab`.

Separately, the fresh operations baseline verifies 212/212 static asset hashes, 371/371 external sprite responses and the existing pre.1 archive. The complete original public Worker check passes 10/10 after its recorded initial configuration-fetch exception; four approved/unapproved CORS checks pass. The source repository’s authenticated Pages settings were later directly confirmed as `pages-legacy` / `/ (root)`, preserving the old calculator.

**Cloudflare management remains INCOMPLETE.** Wrangler is unauthenticated and the normal Cloudflare browser dashboard redirects to its login page. No management login, credential entry, private-row read or setting change was attempted. Current Worker identity/bindings, D1 linkage, complete Access/Turnstile administration and backend rollback target are not established by public-readiness success. Existing Issue #65 uniqueness also does not prove live D1 linkage. Actual v1 production acceptance remains a separate post-deploy gate.

## Retained files

Raw inputs remain under `/workspace/scratch/8e0c644c2ae3/v1-sol-artifacts/`: `performance/browser-performance.json`, `performance/public-performance.json`, and `quality/reports/v0188/continued-feedback-performance.json`. Complete recomputed statistics, environments and identities are in sibling `v1-final-performance-summary.json`. This supplement does not alter any source, approval metadata or production state.
