'use strict';
// Live UI integration. All requests stay local; no feedback or production mutations.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'],key='singularity.calculator.v1';
const set=async(page,id,value)=>page.locator('#'+id).evaluate((node,value)=>{if(node.type==='checkbox')node.checked=value;else node.value=String(value);node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}));},value);
const snapshot=page=>page.evaluate(()=>({state:ChlohaPersistence.capture(),input:ChlohaLastCalculation.a,rolls:ChlohaLastCalculation.r.rolls}));
const waitSaved=page=>page.waitForFunction(key=>{const raw=localStorage.getItem(key);return raw&&JSON.stringify(JSON.parse(raw).state)===JSON.stringify(ChlohaPersistence.capture());},key);
// Neutral Lv50 Attack150/Defense100, no STAB or extra modifiers. This oracle
// neither reads production rolls nor calls an engine rounding helper.
const expectedRolls=power=>{const base=Math.floor(Math.floor(22*power*150/100)/50)+2;return Array.from({length:16},(_,i)=>Math.floor(base*(85+i)/100));};
(async()=>{
 const lab=await startLab();let browser;const evidence={realDevice:false,viewport:390,locales,foulPlayReloads:0,speedReloads:0,numericalCases:[]};
 try{
  browser=await launchBrowser();const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();await blockExternal(context,page);const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(lab.origin+'/candidate/');await ready(page);await page.waitForFunction(()=>!!window.ChlohaPersistence);
  for(const locale of locales){
   await page.locator('#chloha-locale').selectOption(locale);await page.locator('#resetCalculation').click();
   const foulId=await page.evaluate(()=>ChlohaGameData.moves.find(m=>m.name==='イカサマ').id);await set(page,'dbMove',foulId);
   for(const [id,value] of Object.entries({'def-attack-points':32,'def-hp-points':32,'def-specialDefense-points':32,'def-speed-points':2,dbFoulAttackEv:0}))await set(page,id,value);
   await waitSaved(page);const foul=await snapshot(page);
   assert.equal(Object.values(foul.state.models.def.points).reduce((a,b)=>a+b,0),98);
   assert.equal(foul.rolls.length,16);await page.reload();await ready(page);await page.waitForFunction(()=>!!window.ChlohaPersistence);
   assert.deepEqual(await snapshot(page),foul,locale+' valid effective66 Foul Play state and all rolls restored');evidence.foulPlayReloads++;
   const stored=await page.evaluate(key=>localStorage.getItem(key),key);await set(page,'def-speed-points',3);
   await page.waitForFunction(()=>!ChlohaPersistence.status().pending);
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),stored,locale+' invalid effective67 preserves last valid saved state');
   assert.equal(await page.evaluate(()=>ChlohaLastCalculation),null,locale+' invalid effective67 has no stale result');
   await page.locator('#resetCalculation').click();
   const electroId=await page.evaluate(()=>ChlohaGameData.moves.find(m=>m.name==='エレキボール').id);await set(page,'dbMove',electroId);await set(page,'dbAuto',false);
   for(const [id,value] of Object.entries({attack:150,defense:100,attSpeed:122,defSpeed:81,attType1:'ノーマル',attType2:'なし',defType1:'ノーマル',defType2:'なし',moveType:'でんき',stabMode:'none',attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',weather:'none',terrain:'none',attackStage:0,defenseStage:0,battleFormat:'singles',spread:'single'}))await set(page,id,value);
   assert.equal(await page.evaluate(()=>ChlohaLastCalculation.r.effectivePower),60);
   assert.deepEqual((await snapshot(page)).rolls,expectedRolls(60),locale+' initial Speed122/81 independent16rolls');
   for(const side of ['att','def']){if(await page.locator('#'+side+'Stats').isHidden())await page.locator('#'+side+'StatsToggle').click();}
   await page.locator('#att-speed-actual').fill('200');await page.locator('#att-speed-actual').press('Tab');
   assert.equal(await page.locator('#attSpeed').inputValue(),'200');assert.equal(await page.locator('#defSpeed').inputValue(),'81');
   assert.equal(await page.evaluate(()=>ChlohaLastCalculation.r.effectivePower),80);assert.deepEqual((await snapshot(page)).rolls,expectedRolls(80),locale+' attacker Speed200/81 updates16rolls');
   await page.locator('#def-speed-actual').fill('240');await page.locator('#def-speed-actual').press('Tab');
   assert.equal(await page.locator('#attSpeed').inputValue(),'200');assert.equal(await page.locator('#defSpeed').inputValue(),'240');
   assert.equal(await page.evaluate(()=>ChlohaLastCalculation.r.effectivePower),40);assert.deepEqual((await snapshot(page)).rolls,expectedRolls(40),locale+' defender Speed200/240 updates16rolls');
   await set(page,'attSpeed',300);await set(page,'attMaxHp',250);await set(page,'hp',260);
   assert.equal(await page.locator('#att-speed-actual').inputValue(),'300',locale+' direct Speed control updates table');
   assert.equal(await page.locator('#att-hp-actual').inputValue(),'250',locale+' direct attacker HP updates table');
   assert.equal(await page.locator('#def-hp-actual').inputValue(),'260',locale+' direct defender HP updates table');
   await waitSaved(page);const final=await snapshot(page);await page.reload();await ready(page);await page.waitForFunction(()=>!!window.ChlohaPersistence);
   assert.deepEqual(await snapshot(page),final,locale+' manual Speed/HP complete state and16rolls restored');
   assert.equal(await page.locator('#att-speed-actual').inputValue(),'300');assert.equal(await page.locator('#def-speed-actual').inputValue(),'240');
   assert.equal(await page.locator('#att-hp-actual').inputValue(),'250');assert.equal(await page.locator('#def-hp-actual').inputValue(),'260');
   assert.equal(await page.locator('#chloha-locale').inputValue(),locale);evidence.speedReloads++;
   evidence.numericalCases.push({locale,speeds:[[122,81],[200,81],[200,240]],powers:[60,80,40],rolls:[expectedRolls(60),expectedRolls(80),expectedRolls(40)]});
  }
  assert.deepEqual(errors,[]);fs.mkdirSync('reports/v0188',{recursive:true});fs.writeFileSync('reports/v0188/continued-state-browser.json',JSON.stringify(evidence,null,2)+'\n');
  console.log('PASS continued state browser: Foul Play effective budget98-32=66 restoration, invalid67 preservation, manual Speed/HP canonical routing and independent16rolls in nine locales (390px emulation)');
 }finally{if(browser)await browser.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
