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
  const result=await page.evaluate(()=>{
   const locales=['en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
   const names=window.ChlohaPokeAPILocalizedNames||{};
   const move=Object.values(names.moves||{}).find(row=>row?.ja==='だいばくはつ');
   const out={};
   for(const locale of locales){
    window.ChlohaLocale.set(locale);
    const warning=window.ChlohaLocale.text('選択技「だいばくはつ」の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。');
    out[locale]={warning,expected:move?.[locale]};
   }
   return out;
  });
  for(const [locale,data] of Object.entries(result)){
   assert.ok(data.expected,'missing official move name '+locale);
   assert.ok(data.warning.includes(data.expected),'warning missing '+locale+' move name: '+data.warning);
   assert.ok(!data.warning.includes('だいばくはつ'),'Japanese move leaked into '+locale+' warning');
   assert.ok(!data.warning.includes('習得可否'),'Japanese warning leaked into '+locale);
  }
  assert.deepEqual(errors,[],'browser errors');
  console.log('PASS: dynamic unverified-move warnings localize move names in all eight non-Japanese locales');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
