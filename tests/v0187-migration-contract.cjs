'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {buildSites,dependencies,legacyCommit}=require('../scripts/v0187-build-sites.cjs');
const {verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
const old=file=>execFileSync('git',['show',legacyCommit+':'+file],{maxBuffer:16*1024*1024});
const html=fs.readFileSync('index.html','utf8'),frozen=old('index.html').toString();
// Every existing runtime module remains byte-identical, including feedback.
for(const file of dependencies(frozen).filter(file=>file.endsWith('.js')))assert.equal(hash(fs.readFileSync(file)),hash(old(file)),'unchanged v0.186 runtime: '+file);
for(const file of ['tests/fixtures/v0184-public-baseline.json','tests/fixtures/v0186-baseline-corrections.json','services/feedback/src/worker.js'])assert.equal(hash(fs.readFileSync(file)),hash(old(file)),file);
const inline=source=>[...source.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].replace(/app\.innerHTML=`[\s\S]*?<\/aside>`;/,'/* presentation template */'));
if(Number(JSON.parse(fs.readFileSync('release.json')).version)>=0.188)require('./helpers/v0188-inline-contract.cjs').verifyInline(html,frozen);
else assert.deepEqual(inline(html),inline(frozen),'inline mechanics/data/control logic must remain byte-identical outside the presentation template');
const ids=source=>[...new Set([...source.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))].sort();
assert.deepEqual(ids(html),ids(frozen),'existing input/control IDs must be preserved');
const release=JSON.parse(fs.readFileSync('release.json'));
const initialPresentationBytes=['brand-v0187.js','singularity-v0187.css',release.branding.header,release.branding.favicon,release.branding.appleTouch].reduce((sum,file)=>sum+fs.statSync(file).size,0);
assert.ok(initialPresentationBytes<80*1024,'new required presentation assets must remain under80KiB');
assert.equal(hash(fs.readFileSync(release.branding.reference)),'21f3c4ae7b0216936a227979134236dd51a1ecbe8028d7db39ba2f1865f1969c','preserve the exact supplied full logo reference bytes');
// Exercise every lifecycle state regardless of the repository's current state.
const lifecycleRelease=JSON.parse(execFileSync('git',['show','7210be99c39d75b49ea8200aad91d75801eb300a:release.json'],{encoding:'utf8'}));
const pending=structuredClone(lifecycleRelease);Object.assign(pending.migration,{status:'awaiting-owner-approval',designApproval:'pending',liveTargetVerified:false});
assert.throws(()=>verifyPublication(pending),/final owner/);
const pendingDesign=structuredClone(pending);pendingDesign.migration.status='approved';assert.throws(()=>verifyPublication(pendingDesign),/logo\/design/);
pendingDesign.migration.designApproval='approved';assert.throws(()=>verifyPublication(pendingDesign),/actual new public URL/);
pendingDesign.migration.liveTargetVerified=true;assert.doesNotThrow(()=>verifyPublication(pendingDesign));
assert.doesNotThrow(()=>verifyPublication(JSON.parse(old('release.json'))));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-contract-'));
try{
 const {out,manifest}=buildSites(temp);assert.equal(manifest.publicCutoverPerformed,false);assert.equal(manifest.legacyCommit,legacyCommit);
 for(const [file,digest] of Object.entries(manifest.files))assert.equal(hash(fs.readFileSync(path.join(out,file))),digest,file);
 assert.ok(!Object.keys(manifest.files).some(file=>/services\/|\.wrangler|node_modules|tests\/|\.git\//.test(file)),'public artifacts must exclude backend, secrets and development dependencies');
 for(const file of dependencies(frozen))assert.equal(hash(fs.readFileSync(path.join(out,'chloha-damage-lab',file))),hash(old(file)),'old URL retains its audited runtime');
 const legacy=fs.readFileSync(path.join(out,'chloha-damage-lab/index.html'),'utf8');
 const noticeReferences=[...legacy.matchAll(/(?:href|src)="(\.\/legacy-notice-v0187\.(?:css|js)\?[^\"]+)"/g)].map(match=>new URL(match[1],'https://preview.invalid/chloha-damage-lab/'));
 assert.equal(noticeReferences.length,2);
 for(const url of noticeReferences)assert.equal(url.searchParams.get('v'),manifest.files[url.pathname.slice(1)].slice(0,16),'notice cache key must follow its own content, independent of frozen calculator version');
 assert.equal(legacy.replace(/<link rel="stylesheet" href="\.\/legacy-notice-v0187\.css\?v=[a-f0-9]{16}">/,'').replace(/<script defer src="\.\/legacy-notice-v0187\.js\?v=[a-f0-9]{16}"><\/script>/,''),frozen,'only the explicit migration notice is added to the old calculator');
 assert.equal(fs.readFileSync(path.join(out,'singularity/index.html'),'utf8'),html);
 assert.throws(()=>buildSites(temp),/empty output/);assert.throws(()=>buildSites(process.cwd()),/source tree/);
 let publicationBlocked=false;try{verifyPublication(release);}catch{publicationBlocked=true;}
 fs.mkdirSync('reports/v0187',{recursive:true});fs.writeFileSync('reports/v0187/migration-contract.json',JSON.stringify({legacyCommit,unchangedRuntimeModules:dependencies(frozen).filter(f=>f.endsWith('.js')).length,publicArtifacts:Object.keys(manifest.files).length,publicationBlocked,productionMutations:0},null,2)+'\n');
 console.log('PASS v0.187 migration: frozen runtime/data/control logic, 300-case evidence, isolated public artifacts, retained legacy calculator and final-approval gates');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
