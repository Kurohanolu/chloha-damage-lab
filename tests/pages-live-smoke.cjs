/* Browser smoke test against the actual GitHub Pages URL, not a local file. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const url=process.env.PAGES_URL||'https://kurohanolu.github.io/chloha-damage-lab/';
const source=fs.readFileSync('index.html','utf8');
const expected=(source.match(/<title>([^<]+)<\/title>/)||[])[1];
if(!expected)throw Error('Cannot determine expected title from checked-out index.html');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let actual='',lastError='';
  for(let attempt=1;attempt<=12;attempt++){
   try{
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
    if(!response?.ok())throw Error('HTTP '+response?.status());
    actual=await page.title();
    if(actual===expected)break;
    lastError='Published title '+JSON.stringify(actual)+' differs from source '+JSON.stringify(expected);
   }catch(e){lastError=e.message;}
   console.log('Pages readiness attempt '+attempt+'/12: '+lastError);
   if(attempt<12)await sleep(15000);
  }
  assert.equal(actual,expected,'GitHub Pages must serve the exact title from the current main checkout (not a stale release)');
  await page.locator('#app').waitFor({timeout:15000});
  const locale=page.locator('#chloha-locale');
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
