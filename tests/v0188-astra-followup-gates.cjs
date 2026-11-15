'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {selectBaseline,verifyBoundRuntime}=require('../scripts/v0188-select-pages-baseline.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {publishedCommit,publishedTree,publishedRelease,verifyFollowupDraft}=require('../scripts/helpers/v0188-followup-review.cjs');
const current=require('../release.json'),published=publishedRelease();
assert.equal(publishedCommit,'4f068544e670a85a6a4d34dd2c26e2be66bd9cb7');
assert.equal(publishedTree,'cf7af9334261b0cfbbde45929da9d217445fe526');
assert.equal(current.tag,published.tag,'The existing immutable release identity must not be reassigned');
assert.deepEqual(verifyFollowupDraft(current),published);
assert.equal(require('./helpers/v0188-browser-lab.cjs').baseline,publishedCommit,'Same-run follow-up performance must compare the already published v0.188 source');
for(const verify of [verifyCutoverApproval,verifyQualityApproval,verifyPublication]){
 assert.doesNotThrow(()=>verify(published),'Historical publication keeps its original approval');
 assert.throws(()=>verify(current),/Follow-up audit drafts/,'Follow-up draft is not approved by historical owner acceptance');
 for(const value of [null,false,{},'approved',{...current.followupAudit,status:'approved',auditStatus:'passed',ownerApproval:'approved'}]){
  const bad=structuredClone(current);bad.followupAudit=value;bad.migration.liveTargetVerified=true;
  assert.throws(()=>verify(bad),/Follow-up audit drafts/,'Presence of a follow-up marker blocks publication irrespective of claimed flags');
 }
}
assert.deepEqual(selectBaseline(current,'pull_request',publishedCommit),{ref:publishedCommit,mode:'published-followup-base'});
for(const event of ['push','workflow_dispatch','unknown'])assert.throws(()=>selectBaseline(current,event,publishedCommit));
for(const ref of ['main','7210be99c39d75b49ea8200aad91d75801eb300a','0'.repeat(40),''])assert.throws(()=>selectBaseline(current,'pull_request',ref));
for(const mutate of [
 r=>{r.followupAudit.baseCommit='0'.repeat(40);},
 r=>{r.followupAudit.baseTree='0'.repeat(40);},
 r=>{r.followupAudit.auditStatus='passed';},
 r=>{r.followupAudit.ownerApproval='approved';},
 r=>{r.followupAudit.extra='unexpected';},
 r=>{r.qualityReview.ownerApproval='pending';},
 r=>{r.qualityReview.reviewedSourceCommit='0'.repeat(40);},
 r=>{r.migration.liveTargetVerified=true;},
 r=>{r.preRelease=2;},
 r=>{r.extra='unexpected';}
]){
 const bad=structuredClone(current);mutate(bad);
 assert.throws(()=>verifyFollowupDraft(bad),'Mutated follow-up metadata fails before any live observation');
 assert.throws(()=>selectBaseline(bad,'pull_request',publishedCommit));
 assert.throws(()=>verifyObservation(bad,published,published.name));
}
const observed=verifyObservation(current,published,published.name);
assert.deepEqual(verifyObservation(current,published,published.name,observed),observed);
assert.throws(()=>verifyObservation(current,current,current.name),'Draft cannot masquerade as already-published pre.1');
for(const mutate of [r=>{r.qualityReview.ownerApproval='pending';},r=>{r.migration.liveTargetVerified=false;},r=>{r.notes='other';},r=>{r.extra='changed';}]){
 const bad=structuredClone(published);mutate(bad);
 assert.throws(()=>verifyObservation(current,bad,published.name),'Identity-only matches cannot hide changed public release metadata');
}
assert.throws(()=>verifyObservation(current,published,'Old title'));
assert.throws(()=>verifyObservation(current,published,published.name,{...observed,preRelease:2}));
assert.ok(verifyBoundRuntime(published,publishedCommit)>30,'Historical approved runtime is still checked byte for byte');
// A real altered runtime must still be rejected when presented as approved.
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-followup-binding-'));
try{
 execFileSync('git',['clone','--shared','--no-checkout',process.cwd(),temp],{stdio:'pipe'});
 execFileSync('git',['checkout','--detach',publishedCommit],{cwd:temp,stdio:'pipe'});
 fs.appendFileSync(path.join(temp,'i18n.js'),'\n/* unauthorized runtime mutation */\n');
 const original=process.cwd();try{process.chdir(temp);assert.throws(()=>verifyBoundRuntime(published),/Approved public runtime must remain byte-identical/);}finally{process.chdir(original);}
}finally{fs.rmSync(temp,{recursive:true,force:true});}
console.log('PASS immutable follow-up lifecycle: 42-file historical approval preserved, draft deployment forbidden, exact pinned public observation, metadata/live/approval tamper negatives, mutated runtime rejection');
