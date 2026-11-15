'use strict';
// Same-run one-change experiment: reconstruct the pre-fix input guard while
// retaining every other candidate byte. No production access or time threshold.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),{execFileSync}=require('node:child_process');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const patches=require('./fixtures/v0188-ui-inline-patches.json').patches;
const patch=patches.find(p=>p.purpose==='C-P01: feedback input does not rebuild the calculator UI');
assert.ok(patch);const html=fs.readFileSync('index.html','utf8');assert.equal(html.split(patch.after).length-1,1);
const variants={before:html.replace(patch.after,patch.before),after:html};
const median=values=>{const a=[...values].sort((a,b)=>a-b),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;};
const stats=values=>{const a=[...values].sort((a,b)=>a-b),m=Math.floor(a.length/2),q1=median(a.slice(0,m)),q3=median(a.slice(Math.ceil(a.length/2)));return {n:a.length,medianMs:median(a),q1Ms:q1,q3Ms:q3,iqrMs:q3-q1,minMs:a[0],maxMs:a.at(-1)};};
(async()=>{
 const lab=await startLab();let browser;
 const evidence={measuredAt:new Date().toISOString(),sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceTree:execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),realDevice:false,productionRequests:0,mode:'controlled candidate guard reversal; all other bytes identical',environment:{node:process.version,platform:process.platform,cpu:os.cpus()[0]?.model,logicalCPUs:os.cpus().length,locale:'en',network:'loopback; external HTTPS blocked; feedback API unconfigured',samplesPerVariantPerProfile:5,operationsPerContext:20,metric:'feedback input dispatch to next frame, aligned to preceding frame',cache:'routing disables cache equally for both variants',order:'alternating before/after context order'},profiles:[]};
 try{
  browser=await launchBrowser();evidence.environment.browser=browser.version();
  for(const profile of [{name:'desktop',width:1440,cpuRate:1},{name:'mobile-390',width:390,cpuRate:4}]){
   const runs={before:[],after:[]};
   for(let sample=0;sample<5;sample++)for(const variant of sample%2?['after','before']:['before','after']){
    const context=await browser.newContext({viewport:{width:profile.width,height:900},isMobile:profile.width===390,hasTouch:profile.width===390,reducedMotion:'reduce'});
    try{
     await context.route('**/candidate/',route=>route.fulfill({contentType:'text/html',body:variants[variant]}));
     await context.route('**/feedback-config-v0185.js*',route=>route.fulfill({contentType:'text/javascript',body:'window.ChlohaFeedbackConfig={};'}));
     const page=await context.newPage(),cdp=await blockExternal(context,page);if(profile.cpuRate>1)await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpuRate});
     const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(lab.origin+'/candidate/');await ready(page);
     await page.waitForFunction(()=>!!window.ChlohaPersistence&&!!document.getElementById('feedbackDescription'));
     await page.locator('#chloha-locale').selectOption('en');await page.locator('#feedbackButton').click();
     const result=await page.evaluate(async()=>{
      const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));await frame();await frame();
      const initial=JSON.stringify({state:ChlohaPersistence.capture(),input:ChlohaLastCalculation.a,rolls:ChlohaLastCalculation.r.rolls});
      const storageBefore=localStorage.getItem(ChlohaPersistence.key),durations=[],counts=[];let mutations=0;
      const observer=new MutationObserver(records=>mutations+=records.length);
      for(const id of ['attTypes','defTypes','attBaseStats','defBaseStats'])observer.observe(document.getElementById(id),{childList:true});
      const field=document.getElementById('feedbackDescription');
      for(let i=0;i<20;i++){
       await frame();const previous=mutations,start=performance.now();field.value='Local feedback benchmark '+i;
       field.dispatchEvent(new Event('input',{bubbles:true}));await frame();durations.push(performance.now()-start);counts.push(mutations-previous);
      }
      observer.disconnect();
      return {durations,calculatorDOMMutations:counts,initial,final:JSON.stringify({state:ChlohaPersistence.capture(),input:ChlohaLastCalculation.a,rolls:ChlohaLastCalculation.r.rolls}),storageBefore,storageAfter:localStorage.getItem(ChlohaPersistence.key),text:field.value};
     });
     assert.deepEqual(errors,[]);assert.equal(result.final,result.initial,'feedback typing preserves complete calculator state/input/rolls');assert.equal(result.storageAfter,result.storageBefore,'feedback typing never writes calculator storage');assert.equal(result.text,'Local feedback benchmark 19');
     if(variant==='before')assert.ok(result.calculatorDOMMutations.every(n=>n>=4),'old guard rebuilds both type/base-stat panels on every feedback input');
     else assert.ok(result.calculatorDOMMutations.every(n=>n===0),'new guard removes calculator DOM work from every feedback input');
     runs[variant].push({sample,durations:result.durations,calculatorDOMMutations:result.calculatorDOMMutations});
    }finally{await context.close();}
   }
   evidence.profiles.push({profile,runs,summary:Object.fromEntries(['before','after'].map(variant=>[variant,{...stats(runs[variant].flatMap(run=>run.durations)),calculatorDOMMutations:runs[variant].flatMap(run=>run.calculatorDOMMutations).reduce((a,b)=>a+b,0)}]))});
  }
  console.log(JSON.stringify({mode:evidence.mode,environment:evidence.environment,profiles:evidence.profiles.map(p=>({profile:p.profile,summary:p.summary}))},null,2));
 }catch(error){evidence.failure=error.message;throw error;}
 finally{fs.mkdirSync('reports/v0188',{recursive:true});fs.writeFileSync('reports/v0188/continued-feedback-performance.json',JSON.stringify(evidence,null,2)+'\n');await browser?.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
