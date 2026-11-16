'use strict';
// All requests stay local; no real CAPTCHA or production report is sent.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
(async()=>{
 const {startLocalApp}=await import('../services/feedback/test/harness.mjs');
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
 try{
  const cases=[undefined,[],locales.slice(0,9),[...locales,'en'],[...locales,'xx'],locales.map(x=>x==='es-LA'?'es-419':x),locales.map(x=>x==='es-LA'?null:x),locales];
  for(const supportedLocales of cases){
   const app=await startLocalApp(),context=await browser.newContext();let posts=0,configReturned=false;
   try{
    await context.addInitScript(()=>localStorage.setItem('chloha.damageLab.locale','es-LA'));
    await context.route('**/*',async route=>{
     const u=new URL(route.request().url());
     if(u.hostname==='challenges.cloudflare.com')return route.fulfill({contentType:'text/javascript',body:"window.turnstile={render(node,options){window.testChallengeCallback=options.callback;options.callback('valid-local-token');return 'test'},remove(){}}"});
     if(u.origin!==app.origin)return route.abort();
     if(u.pathname==='/v1/config'){configReturned=true;return route.fulfill({json:{enabled:true,siteKey:'local-test-site-key',retentionDays:90,mode:'local-demo',supportedLocales}});}
     if(u.pathname==='/v1/reports'&&route.request().method()==='POST')posts++;
     return route.continue();
    });
    const page=await context.newPage();await page.goto(app.origin);await page.click('#feedbackButton');
    await page.waitForFunction(()=>window.turnstile&&document.getElementById('feedbackMode').hidden===false);
    assert.equal(configReturned,true);
    assert.equal(await page.locator('#feedbackSubmit').isDisabled(),supportedLocales!==locales);

    for(const locale of locales.slice(0,9)){await page.selectOption('#chloha-locale',locale);assert.equal(await page.locator('#feedbackSubmit').isDisabled(),false);}
    await page.selectOption('#chloha-locale','en');
    await page.selectOption('#feedbackCategory','bug');await page.fill('#feedbackDescription','Synthetic capability regression, no personal data.');
    await page.selectOption('#chloha-locale','es-LA');assert.equal(await page.locator('#feedbackSubmit').isDisabled(),supportedLocales!==locales);
    await page.evaluate(()=>{window.testChallengeCallback('valid-local-token');document.getElementById('feedbackForm').requestSubmit();});
    if(supportedLocales===locales){
     await page.waitForFunction(()=>document.getElementById('feedbackStatus').textContent.includes(ChlohaFeedbackLocales.text('es-LA','localSuccess')));
     assert.equal(posts,1);assert.equal(app.db.sqlite.prepare('SELECT locale FROM reports').get().locale,'es-LA');
    }else{
     // A usable draft and late challenge callback cannot bypass the locale guard.
     await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(posts,0);
     assert.equal(await page.locator('#feedbackErrors').isHidden(),true);
     assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);
    }
   }finally{await context.close();await app.close();}
  }
  // Absent config must not crash initialization or leave enabled controls.
  {
   const app=await startLocalApp(),context=await browser.newContext();const errors=[];let requests=0;
   try{
    await context.addInitScript(()=>localStorage.setItem('chloha.damageLab.locale','es-LA'));
    await context.route('**/*',async route=>{const u=new URL(route.request().url());
     if(u.origin!==app.origin)return route.abort();
     if(u.pathname==='/feedback-config-v0185.js')return route.fulfill({contentType:'text/javascript',body:'/* intentionally absent */'});
     if(u.pathname.startsWith('/v1/'))requests++;
     return route.continue();
    });
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(app.origin);await page.click('#feedbackButton');
    assert.equal(await page.locator('#feedbackFields').evaluate(node=>node.disabled),true);assert.equal(await page.locator('#feedbackSubmit').isDisabled(),true);
    await page.selectOption('#chloha-locale','en');assert.equal(await page.locator('#feedbackSubmit').isDisabled(),true);
    await page.selectOption('#chloha-locale','es-LA');assert.equal(await page.locator('#feedbackFields').evaluate(node=>node.disabled),true);
    assert.equal(await page.locator('#feedbackCategory').isDisabled(),true);
    assert.deepEqual(errors,[]);assert.equal(requests,0);
   }finally{await context.close();await app.close();}
  }
  // Hold the script until config was parsed, then fail it after a locale switch.
  {
   const app=await startLocalApp(),context=await browser.newContext();let releaseScript,scriptRequested;
   const scriptSeen=new Promise(resolve=>scriptRequested=resolve),scriptRelease=new Promise(resolve=>releaseScript=resolve);
   try{
    await context.addInitScript(()=>localStorage.setItem('chloha.damageLab.locale','es-LA'));
    await context.route('**/*',async route=>{const u=new URL(route.request().url());
     if(u.hostname==='challenges.cloudflare.com'){scriptRequested();await scriptRelease;return route.abort();}
     if(u.origin!==app.origin)return route.abort();return route.continue();
    });
    const page=await context.newPage();await page.goto(app.origin);await page.click('#feedbackButton');await Promise.race([scriptSeen,new Promise((_,reject)=>setTimeout(()=>reject(Error('Widget was never requested after config')),5000))]);
    // The script request proves config parsing and the capability assignment occurred.
    await page.selectOption('#chloha-locale','en');
    assert.equal(await page.locator('#feedbackStatus').textContent(),await page.evaluate(()=>ChlohaFeedbackLocales.text('en','preparing')));
    releaseScript();
    await page.waitForFunction(()=>document.getElementById('feedbackStatus').textContent===ChlohaFeedbackLocales.text('en','unavailable'));
    await page.click('#feedbackClose'); // Prevent a new connection attempt during this assertion.
    await page.selectOption('#chloha-locale','es-LA');
    assert.equal(await page.locator('#feedbackFields').evaluate(node=>node.disabled),true,'Failed widget clears stale locale capability');
    assert.equal(await page.locator('#feedbackSubmit').isDisabled(),true);
    assert.equal(app.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);
   }finally{releaseScript();await context.close();await app.close();}
  }
  console.log('PASS exact ten-locale capability: 8 response shapes, all old nine locales retained, absent config and synchronized late widget failure closed, only valid capability accepts local report');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
