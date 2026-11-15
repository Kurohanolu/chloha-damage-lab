'use strict';
// GET-only observation of the existing public release, before or after an approved cutover.
const fs=require('node:fs'),assert=require('node:assert/strict'),os=require('node:os');
const {launchBrowser,ready}=require('../tests/helpers/v0188-browser-lab.cjs');
const target='https://kurohanolu.github.io/singularity/';
const localRelease=require('../release.json');
const {verifyObservation}=require('./helpers/v0188-public-release-observation.cjs');
async function metadata(page){return page.evaluate(async()=>{const response=await fetch('./release.json',{method:'GET',credentials:'omit',cache:'no-store',redirect:'error'});if(response.status!==200)throw Error('Public release metadata HTTP '+response.status);return response.json();});}
const median=a=>a.length?[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)]:null;
async function navigation(page){
 await ready(page);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 return page.evaluate(()=>{
  const n=performance.getEntriesByType('navigation')[0],r=performance.getEntriesByType('resource').filter(entry=>new URL(entry.name).pathname!=='/singularity/release.json'),sum=a=>({count:a.length,transferBytes:a.reduce((s,x)=>s+x.transferSize,0),encodedBytes:a.reduce((s,x)=>s+x.encodedBodySize,0),decodedBytes:a.reduce((s,x)=>s+x.decodedBodySize,0),zeroTransferEntries:a.filter(x=>x.transferSize===0).length});
  return {firstPaintMs:performance.getEntriesByName('first-paint')[0]?.startTime??null,FCPMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime??null,domContentLoadedMs:n.domContentLoadedEventEnd,loadMs:n.loadEventEnd,document:{transferBytes:n.transferSize,encodedBytes:n.encodedBodySize,decodedBytes:n.decodedBodySize},javascript:sum(r.filter(x=>new URL(x.name).pathname.endsWith('.js'))),css:sum(r.filter(x=>new URL(x.name).pathname.endsWith('.css'))),images:sum(r.filter(x=>['img','image'].includes(x.initiatorType))),allResources:sum(r)};
 });
}
async function heap(cdp){const m=await cdp.send('Performance.getMetrics');return Object.fromEntries(m.metrics.filter(x=>['JSHeapUsedSize','JSHeapTotalSize','Nodes','Documents'].includes(x.name)).map(x=>[x.name,x.value]));}
async function operations(page){
 return page.evaluate(async()=>{
  const calc=[],locale=[],frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
  for(let i=0;i<12;i++){
   const field=document.getElementById('att-attack-points'),start=performance.now();field.value=String(20+i%2);field.dispatchEvent(new Event('input',{bubbles:true}));await frame();calc.push(performance.now()-start);if(!window.ChlohaLastCalculation)throw Error('calculation failed during public read-only observation');
   const language=document.getElementById('chloha-locale'),next=language.value==='en'?'fr':'en',t=performance.now();language.value=next;language.dispatchEvent(new Event('change',{bubbles:true}));await frame();locale.push(performance.now()-t);if(window.ChlohaLocale.get()!==next)throw Error('language switch failed during public observation');
  }
  return {calculationToFrameMs:calc,localeToFrameMs:locale};
 });
}
(async()=>{
 const evidence={observedAt:new Date().toISOString(),target,observedPublicRelease:null,mode:'existing approved public release GET-only browser observation',realDevice:false,productionMutations:0,feedbackFormsOpened:0,samplesPerProfile:3,operationsPerSample:12,conditions:{node:process.version,platform:process.platform,cpu:os.cpus()[0]?.model,cache:'fresh isolated context then reload; no forced cache clearing between cold and warm',network:'actual CI-to-public-CDN route; mobile adds40ms latency,1.6Mbit/s down,750kbit/s up and4xCPU',guard:'CDP Fetch request interception permits only GET/HEAD to the named Pages subtree or PokeAPI sprite paths; interception may affect caching',timingCaveats:['zero transfer for cross-origin resources can mean missing Timing-Allow-Origin or caching','data-URL images are already counted inside HTML','heap is sampled without forced garbage collection','operation latency includes next animation frame','publicCDN values must not be directly compared to loopback candidate measurements','release.json validation requests are excluded from resource-transfer summaries']},profiles:[]};let browser;
 fs.mkdirSync('reports/v0188',{recursive:true});
 try{
  browser=await launchBrowser();evidence.browser=browser.version();
  for(const profile of [{name:'desktop',width:1440,mobile:false},{name:'mobile-390',width:390,mobile:true}]){
   const samples=[];
   for(let sample=0;sample<3;sample++){
    const context=await browser.newContext({viewport:{width:profile.width,height:900},isMobile:profile.mobile,hasTouch:profile.mobile,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),cdp=await context.newCDPSession(page),network={allowed:0,blocked:[],methods:{},responses:[]};let guardFailure;
    await cdp.send('Network.enable');await cdp.send('Performance.enable');
    cdp.on('Fetch.requestPaused',event=>{
     const method=event.request.method,url=new URL(event.request.url),safeMethod=['GET','HEAD'].includes(method),safeURL=(url.origin==='https://kurohanolu.github.io'&&url.pathname.startsWith('/singularity/'))||(url.origin==='https://raw.githubusercontent.com'&&url.pathname.startsWith('/PokeAPI/sprites/'));
     network.methods[method]=(network.methods[method]||0)+1;
     if(safeMethod&&safeURL){network.allowed++;cdp.send('Fetch.continueRequest',{requestId:event.requestId}).catch(error=>{guardFailure=error.message;});}
     else{network.blocked.push({method,origin:url.origin,path:url.pathname});cdp.send('Fetch.failRequest',{requestId:event.requestId,errorReason:'BlockedByClient'}).catch(error=>{guardFailure=error.message;});}
    });
    cdp.on('Network.responseReceived',event=>{const url=new URL(event.response.url);network.responses.push({status:event.response.status,fromDiskCache:!!event.response.fromDiskCache,fromServiceWorker:!!event.response.fromServiceWorker,origin:url.origin,path:url.protocol==='data:'?'[embedded data URL]':url.pathname});});
    await cdp.send('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}]});
    try{
     if(profile.mobile){await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:1600000/8,uploadThroughput:750000/8,connectionType:'cellular4g'});}
     const response=await page.goto(target,{waitUntil:'load',timeout:60000});assert.equal(response.status(),200);evidence.observedPublicRelease=verifyObservation(localRelease,await metadata(page),await page.title(),evidence.observedPublicRelease);
     const cold=await navigation(page),heapBefore=await heap(cdp);
     await page.reload({waitUntil:'load',timeout:60000});const warm=await navigation(page);verifyObservation(localRelease,await metadata(page),await page.title(),evidence.observedPublicRelease);const timing=await operations(page),heapAfter=await heap(cdp);
     assert.equal(guardFailure,undefined,'network guard remains active');assert.ok(Object.keys(network.methods).every(x=>['GET','HEAD'].includes(x)),'page did not attempt any mutation');
     samples.push({sample,cold,warm,heapBefore,heapAfter,...timing,network});
    }finally{await context.close();}
   }
   const summary={coldFCPMedianMs:median(samples.map(x=>x.cold.FCPMs).filter(x=>x!==null)),warmFCPMedianMs:median(samples.map(x=>x.warm.FCPMs).filter(x=>x!==null)),calculationToFrameMedianMs:median(samples.flatMap(x=>x.calculationToFrameMs)),localeToFrameMedianMs:median(samples.flatMap(x=>x.localeToFrameMs)),heapUsedAfterMedianBytes:median(samples.map(x=>x.heapAfter.JSHeapUsedSize))};
   for(const cache of ['cold','warm'])summary[cache]=Object.fromEntries(['document','javascript','css','images','allResources'].map(kind=>[kind,{transferBytesMedian:median(samples.map(x=>x[cache][kind].transferBytes)),decodedBytesMedian:median(samples.map(x=>x[cache][kind].decodedBytes))}]));
   evidence.profiles.push({profile,samples,summary});
  }
  console.log(JSON.stringify({mode:evidence.mode,browser:evidence.browser,observedPublicRelease:evidence.observedPublicRelease,target,realDevice:false,productionMutations:0,samplesPerProfile:3,profiles:evidence.profiles.map(x=>({profile:x.profile,summary:x.summary})),conditions:evidence.conditions,evidence:'reports/v0188/public-performance.json'},null,2));
 }catch(error){evidence.failure=error.message;throw error;}
 finally{fs.writeFileSync('reports/v0188/public-performance.json',JSON.stringify(evidence,null,2)+'\n');await browser?.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
