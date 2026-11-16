'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const {startLocalApp}=await import('../services/feedback/test/harness.mjs');
 const app=await startLocalApp(),browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844}});let posts=0;
 try{
  await context.addInitScript(()=>localStorage.setItem('chloha.damageLab.locale','es-LA'));
  await context.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(u.hostname==='challenges.cloudflare.com')return route.fulfill({contentType:'text/javascript',body:"window.turnstile={render(){return 'test'},remove(){},reset(){}}"});
   if(u.origin!==app.origin)return route.abort();
   if(u.pathname==='/feedback-config-v0185.js')return route.fulfill({contentType:'text/javascript',body:fs.readFileSync('feedback-config-v0185.js','utf8').replace('https://chloha-private-feedback.kurohanolu-labs.workers.dev',app.origin)});
   if(u.pathname==='/v1/reports'&&route.request().method()==='POST')posts++;
   return route.continue();
  });
  const page=await context.newPage();await page.goto(app.origin);await page.click('#feedbackButton');
  await page.waitForFunction(()=>document.getElementById('feedbackStatus').textContent.includes('temporalmente deshabilitado'));
  assert.equal(await page.locator('#feedbackSubmit').isDisabled(),true);
  assert.equal(await page.locator('#feedbackFields').evaluate(node=>node.disabled),true);
  assert.equal(await page.locator('#feedbackDescription').isDisabled(),true);
  await page.evaluate(()=>document.getElementById('feedbackForm').requestSubmit());assert.equal(posts,0);
  await page.selectOption('#chloha-locale','en');await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled);
  await page.fill('#feedbackDescription','Retained draft');
  await page.selectOption('#chloha-locale','es-LA');assert.equal(await page.locator('#feedbackSubmit').isDisabled(),true);
  await page.evaluate(()=>document.getElementById('feedbackForm').requestSubmit());assert.equal(posts,0);
  await page.selectOption('#chloha-locale','ja');await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled);
  assert.equal(await page.inputValue('#feedbackDescription'),'Retained draft');
  assert.equal(await page.locator('#feedbackFields').evaluate(node=>node.disabled),false);assert.equal(posts,0);
  assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);
  fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/feedback-pause.json',JSON.stringify({passed:true,blockedLocale:'es-LA',posts,localeSwitchRestores:true,draftRetained:true})+'\n');
  console.log('PASS ES-LA feedback pause: visible notice, submit guard, language switches, retained draft, zero posts');
 }finally{await context.close();await browser.close();await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
