'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const witnesses=[...require('./fixtures/v0186-confirmed-regressions.json').cases,...require('./fixtures/v0186-move-regressions.json').cases];
const html=fs.readFileSync(root+'/index.html','utf8'),moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const dualId=moves.find(m=>m.name==='ダブルウイング').id;
const controls=['dbAttPokemon','dbDefPokemon','dbMove','attackStage','defenseStage','attAbility','defAbility','attItem','defItem','weather','terrain','power','attack','defense','hp','currentHp','burn','critical','conditionalPower'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  // This suite never posts feedback or touches production services.
  await page.route('https://*.workers.dev/**',r=>r.abort());
  await page.goto('file://'+root+'/index.html');
  await page.waitForFunction(()=>!!window.ChlohaLastCalculation);
  let transitions=0,vectorChecks=0;
  for(let start=0;start<locales.length;start++){
   await page.locator('#chloha-locale').selectOption(locales[start]);
   await page.reload();await page.waitForFunction(()=>!!window.ChlohaLastCalculation);
   assert.equal(await page.locator('#chloha-locale').inputValue(),locales[start],'language persists on reload');
   for(const id of ['gravApple',dualId]){
    await page.locator('#dbMove').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},id);
    await page.waitForFunction(id=>window.ChlohaLastCalculation?.a.moveId===id,id);
    const state=await page.evaluate(()=>({a:window.ChlohaLastCalculation.a,r:window.ChlohaLastCalculation.r}));
    assert.equal(state.r.rolls.length,id===dualId?256:16,locales[start]+'/'+id+': existing UI path must calculate');
   }
   const snapshot=()=>page.evaluate(ids=>({input:window.ChlohaLastCalculation.a,rolls:window.ChlohaLastCalculation.r.rolls,controls:Object.fromEntries(ids.map(id=>{const el=document.getElementById(id);return [id,el.type==='checkbox'?el.checked:el.value];}))}),controls);
   const before=await snapshot();
   for(let step=0;step<=locales.length;step++){
    const locale=locales[(start+step)%locales.length];await page.locator('#chloha-locale').selectOption(locale);
    assert.deepEqual(await snapshot(),before,'UI inputs and numeric result must survive '+locales[start]+' → '+locale);
    const results=await page.evaluate(cases=>cases.map(c=>Array.from(window.ChlohaDamageEngine.calculate(c.input).rolls)),witnesses);
    for(let i=0;i<witnesses.length;i++)assert.deepEqual(results[i],witnesses[i].expected,locale+'/'+(witnesses[i].id||i));
    const label=await page.locator('#feedbackButton').innerText();assert.ok(label.trim(),'feedback entry remains available');
    if(locale!=='ja')assert.ok(!/[ぁ-んァ-ヶ]/.test(label),'feedback label must follow locale');
    transitions++;vectorChecks+=witnesses.length;
   }
  }
  assert.deepEqual(errors,[],'no page runtime errors');
  fs.mkdirSync(root+'/reports/v0186',{recursive:true});fs.writeFileSync(root+'/reports/v0186/nine-locale-mechanics.json',JSON.stringify({locales,startingLocales:9,reloads:9,transitions,vectorChecks,feedbackProductionPosts:0,pageErrors:errors},null,2)+'\n');
  console.log('PASS v0.186 nine-language mechanics:',transitions,'transitions,',vectorChecks,'independent regression vectors, 9 reloads, Grav Apple/Dual Wingbeat UI paths');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
