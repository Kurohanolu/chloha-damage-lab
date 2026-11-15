'use strict';
// Creates a disposable local Git fixture, never an approval for the real repo.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyPre2ApprovalBinding}=require('../scripts/helpers/v0188-pre2-approval-binding.cjs');
const original=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre2-actual-'));
const git=(args,cwd=temp)=>execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']}).trim();
const write=(file,text)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
try{
 git(['clone','--shared','--no-checkout',original,temp],original);
 // Include the exact working candidate, including the newly added gate/test.
 for(const file of git(['ls-files','--cached','--others','--exclude-standard','-z'],original).split('\0').filter(Boolean)){
  const source=path.join(original,file);if(fs.statSync(source).isFile())write(path.join(temp,file),fs.readFileSync(source));
 }
 git(['add','-A']);git(['-c','user.name=Synthetic Test Fixture','-c','user.email=fixture@example.invalid','commit','-m','Synthetic pre2 candidate; never publish']);
 const commit=git(['rev-parse','HEAD']),tree=git(['rev-parse','HEAD^{tree}']);
 process.chdir(temp);
 const release=JSON.parse(fs.readFileSync('release.json'));delete release.followupAudit;
 release.migration.status='approved';release.migration.liveTargetVerified=false;
 const report='SYNTHETIC TEST ONLY\n6.1 Sol\nv0.188-pre.2\n'+commit+'\n'+tree+'\n';
 write('docs/synthetic-pre2-review.md',report);
 Object.assign(release.qualityReview,{auditStatus:'passed',ownerApproval:'approved',evidence:'docs/synthetic-pre2-review.md',auditOutcome:'conditional-pass',conditionsDisposition:'accepted-by-owner',reviewedSourceCommit:commit,reviewedTree:tree,auditReportSha256:hash(report),ownerEvidence:'docs/synthetic-pre2-owner.json',ownerRecordedAtJST:'2000-01-01T00:00:00+09:00'});
 const q=release.qualityReview,owner={schemaVersion:1,releaseTag:release.tag,reviewedSourceCommit:commit,reviewedTree:tree,auditReportSha256:q.auditReportSha256,auditor:'6.1 Sol',auditOutcome:q.auditOutcome,conditionsDisposition:q.conditionsDisposition,decision:'approved',approvedActions:['main-merge','new-tag','github-release','public-cutover'],recordedAtJST:q.ownerRecordedAtJST};
 write(q.ownerEvidence,JSON.stringify(owner));write('release.json',JSON.stringify(release));
 const verified=verifyPre2ApprovalBinding(release);assert.ok(verified.protectedFiles>200,'Runtime, Worker, workflows, scripts and tests are actually bound');
 assert.doesNotThrow(()=>verifyCutoverApproval(release));assert.throws(()=>verifyPublication(release),/actual new public URL/);
 release.migration.liveTargetVerified=true;assert.doesNotThrow(()=>verifyPublication(release));
 for(const mutate of [r=>{r.branding.icon=r.branding.favicon;},r=>{r.notes='docs/releases/v0.188-pre.1.md';},r=>{r.name='Other product';},r=>{r.developer='Other developer';},r=>{r.extra='unexpected';},r=>{r.migration.extra='unexpected';},r=>{r.migration.designApproval='other';}]){
  const bad=structuredClone(release);mutate(bad);assert.throws(()=>verifyCutoverApproval(bad),'Promotion must not alter reviewed identity/asset/metadata scope');
 }
 const accepted=structuredClone(release);Object.assign(accepted.migration,{liveAcceptanceSourceCommit:commit,liveAcceptanceDeploymentRun:'https://github.com/Kurohanolu/singularity/actions/runs/1',liveAcceptanceEvidence:'docs/synthetic-pre2-review.md',liveAcceptanceObservedAtJST:'2000-01-01T00:00:00+09:00'});
 assert.doesNotThrow(()=>verifyPublication(accepted),'Explicit later acceptance metadata is allowed without altering reviewed runtime');
 accepted.migration.liveTargetVerified=false;assert.throws(()=>verifyCutoverApproval(accepted),/actual acceptance/);

 for(const [key,value] of [['reviewedSourceCommit','1'.repeat(40)],['reviewedTree','2'.repeat(40)],['auditReportSha256','3'.repeat(64)],['evidence','docs/missing-review.md'],['ownerEvidence','docs/missing-owner.json']]){
  const bad=structuredClone(release);bad.qualityReview[key]=value;assert.throws(()=>verifyCutoverApproval(bad),'Actual evidence mismatch: '+key);
 }
 write(q.evidence,report+'tamper');assert.throws(()=>verifyCutoverApproval(release),/Actual Sol report/);write(q.evidence,report);
 for(const [key,value] of [['releaseTag','v0.188-pre.1'],['reviewedSourceCommit','4f068544e670a85a6a4d34dd2c26e2be66bd9cb7'],['reviewedTree','0'.repeat(40)],['auditReportSha256','0'.repeat(64)],['decision','pending'],['approvedActions',['main-merge']],['conditionsDisposition','pending'],['recordedAtJST','different']]){
  write(q.ownerEvidence,JSON.stringify({...owner,[key]:value}));assert.throws(()=>verifyCutoverApproval(release),/Owner receipt/,'Owner receipt tamper: '+key);
 }
 write(q.ownerEvidence,JSON.stringify(owner));
 for(const file of ['index.html','damage-engine-v0184.js','services/feedback/src/worker.js','scripts/verify-publication-approval.cjs','tests/v0188-pre2-release-gate.cjs','.github/workflows/publish-release.yml']){
  const bytes=fs.readFileSync(file);fs.appendFileSync(file,'\n/* synthetic tamper */\n');assert.throws(()=>verifyCutoverApproval(release),/Protected source bytes/,'Reviewed source tamper: '+file);fs.writeFileSync(file,bytes);
 }
 write('synthetic-unreviewed-runtime.js','');git(['add','synthetic-unreviewed-runtime.js']);assert.throws(()=>verifyCutoverApproval(release),/Protected source inventory/);git(['reset','--','synthetic-unreviewed-runtime.js']);fs.unlinkSync('synthetic-unreviewed-runtime.js');
 assert.doesNotThrow(()=>verifyPublication(release),'Exact synthetic evidence is restored after every negative');
 console.log('PASS actual pre.2 binding: disposable Git commit/tree, real report digest, structured exact owner receipt, '+verified.protectedFiles+' protected source files; missing/tampered evidence, incomplete actions, changed runtime/Worker/workflow/tests and inventory rejected; zero production mutations');
}finally{process.chdir(original);fs.rmSync(temp,{recursive:true,force:true});}
