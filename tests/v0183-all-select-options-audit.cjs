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
  for(const x of suspicious.slice(0,35))console.log('AUDIT FINDING '+JSON.stringify(x));
  assert.deepEqual(errors,[],'browser errors during select audit');
  assert.equal(confirmedKana.length,0,'Japanese kana must not remain in non-Japanese native selectors');
  console.log('PASS full native select option audit across nine languages');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
