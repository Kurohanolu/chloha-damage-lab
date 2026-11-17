'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {releaseIdentity}=require('../scripts/helpers/release-identity.cjs');
const {verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {baselineForRelease}=require('./helpers/v0188-browser-lab.cjs');
const stableCommit='0b270c1452505268364659edd402209b00b28673',pre1Commit='83af29133927a19fc7e0f9273c0e194c54384ae5',pre2Commit='aba2d0558948e2a4dd375074fb11fd428edf6222';
const historical=commit=>JSON.parse(execFileSync('git',['show',commit+':release.json'],{encoding:'utf8'}));
const pre3Commit='082ab180bc8835304d959f583d4968e0565bdea3',pre3=historical(pre3Commit);
const pre4Commit='61d87e82995bc60d4564aaf57a52dfc1fd859e4c',pre4=historical(pre4Commit);
const pre5Commit='82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74',pre5=historical(pre5Commit);
const pre6Commit='2fb5655a89e076df5993a3294bddbe1bf31afa58',pre6=historical(pre6Commit);
const pre7Commit='66a085ba325655bc9369656ea0645f7f6f997127',pre7=historical(pre7Commit);
const pre8Commit='0b1f8fffea3b1d063036d00fd712b0a0e9695111',pre8=historical(pre8Commit);
const stable=historical(stableCommit),pre1=historical(pre1Commit),pre2=historical(pre2Commit);
assert.equal(baselineForRelease({tag:'v1.1.0-pre.1'}),stableCommit,'Original pre.1 performance baseline remains Stable');
assert.equal(baselineForRelease({tag:'v1.1.0-pre.2'}),pre1Commit,'Pre.2 compares against the immutable published predecessor');
assert.equal(baselineForRelease({tag:'v1.1.0-pre.3'}),pre2Commit,'Pre.3 compares against immutable public pre.2');
assert.equal(baselineForRelease({tag:'v1.1.0-pre.4'}),pre3Commit,'Pre.4 compares against immutable public pre.3');
function pending(manifest){
 const result=structuredClone(manifest);delete result.followupAudit;
 result.migration.status='awaiting-owner-approval';result.migration.liveTargetVerified=false;
 for(const key of Object.keys(result.migration))if(key.startsWith('liveAcceptance'))delete result.migration[key];
 result.qualityReview={releaseTag:result.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
 return result;
}
assert.equal(baselineForRelease({tag:'v1.1.0-pre.5'}),pre4Commit,'Pre.5 compares against immutable public pre.4');
assert.equal(baselineForRelease({tag:'v1.1.0-pre.6'}),pre5Commit,'Pre.6 compares against immutable public pre.5');
assert.equal(baselineForRelease({tag:'v1.1.0-pre.7'}),pre6Commit,'Pre.7 compares against immutable public pre.6');
assert.equal(baselineForRelease({tag:'v1.1.0-pre.8'}),pre7Commit,'Pre.8 compares against immutable public pre.7');
assert.equal(baselineForRelease({tag:'v1.1.0-pre.9'}),pre8Commit,'Pre.9 compares against immutable public pre.8');
const pre9Commit='46f930797e662be0d01e974f98ddde6de7b414c0',pre9=historical(pre9Commit);
assert.equal(baselineForRelease({tag:'v1.1.0-pre.11'}),pre9Commit);
const current=pending(require('../release.json'));
assert.equal(current.tag,'v1.1.0-pre.11');assert.equal(current.preRelease,11);
// Historical and current candidates retain separate, exact public baselines.
for(const [candidate,publicBase,number]of [[pending(pre1),stable,1],[pending(pre2),pre1,2],[pending(pre3),pre2,3],[pending(pre4),pre3,4],[pending(pre5),pre4,5],[pending(require('../scripts/helpers/v110-community-public-base.cjs').manifest()),pre5,6],[pending(pre7),pre6,7],[pending(pre8),pre7,8],[pending(pre9),pre8,9],[current,pre9,11]]){
 const observed=verifyObservation(candidate,publicBase,publicBase.name);
 assert.deepEqual(verifyObservation(candidate,publicBase,publicBase.name,observed),observed,'Repeated observations cannot change release baseline');
 for(const altered of [{...publicBase,notes:'docs/tampered.md'},{...publicBase,tag:candidate.tag},candidate])assert.throws(()=>verifyObservation(candidate,altered,altered.name),'Changed or unpublished metadata is not a public baseline');
 for(const altered of [{...candidate,migration:{...candidate.migration,liveTargetVerified:true}},{...candidate,qualityReview:{...candidate.qualityReview,ownerApproval:'approved'}}])assert.throws(()=>verifyObservation(altered,publicBase,publicBase.name),'Pending evidence cannot silently become a cutover approval');
 assert.throws(()=>verifyObservation(candidate,publicBase,candidate.name));
 assert.throws(()=>verifyObservation(candidate,publicBase,publicBase.name,{...observed,tag:candidate.tag}));
 assert.deepEqual(releaseIdentity(candidate),{stable:false,displayVersion:'v1.1.0 Pre-Release '+number,packageVersion:'1.1.0-pre.'+number});
 for(const override of [{channel:'stable'},{channel:'unknown'},{version:'1.1'},{preRelease:null},{preRelease:0},{tag:'v1.0.0'},{name:'Singularity v1.1.0'},{notes:'docs/releases/v1.0.0.md'}])assert.throws(()=>releaseIdentity({...candidate,...override}),'Invalid exact prerelease identity');
 for(const verify of [verifyCutoverApproval,verifyPublication]){
  assert.throws(()=>verify(candidate),'Pending review never grants publication approval');
  for(const earlier of [stable,pre1,pre2,pre3]){
   const stale={...structuredClone(candidate),migration:structuredClone(earlier.migration),qualityReview:structuredClone(earlier.qualityReview)};
   assert.throws(()=>verify(stale),'An earlier release approval cannot authorize this candidate');
   stale.qualityReview.releaseTag=candidate.tag;
   assert.throws(()=>verify(stale),'Renaming an earlier receipt cannot authorize a new release');
  }
 }
}
assert.deepEqual(releaseIdentity(stable),{stable:true,displayVersion:'v1.0.0',packageVersion:'1.0.0'});
const context=vm.createContext({});vm.runInContext(fs.readFileSync('feedback-release-v100.js','utf8'),context);const R=context.ChlohaFeedbackRelease;
for(const [title,number]of [[pre1.name,1],[pre2.name,2],[pre3.name,3],[pre4.name,4],[pre5.name,5],[pre6.name,6],[pre7.name,7],[pre8.name,8],[pre9.name,9],[current.name,11]]){
 const id=R.identify(title);
 assert.equal(id.wireVersion,'v1.1 Pre-Release '+number);assert.equal(id.fullVersion,'v1.1.0 Pre-Release '+number);assert.equal(id.prefix,'[Singularity release: v1.1.0 Pre-Release '+number+']\n\n');
 assert.equal(R.description(title,'a'.repeat(id.descriptionLimit)).length,R.wireDescriptionLimit);
 assert.throws(()=>R.description(title,'a'.repeat(id.descriptionLimit+1)),/tooLong/);assert.throws(()=>R.description(title,' '),/requiredDescription/);
 for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA']){
  const text=R.text(locale,'compatibility',title);assert.ok(text.includes(id.wireVersion)&&text.includes(id.fullVersion));assert.ok(!text.includes('v1.0.0'));
 }
}
for(const unknown of ['Singularity v1.1.1 Pre-Release 1','Singularity v1.1.0 Pre-Release 12','Singularity v1.1.0','Singularity v1.0.1',current.name+' extra'])assert.throws(()=>R.identify(unknown),/unsupported_report_version/);
assert.equal(R.identify(stable.name).fullVersion,'v1.0.0');assert.equal(R.identify('Singularity v0.188 Pre-Release 1').compatibility,false);
console.log('PASS v1.1.0 pre.1/pre.2/pre.3/pre.4/pre.5/pre.6/pre.7/pre.8/pre.9/pre.11 exact identities, immutable public baselines, stale-approval rejection and bounded feedback compatibility');
