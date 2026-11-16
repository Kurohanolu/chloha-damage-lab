'use strict';
// Geometry is the regression: an ES-LA-only second row previously passed overflow tests.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {startLab,launchBrowser,ready}=require('./helpers/v0188-browser-lab.cjs');
const release=require('../release.json'),live=process.argv.includes('--public');
// The positive defect control remains pre.3, independently of the release performance baseline.
const defectSource='082ab180bc8835304d959f583d4968e0565bdea3';
const widths=[320,360,375,390,412,430,768],locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const cycles=[['ja','es-LA','ja'],['es-LA','en','es-LA'],['es','es-LA','es']];
const output='reports/v110/'+(live?'header-public':'header-local');
const geometry=page=>page.evaluate(()=>{
 const rect=selector=>{const n=document.querySelector(selector),r=n.getBoundingClientRect(),s=getComputedStyle(n);return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,row:s.gridRow,column:s.gridColumn};};
 return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,header:rect('.lab-header'),brand:rect('.brand'),control:rect('#chloha-locale-control'),select:rect('#chloha-locale'),version:rect('.version')};
});
const calculation=page=>page.evaluate(()=>JSON.parse(JSON.stringify(ChlohaLastCalculation,(_,v)=>v instanceof Map?{entries:[...v]}:v)));
async function choose(page,locale){await page.selectOption('#chloha-locale',locale);await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await page.locator('html').getAttribute('lang'),locale==='es-LA'?'es-419':locale);}
async function inspect(page,width,locale,reference){
 const g=await geometry(page);assert.equal(g.viewport,width);assert.ok(g.scrollWidth<=width,'No page overflow');
 const {brand:b,control:c,version:v,header:h,select:s}=g;
 assert.ok(b.right<=c.x+0.5&&c.right<=v.x+0.5,'Logo, selector, version are ordered without overlap');
 assert.ok(Math.max(b.y,c.y,v.y)<Math.min(b.bottom,c.bottom,v.bottom),'All three header elements share one row');
 for(const r of [b,c,v,s])assert.ok(r.x>=h.x-0.5&&r.right<=h.right+0.5&&r.y>=h.y&&r.bottom<=h.bottom,'Header contains its controls');
 assert.ok(s.width>=88&&s.width<=90&&s.height>=44,'Native selector remains compact and touchable');
 assert.ok(await page.locator('#chloha-locale').getAttribute('aria-label'),'Native select has an accessible name');
 if(locale==='es-LA')assert.equal(await page.locator('#chloha-locale option:checked').textContent(),'ES-LA');
 if(reference)for(const node of ['header','brand','control','select','version'])for(const key of ['x','y','width','height'])assert.ok(Math.abs(g[node][key]-reference[node][key])<=0.5,'Language-invariant geometry: '+locale+' '+node+'.'+key);
 const texts=await page.locator('#miniDamage, #miniPercent, #moveSelected, #reliabilityDetails').allTextContents();
 if(locale==='ja'){assert.match(texts.join(' '),/ダメージ/);assert.doesNotMatch(texts.join(' '),/Terremoto|daño|del máximo|Seleccionado|Estimado/u);}
 if(locale==='es-LA'){assert.match(texts.join(' '),/daño/);assert.doesNotMatch(texts.join(' '),/[\u3040-\u30ff]/u);}
 return {width,locale,geometry:g,texts};
}
(async()=>{
 let lab,browser,context;const evidence={mode:live?'public Chromium mobile emulation':'local Chromium mobile emulation',realDevice:false,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),releaseTag:release.tag,widths,locales,cycles,cases:[],reloads:0,requests:0,productionMutations:0};
 fs.mkdirSync(output,{recursive:true});
 try{
  if(!live){
   lab=await startLab({compare:true,comparisonRef:defectSource});
   assert.equal(lab.baseline,defectSource,'Header defect control must remain pinned to pre.3');
   evidence.predecessorSourceCommit=defectSource;
  }
  const url=live?release.publicUrl:lab.origin+'/candidate/';evidence.url=url;browser=await launchBrowser();
  if(!live){
   context=await browser.newContext({viewport:{width:390,height:900}});const page=await context.newPage();await context.route('https://**',r=>r.abort());await page.goto(lab.origin+'/baseline/');await ready(page);await choose(page,'es-LA');const old=await geometry(page);assert.ok(old.control.y>=old.brand.bottom,'Pinned pre.3 reproduces the second-row defect');evidence.predecessorDefect=old;await context.close();context=null;
  }
  for(const width of widths){
   context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:true,serviceWorkers:'block',reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await context.route('**/*',route=>{const request=route.request(),target=new URL(request.url());if(!['GET','HEAD'].includes(request.method())||target.origin!==new URL(url).origin)return route.abort();evidence.requests++;return route.continue();});
   await page.goto(url);await ready(page);await page.evaluate(()=>document.fonts.ready);assert.equal(await page.title(),release.name);
   // Live bytes must be the candidate stylesheet, never merely an old page with a matching label.
   const href=await page.locator('link[href*="singularity-v0187.css"]').getAttribute('href');
   const body=await (await page.request.get(new URL(href,url).href)).body();assert.equal(crypto.createHash('sha256').update(body).digest('hex'),crypto.createHash('sha256').update(fs.readFileSync('singularity-v0187.css')).digest('hex'));
   await choose(page,'ja');const base=await calculation(page),reference=(await inspect(page,width,'ja')).geometry;
   for(const locale of locales){await choose(page,locale);assert.deepEqual(await calculation(page),base,'Every language preserves the complete calculation');evidence.cases.push(await inspect(page,width,locale,reference));}
   for(const cycle of cycles)for(const locale of cycle){await choose(page,locale);assert.deepEqual(await calculation(page),base);await inspect(page,width,locale,reference);}
   // Recalculate in Spanish and then return to Japanese, exercising fresh translated results.
   await choose(page,'es-LA');await page.locator('#customMultiplier').evaluate(node=>{node.value='0.5';node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}));});await ready(page);
   const recalculated=await calculation(page);assert.equal(recalculated.a.customMultiplier,0.5);
   await inspect(page,width,'es-LA',reference);await choose(page,'ja');assert.deepEqual(await calculation(page),recalculated);await inspect(page,width,'ja',reference);
   await page.locator('#chloha-locale').focus();await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.tagName),'BODY','Keyboard navigation remains usable');
   await choose(page,'es-LA');await page.evaluate(()=>ChlohaPersistence.save());await page.reload();await ready(page);await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('#chloha-locale').inputValue(),'es-LA');assert.deepEqual(await calculation(page),recalculated);await inspect(page,width,'es-LA',reference);evidence.reloads++;
   await page.locator('.lab-header').screenshot({path:output+'/header-es-la-'+width+'.png'});await choose(page,'ja');await inspect(page,width,'ja',reference);await page.locator('.lab-header').screenshot({path:output+'/header-ja-'+width+'.png'});
   assert.deepEqual(errors,[]);await context.close();context=null;
  }
  assert.equal(evidence.cases.length,70);assert.equal(evidence.reloads,7);evidence.passed=true;console.log('PASS '+evidence.mode+': 70 header layouts, 21 language cycles, 7 ES-LA reloads, localized recalculation and numerical parity');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}
 finally{evidence.observedAt=new Date().toISOString();fs.writeFileSync(output+'/header-browser.json',JSON.stringify(evidence,null,2)+'\n');await context?.close();await browser?.close();await lab?.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
