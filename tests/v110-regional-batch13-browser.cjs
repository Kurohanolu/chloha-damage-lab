'use strict';
// Historical regional publication evidence does not expand mechanics support.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const baseline='c52a65f4487fa8b4ceb2cd1ac5d85a2334697854',locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
// Species IDs independently checked in the existing embedded roster, not added by this release.
const cases=[['マイペース','unsupported:マイペース','candidate093_11','Ritmo Propio'],['リーフガード','unsupported:リーフガード','meganium','Defensa Hoja']];
const c=vm.createContext({});vm.runInContext('window=globalThis',c);
for(const f of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f});
const combined={};for(const category of ['pokemon','moves','abilities','items']){combined[category]={};for(const table of [c.ChlohaPokeAPILocalizedNames[category],c.ChlohaLocalizedNames[category]])for(const [id,names]of Object.entries(table||{}))combined[category][id]={...combined[category][id],...names};}
const index=c.ChlohaNameCatalogAdapter.build(c.ChlohaNames,c.ChlohaNameSearch,combined);let indexQueries=0;
for(const [key,,,name]of cases)for(const query of [name,name.toUpperCase(),name.toLowerCase()]){assert.ok(c.ChlohaNameSearch.search(index,'abilities',query).includes(key),'Canonical regional ability search: '+query);indexQueries++;}
const ready=p=>p.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&(!!window.ChlohaLastCalculation||(!document.getElementById('error').hidden&&document.getElementById('output').hidden)));
const state=p=>p.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),a:window.ChlohaLastCalculation?.a??null,r:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden,copyDisabled:document.getElementById('copy').disabled},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
const expose=c=>c.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{let lab,browser,context;const evidence={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),uncommittedPreview:!!execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim(),baseline,startedAt:new Date().toISOString(),realDevice:false,productionMutations:0,indexQueries,locales,widths:[390,1440],rows:[],defaultRows:[],searchScope:'Canonical catalog lookup plus native ability select keyboard typeahead; no custom free-text ability widget claimed'};try{
 lab=await startLab({compare:true,comparisonRef:baseline});browser=await launchBrowser();
 for(const width of evidence.widths){
  context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const a=await context.newPage(),b=await context.newPage(),errors=[];
  for(const p of [a,b]){p.on('pageerror',e=>errors.push(e.message));await blockExternal(context,p);}await a.goto(lab.origin+'/candidate/');await b.goto(lab.origin+'/baseline/');for(const p of [a,b])await ready(p);
  for(const locale of locales){
   for(const p of [a,b]){await p.selectOption('#chloha-locale',locale);await p.locator('#resetCalculation').click();await ready(p);}
   const canonical=await state(b);assert.notEqual(JSON.parse(canonical).r,null);assert.equal(JSON.parse(canonical).r.rolls.length,16);assert.equal(await state(a),canonical,'Default numerical/state parity');
   for(const p of [a,b]){assert.equal(await p.evaluate(()=>ChlohaPersistence.save()),true);await p.reload();await ready(p);assert.equal(await p.locator('#chloha-locale').inputValue(),locale);assert.equal(await state(p),canonical,'Supported default persists exactly');}
   evidence.defaultRows.push({width,locale,numericParity:true,saveReload:true});
   for(const [key,id,species,name]of cases){
    for(const p of [a,b]){assert.equal(await p.evaluate(({species,key})=>ChlohaGameData.pokemon.find(p=>p.id===species)?.abilities.includes(key),{species,key}),true);await expose(p.locator('#dbAttPokemon'));await p.selectOption('#dbAttPokemon',species);await expose(p.locator('#attAbility'));assert.equal(await p.locator('#attAbility option[value="'+id+'"]').count(),1);await p.selectOption('#attAbility',id);await ready(p);}
    const old=await b.evaluate(k=>ChlohaEsLa.metadata('abilities',k),key),now=await a.evaluate(k=>ChlohaEsLa.metadata('abilities',k),key);assert.equal(old.status,'unverified');assert.equal(now.status,'official');assert.equal(now.officialChampions,false);assert.equal(old.officialChampions,false);assert.equal(now.name,name);assert.equal(old.name,name);assert.deepEqual(now.aliases,old.aliases);assert.deepEqual(now.canonicalIds,[id]);assert.deepEqual(now.canonicalIds,old.canonicalIds);
    const label=p=>p.locator('#attAbility option:checked').textContent();assert.equal(await label(a),await label(b),'All ten displayed labels unchanged');
    if(locale==='es-LA'){
     assert.ok((await label(a)).includes(name));const control=a.locator('#attAbility');await control.selectOption('none');await control.focus();await a.keyboard.press('Home');await a.keyboard.type(name,{delay:30});await a.keyboard.press('Tab');assert.equal(await control.inputValue(),id,'Native regional keyboard typeahead');await ready(a);
    }
    const blocked=await state(b),parsed=JSON.parse(blocked);assert.equal(parsed.a,null);assert.equal(parsed.r,null);assert.equal(parsed.errorHidden,false);assert.equal(parsed.outputHidden,true);assert.equal(parsed.copyDisabled,true);assert.equal(await state(a),blocked,'Still unsupported; exact blocked state parity');
    for(const p of [a,b]){assert.equal(await p.evaluate(()=>ChlohaPersistence.save()),true);await p.reload();await ready(p);assert.equal(await p.locator('#chloha-locale').inputValue(),locale);assert.equal(await p.locator('#attAbility').inputValue(),id);assert.equal(await state(p),blocked,'Unsupported ID/state survives reload without enabling calculations');}
    evidence.rows.push({width,locale,id,stillUnsupported:true,numericParity:true,saveReload:true,visibleRegionalTypeahead:locale==='es-LA'});
   }
  }
  assert.deepEqual(errors,[]);await context.close();context=null;
 }
 assert.equal(evidence.rows.length,40);assert.equal(evidence.defaultRows.length,20);assert.equal(evidence.rows.filter(r=>r.visibleRegionalTypeahead).length,4);evidence.passed=true;console.log('PASS batch13:40 native unsupported/save cases,20 supported numeric/save cases,6 canonical searches and4 regional typeahead cases; ten locales/two widths');
 }catch(e){evidence.passed=false;evidence.error=e.message;throw e;}finally{evidence.finishedAt=new Date().toISOString();fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/regional-batch13-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
