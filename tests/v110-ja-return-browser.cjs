'use strict';
// A language change must recover Japanese after real localized recalculation,
// native selection and committed history, not merely preserve numeric values.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const widths=[320,390],spanish=/Terremoto|Tierra|Eléctrico|Campo|Estimación|Estimado|sin verificar|confirmado|Turno|daño|PS máximos|del máximo|Seleccionado|No compatible|Piel Tosca/u;
const set=(page,id,value)=>page.locator('#'+id).evaluate((node,value)=>{if(node.type==='checkbox')node.checked=value;else{node.value=String(value);if(node.value!==String(value))throw Error('Unavailable canonical control '+node.id);}node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}));},value);
const expose=control=>control.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
const snapshot=page=>page.evaluate(()=>({state:ChlohaPersistence.capture(),calculation:JSON.parse(JSON.stringify(ChlohaLastCalculation,(_,value)=>value instanceof Map?{entries:[...value]}:value)),outputHidden:document.getElementById('output').hidden,errorHidden:document.getElementById('error').hidden,copyDisabled:document.getElementById('copy').disabled,battleCommitDisabled:document.getElementById('battleCommit').disabled}));
async function locale(page,value){await page.selectOption('#chloha-locale',value);await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await page.evaluate(()=>ChlohaLocale.get()),value);assert.equal(await page.locator('html').getAttribute('lang'),value==='es-LA'?'es-419':value);}
async function japanese(page,label,evidence,{history=false,blocked=false}={}){
 const expected=blocked?{'#error':/[\u3040-\u30ff]/u,'#miniDamage':/入力を確認してください/}:{'#miniDamage':/ダメージ/,'#miniPercent':/最大HPの/,'#percent':/最大HPの/,'#moveSelected':/じしん/,'#reliabilityDetails':/選択技「じしん（じめん \/ 100）/};
 if(history){expected['#battleHistory']=/1手目：じしん（じめん \/ 100）/;expected['#battleStatus']=/じしん（じめん \/ 100）.*を確定。相手HP .*フィールド：エレキフィールド/s;}
 const texts={};
 for(const [selector,pattern]of Object.entries(expected)){
  await expose(page.locator(selector));
  const text=await page.locator(selector).textContent();assert.match(text,pattern,label+' '+selector);assert.doesNotMatch(text,spanish,label+' Spanish residue '+selector);texts[selector]=text;
 }
 evidence.witnesses.push({label,texts});
}
(async()=>{
 let lab,browser,context;const evidence={widths,mode:'local Chromium mobile emulation',realDevice:false,productionRequests:0,productionMutations:0,witnesses:[],reloads:0,cases:[]};
 try{
  lab=await startLab();browser=await launchBrowser();
  for(const width of widths){
   context=await browser.newContext({viewport:{width,height:900},isMobile:true,hasTouch:true,serviceWorkers:'block'});
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));await blockExternal(context,page);
   await page.goto(lab.origin+'/candidate/');await ready(page);await locale(page,'ja');
   for(const [id,value]of Object.entries({dbAttPokemon:'garchomp',dbDefPokemon:'tyranitar',dbMove:'earthquake',attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',terrain:'none',customMultiplier:1}))await set(page,id,value);
   const initial=await snapshot(page);await japanese(page,width+' initial Japanese',evidence);
   await locale(page,'es-LA');assert.deepEqual(await snapshot(page),initial,'Language alone preserves complete state and calculation');
   assert.equal(await page.locator('#chloha-locale option:checked').textContent(),'ES-LA','Actual selected mobile label is compact');
   // Actual native changes and an input event create fresh result/warning nodes
   // while their adjacent source DOM is already Spanish.
   await set(page,'dbMove','electroBall');await set(page,'dbMove','earthquake');
   await set(page,'terrain','electric');await set(page,'customMultiplier',0.5);await ready(page);
   const recalculated=await snapshot(page);assert.equal(recalculated.calculation.a.customMultiplier,0.5);assert.equal(recalculated.calculation.a.terrain,'electric');
   assert.match(await page.locator('#reliabilityDetails').textContent(),/Terremoto/);
   await locale(page,'ja');assert.deepEqual(await snapshot(page),recalculated);await japanese(page,width+' after Spanish recalculation',evidence);
   await locale(page,'es-LA');await expose(page.locator('#battleCommit'));
   const observed=Math.min(recalculated.calculation.a.currentHp,recalculated.calculation.r.rolls[0]);
   await page.locator('#battleObservedDamage').fill(String(observed));await page.locator('#battleCommit').click();
   assert.equal(await page.locator('#battleHistory li').count(),1);assert.match(await page.locator('#battleHistory').textContent(),/Turno 1: Terremoto/);
   const committed=await snapshot(page),spanishHistory=await page.locator('#battleHistory').textContent(),spanishStatus=await page.locator('#battleStatus').textContent();
   assert.equal(committed.calculation.a.currentHp,Math.max(0,recalculated.calculation.a.currentHp-observed));
   await locale(page,'ja');assert.deepEqual(await snapshot(page),committed);await japanese(page,width+' committed history returns to Japanese',evidence,{history:true});
   await locale(page,'es-LA');assert.deepEqual(await snapshot(page),committed);assert.equal(await page.locator('#battleHistory').textContent(),spanishHistory);assert.equal(await page.locator('#battleStatus').textContent(),spanishStatus);
   await locale(page,'ja');await page.evaluate(()=>ChlohaPersistence.save());await page.reload();await ready(page);evidence.reloads++;
   assert.deepEqual(await snapshot(page),committed,'Japanese reload preserves all numeric and canonical state');assert.equal(await page.locator('#battleHistory li').count(),0,'History remains intentionally non-persistent');await japanese(page,width+' Japanese reload',evidence);
   await locale(page,'es-LA');await set(page,'dbAuto',false);await set(page,'attack',177);await set(page,'customMultiplier',0.75);await ready(page);
   const manual=await snapshot(page);assert.equal(manual.calculation.a.attack,177);assert.equal(manual.calculation.a.customMultiplier,0.75);
   await page.evaluate(()=>ChlohaPersistence.save());await page.reload();await ready(page);evidence.reloads++;assert.equal(await page.locator('#chloha-locale').inputValue(),'es-LA');assert.deepEqual(await snapshot(page),manual);
   await locale(page,'ja');assert.deepEqual(await snapshot(page),manual);await japanese(page,width+' manual Spanish reload then Japanese',evidence);
   // A translated unsupported result must remain blocked after switching back.
   await locale(page,'es-LA');await set(page,'attAbility','unsupported:さめはだ');
   await page.waitForFunction(()=>!window.ChlohaLastCalculation);const blocked=await snapshot(page);assert.equal(blocked.outputHidden,true);assert.equal(blocked.errorHidden,false);assert.equal(blocked.copyDisabled,true);assert.equal(blocked.battleCommitDisabled,true);
   await locale(page,'ja');assert.deepEqual(await snapshot(page),blocked);await japanese(page,width+' unsupported Japanese state',evidence,{blocked:true});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
   evidence.cases.push({width,spanishRecalculation:true,historyRoundtrip:true,nonemptyTerrain:true,manualReload:true,unsupportedState:true,passed:true});await context.close();context=null;
  }
  assert.equal(evidence.cases.length,2);assert.equal(evidence.reloads,4);evidence.passed=true;
  console.log('PASS Japanese return: two mobile widths, actual Spanish recalculation/native selection, history and electric terrain roundtrip, manual reload and blocked output; complete numeric/state parity');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}
 finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/ja-return-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
