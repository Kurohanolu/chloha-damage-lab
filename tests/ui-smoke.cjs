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
   // v0.167: all 6 Champions stats must be visible and editable for both sides.
   const statKeys=['hp','attack','defense','specialAttack','specialDefense','speed'];
   for(const side of ['att','def']){
    const table=page.locator('#'+side+'Stats');
    const overview=page.locator('#'+side+'StatOverview');
    assert.equal(await table.locator('.stat-row').count(),6,'six '+side+' stat rows');
    assert.equal(await overview.locator('button').count(),6,'six compact stat previews');
    for(const key of statKeys){
     assert.equal(await page.locator('#'+side+'-'+key+'-points').count(),1,side+' '+key+' edit input');
     assert.equal(await page.locator('#'+side+'-'+key+'-row').getAttribute('hidden'),null,'no hidden stat row');
    }
    await page.locator('#'+side+'Previewspeed').click();
    assert.equal(await table.isVisible(),true,'compact stat click must expand details');
    assert.equal(await page.locator('#'+side+'-speed-points').evaluate(el=>document.activeElement===el),true,'preview must focus matching stat');
    if(width<=700)await page.locator('#'+side+'StatsToggle').click();
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
   await englishOption.waitFor({state:'visible',timeout:3000});
   assert.equal(await englishOption.count(),1,'English alias');
   assert.equal(await englishOption.locator('img').count(),1,'candidate image');
   await search.press('ArrowDown');
   assert.ok(await search.getAttribute('aria-activedescendant'),'keyboard active choice');
   await search.press('Enter');
   assert.equal(await search.inputValue(),'');
   assert.equal(await page.locator('#attSuggestions').isHidden(),true);
   // The fallback species select remains available for manual selection.
   assert.equal(await page.locator('.pokemon-manual-select').count(),2);

   // v0.168: move search is a combobox with partial Japanese and English-ID matching.
   const moveSearch=page.locator('#moveSearch'),moveList=page.locator('#moveSuggestions'),moveSelect=page.locator('#dbMove');
   await moveSearch.fill('じしん');
   await moveList.getByRole('option',{name:'じしん',exact:true}).waitFor({state:'visible'});
   await moveList.getByRole('option',{name:'じしん',exact:true}).click();
   assert.equal(await moveSelect.inputValue(),'earthquake','Japanese move search selects earthquake');
   assert.equal(await moveSearch.inputValue(),'');
   assert.equal(await moveList.isHidden(),true);
   await moveSearch.fill('thunderbolt');
   await moveList.getByRole('option',{name:'10まんボルト',exact:true}).waitFor({state:'visible'});
   await moveSearch.press('ArrowDown');
   assert.ok(await moveSearch.getAttribute('aria-activedescendant'),'keyboard move option');
   await moveSearch.press('Enter');
   assert.equal(await moveSelect.inputValue(),'thunderbolt','English move ID search');
   assert.match(await page.locator('#moveSelected').innerText(),/10まんボルト/);
   await moveSearch.fill('zzzx-no-move');
   assert.equal(await moveList.getByText('該当する技がありません').count(),1);
   await moveSearch.press('Escape');
   assert.equal(await moveList.isHidden(),true);
   assert.equal(await page.locator('#moveSelectMount select').count(),1,'native move dropdown retained');
   // Shared board controls stay accessible without opening advanced settings.
   for(const id of ['weather','terrain','screen','battleFormat']){
    assert.equal(await page.locator('#boardControls #'+id).count(),1,id+' on quick board');
   }
   await page.locator('#weather').selectOption('rain');
   await page.locator('#terrain').selectOption('electric');
   await page.locator('#screen').selectOption('lightScreen');
   assert.match(await page.locator('#boardSummary').innerText(),/雨/);
   await page.locator('#resetBoard').click();
   for(const id of ['weather','terrain','screen'])assert.equal(await page.locator('#'+id).inputValue(),'none',id+' reset');
   assert.equal(await page.locator('#battleFormat').count(),1,'format unchanged by reset');
   for(const id of ['attAttackMods','attHpMods','attSpeedMods','defHpMods','defSupportMods','defSpeedMods'])
    assert.equal(await page.locator('#'+id).count(),1,id+' detail group exists');
   // v0.169: GameWith move catalog, simple damage, and blocked complex mechanics.
   assert.equal(await page.locator('#dbMove option').count(),334,'all 334 damaging moves searchable (protect excluded)');
   await moveSearch.fill('フリーズドライ');
   const gated=moveList.getByRole('option',{name:'フリーズドライ',exact:true});
   await gated.waitFor({state:'visible'});
   assert.match(await gated.innerText(),/計算未対応/);
   await gated.click();
   assert.match(await page.locator('#moveSelected').innerText(),/計算未対応/);
   assert.equal(await page.locator('#output').isHidden(),true,'special type matchup must not use generic damage');
   assert.match(await page.locator('#error').innerText(),/未対応/);
   await moveSearch.fill('パワージェム');
   const simple=moveList.getByRole('option',{name:'パワージェム',exact:true});
   await simple.waitFor({state:'visible'});
   assert.match(await simple.innerText(),/基本計算のみ/);
   await simple.click();
   assert.equal(await page.locator('#error').isHidden(),true,'supported move must restore calculation');
   assert.equal(await page.locator('#output').isHidden(),false,'output restored');
   assert.equal(await page.locator('#dbMove').inputValue().then(x=>x.startsWith('gw0169_')),true);
   assert.match(await page.locator('#moveSelected').innerText(),/パワージェム/);
   assert.equal(await page.locator('#moveType').inputValue(),'いわ');
   assert.equal(await page.locator('#power').inputValue(),'80');
   // v0.170: new GameWith-verified basic fields, safely blocked conditional damage.
   await moveSearch.fill('ドレインパンチ');
   const drainMove=moveList.getByRole('option',{name:'ドレインパンチ',exact:true});
   await drainMove.waitFor({state:'visible'});
   assert.match(await drainMove.innerText(),/基本計算のみ/);
   await drainMove.click();
   assert.equal(await page.locator('#output').isHidden(),false,'simple newly added move calculates');
   assert.equal(await page.locator('#moveType').inputValue(),'かくとう');
   assert.equal(await page.locator('#power').inputValue(),'75');
   await moveSearch.fill('はたきおとす');
   const knockOff=moveList.getByRole('option',{name:'はたきおとす',exact:true});
   await knockOff.waitFor({state:'visible'});
   assert.match(await knockOff.innerText(),/基本計算のみ/);
   await knockOff.click();
   assert.equal(await page.locator('#output').isHidden(),false,'Knock Off conditional calculation available');
   await moveSearch.fill('ワイドフォース');
   const expandingForce=moveList.getByRole('option',{name:'ワイドフォース',exact:true});
   await expandingForce.waitFor({state:'visible'});
   assert.match(await expandingForce.innerText(),/基本計算のみ/);
   await expandingForce.click();
   assert.equal(await page.locator('#output').isHidden(),false,'Expanding Force conditional calculation available');
   await moveSearch.fill('マッハパンチ');
   await moveList.getByRole('option',{name:'マッハパンチ',exact:true}).click();
   assert.equal(await page.locator('#output').isHidden(),false,'newly supported move recovers calculation');
   // GameWith 212 physical + 122 special catalog complete, with conditional effects safely gated.
   await moveSearch.fill('こおりのつぶて');
   const shard=moveList.getByRole('option',{name:'こおりのつぶて',exact:true});
   await shard.waitFor({state:'visible'});await shard.click();
   assert.equal(await page.locator('#power').inputValue(),'40');
   assert.equal(await page.locator('#output').isHidden(),false);
   await moveSearch.fill('ベノムショック');
   const venom=moveList.getByRole('option',{name:'ベノムショック',exact:true});
   await venom.waitFor({state:'visible'});
   assert.match(await venom.innerText(),/計算未対応/);
   await venom.click();
   assert.equal(await page.locator('#output').isHidden(),true,'conditional poisoned target bonus blocked');
   await moveSearch.fill('ぼうふう');
   await moveList.getByRole('option',{name:'ぼうふう',exact:true}).click();
   assert.equal(await page.locator('#output').isHidden(),false,'basic special attack restored');
   assert.equal(await page.locator('#power').inputValue(),'110');
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
   assert.match(await page.locator('#attPreviewhp').innerText(),/32/);
   assert.match(await page.locator('#attPreviewspeed').innerText(),/2/);
   assert.match(await page.locator('#defPreviewspecialDefense').innerText(),/2/);
   assert.equal(await page.locator('#koSummary').isHidden(),false,'visible KO summary for valid result');
   assert.match(await page.locator('#koVerdict').innerText(),/KO|耐え|ダメージ|ひんし/);
   assert.ok((await page.locator('#koVerdictDetail').innerText()).includes('KO率'));
   if(width<=700)assert.ok((await page.locator('#miniVerdict').innerText()).length>0,'mobile KO verdict');

   await page.locator('#attPresets button[aria-label="攻撃側 全て0"]').click();
   assert.equal(Object.values(await page.evaluate(()=>window.ChlohaUI.models().att.points)).reduce((a,b)=>a+b,0),0);
   const result=page.locator('#resultCard');
   assert.equal(await result.count(),1);
   assert.equal(await page.locator('#swapSides').count(),1);
   assert.equal(await page.locator('#attPokemonHeader').count(),1);
   assert.equal(await page.locator('#defPokemonHeader').count(),1);
   assert.equal(await page.locator('.version').innerText().then(x=>x.includes('v0.170')),true);
   assert.equal(errors.length,0,'uncaught page errors: '+errors.join(' | '));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   assert.equal(overflow,false,'horizontal overflow at '+width);
   await page.screenshot({path:path.resolve(__dirname,'../smoke-'+width+'.png'),fullPage:true});
   console.log('PASS viewport',width);
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
