'use strict';
// The already-published release is an immutable observation target, never an
// approval for this follow-up draft. No network or production writes occur here.
const assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const publishedCommit='4f068544e670a85a6a4d34dd2c26e2be66bd9cb7';
const publishedTree='cf7af9334261b0cfbbde45929da9d217445fe526';
const followup={status:'draft',baseCommit:publishedCommit,baseTree:publishedTree,auditor:'6.1 Terra',auditStatus:'pending',ownerApproval:'pending'};
const hasFollowup=release=>Object.prototype.hasOwnProperty.call(release,'followupAudit');
function publishedRelease(){
 assert.equal(execFileSync('git',['rev-parse',publishedCommit+'^{tree}'],{encoding:'utf8'}).trim(),publishedTree,'Pinned published commit/tree must agree');
 return JSON.parse(execFileSync('git',['show',publishedCommit+':release.json'],{encoding:'utf8'}));
}
function verifyFollowupDraft(release){
 assert.ok(hasFollowup(release),'Explicit follow-up draft marker required');
 assert.deepEqual(release.followupAudit,followup,'Follow-up must remain the exact pending draft against the immutable published source');
 const expected=publishedRelease();expected.followupAudit=followup;expected.migration.liveTargetVerified=false;
 assert.deepEqual(release,expected,'Follow-up metadata may only add its pending audit and clear candidate live acceptance');
 return publishedRelease();
}
module.exports={publishedCommit,publishedTree,followup,hasFollowup,publishedRelease,verifyFollowupDraft};
