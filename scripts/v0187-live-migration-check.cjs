'use strict';
// Read-only acceptance gate for a later, explicitly approved public cutover.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {verifyPublication}=require('./verify-publication-approval.cjs');
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
async function checkLiveSites(directory,{fetchImpl=globalThis.fetch}={}){
 const release=JSON.parse(fs.readFileSync(path.join(directory,'singularity/release.json')));verifyPublication(release);
 assert.equal(release.migration.legacyUrl,'https://kurohanolu.github.io/chloha-damage-lab/');
 const manifest=JSON.parse(fs.readFileSync(path.join(directory,'migration-artifacts.json')));
 const bases={'singularity':release.publicUrl,'chloha-damage-lab':release.migration.legacyUrl};
 const files=Object.entries(manifest.files).filter(([file])=>!file.endsWith('/.nojekyll')&&!file.endsWith('/brand-preview.html'));
 for(let offset=0;offset<files.length;offset+=6){
  await Promise.all(files.slice(offset,offset+6).map(async([file,expected])=>{
   const [site,...parts]=file.split('/');assert.ok(bases[site]&&parts.length&&parts.every(p=>p&&p!=='.'&&p!=='..'&&!p.startsWith('.')),'only known public artifacts are checked');
   const body=fs.readFileSync(path.join(directory,file));assert.equal(hash(body),expected,'artifact manifest integrity: '+file);
   const relative=parts.join('/'),url=new URL(relative==='index.html'?'':relative,bases[site]);url.searchParams.set('migration-check',release.tag+'-'+expected.slice(0,12));
   const response=await fetchImpl(url.href,{method:'GET',redirect:'manual',credentials:'omit',cache:'no-store',headers:{'User-Agent':'ChlohaLabs-MigrationCheck/0.187'},signal:AbortSignal.timeout(10000)});
   assert.equal(response.status,200,'public artifact HTTP: '+file);assert.equal(hash(Buffer.from(await response.arrayBuffer())),expected,'deployed artifact SHA256: '+file);
  }));
 }
 return {ready:true,mode:'read-only-public-artifact-verification',checkedPublicFiles:files.length,productionMutations:0};
}
module.exports={checkLiveSites};
if(require.main===module)(async()=>{
 const release=JSON.parse(fs.readFileSync('release.json'));if(!release.migration){console.log('No URL migration in this release');return;}
 verifyPublication(release);const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-live-'));
 try{require('./v0187-build-sites.cjs').buildSites(temp);console.log(JSON.stringify(await checkLiveSites(temp),null,2));}finally{fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
