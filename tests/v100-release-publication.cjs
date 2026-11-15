'use strict';
// Exercise the real publication helper through injected GitHub APIs only.
// No real tag, Release, upload or network call is possible in this test.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const {publishArchive}=require('../scripts/helpers/github-release-publication.cjs');
const sha='a'.repeat(40),other='b'.repeat(40),archive=Buffer.from('exact test archive'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const stable={version:'1.0.0',preRelease:null,channel:'stable',tag:'v1.0.0',name:'Singularity v1.0.0',product:'Singularity',notes:'docs/releases/v1.0.0.md'};
async function probe(mode){
 const manifest=mode==='historical'?{version:'0.188',preRelease:2,tag:'v0.188-pre.2',name:'Singularity v0.188 Pre-Release 2',product:'Singularity',notes:'docs/releases/v0.188-pre.2.md'}:stable;
 const prerelease=mode==='historical',events=[],assetBytes=new Map();let assets=[],tag=mode==='wrong-tag'?other:mode==='annotated'?sha:null,tagReads=0,published=false;
 let existingRelease=null;
 const name=manifest.tag+'.zip',checksum=Buffer.from(hash(archive)+'  '+name+'\n');
 function addAsset(name,bytes){const asset={id:assets.length+1,name,size:bytes.length,digest:'sha256:'+hash(bytes)};assets.push(asset);assetBytes.set(asset.id,bytes);return asset;}
 if(['idempotent','published-missing','bad-digest','download-digest','bad-download','wrong-channel','wrong-notes'].includes(mode)){
  existingRelease={id:42,tag_name:manifest.tag,target_commitish:sha,name:manifest.name,body:mode==='wrong-notes'?'incorrect claim':'Reviewed final release notes',draft:false,prerelease:mode==='wrong-channel'?!prerelease:prerelease,html_url:'https://example.invalid/release'};tag=sha;
  addAsset(name,archive);if(mode!=='published-missing')addAsset(name+'.sha256',checksum);
  if(mode==='bad-digest')assets[0].digest='sha256:'+'0'.repeat(64);
  if(['download-digest','bad-download'].includes(mode))assets.forEach(a=>{delete a.digest;});
  if(mode==='bad-download')assetBytes.set(1,Buffer.from('tampered archive'));
 }
 let release=existingRelease;
 const github={rest:{git:{
  getRef:async()=>{tagReads++;if(mode==='raced-tag'&&tagReads===2)tag=other;if(!tag)throw Object.assign(Error('missing'),{status:404});return {data:{object:mode==='annotated'?{type:'tag',sha:'c'.repeat(40)}:{type:'commit',sha:tag}}};},
  getTag:async()=>({data:{object:{type:'commit',sha}}})
 },repos:{
  createRelease:async args=>{events.push('create-draft');assert.equal(args.draft,true);assert.equal(args.prerelease,prerelease);assert.equal(args.target_commitish,sha);release={...args,id:42,html_url:'https://example.invalid/release'};return {data:release};},
  listReleaseAssets:async()=>({data:assets}),
  uploadReleaseAsset:async args=>{events.push('upload:'+args.name);assert.equal(published,false);if(mode==='upload-failure'&&args.name.endsWith('.sha256'))throw Error('injected upload failure');addAsset(args.name,args.data);return {data:assets.at(-1)};},
  getReleaseAsset:async args=>({data:assetBytes.get(args.asset_id)}),
  updateRelease:async args=>{events.push('publish');assert.equal(assets.length,2);assert.equal(args.draft,false);assert.equal(args.prerelease,prerelease);assert.equal(args.make_latest,prerelease?'false':'true');published=true;tag=sha;release={...release,...args};return {data:release};}
 }}};
 const failing=['wrong-tag','published-missing','bad-digest','bad-download','wrong-channel','wrong-notes','upload-failure','raced-tag','pending-notes'].includes(mode);
 const action=()=>publishArchive({github,repo:{owner:'test',repo:'offline'},sha,manifest,body:mode==='pending-notes'?'<!-- RELEASE_PENDING -->':'Reviewed final release notes',archive,existingRelease});
 if(failing){await assert.rejects(action);assert.equal(published,false,'Failure must not publish a new release');if(['wrong-tag','wrong-channel','wrong-notes','pending-notes'].includes(mode))assert.deepEqual(events,[]);}
 else{
  const receipt=await action();assert.equal(receipt.sha256,hash(archive));assert.equal(receipt.stable,!prerelease);
  if(existingRelease)assert.deepEqual(events,[],'Idempotent retry must not rewrite published metadata/assets');
  else assert.deepEqual(events,['create-draft','upload:'+name,'upload:'+name+'.sha256','publish']);
 }
 return mode;
}
(async()=>{const modes=['stable','historical','annotated','wrong-tag','idempotent','published-missing','bad-digest','download-digest','bad-download','wrong-channel','wrong-notes','upload-failure','raced-tag','pending-notes'];for(const mode of modes)await probe(mode);console.log('PASS immutable release publication: '+modes.length+' mocked lifecycles; stable flags, preverified draft assets, tag races, retries and failure isolation; zero real mutations');})().catch(error=>{console.error(error);process.exitCode=1;});
