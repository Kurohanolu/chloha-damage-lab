'use strict';
// Metadata-only presentation reconstruction inside disposable Git fixtures.
// No fixture approval or transformed runtime is written to the real checkout.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {releaseIdentity}=require('../../scripts/helpers/release-identity.cjs');
function writeFixtureIdentity(root,release){
 const old=JSON.parse(fs.readFileSync(path.join(root,'release.json'))),before=releaseIdentity(old),after=releaseIdentity(release);
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 if(old.tag!==release.tag){
  assert.ok(['v0.188-pre.2','v1.0.0'].includes(old.tag)&&['v0.188-pre.2','v1.0.0'].includes(release.tag),'Only the two explicitly tested successor fixture identities may be transformed');
  const oldBadge=before.stable?'<span class="version" data-no-translate>'+before.displayVersion+'</span>':'<span class="version">v'+old.version+' <span>Pre-Release '+old.preRelease+'</span></span>';
  const newBadge=after.stable?'<span class="version" data-no-translate>'+after.displayVersion+'</span>':'<span class="version">v'+release.version+' <span>Pre-Release '+release.preRelease+'</span></span>';
  assert.ok(html.includes(oldBadge),'Known exact fixture badge required');html=html.replace(oldBadge,newBadge);
  html=html.replaceAll(before.displayVersion,after.displayVersion).replaceAll('?v='+old.tag.slice(1),'?v='+release.tag.slice(1));
  fs.writeFileSync(path.join(root,'index.html'),html);
 }
 const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json')));pkg.version=after.packageVersion;
 fs.writeFileSync(path.join(root,'package.json'),JSON.stringify(pkg)+'\n');
 fs.writeFileSync(path.join(root,'release.json'),JSON.stringify(release,null,2)+'\n');
}
module.exports={writeFixtureIdentity};
