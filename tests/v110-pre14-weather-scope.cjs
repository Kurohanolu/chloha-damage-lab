'use strict';
// current pre.14 weather preservation, independent of immutable pre.11 history.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const published='fbec6fd45b841c3465be903b25a14e909cc80ba5';
const tree='a38f294cddaf10c15e8cea147e57a7b6d6148142';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
const old=file=>git('show',published+':'+file),read=file=>fs.readFileSync(file,'utf8');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(git('rev-parse',published+'^{tree}').trim(),tree);
// Every public weather calculation byte, its roster data and corrections stay
// identical to the accepted pre.11 tree. UI copy may change only outside this set.
const protectedFiles=[
 'ability-data-v0184.js','damage-engine-v0184.js','battle-data-v0184.js',
 'move-mechanics-data-v0184.js','variable-power.js','multi-hit.js',
 'tests/fixtures/v110-weather-corrections.json',
 'tests/helpers/v110-weather-correction.cjs','tests/helpers/v0184-engine-harness.cjs'
];
for(const file of protectedFiles)assert.equal(hash(read(file)),hash(old(file)),'Weather source/fixture changed: '+file);
// This inline adapter maps roster ability names to engine IDs. It is as important
// as the engine module, but index.html contains the intentional new count UI.
function abilityAdapter(html){
 const start=html.indexOf('const defensiveAbilities='),end=html.indexOf('\nfunction refreshAbilities()',start);
 assert.ok(start>=0&&end>start,'Roster ability adapter must remain identifiable');
 return html.slice(start,end);
}
assert.equal(abilityAdapter(read('index.html')),abilityAdapter(old('index.html').toString('utf8')),'Roster/weather ability adapter changed');
const ledger=JSON.parse(read('tests/fixtures/v110-weather-corrections.json'));
const correction=require('./helpers/v110-weather-correction.cjs');
const original=JSON.parse(old('tests/fixtures/v0184-public-baseline.json')).cases.find(c=>c.name===correction.correctedName);
assert.equal(ledger.cases.length,1);
assert.equal(ledger.cases[0].originalExpectedSha256,hash(JSON.stringify(original.expected)));
const {loadCurrent,observe}=require('./helpers/v0184-engine-harness.cjs');
assert.deepEqual(observe(loadCurrent(),original.entry,correction.correctedInput(original),original.options),ledger.cases[0].expected,'Accepted rain correction still computes exactly');
const report={passed:true,published,tree,protectedFiles,abilityAdapter:'exact bytes',weatherLedger:'recomputed'};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pre14-weather-scope.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS current pre.14 weather engine, roster adapter and correction '+JSON.stringify(report));
