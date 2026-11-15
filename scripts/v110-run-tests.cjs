'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync,execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');process.chdir(root);
const files=fs.readdirSync(path.join(root,'tests')).filter(f=>/^v110-.*\.cjs$/.test(f)).sort();
for(const required of ['v110-artifact-contract.cjs','v110-source-contract.cjs','v110-release-identity.cjs','v110-engine-equivalence.cjs','v110-locale-contract.cjs','v110-ten-locale-browser.cjs','v110-ui-mobile.cjs','v110-regional-search-browser.cjs','v110-feedback-browser.cjs','v110-ui-inventory.cjs','v110-dynamic-ui.cjs'])if(!files.includes(required))throw Error('Missing required acceptance: '+required);
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const report={scope:'v1.1.0 candidate acceptance',commit:git('rev-parse','HEAD'),tree:git('rev-parse','HEAD^{tree}'),uncommittedPreview:!!git('status','--porcelain'),tests:[],startedAt:new Date().toISOString()};
for(const file of files){const start=Date.now();console.log('\nCandidate gate: '+file);const r=spawnSync(process.execPath,['tests/'+file],{stdio:'inherit',env:process.env});report.tests.push({file,status:r.status,signal:r.signal,error:r.error?.message,durationMs:Date.now()-start});}
report.passed=report.tests.every(t=>t.status===0&&!t.error);report.finishedAt=new Date().toISOString();
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/test-run.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({commit:report.commit,tests:report.tests.length,passed:report.passed,uncommittedPreview:report.uncommittedPreview}));if(!report.passed)process.exitCode=1;
