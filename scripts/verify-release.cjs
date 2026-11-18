'use strict';
const fs=require('node:fs'),crypto=require('node:crypto');
const assert=require('node:assert/strict');
const release=JSON.parse(fs.readFileSync('release.json','utf8'));
const {stable,displayVersion,packageVersion}=require('./helpers/release-identity.cjs').releaseIdentity(release);
assert.ok(fs.existsSync(release.notes),'release notes must exist');
const html=fs.readFileSync('index.html','utf8');
assert.equal(html.match(/<title>([^<]+)<\/title>/)?.[1],release.name,'public title must match release metadata');
assert.ok(html.includes('Pages publish: '+displayVersion),'publish marker must match');
assert.equal(JSON.parse(fs.readFileSync('package.json','utf8')).version,packageVersion,'verification package metadata');
for(const match of html.matchAll(/<script\b[^>]*\bsrc=["'](?:\.\/)?([^"']+)["'][^>]*>/g)){
 const asset=new URL(match[1],'https://release.invalid/');
 assert.ok(!match[1].includes('://')&&fs.existsSync(asset.pathname.slice(1)),'published runtime asset must exist: '+match[1]);
 assert.equal(asset.searchParams.get('v'),release.tag.slice(1),'every runtime URL must carry the current release cache key');
 if(asset.searchParams.has('h'))assert.equal(asset.searchParams.get('h'),crypto.createHash('sha256').update(fs.readFileSync(asset.pathname.slice(1))).digest('hex').slice(0,16),'runtime content cache key must match current bytes');
 if((release.followupAudit||['v0.188-pre.2','v1.0.0','v1.1.0-pre.1','v1.1.0-pre.2','v1.1.0-pre.3','v1.1.0-pre.4','v1.1.0-pre.5','v1.1.0-pre.6','v1.1.0-pre.7','v1.1.0-pre.8','v1.1.0-pre.9','v1.1.0-pre.11','v1.1.0-pre.12','v1.1.0-pre.14','v1.1.0-pre.15','v1.1.0-pre.16'].includes(release.tag))&&['/i18n.js','/feedback-ui-v0185.js','/damage-engine-v0184.js','/persistence-v0188.js'].includes(asset.pathname))assert.ok(asset.searchParams.has('h'),'changed follow-up assets require content cache keys');
}
if(release.product==='Singularity'){
 assert.equal(release.developer,'Chloha Labs');
 assert.equal(release.publicUrl,'https://kurohanolu.github.io/singularity/');
 assert.equal(release.migration?.strategy,'new-project-preserve-history');
 assert.ok(['awaiting-owner-approval','approved'].includes(release.migration.status));
 for(const asset of Object.values(release.branding))assert.ok(asset.startsWith('assets/singularity/')&&fs.existsSync(asset),'brand asset: '+asset);
 for(const match of html.matchAll(/<(?:link|img)\b[^>]*(?:href|src)=["']\.\/((?:assets\/singularity\/|singularity-v0187\.css)[^"']+)["']/g)){
  const asset=new URL(match[1],'https://release.invalid/');assert.ok(fs.existsSync(asset.pathname.slice(1)));
  assert.equal(asset.searchParams.get('v'),release.tag.slice(1),'brand cache key: '+match[1]);
  if(asset.pathname==='/singularity-v0187.css')assert.equal(asset.searchParams.get('h'),crypto.createHash('sha256').update(fs.readFileSync(asset.pathname.slice(1))).digest('hex').slice(0,16),'presentation cache key must follow the current stylesheet content');
 }
}
console.log('PASS release manifest, public metadata, notes, and runtime assets: '+release.tag);
