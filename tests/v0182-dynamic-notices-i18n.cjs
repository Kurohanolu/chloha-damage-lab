const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const cases=[
 ['天候・フィールド・壁を「なし」に戻しました。対戦形式・その他の設定は維持します。','Weather, terrain and screens were reset to None. Battle format and other settings were preserved.'],
 ['この実数値は現在の性格・ポイント0〜32では設定できません。「入力モード」で自動反映をオフにすると手入力できます。','This stat value cannot be reached with the current nature and 0–32 points. Disable auto-fill in Input mode to enter it manually.'],
 ['攻守を入れ替えました。技・天候・フィールド・壁は維持します。移動先で未対応の特性・持ち物は計算を停止します。','Attacker and defender swapped. Move, weather, terrain and screens were preserved. Calculation stops if an unsupported ability or item is selected.']
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').selectOption('ja');
  await page.evaluate(list=>{
   const host=document.querySelector('#app'),fixture=document.createElement('div');
   fixture.id='dynamic-notice-fixture';
   for(const [ja] of list){const p=document.createElement('p');p.textContent=ja;fixture.append(p);}
   host.append(fixture);
  },cases);
  await page.locator('#chloha-locale').selectOption('en');
  const en=await page.locator('#dynamic-notice-fixture p').allTextContents();
  assert.deepEqual(en,cases.map(x=>x[1]),'all dynamic notices translated');
  await page.locator('#chloha-locale').selectOption('ja');
  const ja=await page.locator('#dynamic-notice-fixture p').allTextContents();
  assert.deepEqual(ja,cases.map(x=>x[0]),'Japanese notices restored');
  console.log('PASS dynamic reset, stat and swap notices JA EN JA');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
