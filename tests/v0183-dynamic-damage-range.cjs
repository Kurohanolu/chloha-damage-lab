'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../i18n.js'),'utf8');
const a=source.indexOf('const damageRangeSuffix='),b=source.indexOf('\nfunction localizedUi(',a);
assert.ok(a>0&&b>a);
const ctx={};vm.runInNewContext(source.slice(a,b)+'\nthis.render=localizedDamageRange;',ctx);
const expected={ja:'108〜128 ダメージ',en:'108–128 damage',fr:'108–128 dégâts',de:'108–128 Schaden',es:'108–128 de daño',it:'108–128 danni',ko:'108–128 데미지','zh-Hans':'108–128 伤害','zh-Hant':'108–128 傷害'};
for(const [locale,result] of Object.entries(expected)){
 assert.equal(ctx.render('108〜128 ダメージ',locale),result);
 assert.equal(ctx.render('108–128 damage',locale),result);
}
assert.equal(ctx.render('not a damage range','es'),null);
console.log('PASS nine-language numeric damage range formatting');
