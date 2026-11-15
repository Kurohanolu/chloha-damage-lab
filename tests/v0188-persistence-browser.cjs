'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),LOCALES=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const KEY='singularity.calculator.v1';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.json':'application/json'};
const server=http.createServer((req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/singularity\//,'/');const file=path.resolve(ROOT,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(ROOT+path.sep)){res.writeHead(403);res.end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
const ready=page=>page.waitForFunction(()=>!!window.ChlohaPersistence&&!!window.ChlohaLocale&&!!window.ChlohaLastCalculation);
const set=(page,id,value)=>page.evaluate(({id,value})=>{const e=document.getElementById(id);if(e.type==='checkbox')e.checked=value;else e.value=String(value);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));},{id,value});
const snapshot=page=>page.evaluate(()=>({state:window.ChlohaPersistence.capture(),input:window.ChlohaLastCalculation?.a,rolls:window.ChlohaLastCalculation?.r.rolls}));
async function saved(page){assert.equal(await page.evaluate(()=>window.ChlohaPersistence.save()),true,'valid calculator state must be saved');}
async function restoreEqual(page,label){await saved(page);const before=await snapshot(page);assert.ok(before.rolls?.length,label+' calculation required');await page.reload();await ready(page);assert.deepEqual(await snapshot(page),before,label+' full UI/model/input/roll restoration');}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 let browser;const evidence={schemaVersion:1,locales:LOCALES,localeReloads:0,conditionalMoves:[],storageFaults:[],multiTab:false,privacy:false,immediateReload:false};
 try{
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin+'/singularity/');await ready(page);
  const defaults=await page.evaluate(()=>window.ChlohaPersistence.capture());
  for(const locale of LOCALES){
   await page.locator('#chloha-locale').selectOption(locale);
   for(const [id,value] of Object.entries({'att-attack-points':20,'att-specialDefense-points':12,'att-hp-points':6,'def-defense-points':17,'def-specialDefense-points':13,'def-speed-points':2,weather:'rain',terrain:'grassy',screen:'reflect',critical:true,attackStage:2,attItem:'lifeOrb',currentHp:50,attCurrentHp:70}))await set(page,id,value);
   await restoreEqual(page,locale);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);evidence.localeReloads++;
  }
  // Same canonical state after each of the nine possible starting locales.
  for(let start=0;start<LOCALES.length;start++){const before=await snapshot(page);for(let step=0;step<=LOCALES.length;step++){await page.locator('#chloha-locale').selectOption(LOCALES[(start+step)%LOCALES.length]);assert.deepEqual(await snapshot(page),before,'locale switch must not alter state or numbers');}}
  await page.evaluate(()=>window.ChlohaPersistence.reset());await set(page,'dbAuto',false);
  for(const [id,value] of Object.entries({attack:432,defense:199,hp:321,currentHp:76,attMaxHp:250,attCurrentHp:123,attSpeed:172,defSpeed:115,category:'special',power:83,customMultiplier:'1.25',moveType:'ほのお',attType1:'みず',defType1:'くさ'}))await set(page,id,value);
  await restoreEqual(page,'manual stats and types');
  // Asymmetric inactive allocations detect restoring the wrong reference stat.
  for(const moveName of ['ボディプレス','サイコショック','イカサマ','はきだす','なげつける','ドラゴンアロー','ふくろだたき','はたきおとす']){
   await page.evaluate(()=>window.ChlohaPersistence.reset());
   for(const [id,value] of Object.entries({'att-attack-points':5,'att-defense-points':23,'att-specialAttack-points':11,'def-defense-points':7,'def-specialDefense-points':25}))await set(page,id,value);
   const moveId=await page.evaluate(name=>window.ChlohaGameData.moves.find(m=>m.name===name)?.id,moveName);assert.ok(moveId,'test move exists '+moveName);await set(page,'dbMove',moveId);
   if(moveName==='イカサマ'){await set(page,'dbFoulAttackEv',19);await set(page,'dbFoulAttackNature','plus');await set(page,'attackStage',-2);}
   if(moveName==='はきだす')await page.locator('[data-stockpile="3"]').click();
   if(moveName==='なげつける')await set(page,'flingPower','130');
   if(moveName==='ドラゴンアロー')await set(page,'dragonDartsHits','1');
   if(moveName==='ふくろだたき')await set(page,'beatUpStats','100,120,80');
   if(moveName==='はたきおとす'){await set(page,'defItem','assaultVest');await set(page,'conditionalPower',false);}
   await restoreEqual(page,moveName);evidence.conditionalMoves.push(moveName);
  }
  await page.evaluate(()=>window.ChlohaPersistence.reset());await set(page,'dbAttPokemon','charizard');await set(page,'attAbility','blaze');await set(page,'forceLowHpAbility',true);await restoreEqual(page,'species dependent ability and force flag');
  // Neither locale nor feedback data is part of the calculator storage payload.
  await page.click('#feedbackButton');
  await page.locator('#feedbackDescription').fill('PRIVATE_REPORT_MUST_NOT_SAVE');await page.locator('#feedbackEmail').fill('private@example.com');
  await page.evaluate(()=>{const check=document.getElementById('feedbackAttach');if(check){check.checked=true;check.dispatchEvent(new Event('change',{bubbles:true}));}});
  await saved(page);const raw=await page.evaluate(key=>localStorage.getItem(key),KEY);assert.ok(!raw.includes('PRIVATE_REPORT')&&!raw.includes('private@example.com')&&!raw.includes('feedback')&&!raw.includes('snapshot')&&!raw.includes('token'));
  await page.reload();await ready(page);evidence.privacy=true;
  // Full reset returns every stored control/model to the original state, keeping language.
  const language=await page.locator('#chloha-locale').inputValue();await page.click('#resetCalculation');assert.deepEqual(await page.evaluate(()=>window.ChlohaPersistence.capture()),defaults);assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),null);assert.equal(await page.locator('#chloha-locale').inputValue(),language);
  await saved(page);const good=await page.evaluate(key=>localStorage.getItem(key),KEY);
  for(const corrupt of ['{bad',JSON.stringify({...JSON.parse(good),schemaVersion:99}),JSON.stringify({...JSON.parse(good),state:{...JSON.parse(good).state,controls:{...JSON.parse(good).state.controls,dbAttPokemon:'unknown-species'}}}),JSON.stringify({...JSON.parse(good),state:{...JSON.parse(good).state,models:{...JSON.parse(good).state.models,att:{...JSON.parse(good).state.models.att,points:{hp:32,attack:32,defense:32,specialAttack:0,specialDefense:0,speed:0}}}}})]){
   await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key:KEY,raw:corrupt});await page.reload();await ready(page);assert.deepEqual(await page.evaluate(()=>window.ChlohaPersistence.capture()),defaults,'invalid persisted state must reset atomically');assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),null);
  }
  // A reload before the debounce expires must still persist the latest edit.
  await set(page,'att-attack-points',21);await page.reload();await ready(page);assert.equal(await page.locator('#att-attack-points').inputValue(),'21');evidence.immediateReload=true;
  const second=await context.newPage();await second.goto(origin+'/singularity/');await ready(second);assert.equal(await second.locator('#att-attack-points').inputValue(),'21');
  await set(page,'att-attack-points',22);await saved(page);assert.equal(await second.locator('#att-attack-points').inputValue(),'21','other tab must not change live controls');await second.reload();await ready(second);assert.equal(await second.locator('#att-attack-points').inputValue(),'22');
  await set(page,'att-attack-points',23);await saved(page);await second.close();await page.reload();await ready(page);assert.equal(await page.locator('#att-attack-points').inputValue(),'23','untouched stale tab must not overwrite stored state on close');evidence.multiTab=true;
  assert.deepEqual(errors,[]);await context.close();
  for(const mode of ['denied','quota']){
   const ctx=await browser.newContext();await ctx.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
   await ctx.addInitScript(({key,mode})=>{for(const name of mode==='denied'?['getItem','setItem','removeItem']:['setItem']){const original=Storage.prototype[name];Storage.prototype[name]=function(k,...args){if(k===key)throw new DOMException('blocked',mode==='quota'?'QuotaExceededError':'SecurityError');return original.call(this,k,...args);};}},{key:KEY,mode});
   const p=await ctx.newPage();await p.goto(origin+'/singularity/');await ready(p);await set(p,'att-attack-points',20);assert.equal(await p.evaluate(()=>window.ChlohaPersistence.save()),false);assert.ok((await snapshot(p)).rolls.length);assert.equal(await p.evaluate(()=>window.ChlohaPersistence.status().storageAvailable),false);await p.evaluate(()=>window.ChlohaPersistence.reset());assert.ok((await snapshot(p)).rolls.length);evidence.storageFaults.push(mode);await ctx.close();
  }
  fs.mkdirSync(path.join(ROOT,'reports/v0188'),{recursive:true});fs.writeFileSync(path.join(ROOT,'reports/v0188/persistence.json'),JSON.stringify(evidence,null,2));
  console.log('PASS: nine-language and mobile reload equality, special/manual controls, reset/corruption, privacy, blocked storage, multi-tab and immediate reload');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
