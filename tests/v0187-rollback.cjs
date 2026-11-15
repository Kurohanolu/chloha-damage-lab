'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {buildSites,legacyCommit}=require('../scripts/v0187-build-sites.cjs');
const {prepareLegacyRollback}=require('../scripts/v0187-prepare-rollback.cjs');
const contract=require('../migration/legacy-v0186-artifacts.json');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-rollback-'));
try{
 const artifacts=path.join(temp,'bundle'),{manifest}=buildSites(artifacts),backup=path.join(artifacts,manifest.rollback.artifactPath);
 assert.equal(contract.legacyCommit,legacyCommit);assert.ok(!Object.keys(manifest.files).some(file=>file.startsWith('rollback/')),'rollback is not a publishable site');
 for(const [file,expected] of Object.entries(contract.files)){
  const original=file==='.nojekyll'?Buffer.alloc(0):execFileSync('git',['show',legacyCommit+':'+file],{maxBuffer:16*1024*1024});
  assert.equal(hash(original),expected,'independently pinned old-release bytes: '+file);
 }
 // An impaired current deployment must not stop recovery of the old calculator.
 fs.writeFileSync(path.join(artifacts,'chloha-damage-lab/index.html'),'broken current deployment');
 const result=prepareLegacyRollback(artifacts,path.join(temp,'recovered'));
 assert.equal(result.deploymentPerformed,false);assert.equal(result.productionMutations,0);
 for(const [file,expected] of Object.entries(contract.files))assert.equal(hash(fs.readFileSync(path.join(result.output,file))),expected);
 assert.ok(!fs.readFileSync(path.join(result.output,'index.html'),'utf8').includes('legacy-notice-v0187'),'restore the original calculator without migration notice');
 const manifestPath=path.join(artifacts,'migration-artifacts.json'),file=Object.keys(contract.files).find(name=>name.endsWith('.js')),source=path.join(backup,file),originalBytes=fs.readFileSync(source);
 const cases=['missing-file','corrupt-file','rehashed-corruption','truncated-inventory','unsafe-inventory','wrong-release','symlink'];
 for(const mode of cases){
  const fixture=structuredClone(manifest),output=path.join(temp,'reject-'+mode);
  if(mode==='missing-file')fs.rmSync(source);
  if(mode==='corrupt-file'||mode==='rehashed-corruption')fs.writeFileSync(source,'invalid backup bytes');
  if(mode==='rehashed-corruption')fixture.rollback.files[file]=hash(fs.readFileSync(source));
  if(mode==='truncated-inventory')delete fixture.rollback.files[file];
  if(mode==='unsafe-inventory')fixture.rollback.files['../private.txt']='0'.repeat(64);
  if(mode==='wrong-release')fixture.rollback.legacyCommit='0'.repeat(40);
  if(mode==='symlink'){const outside=path.join(temp,'outside.txt');fs.writeFileSync(outside,'synthetic outside bytes');fs.rmSync(source);fs.symlinkSync(outside,source);}
  fs.writeFileSync(manifestPath,JSON.stringify(fixture));
  assert.throws(()=>prepareLegacyRollback(artifacts,output));assert.equal(fs.existsSync(output),false,'failed validation must write zero destination files');
  fs.rmSync(source,{force:true});fs.writeFileSync(source,originalBytes);
 }
 fs.writeFileSync(manifestPath,JSON.stringify(manifest));
 const existing=path.join(temp,'existing');fs.mkdirSync(existing);fs.writeFileSync(path.join(existing,'sentinel'),'retain');
 assert.throws(()=>prepareLegacyRollback(artifacts,existing),/new rollback output/);assert.equal(fs.readFileSync(path.join(existing,'sentinel'),'utf8'),'retain');
 assert.throws(()=>prepareLegacyRollback(artifacts,process.cwd()),/source tree/);
 assert.throws(()=>prepareLegacyRollback(artifacts,path.join(artifacts,'candidate')),/artifact evidence/);
 fs.mkdirSync('reports/v0187',{recursive:true});fs.writeFileSync('reports/v0187/rollback-drill.json',JSON.stringify({legacyCommit,preparedFiles:result.preparedFiles,negativeCases:cases,independentFrozenHashes:true,productionMutations:0,deploymentPerformed:false},null,2)+'\n');
 console.log('PASS v0.187 rollback: '+result.preparedFiles+' pinned old-release files restored offline; damaged/rewritten/missing/unsafe/symlink evidence rejected before any destination write; existing output retained; zero production mutations');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
