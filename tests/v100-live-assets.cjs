'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {buildSites}=require('../scripts/v0187-build-sites.cjs');
const {checkStableAssets}=require('../scripts/v100-live-acceptance.cjs');
async function probe(mode){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'stable-assets-test-'));let reads=0;
 try{
  const {manifest}=buildSites(dir),expected=structuredClone(manifest.files);
  if(mode==='truncated'){delete manifest.files['singularity/index.html'];fs.writeFileSync(path.join(dir,'migration-artifacts.json'),JSON.stringify(manifest));}
  if(mode==='local-tamper')fs.appendFileSync(path.join(dir,'singularity/index.html'),'tampered');
  const fetchImpl=async(url,options)=>{
   reads++;assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');const u=new URL(url);assert.equal(u.origin,'https://kurohanolu.github.io');
   const relative=u.pathname.slice(1)+(u.pathname.endsWith('/')?'index.html':'');
   let body=fs.readFileSync(path.join(dir,relative));
   if(mode==='stale-cache'&&u.searchParams.has('v'))body=Buffer.from('stale versioned content');
   if(mode==='redirect')return new Response(null,{status:302});
   return new Response(body,{status:200});
  };
  if(mode==='valid'){
   const r=await checkStableAssets(dir,expected,{fetchImpl});assert.equal(r.status,'passed');assert.equal(r.files,Object.keys(expected).length);assert.ok(r.requests>r.files*2);assert.ok(r.observations.some(x=>x.file==='singularity/brand-preview.html'));assert.ok(r.observations.some(x=>x.file==='singularity/.nojekyll'));
  }else{await assert.rejects(()=>checkStableAssets(dir,expected,{fetchImpl}));if(['truncated','local-tamper'].includes(mode))assert.equal(reads,0,'Bad local provenance must fail before network');}
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
(async()=>{for(const mode of ['valid','truncated','local-tamper','stale-cache','redirect'])await probe(mode);console.log('PASS exact stable live assets: complete dual inventory, hidden/preview files and browser query keys; fail-closed local/hash/HTTP checks, mocked GET only');})().catch(error=>{console.error(error);process.exitCode=1;});
