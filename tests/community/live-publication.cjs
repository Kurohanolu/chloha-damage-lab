'use strict';
// Post-deployment acceptance only. Does not change either publication target.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {get} = require('./http.cjs');
const root = path.resolve(__dirname, '../..');
const site = path.join(root, 'dist/community/site');
const base = 'https://kurohanolu.github.io/chloha-damage-lab/';
const current = 'https://kurohanolu.github.io/singularity/';
// Captured from the live official site immediately before legacy deployment.
const before = {
  'index.html': '5a6a457264b2583b3dc878f6e6f6203fcdf94d3038ea5f44164f99dad1db74a5',
  'release.json': '0656166c18d8945b9d21e27d610abc9c0595d70bcd9dbe7ced38eec14474f070',
};
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const files = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e =>
  e.isDirectory() ? files(path.join(dir,e.name)) : [path.join(dir,e.name)]);
(async () => {
  const report = {status:'running',observedAt:new Date().toISOString(),legacyUrl:base,
    legacyCommit:null,files:[],
    singularityUrl:current,singularityBeforeDeployment:before,realDevice:false};
  const output = path.join(root,'reports/community/live');
  fs.mkdirSync(output,{recursive:true});
  let browser;
  try {
    browser = await chromium.launch({headless:true});
    const context = await browser.newContext({viewport:{width:390,height:900},isMobile:true,hasTouch:true});
    const refResponse = await context.request.get('https://api.github.com/repos/Kurohanolu/chloha-damage-lab/git/ref/heads/pages-legacy');
    assert.equal(refResponse.status(),200);
    report.legacyCommit=(await refResponse.json()).object.sha;
    assert.match(report.legacyCommit,/^[a-f0-9]{40}$/);
    const treeResponse=await context.request.get('https://api.github.com/repos/Kurohanolu/chloha-damage-lab/git/trees/'+report.legacyCommit+'?recursive=1');
    assert.equal(treeResponse.status(),200);
    const deployedTree=await treeResponse.json();
    assert.equal(deployedTree.truncated,false);
    const blobs=deployedTree.tree.filter(x=>x.type==='blob');
    const paths = files(site).sort();
    assert.deepEqual(blobs.map(x=>x.path).sort(),paths.map(x=>path.relative(site,x).split(path.sep).join('/')).sort());
    for(const blob of blobs){
      const bytes=fs.readFileSync(path.join(site,blob.path));
      const gitSHA=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
      assert.equal(gitSHA,blob.sha,'Reviewed Web bytes match the publication commit: '+blob.path);
    }
    assert.equal(paths.length,44);
    for(let i=0;i<paths.length;i+=6) {
      await Promise.all(paths.slice(i,i+6).map(async local => {
        const rel = path.relative(site,local).split(path.sep).join('/');
        const expected = hash(fs.readFileSync(local));
        const response = await get(context.request,base+rel+'?community-sha='+expected,report);
        assert.equal(response.status(),200,'Published file: '+rel);
        assert.equal(hash(await response.body()),expected,'Exact published bytes: '+rel);
        report.files.push({path:rel,sha256:expected,status:200});
      }));
    }
    report.files.sort((a,b)=>a.path.localeCompare(b.path));
    report.webFilesEqualRestoredPackage=true;
    for(const [rel,expected] of Object.entries(before)) {
      const response = await get(context.request,current+rel,report);
      assert.equal(response.status(),200,'Current Singularity accessible');
      assert.equal(hash(await response.body()),expected,'Singularity bytes unchanged by legacy deployment: '+rel);
    }
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(current,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.ChlohaLastCalculation?.r?.rolls?.length===16);
    assert.ok((await page.title()).includes('Singularity'));
    assert.equal(await page.locator('#chloha-locale option').count(),10);
    await page.selectOption('#chloha-locale','en');
    await page.locator('#moveSearch').fill('Earthquake');
    await page.locator('#moveSuggestions [role=option]').first().click();
    assert.equal(await page.locator('#dbMove').inputValue(),'earthquake');
    const result=await page.evaluate(()=>JSON.parse(JSON.stringify(window.ChlohaLastCalculation.r)));
    assert.equal(result.rolls.length,16);
    assert.ok(result.rolls.every(x=>Number.isFinite(x)&&x>0));
    await page.selectOption('#chloha-locale','ja');
    assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(window.ChlohaLastCalculation.r))),result);
    await page.evaluate(()=>window.ChlohaPersistence.save());
    await page.reload();
    await page.waitForFunction(()=>window.ChlohaLastCalculation?.r?.rolls?.length===16);
    assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(window.ChlohaLastCalculation.r))),result);
    assert.equal(await page.locator('#chloha-locale').inputValue(),'ja');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:path.join(output,'singularity-preserved-390.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    report.singularity={version:'1.1.0 Pre-Release 6',unchanged:true,languageOptions:10,
      search:true,calculation16Rolls:true,reloadPersistence:true,mobileViewport:390,pageErrors:errors};
    report.status='passed';
    console.log('PASS live publication: '+JSON.stringify(report));
  } catch(e) { report.status='failed';report.error=e.stack;throw e; }
  finally {
    fs.writeFileSync(path.join(output,'publication.json'),JSON.stringify(report,null,2)+'\n');
    await browser?.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1});
