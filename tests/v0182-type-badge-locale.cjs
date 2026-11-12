const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').waitFor();
  await page.locator('#dbAttPokemon').evaluate(el=>{el.value='dragapult';el.dispatchEvent(new Event('change',{bubbles:true}));});
  for(const [locale,expected] of [['ja',['ドラゴン','ゴースト']],['en',['Dragon','Ghost']],['ja',['ドラゴン','ゴースト']]]){
   await page.locator('#chloha-locale').selectOption(locale);
   const actual=await page.locator('#attTypes .type-pill').allTextContents();
   assert.deepEqual(actual,expected,'attacker types for '+locale);
  }
  console.log('PASS Pokemon type badge locale toggles');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
