'use strict';
// Preserve the exact published prior pre.6 lifecycle test in its immutable source tree.
// It verifies real approved bytes there; current Community policy revision has separate additive preservation and source-scope gates.
if(require('../release.json').migration?.legacyPolicy==='community-pinned-v1'){
 const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9',tree='604f0632eaf2d28e2fbd40012d68133050f72f30';
 assert.equal(execFileSync('git',['rev-parse',ref+'^{tree}'],{encoding:'utf8'}).trim(),tree);
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre6-history-')),worktree=path.join(parent,'source');
 let status=1;
 try{
  execFileSync('git',['worktree','add','--detach',worktree,ref],{stdio:'pipe'});
  const result=spawnSync(process.execPath,['tests/v0187-live-readiness.cjs'],{cwd:worktree,stdio:'inherit'});
  assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Unmodified published prior pre.6 lifecycle must pass');
  assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');
  status=0;
 }finally{
  try{execFileSync('git',['worktree','remove','--force',worktree],{stdio:'pipe'});}finally{fs.rmSync(parent,{recursive:true,force:true});}
 }
 process.exit(status);
}
'use strict';
// State-independent fixtures: never mutate source approvals or contact production.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {buildSites}=require('../scripts/v0187-build-sites.cjs');
const {checkLiveSites}=require('../scripts/v0187-live-migration-check.cjs');
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-live-mock-'));buildSites(temp);const calls=[],requestedURLs=[];
 try{
  const releasePath=path.join(temp,'singularity/release.json'),manifestPath=path.join(temp,'migration-artifacts.json');
  const originalRelease=JSON.parse(fs.readFileSync(releasePath)),originalManifest=JSON.parse(fs.readFileSync(manifestPath));
  function fixture(migration){
   const release=require('../scripts/helpers/v0188-followup-review.cjs').publishedRelease();Object.assign(release.migration,migration);
   delete release.followupAudit; // Synthetic historical migration fixtures, not the current candidate's authorization.
   // These fixtures exercise historical migration lifecycle states, with an explicitly authorized synthetic quality review.
   if(Number(release.version)>=0.188)release.qualityReview={releaseTag:release.tag,auditor:'6.1 Terra',auditStatus:'passed',ownerApproval:'approved',evidence:'synthetic lifecycle fixture; not a real approval'};
   fs.writeFileSync(releasePath,JSON.stringify(release));
   const manifest=structuredClone(originalManifest);manifest.files['singularity/release.json']=hash(fs.readFileSync(releasePath));
   fs.writeFileSync(manifestPath,JSON.stringify(manifest));calls.length=0;requestedURLs.length=0;
   return {release,manifest};
  }
  const fetchMock=async(input,options)=>{
   const url=new URL(input);calls.push(url.pathname);requestedURLs.push(url);
   assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');assert.equal(options.redirect,'manual');assert.equal(options.cache,'no-store');
   assert.equal(url.origin,'https://kurohanolu.github.io');
   const file=url.pathname.replace(/^\//,'').replace(/\/$/,'/index.html');
   return new Response(fs.readFileSync(path.join(temp,file)),{status:200});
  };
  for(const mode of ['publication','new-target']){
   fixture({status:'awaiting-owner-approval',designApproval:'pending',liveTargetVerified:false});
   await assert.rejects(checkLiveSites(temp,{fetchImpl:fetchMock,mode}),/final owner/);assert.equal(calls.length,0);
   fixture({status:'approved',designApproval:'pending',liveTargetVerified:false});
   await assert.rejects(checkLiveSites(temp,{fetchImpl:fetchMock,mode}),/logo\/design/);assert.equal(calls.length,0);
  }
  const approved={status:'approved',designApproval:'approved',liveTargetVerified:false};
  fixture(approved);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:fetchMock}),/actual new public URL/);assert.equal(calls.length,0,'initial acceptance cannot publish');
  const acceptance=await checkLiveSites(temp,{fetchImpl:fetchMock,mode:'new-target'});
  assert.equal(acceptance.ready,true);assert.equal(acceptance.publicationReady,false);assert.deepEqual(acceptance.checkedSites,['singularity']);
  assert.ok(calls.length>30);assert.ok(calls.every(file=>file.startsWith('/singularity/')),'initial new-target acceptance must not require an old-site notice');
  assert.ok(requestedURLs.some(url=>url.pathname.endsWith('/brand-v0187.js')&&url.searchParams.get('v')===originalRelease.tag.slice(1)&&!url.searchParams.has('migration-check')),'check the exact versioned runtime URL used by the browser');
  assert.ok(acceptance.checkedBrowserAssetUrls>=30);
  assert.equal(JSON.parse(fs.readFileSync(releasePath)).migration.liveTargetVerified,false,'read-only acceptance must not set its own approval flag');
  const missingNew=async(url,options)=>new URL(url).pathname.endsWith('/brand-v0187.js')?new Response('',{status:404}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:missingNew,mode:'new-target'}),/public artifact HTTP: singularity\/brand/);
  const redirectNew=async(url,options)=>new URL(url).pathname==='/singularity/'?new Response('',{status:302,headers:{Location:'https://example.invalid/'}}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:redirectNew,mode:'new-target'}),/public artifact HTTP: singularity\/index.html/);
  const staleNew=async(url,options)=>new URL(url).pathname.endsWith('/brand-v0187.js')?new Response('stale new asset',{status:200}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:staleNew,mode:'new-target'}),/deployed artifact SHA256: singularity\/brand-v0187.js/);
  const staleBrowserCache=async(url,options)=>{const parsed=new URL(url);return parsed.pathname.endsWith('/brand-v0187.js')&&parsed.searchParams.has('v')&&!parsed.searchParams.has('migration-check')?new Response('stale browser asset URL',{status:200}):fetchMock(url,options);};
  await assert.rejects(checkLiveSites(temp,{fetchImpl:staleBrowserCache,mode:'new-target'}),/deployed artifact SHA256: singularity\/brand-v0187.js/,'a fresh cache-busting probe must not hide stale bytes at the exact browser URL');
  fixture({...approved,targetRepository:'someone-else/singularity'});
  await assert.rejects(checkLiveSites(temp,{fetchImpl:fetchMock,mode:'new-target'}));assert.equal(calls.length,0);
  fixture(approved);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:fetchMock,mode:'typo'}),/verification mode/);assert.equal(calls.length,0);
  for(const mode of ['publication','new-target']){
   for(const corruption of ['empty','missing-runtime','unsafe','unknown-site','local-bytes']){
    const {manifest}=fixture({...approved,liveTargetVerified:true});
    const runtime='singularity/brand-v0187.js',runtimePath=path.join(temp,runtime),originalBytes=fs.readFileSync(runtimePath);
    if(corruption==='empty')manifest.files={};
    if(corruption==='missing-runtime')delete manifest.files[runtime];
    if(corruption==='unsafe')manifest.files['singularity/../private.txt']='0'.repeat(64);
    if(corruption==='unknown-site')manifest.files['toString/index.html']='0'.repeat(64);
    if(corruption==='local-bytes')fs.writeFileSync(runtimePath,'unexpected local bytes');
    fs.writeFileSync(manifestPath,JSON.stringify(manifest));
    try{await assert.rejects(checkLiveSites(temp,{fetchImpl:fetchMock,mode}),/artifact/);assert.equal(calls.length,0,'invalid local evidence must fail before any public read');}
    finally{fs.writeFileSync(runtimePath,originalBytes);}
   }
  }
  fixture({...approved,liveTargetVerified:true});
  const result=await checkLiveSites(temp,{fetchImpl:fetchMock});assert.equal(result.ready,true);assert.equal(result.publicationReady,true);
  assert.deepEqual(result.checkedSites,['singularity','chloha-damage-lab']);assert.ok(result.checkedPublicFiles>60);assert.equal(result.productionMutations,0);
  const missingNotice=async(url,options)=>new URL(url).pathname.endsWith('/legacy-notice-v0187.js')?new Response('',{status:404}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:missingNotice}),/public artifact HTTP: chloha-damage-lab\/legacy-notice/);
  const staleOld=async(url,options)=>new URL(url).pathname==='/chloha-damage-lab/'?new Response('stale old page',{status:200}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:staleOld}),/deployed artifact SHA256: chloha-damage-lab\/index.html/);
  const staleNoticeCache=async(url,options)=>{const parsed=new URL(url);return parsed.pathname.endsWith('/legacy-notice-v0187.js')&&parsed.searchParams.has('v')&&!parsed.searchParams.has('migration-check')?new Response('stale notice cache',{status:200}):fetchMock(url,options);};
  await assert.rejects(checkLiveSites(temp,{fetchImpl:staleNoticeCache}),/deployed artifact SHA256: chloha-damage-lab\/legacy-notice-v0187.js/);
  console.log('PASS v0.187 lifecycle: owner/design approval required; new-target acceptance before verified flag and old notice; both public trees and exact browser cache URLs checked; missing/unsafe/incomplete/stale artifacts fail; synthetic fixtures only, zero production mutations');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
