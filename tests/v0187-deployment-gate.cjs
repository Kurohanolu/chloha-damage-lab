'use strict';
// Exercise the target workflow's real gate with synthetic public CI metadata.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const workflow=fs.readFileSync('deployment/singularity-pages.yml','utf8');
const script=workflow.split('// SOURCE_CI_GATE_BEGIN\n')[1]?.split('// SOURCE_CI_GATE_END')[0];assert.ok(script);
const required=['Showdown differential tests','Showdown differential audit','v0.184 engine baseline','Damage Lab CI and status ledger','UI & damage regression','v0.185 anonymous feedback','v0.186 Accuracy & Mechanics Audit','v0.187 Singularity Migration'];
if(Number(require('../release.json').version.split('.')[0])>0||Number(require('../release.json').version.split('.')[1])>=188)required.push('v0.188 Quality Remediation');
if(['v1.1.0-pre.1','v1.1.0-pre.2','v1.1.0-pre.3','v1.1.0-pre.4','v1.1.0-pre.5','v1.1.0-pre.6','v1.1.0-pre.7','v1.1.0-pre.8','v1.1.0-pre.9'].includes(require('../release.json').tag))required.push('v1.1.0 ES-LA Localization');
if(require('../release.json').tag==='v1.0.0')required.push('v1.0.0 Stable Promotion');
const sha='a'.repeat(40);
async function probe(mode){
 let reads=0;
 let runs=required.map((name,i)=>({id:i+1,name,head_sha:sha,event:'pull_request',status:'completed',conclusion:'success'}));
 if(mode==='missing')runs.pop();
 if(mode==='failed')runs.at(-1).conclusion='failure';
 if(mode==='wrong-head')runs.at(-1).head_sha='b'.repeat(40);
 if(mode==='wrong-event')runs.at(-1).event='workflow_dispatch';
 if(mode==='newer-pending')runs.push({...runs.at(-1),id:99,status:'in_progress',conclusion:null});
 if(mode==='newer-failure')runs.push({...runs.at(-1),id:99,conclusion:'failure'});
 const github={rest:{actions:{listWorkflowRunsForRepo:async args=>{reads++;assert.equal(args.owner,'Kurohanolu');assert.equal(args.repo,'chloha-damage-lab');assert.equal(args.head_sha,sha);return {data:{workflow_runs:runs}};}}}};
 const execute=()=>vm.runInNewContext('(async()=>{'+script+'})()',{require:name=>name==='./release.json'?require('../release.json'):require(name),process:{env:{SOURCE_SHA:mode==='invalid-sha'?'main':sha}},github,core:{info(){}}});
 if(mode==='complete')await execute();else await assert.rejects(execute(),mode==='invalid-sha'?/Full source SHA/:/Source CI not successful/);
 assert.equal(reads,mode==='invalid-sha'?0:1);
}
(async()=>{
 for(const mode of ['complete','missing','failed','wrong-head','wrong-event','newer-pending','newer-failure','invalid-sha'])await probe(mode);
 assert.ok(!/contents:\s*write/.test(workflow),'target workflow never pushes source or stores a deployment credential');
 assert.match(workflow,/persist-credentials: false/);assert.match(workflow,/verifyCutoverApproval/);assert.match(workflow,/path: dist\/deploy\/singularity/);
 console.log('PASS target deployment gate: all exact-source workflows; wrong/stale/missing/failed metadata blocked; public/release checks follow deployment; read-only mocks, no deployment');
})().catch(error=>{console.error(error);process.exitCode=1;});
