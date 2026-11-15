# v1.0.0 numerical promotion acceptance protocol

The stable promotion must preserve the reviewed numerical behavior of
`c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095`, tree
`bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b`. This protocol does not claim that a
future stable candidate has passed: its exact commit/tree, clean working-tree
state, CI results and independent review must be recorded after execution.

Run `node tests/v100-engine-promotion.cjs` from the source checkout with full Git
history. The result is retained in `reports/v100/engine-promotion.json`, including
the actual commit/tree, whether the worktree is dirty, immutable comparison,
source hashes, case counts and failure detail. A dirty-development success is
diagnostic only and cannot approve the release candidate.

The additional promotion gate:

- Pins 14 numeric/data/persistence/reference-contract files to the reviewed Git
  blobs and protects the numeric script order and every inline runtime handler
  outside the existing presentation template. This includes manual HP/Speed,
  Foul Play allocation and state-to-engine routing.
- Independently loads old and candidate runtimes and compares complete outputs,
  traces, errors, distributions and caller input/option immutability.
- Rechecks all original 300 public fixtures with their 31 established errata
  (26 numerical corrections and five trace/metadata corrections). The original
  fixture and original-output hashes remain unchanged.
- Exercises 72 wall-breaking screen/format/rank/critical combinations,
  direct independent integer witnesses for both Speed-dependent moves, 2,048
  deterministic mixed-condition inputs through both entry points, 21 complete
  multi-hit/Beat Up distributions and retained unsupported behavior. The 28
  Speed boundaries and other comparisons produce 4,520 complete-output
  comparisons in total; no failing input is dropped from the generated set.

The additional equality checks do **not** replace the mandatory independent
BigInt, locked Showdown, full 16-roll, stats/type/rounding, move/ability/item,
weight and multi-hit comparisons. Existing state/browser regressions must also
run on the new candidate: nine-language numerical parity and saving/reloading
manual Speed/HP, Foul Play and automatic/manual transitions are integration
evidence that a VM-only calculation test cannot supply.

Raging Bull screen removal and multihit Multiscale remain outside their declared
support. The preserved Dudunsparce Special Attack source conflict remains
unverified under the documented roster disposition. Promotion changes no
Champions specification, and no physical-game equivalence is inferred from
matching software outputs or passing browser emulation.

A protected numeric source change or unexplained output difference blocks this
promotion gate. It requires a separate rationale, specification evidence and
independent review; the baseline must not be regenerated simply to make CI green.
