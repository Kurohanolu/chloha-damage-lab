'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {verifyCutoverApproval}=require('./verify-publication-approval.cjs');
const {dependencies}=require('./v0187-build-sites.cjs');
const {hasFollowup,verifyFollowupDraft,publishedCommit}=require('./helpers/v0188-followup-review.cjs');
const v110Followup=require('./helpers/v110-followup-review.cjs');
const pre2Commit='aba2d0558948e2a4dd375074fb11fd428edf6222',pre2Tree='5043182ba5b292f13630b461897457a74812dcfd';
const pre3Commit='082ab180bc8835304d959f583d4968e0565bdea3',pre3Tree='acbfb36b179a29be7b7071821a4dd2c2a8c446cc';
const pre4Commit='61d87e82995bc60d4564aaf57a52dfc1fd859e4c',pre4Tree='213c12af29c002e9344b018e6be69e568a251dff';
const pre5Commit='82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74',pre5Tree='f6e6bc6a8bedec4b8923671e9345ce24a8d45d40';
const pre6Commit='2fb5655a89e076df5993a3294bddbe1bf31afa58',pre6Tree='002d2af5716f408f50d50b8390d66a73ba083be3';
const pre7Commit='66a085ba325655bc9369656ea0645f7f6f997127',pre7Tree='531c22a3fd647f674a287808a7a63b74010ccb58';
const pre8Commit='0b1f8fffea3b1d063036d00fd712b0a0e9695111',pre8Tree='701fbae7b142ba2ac5e5e23f1755a84f39d82b6c';
const pre9Commit='46f930797e662be0d01e974f98ddde6de7b414c0',pre9Tree='1ea3163c8a8f4de8d68951b28c061a855461468c';
const pre12Commit='828e906a3c460a4c55e3f8e79bcd973ead0dc93b',pre12Tree='1921d6331b877830a5065f16f849925486f7b8c7';
const pre11Commit='fbec6fd45b841c3465be903b25a14e909cc80ba5',pre11Tree='a38f294cddaf10c15e8cea147e57a7b6d6148142';
const pre14Commit='cace126d0244f2d748b3c162a3e7cb5f9441932d',pre14Tree='7f4a6078575346b36f74ab6bcea941dc629e81ec';
const pre15Commit='66cae82e10d28ad6115acdacc964fd3e84f51b4a',pre15Tree='85c51a15b93f5da3bc81e0183ca1a3742a79966e';
const pre16Commit='a68b987d25d392076f36413e7f626ea3b71391c2',pre16Tree='c8292fafb8b927985d88ae7865ea8d755efdca76';
const pre18Commit='c52a65f4487fa8b4ceb2cd1ac5d85a2334697854',pre18Tree='beacee500cd7cd651bd312645d31417f1b47940f';
const pre17Commit='6360fa3a243c234993e032a415540b2c4691afeb',pre17Tree='bfb5619c528b396877f7c9e5a1f77aec664f106b';
function selectBaseline(release,event,baseRef){
 assert.ok(['pull_request','push','workflow_dispatch'].includes(event),'Explicit supported Pages verification event required');
 if(release.tag==='v1.1.0-pre.19'){
  assert.ok(!hasFollowup(release),'Pre.19 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.19 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre18Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre18Tree,'Published pre.18 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre18Commit,'Pre.19 public base must be the immutable published pre.18');
   return {ref:pre18Commit,mode:'published-v110-pre19-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.18'){
  assert.ok(!hasFollowup(release),'Pre.17 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.17 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre17Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre17Tree,'Published pre.17 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre17Commit,'Pre.17 public base must be the immutable published pre.17');
   return {ref:pre17Commit,mode:'published-v110-pre18-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.17'){
  assert.ok(!hasFollowup(release),'Pre.17 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.17 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre16Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre16Tree,'Published pre.16 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre16Commit,'Pre.17 public base must be the immutable published pre.16');
   return {ref:pre16Commit,mode:'published-v110-pre17-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.16'){
  assert.ok(!hasFollowup(release),'Pre.16 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.16 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre15Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre15Tree,'Published pre.15 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre15Commit,'Pre.16 public base must be the immutable published pre.15');
   return {ref:pre15Commit,mode:'published-v110-pre16-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.15'){
  assert.ok(!hasFollowup(release),'Pre.15 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.15 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre14Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre14Tree,'Published pre.14 commit/tree must remain pinned');
   if(event==='pull_request'&&baseRef===pre11Commit){
    // PR #83 predates pre.14: GitHub retains its creation-time base SHA.
    // Accept that one historical event value only on a real two-parent merge
    // whose first parent is the exact published pre.14 and whose candidate
    // already contains it. Never use the stale SHA as the public baseline.
    const git=args=>execFileSync('git',args,{cwd:path.resolve(__dirname,'..'),encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
    const parents=git(['rev-list','--parents','-n','1','HEAD']).split(' ').slice(1);
    assert.equal(parents.length,2,'Stale pre.15 PR metadata requires an actual two-parent checked-out merge');
    assert.equal(parents[0],pre14Commit,'Checked-out PR merge must target exact published pre.14');
    assert.notEqual(parents[1],pre14Commit,'Checked-out PR merge must contain a distinct candidate');
    git(['merge-base','--is-ancestor',pre11Commit,pre14Commit]);
    git(['merge-base','--is-ancestor',pre14Commit,parents[1]]);
    assert.equal(git(['rev-parse','HEAD^{tree}']),git(['merge-tree','--write-tree',parents[0],parents[1]]),'Checked-out merge tree must exactly match its verified parents');
   }else if(event==='pull_request'||baseRef)assert.equal(baseRef,pre14Commit,'Pre.15 public base must be the immutable published pre.14');
   return {ref:pre14Commit,mode:'published-v110-pre15-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.14'){
  assert.ok(!hasFollowup(release),'Pre.14 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.14 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre12Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre12Tree,'Published pre.12 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre12Commit,'Pre.14 public base must be the immutable published pre.12');
   return {ref:pre12Commit,mode:'published-v110-pre14-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.12'){
  assert.ok(!hasFollowup(release),'Pre.12 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.12 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre11Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre11Tree,'Published pre.11 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre11Commit,'Pre.12 public base must be the immutable published pre.11');
   return {ref:pre11Commit,mode:'published-v110-pre12-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.11'){
  assert.ok(!hasFollowup(release),'Pre.11 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.11 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre9Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre9Tree,'Published pre.9 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre9Commit,'Pre.11 public base must be the immutable published pre.9');
   return {ref:pre9Commit,mode:'published-v110-pre11-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.9'){
  assert.ok(!hasFollowup(release),'Pre.9 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.9 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre8Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre8Tree,'Published pre.8 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre8Commit,'Pre.9 public base must be the immutable published pre.8');
   return {ref:pre8Commit,mode:'published-v110-pre9-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.8'){
  assert.ok(!hasFollowup(release),'Pre.8 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.8 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre7Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre7Tree,'Published pre.7 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre7Commit,'Pre.8 public base must be the immutable published pre.7');
   return {ref:pre7Commit,mode:'published-v110-pre8-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.7'){
  assert.ok(!hasFollowup(release),'Pre.7 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.7 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre6Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre6Tree,'Published pre.6 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre6Commit,'Pre.7 public base must be the immutable published pre.6');
   return {ref:pre6Commit,mode:'published-v110-pre7-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.6'&&release.migration?.legacyPolicy==='community-pinned-v1'){
  const base=require('./helpers/v110-community-public-base.cjs');base.manifest();
  assert.ok(!hasFollowup(release));
  if(release.migration.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration.liveTargetVerified,false);
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   if(event==='pull_request'||baseRef)assert.equal(baseRef,base.commit,'Policy revision public base is the exact previously accepted pre.6 frontend');
   return {ref:base.commit,mode:'accepted-web-v110-pre6-community-revision-base'};
  }
 }else if(release.tag==='v1.1.0-pre.6'){
  assert.ok(!hasFollowup(release),'Pre.6 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.6 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre5Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre5Tree,'Published pre.5 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre5Commit,'Pre.6 public base must be the immutable published pre.5');
   return {ref:pre5Commit,mode:'published-v110-pre6-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.5'){
  assert.ok(!hasFollowup(release),'Pre.5 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.5 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre4Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre4Tree,'Published pre.4 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre4Commit,'Pre.5 public base must be the immutable published pre.4');
   return {ref:pre4Commit,mode:'published-v110-pre5-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.4'){
  assert.ok(!hasFollowup(release),'Pre.4 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.4 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre3Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre3Tree,'Published pre.3 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre3Commit,'Pre.4 public base must be the immutable published pre.3');
   return {ref:pre3Commit,mode:'published-v110-pre4-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.3'){
  assert.ok(!hasFollowup(release),'Pre.3 must use its own release decision, not a historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.3 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   assert.equal(execFileSync('git',['rev-parse',pre2Commit+'^{tree}'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim(),pre2Tree,'Published pre.2 commit/tree must remain pinned');
   if(event==='pull_request'||baseRef)assert.equal(baseRef,pre2Commit,'Pre.3 public base must be the immutable published pre.2');
   return {ref:pre2Commit,mode:'published-v110-pre3-base'};
  }
 }
 if(release.tag==='v1.1.0-pre.2'){
  assert.ok(!hasFollowup(release),'Pre.2 must use its own release decision, not the historical follow-up marker');
  if(release.migration?.liveTargetVerified===true)verifyCutoverApproval(release);
  else{
   assert.equal(release.migration?.liveTargetVerified,false,'Pre.2 must explicitly declare its pre-acceptance state');
   if(release.qualityReview?.ownerApproval!=='pending')verifyCutoverApproval(release);
   if(event==='pull_request'||baseRef)assert.equal(baseRef,v110Followup.publishedCommit,'ES-LA pre.2 public base must be the immutable published pre.1');
   return {ref:v110Followup.publishedCommit,mode:'published-v110-pre2-base'};
  }
 }
 if(v110Followup.isV110Followup(release)){
  v110Followup.verifyFollowupDraft(release);
  if(event==='pull_request'||baseRef)assert.equal(baseRef,v110Followup.publishedCommit,'ES-LA follow-up public base must be the immutable published pre.1');
  return {ref:v110Followup.publishedCommit,mode:'published-v110-followup-base'};
 }
 if(hasFollowup(release)){
  verifyFollowupDraft(release);
  assert.equal(event,'pull_request','Follow-up drafts can only observe the published PR base');
  assert.equal(baseRef,publishedCommit,'Follow-up Pages baseline must be the immutable published main');
  return {ref:publishedCommit,mode:'published-followup-base'};
 }
 if(event!=='pull_request')return {ref:'',mode:'exact-current-source'};
 assert.match(baseRef||'',/^[a-f0-9]{40}$/,'PR base must be an immutable full SHA');
 const [major,minor]=release.version.split('.').map(Number),qualityRelease=major>0||minor>=188;
 if(!qualityRelease||release.migration?.liveTargetVerified!==true)return {ref:baseRef,mode:'existing-pr-base'};
 // A claimed post-cutover release must fail closed rather than quietly checking
 // the old site when its approval or reviewed-source binding is invalid.
 verifyCutoverApproval(release);
 assert.match(release.qualityReview.reviewedSourceCommit||'',/^[a-f0-9]{40}$/,'Reviewed source commit binding required');
 assert.match(release.qualityReview.reviewedTree||'',/^[a-f0-9]{40}$/,'Reviewed source tree binding required');
 assert.ok(['pass','conditional-pass'].includes(release.qualityReview.auditOutcome),'Explicit independent audit outcome required');
 if(release.qualityReview.auditOutcome==='conditional-pass')assert.equal(release.qualityReview.conditionsDisposition,'accepted-by-owner','Conditional audit limits require explicit owner acceptance');
 return {ref:'',mode:'approved-live-candidate'};
}
function verifyBoundRuntime(release,sourceRef=''){
 if(sourceRef)assert.match(sourceRef,/^[a-f0-9]{40}$/,'Historical source must be an immutable full SHA');
 const read=file=>sourceRef?execFileSync('git',['show',sourceRef+':'+file],{maxBuffer:16*1024*1024}):fs.readFileSync(file);
 const review=release.qualityReview;
 const tree=execFileSync('git',['rev-parse',review.reviewedSourceCommit+'^{tree}'],{encoding:'utf8'}).trim();
 assert.equal(tree,review.reviewedTree,'Reviewed commit must identify the recorded tree');
 const html=read('index.html').toString(),files=new Set(['index.html',...dependencies(html),...Object.values(release.branding||{})]);
 for(const file of files){
  const approved=execFileSync('git',['show',review.reviewedSourceCommit+':'+file],{maxBuffer:16*1024*1024});
  const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash(read(file)),hash(approved),'Approved public runtime must remain byte-identical to reviewed source: '+file);
 }
 return files.size;
}
module.exports={selectBaseline,verifyBoundRuntime};
if(require.main===module){
 const release=JSON.parse(fs.readFileSync('release.json','utf8'));
 const selected=selectBaseline(release,process.env.PAGES_EVENT_NAME,process.env.PAGES_PR_BASE_REF);
 if(selected.mode==='approved-live-candidate')console.log('Verified '+verifyBoundRuntime(release)+' public files bound to the reviewed source');
 if(!process.env.GITHUB_OUTPUT)throw Error('GitHub step output path is required');
 fs.appendFileSync(process.env.GITHUB_OUTPUT,'baseline_ref='+selected.ref+'\n');
 console.log('Pages verification mode: '+selected.mode+'; exact HTML, runtime, presentation hashes and numeric contracts remain required');
}
