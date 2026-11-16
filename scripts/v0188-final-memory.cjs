'use strict';
// Bounded, local-only GC/retention evidence. A green run does not certify absence
// of every leak: review the complete post-warmup heap/counter series as well.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {execFileSync}=require('node:child_process');
const {root,startLab,launchBrowser,ready}=require('../tests/helpers/v0188-browser-lab.cjs');

// Retain each historical baseline; pre.2 compares against published pre.1,
// while original pre.1 measurements retain the exact Stable predecessor.
const COMMUNITY_REVISION=require('../release.json').tag==='v1.1.0-pre.6'&&require('../release.json').migration?.legacyPolicy==='community-pinned-v1';
const BASELINE=require('../release.json').tag==='v1.1.0-pre.9' ? '0b1f8fffea3b1d063036d00fd712b0a0e9695111' : require('../release.json').tag==='v1.1.0-pre.8' ? '66a085ba325655bc9369656ea0645f7f6f997127' : require('../release.json').tag==='v1.1.0-pre.7' ? '2fb5655a89e076df5993a3294bddbe1bf31afa58' : COMMUNITY_REVISION ? require('./helpers/v110-community-public-base.cjs').commit : require('../release.json').tag==='v1.1.0-pre.6' ? '82f7e2b4111824ac9a357b5d4cfba01dbc0c4f74' : require('../release.json').tag==='v1.1.0-pre.5' ? '61d87e82995bc60d4564aaf57a52dfc1fd859e4c' : require('../release.json').tag==='v1.1.0-pre.4'
 ?'082ab180bc8835304d959f583d4968e0565bdea3'
 :require('../release.json').tag==='v1.1.0-pre.3'
 ?'aba2d0558948e2a4dd375074fb11fd428edf6222'
 :require('../release.json').tag==='v1.1.0-pre.2'
 ?'83af29133927a19fc7e0f9273c0e194c54384ae5'
 :require('../release.json').tag==='v1.1.0-pre.1'
 ?'0b270c1452505268364659edd402209b00b28673'
 :'4f068544e670a85a6a4d34dd2c26e2be66bd9cb7';
