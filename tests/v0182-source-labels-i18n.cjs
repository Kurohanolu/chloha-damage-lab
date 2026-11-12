const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  for(const [locale,note,roster] of [
   ['ja','習得可否は未検証。計算は対応技のみ。','収録データは継続照合中です。'],
   ['en','Learnsets are unverified. Only supported moves can be calculated.','Roster data verification is ongoing.'],
   ['ja','習得可否は未検証。計算は対応技のみ。','収録データは継続照合中です。']
  ]){
   await page.locator('#chloha-locale').selectOption(locale);
   const credits=await page.locator('.move-data-note').first().textContent();
   assert.equal(credits.trim(),note,'move note '+locale);
   const rosterText=await page.locator('#auditSummary').locator('..').textContent();
   assert(rosterText.includes(roster),'roster verification '+locale+': '+rosterText);
   assert.doesNotMatch(credits,/GameWith|ゲームウィズ|gamewith\.jp/,'no source branding in move picker');
  }
  console.log('PASS neutral source labels JA EN JA');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
