'use strict';
// Execute the real feedback UI handlers with a minimal DOM and synthetic calculator state.
// No network, real report, credentials or browser storage is used.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function harness(){
 const nodes=new Map(),listeners=new Map();let unreadable=false,current={schemaVersion:1,appVersion:'v0.188 Pre-Release 1',engineVersion:'v0.184',locale:'en',selection:{attacker:'garchomp',defender:'tyranitar',move:'earthquake'},controls:{attack:'187',weather:'none'},engineInput:{attack:187,power:100},result:{minimumDamage:122,maximumDamage:146}};
 class Node{
  constructor(id=''){this.id=id;this.value='';this.checked=false;this.hidden=false;this.disabled=false;this.dataset={};this.events=new Map();this.attrs={};this.tagName='DIV';this.type='';}
  set innerHTML(html){for(const match of html.matchAll(/id="([^"]+)"/g))get(match[1]);}
  get innerHTML(){return '';}
  addEventListener(type,fn){if(!this.events.has(type))this.events.set(type,[]);this.events.get(type).push(fn);}
  setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this.attrs[k];}focus(){}append(){}before(){}remove(){}
  querySelector(){return null;}querySelectorAll(){return [];}contains(node){return node?.id?.startsWith('feedback');}
  closest(selector){return selector==='button'&&this.tagName==='BUTTON'?this:null;}
 }
 function get(id){if(!nodes.has(id))nodes.set(id,new Node(id));return nodes.get(id);}
 get('app');
 const document={readyState:'complete',title:'Singularity v0.188 Pre-Release 1',head:new Node(),getElementById:id=>id==='feedbackPanel'&&!nodes.has(id)?null:get(id),createElement:tag=>{const n=new Node();n.tagName=tag.toUpperCase();return n;},addEventListener:(type,fn)=>{if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(fn);}};
 const context={document,console,structuredClone,URL,AbortSignal,crypto:require('node:crypto').webcrypto,setTimeout,clearTimeout,queueMicrotask,window:{ChlohaLocale:{get:()=>current.locale},ChlohaFeedbackContract:{categories:['bug'],controlIds:['attack','weather'],limits:{description:5000,email:254}},ChlohaFeedbackLocales:{text:(_lang,k)=>k,keys:['attachmentError']},ChlohaFeedbackSnapshot:{capture:()=>{if(unreadable)throw Error('synthetic unavailable');return structuredClone(current);}}}};
 // Dynamically created elements become addressable as in a browser DOM.
 const originalCreate=document.createElement;document.createElement=tag=>{const n=originalCreate(tag);Object.defineProperty(n,'id',{get(){return this._id||'';},set(v){this._id=v;nodes.set(v,this);},configurable:true});return n;};
 vm.runInNewContext(fs.readFileSync(require('node:path').resolve(__dirname,'../feedback-release-v100.js'),'utf8'),context);
 context.window.ChlohaFeedbackRelease=context.ChlohaFeedbackRelease;
 vm.runInNewContext(fs.readFileSync(require('node:path').resolve(__dirname,'../feedback-ui-v0185.js'),'utf8'),context);
 const fire=async(node,type)=>{const e={target:node,preventDefault(){}};for(const fn of node.events.get(type)||[])await fn(e);for(const fn of listeners.get(type)||[])await fn(e);await Promise.resolve();};
 const attach=async()=>{get('feedbackAttach').checked=true;await fire(get('feedbackAttach'),'change');get('feedbackConfirm').checked=true;};
 return {get,fire,attach,unreadable:()=>{unreadable=true;},set:fn=>fn(current),button:id=>{const n=get(id);n.tagName='BUTTON';return n;}};
}
(async()=>{
 for(const id of ['attPresetSynthetic','swapSides','resetCalculation']){
  const h=harness();await h.attach();h.set(s=>{s.controls.attack='200';s.engineInput.attack=200;});await h.fire(h.button(id),'click');assert.equal(h.get('feedbackStale').hidden,false,id+' must invalidate approved attachment');assert.equal(h.get('feedbackConfirm').checked,false);
 }
 {
  const h=harness();await h.attach();h.set(s=>{s.engineInput.attack=200;});await h.fire(h.get('att-attack-points'),'input');assert.equal(h.get('feedbackConfirm').checked,false,'six-stat model input must invalidate attachment');
 }
 {
  const h=harness();await h.attach();h.set(s=>{s.locale='fr';});await h.fire(h.get('chloha-locale'),'change');await h.fire(h.button('unrelatedUiToggle'),'click');assert.equal(h.get('feedbackConfirm').checked,true,'locale and non-calculation changes preserve consent');
 }
 {
  const h=harness();await h.attach();h.get('feedbackCategory').value='bug';h.get('feedbackDescription').value='Synthetic local-only test';h.set(s=>{s.controls.attack='201';s.engineInput.attack=201;});await h.fire(h.get('feedbackForm'),'submit');assert.equal(h.get('feedbackErrors').textContent,'attachmentError','submission rechecks current calculation even without a DOM event');assert.equal(h.get('feedbackConfirm').checked,false);
 }
 // SOL-01: invalid point allocations can clear only the derived result while
 // the last valid engine bridge values remain identical.
 for(const viaEvent of [true,false]){
  const h=harness();await h.attach();h.get('feedbackCategory').value='bug';h.get('feedbackDescription').value='Local invalid-result regression';
  h.set(s=>{s.result=null;});
  if(viaEvent)await h.fire(h.get('att-specialDefense-points'),'input');
  else await h.fire(h.get('feedbackForm'),'submit');
  assert.equal(h.get('feedbackStale').hidden,false,'invalid result must stale the approved snapshot');
  assert.equal(h.get('feedbackConfirm').checked,false,'invalid result must revoke attachment consent');
  await h.fire(h.get('feedbackForm'),'submit');assert.equal(h.get('feedbackErrors').textContent,'attachmentError');
 }
 {const h=harness();await h.attach();h.unreadable();await h.fire(h.button('syntheticCalculatorAction'),'click');assert.equal(h.get('feedbackConfirm').checked,false,'capture failure must revoke consent');}
 console.log('PASS independent feedback consent: preset/swap/reset, six-stat edits, locale preservation and submit-time freshness');
})().catch(e=>{console.error(e);process.exitCode=1;});
