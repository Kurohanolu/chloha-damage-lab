'use strict';
// Every approval below exists only inside a disposable local Git repository.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifySuccessorApprovalBinding}=require('../scripts/helpers/v0188-pre2-approval-binding.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {stablePendingRelease,pendingRelease,publishedRelease,publishedCommit}=require('../scripts/helpers/v0188-followup-review.cjs');
const {acceptanceFiles,verifyStableLiveAcceptance}=require('../scripts/helpers/v100-live-acceptance.cjs');
const {selectBaseline,verifyBoundRuntime}=require('../scripts/v0188-select-pages-baseline.cjs');
const {baselineForRelease}=require('./helpers/v0188-browser-lab.cjs');
const original=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-stable-actual-')),artifacts=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-stable-artifacts-'));
const git=(args,cwd=temp)=>execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']}).trim();
const write=(file,text)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const commitFixture=message=>{git(['add','-A']);git(['-c','user.name=Synthetic Test Fixture','-c','user.email=fixture@example.invalid','commit','--allow-empty','-m',message]);};
try{
 git(['clone','--shared','--no-checkout',original,temp],original);
 for(const file of git(['ls-files','--cached','--others','--exclude-standard','-z'],original).split('\0').filter(Boolean)){
  const source=path.join(original,file);if(fs.statSync(source).isFile())write(path.join(temp,file),fs.readFileSync(source));
 }
 // ESM ignores NODE_PATH. Reuse the lockfile-installed local harness dependencies
 // through an ignored temporary link; no network/install or tracked-file exemption.
 const feedbackDependencies=path.join(original,'services/feedback/node_modules');
 assert.ok(fs.statSync(feedbackDependencies).isDirectory(),'Install the locked feedback harness dependencies before this test');
 const fixtureDependencies=path.join(temp,'services/feedback/node_modules');fs.mkdirSync(fixtureDependencies);
 for(const entry of fs.readdirSync(feedbackDependencies))fs.symlinkSync(path.join(feedbackDependencies,entry),path.join(fixtureDependencies,entry));
 require('./helpers/release-fixture.cjs').writeFixtureIdentity(temp,stablePendingRelease());
 commitFixture('SYNTHETIC stable reviewed candidate; never publish');
 const reviewedCommit=git(['rev-parse','HEAD']),reviewedTree=git(['rev-parse','HEAD^{tree}']);
 process.chdir(temp);
 const pending=JSON.parse(fs.readFileSync('release.json')),release=structuredClone(pending);delete release.followupAudit;
 release.migration.status='approved';release.migration.liveTargetVerified=false;
 const report='SYNTHETIC TEST ONLY\n6.1 Sol\nv1.0.0\n'+reviewedCommit+'\n'+reviewedTree+'\n';
 write('docs/synthetic-v100-review.md',report);
 Object.assign(release.qualityReview,{auditStatus:'passed',ownerApproval:'approved',evidence:'docs/synthetic-v100-review.md',auditOutcome:'conditional-pass',conditionsDisposition:'accepted-by-owner',reviewedSourceCommit:reviewedCommit,reviewedTree:reviewedTree,auditReportSha256:hash(report),ownerEvidence:'docs/synthetic-v100-owner.json',ownerRecordedAtJST:'2000-01-01T00:00:00+09:00'});
 const q=release.qualityReview,owner={schemaVersion:1,releaseTag:release.tag,reviewedSourceCommit:reviewedCommit,reviewedTree,auditReportSha256:q.auditReportSha256,auditor:'6.1 Sol',auditOutcome:q.auditOutcome,conditionsDisposition:q.conditionsDisposition,decision:'approved',approvedActions:['main-merge','new-tag','github-release','public-cutover'],recordedAtJST:q.ownerRecordedAtJST};
 write(q.ownerEvidence,JSON.stringify(owner));write('release.json',JSON.stringify(release));
 const binding=verifySuccessorApprovalBinding(release);assert.ok(binding.protectedFiles>200);
 assert.equal(baselineForRelease(release),publishedCommit,'Stable keeps the published pre.1 performance baseline after draft removal');
 assert.doesNotThrow(()=>verifyCutoverApproval(release));assert.throws(()=>verifyPublication(release),/actual new public URL/);
 const reusedPre2=structuredClone(release);Object.assign(reusedPre2.qualityReview,{reviewedSourceCommit:'c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095',reviewedTree:'bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b'});
 assert.throws(()=>verifyCutoverApproval(reusedPre2),/reviewed this new release identity/,'The audited pre.2 source cannot substitute for a fresh stable review');
 const previous=publishedRelease();
 assert.deepEqual(selectBaseline(release,'pull_request',publishedCommit),{ref:publishedCommit,mode:'existing-pr-base'});
 const observation=verifyObservation(release,previous,previous.name);
 assert.deepEqual(verifyObservation(release,previous,previous.name,observation),observation);
 for(const prior of [pending,pendingRelease(),{...previous,notes:'docs/tampered.md'}])assert.throws(()=>verifyObservation(release,prior,prior.name),'No pending/wrong successor or changed old manifest is an accepted public observation');
 assert.doesNotThrow(()=>verifyObservation(release,release,release.name));
 assert.throws(()=>verifyObservation(release,release,release.name,observation),'No mixed-version measurements');
 const flagOnly=structuredClone(release);flagOnly.migration.liveTargetVerified=true;
 assert.throws(()=>verifyCutoverApproval(flagOnly),/live acceptance source SHA/,'Stable true flag alone is insufficient');
 commitFixture('SYNTHETIC approved pre-acceptance deployment A; never deploy');
 const deployedCommit=git(['rev-parse','HEAD']),deployedTree=git(['rev-parse','HEAD^{tree}']);
 const deploymentRun='https://github.com/Kurohanolu/singularity/actions/runs/123',observedAtJST='2000-01-01T00:00:00+09:00';
 const files=acceptanceFiles(deployedCommit);assert.ok(Object.keys(files).length>=75,'Receipt covers both complete current and legacy artifacts');
 execFileSync(process.execPath,['scripts/v0187-build-sites.cjs','--output',artifacts],{cwd:temp,stdio:'pipe'});
 assert.deepEqual(files,JSON.parse(fs.readFileSync(path.join(artifacts,'migration-artifacts.json'))).files,'Receipt inventory equals the actual build output, including every added runtime asset');
 const receipt={schemaVersion:1,releaseTag:'v1.0.0',sourceCommit:deployedCommit,sourceTree:deployedTree,deploymentRun,observedAtJST,result:'passed',currentUrl:release.publicUrl,legacyUrl:release.migration.legacyUrl,files,rollbackSourceCommit:publishedCommit};
 write('docs/synthetic-v100-live.json',JSON.stringify(receipt));
 const accepted=structuredClone(release);Object.assign(accepted.migration,{liveTargetVerified:true,liveAcceptanceSourceCommit:deployedCommit,liveAcceptanceDeploymentRun:deploymentRun,liveAcceptanceEvidence:'docs/synthetic-v100-live.json',liveAcceptanceObservedAtJST:observedAtJST});
 write('release.json',JSON.stringify(accepted));
 assert.equal(verifyStableLiveAcceptance(accepted).files,Object.keys(files).length);
 assert.doesNotThrow(()=>verifyCutoverApproval(accepted));assert.doesNotThrow(()=>verifyPublication(accepted));
 assert.doesNotThrow(()=>verifyObservation(accepted,release,release.name),'Approved A may remain visible during final acceptance-metadata B rollout; final publication must separately verify exact B bytes');
 assert.throws(()=>verifyObservation(accepted,previous,previous.name),'Accepted stable cannot fall back to pre.1');
 assert.deepEqual(selectBaseline(accepted,'pull_request',publishedCommit),{ref:'',mode:'approved-live-candidate'});assert.ok(verifyBoundRuntime(accepted)>30);
 for(const [key,value] of [['releaseTag','v0.188-pre.2'],['sourceCommit',reviewedCommit],['sourceTree','0'.repeat(40)],['deploymentRun','https://example.invalid/123'],['observedAtJST','different'],['result','incomplete'],['rollbackSourceCommit',reviewedCommit],['files',{...files,'singularity/release.json':'0'.repeat(64)}]]){
  write('docs/synthetic-v100-live.json',JSON.stringify({...receipt,[key]:value}));assert.throws(()=>verifyPublication(accepted),/Stable acceptance receipt/,'Actual acceptance receipt binding: '+key);
 }
 write('docs/synthetic-v100-live.json',JSON.stringify(receipt));
 for(const [key,value] of [['liveAcceptanceSourceCommit',reviewedCommit],['liveAcceptanceDeploymentRun','https://github.com/Other/singularity/actions/runs/123'],['liveAcceptanceObservedAtJST','2000-01-01'],['liveAcceptanceEvidence','../outside.json']]){
  const bad=structuredClone(accepted);bad.migration[key]=value;assert.throws(()=>verifyPublication(bad),'Acceptance metadata bound to actual receipt: '+key);
 }
 for(const mutate of [r=>{r.notes='docs/releases/other.md';},r=>{r.qualityReview.ownerRecordedAtJST='2001-01-01T00:00:00+09:00';},r=>{r.migration.liveAcceptanceSourceCommit=reviewedCommit;}]){
  const bad=structuredClone(accepted);mutate(bad);assert.throws(()=>verifyPublication(bad),'B cannot relabel, repoint or invent A acceptance');
 }
 write(q.evidence,report+'tamper');assert.throws(()=>verifyCutoverApproval(release),/Actual Sol report/);write(q.evidence,report);
 for(const [key,value] of [['releaseTag','v0.188-pre.2'],['reviewedSourceCommit',publishedCommit],['reviewedTree','0'.repeat(40)],['auditReportSha256','0'.repeat(64)],['decision','pending'],['approvedActions',['main-merge']],['conditionsDisposition','pending'],['recordedAtJST','different']]){
  write(q.ownerEvidence,JSON.stringify({...owner,[key]:value}));assert.throws(()=>verifyCutoverApproval(release),/Owner receipt/,'Owner receipt tamper: '+key);
 }
 write(q.ownerEvidence,JSON.stringify(owner));
 for(const file of ['index.html','damage-engine-v0184.js','services/feedback/src/worker.js','scripts/verify-publication-approval.cjs','tests/v100-stable-release-gate.cjs','.github/workflows/publish-release.yml']){
  const bytes=fs.readFileSync(file);fs.appendFileSync(file,'\n/* synthetic tamper */\n');assert.throws(()=>verifyCutoverApproval(release),/Protected source bytes/);fs.writeFileSync(file,bytes);
 }
 write('synthetic-unreviewed-runtime.js','');git(['add','synthetic-unreviewed-runtime.js']);assert.throws(()=>verifyCutoverApproval(release),/Protected source inventory/);git(['reset','--','synthetic-unreviewed-runtime.js']);fs.unlinkSync('synthetic-unreviewed-runtime.js');
 assert.doesNotThrow(()=>verifyPublication(accepted));
 const contracts=['scripts/verify-release.cjs','tests/v0188-pre2-release-gate.cjs','tests/v0188-astra-followup-gates.cjs','tests/v0188-astra-cache.cjs','tests/v0188-approved-release-binding.cjs','tests/v0188-contract-and-approval.cjs','tests/v0188-pages-baseline.cjs','tests/v0188-public-release-observation.cjs','tests/v0187-migration-contract.cjs','tests/v0187-live-readiness.cjs','tests/v0187-deployment-gate.cjs','tests/v0186-release-gate.cjs','tests/v0184-public-baseline.cjs','tests/v100-stable-release-gate.cjs','tests/v100-stable-ui.cjs','tests/v100-release-publication.cjs','tests/v100-git-blob-binding.cjs','tests/v100-feedback-compat.cjs','tests/v100-deployment-proof.cjs','tests/v100-live-assets.cjs','tests/v100-ci-contract.cjs'];
 for(const state of [release,accepted]){
  write('release.json',JSON.stringify(state));
  for(const file of contracts)execFileSync(process.execPath,[file],{cwd:temp,env:{...process.env,NODE_PATH:[path.join(original,'node_modules'),process.env.NODE_PATH].filter(Boolean).join(path.delimiter)},encoding:'utf8',maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
 }
 console.log('PASS actual stable lifecycle: real reviewed Git/tree, exact Sol report/owner receipt, '+binding.protectedFiles+' protected files; approved A → complete artifact receipt → acceptance B; flag-only, forged/stale evidence, altered protected files/inventory and mixed observations rejected; '+contracts.length*2+' real promoted-state contract runs, zero production mutations');
}finally{process.chdir(original);fs.rmSync(temp,{recursive:true,force:true});fs.rmSync(artifacts,{recursive:true,force:true});}
