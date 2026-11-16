'use strict';
// Retry transient GET transport responses only. Never accept a 5xx response or
// retry away a 200 response that would expose an archive expected to be absent.
async function get(request,url,report,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))){
 for(let attempt=1;attempt<=5;attempt++){
  const response=await request.get(url,{timeout:60000});
  if(![429,502,503,504].includes(response.status())||attempt===5)return response;
  (report.transportRetries??=[]).push({url,status:response.status(),attempt});
  await wait(500*2**(attempt-1));
 }
}
module.exports={get};
if(require.main===module){
 const assert=require('node:assert/strict');
 (async()=>{
  for(const [statuses,expected,calls] of [
   [[503,503,404],404,3],[[200,404],200,1],[[404,200],404,1],
   [[503,503,503,503,503,404],503,5],[[429,200],200,2],
  ]){
   let n=0;const report={};
   const request={get:async()=>{const value=statuses[n++];return {status:()=>value};}};
   const r=await get(request,'https://example.invalid/absent.zip',report,async()=>{});
   assert.equal(r.status(),expected);assert.equal(n,calls);
   assert.equal(report.transportRetries?.length||0,calls-1);
  }
  console.log('PASS bounded HTTP retries: absence/exposure and failure assertions preserved');
 })().catch(e=>{console.error(e);process.exitCode=1});
}
