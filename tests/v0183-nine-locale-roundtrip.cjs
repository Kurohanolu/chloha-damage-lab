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
    hits:document.querySelector('#hits')?.textContent?.trim()
   }));
   snapshots.push({transition:from+' → '+lang,...state});
   try{
    assert.equal(state.lang,lang,'html lang');
    for(const field of ['weather','terrain','screen'])assert.equal(state[field],none,field);
    if(state.format!==undefined)assert.equal(state.format,double,'battle format');
    // Calculated numeric values must not change when only the UI language changes.
    if(i===0)page._baselineNumeric={damage:state.resultDamage,percent:state.resultPercent};
    else{
     assert.equal(state.resultDamage,page._baselineNumeric.damage,'calculated damage invariant');
     assert.equal(state.resultPercent,page._baselineNumeric.percent,'calculated percentage invariant');
    }
    // Catch untranslated Japanese source leaking into non-Japanese UI, including
    // dynamic KO details and native item/ability selectors.
    if(lang!=='ja'){
     for(const field of ['board','verdict','koVerdict','koDetail','attAbility','defAbility','attItem','defItem']){
      const value=state[field]||'';
      assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(value),field+' has Japanese characters: '+value);
     }
    }
    if(lang==='ja')assert.ok(state.board?.startsWith('現在の盤面：天候 なし'), 'Japanese board');
    else assert.ok(state.board&&!state.board.includes('現在の盤面')&&!state.board.includes('Current battlefield: Weather Ninguno'),'board language');
   }catch(e){
    console.error('FAILED transition '+from+' → '+lang+'; snapshot='+JSON.stringify(state));
    throw e;
   }
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS nine-language full-cycle UI roundtrip '+JSON.stringify(snapshots));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
