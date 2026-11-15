'use strict';
// New candidate packaging contract. Historical v0187 byte normalization stays
// unchanged; localization is not a reason to relax production/rollback safety.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {buildSites,dependencies,assetReferences,legacyCommit}=require('../scripts/v0187-build-sites.cjs');
const {verifyPublication}=require('../scripts/verify-publication-approval.cjs');
const stable='0b270c1452505268364659edd402209b00b28673';
const old=(ref,file)=>execFileSync('git',['show',ref+':'+file],{maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
const html=fs.readFileSync('index.html','utf8'),stableHTML=old(stable,'index.html').toString(),legacyHTML=old(legacyCommit,'index.html').toString(),release=JSON.parse(fs.readFileSync('release.json'));
const ids=source=>new Set([...source.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));const candidateIDs=ids(html);
assert.deepEqual([...candidateIDs].sort(),[...ids(stableHTML)].sort(),'All existing input/control IDs retained; no undeclared additions');
const inline=source=>[...source.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
// Only these reviewed display/search additions may differ. A broad formatter or
// numeric normalization could conceal real calculation/state changes.
const reversals=[
 ["es:'No hay movimientos coincidentes','es-LA':'No hay movimientos coincidentes',","es:'No hay movimientos coincidentes',"],
 ["es:'No hay Pokémon coincidentes','es-LA':'No hay Pokémon coincidentes',","es:'No hay Pokémon coincidentes',"],
 ['>v1.1.0 Pre-Release 1</span>','>v1.0.0</span>'],
 ['画面の「v1.1.0 Pre-Release 1」は','画面の「v1.0.0」は'],
 ['./assets/singularity/header.webp?v=1.1.0-pre.1','./assets/singularity/header.webp?v=1.0.0'],
 ["   if(locale==='es-LA')item.setAttribute('aria-label',moveName);\n",''],
 ["  if(locale==='es-LA')return window.ChlohaEsLa?.entity(category,key,localizedName(category,key,'es'))||localizedName(category,key,'es');\n",''],
 ["   window.ChlohaPokeAPILocalizedNames?.[category]?.[key],\n   {regional:window.ChlohaEsLa?.entity(category,key,null)}","   window.ChlohaPokeAPILocalizedNames?.[category]?.[key]"],
 ["const locales=window.ChlohaLocales?.entries.map(entry=>entry.code)||['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];","const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];"],
 ["es:'Seleccionado: ','es-LA':'Seleccionado: ',","es:'Seleccionado: ',"],
 ["es:['No compatible','Solo daño básico','Estimado'],'es-LA':['No compatible','Solo daño básico','Estimado'],","es:['No compatible','Solo daño básico','Estimado'],"],
 ["es:'Variable','es-LA':'Variable',","es:'Variable',"]
];
function normalizeCandidateInline(source){let blocks=inline(source);let all=blocks.join('\n/* inline boundary */\n');for(const [after,before] of reversals){assert.equal(all.split(after).length-1,1,'One exact locale-only delta: '+after);all=all.replace(after,before);}return all;}
const stableInline=inline(stableHTML).join('\n/* inline boundary */\n');
assert.equal(normalizeCandidateInline(html),stableInline,'Every remaining inline numeric/state/event byte must match immutable stable');
for(const [before,after] of [["id=\"resetBoard\"","id=\"resetBoard\" onclick=\"window.numericTamper=true\""],["function render(){","function render(){window.numericTamper=true;"],["models=structuredClone(snapshot.models);","models=structuredClone(snapshot.models);models.att.points.attack=32;"],["window.SingularityPortraitAlt?.update(img,p);","window.SingularityPortraitAlt?.update(img,p);render();"]]){const corrupt=html.replace(before,after);assert.notEqual(corrupt,html);assert.throws(()=>assert.equal(normalizeCandidateInline(corrupt),stableInline),'Calculation/state/recalculation tampering must fail');}

assert.equal(hash(fs.readFileSync('services/feedback/src/worker.js')),hash(old(stable,'services/feedback/src/worker.js')),'Locale contract extension must not rewrite authentication/storage/Issue worker');
assert.equal(hash(fs.readFileSync(release.branding.reference)),'21f3c4ae7b0216936a227979134236dd51a1ecbe8028d7db39ba2f1865f1969c','Original Orbital S reference preserved');
assert.equal(release.tag,'v1.1.0-pre.1');assert.equal(release.channel,'prerelease');
assert.equal(release.qualityReview.ownerApproval,'pending');assert.throws(()=>verifyPublication(release),/owner|quality|review|approval/i,'New localization must not inherit stable publication approval');
const cached=[];
for(const reference of assetReferences(html)){
 const url=new URL(reference,'https://preview.invalid/'),file=url.pathname.slice(1);
 if(!/\.(?:js|css)$/.test(file))continue;
 assert.equal(url.searchParams.get('v'),release.tag.slice(1),'Exact candidate asset namespace: '+file);
 let before;try{before=old(stable,file);}catch{}
 if(!before||!fs.readFileSync(file).equals(before)){
  assert.equal(url.searchParams.get('h'),hash(fs.readFileSync(file)).slice(0,16),'Every changed/new runtime asset needs a content hash: '+file);cached.push(file);
 }
}
assert.ok(cached.includes('locale-es-la-data-v110.js')&&cached.includes('locale-es-la-v110.js'),'Both ES-LA resources are in the browser dependency/cache graph');
const inheritedApproval=structuredClone(release);inheritedApproval.qualityReview=JSON.parse(old(stable,'release.json')).qualityReview;assert.throws(()=>verifyPublication(inheritedApproval),/owner|quality|review|approval|release/i,'Stable approval cannot authorize a new localization candidate');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-v110-assets-'));
try{
 const {out,manifest}=buildSites(temp);assert.equal(manifest.publicCutoverPerformed,false);assert.equal(manifest.legacyCommit,legacyCommit);
 assert.ok(!Object.keys(manifest.files).some(f=>/(?:^|\/)(?:services|\.wrangler|node_modules|tests|docs|\.git)(?:\/|$)/.test(f)),'Private backend/development/research data must not enter public artifacts');
 for(const [file,digest] of Object.entries(manifest.files))assert.equal(hash(fs.readFileSync(path.join(out,file))),digest,'Manifest SHA256: '+file);
 for(const file of dependencies(html))assert.deepEqual(fs.readFileSync(path.join(out,'singularity',file)),fs.readFileSync(file),'Single source artifact bytes: '+file);
 assert.equal(fs.readFileSync(path.join(out,'singularity/index.html'),'utf8'),html);
 for(const file of dependencies(legacyHTML))assert.deepEqual(fs.readFileSync(path.join(out,'chloha-damage-lab',file)),old(legacyCommit,file),'Frozen old URL calculator: '+file);
 const legacy=fs.readFileSync(path.join(out,'chloha-damage-lab/index.html'),'utf8');
 assert.equal(legacy.replace(/<link rel="stylesheet" href="\.\/legacy-notice-v0187\.css\?v=[a-f0-9]{16}">/,'').replace(/<script defer src="\.\/legacy-notice-v0187\.js\?v=[a-f0-9]{16}"><\/script>/,''),legacyHTML,'Only migration notice changes old URL');
 for(const [file,digest] of Object.entries(manifest.rollback.files)){
  const body=fs.readFileSync(path.join(out,manifest.rollback.artifactPath,file));assert.equal(hash(body),digest);if(file!=='.nojekyll')assert.deepEqual(body,old(legacyCommit,file),'Non-destructive rollback inventory: '+file);
 }
 assert.equal(manifest.rollback.legacyCommit,legacyCommit);assert.throws(()=>buildSites(temp),/empty output/);assert.throws(()=>buildSites(process.cwd()),/source tree/);
 fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/artifact-contract.json',JSON.stringify({stable,legacyCommit,publicationBlocked:true,productionMutations:0,candidateControlIDs:candidateIDs.size,preservedControlIDs:ids(stableHTML).size,changedRuntimeCacheKeys:cached,publicAssets:Object.keys(manifest.files).length,rollbackAssets:Object.keys(manifest.rollback.files).length,manifestHashesVerified:true,passed:true},null,2)+'\n');
 console.log('PASS v1.1.0 private candidate packaging: unchanged Worker/control IDs/logo, version+content cache keys, exact artifact hashes, frozen old URL/rollback and owner-pending publication');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
