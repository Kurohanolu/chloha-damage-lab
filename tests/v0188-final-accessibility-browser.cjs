'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {startLab,launchBrowser,ready,mockFeedback}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const searches=[['moveSearch','moveSuggestions','Dragon'],['attSearch','attSuggestions','Charizard'],['defSearch','defSuggestions','Charizard']];
const numeric=page=>page.evaluate(()=>JSON.stringify({a:window.ChlohaLastCalculation.a,r:window.ChlohaLastCalculation.r}));
const selected=page=>page.evaluate(()=>['dbMove','dbAttPokemon','dbDefPokemon'].map(id=>document.getElementById(id).value));
const focused=page=>page.evaluate(()=>document.activeElement.id);
async function named(locator,role){
 const snapshot=await locator.ariaSnapshot();
 assert.match(snapshot,new RegExp('(?:^|\\n)- '+role+' "[^"\\n]+"'),'computed accessible name for '+role+': '+snapshot);
 return snapshot.split('\n')[0];
}
async function composingSearch(page,inputId,listId,query){
 const input=page.locator('#'+inputId),options=page.locator('#'+listId+' [role=option]');
 await page.mouse.move(0,0);await input.fill(query);
 assert.ok(await options.count()>1,'multiple search results: '+inputId);
 const original=await numeric(page),values=await selected(page),name=await named(input,'combobox');
 // Exercise both browser isComposing and the application composition-session guard.
 // Synthetic DOM events are not evidence of a real OS IME/device interaction.
 for(const session of [false,true]){
  if(session)await input.dispatchEvent('compositionstart',{data:''});
  for(const key of ['ArrowDown','ArrowUp','Enter']){
   await input.dispatchEvent('keydown',{key,isComposing:!session,bubbles:true,cancelable:true});
   assert.equal(await input.getAttribute('aria-activedescendant'),null,'composition must not navigate: '+inputId+'/'+key+'/'+session);
   assert.deepEqual(await selected(page),values,'composition must not commit a selected value');
   assert.equal(await numeric(page),original,'composition must not recalculate');
  }
  if(session)await input.dispatchEvent('compositionend',{data:query});
 }
 await input.press('ArrowDown');
 assert.equal(await input.getAttribute('aria-activedescendant'),await options.first().getAttribute('id'),'normal navigation resumes after compositionend');
 await input.press('Escape');
 assert.equal(await input.getAttribute('aria-expanded'),'false');
 assert.equal(await input.getAttribute('aria-activedescendant'),null);
 assert.equal(await focused(page),inputId,'Escape retains focus in combobox');
 assert.equal(await numeric(page),original);
 return name;
}
(async()=>{
 const lab=await startLab();let browser;
 const out='reports/v0188-final';fs.mkdirSync(out,{recursive:true});
 const evidence={candidateCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),mode:'Chromium browser automation; synthetic composition events; local feedback fixture',realDevice:false,productionMutations:0,reportPosts:0,cases:[],screenshots:[],limits:['No physical device or OS IME verification','No native screen-reader verification','Accessible names checked for presence/label association, not native-language accuracy','Not a complete contrast audit']};
 try{
  browser=await launchBrowser();
  for(const locale of locales){
   const width=locale==='ja'?320:locale==='zh-Hant'?1440:390;
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768,reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await mockFeedback(context,lab.origin);
   await context.route('**/v1/reports',route=>{evidence.reportPosts++;return route.abort();});
   await context.addInitScript(value=>localStorage.setItem('chloha.damageLab.locale',value),locale);
   try{
    await page.goto(lab.origin+'/candidate/');await ready(page);
    const original=await numeric(page),names={};
    for(const [input,list,query] of searches)names[input]=await composingSearch(page,input,list,query);
    names.feedbackButton=await named(page.locator('#feedbackButton'),'button');
    await page.locator('#feedbackButton').click();
    assert.equal(await page.locator('#feedbackButton').getAttribute('aria-expanded'),'true');
    assert.equal(await focused(page),'feedbackCategory','opening the nonmodal feedback region focuses category');
    const title=await page.locator('#feedbackTitle').innerText();assert.ok(title.trim());
    assert.equal(await page.getByRole('region',{name:title,exact:true}).count(),1,'feedback region is named by heading');
    for(const [id,role] of [['feedbackCategory','combobox'],['feedbackDescription','textbox'],['feedbackEmail','textbox'],['feedbackAttach','checkbox'],['feedbackClose','button'],['feedbackSubmit','button']])names[id]=await named(page.locator('#'+id),role);
    await page.locator('#feedbackDescription').fill('Local accessibility fixture; never submitted.');
    await page.locator('#feedbackDescription').press('Escape');
    assert.equal(await page.locator('#feedbackPanel').isVisible(),false);
    assert.equal(await page.locator('#feedbackButton').getAttribute('aria-expanded'),'false');
    assert.equal(await focused(page),'feedbackButton','Escape restores trigger focus');
    await page.locator('#feedbackButton').press('Enter');
    assert.equal(await focused(page),'feedbackCategory','keyboard reopen focuses category');
    assert.equal(await page.locator('#feedbackDescription').inputValue(),'Local accessibility fixture; never submitted.');
    await page.locator('#feedbackClose').click();
    assert.equal(await focused(page),'feedbackButton','close button restores trigger focus');
    assert.equal(await numeric(page),original,'search navigation and feedback focus/typing preserve calculation');
    assert.deepEqual(errors,[],'no uncaught page errors');
    if(['ja','ko','zh-Hant'].includes(locale)){
     await page.evaluate(()=>scrollTo(0,0));
     const file=out+'/ui-'+locale+'-'+width+'.png';await page.screenshot({path:file,fullPage:true});evidence.screenshots.push(file);
    }
    evidence.cases.push({locale,width,comboboxCompositionCases:3,names,passed:true});
   }finally{await context.close();}
  }
  assert.equal(evidence.reportPosts,0,'no report submissions');evidence.passed=true;
  console.log('Final accessibility: 27 synthetic IME combobox cases and 9 feedback name/focus cycles passed; 3 screenshots captured.');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}
 finally{fs.writeFileSync(out+'/accessibility.json',JSON.stringify(evidence,null,2)+'\n');if(browser)await browser.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
