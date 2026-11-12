const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').waitFor();
  for(const [locale,moveEmpty,pokemonEmpty] of [
   ['en','No matching moves','No matching Pokémon'],
   ['ja','該当する技がありません','該当するポケモンがありません'],
   ['en','No matching moves','No matching Pokémon']
  ]){
   await page.locator('#chloha-locale').selectOption(locale);
   await page.locator('#moveSearch').fill('zzzxxyy-not-a-move');
   await page.locator('#moveSuggestions .move-empty').waitFor();
   assert.equal(await page.locator('#moveSuggestions .move-empty').innerText(),moveEmpty,'move empty '+locale);
   await page.locator('#attSearch').fill('zzzxxyy-not-a-pokemon');
   await page.locator('#attSuggestions .pokemon-suggestion-empty').waitFor();
   assert.equal(await page.locator('#attSuggestions .pokemon-suggestion-empty').innerText(),pokemonEmpty,'Pokemon empty '+locale);
  }
  console.log('PASS dynamic empty-result translations EN JA EN');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
