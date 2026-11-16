'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {publishedCommit,publishedTree,publishedRelease,pendingRelease,isV110Followup,verifyFollowupDraft}=require('../scripts/helpers/v110-followup-review.cjs');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {selectBaseline}=require('../scripts/v0188-select-pages-baseline.cjs');
const current=require('../release.json'),draft=pendingRelease(),published=publishedRelease();
assert.equal(publishedCommit,'83af29133927a19fc7e0f9273c0e194c54384ae5');
assert.equal(publishedTree,'cc196155bdb69a5e45b6ddb76b1c49987d4a9f3b');
assert.deepEqual(published,JSON.parse(execFileSync('git',['show',publishedCommit+':release.json'],{encoding:'utf8'})));
assert.equal(published.tag,'v1.1.0-pre.1');assert.equal(published.migration.liveTargetVerified,true);
assert.ok(isV110Followup(current),'This candidate must explicitly remain an unpublished follow-up');
assert.deepEqual(verifyFollowupDraft(current),published);
assert.deepEqual(verifyFollowupDraft(draft),published);
assert.throws(()=>verifyCutoverApproval(published),'Copying the old approved manifest cannot authorize the changed follow-up source');
for(const verify of [verifyCutoverApproval,verifyQualityApproval,verifyPublication]){
 assert.throws(()=>verify(draft),/Follow-up audit drafts/,'An audit marker never grants publication approval');
 for(const marker of [null,false,{},'approved',{...draft.followupAudit,status:'approved',ownerApproval:'approved'}]){
  const bad=structuredClone(draft);bad.followupAudit=marker;bad.migration.liveTargetVerified=true;
  assert.throws(()=>verify(bad),/Follow-up audit drafts/,'Presence alone must block production despite claimed flags');
 }
 const removed=structuredClone(draft);delete removed.followupAudit;
 assert.throws(()=>verify(removed),'Removing the marker cannot approve the pending manifest');
}
for(const event of ['push','workflow_dispatch','pull_request']){
 const ref=event==='pull_request'?publishedCommit:'';
 assert.deepEqual(selectBaseline(draft,event,ref),{ref:publishedCommit,mode:'published-v110-followup-base'});
}
assert.throws(()=>selectBaseline(draft,'unknown',''));
for(const ref of ['main','0'.repeat(40),'0b270c1452505268364659edd402209b00b28673'])assert.throws(()=>selectBaseline(draft,'push',ref));
const observed=verifyObservation(draft,published,published.name);
assert.deepEqual(verifyObservation(draft,published,published.name,observed),observed);
assert.throws(()=>verifyObservation(draft,draft,draft.name),'Identical display name cannot hide draft metadata');
assert.throws(()=>verifyObservation(draft,published,'Other title'));
assert.throws(()=>verifyObservation(draft,published,published.name,{...observed,tag:'v1.0.0'}));
for(const mutate of [
 r=>{r.followupAudit.baseCommit='0'.repeat(40);},
 r=>{r.followupAudit.baseTree='0'.repeat(40);},
 r=>{r.followupAudit.requiresNewReleaseTag=false;},
 r=>{r.followupAudit.auditStatus='passed';},
 r=>{r.followupAudit.ownerApproval='approved';},
 r=>{r.qualityReview.ownerApproval='approved';},
 r=>{r.qualityReview.reviewedSourceCommit=publishedCommit;},
 r=>{r.migration.liveTargetVerified=true;},
 r=>{r.migration.liveAcceptanceSourceCommit=publishedCommit;},
 r=>{r.preRelease=2;},
 r=>{r.extra='unreviewed';}
]){
 const bad=structuredClone(draft);mutate(bad);
 assert.throws(()=>verifyFollowupDraft(bad),'Tampered candidate metadata is not an accepted audit context');
 assert.throws(()=>verifyObservation(bad,published,published.name));
 assert.throws(()=>selectBaseline(bad,'push',''));
}
for(const mutate of [r=>{r.qualityReview.auditStatus='pending';},r=>{r.migration.liveTargetVerified=false;},r=>{r.notes='docs/other.md';},r=>{r.extra='unknown';}]){
 const bad=structuredClone(published);mutate(bad);
 assert.throws(()=>verifyObservation(draft,bad,bad.name),'Live full metadata, not just its title, must match the pinned release');
}
// Every feature push tests the candidate, while write-side jobs stay main-only.
const workflows=['showdown-compare','showdown-differential','ui-smoke','v0184-engine-baseline','v0185-feedback','v0186-accuracy-mechanics','v0187-singularity-migration','v0188-quality-remediation','v100-stable-promotion','v110-es-la-localization','pages-live-smoke','publish-release','damage-lab-ci'];
for(const name of workflows){
 const yml=fs.readFileSync('.github/workflows/'+name+'.yml','utf8');
 assert.match(yml,/  push:\n    branches: \[[^\n]*feature\/v110-es-la-localization[^\n]*\]/,'Same-branch CI trigger: '+name);
 assert.ok(yml.includes('workflow_dispatch:'),'Manual reruns remain available: '+name);
 if(['ui-smoke','v0185-feedback','pages-live-smoke','publish-release'].includes(name)){
  const push=yml.split('  push:\n')[1].split(/\n  [a-z_]+:/)[0];
  assert.match(push,/      - docs\/v110-es-la-owner-screenshot-evidence\.md\n/,'Final evidence update must trigger this filtered workflow: '+name);
 }
}
assert.match(fs.readFileSync('.github/workflows/publish-release.yml','utf8'),/if:.*github\.ref == 'refs\/heads\/main'/,'Release publication remains main-only');
assert.match(fs.readFileSync('.github/workflows/damage-lab-ci.yml','utf8'),/report:\n    if:.*github\.ref == 'refs\/heads\/main'/,'Follow-up CI must not post to the unrelated status issue');
console.log('PASS v1.1.0 follow-up: pending audit only, pinned public pre.1 observation, changed metadata rejected, same-branch CI and main-only production writes');
