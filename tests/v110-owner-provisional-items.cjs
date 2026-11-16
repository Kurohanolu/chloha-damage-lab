'use strict';
// Preserve the exact published prior candidate provenance test in its immutable source tree.
// It verifies real approved bytes there; current Expert Belt batch has separate additive preservation and source-scope gates.
if(require('node:fs').existsSync('docs/data/v110-es-la-expert-belt-capture.json')){
 const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9',tree='604f0632eaf2d28e2fbd40012d68133050f72f30';
 assert.equal(execFileSync('git',['rev-parse',ref+'^{tree}'],{encoding:'utf8'}).trim(),tree);
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-pre6-history-')),worktree=path.join(parent,'source');
 let status=1;
 try{
  execFileSync('git',['worktree','add','--detach',worktree,ref],{stdio:'pipe'});
  const result=spawnSync(process.execPath,['tests/v110-owner-provisional-items.cjs'],{cwd:worktree,stdio:'inherit'});
  assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,0,'Unmodified published prior candidate provenance must pass');
  assert.equal(execFileSync('git',['status','--porcelain'],{cwd:worktree,encoding:'utf8'}).trim(),'');
  fs.mkdirSync('reports/v110',{recursive:true});
  const report=JSON.parse(fs.readFileSync(path.join(worktree,'reports/v110/owner-provisional-items.json'),'utf8'));
  fs.writeFileSync('reports/v110/owner-provisional-items.json',JSON.stringify({...report,role:'historical immutable pre.6, not current candidate acceptance',sourceCommit:ref,sourceTree:tree},null,2)+'\n');
  status=0;
 }finally{
  try{execFileSync('git',['worktree','remove','--force',worktree],{stdio:'pipe'});}finally{fs.rmSync(parent,{recursive:true,force:true});}
 }
 process.exit(status);
}
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),S=read('docs/data/v110-es-la-source-records.json'),C=read('docs/data/v110-es-la-coverage.json'),M=read('docs/data/v110-es-la-owner-provisional-items.json'),baseline=M.baselineCommit,B=JSON.parse(execFileSync('git',['show',baseline+':docs/data/v110-es-la-coverage.json'],{encoding:'utf8',maxBuffer:32*1024*1024}));
assert.equal(baseline,'82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74');assert.equal(M.observations.length,2);assert.deepEqual(M.observations.map(o=>o.canonicalId).sort(),['assaultVest','choiceBand']);
for(const [key,id,name,hash] of [['こだわりハチマキ','choiceBand','Cinta Elección','d26ede045982ffa936c3cb0598e7dbd074c847c563e283670c07bc1ec1043fb9'],['とつげきチョッキ','assaultVest','Chaleco Asalto','b24ded9cf2a8b7136ebc0f48d23f42c0577470bc02682e74d8ed07a0130e8e65']]){
 const o=M.observations.find(o=>o.key===key),r=S.records.find(r=>r.id===o.recordId),s=S.sources.find(s=>s.id===o.sourceId),entry=C.entries.items[key],before=B.entries.items[key];
 assert.equal(o.sha256,hash);assert.equal(s.sha256,hash);assert.equal(r.ownerSelected,true);assert.equal(r.status,'provisional');assert.equal(r.officialChampions,false);assert.equal(r.targetGame,null);assert.equal(r.verificationScope,'owner-selected-provisional-name');assert.equal(s.authority,'owner-provided-provisional');assert.deepEqual(r.canonicalMatches,[{category:'items',key,canonicalIds:[id]}]);assert.equal(r.canonicalEnglish,before.en);assert.equal(r.esLA,name);assert.equal(entry.name,name);assert.equal(entry.status,'provisional');assert.equal(entry.officialChampions,false);assert.equal(entry.targetGame,null);assert.deepEqual(entry.recordIds,[r.id]);assert.deepEqual(entry.sourceIds,[s.id]);assert.deepEqual(entry.aliases,before.aliases);assert.deepEqual(entry.canonicalIds,before.canonicalIds);
}
assert.deepEqual(C.entries.items['たつじんのおび'],B.entries.items['たつじんのおび'],'Black Belt evidence cannot confirm Expert Belt');assert.equal(M.rejectedMapping.excludedCanonicalId,'expertBelt');assert.equal(M.rejectedMapping.observed,'Cinturón Negro');assert.equal(M.rejectedMapping.sha256,'75c1ffdb34bed38333a730d574e6a135383bc2fa2adcd25733326934b25b85d4');assert.equal(C.coverage.items.provisional,2);assert.equal(C.coverage.items.unverified,1);assert.equal(C.coverage.items.individuallyAttested,38);assert.equal(C.coverage.items.officialChampions,19);assert.equal(C.coverage.items.total,41);
const provisional=S.records.filter(r=>r.status==='provisional'&&r.ownerSelected);assert.equal(provisional.length,2);
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/owner-provisional-items.json',JSON.stringify({passed:true,registered:2,officialGain:0,displayNamesChanged:0,expertBeltConfirmed:false,privateImageBytesPublished:false},null,2)+'\n');console.log('PASS owner-selected provisional items: exact identity, non-official status, unchanged display and excluded Black Belt mismatch');
