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
