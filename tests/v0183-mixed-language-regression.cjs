'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../i18n.js'),'utf8');
const start=source.indexOf('const localeUiPhrases=');
const end=source.indexOf('function localizedUi(',start);
assert.ok(start>=0&&end>start);
const ctx={};vm.runInNewContext(source.slice(start,end)+'\nthis.api={phrases:localeUiPhrases,live:localizedLiveSummary,board:localizedBattlefield};',ctx);
for(const lang of ['fr','de','es','it','ko','zh-Hans','zh-Hant']){
 const phrases=ctx.api.phrases;
 for(const key of ['Swap sides','Choose from list','Choose from move list','Attacker stats','Defender stats','Show stats','Quick allocation','e.g. Earthquake, Thunderbolt','Attack','Defense','Sp. Atk','Sp. Def','Speed']){
  assert.ok(phrases[key]?.[lang],lang+' missing '+key);
 }
 const survival=ctx.api.live('Guaranteed survival · 0.00%',lang);
 assert.ok(survival?.includes('0.00%')&&!survival.includes('Guaranteed survival'),lang+' survival');
 const hp=ctx.api.live('Of max HP: 61.7–73.1%',lang);
 assert.ok(hp?.includes('61.7–73.1%')&&!hp.startsWith('Of max HP'),lang+' hp');
 const board=ctx.api.board('現在の盤面：天候 なし ／ フィールド なし ／ 壁 なし',lang);
 assert.ok(board&&!board.includes('Current battlefield')&&!board.includes('現在の盤面'),lang+' board');
}
console.log('PASS v0.183 screenshot-based mixed-language regressions');
