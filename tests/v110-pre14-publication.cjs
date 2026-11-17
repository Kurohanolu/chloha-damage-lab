'use strict';
// fail-closed pre.14 successor lifecycle; pre.11 runs historically.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {verifyCutoverApproval,verifyQualityApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const {verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs');
const {selectBaseline}=require('../scripts/v0188-select-pages-baseline.cjs');
const predecessor='fbec6fd45b841c3465be903b25a14e909cc80ba5';
const predecessorTree='a38f294cddaf10c15e8cea147e57a7b6d6148142';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
assert.equal(git('rev-parse',predecessor+'^{tree}'),predecessorTree);
const pre11=JSON.parse(git('show',predecessor+':release.json'));
assert.equal(pre11.tag,'v1.1.0-pre.11');assert.equal(pre11.migration.liveTargetVerified,true);
const current=structuredClone(require('../release.json'));
assert.equal(current.tag,'v1.1.0-pre.14');assert.equal(current.preRelease,14);
assert.equal(current.name,'Singularity v1.1.0 Pre-Release 14');
assert.equal(current.notes,'docs/releases/v1.1.0-pre.14.md');
assert.equal(current.migration.legacyPolicy,'community-pinned-v1');
assert.ok(!Object.hasOwn(current,'followupAudit'));
const draft=structuredClone(current);
draft.migration.status='awaiting-owner-approval';draft.migration.liveTargetVerified=false;
for(const key of Object.keys(draft.migration))if(key.startsWith('liveAcceptance'))delete draft.migration[key];
draft.qualityReview={releaseTag:draft.tag,auditor:'6 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
for(const event of ['push','workflow_dispatch','pull_request']){
 const expected={ref:predecessor,mode:'published-v110-pre14-base'};
 assert.deepEqual(selectBaseline(draft,event,predecessor),expected,'Only the immediate published predecessor may be observed');
 if(event!=='pull_request')assert.deepEqual(selectBaseline(draft,event,''),expected);
 for(const ref of ['main','0'.repeat(40),'46f930797e662be0d01e974f98ddde6de7b414c0'])assert.throws(()=>selectBaseline(draft,event,ref));
}
assert.throws(()=>selectBaseline(draft,'unknown',predecessor));
const observation=verifyObservation(draft,pre11,pre11.name);
assert.deepEqual(verifyObservation(draft,pre11,pre11.name,observation),observation);
assert.throws(()=>verifyObservation(draft,draft,draft.name));
assert.throws(()=>verifyObservation(draft,pre11,draft.name));
for(const mutate of [r=>{r.notes='docs/other.md';},r=>{r.migration.liveTargetVerified=false;},r=>{r.qualityReview.auditStatus='pending';},r=>{r.extra='unreviewed';}]){
 const changed=structuredClone(pre11);mutate(changed);
 assert.throws(()=>verifyObservation(draft,changed,changed.name),'Complete predecessor manifest is immutable');
}
for(const verify of [verifyQualityApproval,verifyCutoverApproval,verifyPublication]){
 assert.throws(()=>verify(draft),'Pending pre.14 cannot publish');
 const stale=structuredClone(draft);stale.qualityReview=structuredClone(pre11.qualityReview);
 stale.qualityReview.releaseTag=draft.tag;assert.throws(()=>verify(stale),'Retagged pre.11 approval cannot authorize pre.14');
}
for(const marker of [null,false,{},'approved']){
 const invalid={...structuredClone(draft),followupAudit:marker};
 assert.throws(()=>verifyObservation(invalid,pre11,pre11.name));
 assert.throws(()=>selectBaseline(invalid,'push',''));
 assert.throws(()=>verifyCutoverApproval(invalid));
}
if(current.qualityReview.ownerApproval==='pending')assert.deepEqual(current,draft,'New pre.14 candidate must start with cleared approval/live state');
else{
 verifyCutoverApproval(current);
 if(current.migration.liveTargetVerified){verifyPublication(current);assert.throws(()=>verifyObservation(current,pre11,pre11.name));}
 else assert.deepEqual(selectBaseline(current,'push',''),{ref:predecessor,mode:'published-v110-pre14-base'});
}
const report={passed:true,tag:current.tag,predecessor,predecessorTree,oldReceiptsRejected:true};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pre14-publication.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS pre.14 independent publication lifecycle '+JSON.stringify(report));
