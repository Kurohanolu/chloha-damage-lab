'use strict';
const assert=require('node:assert/strict');
const {verifyCutoverApproval,verifyQualityApproval}=require('../verify-publication-approval.cjs');
const {hasFollowup,verifyFollowupDraft,publishedRelease}=require('./v0188-followup-review.cjs');
const v110Followup=require('./v110-followup-review.cjs');
const baseline={version:'0.187',preRelease:33,tag:'v0.187-pre.33',name:'Singularity v0.187 Pre-Release 33',product:'Singularity',developer:'Chloha Labs',publicUrl:'https://kurohanolu.github.io/singularity/'};
const fields=Object.keys(baseline);
const stableCommit='0b270c1452505268364659edd402209b00b28673';
function stableManifest(){return JSON.parse(require('node:child_process').execFileSync('git',['show',stableCommit+':release.json'],{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}));}
const pre2Commit='aba2d0558948e2a4dd375074fb11fd428edf6222',pre2Tree='5043182ba5b292f13630b461897457a74812dcfd';
function pre2Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre2Commit+'^{tree}']),pre2Tree,'Published pre.2 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre2Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.2');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre3Commit='082ab180bc8835304d959f583d4968e0565bdea3',pre3Tree='acbfb36b179a29be7b7071821a4dd2c2a8c446cc';
function pre3Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre3Commit+'^{tree}']),pre3Tree,'Published pre.3 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre3Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.3');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre4Commit='61d87e82995bc60d4564aaf57a52dfc1fd859e4c',pre4Tree='213c12af29c002e9344b018e6be69e568a251dff';
function pre4Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre4Commit+'^{tree}']),pre4Tree,'Published pre.4 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre4Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.4');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre5Commit='82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74',pre5Tree='f6e6bc6a8bedec4b8923671e9345ce24a8d45d40';
function pre5Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre5Commit+'^{tree}']),pre5Tree,'Published pre.5 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre5Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.5');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
function identity(release){return Object.fromEntries(fields.map(key=>[key,release?.[key]]));}
function verifyObservation(localRelease,publicRelease,title,previous=null){
 const actual=identity(publicRelease);
 if(localRelease.tag==='v1.1.0-pre.6'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.6 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre5Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.6 development must observe the complete pinned published pre.5 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.6 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.5 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.6 may observe only its own identity or the pinned pre-cutover pre.5');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.5'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.5 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre4Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.5 development must observe the complete pinned published pre.4 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.5 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.4 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.5 may observe only its own identity or the pinned pre-cutover pre.4');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.4'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.4 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre3Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.4 development must observe the complete pinned published pre.3 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.4 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.3 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.4 may observe only its own identity or the pinned pre-cutover pre.3');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.3'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.3 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre2Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.3 development must observe the complete pinned published pre.2 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.3 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.2 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.3 may observe only its own identity or the pinned pre-cutover pre.2');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.2'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.2 must use its own release decision, not the historical follow-up marker');
  const predecessor=v110Followup.publishedRelease();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'ES-LA pre.2 development must observe the complete pinned published pre.1 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.2 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable ES-LA pre.1 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved ES-LA pre.2 may observe only its own identity or the pinned pre-cutover pre.1');
   }
  }
 }else if(v110Followup.isV110Followup(localRelease)){
  const published=v110Followup.verifyFollowupDraft(localRelease);
  // Full immutable source metadata is the evidence. Never apply the old
  // release's current-working-tree approval checker to changed draft bytes.
  assert.deepEqual(publicRelease,published,'ES-LA follow-up must observe the complete pinned published pre.1 manifest');
 }else if(localRelease.tag==='v1.1.0-pre.1'&&localRelease.qualityReview?.ownerApproval==='pending'){
  // Development observes the immutable Stable deployment, never the unpublished
  // candidate. This grants no cutover approval and rejects any changed manifest.
  assert.equal(localRelease.qualityReview?.ownerApproval,'pending');
  assert.equal(localRelease.migration?.liveTargetVerified,false);
  // Validate immutable historical approval metadata without incorrectly binding
  // those historical bytes to today's development working tree.
  const published=stableManifest();verifyQualityApproval(published);
  assert.deepEqual(publicRelease,published,'ES-LA development must observe the complete pinned v1.0.0 manifest');
 }else if(localRelease.tag==='v1.1.0-pre.1'){
  verifyCutoverApproval(localRelease);
  if(actual.tag==='v1.0.0'){assert.equal(localRelease.migration.liveTargetVerified,false);assert.deepEqual(publicRelease,stableManifest());}
  else {verifyCutoverApproval(publicRelease);assert.deepEqual(actual,identity(localRelease));}
 }else if(hasFollowup(localRelease)){
  const published=verifyFollowupDraft(localRelease);
  verifyCutoverApproval(published);
  assert.deepEqual(publicRelease,published,'Follow-up observations must match the complete pinned published manifest');
 }else if(['v0.188-pre.2','v1.0.0'].includes(localRelease.tag)){
  // Approved successor CI must be able to observe the current pre.1 site before
  // cutover, since deployment itself requires that CI. Never accept a downgrade.
  verifyCutoverApproval(localRelease);
  if(actual.tag==='v0.188-pre.1'){
   assert.equal(localRelease.migration.liveTargetVerified,false,'After successor acceptance the previous public release is no longer valid');
   assert.deepEqual(publicRelease,publishedRelease(),'Pre-cutover observation must match the complete immutable pre.1 manifest');
  }else{
   verifyCutoverApproval(publicRelease);
   assert.deepEqual(actual,identity(localRelease),'An approved successor candidate may only observe its exact approved identity or the pinned pre-cutover pre.1');
  }
 }else if(actual.tag===baseline.tag)assert.deepEqual(actual,baseline,'Published baseline identity must match the pinned v0.187 release');
 else{
  verifyCutoverApproval(localRelease);
  verifyCutoverApproval(publicRelease);
  assert.deepEqual(actual,identity(localRelease),'Only this exact approved release may replace the pinned public baseline');
 }
 assert.equal(title,actual.name,'Public release metadata and displayed title must agree');
 if(previous)assert.deepEqual(actual,previous,'Stop rather than combine measurements across public release changes');
 return actual;
}
module.exports={baseline,verifyObservation};
