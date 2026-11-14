'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {buildSites}=require('../scripts/v0187-build-sites.cjs');
const {checkLiveSites}=require('../scripts/v0187-live-migration-check.cjs');
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-live-mock-'));buildSites(temp);let calls=0;
 try{
  const fetchMock=async(input,options)=>{calls++;assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');const url=new URL(input),file=url.pathname.replace(/^\//,'').replace(/\/$/,'/index.html');return new Response(fs.readFileSync(path.join(temp,file)),{status:200});};
  await assert.rejects(checkLiveSites(temp,{fetchImpl:fetchMock}),/final owner/);assert.equal(calls,0,'pending publication must make no live request');
  // Synthetic approved fixture only; the repository manifest remains pending.
  const releasePath=path.join(temp,'singularity/release.json'),release=JSON.parse(fs.readFileSync(releasePath));Object.assign(release.migration,{status:'approved',designApproval:'approved',liveTargetVerified:true});fs.writeFileSync(releasePath,JSON.stringify(release));
  const manifestPath=path.join(temp,'migration-artifacts.json'),manifest=JSON.parse(fs.readFileSync(manifestPath));manifest.files['singularity/release.json']=hash(fs.readFileSync(releasePath));fs.writeFileSync(manifestPath,JSON.stringify(manifest));
  const result=await checkLiveSites(temp,{fetchImpl:fetchMock});assert.equal(result.ready,true);assert.ok(result.checkedPublicFiles>60);assert.equal(result.productionMutations,0);
  const missingNotice=async(url,options)=>new URL(url).pathname.endsWith('/legacy-notice-v0187.js')?new Response('',{status:404}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:missingNotice}),/public artifact HTTP: chloha-damage-lab\/legacy-notice/);
  const staleOldPage=async(url,options)=>new URL(url).pathname==='/chloha-damage-lab/'?new Response('stale old page',{status:200}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:staleOldPage}),/deployed artifact SHA256: chloha-damage-lab\/index.html/);
  const staleNewAsset=async(url,options)=>new URL(url).pathname.endsWith('/brand-v0187.js')?new Response('stale new asset',{status:200}):fetchMock(url,options);
  await assert.rejects(checkLiveSites(temp,{fetchImpl:staleNewAsset}),/deployed artifact SHA256: singularity\/brand-v0187.js/);
  console.log('PASS v0.187 future live gate: pending approval sends no request; complete dual-site fixtures pass; missing old notice and stale old/new bytes fail; mocks only, zero production mutations');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
