'use strict';
// Creates a disposable local Git fixture, never an approval for the real repo.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyPre2ApprovalBinding}=require('../scripts/helpers/v0188-pre2-approval-binding.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {publishedRelease,pendingRelease}=require('../scripts/helpers/v0188-followup-review.cjs');
const {selectBaseline,verifyBoundRuntime}=require('../scripts/v0188-select-pages-baseline.cjs');
const {baselineForRelease}=require('./helpers/v0188-browser-lab.cjs');
const original=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre2-actual-'));
const git=(args,cwd=temp)=>execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']}).trim();
const write=(file,text)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(baselineForRelease(publishedRelease()),'7210be99c39d75b49ea8200aad91d75801eb300a','Historical pre.1 measurement baseline remains unchanged');
for(const metadata of [{...publishedRelease(),followupAudit:{status:'draft'}},pendingRelease()])assert.equal(baselineForRelease(metadata),'4f068544e670a85a6a4d34dd2c26e2be66bd9cb7');
try{
 git(['clone','--shared','--no-checkout',original,temp],original);
 // Include the exact working candidate, including the newly added gate/test.
 for(const file of git(['ls-files','--cached','--others','--exclude-standard','-z'],original).split('\0').filter(Boolean)){
  const source=path.join(original,file);if(fs.statSync(source).isFile())write(path.join(temp,file),fs.readFileSync(source));
 }
 require('./helpers/release-fixture.cjs').writeFixtureIdentity(temp,pendingRelease());
 git(['add','-A']);git(['-c','user.name=Synthetic Test Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-m','Synthetic pre2 candidate; never publish']);
 const commit=git(['rev-parse','HEAD']),tree=git(['rev-parse','HEAD^{tree}']);
 process.chdir(temp);
 const pending=JSON.parse(fs.readFileSync('release.json'));
 const release=structuredClone(pending);delete release.followupAudit;
 release.migration.status='approved';release.migration.liveTargetVerified=false;
 assert.equal(baselineForRelease(release),'4f068544e670a85a6a4d34dd2c26e2be66bd9cb7','Pre.2 measurements retain published pre.1 baseline after marker removal');
 const report='SYNTHETIC TEST ONLY\n6.1 Sol\nv0.188-pre.2\n'+commit+'\n'+tree+'\n';
 write('docs/synthetic-pre2-review.md',report);
 Object.assign(release.qualityReview,{auditStatus:'passed',ownerApproval:'approved',evidence:'docs/synthetic-pre2-review.md',auditOutcome:'conditional-pass',conditionsDisposition:'accepted-by-owner',reviewedSourceCommit:commit,reviewedTree:tree,auditReportSha256:hash(report),ownerEvidence:'docs/synthetic-pre2-owner.json',ownerRecordedAtJST:'2000-01-01T00:00:00+09:00'});
 const q=release.qualityReview,owner={schemaVersion:1,releaseTag:release.tag,reviewedSourceCommit:commit,reviewedTree:tree,auditReportSha256:q.auditReportSha256,auditor:'6.1 Sol',auditOutcome:q.auditOutcome,conditionsDisposition:q.conditionsDisposition,decision:'approved',approvedActions:['main-merge','new-tag','github-release','public-cutover'],recordedAtJST:q.ownerRecordedAtJST};
 write(q.ownerEvidence,JSON.stringify(owner));write('release.json',JSON.stringify(release));
 const verified=verifyPre2ApprovalBinding(release);assert.ok(verified.protectedFiles>200,'Runtime, Worker, workflows, scripts and tests are actually bound');
 assert.doesNotThrow(()=>verifyCutoverApproval(release));assert.throws(()=>verifyPublication(release),/actual new public URL/);
 const previous=publishedRelease(),pre187=JSON.parse(git(['show','7210be99c39d75b49ea8200aad91d75801eb300a:release.json']));
 assert.deepEqual(selectBaseline(release,'pull_request','4f068544e670a85a6a4d34dd2c26e2be66bd9cb7'),{ref:'4f068544e670a85a6a4d34dd2c26e2be66bd9cb7',mode:'existing-pr-base'});
 const observed=verifyObservation(release,previous,previous.name);
 assert.deepEqual(verifyObservation(release,previous,previous.name,observed),observed,'Repeated pre-cutover samples keep one exact public identity');
 for(const mutate of [r=>{r.notes='docs/other.md';},r=>{r.qualityReview.ownerApproval='pending';},r=>{r.migration.liveTargetVerified=false;},r=>{r.extra='unexpected';}]){
  const bad=structuredClone(previous);mutate(bad);assert.throws(()=>verifyObservation(release,bad,previous.name),'Pre-cutover pre.1 must match its complete immutable manifest');
 }
 for(const mutate of [r=>{r.qualityReview.ownerApproval='pending';},r=>{r.qualityReview.auditReportSha256='0'.repeat(64);}]){
  const bad=structuredClone(release);mutate(bad);assert.throws(()=>verifyObservation(bad,previous,previous.name),'Read-only promotion observation requires actual new approval bindings');
 }
 assert.throws(()=>verifyObservation(release,pre187,pre187.name),'Approved pre.2 cannot observe the older pre.187 site');
 assert.throws(()=>verifyObservation(release,pending,pending.name),'Pending pre.2 cannot masquerade as a deployed approved candidate');
 assert.doesNotThrow(()=>verifyObservation(release,release,release.name),'Exact approved pre.2 may be observed during cutover acceptance');
 assert.throws(()=>verifyObservation(release,release,release.name,observed),'Do not mix pre.1 and pre.2 samples in one measurement');
 release.migration.liveTargetVerified=true;assert.doesNotThrow(()=>verifyPublication(release));
 assert.throws(()=>verifyObservation(release,previous,previous.name),'Accepted pre.2 cannot fall back to pre.1');
 assert.throws(()=>verifyObservation(release,pre187,pre187.name),'Accepted pre.2 cannot fall back to pre.187');
 assert.doesNotThrow(()=>verifyObservation(release,release,release.name),'Accepted pre.2 observes its exact approved identity');
 assert.deepEqual(selectBaseline(release,'pull_request','4f068544e670a85a6a4d34dd2c26e2be66bd9cb7'),{ref:'',mode:'approved-live-candidate'});
 assert.ok(verifyBoundRuntime(release)>30);
 for(const event of ['push','workflow_dispatch'])assert.deepEqual(selectBaseline(release,event,''),{ref:'',mode:'exact-current-source'});

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
 // Execute the real mandatory non-browser contracts in the promoted checkout,
 // before and after live acceptance. No exceptions are swallowed or tests skipped.
 const contracts=['scripts/verify-release.cjs','tests/v0188-pre2-release-gate.cjs','tests/v0188-astra-followup-gates.cjs','tests/v0188-astra-cache.cjs','tests/v0188-approved-release-binding.cjs','tests/v0188-contract-and-approval.cjs','tests/v0188-pages-baseline.cjs','tests/v0188-public-release-observation.cjs','tests/v0187-migration-contract.cjs','tests/v0187-live-readiness.cjs','tests/v0187-deployment-gate.cjs','tests/v0186-release-gate.cjs','tests/v0184-public-baseline.cjs'];
 for(const live of [false,true]){
  const promotion=structuredClone(release);promotion.migration.liveTargetVerified=live;write('release.json',JSON.stringify(promotion));
  for(const file of contracts)execFileSync(process.execPath,[file],{cwd:temp,env:{...process.env,NODE_PATH:[path.join(original,'node_modules'),process.env.NODE_PATH].filter(Boolean).join(path.delimiter)},encoding:'utf8',maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
 }

 console.log('PASS actual pre.2 binding: disposable Git commit/tree, real report digest, structured exact owner receipt, '+verified.protectedFiles+' protected source files; missing/tampered evidence, incomplete actions, changed runtime/Worker/workflow/tests and inventory rejected; zero production mutations');
}finally{process.chdir(original);fs.rmSync(temp,{recursive:true,force:true});}
