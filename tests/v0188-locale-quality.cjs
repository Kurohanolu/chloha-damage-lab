'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={};for(const file of ['locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-quality-v0188.js'])vm.runInNewContext(fs.readFileSync(require.resolve('../'+file),'utf8'),context);
const api=context.ChlohaLocaleQuality;
for(const locale of api.locales){
 const name=context.ChlohaLocalizedNames.moves['はきだす']?.[locale]||context.ChlohaPokeAPILocalizedNames.moves['はきだす'][locale];
 for(const count of [1,2,3]){
  const copy=api.stockpile(locale,count);
  assert.ok(copy.title.includes(name),'reuse existing localized move names: '+locale);
  assert.ok(copy.power.includes(String(count*100)));
  assert.ok(copy.count.includes(String(count)));
  if(locale!=='ja')assert.ok(!/[ぁ-ゖァ-ヺ]/u.test(JSON.stringify(copy)),'Japanese stockpile UI leaked: '+locale);
 }
 for(const kind of ['invalidStats','budgetAtt','budgetDef','budget']){
  const text=api.errorText(locale,kind);assert.equal(api.errorKind(text),kind);
  if(locale!=='ja')assert.ok(!/[ぁ-ゖァ-ヺ]/u.test(text),'Japanese error leaked: '+locale);
 }
}
assert.equal(api.errorKind('Input error: 能力ポイントは0〜32の整数で入力してください'),'invalidStats');
assert.equal(api.errorKind('攻撃側の能力ポイント合計は66以内'),'budgetAtt');
assert.equal(api.errorKind('unrelated error'),null);
const statusNames={attacker:'Charizard',move:'Earthquake',defender:'Tyranitar'};
assert.equal(api.summary('リザードン Earthquake（114） → Tyranitar（130 / HP 175）',statusNames,'en'),'Charizard Earthquake (114) → Tyranitar (130 / HP 175)');
assert.equal(api.summary('Charizard Earthquake (114) → Tyranitar (130 / HP 175)',{attacker:'リザードン',move:'じしん',defender:'バンギラス'},'ja'),'リザードン じしん（114） → バンギラス（130 / HP 175）');
assert.equal(api.summary('unsupported status',statusNames,'en'),null);
assert.equal(api.summary('A B（1） → C（2 / HP 3） / suffix',statusNames,'en'),'Charizard Earthquake (1) → Tyranitar (2 / HP 3) / suffix');
delete context.ChlohaPokeAPILocalizedNames;
delete context.ChlohaLocalizedNames;
for(const locale of api.locales)assert.ok(api.stockpile(locale,1).title,'explicit localized missing-name description');
console.log('PASS v0.188 stockpile and allocation-error nine-language copy, names reuse and locale recognition');

