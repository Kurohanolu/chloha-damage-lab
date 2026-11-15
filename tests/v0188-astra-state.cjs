'use strict';
// Independent regression of the actual UI event handler and storage lifecycle.
// The DOM/storage fixture is deterministic; full browser coverage remains separate.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const source=fs.readFileSync(path.join(root,'persistence-v0188.js'),'utf8');
const handler=html.match(/for\(const kind of \['points','range','nature','actual'\]\)[\s\S]*?addEventListener\('input',\(\)=>\{([\s\S]*?)\n   \}\);\n   el\(`/)?.[1];
assert.ok(handler,'real actual-stat input handler exists');
for(const side of ['att','def']){
 const controls={dbAuto:{checked:false},[side+'-hp-actual']:{value:'200'},hp:{value:'175'},attMaxHp:{value:'183'}};
 const context={side,k:'hp',kind:'actual',models:{att:{manual:{}},def:{manual:{}}},el:id=>controls[id],render(){},refreshUI(){}};
 vm.runInNewContext('(()=>{'+handler+'})()',context);
 assert.equal(controls.attMaxHp.value,side==='att'?'200':'183',side+' HP edits address the attacker only when intended');
 assert.equal(controls.hp.value,side==='def'?'200':'175',side+' HP edits address the defender only when intended');
 assert.equal(context.models[side].manual.hp,200,'manual UI model updated');
}
// Reading every direct damage control must be covered by the storage allowlist.
const exported={module:{exports:{}}};vm.runInNewContext(source,exported);
const api=exported.module.exports;
const readBody=html.match(/function read\(\)\{([\s\S]*?)\n\/\/ Reliability disclosures/)[1];
const directIds=[...readBody.matchAll(/(?:\$|number)\('([^']+)'\)/g)].map(m=>m[1]).filter(id=>id!=='storedPower_');
for(const id of directIds)assert.ok(api.IDS.includes(id),'damage input must persist: '+id);
for(const suffix of ['atk','def','spa','spd','spe','accuracy','evasion'])assert.ok(api.IDS.includes('storedPower_'+suffix));
for(const privateId of ['feedbackDescription','feedbackEmail','feedbackAttach','battleObservedDamage','battleHistory','token','snapshot'])assert.ok(!api.IDS.includes(privateId),'private/uncommitted data must not persist: '+privateId);
const setup=`
const nodes={},docHandlers={},windowHandlers={},timers=new Map(),data=new Map();
let nextTimer=0,writes=0,removals=0,restores=0,locale='ja',mode='ok';
class Element {
 constructor(){this.type='number';this.tagName='INPUT';this.value='1';this.checked=false;this.min='';this.max='';this.textContent='';this.options=[];this.handlers={};}
 set id(value){this._id=value;nodes[value]=this;}get id(){return this._id;}
 setAttribute(){} append(){} after(){} closest(){return this;}addEventListener(name,fn){this.handlers[name]=fn;}
}
for(const id of ${JSON.stringify(api.IDS)}){const node=new Element();node.id=id;}
nodes.dbAuto.type='checkbox';nodes.beatUpStats.value='100';
for(const id of ['resetBoard','feedbackDescription']){const node=new Element();node.id=id;}
const model=()=>({points:Object.fromEntries(${JSON.stringify(api.STATS)}.map(k=>[k,0])),nature:Object.fromEntries(${JSON.stringify(api.STATS)}.map(k=>[k,'neutral'])),rank:Object.fromEntries(${JSON.stringify(api.STATS)}.map(k=>[k,0])),manual:{}});
let models={att:model(),def:model()};
const document={readyState:'complete',visibilityState:'visible',getElementById:id=>nodes[id],createElement:()=>new Element(),addEventListener:(name,fn)=>(docHandlers[name]||=[]).push(fn)};
const window={document,ChlohaLocale:{get:()=>locale},ChlohaGameData:{moves:[]},
 ChlohaUI:{persistenceRules:()=>({abilities:[],items:[]}),persistencePrepare(){},persistenceState:()=>({models:JSON.parse(JSON.stringify(models)),spitUpCount:1,conditionalPowerOverride:false}),persistenceRestore(state){models=JSON.parse(JSON.stringify(state.models));restores++;}},
 localStorage:{getItem:key=>{if(mode==='denied')throw Error('denied');return data.get(key)??null;},setItem(key,value){if(mode!=='ok')throw Error('blocked');data.set(key,value);writes++;},removeItem(key){if(mode==='denied')throw Error('denied');data.delete(key);removals++;}},
 addEventListener:(name,fn)=>(windowHandlers[name]||=[]).push(fn)};
function fire(name,id){for(const fn of docHandlers[name]||[])fn({target:nodes[id]});}
function flush(){const work=[...timers.values()];timers.clear();for(const fn of work)fn();}
function hide(){document.visibilityState='hidden';for(const fn of docHandlers.visibilitychange||[])fn();}
function leave(){for(const fn of windowHandlers.pagehide||[])fn();}
const setTimeout=fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout=id=>timers.delete(id);
`;
const lifecycle=vm.createContext({});vm.runInContext(setup,lifecycle);vm.runInContext(source,lifecycle);
const run=script=>vm.runInContext(script,lifecycle);
assert.equal(run('writes'),0,'loading default state must not overwrite storage');
run("nodes.attack.value='20';fire('input','attack');");
assert.equal(run('writes'),0,'debounced edit waits for committed event');
run('leave()');
assert.equal(run('JSON.parse(data.get(window.ChlohaPersistence.key)).state.controls.attack'),'20','pagehide flushes pending edit');
assert.equal(run('writes'),1);
run('leave();hide();');assert.equal(run('writes'),1,'untouched tab does not overwrite newer saved data');
run("nodes.feedbackDescription.value='private';fire('input','feedbackDescription');flush();");assert.equal(run('writes'),1,'feedback editing never schedules calculator storage');
run("nodes.attack.value='';fire('input','attack');flush();");assert.equal(run('writes'),1,'incomplete edit preserves last valid saved settings');
assert.equal(run('JSON.parse(data.get(window.ChlohaPersistence.key)).state.controls.attack'),'20');
run("nodes.attack.value='21';fire('input','attack');window.ChlohaPersistence.reset();leave();flush();");
assert.equal(run('nodes.attack.value'),'1');assert.equal(run('data.size'),0,'reset deletes instead of immediately saving a default snapshot');
assert.equal(run('writes'),1,'reset cancels pending save and pagehide does not resurrect it');
run("mode='quota';nodes.attack.value='30';fire('input','attack');flush();");
assert.equal(run('nodes.attack.value'),'30','quota failure does not discard calculation input');
assert.equal(run('window.ChlohaPersistence.status().storageAvailable'),false);
run("mode='ok';fire('change','attack');flush();");
assert.equal(run('window.ChlohaPersistence.status().storageAvailable'),true,'successful later write recovers storage indicator');
assert.equal(run('JSON.parse(data.get(window.ChlohaPersistence.key)).state.controls.attack'),'30');
run("locale='fr';fire('chloha:localechange','attack');");
assert.equal(run('nodes.resetCalculation.textContent'),'Réinitialiser le calcul');
assert.equal(run('JSON.parse(data.get(window.ChlohaPersistence.key)).state.controls.attack'),'30','locale change does not alter saved controls');
console.log('PASS Astra state: real manual HP handler, direct damage-control coverage, privacy exclusions, debounce/pagehide/reset/stale-tab/storage-failure/locale lifecycle');
