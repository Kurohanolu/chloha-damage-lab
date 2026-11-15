'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  // Deterministic image fixture for the accessible name test; no production API requests.
  await page.route('https://**/*',route=>route.request().url().includes('raw.githubusercontent.com/PokeAPI/sprites/')?route.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')}):route.abort());
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.waitForFunction(()=>window.SingularityPortraitAlt&&window.ChlohaLocalePokemonName&&document.querySelector('#attPortrait').alt);
  const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
  for(const code of locales){
   await page.locator('#chloha-locale').selectOption(code);
   for(const [side,id] of [['att','garchomp'],['def','tyranitar']]){
    await page.locator(side==='att'?'#dbAttPokemon':'#dbDefPokemon').evaluate((select,id)=>{select.value=id;select.dispatchEvent(new Event('input',{bubbles:true}));},id);
   }
   const before=await page.locator('#attPortrait,#defPortrait').evaluateAll(images=>images.map(img=>img.alt));
   const expected=await page.evaluate(code=>['att','def'].map(side=>{const img=document.getElementById(side+'Portrait');const name=code==='ja'?img.dataset.pokemonJa:window.ChlohaLocalePokemonName(img.dataset.pokemon,code);return window.SingularityPortraitAlt.describe(img.dataset.pokemon,img.dataset.pokemonJa,code,()=>name);}),code);
   assert.deepEqual(before,expected,code+' immediate alt');
   const snapshot=await page.locator('#attPortrait').ariaSnapshot();
   assert.ok(snapshot.includes(before[0]),code+' accessible image name');
   await page.reload();await page.waitForFunction(()=>window.SingularityPortraitAlt&&document.querySelector('#attPortrait').alt);
   assert.equal(await page.locator('#chloha-locale').inputValue(),code,code+' selected locale restored');
   assert.deepEqual(await page.locator('#attPortrait,#defPortrait').evaluateAll(images=>images.map(img=>img.alt)),expected,code+' reload alt');
  }
  // The same selected species must update even if its image src has not changed.
  await page.locator('#chloha-locale').selectOption('de');
  await page.locator('#dbAttPokemon').evaluate(select=>{select.value='tyranitar';select.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await page.locator('#attPortrait').getAttribute('alt'),'Bild von Despotar');
  const missing=await page.evaluate(()=>{const saved=window.ChlohaLocalePokemonName;window.ChlohaLocalePokemonName=()=>null;window.SingularityPortraitAlt.refresh();const alt=document.getElementById('attPortrait').alt;window.ChlohaLocalePokemonName=saved;window.SingularityPortraitAlt.refresh();return alt;});
  assert.equal(missing,'Pokémon-Bild (Name in der ausgewählten Sprache nicht verfügbar)');
  const mutations=await page.evaluate(async()=>{
   const img=document.getElementById('attPortrait');let count=0;
   const observer=new MutationObserver(records=>count+=records.length);
   observer.observe(img,{attributes:true,attributeFilter:['alt','data-pokemon','data-pokemon-ja']});
   for(let i=0;i<20;i++)window.SingularityPortraitAlt.update(img,{id:'tyranitar',name:'バンギラス'});
   await Promise.resolve();observer.disconnect();return count;
  });
  assert.equal(mutations,0,'unchanged calculation refreshes do not enqueue portrait mutations');
  assert.deepEqual(errors,[],'no browser errors');
  console.log('PASS v0.188 portrait alt browser: nine languages, accessible image name, same-species switching, reload and unavailable translations');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
