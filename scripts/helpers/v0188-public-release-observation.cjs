'use strict';
const assert=require('node:assert/strict');
const {verifyCutoverApproval,verifyQualityApproval}=require('../verify-publication-approval.cjs');
const {hasFollowup,verifyFollowupDraft,publishedRelease}=require('./v0188-followup-review.cjs');
const baseline={version:'0.187',preRelease:33,tag:'v0.187-pre.33',name:'Singularity v0.187 Pre-Release 33',product:'Singularity',developer:'Chloha Labs',publicUrl:'https://kurohanolu.github.io/singularity/'};
const fields=Object.keys(baseline);
const stableCommit='0b270c1452505268364659edd402209b00b28673';
function stableManifest(){return JSON.parse(require('node:child_process').execFileSync('git',['show',stableCommit+':release.json'],{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}));}
function identity(release){return Object.fromEntries(fields.map(key=>[key,release?.[key]]));}
function verifyObservation(localRelease,publicRelease,title,previous=null){
 const actual=identity(publicRelease);
 if(localRelease.tag==='v1.1.0-pre.1'&&localRelease.qualityReview?.ownerApproval==='pending'){
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
