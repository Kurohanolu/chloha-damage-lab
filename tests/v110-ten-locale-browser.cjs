'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {startLab,launchBrowser,ready,mockFeedback}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const set=(page,id,value)=>page.locator('#'+id).evaluate((node,value)=>{if(node.type==='checkbox')node.checked=value;else{node.value=String(value);if(node.value!==String(value))throw new Error('Invalid test control value: '+node.id+'='+JSON.stringify(value));}node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}));},value);
const snapshot=page=>page.evaluate(()=>({state:ChlohaPersistence.capture(),calculation:JSON.parse(JSON.stringify(ChlohaLastCalculation,(_,value)=>value instanceof Map?{mapEntries:[...value]}:value)),damage:document.getElementById('damage').textContent,percent:document.getElementById('percent').textContent}));
const numericText=text=>(text.match(/\d+(?:[.,]\d+)?/g)||[]).map(x=>Number(x.replace(',','.')));
const dataOnly=state=>({state:state.state,calculation:state.calculation});
async function locale(page,value){await page.locator('#chloha-locale').selectOption(value);await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await page.evaluate(()=>ChlohaLocale.get()),value);assert.equal(await page.locator('html').getAttribute('lang'),value==='es-LA'?'es-419':value);assert.equal(await page.evaluate(()=>localStorage.getItem('chloha.damageLab.locale')),value);}
async function persist(page,language,expected){assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),language);assert.equal(await page.locator('html').getAttribute('lang'),language==='es-LA'?'es-419':language);assert.deepEqual(dataOnly(await snapshot(page)),dataOnly(expected),'Full input, outputs,16 rolls and canonical state after reload: '+language);}
async function numericLocales(page,label,evidence){
 const reference=await snapshot(page),r=reference.calculation.r;
 if(r.multiHitDistribution){
  const entries=r.multiHitDistribution.mapEntries;assert.ok(entries.length>0,label+' complete multi-hit distribution');
  assert.deepEqual(r.rolls,entries.map(([damage])=>damage),label+' displayed totals cover every distribution outcome');
  assert.ok(Math.abs(entries.reduce((sum,[,probability])=>sum+probability,0)-1)<1e-9,label+' distribution probability sums to one');
  const perHit=Array.isArray(r.hitRolls[0])?r.hitRolls:[r.hitRolls];
  for(const rolls of perHit)assert.equal(rolls.length,16,label+' every source hit has 16 random rolls');
 }else assert.equal(r.rolls.length,16,label+' all 16 single-hit random rolls');
 for(const lang of locales){await locale(page,lang);const actual=await snapshot(page);assert.deepEqual(dataOnly(actual),dataOnly(reference),label+' full numerical/state parity including complete multi-hit probabilities '+lang);assert.deepEqual(numericText(actual.damage),numericText(reference.damage),label+' displayed damage '+lang);assert.deepEqual(numericText(actual.percent),numericText(reference.percent),label+' displayed percentage '+lang);assert.ok((await page.locator('#koVerdict').textContent()).trim(),label+' localized KO verdict');evidence.numericalCases.push({label,locale:lang,rolls:actual.calculation.r.rolls.length,distributionOutcomes:actual.calculation.r.multiHitDistribution?.mapEntries.length||0});}
 return reference;
}
// Sample actual rendered paths, including DOM mutation/reload. This is not an
// exhaustive index.html template parser or a claim about all battle combinations.
async function esLaDom(page,label,expected,evidence,canonicalMove){
 assert.equal(await page.evaluate(()=>ChlohaLocale.get()),'es-LA');
 const selectors=Object.keys(expected);
 await page.evaluate(selectors=>{for(const selector of selectors){const node=document.querySelector(selector);if(!node)throw Error('Missing rendered witness: '+selector);for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}},selectors);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const texts={};
 for(const selector of selectors){const node=page.locator(selector);assert.equal(await node.isVisible(),true,label+' visible '+selector);texts[selector]=(await node.textContent()).trim();}
 if(canonicalMove){
  const selected=await page.evaluate(()=>{const id=document.getElementById('dbMove').value;const move=ChlohaGameData.moves.find(m=>m.id===id);return{id,sourceName:move?.name};});
  assert.deepEqual(selected,{id:canonicalMove.id,sourceName:canonicalMove.sourceName},label+' canonical move selection');
 }
 evidence.dynamicDomCases.push({label,texts,...(canonicalMove?{canonicalMove}:{})});
 for(const [selector,pattern] of Object.entries(expected)){
  const text=texts[selector];
  const checks=[['Spanish witness',()=>assert.match(text,pattern)],['Japanese/CJK residue',()=>assert.doesNotMatch(text,/[\u3040-\u30ff\u3400-\u9fff]/u)],['Known English fallback',()=>assert.doesNotMatch(text,/\b(?:Base damage|Before random|Current HP|Selected move|Unsupported|Basic damage only|Estimated;|Turn \d|confirmed\.|total damage|Damage estimate|Critical hit|not hardware-verified)\b|^(?:power|stat|base|preRandom|postRandom|final)\/[A-Za-z]/im)]];
  // Collect text failures so one untranslated label cannot hide later witnesses.
  // Structural, visibility, numeric and state assertions still fail immediately.
  for(const [check,run] of checks)try{run();}catch(error){evidence.dynamicDomFailures.push({label,selector,check,error:error.message,actual:text});}
 }
 if(canonicalMove){
  const selector='#reliabilityDetails',text=texts[selector];
  // Independent literal names are bound to the actual canonical selection. A
  // different Spanish move name must fail even if no English/CJK remains.
  try{const quoted=text.match(/Movimiento seleccionado “([^”]+)”/u)?.[1];assert.ok(quoted,'Quoted selected move must be present');assert.equal(quoted.split(/\s*[（(]/u)[0],canonicalMove.regionalName,'Quoted move name must match the selected canonical ID');}
  catch(error){evidence.dynamicDomFailures.push({label,selector,check:'Canonical selected move name',error:error.message,actual:text,expected:canonicalMove});}
 }
}
async function dynamicDomWitnesses(page,evidence){
 await locale(page,'es-LA');await page.locator('#resetCalculation').click();await ready(page);
 const main={'#trace':/Estadística ofensiva: \d+/,'#koVerdictDetail':/PS/,'#damage':/de daño/,'#moveSelected':/Terremoto/,'#reliabilityDetails':/verifica|consola/i};
 await set(page,'attItem','lifeOrb');await esLaDom(page,'ordinary trace, KO and provisional disclosure',main,evidence);
 const ordinary=await snapshot(page);await locale(page,'ja');await locale(page,'es-LA');assert.deepEqual(dataOnly(await snapshot(page)),dataOnly(ordinary));await esLaDom(page,'ordinary after Japanese → ES-LA',main,evidence);
 await persist(page,'es-LA',ordinary);evidence.reloads++;await esLaDom(page,'ordinary after persisted initialization',main,evidence,{id:'earthquake',sourceName:'じしん',regionalName:'Terremoto'});
 const moveId=async name=>{const id=await page.evaluate(name=>ChlohaGameData.moves.find(m=>m.name===name)?.id,name);assert.ok(id,'Existing canonical witness '+name);return id;};
 await set(page,'dbMove',await moveId('からげんき'));await set(page,'conditionalPower',false);const base=await snapshot(page);await set(page,'conditionalPower',true);const boosted=await snapshot(page);
 assert.ok(Math.max(...boosted.calculation.r.rolls)>Math.max(...base.calculation.r.rolls),'Conditional-power witness must actually change damage');
 await esLaDom(page,'conditional Facade enabled',{'#trace':/Estadística ofensiva/,'#reliabilityDetails':/Auditoría del movimiento P1/,'#moveSelected':/Fachada/,'#koVerdictDetail':/PS/},evidence);
 await locale(page,'en');await locale(page,'es-LA');assert.deepEqual(dataOnly(await snapshot(page)),dataOnly(boosted));await esLaDom(page,'conditional after English → ES-LA',{'#trace':/Estadística ofensiva/,'#reliabilityDetails':/Auditoría del movimiento P1/},evidence);
 const dartsId=await moveId('ドラゴンアロー');await set(page,'dbMove',dartsId);await set(page,'dragonDartsHits','2');await ready(page);assert.ok((await snapshot(page)).calculation.r.multiHitDistribution);
 const multi={'#trace':/Estadística ofensiva/,'#ko':/Probabilidad de K\.O\. con todos los golpes/,'#rollsLabel':/golpes/,'#reliabilityDetails':/2 golpes al objetivo seleccionado/};
 await esLaDom(page,'Dragon Darts complete distribution and two-target warning',multi,evidence);
 const multiBefore=await snapshot(page);await persist(page,'es-LA',multiBefore);evidence.reloads++;await esLaDom(page,'multi-hit after persisted initialization',multi,evidence,{id:dartsId,sourceName:'ドラゴンアロー',regionalName:'Dracoflechas'});
 await set(page,'dbMove','electroBall');await set(page,'screen','none');await ready(page);assert.ok((await snapshot(page)).calculation.r.rolls.every(n=>n>0));
 await esLaDom(page,'speed-dependent power and estimated warning',{'#trace':/Velocidad .*potencia/,'#moveSelected':/Estimación sin verificar en consola/,'#reliabilityDetails':/Auditoría del movimiento P1/},evidence);
 await page.locator('#battleCommit').evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
 await page.locator('#battleObservedDamage').fill('0');await page.locator('#battleCommit').click();
 const history={'#battleHistory':/Turno 1:.*Estim(?:ación|ado).*sin verificar.*No coincide con la predicción/s,'#battleStatus':/confirmado\. PS del objetivo.*No coincide con la predicción/s};
 await esLaDom(page,'confirmed history contains estimated move and mismatch warning',history,evidence);
 const historyState=await snapshot(page);await locale(page,'en');await locale(page,'es-LA');assert.deepEqual(dataOnly(await snapshot(page)),dataOnly(historyState));await esLaDom(page,'history after English → ES-LA',history,evidence);
 await persist(page,'es-LA',historyState);evidence.reloads++;assert.equal(await page.locator('#battleHistory li').count(),0,'History is not automatically persisted');await esLaDom(page,'speed-dependent trace after reload',{'#trace':/Velocidad .*potencia/,'#moveSelected':/Estimación sin verificar en consola/,'#reliabilityDetails':/Auditoría del movimiento P1/},evidence,{id:'electroBall',sourceName:'エレキボール',regionalName:'Electrobola'});
}
(async()=>{
 const lab=await startLab();let browser,context;
 const evidence={locales,mode:'local Chromium emulation',realDevice:false,productionRequests:0,productionMutations:0,rotationTransitions:0,explicitTransitions:[],numericalCases:[],dynamicDomCases:[],dynamicDomFailures:[],reloads:0,unverified:['physical Android/iOS','native screen reader and OS IME','professional Spanish review','Champions hardware mechanics','Exhaustive index.html DOM-template enumeration and all dynamic condition combinations']};
 try{
  browser=await launchBrowser();context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await mockFeedback(context,lab.origin);const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(lab.origin+'/candidate/');await ready(page);
  assert.deepEqual(await page.locator('#chloha-locale option').evaluateAll(options=>options.map(x=>x.value)),locales);
  assert.equal(await page.locator('#chloha-locale option[value="es-LA"]').innerText(),'Español (Latinoamérica)');
  await set(page,'dbAttPokemon','garchomp');await set(page,'dbDefPokemon','tyranitar');await set(page,'dbMove','earthquake');
  for(const [id,value] of Object.entries({weather:'rain',terrain:'electric',screen:'reflect',attItem:'lifeOrb',defItem:'assaultVest',attAbility:'none',defAbility:'none'}))await set(page,id,value);
  const fixed=await snapshot(page);assert.equal(fixed.calculation.r.rolls.length,16);
  for(let start=0;start<locales.length;start++){
   for(let offset=0;offset<=locales.length;offset++){
    const language=locales[(start+offset)%locales.length];await locale(page,language);assert.deepEqual(dataOnly(await snapshot(page)),dataOnly(fixed),'Rotating start '+start+' step '+offset);evidence.rotationTransitions++;
   }
   const language=locales[start];await persist(page,language,fixed);evidence.reloads++;
  }
  assert.equal(evidence.rotationTransitions,110);
  for(const route of [['es','es-LA','ja'],['es-LA','en','es']])for(const language of route){await locale(page,language);assert.deepEqual(dataOnly(await snapshot(page)),dataOnly(fixed));evidence.explicitTransitions.push(language);}
  await numericLocales(page,'weather/terrain/screen/item/ability conditions',evidence);
  await page.locator('#resetCalculation').click();await set(page,'dbAuto',false);
  for(const [id,value] of Object.entries({attack:150,defense:100,attSpeed:200,defSpeed:81,attMaxHp:250,hp:260,attType1:'ノーマル',attType2:'なし',defType1:'ノーマル',defType2:'なし',moveType:'でんき',stabMode:'none',attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',weather:'none',terrain:'none',attackStage:0,defenseStage:0,battleFormat:'singles',spread:'single'}))await set(page,id,value);
  for(const {id,mechanic,power} of [{id:'electroBall',mechanic:'electroBall',power:80},{id:'gw0169_p048',mechanic:'gyroBall',power:11}]){
   await set(page,'dbMove',id);const before=await numericLocales(page,'manual '+mechanic,evidence);
   assert.equal(before.calculation.a.moveMechanic,mechanic,'Selected canonical move must exercise the intended mechanic');
   assert.equal(before.calculation.r.effectivePower,power,'Independent speed ratio boundary');
   const base=22n*BigInt(power)*150n/100n/50n+2n;assert.deepEqual(before.calculation.r.rolls,Array.from({length:16},(_,i)=>Number(base*BigInt(85+i)/100n)),'Independent neutral BigInt 16-roll oracle');
   await persist(page,'es-LA',before);evidence.reloads++;
  }
  for(const name of ['イカサマ','かわらわり','サイコファング','ドラゴンアロー']){
   const id=await page.evaluate(name=>ChlohaGameData.moves.find(x=>x.name===name)?.id,name);assert.ok(id,'registered canonical '+name);await set(page,'dbMove',id);await set(page,'screen','reflect');await numericLocales(page,name,evidence);
  }
  await locale(page,'es-LA');assert.match(await page.locator('[data-singularity=scope]').textContent(),/sin confirmar|revisión|España/i,'User-facing source limitations remain visible');
  // Dynamic validation and warning copy are exercised on the new language; the
  // unchanged v0188 tests separately cover all nine original languages.
  await page.locator('#resetCalculation').click();await locale(page,'es-LA');await set(page,'att-attack-points',33);
  assert.equal(await page.locator('#error').textContent(),await page.evaluate(()=>ChlohaLocaleQuality.errorText('es-LA','invalidStats')));assert.equal(await page.locator('#output').isVisible(),false);await set(page,'att-attack-points',20);await ready(page);
  for(const [query,id,label] of [['Fissure','gw0169_p050','[No compatible]'],['Triple Arrows','gw0169_p001','[Solo daño básico; sin verificar]'],['Electro Ball','electroBall','[Estimación sin verificar en consola]']]){
   await page.locator('#moveSearch').fill(query);await page.locator('#moveSuggestions [role=option]').first().click();assert.equal(await page.locator('#dbMove').inputValue(),id);await page.waitForFunction(label=>document.getElementById('moveSelected').textContent.includes(label),label);
  }
  assert.match(await page.locator('#moveSelected').textContent(),/Variable/);
  await dynamicDomWitnesses(page,evidence);
  assert.deepEqual(evidence.dynamicDomFailures,[],'Every sampled ES-LA DOM text assertion must pass');
  assert.deepEqual(errors,[]);evidence.passed=true;
  console.log('PASS v1.1.0 ten locales: 110 rotating transitions, explicit regional routes, '+evidence.numericalCases.length+' complete output comparisons, '+evidence.reloads+' reloads and ES-LA canonical warnings/errors');
 }catch(error){evidence.error=error.message;throw error;}
 finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/ten-locale-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
