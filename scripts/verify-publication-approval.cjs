'use strict';
// A draft manifest is valid for development, but cannot publish a migration.
const fs=require('node:fs'),assert=require('node:assert/strict');
function verifyCutoverApproval(release){
 if(!release.migration)return;
 assert.equal(release.migration.status,'approved','Singularity publication requires final owner cutover approval');
 assert.equal(release.migration.designApproval,'approved','The exact logo/design must be approved');
 assert.equal(release.migration.sourceRepository,'Kurohanolu/chloha-damage-lab');
 assert.equal(release.migration.targetRepository,'Kurohanolu/singularity');
 assert.equal(release.publicUrl,'https://kurohanolu.github.io/singularity/');
 assert.equal(release.migration.legacyUrl,'https://kurohanolu.github.io/chloha-damage-lab/');
}
function verifyPublication(release){
 verifyCutoverApproval(release);
 if(release.migration)assert.equal(release.migration.liveTargetVerified,true,'The actual new public URL must be accepted before release publication');
}
module.exports={verifyCutoverApproval,verifyPublication};
if(require.main===module){verifyPublication(JSON.parse(fs.readFileSync('release.json','utf8')));console.log('PASS publication approval gate');}
