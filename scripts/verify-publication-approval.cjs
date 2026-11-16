'use strict';
// A draft manifest is valid for development, but cannot publish a migration.
const fs=require('node:fs'),assert=require('node:assert/strict');
function verifyCutoverApproval(release){
 assert.ok(!Object.prototype.hasOwnProperty.call(release,'followupAudit'),'Follow-up audit drafts cannot deploy or republish an immutable release; a new release decision is required');
 if(!release.migration){verifyQualityApproval(release);return;}
 assert.equal(release.migration.status,'approved','Singularity publication requires final owner cutover approval');
 assert.equal(release.migration.designApproval,'approved','The exact logo/design must be approved');
 assert.equal(release.migration.sourceRepository,'Kurohanolu/chloha-damage-lab');
 assert.equal(release.migration.targetRepository,'Kurohanolu/singularity');
 assert.equal(release.publicUrl,'https://kurohanolu.github.io/singularity/');
 assert.equal(release.migration.legacyUrl,'https://kurohanolu.github.io/chloha-damage-lab/');
 verifyQualityApproval(release);
 if(['v0.188-pre.2','v1.0.0'].includes(release.tag))require('./helpers/v0188-pre2-approval-binding.cjs').verifyPre2ApprovalBinding(release);
 if(['v1.1.0-pre.1','v1.1.0-pre.2'].includes(release.tag)){require('./helpers/v110-approval-binding.cjs').verifyV110Binding(release);if(release.migration.liveTargetVerified)require('./helpers/v100-live-acceptance.cjs').verifyStableLiveAcceptance(release);}
 if(release.tag==='v1.0.0'&&release.migration.liveTargetVerified)require('./helpers/v100-live-acceptance.cjs').verifyStableLiveAcceptance(release);
}
function verifyQualityApproval(release){
 assert.ok(!Object.prototype.hasOwnProperty.call(release,'followupAudit'),'Follow-up audit drafts cannot deploy or republish an immutable release; a new release decision is required');
 // Migration approval belongs to v0.187; it cannot authorize a later quality release.
 assert.equal(typeof release.version,'string','An explicit release version is required');
 require('./helpers/release-identity.cjs').releaseIdentity(release);
 const version=/^(\d+)\.(\d+)(?:\.\d+)?$/.exec(release.version);
 assert.ok(version,'A valid release version is required');
 if(Number(version[1])===0&&Number(version[2])<188)return;
 assert.ok(release.migration,'Quality releases must retain their migration identity');
 const review=release.qualityReview;
 assert.ok(review,'A new quality release requires independent review and owner approval');
 assert.equal(review.releaseTag,release.tag,'Quality approval must bind to this exact release tag');
 const reviewers={'v0.188-pre.1':'6.1 Terra','v0.188-pre.2':'6.1 Sol','v1.0.0':'6.1 Sol','v1.1.0-pre.1':'6.1 Sol','v1.1.0-pre.2':'6.1 Sol'};
 const reviewer=reviewers[release.tag];
 assert.ok(reviewer,'A new release identity requires an explicit independent review policy');

 assert.equal(review.auditor,reviewer,'Independent reviewer must be '+reviewer);
 assert.equal(review.auditStatus,'passed','Independent '+reviewer.replace('6.1 ','')+' quality audit must pass before deployment');
 assert.equal(review.ownerApproval,'approved','Owner must approve this quality release before deployment');
 assert.ok(typeof review.evidence==='string'&&review.evidence.trim().length>0,'Independent audit evidence is required');
 if(['v0.188-pre.2','v1.0.0'].includes(release.tag)){
  assert.match(review.reviewedSourceCommit||'',/^[a-f0-9]{40}$/,'Exact Sol-reviewed source commit required');
  assert.match(review.reviewedTree||'',/^[a-f0-9]{40}$/,'Exact Sol-reviewed tree required');
  assert.ok(!['64adc9eea8927fc72dbcb8cc1d5402b4917dff78','4f068544e670a85a6a4d34dd2c26e2be66bd9cb7'].includes(review.reviewedSourceCommit),'Historical source approval cannot authorize a successor');
  assert.ok(!['543fd64c78e775352a858939534419dacdc4180b','cf7af9334261b0cfbbde45929da9d217445fe526'].includes(review.reviewedTree),'Historical tree approval cannot authorize a successor');
  assert.match(review.auditReportSha256||'',/^[a-f0-9]{64}$/,'Sol report SHA256 binding required');
  assert.ok(['pass','conditional-pass'].includes(review.auditOutcome),'Explicit final independent audit outcome required');
  if(review.auditOutcome==='conditional-pass')assert.equal(review.conditionsDisposition,'accepted-by-owner','Owner must explicitly accept the remaining conditions');
  assert.ok(typeof review.ownerEvidence==='string'&&review.ownerEvidence.trim(),'New owner decision evidence required');
  assert.ok(typeof review.ownerRecordedAtJST==='string'&&Number.isFinite(Date.parse(review.ownerRecordedAtJST)),'New owner decision timestamp required');
  if(release.tag==='v1.0.0')assert.match(review.ownerRecordedAtJST,/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?\+09:00$/,'Stable owner decision must record its JST timezone');
 }

}
function verifyPublication(release){
 verifyCutoverApproval(release);
 if(release.migration)assert.equal(release.migration.liveTargetVerified,true,'The actual new public URL must be accepted before release publication');
}
module.exports={verifyCutoverApproval,verifyPublication,verifyQualityApproval};
if(require.main===module){verifyPublication(JSON.parse(fs.readFileSync('release.json','utf8')));console.log('PASS publication approval gate');}
