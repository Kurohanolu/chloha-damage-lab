/* Real browser + real SQLite/Worker handler; only Turnstile and GitHub are mocked. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const widgetStub=`(()=>{let n=0;const all=new Map();window.turnstile={render(node,options){const id='test-'+(++n);all.set(id,{node,options});queueMicrotask(()=>{if(all.has(id))options.callback('valid-'+crypto.randomUUID());});return id;},remove(id){all.delete(id);},reset(id){const item=all.get(id);if(item)queueMicrotask(()=>item.options.callback('valid-'+crypto.randomUUID()));}};})();`;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function newPage(browser,app,locale='en',options={}){
 const context=await browser.newContext({viewport:options.viewport||{width:390,height:844}});
 await context.addInitScript(lang=>localStorage.setItem('chloha.damageLab.locale',lang),locale);
 await context.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='challenges.cloudflare.com'&&url.pathname.endsWith('/api.js'))return route.fulfill({contentType:'text/javascript',body:widgetStub});
  if(url.origin!==app.origin)return route.abort();
  if(options.disconnected&&url.pathname==='/feedback-config-v0185.js')return route.fulfill({contentType:'text/javascript',body:'window.ChlohaFeedbackConfig=Object.freeze({apiBase:""});'});
  if(options.productionMessage&&url.pathname==='/v1/config'){const response=await route.fetch();const json=await response.json();json.mode='production';return route.fulfill({response,json});}
  return route.continue();
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(app.origin+'/',{waitUntil:'domcontentloaded'});await page.locator('#feedbackButton').waitFor();
 return {page,context,errors};
}
const key=(page,name)=>page.evaluate(name=>window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),name),name);
async function textEquals(page,id,name){assert.equal(await page.locator(id).textContent(),await key(page,name));}
const calculation=page=>page.evaluate(()=>JSON.stringify(window.ChlohaLastCalculation));
async function open(page){await page.locator('#feedbackButton').click();await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled);}
async function fill(page){await page.selectOption('#feedbackCategory','bug');await page.fill('#feedbackDescription','Synthetic feedback test. No real user data.');}
(async()=>{
 const {startLocalApp,reportBody}=await import('../services/feedback/test/harness.mjs');const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});fs.mkdirSync('test-results',{recursive:true});
 try{
  for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant']){
   const app=await startLocalApp();const {page,context,errors}=await newPage(browser,app,locale,{productionMessage:true,viewport:locale==='en'?{width:1280,height:900}:undefined});
   try{
    const original=await calculation(page);await open(page);assert.equal(await calculation(page),original,'Opening feedback must preserve calculation');assert.equal(await page.locator('#feedbackAttach').isChecked(),false);
    const contrasts=await page.evaluate(()=>{
     const rgb=value=>value.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;});
     const luminance=value=>rgb(value).reduce((sum,n,i)=>sum+n*[0.2126,0.7152,0.0722][i],0);
     const background=luminance(getComputedStyle(document.getElementById('feedbackPanel')).backgroundColor);
     return ['feedbackTitle','feedbackDescriptionHelp','feedbackPrivacy','feedbackCategory','feedbackPreview'].map(id=>{const style=getComputedStyle(document.getElementById(id)),foreground=luminance(style.color);let bg=background;if(style.backgroundColor!=='rgba(0, 0, 0, 0)')bg=luminance(style.backgroundColor);return {id,ratio:(Math.max(foreground,bg)+0.05)/(Math.min(foreground,bg)+0.05)};});
    });assert.ok(contrasts.every(c=>c.ratio>=4.5),JSON.stringify(contrasts));
    const mismatches=await page.evaluate(()=>[...document.querySelectorAll('#feedbackPanel [data-fb]')].filter(n=>n.id!=='feedbackSubmit').map(n=>({key:n.dataset.fb,actual:n.textContent,expected:window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),n.dataset.fb)})).filter(x=>x.actual!==x.expected));assert.deepEqual(mismatches,[],locale);
    await page.click('#feedbackSubmit');await textEquals(page,'#feedbackErrors','requiredCategory');assert.equal(await page.locator('#feedbackCategory').getAttribute('aria-invalid'),'true');
    await page.selectOption('#feedbackCategory','calculation');await page.click('#feedbackSubmit');await textEquals(page,'#feedbackErrors','requiredDescription');
    await page.fill('#feedbackDescription','Synthetic calculation report '+locale);await page.fill('#feedbackEmail','invalid');await page.click('#feedbackSubmit');await textEquals(page,'#feedbackErrors','emailError');await page.fill('#feedbackEmail','');
    await page.check('#feedbackAttach');await page.click('#feedbackSubmit');await textEquals(page,'#feedbackErrors','attachmentError');
    const snapshot=JSON.parse(await page.locator('#feedbackPreview').textContent());assert.equal(snapshot.locale,locale);assert.ok(snapshot.selection.attacker);assert.ok(snapshot.engineInput);assert.ok(snapshot.result);assert.ok(!JSON.stringify(snapshot).includes('Synthetic calculation report'));assert.ok(!('feedbackEmail' in snapshot.controls));assert.ok('dbAttNature' in snapshot.controls);
    await page.check('#feedbackConfirm');
    await page.evaluate(()=>{const el=document.getElementById('weather');el.value=el.value==='rain'?'sun':'rain';el.dispatchEvent(new Event('change',{bubbles:true}));});assert.equal(await page.locator('#feedbackStale').isVisible(),true);assert.equal(await page.locator('#feedbackConfirm').isChecked(),false);
    await page.click('#feedbackSubmit');await textEquals(page,'#feedbackErrors','attachmentError');await page.click('#feedbackRefresh');await page.check('#feedbackConfirm');
    const preview=await page.locator('#feedbackPreview').textContent(),description=await page.inputValue('#feedbackDescription'),other=locale==='en'?'fr':'en';
    for(const target of ['en','fr','de','es','it','ko','zh-Hans','zh-Hant','ja',locale]){
     await page.selectOption('#chloha-locale',target);await page.evaluate(()=>new Promise(requestAnimationFrame));
     const nativeLabels=await page.locator('#feedbackCategory option').evaluateAll(options=>options.map(n=>({text:n.textContent,label:n.label,expected:window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),n.dataset.fb)})));
     assert.ok(nativeLabels.every(n=>n.text===n.expected&&n.label===n.expected),locale+' → '+target+' native feedback labels');
     assert.equal(await page.inputValue('#feedbackDescription'),description);assert.equal(await page.inputValue('#feedbackCategory'),'calculation');assert.equal(await page.locator('#feedbackConfirm').isChecked(),true);assert.equal(await page.locator('#feedbackPreview').textContent(),preview);
    }
    await page.selectOption('#chloha-locale',locale);const stableCalculation=await calculation(page);
    let posts=0,payload;
    await page.route('**/v1/reports',async route=>{posts++;payload=route.request().postDataJSON();await sleep(150);await route.continue();});
    await page.evaluate(()=>{const f=document.getElementById('feedbackForm');f.requestSubmit();f.requestSubmit();});
    await page.waitForFunction(()=>document.getElementById('feedbackFields').disabled);await textEquals(page,'#feedbackSubmit','sending');
    // Language changes also preserve a pending draft and localize the eventual success.
    await page.selectOption('#chloha-locale',other);await page.waitForFunction(()=>document.getElementById('feedbackStatus').textContent.includes(window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),'success')));
    assert.equal(posts,1);assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);assert.equal(payload.email,'');assert.deepEqual(payload.snapshot,JSON.parse(preview));assert.equal(await calculation(page),stableCalculation);
    await page.selectOption('#chloha-locale',locale);assert.ok((await page.locator('#feedbackStatus').textContent()).startsWith(await key(page,'success')));assert.equal(await page.locator('#feedbackSubmit').isDisabled(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No mobile horizontal overflow');
    if(['ja','en'].includes(locale))await page.locator('#feedbackPanel').screenshot({path:'test-results/feedback-'+locale+'.png'});
    await page.locator('#feedbackClose').click();assert.equal(await page.locator('#feedbackPanel').isVisible(),false);assert.equal(await page.locator('#feedbackButton').evaluate(n=>n===document.activeElement),true);await page.click('#feedbackButton');assert.equal(await page.inputValue('#feedbackDescription'),description);await page.locator('#feedbackDescription').press('Escape');assert.equal(await page.locator('#feedbackPanel').isVisible(),false);assert.deepEqual(errors,[],locale);
    console.log('PASS feedback locale '+locale+': form, validation, preview/consent, stale inputs, draft retention, double-submit, success and calculator parity');
   }finally{await context.close();await app.close();}
  }
  {
   const app=await startLocalApp(),{page,context,errors}=await newPage(browser,app,'en',{disconnected:true});
   try{await page.click('#feedbackButton');await textEquals(page,'#feedbackStatus','unavailable');assert.equal(await page.locator('#feedbackSubmit').isDisabled(),true);await fill(page);await page.selectOption('#chloha-locale','ko');assert.equal(await page.inputValue('#feedbackDescription'),'Synthetic feedback test. No real user data.');assert.equal(app.calls.siteverify.length,0);assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);assert.deepEqual(errors,[]);console.log('PASS disconnected configuration: no network submission or false success');}finally{await context.close();await app.close();}
  }
  {
   const app=await startLocalApp(),{page,context,errors}=await newPage(browser,app);
   try{
    await open(page);await fill(page);
    for(const kind of ['non-json','false-success','network']){
     await page.route('**/v1/reports',route=>kind==='network'?route.abort():route.fulfill({status:kind==='false-success'?200:201,contentType:'application/json',body:kind==='non-json'?'not json':JSON.stringify({ok:true,receipt:crypto.randomUUID()})}));
     await page.click('#feedbackSubmit');await page.waitForFunction(()=>!document.getElementById('feedbackErrors').hidden);await textEquals(page,'#feedbackErrors','failure');assert.equal(await page.inputValue('#feedbackDescription'),'Synthetic feedback test. No real user data.');await page.unroute('**/v1/reports');
    }
    // The first delivery is stored but its response is lost; retry must retain its idempotency key.
    let originalId;
    await page.route('**/v1/reports',async route=>{originalId=route.request().postDataJSON().requestId;await route.fetch();await route.fulfill({status:503,json:{error:'unavailable'}});});
    await page.click('#feedbackSubmit');await page.waitForFunction(()=>!document.getElementById('feedbackErrors').hidden);assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);await page.unroute('**/v1/reports');
    let retryId;await page.route('**/v1/reports',async route=>{retryId=route.request().postDataJSON().requestId;await route.continue();});await page.click('#feedbackSubmit');await page.waitForFunction(()=>document.getElementById('feedbackStatus').textContent.includes(window.ChlohaFeedbackLocales.text('en','localSuccess')));assert.equal(retryId,originalId);assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);assert.deepEqual(errors,[]);console.log('PASS API/network failure, false-success rejection, local-only disclosure and idempotent retry');
   }finally{await context.close();await app.close();}
  }
  {
   const app=await startLocalApp({adminEdge:true}),context=await browser.newContext(),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    const body=reportBody({description:'<img src=x onerror="window.stolen=true"><script>window.stolen=true</script>',email:'private@example.test'}),r=await app.request('/v1/reports',{method:'POST',body});assert.equal(r.status,201);
    await page.goto(app.origin+'/admin/');await page.locator('#reports button').first().click();await page.waitForFunction(expected=>document.getElementById('description').textContent===expected,body.description);assert.equal(await page.locator('#description').textContent(),body.description);assert.equal(await page.evaluate(()=>Boolean(window.stolen)),false);assert.equal(await page.inputValue('#issueBody'),'');assert.equal(await page.inputValue('#issueTitle'),'');
    await page.selectOption('#reviewStatus','Reviewing');await page.click('#saveStatus');await page.waitForFunction(()=>document.getElementById('message').textContent==='Status saved.');await page.selectOption('#reviewStatus','Accepted');await page.click('#saveStatus');await page.waitForFunction(()=>!document.getElementById('publish').disabled);
    await page.fill('#issueTitle','Synthetic technical test');await page.fill('#issueBody','Private contact private@example.test');await page.check('#reviewed');await page.click('#publish');await page.waitForFunction(()=>document.getElementById('message').textContent.includes('email address'));assert.equal(app.calls.issues.length,0);
    await page.fill('#issueTitle','Synthetic technical test');await page.fill('#issueBody','Reviewed neutral calculation reproduction.');await page.check('#reviewed');await page.click('#publish');await page.waitForFunction(()=>!document.getElementById('issueLink').hidden);assert.equal(app.calls.issues.length,1);assert.ok(!JSON.stringify(app.calls.issues[0]).includes('private@example.test'));assert.ok(!JSON.stringify(app.calls.issues[0]).includes('<img'));
    await page.check('#deleteConfirm');await page.click('#delete');await page.waitForFunction(()=>document.getElementById('detail').hidden);assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);assert.equal(app.calls.issues.length,1);assert.deepEqual(errors,[]);console.log('PASS authenticated admin browser: XSS protection, status, explicit approval, private-data exclusion, Issue creation and deletion');
   }finally{await context.close();await app.close();}
  }
 }finally{await browser.close();}
 console.log('PASS v0.185 anonymous feedback browser integration');
})().catch(e=>{console.error(e);process.exitCode=1});
