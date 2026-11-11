// Tester feedback regression: hiragana input must suggest the same Pokemon/moves as katakana.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#attSearch').waitFor();
  for(const [query,name] of [['りざーどん','リザードン'],['かびごん','カビゴン'],['ふしぎばな','フシギバナ']]){
   await page.locator('#attSearch').fill(query);
   await page.locator('#attSuggestions').getByRole('option',{name,exact:true}).waitFor();
   console.log('MATCH hiragana Pokemon',query,name);
  }
  await page.locator('#attSearch').fill('りざーどん');
  await page.locator('#attSuggestions').getByRole('option',{name:'リザードン',exact:true}).click();
  assert.equal(await page.locator('#dbAttPokemon').inputValue(),'charizard');
  await page.locator('#moveSearch').fill('かえんほうしゃ');
  await page.locator('#moveSuggestions').getByRole('option',{name:'かえんほうしゃ',exact:true}).waitFor();
  await page.locator('#moveSearch').fill('カエンホウシャ');
  await page.locator('#moveSuggestions').getByRole('option',{name:'かえんほうしゃ',exact:true}).waitFor();
  console.log('PASS v0.178 hiragana and katakana suggestion parity');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
