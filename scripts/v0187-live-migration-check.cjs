'use strict';
// Read-only acceptance gate for a later, explicitly approved public cutover.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {verifyCutoverApproval,verifyPublication}=require('./verify-publication-approval.cjs');
const {buildSites,dependencies,assetReferences}=require('./v0187-build-sites.cjs');
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
async function checkLiveSites(directory,{fetchImpl=globalThis.fetch,mode='publication'}={}){
 assert.ok(['publication','new-target'].includes(mode),'explicit migration verification mode required');
 const release=JSON.parse(fs.readFileSync(path.join(directory,'singularity/release.json')));
 if(mode==='new-target')verifyCutoverApproval(release);else verifyPublication(release);
 const manifest=JSON.parse(fs.readFileSync(path.join(directory,'migration-artifacts.json')));
 const bases={'singularity':release.publicUrl,'chloha-damage-lab':release.migration.legacyUrl};
 const sites=mode==='new-target'?['singularity']:Object.keys(bases);
 assert.ok(manifest.files&&typeof manifest.files==='object'&&!Array.isArray(manifest.files),'public artifact inventory required');
 const entries=Object.entries(manifest.files),files=[];
 const excluded=file=>file.endsWith('/.nojekyll')||file==='singularity/brand-preview.html';
 for(const [file,expected] of entries){
  const [site,...parts]=file.split('/');
  assert.ok(Object.hasOwn(bases,site)&&parts.length&&parts.every(p=>p&&p!=='.'&&p!=='..'&&(!p.startsWith('.')||p==='.nojekyll')),'only known public artifacts are checked');
  assert.match(expected,/^[a-f0-9]{64}$/,'SHA256 artifact inventory: '+file);
 }
 // Validate the entire selected local tree before making even a read request.
 // An empty/truncated inventory must not turn a missing deployment into PASS.
 for(const site of sites){
  const html=fs.readFileSync(path.join(directory,site,'index.html'),'utf8');
  const required=[...new Set(['index.html','release.json',...dependencies(html),...(site==='singularity'?Object.values(release.branding):[])])].map(file=>site+'/'+file).sort();
  const selected=entries.filter(([file])=>file.startsWith(site+'/')&&!excluded(file));
  assert.deepEqual(selected.map(([file])=>file).sort(),required,'complete public artifact inventory: '+site);
  const browserURLs=new Map();
  for(const reference of assetReferences(html)){
   const file=site+'/'+reference.split(/[?#]/)[0].replace(/^\.\//,''),url=new URL(reference,bases[site]);url.hash='';
   if(!browserURLs.has(file))browserURLs.set(file,new Set());browserURLs.get(file).add(url.href);
  }
  for(const [file,expected] of selected){
   assert.equal(hash(fs.readFileSync(path.join(directory,file))),expected,'artifact manifest integrity: '+file);
   files.push([file,expected,[...(browserURLs.get(file)||[])]]);
  }
 }
 for(let offset=0;offset<files.length;offset+=6){
  await Promise.all(files.slice(offset,offset+6).map(async([file,expected,browserURLs])=>{
   const [site,...parts]=file.split('/');
   const relative=parts.join('/'),url=new URL(relative==='index.html'?'':relative,bases[site]);url.searchParams.set('migration-check',release.tag+'-'+expected.slice(0,12));
   // Probe the exact URLs loaded by the browser as well as fresh-origin bytes.
   // A cache-busting request alone could conceal stale versioned asset URLs.
   await Promise.all([...new Set([url.href,...browserURLs])].map(async requestURL=>{
    const response=await fetchImpl(requestURL,{method:'GET',redirect:'manual',credentials:'omit',cache:'no-store',headers:{'User-Agent':'ChlohaLabs-MigrationCheck/0.187'},signal:AbortSignal.timeout(10000)});
    assert.equal(response.status,200,'public artifact HTTP: '+file);assert.equal(hash(Buffer.from(await response.arrayBuffer())),expected,'deployed artifact SHA256: '+file);
   }));
  }));
 }
 return {ready:true,mode:mode==='new-target'?'read-only-new-target-verification':'read-only-public-artifact-verification',checkedSites:sites,checkedPublicFiles:files.length,checkedBrowserAssetUrls:files.reduce((sum,[,,urls])=>sum+urls.length,0),publicationReady:mode==='publication',productionMutations:0};
}
module.exports={checkLiveSites};
if(require.main===module)(async()=>{
 const args=process.argv.slice(2);assert.ok(!args.length||(args.length===1&&args[0]==='--accept-new-target'),'Usage: node scripts/v0187-live-migration-check.cjs [--accept-new-target]');
 const mode=args.length?'new-target':'publication';
 const release=JSON.parse(fs.readFileSync('release.json'));if(!release.migration){console.log('No URL migration in this release');return;}
 if(mode==='new-target')verifyCutoverApproval(release);else verifyPublication(release);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-live-'));
 try{buildSites(temp);console.log(JSON.stringify(await checkLiveSites(temp,{mode}),null,2));}finally{fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
