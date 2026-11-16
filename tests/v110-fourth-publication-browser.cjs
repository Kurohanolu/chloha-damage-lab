'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const M=require('../docs/data/v110-es-la-official-publications-batch4.json'),locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const witnesses=[...new Map(M.observations.map(o=>[o.category+'/'+o.key,o])).values()];
// Items have no free-text search widget. Exercise the shared alias index for
// all ten locale labels, and real Chromium native typeahead for the ES-LA label.
const itemWitnesses=[
 {key:'こだわりハチマキ',id:'choiceBand',control:'attItem',name:'Cinta Elección'},
 {key:'とつげきチョッキ',id:'assaultVest',control:'defItem',name:'Chaleco Asalto'}
];
const catalogContext=vm.createContext({});vm.runInContext('window=globalThis',catalogContext);
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(fs.readFileSync(file,'utf8'),catalogContext,{filename:file});
const combined={};for(const category of ['pokemon','moves','abilities','items']){combined[category]={};for(const table of [catalogContext.ChlohaPokeAPILocalizedNames[category],catalogContext.ChlohaLocalizedNames[category]])for(const [key,names] of Object.entries(table||{}))combined[category][key]={...combined[category][key],...names};}
const aliasIndex=catalogContext.ChlohaNameCatalogAdapter.build(catalogContext.ChlohaNames,catalogContext.ChlohaNameSearch,combined);
const ready=page=>page.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&(!!window.ChlohaLastCalculation||(!document.getElementById('error').hidden&&document.getElementById('output').hidden&&document.getElementById('copy').disabled)));
const state=page=>page.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),input:window.ChlohaLastCalculation?.a??null,result:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden,copyDisabled:document.getElementById('copy').disabled}));
const expose=node=>node.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{let lab,browser,context;const evidence={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceTree:execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),realDevice:false,productionMutations:0,rows:[],itemRows:[],itemSearchScope:'Shared alias catalog for ten locale labels; Chromium native ES-LA typeahead, not a free-text item search widget or physical-device certification',widths:[390,1440],locales};try{
 assert.equal(witnesses.length,51);lab=await startLab();browser=await launchBrowser();
 for(const width of evidence.widths){context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await blockExternal(context,page);await page.goto(lab.origin+'/candidate/');await ready(page);
 for(const o of witnesses){
  await page.selectOption('#chloha-locale','es-LA');await page.locator('#resetCalculation').click();await ready(page);
  const pokemon=o.category==='pokemon',input=page.locator(pokemon?'#attSearch':'#moveSearch'),list=pokemon?'attSuggestions':'moveSuggestions',control=page.locator(pokemon?'#dbAttPokemon':'#dbMove'),id=o.canonicalIds[0];await expose(input);
  for(const query of new Set([o.esLA,o.esLA.toUpperCase(),o.esLA.normalize('NFD').replace(/[\u0300-\u036f]/g,'')])){
   await input.fill(query);const option=page.locator('#'+list+' [role=option][aria-label="'+o.esLA+'"]');assert.equal(await option.count(),1,'Unique visible regional query '+query);await option.click();assert.equal(await control.inputValue(),id,'Search keeps canonical ID');
  }
  await ready(page);const before=await state(page),snapshot=JSON.parse(before);
  const metadata=await page.evaluate(({category,key})=>ChlohaEsLa.metadata(category,key),o);assert.equal(metadata.name,o.esLA);if(o.targetGame==='Generic Pokémon franchise')assert.equal(metadata.officialChampions,false,'Generic evidence is not Champions');
  for(const locale of locales){await page.selectOption('#chloha-locale',locale);assert.equal(await control.inputValue(),id);assert.equal(await state(page),before,'Complete state/numerical parity '+o.key+'/'+locale);}
  assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),'es-LA');assert.equal(await control.inputValue(),id);assert.equal(await state(page),before,'Saved canonical and numeric state');
  evidence.rows.push({width,category:o.category,key:o.key,id,name:o.esLA,localeSwitches:10,reload:true,blocked:snapshot.result===null,passed:true});
 }
 // Keep the original 102 publication identity cases separate from provisional items.
 for(const item of itemWitnesses){
  await page.selectOption('#chloha-locale','es-LA');await page.locator('#resetCalculation').click();await ready(page);
  const control=page.locator('#'+item.control);await expose(control);
  const metadata=await page.evaluate(key=>ChlohaEsLa.metadata('items',key),item.key);
  assert.equal(metadata.name,item.name);assert.equal(metadata.status,'provisional');assert.equal(metadata.officialChampions,false,'Owner provisional wording is not official evidence');
  assert.ok((await control.locator('option[value="'+item.id+'"]').textContent()).includes(item.name),'Exact provisional regional label is visible');
  await control.selectOption('none');await control.focus();await page.keyboard.press('Home');await page.keyboard.type(item.name,{delay:30});await page.keyboard.press('Tab');
  assert.equal(await control.inputValue(),item.id,'Actual native typeahead selects canonical item');await ready(page);
  const before=await state(page);assert.notEqual(JSON.parse(before).result,null,'Item witness must exercise a numerical calculation, not a blocked state');
  const localeRows=[];
  for(const locale of locales){
   await page.selectOption('#chloha-locale',locale);assert.equal(await control.inputValue(),item.id);
   const display=(await control.locator('option:checked').textContent()).trim();assert.ok(display.length,'Selected item label remains visible '+locale);
   const name=locale==='es-LA'?item.name:locale==='ja'?item.key:combined.items[item.key]?.[locale];
   assert.equal(typeof name,'string','Known localized item name '+locale);assert.ok(display.includes(name),'Selected item displays the correct locale name '+locale);
   assert.ok(catalogContext.ChlohaNameSearch.search(aliasIndex,'items',name).includes(item.key),'Actual shared search index resolves localized item '+locale);
   assert.equal(await state(page),before,'Locale leaves canonical item and numerical results unchanged');
   assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);
   assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await control.inputValue(),item.id);assert.ok((await control.locator('option:checked').textContent()).includes(name));
   assert.equal(await state(page),before,'Saved item and complete numerical state survive reload '+locale);
   localeRows.push({locale,name,display,aliasIndex:true,reload:true,numericalParity:true});
  }
  evidence.itemRows.push({width,...item,nativeRegionalTypeahead:true,officialChampions:false,status:'provisional',locales:localeRows,passed:true});
 }
 assert.deepEqual(errors,[]);await context.close();context=null;}
 assert.equal(evidence.rows.length,102);assert.equal(evidence.itemRows.length,4);assert.ok(evidence.itemRows.every(row=>row.locales.length===10));evidence.passed=true;console.log('PASS fourth publication browser:102 selections,1020 locale switches,102 saved reloads and exact numerical/blocked-state parity; 4 provisional item cases with 40 localized index/display/save/reload/numerical checks');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/fourth-publication-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
