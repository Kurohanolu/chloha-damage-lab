'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {locales,variable,statusWords}=require('./v0188-continued-locale.cjs');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const widths=[390,1440];
const result=page=>page.evaluate(()=>JSON.stringify({a:window.ChlohaLastCalculation.a,r:window.ChlohaLastCalculation.r}));
async function chooseMove(page,query,id){
 await page.locator('#moveSearch').fill(query);
 await page.locator('#moveSuggestions [role=option]').first().click();
 assert.equal(await page.locator('#dbMove').inputValue(),id,'unique translated-name search: '+query);
}
async function keyboardCycle(page,inputId,listId,query){
 await page.mouse.move(0,0); // Keep pointer-hover selection separate from keyboard selection.
 const input=page.locator('#'+inputId),options=page.locator('#'+listId+' [role=option]');
 await input.fill(query);const count=await options.count();assert.ok(count>=2,'multiple '+query+' choices');
 const last=await options.last().getAttribute('id'),first=await options.first().getAttribute('id');
 assert.equal(await input.getAttribute('aria-activedescendant'),null,'new query has no active result');
 await input.press('ArrowUp');assert.equal(await input.getAttribute('aria-activedescendant'),last,'initial up selects final result');
 assert.equal(await options.last().getAttribute('aria-selected'),'true');
 await input.press('ArrowDown');assert.equal(await input.getAttribute('aria-activedescendant'),first,'down wraps to first');
 await input.fill('no-such-pokemon-or-move-0188');assert.equal(await options.count(),0);
 assert.equal(await input.getAttribute('aria-activedescendant'),null,'empty rerender has no dangling active descendant');
 await input.press('Escape');assert.equal(await input.getAttribute('aria-expanded'),'false');
 await input.fill(query);await input.press('ArrowDown');
 assert.equal(await input.getAttribute('aria-activedescendant'),await options.first().getAttribute('id'));
 // Rebuilding the populated query must clear old selection too.
 await input.fill(query+' ');assert.equal(await input.getAttribute('aria-activedescendant'),null);
 assert.equal(await page.locator('#'+listId+' [aria-selected=true]').count(),0);
 await input.press('Escape');
}
(async()=>{
 const lab=await startLab();let browser;
 const evidence={candidateCommit:require('node:child_process').execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),mode:'local Chromium browser automation',realDevice:false,productionMutations:0,locales,widths,cases:[],limits:['No physical hardware or native screen reader','Reuse of existing translated copy; not full native-language review']};
 fs.mkdirSync('reports/v0188',{recursive:true});
 try{
  browser=await launchBrowser();
  for(const width of widths){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await blockExternal(context,page);
   await page.goto(lab.origin+'/candidate/');await ready(page);
   try{
    for(const locale of locales){
     await page.selectOption('#chloha-locale',locale);
     for(const [query,id,statusIndex] of [['Fissure','gw0169_p050',0],['Triple Arrows','gw0169_p001',1],['Electro Ball','electroBall',2]]){
      await chooseMove(page,query,id);
      await page.waitForFunction(expected=>document.getElementById('moveSelected').textContent.includes(expected),statusWords[locale][statusIndex]);
      if(id==='electroBall'){
       const summary=await page.locator('#moveSelected').textContent();assert.ok(summary.includes(' / '+variable[locale]),summary);
       const option=await page.locator('#dbMove option:checked').textContent();assert.ok(option.includes(' / '+variable[locale]),option);
      }
     }
     const before=await result(page);
     for(const [input,list,query] of [['moveSearch','moveSuggestions','Dragon'],['attSearch','attSuggestions','Charizard'],['defSearch','defSuggestions','Charizard']]){
      await keyboardCycle(page,input,list,query);
      assert.equal(await result(page),before,'navigation and query edits preserve numeric calculation');
     }
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no document overflow');
     assert.equal(await page.evaluate(()=>window.ChlohaPersistence.save()),true);
     await page.reload();await ready(page);
     assert.equal(await page.locator('#chloha-locale').inputValue(),locale);
     assert.equal(await result(page),before,'selected variable move retains full input and output after reload');
     await page.waitForFunction(expected=>document.getElementById('moveSelected').textContent.includes(expected),statusWords[locale][2]);
     assert.ok((await page.locator('#moveSelected').textContent()).includes(' / '+variable[locale]));
     for(const input of ['moveSearch','attSearch','defSearch'])assert.equal(await page.locator('#'+input).getAttribute('aria-activedescendant'),null);
     assert.deepEqual(errors,[]);
     evidence.cases.push({locale,width,status:'passed',keyboardComboboxes:3,canonicalWarnings:3,variableSummaryAndOption:true,numericReloadParity:true});
    }
   }finally{await context.close();}
  }
  evidence.status='passed';console.log('PASS continued locale/keyboard browser audit: '+evidence.cases.length+' locale/viewport combinations, canonical warnings, three comboboxes, variable copy and exact reload parity');
 }catch(error){evidence.status='failed';evidence.error=error.message;throw error;}
 finally{fs.writeFileSync('reports/v0188/continued-locale-browser.json',JSON.stringify(evidence,null,2)+'\n');await browser?.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
