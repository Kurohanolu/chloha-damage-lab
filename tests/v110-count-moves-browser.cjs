'use strict';
// Candidate UI regression. Engine and persistence schema are unchanged.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {startLab,launchBrowser,ready,mockFeedback}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const widths=[320,360,390,430,1280];
const moves=[
 {id:'gw0169_p011',mechanic:'lastRespects',panel:'lastRespectsPanel',input:'faintedAllies',max:5},
 {id:'gw0170_u031',mechanic:'rageFist',panel:'rageFistPanel',input:'rageFistHits',max:6}
];
const set=async(page,id,value)=>page.locator('#'+id).evaluate((node,value)=>{
 node.value=String(value);
 if(node.value!==String(value))throw Error('Unavailable value '+value);
 node.dispatchEvent(new Event('input',{bubbles:true}));
 node.dispatchEvent(new Event('change',{bubbles:true}));
},value);
const snapshot=page=>page.evaluate(()=>({
 move:document.getElementById('dbMove').value,
 a:structuredClone(ChlohaLastCalculation.a),
 r:JSON.parse(JSON.stringify(ChlohaLastCalculation.r)),
 controls:{last:document.getElementById('faintedAllies').value,rage:document.getElementById('rageFistHits').value}
}));
async function assertCount(page,spec,count,{legacy=false}={}){
 const panel=page.locator('#'+spec.panel),button=panel.locator('[data-move-count="'+Math.min(count,spec.max)+'"]');
 assert.equal(await panel.isVisible(),true,spec.mechanic+' visible');
 assert.equal(await panel.locator('[data-move-count]').count(),spec.max+1);
 assert.equal(await page.locator('#'+spec.input).inputValue(),String(count));
 assert.equal(await page.locator('#'+spec.input).isVisible(),false,'legacy numeric input is visually hidden');
 await page.waitForFunction(({panel,count,max})=>{
  const node=document.querySelector('#'+panel+' [data-move-count="'+Math.min(count,max)+'"]');
  return node?.getAttribute('aria-pressed')==='true';
 },{panel:spec.panel,count,max:spec.max});
 const field=spec.mechanic==='rageFist'?'hitsTaken':'faintedAllies',power=50+50*Math.min(count,spec.max);
 await page.waitForFunction(({field,count,power})=>{
  const state=window.ChlohaLastCalculation;
  return state?.a?.[field]===count&&state.r?.effectivePower===power&&state.r.rolls?.length===16;
 },{field,count,power});
 assert.deepEqual(await panel.locator('[data-move-count][aria-pressed="true"]').evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.moveCount))),[Math.min(count,spec.max)]);
 const bounds=await button.boundingBox();assert.ok(bounds.height>=44&&bounds.width>=44,'44px touch target');
 const state=await snapshot(page);
 assert.equal(state.a[field],count,'existing canonical input remains exact');
 assert.equal(state.r.effectivePower,power,'independent power formula');
 assert.equal(state.r.rolls.length,16);assert.ok(state.r.rolls[15]>0,'Nonimmune browser witness');
 const reference=await page.evaluate(power=>ChlohaDamageEngine.calculate({...ChlohaLastCalculation.a,moveMechanic:'none',power}),power);
 assert.deepEqual(state.r.rolls,reference.rolls,'all 16 rolls equal independent explicit power without the conditional mechanic');
 const copy=await page.evaluate(({mechanic,count})=>{
  const spec=ChlohaLocaleQuality.countSpecs.find(s=>s.kind===(mechanic==='rageFist'?1:0));
  return ChlohaLocaleQuality.countCopy(ChlohaLocale.get(),spec,Math.min(count,spec.max));
 },{mechanic:spec.mechanic,count});
 assert.equal(await panel.getAttribute('aria-label'),copy.title);
 assert.equal(await panel.locator('h2').textContent(),copy.title);
 assert.equal(await button.textContent(),copy.count);
 assert.equal(await panel.locator('#'+spec.panel+'PowerNote').textContent(),copy.power);
 assert.equal(await panel.getAttribute('data-no-translate'),'');
 assert.ok(!(await panel.textContent()).includes('undefined'));
 if(legacy)assert.equal(count>spec.max,true);
 return state;
}
(async()=>{
 const lab=await startLab(),browser=await launchBrowser(),report={passed:false,widths,locales,countCases:0,reloads:0,legacyCases:0,spitUpCases:0,errors:[]};
 try{
  for(const width of widths){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<1000,hasTouch:width<1000});
   await mockFeedback(context,lab.origin);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
   await page.goto(lab.origin+'/candidate/');await ready(page);
   await set(page,'dbAttPokemon','garchomp');await set(page,'dbDefPokemon','garchomp');
   for(const locale of locales){
    await page.locator('#chloha-locale').selectOption(locale);
    for(const spec of moves){
     await set(page,'dbMove',spec.id);
     assert.equal(await page.evaluate(()=>ChlohaMoveMechanic),spec.mechanic);
     for(let count=0;count<=spec.max;count++){
      await page.locator('#'+spec.panel+' [data-move-count="'+count+'"]').click();
      await assertCount(page,spec,count);report.countCases++;
     }
     if(locale==='en'&&width===390){
      const first=page.locator('#'+spec.panel+' [data-move-count="0"]');await first.focus();await first.press('Enter');await assertCount(page,spec,0);
      const last=page.locator('#'+spec.panel+' [data-move-count="'+spec.max+'"]');await last.focus();await last.press('Space');await assertCount(page,spec,spec.max);
      await page.locator('#swapSides').click();await set(page,'dbMove',spec.id);await last.click();await assertCount(page,spec,spec.max);
     }
     assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);
     const before=await snapshot(page);
     await page.reload();await ready(page);report.reloads++;
     assert.equal(await page.locator('#chloha-locale').inputValue(),locale);
     assert.deepEqual(await snapshot(page),before,'reload preserves complete input/result '+locale+'/'+spec.mechanic);
     await assertCount(page,spec,spec.max);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'horizontal fit '+width+'/'+locale);
    }
    // Rage Fist's old numeric field allowed values beyond the six-hit power cap.
    // A saved value of 12 must stay 12 while the visible selection reads 6+.
    const rage=moves[1];await set(page,'dbMove',rage.id);await set(page,rage.input,12);
    await assertCount(page,rage,12,{legacy:true});
    assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);
    const prior=await snapshot(page);await page.reload();await ready(page);report.reloads++;
    assert.deepEqual(await snapshot(page),prior,'old >6 snapshot preserved '+locale);
    await assertCount(page,rage,12,{legacy:true});report.legacyCases++;
    await set(page,'dbMove',await page.evaluate(()=>ChlohaMovesDB.moves.find(m=>m.name==='はきだす').id));
    assert.equal(await page.locator('#lastRespectsPanel').isVisible(),false);
    assert.equal(await page.locator('#rageFistPanel').isVisible(),false);
    assert.equal(await page.locator('#spitUpPanel').isVisible(),true);
    for(const [count,power] of [[1,100],[2,200],[3,300]]){
     await page.locator('#spitUpPanel [data-stockpile="'+count+'"]').click();
     assert.equal(Number(await page.locator('#power').inputValue()),power);
     assert.equal(await page.locator('#spitUpPanel [data-stockpile="'+count+'"]').getAttribute('aria-pressed'),'true');
     assert.equal((await snapshot(page)).r.rolls.length,16);
     report.spitUpCases++;
    }
    await set(page,'dbMove',await page.evaluate(()=>ChlohaMovesDB.moves.find(m=>m.name==='じしん').id));
    assert.equal(await page.locator('#spitUpPanel').isVisible(),false);
    assert.equal(await page.locator('#lastRespectsPanel').isVisible(),false);
    assert.equal(await page.locator('#rageFistPanel').isVisible(),false);
   }
   await context.close();
  }
  assert.deepEqual(report.errors,[],'no browser exceptions');
  report.passed=true;console.log('PASS count move buttons '+JSON.stringify(report));
 }finally{
  fs.mkdirSync('reports/v110',{recursive:true});
  fs.writeFileSync('reports/v110/count-moves-browser.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();await lab.close();
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
