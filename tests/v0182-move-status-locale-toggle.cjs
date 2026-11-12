const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').waitFor();
  for(const lang of ['en','ja','en','ja']){
   await page.locator('#chloha-locale').selectOption(lang);
   const status=(await page.locator('#moveSelected').innerText()).trim();
   if(lang==='ja'){
    assert.match(status,/^選択中：/,'Japanese move status: '+status);
    assert.doesNotMatch(status,/Selected:|Ground/,'English leakage in Japanese: '+status);
   }else{
    assert.match(status,/^Selected: /,'English move status: '+status);
    assert.doesNotMatch(status,/選択中：|じしん/,'Japanese leakage in English: '+status);
   }
  }
  console.log('PASS move status JA/EN switch without reload');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
