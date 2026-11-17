'use strict';
const assert=require('node:assert/strict');
const {startLab,launchBrowser,blockExternal,ready}=require('./helpers/v0188-browser-lab.cjs');
// The existing Power Spot control is a hidden legacy input, not a reachable UI toggle.
// Exercise its persisted-state binding without changing its visibility or claiming click coverage.
const setLegacyPowerSpot=async(p,active)=>{
 assert.equal(await p.locator('#allyPowerSpot').isVisible(),false,'Legacy control must remain hidden');
 await p.locator('#allyPowerSpot').evaluate((n,value)=>{n.checked=value;n.dispatchEvent(new Event('input',{bubbles:true}));n.dispatchEvent(new Event('change',{bubbles:true}));},active);
 await p.evaluate(()=>new Promise(requestAnimationFrame));
 assert.equal(await p.locator('#allyPowerSpot').isChecked(),active);
 assert.equal(await p.evaluate(()=>ChlohaLastCalculation.a.allyPowerSpot),active,'Calculation consumes legacy state');
};
const numeric=p=>p.evaluate(()=>JSON.stringify({a:ChlohaLastCalculation.a,r:ChlohaLastCalculation.r},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
(async()=>{let lab,browser;try{
 lab=await startLab({compare:true,comparisonRef:'3fc0959f5a1447d4c241c4db4071452d2e97559d'});browser=await launchBrowser();
 for(const width of [390,1440]){const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'}),a=await context.newPage(),b=await context.newPage();await blockExternal(context,a);await blockExternal(context,b);await a.goto(lab.origin+'/candidate/');await b.goto(lab.origin+'/baseline/');await ready(a);await ready(b);
 for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA']){
  for(const p of [a,b]){await p.selectOption('#chloha-locale',locale);assert.equal(await p.locator('#allyPowerSpot').isVisible(),false);}
  const label=p=>p.locator('#allyPowerSpot').evaluate(n=>n.parentElement.textContent.trim());
  if(locale==='es-LA')assert.equal(await label(a),'Fuente Energía de un aliado (daño ×1,3)');else assert.equal(await label(a),await label(b));
  const results=[];
  for(const active of [false,true,false]){
   for(const p of [a,b]){await setLegacyPowerSpot(p,active);}
   results.push(await a.evaluate(()=>JSON.stringify(ChlohaLastCalculation.r)));
   assert.equal(await numeric(a),await numeric(b),'Full numerical state '+locale+'/'+active);
  }
  assert.notEqual(results[0],results[1],'Power Spot changes calculation result');assert.equal(results[0],results[2],'Turning off restores result');
  await setLegacyPowerSpot(a,true);await setLegacyPowerSpot(b,true);assert.equal(await a.evaluate(()=>ChlohaPersistence.save()),true);await a.reload();await ready(a);assert.equal(await a.locator('#chloha-locale').inputValue(),locale);assert.equal(await a.locator('#allyPowerSpot').isChecked(),true);assert.equal(await a.locator('#allyPowerSpot').isVisible(),false);
  assert.equal(await a.evaluate(()=>ChlohaLastCalculation.a.allyPowerSpot),true);assert.equal(await numeric(a),await numeric(b),'Reload numeric parity');
  if(locale==='es-LA')assert.equal(await label(a),'Fuente Energía de un aliado (daño ×1,3)');
 }
 await context.close();}
 console.log('PASS Power Spot legacy-state browser integration: 10 locales, 2 widths, repeated state changes, hidden binding, full numerical equality and save/reload; no reachable toggle claim');
 }finally{if(browser)await browser.close();if(lab)await lab.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
