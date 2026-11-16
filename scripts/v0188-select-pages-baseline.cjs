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
function selectBaseline(release,event,baseRef){
 assert.ok(['pull_request','push','workflow_dispatch'].includes(event),'Explicit supported Pages verification event required');
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
