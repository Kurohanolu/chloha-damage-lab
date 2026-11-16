'use strict';
// Independent second-batch spellings/IDs. The screenshots attest terminology,
// not engine mechanics; this test exercises the existing local calculator only.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
const moves=[
 {key:'かわらわり',id:'gw0169_p022',name:'Karatazo',es:'Demolición',wrongKey:'からてチョップ'},
 {key:'きあいだま',id:'gw0169_s013',name:'Ataque Centrado',es:'Onda Certera',wrongKey:'きあいパンチ',wrongId:'gw0169_p026'},
 {key:'ヘビーボンバー',id:'gw0170_u033',name:'Golpe Pesado',es:'Cuerpo Pesado'},
 {key:'きしかいせい',id:'gw0169_p028',name:'Inversión',es:'Inversión'}
];
const berries=[
 ['ホズのみ','chilanBerry','Baya Chilan'],['リンドのみ','rindoBerry','Baya Tamar'],
 ['オッカのみ','occaBerry','Baya Caoca'],['イトケのみ','passhoBerry','Baya Pasio'],
 ['ソクノのみ','wacanBerry','Baya Gualot'],['タンガのみ','tangaBerry','Baya Yecana'],
 ['バコウのみ','cobaBerry','Baya Kouba'],['ヨロギのみ','chartiBerry','Baya Alcho'],
 ['ビアーのみ','kebiaBerry','Baya Kebia'],['シュカのみ','shucaBerry','Baya Acardo'],
 ['ヤチェのみ','yacheBerry','Baya Rimoya'],['ヨプのみ','chopleBerry','Baya Pomaro'],
 ['ウタンのみ','payapaBerry','Baya Payapa'],['カシブのみ','kasibBerry','Baya Drasi'],
 ['ハバンのみ','habanBerry','Baya Anjiro'],['ナモのみ','colburBerry','Baya Dillo'],
 ['リリバのみ','babiriBerry','Baya Baribá'],['ロゼルのみ','roseliBerry','Baya Hibis']
].map(([key,id,name])=>({key,id,name}));
const abilities=[
 {key:'フィルター',id:'filter',name:'Filtro',species:'candidate093_24',side:'def'},
 {key:'フラワーベール',id:'unsupported:フラワーベール',name:'Velo Florido',species:'roster_v0105_029',side:'att'},
 {key:'フェアリーオーラ',id:'fairyAura',name:'Aura Feérica',species:'roster_v0104_017',side:'att'},
 {key:'さめはだ',id:'unsupported:さめはだ',name:'Piel Tosca',species:'garchomp',side:'att'}
];
const forms=[
 {key:'roster_v0105_029',id:'roster_v0105_029',name:'Floette (Flor Eterna)',query:'Floette Flor Eterna'},
 {key:'roster_v0104_017',id:'roster_v0104_017',name:'Mega-Floette',query:'Mega-Floette'}
];
const variants=text=>[...new Set([text,text.toUpperCase(),text.normalize('NFD').replace(/[\u0300-\u036f]/g,''),text.replace(/\s+/g,'')])];
const c=vm.createContext({});vm.runInContext('window=globalThis',c);
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-name-search.js','locale-name-catalog-adapter.js','locale-names-v0183.js','locale-names-pokeapi-v0183.js','locale-es-la-data-v110.js','locale-es-la-v110.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c,{filename:file});
const combined={};
for(const category of ['pokemon','moves','abilities','items']){
 combined[category]={};
 for(const table of [c.ChlohaPokeAPILocalizedNames[category],c.ChlohaLocalizedNames[category]])for(const [key,names] of Object.entries(table||{}))combined[category][key]={...combined[category][key],...names};
}
const index=c.ChlohaNameCatalogAdapter.build(c.ChlohaNames,c.ChlohaNameSearch,combined);
let indexQueries=0;
for(const [category,witnesses] of [['moves',moves],['items',berries],['abilities',abilities],['pokemon',forms]])for(const w of witnesses){
 const entry=c.ChlohaEsLaData.entries[category][w.key];assert.ok(entry);assert.equal(entry.name,w.name);assert.ok(entry.canonicalIds.includes(w.id));
 assert.equal(entry.officialChampions,true,'Second-batch term has Champions provenance: '+w.name);
 for(const query of new Set([...variants(w.query||w.name),...(w.es?[w.es]:[])])){
  const hits=c.ChlohaNameSearch.search(index,category,query);assert.ok(hits.includes(w.key),'Regional/case/accent/Spain query resolves expected identity: '+query);
  if(w.wrongKey)assert.ok(!hits.includes(w.wrongKey),'A plausible translated name must not select a different move: '+query);
  indexQueries++;
 }
}
assert.ok(!c.ChlohaNameSearch.search(index,'items','Baya Tamar').includes('タンガのみ'),'Tamar must not be Tanga');
assert.ok(!c.ChlohaNameSearch.search(index,'items','Baya Yecana').includes('リンドのみ'),'Yecana must not be Rindo');
assert.equal(c.ChlohaEsLa.entity('natures','いじっぱり'),'Firme');
assert.deepEqual(JSON.parse(JSON.stringify(c.ChlohaEsLa.metadata('natures','いじっぱり').canonicalIds)),['adamant']);
const state=page=>page.evaluate(()=>{
 const calculation=window.ChlohaLastCalculation;
 return JSON.stringify({state:ChlohaPersistence.capture(),input:calculation?.a??null,result:calculation?.r??null,hasCalculation:!!calculation,errorHidden:document.getElementById('error').hidden,outputHidden:document.getElementById('output').hidden,copyDisabled:document.getElementById('copy').disabled,battleCommitDisabled:document.getElementById('battleCommit').disabled});
});
const expose=control=>control.evaluate(node=>{for(let p=node.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
async function localeRoundtrip(page,control,expectedId,spainLabel){
 const before=await state(page);
 await page.selectOption('#chloha-locale','es');assert.equal(await state(page),before,'ES-ES switch preserves canonical state/input/output');
 assert.equal(await page.locator('#'+control).inputValue(),expectedId);
 if(spainLabel)assert.ok((await page.locator('#moveSelected').textContent()).includes(spainLabel),'Existing Spain move label remains independent');
 await page.selectOption('#chloha-locale','es-LA');assert.equal(await state(page),before,'Return to ES-LA preserves canonical state/input/output');
 assert.equal(await page.locator('#'+control).inputValue(),expectedId);
}
(async()=>{
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
 const evidence={mode:'local Chromium emulation; no private images required',sourceCommit:git('rev-parse','HEAD'),sourceTree:git('rev-parse','HEAD^{tree}'),uncommittedPreview:!!git('status','--porcelain'),realDevice:false,productionRequests:0,productionMutations:0,indexQueries,widths:[390,1440],moves:[],berries:[],abilities:[],forms:[],natures:[],nativeSearch:'Visible-label keyboard typeahead; accent/space variants additionally tested in the canonical alias catalog'};
 let lab,browser,context;
 try{
  lab=await startLab();browser=await launchBrowser();
  for(const width of evidence.widths){
   context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await blockExternal(context,page);await page.goto(lab.origin+'/candidate/');await ready(page);await page.selectOption('#chloha-locale','es-LA');
   for(const w of moves){
    for(const query of new Set([...variants(w.name),w.es])){
     await page.locator('#moveSearch').fill(query);
     const option=page.locator('#moveSuggestions [role=option][aria-label="'+w.name+'"]');
     assert.equal(await option.count(),1,'Unique visible move result: '+query);assert.ok((await option.innerText()).includes(w.name));
     await option.click();assert.equal(await page.locator('#dbMove').inputValue(),w.id,'Search picks the fixed canonical move');
     if(w.wrongId)assert.notEqual(await page.locator('#dbMove').inputValue(),w.wrongId);
    }
    await localeRoundtrip(page,'dbMove',w.id,w.es);evidence.moves.push({width,id:w.id,name:w.name,passed:true});
   }
   for(const w of forms){
    for(const query of variants(w.query)){
     await page.locator('#attSearch').fill(query);
     const option=page.locator('#attSuggestions [role=option][aria-label="'+w.name+'"]');
     assert.equal(await option.count(),1,'Unique visible species/form result: '+query);await option.click();
     assert.equal(await page.locator('#dbAttPokemon').inputValue(),w.id,'Eternal Flower and Mega form retain separate IDs');
    }
    await localeRoundtrip(page,'dbAttPokemon',w.id);evidence.forms.push({width,id:w.id,name:w.name,passed:true});
   }
   for(const w of abilities){
    const speciesControl=page.locator('#db'+(w.side==='att'?'Att':'Def')+'Pokemon');await expose(speciesControl);await speciesControl.selectOption(w.species);
    assert.equal(await page.evaluate(w=>ChlohaGameData.pokemon.find(p=>p.id===w.species).abilities.includes(w.key),w),true,'Ability exists on selected species');
    const control=page.locator('#'+w.side+'Ability');await expose(control);
    const option=control.locator('option[value="'+w.id+'"]');assert.equal(await option.count(),1);assert.ok((await option.textContent()).includes(w.name));
    await control.selectOption('none');await control.focus();await page.keyboard.press('Home');await page.keyboard.type(w.name,{delay:20});await page.keyboard.press('Tab');
    assert.equal(await control.inputValue(),w.id,'Native ability typeahead keeps supported/unsupported identity');
    const blocked=w.id.startsWith('unsupported:'),availability=JSON.parse(await state(page));
    assert.equal(availability.hasCalculation,!blocked,'Unsupported abilities stop calculation; supported abilities retain a result');
    assert.equal(availability.errorHidden,!blocked);assert.equal(availability.outputHidden,blocked);
    if(blocked){assert.equal(availability.input,null);assert.equal(availability.result,null);assert.equal(availability.copyDisabled,true);assert.equal(availability.battleCommitDisabled,true);}
    await localeRoundtrip(page,w.side+'Ability',w.id);evidence.abilities.push({width,id:w.id,name:w.name,blockedOutputPreserved:blocked,passed:true});
   }
   // Restore a calculable state after the deliberately unsupported Rough Skin
   // witness so berry selections also exercise live numeric-state preservation.
   await page.selectOption('#attAbility','none');await page.waitForFunction(()=>!!window.ChlohaLastCalculation);
   const item=page.locator('#defItem');await expose(item);
   for(const w of berries){
    const option=item.locator('option[value="'+w.id+'"]');assert.equal(await option.count(),1);assert.ok((await option.textContent()).includes(w.name));
    await item.selectOption('none');await item.focus();await page.keyboard.press('Home');await page.keyboard.type(w.name,{delay:20});await page.keyboard.press('Tab');
    assert.equal(await item.inputValue(),w.id,'Native berry typeahead resolves exact canonical ID: '+w.name);
    await localeRoundtrip(page,'defItem',w.id);evidence.berries.push({width,id:w.id,name:w.name,passed:true});
   }
   // The UI exposes per-stat modifiers, not a full nature-name selector. Verify
   // the attested name maps to Adamant and the existing calculator's modifiers.
   const nature=await page.evaluate(()=>{
    const p=ChlohaGameData.pokemon.find(p=>p.id==='garchomp');
    return {name:ChlohaEsLa.entity('natures','いじっぱり'),ids:ChlohaEsLa.metadata('natures','いじっぱり').canonicalIds,attack:ChlohaGameData.calcStat(p,'attack',32,'adamant'),specialAttack:ChlohaGameData.calcStat(p,'specialAttack',32,'adamant'),neutralAttack:ChlohaGameData.calcStat(p,'attack',32,'neutral'),neutralSpecialAttack:ChlohaGameData.calcStat(p,'specialAttack',32,'neutral')};
   });
   assert.deepEqual(nature,{name:'Firme',ids:['adamant'],attack:200,specialAttack:118,neutralAttack:182,neutralSpecialAttack:132});evidence.natures.push({width,...nature,passed:true});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No document overflow after second-batch selections');
   assert.deepEqual(errors,[]);await context.close();context=null;
  }
  for(const [key,count] of [['moves',8],['berries',36],['abilities',8],['forms',4],['natures',2]])assert.equal(evidence[key].length,count);
  evidence.passed=true;console.log('PASS second capture browser: '+indexQueries+' alias queries; four move identities, eighteen berries, four abilities, two Floette forms and Firme across two viewports');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}
 finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/second-capture-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
