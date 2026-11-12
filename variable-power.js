/* v0.182 variable base-power mechanics. No UI integration until regression review. */
const ChlohaVariablePower = (() => {
  'use strict';
  function gyroBall(userSpeed, targetSpeed) {
    if (!Number.isFinite(userSpeed) || userSpeed <= 0 ||
        !Number.isFinite(targetSpeed) || targetSpeed < 0)
      throw new RangeError('Speeds must be finite; user speed must be positive');
    return Math.max(1, Math.min(150, Math.floor(25 * targetSpeed / userSpeed) + 1));
  }
  function storedPower(boosts = {}) {
    const stats = ['atk','def','spa','spd','spe','accuracy','evasion'];
    let total = 0;
    for (const stat of stats) {
      const stage = boosts[stat] ?? 0;
      if (!Number.isInteger(stage) || stage < -6 || stage > 6)
        throw new RangeError('Invalid boost stage: ' + stat);
      total += Math.max(0, stage);
    }
    return 20 + 20 * total;
  }
  function reversal(current, max) {
      if (!Number.isSafeInteger(current) || !Number.isSafeInteger(max) || max < 1 || current < 1 || current > max) throw new RangeError('Invalid HP');
      const ratio = Math.floor(48 * current / max);
      return ratio <= 1 ? 200 : ratio <= 4 ? 150 : ratio <= 9 ? 100 : ratio <= 16 ? 80 : ratio <= 32 ? 40 : 20;
    }
    function lastRespects(fainted) {
      if (!Number.isInteger(fainted) || fainted < 0 || fainted > 5) throw new RangeError('Fainted allies must be 0–5');
      return 50 + 50 * fainted;
    }
    return Object.freeze({gyroBall, storedPower, reversal, lastRespects});
})();
if (typeof module !== 'undefined' && module.exports) module.exports = ChlohaVariablePower;
if (typeof globalThis !== 'undefined') globalThis.ChlohaVariablePower = ChlohaVariablePower;
