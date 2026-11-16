'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const manifest=require('../docs/data/v110-es-la-owner-captures-batch3.json'),locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const expose=control=>control.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
const state=page=>page.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),input:window.ChlohaLastCalculation?.a??null,result:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden,copyDisabled:document.getElementById('copy').disabled}));
(async()=>{let lab,browser,context;const evidence={realDevice:false,productionMutations:0,rows:[],widths:[390,1440],locales};try{
 lab=await startLab();browser=await launchBrowser();
 for(const width of evidence.widths){context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await blockExternal(context,page);await page.goto(lab.origin+'/candidate/');await ready(page);
 for(const o of manifest.observations){
  await page.selectOption('#chloha-locale','es-LA');await page.locator('#resetCalculation').click();await ready(page);
  const anchor=o.canonicalAnchor,id=anchor.canonicalIds[0],side=id==='auraGuard'?'def':'att';
  const species=await page.evaluate(key=>ChlohaGameData.pokemon.find(p=>(p.abilities||[]).includes(key))?.id,anchor.key);assert.ok(species,'Existing roster association: '+anchor.en);
  const pokemon=page.locator('#db'+(side==='att'?'Att':'Def')+'Pokemon');await expose(pokemon);await pokemon.selectOption(species);
  const control=page.locator('#'+side+'Ability');await expose(control);assert.ok((await control.locator('option[value="'+id+'"]').textContent()).includes(o.esLA));
  await control.selectOption('none');await control.focus();await page.keyboard.press('Home');await page.keyboard.type(o.esLA,{delay:10});await page.keyboard.press('Tab');assert.equal(await control.inputValue(),id,'Visible native search selects exact ID');
  assert.equal(await page.evaluate(o=>ChlohaEsLa.metadata('abilities',o.canonicalAnchor.key).officialChampions,o),true);
  for(const query of new Set([o.esLA,o.esLA.toUpperCase(),o.esLA.normalize('NFD').replace(/[\u0300-\u036f]/g,'')]))assert.equal(await page.evaluate(({key,query})=>ChlohaEsLa.aliases('abilities',key).some(x=>ChlohaNameSearch.normalize(x)===ChlohaNameSearch.normalize(query)),{key:anchor.key,query}),true,'Accent/case alias search: '+query);
  const before=await state(page),snapshot=JSON.parse(before),blocked=id.startsWith('unsupported:');assert.equal(snapshot.result===null,blocked);assert.equal(snapshot.outputHidden,blocked);assert.equal(snapshot.errorHidden,!blocked);if(blocked)assert.equal(snapshot.copyDisabled,true);
  for(const locale of locales){await page.selectOption('#chloha-locale',locale);assert.equal(await state(page),before,'Numerical/canonical state unchanged '+anchor.en+'/'+locale);assert.equal(await control.inputValue(),id);}
  assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();
  // Unsupported canonical abilities intentionally produce no calculation. Wait
  // for their fail-closed UI instead of the supported-calculation ready helper.
  if(blocked)await page.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&!window.ChlohaLastCalculation&&!document.getElementById('error').hidden&&document.getElementById('output').hidden&&document.getElementById('copy').disabled);else await ready(page);
  assert.equal(await page.locator('#chloha-locale').inputValue(),'es-LA');assert.equal(await state(page),before,'Saved identity and numeric/unsupported result after reload');assert.equal(await page.locator('#'+side+'Ability').inputValue(),id);
  evidence.rows.push({width,key:anchor.key,id,name:o.esLA,species,side,localeSwitches:10,reload:true,unsupportedPreserved:blocked,passed:true});
 }
 assert.deepEqual(errors,[]);await context.close();context=null;}
 assert.equal(evidence.rows.length,14);evidence.passed=true;console.log('PASS batch 3 browser: 14 ability selections, 140 locale switches, 14 saved reloads; numeric/unsupported behavior preserved');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/third-capture-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
