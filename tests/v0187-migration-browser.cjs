'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {buildSites}=require('../scripts/v0187-build-sites.cjs');
const {startPreview}=require('../scripts/v0187-preview-server.cjs');
const {loadPublicContracts}=require('./helpers/public-release-contract.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const descriptions=['ポケモン ダメージ計算機','Pokémon Damage Calculator','Calculateur de dégâts Pokémon','Pokémon-Schadensrechner','Calculadora de daño Pokémon','Calcolatore di danni Pokémon','포켓몬 데미지 계산기','宝可梦伤害计算器','寶可夢傷害計算器'];
const widget=`(()=>{let n=0;const widgets=new Map();window.turnstile={render(node,options){const id='migration-'+(++n);widgets.set(id,options);queueMicrotask(()=>options.callback('valid-'+crypto.randomUUID()));return id;},reset(id){const options=widgets.get(id);if(options)queueMicrotask(()=>options.callback('valid-'+crypto.randomUUID()));},remove(id){widgets.delete(id);}};})();`;
const contracts=loadPublicContracts().cases;
const state=page=>page.evaluate(()=>JSON.stringify({input:window.ChlohaLastCalculation.a,result:window.ChlohaLastCalculation.r,ids:['dbAttPokemon','dbDefPokemon','dbMove','attAbility','defAbility','attItem','defItem','weather','terrain','attackStage','defenseStage'].map(id=>[id,document.getElementById(id).value])}));
async function vectors(page){
 const actual=await page.evaluate(cases=>cases.map(fixture=>{
  try{const output=fixture.entry==='core'?window.ChlohaDamageEngine.calculate(structuredClone(fixture.input)):window.ChlohaDamageCalculator.calculate(structuredClone(fixture.input),structuredClone(fixture.options));return {output:JSON.parse(JSON.stringify(output,(_,item)=>Object.prototype.toString.call(item)==='[object Map]'?{mapEntries:[...item]}:item))};}
  catch(error){return {error:{name:error.name,message:error.message}};}
 }),contracts);
 actual.forEach((result,i)=>assert.deepEqual(result,contracts[i].expected,'proposed URL public contract: '+contracts[i].name));
 return actual.length;
}
async function contextFor(browser,preview,api,locale,width){
 api.env.ALLOWED_ORIGINS=preview.origin;
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 await context.addInitScript(value=>localStorage.setItem('chloha.damageLab.locale',value),locale);
 await context.route('**/*',route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='challenges.cloudflare.com'&&url.pathname.endsWith('/api.js'))return route.fulfill({contentType:'text/javascript',body:widget});
  if(url.origin!==preview.origin&&url.origin!==api.origin)return route.abort();
  if(url.origin===preview.origin&&url.pathname.endsWith('/feedback-config-v0185.js'))return route.fulfill({contentType:'text/javascript',body:'window.ChlohaFeedbackConfig=Object.freeze({apiBase:'+JSON.stringify(api.origin)+'});'});
  return route.continue();
 });
 return context;
}
async function ready(page){await page.waitForFunction(()=>!!window.ChlohaLastCalculation&&!!window.ChlohaLocale);}
async function openFeedback(page){await page.click('#feedbackButton');await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled);}
(async()=>{
 const {startLocalApp}=await import('../services/feedback/test/harness.mjs');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'singularity-browser-'));buildSites(temp);
 const preview=await startPreview(temp);let browser;
 try{browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});}
 catch(error){await preview.close();fs.rmSync(temp,{recursive:true,force:true});throw error;}
 const evidence={locales,proposedPath:'/singularity/',legacyPath:'/chloha-damage-lab/',mode:'local-URL-simulation-with-real-local-Worker-SQLite',numericChecks:0,successfulLocalReports:0,productionRequests:0,productionMutations:0};
 fs.mkdirSync('reports/v0187',{recursive:true});
 try{
  for(let index=0;index<locales.length;index++){
   const locale=locales[index],api=await startLocalApp(),context=await contextFor(browser,preview,api,locale,locale==='en'?1280:locale==='de'?320:390),page=await context.newPage(),errors=[],failedAssets=[];
   page.on('pageerror',error=>errors.push(error.message));page.on('requestfailed',request=>{const url=new URL(request.url());if(url.origin===preview.origin&&/\.(js|css|png|webp)$/.test(url.pathname))failedAssets.push(url.pathname);});
   try{
    await page.goto(preview.origin+'/singularity/',{waitUntil:'domcontentloaded'});await ready(page);
    assert.equal(await page.title(),'Singularity v0.187 Pre-Release 33');
    assert.equal(await page.locator('.product-description').textContent(),descriptions[index]);
    assert.ok((await page.locator('[data-singularity=credit]').textContent()).includes('Chloha Labs'));
    assert.equal(await page.locator('.brand-logo').evaluate(img=>img.decode().then(()=>img.naturalWidth>0)),true);
    const header=await page.evaluate(()=>{const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,height:r.height};};return {logo:rect('.brand-logo'),locale:rect('#chloha-locale-control'),control:rect('#chloha-locale'),version:rect('.version')};});
    const overlaps=(a,b)=>Math.min(a.right,b.right)>Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top);
    assert.equal(overlaps(header.logo,header.locale),false,'logo and language control must not overlap');assert.equal(overlaps(header.locale,header.version),false);assert.ok(header.control.height>=44,'language touch target');
    assert.equal((await page.request.get(preview.origin+'/singularity/assets/singularity/favicon.png')).status(),200);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no horizontal overflow: '+locale);
    const visible=await page.locator('#app').innerText();assert.ok(!/Chloha Damage Lab|CHLOHA TOOLS|DAMAGE LAB/.test(visible),'no unintended previous product name: '+locale);
    const color=await page.locator('body').evaluate(node=>getComputedStyle(node).backgroundColor);assert.equal(color,'rgb(8, 8, 13)');
    if(['ja','en','de'].includes(locale)){
     const name=locale==='en'?'desktop-en':locale==='de'?'mobile-de-320':'mobile-ja';
     await page.screenshot({path:'reports/v0187/'+name+'.png',fullPage:true});await page.screenshot({path:'reports/v0187/'+name+'-top.png'});
    }
    await page.locator('#chloha-locale').selectOption(locale);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),locale,'locale survives path reload');
    await page.locator('#moveSearch').fill('Erdbeben');assert.ok(await page.locator('#moveSuggestions [role=option]').count(),'multilingual move search');await page.locator('#moveSearch').fill('');
    await page.locator('#attSearch').fill('Dracolosse');assert.ok(await page.locator('#attSuggestions [role=option]').count(),'multilingual species search');await page.locator('#attSearch').fill('');
    await page.locator('#moveSearch').fill('Grav Apple');await page.locator('#moveSuggestions [role=option]').first().click();await page.waitForFunction(()=>window.ChlohaLastCalculation.a.moveId==='gravApple');
    const before=await state(page),other=locales[(index+1)%locales.length];await page.selectOption('#chloha-locale',other);assert.equal(await state(page),before,'locale preserves all numeric inputs/results');await page.selectOption('#chloha-locale',locale);
    evidence.numericChecks+=await vectors(page);
    if(locale==='ja'){await page.locator('#resultCard').scrollIntoViewIfNeeded();await page.screenshot({path:'reports/v0187/mobile-ja-result.png'});}
    await openFeedback(page);assert.equal(await state(page),before,'opening feedback preserves calculation');assert.equal(await page.isChecked('#feedbackAttach'),false);
    await page.click('#feedbackSubmit');assert.equal(await page.locator('#feedbackCategory').getAttribute('aria-invalid'),'true');
    await page.selectOption('#feedbackCategory','calculation');await page.fill('#feedbackDescription','Synthetic migration feedback '+locale);await page.check('#feedbackAttach');
    if(locale==='ja')await page.screenshot({path:'reports/v0187/feedback-ja.png'});
    const attachment=JSON.parse(await page.locator('#feedbackPreview').textContent());assert.equal(attachment.appVersion,'v0.187 Pre-Release 33');assert.equal(attachment.engineVersion,'0.184');assert.equal(attachment.locale,locale);await page.check('#feedbackConfirm');
    await page.selectOption('#chloha-locale',other);assert.equal(await page.inputValue('#feedbackDescription'),'Synthetic migration feedback '+locale);assert.equal(await page.isChecked('#feedbackConfirm'),true);await page.selectOption('#chloha-locale',locale);
    let requests=0,releasePost;const waiting=new Promise(resolve=>{releasePost=resolve;});
    await page.route('**/v1/reports',async route=>{if(route.request().method()==='POST'){requests++;await waiting;}return route.continue();});
    await page.click('#feedbackSubmit');await page.waitForFunction(()=>document.getElementById('feedbackSubmit').disabled);
    await page.evaluate(()=>{document.getElementById('feedbackForm').requestSubmit();document.getElementById('feedbackForm').requestSubmit();});
    releasePost();await page.waitForFunction(()=>document.getElementById('feedbackStatus').textContent.includes(window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),'localSuccess')));
    assert.equal(requests,1,'single submission while pending');assert.equal(api.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);evidence.successfulLocalReports++;
    assert.ok([401,403].includes((await page.request.get(api.origin+'/v1/admin/reports')).status()),'anonymous admin access remains denied');
    assert.deepEqual(errors,[]);assert.deepEqual(failedAssets,[]);
   }catch(error){await page.screenshot({path:'reports/v0187/failure-'+locale+'.png',fullPage:true}).catch(()=>{});throw error;}
   finally{await context.close();await api.close();}
  }
  // Existing URL remains a complete calculator. The explicit link opens a new
  // tab; old inputs and unsent feedback stay in the original document.
  const api=await startLocalApp(),context=await contextFor(browser,preview,api,'en',390),legacy=await context.newPage();
  try{
   await legacy.goto(preview.origin+'/chloha-damage-lab/');await ready(legacy);assert.equal(await legacy.title(),'Chloha Damage Lab v0.186 Pre-Release 32');evidence.numericChecks+=await vectors(legacy);
   await openFeedback(legacy);await legacy.fill('#feedbackDescription','Unsent old-URL draft');await legacy.click('#feedbackClose');const previous=await state(legacy);
   for(const locale of locales){await legacy.selectOption('#chloha-locale',locale);assert.ok((await legacy.locator('#singularityMigrationNotice').innerText()).includes('Singularity'));assert.equal(await state(legacy),previous);}
   await legacy.selectOption('#chloha-locale','en');await legacy.screenshot({path:'reports/v0187/legacy-en.png',fullPage:true});
   const opened=context.waitForEvent('page');await legacy.locator('#singularityMigrationNotice a').click();const next=await opened;await ready(next);
   assert.equal(new URL(next.url()).pathname,'/singularity/');assert.equal(await next.evaluate(()=>window.opener===null),true);assert.equal(new URL(legacy.url()).pathname,'/chloha-damage-lab/');assert.equal(await state(legacy),previous);assert.equal(await legacy.inputValue('#feedbackDescription'),'Unsent old-URL draft');assert.equal(await next.inputValue('#feedbackDescription'),'');
   // A retry after an API outage retains text and uses the real local Worker.
   await openFeedback(next);await next.selectOption('#feedbackCategory','bug');await next.fill('#feedbackDescription','Retained after outage');
   await next.route('**/v1/reports',route=>route.request().method()==='POST'?route.fulfill({status:503,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':preview.origin},body:'{"error":"temporarily_unavailable"}'}):route.continue());
   await next.click('#feedbackSubmit');await next.waitForFunction(()=>!document.getElementById('feedbackErrors').hidden);assert.equal(await next.inputValue('#feedbackDescription'),'Retained after outage');assert.equal(api.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);await next.unroute('**/v1/reports');
   await next.click('#feedbackSubmit');await next.waitForFunction(()=>document.getElementById('feedbackStatus').textContent.includes(window.ChlohaFeedbackLocales.text('en','localSuccess')));assert.equal(api.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);
  }finally{await context.close();await api.close();}
  fs.writeFileSync('reports/v0187/migration-browser.json',JSON.stringify(evidence,null,2)+'\n');
  console.log('PASS v0.187 proposed/legacy URL simulation:',evidence.numericChecks,'full numeric contracts; nine locales, logo assets, reload/search/state, phone/desktop, optional snapshots, duplicate prevention, outage/retry and anonymous admin denial; no production requests');
 }finally{await browser.close();await preview.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
