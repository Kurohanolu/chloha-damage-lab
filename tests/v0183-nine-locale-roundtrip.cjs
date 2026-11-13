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
    verdict:document.querySelector('#miniVerdict')?.textContent?.trim()
   }));
   snapshots.push({transition:from+' → '+lang,...state});
   try{
    assert.equal(state.lang,lang,'html lang');
    for(const field of ['weather','terrain','screen'])assert.equal(state[field],none,field);
    if(state.format!==undefined)assert.equal(state.format,double,'battle format');
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
