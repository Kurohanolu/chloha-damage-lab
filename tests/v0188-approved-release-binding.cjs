'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {dependencies}=require('../scripts/v0187-build-sites.cjs');
const {verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const r=JSON.parse(fs.readFileSync('release.json'));
const q=r.qualityReview,hash=body=>crypto.createHash('sha256').update(body).digest('hex');
assert.equal(q.auditOutcome,'conditional-pass');
assert.equal(q.conditionsDisposition,'accepted-by-owner');
assert.equal(q.auditStatus,'passed');
assert.equal(q.ownerApproval,'approved');
assert.match(q.reviewedSourceCommit,/^[a-f0-9]{40}$/);
assert.equal(execFileSync('git',['rev-parse',q.reviewedSourceCommit+'^{tree}'],{encoding:'utf8'}).trim(),q.reviewedTree);
assert.equal(hash(fs.readFileSync(q.evidence)),q.auditReportSha256,'unaltered independent audit evidence');
const owner=fs.readFileSync(q.ownerEvidence,'utf8');
assert.ok(owner.includes(q.reviewedSourceCommit)&&owner.includes('続行してくれブラザー')&&owner.includes('21.9%'),'exact reviewed source and explicit owner disposition are recorded');
const html=fs.readFileSync('index.html','utf8');
const files=[...new Set(['index.html',...dependencies(html),...Object.values(r.branding),'services/feedback/src/worker.js','tests/fixtures/v0184-public-baseline.json','tests/fixtures/v0186-baseline-corrections.json'])];
for(const file of files){
 const before=execFileSync('git',['show',q.reviewedSourceCommit+':'+file],{maxBuffer:16*1024*1024});
 assert.equal(hash(fs.readFileSync(file)),hash(before),'owner approval does not authorize unreviewed runtime changes: '+file);
}
verifyCutoverApproval(r);
if(r.migration.liveTargetVerified)assert.doesNotThrow(()=>verifyPublication(r));
else assert.throws(()=>verifyPublication(r),/actual new public URL/,'first adoption is not final publication acceptance');
console.log('PASS approved release: '+files.length+' frontend/engine/Worker/fixture bytes bound to reviewed source; immutable audit and explicit owner acceptance; live gate retained');

