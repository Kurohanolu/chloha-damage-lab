'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'dist/community'),site=path.join(out,'site');
const BASE='0b270c1452505268364659edd402209b00b28673',zip='Chloha-Damage-Lab-v1.0.0-Community-Edition.zip';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=f=>execFileSync('git',['show',BASE+':'+f],{cwd:root,maxBuffer:16*1024*1024});
const read=f=>fs.readFileSync(path.join(site,f));
const before=original('index.html').toString(),after=read('index.html').toString();
const protectedFiles=['battle-data-v0184.js','move-mechanics-data-v0184.js','ability-data-v0184.js','damage-engine-v0184.js','damage-calculator-v0184.js','damage-ui-adapter-v0184.js','multi-hit.js','variable-power.js','pokemon-weights-v0181.js','weight-power.js','persistence-v0188.js'];
for(const f of protectedFiles)assert.deepEqual(read(f),original(f),'Protected stable bytes: '+f);
for(const f of fs.readdirSync(site).filter(f=>/^(locale-|names-|i18n)/.test(f)))assert.deepEqual(read(f),original(f),'Nine-language dictionary/runtime frozen: '+f);
// Independently compare embedded data and all executable inline behavior. The
// presentation template and artwork ID table are deliberately outside this set.
for(const name of ['ChlohaPokemonDB','ChlohaMovesDB','ChlohaMovePolicy']){
 const expression=new RegExp('const '+name+' = (.*);');
 assert.equal(after.match(expression)[1],before.match(expression)[1],'Embedded registry unchanged: '+name);
}
function logic(html){return [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].replace(/app\.innerHTML=`[\s\S]*?<\/aside>`;/,'/* UI */').replace(/window\.ChlohaSpriteIds=[^\n]+/,'/* artwork */'));}
assert.deepEqual(logic(after),logic(before),'Every inline calculation/model/event handler is preserved');
assert.ok(after.includes('window.ChlohaSpriteIds={};'));
assert.ok(!after.includes('assets/singularity/'));
assert.ok(!after.includes('src="./feedback-'));
assert.ok(!fs.readdirSync(site).some(f=>/feedback|\.png|\.webp|\.woff|\.env/.test(f)));
const manifest=JSON.parse(read('application-manifest.json'));
for(const [f,h] of Object.entries(manifest.files))assert.equal(hash(read(f)),h,'Application hash: '+f);
assert.equal(hash(Object.entries(manifest.files).map(([f,h])=>h+'  '+f+'\n').join('')),manifest.applicationSHA256);
const inventory=JSON.parse(read('rights-inventory.json'));
for(const [f,entry] of Object.entries(inventory.files))if(entry.sha256)assert.equal(hash(read(f)),entry.sha256,'Inventory: '+f);
assert.equal(hash(fs.readFileSync(path.join(out,zip))),fs.readFileSync(path.join(out,zip+'.sha256'),'utf8').split(' ')[0]);
// The ZIP is extracted into a new directory. Exact byte equality, safe paths and
// the identical file set ensure the web tree and ZIP contain the same app.
execFileSync('python3',['-c',`
from pathlib import Path
import zipfile,hashlib
root=Path(${JSON.stringify(out)})
dest=root/'restored'
if dest.exists():raise RuntimeError('Fresh extraction required')
with zipfile.ZipFile(root/${JSON.stringify(zip)}) as z:
 for info in z.infolist():
  p=Path(info.filename)
  assert not p.is_absolute() and '..' not in p.parts and p.parts[0]=='Chloha-Damage-Lab'
  assert info.file_size < 16*1024*1024
 z.extractall(dest)
a={str(p.relative_to(root/'site')):p.read_bytes() for p in (root/'site').rglob('*') if p.is_file()}
b={str(p.relative_to(dest/'Chloha-Damage-Lab')):p.read_bytes() for p in (dest/'Chloha-Damage-Lab').rglob('*') if p.is_file()}
assert a==b
`],{stdio:'inherit'});
const runtime=protectedFiles.slice(0,8);
const load=reader=>{const c=vm.createContext({});vm.runInContext('window=globalThis',c);for(const f of runtime)vm.runInContext(reader(f).toString(),c);return c;};
const old=load(original),candidate=load(read);
const normalize=x=>JSON.parse(JSON.stringify(x,(_,v)=>Object.prototype.toString.call(v)==='[object Map]'?{mapEntries:[...v]}:v));
const fixtures=JSON.parse(original('tests/fixtures/v0184-public-baseline.json')).cases;
let comparisons=0;
for(const fixture of fixtures){
 const call=c=>{try{return {output:normalize(fixture.entry==='core'?c.ChlohaDamageEngine.calculate(structuredClone(fixture.input)):c.ChlohaDamageCalculator.calculate(structuredClone(fixture.input),structuredClone(fixture.options||{})))};}catch(e){return {error:{name:e.name,message:e.message}};}};
 assert.deepEqual(call(candidate),call(old),fixture.name);comparisons++;
}
// Run the existing independent Showdown oracles against the packaged app,
// without editing their assertions or expected values.
const validation=path.join(out,'validation');fs.mkdirSync(path.join(validation,'tests'),{recursive:true});
for(const f of fs.readdirSync(site))if(fs.statSync(path.join(site,f)).isFile())fs.copyFileSync(path.join(site,f),path.join(validation,f));
for(const f of ['showdown-compare.mjs','showdown-differential.mjs'])fs.writeFileSync(path.join(validation,'tests',f),original('tests/'+f));
fs.mkdirSync(path.join(root,'reports/community'),{recursive:true});
const report={status:'passed',baselineCommit:BASE,protectedFiles:protectedFiles.length,allInlineLogicUnchanged:true,allRegistriesUnchanged:true,nineLanguageFilesUnchanged:true,zipExactFileParity:true,baselineComparisons:comparisons,applicationSHA256:manifest.applicationSHA256,zipSHA256:hash(fs.readFileSync(path.join(out,zip))),publicationStatus:'blocked'};
fs.writeFileSync(path.join(root,'reports/community/package.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS Community package: '+JSON.stringify(report));
