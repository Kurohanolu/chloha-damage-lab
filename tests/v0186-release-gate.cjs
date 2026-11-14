'use strict';
// Exercise the real publisher script using mocked GitHub calls. No network,
// release, tag or asset mutations are permitted by this test.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const workflow=fs.readFileSync(root+'/.github/workflows/publish-release.yml','utf8');
const script=workflow.split('          script: |\n')[1];assert.ok(script);
const legacy=['Showdown differential tests','Showdown differential audit','v0.184 engine baseline','Damage Lab CI and status ledger','UI & damage regression','GitHub Pages live smoke','v0.185 anonymous feedback'];
async function probe(mode){
 let publicationBoundary=0,mutations=0;
 const head='audit-only-head';
 const runs=[...legacy,...(mode==='missing'?[]:['v0.186 Accuracy & Mechanics Audit'])].map((name,i)=>({id:i+1,name,head_sha:head,status:'completed',conclusion:name==='v0.186 Accuracy & Mechanics Audit'&&mode==='failed'?'failure':'success',html_url:'https://example.invalid/run/'+i}));
 const rejectMutation=async()=>{mutations++;throw Error('Forbidden publication mutation');};
 const github={rest:{actions:{listWorkflowRunsForRepo:async()=>({data:{workflow_runs:runs}})},repos:{getReleaseByTag:async()=>{publicationBoundary++;throw Error('AUDIT_GATE_PASSED');},createRelease:rejectMutation,uploadReleaseAsset:rejectMutation,listReleaseAssets:rejectMutation}}};
 const sandbox={require:name=>name==='fs'?{existsSync:file=>fs.existsSync(path.join(root,file)),readFileSync:(file,encoding)=>fs.readFileSync(path.join(root,file),encoding)}:require(name),github,context:{sha:head,repo:{owner:'audit',repo:'mock'}},core:{info(){},notice(){}},setTimeout:fn=>fn(),Buffer};
 let error;
 try{await vm.runInNewContext('(async()=>{\n'+script+'\n})()',sandbox);}catch(e){error=e;}
 assert.equal(mutations,0,'publication must never mutate in this test');
 assert.ok(error,'probe must stop at a deliberate boundary');
 if(mode==='complete'){assert.equal(publicationBoundary,1);assert.equal(error.message,'AUDIT_GATE_PASSED');}
 else {assert.equal(publicationBoundary,0,'missing/failed v0.186 CI must stop before release APIs');assert.match(error.message,mode==='failed'?/v0\.186 Accuracy & Mechanics Audit: failure/:/Exact-commit CI did not complete successfully/);}
}
(async()=>{for(const mode of ['missing','failed','complete'])await probe(mode);console.log('PASS v0.186 release gate: missing/failed audit CI blocked; complete exact-head CI reaches the publication boundary; zero mutations');})().catch(e=>{console.error(e);process.exitCode=1;});
