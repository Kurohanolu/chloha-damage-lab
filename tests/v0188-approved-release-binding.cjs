'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {dependencies}=require('../scripts/v0187-build-sites.cjs');
const {verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const current=JSON.parse(fs.readFileSync('release.json'));
const {publishedCommit,hasFollowup,publishedRelease,verifyFollowupDraft}=require('../scripts/helpers/v0188-followup-review.cjs');
const followup=hasFollowup(current),historical=followup||['v0.188-pre.2','v1.0.0'].includes(current.tag),r=historical?publishedRelease():current;
if(followup)verifyFollowupDraft(current);
const read=file=>historical?execFileSync('git',['show',publishedCommit+':'+file],{maxBuffer:16*1024*1024}):fs.readFileSync(file);
const q=r.qualityReview,hash=body=>crypto.createHash('sha256').update(body).digest('hex');
assert.equal(q.auditOutcome,'conditional-pass');
assert.equal(q.conditionsDisposition,'accepted-by-owner');
assert.equal(q.auditStatus,'passed');
assert.equal(q.ownerApproval,'approved');
assert.match(q.reviewedSourceCommit,/^[a-f0-9]{40}$/);
assert.equal(execFileSync('git',['rev-parse',q.reviewedSourceCommit+'^{tree}'],{encoding:'utf8'}).trim(),q.reviewedTree);
assert.equal(hash(read(q.evidence)),q.auditReportSha256,'unaltered independent audit evidence');
const owner=read(q.ownerEvidence).toString();
assert.ok(owner.includes(q.reviewedSourceCommit)&&owner.includes('続行してくれブラザー')&&owner.includes('21.9%'),'exact reviewed source and explicit owner disposition are recorded');
const html=read('index.html').toString();
const files=[...new Set(['index.html',...dependencies(html),...Object.values(r.branding),'services/feedback/src/worker.js','tests/fixtures/v0184-public-baseline.json','tests/fixtures/v0186-baseline-corrections.json'])];
for(const file of files){
 const before=execFileSync('git',['show',q.reviewedSourceCommit+':'+file],{maxBuffer:16*1024*1024});
 assert.equal(hash(read(file)),hash(before),'owner approval does not authorize unreviewed runtime changes: '+file);
}
verifyCutoverApproval(r);
if(r.migration.liveTargetVerified)assert.doesNotThrow(()=>verifyPublication(r));
else assert.throws(()=>verifyPublication(r),/actual new public URL/,'first adoption is not final publication acceptance');
console.log('PASS approved release: '+files.length+' frontend/engine/Worker/fixture bytes bound to reviewed source; immutable audit and explicit owner acceptance; live gate retained');


if(followup){
 assert.throws(()=>verifyCutoverApproval(current),/Follow-up audit drafts/);
 assert.throws(()=>verifyPublication(current),/Follow-up audit drafts/);
 assert.equal(hash(fs.readFileSync(r.qualityReview.evidence)),r.qualityReview.auditReportSha256,'Historical independent evidence stays unchanged in the follow-up source');
 assert.equal(fs.readFileSync(r.qualityReview.ownerEvidence,'utf8'),read(r.qualityReview.ownerEvidence).toString(),'Historical owner decision stays unchanged');
 console.log('PASS follow-up draft is blocked from deployment/publication; historical 42-file approval remains independently bound');
}

// Historical approval remains checked above; actual successor approval is checked
// by the same file/Git binding helper used by target deployment and publication.
if(!followup&&['v0.188-pre.2','v1.0.0'].includes(current.tag)){
 verifyCutoverApproval(current);
 console.log('PASS successor actual Sol report, structured owner receipt and all protected source bindings');
}
