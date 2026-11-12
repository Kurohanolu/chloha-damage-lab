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
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS v0.179 language toggle, persistence, English species search, catalog, damage invariant');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
