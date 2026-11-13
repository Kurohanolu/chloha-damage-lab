'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const selector=page.locator('#chloha-locale');
  const snapshots={};
  for(const locale of locales){
   await selector.selectOption(locale);
   snapshots[locale]=await page.evaluate(()=>{
    const all=[...document.querySelectorAll('select')].filter(s=>s.id!=='chloha-locale');
    return all.flatMap(s=>[...s.options].map((o,i)=>({
     select:s.id,index:i,value:o.value,text:o.textContent.trim(),label:o.label
    })));
   });
  }
  const key=o=>o.select+'|'+o.value+'|'+o.index;
  const japanese=new Map(snapshots.ja.map(o=>[key(o),o]));
  const english=new Map(snapshots.en.map(o=>[key(o),o]));
  const suspicious=[];
  let total=0;
  for(const locale of locales.slice(1)){
   let tested=0;
   for(const option of snapshots[locale]){
    const k=key(option),ja=japanese.get(k),en=english.get(k);
    if(!ja||!en)continue;
    tested++;total++;
    if(option.text!==option.label)suspicious.push({locale,select:option.select,value:option.value,reason:'native-label-mismatch',text:option.text,label:option.label});
    if(/[ぁ-んァ-ヶ]/.test(option.text))suspicious.push({locale,select:option.select,value:option.value,reason:'Japanese-kana',text:option.text});
    if(locale!=='en'&&ja.text!==en.text&&option.text===en.text&&/[A-Za-z]/.test(en.text))
     suspicious.push({locale,select:option.select,value:option.value,reason:'English-fallback',text:option.text});
   }
   console.log('AUDIT '+locale+': '+tested+' stable select options');
  }
  const bySelect={};
  const byLocale={};
  for(const item of suspicious){
   const name=item.select||'(unnamed)';
   bySelect[name]=(bySelect[name]||0)+1;
   byLocale[item.locale]=(byLocale[item.locale]||0)+1;
  }
  console.log('AUDIT breakdown by select='+JSON.stringify(bySelect));
  console.log('AUDIT breakdown by locale='+JSON.stringify(byLocale));
  const confirmedKana=suspicious.filter(item=>item.reason==='Japanese-kana');
  const englishMatches=suspicious.filter(item=>item.reason==='English-fallback');
  console.log('AUDIT unresolved Japanese-kana='+confirmedKana.length+
   '; English-equal candidates requiring official-name review='+englishMatches.length);
  const counts={};
  for(const x of suspicious)counts[x.reason]=(counts[x.reason]||0)+1;
  console.log('AUDIT total stable option checks='+total+'; findings='+suspicious.length+'; by reason='+JSON.stringify(counts));
  // English equality is only a review candidate: names such as Pikachu and Raichu
  // legitimately match English in several official localizations.
  // Deduplicate mirrored attacker/defender selectors before human review.
  const reviewGroups={};
  for(const item of englishMatches){
   const group=reviewGroups[item.locale]||(reviewGroups[item.locale]={});
   const kind=item.select==='dbAttPokemon'||item.select==='dbDefPokemon'?'pokemon':item.select;
   const bucket=group[kind]||(group[kind]=new Map());
   bucket.set(item.value,item.text);
  }
  for(const [locale,groups] of Object.entries(reviewGroups)){
   for(const [kind,entries] of Object.entries(groups)){
    console.log('AUDIT REVIEW '+JSON.stringify({locale,kind,unique:entries.size,
     candidates:[...entries].map(([value,text])=>({value,text}))}));
   }
  }
  // Compare exact species names against the bundled PokeAPI official translations.
  // Exclude forms and ambiguous English names: those require separate form-aware verification.
  const official=await page.evaluate(()=>Object.values(window.ChlohaPokeAPILocalizedNames?.pokemon||{})
   .filter(x=>x?.en&&x?.ja).map(x=>({en:x.en,ja:x.ja,
    fr:x.fr,de:x.de,es:x.es,it:x.it,ko:x.ko,'zh-Hans':x['zh-Hans'],'zh-Hant':x['zh-Hant']})));
  const byEnglish=new Map();
  for(const entry of official){
   if(!byEnglish.has(entry.en))byEnglish.set(entry.en,[]);
   byEnglish.get(entry.en).push(entry);
  }
  const officialMismatch=[],officialVerified=[];
  for(const [locale,groups] of Object.entries(reviewGroups)){
   for(const [value,display] of groups.pokemon||[]){
    const matches=byEnglish.get(display)||[];
    if(matches.length!==1||!matches[0][locale])continue;
    const expected=matches[0][locale];
    const item={locale,value,display,expected};
    if(display===expected)officialVerified.push(item);
    else officialMismatch.push(item);
   }
  }
  console.log('AUDIT OFFICIAL species English-equal verified='+officialVerified.length+
   '; official-name mismatches='+officialMismatch.length);
  for(const x of officialMismatch)console.log('AUDIT OFFICIAL MISMATCH '+JSON.stringify(x));
  // Review candidates by canonical species identity, not just English display text.
  // Form variants can share an English base name, so report those separately.
  const speciesIndex=await page.evaluate(()=>({
   names:window.ChlohaPokeAPILocalizedNames?.pokemon||{},
   forms:window.ChlohaFormSpeciesBases||{}
  }));
  const verifiedById=[],needsFormReview=[],needsSpeciesReview=[],canonicalMismatch=[];
  for(const [locale,groups] of Object.entries(reviewGroups)){
   for(const [value,display] of groups.pokemon||[]){
    const exact=speciesIndex.names[value];
    const form=speciesIndex.forms[value];
    if(exact?.[locale]&&exact.en===display){
     const item={locale,value,display,expected:exact[locale]};
     if(display===exact[locale])verifiedById.push(item);
     else canonicalMismatch.push(item);
    }else if(form){
     needsFormReview.push({locale,value,display,baseJa:form.baseJa,
      officialBase:form.base?.[locale]||null});
    }else{
     needsSpeciesReview.push({locale,value,display});
    }
   }
  }
  // Mega forms in Italian use the same English species name with the Mega prefix.
  // Verify that the suffix exactly equals the official Italian base species name.
  // This is a structural check, not a claim that every form title is official.
  const formStructureVerified=[],formStructurePending=[];
  for(const item of needsFormReview){
   const mega=item.locale==='it'&&item.display.startsWith('Mega ');
   const rotom=item.locale==='de'&&item.display.startsWith('Rotom (');
   if(mega&&item.officialBase&&item.display==='Mega '+item.officialBase){
    formStructureVerified.push({...item,rule:'Italian Mega + official base species'});
   }else if(rotom&&item.officialBase==='Rotom'&&item.display==='Rotom (Frost)'){
    formStructurePending.push({...item,rule:'German Rotom form name needs form-specific official check'});
   }else{
    formStructurePending.push(item);
   }
  }
  // The sole previously pending German Frost Rotom has an established form name.
  const frost=await page.evaluate(async()=>{
   document.querySelector('#chloha-locale').value='de';
   document.querySelector('#chloha-locale').dispatchEvent(new Event('change',{bubbles:true}));
   const option=[...document.querySelector('#dbAttPokemon').options]
    .find(x=>x.value==='candidate093_34');
   return option?.textContent.trim()||null;
  });
  console.log('AUDIT GERMAN FROST ROTOM actual='+JSON.stringify(frost));
  assert.equal(frost,'Frost-Rotom','German Frost Rotom must use the verified form name');
  console.log('AUDIT FORM STRUCTURE verified='+formStructureVerified.length+
   '; pending official-form verification='+formStructurePending.length);
  for(const item of formStructurePending)console.log('AUDIT FORM PENDING '+JSON.stringify(item));
  console.log('AUDIT CANONICAL verified='+verifiedById.length+
   '; mismatches='+canonicalMismatch.length+
   '; form-review='+needsFormReview.length+
   '; species-review='+needsSpeciesReview.length);
  for(const item of canonicalMismatch)console.log('AUDIT CANONICAL MISMATCH '+JSON.stringify(item));
  for(const item of needsFormReview)console.log('AUDIT FORM REVIEW '+JSON.stringify(item));
  for(const item of needsSpeciesReview)console.log('AUDIT SPECIES REVIEW '+JSON.stringify(item));

  for(const x of confirmedKana)console.log('AUDIT FINDING '+JSON.stringify(x));
  assert.deepEqual(errors,[],'browser errors during select audit');
  assert.equal(confirmedKana.length,0,'Japanese kana must not remain in non-Japanese native selectors');
  console.log('PASS full native select option audit across nine languages');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
