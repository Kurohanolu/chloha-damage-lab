'use strict';
// Evidence work after the immutable pre.1 publication. This marker authorizes
// only a draft and read-only observation of the pinned public release.
const assert=require('node:assert/strict'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const publishedCommit='83af29133927a19fc7e0f9273c0e194c54384ae5';
const publishedTree='cc196155bdb69a5e45b6ddb76b1c49987d4a9f3b';
const followup={status:'draft',purpose:'owner-capture-evidence-followup',baseCommit:publishedCommit,baseTree:publishedTree,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',requiresNewReleaseTag:true};
const isV110Followup=release=>release?.tag==='v1.1.0-pre.1'&&Object.prototype.hasOwnProperty.call(release,'followupAudit');
function publishedRelease(){
 const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',publishedCommit+'^{tree}']),publishedTree,'Published ES-LA commit/tree must remain pinned');
 return JSON.parse(git(['show',publishedCommit+':release.json']));
}
function pendingRelease(){
 const expected=publishedRelease();
 expected.followupAudit=structuredClone(followup);
 expected.migration.status='awaiting-owner-approval';expected.migration.liveTargetVerified=false;
 for(const key of Object.keys(expected.migration))if(key.startsWith('liveAcceptance'))delete expected.migration[key];
 expected.qualityReview={releaseTag:expected.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
 return expected;
}
function verifyFollowupDraft(release){
 assert.ok(isV110Followup(release),'Explicit ES-LA follow-up draft marker required');
 assert.deepEqual(release,pendingRelease(),'ES-LA follow-up must retain exact pending review/owner state, immutable base and no inherited live acceptance');
 return publishedRelease();
}
module.exports={publishedCommit,publishedTree,followup,isV110Followup,publishedRelease,pendingRelease,verifyFollowupDraft};
