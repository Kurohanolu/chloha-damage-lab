'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const typeSource=fs.readFileSync(path.resolve(__dirname,'../i18n.js'),'utf8');
const typeMatch=typeSource.match(/const localizedTypeNames=(\{[^;]+\});/);
assert.ok(typeMatch,'localized type dictionary must exist');
const canonicalTypes=JSON.parse(typeMatch[1]);
const referenceTypes=require('./v0183-type-reference.json').types;
const europeanOfficial=require('./v0183-european-official-types.json').types;
const officialZhHans=require('./v0183-zh-hans-official-types.json');
assert.deepEqual(Object.values(canonicalTypes).map(x=>x['zh-Hans']),officialZhHans.types,
 'Simplified Chinese type labels differ from official mainland Pokémon Pokédex');

for(const locale of ['fr','de','es','it']){
 const actual=Object.values(canonicalTypes).map(names=>names[locale]);
 assert.deepEqual(actual,europeanOfficial[locale],
  'official Pokémon 18-type names mismatch for '+locale);
}

// Independent English game-type reference from the official Pokémon Pokédex
// type filter (pokemon.com/pokedex/), not copied from our i18n dictionary.
// Keep official evidence separate from the internal regression fixture.
const officialEnglishTypes=[
 'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
 'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark',
 'Steel','Fairy'
];
assert.deepEqual(Object.values(referenceTypes.en).sort(),[...officialEnglishTypes].sort(),
 'English type reference differs from official Pokémon Pokédex type names');

