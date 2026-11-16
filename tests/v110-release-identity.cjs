'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {releaseIdentity}=require('../scripts/helpers/release-identity.cjs');
const {verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {baselineForRelease}=require('./helpers/v0188-browser-lab.cjs');
const stableCommit='0b270c1452505268364659edd402209b00b28673',pre1Commit='83af29133927a19fc7e0f9273c0e194c54384ae5';
const historical=commit=>JSON.parse(execFileSync('git',['show',commit+':release.json'],{encoding:'utf8'}));
const stable=historical(stableCommit),pre1=historical(pre1Commit);
assert.equal(baselineForRelease({tag:'v1.1.0-pre.1'}),stableCommit,'Original pre.1 performance baseline remains Stable');
assert.equal(baselineForRelease({tag:'v1.1.0-pre.2'}),pre1Commit,'Pre.2 compares against the immutable published predecessor');
function pending(manifest){
 const result=structuredClone(manifest);delete result.followupAudit;
 result.migration.status='awaiting-owner-approval';result.migration.liveTargetVerified=false;
 for(const key of Object.keys(result.migration))if(key.startsWith('liveAcceptance'))delete result.migration[key];
 result.qualityReview={releaseTag:result.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
 return result;
}
const current=pending(require('../release.json'));
assert.equal(current.tag,'v1.1.0-pre.2');assert.equal(current.preRelease,2);
// Historical and current candidates retain separate, exact public baselines.
for(const [candidate,publicBase,number]of [[pending(pre1),stable,1],[current,pre1,2]]){
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
  for(const earlier of [stable,pre1]){
   const stale={...structuredClone(candidate),migration:structuredClone(earlier.migration),qualityReview:structuredClone(earlier.qualityReview)};
   assert.throws(()=>verify(stale),'An earlier release approval cannot authorize this candidate');
   stale.qualityReview.releaseTag=candidate.tag;
   assert.throws(()=>verify(stale),'Renaming an earlier receipt cannot authorize a new release');
  }
 }
}
assert.deepEqual(releaseIdentity(stable),{stable:true,displayVersion:'v1.0.0',packageVersion:'1.0.0'});
const context=vm.createContext({});vm.runInContext(fs.readFileSync('feedback-release-v100.js','utf8'),context);const R=context.ChlohaFeedbackRelease;
for(const [title,number]of [[pre1.name,1],[current.name,2]]){
 const id=R.identify(title);
 assert.equal(id.wireVersion,'v1.1 Pre-Release '+number);assert.equal(id.fullVersion,'v1.1.0 Pre-Release '+number);assert.equal(id.prefix,'[Singularity release: v1.1.0 Pre-Release '+number+']\n\n');
 assert.equal(R.description(title,'a'.repeat(id.descriptionLimit)).length,R.wireDescriptionLimit);
 assert.throws(()=>R.description(title,'a'.repeat(id.descriptionLimit+1)),/tooLong/);assert.throws(()=>R.description(title,' '),/requiredDescription/);
 for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA']){
  const text=R.text(locale,'compatibility',title);assert.ok(text.includes(id.wireVersion)&&text.includes(id.fullVersion));assert.ok(!text.includes('v1.0.0'));
 }
}
for(const unknown of ['Singularity v1.1.1 Pre-Release 1','Singularity v1.1.0 Pre-Release 3','Singularity v1.1.0','Singularity v1.0.1',current.name+' extra'])assert.throws(()=>R.identify(unknown),/unsupported_report_version/);
assert.equal(R.identify(stable.name).fullVersion,'v1.0.0');assert.equal(R.identify('Singularity v0.188 Pre-Release 1').compatibility,false);
console.log('PASS v1.1.0 pre.1/pre.2 exact identities, immutable public baselines, stale-approval rejection and bounded feedback compatibility');
