'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {verifyDeploymentRun}=require('../scripts/helpers/v100-deployment-proof.cjs');
const sourceCommit='a'.repeat(40),workflowCommit='b'.repeat(40),runUrl='https://github.com/Kurohanolu/singularity/actions/runs/12345',expectedWorkflow=fs.readFileSync('deployment/singularity-pages.yml');
async function probe(mode){
 let reads=0;const run={id:12345,repository:{full_name:'Kurohanolu/singularity'},html_url:runUrl,path:'.github/workflows/deploy.yml',event:'workflow_dispatch',head_branch:'main',display_title:'Deploy Singularity '+sourceCommit,status:'completed',conclusion:'success',run_attempt:2,head_sha:workflowCommit};
 const step=name=>({name,status:'completed',conclusion:'success'});
 const jobs=[{name:'build',run_id:12345,run_attempt:2,status:'completed',conclusion:'success',steps:['Validate exact source selection','Require owner adoption and exact source contracts','Require exact-source regression workflows','Generate isolated public artifact and provenance'].map(step)},{name:'deploy',run_id:12345,run_attempt:2,status:'completed',conclusion:'success',steps:[step('Deploy exact generated frontend')]}];
 const artifact={id:9,name:'source-provenance',expired:false,size_in_bytes:1234,workflow_run:{id:12345,head_sha:workflowCommit}};
 if(['valid-push','wrong-request','extra-request','wrong-push-title'].includes(mode)){run.event='push';run.display_title='Deploy Singularity request '+workflowCommit;}
 if(mode==='wrong-push-title')run.display_title='Deploy another request';
 if(mode==='wrong-branch')run.head_branch='other';
 if(mode==='wrong-source')run.display_title='Deploy Singularity '+'c'.repeat(40);
 if(mode==='wrong-repo')run.repository.full_name='Other/repo';
 if(mode==='failed-run')run.conclusion='failure';
 if(mode==='wrong-workflow')run.path='.github/workflows/other.yml';
 if(mode==='skipped-step')jobs[0].steps[2].conclusion='skipped';
 if(mode==='tolerated-step')jobs[0].steps[2].conclusion='failure';
 if(mode==='missing-step')jobs[0].steps.pop();
 if(mode==='old-attempt')jobs[0].run_attempt=1;
 if(mode==='expired-artifact')artifact.expired=true;
 if(mode==='wrong-artifact-run')artifact.workflow_run.id=12346;
 const github={rest:{actions:{
  getWorkflowRun:async args=>{assert.equal(args.repo,'singularity');reads++;return {data:{...run,run_attempt:mode==='attempt-race'&&reads>1?3:run.run_attempt}};},
  listJobsForWorkflowRun:async args=>{assert.equal(args.filter,'latest');return {data:{total_count:2,jobs}};},
  listWorkflowRunArtifacts:async()=>({data:{artifacts:mode==='missing-artifact'?[]:[artifact]}})
 },repos:{getContent:async args=>{assert.equal(args.ref,workflowCommit);if(args.path==='deployment-request.json')return {data:{type:'file',encoding:'base64',content:Buffer.from(JSON.stringify(mode==='extra-request'?{source_sha:sourceCommit,extra:true}:{source_sha:mode==='wrong-request'?'c'.repeat(40):sourceCommit})).toString('base64')}};assert.equal(args.path,'.github/workflows/deploy.yml');return {data:{type:'file',encoding:'base64',content:(mode==='changed-workflow'?Buffer.from('modified'):expectedWorkflow).toString('base64')}};}}}};
 const action=()=>verifyDeploymentRun({github,sourceCommit,runUrl,expectedWorkflow});
 if(['valid','valid-push'].includes(mode)){const r=await action();assert.equal(r.status,'passed');assert.equal(r.runAttempt,2);assert.equal(reads,2);}else await assert.rejects(action);
}
(async()=>{const modes=['valid','valid-push','wrong-request','extra-request','wrong-push-title','wrong-branch','wrong-source','wrong-repo','failed-run','wrong-workflow','skipped-step','tolerated-step','missing-step','old-attempt','expired-artifact','wrong-artifact-run','missing-artifact','attempt-race','changed-workflow'];for(const mode of modes)await probe(mode);assert.match(expectedWorkflow.toString(),/format\('Deploy Singularity request \{0\}', github\.sha\)/);console.log('PASS deployment proof: '+modes.length+' mocked current-attempt/provenance cases; zero real mutations');})().catch(error=>{console.error(error);process.exitCode=1;});
