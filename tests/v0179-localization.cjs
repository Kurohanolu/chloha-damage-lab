const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'),{waitUntil:'load'});
  await page.locator('#chloha-locale').waitFor();
  assert.equal(await page.locator('html').getAttribute('lang'),'ja');
  assert.equal(await page.evaluate(()=>window.ChlohaNames.pokemon.indeedee_m),'Indeedee (Male)','initial catalog preserved');
  assert.equal(await page.evaluate(()=>window.ChlohaNames.moves['ワイドフォース']),'Expanding Force','move names loaded');
  const before=await page.evaluate(()=>window.ChlohaDamageEngine.calculate({level:50,power:90,attack:120,defense:120,hp:160,currentHp:160,attackStage:0,defenseStage:0,moveType:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['エスパー'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:160,attMaxHp:160,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'singles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'auto',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false}).rolls);
  await page.locator('#chloha-locale').selectOption('en');
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.equal(await page.evaluate(()=>window.ChlohaLocale.get()),'en');
  assert.match(await page.locator('#attBudget').textContent(),/remaining 66/,'stat-point counter retains space before remaining count');
  assert.equal(await page.locator('#copy').textContent(),'Copy','copy control translated');
  assert.match(await page.locator('#attDetails > summary').innerText(),/Attacker advanced settings/,'attacker advanced summary translated');
  assert.match(await page.locator('#defDetails > summary').innerText(),/Defender advanced settings/,'defender advanced summary translated');
  assert.equal(await page.locator('#attDetails .setting-group').first().locator('h3').textContent(),'Attack and damage modifiers','attacker modifiers translated');
  assert.equal(await page.locator('#defDetails .setting-group').nth(1).locator('h3').textContent(),'Defensive modifiers and ally support','defender support translated');
  assert.match(await page.locator('#inputSettings > summary').innerText(),/Input mode and manual stats/,'manual settings translated');
  assert.match(await page.locator('#defDetails .unavailable').textContent(),/Residual damage/,'residual warning translated');
  assert.equal(await page.locator('#rollsLabel').textContent(),'16 damage rolls','damage roll heading translated');
  assert.match(await page.locator('#reliabilityTitle').textContent(),/^Verification status(?:\: Not hardware-verified)?$/,'verification heading translated, including live status');
  assert.equal(await page.locator('label:has(#battleFormat)').first().textContent().then(x=>x.includes('Battle format')),true,'battle format label translated');

  const abilityOptions=await page.locator('#attAbility option').allTextContents();
  assert(abilityOptions.every(label=>!label.includes(' / ')),'ability options must not show bilingual slash labels');
  const pokemonOption=await page.locator('#dbAttPokemon option[value="charizard"]').textContent();
  assert.equal(pokemonOption,'Charizard','English Pokémon options must not append Japanese');
  await page.locator('#attSearch').fill('Charizard');
  await page.locator('#attSuggestions [role=option]').first().waitFor();
  await page.locator('#attSuggestions [role=option]').first().click();
  assert.equal(await page.locator('#dbAttPokemon').inputValue(),'charizard');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('lang'),'en','language persisted');
  // Dynamic status must translate on repeated language switches.
  await page.locator('#chloha-locale').selectOption('ja');
  assert.match(await page.locator('#reliabilityTitle').textContent(),/^検証状況/,'verification status returns to Japanese');
  assert.equal(await page.locator('#dbAttPokemon option[value="charizard"]').textContent(),'リザードン','Pokémon option returns to Japanese');
  await page.locator('#chloha-locale').selectOption('en');
  assert.match(await page.locator('#reliabilityTitle').textContent(),/^Verification status/,'verification status returns to English');
  assert.equal(await page.locator('#dbAttPokemon option[value="charizard"]').textContent(),'Charizard','Pokémon option returns to English');
  await page.locator('#chloha-locale').selectOption('ja');
  assert.equal(await page.locator('html').getAttribute('lang'),'ja');
  const after=await page.evaluate(()=>window.ChlohaDamageEngine.calculate({level:50,power:90,attack:120,defense:120,hp:160,currentHp:160,attackStage:0,defenseStage:0,moveType:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['エスパー'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:160,attMaxHp:160,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'singles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'auto',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false}).rolls);
  assert.deepEqual(after,before,'locale cannot alter calculation');
  // Runtime translations must survive locale changes and in-place calculator updates.
  await page.evaluate(()=>{
   const target=document.createElement('div');target.id='runtime-i18n-regression';
   target.textContent='2〜3発（目安・回復等なし）';
   document.querySelector('#app').append(target);
  });
  await page.locator('#chloha-locale').selectOption('en');
  await page.waitForFunction(()=>document.querySelector('#runtime-i18n-regression')?.textContent.includes('hits (estimate'));
  assert.equal(await page.locator('#runtime-i18n-regression').textContent(),'2–3 hits (estimate; no recovery)');
  await page.locator('#chloha-locale').selectOption('ja');
  assert.equal(await page.locator('#runtime-i18n-regression').textContent(),'2〜3発（目安・回復等なし）');
  await page.locator('#chloha-locale').selectOption('en');
  assert.equal(await page.locator('#runtime-i18n-regression').textContent(),'2–3 hits (estimate; no recovery)');
  await page.evaluate(()=>document.querySelector('#runtime-i18n-regression').textContent='入力エラー: 現在HP 範囲外');
  await page.waitForFunction(()=>document.querySelector('#runtime-i18n-regression')?.textContent.includes('Input error:'));
  assert.equal(await page.locator('#runtime-i18n-regression').textContent(),'Input error: Current HP out of range');
  await page.locator('#chloha-locale').selectOption('ja');
  assert.equal(await page.locator('#runtime-i18n-regression').textContent(),'入力エラー: 現在HP 範囲外');
  await page.locator('#chloha-locale').selectOption('en');
  assert.equal(await page.locator('#runtime-i18n-regression').textContent(),'Input error: Current HP out of range');
  await page.evaluate(()=>document.querySelector('#runtime-i18n-regression').textContent='現在HP 160 / KO率 50%');
  await page.waitForFunction(()=>document.querySelector('#runtime-i18n-regression')?.textContent.includes('Current HP'));
  assert.equal(await page.locator('#runtime-i18n-regression').textContent(),'Current HP 160 / KO chance 50%');
  await page.evaluate(()=>document.querySelector('#runtime-i18n-regression').textContent='現在の盤面：天候 晴れ ／ フィールド なし ／ 壁 なし');
  await page.waitForFunction(()=>document.querySelector('#runtime-i18n-regression')?.textContent.includes('Current battlefield'));
  assert.match(await page.locator('#runtime-i18n-regression').textContent(),/Current battlefield: Weather .* \/ Terrain .* \/ Screen /);
  await page.locator('#chloha-locale').selectOption('ja');
  assert.equal(await page.locator('#runtime-i18n-regression').textContent(),'現在の盤面：天候 晴れ ／ フィールド なし ／ 壁 なし');
  await page.locator('#chloha-locale').selectOption('en');
  // Battle history is visible UI and must switch languages without altering the recorded data.
  await page.evaluate(()=>{
   const li=document.createElement('li');li.textContent='1手目：ワイドフォース / 90ダメージ / HP 160→70 / フィールド解除 / 予測と不一致・要照合';
   document.querySelector('#battleHistory').append(li);
   document.querySelector('#battleStatus').textContent='履歴を消去しました。現在のHP・フィールドは維持しています。';
  });
  await page.waitForFunction(()=>document.querySelector('#battleHistory li')?.textContent.startsWith('Turn 1:'));
  assert.match(await page.locator('#battleHistory li').textContent(),/90 damage.*Terrain removed.*Prediction mismatch/);
  assert.equal(await page.locator('#battleStatus').textContent(),'History cleared. Current HP and terrain were preserved.');
  await page.locator('#chloha-locale').selectOption('ja');
  assert.match(await page.locator('#battleHistory li').textContent(),/^1手目：/);
  assert.equal(await page.locator('#battleStatus').textContent(),'履歴を消去しました。現在のHP・フィールドは維持しています。');
  await page.locator('#chloha-locale').selectOption('en');
  assert.match(await page.locator('#battleHistory li').textContent(),/^Turn 1:/);
  // Audit real warning/trace text nodes, not just catalog completeness.
  await page.evaluate(()=>{
   const root=document.createElement('section');root.id='english-runtime-audit';
   for(const value of [
    '選択したポケモンは将来実装用の暫定登録です。種族値・特性などの確認が必要です。',
    'ダブルウイング：各ヒットの16乱数を独立とした256通りでKO率を算出。命中・2発目の特性変化などは未対応です。',
    'エレキボール: 素早さ 120 / 80 → 威力 80',
    'ワイドフォース: 接地＋サイコフィールド（威力1.5倍・範囲化）',
    '2発合計KO率（256組）: 75.00%'
   ]){const p=document.createElement('p');p.textContent=value;root.append(p);}
   document.querySelector('#app').append(root);
  });
  await page.waitForFunction(()=>[...document.querySelectorAll('#english-runtime-audit p')].every(p=>!/[ぁ-んァ-ヶ一-龯]/.test(p.textContent)));
  const auditEnglish=await page.locator('#english-runtime-audit p').allTextContents();
  assert.match(auditEnglish[0],/provisional entry/);
  assert.match(auditEnglish[1],/Dual Wingbeat/);
  assert.match(auditEnglish[2],/Electro Ball: Speed/);
  assert.match(auditEnglish[3],/Expanding Force/);
  assert.match(auditEnglish[4],/Two-hit KO chance/);
  await page.locator('#chloha-locale').selectOption('ja');
  assert.match(await page.locator('#english-runtime-audit p').first().textContent(),/選択したポケモン/);
  await page.locator('#chloha-locale').selectOption('en');
  assert.match(await page.locator('#english-runtime-audit p').first().textContent(),/provisional entry/);
  // Full English-mode audit: live battle context, multi-line trace and move warning.
  await page.evaluate(()=>{
   const root=document.createElement('section');root.id='v0179-full-audit';
   for(const value of [
    '現在の盤面：天候 晴れ ／ フィールド なし ／ 壁 なし',
    '攻撃実数値: 180\\n防御実数値: 120\\n乱数前: 90',
    '選択技「ワイドフォース」の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。'
   ]){const p=document.createElement('p');p.textContent=value;root.append(p);}
   document.querySelector('#app').append(root);
  });
  await page.waitForFunction(()=>[...document.querySelectorAll('#v0179-full-audit p')].every(p=>!/[ぁ-んァ-ヶ一-龯]/.test(p.textContent)));
  const fullAudit=await page.locator('#v0179-full-audit p').allTextContents();
  assert.match(fullAudit[0],/Weather Sun.*Terrain None.*Screen None/);
  assert.match(fullAudit[1],/Attack stat: 180\\nDefense stat: 120\\nBefore random factor: 90/);
  assert.match(fullAudit[2],/Selected move “Expanding Force”: learnset/);
  assert.equal(await page.locator('#chloha-locale').getAttribute('aria-label'),'Language','English language selector accessible label');
  // Audit visible text nodes after runtime translations settle. Exclude option menus,
  // which contain alternative locale names, and non-rendered script/style content.
  const residualJapanese=await page.evaluate(()=>{
   const root=document.querySelector('#app')||document.body;
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   const matches=[];let node;
   while((node=walker.nextNode())){
    const parent=node.parentElement;
    if(!parent||parent.closest('script,style,option,template,[hidden],[aria-hidden="true"]'))continue;
    if(!parent.getClientRects().length)continue;
    const value=node.nodeValue.trim();
    if(/[ぁ-んァ-ヶ一-龯]/.test(value))matches.push({text:value.slice(0,160),element:parent.tagName,id:parent.id||null});
   }
   return matches;
  });
  require('node:fs').writeFileSync('english-untranslated-audit.json',JSON.stringify({total:residualJapanese.length,unique:[...new Set(residualJapanese.map(x=>x.text))].length,items:residualJapanese},null,2));
  console.log('ENGLISH_VISIBLE_JAPANESE_AUDIT '+JSON.stringify(residualJapanese));
  assert.deepEqual(residualJapanese,[],'English mode must not contain visible Japanese UI text');
  // Final release gate: verify real trace and version disclaimer round-trip.
  const traceEn=await page.locator('#trace').textContent();
  const provenanceEn=await page.locator('#versionProvenance').textContent();
  assert.match(traceEn,/Attack stat: \d+[\s\S]*Defense stat: \d+[\s\S]*Before random factor: \d+/,'real trace labels are English');
  assert.match(traceEn,/Final damage \(roll 100\): \d+/,'final trace roll is English');
  assert.match(provenanceEn,/About versions:.*public UI version.*internal API foundation/,'version provenance is translated');
  assert.match(provenanceEn,/Pokémon Champions hardware/,'hardware verification caveat preserved');
  await page.locator('#chloha-locale').selectOption('ja');
  const traceJa=await page.locator('#trace').textContent();
  const provenanceJa=await page.locator('#versionProvenance').textContent();
  assert.match(traceJa,/攻撃実数値: \d+[\s\S]*防御実数値: \d+[\s\S]*乱数前: \d+/,'real trace returns to Japanese');
  assert.match(traceJa,/最終ダメージ（乱数100）: \d+/,'final trace roll returns to Japanese');
  assert.match(provenanceJa,/バージョンについて：画面の/,'version provenance returns to Japanese');
  await page.locator('#chloha-locale').selectOption('en');
  assert.equal(await page.locator('#trace').textContent(),traceEn,'trace English round-trip is lossless');
  assert.equal(await page.locator('#versionProvenance').textContent(),provenanceEn,'version English round-trip is lossless');
  // Android feedback: native menus, search placeholders and move suggestions.
  assert.equal(await page.locator('#attSearch').getAttribute('placeholder'),'Type a name to select');
  assert.equal(await page.locator('#moveSearch').getAttribute('placeholder'),'e.g. Earthquake, Thunderbolt');
  assert.equal(await page.locator('#battleFormat option:checked').textContent(),'Doubles');
  assert.equal(await page.locator('#defAbility option').first().textContent(),'None');
  await page.locator('#moveSearch').fill('Flame');
  await page.locator('#moveSuggestions [role=option]').first().waitFor();
  const moveSuggestions=await page.locator('#moveSuggestions [role=option]').allTextContents();
  assert(moveSuggestions.some(x=>x.includes('Flamethrower')),'English move search works');
  assert(moveSuggestions.every(x=>!/[ぁ-んァ-ヶ一-龯]/.test(x)),'move suggestion labels and metadata have no Japanese');
  await page.locator('#moveSuggestions [role=option]').first().click();
  assert.match(await page.locator('#moveSelected').textContent(),/^Selected: /,'selected move summary uses English');
  assert(!/[ぁ-んァ-ヶ一-龯]/.test(await page.locator('#moveSelected').textContent()),'selected move summary has no Japanese');
  await page.locator('#moveSearch').fill('');
  await page.locator('#chloha-locale').selectOption('ja');
  assert.equal(await page.locator('#attSearch').getAttribute('placeholder'),'名前を入力して選択');
  assert.equal(await page.locator('#moveSearch').getAttribute('placeholder'),'例：じしん、10まんボルト');
  await page.locator('#chloha-locale').selectOption('en');
  // Preserve an English-mode visual artifact for pre-release UI inspection.
  await page.screenshot({path:'smoke-v0179-english.png',fullPage:true});
  await page.locator('#chloha-locale').selectOption('ja');
  assert.match(await page.locator('#v0179-full-audit p').first().textContent(),/現在の盤面/);
  await page.locator('#chloha-locale').selectOption('en');
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS v0.179 language toggle, persistence, English species search, catalog, damage invariant');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
