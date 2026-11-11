const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'),{waitUntil:'load'});
  await page.locator('#chloha-locale').waitFor();
  assert.equal(await page.locator('html').getAttribute('lang'),'ja');
  assert.equal(await page.evaluate(()=>window.ChlohaNames.pokemon.indeedee_m),'Indeedee (Male)','initial catalog preserved');
  assert.equal(await page.evaluate(()=>window.ChlohaNames.moves['ワイドフォース']),'Expanding Force','move names loaded');
  const before=await page.evaluate(()=>window.ChlohaDamageEngine.calculate({level:50,power:90,attack:120,defense:120,hp:160,currentHp:160,attackStage:0,defenseStage:0,moveType:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['エスパー'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:160,attMaxHp:160,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'singles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'auto',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false}).rolls);
  await page.locator('#chloha-locale').selectOption('en');
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.equal(await page.evaluate(()=>window.ChlohaLocale.get()),'en');
  assert.equal(await page.locator('#copy').textContent(),'Copy','copy control translated');
  assert.equal(await page.locator('#rollsLabel').textContent(),'16 damage rolls','damage roll heading translated');
  assert.equal(await page.locator('#reliabilityTitle').textContent(),'Verification status','verification heading translated');
  assert.equal(await page.locator('label:has(#battleFormat)').first().textContent().then(x=>x.includes('Battle format')),true,'battle format label translated');
  await page.locator('#attSearch').fill('Charizard');
  await page.locator('#attSuggestions [role=option]').first().waitFor();
  await page.locator('#attSuggestions [role=option]').first().click();
  assert.equal(await page.locator('#dbAttPokemon').inputValue(),'charizard');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('lang'),'en','language persisted');
  await page.locator('#chloha-locale').selectOption('ja');
  assert.equal(await page.locator('html').getAttribute('lang'),'ja');
  const after=await page.evaluate(()=>window.ChlohaDamageEngine.calculate({level:50,power:90,attack:120,defense:120,hp:160,currentHp:160,attackStage:0,defenseStage:0,moveType:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['エスパー'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:160,attMaxHp:160,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'singles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'auto',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false}).rolls);
  assert.deepEqual(after,before,'locale cannot alter calculation');
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS v0.179 language toggle, persistence, English species search, catalog, damage invariant');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
