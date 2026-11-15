'use strict';
// Read-only GitHub Actions provenance verification. Artifact metadata is not a
// content digest proof; the audited workflow assertions and live byte checks
// independently constrain the selected source and delivered product.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function verifyDeploymentRun({github,sourceCommit,runUrl,expectedWorkflow}){
 assert.match(sourceCommit,/^[a-f0-9]{40}$/);
 const match=/^https:\/\/github\.com\/Kurohanolu\/singularity\/actions\/runs\/([1-9]\d*)$/.exec(runUrl||'');assert.ok(match,'Exact public deployment run URL required');
 const run_id=Number(match[1]);assert.ok(Number.isSafeInteger(run_id));
 const repo={owner:'Kurohanolu',repo:'singularity'};
 const run=(await github.rest.actions.getWorkflowRun({...repo,run_id})).data;
 assert.equal(run.id,run_id);assert.equal(run.repository.full_name,'Kurohanolu/singularity');assert.equal(run.html_url,runUrl);
 assert.equal(run.path,'.github/workflows/deploy.yml');assert.ok(['workflow_dispatch','push'].includes(run.event));
 assert.equal(run.head_branch,'main','Public deployment must run the protected main workflow');
 if(run.event==='workflow_dispatch')assert.equal(run.display_title,'Deploy Singularity '+sourceCommit,'Run identity must derive from the exact source input');
 else {
  assert.equal(run.display_title,'Deploy Singularity request '+run.head_sha);
  const requestFile=(await github.rest.repos.getContent({...repo,path:'deployment-request.json',ref:run.head_sha})).data;
  assert.equal(requestFile.type,'file');assert.equal(requestFile.encoding,'base64');
  const request=JSON.parse(Buffer.from(requestFile.content.replace(/\s/g,''),'base64').toString());
  assert.deepEqual(request,{source_sha:sourceCommit},'Immutable deployment request must name only the accepted exact source');
 }
 assert.equal(run.status,'completed');assert.equal(run.conclusion,'success');assert.ok(Number.isInteger(run.run_attempt)&&run.run_attempt>0);
 assert.match(run.head_sha,/^[a-f0-9]{40}$/);
 const workflow=(await github.rest.repos.getContent({...repo,path:'.github/workflows/deploy.yml',ref:run.head_sha})).data;
 assert.equal(workflow.type,'file');assert.equal(workflow.encoding,'base64');
 assert.equal(hash(Buffer.from(workflow.content.replace(/\s/g,''),'base64')),hash(expectedWorkflow),'Deployed workflow must match the independently reviewed template');
 const jobs=(await github.rest.actions.listJobsForWorkflowRun({...repo,run_id,filter:'latest',per_page:100})).data;
 assert.equal(jobs.total_count,2);assert.equal(jobs.jobs.length,2);
 for(const name of ['build','deploy']){
  const found=jobs.jobs.filter(job=>job.name===name);assert.equal(found.length,1,'Exactly one required deployment job');const job=found[0];
  assert.equal(job.run_id,run_id);if(job.run_attempt!==undefined)assert.equal(job.run_attempt,run.run_attempt);
  assert.equal(job.status,'completed');assert.equal(job.conclusion,'success');
  assert.ok(job.steps?.length);assert.ok(job.steps.every(step=>step.status==='completed'&&step.conclusion==='success'),'No failed, skipped or tolerated deployment step');
  const required=name==='build'?['Validate exact source selection','Require owner adoption and exact source contracts','Require exact-source regression workflows','Generate isolated public artifact and provenance']:['Deploy exact generated frontend'];
  for(const step of required)assert.equal(job.steps.filter(s=>s.name===step).length,1,'Required deployment step is missing');
 }
 const artifacts=(await github.rest.actions.listWorkflowRunArtifacts({...repo,run_id,per_page:100})).data.artifacts.filter(a=>a.name==='source-provenance');
 assert.equal(artifacts.length,1,'Exactly one available source provenance artifact');const artifact=artifacts[0];
 assert.equal(artifact.expired,false);assert.ok(artifact.size_in_bytes>0);assert.equal(artifact.workflow_run.id,run_id);assert.equal(artifact.workflow_run.head_sha,run.head_sha);
 const last=(await github.rest.actions.getWorkflowRun({...repo,run_id})).data;
 assert.equal(last.run_attempt,run.run_attempt,'Deployment attempt changed during verification');assert.equal(last.status,'completed');assert.equal(last.conclusion,'success');
 return {runUrl,runAttempt:run.run_attempt,sourceCommit,workflowCommit:run.head_sha,workflowSha256:hash(expectedWorkflow),provenanceArtifact:artifact.id,status:'passed',productionMutations:0};
}
module.exports={verifyDeploymentRun};
