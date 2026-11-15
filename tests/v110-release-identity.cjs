'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {releaseIdentity}=require('../scripts/helpers/release-identity.cjs');
const {verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
assert.equal(require('./helpers/v0188-browser-lab.cjs').baselineForRelease({tag:'v1.1.0-pre.1'}),'0b270c1452505268364659edd402209b00b28673','Performance comparison uses the immediate stable release');
const current=require('../release.json'),stable=JSON.parse(execFileSync('git',['show','0b270c1452505268364659edd402209b00b28673:release.json'],{encoding:'utf8'}));
assert.deepEqual(releaseIdentity(current),{stable:false,displayVersion:'v1.1.0 Pre-Release 1',packageVersion:'1.1.0-pre.1'});
assert.deepEqual(releaseIdentity(stable),{stable:true,displayVersion:'v1.0.0',packageVersion:'1.0.0'});
for(const override of [{channel:'stable'},{channel:'unknown'},{version:'1.1'},{preRelease:null},{preRelease:0},{tag:'v1.0.0'},{name:'Singularity v1.1.0'},{notes:'docs/releases/v1.0.0.md'}])assert.throws(()=>releaseIdentity({...current,...override}),'Invalid candidate identity '+JSON.stringify(override));
for(const verify of [verifyCutoverApproval,verifyPublication]){
 assert.throws(()=>verify(current),'Development is not owner approval');
 const stale={...structuredClone(current),migration:structuredClone(stable.migration),qualityReview:structuredClone(stable.qualityReview)};
 assert.throws(()=>verify(stale),'Stable approval must never authorize this candidate');
 stale.qualityReview.releaseTag=current.tag;
 assert.throws(()=>verify(stale),'Renaming an old receipt cannot authorize a new release');
}
const context=vm.createContext({});vm.runInContext(fs.readFileSync('feedback-release-v100.js','utf8'),context);const R=context.ChlohaFeedbackRelease,title=current.name,id=R.identify(title);
assert.equal(id.wireVersion,'v1.1 Pre-Release 1');assert.equal(id.fullVersion,'v1.1.0 Pre-Release 1');assert.equal(id.prefix,'[Singularity release: v1.1.0 Pre-Release 1]\n\n');
assert.equal(R.description(title,'a'.repeat(id.descriptionLimit)).length,R.wireDescriptionLimit);
assert.throws(()=>R.description(title,'a'.repeat(id.descriptionLimit+1)),/tooLong/);assert.throws(()=>R.description(title,' '),/requiredDescription/);
for(const unknown of ['Singularity v1.1.1 Pre-Release 1','Singularity v1.1.0 Pre-Release 2','Singularity v1.1.0','Singularity v1.0.1',title+' extra'])assert.throws(()=>R.identify(unknown),/unsupported_report_version/);
assert.equal(R.identify(stable.name).fullVersion,'v1.0.0');assert.equal(R.identify('Singularity v0.188 Pre-Release 1').compatibility,false);
for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA']){
 const text=R.text(locale,'compatibility',title);assert.ok(text.includes(id.wireVersion)&&text.includes(id.fullVersion));assert.ok(!text.includes('v1.0.0'));
}
console.log('PASS v1.1.0 exact prerelease identity, rejected stale approvals and bounded full-version feedback compatibility');
