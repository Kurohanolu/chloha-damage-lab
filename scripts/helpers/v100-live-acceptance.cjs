'use strict';
// A recorded pre-acceptance deployment is evidence for promotion, not proof that
// the final metadata commit is currently live. The publisher separately fetches
// and hashes the exact final public artifacts before creating a stable Release.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {communityPolicy,loadCommunityBaseline}=require('./community-pinned-baseline.cjs');
const {dependencies,legacyCommit}=require('../v0187-build-sites.cjs');
const {publishedCommit}=require('./v0188-followup-review.cjs');
const digest=body=>crypto.createHash('sha256').update(body).digest('hex');
const git=args=>execFileSync('git',args,{maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const acceptanceKeys=['liveAcceptanceSourceCommit','liveAcceptanceDeploymentRun','liveAcceptanceEvidence','liveAcceptanceObservedAtJST'];
function acceptanceFiles(source){
 assert.match(source,/^[a-f0-9]{40}$/,'Acceptance source must be an immutable SHA');
 const read=file=>git(['show',source+':'+file]),old=file=>git(['show',legacyCommit+':'+file]);
 const html=read('index.html').toString(),release=JSON.parse(read('release.json'));
 const files={};
 for(const file of new Set(['index.html','release.json',...dependencies(html),...Object.values(release.branding),'brand-preview.html','.nojekyll']))files['singularity/'+file]=digest(file==='.nojekyll'?Buffer.alloc(0):read(file));
 if(communityPolicy(release)){
  const community=loadCommunityBaseline();for(const [file,body]of community.files)files['chloha-damage-lab/'+file]=digest(body);
  return files;
 }
 const original=old('index.html').toString(),css=read('migration/legacy-notice-v0187.css'),js=read('migration/legacy-notice-v0187.js');
 const legacyHTML=original.replace('</head>','<link rel="stylesheet" href="./legacy-notice-v0187.css?v='+digest(css).slice(0,16)+'"></head>').replace('</body>','<script defer src="./legacy-notice-v0187.js?v='+digest(js).slice(0,16)+'"></script></body>');
 for(const file of new Set(['index.html','release.json',...dependencies(original),'legacy-notice-v0187.css','legacy-notice-v0187.js','.nojekyll'])){
  const body=file==='index.html'?legacyHTML:file==='legacy-notice-v0187.css'?css:file==='legacy-notice-v0187.js'?js:file==='.nojekyll'?Buffer.alloc(0):old(file);
  files['chloha-damage-lab/'+file]=digest(body);
 }
 return files;
}
function verifyStableLiveAcceptance(release){
 assert.ok(['v1.0.0','v1.1.0-pre.1','v1.1.0-pre.2','v1.1.0-pre.3','v1.1.0-pre.4','v1.1.0-pre.5','v1.1.0-pre.6','v1.1.0-pre.7','v1.1.0-pre.8','v1.1.0-pre.9','v1.1.0-pre.11'].includes(release.tag),'Live acceptance policy is explicit');
 const m=release.migration;
 assert.equal(m.liveTargetVerified,true,'Stable publication needs actual live acceptance');
 assert.match(m.liveAcceptanceSourceCommit||'',/^[a-f0-9]{40}$/,'Stable live acceptance source SHA required');
 assert.match(m.liveAcceptanceDeploymentRun||'',/^https:\/\/github\.com\/Kurohanolu\/singularity\/actions\/runs\/[1-9]\d*$/,'Stable deployment run must identify the actual public repository');
 assert.match(m.liveAcceptanceObservedAtJST||'',/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?\+09:00$/,'Stable live acceptance must record a JST timestamp');
 assert.ok(Number.isFinite(Date.parse(m.liveAcceptanceObservedAtJST)),'Valid live acceptance timestamp required');
 const evidence=m.liveAcceptanceEvidence;
 assert.match(evidence||'',/^docs\/[a-zA-Z0-9_./-]+\.json$/,'Stable live acceptance requires a repository JSON receipt');
 assert.ok(!evidence.split('/').some(part=>part==='..'||part.startsWith('.')),'Unsafe acceptance path');
 assert.equal(fs.lstatSync(evidence).isFile(),true,'Acceptance receipt must be a regular file');
 assert.ok(fs.realpathSync(evidence).startsWith(fs.realpathSync(process.cwd())+path.sep),'Acceptance receipt must remain inside the checkout');
 const source=m.liveAcceptanceSourceCommit,sourceTree=git(['rev-parse',source+'^{tree}']).toString().trim();
 const deployed=JSON.parse(git(['show',source+':release.json']));
 assert.equal(deployed.tag,release.tag,'Accepted deployment must have this stable identity');
 assert.equal(deployed.migration.liveTargetVerified,false,'Receipt source must be the real approved deployment before acceptance metadata');
 assert.ok(acceptanceKeys.every(key=>!Object.hasOwn(deployed.migration,key)),'Pre-acceptance source must not carry inherited acceptance fields');
 require('../verify-publication-approval.cjs').verifyCutoverApproval(deployed);
 const expected=structuredClone(deployed);expected.migration.liveTargetVerified=true;
 for(const key of acceptanceKeys)expected.migration[key]=m[key];
 assert.deepEqual(release,expected,'Acceptance promotion may only add its live flag and four explicit receipt bindings');
 const receipt=JSON.parse(fs.readFileSync(evidence,'utf8'));
 const rollbackSourceCommit=release.tag==='v1.1.0-pre.11'?'46f930797e662be0d01e974f98ddde6de7b414c0':release.tag==='v1.1.0-pre.9'?'0b1f8fffea3b1d063036d00fd712b0a0e9695111':release.tag==='v1.1.0-pre.8'?'66a085ba325655bc9369656ea0645f7f6f997127':release.tag==='v1.1.0-pre.7'?'2fb5655a89e076df5993a3294bddbe1bf31afa58':release.tag==='v1.1.0-pre.6'?'82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74':release.tag==='v1.1.0-pre.5'?'61d87e82995bc60d4564aaf57a52dfc1fd859e4c':release.tag==='v1.1.0-pre.4'?'082ab180bc8835304d959f583d4968e0565bdea3':release.tag==='v1.1.0-pre.3'?'aba2d0558948e2a4dd375074fb11fd428edf6222':release.tag==='v1.1.0-pre.2'?'83af29133927a19fc7e0f9273c0e194c54384ae5':release.tag==='v1.1.0-pre.1'?'0b270c1452505268364659edd402209b00b28673':publishedCommit;
 assert.deepEqual(receipt,{schemaVersion:1,releaseTag:release.tag,sourceCommit:source,sourceTree,deploymentRun:m.liveAcceptanceDeploymentRun,observedAtJST:m.liveAcceptanceObservedAtJST,result:'passed',currentUrl:release.publicUrl,legacyUrl:m.legacyUrl,files:acceptanceFiles(source),rollbackSourceCommit},'Stable acceptance receipt must exactly match the deployed source, both public inventories and rollback reference');
 return {sourceCommit:source,sourceTree,files:Object.keys(receipt.files).length};
}
module.exports={acceptanceFiles,verifyStableLiveAcceptance};
