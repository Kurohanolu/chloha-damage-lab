'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
// Transcribed factual witnesses are deliberately separate from generated data.
// ZA secondary evidence is not represented as official Champions evidence.
const witnesses=[
 {category:'moves',key:'のしかかり',id:'gw0170_s007',es:'Golpe Cuerpo',regional:'Golpe de Cuerpo'},
 {category:'moves',key:'フレアドライブ',id:'flareBlitz',es:'Envite Ígneo',regional:'Erupción'},
 {category:'abilities',key:'ちょすい',id:'waterAbsorb',control:'defAbility',es:'Absorbe Agua',regional:'Absorbeagua'},
 {category:'abilities',key:'もうか',id:'blaze',control:'attAbility',es:'Mar Llamas',regional:'Mar de Llamas'},
 {category:'items',key:'いのちのたま',id:'lifeOrb',control:'attItem',es:'Vidasfera',regional:'Vidaesfera'},
 {category:'pokemon',key:'gw092_05',id:'gw092_05',es:'Emboar',regional:'Emboar'},
 {category:'pokemon',key:'mega_charizard_y',id:'mega_charizard_y',es:'Mega-Charizard Y',regional:'Mega-Charizard Y'}
];
const c=vm.createContext({});vm.runInContext('window=globalThis',c);
for(const f of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f});
const combined={};for(const category of ['pokemon','moves','abilities','items']){combined[category]={};for(const table of [c.ChlohaPokeAPILocalizedNames[category],c.ChlohaLocalizedNames[category]])for(const [id,names] of Object.entries(table||{}))combined[category][id]={...combined[category][id],...names};}
const index=c.ChlohaNameCatalogAdapter.build(c.ChlohaNames,c.ChlohaNameSearch,combined);
let indexed=0;
for(const w of witnesses){for(const query of new Set([w.es,w.regional,w.regional.toUpperCase(),w.regional.normalize('NFD').replace(/[\u0300-\u036f]/g,'')])){assert.ok(c.ChlohaNameSearch.search(index,w.category,query).includes(w.key),'Regional/Spain/accent aliases resolve canonical source key: '+w.category+'/'+query);indexed++;}}
const numeric=page=>page.evaluate(()=>JSON.stringify({a:ChlohaLastCalculation.a,r:ChlohaLastCalculation.r}));
(async()=>{
 const lab=await startLab();let browser,context;const evidence={mode:'local Chromium emulation',productionRequests:0,productionMutations:0,realDevice:false,indexQueries:indexed,cases:[],widths:[390,1440],abilityItemSearch:'Canonical alias catalog plus Chromium native select keyboard typeahead; no custom free-text widget or physical-device result is claimed'};
 try{
  browser=await launchBrowser();
  for(const width of evidence.widths){
   context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await blockExternal(context,page);await page.goto(lab.origin+'/candidate/');await ready(page);
   for(const w of witnesses){
    await page.selectOption('#chloha-locale','es-LA');
    for(const query of new Set([w.es,w.regional])){
     if(w.category==='moves'){
      await page.locator('#moveSearch').fill(query);const option=page.locator('#moveSuggestions [role=option]').filter({has:page.locator('span').filter({hasText:new RegExp('^'+w.regional.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')})});
      assert.equal(await option.count(),1,'Visible unique regional result for canonical move: '+query);assert.equal(await option.getAttribute('aria-label'),w.regional,'Accessible move name matches visible ES-LA label');assert.ok(!/Unsupported|Estimated|Basic damage only/.test(await option.innerText()),'Suggestion status is Spanish');await option.click();assert.equal(await page.locator('#dbMove').inputValue(),w.id);assert.ok((await page.locator('#moveSelected').textContent()).includes(w.regional));
     }else if(w.category==='pokemon'){
      await page.locator('#attSearch').fill(query);const option=page.locator('#attSuggestions [role=option]').filter({hasText:w.regional});const exact=page.locator('#attSuggestions [role=option][aria-label="'+w.regional+'"]');assert.equal(await exact.count(),1,'Species/form search exact canonical candidate');await exact.click();assert.equal(await page.locator('#dbAttPokemon').inputValue(),w.id);
     }else{
      if(query!==w.regional)continue; // Spain aliases are verified by the catalog above; native typeahead uses the visible regional label.
      const option=page.locator('#'+w.control+' option[value="'+w.id+'"]');assert.ok((await option.textContent()).includes(w.regional),'Native searchable option displays regional term');
      const control=page.locator('#'+w.control);await control.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await control.selectOption('none');await control.focus();await page.keyboard.press('Home');await page.keyboard.type(w.regional,{delay:30});await page.keyboard.press('Tab');assert.equal(await control.inputValue(),w.id,'Native regional keyboard typeahead resolves canonical '+w.control);
     }
    }
    const before=await numeric(page);await page.selectOption('#chloha-locale','es');assert.equal(await numeric(page),before,'Changing display label cannot alter canonical engine input/output');
    if(w.category==='moves')assert.ok((await page.locator('#moveSelected').textContent()).includes(w.es),'Spain name preserved independently');
    else if(w.control)assert.ok((await page.locator('#'+w.control+' option:checked').textContent()).includes(w.es),'Existing Spain native label preserved');
    await page.selectOption('#chloha-locale','es-LA');assert.equal(await numeric(page),before);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    evidence.cases.push({width,...w,canonicalSelection:true,regionalAndSpainAlias:true,numericalParity:true});
   }
   const beforeNoResults=await numeric(page);
   for(const [input,list,expected] of [['moveSearch','moveSuggestions','No hay movimientos coincidentes'],['attSearch','attSuggestions','No hay Pokémon coincidentes'],['defSearch','defSuggestions','No hay Pokémon coincidentes']]){
    await page.locator('#'+input).fill('v110-no-such-regional-name');await page.waitForFunction(({list,expected})=>document.getElementById(list).textContent.trim()===expected,{list,expected});assert.equal(await page.locator('#'+list+' [role=option]').count(),0);assert.equal(await page.locator('#'+input).getAttribute('aria-activedescendant'),null);assert.equal(await numeric(page),beforeNoResults,'No-results query preserves calculation');await page.locator('#'+input).press('Escape');assert.equal(await page.locator('#'+input).getAttribute('aria-expanded'),'false');
   }
   // Keyboard navigation, first-Up and IME composition events exercise the DOM
   // contract only; this is not native OS IME or screen-reader certification.
   await page.locator('#moveSearch').fill('Dragon');const options=page.locator('#moveSuggestions [role=option]');assert.ok(await options.count()>1);await page.mouse.move(0,0);await page.locator('#moveSearch').press('ArrowUp');assert.equal(await page.locator('#moveSearch').getAttribute('aria-activedescendant'),await options.last().getAttribute('id'));await page.locator('#moveSearch').press('Escape');assert.equal(await page.locator('#moveSearch').getAttribute('aria-expanded'),'false');
   await page.locator('#moveSearch').fill('Dragon');await page.locator('#moveSearch').press('ArrowDown');assert.ok(await page.locator('#moveSearch').getAttribute('aria-activedescendant'));
   const beforeComposition=await numeric(page);await page.locator('#moveSearch').evaluate(node=>{node.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true,data:''}));node.dispatchEvent(new CompositionEvent('compositionupdate',{bubbles:true,data:'Erupción'}));node.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',isComposing:true,bubbles:true}));node.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'Erupción'}));});assert.equal(await numeric(page),beforeComposition,'Composition Enter must not pick a different move');
   assert.deepEqual(errors,[]);await context.close();context=null;
  }
  assert.equal(evidence.cases.length,witnesses.length*2);evidence.passed=true;console.log('PASS v1.1.0 regional search: '+indexed+' canonical catalog alias queries, '+evidence.cases.length+' browser cases, Pokemon/forms/moves/native ability-item labels and Spain independence');
 }catch(error){evidence.error=error.message;throw error;}
 finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/regional-search-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
