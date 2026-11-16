'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=args=>execFileSync('git',args,{maxBuffer:32*1024*1024});
function evidence(file){
 assert.match(file||'',/^docs\/[a-zA-Z0-9_./-]+$/);
 assert.ok(!file.split('/').some(x=>x==='..'||x.startsWith('.')));
 assert.ok(fs.lstatSync(file).isFile());
 assert.ok(fs.realpathSync(file).startsWith(fs.realpathSync('.')+'/'));
 return fs.readFileSync(file);
}
function verifyV110Binding(release){
 assert.ok(['v1.1.0-pre.1','v1.1.0-pre.2','v1.1.0-pre.3','v1.1.0-pre.4','v1.1.0-pre.5','v1.1.0-pre.6','v1.1.0-pre.7','v1.1.0-pre.8'].includes(release.tag),'Explicit ES-LA release policy required');
 const r=release.qualityReview;
 assert.match(r.reviewedSourceCommit||'',/^[a-f0-9]{40}$/);
 assert.equal(git(['rev-parse',r.reviewedSourceCommit+'^{tree}']).toString().trim(),r.reviewedTree);
 const reviewed=file=>git(['show',r.reviewedSourceCommit+':'+file]);
 const before=JSON.parse(reviewed('release.json'));
 assert.equal(before.tag,release.tag);assert.equal(before.qualityReview.ownerApproval,'pending');
 assert.ok(!Object.hasOwn(before,'followupAudit'),'A distinct reviewed release candidate is required');
 if(['v1.1.0-pre.2','v1.1.0-pre.3','v1.1.0-pre.4','v1.1.0-pre.5','v1.1.0-pre.6','v1.1.0-pre.7','v1.1.0-pre.8'].includes(release.tag)){
  assert.equal(before.preRelease,release.tag==='v1.1.0-pre.8'?8:release.tag==='v1.1.0-pre.7'?7:release.tag==='v1.1.0-pre.6'?6:release.tag==='v1.1.0-pre.5'?5:release.tag==='v1.1.0-pre.4'?4:release.tag==='v1.1.0-pre.3'?3:2);assert.equal(before.qualityReview.releaseTag,release.tag);
  assert.equal(before.qualityReview.auditStatus,'pending');
 }
 assert.equal(before.migration.liveTargetVerified,false);
 const expected=structuredClone(before);expected.qualityReview=r;expected.migration.status='approved';
 expected.migration.liveTargetVerified=release.migration.liveTargetVerified;
 for(const key of ['liveAcceptanceSourceCommit','liveAcceptanceDeploymentRun','liveAcceptanceEvidence','liveAcceptanceObservedAtJST'])if(Object.hasOwn(release.migration,key)){
  assert.equal(release.migration.liveTargetVerified,true);expected.migration[key]=release.migration[key];
 }
 assert.deepEqual(release,expected,'Only review/owner/live metadata may change after independent review');
 assert.equal(r.auditor,'6.1 Sol');assert.equal(r.auditStatus,'passed');assert.equal(r.ownerApproval,'approved');
 assert.ok(['pass','conditional-pass'].includes(r.auditOutcome));
 assert.equal(r.conditionsDisposition,'accepted-by-owner');
 assert.match(r.ownerRecordedAtJST||'',/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?\+09:00$/);
 assert.ok(Number.isFinite(Date.parse(r.ownerRecordedAtJST)));
 const report=evidence(r.evidence);assert.equal(hash(report),r.auditReportSha256);
 for(const binding of ['6.1 Sol',release.tag,r.reviewedSourceCommit,r.reviewedTree])assert.ok(report.toString().includes(binding),'Review must bind '+binding);
 const owner=JSON.parse(evidence(r.ownerEvidence));
 assert.deepEqual(owner,{schemaVersion:1,releaseTag:release.tag,reviewedSourceCommit:r.reviewedSourceCommit,reviewedTree:r.reviewedTree,auditReportSha256:r.auditReportSha256,auditor:'6.1 Sol',auditOutcome:r.auditOutcome,conditionsDisposition:r.conditionsDisposition,decision:'approved',approvedActions:['main-merge','new-tag','github-release','public-cutover'],feedbackPolicy:'pause-es-LA-preserve-nine',recordedAtJST:r.ownerRecordedAtJST});
 const protectedFile=f=>f!=='release.json'&&!f.startsWith('docs/');
 const files=git(['ls-files','-z']).toString().split('\0').filter(Boolean).filter(protectedFile).sort();
 const oldFiles=git(['ls-tree','-r','--name-only','-z',r.reviewedSourceCommit]).toString().split('\0').filter(Boolean).filter(protectedFile).sort();
 assert.deepEqual(files,oldFiles,'Reviewed protected inventory must match');
 const batch=execFileSync('git',['cat-file','--batch'],{input:files.map(f=>r.reviewedSourceCommit+':'+f+'\n').join(''),maxBuffer:32*1024*1024});
 require('./v0188-pre2-approval-binding.cjs').verifyProtectedBlobBatch(files,batch);
 return {protectedFiles:files.length};
}
module.exports={verifyV110Binding};
