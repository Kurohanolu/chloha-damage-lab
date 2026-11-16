'use strict';
// Collect all independent corrections in one run; any failure still fails CI.
const fs=require('node:fs'),path=require('node:path'),{spawnSync,execFileSync}=require('node:child_process');
const historicalTests=new Set(['v0188-approved-release-binding.cjs','v0188-astra-followup-gates.cjs','v0188-astra-runtime-contract.cjs','v0188-contract-and-approval.cjs','v0188-pre2-actual-approval.cjs','v0188-pre2-release-gate.cjs']);
const v110=fs.existsSync('release.json')&&JSON.parse(fs.readFileSync('release.json')).tag?.startsWith('v1.1.0');
const tests=fs.readdirSync('tests').filter(name=>/^v0188-.*\.cjs$/.test(name)).sort().map(name=>({file:'tests/'+name,role:v110&&historicalTests.has(name)?'historical immutable v1.0.0':'candidate',command:process.execPath,args:v110&&historicalTests.has(name)?['scripts/v110-historical-contracts.cjs','--suite','v188-byte-and-approval','--test','tests/'+name]:['tests/'+name]}));
tests.push({command:'python3',args:['tests/v0188-asset-audit-test.py']});
if(tests.length<2)throw Error('v0.188 correction tests must exist');
const out='reports/v0188/test-run.json';fs.mkdirSync(path.dirname(out),{recursive:true});
const report={schemaVersion:1,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),startedAt:new Date().toISOString(),productionMutations:0,tests:tests.map(test=>({file:test.file||test.args[0],role:test.role||'candidate',status:'queued'}))};
const save=()=>fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');save();
for(let i=0;i<tests.length;i++){
 const test=tests[i],record=report.tests[i],started=Date.now();record.status='running';save();
 const result=spawnSync(test.command,test.args,{stdio:'inherit'});
 Object.assign(record,{status:result.status===0&&!result.error?'passed':'failed',exitCode:result.status,signal:result.signal,durationMs:Date.now()-started});
 if(result.error)record.error=result.error.message;
 save();
}
report.completedAt=new Date().toISOString();report.failed=report.tests.filter(test=>test.status!=='passed').length;save();
console.log(JSON.stringify({total:report.tests.length,passed:report.tests.length-report.failed,failed:report.failed,evidence:out}));
process.exitCode=report.failed?1:0;
