'use strict';
// Local browser + unchanged Worker/SQLite. Turnstile and upstream sprites are
// intercepted; no production service or real report/Issue is contacted.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {launchBrowser,ready}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const prefix='[Singularity release: v1.0.0]\n\n',limit=5000-prefix.length;
const widget=`(()=>{let n=0;const widgets=new Map();window.turnstile={render(node,options){const id='stable-'+(++n);widgets.set(id,options);queueMicrotask(()=>options.callback('valid-'+crypto.randomUUID()));return id;},reset(id){const options=widgets.get(id);if(options)queueMicrotask(()=>options.callback('valid-'+crypto.randomUUID()));},remove(id){widgets.delete(id);}};})();`;
const numeric=page=>page.evaluate(()=>JSON.stringify({a:window.ChlohaLastCalculation.a,r:window.ChlohaLastCalculation.r}));
const evidence={candidateCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),mode:'local Chromium with unchanged Worker/SQLite and mocked Turnstile',realDevice:false,productionRequests:0,productionMutations:0,localReportPosts:0,storedReports:0,cases:[],passed:false};
(async()=>{
 const {startLocalApp}=await import('../services/feedback/test/harness.mjs');
 let browser;
 try{
  browser=await launchBrowser();
  for(const locale of locales){
   const api=await startLocalApp();
   try{
    for(const attach of [false,true]){
     const context=await browser.newContext({viewport:{width:locale==='en'?1440:390,height:900},reducedMotion:'reduce'});
     await context.addInitScript(value=>localStorage.setItem('chloha.damageLab.locale',value),locale);
     await context.route('**/*',route=>{
      const url=new URL(route.request().url());
      if(url.hostname==='challenges.cloudflare.com'&&url.pathname.endsWith('/api.js'))return route.fulfill({contentType:'text/javascript',body:widget});
      if(url.origin!==api.origin)return route.abort();
      return route.continue();
     });
     const page=await context.newPage(),errors=[],posts=[];page.on('pageerror',error=>errors.push(error.message));
     try{
      await page.goto(api.origin+'/');await ready(page);
      const before=await numeric(page);
      await page.locator('#feedbackButton').click();
      await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled);
      assert.equal(await page.title(),'Singularity v1.0.0');
      const releaseLabel=await page.locator('#feedbackRelease').innerText(),headerHelp=await page.locator('#feedbackReleaseHelp').innerText();
      assert.ok(releaseLabel.includes('v1.0.0'));
      assert.equal(releaseLabel,await page.evaluate(lang=>window.ChlohaFeedbackRelease.text(lang,'label')+': v1.0.0',locale));
      assert.equal(headerHelp,await page.evaluate(lang=>window.ChlohaFeedbackRelease.text(lang,'header'),locale));
      assert.equal(await page.locator('#feedbackReleaseHeader').innerText(),prefix.trim());
      assert.equal(await page.locator('#feedbackDescription').getAttribute('maxlength'),String(limit));
      const help=await page.locator('#feedbackDescriptionHelp').innerText();assert.ok(help.includes(String(limit)));assert.ok(!help.includes('5000'));
      await page.selectOption('#feedbackCategory','calculation');
      // Bypass the native maxlength only inside this test: the handler must
      // independently reject overflow and display the truthful local budget.
      await page.locator('#feedbackDescription').evaluate((node,n)=>{node.value='x'.repeat(n);node.dispatchEvent(new Event('input',{bubbles:true}));},limit+1);
      await page.locator('#feedbackForm').evaluate(node=>node.requestSubmit());
      assert.equal(await page.locator('#feedbackDescription').getAttribute('aria-invalid'),'true');
      assert.ok((await page.locator('#feedbackErrors').innerText()).includes(String(limit)));
      assert.equal(api.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,attach?1:0);
      const userText=attach?'PRIVATE_BROWSER_FIXTURE_'+locale:'x'.repeat(limit);
      await page.fill('#feedbackDescription',userText);await page.fill('#feedbackEmail','');
      if(attach){
       await page.check('#feedbackAttach');
       const snapshot=JSON.parse(await page.locator('#feedbackPreview').innerText());assert.equal(snapshot.appVersion,'v1.0');
       assert.ok(!JSON.stringify(snapshot).includes(userText),'private report text is excluded from snapshot');
       const compatibility=await page.locator('#feedbackVersionCompatibility').innerText();assert.ok(compatibility.includes('v1.0.0'));assert.ok(compatibility.includes('v1.0'));
       await page.check('#feedbackConfirm');
      }
      await page.waitForTimeout(160); // Twice the actual 80ms calculator save debounce.
      const storedBrowser=await page.evaluate(()=>JSON.stringify({...localStorage}));
      if(attach)assert.ok(!storedBrowser.includes(userText),'report draft is never automatically saved');
      assert.ok(!storedBrowser.includes(prefix.trim()),'automatic report metadata is not calculator state');
      assert.equal(await numeric(page),before);
      if(locale==='ja'&&!attach){
       await page.evaluate(()=>{document.title='Singularity v1.0.1';document.getElementById('feedbackForm').requestSubmit();});
       assert.equal(api.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0,'unknown patch cannot submit by truncating its title');
       assert.ok(await page.locator('#feedbackErrors').isVisible());
       await page.evaluate(()=>{document.title='Singularity v1.0.0';document.getElementById('feedbackDescription').dispatchEvent(new Event('input',{bubbles:true}));});
      }
      let responseWasLost=false;
      await page.route('**/v1/reports',async route=>{
       assert.equal(new URL(route.request().url()).origin,api.origin);
       assert.equal(route.request().method(),'POST');
       posts.push(route.request().postDataJSON());evidence.localReportPosts++;
       if(!responseWasLost){
        responseWasLost=true;const response=await route.fetch();
        assert.equal(response.status(),201,'first local request is stored before its response is lost');
        return route.fulfill({status:503,contentType:'application/json',body:'{"error":"unavailable"}'});
       }
       return route.continue();
      });
      await page.click('#feedbackSubmit');
      await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled&&!document.getElementById('feedbackErrors').hidden);
      assert.equal(posts.length,1);assert.equal(await page.inputValue('#feedbackDescription'),userText);
      assert.equal(posts[0].appVersion,'v1.0');assert.equal(posts[0].description,prefix+userText);
      assert.equal(!!posts[0].snapshot,attach);
      const other=locale==='en'?'ja':'en';await page.selectOption('#chloha-locale',other);await page.selectOption('#chloha-locale',locale);
      assert.equal(await page.locator('#feedbackReleaseHeader').innerText(),prefix.trim());
      assert.equal(await numeric(page),before);
      if(attach)assert.equal(await page.isChecked('#feedbackConfirm'),true,'language-only transition preserves consent');
      await page.click('#feedbackSubmit');
      await page.waitForFunction(()=>document.getElementById('feedbackStatus').textContent.includes(window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),'localSuccess')));
      assert.equal(posts.length,2);const withoutToken=body=>{const copy={...body};delete copy.turnstileToken;return copy;};
      assert.deepEqual(withoutToken(posts[1]),withoutToken(posts[0]),'retry reuses every original field, including immutable full-version metadata');
      assert.notEqual(posts[1].turnstileToken,posts[0].turnstileToken,'one-use challenge token is renewed');
      const rows=api.db.sqlite.prepare('SELECT app_version,description,snapshot_json FROM reports ORDER BY created_at,id').all();assert.equal(rows.length,attach?2:1,'retry creates no duplicate report');
      const row=rows.find(row=>row.description===prefix+userText);assert.ok(row);assert.equal(row.app_version,'v1.0');
      assert.equal(row.snapshot_json!==null,attach);if(attach)assert.equal(JSON.parse(row.snapshot_json).appVersion,'v1.0');
      evidence.storedReports++;assert.equal(api.calls.github.length,0);assert.equal(api.calls.issues.length,0);
      assert.deepEqual(errors,[]);
      evidence.cases.push({locale,attach,fullVersion:'v1.0.0',wireVersion:'v1.0',releaseLabel,headerHelp,descriptionLimit:limit,localPosts:posts.length,retryBodyEqual:true,storedFullVersion:true,passed:true});
     }finally{await context.close();}
    }
   }finally{await api.close();}
  }
  assert.equal(evidence.cases.length,18);assert.equal(evidence.storedReports,18);assert.equal(evidence.localReportPosts,36);evidence.passed=true;
  console.log('PASS v1.0.0 feedback browser: nine locales × attachment on/off, truthful full-version header/budget, strict unknown-patch rejection, 18 local stored reports and 36 posts with lost-response/idempotent retry; zero production requests.');
 }catch(error){evidence.error=error.message;throw error;}
 finally{fs.mkdirSync('reports/v100',{recursive:true});fs.writeFileSync('reports/v100/feedback-browser.json',JSON.stringify(evidence,null,2)+'\n');if(browser)await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
