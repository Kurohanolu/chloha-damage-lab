'use strict';
// v0.181 readiness audit: do not silently assume species weight from base stats.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const match = html.match(/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s);
assert.ok(match, 'Embedded Pokémon roster not found');
const roster = JSON.parse(match[1]).pokemon;
const weights = require('../pokemon-weights-v0181.js');
const known = roster.filter(p => Number.isFinite(weights[p.id]) && weights[p.id] > 0);
const missing = roster.filter(p => !Number.isFinite(weights[p.id]) || weights[p.id] <= 0);
assert.equal(Object.keys(weights).length, known.length, 'Unknown or duplicate weight IDs');
const targetMoves = ['けたぐり','くさむすび','ヘビーボンバー','ヒートスタンプ'];
for (const name of targetMoves) assert.ok(html.includes('"name":"'+name+'"'), 'Missing move: '+name);
console.log(JSON.stringify({version:'v0.181',roster:roster.length,weightKnown:known.length,weightMissing:missing.length,weightCoveragePercent: +(100*known.length/roster.length).toFixed(1),targetMoves},null,2));
if (missing.length) console.log('Weight data incomplete: integration must not mark target moves supported yet.');
