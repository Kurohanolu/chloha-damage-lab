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
}
function verifyQualityApproval(release){
 assert.ok(!Object.prototype.hasOwnProperty.call(release,'followupAudit'),'Follow-up audit drafts cannot deploy or republish an immutable release; a new release decision is required');
 // Migration approval belongs to v0.187; it cannot authorize a later quality release.
 assert.equal(typeof release.version,'string','An explicit release version is required');
 const version=/^(\d+)\.(\d+)$/.exec(release.version);
 assert.ok(version,'A valid release version is required');
 if(Number(version[1])===0&&Number(version[2])<188)return;
 assert.ok(release.migration,'Quality releases must retain their migration identity');
 const review=release.qualityReview;
 assert.ok(review,'A new quality release requires independent Terra review and owner approval');
 assert.equal(review.releaseTag,release.tag,'Quality approval must bind to this exact release tag');
 assert.equal(review.auditor,'6.1 Terra','Independent reviewer must be Terra');
 assert.equal(review.auditStatus,'passed','Independent Terra quality audit must pass before deployment');
 assert.equal(review.ownerApproval,'approved','Owner must approve this quality release before deployment');
 assert.ok(typeof review.evidence==='string'&&review.evidence.trim().length>0,'Independent audit evidence is required');
}
function verifyPublication(release){
 verifyCutoverApproval(release);
 if(release.migration)assert.equal(release.migration.liveTargetVerified,true,'The actual new public URL must be accepted before release publication');
}
module.exports={verifyCutoverApproval,verifyPublication,verifyQualityApproval};
if(require.main===module){verifyPublication(JSON.parse(fs.readFileSync('release.json','utf8')));console.log('PASS publication approval gate');}
