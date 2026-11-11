const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [390,360,1280]){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('file://'+path.resolve(__dirname,'../index.html'),{waitUntil:'load'});
   await page.locator('#attStats .stat-row').first().waitFor({state:'attached',timeout:15000});
   for(const side of ['att','def']){
    const toggle=page.locator('.stat-toggle[aria-controls="'+side+'Stats"]');
    const table=page.locator('#'+side+'Stats');
    assert.equal(await toggle.count(),1,side+' toggle');
    assert.equal(await toggle.getAttribute('aria-expanded'),width<=700?'false':'true');
    assert.equal(await table.isHidden(),width<=700);
    await toggle.click();
    assert.equal(await table.isHidden(),width>700);
    await toggle.click();
    assert.equal(await table.isHidden(),width<=700);
   }
   const result=page.locator('#resultCard');
   assert.equal(await result.count(),1);
   assert.equal(await page.locator('#swapSides').count(),1);
   assert.equal(await page.locator('#attPokemonHeader').count(),1);
   assert.equal(await page.locator('#defPokemonHeader').count(),1);
   assert.equal(await page.locator('.version').innerText().then(x=>x.includes('v0.164')),true);
   assert.equal(errors.length,0,'uncaught page errors: '+errors.join(' | '));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   assert.equal(overflow,false,'horizontal overflow at '+width);
   await page.screenshot({path:path.resolve(__dirname,'../smoke-'+width+'.png'),fullPage:true});
   console.log('PASS viewport',width);
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
