'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const M=require('../docs/data/v110-es-la-official-pokedex-batch5.json');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const ready=page=>page.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&(!!window.ChlohaLastCalculation||(!document.getElementById('error').hidden&&document.getElementById('output').hidden&&document.getElementById('copy').disabled)));
const state=page=>page.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),input:window.ChlohaLastCalculation?.a??null,result:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden,copyDisabled:document.getElementById('copy').disabled},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
const expose=node=>node.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{let lab,browser,context;const evidence={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceTree:execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),realDevice:false,widths:[390,1440],locales,rows:[],productionMutations:0};try{
 assert.equal(M.records.length,225);lab=await startLab();browser=await launchBrowser();
 for(const width of evidence.widths){
  context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await blockExternal(context,page);await page.goto(lab.origin+'/candidate/');await ready(page);
  for(const o of M.records){
   await page.selectOption('#chloha-locale','es-LA');await page.locator('#resetCalculation').click();await ready(page);
   const input=page.locator('#attSearch'),control=page.locator('#dbAttPokemon'),id=o.canonicalIds[0];await expose(input);
   for(const query of new Set([o.esLA,o.esLA.toUpperCase(),o.esLA.normalize('NFD').replace(/[\u0300-\u036f]/g,'')])){
    await input.fill(query);
    // Use an exact accessible name, not a substring result that could select a form.
    const exact=page.locator('#attSuggestions').getByRole('option',{name:o.esLA,exact:true});assert.equal(await exact.count(),1,'Unique exact species search '+query);await exact.click();assert.equal(await control.inputValue(),id,'Actual search selects canonical species');
   }
   await ready(page);const before=await state(page),snapshot=JSON.parse(before);
   const metadata=await page.evaluate(key=>ChlohaEsLa.metadata('pokemon',key),o.key);assert.equal(metadata.name,o.esLA);assert.equal(metadata.status,'official');assert.equal(metadata.officialChampions,false,'Generic/Z-A is not official Champions');
   if(snapshot.result!==null)assert.equal(snapshot.result.rolls.length,16,'Complete default single-hit roll vector');
   for(const locale of locales){
    await page.selectOption('#chloha-locale',locale);await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await control.inputValue(),id);
    const expected=locale==='ja'?o.ja:await page.evaluate(({key,locale})=>ChlohaLocalePokemonName(key,locale),{key:o.key,locale});assert.equal(typeof expected,'string');assert.ok(expected.length);assert.ok((await control.locator('option:checked').textContent()).includes(expected),'Correct visible locale label '+o.key+'/'+locale);
    assert.equal(await state(page),before,'Complete canonical inputs/results and blocked-state parity '+o.key+'/'+locale);
    if(o===M.records[0]){assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await control.inputValue(),id);assert.equal(await state(page),before,'All ten locale preferences survive real save/reload');}
   }
   assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),'es-LA');assert.equal(await control.inputValue(),id);assert.ok((await control.locator('option:checked').textContent()).includes(o.esLA));assert.equal(await state(page),before,'Saved canonical state and complete numerical output');
   evidence.rows.push({width,key:o.key,id,name:o.esLA,localeSwitches:10,reload:true,blocked:snapshot.result===null,passed:true});
  }
  assert.deepEqual(errors,[]);await context.close();context=null;
 }
 assert.equal(evidence.rows.length,450);assert.ok(evidence.rows.some(r=>!r.blocked),'Numerical coverage cannot pass only blocked cases');evidence.passed=true;console.log('PASS Pokédex batch5 browser: 225 exact species × 2 widths, 4500 locale/state checks, 450 save/reloads; no form inference');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/pokedex-batch5-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
