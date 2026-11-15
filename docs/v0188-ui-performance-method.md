# v0.188 UI and performance verification method

These commands inspect a local frontend snapshot only. They do not deploy,
contact the production feedback Worker, create a report, or create an Issue.

## UI matrix

Run `node tests/v0188-ui-mobile.cjs` with Playwright Chromium installed.
The test creates **54 independent contexts**: all nine locales at widths
320, 360, 390, 430, 768 and 1440 CSS pixels, each 900 pixels high. The smaller
widths enable Chromium's mobile and touch emulation; this is **not physical
smartphone verification**. It checks:

- document overflow before editing, with details open, with feedback open, and
  after restoration;
- 44-pixel height and at least 24-pixel width for representative primary controls;
- Pokémon and move autocomplete selection, detailed inputs and non-default
  conditions;
- calculation equality after language switching and after an explicit save and
  browser reload;
- feedback required-field and failed-send display using a **client-only mocked
  configuration, challenge and 503 response**, and absence of saved report text;
- visible Tab focus after the language control, and representative text contrast.

Contrast checks compute alpha-composited foreground/background luminance for
selected text. They use WCAG thresholds of 4.5:1 for normal text or 3:1 for large
text. Background gradients/images are explicitly recorded as unmeasured rather
than assigned a fabricated color. This is a sample of controls and text, not a
complete accessibility certification or screen-reader assessment.

Evidence is written to `reports/v0188/ui-mobile.json`, with a concise JSON summary
in the execution log. A failed assertion is an actual failure, not a skip.

## Controlled performance comparison

Run `node scripts/v0188-browser-performance.cjs`. Default: five independent
contexts for each version and profile, with twelve calculation and twelve
language-change operations per context. `V0188_PERF_SAMPLES` may select 3–20
contexts; the actual value is included in evidence. Both versions are served by
the same loopback HTTP server with ten-minute cache headers and ETags. The
v0.187 frontend is extracted from commit
`7210be99c39d75b49ea8200aad91d75801eb300a`; the candidate is the current working
tree at invocation. Execution order alternates each sample to reduce order bias.

Profiles are Chromium desktop (1440 × 900) and mobile emulation (390 × 900,
touch/mobile enabled, CPU slowed by four, 40 ms artificial latency, 1.6 Mbit/s
download and 750 kbit/s upload). Version, host CPU, platform, samples and
conditions are recorded. Each fresh context provides one cold navigation and
then one warm reload. HTTPS requests are blocked to prevent external services
and external sprite timing from contaminating the comparison; embedded image
data and same-origin branding images are included. This deliberately excludes
actual CDN latency and any remote sprite/challenge cost.

Measurements include first paint/FCP when exposed by Chromium, DOM/load events,
Resource Timing transfer and decoded sizes for JavaScript/CSS/images, zero-size
cache observations, CDP JS heap/node/document metrics, and operation-to-next-frame
latency. Image data already embedded in HTML contributes to document size, not
an extra image transfer. HTTP transfer sizes include browser-reported overhead
and are not a compressed production-CDN byte measurement. Zero transfer may
indicate caching; it is not assumed to prove all assets are cached.

Memory figures are sampled heaps with no forced collection and are not leak
proof. Operation latency includes the next animation frame, not just engine
arithmetic. Browser performance is reported as observed, with no invented
production threshold or claim of physical-device performance. All raw samples
and medians are in `reports/v0188/browser-performance.json` and the execution
log prints comparison summaries. Unsupported paint metrics remain null.

## Existing public environment, read-only

Run `node scripts/v0188-public-performance.cjs` to measure the existing public
v0.187 independently of the loopback candidate comparison. It performs three
fresh-context cold navigations and warm reloads for each desktop/mobile profile,
then twelve calculation and twelve language-change interactions in the isolated
browser context. It opens no feedback form and sends no reports. A CDP request
guard permits only GET/HEAD to the Singularity Pages subtree or the known
PokeAPI sprite subtree and blocks everything else before transmission. It stops
if the public version title is not v0.187 Pre-Release 33.

The output includes paint/resource/heap/interaction observations and actual
request methods/cache response flags in `reports/v0188/public-performance.json`.
Interception may affect browser caching; zero-size cross-origin entries can also
reflect missing timing permission. The warm run records what Chromium exposes,
not a claim that every resource was served from cache. Public measurements
include CI-to-CDN network conditions and must not be compared directly with the
loopback candidate numbers. No production v0.188 rollout is performed.

## Local runtime limitation

The Work execution environment could not launch its system Chromium:
`socket() failed: Operation not permitted`. The default Playwright download was
also absent. Therefore syntax checks alone are not browser PASS evidence.
The browser matrix and measurements must run in the target-commit CI runner
with Chromium installed, and its result/log must be retained for independent
audit. Real phones and real screen-reader operation remain explicitly unverified.
