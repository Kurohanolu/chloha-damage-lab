const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').waitFor();
  for(const [locale,invalid,reset] of [
   ['en','No valid damage calculation is available.','History cleared. Current HP and terrain were preserved.'],
   ['ja','有効なダメージ計算結果がありません。','履歴を消去しました。現在のHP・フィールドは維持しています。'],
   ['en','No valid damage calculation is available.','History cleared. Current HP and terrain were preserved.']
  ]){
   await page.locator('#chloha-locale').selectOption(locale);
   await page.locator('#battleCommit').evaluate(el=>el.click());
   assert.equal((await page.locator('#battleStatus').textContent()).trim(),invalid,'invalid calculation '+locale);
   await page.locator('#battleReset').evaluate(el=>el.click());
   assert.equal((await page.locator('#battleStatus').textContent()).trim(),reset,'history reset '+locale);
  }
  console.log('PASS battle dynamic errors EN JA EN');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
