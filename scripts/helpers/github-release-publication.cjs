'use strict';
// Called only after independent/owner approval, exact-source CI and live checks.
// Prepare assets in a draft; never overwrite a tag, published asset or release.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const {releaseIdentity}=require('./release-identity.cjs');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function verifyTagBinding(github,repo,tag,sha,{required=false}={}){
 let object;
 try{object=(await github.rest.git.getRef({...repo,ref:'tags/'+tag})).data.object;}
 catch(error){if(error.status===404&&!required)return false;throw error;}
 for(let depth=0;object.type==='tag'&&depth<8;depth++)object=(await github.rest.git.getTag({...repo,tag_sha:object.sha})).data.object;
 assert.equal(object.type,'commit','Release tag must resolve to a commit');
 assert.equal(object.sha,sha,'Existing tag targets a different commit; preserve the immutable tag');
 return true;
}
async function verifyAsset(github,repo,asset,expected){
 assert.equal(asset.size,expected.length,'Existing asset size mismatch: '+asset.name);
 if(asset.digest){assert.equal(asset.digest,'sha256:'+hash(expected),'Existing asset digest mismatch: '+asset.name);return;}
 const response=await github.rest.repos.getReleaseAsset({...repo,asset_id:asset.id,headers:{accept:'application/octet-stream'}});
 assert.equal(hash(Buffer.from(response.data)),hash(expected),'Existing asset bytes mismatch: '+asset.name);
}
async function publishArchive({github,repo,sha,manifest,body,archive,existingRelease=null}){
 assert.match(sha,/^[a-f0-9]{40}$/,'Publication requires an exact full source SHA');
 const identity=releaseIdentity(manifest),prerelease=!identity.stable;
 assert.ok(typeof body==='string'&&!body.includes('<!-- RELEASE_PENDING -->'),'Finalize the publication date and release notes before publication');
 assert.ok(Buffer.isBuffer(archive)&&archive.length>0,'Exact source archive required');
 await verifyTagBinding(github,repo,manifest.tag,sha);
 let release=existingRelease;
 if(release){
  assert.equal(release.tag_name,manifest.tag);assert.equal(release.target_commitish,sha,'Existing release targets a different commit');
  assert.equal(release.name,manifest.name);assert.equal(release.prerelease,prerelease,'Existing release channel mismatch');
  assert.equal(release.body,body,'Existing release notes differ; preserve the published record');
 }else{
  release=(await github.rest.repos.createRelease({...repo,tag_name:manifest.tag,target_commitish:sha,name:manifest.name,body,prerelease,draft:true,make_latest:'false'})).data;
 }
 const digest=hash(archive),name=manifest.tag+'.zip';
 const expected=new Map([[name,archive],[name+'.sha256',Buffer.from(digest+'  '+name+'\n')]]);
 const prior=(await github.rest.repos.listReleaseAssets({...repo,release_id:release.id,per_page:100})).data;
 for(const [assetName,bytes] of expected){
  const matching=prior.filter(asset=>asset.name===assetName);assert.ok(matching.length<=1,'Duplicate release asset');
  if(matching.length){await verifyAsset(github,repo,matching[0],bytes);continue;}
  assert.equal(release.draft,true,'Published release is missing a verified asset; do not silently repair it');
  await github.rest.repos.uploadReleaseAsset({...repo,release_id:release.id,name:assetName,headers:{'content-type':assetName.endsWith('.zip')?'application/zip':'text/plain','content-length':bytes.length},data:bytes});
 }
 const finalAssets=(await github.rest.repos.listReleaseAssets({...repo,release_id:release.id,per_page:100})).data;
 for(const [assetName,bytes] of expected){const matches=finalAssets.filter(asset=>asset.name===assetName);assert.equal(matches.length,1,'Required verified asset missing');await verifyAsset(github,repo,matches[0],bytes);}
 await verifyTagBinding(github,repo,manifest.tag,sha);
 if(release.draft)release=(await github.rest.repos.updateRelease({...repo,release_id:release.id,draft:false,prerelease,make_latest:identity.stable?'true':'false'})).data;
 assert.equal(release.draft,false);assert.equal(release.prerelease,prerelease);
 await verifyTagBinding(github,repo,manifest.tag,sha,{required:true});
 return {url:release.html_url,tag:manifest.tag,commit:sha,stable:identity.stable,sha256:digest,bytes:archive.length};
}
module.exports={publishArchive,verifyTagBinding};
