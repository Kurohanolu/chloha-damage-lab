const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').selectOption('ja');
  await page.evaluate(()=>{
   const select=document.createElement('select');
   select.id='ability-translation-fixture';
   for(const [value,label] of [
    ['sheerForce','ちからずく（一部技のみ対応）'],
    ['technician','テクニシャン（対応）'],
    ['purePower','ヨガパワー（対応）'],
    ['hustle','はりきり（一部技のみ対応）'],
    ['solarPower','サンパワー（対応）'],
    ['unknown','未知の特性（効果未対応）']
   ]){const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}
   document.getElementById('app').append(select);
  });
  const read=()=>page.locator('#ability-translation-fixture option').allTextContents();
  const ja=['ちからずく（一部技のみ対応）','テクニシャン（対応）','ヨガパワー（対応）','はりきり（一部技のみ対応）','サンパワー（対応）','未知の特性（効果未対応）'];
  assert.deepEqual(await read(),ja);
  await page.locator('#chloha-locale').selectOption('en');
  const en=await read();
  assert.match(en[0],/Sheer Force \(partially supported\)$/);
  assert.match(en[1],/Technician \(supported\)$/);
  assert.match(en[2],/Pure Power \(supported\)$/);
  assert.match(en[3],/Hustle \(partially supported\)$/);
  assert.match(en[4],/Solar Power \(supported\)$/);
  assert.match(en[5],/\(unsupported\)$/);
  await page.locator('#chloha-locale').selectOption('ja');
  assert.deepEqual(await read(),ja);
  console.log('PASS ability support status labels JA EN JA');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
