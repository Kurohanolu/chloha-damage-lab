// Audit every populated select, including attacker/defender abilities and items.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').waitFor();
  const snapshot=()=>page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('#app select')].map(el=>[el.id,[...el.options].map(o=>({value:o.value,text:o.textContent,label:o.label}))])));
  const ja=await snapshot();
  await page.locator('#chloha-locale').selectOption('en');
  const en=await snapshot();
  await page.locator('#chloha-locale').selectOption('ja');
  const back=await snapshot();
  await page.locator('#chloha-locale').selectOption('en');
  const enAgain=await snapshot();
  const ids=Object.keys(ja);
  assert.ok(ids.includes('attAbility')&&ids.includes('defAbility')&&ids.includes('attItem')&&ids.includes('defItem'));
  for(const id of ids){
   assert.deepEqual(back[id],ja[id],'JA->EN->JA native select restoration: '+id);
   assert.deepEqual(enAgain[id],en[id],'EN->JA->EN native select restoration: '+id);
   assert.deepEqual(en[id].map(o=>o.value),ja[id].map(o=>o.value),'stable option values: '+id);
  }
  console.log('PASS '+ids.length+' native selects restored after JA EN JA EN; ability/item values unchanged');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
