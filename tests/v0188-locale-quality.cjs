'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={};for(const file of ['locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js','locale-quality-v0188.js'])vm.runInNewContext(fs.readFileSync(require.resolve('../'+file),'utf8'),context);
const api=context.ChlohaLocaleQuality;
for(const locale of api.locales){
 const existing=context.ChlohaLocalizedNames.moves['はきだす']?.[locale]||context.ChlohaPokeAPILocalizedNames.moves['はきだす'][locale];
 const name=locale==='es-LA'?context.ChlohaEsLa.entity('moves','はきだす',context.ChlohaLocalizedNames.moves['はきだす']?.es||context.ChlohaPokeAPILocalizedNames.moves['はきだす'].es):existing;
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
// Exercise the real unchanged legacy translator in a read-only VM. Its
// partially translated messages must be recognized regardless of observer order.
{
 const legacy={window:{},document:{readyState:'loading',addEventListener(){}},localStorage:{getItem:()=>null}};
 const source=fs.readFileSync(require.resolve('../i18n.js'),'utf8');
 assert.ok(source.includes('function initialize(){'));
 vm.runInNewContext(source.replace('function initialize(){','window.__legacy188={set(code){locale=code},text:localizedUi,normalize:normalizeFreshLocaleText};function initialize(){'),legacy);
 const translator=legacy.window.__legacy188;context.ChlohaLocale={text:translator.text};
 for(const locale of api.locales){
  translator.set(locale);
  for(const kind of ['invalidStats','budgetAtt','budgetDef','budget']){
   const original=api.errorText('ja',kind);
   assert.equal(api.errorKind(translator.text(translator.normalize(original))),kind,'real legacy error alias: '+locale+'/'+kind);
   assert.equal(api.errorKind(translator.text(translator.normalize('入力エラー: '+original))),kind,'real legacy status alias: '+locale+'/'+kind);
  }
 }
 delete context.ChlohaLocale;
}
// DOM ownership contract: known errors switch languages under a single writer;
// unknown content is returned to the legacy translator, including on a switch.
{
 const node=text=>({textContent:text,attrs:new Set(),hasAttribute(key){return this.attrs.has(key);},setAttribute(key){this.attrs.add(key);},removeAttribute(key){this.attrs.delete(key);}});
 const nodes={error:node('能力ポイントは0〜32の整数で入力してください'),dbStatus:node('入力エラー: 能力ポイントは0〜32の整数で入力してください')};
 let lang='en',changed;const events={},pending=[];
 const dom={ChlohaLocale:{get:()=>lang,text:text=>'legacy:'+lang+':'+text},ChlohaLastCalculation:null,queueMicrotask:fn=>pending.push(fn),document:{readyState:'complete',getElementById:id=>nodes[id]||null,addEventListener:(name,fn)=>{events[name]=fn;}},MutationObserver:class{constructor(fn){changed=fn;}observe(){}}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../locale-quality-v0188.js'),'utf8'),dom);
 const flush=()=>{while(pending.length)pending.shift()();};
 for(const n of Object.values(nodes))assert.ok(n.hasAttribute('data-no-translate'),'known error has one owner');
 lang='fr';events['chloha:localechange']();flush();assert.equal(nodes.error.textContent,dom.ChlohaLocaleQuality.errorText('fr','invalidStats'));
 dom.ChlohaLocale.text=text=>text.includes('能力ポイントは0〜32')?'older-range-'+lang:'legacy:'+lang+':'+text;
 nodes.error.textContent='older-range-fr';
 nodes.dbStatus.textContent='older-range-fr';
 changed();flush();assert.equal(nodes.error.textContent,dom.ChlohaLocaleQuality.errorText('fr','invalidStats'));
 assert.equal(dom.ChlohaLocaleQuality.errorKind(nodes.dbStatus.textContent),'invalidStats','already legacy-translated errors retain recognized ownership');
 for(const n of Object.values(nodes))n.textContent='unrecognized message';
 changed();flush();
 for(const n of Object.values(nodes)){assert.equal(n.hasAttribute('data-no-translate'),false);assert.equal(n.textContent,'legacy:fr:unrecognized message');}
 lang='de';events['chloha:localechange']();flush();
 for(const n of Object.values(nodes))assert.equal(n.hasAttribute('data-no-translate'),false,'unknown text stays delegated after locale change');
 nodes.error.setAttribute('data-no-translate');nodes.error.textContent='pre-existing external exclusion';changed();flush();assert.equal(nodes.error.hasAttribute('data-no-translate'),true,'never remove another component’s marker');
}
console.log('PASS v0.188 stockpile and allocation-error copy: original nine locales plus ES-LA, canonical names reuse and locale recognition');