for(const locale of ['en','fr','de','es','it','ko','zh-Hans','zh-Hant']){
 assert.deepEqual(Object.fromEntries(Object.entries(canonicalTypes).map(([ja,names])=>[ja,names[locale]])),referenceTypes[locale],
  'type dictionary differs from independent reference baseline for '+locale);
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  // Independently reviewed official Pokémon names, keyed by National Dex.
  // Only the fixture entries are official-verified; never imply full coverage.
  const officialEuSpecies=require('./v0183-european-official-species.json').species;
  const officialEuResults=await page.evaluate(entries=>
   entries.flatMap(entry=>Object.entries(entry.names).map(([locale,record])=>({
    nationalDex:entry.nationalDex,locale,expected:record.name,
    actual:window.ChlohaLocalePokemonName(entry.key,locale)
   }))),officialEuSpecies);
  assert.deepEqual(officialEuResults.filter(row=>
   String(row.actual).normalize('NFC')!==row.expected.normalize('NFC')),[],
   'EU species spellings differ from individually sourced official names');
  // Audit the entire registered Pokémon-name dictionary, not just roster
  // options or the handful of official-source samples. Missing translations
  // remain reported as debt until independently reviewed; never auto-pass
  // them as official spellings or silently fill them from another language.
  const asianDictionaryAudit=await page.evaluate(()=>{
   const registry=window.ChlohaPokeAPILocalizedNames?.pokemon||{};
   const locales=['ko','zh-Hans','zh-Hant'];
   const totals=Object.fromEntries(locales.map(locale=>[locale,{registered:0,missing:[],unresolved:[]}]));
   for(const [id,record] of Object.entries(registry)){
    for(const locale of locales){
     const stats=totals[locale],value=record?.[locale];
     if(!value||!String(value).trim()){stats.missing.push(id);continue;}
     stats.registered++;
     const display=window.ChlohaLocalePokemonName?.(id,locale);
     if(!display||String(display).normalize('NFC')!==String(value).normalize('NFC'))
      stats.unresolved.push(id);
    }
   }
   return {species:Object.keys(registry).length,locales:totals};
  });
  for(const locale of ['ko','zh-Hans','zh-Hant']){
   const stats=asianDictionaryAudit.locales[locale];
   assert.equal(stats.registered+stats.missing.length,asianDictionaryAudit.species,
    'Asian registry accounting mismatch: '+locale);
   assert.deepEqual(stats.unresolved,[],
    'Asian localized-name resolver mismatch: '+locale);
  }
  console.log('Asian dictionary audit (coverage, NOT official verification): '+
   JSON.stringify(asianDictionaryAudit));
  // Asian three-locale regression baseline. Provenance status is deliberately
  // separate from the official-verified European fixture.
  const asianFixture=require('./v0183-asian-species-regression.json');
  assert.equal(asianFixture.verificationStatus,'partial-official-source-review',
   'Asian samples must carry honest source-verification status');
  const asianProvenance=asianFixture.species.flatMap(entry=>
   Object.keys(entry.names).map(locale=>({
    dex:entry.nationalDex,locale,source:entry.officialSources?.[locale]||null
   })));
  for(const entry of asianProvenance.filter(x=>x.source))
   assert.match(entry.source,/^https:\/\//,'official source must be an HTTPS URL');
  // The two mainland-China samples are tied to numbered official Pokédex
  // detail pages. A generic homepage is not enough for this stricter check.
  for(const entry of asianFixture.species){
   const source=entry.officialSources?.['zh-Hans'];
   assert.ok(source&&new URL(source).pathname.endsWith('/'+
    String(entry.nationalDex).padStart(4,'0')),
    'Simplified Chinese sample requires numbered official Pokédex source: '+entry.key);
   assert.ok(new URL(source).hostname==='pokemon.cn'||new URL(source).hostname.endsWith('.pokemon.cn'),
    'Simplified Chinese source must be hosted by pokemon.cn');
  }
  console.log('Asian official-source provenance: '+JSON.stringify({
   reviewed:asianProvenance.filter(x=>x.source).length,
   pending:asianProvenance.filter(x=>!x.source).map(x=>x.dex+':'+x.locale)
  }));
  const asianResults=await page.evaluate(entries=>
   entries.flatMap(entry=>Object.entries(entry.names).map(([locale,expected])=>({
    nationalDex:entry.nationalDex,locale,expected,
    actual:window.ChlohaLocalePokemonName(entry.key,locale)
   }))),asianFixture.species);
  assert.deepEqual(asianResults.filter(row=>
   String(row.actual).normalize('NFC')!==row.expected.normalize('NFC')),[],
   'Asian Korean/Simplified/Traditional Chinese species regression mismatch');
  // Registry-level completeness: official fixture species must be registered
  // in the translation data even when they are NOT in the battle roster.
  // This catches the missing Pikachu mapping that roster-only checks missed.
  const speciesRegistryAudit=await page.evaluate(entries=>{
   const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
   const registry=window.ChlohaPokeAPILocalizedNames?.pokemon||{};
   return entries.flatMap(entry=>{
    const record=registry[entry.key];
    return locales.flatMap(locale=>{
     const raw=record?.[locale];
     const resolved=window.ChlohaLocalePokemonName?.(entry.key,locale);
     return raw&&resolved&&String(raw).normalize('NFC')===String(resolved).normalize('NFC')
      ? [] : [{nationalDex:entry.nationalDex,key:entry.key,locale,raw:raw||null,resolved:resolved||null}];
    });
   });
  },officialEuSpecies);
  assert.deepEqual(speciesRegistryAudit,[],
   'official fixture species must exist in the full nine-locale registry, even outside the roster');
  // Every previously missing form must now have a source-backed base species
  // in all eight non-Japanese locales. This checks data coverage, not whether
  // each constructed form label has been verified as an official spelling.
  const formCoverage=await page.evaluate(()=>{
   const db=window.ChlohaFormSpeciesBases||{};
   const locales=['en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
   return {count:Object.keys(db).length,
    missing:Object.entries(db).flatMap(([id,record])=>
     locales.filter(locale=>!record.base?.[locale])
      .map(locale=>id+':'+locale)),
    unexpected:Object.entries(db).filter(([,record])=>record.status!=='base-verified-form-provisional')
     .map(([id])=>id)};
  });
  // Render every missing form in each locale, rather than merely checking
  // that a translated base species exists in the backing dictionary.
  const formLabelsCoverage=await page.evaluate(()=>{
   const source=window.ChlohaFormSpeciesBases||{};
   const species=window.ChlohaPokeAPILocalizedNames?.pokemon||{};
   const known=Object.keys(source);
   const suffixes=new Set(known.map(id=>source[id].ja.match(/\(([^)]+)\)$/)?.[1]).filter(Boolean));
   const recognized=new Set(['オス','メス','シールド','ブレード','ウォッシュ','ヒート','カット','フロスト','スピン','ハイ','ロー','グリーン','ブルー','イエロー','ホワイト','えいえんのはな','かくとう','ほのお','みず','ナイーブ','マイティ']);
   const missingSuffixes=[...suffixes].filter(x=>!recognized.has(x));
   const missingSpecies=known.filter(id=>!source[id]?.base?.en);
   return {missingSuffixes,missingSpecies,all:known.length};
  });
  assert.deepEqual(formLabelsCoverage.missingSuffixes,[],'all Pokémon form qualifiers have localized display labels');
  assert.deepEqual(formLabelsCoverage.missingSpecies,[],'all form base species have English names');
  assert.equal(formCoverage.count,129,'all 129 missing form records have species bases');
  assert.deepEqual(formCoverage.missing,[],'eight-language species base coverage');
  assert.deepEqual(formCoverage.unexpected,[],'provisional forms must remain explicitly labeled');
  // Audit the actual localizedName() display resolver for all 373 roster
  // Pokémon and every non-Japanese locale (not just backing data presence).
  const rosterDisplayAudit=await page.evaluate(()=>{
   const locales=['en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
   const roster=[...document.querySelectorAll('#dbAttPokemon option')].map(o=>({id:o.value})).filter(o=>o.id);
   const errors=[];
   for(const p of roster){
    for(const locale of locales){
     const value=window.ChlohaLocalePokemonName?.(p.id,locale);
     if(!value||/[ぁ-ゟ゠-ヿ]/u.test(value)||value===p.id)
      errors.push({id:p.id,locale,value});
    }
   }
   return {roster:roster.length,checked:roster.length*locales.length,errors};
  });
  // Independent official Pokémon World Championships multilingual dictionary
  // (WC12_Battle_Dictionary.pdf): Charizard names are not derived from the
  // application's localization dictionaries. Keep provenance explicit.
  const officialSpeciesSamples=await page.evaluate(()=>[
   ['charizard','en','Charizard'],
   ['charizard','fr','Dracaufeu'],
   ['charizard','de','Glurak'],
   ['charizard','ko','리자몽']
  ].map(([id,locale,expected])=>({id,locale,expected,actual:window.ChlohaLocalePokemonName(id,locale)})));
  assert.deepEqual(officialSpeciesSamples.filter(x=>x.actual!==x.expected),[],
   'official multilingual Charizard spellings differ from displayed labels');
  // Reference spellings: official French Mega Evolution site, official
  // Chinese Palafin Pokédex and Bulbapedia multilingual form table.
  const officialFormSamples=await page.evaluate(()=>[
   ['mega_charizard_x','fr','Méga-Dracaufeu X'],
   ['mega_charizard_x','it','MegaCharizard X'],
   ['gw_screen_087','fr','Superdofin (Forme Ordinaire)'],
   ['gw_screen_087','zh-Hans','海豚侠 (平凡形态)'],
   ['gw_screen_087','zh-Hant','海豚俠 (平凡形態)'],
   ['gw_screen_088','zh-Hans','海豚侠 (全能形态)']
  ].map(([id,locale,expected])=>({id,locale,expected,actual:window.ChlohaLocalePokemonName(id,locale)})));
  assert.deepEqual(officialFormSamples.filter(x=>x.actual!==x.expected),[],
   'officially cross-checked Mega and Palafin form spellings');
  assert.equal(rosterDisplayAudit.roster,373,'all roster Pokémon audited');
  assert.equal(rosterDisplayAudit.checked,2984,'eight-language roster display checks');
  assert.deepEqual(rosterDisplayAudit.errors,[],'no missing, Japanese, or internal-ID display names');
  // A form generated from the official species name must also be discoverable
  // when users type its translated name, not merely when browsing the roster.
  const formSearchCases=[
   ['en','Mega Charizard X','mega_charizard_x'],
   ['fr','Méga-Dracaufeu X','mega_charizard_x'],
   ['ko','메가리자몽 X','mega_charizard_x'],
   ['zh-Hans','超级喷火龙 X','mega_charizard_x']
  ];
  for(const [locale,term,id] of formSearchCases){
   await page.locator('#chloha-locale').selectOption(locale);
   await page.locator('#attSearch').fill(term);
   const suggestions=page.locator('#attSuggestions .pokemon-suggestion');
   assert.ok(await suggestions.count()>0,'translated form search returned no results: '+locale+' '+term);
   const text=await suggestions.allTextContents();
   assert.ok(text.some(x=>x.includes(term)),
    'translated form not present in suggestions: '+locale+' '+term);
  }
  // Cover every non-Japanese locale, both attacker and defender search boxes,
  // and verify the suggestion is actually for the requested Pokémon ID.
  const allFormLocales=['en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
  for(const locale of allFormLocales){
   await page.locator('#chloha-locale').selectOption(locale);
   const term=await page.evaluate(lang=>window.ChlohaLocalePokemonName('mega_charizard_x',lang),locale);
   assert.ok(term&&term!=='mega_charizard_x','localized Mega name missing: '+locale);
   for(const side of ['att','def']){
    const input=page.locator('#'+side+'Search');
    const suggestions=page.locator('#'+side+'Suggestions .pokemon-suggestion');
    await input.fill(term);
    const labels=await suggestions.allTextContents();
    assert.ok(labels.some(label=>label.includes(term)),
     'localized Mega form not searchable on '+side+' side in '+locale+': '+term);
    // Verify the suggestion resolves to the exact form, not just a text match.
    await suggestions.filter({hasText:term}).first().click();
    const selected=await page.locator('#db'+(side==='att'?'Att':'Def')+'Pokemon').inputValue();
    assert.equal(selected,'mega_charizard_x',
     'translated Mega search selected wrong Pokémon on '+side+' side in '+locale);
    await input.fill('');
   }
  }
  await page.locator('#attSearch').fill('');
  const selector=page.locator('#chloha-locale');
  // Audit every type option after each locale switch, not only the currently
  // selected type. Catch missing/duplicated labels in hidden dropdown options.
  for(const locale of ['en','fr','de','es','it','ko','zh-Hans','zh-Hant']){
   await selector.selectOption(locale);
   const typeOptions=await page.locator('#moveType option').evaluateAll(nodes=>
    nodes.map(n=>({value:n.value,label:n.textContent.trim()})).filter(n=>n.value));
   assert.equal(typeOptions.length,18,'expected 18 move types in '+locale);
   assert.equal(new Set(typeOptions.map(n=>n.label)).size,18,
    'duplicate localized move type labels in '+locale);
   // All eight global locales: verify every type selector against the
   // central translation catalog, including fallback and secondary slots.
   // The Korean canonical spellings also have an independent fixed baseline.
   const typeAudit=Object.entries(canonicalTypes).map(([ja,names])=>({ja,label:names[locale]}));
   assert.equal(typeAudit.length,18,'type dictionary must contain 18 entries');
   const expectedLabels=typeAudit.map(x=>x.label).sort();
   assert.deepEqual(typeOptions.map(n=>n.label).sort(),expectedLabels,
    'move type dropdown disagrees with '+locale+' type dictionary');
   for(const id of ['attType1','attType2','defType1','defType2']){
    const labels=await page.locator('#'+id+' option').evaluateAll(nodes=>
     nodes.filter(n=>n.value&&n.value!=='none'&&n.value!=='なし')
      .map(n=>n.textContent.trim()));
    const actual=[...new Set(labels)].filter(x=>x!=='없음'&&x!=='None'&&x!=='なし');
    assert.deepEqual(actual.sort(),expectedLabels,
     locale+' type labels regressed in '+id);
   }
   if(locale==='ko'){
    const korean=['노말','불꽃','물','전기','풀','얼음','격투','독','땅','비행','에스퍼','벌레','바위','고스트','드래곤','악','강철','페어리'];
    assert.deepEqual(expectedLabels,[...korean].sort(),
     'Korean canonical 18-type names changed');
   }
   assert.deepEqual(typeOptions.filter(n=>!n.label||/[ぁ-ゟ゠-ヿ]/u.test(n.label)),[],
    'missing or untranslated move type options in '+locale);
   // Full-option audit: include off-screen move and ability entries, not just
   // the selected entry. Values are stable IDs; labels must be localized.
   for(const [id,minimum] of [['dbMove',50],['attAbility',1],['defAbility',1]]){
    const options=await page.locator('#'+id+' option').evaluateAll(nodes=>
     nodes.map(n=>({value:n.value,label:n.textContent.trim()}))
      .filter(n=>n.value&&n.value!=='none'));
    assert.ok(options.length>=minimum,
     id+' option list unexpectedly small in '+locale+': '+options.length);
    const missing=options.filter(n=>!n.label||/[ぁ-ゟ゠-ヿ]/u.test(n.label));
    assert.deepEqual(missing,[],
     'untranslated or empty '+id+' options in '+locale);
   }
  }
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
   // Keep search open across a language transition: its rendered suggestions
   // must be refreshed without requiring the user to retype their query.
   if(i===0){
    const input=page.locator('#attSearch');
    await input.fill('ガ');
    assert.ok(await page.locator('#attSuggestions .pokemon-suggestion').count()>0,
     'live-locale search fixture '+lang);
    const next=cycle[(i+1)%cycle.length][0];
    await selector.selectOption(next);
    const rendered=await page.locator('#attSuggestions .pokemon-suggestion').allTextContents();
    assert.ok(rendered.length>0,'search suggestions survive locale change '+lang+' → '+next);
    if(next!=='ja')for(const label of rendered)
     assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(label),
      'stale Japanese search suggestion after '+lang+' → '+next+': '+label);
    await input.fill('');
    await selector.selectOption(lang);
    // No matching results must also be localized.
    await input.fill('zzzz_no_matching_pokemon_987654');
    const empty=await page.locator('#attSuggestions .pokemon-suggestion-empty').textContent();
    assert.ok(empty,'empty Pokémon search message '+lang);
    if(lang!=='ja')assert.ok(!/[ぁ-ゟ゠-ヿ]/u.test(empty),
     'untranslated empty search message '+lang+': '+empty);
    await input.fill('');
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
