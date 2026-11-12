const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const ids=['ragingBullForm','auraWheelForm'];
  const snapshot=()=>page.evaluate(ids=>ids.map(id=>[id,...Array.from(document.getElementById(id).options).map(o=>[o.value,o.textContent])]),ids);
  await page.locator('#chloha-locale').selectOption('ja');
  const ja=await snapshot();
  assert.deepEqual(ja[0].slice(1).map(x=>x[1]),['コンバット種（かくとう）','ブレイズ種（ほのお）','ウォーター種（みず）']);
  assert.deepEqual(ja[1].slice(1).map(x=>x[1]),['まんぷくもよう（でんき）','はらぺこもよう（あく）']);
  await page.locator('#chloha-locale').selectOption('en');
  const en=await snapshot();
  assert.deepEqual(en[0].slice(1).map(x=>x[1]),['Combat Breed (Fighting)','Blaze Breed (Fire)','Aqua Breed (Water)']);
  assert.deepEqual(en[1].slice(1).map(x=>x[1]),['Full Belly Mode (Electric)','Hangry Mode (Dark)']);
  await page.locator('#chloha-locale').selectOption('ja');
  assert.deepEqual(await snapshot(),ja,'form options restore JA and keep stable values');
  console.log('PASS Raging Bull and Aura Wheel native form options JA EN JA');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
