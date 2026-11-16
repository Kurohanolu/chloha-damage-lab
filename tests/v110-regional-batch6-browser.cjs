'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const M=require('../docs/data/v110-es-la-regional-batch6.json'),locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const catalogContext=vm.createContext({});vm.runInContext('window=globalThis',catalogContext);
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(fs.readFileSync(file,'utf8'),catalogContext,{filename:file});
const combined={};for(const category of ['pokemon','moves','abilities','items']){combined[category]={};for(const table of [catalogContext.ChlohaPokeAPILocalizedNames[category],catalogContext.ChlohaLocalizedNames[category]])for(const [key,names] of Object.entries(table||{}))combined[category][key]={...combined[category][key],...names};}
const aliasIndex=catalogContext.ChlohaNameCatalogAdapter.build(catalogContext.ChlohaNames,catalogContext.ChlohaNameSearch,combined);
// Compare old/current real catalogs without inventing Transistor search
// membership. Only its stored ES-LA attestation alias is new.
const baseline='0b1f8fffea3b1d063036d00fd712b0a0e9695111',oldContext=vm.createContext({});vm.runInContext('window=globalThis',oldContext);
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(execFileSync('git',['show',baseline+':'+file],{encoding:'utf8',maxBuffer:32*1024*1024}),oldContext,{filename:file});
const oldCombined={};for(const category of ['pokemon','moves','abilities','items']){oldCombined[category]={};for(const table of [oldContext.ChlohaPokeAPILocalizedNames[category],oldContext.ChlohaLocalizedNames[category]])for(const [key,names]of Object.entries(table||{}))oldCombined[category][key]={...oldCombined[category][key],...names};}
const oldAliasIndex=oldContext.ChlohaNameCatalogAdapter.build(oldContext.ChlohaNames,oldContext.ChlohaNameSearch,oldCombined);
const transistorObservation=M.observations.find(o=>o.category==='abilities'&&o.key==='トランジスタ');assert.ok(transistorObservation);
const transistorRuntime=JSON.parse(JSON.stringify(catalogContext.ChlohaEsLa.metadata('abilities','トランジスタ')));
assert.deepEqual(Object.keys(transistorRuntime).sort(),['name','status','sourceIds','targetGame','officialChampions','fallback','aliases','canonicalIds'].sort(),'Exact generated browser metadata API, not full audit-record fields');
assert.equal(transistorRuntime.name,'Transistor');assert.equal(transistorRuntime.status,'official');assert.equal(transistorRuntime.officialChampions,false);assert.deepEqual(transistorRuntime.canonicalIds,['transistor']);assert.deepEqual(transistorRuntime.aliases,['Transistor']);assert.deepEqual(transistorRuntime.sourceIds,transistorObservation.sourceIds);assert.equal(Object.hasOwn(transistorRuntime,'relatedRecordIds'),false);
const ready=page=>page.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&(!!window.ChlohaLastCalculation||(!document.getElementById('error').hidden&&document.getElementById('output').hidden&&document.getElementById('copy').disabled)));
const state=page=>page.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),input:window.ChlohaLastCalculation?.a??null,result:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden,copyDisabled:document.getElementById('copy').disabled},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
const expose=control=>control.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{let lab,browser,context;const evidence={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceTree:execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),realDevice:false,productionMutations:0,rows:[],catalogRows:[],widths:[390,1440],locales,abilitySearchScope:'Actual native typeahead plus shared normalized alias index, not an invented free-text widget'};try{
 assert.equal(M.observations.length,41);lab=await startLab();browser=await launchBrowser();
 for(const width of evidence.widths){
  context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await blockExternal(context,page);await page.goto(lab.origin+'/candidate/');await ready(page);
  for(const o of M.observations){
   await page.selectOption('#chloha-locale','es-LA');await page.locator('#resetCalculation').click();await ready(page);
   const ability=o.category==='abilities',pokemon=o.category==='pokemon',id=o.canonicalIds[0],side=id==='heatproof'?'def':'att';let species=null,control;
   if(ability&&id==='transistor'){
    assert.equal(o.key,'トランジスタ');assert.equal(o.esLA,'Transistor');
    assert.deepEqual(Array.from(oldContext.ChlohaEsLa.aliases('abilities',o.key)),[]);assert.deepEqual(Array.from(catalogContext.ChlohaEsLa.aliases('abilities',o.key)),['Transistor']);
    const before=await state(page);assert.notEqual(JSON.parse(before).result,null,'Catalog-only checks still compare a complete numerical result');assert.equal(JSON.parse(before).result.rolls.length,16);
    const localeRows=[];
    for(const locale of locales){
     await page.selectOption('#chloha-locale',locale);await page.evaluate(()=>new Promise(requestAnimationFrame));
     const expected=locale==='ja'?o.key:locale==='es-LA'?o.esLA:null;assert.equal(combined.abilities[o.key],undefined,'No invented nine-locale catalog entry');assert.equal(catalogContext.ChlohaNames.abilities[o.key],undefined);
     assert.equal(oldContext.ChlohaNames.abilities[o.key],undefined);assert.equal(oldCombined.abilities[o.key],undefined);
     for(const query of [o.key,id,o.esLA,o.esLA.toUpperCase(),o.esLA.toLowerCase()]){assert.equal(oldContext.ChlohaNameSearch.search(oldAliasIndex,'abilities',query).includes(o.key),false);assert.equal(catalogContext.ChlohaNameSearch.search(aliasIndex,'abilities',query).includes(o.key),false,'Attestation does not invent search-catalog membership');}
     const inspect=()=>page.evaluate(({key,id,locale,query})=>{
      const combined={};for(const category of ['pokemon','moves','abilities','items']){combined[category]={};for(const table of [window.ChlohaPokeAPILocalizedNames[category],window.ChlohaLocalizedNames[category]])for(const [k,names]of Object.entries(table||{}))combined[category][k]={...combined[category][k],...names};}
      return {name:locale==='ja'?key:locale==='es-LA'?ChlohaEsLa.entity('abilities',key,null):combined.abilities[key]?.[locale]??null,engine:ChlohaAbilityData.ABILITY_CATALOG[id],searchCatalogEntryPresent:Object.hasOwn(ChlohaNames.abilities,key),metadata:ChlohaEsLa.metadata('abilities',key),rosterCount:ChlohaGameData.pokemon.length,associations:ChlohaGameData.pokemon.filter(p=>(p.abilities||[]).includes(key)).map(p=>p.id),attOptions:document.querySelectorAll('#attAbility option[value="'+id+'"]').length,defOptions:document.querySelectorAll('#defAbility option[value="'+id+'"]').length};
     },{key:o.key,id,locale,query:o.esLA});
     for(const phase of ['before-reload','after-reload']){
      if(phase==='after-reload'){assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);}
      const result=await inspect();assert.equal(result.name,expected);assert.equal(result.searchCatalogEntryPresent,false);assert.equal(result.engine.ja,o.key);assert.equal(result.engine.en,'Transistor');assert.equal(result.engine.coverage,'supported');assert.equal(result.rosterCount,373);assert.deepEqual(result.associations,[],'No invented Transistor species association');assert.equal(result.attOptions,0);assert.equal(result.defOptions,0);assert.equal(result.metadata.name,'Transistor');assert.equal(result.metadata.status,'official');assert.equal(result.metadata.officialChampions,false);assert.deepEqual(result.metadata.canonicalIds,['transistor']);assert.deepEqual(result.metadata.sourceIds,o.sourceIds,'Runtime exposes source IDs; record IDs are checked by the static provenance contract');assert.deepEqual(result.metadata.aliases,['Transistor']);assert.equal(await state(page),before,'Catalog-only search never selects/activates an unavailable ability or changes full numerical state '+locale+'/'+phase);
     }
     localeRows.push({locale,availableCatalogLabel:expected,regionalAttestationName:o.esLA,searchCatalogMember:false,reload:true,optionAbsent:true});
    }
    evidence.catalogRows.push({width,category:o.category,key:o.key,id,name:o.esLA,scope:'regional attestation/engine catalog only; no roster association, nine-locale name entry, shared search membership or native picker option',nativeSelection:false,locales:localeRows,passed:true});continue;
   }
   if(ability){
    species=await page.evaluate(key=>ChlohaGameData.pokemon.find(p=>(p.abilities||[]).includes(key))?.id??null,o.key);
    if(species){const selector=page.locator('#db'+(side==='att'?'Att':'Def')+'Pokemon');await expose(selector);await selector.selectOption(species);}else assert.fail('Native ability must have an existing roster association: '+id);
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
 assert.equal(evidence.rows.length,80);assert.equal(evidence.catalogRows.length,2);assert.ok(evidence.catalogRows.every(r=>r.locales.length===10&&!r.nativeSelection));assert.ok(evidence.rows.some(r=>r.unsupportedPreserved));assert.ok(evidence.rows.some(r=>!r.blocked));evidence.passed=true;console.log('PASS regional batch6: 80 real UI selections plus 2 catalog-only Transistor cases; all 820 locale/state checks, saved reloads, unchanged unsupported boundaries');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/regional-batch6-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
