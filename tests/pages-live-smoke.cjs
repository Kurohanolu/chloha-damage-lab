/* Browser smoke test against the actual GitHub Pages URL, not a local file. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
// On PRs, compare the existing public site to the base of the PR merge commit.
// After merge, compare the live site to the newly published main checkout.
const source=process.env.PAGES_BASELINE_REF
 ? execFileSync('git',['show',process.env.PAGES_BASELINE_REF+':index.html'],{encoding:'utf8'})
 : fs.readFileSync('index.html','utf8');
const expected=(source.match(/<title>([^<]+)<\/title>/)||[])[1];
const runtimeAssets=[...source.matchAll(/<script\b[^>]*\bsrc=["'](?:\.\/)?([^"']+)["'][^>]*>/g)].map(match=>({src:match[1],file:match[1].split(/[?#]/)[0]}));
const readAsset=file=>process.env.PAGES_BASELINE_REF?execFileSync('git',['show',process.env.PAGES_BASELINE_REF+':'+file]):fs.readFileSync(file);
const release=JSON.parse(readAsset('release.json'));
const url=process.env.PAGES_URL||release.publicUrl;
const presentationAssets=[...source.matchAll(/<(?:link|img)\b[^>]*\b(?:href|src)=["']\.\/([^"']+)["']/g)].map(match=>({src:match[1],file:match[1].split(/[?#]/)[0]}));
for(const file of Object.values(release.branding||{}))presentationAssets.push({src:file+'?v='+release.tag.slice(1),file});
const existsSource=file=>process.env.PAGES_BASELINE_REF
 ? execFileSync('git',['ls-tree','--name-only',process.env.PAGES_BASELINE_REF,'--',file],{encoding:'utf8'}).trim()===file
 : fs.existsSync(file);
const baseline=require('./helpers/public-release-contract.cjs').loadPublicContracts({readFile:readAsset,exists:existsSource});
const assetHashes=new Map([...runtimeAssets,...presentationAssets].map(({src,file})=>[src,crypto.createHash('sha256').update(readAsset(file)).digest('hex')]));
const expectedHash=crypto.createHash('sha256').update(source).digest('hex');
if(!expected)throw Error('Cannot determine expected title from checked-out index.html');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
// Runs only after the selected public baseline is the stable release. All edits
// below are confined to this new browser context's local calculator/storage.
async function stableAcceptance(page){
 const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
 const set=async(id,value)=>page.locator('#'+id).evaluate((node,value)=>{
  if(node.type==='checkbox')node.checked=value;else node.value=String(value);
  node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}));
 },value);
 const ready=()=>page.waitForFunction(()=>!!window.ChlohaLastCalculation&&!!window.ChlohaPersistence&&!!window.ChlohaLocale);
 const snapshot=()=>page.evaluate(()=>({state:ChlohaPersistence.capture(),input:ChlohaLastCalculation.a,rolls:ChlohaLastCalculation.r.rolls}));
 const saved=()=>page.waitForFunction(()=>{
  const raw=localStorage.getItem(ChlohaPersistence.key);
  return raw&&JSON.stringify(JSON.parse(raw).state)===JSON.stringify(ChlohaPersistence.capture());
 });
 // Independent integer oracle for neutral Lv50 Attack150/Defense100. The full
 // sixteen rolls must change when each manual Speed crosses this threshold.
 const rolls=power=>{const base=Math.floor(Math.floor(22*power*150/100)/50)+2;return Array.from({length:16},(_,i)=>Math.floor(base*(85+i)/100));};
 if(await page.locator('#feedbackPanel').isVisible())await page.locator('#feedbackClose').click();
 await ready();await page.locator('#resetCalculation').click();
 const move=await page.evaluate(()=>ChlohaGameData.moves.find(item=>item.name==='エレキボール').id);
 await set('dbMove',move);await set('dbAuto',false);
 for(const [id,value] of Object.entries({attack:150,defense:100,attSpeed:122,defSpeed:81,attType1:'ノーマル',attType2:'なし',defType1:'ノーマル',defType2:'なし',moveType:'でんき',stabMode:'none',attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',weather:'none',terrain:'none',attackStage:0,defenseStage:0,battleFormat:'singles',spread:'single'}))await set(id,value);
 assert.deepEqual((await snapshot()).rolls,rolls(60),'published manual Speed122/81 independent sixteen rolls');
 for(const side of ['att','def'])if(await page.locator('#'+side+'Stats').isHidden())await page.locator('#'+side+'StatsToggle').click();
 await page.locator('#att-speed-actual').fill('200');await page.locator('#att-speed-actual').press('Tab');
 assert.equal(await page.locator('#attSpeed').inputValue(),'200');
 assert.deepEqual((await snapshot()).rolls,rolls(80),'published attacker Speed editor changes effective power');
 await page.locator('#def-speed-actual').fill('240');await page.locator('#def-speed-actual').press('Tab');
 assert.equal(await page.locator('#defSpeed').inputValue(),'240');
 assert.deepEqual((await snapshot()).rolls,rolls(40),'published defender Speed editor changes effective power');
 await set('attMaxHp',250);await set('hp',260);await saved();
 const original=await snapshot(),cases=[];
 for(const locale of locales){
  await page.locator('#chloha-locale').selectOption(locale);
  await page.waitForFunction(value=>document.documentElement.lang===value,locale);
  assert.deepEqual(await snapshot(),original,'public language switch preserves complete state/input/rolls: '+locale);
  await saved();await page.reload({waitUntil:'domcontentloaded'});await ready();
  assert.equal(await page.locator('#chloha-locale').inputValue(),locale,'public selected locale restored: '+locale);
  assert.equal(await page.title(),'Singularity v1.0.0');
  assert.equal((await page.locator('.version').innerText()).trim(),'v1.0.0','public stable version: '+locale);
  assert.ok((await page.locator('#versionProvenance').innerText()).includes('v1.0.0'));
  assert.deepEqual(await snapshot(),original,'public reload preserves complete state/input/sixteen rolls: '+locale);
  for(const [id,value] of Object.entries({'att-speed-actual':'200','def-speed-actual':'240','att-hp-actual':'250','def-hp-actual':'260'}))assert.equal(await page.locator('#'+id).inputValue(),value,'public restored '+id+': '+locale);
  await page.locator('#feedbackButton').click();await page.locator('#feedbackPanel').waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled,undefined,{timeout:20000});
  assert.equal(await page.locator('#feedbackAttach').isChecked(),false,'public attachment remains opt-in: '+locale);
  assert.equal(await page.locator('#feedbackConfirm').isChecked(),false);
  assert.equal(await page.locator('#feedbackDescription').inputValue(),'');
  assert.equal(await page.locator('#feedbackEmail').inputValue(),'');
  assert.equal(await page.locator('#feedbackMode').isVisible(),false,'public feedback remains production: '+locale);
  assert.ok((await page.locator('#feedbackRelease').innerText()).includes('v1.0.0'),'public exact feedback version: '+locale);
  assert.equal((await page.locator('#feedbackReleaseHeader').innerText()).trim(),'[Singularity release: v1.0.0]');
  await page.locator('#feedbackClose').click();
  assert.deepEqual(await snapshot(),original,'public feedback opening does not change calculation: '+locale);
  cases.push({locale,stableIdentity:true,fullStateReload:true,manualSpeedAndHp:true,rolls:original.rolls,feedbackReadOnly:true});
 }
 return {url,sourceRef:process.env.PAGES_BASELINE_REF||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),browser:'Chromium headless',viewport:{width:390,height:844},realDevice:false,productionMutations:0,cases};
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  const blockedMethods={};let blockedReportPosts=0,stableEvidence=null;
  if(release.tag==='v1.0.0')await context.route('**/*',route=>{
   const request=route.request(),method=request.method();
   if(['GET','HEAD','OPTIONS'].includes(method))return route.continue();
   blockedMethods[method]=(blockedMethods[method]||0)+1;
   if(new URL(request.url()).pathname==='/v1/reports')blockedReportPosts++;
   // No mutating request (including third-party challenge requests) reaches
   // production. We never submit a feedback form or manufacture a token.
   return route.abort('blockedbyclient');
  });
  const page=await context.newPage();
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
  if(release.tag==='v1.0.0')stableEvidence=await stableAcceptance(page);
  assert.deepEqual(errors,[],'GitHub Pages runtime must have no uncaught JavaScript errors');
  assert.equal(blockedReportPosts,0,'No feedback submission was attempted');
  if(stableEvidence){
   fs.writeFileSync('pages-live-v100.json',JSON.stringify({...stableEvidence,blockedMethods,blockedReportPosts,passed:true},null,2)+'\n');
   console.log('PASS stable public acceptance: exact v1.0.0, nine locale reloads, manual Speed/HP, independent sixteen-roll thresholds, read-only feedback; zero report submissions');
  }
  console.log('PASS GitHub Pages public URL '+url+'; title '+actual+'; verified assets '+assetHashes.size+'; locale '+(await locale.count()?'nine languages':'not present'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
