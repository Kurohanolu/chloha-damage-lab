'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {verifyCutoverApproval}=require('./verify-publication-approval.cjs');
const {dependencies}=require('./v0187-build-sites.cjs');
const {hasFollowup,verifyFollowupDraft,publishedCommit}=require('./helpers/v0188-followup-review.cjs');
const v110Followup=require('./helpers/v110-followup-review.cjs');
function selectBaseline(release,event,baseRef){
 assert.ok(['pull_request','push','workflow_dispatch'].includes(event),'Explicit supported Pages verification event required');
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
