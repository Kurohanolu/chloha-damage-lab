'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
// A metadata-only promotion must still produce every exact-SHA required run.
const workflows=['damage-lab-ci.yml','pages-live-smoke.yml','showdown-differential.yml','showdown-compare.yml','ui-smoke.yml','v0184-engine-baseline.yml','v0185-feedback.yml','v0186-accuracy-mechanics.yml','v0187-singularity-migration.yml','v0188-quality-remediation.yml','v100-stable-promotion.yml'];
for(const file of workflows){
 const source=fs.readFileSync('.github/workflows/'+file,'utf8');
 for(const event of ['pull_request','push']){
  const section=new RegExp('^  '+event+':[^\\n]*\\n([\\s\\S]*?)(?=^  [a-z_]+:|^permissions:|^jobs:|^env:|$(?![\\s\\S]))','m').exec(source);
  assert.ok(section,file+' must support '+event);
  if(/^    paths:/m.test(section[1]))assert.match(section[1],/^      - ['"]?release\.json['"]?$/m,file+' must run after metadata-only '+event);
 }
}
const target=fs.readFileSync('deployment/singularity-pages.yml','utf8'),publisher=fs.readFileSync('.github/workflows/publish-release.yml','utf8');
assert.match(target,/required\.push\('v1\.0\.0 Stable Promotion'\)/);assert.match(publisher,/required\.push\('v1\.0\.0 Stable Promotion'\)/);
assert.match(target,/github\.ref == 'refs\/heads\/main'/);assert.match(target,/paths: \[deployment-request\.json\]/);
const requestScript=target.split("          node <<'NODE'\n")[1]?.split('          NODE')[0];assert.ok(requestScript);
let passed=0;
for(const request of [{source_sha:'a'.repeat(40)},{source_sha:'main'},{source_sha:'A'.repeat(40)},{source_sha:'a'.repeat(40),command:'bad'},['a'.repeat(40)],null]){
 const writes=[];const sandbox={require:n=>n==='node:fs'?{readFileSync:()=>JSON.stringify(request),appendFileSync:(p,s)=>writes.push([p,s])}:require(n),process:{env:{DEPLOY_EVENT:'push',GITHUB_OUTPUT:'out',GITHUB_ENV:'env'}}};
 if(request?.source_sha==='a'.repeat(40)&&Object.keys(request).length===1){vm.runInNewContext(requestScript,sandbox);assert.deepEqual(writes,[['out','source_sha='+'a'.repeat(40)+'\n'],['env','SOURCE_SHA='+'a'.repeat(40)+'\n']]);}
 else{assert.throws(()=>vm.runInNewContext(requestScript,sandbox));assert.equal(writes.length,0);}
 passed++;
}
assert.ok(publisher.indexOf('Verify every stable asset')<publisher.indexOf('publishArchive({'),'Live verification must precede release writes');
assert.ok(publisher.includes('verifyDeploymentRun({'),'Actual immutable deployment run proof is required');
const freshCheck=publisher.indexOf("require('node:child_process').execFileSync(process.execPath, ['scripts/v100-live-acceptance.cjs', '--publication']");
assert.ok(freshCheck>publisher.indexOf('if (!verified) throw'),'Refresh public bytes after exact CI completes');
assert.ok(freshCheck>publisher.indexOf('await verifyDeploymentRun({')&&freshCheck<publisher.indexOf('await publishArchive({'),'Refresh actual bytes after deployment proof and immediately before publication writes');
console.log('PASS stable CI/promotion: all11requiredworkflow metadata triggers, target and publisher stable gates, '+passed+' actual request-parser safety cases, main-only deployment and pre-publication acceptance checks');
