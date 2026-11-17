'use strict';
const assert=require('node:assert/strict');
const {checkProduction,readSettings}=require('../scripts/feedback-production-check.cjs');
const requiredLocales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
assert.deepEqual(readSettings().requiredLocales,[],'Owner-approved ES-LA pause leaves the existing backend unchanged');
(async()=>{
 for(const supportedLocales of [undefined,[],requiredLocales.filter(x=>x!=='es-LA'),requiredLocales.map(x=>x==='es-LA'?'es-419':x),[...requiredLocales,'en'],[...requiredLocales,'xx'],requiredLocales.map(x=>x==='es-LA'?null:x),requiredLocales]){
  const calls=[];
  const fetchImpl=async(url,options)=>{
   calls.push(url);assert.equal(options.method,'GET');assert.equal(options.body,undefined);
   const path=new URL(url).pathname;
   if(path==='/v1/config')return Response.json({enabled:true,mode:'production',siteKey:'production-site-key-placeholder',retentionDays:90,supportedLocales},{headers:{'Access-Control-Allow-Origin':'https://kurohanolu.github.io','Cache-Control':'no-store'}});
   return new Response(null,{status:path==='/v1/reports'?405:401});
  };
  const result=await checkProduction({apiBase:'https://feedback.example.com',publicOrigin:'https://kurohanolu.github.io',requiredLocales,fetchImpl});
  assert.equal(result.ready,supportedLocales===requiredLocales);
  assert.equal(calls.length,5);
 }
 console.log('PASS v1.1.0 production feedback locale readiness: old/absent/aliased capabilities fail closed; no report submitted');
})().catch(error=>{console.error(error);process.exitCode=1;});
