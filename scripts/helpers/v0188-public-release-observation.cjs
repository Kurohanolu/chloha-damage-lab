'use strict';
const assert=require('node:assert/strict');
const {verifyCutoverApproval}=require('../verify-publication-approval.cjs');
const baseline={version:'0.187',preRelease:33,tag:'v0.187-pre.33',name:'Singularity v0.187 Pre-Release 33',product:'Singularity',developer:'Chloha Labs',publicUrl:'https://kurohanolu.github.io/singularity/'};
const fields=Object.keys(baseline);
function identity(release){return Object.fromEntries(fields.map(key=>[key,release?.[key]]));}
function verifyObservation(localRelease,publicRelease,title,previous=null){
 const actual=identity(publicRelease);
 if(actual.tag===baseline.tag)assert.deepEqual(actual,baseline,'Published baseline identity must match the pinned v0.187 release');
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
