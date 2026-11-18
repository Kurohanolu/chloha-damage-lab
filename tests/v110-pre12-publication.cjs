// Pre17 executes this unchanged historical proof against immutable published pre16.
if(require('../release.json').tag==='v1.1.0-pre.17'){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='a68b987d25d392076f36413e7f626ea3b71391c2',tree='c8292fafb8b927985d88ae7865ea8d755efdca76',file='tests/v110-pre12-publication.cjs';
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
 const ref='66cae82e10d28ad6115acdacc964fd3e84f51b4a',tree='85c51a15b93f5da3bc81e0183ca1a3742a79966e',file='tests/v110-pre12-publication.cjs';
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
 const ref='cace126d0244f2d748b3c162a3e7cb5f9441932d',tree='7f4a6078575346b36f74ab6bcea941dc629e81ec',file='tests/v110-pre12-publication.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'All original assertions preserved');
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre15-publication-history-')),worktree=path.join(parent,'source');let added=false;
 try{git('worktree','add','--detach',worktree,ref);added=true;const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:120000});assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);}
 finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS original publication history '+file+' at '+ref+'; not current release approval');process.exit(0);
}
// Pre.14 executes the unmodified pre.12 publication test on its published tree.
if(require('../release.json').tag==='v1.1.0-pre.14'){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='828e906a3c460a4c55e3f8e79bcd973ead0dc93b',tree='1921d6331b877830a5065f16f849925486f7b8c7';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 const original=git('show',ref+':tests/v110-pre12-publication.cjs');
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(original),'Complete pre.12 assertions must remain unchanged');
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'pre12-publication-')),checkout=path.join(tmp,'source');let added=false;
 try{
  git('worktree','add','--detach',checkout,ref);added=true;
  const run=spawnSync(process.execPath,['tests/v110-pre12-publication.cjs'],{cwd:checkout,stdio:'inherit',timeout:120000});
  assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0,'Immutable pre.12 publication test failed');
 }finally{try{if(added)git('worktree','remove','--force',checkout);}finally{fs.rmSync(tmp,{recursive:true,force:true});}}
 console.log('PASS immutable pre.12 publication history '+tree);process.exit(0);
}
'use strict';
// A new prerelease must earn its own approval. The published pre.11 is the
// immutable observation/rollback baseline, never a reusable approval receipt.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {selectBaseline}=require('../scripts/v0188-select-pages-baseline.cjs');
const publishedCommit='fbec6fd45b841c3465be903b25a14e909cc80ba5',publishedTree='a38f294cddaf10c15e8cea147e57a7b6d6148142';
const historical=ref=>JSON.parse(execFileSync('git',['show',ref+':release.json'],{encoding:'utf8'}));
const current=structuredClone(require('../release.json')),pre11=historical(publishedCommit),pre1=historical('83af29133927a19fc7e0f9273c0e194c54384ae5');
assert.equal(current.migration.legacyPolicy,'community-pinned-v1');assert.equal(current.tag,'v1.1.0-pre.12');assert.equal(current.preRelease,12);assert.equal(current.name,'Singularity v1.1.0 Pre-Release 12');
assert.equal(current.notes,'docs/releases/v1.1.0-pre.12.md');assert.equal(Object.hasOwn(current,'followupAudit'),false);
assert.equal(pre11.tag,'v1.1.0-pre.11');assert.equal(pre11.migration.liveTargetVerified,true);
assert.equal(execFileSync('git',['rev-parse',publishedCommit+'^{tree}'],{encoding:'utf8'}).trim(),publishedTree);
assert.equal(pre1.tag,'v1.1.0-pre.1');assert.equal(pre1.migration.liveTargetVerified,true);
const draft=structuredClone(current);draft.migration.status='awaiting-owner-approval';draft.migration.liveTargetVerified=false;
for(const key of Object.keys(draft.migration))if(key.startsWith('liveAcceptance'))delete draft.migration[key];
draft.qualityReview={releaseTag:draft.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
for(const event of ['push','workflow_dispatch','pull_request']){
 const expected={ref:publishedCommit,mode:'published-v110-pre12-base'};
 assert.deepEqual(selectBaseline(draft,event,publishedCommit),expected);
 if(event!=='pull_request')assert.deepEqual(selectBaseline(draft,event,''),expected);
 for(const ref of ['main','0'.repeat(40),'0b270c1452505268364659edd402209b00b28673','83af29133927a19fc7e0f9273c0e194c54384ae5'])assert.throws(()=>selectBaseline(draft,event,ref),'Do not substitute a moving, stale or arbitrary baseline');
 const falseLive=structuredClone(draft);falseLive.migration.liveTargetVerified=true;
 assert.throws(()=>selectBaseline(falseLive,event,publishedCommit),'An unaudited live flag cannot select current-source verification');
}
assert.throws(()=>selectBaseline(draft,'unknown',publishedCommit));
const observation=verifyObservation(draft,pre11,pre11.name);
assert.deepEqual(verifyObservation(draft,pre11,pre11.name,observation),observation);
assert.throws(()=>verifyObservation(draft,pre11,draft.name));
assert.throws(()=>verifyObservation(draft,draft,draft.name));
assert.throws(()=>verifyObservation(draft,pre11,pre11.name,{...observation,tag:draft.tag}));
const stable=JSON.parse(execFileSync('git',['show','0b270c1452505268364659edd402209b00b28673:release.json'],{encoding:'utf8'}));
for(const stale of [stable,pre1])assert.throws(()=>verifyObservation(draft,stale,stale.name),'Pre.12 must only observe its immediate immutable public predecessor');
for(const mutate of [r=>{r.notes='docs/other.md';},r=>{r.migration.liveTargetVerified=false;},r=>{r.qualityReview.auditStatus='pending';},r=>{r.extra='unreviewed';}]){
 const changed=structuredClone(pre11);mutate(changed);assert.throws(()=>verifyObservation(draft,changed,changed.name),'Full predecessor metadata must match the immutable publication');
}
for(const verify of [verifyQualityApproval,verifyCutoverApproval,verifyPublication]){
 assert.throws(()=>verify(draft),'A pending pre.12 cannot inherit approval');
 for(const old of [stable,pre1,pre11]){
  const stale={...structuredClone(draft),qualityReview:structuredClone(old.qualityReview),migration:structuredClone(old.migration)};
  assert.throws(()=>verify(stale),'An old release receipt is invalid for pre.12');
  stale.qualityReview.releaseTag=draft.tag;
  // The quality helper validates metadata shape. The production boundaries
  // additionally bind the reviewed source, owner evidence and report hashes.
  if(verify!==verifyQualityApproval)assert.throws(()=>verify(stale),'Retagging an old receipt does not approve new source bytes');
 }
}
for(const marker of [null,false,{},'approved']){
 const invalid={...structuredClone(draft),followupAudit:marker};
 assert.throws(()=>verifyObservation(invalid,pre11,pre11.name));
 assert.throws(()=>selectBaseline(invalid,'push',''));
 assert.throws(()=>verifyCutoverApproval(invalid));
}
if(current.qualityReview.ownerApproval==='pending'){
 assert.deepEqual(current,draft,'New candidate has a completely cleared pending audit/live state');
}else{
 verifyCutoverApproval(current);
 if(current.migration.liveTargetVerified){verifyPublication(current);assert.throws(()=>verifyObservation(current,pre11,pre11.name),'Accepted pre.12 never downgrades to pre.11');}
 else assert.deepEqual(selectBaseline(current,'push',''),{ref:publishedCommit,mode:'published-v110-pre12-base'});
}
// Both receipt writer and verifier must name the same immutable rollback source.
for(const file of ['scripts/helpers/v100-live-acceptance.cjs','scripts/v100-live-acceptance.cjs']){
 const code=fs.readFileSync(file,'utf8'),expression=code.match(/const rollbackSourceCommit=([^;]+);/)?.[1];
 assert.ok(expression,'Receipt boundary declares its rollback source');
 const actual=require('node:vm').runInNewContext(expression,{release:current,publishedCommit:'4f068544e670a85a6a4d34dd2c26e2be66bd9cb7'});
 assert.equal(actual,publishedCommit,'Pre.12 writer/verifier binds published pre.11, not a historical fallback');
 assert.equal(execFileSync('git',['rev-parse',actual+'^{tree}'],{encoding:'utf8'}).trim(),publishedTree);
 const files=require('../scripts/helpers/v100-live-acceptance.cjs').acceptanceFiles(actual);
 assert.ok(Object.keys(files).length>70,'Complete exact-source dual-site rollback inventory');
 assert.deepEqual(files,require('../scripts/helpers/v100-live-acceptance.cjs').acceptanceFiles(publishedCommit));
}
console.log('PASS pre.12 writer/verifier rollback references bind exact pre.11 tree and full asset inventory');

const report={passed:true,releaseTag:current.tag,publicPredecessor:publishedCommit,publicPredecessorTree:publishedTree,pendingCannotPublish:true,oldReceiptsRejected:true,unapprovedLiveFlagRejected:true,publicMetadataPinned:true};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pre12-publication.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS v1.1.0 pre.12 lifecycle: immutable public pre.11, cleared candidate state, old receipts and unapproved live flags rejected');