const LOCALES=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const PROFILES=[
 {name:'desktop',width:1440,height:900,cpu:1,mobile:false},
 {name:'mobile-emulation',width:390,height:844,cpu:4,mobile:true}
];
const SAMPLES=3,WARMUP=2,ROUNDS=6,RELOADS=3,DOM_CAP=128;
const FEEDBACK_TEXT='LOCAL_MEMORY_AUDIT_NOT_FOR_SUBMISSION';
const OUTPUT=path.join(root,'reports/v0188-final/memory.json');
const started=Date.now();
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:1024*1024}).trim();
if(require('../release.json').tag==='v1.1.0-pre.9')assert.equal(git('rev-parse',BASELINE+'^{tree}'),'701fbae7b142ba2ac5e5e23f1755a84f39d82b6c','Pre.9 exact Community-policy pre.8 baseline');
if(require('../release.json').tag==='v1.1.0-pre.8')assert.equal(git('rev-parse',BASELINE+'^{tree}'),'531c22a3fd647f674a287808a7a63b74010ccb58','Pre.8 exact Community-policy pre.7 baseline');
if(require('../release.json').tag==='v1.1.0-pre.7')assert.equal(git('rev-parse',BASELINE+'^{tree}'),'002d2af5716f408f50d50b8390d66a73ba083be3','Pre.7 exact Community-policy pre.6 baseline');
if(COMMUNITY_REVISION)assert.equal(git('rev-parse',BASELINE+'^{tree}'),require('./helpers/v110-community-public-base.cjs').tree,'Policy revision retains exact previously accepted frontend');
else if(require('../release.json').tag==='v1.1.0-pre.6')assert.equal(git('rev-parse',BASELINE+'^{tree}'),'f6e6bc6a8bedec4b8923671e9345ce24a8d45d40','Pre.6 retains immutable public pre.5');
if(require('../release.json').tag==='v1.1.0-pre.5')assert.equal(git('rev-parse',BASELINE+'^{tree}'),'213c12af29c002e9344b018e6be69e568a251dff','Pre.5 retains immutable public pre.4');
if(require('../release.json').tag==='v1.1.0-pre.4')assert.equal(git('rev-parse',BASELINE+'^{tree}'),'acbfb36b179a29be7b7071821a4dd2c2a8c446cc','Pre.4 retains the immutable published pre.3 tree');
if(require('../release.json').tag==='v1.1.0-pre.3')assert.equal(git('rev-parse',BASELINE+'^{tree}'),'5043182ba5b292f13630b461897457a74812dcfd','Pre.3 memory comparison must retain the immutable published pre.2 tree');
const median=values=>{
 const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2);
 return a.length?(a.length%2?a[m]:(a[m-1]+a[m])/2):null;
};
function series(values){
 const n=values.length,xbar=(n-1)/2,ybar=values.reduce((a,b)=>a+b,0)/n;
 const xx=values.reduce((sum,_,i)=>sum+(i-xbar)**2,0);
 return {n,first:values[0],last:values[n-1],delta:values[n-1]-values[0],
  min:Math.min(...values),max:Math.max(...values),median:median(values),
  slopePerRound:xx?values.reduce((sum,y,i)=>sum+(i-xbar)*(y-ybar),0)/xx:0};
}
const evidence={
 schemaVersion:1,status:'RUNNING',startedAt:new Date(started).toISOString(),
 candidate:{commit:git('rev-parse','HEAD'),tree:git('rev-parse','HEAD^{tree}'),workingTreeChanges:git('status','--porcelain').split('\n').filter(Boolean)},
 baseline:{commit:BASELINE,tree:git('rev-parse',BASELINE+'^{tree}')},
 environment:{node:process.version,platform:process.platform,arch:process.arch,kernel:os.release(),cpus:os.cpus().length,cpuModel:os.cpus()[0]?.model,playwright:require('playwright/package.json').version},
 protocol:{profiles:PROFILES,samplesPerVersionProfile:SAMPLES,warmupRounds:WARMUP,measuredRounds:ROUNDS,reloads:RELOADS,locales:LOCALES,
  domProbeCapPerRound:DOM_CAP,gc:'Two HeapProfiler.collectGarbage calls with task boundaries after pending persistence/two animation frames; prune cleared weak probes; one cleanup GC before heap/counter capture',
  controls:'Strongly held object/node survive; released object/node weak references clear',
  operations:'Allocation input; locale switch with exact numerical parity; local feedback open/input/close; canonical English/20 allocation endpoint',
  network:'Only local snapshot GET/HEAD; local feedback configuration disabled; no submission',
  retentionRule:'A retired sampled object surviving at least two further complete rounds and their full GC checkpoints requires investigation; this is not proof of an unbounded leak',
  interpretation:'Heap, document, node and listener trends require independent review; no percentage or slope threshold establishes a leak or leak-free status'},
 contexts:[],issues:[],summary:null,
 limitations:['Bounded eight rounds per context, not hours of use','Weak probes cover selected retired calculator objects, not every allocation','No physical mobile device or native screen reader','No GPU/process memory claim','Local snapshots without external sprites, production feedback API or Turnstile']
};
function save(){
 evidence.elapsedMs=Date.now()-started;
 fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});
 fs.writeFileSync(OUTPUT,JSON.stringify(evidence,null,2)+'\n');
}
async function frames(page){await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
async function settle(page){
 await page.waitForFunction(()=>!!window.ChlohaPersistence&&!window.ChlohaPersistence.status().pending);
 await frames(page);
}
async function collect(page,cdp){
 await settle(page);
 await cdp.send('HeapProfiler.collectGarbage');
 await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,0)));
 await cdp.send('HeapProfiler.collectGarbage');
 await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,0)));
}
async function calibrate(page,cdp){
 await page.evaluate(()=>{
  const node=document.createElement('span'),object={calibration:true};
  window.__finalMemoryControl={node,object,nodeRef:new WeakRef(node),objectRef:new WeakRef(object)};
 });
 await collect(page,cdp);
 const held=await page.evaluate(()=>({node:!!window.__finalMemoryControl.nodeRef.deref(),object:!!window.__finalMemoryControl.objectRef.deref()}));
 assert.deepEqual(held,{node:true,object:true},'GC positive control must remain strongly held');
 await page.evaluate(()=>{window.__finalMemoryControl.node=null;window.__finalMemoryControl.object=null;});
 await collect(page,cdp);
 const released=await page.evaluate(()=>({node:!!window.__finalMemoryControl.nodeRef.deref(),object:!!window.__finalMemoryControl.objectRef.deref()}));
 assert.deepEqual(released,{node:false,object:false},'GC negative control must clear WeakRefs');
 await page.evaluate(()=>{delete window.__finalMemoryControl;});
 return {held,released};
}
async function installProbes(page){
 await page.evaluate(()=>{
  window.__finalMemoryProbe={refs:[],observer:null,current:null,totalSampled:0,totalCollected:0};
 });
}
async function beginRound(page,round){
 await page.evaluate(({round,cap})=>{
  const probe=window.__finalMemoryProbe;
  probe.current={round,removedElements:0,sampledElements:0,skippedElements:0,replacedResults:0};
  const record=records=>{
   for(const mutation of records)for(const node of mutation.removedNodes){
    if(node.nodeType!==Node.ELEMENT_NODE)continue;
    probe.current.removedElements++;
    if(probe.current.sampledElements>=cap){probe.current.skippedElements++;continue;}
    probe.refs.push({kind:'dom',round,ref:new WeakRef(node),tag:node.nodeName,id:node.id||null});
    probe.totalSampled++;
    probe.current.sampledElements++;
   }
  };
  probe.observer=new MutationObserver(record);
  for(const id of ['attTypes','defTypes','attBaseStats','defBaseStats']){
   const node=document.getElementById(id);if(!node)throw Error('Missing sampled panel '+id);
   probe.observer.observe(node,{childList:true});
  }
  probe.flush=()=>record(probe.observer.takeRecords());
 },{round,cap:DOM_CAP});
}
async function operations(page,round){
 return page.evaluate(async({round,locales,feedback})=>{
  const probe=window.__finalMemoryProbe;
  const twoFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const numerical=()=>JSON.stringify({input:window.ChlohaLastCalculation?.a,result:window.ChlohaLastCalculation?.r});
  const calculate=value=>{
   const old=window.ChlohaLastCalculation;
   const field=document.getElementById('att-attack-points');
   field.value=String(value);field.dispatchEvent(new Event('input',{bubbles:true}));
   if(!window.ChlohaLastCalculation||window.ChlohaLastCalculation===old)throw Error('Allocation must replace calculation result');
   if(window.ChlohaLastCalculation.r.rolls.length!==16)throw Error('Expected all 16 damage rolls');
   if(old){probe.refs.push({kind:'result',round,ref:new WeakRef(old)});probe.totalSampled++;probe.current.replacedResults++;}
  };
  const locale=value=>{
   const field=document.getElementById('chloha-locale');field.value=value;
   field.dispatchEvent(new Event('change',{bubbles:true}));
   if(window.ChlohaLocale.get()!==value)throw Error('Locale change failed: '+value);
  };
  for(let i=0;i<locales.length;i++){
   calculate(20+(i%2));await twoFrames();
   const before=numerical();locale(locales[i]);await twoFrames();
   if(numerical()!==before)throw Error('Locale changed numerical calculation: '+locales[i]);
   document.getElementById('feedbackButton').click();
   if(document.getElementById('feedbackPanel').hidden)throw Error('Feedback must open');
   const description=document.getElementById('feedbackDescription');
   description.value=feedback;description.dispatchEvent(new Event('input',{bubbles:true}));
   document.getElementById('feedbackClose').click();
   if(!document.getElementById('feedbackPanel').hidden)throw Error('Feedback must close');
   await twoFrames();
  }
  calculate(20);locale('en');
  const description=document.getElementById('feedbackDescription');
  description.value='';description.dispatchEvent(new Event('input',{bubbles:true}));
  await twoFrames();
  probe.flush();probe.observer.disconnect();probe.observer=null;probe.flush=null;
  const coverage={...probe.current};probe.current=null;
  return {localeSwitches:locales.length+1,allocationInputs:locales.length+1,feedbackInputs:locales.length+1,feedbackOpenClose:locales.length,coverage};
 },{round,locales:LOCALES,feedback:FEEDBACK_TEXT});
}
async function checkpoint(page,cdp,round){
 await collect(page,cdp);
 const probes=await page.evaluate(round=>{
  const probe=window.__finalMemoryProbe,byAge={},survivors=[],retained=[];
  let collected=0;
  for(const entry of probe?.refs||[]){
   // Dereference only at the checkpoint, after both GC passes; no remote handles.
   const alive=entry.ref.deref();if(!alive){collected++;continue;}
   retained.push(entry);
   const age=round-entry.round,key=entry.kind+':'+age;byAge[key]=(byAge[key]||0)+1;
   survivors.push({kind:entry.kind,round:entry.round,age,tag:entry.tag,id:entry.id,connected:entry.kind==='dom'?alive.isConnected:undefined});
  }
  if(probe){probe.refs=retained;probe.totalCollected+=collected;}
  return {totalProbes:probe?.totalSampled||0,collectedProbes:probe?.totalCollected||0,
   collectedThisCheckpoint:collected,retainedProbeEntries:retained.length,survivorsByKindAndAge:byAge,survivors};
 },round);
 // Discard collected WeakRefs/metadata before measuring heap. Keeping a growing
 // audit array would itself manufacture a post-warmup retention slope. History
 // lives in Node, outside the inspected renderer. Only live probes remain there.
 await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,0)));
 await cdp.send('HeapProfiler.collectGarbage');
 await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,0)));
 const heap=await cdp.send('Runtime.getHeapUsage');
 const dom=await cdp.send('Memory.getDOMCounters');
 const browser=await page.evaluate(()=>({connectedElements:document.getElementsByTagName('*').length,
  locale:window.ChlohaLocale.get(),pendingSave:window.ChlohaPersistence.status().pending}));
 return {round,elapsedMs:Date.now()-started,heap,dom,...probes,...browser};
}
async function detachedInspection(cdp){
 try{
  await cdp.send('DOM.enable');
  const {detachedNodes}=await cdp.send('DOM.getDetachedDomNodes');
  const countTree=node=>1+(node.children||[]).reduce((n,child)=>n+countTree(child),0);
  return {status:'AVAILABLE',trees:detachedNodes.map(item=>({
   nodeName:item.treeNode.nodeName,treeSize:countTree(item.treeNode),
   retainedNodeCount:item.retainedNodeIds.length
  }))};
 }catch(error){
  return {status:'UNAVAILABLE',message:String(error.message).slice(0,400)};
 }finally{await cdp.send('DOM.disable').catch(()=>{});}
}
const snapshot=page=>page.evaluate(()=>({state:window.ChlohaPersistence.capture(),input:window.ChlohaLastCalculation?.a,rolls:window.ChlohaLastCalculation?.r.rolls}));
function summarizeContext(record){
 const points=record.checkpoints.filter(x=>x.round>=0);
 const metrics={};
 for(const [name,get]of Object.entries({heapBytes:x=>x.heap.usedSize,documents:x=>x.dom.documents,nodes:x=>x.dom.nodes,listeners:x=>x.dom.jsEventListeners,connectedElements:x=>x.connectedElements}))metrics[name]=series(points.map(get));
 return {metrics,agedRetainedProbes:points.reduce((n,p)=>n+p.survivors.filter(x=>x.age>=2).length,0),
  latestSurvivors:points.at(-1).survivors,removedElements:record.rounds.reduce((n,r)=>n+r.coverage.removedElements,0),
  sampledElements:record.rounds.reduce((n,r)=>n+r.coverage.sampledElements,0),
  skippedElements:record.rounds.reduce((n,r)=>n+r.coverage.skippedElements,0),
  calculationProbes:record.rounds.reduce((n,r)=>n+r.coverage.replacedResults,0)};
}
function summarizeAll(){
 const profiles={};
 for(const profile of PROFILES){
  const versions={};
  for(const version of ['baseline','candidate']){
   const records=evidence.contexts.filter(c=>c.profile===profile.name&&c.version===version&&c.summary);
   if(records.length!==SAMPLES)continue;
   versions[version]={contexts:records.length,heapMedianOfContextMedians:median(records.map(c=>c.summary.metrics.heapBytes.median)),
    heapDeltaMedian:median(records.map(c=>c.summary.metrics.heapBytes.delta)),heapSlopeMedian:median(records.map(c=>c.summary.metrics.heapBytes.slopePerRound)),
    listenerDeltaMedian:median(records.map(c=>c.summary.metrics.listeners.delta)),nodeDeltaMedian:median(records.map(c=>c.summary.metrics.nodes.delta)),
    agedRetainedProbeObservations:records.reduce((n,c)=>n+c.summary.agedRetainedProbes,0)};
  }
  const pairs=[];
  for(let sample=0;sample<SAMPLES;sample++){
   const a=evidence.contexts.find(c=>c.profile===profile.name&&c.version==='baseline'&&c.sample===sample);
   const b=evidence.contexts.find(c=>c.profile===profile.name&&c.version==='candidate'&&c.sample===sample);
   if(!a?.summary||!b?.summary)continue;
   const baseline=a.summary.metrics.heapBytes.median,candidate=b.summary.metrics.heapBytes.median;
   pairs.push({sample,baselineMedianHeapBytes:baseline,candidateMedianHeapBytes:candidate,differenceBytes:candidate-baseline,percentage:100*(candidate-baseline)/baseline});
  }
  profiles[profile.name]={versions,matchedPairs:pairs};
 }
 return {profiles,interpretation:'Review raw trends; no automatic leak/plateau conclusion from heap deltas or slopes',
  sampledRetention:evidence.issues.length?'UNEXPECTED_RETAINED_OBJECTS_REQUIRE_INVESTIGATION':'NO_AGED_RETENTION_DETECTED_IN_SAMPLED_OBJECTS'};
}
async function runContext(browser,lab,profile,version,sample){
 const context=await browser.newContext({viewport:{width:profile.width,height:profile.height},isMobile:profile.mobile,hasTouch:profile.mobile,serviceWorkers:'block'});
 const record={version,profile:profile.name,sample,checkpoints:[],rounds:[],reloads:[],pageErrors:[],mutatingRequests:[],blockedExternalRequests:0,status:'RUNNING'};
 evidence.contexts.push(record);
 try{
  await context.route('**/*',route=>{
   const request=route.request();
   if(!['GET','HEAD'].includes(request.method())){
    record.mutatingRequests.push({method:request.method(),path:new URL(request.url()).pathname});return route.abort();
   }
   if(new URL(request.url()).origin!==lab.origin){record.blockedExternalRequests++;return route.abort();}
   return route.fallback();
  });
  await context.route('**/feedback-config-v0185.js*',route=>route.fulfill({contentType:'text/javascript',body:'window.ChlohaFeedbackConfig={};'}));
  const page=await context.newPage();page.setDefaultTimeout(20000);
  page.on('pageerror',error=>record.pageErrors.push(error.message));
  const cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpu});
  if(!evidence.environment.chromium)evidence.environment.chromium=await cdp.send('Browser.getVersion');
  await page.goto(lab.origin+'/'+version+'/',{waitUntil:'load'});await ready(page);
  await page.waitForFunction(()=>!!window.ChlohaPersistence&&!!document.getElementById('feedbackDescription'));
  record.calibration=await calibrate(page,cdp);await installProbes(page);
  for(let round=-WARMUP;round<ROUNDS;round++){
   await beginRound(page,round);
   record.rounds.push({round,...await operations(page,round)});
   const point=await checkpoint(page,cdp,round);record.checkpoints.push(point);
   if(round>=0){
    const aged=point.survivors.filter(p=>p.age>=2);
    if(aged.length)evidence.issues.push({kind:'UNEXPECTED_RETAINED_OBJECTS',version,profile:profile.name,sample,round,count:aged.length,probes:aged});
   }
  }
  record.detachedDom=await detachedInspection(cdp);
  const expected=await snapshot(page);
  assert.equal(expected.rolls.length,16,'reload fixture has 16 rolls');
  for(let i=0;i<RELOADS;i++){
   // Use an identifiable private marker while saving; it must not persist.
   await page.evaluate(text=>{
    const field=document.getElementById('feedbackDescription');field.value=text;
    field.dispatchEvent(new Event('input',{bubbles:true}));
   },FEEDBACK_TEXT);
   assert.equal(await page.evaluate(()=>window.ChlohaPersistence.save()),true);
   assert.equal(await page.evaluate(text=>localStorage.getItem(window.ChlohaPersistence.key).includes(text),FEEDBACK_TEXT),false,'feedback text must not enter calculator storage');
   await page.reload({waitUntil:'load'});await ready(page);
   await page.waitForFunction(()=>!!window.ChlohaPersistence&&!!document.getElementById('feedbackDescription'));
   assert.deepEqual(await snapshot(page),expected,'reload must preserve state, engine input and all rolls');
   assert.equal(await page.locator('#feedbackDescription').inputValue(),'','feedback text must not restore');
   record.reloads.push({reload:i,...await checkpoint(page,cdp,i)});
  }
  assert.deepEqual(record.pageErrors,[],'no browser page errors');
  assert.deepEqual(record.mutatingRequests,[],'no mutating network requests');
  assert.ok(record.rounds.every(r=>r.coverage.sampledElements>0),'all rounds must exercise DOM replacement probes');
  assert.ok(record.rounds.every(r=>r.coverage.replacedResults===LOCALES.length+1),'all rounds must exercise replaced result probes');
  record.summary=summarizeContext(record);record.status='COMPLETE';
 }catch(error){record.status='FAILED';record.error=error.stack||String(error);throw error;}
 finally{await context.close();save();}
}
(async()=>{
 let browser,lab;
 try{
  save();lab=await startLab({compare:true,comparisonRef:BASELINE});
  assert.equal(lab.baseline,BASELINE,'memory audit requires the exact published baseline for this release line');
  browser=await launchBrowser();
  evidence.environment.browserVersion=browser.version();
  for(const profile of PROFILES)for(let sample=0;sample<SAMPLES;sample++){
   for(const version of sample%2?['candidate','baseline']:['baseline','candidate']){
    console.log('Memory protocol:',profile.name,version,'context',sample+1,'/',SAMPLES);
    await runContext(browser,lab,profile,version,sample);
   }
  }
  evidence.summary=summarizeAll();
  assert.deepEqual(evidence.issues,[],'Unexpected aged retained objects: inspect raw probes/retaining paths; not a claim of an unbounded leak');
  evidence.status='PASS';
  console.log('PASS: calibrated GC, 12 isolated contexts, 96 nine-language rounds, 36 exact reloads, no aged retention in sampled objects. Heap/counter trends require independent review.');
 }catch(error){evidence.status='FAILED';evidence.error=error.stack||String(error);evidence.summary=summarizeAll();console.error(error);process.exitCode=1;}
 finally{if(browser)await browser.close();if(lab)await lab.close();save();console.log('Memory evidence:',path.relative(root,OUTPUT));}
})();
