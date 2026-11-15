'use strict';
// Independent additional boundary cases; real in-memory SQLite and signed synthetic JWTs.
// The harness mocks every external HTTP request. Never connects to production.
const assert=require('node:assert/strict');
(async()=>{
 const {createHarness,reportBody}=await import('../services/feedback/test/harness.mjs');
 const run=async fn=>{const h=await createHarness();try{await fn(h);}finally{h.close();}};
 const send=(h,body)=>h.request('/v1/reports',{method:'POST',body});
 await run(async h=>{
  const valid=await h.token(),parts=valid.split('.');parts[2]=(parts[2][0]==='a'?'b':'a')+parts[2].slice(1);
  assert.equal((await h.request('/v1/admin/reports',{admin:parts.join('.')})).status,401,'modified signature fails');
  const missingEmail=await h.token({email:undefined});assert.equal((await h.request('/v1/admin/reports',{admin:missingEmail})).status,401);
  const response=await h.worker.fetch(new Request('http://127.0.0.1:8787/v1/admin/reports/00000000-0000-4000-8000-000000000000',{method:'PATCH',headers:{'Cf-Access-Jwt-Assertion':valid,'Content-Type':'application/json',Origin:'http://127.0.0.1:8787'},body:'{"revision":1,"status":"Accepted"}'}),h.env);assert.equal(response.status,403,'missing custom mutation header denied before DB access');
 });
 await run(async h=>{
  const first=reportBody(),second={...first,description:'Different payload',turnstileToken:'valid-'+crypto.randomUUID()};
  const results=await Promise.all([send(h,first),send(h,second)]);assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);
 });
 await run(async h=>{
  // Two requests straddle UTC midnight but remain inside the 24h dedup lifetime.
  h.clock.ms=Date.UTC(2026,10,15,23,59,59);const body=reportBody();const first=await send(h,body);assert.equal(first.status,201);const receipt=(await first.json()).receipt;h.clock.ms+=2000;
  const retry=await send(h,{...body,turnstileToken:'valid-'+crypto.randomUUID()});assert.equal(retry.status,201);assert.equal((await retry.json()).receipt,receipt);assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);
 });
 await run(async h=>{
  const id=(await (await send(h,reportBody())).json()).receipt;
  let row=(await (await h.request('/v1/admin/reports/'+id,{admin:true})).json()).report;
  row=(await (await h.request('/v1/admin/reports/'+id,{admin:true,method:'PATCH',body:{revision:row.revision,status:'Accepted'}})).json()).report;
  h.state.github='malformed';const response=await h.request('/v1/admin/reports/'+id+'/issue',{admin:true,method:'POST',body:{revision:row.revision,reviewed:true,title:'Synthetic technical evidence',body:'Reviewed calculation reproduction.'}});assert.equal(response.status,503);assert.equal(h.calls.issues.length,1);
  row=(await (await h.request('/v1/admin/reports/'+id,{admin:true})).json()).report;assert.equal(row.issueState,'creating');
  const retry=await h.request('/v1/admin/reports/'+id+'/issue',{admin:true,method:'POST',body:{revision:row.revision,reviewed:true,title:'Synthetic technical evidence',body:'Reviewed calculation reproduction.'}});assert.equal(retry.status,409);
  const recovered=await h.request('/v1/admin/reports/'+id+'/reconcile',{admin:true,method:'POST',body:{revision:row.revision}});assert.equal(recovered.status,200);assert.equal(h.calls.github.filter(x=>x.method==='POST').length,1);
 });
 console.log('PASS independent Worker boundaries: tampered/missing claims, CSRF header, conflicting race, midnight dedup and malformed-success reconciliation');
})().catch(e=>{console.error(e);process.exitCode=1;});
