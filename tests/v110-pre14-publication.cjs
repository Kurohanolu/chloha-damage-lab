// Pre17 executes this unchanged historical proof against immutable published pre16.
if(['v1.1.0-pre.17','v1.1.0-pre.18'].includes(require('../release.json').tag)){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='a68b987d25d392076f36413e7f626ea3b71391c2',tree='c8292fafb8b927985d88ae7865ea8d755efdca76',file='tests/v110-pre14-publication.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre17-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre16 historical proof '+file+'; current pre17 delta is checked separately');process.exit(0);
}
// Pre16 executes this unchanged historical proof against immutable published pre15.
if(require('../release.json').tag==='v1.1.0-pre.16'){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='66cae82e10d28ad6115acdacc964fd3e84f51b4a',tree='85c51a15b93f5da3bc81e0183ca1a3742a79966e',file='tests/v110-pre14-publication.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original historical assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre16-contract-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:180000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre15 historical proof '+file+'; current pre16 delta is checked separately');process.exit(0);
}
// Pre15 keeps the complete original publication proof on immutable published pre14.
if(require('../release.json').tag==='v1.1.0-pre.15'){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='cace126d0244f2d748b3c162a3e7cb5f9441932d',tree='7f4a6078575346b36f74ab6bcea941dc629e81ec',file='tests/v110-pre14-publication.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre15-publication-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:120000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS original publication history '+file+' at '+ref+'; not current release approval');process.exit(0);
}
'use strict';
// fail-closed pre.14 successor lifecycle; pre.12 runs historically.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {selectBaseline}=require('../scripts/v0188-select-pages-baseline.cjs');
const predecessor='828e906a3c460a4c55e3f8e79bcd973ead0dc93b';
const predecessorTree='1921d6331b877830a5065f16f849925486f7b8c7';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
assert.equal(git('rev-parse',predecessor+'^{tree}'),predecessorTree);
const pre12=JSON.parse(git('show',predecessor+':release.json'));
assert.equal(pre12.tag,'v1.1.0-pre.12');assert.equal(pre12.migration.liveTargetVerified,true);
const current=structuredClone(require('../release.json'));
assert.equal(current.tag,'v1.1.0-pre.14');assert.equal(current.preRelease,14);
assert.equal(current.name,'Singularity v1.1.0 Pre-Release 14');
assert.equal(current.notes,'docs/releases/v1.1.0-pre.14.md');
assert.equal(current.migration.legacyPolicy,'community-pinned-v1');
assert.ok(!Object.hasOwn(current,'followupAudit'));
const draft=structuredClone(current);
draft.migration.status='awaiting-owner-approval';draft.migration.liveTargetVerified=false;
for(const key of Object.keys(draft.migration))if(key.startsWith('liveAcceptance'))delete draft.migration[key];
draft.qualityReview={releaseTag:draft.tag,auditor:'6 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
for(const event of ['push','workflow_dispatch','pull_request']){
 const expected={ref:predecessor,mode:'published-v110-pre14-base'};
 assert.deepEqual(selectBaseline(draft,event,predecessor),expected,'Only the immediate published predecessor may be observed');
 if(event!=='pull_request')assert.deepEqual(selectBaseline(draft,event,''),expected);
 for(const ref of ['main','0'.repeat(40),'46f930797e662be0d01e974f98ddde6de7b414c0'])assert.throws(()=>selectBaseline(draft,event,ref));
}
assert.throws(()=>selectBaseline(draft,'unknown',predecessor));
const observation=verifyObservation(draft,pre12,pre12.name);
assert.deepEqual(verifyObservation(draft,pre12,pre12.name,observation),observation);
assert.throws(()=>verifyObservation(draft,draft,draft.name));
assert.throws(()=>verifyObservation(draft,pre12,draft.name));
for(const mutate of [r=>{r.notes='docs/other.md';},r=>{r.migration.liveTargetVerified=false;},r=>{r.qualityReview.auditStatus='pending';},r=>{r.extra='unreviewed';}]){
 const changed=structuredClone(pre12);mutate(changed);
 assert.throws(()=>verifyObservation(draft,changed,changed.name),'Complete predecessor manifest is immutable');
}
for(const verify of [verifyQualityApproval,verifyCutoverApproval,verifyPublication]){
 assert.throws(()=>verify(draft),'Pending pre.14 cannot publish');
 const stale=structuredClone(draft);stale.qualityReview=structuredClone(pre12.qualityReview);
 stale.qualityReview.releaseTag=draft.tag;
 // Quality validates metadata shape; cutover/publication additionally bind the reviewed source.
 if(verify!==verifyQualityApproval)assert.throws(()=>verify(stale),'Retagged pre.12 approval cannot authorize pre.14');
}
for(const marker of [null,false,{},'approved']){
 const invalid={...structuredClone(draft),followupAudit:marker};
 assert.throws(()=>verifyObservation(invalid,pre12,pre12.name));
 assert.throws(()=>selectBaseline(invalid,'push',''));
 assert.throws(()=>verifyCutoverApproval(invalid));
}
if(current.qualityReview.ownerApproval==='pending')assert.deepEqual(current,draft,'New pre.14 candidate must start with cleared approval/live state');
else{
 verifyCutoverApproval(current);
 if(current.migration.liveTargetVerified){verifyPublication(current);assert.throws(()=>verifyObservation(current,pre12,pre12.name));}
 else assert.deepEqual(selectBaseline(current,'push',''),{ref:predecessor,mode:'published-v110-pre14-base'});
}
const report={passed:true,tag:current.tag,predecessor,predecessorTree,oldReceiptsRejected:true};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pre14-publication.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS pre.14 independent publication lifecycle '+JSON.stringify(report));
