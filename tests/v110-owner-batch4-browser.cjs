'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const baseline='a68b987d25d392076f36413e7f626ea3b71391c2',locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const cases=[['crunch','かみくだく','Triturar','candidate093_07'],['shadowBall','シャドーボール','Bola Sombra','gw091_02'],['sludgeBomb','ヘドロばくだん','Bomba Lodo','gw091_02'],['waterfall','たきのぼり','Cascada','candidate093_07'],['gw0170_u054','ゆきなだれ','Alud','candidate093_07'],['v096_097','パワーウィップ','Latigazo','candidate093_07']];
const ready=p=>p.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&(!!window.ChlohaLastCalculation||(!document.getElementById('error').hidden&&document.getElementById('output').hidden)));
const state=p=>p.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),a:window.ChlohaLastCalculation?.a??null,r:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
const expose=c=>c.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{let lab,browser,context;const evidence={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),baseline,realDevice:false,productionMutations:0,locales,widths:[390,1440],rows:[]};try{
 lab=await startLab({compare:true,comparisonRef:baseline});browser=await launchBrowser();
 for(const width of evidence.widths){
  context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const a=await context.newPage(),b=await context.newPage(),errors=[];
  for(const p of [a,b]){p.on('pageerror',e=>errors.push(e.message));await blockExternal(context,p);}await a.goto(lab.origin+'/candidate/');await b.goto(lab.origin+'/baseline/');for(const p of [a,b])await ready(p);
  for(const locale of locales){
   for(const p of [a,b]){await p.selectOption('#chloha-locale',locale);await p.locator('#resetCalculation').click();await ready(p);}
   for(const [id,key,name,species] of cases){
    for(const p of [a,b]){await expose(p.locator('#dbAttPokemon'));await p.selectOption('#dbAttPokemon',species);await expose(p.locator('#attAbility'));await p.selectOption('#attAbility','none');await expose(p.locator('#dbMove'));await p.selectOption('#dbMove',id);await ready(p);}
    const old=await b.evaluate(k=>ChlohaEsLa.metadata('moves',k),key),now=await a.evaluate(k=>ChlohaEsLa.metadata('moves',k),key);assert.equal(old.status,'unverified');assert.equal(now.status,'official');assert.equal(now.officialChampions,true);assert.equal(now.name,name);assert.deepEqual(now.canonicalIds,[id]);
    if(locale==='es-LA'){
     await a.locator('#moveSearch').fill(name);const exact=a.locator('#moveSuggestions [role=option]').filter({has:a.locator('span').filter({hasText:new RegExp('^'+name+'$')})});assert.equal(await exact.count(),1);assert.equal(await exact.getAttribute('aria-label'),name);await exact.click();assert.equal(await a.locator('#dbMove').inputValue(),id);
    }
    const canonical=await state(b);if(id==='gw0170_u054'){assert.equal(JSON.parse(canonical).r,null,'Unsupported Avalanche remains fail-closed');assert.equal(JSON.parse(canonical).outputHidden,true);}else{assert.notEqual(JSON.parse(canonical).r,null,'Real numerical result required');assert.equal(JSON.parse(canonical).r.rolls.length,16);}assert.equal(await state(a),canonical,'Exact numeric/state parity '+id+'/'+locale);
    assert.equal(await a.locator('#moveSelected').textContent(),await b.locator('#moveSelected').textContent(),'Displayed move name unchanged in all locales');
    for(const p of [a,b]){assert.equal(await p.evaluate(()=>ChlohaPersistence.save()),true);await p.reload();await ready(p);assert.equal(await p.locator('#chloha-locale').inputValue(),locale);assert.equal(await p.locator('#dbMove').inputValue(),id);assert.equal(await state(p),canonical,'Persisted IDs and numbers unchanged');}
    evidence.rows.push({width,locale,id,numericParity:true,saveReload:true,visibleRegionalSearch:locale==='es-LA'});
   }
   const nature=await a.evaluate(()=>ChlohaEsLa.metadata('natures','ひかえめ'));assert.equal(nature.name,'Modesta');assert.equal(nature.officialChampions,true);const oldNature=await b.evaluate(()=>ChlohaEsLa.metadata('natures','ひかえめ'));assert.equal(oldNature.name,'modesta');
  }
  assert.deepEqual(errors,[]);await context.close();context=null;
 }
 assert.equal(evidence.rows.length,120);evidence.passed=true;console.log('PASS batch4:100 numerical and20 fail-closed native move/save/reload cases across10locales and2widths,12 visible regional searches; no mechanics expansion');
 }catch(e){evidence.passed=false;evidence.error=e.message;throw e;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/owner-batch4-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
