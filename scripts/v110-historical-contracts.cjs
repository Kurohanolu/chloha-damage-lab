'use strict';
// Explicit historical evidence. These tests intentionally freeze a nine-language
// release identity; they must never be weakened or mistaken for candidate tests.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {execFileSync,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline='0b270c1452505268364659edd402209b00b28673',tree='239c4cbd37aa6389f16dc81e7f9a861c09a723f2';
const suite=process.argv[process.argv.indexOf('--suite')+1];
const suites={
 'nine-ui':['tests/v0183-locale-registry.cjs','tests/v0183-locale-name-search.cjs','tests/v0183-nine-locale-browser.cjs'],
 'feedback-nine':['tests/v0185-feedback-contract.cjs'],
 migration:['tests/v0187-migration-contract.cjs'],
 'v188-byte-and-approval':['tests/v0188-approved-release-binding.cjs','tests/v0188-astra-followup-gates.cjs','tests/v0188-astra-runtime-contract.cjs','tests/v0188-contract-and-approval.cjs','tests/v0188-pre2-actual-approval.cjs','tests/v0188-pre2-release-gate.cjs'],
 stable:['scripts/verify-release.cjs','tests/v0184-public-baseline.cjs','scripts/v100-run-tests.cjs']
};
assert.ok(suites[suite],'Choose --suite nine-ui, feedback-nine, migration or stable');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
assert.equal(git('rev-parse',baseline+'^{tree}').trim(),tree,'Historical commit/tree must be exact, never a moving tag');
const requested=process.argv.includes('--test')?process.argv[process.argv.indexOf('--test')+1]:null;
if(requested)assert.ok(suites[suite].includes(requested),'Only declared historical tests can be selected');
const selected=requested?[requested]:suites[suite];
const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-historical-')),worktree=path.join(parent,'v100');
const report={role:'HISTORICAL ONLY; not v1.1.0 candidate acceptance',suite,baseline,tree,candidateCommit:git('rev-parse','HEAD').trim(),tests:[],status:'RUNNING'};
try{
 git('worktree','add','--detach',worktree,baseline);
 for(const directory of ['node_modules','services/feedback/node_modules','tests/reference/node_modules']){
  const source=path.join(root,directory);
  if(fs.existsSync(source)){
   // Keep node_modules an actual ignored directory. A directory symlink is
   // an untracked file to Git and falsely dirties the immutable historical tree.
   const target=path.join(worktree,directory);fs.mkdirSync(target,{recursive:true});
   for(const entry of fs.readdirSync(source))fs.symlinkSync(path.join(source,entry),path.join(target,entry));
  }
 }
 console.log('HISTORICAL v1.0.0 acceptance at '+baseline+'; candidate is independently covered by v1.1.0 gates.');
 for(const file of selected){
  const result=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',env:{...process.env,NODE_PATH:[path.join(root,'node_modules'),process.env.NODE_PATH].filter(Boolean).join(path.delimiter)}});
  report.tests.push({file,status:result.status,signal:result.signal,error:result.error?.message});
 }
 assert.ok(report.tests.every(t=>t.status===0&&!t.error),'Every historical test must pass; none may be skipped');
 if(suite==='stable'){
  assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'','Historical stable package is clean');
  execFileSync(process.execPath,['scripts/v0187-build-sites.cjs','--output','dist/v100'],{cwd:worktree,stdio:'inherit'});
  fs.mkdirSync(path.join(root,'reports/v100'),{recursive:true});fs.cpSync(path.join(worktree,'reports/v100'),path.join(root,'reports/v100/historical-v1.0.0'),{recursive:true});
  fs.cpSync(path.join(worktree,'dist/v100'),path.join(root,'dist/v100/historical-v1.0.0'),{recursive:true});
 }
 report.status='PASS';
}catch(error){report.status='FAIL';report.error=error.message;process.exitCode=1;console.error(error);}
finally{
 const output=path.join(root,'reports/v110/historical');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,suite+(requested?'-'+path.basename(requested,'.cjs'):'')+'.json'),JSON.stringify(report,null,2)+'\n');
 if(suite==='stable'){fs.mkdirSync(path.join(root,'reports/v100'),{recursive:true});fs.writeFileSync(path.join(root,'reports/v100/historical-summary.json'),JSON.stringify(report,null,2)+'\n');}
 try{git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}
}
