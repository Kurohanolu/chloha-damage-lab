'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const M=require('../docs/data/v110-es-la-regional-batch6.json'),locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const catalogContext=vm.createContext({});vm.runInContext('window=globalThis',catalogContext);
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(fs.readFileSync(file,'utf8'),catalogContext,{filename:file});
const combined={};for(const category of ['pokemon','moves','abilities','items']){combined[category]={};for(const table of [catalogContext.ChlohaPokeAPILocalizedNames[category],catalogContext.ChlohaLocalizedNames[category]])for(const [key,names] of Object.entries(table||{}))combined[category][key]={...combined[category][key],...names};}
const aliasIndex=catalogContext.ChlohaNameCatalogAdapter.build(catalogContext.ChlohaNames,catalogContext.ChlohaNameSearch,combined);
const ready=page=>page.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&(!!window.ChlohaLastCalculation||(!document.getElementById('error').hidden&&document.getElementById('output').hidden&&document.getElementById('copy').disabled)));
const state=page=>page.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),input:window.ChlohaLastCalculation?.a??null,result:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden,copyDisabled:document.getElementById('copy').disabled},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
const expose=control=>control.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{let lab,browser,context;const evidence={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceTree:execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),realDevice:false,productionMutations:0,rows:[],widths:[390,1440],locales,abilitySearchScope:'Actual native typeahead plus shared normalized alias index, not an invented free-text widget'};try{
 assert.equal(M.observations.length,41);lab=await startLab();browser=await launchBrowser();
 for(const width of evidence.widths){
  context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await blockExternal(context,page);await page.goto(lab.origin+'/candidate/');await ready(page);
  for(const o of M.observations){
   await page.selectOption('#chloha-locale','es-LA');await page.locator('#resetCalculation').click();await ready(page);
   const ability=o.category==='abilities',pokemon=o.category==='pokemon',id=o.canonicalIds[0],side=id==='heatproof'?'def':'att';let species=null,control;
   if(ability){
    species=await page.evaluate(key=>ChlohaGameData.pokemon.find(p=>(p.abilities||[]).includes(key))?.id??null,o.key);
    if(species){const selector=page.locator('#db'+(side==='att'?'Att':'Def')+'Pokemon');await expose(selector);await selector.selectOption(species);}else assert.equal(id,'transistor','Only existing manual Transistor option lacks a roster association; no species invented');
    control=page.locator('#'+side+'Ability');await expose(control);assert.ok((await control.locator('option[value="'+id+'"]').textContent()).includes(o.esLA));
    await control.selectOption('none');await control.focus();await page.keyboard.press('Home');await page.keyboard.type(o.esLA,{delay:10});await page.keyboard.press('Tab');assert.equal(await control.inputValue(),id,'Actual native ability typeahead');
    for(const query of new Set([o.esLA,o.esLA.toUpperCase(),o.esLA.normalize('NFD').replace(/[\u0300-\u036f]/g,'')]))assert.ok(catalogContext.ChlohaNameSearch.search(aliasIndex,'abilities',query).includes(o.key),'Real normalized alias catalog '+query);
   }else{
    const input=page.locator(pokemon?'#attSearch':'#moveSearch'),list=pokemon?'attSuggestions':'moveSuggestions';control=page.locator(pokemon?'#dbAttPokemon':'#dbMove');await expose(input);
    for(const query of new Set([o.esLA,o.esLA.toUpperCase(),o.esLA.normalize('NFD').replace(/[\u0300-\u036f]/g,'')])){await input.fill(query);const option=page.locator('#'+list).getByRole('option',{name:o.esLA,exact:true});assert.equal(await option.count(),1,'Unique whole visible query '+query);await option.click();assert.equal(await control.inputValue(),id,'Canonical ID from real search');}
   }
   await ready(page);const before=await state(page),snapshot=JSON.parse(before),blocked=snapshot.result===null;
   if(ability)assert.equal(blocked,id.startsWith('unsupported:'),'Existing supported/unsupported ability boundary retained');
   assert.equal(snapshot.outputHidden,blocked);assert.equal(snapshot.errorHidden,!blocked);if(blocked)assert.equal(snapshot.copyDisabled,true);
   if(!blocked){const r=snapshot.result;if(r.multiHitDistribution){assert.ok(r.multiHitDistribution.mapEntries.length);assert.ok(Math.abs(r.multiHitDistribution.mapEntries.reduce((sum,[,p])=>sum+p,0)-1)<1e-9);for(const rolls of Array.isArray(r.hitRolls[0])?r.hitRolls:[r.hitRolls])assert.equal(rolls.length,16);}else if(r.hitRolls){assert.equal(r.hitRolls.length,16);assert.equal(r.rolls.length,256);}else assert.equal(r.rolls.length,16);}
   const metadata=await page.evaluate(({category,key})=>ChlohaEsLa.metadata(category,key),o);assert.equal(metadata.name,o.esLA);assert.equal(metadata.status,'official');assert.equal(metadata.officialChampions,o.officialChampions);
   for(const locale of locales){
    await page.selectOption('#chloha-locale',locale);await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await control.inputValue(),id);const label=await control.locator('option:checked').textContent();assert.ok(label.trim());if(locale==='es-LA')assert.ok(label.includes(o.esLA));
    assert.equal(await state(page),before,'Complete numerical vector and canonical/blocked state '+o.key+'/'+locale);
    if(o===M.observations[0]){assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await state(page),before,'All ten locale preferences survive reload');}
   }
   assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),'es-LA');assert.equal(await control.inputValue(),id);assert.equal(await state(page),before,'Canonical selection and full numeric/fail-closed state survive reload');
   evidence.rows.push({width,category:o.category,key:o.key,id,name:o.esLA,species,side,localeSwitches:10,reload:true,blocked,unsupportedPreserved:ability&&id.startsWith('unsupported:'),passed:true});
  }
  assert.deepEqual(errors,[]);await context.close();context=null;
 }
 assert.equal(evidence.rows.length,82);assert.ok(evidence.rows.some(r=>r.unsupportedPreserved));assert.ok(evidence.rows.some(r=>!r.blocked));evidence.passed=true;console.log('PASS regional batch6: 82 real selections,820 locale/state checks,82 saved reloads, unchanged unsupported boundaries');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/regional-batch6-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
