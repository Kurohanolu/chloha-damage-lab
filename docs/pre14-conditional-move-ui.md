# Pre-Release 14: conditional move controls
Target: v1.1.0 Pre-Release 14, authorized by owner on 2026-11-17.
Base: fbec6fd45b841c3465be903b25a14e909cc80ba5 (published weather repair).
Existing PRs 82 and 83 reserve pre.12 and pre.13 and must remain untouched.

Both moves already have engine handling, numeric controls and persistence.
The UI operates existing faintedAllies / rageFistHits inputs without changing
the damage engine or snapshot format. Last Respects offers 0-5; Rage Fist
offers 0-5 and 6+. Existing saved counts above 6 remain unchanged.
Buttons are native keyboard-accessible controls, wrap, and have 44px minimum
targets. Names and applied-power text reuse existing catalogs.

Status: UI draft, not approved for publication. The release manifest still
identifies the baseline until the pre.14 release gates and evidence are ready.
130 localized count-copy cases pass locally. Full browser, Showdown,
independent review and all required CI remain necessary. Community assets
must remain pinned. No new official terminology evidence is claimed for
product-specific explanatory labels.
