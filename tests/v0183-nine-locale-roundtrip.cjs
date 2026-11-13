'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const selector=page.locator('#chloha-locale');
  const steps=[
   ['ja','なし','ダブル'],['en','None','Doubles'],['fr','Aucun','Duo'],
   ['de','Keine','Doppel'],['es','Ninguno','Doble'],['it','Nessuno','Doppio'],
   ['ko','없음','더블'],['zh-Hans','无','双打'],['zh-Hant','無','雙打'],
   ['ja','なし','ダブル']
  ];
  // Exercise real controls before switching locales; preserve their selected
  // semantic values while translated labels and dynamic results are rebuilt.
  const exercised={
   weather:'rain',terrain:'electric',screen:'reflect',
   attItem:'lifeOrb',defItem:'assaultVest'
  };
  for(const [id,value] of Object.entries(exercised)){
   await page.locator('#'+id).selectOption(value);
  }
  const abilities=await page.locator('#attAbility option').evaluateAll(nodes=>nodes.map(n=>n.value).filter(v=>v!=='none'&&!v.startsWith('unsupported:')));
  if(abilities.length){exercised.attAbility=abilities[0];await page.locator('#attAbility').selectOption(abilities[0]);}
  const defenderAbilities=await page.locator('#defAbility option').evaluateAll(nodes=>nodes.map(n=>n.value).filter(v=>v!=='none'));
  if(defenderAbilities.length){exercised.defAbility=defenderAbilities[0];await page.locator('#defAbility').selectOption(defenderAbilities[0]);}
  const moves=await page.locator('#dbMove option').evaluateAll(nodes=>nodes.map(n=>n.value).filter(Boolean));
  if(moves.includes('earthquake')){exercised.dbMove='earthquake';await page.locator('#dbMove').evaluate(el=>{el.value='earthquake';el.dispatchEvent(new Event('change',{bubbles:true}));});}
  await page.evaluate(controls=>{window.__roundtripControls=controls;},exercised);
  const snapshots=[];
  for(let i=0;i<steps.length;i++){
   const [lang,none,double]=steps[i];
   const from=i===0?'initial':steps[i-1][0];
   await selector.selectOption(lang);
   await page.waitForTimeout(120);
   const state=await page.evaluate(()=>({
    lang:document.documentElement.lang,
    weather:document.querySelector('#weather option[value="none"]')?.textContent?.trim(),
    terrain:document.querySelector('#terrain option[value="none"]')?.textContent?.trim(),
    screen:document.querySelector('#screen option[value="none"]')?.textContent?.trim(),
    format:document.querySelector('#battleFormat')?.selectedOptions?.[0]?.textContent?.trim(),
    board:document.querySelector('#boardSummary')?.textContent?.trim(),
    damage:document.querySelector('#miniDamage')?.textContent?.trim(),
    verdict:document.querySelector('#miniVerdict')?.textContent?.trim(),
    resultDamage:document.querySelector('#damage')?.textContent?.trim(),
    resultPercent:document.querySelector('#percent')?.textContent?.trim(),
    koVerdict:document.querySelector('#koVerdict')?.textContent?.trim(),
    koDetail:document.querySelector('#koVerdictDetail')?.textContent?.trim(),
    attAbility:document.querySelector('#attAbility')?.selectedOptions?.[0]?.textContent?.trim(),
    defAbility:document.querySelector('#defAbility')?.selectedOptions?.[0]?.textContent?.trim(),
    attItem:document.querySelector('#attItem')?.selectedOptions?.[0]?.textContent?.trim(),
    defItem:document.querySelector('#defItem')?.selectedOptions?.[0]?.textContent?.trim(),
    move:document.querySelector('#dbMove')?.selectedOptions?.[0]?.textContent?.trim(),
    hits:document.querySelector('#hits')?.textContent?.trim(),
    selected:Object.fromEntries(Object.keys(window.__roundtripControls||{}).map(id=>[id,document.getElementById(id)?.value]))
   }));
   snapshots.push({transition:from+' → '+lang,...state});
   try{
    assert.equal(state.lang,lang,'html lang');
    for(const [id,value] of Object.entries(exercised))assert.equal(state.selected[id],value,'selected control '+id);
    for(const field of ['weather','terrain','screen'])assert.equal(state[field],none,field);
    if(state.format!==undefined)assert.equal(state.format,double,'battle format');
    // Calculated numeric values must not change when only the UI language changes.
    // Compare numeric results only: labels and range separators are localized.
    const numbers=value=>(String(value||'').match(/\d+(?:\.\d+)?/g)||[]).map(Number);
    const numeric={damage:numbers(state.resultDamage),percent:numbers(state.resultPercent)};
    if(i===0)page._baselineNumeric=numeric;
    else{
     assert.deepEqual(numeric.damage,page._baselineNumeric.damage,'calculated damage invariant');
     assert.deepEqual(numeric.percent,page._baselineNumeric.percent,'calculated percentage invariant');
    }
    // Catch untranslated Japanese source leaking into non-Japanese UI, including
    // dynamic KO details and native item/ability selectors.
    if(lang!=='ja'){
     for(const field of ['board','verdict','koVerdict','koDetail','attAbility','defAbility','attItem','defItem']){
      const value=state[field]||'';
      assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(value),field+' has Japanese characters: '+value);
     }
    }
    if(lang==='ja')assert.ok(state.board?.startsWith('現在の盤面：天候 雨'), 'Japanese board');
    else assert.ok(state.board&&!state.board.includes('現在の盤面')&&!state.board.includes('Current battlefield: Weather Ninguno'),'board language');
   }catch(e){
    console.error('FAILED transition '+from+' → '+lang+'; snapshot='+JSON.stringify(state));
    throw e;
   }
  }
  // Second pass: unsupported abilities must still have localized labels,
  // even though they are intentionally excluded from damage calculations.
  const unsupported=await page.locator('#attAbility option').evaluateAll(nodes=>nodes.find(n=>n.value.startsWith('unsupported:'))?.value||null);
  if(unsupported){
   await page.locator('#attAbility').selectOption(unsupported);
   for(let i=0;i<steps.length;i++){
    const lang=steps[i][0],from=i===0?'initial':steps[i-1][0];
    await selector.selectOption(lang);
    await page.waitForTimeout(120);
    const label=await page.locator('#attAbility').evaluate(el=>el.selectedOptions[0]?.textContent?.trim()||'');
    try{
     assert.ok(label,'unsupported ability label must not be empty');
     if(lang!=='ja')assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(label),'untranslated unsupported ability: '+label);
    }catch(e){
     console.error('FAILED unsupported ability transition '+from+' → '+lang+'; option='+unsupported+' label='+JSON.stringify(label));
     throw e;
    }
   }
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS nine-language full-cycle UI roundtrip '+JSON.stringify(snapshots));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
