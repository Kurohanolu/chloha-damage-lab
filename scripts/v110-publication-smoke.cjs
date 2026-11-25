'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const candidate=require('../release.json');
const prior='8343afafc1915fd82a765d0655742819f14fe5f8';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'});
(async()=>{
 assert.equal(candidate.tag,'v1.1.0');
 require('./verify-publication-approval.cjs').verifyPublication(candidate);
 const url=new URL('release.json',candidate.publicUrl);
 url.searchParams.set('source',git('rev-parse','HEAD').trim());
 const response=await fetch(url,{cache:'no-store'});
 assert.equal(response.ok,true);
 const actual=await response.json();
 if(actual.tag===candidate.tag){
  assert.deepEqual(actual,candidate);
  execFileSync(process.execPath,['scripts/v0187-live-migration-check.cjs'],{stdio:'inherit'});
  return;
 }
 assert.deepEqual(actual,JSON.parse(git('show',prior+':release.json')));
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'public-predecessor-'));
 const dir=path.join(parent,'source');
 try{
  git('worktree','add','--detach',dir,prior);
  execFileSync(process.execPath,['scripts/v0187-live-migration-check.cjs'],{cwd:dir,stdio:'inherit'});
 }finally{
  if(fs.existsSync(path.join(dir,'.git')))git('worktree','remove',dir);
  fs.rmSync(parent,{recursive:true,force:true});
 }
})().catch(err=>{console.error(err);process.exitCode=1;});
