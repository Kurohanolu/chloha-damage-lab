'use strict';
const assert=require('node:assert/strict');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const set=async(page,id,value)=>page.locator('#'+id).evaluate((node,value)=>{if(node.type==='checkbox')node.checked=value;else node.value=String(value);node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}));},value);
const snapshot=page=>page.evaluate(()=>({state:ChlohaPersistence.capture(),input:ChlohaLastCalculation.a,rolls:ChlohaLastCalculation.r.rolls}));
(async()=>{
 const lab=await startLab();let browser;
 try{
  browser=await launchBrowser();const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();await blockExternal(context,page);const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(lab.origin+'/candidate/');await ready(page);await page.waitForFunction(()=>!!window.ChlohaPersistence);
  for(let i=0;i<locales.length;i++){
   const locale=locales[i];await page.locator('#chloha-locale').selectOption(locale);await page.locator('#resetCalculation').click();
   await set(page,'dbAuto',false);
   const original=await snapshot(page),attackerHp=200+i,defenderHp=210+i;
   await set(page,'att-hp-actual',attackerHp);
   assert.equal(await page.locator('#attMaxHp').inputValue(),String(attackerHp),locale+' attacker HP target');
   assert.equal(await page.locator('#hp').inputValue(),original.state.controls.hp,locale+' attacker edit preserves defender HP');
   const afterAttacker=await snapshot(page);
   assert.deepEqual(afterAttacker.rolls,original.rolls,locale+' Earthquake raw rolls unchanged by attacker HP');
   assert.equal(afterAttacker.input.hp,original.input.hp,locale+' defender percentage denominator unchanged');
   await set(page,'def-hp-actual',defenderHp);
   assert.equal(await page.locator('#attMaxHp').inputValue(),String(attackerHp),locale+' defender edit preserves attacker HP');
   assert.equal(await page.locator('#hp').inputValue(),String(defenderHp),locale+' defender HP target');
   // Exercise the event-driven debounce rather than invoking the save API.
   await page.waitForFunction(({attackerHp,defenderHp})=>{const raw=localStorage.getItem('singularity.calculator.v1');if(!raw)return false;const c=JSON.parse(raw).state.controls;return c.attMaxHp===String(attackerHp)&&c.hp===String(defenderHp);},{attackerHp,defenderHp});
   const saved=await snapshot(page);assert.equal(saved.rolls.length,16);
   await page.reload();await ready(page);await page.waitForFunction(()=>!!window.ChlohaPersistence);
   assert.deepEqual(await snapshot(page),saved,locale+' distinct HP/model/input/16-roll restoration');
   assert.equal(await page.locator('#chloha-locale').inputValue(),locale,locale+' language restored');
  }
  assert.deepEqual(errors,[]);
  console.log('PASS Astra state browser: manual attacker/defender HP independence, normal automatic save, complete state/input/16-roll equality after reload in all nine locales (390px emulation)');
 }finally{if(browser)await browser.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
