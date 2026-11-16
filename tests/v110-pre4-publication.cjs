'use strict';
// Preserve the exact published pre.4 lifecycle test in its immutable source tree.
// It verifies real approved bytes there; current pre.5 has a separate lifecycle gate.
if(require('../release.json').tag!=='v1.1.0-pre.4'){
 const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='61d87e82995bc60d4564aaf57a52dfc1fd859e4c',tree='213c12af29c002e9344b018e6be69e568a251dff';
 assert.equal(execFileSync('git',['rev-parse',ref+'^{tree}'],{encoding:'utf8'}).trim(),tree);
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre4-history-')),worktree=path.join(parent,'source');
 let status=1;
 try{
  execFileSync('git',['worktree','add','--detach',worktree,ref],{stdio:'pipe'});
  const result=spawnSync(process.execPath,['tests/v110-pre4-publication.cjs'],{cwd:worktree,stdio:'inherit'});
  assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Unmodified published pre.4 lifecycle must pass');
  assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');
  fs.mkdirSync('reports/v110',{recursive:true});
  const report=JSON.parse(fs.readFileSync(path.join(worktree,'reports/v110/pre4-publication.json'),'utf8'));
  fs.writeFileSync('reports/v110/pre4-publication.json',JSON.stringify({...report,role:'historical immutable pre.4, not current candidate acceptance',sourceCommit:ref,sourceTree:tree},null,2)+'\n');
  status=0;
 }finally{
  try{execFileSync('git',['worktree','remove','--force',worktree],{stdio:'pipe'});}finally{fs.rmSync(parent,{recursive:true,force:true});}
 }
 process.exit(status);
}
'use strict';
// A new prerelease must earn its own approval. The published pre.3 is the
// immutable observation/rollback baseline, never a reusable approval receipt.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {selectBaseline}=require('../scripts/v0188-select-pages-baseline.cjs');
const publishedCommit='082ab180bc8835304d959f583d4968e0565bdea3',publishedTree='acbfb36b179a29be7b7071821a4dd2c2a8c446cc';
const historical=ref=>JSON.parse(execFileSync('git',['show',ref+':release.json'],{encoding:'utf8'}));
const current=structuredClone(require('../release.json')),pre3=historical(publishedCommit),pre1=historical('83af29133927a19fc7e0f9273c0e194c54384ae5');
assert.equal(current.tag,'v1.1.0-pre.4');assert.equal(current.preRelease,4);assert.equal(current.name,'Singularity v1.1.0 Pre-Release 4');
assert.equal(current.notes,'docs/releases/v1.1.0-pre.4.md');assert.equal(Object.hasOwn(current,'followupAudit'),false);
assert.equal(pre3.tag,'v1.1.0-pre.3');assert.equal(pre3.migration.liveTargetVerified,true);
assert.equal(execFileSync('git',['rev-parse',publishedCommit+'^{tree}'],{encoding:'utf8'}).trim(),publishedTree);
assert.equal(pre1.tag,'v1.1.0-pre.1');assert.equal(pre1.migration.liveTargetVerified,true);
const draft=structuredClone(current);draft.migration.status='awaiting-owner-approval';draft.migration.liveTargetVerified=false;
for(const key of Object.keys(draft.migration))if(key.startsWith('liveAcceptance'))delete draft.migration[key];
draft.qualityReview={releaseTag:draft.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
for(const event of ['push','workflow_dispatch','pull_request']){
 const expected={ref:publishedCommit,mode:'published-v110-pre4-base'};
 assert.deepEqual(selectBaseline(draft,event,publishedCommit),expected);
 if(event!=='pull_request')assert.deepEqual(selectBaseline(draft,event,''),expected);
 for(const ref of ['main','0'.repeat(40),'0b270c1452505268364659edd402209b00b28673','83af29133927a19fc7e0f9273c0e194c54384ae5'])assert.throws(()=>selectBaseline(draft,event,ref),'Do not substitute a moving, stale or arbitrary baseline');
 const falseLive=structuredClone(draft);falseLive.migration.liveTargetVerified=true;
 assert.throws(()=>selectBaseline(falseLive,event,publishedCommit),'An unaudited live flag cannot select current-source verification');
}
assert.throws(()=>selectBaseline(draft,'unknown',publishedCommit));
const observation=verifyObservation(draft,pre3,pre3.name);
assert.deepEqual(verifyObservation(draft,pre3,pre3.name,observation),observation);
assert.throws(()=>verifyObservation(draft,pre3,draft.name));
assert.throws(()=>verifyObservation(draft,draft,draft.name));
assert.throws(()=>verifyObservation(draft,pre3,pre3.name,{...observation,tag:draft.tag}));
const stable=JSON.parse(execFileSync('git',['show','0b270c1452505268364659edd402209b00b28673:release.json'],{encoding:'utf8'}));
for(const stale of [stable,pre1])assert.throws(()=>verifyObservation(draft,stale,stale.name),'Pre.4 must only observe its immediate immutable public predecessor');
for(const mutate of [r=>{r.notes='docs/other.md';},r=>{r.migration.liveTargetVerified=false;},r=>{r.qualityReview.auditStatus='pending';},r=>{r.extra='unreviewed';}]){
 const changed=structuredClone(pre3);mutate(changed);assert.throws(()=>verifyObservation(draft,changed,changed.name),'Full predecessor metadata must match the immutable publication');
}
for(const verify of [verifyQualityApproval,verifyCutoverApproval,verifyPublication]){
 assert.throws(()=>verify(draft),'A pending pre.4 cannot inherit approval');
 for(const old of [stable,pre1,pre3]){
  const stale={...structuredClone(draft),qualityReview:structuredClone(old.qualityReview),migration:structuredClone(old.migration)};
  assert.throws(()=>verify(stale),'An old release receipt is invalid for pre.4');
  stale.qualityReview.releaseTag=draft.tag;
  // The quality helper validates metadata shape. The production boundaries
  // additionally bind the reviewed source, owner evidence and report hashes.
  if(verify!==verifyQualityApproval)assert.throws(()=>verify(stale),'Retagging an old receipt does not approve new source bytes');
 }
}
for(const marker of [null,false,{},'approved']){
 const invalid={...structuredClone(draft),followupAudit:marker};
 assert.throws(()=>verifyObservation(invalid,pre3,pre3.name));
 assert.throws(()=>selectBaseline(invalid,'push',''));
 assert.throws(()=>verifyCutoverApproval(invalid));
}
if(current.qualityReview.ownerApproval==='pending'){
 assert.deepEqual(current,draft,'New candidate has a completely cleared pending audit/live state');
}else{
 verifyCutoverApproval(current);
 if(current.migration.liveTargetVerified){verifyPublication(current);assert.throws(()=>verifyObservation(current,pre3,pre3.name),'Accepted pre.4 never downgrades to pre.3');}
 else assert.deepEqual(selectBaseline(current,'push',''),{ref:publishedCommit,mode:'published-v110-pre4-base'});
}
const report={passed:true,releaseTag:current.tag,publicPredecessor:publishedCommit,publicPredecessorTree:publishedTree,pendingCannotPublish:true,oldReceiptsRejected:true,unapprovedLiveFlagRejected:true,publicMetadataPinned:true};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pre4-publication.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS v1.1.0 pre.4 lifecycle: immutable public pre.3, cleared candidate state, old receipts and unapproved live flags rejected');
