// v0.176 candidate: conditional power control placement and interaction regression.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
 const browser = await chromium.launch({headless:true});
 try {
  for (const width of [360,390,1280]) {
   const page = await browser.newPage({viewport:{width,height:844}});
   await page.goto('file://'+path.resolve(__dirname,'../index.html'));
   const search=page.locator('#moveSearch'), list=page.locator('#moveSuggestions');
   const panel=page.locator('#conditionalPowerPanel'), checkbox=page.locator('#conditionalPower');
   assert.equal(await panel.count(),1,'single conditional panel');
   assert.equal(await checkbox.count(),1,'single conditional checkbox');
   assert.equal(await panel.evaluate(el=>el.closest('.move-picker')!==null),true,'panel belongs directly to move picker');
   assert.equal(await panel.evaluate(el=>el.previousElementSibling?.classList.contains('move-list-fallback')===true),true,'panel follows move select');
   assert.equal(await panel.isHidden(),true,'ordinary move hides conditional control');
   await search.fill('ベノムショック');
   await list.getByRole('option',{name:'ベノムショック',exact:true}).click();
   assert.equal(await panel.isVisible(),true,'conditional move reveals control');
   assert.equal(await checkbox.isChecked(),false,'default off for Venoshock');
   const base=await page.evaluate(()=>window.ChlohaLastCalculation?.r?.rolls);
   assert.ok(base?.length===16,'baseline damage rolls');
   await checkbox.check();
   assert.equal(await checkbox.isChecked(),true,'checkbox can be toggled');
   const boosted=await page.evaluate(()=>window.ChlohaLastCalculation?.r?.rolls);
   assert.ok(boosted?.length===16,'boosted damage rolls');
   assert.ok(Math.max(...boosted)>Math.max(...base),'conditional damage increases');
   await search.fill('マッハパンチ');
   await list.getByRole('option',{name:'マッハパンチ',exact:true}).click();
   assert.equal(await panel.isHidden(),true,'ordinary move hides control again');
   assert.equal(await checkbox.isChecked(),false,'move switch resets conditional toggle');
   await search.fill('ベノムショック');
   await list.getByRole('option',{name:'ベノムショック',exact:true}).click();
   assert.equal(await checkbox.isChecked(),false,'returning to conditional move starts unchecked');
   console.log('PASS conditional-power UI',width);
   await page.close();
  }
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
