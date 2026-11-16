'use strict';
// A local-only fixture for the prior migration notice/private-draft contract.
// The current Community artifact is tested separately against its full pin.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
module.exports=function installHistoricalLegacyPreview(output){
 const commit='a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9',tree='604f0632eaf2d28e2fbd40012d68133050f72f30',git=args=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git(['rev-parse',commit+'^{tree}']).trim(),tree);
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-legacy-fixture-')),source=path.join(parent,'source'),artifact=path.join(parent,'artifact');
 try{git(['worktree','add','--detach',source,commit]);execFileSync(process.execPath,['scripts/v0187-build-sites.cjs','--output',artifact],{cwd:source,stdio:'pipe'});
  const manifest=JSON.parse(fs.readFileSync(path.join(artifact,'migration-artifacts.json')));assert.equal(manifest.sourceCommit,commit);assert.equal(manifest.uncommittedPreview,false);
  const target=path.join(output,'chloha-damage-lab');assert.ok(path.resolve(output).startsWith(os.tmpdir()+path.sep),'Only temporary local preview can use historical fixture');fs.rmSync(target,{recursive:true,force:true});fs.cpSync(path.join(artifact,'chloha-damage-lab'),target,{recursive:true});
  const fixture={role:'historical v0.186 migration-notice fixture only; not current Community acceptance',sourceCommit:commit,sourceTree:tree};
  const manifestPath=path.join(output,'migration-artifacts.json'),preview=JSON.parse(fs.readFileSync(manifestPath));
  const currentTarget=Object.fromEntries(Object.entries(preview.files).filter(([file])=>file.startsWith('singularity/')));
  preview.files={...currentTarget,...Object.fromEntries(Object.entries(manifest.files).filter(([file])=>file.startsWith('chloha-damage-lab/')))};
  assert.ok(preview.files['chloha-damage-lab/feedback-ui-v0185.js'],'Historical preview allowlist must serve the original feedback code');
  assert.deepEqual(Object.fromEntries(Object.entries(preview.files).filter(([file])=>file.startsWith('singularity/'))),currentTarget,'Current Singularity test bytes remain unchanged');
  preview.mode='local-only-current-target-with-historical-legacy-fixture';preview.historicalLegacyFixture=fixture;
  fs.writeFileSync(manifestPath,JSON.stringify(preview,null,2)+'\n');
  return fixture;
 }finally{try{git(['worktree','remove','--force',source]);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
};
