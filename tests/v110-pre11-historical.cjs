'use strict';
// run the unchanged pre.11 tests against their immutable published tree.
// This is separate from candidate pre.14 scope and publication tests.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const commit='fbec6fd45b841c3465be903b25a14e909cc80ba5';
const tree='a38f294cddaf10c15e8cea147e57a7b6d6148142';
const cwd=path.resolve(__dirname,'..');
const git=(args,at=cwd)=>execFileSync('git',args,{cwd:at,encoding:'utf8',maxBuffer:32*1024*1024});
assert.equal(git(['rev-parse',commit+'^{tree}']).trim(),tree,'pre.11 source tree changed');
const pre12='828e906a3c460a4c55e3f8e79bcd973ead0dc93b',pre12Tree='1921d6331b877830a5065f16f849925486f7b8c7';
assert.equal(git(['rev-parse',pre12+'^{tree}']).trim(),pre12Tree);
for(const file of ['tests/v110-pre11-publication.cjs','tests/v110-weather-scope.cjs']){
 const historical=git(['show',commit+':'+file]),successor=git(['show',pre12+':'+file]);
 assert.ok(successor.endsWith(historical),'Pre.12 must retain the original pre.11 assertions: '+file);
 assert.ok(fs.readFileSync(path.join(cwd,file),'utf8').endsWith(successor),'Pre.14 must retain the complete pre.12 historical wrapper: '+file);
}
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'pre11-history-'));
const checkout=path.join(temporary,'source');
let added=false;
try{
 git(['worktree','add','--detach',checkout,commit]);added=true;
 const requested=process.argv[2];const allowed=['tests/v110-weather-scope.cjs','tests/v110-pre11-publication.cjs'];if(requested)assert.ok(allowed.includes(requested));
 for(const test of requested?[requested]:allowed){
  // The original assertions and immutable pre.11 release metadata run together.
  const output=execFileSync(process.execPath,[test],{cwd:checkout,encoding:'utf8',maxBuffer:32*1024*1024,timeout:120000});
  assert.match(output,/PASS /,'Original historical test must pass: '+test);
  process.stdout.write(output);
 }
}finally{
 if(added)git(['worktree','remove','--force',checkout]);
 fs.rmSync(temporary,{recursive:true,force:true});
}
console.log('PASS unchanged pre.11 historical scope and publication tests on immutable tree '+tree);
