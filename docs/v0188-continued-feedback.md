# Continued feedback consent audit

SOL-01 (Medium) was independently found by 6.1 Sol on PR67 candidate8b37bdd. An inactive six-stat allocation can exceed the66point budget, making validateModels fail before syncBridge. The visible result and ChlohaLastCalculation are cleared, while snapshot controls and engineInput remain equal to the approved snapshot. The previous calculationIdentity omitted result and therefore retained confirmation.

Before correction, the added real feedback-handler regression failed: `invalid result must stale the approved snapshot`, actual hidden=true. The narrow correction includes the technical numeric/null result in calculation identity; locale remains excluded. This revokes consent after invalidation and catches silent invalidation at submit. No report is automatically sent and no saved state, Worker, D1, authentication or publication behavior is changed.

The existing nine-language real-browser regression now constructs a valid66point allocation, approves the snapshot, adds one inactive point, proves controls/engineInput unchanged and result=null, then requires visible stale state, unchecked consent and zero report POSTs. Browser evidence is required from CI; local Chromium is blocked by socket EPERM. The real-handler regression passes after correction, including submit-time and locale-only controls.
