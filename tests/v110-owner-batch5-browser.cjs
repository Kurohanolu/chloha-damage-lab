'use strict';
// Runs after the four lexically preceding shards; stale/partial receipts fail closed.
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim();
const run=read('reports/v110/test-run.json'),commit=git('rev-parse','HEAD'),tree=git('rev-parse','HEAD^{tree}');
assert.equal(run.commit,commit);assert.equal(run.tree,tree);const started=Date.parse(run.startedAt);assert.ok(Number.isFinite(started));
const manifest=read('docs/data/v110-es-la-owner-captures-batch5.json'),ids=manifest.records.map(r=>r.canonicalMatches[0].canonicalIds[0]),locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
assert.equal(ids.length,19);assert.equal(new Set(ids).size,19);
const rows=[];
for(let shard=1;shard<=4;shard++){
 const filename='v110-owner-batch5-browser-shard'+shard+'.cjs',runs=run.tests.filter(t=>t.file===filename);
 assert.equal(runs.length,1,'Every shard executed exactly once in current runner');assert.equal(runs[0].status,0);assert.ok(!runs[0].error);assert.ok(!runs[0].signal);assert.equal(runs[0].timeoutMs,300000);
 const e=read('reports/v110/owner-batch5-browser-shard'+shard+'.json');assert.equal(e.shard,shard);assert.equal(e.passed,true);assert.equal(e.sourceCommit,commit);assert.equal(e.baseline,manifest.baselineCommit);assert.ok(Date.parse(e.startedAt)>=started,'No stale shard receipt');assert.equal(e.rows.length,95);
 assert.deepEqual(e.widths,[shard<=2?390:1440]);assert.deepEqual(e.locales,locales.slice(shard%2===1?0:5,shard%2===1?5:10));
 for(const r of e.rows){assert.ok(e.widths.includes(r.width));assert.ok(e.locales.includes(r.locale));assert.ok(ids.includes(r.id));assert.equal(r.numericParity,true);assert.equal(r.saveReload,true);assert.equal(r.visibleRegionalSearch,r.locale==='es-LA');}
 rows.push(...e.rows);
}
const key=r=>[r.width,r.locale,r.id].join('/'),expected=[390,1440].flatMap(width=>locales.flatMap(locale=>ids.map(id=>key({width,locale,id}))));
assert.equal(rows.length,380);assert.equal(new Set(rows.map(key)).size,380);assert.deepEqual(rows.map(key).sort(),expected.sort());assert.equal(rows.filter(r=>r.visibleRegionalSearch).length,38);
fs.writeFileSync('reports/v110/owner-batch5-browser.json',JSON.stringify({passed:true,sourceCommit:commit,sourceTree:tree,baseline:manifest.baselineCommit,runnerStartedAt:run.startedAt,shards:4,rows},null,2)+'\n');
console.log('PASS batch5 aggregate: all380 unique assertions,38 regional searches, four fresh successful95-row shards, unchanged300s child budgets.');
