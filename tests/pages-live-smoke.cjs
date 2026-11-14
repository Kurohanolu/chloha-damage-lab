/* Browser smoke test against the actual GitHub Pages URL, not a local file. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const url=process.env.PAGES_URL||'https://kurohanolu.github.io/chloha-damage-lab/';
// On PRs, compare the existing public site to the base of the PR merge commit.
// After merge, compare the live site to the newly published main checkout.
const source=process.env.PAGES_BASELINE_REF
 ? execFileSync('git',['show',process.env.PAGES_BASELINE_REF+':index.html'],{encoding:'utf8'})
 : fs.readFileSync('index.html','utf8');
const expected=(source.match(/<title>([^<]+)<\/title>/)||[])[1];
const runtimeAssets=[...source.matchAll(/<script\b[^>]*\bsrc=["'](?:\.\/)?([^"']+)["'][^>]*>/g)].map(match=>({src:match[1],file:match[1].split(/[?#]/)[0]}));
const readAsset=file=>process.env.PAGES_BASELINE_REF?execFileSync('git',['show',process.env.PAGES_BASELINE_REF+':'+file]):fs.readFileSync(file);
const assetHashes=new Map(runtimeAssets.map(({src,file})=>[src,crypto.createHash('sha256').update(readAsset(file)).digest('hex')]));
const expectedHash=crypto.createHash('sha256').update(source).digest('hex');
if(!expected)throw Error('Cannot determine expected title from checked-out index.html');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let actual='',actualHash='',lastError='',assetsReady=false;
  for(let attempt=1;attempt<=24;attempt++){
   try{
    errors.length=0;
    const checkURL=new URL(url);checkURL.searchParams.set('release-check',expectedHash.slice(0,12)+'-'+attempt);
    const response=await page.goto(checkURL.href,{waitUntil:'domcontentloaded',timeout:30000});
    if(!response?.ok())throw Error('HTTP '+response?.status());
    actual=await page.title();
    const liveResponse=await page.request.get(checkURL.href,{timeout:30000});
    if(!liveResponse.ok())throw Error('HTML fetch HTTP '+liveResponse.status());
    const liveHtml=await liveResponse.text();
    actualHash=crypto.createHash('sha256').update(liveHtml).digest('hex');
    if(actual===expected && actualHash===expectedHash){
     for(const [file,hash] of assetHashes){
      const assetURL=new URL(file,url);assetURL.searchParams.set('release-check',hash.slice(0,12));
      const response=await page.request.get(assetURL.href,{timeout:30000});
      assert.ok(response.ok(),'Published asset HTTP '+response.status()+': '+file);
      assert.equal(crypto.createHash('sha256').update(await response.body()).digest('hex'),hash,'Published asset must match the release commit: '+file);
     }
     assetsReady=true;break;
    }
    lastError='Published content has not matched checked-out main yet (title '+JSON.stringify(actual)+', SHA256 '+actualHash+')';
   }catch(e){lastError=e.message;}
   console.log('Pages readiness attempt '+attempt+'/24: '+lastError);
   if(attempt<24)await sleep(15000);
  }
  assert.equal(actual,expected,'GitHub Pages title must match the current main checkout');
  assert.equal(actualHash,expectedHash,'GitHub Pages HTML must match current main, not a stale release');
  assert.ok(assetsReady,'GitHub Pages runtime assets must match the release: '+lastError);
  await page.locator('#app').waitFor({timeout:15000});
  const baseline=JSON.parse(fs.readFileSync('tests/fixtures/v0184-public-baseline.json','utf8'));
  const probe=baseline.cases.find(item=>item.name==='neutral');
  const rolls=await page.evaluate(input=>window.ChlohaDamageEngine.calculate(input).rolls,probe.input);
  assert.deepEqual(rolls,probe.expected.output.rolls,'Published core must preserve the public neutral vector');
  if(source.includes('damage-calculator-v0184.js')){
   for(const name of ['Shell Side Arm tie','special ネズミざん/dice']){
    const fixture=baseline.cases.find(item=>item.name===name);
    const output=await page.evaluate(({input,options})=>JSON.parse(JSON.stringify(window.ChlohaDamageCalculator.calculate(input,options),(_,item)=>Object.prototype.toString.call(item)==='[object Map]'?{mapEntries:[...item]}:item)),fixture);
    assert.deepEqual(output,fixture.expected.output,'Published calculator: '+name);
   }
  }
  const locale=page.locator('#chloha-locale');
  const expectsLocale=source.includes('id="chloha-locale"') || runtimeAssets.some(asset=>asset.file==='i18n.js');
  if(expectsLocale)assert.equal(await locale.count(),1,'Published site must contain the language selector');
  if(await locale.count()){
   await locale.selectOption('en');
   assert.equal(await page.locator('html').getAttribute('lang'),'en');
   assert.equal(await page.locator('#copy').textContent(),'Copy');
   if(source.includes('damage-calculator-v0184.js'))assert.match(await page.locator('#versionProvenance').textContent(),/calculation core “v0\.184”/,'published version provenance must use the actual API version');
   if(source.includes('feedback-ui-v0185.js')){
    await page.locator('#feedbackButton').click();
    await page.locator('#feedbackPanel').waitFor({state:'visible'});
    await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled,undefined,{timeout:20000});
    assert.equal(await page.locator('#feedbackAttach').isChecked(),false,'Public calculation attachment is opt-in');
    assert.equal(await page.locator('#feedbackMode').isVisible(),false,'Published form must not use local-demo delivery');
   }
   await page.screenshot({path:'pages-live-en.png',fullPage:true});
   for(const lang of ['ja','fr','de','es','it','ko','zh-Hans','zh-Hant','ja']){
    await locale.selectOption(lang);
    await page.waitForFunction(value=>document.documentElement.lang===value,lang);
    assert.equal(await page.locator('html').getAttribute('lang'),lang,'published language '+lang);
    if(source.includes('feedback-ui-v0185.js')){
     const labels=await page.evaluate(()=>[...document.querySelectorAll('#feedbackCategory option')].map(option=>({text:option.textContent,label:option.label,expected:window.ChlohaFeedbackLocales.text(window.ChlohaLocale.get(),option.dataset.fb)})));
     assert.ok(labels.every(item=>item.text===item.expected&&item.label===item.expected),'Published feedback native labels: '+lang);
    }
   }
   await page.screenshot({path:'pages-live-ja.png',fullPage:true});
   await locale.selectOption('en');
  }else{
   await page.screenshot({path:'pages-live-ja.png',fullPage:true});
  }
  assert.deepEqual(errors,[],'GitHub Pages runtime must have no uncaught JavaScript errors');
  console.log('PASS GitHub Pages public URL '+url+'; title '+actual+'; verified assets '+assetHashes.size+'; locale '+(await locale.count()?'nine languages':'not present'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
