// Preserve the immutable pre16 browser proof; current screenshots have separate candidate QA.
if(['v1.1.0-pre.17','v1.1.0-pre.18','v1.1.0-pre.19'].includes(require('../release.json').tag)){
 const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {execFileSync,spawnSync}=require('node:child_process');
 const ref='a68b987d25d392076f36413e7f626ea3b71391c2',tree='c8292fafb8b927985d88ae7865ea8d755efdca76',file='tests/v110-regional-batch11-browser.cjs';
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
 assert.ok(fs.readFileSync(__filename,'utf8').endsWith(git('show',ref+':'+file)),'Every original browser assertion preserved');
 const root=path.resolve(__dirname,'..'),parent=fs.mkdtempSync(path.join(os.tmpdir(),'pre17-browser-history-')),worktree=path.join(parent,'source');let added=false;
 try{
  git('worktree','add','--detach',worktree,ref);added=true;
  const source=path.join(root,'node_modules'),target=path.join(worktree,'node_modules');
  if(fs.existsSync(source)){fs.mkdirSync(target,{recursive:true});for(const entry of fs.readdirSync(source))fs.symlinkSync(path.join(source,entry),path.join(target,entry));}
  const run=spawnSync(process.execPath,[file],{cwd:worktree,stdio:'inherit',timeout:280000});
  const evidence=path.join(worktree,'reports/v110/regional-batch11-browser.json');
  if(fs.existsSync(evidence)){const report=JSON.parse(fs.readFileSync(evidence));report.role='Historical pre16 browser evidence only; not current candidate acceptance';fs.mkdirSync('reports/v110/historical',{recursive:true});fs.writeFileSync('reports/v110/historical/pre16-batch11-browser.json',JSON.stringify(report,null,2)+'\n');}
  assert.equal(run.error,undefined);assert.equal(run.signal,null);assert.equal(run.status,0);
 }finally{try{if(added)git('worktree','remove','--force',worktree);}finally{fs.rmSync(parent,{recursive:true,force:true});}}
 console.log('PASS immutable pre16 batch11 browser proof; current candidate is checked separately');process.exit(0);
}
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const baseline='66cae82e10d28ad6115acdacc964fd3e84f51b4a',locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const ready=p=>p.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&(!!window.ChlohaLastCalculation||(!document.getElementById('error').hidden&&document.getElementById('output').hidden)));
const state=p=>p.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),a:window.ChlohaLastCalculation?.a??null,r:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden,copyDisabled:document.getElementById('copy').disabled},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
const expose=control=>control.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{let lab,browser,context;const evidence={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),baseline,realDevice:false,productionMutations:0,rows:[],widths:[390,1440],locales};try{
 lab=await startLab({compare:true,comparisonRef:baseline});browser=await launchBrowser();
 for(const width of evidence.widths){
  context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const a=await context.newPage(),b=await context.newPage(),errors=[];for(const p of [a,b]){p.on('pageerror',e=>errors.push(e.message));await blockExternal(context,p);}await a.goto(lab.origin+'/candidate/');await b.goto(lab.origin+'/baseline/');for(const p of [a,b])await ready(p);
  for(const locale of locales){
   for(const p of [a,b]){await p.selectOption('#chloha-locale',locale);await p.locator('#resetCalculation').click();await ready(p);}
   const stable=await state(b);assert.notEqual(JSON.parse(stable).r,null);assert.equal(JSON.parse(stable).r.rolls.length,16);
   const inspect=p=>p.evaluate(()=>({metadata:ChlohaEsLa.metadata('abilities','りゅうのあぎと'),associations:ChlohaGameData.pokemon.filter(p=>(p.abilities||[]).includes('りゅうのあぎと')).map(p=>p.id),catalogMember:Object.hasOwn(ChlohaNames.abilities,'りゅうのあぎと'),options:document.querySelectorAll('#attAbility option[value="dragonsMaw"],#defAbility option[value="dragonsMaw"]').length,engine:ChlohaAbilityData.ABILITY_CATALOG.dragonsMaw}));
   const before=await inspect(b),after=await inspect(a);assert.equal(before.metadata.name,"Dragon's Maw");assert.equal(before.metadata.status,'unverified');assert.equal(after.metadata.name,'Mandíbula Dragón');assert.equal(after.metadata.status,'official');assert.equal(after.metadata.officialChampions,false);assert.deepEqual(after.metadata.canonicalIds,['dragonsMaw']);assert.deepEqual(after.metadata.aliases,['Mandíbula Dragón',"Dragon's Maw"]);assert.deepEqual(after.engine,before.engine);assert.equal(after.engine.coverage,'supported');for(const x of [before,after]){assert.deepEqual(x.associations,[]);assert.equal(x.catalogMember,false);assert.equal(x.options,0);}
   assert.equal(await state(a),stable,'Catalog attestation cannot change numeric/state '+locale);
   for(const p of [a,b]){assert.equal(await p.evaluate(()=>ChlohaPersistence.save()),true);await p.reload();await ready(p);assert.equal(await p.locator('#chloha-locale').inputValue(),locale);}assert.equal(await state(a),stable);assert.equal(await state(b),stable);assert.deepEqual(await inspect(a),after);
   evidence.rows.push({width,locale,kind:'dragonsMaw-catalog-only',nativeSelection:false,numericParity:true,reload:true});
   for(const [key,id,species,name]of [['かちき','unsupported:かちき','gw092_03','Tenacidad'],['まけんき','unsupported:まけんき','roster_v0103_02','Competitivo']]){
    for(const p of [a,b]){const pokemon=p.locator('#dbAttPokemon');await expose(pokemon);await pokemon.selectOption(species);await p.locator('#attAbility').selectOption(id);await ready(p);}
    const canonical=await state(b);assert.equal(JSON.parse(canonical).a,null);assert.equal(JSON.parse(canonical).r,null);assert.equal(JSON.parse(canonical).outputHidden,true);assert.equal(JSON.parse(canonical).errorHidden,false);assert.equal(JSON.parse(canonical).copyDisabled,true);assert.equal(await state(a),canonical,'Unsupported remains fail-closed '+id+'/'+locale);
    const label=p=>p.locator('#attAbility option:checked').textContent();assert.equal(await label(a),await label(b));if(locale==='es-LA')assert.ok((await label(a)).includes(name));
    const meta=await a.evaluate(k=>ChlohaEsLa.metadata('abilities',k),key);assert.equal(meta.name,name);assert.equal(meta.status,'official');assert.equal(meta.officialChampions,false);assert.deepEqual(meta.canonicalIds,[id]);
    for(const p of [a,b]){assert.equal(await p.evaluate(()=>ChlohaPersistence.save()),true);await p.reload();await ready(p);assert.equal(await p.locator('#chloha-locale').inputValue(),locale);assert.equal(await p.locator('#attAbility').inputValue(),id);assert.equal(await state(p),canonical,'Unsupported saved state exact');}
    evidence.rows.push({width,locale,kind:id,nativeSelection:true,stillUnsupported:true,reload:true});
   }
  }
  assert.deepEqual(errors,[]);await context.close();context=null;
 }
 assert.equal(evidence.rows.length,60);evidence.passed=true;console.log('PASS batch11 browser: 20 latent-catalog numerical/save cases and 40 native unsupported/save cases across 10 locales and 2 widths; no new ability/picker');
 }catch(e){evidence.passed=false;evidence.error=e.message;throw e;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/regional-batch11-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
