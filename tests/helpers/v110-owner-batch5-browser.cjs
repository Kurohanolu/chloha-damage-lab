'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,blockExternal}=require('./v0188-browser-lab.cjs');
const baseline='6360fa3a243c234993e032a415540b2c4691afeb',locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const manifest=JSON.parse(fs.readFileSync('docs/data/v110-es-la-owner-captures-batch5.json','utf8'));
const cases=manifest.records.map(r=>[r.canonicalMatches[0].canonicalIds[0],r.canonicalMatches[0].key,r.esLA,'gw091_02']);
const ready=p=>p.waitForFunction(()=>!!window.ChlohaLocale&&!!window.ChlohaPersistence&&(!!window.ChlohaLastCalculation||(!document.getElementById('error').hidden&&document.getElementById('output').hidden)));
const state=p=>p.evaluate(()=>JSON.stringify({state:ChlohaPersistence.capture(),a:window.ChlohaLastCalculation?.a??null,r:window.ChlohaLastCalculation?.r??null,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden},(_,v)=>v instanceof Map?{mapEntries:[...v]}:v));
const expose=c=>c.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
module.exports=async function run(shard){assert.ok([1,2,3,4].includes(shard));const shardLocales=locales.slice(shard%2===1?0:5,shard%2===1?5:10);let lab,browser,context;const evidence={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),shard,startedAt:new Date().toISOString(),baseline,realDevice:false,productionMutations:0,locales:shardLocales,widths:[shard<=2?390:1440],rows:[],conditionalRows:[]};try{
 lab=await startLab({compare:true,comparisonRef:baseline});browser=await launchBrowser();
 for(const width of evidence.widths){
  context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});const a=await context.newPage(),b=await context.newPage(),errors=[];
  for(const p of [a,b]){p.on('pageerror',e=>errors.push(e.message));await blockExternal(context,p);}await a.goto(lab.origin+'/candidate/');await b.goto(lab.origin+'/baseline/');for(const p of [a,b])await ready(p);
  for(const locale of shardLocales){
   for(const p of [a,b]){await p.selectOption('#chloha-locale',locale);await p.locator('#resetCalculation').click();await ready(p);}
   for(const [id,key,name,species] of cases){
    for(const p of [a,b]){await expose(p.locator('#dbAttPokemon'));await p.selectOption('#dbAttPokemon',species);await expose(p.locator('#attAbility'));await p.selectOption('#attAbility','none');await expose(p.locator('#dbMove'));await p.selectOption('#dbMove',id);await ready(p);}
    const old=await b.evaluate(k=>ChlohaEsLa.metadata('moves',k),key),now=await a.evaluate(k=>ChlohaEsLa.metadata('moves',k),key);assert.ok(['unverified','verified-secondary'].includes(old.status));assert.equal(now.status,'official');assert.equal(now.officialChampions,true);assert.equal(now.name,name);assert.deepEqual(now.canonicalIds,[id]);
    if(locale==='es-LA'){
     await a.locator('#moveSearch').fill(name);const exact=a.locator('#moveSuggestions [role=option]').filter({has:a.locator('span').filter({hasText:new RegExp('^'+name+'$')})});assert.equal(await exact.count(),1);assert.equal(await exact.getAttribute('aria-label'),name);await exact.click();assert.equal(await a.locator('#dbMove').inputValue(),id);
    }
    const canonical=await state(b),parsed=JSON.parse(canonical);if(parsed.r!==null){assert.ok(Array.isArray(parsed.r.rolls));assert.ok(parsed.r.rolls.length>0);}else{assert.equal(parsed.errorHidden,false);assert.equal(parsed.outputHidden,true);}assert.equal(await state(a),canonical,'Exact published numeric or blocked state parity '+id+'/'+locale);
    const policy=p=>p.evaluate(id=>({policy:window.ChlohaMovePolicy?.[id]??null,mechanic:window.ChlohaMoveMechanic??null,status:document.getElementById('dbStatus').textContent,reliability:document.getElementById('reliabilityDetails').textContent}),id);assert.deepEqual(await policy(a),await policy(b),'Published support/disclosure parity');
    assert.equal(await a.locator('#moveSelected').textContent(),await b.locator('#moveSelected').textContent(),'Displayed move name unchanged in all locales');
    for(const p of [a,b]){assert.equal(await p.evaluate(()=>ChlohaPersistence.save()),true);await p.reload();await ready(p);assert.equal(await p.locator('#chloha-locale').inputValue(),locale);assert.equal(await p.locator('#dbMove').inputValue(),id);assert.equal(await state(p),canonical,'Persisted IDs and numbers unchanged');}
    evidence.rows.push({width,locale,id,numericParity:true,saveReload:true,visibleRegionalSearch:locale==='es-LA'});

   }

  }
  assert.deepEqual(errors,[]);await context.close();context=null;
 }
 assert.equal(evidence.rows.length,95);evidence.passed=true;console.log('PASS batch5 shard '+shard+':95 exact published calculation/support/save/reload cases; no mechanics expansion');
 }catch(e){evidence.passed=false;evidence.error=e.message;throw e;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/owner-batch5-browser-shard'+shard+'.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
};
