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
const expectedHash=crypto.createHash('sha256').update(source).digest('hex');
if(!expected)throw Error('Cannot determine expected title from checked-out index.html');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let actual='',actualHash='',lastError='';
  for(let attempt=1;attempt<=12;attempt++){
   try{
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
    if(!response?.ok())throw Error('HTTP '+response?.status());
    actual=await page.title();
    const liveResponse=await page.request.get(url,{timeout:30000});
    if(!liveResponse.ok())throw Error('HTML fetch HTTP '+liveResponse.status());
    const liveHtml=await liveResponse.text();
    actualHash=crypto.createHash('sha256').update(liveHtml).digest('hex');
    if(actual===expected && actualHash===expectedHash)break;
    lastError='Published content has not matched checked-out main yet (title '+JSON.stringify(actual)+', SHA256 '+actualHash+')';
   }catch(e){lastError=e.message;}
   console.log('Pages readiness attempt '+attempt+'/12: '+lastError);
   if(attempt<12)await sleep(15000);
  }
  assert.equal(actual,expected,'GitHub Pages title must match the current main checkout');
  assert.equal(actualHash,expectedHash,'GitHub Pages HTML must match current main, not a stale release');
  await page.locator('#app').waitFor({timeout:15000});
  const locale=page.locator('#chloha-locale');
  const expectsLocale=source.includes('id="chloha-locale"') || source.includes('src="i18n.js"');
  if(expectsLocale)assert.equal(await locale.count(),1,'Published site must contain the language selector');
  if(await locale.count()){
   await locale.selectOption('en');
   assert.equal(await page.locator('html').getAttribute('lang'),'en');
   assert.equal(await page.locator('#copy').textContent(),'Copy');
   await page.screenshot({path:'pages-live-en.png',fullPage:true});
   await locale.selectOption('ja');
   assert.equal(await page.locator('html').getAttribute('lang'),'ja');
   await locale.selectOption('en');
  }else{
   await page.screenshot({path:'pages-live-ja.png',fullPage:true});
  }
  assert.deepEqual(errors,[],'GitHub Pages runtime must have no uncaught JavaScript errors');
  console.log('PASS GitHub Pages public URL '+url+'; title '+actual+'; locale '+(await locale.count()?'ja/en':'not present'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
