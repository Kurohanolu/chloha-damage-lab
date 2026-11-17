'use strict';
// Current-candidate preservation, distinct from historical localization tests.
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const baseline='46f930797e662be0d01e974f98ddde6de7b414c0',tree='1ea3163c8a8f4de8d68951b28c061a855461468c';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:32*1024*1024}),old=p=>git('show',baseline+':'+p),read=p=>fs.readFileSync(p,'utf8');
assert.equal(git('rev-parse',baseline+'^{tree}').trim(),tree);
assert.equal(require('./helpers/v110-weather-correction.cjs').originalAbilitySource(read('ability-data-v0184.js')),old('ability-data-v0184.js'),'Exact four-ID expansion only');
const protectedFiles=git('ls-tree','-r','--name-only',baseline).trim().split('\n').filter(p=>/^(?:locale-|names-|i18n\.js|docs\/data\/|services\/feedback\/|tests\/fixtures\/|battle-data|move-mechanics-data|damage-|multi-hit|variable-power|pokemon-weights|weight-power|feedback-(?!release)|persistence-)/.test(p));
for(const p of protectedFiles){
 if(p==='docs/data/v110-es-la-ui-inventory.json'){
  const actual=JSON.parse(read(p)),before=JSON.parse(old(p)),normalized=structuredClone(actual);
  for(const source of ['index.html','feedback-release-v100.js']){assert.equal(actual.sourceSha256[source],require('node:crypto').createHash('sha256').update(read(source)).digest('hex'));normalized.sourceSha256[source]=before.sourceSha256[source];}
  assert.deepEqual(normalized,before,'UI inventory changes only exact source hashes, no strings or coverage promotion');
 }else if(p==='docs/data/v110-es-la-coverage.json'){
  const actual=JSON.parse(read(p)),before=JSON.parse(old(p));assert.deepEqual(actual.uiInventory,{...JSON.parse(read('docs/data/v110-es-la-ui-inventory.json')),sha256:require('node:crypto').createHash('sha256').update(read('docs/data/v110-es-la-ui-inventory.json')).digest('hex')});actual.uiInventory=before.uiInventory;assert.deepEqual(actual,before,'Canonical translation evidence and every attestation remain unchanged');
 }else assert.equal(read(p),old(p),'Current candidate preserves '+p);
}
assert.equal(read('feedback-release-v100.js').replace('[1,2,3,4,5,6,7,8,9,11]','[1,2,3,4,5,6,7,8,9]'),old('feedback-release-v100.js'),'Feedback changes only the exact report identity');
const normalize=html=>html.replaceAll('Pre-Release 11','Pre-Release 9').replaceAll('1.1.0-pre.11','1.1.0-pre.9').replace(/([?&])h=[a-f0-9]{16}/g,'');
assert.equal(normalize(read('index.html')),normalize(old('index.html')),'All inline UI, roster, move, state and event code remains byte-identical apart from release labels/cache URLs');
assert.equal(require('../release.json').migration.legacyPolicy,'community-pinned-v1');
const report={passed:true,baseline,tree,protectedFiles:protectedFiles.length,exactWeatherIds:['drizzle','drought','sandStream','snowWarning'],inlineChanges:'identity and cache only',feedbackServiceChanged:false};fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/weather-scope.json',JSON.stringify(report,null,2)+'\n');console.log('PASS current weather candidate scope '+JSON.stringify(report));
