'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {verifyInline}=require('./helpers/v0188-inline-contract.cjs');
const {verifyPublication,verifyCutoverApproval}=require('../scripts/verify-publication-approval.cjs');
const html=fs.readFileSync('index.html','utf8');
const base=execFileSync('git',['show','7210be99c39d75b49ea8200aad91d75801eb300a:index.html'],{encoding:'utf8',maxBuffer:16*1024*1024});
verifyInline(html,base);
for(const altered of [
 html.replace("if(a.moveMechanic==='expandingForce')","if(a.moveMechanic==='wrongMechanic')"),
 html.replace('models=structuredClone(snapshot.models);','models=structuredClone(snapshot.models);models.att.points.attack=32;'),
 html.replace('window.SingularityPortraitAlt?.update(img,p);','window.SingularityPortraitAlt?.update(img,p);render();'),
 html.replace('function render(){','function render(){window.unauthorizedControlChange=true;')
]){assert.notEqual(altered,html);assert.throws(()=>verifyInline(altered,base),'numeric/control/bridge tampering must fail');}
const current=require('../scripts/helpers/v0188-followup-review.cjs').publishedRelease();
assert.equal(current.tag,'v0.188-pre.1');
const pending=structuredClone(current);Object.assign(pending.qualityReview,{auditStatus:'pending',ownerApproval:'pending',evidence:''});
for(const verify of [verifyCutoverApproval,verifyPublication])assert.throws(()=>verify(pending),/Terra quality audit/,'v0.187 migration approval cannot authorize v0.188');
const approved=structuredClone(current);approved.migration.liveTargetVerified=true;
Object.assign(approved.qualityReview,{auditStatus:'passed',ownerApproval:'approved',evidence:'synthetic approval fixture only'});
assert.doesNotThrow(()=>verifyCutoverApproval(approved));assert.doesNotThrow(()=>verifyPublication(approved));
for(const [key,value] of [['releaseTag','v0.187-pre.33'],['auditor','6.1 Sol'],['auditStatus','pending'],['ownerApproval','pending'],['evidence','']]){
 const rejected=structuredClone(approved);rejected.qualityReview[key]=value;
 assert.throws(()=>verifyCutoverApproval(rejected),key+' must be required before target deployment');
 assert.throws(()=>verifyPublication(rejected),key+' must be required before release publication');
}
const inherited=structuredClone(approved);delete inherited.qualityReview;assert.throws(()=>verifyPublication(inherited));
for(const key of ['migration','version']){
 const missing=structuredClone(approved);delete missing[key];
 assert.throws(()=>verifyCutoverApproval(missing),'Missing '+key+' must never bypass the quality gate');
 assert.throws(()=>verifyPublication(missing));
}
for(const version of ['0.1000','1.0']){
 const later=structuredClone(pending);later.version=version;
 assert.throws(()=>verifyPublication(later),'Later versions must still require independent review');
}
const legacy=JSON.parse(execFileSync('git',['show','7210be99c39d75b49ea8200aad91d75801eb300a:release.json'],{encoding:'utf8'}));
assert.doesNotThrow(()=>verifyPublication(legacy),'historical approved release stays valid');
console.log('PASS v0.188 exact UI-only patch contract, tamper negatives, and separate Terra/owner publication approval gate; no mutations');
