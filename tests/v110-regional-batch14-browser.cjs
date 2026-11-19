'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const baseline='016c5801bd63ed891c4c359d02748b3a66c26d0f',baselineTree='cb30edc6da5ba49b15532ecc7998621996ed7572';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'],widths=[390,1440];
const id='gw0169_p036',key='グラススライダー',name='Fitoimpulso';
const expose=locator=>locator.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
const state=page=>page.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),a:ChlohaLastCalculation.a,r:ChlohaLastCalculation.r,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
const metadata=page=>page.evaluate(key=>ChlohaEsLa.metadata('moves',key),key);
const label=page=>page.locator('#moveSelected').textContent();
(async()=>{
 let lab,browser;const contexts=[];
 const evidence={sourceCommit:git('rev-parse','HEAD'),uncommittedPreview:!!git('status','--porcelain'),baseline,baselineTree,id,widths,locales,realDevice:false,productionMutations:0,rows:[]};
 try{
  assert.equal(git('rev-parse',baseline+'^{tree}'),baselineTree);
  lab=await startLab({compare:true,comparisonRef:baseline});browser=await launchBrowser();
  for(const width of widths){
   const pages=[],errors=[];
   for(const side of ['candidate','baseline']){
    const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});contexts.push(context);
    const page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.message));
    await blockExternal(context,page);await page.goto(lab.origin+'/'+side+'/');await ready(page);
   }
   const [candidate,prior]=pages;
   const before=await metadata(prior),after=await metadata(candidate);
   assert.equal(before.name,name);assert.deepEqual(before.canonicalIds,[id]);assert.equal(before.status,'unverified');assert.equal(before.officialChampions,false);
   assert.deepEqual(after,{...before,status:'official',sourceIds:['batch14-swsh-features'],targetGame:'Pokémon Sword and Pokémon Shield',fallback:false},'Exact historical metadata promotion only');
   for(const locale of locales){
    for(const page of pages){
     await page.selectOption('#chloha-locale',locale);
     await page.locator('#resetCalculation').click();
     const control=page.locator('#dbMove');await expose(control);
     if(locale==='es-LA'){
      const search=page.locator('#moveSearch');await expose(search);
      for(const query of [name.toUpperCase(),name]){
       await control.selectOption('earthquake');assert.equal(await control.inputValue(),'earthquake');
       await search.fill(query);
       const option=page.locator('#moveSuggestions').getByRole('option',{name,exact:true});
       assert.equal(await option.count(),1,'Unique exact accessible result for '+query);
       assert.equal(await option.locator('span').first().textContent(),name);
       await option.click();assert.equal(await control.inputValue(),id,'Regional search selects canonical move');
      }
     }else await control.selectOption(id);
     await ready(page);assert.equal(await control.inputValue(),id);
    }
    const baselineLabel=await label(prior),canonical=await state(prior),parsed=JSON.parse(canonical);
    assert.ok(baselineLabel.trim());if(locale==='es-LA')assert.ok(baselineLabel.includes(name));
    assert.equal(await label(candidate),baselineLabel,'Rendered move label matches baseline: '+locale);
    assert.equal(parsed.r.rolls.length,16);assert.equal(parsed.errorHidden,true);assert.equal(parsed.outputHidden,false);
    assert.equal(await state(candidate),canonical,'Canonical state and full numerical result match baseline: '+locale);
    for(const page of pages){
     assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);
     assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await page.locator('#dbMove').inputValue(),id);
     assert.equal(await label(page),baselineLabel);assert.equal(await state(page),canonical,'Saved canonical state and complete numerical output survive reload: '+locale);
    }
    evidence.rows.push({width,locale,label:baselineLabel,rollCount:16,numericParity:true,saveReload:true,search:locale==='es-LA'});
   }
   assert.deepEqual(errors,[]);await Promise.all(contexts.map(context=>context.close()));contexts.length=0;
  }
  assert.equal(evidence.rows.length,20);assert.equal(evidence.rows.filter(r=>r.search).length,2);
  evidence.passed=true;console.log('PASS batch14 browser: ten locales × two widths; exact labels, canonical save/reload, full numerical parity and historical-only metadata; ES-LA Fitoimpulso search verified');
 }catch(e){evidence.passed=false;evidence.error=e.message;throw e;}finally{
  await Promise.allSettled(contexts.map(context=>context.close()));await browser?.close();await lab?.close();
  fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/regional-batch14-browser.json',JSON.stringify(evidence,null,2)+'\n');
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
