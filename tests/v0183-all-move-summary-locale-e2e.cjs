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
   const primary=window.ChlohaLocalizedNames?.moves||{};
   const secondary=window.ChlohaPokeAPILocalizedNames?.moves||{};
   const rows=Object.values({...secondary,...primary}).filter(x=>x?.ja&&x?.en);
   const results={};
   for(const locale of locales){
    window.ChlohaLocale.set(locale);
    const failures=[];
    let checked=0,missing=0;
    for(const row of rows){
     if(!row[locale]){missing++;continue;}
     const text=window.ChlohaLocale.text('Garchomp '+row.ja+' (165) → Tyranitar (130 / HP 175)');
     checked++;
     if(!text.includes(' '+row[locale]+' (165)')||
        (locale!=='en'&&row[locale]!==row.ja&&text.includes(' '+row.ja+' (165)')))
      failures.push({ja:row.ja,expected:row[locale],actual:text});
    }
    results[locale]={checked,missing,failures};
   }
   return {count:rows.length,results};
  });
  for(const [locale,data] of Object.entries(report.results)){
   console.log('AUDIT DYNAMIC MOVE '+locale+' checked='+data.checked+' missing-name-data='+data.missing+' failures='+data.failures.length+' examples='+JSON.stringify(data.failures.slice(0,12)));
   assert.equal(data.failures.length,0,'Dynamic move-name failures for '+locale);
  }
  assert.deepEqual(errors,[],'browser errors during all-move audit');
  console.log('PASS all available localized move names in dynamic battle summaries');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
