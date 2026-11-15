'use strict';
// The already-published release is an immutable observation target, never an
// approval for this follow-up draft. No network or production writes occur here.
const assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const publishedCommit='4f068544e670a85a6a4d34dd2c26e2be66bd9cb7';
const publishedTree='cf7af9334261b0cfbbde45929da9d217445fe526';
const followup={status:'draft',baseCommit:publishedCommit,baseTree:publishedTree,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending'};
const hasFollowup=release=>Object.prototype.hasOwnProperty.call(release,'followupAudit');
function publishedRelease(){
 assert.equal(execFileSync('git',['rev-parse',publishedCommit+'^{tree}'],{encoding:'utf8'}).trim(),publishedTree,'Pinned published commit/tree must agree');
 return JSON.parse(execFileSync('git',['show',publishedCommit+':release.json'],{encoding:'utf8'}));
}
function pendingRelease(){
 const expected=publishedRelease();
 Object.assign(expected,{preRelease:2,tag:'v0.188-pre.2',name:'Singularity v0.188 Pre-Release 2',notes:'docs/releases/v0.188-pre.2.md'});
 expected.followupAudit=structuredClone(followup);
 expected.migration.status='awaiting-owner-approval';expected.migration.liveTargetVerified=false;
 for(const key of Object.keys(expected.migration))if(key.startsWith('liveAcceptance'))delete expected.migration[key];
 expected.qualityReview={releaseTag:expected.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
 return expected;
}
function verifyFollowupDraft(release){
 assert.ok(hasFollowup(release),'Explicit follow-up draft marker required');
 assert.deepEqual(release.followupAudit,followup,'Follow-up must remain the exact pending draft against the immutable published source');
 const expected=pendingRelease();
 assert.deepEqual(release,expected,'Pre.2 draft must retain exact pending review/owner fields and no inherited live acceptance');
 return publishedRelease();
}
module.exports={publishedCommit,publishedTree,followup,hasFollowup,publishedRelease,pendingRelease,verifyFollowupDraft};
