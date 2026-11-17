'use strict';
// GET-only exact artifact verification; never deploys or submits feedback.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {buildSites,assetReferences}=require('./v0187-build-sites.cjs');
const {acceptanceFiles}=require('./helpers/v100-live-acceptance.cjs');
const {verifyCutoverApproval,verifyPublication}=require('./verify-publication-approval.cjs');
const {publishedCommit}=require('./helpers/v0188-followup-review.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function checkStableAssets(directory,expectedFiles,{fetchImpl=globalThis.fetch}={}){
 const manifest=JSON.parse(fs.readFileSync(path.join(directory,'migration-artifacts.json'))),release=JSON.parse(fs.readFileSync(path.join(directory,'singularity/release.json')));
 assert.ok(['v1.0.0','v1.1.0-pre.1','v1.1.0-pre.2','v1.1.0-pre.3','v1.1.0-pre.4','v1.1.0-pre.5','v1.1.0-pre.6','v1.1.0-pre.7','v1.1.0-pre.8','v1.1.0-pre.9','v1.1.0-pre.11','v1.1.0-pre.12','v1.1.0-pre.14','v1.1.0-pre.15'].includes(release.tag));assert.deepEqual(manifest.files,expectedFiles,'Complete exact-source artifact inventory required');
 const bases={singularity:release.publicUrl,'chloha-damage-lab':release.migration.legacyUrl};
 assert.equal(bases.singularity,'https://kurohanolu.github.io/singularity/');assert.equal(bases['chloha-damage-lab'],'https://kurohanolu.github.io/chloha-damage-lab/');
 const exact=new Map();
 for(const [site,base] of Object.entries(bases))for(const ref of assetReferences(fs.readFileSync(path.join(directory,site,'index.html'),'utf8'))){const url=new URL(ref,base);url.hash='';const key=site+'/'+ref.split(/[?#]/)[0].replace(/^\.\//,'');if(!exact.has(key))exact.set(key,new Set());exact.get(key).add(url.href);}
 const entries=Object.entries(expectedFiles);assert.ok(entries.length>70,'Complete dual-site inventory required');
 for(const [file,digest] of entries){assert.match(file,/^(singularity|chloha-damage-lab)\/(?!.*(?:^|\/)\.\.\/)[a-zA-Z0-9_./-]+$/);assert.ok(file.split('/').every(part=>part&&part!=='.'&&part!=='..'&&(!part.startsWith('.')||part==='.nojekyll')),'Unsafe artifact path');assert.match(digest,/^[a-f0-9]{64}$/);assert.equal(hash(fs.readFileSync(path.join(directory,file))),digest,'Local artifact mismatch: '+file);}
 const observations=[];
 for(let offset=0;offset<entries.length;offset+=6)await Promise.all(entries.slice(offset,offset+6).map(async([file,digest])=>{
  const [site,...parts]=file.split('/'),relative=parts.join('/'),bare=new URL(relative==='index.html'?'':relative,bases[site]);
  const fresh=new URL(bare);fresh.searchParams.set('stable-check',release.tag+'-'+digest.slice(0,12));
  for(const url of new Set([bare.href,fresh.href,...(exact.get(file)||[])])){
   const response=await fetchImpl(url,{method:'GET',redirect:'manual',credentials:'omit',cache:'no-store',headers:{'User-Agent':'Singularity-StableAcceptance/1.0.0'},signal:AbortSignal.timeout(15000)});
   assert.equal(response.status,200,'Public artifact HTTP: '+file);const observed=hash(Buffer.from(await response.arrayBuffer()));assert.equal(observed,digest,'Public artifact hash: '+url);observations.push({file,url,status:response.status,sha256:observed});
  }
 }));
 return {status:'passed',files:entries.length,requests:observations.length,observations:observations.sort((a,b)=>a.url.localeCompare(b.url)),productionMutations:0};
}
module.exports={checkStableAssets};
if(require.main===module)(async()=>{
 const args=process.argv.slice(2);assert.ok(args.length===1&&['--record-preacceptance','--publication'].includes(args[0]),'Explicit stable acceptance mode required');
 const release=JSON.parse(fs.readFileSync('release.json'));assert.ok(['v1.0.0','v1.1.0-pre.1','v1.1.0-pre.2','v1.1.0-pre.3','v1.1.0-pre.4','v1.1.0-pre.5','v1.1.0-pre.6','v1.1.0-pre.7','v1.1.0-pre.8','v1.1.0-pre.9','v1.1.0-pre.11','v1.1.0-pre.12','v1.1.0-pre.14','v1.1.0-pre.15'].includes(release.tag));
 if(args[0]==='--publication')verifyPublication(release);else{verifyCutoverApproval(release);assert.equal(release.migration.liveTargetVerified,false);}
 assert.equal(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim(),'','Clean exact source required');
 const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceTree=execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim();
 const expected=acceptanceFiles(sourceCommit),temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-stable-live-'));
 try{
  buildSites(temp);const evidence=await checkStableAssets(temp,expected);fs.mkdirSync('reports/v100',{recursive:true});
  fs.writeFileSync('reports/v100/live-public-assets.json',JSON.stringify({sourceCommit,sourceTree,checkedAt:new Date().toISOString(),...evidence},null,2)+'\n');
  if(args[0]==='--record-preacceptance'){
   const deploymentRun=process.env.SINGULARITY_DEPLOYMENT_RUN;assert.match(deploymentRun||'',/^https:\/\/github\.com\/Kurohanolu\/singularity\/actions\/runs\/[1-9]\d*$/);
   const observedAtJST=new Date().toLocaleString('sv-SE',{timeZone:'Asia/Tokyo'}).replace(' ','T')+'+09:00';
   const rollbackSourceCommit=release.tag==='v1.1.0-pre.15'?'cace126d0244f2d748b3c162a3e7cb5f9441932d':release.tag==='v1.1.0-pre.14'?'828e906a3c460a4c55e3f8e79bcd973ead0dc93b':release.tag==='v1.1.0-pre.12'?'fbec6fd45b841c3465be903b25a14e909cc80ba5':release.tag==='v1.1.0-pre.11'?'46f930797e662be0d01e974f98ddde6de7b414c0':release.tag==='v1.1.0-pre.9'?'0b1f8fffea3b1d063036d00fd712b0a0e9695111':release.tag==='v1.1.0-pre.8'?'66a085ba325655bc9369656ea0645f7f6f997127':release.tag==='v1.1.0-pre.7'?'2fb5655a89e076df5993a3294bddbe1bf31afa58':release.tag==='v1.1.0-pre.6'?'82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74':release.tag==='v1.1.0-pre.5'?'61d87e82995bc60d4564aaf57a52dfc1fd859e4c':release.tag==='v1.1.0-pre.4'?'082ab180bc8835304d959f583d4968e0565bdea3':release.tag==='v1.1.0-pre.3'?'aba2d0558948e2a4dd375074fb11fd428edf6222':release.tag==='v1.1.0-pre.2'?'83af29133927a19fc7e0f9273c0e194c54384ae5':release.tag==='v1.1.0-pre.1'?'0b270c1452505268364659edd402209b00b28673':publishedCommit;
   const receipt={schemaVersion:1,releaseTag:release.tag,sourceCommit,sourceTree,deploymentRun,observedAtJST,result:'passed',currentUrl:release.publicUrl,legacyUrl:release.migration.legacyUrl,files:expected,rollbackSourceCommit};
   fs.writeFileSync('reports/v100/live-acceptance-receipt.json',JSON.stringify(receipt,null,2)+'\n');
  }
  console.log(JSON.stringify({sourceCommit,sourceTree,status:evidence.status,files:evidence.files,requests:evidence.requests,productionMutations:0}));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
