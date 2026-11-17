'use strict';
// New ten-locale acceptance derived from preserved v0188 54-case mobile gate.
// The original nine-locale test remains unchanged and runs independently.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {startLab,launchBrowser,ready,mockFeedback}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const widths=[320,360,390,430,768,1440];
const result=page=>page.evaluate(()=>({input:window.ChlohaLastCalculation.a,result:window.ChlohaLastCalculation.r}));
async function fits(page,where){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no document overflow: '+where);}
async function unobstructed(page,selector){
 const result=await page.locator(selector).evaluate(async node=>{node.scrollIntoView({block:'center'});await new Promise(requestAnimationFrame);const rect=node.getBoundingClientRect(),x=rect.x+rect.width/2,y=rect.y+rect.height/2,hit=document.elementFromPoint(x,y);return {visible:rect.width>0&&rect.height>0&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight,unobstructed:node===hit||node.contains(hit),hit:hit?{tag:hit.tagName,id:hit.id,className:hit.className}:null};});
 assert.ok(result.visible&&result.unobstructed,'Feedback control receives pointer input: '+selector+' '+JSON.stringify(result));
}
async function changeLocale(page,locale){
 // The language control is in the header, so return to it after editing lower cards.
 const control=page.locator('#chloha-locale');await control.scrollIntoViewIfNeeded();await control.selectOption(locale);
}
async function focusVisible(page,selector){
 await page.locator(selector).focus();await page.keyboard.press('Tab');
 const focus=await page.evaluate(()=>{const n=document.activeElement,s=getComputedStyle(n),r=n.getBoundingClientRect();return {tag:n.tagName,width:r.width,height:r.height,visible:n.matches(':focus-visible'),outline:s.outlineStyle,outlineWidth:parseFloat(s.outlineWidth)};});
 assert.ok(!['BODY','HTML'].includes(focus.tag),'Tab reaches a control after '+selector);
 assert.ok(focus.width>0&&focus.height>0&&focus.visible&&focus.outline!=='none'&&focus.outlineWidth>=2,'keyboard focus is visibly outlined after '+selector+': '+JSON.stringify(focus));
}
async function textContrast(page,selector,index=0){
 return page.locator(selector).nth(index).evaluate(node=>{
  const rgba=s=>(s.match(/[\d.]+/g)||[]).map(Number),blend=(f,b)=>[0,1,2].map(i=>f[i]*(f[3]??1)+b[i]*(1-(f[3]??1)));
  let bg=[255,255,255],chain=[];for(let p=node;p;p=p.parentElement)chain.push(p);
  for(const p of chain.reverse()){const s=getComputedStyle(p);if(s.backgroundImage!=='none')return {skipped:'gradient/image background requires separate pixel analysis'};bg=blend(rgba(s.backgroundColor),bg);}
  const s=getComputedStyle(node),fg=blend(rgba(s.color),bg),lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0),a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),large=parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.666&&Number(s.fontWeight)>=700);
  return {ratio,minimum:large?3:4.5,foreground:fg,background:bg,fontSize:s.fontSize,fontWeight:s.fontWeight};
 });
}
(async()=>{
 const lab=await startLab();let browser;const evidence={mode:'local-browser-emulation; client-only feedback fixture',realDevice:false,productionRequests:0,productionMutations:0,locales,widths,cases:[],contrast:[],localeLabelWidths:[],unverified:['real smartphone hardware','full screen-reader experience','all UI text contrast including gradients/images']};
 fs.mkdirSync('reports/v110',{recursive:true});
 try{
  browser=await launchBrowser();
  for(const locale of locales)for(const width of widths){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<=768,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));await mockFeedback(context,lab.origin);
   // This ten-locale layout fixture advertises the exact supported set.
   // The original nine-locale fixture stays unchanged; malformed/old capabilities
   // remain fail-closed in the dedicated capability browser regression.
   await context.route('**/v1/config',route=>route.fulfill({json:{enabled:true,siteKey:'local-fixture',retentionDays:90,mode:'local-demo',supportedLocales:locales}}));
   await context.addInitScript(value=>localStorage.setItem('chloha.damageLab.locale',value),locale);
   try{
    await page.goto(lab.origin+'/candidate/');await ready(page);await fits(page,locale+'/'+width+'/initial');
    if(locale==='es-LA'&&width<=700){
     const labelWidth=await page.locator('#chloha-locale').evaluate(async node=>{await document.fonts.ready;const style=getComputedStyle(node),canvas=document.createElement('canvas'),context=canvas.getContext('2d');context.font=style.font;const label=node.selectedOptions[0].label,textWidth=context.measureText(label).width,padding=parseFloat(style.paddingLeft)+parseFloat(style.paddingRight),arrowAllowance=24;return {label,textWidth,padding,arrowAllowance,requiredWidth:Math.ceil(textWidth+padding+arrowAllowance),clientWidth:node.clientWidth};});
     assert.equal(labelWidth.label,'ES-LA');assert.ok(labelWidth.clientWidth>=labelWidth.requiredWidth,'Compact regional locale label remains readable at '+width+'px: '+JSON.stringify(labelWidth));evidence.localeLabelWidths.push({width,...labelWidth});
    }
    if(locale==='es-LA'&&[320,390,1440].includes(width))await page.screenshot({path:'reports/v110/es-la-initial-'+width+'.png',fullPage:true});
    assert.equal(await page.locator('.lab-intro h1').innerText(),'Singularity');assert.equal(await page.locator('.lab-intro .eyebrow').count(),0);
    for(const selector of ['#chloha-locale','#attSearch','#defSearch','#moveSearch','#attStatsToggle','#feedbackButton','#resetCalculation']){
     const size=await page.locator(selector).boundingBox();assert.ok(size&&size.height>=44&&size.width>=24,'primary touch target '+selector+' '+locale+'/'+width);
    }
    await focusVisible(page,'#chloha-locale');
    await page.locator('#attSearch').fill('Dragonite');await page.locator('#attSuggestions [role=option]').first().click();
    await page.locator('#moveSearch').fill('Earthquake');await page.locator('#moveSuggestions [role=option]').first().click();
    if(!await page.locator('#att-attack-points').isVisible())await page.locator('#attStatsToggle').click();
    await page.locator('#att-attack-points').fill('20');
    await page.locator('#attDetails > summary').click();
    await fits(page,locale+'/'+width+'/details');
    if(locale==='es-LA'&&width===390){
     for(const selector of ['#attDetails .setting-group h3','#attDetails .setting-group label']){
      const nodes=page.locator(selector);assert.ok(await nodes.count()>0,'Advanced settings text exists: '+selector);
      for(let index=0;index<await nodes.count();index++){if(!await nodes.nth(index).isVisible())continue;const contrast=await textContrast(page,selector,index);evidence.contrast.push({locale,width,selector,index,...contrast});assert.equal(contrast.skipped,undefined,'Advanced setting plain background can be measured');assert.ok(contrast.ratio>=contrast.minimum,'Advanced setting text contrast '+selector+'['+index+']: '+contrast.ratio);}
     }
    }
    if(locale==='es-LA'&&width===390)await page.screenshot({path:'reports/v110/es-la-details-390.png',fullPage:true});
    await page.selectOption('#weather','rain');await page.selectOption('#screen','reflect');
    const previous=await result(page);assert.ok(previous.result.rolls.length>=16);
    await changeLocale(page,locales[(locales.indexOf(locale)+1)%locales.length]);assert.deepEqual(await result(page),previous,'language change preserves calculation');
    await changeLocale(page,locale);
    await page.locator('#feedbackButton').click();await page.waitForFunction(()=>!document.getElementById('feedbackSubmit').disabled);
    await fits(page,locale+'/'+width+'/feedback');
    if(locale==='es-LA'&&width===390){await page.screenshot({path:'reports/v110/es-la-feedback-viewport-390.png'});await page.locator('#feedbackPanel').screenshot({path:'reports/v110/es-la-feedback-390.png'});}
    if(locale==='es-LA'&&width<=700){assert.equal(await page.locator('.mobile-result').isVisible(),false,'Regional feedback form is not covered by the fixed result bar');await unobstructed(page,'#feedbackEmail');await unobstructed(page,'#feedbackSubmit');}
    await page.locator('#feedbackSubmit').click();assert.equal(await page.locator('#feedbackCategory').getAttribute('aria-invalid'),'true');assert.ok(await page.locator('#feedbackErrors').innerText());
    await page.selectOption('#feedbackCategory','bug');await page.locator('#feedbackDescription').fill('Local emulation failure test.');await page.locator('#feedbackSubmit').click();
    await page.waitForFunction(()=>!document.getElementById('feedbackErrors').hidden&&!document.getElementById('feedbackSubmit').disabled);assert.equal(await page.locator('#feedbackDescription').inputValue(),'Local emulation failure test.');
    assert.deepEqual(await result(page),previous,'feedback error preserves calculation');await page.locator('#feedbackClose').click();
    if(locale==='es-LA'&&width<=700)assert.equal(await page.locator('.mobile-result').isVisible(),true,'Result bar returns when regional feedback closes');
    assert.equal(await page.evaluate(()=>window.ChlohaPersistence.save()),true,'persist the current operation state');await page.reload();await ready(page);
    assert.deepEqual(await result(page),previous,'all width/locale calculation state survives reload');
    assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.equal(await page.locator('#feedbackDescription').inputValue(),'','feedback text is not automatically saved');
    await fits(page,locale+'/'+width+'/restored');
    await page.locator('#resultCard').scrollIntoViewIfNeeded();assert.ok(await page.locator('#damage').isVisible());
    if(['en','es-LA'].includes(locale)&&width===390){
     for(const selector of ['.product-description','#attSearch','#chloha-locale','#attStatsToggle','#feedbackButton','.type-pill']){
      const contrast=await textContrast(page,selector);evidence.contrast.push({selector,...contrast});if(!contrast.skipped)assert.ok(contrast.ratio>=contrast.minimum,'WCAG text contrast '+selector+': '+contrast.ratio);
     }
    }
    assert.deepEqual(errors,[]);evidence.cases.push({locale,width,status:'passed'});
   }catch(error){
    const diagnostic=await page.evaluate(()=>{const node=document.getElementById('chloha-locale'),rect=node?.getBoundingClientRect(),style=node&&getComputedStyle(node);return {scrollX,scrollY,viewport:{width:innerWidth,height:innerHeight},localeControl:node?{count:document.querySelectorAll('#chloha-locale').length,disabled:node.disabled,hidden:node.hidden,display:style.display,visibility:style.visibility,rect:rect&&{x:rect.x,y:rect.y,width:rect.width,height:rect.height},ancestors:[...function*(n){for(;n;n=n.parentElement)yield n;}(node)].map(n=>({tag:n.tagName,id:n.id,hidden:n.hidden,display:getComputedStyle(n).display}))}:null};}).catch(()=>null);
    evidence.failedCase={locale,width,error:error.message,diagnostic};console.error(JSON.stringify({failedCase:evidence.failedCase},null,2));throw error;
   }finally{await context.close();}
  }
  assert.equal(evidence.cases.length,60,'All ten languages at all six widths must run');
  console.log(JSON.stringify({status:'passed',mode:evidence.mode,realDevice:false,widths,locales,cases:evidence.cases.length,contrast:evidence.contrast,unverified:evidence.unverified,evidence:'reports/v110/ui-mobile-60.json'},null,2));
 }catch(error){evidence.failure=error.message;throw error;}
 finally{fs.writeFileSync('reports/v110/ui-mobile-60.json',JSON.stringify(evidence,null,2)+'\n');await browser?.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
