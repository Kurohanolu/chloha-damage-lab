'use strict';
const assert=require('node:assert/strict');
const {startLab,launchBrowser,blockExternal,ready}=require('./helpers/v0188-browser-lab.cjs');
(async()=>{let lab,browser;try{
 lab=await startLab({compare:true,comparisonRef:'3fc0959f5a1447d4c241c4db4071452d2e97559d'});browser=await launchBrowser();
 for(const width of [390,1440]){const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),a=await context.newPage(),b=await context.newPage();await blockExternal(context,a);await blockExternal(context,b);await a.goto(lab.origin+'/candidate/');await b.goto(lab.origin+'/baseline/');await ready(a);await ready(b);
 for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA']){
  for(const p of [a,b]){await p.selectOption('#chloha-locale',locale);await p.locator('#allyPowerSpot').evaluate(n=>{for(let e=n.parentElement;e;e=e.parentElement)if(e.tagName==='DETAILS')e.open=true;});}
  const label=p=>p.locator('#allyPowerSpot').evaluate(n=>n.parentElement.textContent.trim());
  if(locale==='es-LA')assert.equal(await label(a),'Fuente Energía de un aliado (daño ×1,3)');else assert.equal(await label(a),await label(b));
  for(const active of [false,true,false]){
   for(const p of [a,b]){await p.locator('#allyPowerSpot').setChecked(active);await p.evaluate(()=>new Promise(requestAnimationFrame));}
   const numeric=p=>p.evaluate(()=>JSON.stringify({a:ChlohaLastCalculation.a,r:ChlohaLastCalculation.r},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
   assert.equal(await numeric(a),await numeric(b),'Full numerical state '+locale+'/'+active);
  }
  await a.locator('#allyPowerSpot').check();assert.equal(await a.evaluate(()=>ChlohaPersistence.save()),true);await a.reload();await ready(a);assert.equal(await a.locator('#chloha-locale').inputValue(),locale);assert.equal(await a.locator('#allyPowerSpot').isChecked(),true);
  if(locale==='es-LA')assert.equal(await label(a),'Fuente Energía de un aliado (daño ×1,3)');
 }
 await context.close();}
 console.log('PASS Power Spot browser: 10 locales, 2 widths, repeated toggles, full numerical equality and save/reload');
 }finally{if(browser)await browser.close();if(lab)await lab.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
