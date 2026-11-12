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
  return Object.freeze({gyroBall, storedPower});
})();
if (typeof module !== 'undefined' && module.exports) module.exports = ChlohaVariablePower;
if (typeof globalThis !== 'undefined') globalThis.ChlohaVariablePower = ChlohaVariablePower;
