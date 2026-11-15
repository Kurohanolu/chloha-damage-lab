# ES-LA browser review — cc5a757

Reviewed 2026-11-15. This is intermediate CI evidence, not release approval.

- PR head: `cc5a7576e1e4043b3e94ccf865c4517f65331451`
- CI checkout: `76d20a575287c0d7a04961dd3c283c0d8693088d` (synthetic PR merge)
- Matching tree: `157f266eec35a896309847c9438e35a4e722aef9`
- Workflow: <https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43722836311>
- Job: `132838325434`
- Artifact: `14165905804`, 7,337,563 bytes; downloaded SHA256 matches GitHub digest `c9d169b045b03e423efee833b2f14b89eaba46740251a81eef223855138da559`.
- Local ZIP: `/workspace/scratch/8de3f6ca2399/v110-cc5a-evidence.zip`
- Extracted evidence: `/workspace/scratch/8de3f6ca2399/v110-cc5a-evidence/`

## Result

The candidate acceptance failed: 9 of 11 test files passed. Failures were test harness defects, corrected in the following test-only candidate `e7453c1eee5642c257499e03fad76906669a3487`; that rerun must pass before acceptance.

1. Regional search selected a correct species from `#dbDefPokemon` while its containing details element was closed. Playwright timed out because the control was not visible. The correction opens its ancestor details before the ordinary select action; species ability validation and actual native typeahead remain required.
2. The English-fallback detector treated Spanish `Daño final/Vidaesfera` as a raw engine-label `final/` leak. The correction anchors raw category detection at line start. All DOM text failures are now accumulated per sampled selector and thrown at completion; structural, numerical, state and input failures remain immediate. No product behavior was changed by these corrections.

The failed ten-locale test had completed 110 rotation transitions, 6 explicit transitions, 12 reloads and 70 numerical comparisons. It stopped at its first dynamic DOM sample, so this run does not establish success for later conditional, multi-hit or history DOM samples. The source defines 11 dynamic DOM samples, correcting an earlier informal count of 12.

## UI evidence

All 60 emulated viewport cases passed (10 locales × widths 320, 360, 390, 430, 768 and 1440). ES-LA selected-language label requires 186 CSS pixels including padding and native arrow allowance; available width is 300 at 320 viewport, 340 at 360, 364 at 390, and 404 at 430.

All six captured images were visually reviewed:

- `es-la-initial-320.png`: full `Español (Latinoamérica)` visible; field, result and warning layout readable. Long text wraps within cards.
- `es-la-initial-390.png`: full language label, Spanish main results and warning disclosure visible.
- `es-la-initial-1440.png`: desktop columns and result panel remain readable; selected language visible in header.
- `es-la-details-390.png`: advanced groups use dark surfaces and readable text; translated sprite fallback `Imagen no disponible` visible. The fixed navigation/result components appear at the capture scroll position in the stitched full-page image; this is not a real-device screenshot.
- `es-la-feedback-390.png`: form, email field and submit button readable within panel; Spanish text includes local-test disclosure. Fixed damage bar absent.
- `es-la-feedback-viewport-390.png`: actual 390×900 viewport confirms no fixed damage bar covering feedback. The test additionally scrolls email/submit into view, checks their center with `elementFromPoint`, and confirms bar return after closing the form.

The previously observed `DAMAGE ESTIMATE`, `HP 0`, and Japanese sprite fallback are replaced in these sampled images by `ESTIMACIÓN DE DAÑO`, `PS 0`, and `Imagen no disponible`. This is a sampled visual audit, not exhaustive DOM enumeration or professional Spanish review. Some compact native selects still shorten lengthy option text at rest; full native menus and catalog identity are covered separately, and this audit does not claim complete accessibility review.

## Limits

CI uses local Chromium emulation; physical Android/iOS, native screen reader/IME, Pokémon Champions hardware terminology/mechanics, every index.html template and all dynamic condition combinations remain unverified. Production requests and mutations are not part of these tests. Runtime/data/index are unchanged between cc5a757 and e7453c1, but exact-candidate CI results and artifacts must still be collected.
