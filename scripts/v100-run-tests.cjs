'use strict';
// Every stable-promotion test is executed; failures are recorded and propagated.
const fs=require('node:fs'),path=require('node:path'),{spawnSync,execFileSync}=require('node:child_process');
const tests=fs.readdirSync('tests').filter(name=>/^v100-.*\.cjs$/.test(name)).sort();
for(const required of ['v100-engine-promotion.cjs','v100-stable-ui.cjs','v100-stable-release-gate.cjs','v100-stable-actual-approval.cjs','v100-release-publication.cjs','v100-feedback-compat.cjs','v100-feedback-browser.cjs'])if(!tests.includes(required))throw Error('Required stable suite is missing: '+required);
const out='reports/v100/test-run.json';fs.mkdirSync(path.dirname(out),{recursive:true});
const report={schemaVersion:1,releaseTag:require('../release.json').tag,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceTree:execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),uncommittedPreview:Boolean(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim()),startedAt:new Date().toISOString(),productionMutations:0,tests:tests.map(name=>({file:'tests/'+name,status:'queued'}))};
const save=()=>fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');save();
for(const record of report.tests){const started=Date.now();record.status='running';save();const result=spawnSync(process.execPath,[record.file],{stdio:'inherit'});Object.assign(record,{status:result.status===0&&!result.error?'passed':'failed',exitCode:result.status,signal:result.signal,durationMs:Date.now()-started});if(result.error)record.error=result.error.message;save();}
report.completedAt=new Date().toISOString();report.failed=report.tests.filter(t=>t.status!=='passed').length;save();
console.log(JSON.stringify({total:report.tests.length,passed:report.tests.length-report.failed,failed:report.failed,evidence:out}));process.exitCode=report.failed?1:0;
