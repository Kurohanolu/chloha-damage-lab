'use strict';
// Prepare a verified local rollback candidate. Never pushes, deploys or deletes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const contract=require('../migration/legacy-v0186-artifacts.json');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function prepareLegacyRollback(directory,output){
 const artifacts=path.resolve(directory),out=path.resolve(output);
 assert.ok(out!==root&&!root.startsWith(out+path.sep),'rollback output must not replace the source tree');
 assert.ok(out!==artifacts&&!artifacts.startsWith(out+path.sep)&&!out.startsWith(artifacts+path.sep),'rollback output must not alter artifact evidence');
 assert.ok(!fs.existsSync(out),'use a new rollback output directory');
 const manifest=JSON.parse(fs.readFileSync(path.join(artifacts,'migration-artifacts.json'))),rollback=manifest.rollback;
 if(manifest.legacyProvenance){
  const {manifest:pinned}=require('./helpers/community-pinned-baseline.cjs').loadCommunityBaseline();
  assert.equal(manifest.legacyCommit,pinned.sourceCommit,'Pinned current Community source required');
  assert.deepEqual(manifest.legacyProvenance,{policy:pinned.policy,sourceCommit:pinned.sourceCommit,sourceTree:pinned.sourceTree,auditCommit:pinned.auditCommit,auditTree:pinned.auditTree,auditEvidenceSha256:pinned.auditEvidenceSha256,applicationSHA256:pinned.applicationSHA256,files:44,readOnlyBaseline:true},'Exact independent Community provenance required');
 }else assert.equal(manifest.legacyCommit,contract.legacyCommit,'pinned legacy release required');
 assert.equal(rollback?.legacyCommit,contract.legacyCommit,'pinned rollback release required');
 assert.equal(rollback.artifactPath,'rollback/chloha-damage-lab','fixed rollback artifact path required');
 assert.deepEqual(rollback.files,contract.files,'rollback inventory must match the independent frozen release contract');
 const files=[];
 for(const [file,expected] of Object.entries(contract.files)){
  const parts=[...rollback.artifactPath.split('/'),...file.split('/')];let current=artifacts;
  for(const part of parts){current=path.join(current,part);assert.ok(!fs.lstatSync(current).isSymbolicLink(),'rollback artifacts must not follow symbolic links');}
  const bytes=fs.readFileSync(current);assert.equal(hash(bytes),expected,'rollback SHA256: '+file);files.push([file,bytes]);
 }
 // Validate every byte before making the first destination write.
 for(const [file,bytes] of files){const dest=path.join(out,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);}
 return {mode:'local-rollback-preparation',historicalOnly:!!manifest.legacyProvenance,legacySiteOverwriteAuthorized:false,legacyCommit:contract.legacyCommit,preparedFiles:files.length,output:out,productionMutations:0,deploymentPerformed:false};
}
module.exports={prepareLegacyRollback};
if(require.main===module){
 const args=process.argv.slice(2);assert.ok(args.length===4&&args[0]==='--artifacts'&&args[2]==='--output','Usage: node scripts/v0187-prepare-rollback.cjs --artifacts DIR --output NEW_DIR');
 console.log(JSON.stringify(prepareLegacyRollback(args[1],args[3]),null,2));
}
