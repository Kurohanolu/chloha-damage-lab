'use strict';
// State-independent fixtures: never mutate source approvals or contact production.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {buildSites}=require('../scripts/v0187-build-sites.cjs');
const {checkLiveSites}=require('../scripts/v0187-live-migration-check.cjs');
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-live-mock-'));buildSites(temp);const calls=[];
 try{
  const releasePath=path.join(temp,'singularity/release.json'),manifestPath=path.join(temp,'migration-artifacts.json');
  const originalRelease=JSON.parse(fs.readFileSync(releasePath)),originalManifest=JSON.parse(fs.readFileSync(manifestPath));
  function fixture(migration){
   const release=structuredClone(originalRelease);Object.assign(release.migration,migration);
   fs.writeFileSync(releasePath,JSON.stringify(release));
   const manifest=structuredClone(originalManifest);manifest.files['singularity/release.json']=hash(fs.readFileSync(releasePath));
   fs.writeFileSync(manifestPath,JSON.stringify(manifest));calls.length=0;
   return {release,manifest};
  }
  const fetchMock=async(input,options)=>{
   const url=new URL(input);calls.push(url.pathname);
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
  assert.equal(JSON.parse(fs.readFileSync(releasePath)).migration.liveTargetVerified,false,'read-only acceptance must not set its own approval flag');
  const missingNew=async(url,options)=>new URL(url).pathname.endsWith('/brand-v0187.js')?new Response('',{status:404}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:missingNew,mode:'new-target'}),/public artifact HTTP: singularity\/brand/);
  const redirectNew=async(url,options)=>new URL(url).pathname==='/singularity/'?new Response('',{status:302,headers:{Location:'https://example.invalid/'}}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:redirectNew,mode:'new-target'}),/public artifact HTTP: singularity\/index.html/);
  const staleNew=async(url,options)=>new URL(url).pathname.endsWith('/brand-v0187.js')?new Response('stale new asset',{status:200}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:staleNew,mode:'new-target'}),/deployed artifact SHA256: singularity\/brand-v0187.js/);
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
  console.log('PASS v0.187 lifecycle: owner/design approval required; new-target acceptance before verified flag and old notice; final publication checks both sites; missing/unsafe/incomplete/stale artifacts fail; synthetic fixtures only, zero production mutations');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
