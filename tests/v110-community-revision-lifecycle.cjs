'use strict';
// Preserve the exact published pre.6 lifecycle test in its immutable source tree.
// It verifies real approved bytes there; current pre.7 has a separate lifecycle gate.
if(require('../release.json').tag!=='v1.1.0-pre.6'){
 const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='2fb5655a89e076df5993a3294bddbe1bf31afa58',tree='002d2af5716f408f50d50b8390d66a73ba083be3';
 assert.equal(execFileSync('git',['rev-parse',ref+'^{tree}'],{encoding:'utf8'}).trim(),tree);
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre6-history-')),worktree=path.join(parent,'source');
 let status=1;
 try{
  execFileSync('git',['worktree','add','--detach',worktree,ref],{stdio:'pipe'});
  const result=spawnSync(process.execPath,['tests/v110-community-revision-lifecycle.cjs'],{cwd:worktree,stdio:'inherit'});
  assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Unmodified published pre.6 lifecycle must pass');
  assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');
  fs.mkdirSync('reports/v110',{recursive:true});
  const report=JSON.parse(fs.readFileSync(path.join(worktree,'reports/v110/community-revision-lifecycle.json'),'utf8'));
  fs.writeFileSync('reports/v110/community-revision-lifecycle.json',JSON.stringify({...report,role:'historical immutable pre.6, not current candidate acceptance',sourceCommit:ref,sourceTree:tree},null,2)+'\n');
  status=0;
 }finally{
  try{execFileSync('git',['worktree','remove','--force',worktree],{stdio:'pipe'});}finally{fs.rmSync(parent,{recursive:true,force:true});}
 }
 process.exit(status);
}
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=require('../scripts/helpers/v110-community-public-base.cjs'),{verifyObservation}=require('../scripts/helpers/v0188-public-release-observation.cjs'),{selectBaseline}=require('../scripts/v0188-select-pages-baseline.cjs'),{verifyCutoverApproval,verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const current=structuredClone(require('../release.json')),prior=base.manifest();assert.equal(current.tag,'v1.1.0-pre.6');assert.equal(current.migration.legacyPolicy,base.policy);assert.equal(base.commit,'a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9');assert.equal(base.tree,'604f0632eaf2d28e2fbd40012d68133050f72f30');
const draft=structuredClone(current);draft.migration.status='awaiting-owner-approval';draft.migration.liveTargetVerified=false;for(const k of Object.keys(draft.migration))if(k.startsWith('liveAcceptance'))delete draft.migration[k];draft.qualityReview={releaseTag:draft.tag,auditor:'6.1 Sol',auditStatus:'pending',ownerApproval:'pending',evidence:'',auditOutcome:'pending',conditionsDisposition:'pending',reviewedSourceCommit:null,reviewedTree:null,auditReportSha256:null,ownerEvidence:'',ownerRecordedAtJST:null};
for(const event of ['push','pull_request','workflow_dispatch']){assert.deepEqual(selectBaseline(draft,event,base.commit),{ref:base.commit,mode:'accepted-web-v110-pre6-community-revision-base'});for(const ref of ['main','0'.repeat(40),'82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74'])assert.throws(()=>selectBaseline(draft,event,ref));const unapproved=structuredClone(draft);unapproved.migration.liveTargetVerified=true;assert.throws(()=>selectBaseline(unapproved,event,base.commit));}
const observation=verifyObservation(draft,prior,prior.name);assert.deepEqual(verifyObservation(draft,prior,prior.name,observation),observation);assert.throws(()=>verifyObservation(draft,draft,draft.name));
for(const mutate of [r=>r.migration.liveTargetVerified=false,r=>r.notes='docs/other.md',r=>r.extra='same-version-is-not-exact',r=>r.qualityReview.auditStatus='pending']){const invalid=structuredClone(prior);mutate(invalid);assert.throws(()=>verifyObservation(draft,invalid,prior.name),'Entire predecessor manifest must match');}
for(const verify of [verifyCutoverApproval,verifyPublication]){assert.throws(()=>verify(draft),'Pending revision cannot publish');const reused=structuredClone(draft);reused.qualityReview=structuredClone(prior.qualityReview);reused.migration.status='approved';assert.throws(()=>verify(reused),'Prior same-version review cannot authorize new protected bytes/policy');}
if(current.qualityReview.ownerApproval==='pending')assert.deepEqual(current,draft);else{verifyCutoverApproval(current);if(current.migration.liveTargetVerified){verifyPublication(current);assert.throws(()=>verifyObservation(current,prior,prior.name),'Accepted new policy cannot fall back to old proof');}else assert.deepEqual(selectBaseline(current,'push',''),{ref:base.commit,mode:'accepted-web-v110-pre6-community-revision-base'});}
assert.ok(fs.readFileSync('scripts/v0188-final-memory.cjs','utf8').includes('startLab({compare:true,comparisonRef:BASELINE})'),'Controlled memory must actually serve its explicitly pinned baseline');
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/community-revision-lifecycle.json',JSON.stringify({passed:true,priorAcceptedWebCommit:base.commit,priorAcceptedWebTree:base.tree,priorGitHubReleaseNotAsserted:true,priorApprovalNotReused:true,newIndependentReviewRequired:true,liveProofReset:true},null,2)+'\n');console.log('PASS Community policy revision: exact already-live predecessor, fresh approval and live proof, no same-version approval reuse');
