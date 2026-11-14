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
  const report=await page.evaluate(()=>{
   const locales=['en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
   const registry=window.ChlohaPokeAPILocalizedNames||{};
   const source={};
   window.ChlohaLocale.set('ja');
   for(const kind of ['abilities','items']){
    const selects=[...document.querySelectorAll('select')].filter(x=>kind==='abilities'?/ability/i.test(x.id):/item/i.test(x.id));
    source[kind]=selects.flatMap(select=>[...select.options].map((option,index)=>({
     id:select.id,index,value:option.value,ja:option.textContent.trim(),
     canonical:kind==='abilities'?option.textContent.trim().replace(/（(?:一部技のみ対応|対応|効果未対応|未対応)）$/,''):option.textContent.trim().replace(/（.*$/,'').replace(/ \(.*$/,'')
    })));
   }
   const results={};
   for(const locale of locales){
    window.ChlohaLocale.set(locale);
    const failures=[],missingEntries=[];let checked=0,missing=0;
    for(const kind of ['abilities','items']){
     for(const row of source[kind]){
      const table=registry[kind]||{};
      const entry=table[row.canonical]||Object.values(table).find(x=>x?.ja===row.canonical);
      if(!entry?.[locale]){missing++;missingEntries.push({kind,select:row.id,ja:row.canonical});continue;}
      const option=document.getElementById(row.id)?.options[row.index];
      if(!option){failures.push({kind,locale,row,error:'missing option'});continue;}
      checked++;
      const actual=option.textContent.trim();
      if(!actual.toLocaleLowerCase().includes(entry[locale].toLocaleLowerCase()))failures.push({kind,id:row.id,ja:row.canonical,expected:entry[locale],actual});
     }
    }
    results[locale]={checked,missing,missingEntries,failures};
   }
   return results;
  });
  for(const [locale,data] of Object.entries(report)){
   console.log('AUDIT ABILITY/ITEM '+locale+' checked=+data.checked+' missing-data='+data.missing+' failures='+data.failures.length+' missing-samples='+JSON.stringify(data.missingEntries.slice(0,20))+' samples='+JSON.stringify(data.failures.slice(0,12)));
   assert.equal(data.failures.length,0,'ability/item locale failures '+locale);
   // Record missing names for follow-up; do not mark missing translations as verified.
   if(data.missing)console.log('AUDIT MISSING ABILITY/ITEM '+locale+' '+JSON.stringify(data.missingEntries));
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS: all available canonical ability/item names in visible selectors across eight locales');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
