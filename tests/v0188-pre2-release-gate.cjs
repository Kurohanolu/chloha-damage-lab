'use strict';
// Synthetic lifecycle fixtures only: no approval recording, network or publication.
const assert=require('node:assert/strict');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {publishedRelease,pendingRelease,verifyFollowupDraft}=require('../scripts/helpers/v0188-followup-review.cjs');
const current=require('../release.json'),historical=publishedRelease();
assert.deepEqual(current,pendingRelease());assert.deepEqual(verifyFollowupDraft(current),historical);
assert.equal(current.tag,'v0.188-pre.2');assert.equal(historical.tag,'v0.188-pre.1');
assert.equal(current.migration.status,'awaiting-owner-approval');
assert.equal(current.migration.liveTargetVerified,false);
assert.ok(!Object.keys(current.migration).some(key=>key.startsWith('liveAcceptance')),'No inherited live acceptance claim');
for(const verify of [verifyCutoverApproval,verifyQualityApproval,verifyPublication]){
 assert.throws(()=>verify(current),/Follow-up audit drafts/);
 const removed=structuredClone(current);delete removed.followupAudit;
 assert.throws(()=>verify(removed),'Removing a marker cannot grant approval');
 removed.migration.status='approved';removed.migration.liveTargetVerified=true;
 assert.throws(()=>verify(removed),'Migration/live flags cannot authorize pending review');
 removed.qualityReview=structuredClone(historical.qualityReview);
 assert.throws(()=>verify(removed),'Historical approval cannot authorize new release identity');
 removed.qualityReview.releaseTag=current.tag;
 assert.throws(()=>verify(removed),'Relabeling a historical Terra review cannot make it a Sol review');
 removed.qualityReview.auditor='6.1 Sol';
 assert.throws(()=>verify(removed),'Relabeling the reviewer cannot reuse the historical source/tree approval');
 assert.doesNotThrow(()=>verify(historical),'Historical pre.1 approval remains valid');
}
const fixture=structuredClone(current);delete fixture.followupAudit;
fixture.migration.status='approved';fixture.migration.liveTargetVerified=true;
Object.assign(fixture.qualityReview,{auditStatus:'passed',ownerApproval:'approved',evidence:'SYNTHETIC ONLY; not a real review',auditOutcome:'conditional-pass',conditionsDisposition:'accepted-by-owner',reviewedSourceCommit:'1'.repeat(40),reviewedTree:'2'.repeat(40),auditReportSha256:'3'.repeat(64),ownerEvidence:'SYNTHETIC ONLY; not owner approval',ownerRecordedAtJST:'2000-01-01T00:00:00+09:00'});
assert.doesNotThrow(()=>verifyQualityApproval(fixture),'Synthetic fields exercise metadata only; actual publication additionally requires real Git/files');
assert.throws(()=>verifyCutoverApproval(fixture),'Synthetic hashes and absent files cannot pass the actual publication path');
for(const [key,value] of [['releaseTag',historical.tag],['auditor','6.1 Terra'],['auditStatus','pending'],['ownerApproval','pending'],['evidence',''],['reviewedSourceCommit','main'],['reviewedTree',''],['auditReportSha256',''],['auditOutcome','incomplete'],['conditionsDisposition','pending'],['ownerEvidence',''],['ownerRecordedAtJST',null]]){
 const bad=structuredClone(fixture);bad.qualityReview[key]=value;
 assert.throws(()=>verifyQualityApproval(bad),'Reject missing/new approval binding: '+key);
}
const notLive=structuredClone(fixture);notLive.migration.liveTargetVerified=false;
assert.doesNotThrow(()=>verifyQualityApproval(notLive));assert.throws(()=>verifyPublication(notLive),'Metadata alone cannot establish a live release');
const reinserted=structuredClone(fixture);reinserted.followupAudit={status:'approved'};
assert.throws(()=>verifyPublication(reinserted),/Follow-up audit drafts/);
console.log('PASS unpublished pre.2: fresh pending Sol/owner decision; historical approval immutable; marker removal, relabeling, missing bindings, conditional limits and unaccepted live target fail closed');
