'use strict';
// A coverage ledger must describe actual renderer paths and disclose failures;
// merely containing nonempty fallback text does not establish translated UI.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {buildInventory,DYNAMIC_CASES,DOM_LABEL_CASES,literalAfter}=require('../scripts/v110-es-la-ui-inventory.cjs');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const actual=buildInventory(),saved=JSON.parse(read('docs/data/v110-es-la-ui-inventory.json'));
assert.deepEqual(actual,saved,'Committed UI inventory must reproduce from current authored sources');
assert.deepEqual(buildInventory(),actual,'Repeat generation must be deterministic');
assert.equal(actual.counts.enumeratedRecords,actual.records.length);
assert.equal(actual.counts.provisional+actual.counts.unverified,actual.records.length);
assert.equal(actual.counts.official,0,'Authored UI must not acquire official game terminology status');
assert.equal(actual.counts.warningOrErrorSubset,actual.records.filter(r=>r.warningOrError).length);
assert.equal(actual.counts.dynamicTemplateBranches,DYNAMIC_CASES.length);
assert.equal(actual.counts.originalScopedRecords+actual.counts.additionalStaticSites+actual.counts.dynamicTemplateBranches,actual.records.length);
assert.equal(actual.counts.unverified,actual.remainingGaps.length);
assert.ok(actual.remainingScopeLimits.some(x=>x.includes('index.html')),'Do not claim complete DOM-template enumeration');
for(const [file,hash]of Object.entries(actual.sourceSha256))assert.equal(hash,crypto.createHash('sha256').update(read(file)).digest('hex'),file);
const byId=new Map(actual.records.map(r=>[r.id,r]));
assert.equal(byId.size,actual.records.length);
for(const [id,input]of DYNAMIC_CASES){const r=byId.get('i18n.js:dynamic-template:'+id);assert.ok(r);assert.equal(r.canonicalInput,input);assert.equal(r.outputVerified,true);assert.ok(r.text);}
assert.equal(actual.counts.groups['result-dom-label'],DOM_LABEL_CASES.length);
for(const [id,input]of DOM_LABEL_CASES){
 const r=byId.get('index.html:result-dom-label:'+id);
 assert.ok(r);assert.equal(r.canonicalInput,input);assert.equal(r.outputVerified,true);assert.equal(r.status,'provisional');
 assert.ok(read('index.html').includes(input),'DOM witness must originate in the app: '+id);
 assert.ok(!/[\u3040-\u30ff\u3400-\u9fff]/u.test(r.text),'DOM label cannot retain Japanese: '+id);
}
assert.equal(byId.get('index.html:result-dom-label:multi-hit-rolls').text,'Daño total de movimientos de varios golpes (probabilidad de cada valor)');
for(const id of ['battle-no-calculation','battle-stale','battle-fainted','battle-invalid-damage','battle-stale-undo','invalid-input'])assert.equal(byId.get('index.html:result-dom-label:'+id).warningOrError,true,'DOM validation notice must be counted as a warning: '+id);
for(const group of ['release-copy','reviewed-ui','option-ability-status','option-move-status','dynamic-stat-kinds','form-labels'])assert.ok(actual.counts.groups[group]>0,'Required formerly omitted group '+group);
const runtime=vm.createContext({});vm.runInContext(read('locale-ui-es-la-v110.js'),runtime);
for(const [property,group]of [['reasons','authored-reasons'],['errors','authored-errors']]){
 const keys=Object.keys(runtime.ChlohaEsLaUi[property]);
 assert.equal(actual.counts.groups[group],keys.length,'Inventory must include every authored '+property+' entry');
 for(const key of keys){
  const record=byId.get('locale-ui-es-la-v110.js:'+group+':'+key);
  assert.ok(record);assert.equal(record.outputVerified,true);assert.equal(record.status,'provisional');
  assert.equal(record.sourceTemplate,runtime.ChlohaEsLaUi[property][key]);
  assert.ok(record.witnesses.length>0,'Actual wrapper witness required: '+key);
  for(const text of [record.text,...record.witnesses.map(w=>w.text)])assert.ok(!/[\u3040-\u30ff\u3400-\u9fff]|\{\w+\}/u.test(text),'Executed copy cannot retain Japanese or unresolved entity slots: '+key);
 }
}
assert.deepEqual(actual.policyReasonInventory.unmappedPolicyReasons,[],'Every current app policy reason needs an authored UI entry');
assert.equal(actual.dynamicRendererRegistry.length,runtime.ChlohaEsLaUi.dynamicTemplates.length,'Every declared dynamic template is tracked');
assert.ok(actual.dynamicRendererRegistry.every(template=>template.coveredByWitness),'Every declared dynamic template needs an executable witness');
assert.equal(byId.get('i18n.js:canonical-selectLabels:選択した相手に2回命中').text,'2 golpes al objetivo seleccionado');
assert.equal(byId.get('i18n.js:canonical-selectLabels:選択した相手に2回命中').renderPath,'translateOptions');
assert.equal(byId.get('i18n.js:dynamic-template:damage-range').text,'123–145 de daño');
const regressed=buildInventory({readFile:file=>file==='i18n.js'?read(file).replace('function localizedUi(base){',"function localizedUi(base){if(base==='123〜145 ダメージ')return '123–145 damage';"):read(file)});
const gap=regressed.remainingGaps.find(r=>r.id==='i18n.js:dynamic-template:damage-range');
assert.ok(gap&&gap.reasons.some(x=>x.includes('English fallback')),'An English fallback must be reported, never counted as completed UI');
assert.throws(()=>literalAfter('const example={','const example='),/Unclosed inventory literal/);
assert.throws(()=>buildInventory({readFile:file=>file==='i18n.js'?read(file).replace('function initialize(){','function renamedInitialize(){'):read(file)}),/bootstrap anchor/,'Source layout changes must require conscious inventory review');
fs.mkdirSync(path.join(root,'reports/v110'),{recursive:true});fs.writeFileSync(path.join(root,'reports/v110/ui-inventory.json'),JSON.stringify({passed:true,sourceSites:actual.records.length,dynamicBranches:DYNAMIC_CASES.length,authoredReasons:actual.counts.groups['authored-reasons'],authoredErrors:actual.counts.groups['authored-errors'],declaredDynamicTemplates:actual.dynamicRendererRegistry.length,remainingGaps:actual.remainingGaps.length,remainingScopeLimits:actual.remainingScopeLimits,negativeEnglishFallbackDetected:true,deterministic:true},null,2)+'\n');
console.log('PASS v1.1.0 UI inventory: reproducible source sites, actual native/dynamic render paths, truthful fallback classification and fail-closed extraction');
