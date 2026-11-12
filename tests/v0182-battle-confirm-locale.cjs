const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').selectOption('ja');
  await page.locator('#battleObservedDamage').fill('0');
  await page.locator('#battleCommit').evaluate(el=>el.click());
  assert.equal(await page.locator('#battleHistory li').count(),1,'one turn is committed');
  const jaHistory=(await page.locator('#battleHistory').textContent()).trim();
  const jaStatus=(await page.locator('#battleStatus').textContent()).trim();
  assert.match(jaHistory,/1手目：/,'Japanese turn');
  assert.match(jaStatus,/を確定。相手HP/,'Japanese confirmation');
  await page.locator('#chloha-locale').selectOption('en');
  const enHistory=(await page.locator('#battleHistory').textContent()).trim();
  const enStatus=(await page.locator('#battleStatus').textContent()).trim();
  assert.match(enHistory,/Turn 1:/,'English turn');
  assert.match(enStatus,/confirmed\. Target HP/,'English confirmation');
  assert.doesNotMatch(enHistory+enStatus,/[ぁ-んァ-ヶ一-龯]/,'no Japanese in English history and confirmation');
  await page.locator('#chloha-locale').selectOption('ja');
  assert.equal((await page.locator('#battleHistory').textContent()).trim(),jaHistory,'Japanese history restored');
  assert.equal((await page.locator('#battleStatus').textContent()).trim(),jaStatus,'Japanese status restored');
  console.log('PASS committed turn history and status JA EN JA');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
