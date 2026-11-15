'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const reference=require('./v0188-locale-reference.json');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const widget=`(()=>{let n=0;const widgets=new Map();window.turnstile={render(node,options){const id='v188-'+(++n);widgets.set(id,options);queueMicrotask(()=>options.callback('valid-'+crypto.randomUUID()));return id;},reset(id){const o=widgets.get(id);if(o)queueMicrotask(()=>o.callback('valid-'+crypto.randomUUID()));},remove(id){widgets.delete(id);}};})();`;
const ready=page=>page.waitForFunction(()=>!!window.ChlohaLastCalculation&&!!window.ChlohaLocaleQuality);
async function set(page,id,value){await page.evaluate(({id,value})=>{const el=document.getElementById(id);if(typeof value==='boolean')el.checked=value;else {el.value=String(value);if(el.value!==String(value))throw Error('Unavailable control value: '+id+'='+value);}el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},{id,value});}
const numeric=page=>page.evaluate(()=>JSON.stringify({a:window.ChlohaLastCalculation.a,r:window.ChlohaLastCalculation.r}));
const fbText=(page,key)=>page.evaluate(key=>window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),key),key);
async function expectError(page,key){await page.waitForFunction(()=>!document.getElementById('feedbackErrors').hidden);assert.equal(await page.locator('#feedbackErrors').textContent(),await fbText(page,key));}
async function heartbeat(page){
 let timer;
 try{await Promise.race([(async()=>{
  await page.evaluate(()=>{window.__v0188Heartbeat=false;setTimeout(()=>{window.__v0188Heartbeat=true;},0);});
  await page.waitForFunction(()=>window.__v0188Heartbeat===true,null,{timeout:2000});
 })(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Browser main thread starved after locale/species interaction')),5000);})]);}
 finally{clearTimeout(timer);}
}
(async()=>{
 const {startLocalApp}=await import('../services/feedback/test/harness.mjs');
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 const evidence={mode:'local-Worker-SQLite-with-mocked-Turnstile-and-GitHub',productionRequests:0,productionMutations:0,locales,externalNameChecks:0,uiSearchChecks:0,nativeAbilityItemChecks:0,feedbackLocales:0,allocationErrorLocales:0,stockpileLocales:0,limitations:['Representative entity names, not every translation','Ability/item UI uses native selects; free-text search is tested at the shared catalog layer separately','No real Turnstile or production submission']};
 try{
  for(const locale of locales){
   const app=await startLocalApp(),context=await browser.newContext({viewport:{width:390,height:844}});
   await context.addInitScript(locale=>localStorage.setItem('chloha.damageLab.locale',locale),locale);
   await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname==='challenges.cloudflare.com'&&u.pathname.endsWith('/api.js'))return route.fulfill({contentType:'text/javascript',body:widget});if(u.origin!==app.origin)return route.abort();return route.continue();});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto(app.origin+'/');await ready(page);
    if(locale==='en'){
     const expectedBySpecies=new Map();
     for(const language of locales){
      await page.selectOption('#chloha-locale',language);
      for(const record of reference.cases.filter(r=>r.category==='pokemon')){
       await page.fill('#attSearch',record.names[language]);
       await page.locator('#attSuggestions [role=option][aria-label='+JSON.stringify(record.names[language])+']').first().click();
       assert.equal(await page.locator('#dbAttPokemon').inputValue(),record.uiValue);
       await page.waitForFunction(()=>document.getElementById('dbStatus').hasAttribute('data-no-translate'));
       const value=await numeric(page);
       if(expectedBySpecies.has(record.key))assert.equal(value,expectedBySpecies.get(record.key),'locale/species stress preserves numbers: '+language+'/'+record.key);else expectedBySpecies.set(record.key,value);
       // A timer must run after the real user interaction; competing mutation
       // observers must not monopolize the browser's microtask queue.
       await heartbeat(page);
      }
     }
     await page.selectOption('#chloha-locale','en');
     await page.fill('#attSearch','Charizard');await page.locator('#attSuggestions [role=option][aria-label="Charizard"]').first().click();
     await page.fill('#moveSearch','Earthquake');await page.locator('#moveSuggestions [role=option]').filter({hasText:'Earthquake'}).first().click();
     const charizard=await numeric(page);
     const expected=/^Charizard Earthquake \(\d+\) → Tyranitar \(\d+ \/ HP \d+\)$/;
     await page.waitForFunction(()=>/^Charizard Earthquake \(\d+\) → Tyranitar \(\d+ \/ HP \d+\)$/.test(document.getElementById('dbStatus').textContent));
     assert.match(await page.locator('#dbStatus').textContent(),expected,'canonical summary before reload');
     await page.reload();await ready(page);await page.waitForFunction(()=>document.getElementById('dbStatus').textContent.startsWith('Charizard Earthquake ('));
     assert.equal(await numeric(page),charizard,'Charizard reload preserves all numeric values');assert.match(await page.locator('#dbStatus').textContent(),expected,'canonical summary after reload');
     await page.selectOption('#chloha-locale','ja');await page.waitForFunction(()=>document.getElementById('dbStatus').textContent.startsWith('リザードン じしん'));
     await page.selectOption('#chloha-locale','en');await page.waitForFunction(()=>document.getElementById('dbStatus').textContent.startsWith('Charizard Earthquake ('));
     assert.equal(await numeric(page),charizard,'summary locale changes preserve numeric values');assert.match(await page.locator('#dbStatus').textContent(),expected,'canonical summary after locale round trip');
    }
    for(const record of reference.cases.filter(r=>r.category==='pokemon')){
     await page.fill('#attSearch',record.names[locale]);
     const option=page.locator('#attSuggestions [role=option][aria-label='+JSON.stringify(record.names[locale])+']');
     assert.ok(await option.count(),'localized Pokémon query: '+locale+'/'+record.key);await option.first().click();assert.equal(await page.locator('#dbAttPokemon').inputValue(),record.uiValue);evidence.uiSearchChecks++;evidence.externalNameChecks++;
    }
    await set(page,'dbAttPokemon','garchomp');
    assert.deepEqual(await page.locator('#attTypes .type-pill').allTextContents(),['ドラゴン','じめん'].map(type=>reference.types[type][locale]),'external type-name reference: '+locale);
    await page.fill('#attSearch','no-such-pokemon-v0188');
    assert.equal(await page.locator('#attSuggestions [role=option]').count(),0);
    const empty=await page.locator('#attSuggestions .pokemon-suggestion-empty').textContent();
    assert.ok(empty.trim());if(locale!=='ja')assert.ok(!/[ぁ-ゖァ-ヺ]/u.test(empty),'Japanese empty-search copy: '+locale);
    await page.fill('#attSearch','');
    for(const record of reference.cases.filter(r=>r.category==='moves')){
     await page.fill('#moveSearch',record.names[locale]);
     const options=page.locator('#moveSuggestions [role=option]').filter({hasText:record.names[locale]});
     assert.ok(await options.count(),'localized move query: '+locale+'/'+record.key);await options.first().click();assert.equal(await page.locator('#dbMove').inputValue(),record.uiValue);evidence.uiSearchChecks++;evidence.externalNameChecks++;
    }
    for(const record of reference.cases.filter(r=>['abilities','items'].includes(r.category))){
     if(record.category==='abilities'){
      const species=record.uiValue==='intimidate'?'candidate093_07':'hydreigon';
      const name=await page.evaluate(({species,locale})=>window.ChlohaLocalePokemonName(species,locale),{species,locale});
      assert.ok(name,'localized prerequisite species for '+record.uiValue);
      await page.fill('#defSearch',name);
      await page.locator('#defSuggestions [role=option][aria-label='+JSON.stringify(name)+']').first().click();
      assert.equal(await page.locator('#dbDefPokemon').inputValue(),species,'defender ability must be selectable on its actual species');
     }
     const id=record.category==='abilities'?'defAbility':'attItem',option=page.locator('#'+id+' option[value='+JSON.stringify(record.uiValue)+']');
     assert.ok((await option.textContent()).includes(record.names[locale]),'localized native option: '+locale+'/'+record.key);
     await set(page,id,record.uiValue);assert.equal(await page.locator('#'+id).inputValue(),record.uiValue);evidence.nativeAbilityItemChecks++;evidence.externalNameChecks++;
    }
    await set(page,'dbDefPokemon','tyranitar');await set(page,'defAbility','none');await set(page,'attItem','none');await set(page,'dbMove','earthquake');await set(page,'att-attack-points',20);
    const warning=await page.evaluate(()=>window.ChlohaLocale.text('選択技「じしん」の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。'));
    assert.ok(warning.includes(reference.cases.find(r=>r.key==='じしん').names[locale]),'warning localized entity: '+locale);
    if(locale!=='ja')assert.ok(!/[ぁ-ゖァ-ヺ]/u.test(warning),'Japanese warning copy: '+locale);
    const before=await numeric(page);
    await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await numeric(page),before,'nine-language restored calculation: '+locale);
    await set(page,'att-attack-points',33);
    try{await page.waitForFunction(()=>document.getElementById('error').textContent===window.ChlohaLocaleQuality.errorText(window.ChlohaLocale.get(),'invalidStats'));}
    catch(error){
     console.error('v0188 allocation error diagnostic',await page.evaluate(()=>({locale:window.ChlohaLocale.get(),expected:window.ChlohaLocaleQuality.errorText(window.ChlohaLocale.get(),'invalidStats'),error:document.getElementById('error').textContent,status:document.getElementById('dbStatus').textContent,points:document.getElementById('att-attack-points').value,model:window.ChlohaUI.models().att.points,auto:document.getElementById('dbAuto').checked,errorOwned:document.getElementById('error').hasAttribute('data-no-translate'),statusOwned:document.getElementById('dbStatus').hasAttribute('data-no-translate')})));
     throw error;
    }
    assert.equal(await page.locator('#error').getAttribute('data-no-translate'),'');
    assert.equal(await page.locator('#dbStatus').getAttribute('data-no-translate'),'');
    assert.equal(await page.locator('#output').isVisible(),false,'invalid points must not display stale damage');evidence.allocationErrorLocales++;
    await set(page,'att-attack-points',20);await ready(page);assert.equal(await numeric(page),before);
    const spitName=await page.evaluate(()=>window.ChlohaLocalizedNames?.moves?.['はきだす']?.[window.ChlohaLocale.get()]||window.ChlohaPokeAPILocalizedNames?.moves?.['はきだす']?.[window.ChlohaLocale.get()]);
    assert.ok(spitName,'canonical localized Spit Up name is present, including Japanese');
    await page.fill('#moveSearch',spitName);await page.locator('#moveSuggestions [role=option]').filter({hasText:spitName}).first().click();
    assert.equal(await page.locator('#dbMove').inputValue(),'gw0169_s040');await page.locator('#spitUpPanel').waitFor({state:'visible'});
    for(const count of [1,2,3]){
     await page.locator('[data-stockpile="'+count+'"]').click();
     await page.waitForFunction(count=>document.getElementById('spitUpPowerNote').textContent===window.ChlohaLocaleQuality.stockpile(window.ChlohaLocale.get(),count).power,count);
     assert.equal(await page.locator('#spitUpPanel strong').textContent(),await page.evaluate(()=>window.ChlohaLocaleQuality.stockpile(window.ChlohaLocale.get(),1).title));assert.equal(await page.locator('[data-stockpile="'+count+'"]').getAttribute('aria-pressed'),'true');
    }evidence.stockpileLocales++;
    await set(page,'dbMove','earthquake');const stable=await numeric(page);
    await page.click('#feedbackButton');await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled);
    await page.click('#feedbackSubmit');await expectError(page,'requiredCategory');await page.selectOption('#feedbackCategory','bug');await page.click('#feedbackSubmit');await expectError(page,'requiredDescription');
    await page.fill('#feedbackDescription','Synthetic v0188 feedback locale '+locale);await page.fill('#feedbackEmail','invalid');await page.click('#feedbackSubmit');await expectError(page,'emailError');await page.fill('#feedbackEmail','');
    await page.route('**/v1/reports',route=>route.request().method()==='POST'?route.fulfill({status:503,json:{error:'unavailable'}}):route.continue());
    await page.click('#feedbackSubmit');await expectError(page,'failure');assert.equal(await page.locator('#feedbackStatus').textContent(),'');assert.equal(await page.locator('#feedbackDescription').inputValue(),'Synthetic v0188 feedback locale '+locale);assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);
    await page.unroute('**/v1/reports');
    let posts=0,release;const pending=new Promise(r=>{release=r;});
    await page.route('**/v1/reports',async route=>{if(route.request().method()==='POST'){posts++;await pending;}return route.continue();});
    await page.click('#feedbackSubmit');await page.waitForFunction(()=>document.getElementById('feedbackSubmit').disabled);
    await page.evaluate(()=>{document.getElementById('feedbackForm').requestSubmit();document.getElementById('feedbackForm').requestSubmit();});
    release();await page.waitForFunction(()=>document.getElementById('feedbackStatus').textContent.includes(window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),'localSuccess')));
    assert.equal(posts,1);assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);assert.equal(app.calls.github.length,0);assert.equal(await numeric(page),stable);evidence.feedbackLocales++;
    const stored=await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(key=>[key,localStorage.getItem(key)]))));
    assert.ok(!stored.includes('Synthetic v0188 feedback locale'),'feedback description must not be automatically persisted');
    assert.ok(!stored.includes('feedbackDescription')&&!stored.includes('feedbackEmail')&&!stored.includes('turnstileToken'),'feedback fields and tokens must not be persisted');
    await page.reload();await ready(page);assert.equal(await page.locator('#feedbackDescription').inputValue(),'');assert.equal(await page.locator('#feedbackEmail').inputValue(),'');assert.equal(await numeric(page),stable);
    assert.deepEqual(errors,[],'browser runtime errors: '+locale);
   }finally{await context.close();await app.close();}
  }
  fs.mkdirSync('reports/v0188',{recursive:true});fs.writeFileSync('reports/v0188/locales-feedback.json',JSON.stringify(evidence,null,2)+'\n');
  console.log('PASS v0.188 nine-language external-name/search/native-option/reload/error/stockpile/feedback regressions',JSON.stringify(evidence));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

