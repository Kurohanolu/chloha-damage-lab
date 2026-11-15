'use strict';
// Synthetic metadata negatives; publication still needs real Git/report/receipt
// evidence, exercised by v100-stable-actual-approval.cjs.
const assert=require('node:assert/strict');
const {releaseIdentity}=require('../scripts/helpers/release-identity.cjs');
const {stablePendingRelease,pendingRelease,publishedRelease,verifyFollowupDraft,hasFollowup}=require('../scripts/helpers/v0188-followup-review.cjs');
const {verifyQualityApproval,verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const stable=stablePendingRelease(),actual=require('../release.json');
assert.equal(actual.tag,'v1.0.0','This gate must execute on the stable candidate');
if(hasFollowup(actual))verifyFollowupDraft(actual);else verifyCutoverApproval(actual);
assert.deepEqual(releaseIdentity(stable),{stable:true,displayVersion:'v1.0.0',packageVersion:'1.0.0'});
assert.equal(stable.preRelease,null);assert.equal(stable.channel,'stable');assert.equal(stable.qualityReview.ownerApproval,'pending');
assert.deepEqual(verifyFollowupDraft(stable),publishedRelease());
for(const prior of [publishedRelease(),pendingRelease()])assert.throws(()=>verifyFollowupDraft({...stable,qualityReview:prior.qualityReview}),'No inherited prior review grants stable approval');
for(const mutate of [r=>{r.channel='prerelease';},r=>{delete r.channel;},r=>{delete r.preRelease;},r=>{r.preRelease=0;},r=>{r.preRelease=2;},r=>{r.version='1.0';},r=>{r.version='01.0.0';},r=>{r.tag='v1.0.0-pre.1';},r=>{r.name='Singularity v1.0.0 Pre-Release 2';},r=>{r.notes='docs/releases/v0.188-pre.2.md';},r=>{r.version='1.0.1';r.tag='v1.0.1';r.name='Singularity v1.0.1';r.notes='docs/releases/v1.0.1.md';}]){
 const bad=structuredClone(stable);mutate(bad);assert.throws(()=>verifyFollowupDraft(bad),'Unknown/malformed stable draft cannot be approved');
}
for(const check of [verifyQualityApproval,verifyCutoverApproval,verifyPublication]){
 assert.throws(()=>check(stable),/Follow-up audit drafts/);
 const removed=structuredClone(stable);delete removed.followupAudit;removed.migration.status='approved';removed.migration.liveTargetVerified=true;
 assert.throws(()=>check(removed),'Removing the draft marker and adding flags does not grant approval');
 removed.qualityReview=structuredClone(publishedRelease().qualityReview);removed.qualityReview.releaseTag=stable.tag;removed.qualityReview.auditor='6.1 Sol';
 assert.throws(()=>check(removed),'Relabeling historical approval cannot authorize stable');
}
const fixture=structuredClone(stable);delete fixture.followupAudit;fixture.migration.status='approved';
Object.assign(fixture.qualityReview,{auditStatus:'passed',ownerApproval:'approved',evidence:'SYNTHETIC TEST ONLY',auditOutcome:'conditional-pass',conditionsDisposition:'accepted-by-owner',reviewedSourceCommit:'1'.repeat(40),reviewedTree:'2'.repeat(40),auditReportSha256:'3'.repeat(64),ownerEvidence:'SYNTHETIC TEST ONLY',ownerRecordedAtJST:'2000-01-01T00:00:00+09:00'});
assert.doesNotThrow(()=>verifyQualityApproval(fixture));assert.throws(()=>verifyCutoverApproval(fixture),'Metadata-shaped fake evidence fails the actual stable gate');
for(const [key,value] of [['releaseTag','v0.188-pre.2'],['auditor','6.1 Terra'],['auditStatus','pending'],['ownerApproval','pending'],['reviewedSourceCommit','c9c52e1'],['reviewedTree',null],['auditReportSha256',''],['auditOutcome','incomplete'],['conditionsDisposition','pending'],['ownerEvidence',''],['ownerRecordedAtJST','not-a-date'],['ownerRecordedAtJST','2000-01-01T00:00:00Z']]){
 const bad=structuredClone(fixture);bad.qualityReview[key]=value;assert.throws(()=>verifyQualityApproval(bad),'Stable approval binding required: '+key);
}
console.log('PASS stable release identity and pending authorization: exact v1.0.0/channel/null-prerelease, no inherited pre.1/pre.2 approval, no metadata-only publication or unknown release policy');
