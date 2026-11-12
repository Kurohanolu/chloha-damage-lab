'use strict';
const assert = require('node:assert/strict');
const { weightDependentPower: power } = require('../weight-power.js');
for (const name of ['けたぐり','くさむすび','Low Kick','Grass Knot']) {
  for (const [kg, expected] of [[9.9,20],[10,40],[24.9,40],[25,60],[49.9,60],[50,80],[99.9,80],[100,100],[199.9,100],[200,120]]) {
    assert.equal(power(name, null, kg), expected, name + ' defender ' + kg);
  }
}
for (const name of ['ヘビーボンバー','ヒートスタンプ','Heavy Slam','Heat Crash']) {
  for (const [attacker, defender, expected] of [[1,1,40],[2,1,60],[3,1,80],[4,1,100],[5,1,120],[4.99,1,100],[1,2,40]]) {
    assert.equal(power(name, attacker, defender), expected, name + ' ratio ' + attacker + '/' + defender);
  }
}
assert.equal(power('じしん', 100, 10), null);
assert.equal(power('けたぐり', 100, 0), null);
assert.equal(power('ヒートスタンプ', NaN, 10), null);
assert.equal(power('ヒートスタンプ', 10, -1), null);
console.log('v0.181 weight-dependent power boundary vectors: PASS');
