'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const release=JSON.parse(fs.readFileSync('release.json','utf8'));
assert.match(release.version,/^\d+\.\d+$/);
assert.ok(Number.isInteger(release.preRelease)&&release.preRelease>0);
assert.equal(release.tag,'v'+release.version+'-pre.'+release.preRelease);
assert.equal(release.name,'Chloha Damage Lab v'+release.version+' Pre-Release '+release.preRelease);
assert.match(release.notes,/^docs\/releases\/v[\d.]+-pre\.\d+\.md$/);
assert.ok(fs.existsSync(release.notes),'release notes must exist');
const html=fs.readFileSync('index.html','utf8');
assert.equal(html.match(/<title>([^<]+)<\/title>/)?.[1],release.name,'public title must match release metadata');
assert.ok(html.includes('Pages publish: v'+release.version+' Pre-Release '+release.preRelease),'publish marker must match');
assert.equal(JSON.parse(fs.readFileSync('package.json','utf8')).version,release.version+'.0','verification package metadata');
for(const match of html.matchAll(/<script\b[^>]*\bsrc=["'](?:\.\/)?([^"']+)["'][^>]*>/g)){
 const asset=new URL(match[1],'https://release.invalid/');
 assert.ok(!match[1].includes('://')&&fs.existsSync(asset.pathname.slice(1)),'published runtime asset must exist: '+match[1]);
 assert.equal(asset.searchParams.get('v'),release.tag.slice(1),'every runtime URL must carry the current release cache key');
}
console.log('PASS release manifest, public metadata, notes, and runtime assets: '+release.tag);
