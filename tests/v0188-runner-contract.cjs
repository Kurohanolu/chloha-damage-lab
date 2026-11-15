'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync,spawnSync}=require('node:child_process');
const runner=path.resolve('scripts/v0188-run-tests.cjs'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'v188-evidence-runner-'));
try{
 fs.mkdirSync(path.join(temp,'tests'));
 execFileSync('git',['init','-q'],{cwd:temp});
 execFileSync('git',['-c','user.name=Local Test','-c','user.email=fixture@example.invalid','commit','--allow-empty','-qm','Local fixture'],{cwd:temp});
 fs.writeFileSync(path.join(temp,'tests/v0188-a.cjs'),"require('node:fs').writeFileSync('a-ran','yes');process.exitCode=1;");
 fs.writeFileSync(path.join(temp,'tests/v0188-b.cjs'),"require('node:fs').writeFileSync('b-ran','yes');");
 fs.writeFileSync(path.join(temp,'tests/v0188-asset-audit-test.py'),"from pathlib import Path\nPath('python-ran').write_text('yes')\n");
 const failed=spawnSync(process.execPath,[runner],{cwd:temp,encoding:'utf8'});
 assert.equal(failed.status,1,'failure aggregate must fail CI');
 for(const file of ['a-ran','b-ran','python-ran'])assert.ok(fs.existsSync(path.join(temp,file)),'later tests must still execute: '+file);
 let report=JSON.parse(fs.readFileSync(path.join(temp,'reports/v0188/test-run.json')));
 assert.deepEqual(report.tests.map(test=>test.status),['failed','passed','passed']);assert.equal(report.failed,1);
 assert.ok(report.tests.every(test=>Number.isFinite(test.durationMs)));assert.ok(report.completedAt);
 fs.writeFileSync(path.join(temp,'tests/v0188-a.cjs'),"require('node:fs').writeFileSync('a-ran','yes');");
 const passed=spawnSync(process.execPath,[runner],{cwd:temp,encoding:'utf8'});assert.equal(passed.status,0,passed.stderr);
 report=JSON.parse(fs.readFileSync(path.join(temp,'reports/v0188/test-run.json')));assert.equal(report.failed,0);assert.ok(report.tests.every(test=>test.status==='passed'));
 console.log('PASS v0.188 evidence runner: every later test executes after failure; overall nonzero and complete per-test report; all-pass returns zero; isolated local fixtures only');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
