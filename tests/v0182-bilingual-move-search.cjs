// Regression: search all localized move names, not only the short alias list.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').selectOption('en');
  await page.locator('#moveSearch').fill('Dragon');
  const results=page.locator('#moveSuggestions [role="option"]');
  const texts=await results.allTextContents();
  assert.ok(texts.some(t=>t.includes('Dragon Darts')),'Dragon search must find Dragon Darts: '+JSON.stringify(texts));
  assert.ok(texts.some(t=>t.includes('Dragon Claw')),'Dragon search must find Dragon Claw');
  await page.locator('#moveSearch').fill('ドラゴンアロー');
  assert.ok((await results.allTextContents()).some(t=>t.includes('Dragon Darts')),'Japanese query must work in English locale');
  await page.locator('#chloha-locale').selectOption('ja');
  await page.locator('#moveSearch').fill('Dragon');
  assert.ok((await results.allTextContents()).some(t=>t.includes('ドラゴンアロー')),'English query must work in Japanese locale');
  console.log('PASS bilingual full-catalog move search');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
