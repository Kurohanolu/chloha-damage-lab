'use strict';
// Identity validation shared by release metadata and publication authorization.
// A stable release is explicit; dropping a prerelease suffix alone is not enough.
const assert=require('node:assert/strict');
function releaseIdentity(release){
 const product=release.product||'Chloha Damage Lab';
 assert.ok(['Chloha Damage Lab','Singularity'].includes(product),'Explicit supported product identity');
 const stable=release.channel==='stable';
 let displayVersion,packageVersion;
 if(stable){
  assert.equal(product,'Singularity','Stable identity must retain the product');
  assert.match(release.version,/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,'Stable release requires an exact three-part version');
  assert.equal(release.preRelease,null,'Stable release must explicitly clear the prerelease number');
  assert.equal(release.tag,'v'+release.version,'Stable tag must exactly match its version');
  displayVersion='v'+release.version;packageVersion=release.version;
 }else{
  assert.ok(!Object.hasOwn(release,'channel'),'Unknown or ambiguous release channel');
  assert.match(release.version,/^\d+\.\d+$/,'Historical prerelease requires its two-part series');
  assert.ok(Number.isInteger(release.preRelease)&&release.preRelease>0,'Explicit positive prerelease number required');
  assert.equal(release.tag,'v'+release.version+'-pre.'+release.preRelease);
  displayVersion='v'+release.version+' Pre-Release '+release.preRelease;packageVersion=release.version+'.0';
 }
 assert.equal(release.name,product+' '+displayVersion,'Release display name must match its exact identity');
 assert.equal(release.notes,'docs/releases/'+release.tag+'.md','Release notes must belong to the exact tag');
 return {stable,displayVersion,packageVersion};
}
module.exports={releaseIdentity};
