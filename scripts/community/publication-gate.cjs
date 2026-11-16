'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
 const p=path.join(dir,e.name);assert.ok(!e.isSymbolicLink(),'No symbolic link in release');
 return e.isDirectory()?walk(p):[p];
});
function verify(site,{scope='all',evidencePath=path.join(root,'docs/community/rights-clearance.json')}={}){
 assert.ok(['all','publicWeb','communityZip'].includes(scope),'Unknown delivery scope');
 const proof=JSON.parse(fs.readFileSync(evidencePath)),policy=JSON.parse(fs.readFileSync(path.join(site,'release.json')));
 const scopes=scope==='all'?['publicWeb','communityZip']:[scope];
 assert.equal(proof.baselineCommit,'0b270c1452505268364659edd402209b00b28673');
 assert.equal(policy.baselineCommit,proof.baselineCommit);
 assert.equal(proof.reviewMethod,'individual-content-and-license-assessment');
 assert.equal(sha(fs.readFileSync(path.join(root,proof.assessment.path))),proof.assessment.sha256,'Reviewed rationale must be unchanged');
 assert.equal(policy.distribution.mode,'community-limited');
 for(const k of ['publicArchive','publicDownloadLink','publicApplicationRepository','outsideRedistribution','publicModifiedVersions','commercialSale'])assert.equal(policy.distribution[k],false,k);
 assert.equal(policy.distribution.preserveExistingLicenses,true);
 assert.equal(policy.web.urlIsAccessControl,false);assert.equal(policy.web.archiveDownload,false);
 const files=walk(site).map(p=>path.relative(site,p).split(path.sep).join('/')).sort();
 assert.deepEqual(files,Object.keys(proof.files).sort(),'Exact individually reviewed file set');
 const categories=new Set(['owner-authorized','factual-runtime-projection','identifying-names','upstream-mit','upstream-bsd','license-notice','review-evidence']);
 for(const f of files){
  const a=proof.files[f];assert.match(a.sha256,/^[a-f0-9]{64}$/);assert.equal(sha(fs.readFileSync(path.join(site,f))),a.sha256,'Reviewed file SHA-256: '+f);
  assert.ok(categories.has(a.category),'Unreviewed category: '+f);assert.ok(a.reason&&a.reason.length>25,'Individual reason: '+f);
  assert.ok(!/\.zip(?:\.sha256)?$|(^|\/)private\//i.test(f),'No public package asset');
  for(const s of scopes)assert.equal(a.scopes[s],'permitted-with-conditions','Missing scoped assessment: '+s+' '+f);
 }
 for(const s of scopes){assert.equal(proof.scopes[s].decision,'permitted-with-conditions');assert.ok(proof.scopes[s].reason.length>30);}
 for(const f of ['licenses/Pokemon-Showdown-MIT.txt','licenses/PokeAPI-BSD-3-Clause.txt','licenses/Chloha-Labs-Prior-MIT.txt'])assert.ok(proof.files[f],'Required notice: '+f);
 const manifest=JSON.parse(fs.readFileSync(path.join(site,'application-manifest.json')));
 assert.equal(manifest.applicationSHA256,proof.applicationSHA256);
 for(const [f,d] of Object.entries(manifest.files))assert.equal(sha(fs.readFileSync(path.join(site,f))),d);
 const canonical=Object.entries(manifest.files).map(([f,d])=>d+'  '+f+'\n').join('');assert.equal(sha(canonical),manifest.applicationSHA256);
 const projection=JSON.parse(fs.readFileSync(path.join(site,'data-projection.json')));
 assert.equal(projection.ChlohaPokemonDB.records,373);assert.equal(projection.ChlohaMovesDB.records,335);
 for(const row of Object.values(projection))assert.equal(row.allRetainedValuesUnchanged,true);
 return {status:'passed',scope,reviewedFiles:files.length,applicationSHA256:proof.applicationSHA256,independentTechnicalCIRequired:true};
}
module.exports={verify};
if(require.main===module){try{
 const args=process.argv.slice(2);let scope='all',site=path.join(root,'dist/community/site');
 while(args.length){const key=args.shift(),value=args.shift();if(key==='--scope')scope=value;else if(key==='--site')site=path.resolve(value);else throw new Error('Unknown gate argument');}
 console.log('PASS scoped rights evidence: '+JSON.stringify(verify(site,{scope})));
}catch(e){console.error('BLOCKED — '+e.message);process.exitCode=1;}}
