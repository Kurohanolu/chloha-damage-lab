'use strict';
// Same-machine synthetic comparison, not a measurement of the production CDN or real phones.
const fs=require('node:fs'),os=require('node:os'),assert=require('node:assert/strict');
const {startLab,launchBrowser,ready,blockExternal}=require('../tests/helpers/v0188-browser-lab.cjs');
const samples=Number(process.env.V0188_PERF_SAMPLES||5);
assert.ok(Number.isInteger(samples)&&samples>=3&&samples<=20,'use 3 to20 independent samples');
const median=values=>values.length?[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)]:null;
async function settled(page){await ready(page);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
async function navigation(page){
 return page.evaluate(()=>{
  const nav=performance.getEntriesByType('navigation')[0],resources=performance.getEntriesByType('resource'),sum=items=>({count:items.length,transferBytes:items.reduce((s,x)=>s+x.transferSize,0),encodedBytes:items.reduce((s,x)=>s+x.encodedBodySize,0),decodedBytes:items.reduce((s,x)=>s+x.decodedBodySize,0),zeroTransferEntries:items.filter(x=>x.transferSize===0).length});
  return {domContentLoadedMs:nav.domContentLoadedEventEnd,loadEventMs:nav.loadEventEnd,firstPaintMs:performance.getEntriesByName('first-paint')[0]?.startTime??null,firstContentfulPaintMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime??null,document:{transferBytes:nav.transferSize,encodedBytes:nav.encodedBodySize,decodedBytes:nav.decodedBodySize},javascript:sum(resources.filter(x=>new URL(x.name).pathname.endsWith('.js'))),css:sum(resources.filter(x=>new URL(x.name).pathname.endsWith('.css'))),images:sum(resources.filter(x=>['img','image'].includes(x.initiatorType))),allResources:sum(resources)};
 });
}
async function operations(page){
 return page.evaluate(async()=>{
  const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve)),calc=[],lang=[];
  // Measure through the next animation frame, including event handlers and rendering opportunity.
  for(let i=0;i<12;i++){
   const field=document.getElementById('att-attack-points'),t=performance.now();field.value=String(20+i%2);field.dispatchEvent(new Event('input',{bubbles:true}));await frame();calc.push(performance.now()-t);
   if(!window.ChlohaLastCalculation)throw Error('calculation failed during timing');
   const select=document.getElementById('chloha-locale'),next=select.value==='en'?'fr':'en',s=performance.now();select.value=next;select.dispatchEvent(new Event('change',{bubbles:true}));await frame();lang.push(performance.now()-s);
   if(window.ChlohaLocale.get()!==next)throw Error('locale change failed during timing');
  }
  return {calculationToFrameMs:calc,localeToFrameMs:lang};
 });
}
async function heap(cdp){const m=await cdp.send('Performance.getMetrics');return Object.fromEntries(m.metrics.filter(x=>['JSHeapUsedSize','JSHeapTotalSize','Nodes','Documents','LayoutCount','RecalcStyleCount'].includes(x.name)).map(x=>[x.name,x.value]));}
(async()=>{
 const lab=await startLab({compare:true}),evidence={measuredAt:new Date().toISOString(),mode:'loopback Chromium emulation',baselineCommit:lab.baseline,candidateCommit:'working tree at invocation',realDevice:false,productionRequests:0,conditions:{node:process.version,platform:process.platform,arch:process.arch,cpu:os.cpus()[0]?.model,logicalCPUs:os.cpus().length,samplesPerVersionPerProfile:samples,operationSamplesPerNavigation:12,cachePolicy:'same local server max-age=600 and ETag',network:'loopback; mobile emulation adds40ms RTT,1.6Mbit/s down,750kbit/s up and4x CPU slowdown',thirdParty:'HTTPS blocked; embedded data images remain; external sprites/Turnstile omitted',order:'alternating baseline/candidate between rounds'},profiles:[]};let browser;
 fs.mkdirSync('reports/v0188',{recursive:true});
 try{
  browser=await launchBrowser();evidence.browser=browser.version();
  for(const profile of [{name:'desktop',width:1440,mobile:false},{name:'mobile-390',width:390,mobile:true}]){
   const runs={baseline:[],candidate:[]};
   for(let sample=0;sample<samples;sample++)for(const version of sample%2?['candidate','baseline']:['baseline','candidate']){
    const context=await browser.newContext({viewport:{width:profile.width,height:900},isMobile:profile.mobile,hasTouch:profile.mobile,reducedMotion:'reduce'}),page=await context.newPage(),cdp=await blockExternal(context,page);
    try{
     await cdp.send('Performance.enable');
     if(profile.mobile){await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:1600000/8,uploadThroughput:750000/8,connectionType:'cellular4g'});}
     await page.goto(lab.origin+'/'+version+'/',{waitUntil:'load'});await settled(page);const cold=await navigation(page),heapBefore=await heap(cdp);
     await page.reload({waitUntil:'load'});await settled(page);const warm=await navigation(page),timing=await operations(page),heapAfter=await heap(cdp);
     const ratio=await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth}));assert.ok(ratio.documentWidth<=ratio.viewport,'no overflow in timed mobile profile');
     runs[version].push({sample,cold,warm,heapBefore,heapAfter,...timing});
    }finally{await context.close();}
   }
   const summary={};for(const version of ['baseline','candidate']){
    summary[version]={coldFCPMedianMs:median(runs[version].map(x=>x.cold.firstContentfulPaintMs).filter(x=>x!==null)),warmFCPMedianMs:median(runs[version].map(x=>x.warm.firstContentfulPaintMs).filter(x=>x!==null)),calculationToFrameMedianMs:median(runs[version].flatMap(x=>x.calculationToFrameMs)),localeToFrameMedianMs:median(runs[version].flatMap(x=>x.localeToFrameMs)),heapUsedAfterMedianBytes:median(runs[version].map(x=>x.heapAfter.JSHeapUsedSize))};
    for(const cache of ['cold','warm'])summary[version][cache]=Object.fromEntries(['document','javascript','css','images','allResources'].map(kind=>[kind,{transferBytesMedian:median(runs[version].map(x=>x[cache][kind].transferBytes)),decodedBytesMedian:median(runs[version].map(x=>x[cache][kind].decodedBytes)),...(kind==='document'?{}:{zeroTransferEntriesMedian:median(runs[version].map(x=>x[cache][kind].zeroTransferEntries))})}]));
   }
   evidence.profiles.push({profile,...runs,summary});
  }
  console.log(JSON.stringify({mode:evidence.mode,profiles:evidence.profiles.map(x=>({profile:x.profile,summary:x.summary})),evidence:'reports/v0188/browser-performance.json'},null,2));
 }catch(error){evidence.failure=error.message;throw error;}
 finally{fs.writeFileSync('reports/v0188/browser-performance.json',JSON.stringify(evidence,null,2)+'\n');await browser?.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
