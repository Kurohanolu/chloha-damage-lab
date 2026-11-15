'use strict';
// Actual pre.2 publication authorization evidence; no network or production writes.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {verifyFollowupDraft}=require('./v0188-followup-review.cjs');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function verifyPre2ApprovalBinding(release){
 assert.equal(release.tag,'v0.188-pre.2');
 const review=release.qualityReview,git=args=>execFileSync('git',args,{maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
 assert.match(review.reviewedSourceCommit||'',/^[a-f0-9]{40}$/);
 assert.equal(git(['rev-parse',review.reviewedSourceCommit+'^{tree}']).toString().trim(),review.reviewedTree,'Actual reviewed Git tree must match');
 const reviewed=file=>git(['show',review.reviewedSourceCommit+':'+file]);
 const reviewedManifest=JSON.parse(reviewed('release.json'));
 assert.equal(reviewedManifest.tag,release.tag,'Sol must have reviewed this new release identity');
 verifyFollowupDraft(reviewedManifest);
 // Promotion cannot relabel or repoint approved assets/notes/identity. Only the
 // explicit authorization record and subsequent live-acceptance metadata vary.
 const promoted=structuredClone(reviewedManifest);delete promoted.followupAudit;
 promoted.qualityReview=structuredClone(review);
 promoted.migration.status='approved';
 assert.equal(typeof release.migration.liveTargetVerified,'boolean','Explicit live acceptance state required');
 promoted.migration.liveTargetVerified=release.migration.liveTargetVerified;
 const acceptanceKeys=['liveAcceptanceSourceCommit','liveAcceptanceDeploymentRun','liveAcceptanceEvidence','liveAcceptanceObservedAtJST'];
 for(const key of acceptanceKeys)if(Object.prototype.hasOwnProperty.call(release.migration,key)){
  assert.equal(release.migration.liveTargetVerified,true,'Live acceptance evidence must follow actual acceptance');
  promoted.migration[key]=release.migration[key];
 }
 assert.deepEqual(release,promoted,'Only explicit approval/live-acceptance metadata may change after Sol review');
 function evidence(file){
  assert.match(file||'',/^docs\/[a-zA-Z0-9_./-]+$/,'Evidence must be a repository documentation file');
  assert.ok(!file.split('/').some(part=>part==='..'||part.startsWith('.')),'Unsafe evidence path');
  assert.equal(fs.lstatSync(file).isFile(),true,'Evidence must be a regular repository file');
  assert.ok(fs.realpathSync(file).startsWith(fs.realpathSync(process.cwd())+path.sep),'Evidence must stay within the checkout');
  return fs.readFileSync(file);
 }
 const report=evidence(review.evidence);
 assert.equal(hash(report),review.auditReportSha256,'Actual Sol report must match its SHA256');
 for(const binding of ['6.1 Sol',release.tag,review.reviewedSourceCommit,review.reviewedTree])assert.ok(report.toString().includes(binding),'Sol report must identify the exact reviewed source: '+binding);
 const owner=JSON.parse(evidence(review.ownerEvidence));
 assert.deepEqual(owner,{schemaVersion:1,releaseTag:release.tag,reviewedSourceCommit:review.reviewedSourceCommit,reviewedTree:review.reviewedTree,auditReportSha256:review.auditReportSha256,auditor:'6.1 Sol',auditOutcome:review.auditOutcome,conditionsDisposition:review.conditionsDisposition,decision:'approved',approvedActions:['main-merge','new-tag','github-release','public-cutover'],recordedAtJST:review.ownerRecordedAtJST},'Owner receipt must explicitly authorize this exact release and every publication action');
 // Only promotion metadata and documentation may differ from the reviewed
 // candidate. Runtime, Worker, tests, scripts and workflows remain byte-bound.
 const protectedFile=file=>file!=='release.json'&&!file.startsWith('docs/');
 const files=git(['ls-files','-z']).toString().split('\0').filter(Boolean).filter(protectedFile).sort();
 const reviewedFiles=git(['ls-tree','-r','--name-only','-z',review.reviewedSourceCommit]).toString().split('\0').filter(Boolean).filter(protectedFile).sort();
 assert.deepEqual(files,reviewedFiles,'Protected source inventory must match the Sol-reviewed candidate');
 for(const file of files)assert.equal(hash(fs.readFileSync(file)),hash(reviewed(file)),'Protected source bytes differ from the Sol-reviewed candidate: '+file);
 return {reviewedSourceCommit:review.reviewedSourceCommit,reviewedTree:review.reviewedTree,protectedFiles:files.length};
}
module.exports={verifyPre2ApprovalBinding};
