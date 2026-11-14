import test from 'node:test';
import assert from 'node:assert/strict';
import {createHarness,reportBody} from './harness.mjs';

const withHarness=fn=>async()=>{const h=await createHarness();try{await fn(h);}finally{h.close();}};
const send=(h,body=reportBody(),options={})=>h.request('/v1/reports',{method:'POST',body,...options});
async function add(h,extra={}){const response=await send(h,reportBody(extra));assert.equal(response.status,201);return (await response.json()).receipt;}
const detail=async(h,id)=>(await (await h.request('/v1/admin/reports/'+id,{admin:true})).json()).report;
async function accepted(h,id){let row=await detail(h,id);const r=await h.request('/v1/admin/reports/'+id,{admin:true,method:'PATCH',body:{revision:row.revision,status:'Accepted'}});assert.equal(r.status,200);return (await r.json()).report;}
const publish=(h,row,extra={})=>h.request('/v1/admin/reports/'+row.id+'/issue',{admin:true,method:'POST',body:{revision:row.revision,reviewed:true,title:'Damage calculation regression',body:'Technical reproduction: neutral attack with the documented inputs.',...extra}});

test('anonymous private intake, four categories, no required email, no public read route',withHarness(async h=>{
 for(const category of ['bug','calculation','translation','feature'])assert.equal((await send(h,reportBody({category}))).status,201);
 assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,4);
 for(const path of ['/v1/reports','/v1/reports/anything','/v1/admin/reports','/admin/','/admin/admin.js'])assert.notEqual((await h.request(path)).status,200,path);
 const response=await h.request('/v1/admin/reports',{admin:true});assert.equal(response.status,200);const data=await response.json();assert.equal(data.reports.length,4);
 assert.ok(data.reports.every(r=>!('email' in r)&&!('description' in r)&&!('actor_hash' in r)));
 assert.match(response.headers.get('Cache-Control'),/no-store/);assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
 assert.equal(Object.keys(h.db.sqlite.prepare('SELECT * FROM reports LIMIT 1').get()).some(k=>/^(?:ip|ip_address|user_agent|fingerprint|actor_hash)$/.test(k)),false);
}));
test('configuration and transport fail closed; local mode cannot be deployed on a public host',withHarness(async h=>{
 h.env.INTAKE_ENABLED='false';assert.equal((await send(h)).status,503);assert.equal((await h.request('/v1/config')).status,503);
 h.env.INTAKE_ENABLED='true';h.env.RATE_LIMIT_SECRET='';assert.equal((await send(h)).status,503);
 h.env.ENVIRONMENT='production';assert.equal((await h.request('/v1/config')).status,503);
 h.env.ENVIRONMENT='local';const response=await h.worker.fetch(new Request('https://not-local.invalid/v1/config'),h.env);assert.equal(response.status,503);
 assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);
}));
test('server validation rejects malformed/oversized/unknown/PII snapshot fields without reflecting inputs',withHarness(async h=>{
 const invalid=[{category:'unknown'},{description:''},{description:'x'.repeat(5001)},{email:'invalid'},{locale:'xx'},{requestId:'bad'},{website:'https://bot.invalid'},{unknown:'secret-value'},{snapshot:{schemaVersion:1,email:'private@example.test'}},{description:'\0invalid'},{turnstileToken:''}];
 for(const extra of invalid){const r=await send(h,reportBody(extra));assert.equal(r.status,400,JSON.stringify(extra).slice(0,80));assert.ok(!(await r.text()).includes('secret-value'));}
 assert.equal((await h.request('/v1/reports',{method:'POST',raw:'{'})).status,400);
 assert.equal((await h.request('/v1/reports',{method:'POST',raw:JSON.stringify(reportBody({description:'x'.repeat(40000)}))})).status,413);
 assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);
}));
test('streaming body limit applies without Content-Length; non-JSON and bad origins fail',withHarness(async h=>{
 let count=0;const stream=new ReadableStream({pull(c){if(count++<3)c.enqueue(new Uint8Array(16000));else c.close();}});
 const response=await h.worker.fetch(new Request('http://127.0.0.1:8787/v1/reports',{method:'POST',headers:{'Origin':h.env.ALLOWED_ORIGINS,'Content-Type':'application/json'},body:stream,duplex:'half'}),h.env);assert.equal(response.status,413);
 const raw=new Request('http://127.0.0.1:8787/v1/reports',{method:'POST',headers:{Origin:h.env.ALLOWED_ORIGINS,'Content-Type':'text/plain'},body:'{}'});assert.equal((await h.worker.fetch(raw,h.env)).status,415);
 assert.equal((await send(h,reportBody(),{headers:{Origin:'https://attacker.invalid'}})).status,403);
 const preflight=await h.request('/v1/reports',{method:'OPTIONS'});assert.equal(preflight.status,204);assert.equal(preflight.headers.get('Access-Control-Allow-Origin'),h.env.ALLOWED_ORIGINS);
}));
test('Turnstile verifies success, hostname, action, expiry and local replay rejection; outage never succeeds',withHarness(async h=>{
 for(const mode of ['failed','hostname','action','expired','offline']){h.state.challenge=mode;assert.equal((await send(h)).status,mode==='offline'?503:403);}
 h.state.challenge='success';h.clock.ms+=601000;const body=reportBody();assert.equal((await send(h,body)).status,201);assert.equal((await send(h,reportBody({turnstileToken:body.turnstileToken}))).status,403);
 assert.ok(h.calls.siteverify.every(c=>!('remoteip' in c)));assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);
}));
test('atomic per-client and global rate limits reject bursts, including concurrent submissions',withHarness(async h=>{
 const responses=await Promise.all(Array.from({length:10},()=>send(h)));assert.equal(responses.filter(r=>r.status===201).length,6);assert.equal(responses.filter(r=>r.status===429).length,4);
 h.clock.ms+=601000;const t=Math.floor(h.clock.ms/1000);h.db.sqlite.prepare('INSERT OR REPLACE INTO rate_buckets VALUES(?,?,?)').run('all10:'+Math.floor(t/600)+':all',100,t+600);
 assert.equal((await send(h,reportBody(),{headers:{'CF-Connecting-IP':'203.0.113.250'}})).status,429);
}));
test('idempotent retries use fresh challenges; changed payload/client cannot take over a request ID',withHarness(async h=>{
 const body=reportBody({email:'reply@example.test'}),first=await send(h,body),id=(await first.json()).receipt;
 const duplicate=await send(h,{...body,turnstileToken:'valid-'+crypto.randomUUID()});assert.equal(duplicate.status,201);assert.equal((await duplicate.json()).receipt,id);
 assert.equal((await send(h,{...body,description:'Changed',turnstileToken:'valid-'+crypto.randomUUID()})).status,409);
 assert.equal((await send(h,{...body,turnstileToken:'valid-'+crypto.randomUUID()},{headers:{'CF-Connecting-IP':'198.51.100.9'}})).status,409);
 assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);
}));
test('concurrent identical retries create exactly one private report',withHarness(async h=>{
 const body=reportBody();const responses=await Promise.all([send(h,body),send(h,{...body,turnstileToken:'valid-'+crypto.randomUUID()})]);const payloads=await Promise.all(responses.map(r=>r.json()));assert.equal(responses[0].status,201);assert.equal(responses[1].status,201);assert.equal(payloads[0].receipt,payloads[1].receipt);assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,1);
}));
test('administrator JWT verification checks signature, expiry, issuer, audience, type and allowlist',withHarness(async h=>{
 const cases=[['malformed',401],[await h.token({}, {audience:'wrong'}),401],[await h.token({}, {issuer:'https://wrong.cloudflareaccess.com'}),401],[await h.token({}, {expiration:Math.floor(h.clock.ms/1000)-60}),401],[await h.token({email:'other@example.test'}),403],[await h.token({type:'service'}),403]];
 for(const [admin,status] of cases)assert.equal((await h.request('/v1/admin/reports',{admin})).status,status);
 assert.equal((await h.request('/v1/admin/reports',{admin:true})).status,200);
 const page=await h.request('/admin/',{admin:true});assert.equal(page.status,200);assert.match(page.headers.get('content-security-policy'),/frame-ancestors 'none'/);
 h.env.ADMIN_EMAILS='';assert.equal((await h.request('/v1/admin/reports',{admin:true})).status,503);
}));
test('admin CSRF, category/status filters, revision conflicts and parameterized text are enforced',withHarness(async h=>{
 const dangerous='<img src=x onerror="window.stolen=true"><script>alert(1)</script>\n\'; DROP TABLE reports; --';const id=await add(h,{description:dangerous,email:'private@example.test'});let row=await detail(h,id);assert.equal(row.description,dangerous);assert.equal(row.email,'private@example.test');
 const token=await h.token();const forged=new Request('http://127.0.0.1:8787/v1/admin/reports/'+id,{method:'PATCH',headers:{'Content-Type':'application/json','Cf-Access-Jwt-Assertion':token,'Origin':'https://attacker.invalid','X-Chloha-Admin':'1'},body:JSON.stringify({revision:row.revision,status:'Accepted'})});assert.equal((await h.worker.fetch(forged,h.env)).status,403);
 assert.equal((await h.request('/v1/admin/reports/'+id,{admin:true,method:'PATCH',body:{revision:999,status:'Accepted'}})).status,409);
 assert.equal((await h.request('/v1/admin/reports/'+id,{admin:true,method:'PATCH',body:{revision:row.revision,status:'INVALID'}})).status,400);
 row=await accepted(h,id);const filtered=await h.request('/v1/admin/reports?category=bug&status=Accepted',{admin:true});assert.equal((await filtered.json()).reports.length,1);
 assert.equal((await h.request('/v1/admin/reports?category=other',{admin:true})).status,400);
 assert.equal((await h.request('/v1/admin/reports?status=New',{admin:true})).status,200);
 assert.equal((await h.request('/v1/admin/reports/'+id,{admin:true,method:'DELETE',body:{revision:row.revision,confirmed:false}})).status,400);
 assert.equal((await h.request('/v1/admin/reports/'+id,{admin:true,method:'DELETE',body:{revision:row.revision,confirmed:true}})).status,200);
 assert.equal((await h.request('/v1/admin/reports/'+id,{admin:true})).status,404);assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM request_dedup').get().n,0);
}));
test('only explicitly reviewed Accepted reports publish manually written technical summaries without personal data',withHarness(async h=>{
 const id=await add(h,{description:'Private personal report that must never be auto-published.',email:'private@example.test'});let row=await detail(h,id);assert.equal((await publish(h,row)).status,409);row=await accepted(h,id);
 assert.equal((await publish(h,row,{reviewed:false})).status,400);assert.equal((await publish(h,row,{body:'Contact private@example.test'})).status,400);assert.equal((await publish(h,row,{body:'Token ghp_abcdefghijklmnopqrstuvwxyz0123456789'})).status,400);
 const responses=await Promise.all([publish(h,row),publish(h,row)]);assert.equal(responses.filter(r=>r.status===201).length,1);assert.equal(h.calls.github.filter(c=>c.method==='POST').length,1);
 const issue=h.calls.issues[0];assert.ok(issue.body.includes('chloha-feedback:'+id));assert.ok(!issue.body.includes('private@example.test'));assert.ok(!issue.body.includes('Private personal report'));assert.ok(!JSON.stringify(issue).includes(h.env.GITHUB_TOKEN));
 row=await detail(h,id);assert.equal(row.issueState,'created');assert.equal((await publish(h,row)).status,200);assert.equal(h.calls.github.filter(c=>c.method==='POST').length,1);
}));
test('ambiguous GitHub result is never reposted; reconciliation links the existing marker',withHarness(async h=>{
 const id=await add(h),row=await accepted(h,id);h.state.github='timeout-after-create';assert.equal((await publish(h,row)).status,503);
 let current=await detail(h,id);assert.equal(current.issueState,'uncertain');assert.equal((await publish(h,current)).status,409);assert.equal(h.calls.github.filter(c=>c.method==='POST').length,1);
 const result=await h.request('/v1/admin/reports/'+id+'/reconcile',{admin:true,method:'POST',body:{revision:current.revision}});assert.equal(result.status,200);current=await detail(h,id);assert.equal(current.issueState,'created');assert.equal(h.calls.github.filter(c=>c.method==='POST').length,1);
}));
test('definite GitHub rejection is retryable; unconfirmed server failure stays blocked',withHarness(async h=>{
 const id=await add(h);let row=await accepted(h,id);h.state.github='forbidden';assert.equal((await publish(h,row)).status,503);row=await detail(h,id);assert.equal(row.issueState,'none');h.state.github='server-error';assert.equal((await publish(h,row)).status,503);row=await detail(h,id);assert.equal(row.issueState,'uncertain');
 assert.equal((await h.request('/v1/admin/reports/'+id+'/reconcile',{admin:true,method:'POST',body:{revision:row.revision}})).status,409);assert.equal((await publish(h,row)).status,409);assert.equal(h.calls.github.filter(c=>c.method==='POST').length,2);
}));
test('expired reports are inaccessible and scheduled purge removes records and temporary abuse/dedup data',withHarness(async h=>{
 const id=await add(h,{email:'expired@example.test'});h.clock.ms+=91*86400000;assert.equal((await h.request('/v1/admin/reports/'+id,{admin:true})).status,404);assert.equal((await h.request('/v1/admin/reports',{admin:true})).status,200);
 await h.worker.scheduled({},h.env);for(const table of ['reports','request_dedup','rate_buckets','used_challenges'])assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM '+table).get().n,0,table);
}));
