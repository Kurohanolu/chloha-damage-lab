'use strict';
// Read-only immutable Community inventory. This is a byte/provenance contract,
// not a grant of rights and never an instruction to deploy the legacy URL.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),policy='community-pinned-v1';
const manifestPath='docs/data/v110-community-pinned-baseline.json',manifestSHA256='ad645809d99b0ffdb501a1b3bfd4c4e8cc63deaa9d2fa0e27d3778d4cf5cdc22';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024});
function communityPolicy(release){
 if(!release.migration||!Object.hasOwn(release.migration,'legacyPolicy'))return false;
 assert.equal(release.migration.legacyPolicy,policy,'Unknown explicit legacy policy');
 assert.equal(release.migration.legacyUrl,'https://kurohanolu.github.io/chloha-damage-lab/');
 return true;
}
function pinnedManifest(){const body=fs.readFileSync(path.join(root,manifestPath));assert.equal(hash(body),manifestSHA256,'Community inventory itself must remain independently pinned');return JSON.parse(body);}
function verifyCommunityFiles(manifest,files){
 assert.deepEqual(manifest,pinnedManifest(),'No substituted Community provenance or hashes');
 assert.ok(files instanceof Map);assert.equal(files.size,44);
 assert.deepEqual([...files.keys()].sort(),Object.keys(manifest.files).sort(),'Complete exact 44-file inventory, no missing or extra files');
 for(const [file,body]of files){assert.ok(file==='.nojekyll'||(/^[a-zA-Z0-9_./-]+$/.test(file)&&file.split('/').every(p=>p&&p!=='.'&&p!=='..'&&!p.startsWith('.'))));assert.equal(hash(body),manifest.files[file],'Community file hash: '+file);}
 const app=JSON.parse(files.get('application-manifest.json'));
 assert.equal(app.applicationSHA256,manifest.applicationSHA256);assert.equal(Object.keys(app.files).length,32);
 for(const [file,digest]of Object.entries(app.files))assert.equal(manifest.files[file],digest,'Application subset must match full Community inventory');
 assert.equal(hash(Object.keys(app.files).sort().map(file=>app.files[file]+'  '+file+'\n').join('')),manifest.applicationSHA256,'Application hash method is exact');
 // Check every relative URL in every HTML document, including cache-bearing URLs
 // and documentation links, not just runtime tags from index.html.
 for(const [file,body]of files)if(file.endsWith('.html'))for(const match of body.toString().matchAll(/\b(?:src|href)=["']([^"']+)["']/g)){
  const ref=match[1].replace(/&amp;/g,'&');if(/^(?:[a-z]+:|\/\/|#)/i.test(ref))continue;
  const url=new URL(ref,new URL(file,manifest.publicUrl));assert.ok(url.href.startsWith(manifest.publicUrl),'Relative reference must stay within pinned site');
  const target=decodeURIComponent(url.pathname.slice(new URL(manifest.publicUrl).pathname.length))||'index.html';assert.ok(files.has(target),'Referenced Community URL is inventoried: '+ref);
  if(url.searchParams.has('h'))assert.equal(url.searchParams.get('h'),manifest.files[target].slice(0,16),'Exact browser cache digest');
 }
 return {files:files.size,applicationSHA256:app.applicationSHA256};
}
function loadCommunityBaseline(){
 const manifest=pinnedManifest();assert.equal(git(['rev-parse',manifest.sourceCommit+'^{tree}']).toString().trim(),manifest.sourceTree);
 assert.equal(git(['rev-parse',manifest.auditCommit+'^{tree}']).toString().trim(),manifest.auditTree);
 const inventory=git(['ls-tree','-r','-z',manifest.sourceCommit]).toString().split('\0').filter(Boolean),files=new Map();
 for(const entry of inventory){const match=/^100644 blob [a-f0-9]{40}\t(.+)$/.exec(entry);assert.ok(match,'Only ordinary immutable files, no symlinks/submodules');files.set(match[1],git(['show',manifest.sourceCommit+':'+match[1]]));}
 const clearanceBytes=git(['show',manifest.auditCommit+':'+manifest.auditEvidencePath]);assert.equal(hash(clearanceBytes),manifest.auditEvidenceSha256);
 const clearance=JSON.parse(clearanceBytes);assert.equal(clearance.applicationSHA256,manifest.applicationSHA256);
 assert.deepEqual(Object.fromEntries(Object.entries(clearance.files).map(([f,v])=>[f,v.sha256])),manifest.files,'Latest audited rights manifest must bind all 44 exact bytes');
 verifyCommunityFiles(manifest,files);return {manifest,files};
}
module.exports={communityPolicy,loadCommunityBaseline,verifyCommunityFiles};
