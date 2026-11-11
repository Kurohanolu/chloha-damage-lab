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
   // v0.165: typing a partial species name must offer tappable matches.
   for(const side of ['att','def']){
    const search=page.locator('#'+side+'Search');
    const suggestions=page.locator('#'+side+'Suggestions');
    const species=page.locator('#'+(side==='att'?'dbAttPokemon':'dbDefPokemon'));
    const candidate=await species.locator('option').evaluateAll(opts=>{
     const all=opts.map(o=>({value:o.value,label:o.textContent.trim()})).filter(o=>o.label.length>=3);
     const preferred=all.find(o=>o.label.includes('リザードン'))||all.find(o=>o.label.includes('ガブリアス'));
     return preferred||all[0];
    });
    assert.ok(candidate,side+' has species options');
    const fragment=candidate.label.slice(0,2);
    await search.fill(fragment);
    assert.equal(await search.getAttribute('aria-expanded'),'true');
    assert.equal(await suggestions.isVisible(),true);
    const match=suggestions.getByRole('option',{name:candidate.label,exact:true}).first();
    assert.equal(await match.count(),1,'matching suggestion for '+candidate.label);
    await species.evaluate(el=>{el.addEventListener('input',()=>{el.dataset.testInputEvent='yes';},{once:true});});
    await match.click();
    assert.equal(await species.getAttribute('data-test-input-event'),'yes','search selection must notify damage calculator');
    assert.ok((await page.locator('#'+side+'Types .type-pill').count())>0,'type badges updated');

    assert.equal(await species.inputValue(),candidate.value,'species changed by tap');
    assert.equal(await suggestions.isHidden(),true);
    assert.equal(await search.inputValue(),'');
    await search.fill('zzzx-no-pokemon');
    assert.equal(await suggestions.getByText('該当するポケモンがありません').count(),1);
    await search.press('Escape');
    assert.equal(await suggestions.isHidden(),true);
    await search.fill(fragment);
    await search.press('Enter');
    assert.equal(await suggestions.isHidden(),true,'Enter selects first suggestion');
   }
   // Japanese partial match and English alias, with keyboard navigation.
   const search=page.locator('#attSearch');
   await search.fill('ガブ');
   assert.equal(await page.locator('#attSuggestions').getByRole('option',{name:'ガブリアス',exact:true}).count(),1);
   await search.fill('garchomp');
   const englishOption=page.locator('#attSuggestions').getByRole('option',{name:'ガブリアス',exact:true});
   console.log('DEBUG_EN',await page.locator('#attSuggestions').innerText(),await search.inputValue(),await page.locator('#attSuggestions').getAttribute('hidden'));
   assert.equal(await englishOption.count(),1,'English alias');
   assert.equal(await englishOption.locator('img').count(),1,'candidate image');
   await search.press('ArrowDown');
   assert.ok(await search.getAttribute('aria-activedescendant'),'keyboard active choice');
   await search.press('Enter');
   assert.equal(await search.inputValue(),'');
   assert.equal(await page.locator('#attSuggestions').isHidden(),true);
   // The fallback species select remains available for manual selection.
   assert.equal(await page.locator('.pokemon-manual-select').count(),2);

   // Fast point allocation uses Champions 0..32 per stat, max 66 total.
   assert.equal(await page.locator('#dbAuto').isChecked(),true,'point auto mode active');
   await page.locator('#attPresets button[aria-label="攻撃側 H32/A32/S2"]').click();
   const attPoints=await page.evaluate(()=>window.ChlohaUI.models().att.points);
   assert.equal(attPoints.hp,32);assert.equal(attPoints.attack,32);assert.equal(attPoints.speed,2);
   assert.equal(Object.values(attPoints).reduce((a,b)=>a+b,0),66);
   await page.locator('#defPresets button[aria-label="防御側 H32/B32/D2"]').click();
   const defPoints=await page.evaluate(()=>window.ChlohaUI.models().def.points);
   assert.equal(defPoints.hp,32);assert.equal(defPoints.defense,32);assert.equal(defPoints.specialDefense,2);
   assert.equal(Object.values(defPoints).reduce((a,b)=>a+b,0),66);
   assert.match(await page.locator('#attBudget').innerText(),/残り0/);
   await page.locator('#attPresets button[aria-label="攻撃側 全て0"]').click();
   assert.equal(Object.values(await page.evaluate(()=>window.ChlohaUI.models().att.points)).reduce((a,b)=>a+b,0),0);
   const result=page.locator('#resultCard');
   assert.equal(await result.count(),1);
   assert.equal(await page.locator('#swapSides').count(),1);
   assert.equal(await page.locator('#attPokemonHeader').count(),1);
   assert.equal(await page.locator('#defPokemonHeader').count(),1);
   assert.equal(await page.locator('.version').innerText().then(x=>x.includes('v0.166')),true);
   assert.equal(errors.length,0,'uncaught page errors: '+errors.join(' | '));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   assert.equal(overflow,false,'horizontal overflow at '+width);
   await page.screenshot({path:path.resolve(__dirname,'../smoke-'+width+'.png'),fullPage:true});
   console.log('PASS viewport',width);
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
