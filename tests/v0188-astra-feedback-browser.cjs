'use strict';
// Browser integration against the local app: no production APIs or submitted reports.
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const widget='window.turnstile={render(n,o){queueMicrotask(()=>o.callback("valid-local-only"));return 1;},remove(){}};';
(async()=>{
 const {startLocalApp}=await import('../services/feedback/test/harness.mjs');
 const app=await startLocalApp(),browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 try{
  for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant']){
   const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();let posts=0;
   await context.addInitScript(l=>localStorage.setItem('chloha.damageLab.locale',l),locale);
   await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='challenges.cloudflare.com')return route.fulfill({contentType:'text/javascript',body:widget});if(url.origin!==app.origin)return route.abort();if(url.pathname==='/v1/reports'){posts++;return route.abort();}return route.continue();});
   await page.goto(app.origin+'/');await page.waitForFunction(()=>window.ChlohaPersistence&&window.ChlohaLastCalculation);
   await page.click('#feedbackButton');await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled);
   await page.selectOption('#feedbackCategory','calculation');await page.fill('#feedbackDescription','Synthetic local-only attachment regression');
   await page.check('#feedbackAttach');
   const approve=async()=>{await page.click('#feedbackRefresh');await page.check('#feedbackConfirm');};
   const stale=async label=>{assert.equal(await page.locator('#feedbackStale').isVisible(),true,label);assert.equal(await page.locator('#feedbackConfirm').isChecked(),false,label);await page.click('#feedbackSubmit');assert.equal(await page.locator('#feedbackErrors').textContent(),await page.evaluate(()=>ChlohaFeedbackLocales.text(ChlohaLocale.get(),'attachmentError')));assert.equal(posts,0);};
   await approve();await page.locator('#attPresets button').first().click();await stale(locale+' preset');
   await approve();await page.click('#swapSides');await stale(locale+' swap');
   await approve();await page.click('#resetCalculation');await stale(locale+' reset');
   await approve();await page.fill('#att-attack-points','17');await stale(locale+' six-stat input');
   await approve();const other=locale==='en'?'ja':'en';await page.selectOption('#chloha-locale',other);await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await page.locator('#feedbackConfirm').isChecked(),true,'locale-only change preserves approved technical snapshot');
   // Even a programmatic input change with no DOM event is caught at submit.
   await page.evaluate(()=>{document.getElementById('weather').value='rain';});await page.click('#feedbackSubmit');await stale(locale+' silent change at submit');
   await context.close();console.log('PASS '+locale+' attachment consent across preset/swap/reset/model edits and reload-independent submission guard');
  }
  assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);
 }finally{await browser.close();await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
