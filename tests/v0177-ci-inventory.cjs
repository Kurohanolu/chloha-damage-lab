// v0.177 CI inventory gate: prevent silent loss of any regression suite.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const workflow=fs.readFileSync(path.join(root,'.github/workflows/ui-smoke.yml'),'utf8');
const suites=[
 'move-catalog-audit','v0177-engine-audit','v0177-independent-vectors',
 'v0177-modifier-vectors','v0177-conditional-power-vectors',
 'v0177-expanding-force-matrix','v0177-expanding-force-grounding',
 'v0177-expanding-force-stacked','ui-smoke','conditional-power-ui',
 'damage-regression','v0171-moves','v0171-runtime',
 'v0177-move-policy-consistency','v0177-conditional-power-clarity',
 'v0177-version-provenance'
];
assert.match(workflow,/pull_request:/,'PR gate required');
for(const suite of suites){
 const file='tests/'+suite+'.cjs';
 assert.ok(fs.existsSync(path.join(root,file)),file+' exists');
 const matches=[...workflow.matchAll(new RegExp('node\\s+'+file.replaceAll('.','\\.')+'(?=\\s|$)','gm'))];
 assert.equal(matches.length,1,file+' must run exactly once in CI');
}
assert.match(workflow,/actions\/upload-artifact@/,'UI screenshot artifact');
console.log('PASS v0.177 CI inventory gate:',suites.length,'suites registered');
