/* Damage Lab v0.181 — weight-dependent base power (pure calculation).
 * Weight values are kilograms; callers must supply battle-effective weights.
 * Integration and Champions-specific weight modifiers require separate validation.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ChlohaWeightPower = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const DEFENDER_WEIGHT_MOVES = new Set(['けたぐり', 'くさむすび', 'Low Kick', 'Grass Knot']);
  const WEIGHT_RATIO_MOVES = new Set(['ヘビーボンバー', 'ヒートスタンプ', 'Heavy Slam', 'Heat Crash']);
  function validWeight(kg) {
    return typeof kg === 'number' && Number.isFinite(kg) && kg > 0;
  }
  function weightDependentPower(moveName, attackerKg, defenderKg) {
    if (!DEFENDER_WEIGHT_MOVES.has(moveName) && !WEIGHT_RATIO_MOVES.has(moveName)) return null;
    if (!validWeight(defenderKg)) return null;
    if (DEFENDER_WEIGHT_MOVES.has(moveName)) {
      if (defenderKg < 10) return 20;
      if (defenderKg < 25) return 40;
      if (defenderKg < 50) return 60;
      if (defenderKg < 100) return 80;
      if (defenderKg < 200) return 100;
      return 120;
    }
    if (!validWeight(attackerKg)) return null;
    const ratio = attackerKg / defenderKg;
    if (ratio >= 5) return 120;
    if (ratio >= 4) return 100;
    if (ratio >= 3) return 80;
    if (ratio >= 2) return 60;
    return 40;
  }
  return { weightDependentPower, validWeight };
});
