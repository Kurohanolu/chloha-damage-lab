'use strict';
// A new prerelease must earn its own approval. The published pre.15 is the
// immutable observation/rollback baseline, never a reusable approval receipt.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {selectBaseline}=require('../scripts/v0188-select-pages-baseline.cjs');
const publishedCommit='66cae82e10d28ad6115acdacc964fd3e84f51b4a',publishedTree='85c51a15b93f5da3bc81e0183ca1a3742a79966e';
const historical=ref=>JSON.parse(execFileSync('git',['show',ref+':release.json'],{encoding:'utf8'}));
const current=structuredClone(require('../release.json')),pre15=historical(publishedCommit),pre1=historical('83af29133927a19fc7e0f9273c0e194c54384ae5');
assert.equal(current.migration.legacyPolicy,'community-pinned-v1');assert.equal(current.tag,'v1.1.0-pre.16');assert.equal(current.preRelease,16);assert.equal(current.name,'Singularity v1.1.0 Pre-Release 16');
assert.equal(current.notes,'docs/releases/v1.1.0-pre.16.md');assert.equal(Object.hasOwn(current,'followupAudit'),false);
assert.equal(pre15.tag,'v1.1.0-pre.15');assert.equal(pre15.migration.liveTargetVerified,true);
assert.equal(execFileSync('git',['rev-parse',publishedCommit+'^{tree}'],{encoding:'utf8'}).trim(),publishedTree);
assert.equal(pre1.tag,'v1.1.0-pre.1');assert.equal(pre1.migration.liveTargetVerified,true);
const draft=structuredClone(current);draft.migration.status='awaiting-owner-approval';draft.migration.liveTargetVerified=false;
for(const key of Object.keys(draft.migration))if(key.startsWith('liveAcceptance'))delete draft.migration[key];
draft.qualityReview={releaseTag:draft.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
for(const event of ['push','workflow_dispatch','pull_request']){
 const expected={ref:publishedCommit,mode:'published-v110-pre16-base'};
 assert.deepEqual(selectBaseline(draft,event,publishedCommit),expected);
 if(event!=='pull_request')assert.deepEqual(selectBaseline(draft,event,''),expected);
 for(const ref of ['main','0'.repeat(40),'0b270c1452505268364659edd402209b00b28673','83af29133927a19fc7e0f9273c0e194c54384ae5'])assert.throws(()=>selectBaseline(draft,event,ref),'Do not substitute a moving, stale or arbitrary baseline');
 const falseLive=structuredClone(draft);falseLive.migration.liveTargetVerified=true;
 assert.throws(()=>selectBaseline(falseLive,event,publishedCommit),'An unaudited live flag cannot select current-source verification');
}
assert.throws(()=>selectBaseline(draft,'unknown',publishedCommit));
const observation=verifyObservation(draft,pre15,pre15.name);
assert.deepEqual(verifyObservation(draft,pre15,pre15.name,observation),observation);
assert.throws(()=>verifyObservation(draft,pre15,draft.name));
assert.throws(()=>verifyObservation(draft,draft,draft.name));
assert.throws(()=>verifyObservation(draft,pre15,pre15.name,{...observation,tag:draft.tag}));
const stable=JSON.parse(execFileSync('git',['show','0b270c1452505268364659edd402209b00b28673:release.json'],{encoding:'utf8'}));
for(const stale of [stable,pre1])assert.throws(()=>verifyObservation(draft,stale,stale.name),'Pre.16 must only observe its immediate immutable public predecessor');
for(const mutate of [r=>{r.notes='docs/other.md';},r=>{r.migration.liveTargetVerified=false;},r=>{r.qualityReview.auditStatus='pending';},r=>{r.extra='unreviewed';}]){
 const changed=structuredClone(pre15);mutate(changed);assert.throws(()=>verifyObservation(draft,changed,changed.name),'Full predecessor metadata must match the immutable publication');
}
for(const verify of [verifyQualityApproval,verifyCutoverApproval,verifyPublication]){
 assert.throws(()=>verify(draft),'A pending pre.16 cannot inherit approval');
 for(const old of [stable,pre1,pre15]){
  const stale={...structuredClone(draft),qualityReview:structuredClone(old.qualityReview),migration:structuredClone(old.migration)};
  assert.throws(()=>verify(stale),'An old release receipt is invalid for pre.16');
  stale.qualityReview.releaseTag=draft.tag;
  // The quality helper validates metadata shape. The production boundaries
  // additionally bind the reviewed source, owner evidence and report hashes.
  if(verify!==verifyQualityApproval)assert.throws(()=>verify(stale),'Retagging an old receipt does not approve new source bytes');
 }
}
for(const marker of [null,false,{},'approved']){
 const invalid={...structuredClone(draft),followupAudit:marker};
 assert.throws(()=>verifyObservation(invalid,pre15,pre15.name));
 assert.throws(()=>selectBaseline(invalid,'push',''));
 assert.throws(()=>verifyCutoverApproval(invalid));
}
if(current.qualityReview.ownerApproval==='pending'){
 assert.deepEqual(current,draft,'New candidate has a completely cleared pending audit/live state');
}else{
 verifyCutoverApproval(current);
 if(current.migration.liveTargetVerified){verifyPublication(current);assert.throws(()=>verifyObservation(current,pre15,pre15.name),'Accepted pre.16 never downgrades to pre.15');}
 else assert.deepEqual(selectBaseline(current,'push',''),{ref:publishedCommit,mode:'published-v110-pre16-base'});
}
// Both receipt writer and verifier must name the same immutable rollback source.
for(const file of ['scripts/helpers/v100-live-acceptance.cjs','scripts/v100-live-acceptance.cjs']){
 const code=fs.readFileSync(file,'utf8'),expression=code.match(/const rollbackSourceCommit=([^;]+);/)?.[1];
 assert.ok(expression,'Receipt boundary declares its rollback source');
 const actual=require('node:vm').runInNewContext(expression,{release:current,publishedCommit:'4f068544e670a85a6a4d34dd2c26e2be66bd9cb7'});
 assert.equal(actual,publishedCommit,'Pre.16 writer/verifier binds published pre.15, not a historical fallback');
 assert.equal(execFileSync('git',['rev-parse',actual+'^{tree}'],{encoding:'utf8'}).trim(),publishedTree);
 const files=require('../scripts/helpers/v100-live-acceptance.cjs').acceptanceFiles(actual);
 assert.ok(Object.keys(files).length>70,'Complete exact-source dual-site rollback inventory');
 assert.deepEqual(files,require('../scripts/helpers/v100-live-acceptance.cjs').acceptanceFiles(publishedCommit));
}
console.log('PASS pre.16 writer/verifier rollback references bind exact pre.15 tree and full asset inventory');

const report={passed:true,releaseTag:current.tag,publicPredecessor:publishedCommit,publicPredecessorTree:publishedTree,pendingCannotPublish:true,oldReceiptsRejected:true,unapprovedLiveFlagRejected:true,publicMetadataPinned:true};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pre16-publication.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS v1.1.0 pre.16 lifecycle: immutable public pre.15, cleared candidate state, old receipts and unapproved live flags rejected');
