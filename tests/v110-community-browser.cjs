'use strict';
// Local-only acceptance of the pinned Community bytes. No production navigation,
// feedback submission, real-device claim or replacement of historical tests.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{execFileSync}=require('node:child_process');
const {buildSites}=require('../scripts/v0187-build-sites.cjs');
const {loadCommunityBaseline,verifyCommunityFiles}=require('../scripts/helpers/community-pinned-baseline.cjs');
const {launchBrowser}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'],widths=[320,390,1440];
const current='https://kurohanolu.github.io/singularity/';
const contracts=require('./helpers/public-release-contract.cjs').loadPublicContracts().cases;
async function vectors(page){const actual=await page.evaluate(cases=>cases.map(f=>{try{const out=f.entry==='core'?ChlohaDamageEngine.calculate(structuredClone(f.input)):ChlohaDamageCalculator.calculate(structuredClone(f.input),structuredClone(f.options));return {output:JSON.parse(JSON.stringify(out,(_,v)=>Object.prototype.toString.call(v)==='[object Map]'?{mapEntries:[...v]}:v))};}catch(e){return {error:{name:e.name,message:e.message}};}}),contracts);actual.forEach((v,i)=>assert.deepEqual(v,contracts[i].expected,'Community complete public contract '+contracts[i].name));return actual.length;}
const ready=page=>page.waitForFunction(()=>!!window.ChlohaLastCalculation&&!!window.ChlohaLocale&&!!window.ChlohaPersistence&&!!document.querySelector('#community-information'));
const snapshot=page=>page.evaluate(()=>JSON.parse(JSON.stringify({state:ChlohaPersistence.capture(),a:ChlohaLastCalculation.a,r:ChlohaLastCalculation.r})));
const expose=locator=>locator.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
(async()=>{
 const out=fs.mkdtempSync(path.join(os.tmpdir(),'community-browser-')),report={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),realDevice:false,mode:'local Chromium emulation',widths,locales,rows:[],externalAttempts:[],nonReadAttempts:[],productionRequests:0,productionMutations:0,liveAcceptance:false,numericContracts:0};
 let server,browser,context;
 try{
  const pinned=loadCommunityBaseline();buildSites(out);const site=path.join(out,'chloha-damage-lab');
  const local=new Map([...pinned.files.keys()].map(file=>[file,fs.readFileSync(path.join(site,file))]));verifyCommunityFiles(pinned.manifest,local);report.communitySource=pinned.manifest.sourceCommit;report.communityTree=pinned.manifest.sourceTree;report.files=local.size;report.applicationSHA256=pinned.manifest.applicationSHA256;
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
  server=http.createServer((req,res)=>{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}const url=new URL(req.url,'http://127.0.0.1'),file=url.pathname==='/'?'index.html':url.pathname.slice(1),body=local.get(file);if(!body){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const origin='http://127.0.0.1:'+server.address().port;
  browser=await launchBrowser();let crossWidth;
  for(const width of widths){
   context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});const page=await context.newPage(),errors=[];let expectedLink=false;
   page.on('pageerror',e=>errors.push(e.message));
   await context.route('**/*',route=>{const request=route.request(),url=new URL(request.url());if(!['GET','HEAD'].includes(request.method())){report.nonReadAttempts.push({method:request.method(),url:request.url()});return route.abort();}if(url.origin!==origin){report.externalAttempts.push({url:request.url(),expected:expectedLink&&request.url()===current});return route.abort();}return route.continue();});
   const originalURL=origin+'/?private=community-private-test#private-fragment';await page.goto(originalURL);await ready(page);report.numericContracts+=await vectors(page);
   assert.equal(await page.title(),'Chloha Damage Lab — Community Edition v1.0.0 Stable');assert.deepEqual(await page.locator('#chloha-locale option').evaluateAll(nodes=>nodes.map(n=>n.value)),locales);
   assert.equal(await page.locator('#app h1').textContent(),'Chloha Damage Lab');assert.equal(await page.locator('meta[name="application-name"]').getAttribute('content'),'Chloha Damage Lab');
   assert.equal(await page.evaluate(()=>typeof window.ChlohaFeedback),'undefined');
   const notices=[];
   for(const locale of locales){
    await page.selectOption('#chloha-locale',locale);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await page.locator('html').getAttribute('lang'),locale);
    await expose(page.locator('#attSearch'));await page.locator('#attSearch').fill('Charizard');const species=page.locator('#attSuggestions [role=option]');assert.ok(await species.count()>=3,'Real species/form suggestions');await page.locator('#attSearch').press('Escape');
    await expose(page.locator('#moveSearch'));await page.locator('#moveSearch').fill('Earthquake');const moves=page.locator('#moveSuggestions [role=option]');assert.equal(await moves.count(),1,'Unique real canonical alias result');const visibleName=await moves.first().getAttribute('aria-label');assert.ok(visibleName?.length);await moves.first().click();assert.equal(await page.locator('#dbMove').inputValue(),'earthquake');await ready(page);
    const before=await snapshot(page);assert.equal(before.r.rolls.length,16);assert.ok(before.r.rolls.every(n=>Number.isFinite(n)&&n>0));
    if(crossWidth)assert.deepEqual({a:before.a,r:before.r},crossWidth,'Complete engine input/result parity across all locales and widths');else crossWidth={a:before.a,r:before.r};
    const selected=await page.locator('#moveSelected').textContent();assert.ok(selected.includes(visibleName),'Visible selected move matches localized search result');
    const notice=await page.locator('.community-state').textContent();assert.ok(notice.length>20);notices.push(notice);assert.ok((await page.locator('.community-distribution').textContent()).includes('ZIP'));
    assert.deepEqual(await page.locator('a[href]').evaluateAll(nodes=>nodes.filter(n=>/\.zip(?:[?#]|$)|releases\/download\//i.test(n.getAttribute('href'))).map(n=>n.getAttribute('href'))),[],'No public archive download');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No overflow '+width+'/'+locale);
    assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await page.locator('#dbMove').inputValue(),'earthquake');assert.deepEqual(await snapshot(page),before,'Complete saved input and 16-roll output survive reload');
    report.rows.push({width,locale,searchName:visibleName,canonicalMove:'earthquake',rolls:16,reload:true,completeNumericParity:true});
   }
   assert.equal(new Set(notices).size,9,'Community notices are localized, not a repeated fallback');
   const link=page.locator('.community-links a[href="'+current+'"]');assert.equal(await link.count(),1);assert.equal(await link.getAttribute('target'),'_blank');assert.ok((await link.getAttribute('rel')||'').split(/\s+/).includes('noopener'));
   const beforeClick=await snapshot(page),beforeURL=page.url();assert.equal(beforeURL,originalURL);expectedLink=true;
   const [request]=await Promise.all([context.waitForEvent('request',{predicate:r=>r.url()===current}),link.click()]);assert.equal(request.url(),current,'No private query or hash transferred to Singularity');
   assert.equal(page.url(),beforeURL,'Community remains open at its original URL');assert.deepEqual(await snapshot(page),beforeClick,'Following safe external link preserves legacy state');
   assert.deepEqual(errors,[]);await context.close();context=null;
  }
  assert.equal(report.numericContracts,900);assert.equal(report.rows.length,27);assert.equal(report.externalAttempts.length,3);assert.ok(report.externalAttempts.every(x=>x.expected&&x.url===current),'Only deliberately clicked, blocked Singularity links');assert.deepEqual(report.nonReadAttempts,[]);
  report.passed=true;console.log('PASS pinned Community browser:44 exact files,27 width/locale searches and saved16-roll parity cases;3 privacy-safe blocked links;zero production requests/mutations');
 }catch(error){report.passed=false;report.error=error.stack;throw error;}finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/community-browser.json',JSON.stringify(report,null,2)+'\n');await context?.close();await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));fs.rmSync(out,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
