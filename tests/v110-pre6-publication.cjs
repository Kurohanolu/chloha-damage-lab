'use strict';
// Preserve the exact published prior pre.6 lifecycle test in its immutable source tree.
// It verifies real approved bytes there; current Community policy revision has separate additive preservation and source-scope gates.
if(require('../release.json').migration?.legacyPolicy==='community-pinned-v1'){
 const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9',tree='604f0632eaf2d28e2fbd40012d68133050f72f30';
 assert.equal(execFileSync('git',['rev-parse',ref+'^{tree}'],{encoding:'utf8'}).trim(),tree);
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre6-history-')),worktree=path.join(parent,'source');
 let status=1;
 try{
  execFileSync('git',['worktree','add','--detach',worktree,ref],{stdio:'pipe'});
  const result=spawnSync(process.execPath,['tests/v110-pre6-publication.cjs'],{cwd:worktree,stdio:'inherit'});
  assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Unmodified published prior pre.6 lifecycle must pass');
  assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');
  fs.mkdirSync('reports/v110',{recursive:true});
  const report=JSON.parse(fs.readFileSync(path.join(worktree,'reports/v110/pre6-publication.json'),'utf8'));
  fs.writeFileSync('reports/v110/pre6-publication.json',JSON.stringify({...report,role:'historical immutable pre.6, not current candidate acceptance',sourceCommit:ref,sourceTree:tree},null,2)+'\n');
  status=0;
 }finally{
  try{execFileSync('git',['worktree','remove','--force',worktree],{stdio:'pipe'});}finally{fs.rmSync(parent,{recursive:true,force:true});}
 }
 process.exit(status);
}
'use strict';
// A new prerelease must earn its own approval. The published pre.5 is the
// immutable observation/rollback baseline, never a reusable approval receipt.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {selectBaseline}=require('../scripts/v0188-select-pages-baseline.cjs');
const publishedCommit='82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74',publishedTree='f6e6bc6a8bedec4b8923671e9345ce24a8d45d40';
const historical=ref=>JSON.parse(execFileSync('git',['show',ref+':release.json'],{encoding:'utf8'}));
const current=structuredClone(require('../release.json')),pre5=historical(publishedCommit),pre1=historical('83af29133927a19fc7e0f9273c0e194c54384ae5');
assert.equal(current.tag,'v1.1.0-pre.6');assert.equal(current.preRelease,6);assert.equal(current.name,'Singularity v1.1.0 Pre-Release 6');
assert.equal(current.notes,'docs/releases/v1.1.0-pre.6.md');assert.equal(Object.hasOwn(current,'followupAudit'),false);
assert.equal(pre5.tag,'v1.1.0-pre.5');assert.equal(pre5.migration.liveTargetVerified,true);
assert.equal(execFileSync('git',['rev-parse',publishedCommit+'^{tree}'],{encoding:'utf8'}).trim(),publishedTree);
assert.equal(pre1.tag,'v1.1.0-pre.1');assert.equal(pre1.migration.liveTargetVerified,true);
const draft=structuredClone(current);draft.migration.status='awaiting-owner-approval';draft.migration.liveTargetVerified=false;
for(const key of Object.keys(draft.migration))if(key.startsWith('liveAcceptance'))delete draft.migration[key];
draft.qualityReview={releaseTag:draft.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
for(const event of ['push','workflow_dispatch','pull_request']){
 const expected={ref:publishedCommit,mode:'published-v110-pre6-base'};
 assert.deepEqual(selectBaseline(draft,event,publishedCommit),expected);
 if(event!=='pull_request')assert.deepEqual(selectBaseline(draft,event,''),expected);
 for(const ref of ['main','0'.repeat(40),'0b270c1452505268364659edd402209b00b28673','83af29133927a19fc7e0f9273c0e194c54384ae5'])assert.throws(()=>selectBaseline(draft,event,ref),'Do not substitute a moving, stale or arbitrary baseline');
 const falseLive=structuredClone(draft);falseLive.migration.liveTargetVerified=true;
 assert.throws(()=>selectBaseline(falseLive,event,publishedCommit),'An unaudited live flag cannot select current-source verification');
}
assert.throws(()=>selectBaseline(draft,'unknown',publishedCommit));
const observation=verifyObservation(draft,pre5,pre5.name);
assert.deepEqual(verifyObservation(draft,pre5,pre5.name,observation),observation);
assert.throws(()=>verifyObservation(draft,pre5,draft.name));
assert.throws(()=>verifyObservation(draft,draft,draft.name));
assert.throws(()=>verifyObservation(draft,pre5,pre5.name,{...observation,tag:draft.tag}));
const stable=JSON.parse(execFileSync('git',['show','0b270c1452505268364659edd402209b00b28673:release.json'],{encoding:'utf8'}));
for(const stale of [stable,pre1])assert.throws(()=>verifyObservation(draft,stale,stale.name),'Pre.6 must only observe its immediate immutable public predecessor');
for(const mutate of [r=>{r.notes='docs/other.md';},r=>{r.migration.liveTargetVerified=false;},r=>{r.qualityReview.auditStatus='pending';},r=>{r.extra='unreviewed';}]){
 const changed=structuredClone(pre5);mutate(changed);assert.throws(()=>verifyObservation(draft,changed,changed.name),'Full predecessor metadata must match the immutable publication');
}
for(const verify of [verifyQualityApproval,verifyCutoverApproval,verifyPublication]){
 assert.throws(()=>verify(draft),'A pending pre.6 cannot inherit approval');
 for(const old of [stable,pre1,pre5]){
  const stale={...structuredClone(draft),qualityReview:structuredClone(old.qualityReview),migration:structuredClone(old.migration)};
  assert.throws(()=>verify(stale),'An old release receipt is invalid for pre.6');
  stale.qualityReview.releaseTag=draft.tag;
  // The quality helper validates metadata shape. The production boundaries
  // additionally bind the reviewed source, owner evidence and report hashes.
  if(verify!==verifyQualityApproval)assert.throws(()=>verify(stale),'Retagging an old receipt does not approve new source bytes');
 }
}
for(const marker of [null,false,{},'approved']){
 const invalid={...structuredClone(draft),followupAudit:marker};
 assert.throws(()=>verifyObservation(invalid,pre5,pre5.name));
 assert.throws(()=>selectBaseline(invalid,'push',''));
 assert.throws(()=>verifyCutoverApproval(invalid));
}
if(current.qualityReview.ownerApproval==='pending'){
 assert.deepEqual(current,draft,'New candidate has a completely cleared pending audit/live state');
}else{
 verifyCutoverApproval(current);
 if(current.migration.liveTargetVerified){verifyPublication(current);assert.throws(()=>verifyObservation(current,pre5,pre5.name),'Accepted pre.6 never downgrades to pre.5');}
 else assert.deepEqual(selectBaseline(current,'push',''),{ref:publishedCommit,mode:'published-v110-pre6-base'});
}
const report={passed:true,releaseTag:current.tag,publicPredecessor:publishedCommit,publicPredecessorTree:publishedTree,pendingCannotPublish:true,oldReceiptsRejected:true,unapprovedLiveFlagRejected:true,publicMetadataPinned:true};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pre6-publication.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS v1.1.0 pre.6 lifecycle: immutable public pre.5, cleared candidate state, old receipts and unapproved live flags rejected');
