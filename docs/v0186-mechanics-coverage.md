# v0.186 mechanics coverage — audit in progress

Baseline: `2fc88af6390f286fa7d1a531203f99c35dfa6767` / public v0.185 Pre-Release 31. Issue #61, branch `audit/v0186-accuracy-mechanics`.

This initial checkpoint records scope, not a completed coverage claim. The audit will enumerate every registered record/accepted role and publish reproducible status counts and evidence. Cases/comparisons must not be counted as independent features to inflate a verification percentage.

| Initial registered layer | Count | Meaning |
| --- | ---: | --- |
| Pokémon/form records | 373 | Registered records; Champions legality/hardware confirmation separate |
| Move records | 335 | Conservative catalog flags and runtime policy must both be inspected |
| Attacker ability IDs | 71 | Includes `none`; accepted roles differ from display/species metadata |
| Defender ability IDs | 40 | Includes `none` |
| Attacker item IDs | 23 | Includes `none` |
| Defender item IDs | 21 | Includes `none` |
| Accepted core mechanic IDs | 45 | Orchestration and UI preprocessing require separate review |
| Frozen preservation vectors | 300 | Full outputs/errors/traces/distributions; initially all unchanged |

Status definitions follow the owner brief. Verified requires a named independent behavioral/data reference within a stated scope. Structural validity and an implementation flag alone do not establish numeric correctness. Incorrect requires a reproducible witness; a Showdown difference is first a finding, not automatically a Champions bug. Partial and Unsupported do not authorize adding functionality.

Required follow-up artifacts: complete machine-readable inventory and metrics, seeded differential report with every discrepancy classified, Champions provenance matrix, concrete hardware test plan and nine-language/feedback regression evidence. Main/public/Cloudflare production are unchanged during this audit; merge/publication require final owner approval.
