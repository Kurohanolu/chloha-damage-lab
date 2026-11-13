'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const selector=page.locator('#chloha-locale');
  const steps=[
   ['ja','なし','ダブル'],['en','None','Doubles'],['fr','Aucun','Duo'],
   ['de','Keine','Doppel'],['es','Ninguno','Doble'],['it','Nessuno','Doppio'],
   ['ko','없음','더블'],['zh-Hans','无','双打'],['zh-Hant','無','雙打'],
   ['ja','なし','ダブル']
  ];
  // Exercise real controls before switching locales; preserve their selected
  // semantic values while translated labels and dynamic results are rebuilt.
  const exercised={
   weather:'rain',terrain:'electric',screen:'reflect',
   attItem:'lifeOrb',defItem:'assaultVest'
  };
  for(const [id,value] of Object.entries(exercised)){
   await page.locator('#'+id).selectOption(value);
  }
  // Use two real database Pokémon, not an empty/default calculator state.
  // Pick stable grounded targets from the actual Pokémon database.
  const pokemonIds=await page.locator('#dbAttPokemon option').evaluateAll(nodes=>nodes.map(n=>n.value));
  const defenderIds=await page.locator('#dbDefPokemon option').evaluateAll(nodes=>nodes.map(n=>n.value));
  const attacker=pokemonIds.find(id=>id==='garchomp');
  const defender=defenderIds.find(id=>id==='tyranitar');
  assert.ok(attacker&&defender,'Garchomp and Tyranitar must exist in Pokémon database');
  for(const [id,value] of [['dbAttPokemon',attacker],['dbDefPokemon',defender]]){
   exercised[id]=value;
   // Pokémon database selects are hidden behind search UI; Playwright's
   // selectOption waits for visibility and times out on these native controls.
   await page.locator('#'+id).evaluate((el,selected)=>{
    el.value=selected;
    el.dispatchEvent(new Event('change',{bubbles:true}));
   },value);
  }
  // A species' first ability can be a display-only entry not supported by
  // the numeric engine (e.g. Rough Skin). Use supported neutral abilities
  // for the damage baseline; the unsupported-label pass runs separately.
  for(const id of ['attAbility','defAbility']){
   const available=await page.locator('#'+id+' option').evaluateAll(nodes=>nodes.map(n=>n.value));
   assert.ok(available.includes('none'),id+' must offer the neutral ability');
   exercised[id]='none';
   await page.locator('#'+id).selectOption('none');
  }
  const moves=await page.locator('#dbMove option').evaluateAll(nodes=>nodes.map(n=>n.value).filter(Boolean));
  assert.ok(moves.includes('earthquake'),'Garchomp move selector must contain Earthquake: '+JSON.stringify(moves.slice(0,15)));
  exercised.dbMove='earthquake';
  await page.locator('#dbMove').evaluate(el=>{el.value='earthquake';el.dispatchEvent(new Event('change',{bubbles:true}));});
  // Prevent a false green: numerical invariance of an empty result is not a
  // valid calculation test. Require a populated nonzero damage range first.
  await page.waitForTimeout(250);
  const initialDamage=await page.locator('#damage').textContent();
  const initialError=await page.locator('#error').textContent();
  const initialVisibility=await page.locator('#output').evaluate(el=>el.hidden);
  console.log('Initial calculation diagnostic:',JSON.stringify({initialDamage,initialError,initialVisibility,selected:await page.evaluate(()=>({att:document.querySelector('#dbAttPokemon').value,def:document.querySelector('#dbDefPokemon').value,move:document.querySelector('#dbMove').value,auto:document.querySelector('#dbAuto').checked}))}));
  const initialNumbers=(initialDamage||'').match(/\d+/g)||[];
  assert.ok(initialNumbers.length>=2&&Number(initialNumbers[1])>0,
   'real Pokémon damage calculation must produce a nonzero range before locale rotations: '+JSON.stringify({initialDamage,initialError,initialVisibility}));
  await page.evaluate(controls=>{window.__roundtripControls=controls;},exercised);
  const snapshots=[];
  let globalBaselineNumeric=null;
  // Rotate the starting locale through all nine languages. Every rotation
  // exercises a different predecessor/successor history and returns to start.
  const languages=steps.slice(0,9);
  for(let rotation=0;rotation<languages.length;rotation++){
   const cycle=[...languages.slice(rotation),...languages.slice(0,rotation),languages[rotation]];
   let baselineNumeric=null;
   for(let i=0;i<cycle.length;i++){
   const [lang,none,double]=cycle[i];
   const from=i===0?'initial':cycle[i-1][0];
   await selector.selectOption(lang);
   await page.waitForTimeout(120);
   const state=await page.evaluate(()=>({
    lang:document.documentElement.lang,
    weather:document.querySelector('#weather option[value="none"]')?.textContent?.trim(),
    terrain:document.querySelector('#terrain option[value="none"]')?.textContent?.trim(),
    screen:document.querySelector('#screen option[value="none"]')?.textContent?.trim(),
    format:document.querySelector('#battleFormat')?.selectedOptions?.[0]?.textContent?.trim(),
    board:document.querySelector('#boardSummary')?.textContent?.trim(),
    damage:document.querySelector('#miniDamage')?.textContent?.trim(),
    verdict:document.querySelector('#miniVerdict')?.textContent?.trim(),
    resultDamage:document.querySelector('#damage')?.textContent?.trim(),
    resultPercent:document.querySelector('#percent')?.textContent?.trim(),
    koVerdict:document.querySelector('#koVerdict')?.textContent?.trim(),
    koDetail:document.querySelector('#koVerdictDetail')?.textContent?.trim(),
    attAbility:document.querySelector('#attAbility')?.selectedOptions?.[0]?.textContent?.trim(),
    defAbility:document.querySelector('#defAbility')?.selectedOptions?.[0]?.textContent?.trim(),
    attItem:document.querySelector('#attItem')?.selectedOptions?.[0]?.textContent?.trim(),
    defItem:document.querySelector('#defItem')?.selectedOptions?.[0]?.textContent?.trim(),
    move:document.querySelector('#dbMove')?.selectedOptions?.[0]?.textContent?.trim(),
    hits:document.querySelector('#hits')?.textContent?.trim(),
    selectedMove:document.querySelector('#moveSelected')?.textContent?.trim(),
    swap:document.querySelector('#swapSides')?.textContent?.trim(),
    attackerAdvanced:document.querySelector('#attackerCard details summary')?.textContent?.trim(),
    defenderAbilityLabel:document.querySelector('#defAbility')?.closest('label')?.textContent?.trim(),
    attackerTypes:[...document.querySelectorAll('#attTypes .type-pill')].map(n=>n.textContent.trim()),
    defenderTypes:[...document.querySelectorAll('#defTypes .type-pill')].map(n=>n.textContent.trim()),
    pokemonPlaceholder:document.querySelector('#attPokemonSearch')?.getAttribute('placeholder')||document.querySelector('#defPokemonSearch')?.getAttribute('placeholder'),
    movePlaceholder:document.querySelector('#moveSearch')?.getAttribute('placeholder'),
    selected:Object.fromEntries(Object.keys(window.__roundtripControls||{}).map(id=>[id,document.getElementById(id)?.value]))
   }));
   // Verify all 18 types in both Japanese and English source forms.
   const typeAudit=await page.evaluate(()=>{
    const types=[['ノーマル','Normal'],['ほのお','Fire'],['みず','Water'],['でんき','Electric'],
     ['くさ','Grass'],['こおり','Ice'],['かくとう','Fighting'],['どく','Poison'],
     ['じめん','Ground'],['ひこう','Flying'],['エスパー','Psychic'],['むし','Bug'],
     ['いわ','Rock'],['ゴースト','Ghost'],['ドラゴン','Dragon'],['あく','Dark'],
     ['はがね','Steel'],['フェアリー','Fairy']];
    return types.map(([ja,en])=>({ja,en,fromJa:window.ChlohaLocale.typeName(ja),
     fromEn:window.ChlohaLocale.typeName(en)}));
   });
   for(const t of typeAudit){
    assert.equal(t.fromEn,t.fromJa,'mixed-source type translation '+lang+': '+t.en);
    assert.ok(t.fromJa&&t.fromJa!=='undefined','type label missing '+lang+': '+t.ja);
    if(lang!=='ja')assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(t.fromJa),
     'untranslated type '+lang+': '+t.ja+' => '+t.fromJa);
   }
   // Search suggestions are dynamically generated, so the static UI i18n
   // audit does not cover their names and type badges.
   if(i===0){
    const search=page.locator('#attSearch');
    await search.fill('ガ');
    const suggestions=page.locator('#attSuggestions .pokemon-suggestion');
    const count=await suggestions.count();
    assert.ok(count>0,'Pokémon suggestions must be available in '+lang);
    const labels=await suggestions.allTextContents();
    if(lang!=='ja'){
     for(const label of labels)assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(label),
      'untranslated Pokémon search suggestion in '+lang+': '+label);
    }
    if(lang==='zh-Hans'||lang==='zh-Hant'||lang==='ko'){
     const types=await suggestions.locator('small').allTextContents();
     for(const type of types)assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(type),
      'untranslated Pokémon search type in '+lang+': '+type);
    }
    await search.fill('');
   }
   snapshots.push({transition:from+' → '+lang,...state});
   try{
    assert.equal(state.lang,lang,'html lang');
    for(const [id,value] of Object.entries(exercised))assert.equal(state.selected[id],value,'selected control '+id);
    for(const field of ['weather','terrain','screen'])assert.equal(state[field],none,field);
    if(state.format!==undefined)assert.equal(state.format,double,'battle format');
    // Calculated numeric values must not change when only the UI language changes.
    // Compare numeric results only: labels and range separators are localized.
    const numbers=value=>(String(value||'').match(/\d+(?:\.\d+)?/g)||[]).map(Number);
    const numeric={damage:numbers(state.resultDamage),percent:numbers(state.resultPercent)};
    assert.ok(numeric.damage.length>=2&&numeric.damage[1]>0,
     'real damage must remain nonzero after '+from+' → '+lang+': '+state.resultDamage);
    if(globalBaselineNumeric===null)globalBaselineNumeric=numeric;
    else{
     assert.deepEqual(numeric.damage,globalBaselineNumeric.damage,'damage invariant across all 90 transitions');
     assert.deepEqual(numeric.percent,globalBaselineNumeric.percent,'percentage invariant across all 90 transitions');
    }
    if(i===0)baselineNumeric=numeric;
    else{
     assert.deepEqual(numeric.damage,baselineNumeric.damage,'calculated damage invariant');
     assert.deepEqual(numeric.percent,baselineNumeric.percent,'calculated percentage invariant');
    }
    // Catch untranslated Japanese source leaking into non-Japanese UI, including
    // dynamic KO details and native item/ability selectors.
    if(lang!=='ja'){
     for(const field of ['board','verdict','koVerdict','koDetail','attAbility','defAbility','attItem','defItem']){
      const value=state[field]||'';
      assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(value),field+' has Japanese characters: '+value);
     }
    }
    if(lang!=='ja'){
     for(const field of ['selectedMove','movePlaceholder','swap','defenderAbilityLabel']){
      const value=state[field]||'';
      assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(value),field+' has untranslated Japanese: '+value);
     }
     for(const type of [...state.attackerTypes,...state.defenderTypes])assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(type),'untranslated type badge: '+type);
     if(state.selectedMove)assert.ok(!state.selectedMove.includes('選択中：'),'selected move prefix');
     const expectedSwap={fr:'Inverser les côtés',de:'Seiten tauschen',es:'Intercambiar lados',it:'Scambia lati',ko:'양쪽 교체','zh-Hans':'交换双方','zh-Hant':'交換雙方'};
     const expectedAbility={fr:'Talent du défenseur',de:'Fähigkeit des Verteidigers',es:'Habilidad del defensor',it:'Abilità del difensore',ko:'방어 측 특성','zh-Hans':'防御方特性','zh-Hant':'防禦方特性'};
     if(expectedSwap[lang])assert.ok(state.swap?.includes(expectedSwap[lang]),'swap control must be in '+lang+': '+state.swap);
     if(expectedAbility[lang])assert.ok(state.defenderAbilityLabel?.startsWith(expectedAbility[lang]),'defender ability label must be in '+lang+': '+state.defenderAbilityLabel);
     // Exact localized move and type names: no silent English fallback.
     const expectedEarthquake={en:'Earthquake',fr:'Séisme',de:'Erdbeben',es:'Terremoto',it:'Terremoto',ko:'지진','zh-Hans':'地震','zh-Hant':'地震'};
     const expectedGround={en:'Ground',fr:'Sol',de:'Boden',es:'Tierra',it:'Terra',ko:'땅','zh-Hans':'地面','zh-Hant':'地面'};
     if(exercised.dbMove==='earthquake'&&expectedEarthquake[lang]){
      assert.ok(state.selectedMove?.includes(expectedEarthquake[lang]),'selected move name must be '+lang+': '+state.selectedMove);
      assert.ok(state.selectedMove?.includes(expectedGround[lang]),'selected move type must be '+lang+': '+state.selectedMove);
      assert.ok(state.move?.includes(expectedGround[lang]),'native move option type must be '+lang+': '+state.move);
     }
     // Native item options are part of the visible UI, not just the calculation engine.
     if(lang==='es'){
      assert.ok(!/damage|Sp\\. Def/.test(state.attItem+' '+state.defItem),'Spanish item modifiers must not remain English');
     }
     // Inspect all native item options, including unselected items.
     if(lang==='es'){
      const labels=await page.locator('#attItem option, #defItem option').evaluateAll(nodes=>nodes.map(n=>n.textContent.trim()));
      for(const expected of ['Cinta Elección (Ataque ×1,5)','Gafas Elección (At. Esp. ×1,5)','Cinta Experto (supereficaz ×1,2)']){
       assert.ok(labels.includes(expected),'missing Spanish item translation: '+expected);
      }
     }
    }
    if(lang==='ja')assert.ok(state.board?.startsWith('現在の盤面：天候 雨'), 'Japanese board');
    else assert.ok(state.board&&!state.board.includes('現在の盤面')&&!state.board.includes('Current battlefield: Weather Ninguno'),'board language');
   }catch(e){
    console.error('FAILED rotation '+(rotation+1)+' transition '+from+' → '+lang+'; snapshot='+JSON.stringify(state));
    throw e;
   }
  }
  }
  // Second pass: unsupported abilities must still have localized labels,
  // even though they are intentionally excluded from damage calculations.
  const unsupported=await page.locator('#attAbility option').evaluateAll(nodes=>nodes.find(n=>n.value.startsWith('unsupported:'))?.value||null);
  if(unsupported){
   await page.locator('#attAbility').selectOption(unsupported);
   for(let i=0;i<steps.length;i++){
    const lang=steps[i][0],from=i===0?'initial':steps[i-1][0];
    await selector.selectOption(lang);
    await page.waitForTimeout(120);
    const label=await page.locator('#attAbility').evaluate(el=>el.selectedOptions[0]?.textContent?.trim()||'');
    try{
     assert.ok(label,'unsupported ability label must not be empty');
     if(lang!=='ja')assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(label),'untranslated unsupported ability: '+label);
    }catch(e){
     console.error('FAILED unsupported ability transition '+from+' → '+lang+'; option='+unsupported+' label='+JSON.stringify(label));
     throw e;
    }
   }
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS nine starting locales x ten transitions (90 checks), plus unsupported ability pass; snapshots='+snapshots.length);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
