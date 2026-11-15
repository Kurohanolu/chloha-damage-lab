'use strict';
const assert=require('node:assert/strict');
const {selectBaseline,verifyBoundRuntime}=require('../scripts/v0188-select-pages-baseline.cjs');
const current=require('../scripts/helpers/v0188-followup-review.cjs').publishedRelease(),base='7210be99c39d75b49ea8200aad91d75801eb300a';
const pending=structuredClone(current);pending.migration.liveTargetVerified=false;
assert.deepEqual(selectBaseline(pending,'pull_request',base),{ref:base,mode:'existing-pr-base'});
const approved=structuredClone(current);approved.migration.liveTargetVerified=true;
Object.assign(approved.qualityReview,{auditStatus:'passed',ownerApproval:'approved',evidence:'synthetic lifecycle fixture only',reviewedSourceCommit:'64adc9eea8927fc72dbcb8cc1d5402b4917dff78',reviewedTree:'543fd64c78e775352a858939534419dacdc4180b',auditOutcome:'conditional-pass',conditionsDisposition:'accepted-by-owner'});
assert.deepEqual(selectBaseline(approved,'pull_request',base),{ref:'',mode:'approved-live-candidate'});
assert.ok(verifyBoundRuntime(approved,require('../scripts/helpers/v0188-followup-review.cjs').publishedCommit)>30,'Only metadata/QA may differ from reviewed public runtime');
for(const [key,value] of [['ownerApproval','pending'],['auditStatus','pending'],['reviewedSourceCommit','main'],['reviewedTree',''],['auditOutcome','incomplete'],['conditionsDisposition','pending']]){
 const bad=structuredClone(approved);bad.qualityReview[key]=value;assert.throws(()=>selectBaseline(bad,'pull_request',base),'Claimed live approval cannot fall back to an old passing site: '+key);
}
const wrongTree=structuredClone(approved);wrongTree.qualityReview.reviewedTree='0'.repeat(40);assert.throws(()=>verifyBoundRuntime(wrongTree));
const oldRuntime=structuredClone(approved);oldRuntime.qualityReview.reviewedSourceCommit=base;oldRuntime.qualityReview.reviewedTree='01da22c6302e3a0c539ac2ca9e6a396f871acc1d';assert.throws(()=>verifyBoundRuntime(oldRuntime),'Actual reviewed runtime bytes must match, not just metadata shape');
assert.throws(()=>selectBaseline(approved,'pull_request','main'));
for(const event of ['push','workflow_dispatch'])assert.deepEqual(selectBaseline(current,event,''),{ref:'',mode:'exact-current-source'});
console.log('PASS Pages lifecycle: pre-cutover PR checks base; approved verified live candidate checks exact reviewed runtime; invalid claims fail without fallback; main remains exact-head');
