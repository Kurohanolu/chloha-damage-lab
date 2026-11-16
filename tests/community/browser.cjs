'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),http=require('node:http');
const {chromium}=require('playwright');
const {get}=require('./http.cjs');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'dist/community');
const liveUrl=process.env.COMMUNITY_LIVE_URL||'';
if(liveUrl)assert.equal(liveUrl,'https://kurohanolu.github.io/chloha-damage-lab/');
const reportDir=path.join(root,'reports/community',liveUrl?'live':'');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
const snapshot=page=>page.evaluate(()=>JSON.parse(JSON.stringify({a:window.ChlohaLastCalculation.a,r:window.ChlohaLastCalculation.r})));
const ready=page=>page.waitForFunction(()=>!!window.ChlohaLastCalculation&&!!window.ChlohaLocale&&!!document.querySelector('#community-information'));
async function choose(page,query,id){await page.locator('#moveSearch').fill(query);await page.locator('#moveSuggestions [role=option]').first().click();assert.equal(await page.locator('#dbMove').inputValue(),id);}
(async()=>{
 const report={status:'running',webUrl:liveUrl||'local-candidate',realDevice:false,browser:'Chromium',locales,widths:[320,360,390,430,768,1440],rotations:0,reloads:0,searchChecks:0,distributionNoticeChecks:0,archive404Checks:0,networkRequests:[],viewportChecks:[],publicationStatus:'requires-exact-commit-ci'};
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1'),m=url.pathname.match(/^\/(web|zip)\/(.*)$/);
  if(!m||m[2].includes('..')){res.writeHead(404);res.end();return;}
  const file=path.join(out,m[1]==='web'?'site':'restored/Chloha-Damage-Lab',m[2]||'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 fs.mkdirSync(reportDir,{recursive:true});
 try{
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
  let expected;
  for(const mode of ['web','zip']){
   const base=mode==='web'&&liveUrl?liveUrl:origin+'/'+mode+'/';
   const context=await browser.newContext({viewport:{width:390,height:900},isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(origin+'/')&&!(liveUrl&&r.url().startsWith(liveUrl)))report.networkRequests.push(r.url());});
   await page.goto(base);await ready(page);
   assert.equal(await page.title(),'Chloha Damage Lab — Community Edition v1.0.0 Stable');
   assert.deepEqual(await page.locator('#chloha-locale option').evaluateAll(es=>es.map(e=>e.value)),locales);
   assert.equal(await page.locator('#app h1').textContent(),'Chloha Damage Lab');
   assert.equal(await page.locator('.lab-footer strong').textContent(),'Chloha Damage Lab');
   assert.equal(await page.locator('meta[name="application-name"]').getAttribute('content'),'Chloha Damage Lab');
   const baseline=await snapshot(page);assert.equal(baseline.r.rolls.length,16);
   if(expected)assert.deepEqual(baseline,expected,'Restored ZIP initial input/results equal web tree');else expected=baseline;
   for(let start=0;start<locales.length;start++){
    await page.selectOption('#chloha-locale',locales[start]);
    const numerical=await snapshot(page);
    for(let step=1;step<=10;step++){
     const locale=locales[(start+step)%locales.length];await page.selectOption('#chloha-locale',locale);
     assert.deepEqual(await snapshot(page),numerical,'Locale-independent full result: '+mode+' '+locale);report.rotations++;
    }
   }
   for(const locale of locales){
    await page.selectOption('#chloha-locale',locale);
    await choose(page,'Electro Ball','electroBall');report.searchChecks++;
    await page.locator('#attSearch').fill('Charizard');assert.ok(await page.locator('#attSuggestions [role=option]').count()>=3);await page.locator('#attSearch').press('Escape');report.searchChecks++;
    const value=await snapshot(page);assert.equal(await page.evaluate(()=>window.ChlohaPersistence.save()),true);
    await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.deepEqual(await snapshot(page),value);report.reloads++;
    assert.ok((await page.locator('.community-state').textContent()).length>20);
    const notice=await page.locator('.community-distribution').textContent();
    assert.ok(notice.length>70,'Community-only notice present: '+locale);
    assert.ok(notice.includes('ZIP'),'Distribution notice identifies the package: '+locale);
    report.distributionNoticeChecks++;
    assert.deepEqual(await page.locator('a[href]').evaluateAll(links=>links.filter(a=>/\.zip(?:[?#]|$)|releases\/download\//i.test(a.getAttribute('href'))).map(a=>a.getAttribute('href'))),[],'No public ZIP links in any locale');
   }
   await choose(page,'Fissure','gw0169_p050');assert.equal(await page.locator('#damage').textContent(),'—');
   await choose(page,'Earthquake','earthquake');assert.ok((await snapshot(page)).r.rolls.length===16);
   for(const width of report.widths){
    await page.setViewportSize({width,height:900});await page.selectOption('#chloha-locale','ja');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No page overflow: '+mode+' '+width);
    for(const selector of ['#attSearch','#defSearch'])assert.ok((await page.locator(selector).boundingBox()).width>=Math.min(220,width-80),'Usable search width after artwork removal: '+selector+' '+width);
    await page.locator('#attDetails').evaluate(el=>{el.open=true});assert.equal(await page.locator('#attDetails').getAttribute('open'),'');
    if(mode==='web'&&[390,1440].includes(width)){
     await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
     await page.waitForFunction(()=>scrollY===0);
     await page.screenshot({path:path.join(reportDir,'community-'+width+'.png'),fullPage:true});
    }
    report.viewportChecks.push({mode,width,status:'passed'});
   }
   const current=page.locator('.community-links a[href="https://kurohanolu.github.io/singularity/"]');assert.equal(await current.getAttribute('target'),'_blank');
   for(const link of ['README.html','TERMS.html']){const res=await get(context.request,base+link,report);assert.equal(res.status(),200);assert.ok((await res.text()).includes('AS IS'));}
   for(const uri of ['Chloha-Damage-Lab-v1.0.0-Community-Edition.zip','Chloha-Damage-Lab-v1.0.0-Community-Edition.zip.sha256','private/Chloha-Damage-Lab-v1.0.0-Community-Edition.zip','../private/Chloha-Damage-Lab-v1.0.0-Community-Edition.zip']){
    const res=await get(context.request,base+uri,report);assert.equal(res.status(),404,'No archive exposed through web root: '+mode+' '+uri);report.archive404Checks++;
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  const local=await browser.newPage();await local.goto('file://'+path.join(out,'restored/Chloha-Damage-Lab/index.html'));await ready(local);assert.deepEqual(await snapshot(local),expected,'Direct local-file calculation');await local.close();
  assert.deepEqual(report.networkRequests,[],'No external runtime dependency');
  report.directFileCalculation=true;report.warningStateVerified=true;report.status='passed';console.log('PASS Community browser: '+JSON.stringify(report));
 }catch(e){report.status='failed';report.error=e.stack;throw e;}
 finally{fs.writeFileSync(path.join(reportDir,'browser.json'),JSON.stringify(report,null,2)+'\n');await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
