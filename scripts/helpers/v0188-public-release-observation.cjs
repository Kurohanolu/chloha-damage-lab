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
const pre6Commit='2fb5655a89e076df5993a3294bddbe1bf31afa58',pre6Tree='002d2af5716f408f50d50b8390d66a73ba083be3';
function pre6Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre6Commit+'^{tree}']),pre6Tree,'Published pre.6 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre6Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.6');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre7Commit='66a085ba325655bc9369656ea0645f7f6f997127',pre7Tree='531c22a3fd647f674a287808a7a63b74010ccb58';
function pre7Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre7Commit+'^{tree}']),pre7Tree,'Published pre.7 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre7Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.7');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre8Commit='0b1f8fffea3b1d063036d00fd712b0a0e9695111',pre8Tree='701fbae7b142ba2ac5e5e23f1755a84f39d82b6c';
function pre8Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre8Commit+'^{tree}']),pre8Tree,'Published pre.8 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre8Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.8');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre18Commit='c52a65f4487fa8b4ceb2cd1ac5d85a2334697854',pre18Tree='beacee500cd7cd651bd312645d31417f1b47940f';
function pre18Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre18Commit+'^{tree}']),pre18Tree,'Published pre.18 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre18Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.18');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre17Commit='6360fa3a243c234993e032a415540b2c4691afeb',pre17Tree='bfb5619c528b396877f7c9e5a1f77aec664f106b';
function pre17Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre17Commit+'^{tree}']),pre17Tree,'Published pre.17 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre17Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.17');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre16Commit='a68b987d25d392076f36413e7f626ea3b71391c2',pre16Tree='c8292fafb8b927985d88ae7865ea8d755efdca76';
function pre16Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre16Commit+'^{tree}']),pre16Tree,'Published pre.16 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre16Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.16');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre15Commit='66cae82e10d28ad6115acdacc964fd3e84f51b4a',pre15Tree='85c51a15b93f5da3bc81e0183ca1a3742a79966e';
function pre15Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre15Commit+'^{tree}']),pre15Tree,'Published pre.15 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre15Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.15');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre14Commit='cace126d0244f2d748b3c162a3e7cb5f9441932d',pre14Tree='7f4a6078575346b36f74ab6bcea941dc629e81ec';
function pre14Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre14Commit+'^{tree}']),pre14Tree,'Published pre.14 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre14Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.14');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre12Commit='828e906a3c460a4c55e3f8e79bcd973ead0dc93b',pre12Tree='1921d6331b877830a5065f16f849925486f7b8c7';
function pre12Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre12Commit+'^{tree}']),pre12Tree,'Published pre.12 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre12Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.12');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre11Commit='fbec6fd45b841c3465be903b25a14e909cc80ba5',pre11Tree='a38f294cddaf10c15e8cea147e57a7b6d6148142';
function pre11Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre11Commit+'^{tree}']),pre11Tree,'Published pre.11 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre11Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.11');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
const pre9Commit='46f930797e662be0d01e974f98ddde6de7b414c0',pre9Tree='1ea3163c8a8f4de8d68951b28c061a855461468c';
function pre9Manifest(){
 const git=args=>require('node:child_process').execFileSync('git',args,{cwd:require('node:path').resolve(__dirname,'../..'),encoding:'utf8'}).trim();
 assert.equal(git(['rev-parse',pre9Commit+'^{tree}']),pre9Tree,'Published pre.9 commit/tree must remain pinned');
 const release=JSON.parse(git(['show',pre9Commit+':release.json']));
 assert.equal(release.tag,'v1.1.0-pre.9');assert.equal(release.migration.liveTargetVerified,true);
 return release;
}
function identity(release){return Object.fromEntries(fields.map(key=>[key,release?.[key]]));}
function verifyObservation(localRelease,publicRelease,title,previous=null){
 const actual=identity(publicRelease);
 if(localRelease.tag==='v1.1.0-pre.19'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.19 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre18Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.19 development must observe the complete pinned published pre.18 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.19 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.18 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.19 may observe only its own identity or the pinned pre-cutover pre.18');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.18'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.17 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre17Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.17 development must observe the complete pinned published pre.17 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.18 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.17 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.18 may observe only its own identity or the pinned pre-cutover pre.17');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.17'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.17 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre16Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.17 development must observe the complete pinned published pre.16 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.17 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.16 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.17 may observe only its own identity or the pinned pre-cutover pre.16');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.16'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.16 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre15Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.16 development must observe the complete pinned published pre.15 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.16 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.15 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.16 may observe only its own identity or the pinned pre-cutover pre.15');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.15'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.15 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre14Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.15 development must observe the complete pinned published pre.14 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.15 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.14 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.15 may observe only its own identity or the pinned pre-cutover pre.14');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.14'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.14 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre12Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.14 development must observe the complete pinned published pre.12 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.14 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.12 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.14 may observe only its own identity or the pinned pre-cutover pre.12');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.12'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.12 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre11Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.12 development must observe the complete pinned published pre.11 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.12 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.11 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.12 may observe only its own identity or the pinned pre-cutover pre.11');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.11'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.11 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre9Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.11 development must observe the complete pinned published pre.9 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.11 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.9 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.11 may observe only its own identity or the pinned pre-cutover pre.9');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.9'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.9 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre8Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.9 development must observe the complete pinned published pre.8 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.9 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.8 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.9 may observe only its own identity or the pinned pre-cutover pre.8');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.8'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.8 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre7Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.8 development must observe the complete pinned published pre.7 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.8 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.7 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.8 may observe only its own identity or the pinned pre-cutover pre.7');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.7'){
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'),'Pre.7 must use its own release decision, not a historical follow-up marker');
  const predecessor=pre6Manifest();
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration?.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Pre.7 development must observe the complete pinned published pre.6 manifest');
  }else{
   verifyCutoverApproval(localRelease);
   if(actual.tag===predecessor.tag){
    assert.equal(localRelease.migration.liveTargetVerified,false,'After pre.7 acceptance the previous public release is no longer valid');
    assert.deepEqual(publicRelease,predecessor,'Pre-cutover observation must match the complete immutable pre.6 manifest');
   }else{
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease),'Approved pre.7 may observe only its own identity or the pinned pre-cutover pre.6');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.6'&&localRelease.migration?.legacyPolicy==='community-pinned-v1'){
  const base=require('./v110-community-public-base.cjs'),predecessor=base.manifest();
  assert.ok(!Object.prototype.hasOwnProperty.call(localRelease,'followupAudit'));
  if(localRelease.qualityReview?.ownerApproval==='pending'){
   assert.equal(localRelease.migration.liveTargetVerified,false);
   assert.deepEqual(publicRelease,predecessor,'Community-policy revision observes the complete already-live pre.6, never an inferred same-version substitute');
  }else{
   verifyCutoverApproval(localRelease);
   if(!localRelease.migration.liveTargetVerified&&require('node:util').isDeepStrictEqual(publicRelease,predecessor)){
    assert.deepEqual(publicRelease,predecessor);
   }else{
    assert.equal(publicRelease.migration?.legacyPolicy,base.policy,'After new acceptance the old policy is not a valid current observation');
    verifyCutoverApproval(publicRelease);
    assert.deepEqual(actual,identity(localRelease));
    assert.deepEqual(publicRelease.qualityReview,localRelease.qualityReview,'Same reviewed revision is required, not only the same version');
   }
  }
 }else if(localRelease.tag==='v1.1.0-pre.6'){
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
