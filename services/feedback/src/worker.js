import {createRemoteJWKSet, jwtVerify, customFetch} from 'jose';
import '../../../feedback-contract-v0185.js';

const C=globalThis.ChlohaFeedbackContract;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL=/^[^\s@<>]{1,64}@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/;
const VERSION=/^v\d+\.\d+(?: Pre-Release \d+)?$/;
const list=s=>String(s||'').split(',').map(s=>s.trim()).filter(Boolean);
class Failure extends Error{constructor(status,code){super(code);this.status=status;this.code=code;}}
const fail=(status,code)=>{throw new Failure(status,code);};
const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const fields=(x,allowed)=>plain(x)&&Object.keys(x).every(k=>allowed.includes(k));
const canonical=x=>JSON.stringify(x,(_,v)=>plain(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const headers={
 'Cache-Control':'no-store, private', 'X-Content-Type-Options':'nosniff',
 'Referrer-Policy':'no-referrer', 'X-Frame-Options':'DENY',
 'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
};
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...headers,'Content-Type':'application/json; charset=utf-8',...extra}});
async function readJSON(request){
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')||''))fail(415,'content_type');
 if(Number(request.headers.get('content-length'))>C.limits.bodyBytes)fail(413,'too_large');
 const reader=request.body?.getReader();if(!reader)fail(400,'invalid_request');
 const chunks=[];let size=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>C.limits.bodyBytes){await reader.cancel();fail(413,'too_large');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const buffer=new Uint8Array(size);let offset=0;for(const chunk of chunks){buffer.set(chunk,offset);offset+=chunk.length;}
 try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(buffer));}catch{fail(400,'invalid_request');}
}
function validateReport(body){
 if(!fields(body,['requestId','category','description','email','locale','appVersion','snapshot','turnstileToken','website']))fail(400,'invalid_request');
 if(!UUID.test(body.requestId||'')||!C.categories.includes(body.category)||!C.locales.includes(body.locale)||!VERSION.test(body.appVersion||''))fail(400,'invalid_request');
 if(typeof body.description!=='string'||!body.description.trim()||body.description.length>C.limits.description||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(body.description))fail(400,'description');
 if(typeof body.email!=='string'||body.email.length>C.limits.email||(body.email.trim()&&!EMAIL.test(body.email.trim())))fail(400,'email');
 if(body.snapshot!==null&&!C.validateSnapshot(body.snapshot))fail(400,'snapshot');
 if(body.website!==''||typeof body.turnstileToken!=='string'||!body.turnstileToken||body.turnstileToken.length>2048)fail(400,'challenge');
 if(body.snapshot&&body.snapshot.appVersion!==body.appVersion)fail(400,'snapshot');
 return {category:body.category,description:body.description.trim(),email:body.email.trim()||null,locale:body.locale,appVersion:body.appVersion,snapshot:body.snapshot};
}
async function hmac(secret,text){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return [...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function publicReady(env){
 const origins=list(env.ALLOWED_ORIGINS);
 const safeOrigins=origins.length&&origins.every(origin=>{try{const u=new URL(origin);return u.origin===origin&&!u.username&&!u.password&&(u.protocol==='https:'||(env.ENVIRONMENT==='local'&&u.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(u.hostname)));}catch{return false;}});
 return env.INTAKE_ENABLED==='true'&&env.DB&&env.ADMIN_ASSETS&&env.GITHUB_TOKEN&&/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_ISSUER||'')&&env.ACCESS_AUDIENCE&&list(env.ADMIN_EMAILS).length&&env.TURNSTILE_SITE_KEY&&env.TURNSTILE_SECRET?.length>=16&&env.RATE_LIMIT_SECRET?.length>=32&&safeOrigins&&list(env.TURNSTILE_HOSTNAMES).length
  &&(env.ENVIRONMENT==='local'||(!/^[123]x0{10,}/.test(env.TURNSTILE_SITE_KEY)&&!/^[123]x0{10,}/.test(env.TURNSTILE_SECRET)));
}
function transport(request,env){
 const u=new URL(request.url),local=['127.0.0.1','localhost','[::1]'].includes(u.hostname);
 if(env.ENVIRONMENT==='local'){if(!local)fail(503,'unavailable');}
 else if(env.ENVIRONMENT!=='production'||u.protocol!=='https:')fail(503,'unavailable');
}
function corsOrigin(request,env){
 const origin=request.headers.get('origin');
 if(!origin||!list(env.ALLOWED_ORIGINS).includes(origin))fail(403,'origin');
 return {'Access-Control-Allow-Origin':origin,'Vary':'Origin'};
}
function publicRow(row,detail=false){
 const base={id:row.id,category:row.category,status:row.status,createdAt:row.created_at,expiresAt:row.expires_at,revision:row.revision,issueState:row.issue_state,issueNumber:row.issue_number,issueUrl:row.issue_url};
 if(detail)Object.assign(base,{description:row.description,email:row.contact_email,locale:row.locale,appVersion:row.app_version,snapshot:row.snapshot_json?JSON.parse(row.snapshot_json):null});
 return base;
}

// Dependencies are injected only by local/CI code. There is no HTTP or environment auth/Bot bypass.
export function createWorker({externalFetch=globalThis.fetch,now=()=>Date.now(),uuid=()=>crypto.randomUUID()}={}){
 const jwks=new Map();
 const seconds=()=>Math.floor(now()/1000);
 async function authenticate(request,env){
  if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_ISSUER||'')||!env.ACCESS_AUDIENCE||!list(env.ADMIN_EMAILS).length)fail(503,'admin_unavailable');
  const token=request.headers.get('Cf-Access-Jwt-Assertion');if(!token||token.length>16384)fail(401,'unauthorized');
  try{
   if(!jwks.has(env.ACCESS_ISSUER))jwks.set(env.ACCESS_ISSUER,createRemoteJWKSet(new URL(env.ACCESS_ISSUER+'/cdn-cgi/access/certs'),{[customFetch]:externalFetch,timeoutDuration:5000,cacheMaxAge:300000}));
   const {payload}=await jwtVerify(token,jwks.get(env.ACCESS_ISSUER),{algorithms:['RS256'],issuer:env.ACCESS_ISSUER,audience:env.ACCESS_AUDIENCE,requiredClaims:['exp','iat','sub','email'],clockTolerance:5,currentDate:new Date(now())});
   if(payload.type!=='app'||typeof payload.email!=='string'||!list(env.ADMIN_EMAILS).map(x=>x.toLowerCase()).includes(payload.email.toLowerCase()))fail(403,'forbidden');
  }catch(error){if(error instanceof Failure)throw error;fail(401,'unauthorized');}
 }
 function adminMutation(request){
  if(request.headers.get('origin')!==new URL(request.url).origin||request.headers.get('x-chloha-admin')!=='1')fail(403,'origin');
 }
 async function takeLimits(env,actor){
  const t=seconds(),specs=[['ip10',600,6,actor],['ipday',86400,25,actor],['all10',600,100,'all'],['allday',86400,1000,'all']];
  const statements=specs.map(([name,window,limit,key])=>env.DB.prepare('INSERT INTO rate_buckets(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(name+':'+Math.floor(t/window)+':'+key,(Math.floor(t/window)+1)*window+60,limit));
  const results=await env.DB.batch(statements);
  if(results.some(r=>!r.results?.length))fail(429,'rate_limited');
 }
 async function verifyChallenge(token,env){
  let response,result;
  try{
   response=await externalFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:token}),signal:AbortSignal.timeout(8000)});
   if(!response.ok)fail(503,'unavailable');result=await response.json();
  }catch{fail(503,'unavailable');}
  if(result.success!==true||result.action!=='feedback'||!list(env.TURNSTILE_HOSTNAMES).includes(result.hostname)||!Number.isFinite(Date.parse(result.challenge_ts))||Math.abs(now()-Date.parse(result.challenge_ts))>300000)fail(403,'challenge');
  const hash=await hmac(env.RATE_LIMIT_SECRET,'challenge:'+token);
  const inserted=await env.DB.prepare('INSERT INTO used_challenges(token_hash,expires_at) VALUES(?,?) ON CONFLICT DO NOTHING RETURNING token_hash').bind(hash,seconds()+600).first();
  if(!inserted)fail(403,'challenge');
 }
 async function accept(request,env){
  if(!publicReady(env))fail(503,'unavailable');
  const body=await readJSON(request),data=validateReport(body);
  const ip=request.headers.get('CF-Connecting-IP');if(!ip||ip.length>64||!/^[0-9a-fA-F:.]+$/.test(ip))fail(503,'unavailable');
  const day=Math.floor(seconds()/86400),actor=await hmac(env.RATE_LIMIT_SECRET,'actor:'+day+':'+ip),previousActor=await hmac(env.RATE_LIMIT_SECRET,'actor:'+(day-1)+':'+ip);
  await takeLimits(env,actor);await verifyChallenge(body.turnstileToken,env);
  const hash=await hmac(env.RATE_LIMIT_SECRET,'payload:'+canonical(data));
  const checkDuplicate=async()=>{
   const previous=await env.DB.prepare('SELECT * FROM request_dedup WHERE request_id=?').bind(body.requestId).first();
   if(!previous)return null;
   if(previous.expires_at<=seconds()||![actor,previousActor].includes(previous.actor_hash)||previous.payload_hash!==hash)fail(409,'request_conflict');
   const exists=await env.DB.prepare('SELECT id FROM reports WHERE id=? AND expires_at>?').bind(previous.report_id,seconds()).first();
   if(!exists)fail(409,'request_conflict');
   return previous.report_id;
  };
  let receipt=await checkDuplicate();
  if(!receipt){
   const id=uuid(),t=seconds();
   const inserted=await env.DB.batch([
    env.DB.prepare('INSERT INTO reports(id,category,description,contact_email,locale,app_version,snapshot_json,created_at,updated_at,expires_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM request_dedup WHERE request_id=?)').bind(id,data.category,data.description,data.email,data.locale,data.appVersion,data.snapshot?JSON.stringify(data.snapshot):null,t,t,t+C.limits.retentionDays*86400,body.requestId),
    env.DB.prepare('INSERT INTO request_dedup(request_id,report_id,actor_hash,payload_hash,expires_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM reports WHERE id=?) ON CONFLICT DO NOTHING').bind(body.requestId,id,actor,hash,t+86400,id)
   ]);
   receipt=inserted[0].meta.changes? id:await checkDuplicate();if(!receipt)fail(503,'unavailable');
  }
  return json({ok:true,receipt},201);
 }
 async function getReport(env,id){
  const row=await env.DB.prepare('SELECT * FROM reports WHERE id=? AND expires_at>?').bind(id,seconds()).first();if(!row)fail(404,'not_found');return row;
 }
 async function github(env,path,options={}){
  if(env.GITHUB_REPOSITORY!=='Kurohanolu/chloha-damage-lab'||!env.GITHUB_TOKEN)fail(503,'github_unavailable');
  return externalFetch('https://api.github.com/repos/'+env.GITHUB_REPOSITORY+path,{...options,headers:{'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Chloha-private-feedback','Authorization':'Bearer '+env.GITHUB_TOKEN,...options.headers},signal:AbortSignal.timeout(8000)});
 }
 async function issueAction(request,env,id,reconcile=false){
  const body=await readJSON(request),row=await getReport(env,id);
  if(!fields(body,reconcile?['revision']:['revision','reviewed','title','body'])||!Number.isInteger(body.revision)||body.revision!==row.revision)fail(409,'revision');
  if(row.issue_state==='created')return json({ok:true,issueNumber:row.issue_number,issueUrl:row.issue_url});
  const marker='<!-- chloha-feedback:'+id+' -->';
  if(reconcile){
   if(!['creating','uncertain'].includes(row.issue_state))fail(409,'issue_state');
   // Reconciliation is read-only on GitHub. No ambiguous request is ever posted again.
   for(let page=1;page<=10;page++){
    let response;try{response=await github(env,'/issues?state=all&sort=created&direction=desc&per_page=100&page='+page);}catch{fail(503,'github_unavailable');}
    if(!response.ok)fail(503,'github_unavailable');
    const issues=await response.json();if(!Array.isArray(issues))fail(503,'github_unavailable');
    const match=issues.find(i=>!i.pull_request&&typeof i.body==='string'&&i.body.includes(marker));
    if(match){await saveIssue(env,id,match);return json({ok:true,issueNumber:match.number,issueUrl:match.html_url});}
    if(issues.length<100)break;
   }
   fail(409,'issue_unconfirmed');
  }
  if(row.status!=='Accepted'||row.issue_state!=='none'||row.expires_at<=seconds()+300)fail(409,'issue_state');
  if(body.reviewed!==true||typeof body.title!=='string'||!body.title.trim()||body.title.length>120||/[\r\n\x00-\x1f]/.test(body.title)||typeof body.body!=='string'||!body.body.trim()||body.body.length>10000)fail(400,'issue_summary');
  const summary=body.title+'\n'+body.body;
  if(/[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}/i.test(summary)||/(?:gh[pousr]_[A-Za-z0-9_]{10,}|github_pat_[A-Za-z0-9_]{10,}|Bearer\s+\S+|-----BEGIN [A-Z ]*PRIVATE KEY-----)/i.test(summary)||(row.contact_email&&summary.toLowerCase().includes(row.contact_email.toLowerCase())))fail(400,'private_information');
  if(!env.GITHUB_TOKEN)fail(503,'github_unavailable');
  const locked=await env.DB.prepare("UPDATE reports SET issue_state='creating',revision=revision+1,updated_at=? WHERE id=? AND revision=? AND status='Accepted' AND issue_state='none' AND expires_at>? RETURNING id").bind(seconds(),id,row.revision,seconds()+300).first();
  if(!locked)fail(409,'revision');
  let response;
  try{response=await github(env,'/issues',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:body.title.trim(),body:body.body.trim()+'\n\n'+marker})});}
  catch{await env.DB.prepare("UPDATE reports SET issue_state='uncertain' WHERE id=? AND issue_state='creating'").bind(id).run();fail(503,'issue_uncertain');}
  if(response.status!==201){
   const definite=[400,401,403,404,410,422,429].includes(response.status);
   await env.DB.prepare('UPDATE reports SET issue_state=?,revision=revision+1 WHERE id=? AND issue_state=?').bind(definite?'none':'uncertain',id,'creating').run();fail(503,definite?'github_unavailable':'issue_uncertain');
  }
  let result;try{result=await response.json();await saveIssue(env,id,result);}catch{fail(503,'issue_uncertain');}
  return json({ok:true,issueNumber:result.number,issueUrl:result.html_url},201);
 }
 async function saveIssue(env,id,result){
  if(!Number.isSafeInteger(result.number)||result.number<=0||result.html_url!=='https://github.com/'+env.GITHUB_REPOSITORY+'/issues/'+result.number)throw Error('Invalid GitHub issue result');
  const saved=await env.DB.prepare("UPDATE reports SET issue_state='created',issue_number=?,issue_url=?,revision=revision+1,updated_at=? WHERE id=? AND issue_state IN ('creating','uncertain') RETURNING id").bind(result.number,result.html_url,seconds(),id).first();if(!saved)throw Error('Issue state changed');
 }
 async function adminAPI(request,env,url){
  await authenticate(request,env);if(!env.DB)fail(503,'admin_unavailable');
  if(request.method!=='GET')adminMutation(request);
  if(url.pathname==='/v1/admin/reports'&&request.method==='GET'){
   const category=url.searchParams.get('category'),status=url.searchParams.get('status'),before=url.searchParams.get('before'),beforeId=url.searchParams.get('beforeId');
   if(category&&!C.categories.includes(category)||status&&!C.statuses.includes(status)||((before||beforeId)&&(!/^\d{1,12}$/.test(before||'')||!UUID.test(beforeId||''))))fail(400,'invalid_request');
   const clauses=['expires_at>?'],args=[seconds()];
   if(category){clauses.push('category=?');args.push(category);}if(status){clauses.push('status=?');args.push(status);}
   if(before){clauses.push('(created_at<? OR (created_at=? AND id<?))');args.push(Number(before),Number(before),beforeId);}
   const result=await env.DB.prepare('SELECT * FROM reports WHERE '+clauses.join(' AND ')+' ORDER BY created_at DESC,id DESC LIMIT 51').bind(...args).all();
   const rows=result.results.slice(0,50),last=rows.at(-1);
   return json({reports:rows.map(r=>publicRow(r)),next:result.results.length>50?{before:last.created_at,beforeId:last.id}:null});
  }
  const match=url.pathname.match(/^\/v1\/admin\/reports\/([a-f0-9-]+)(?:\/(issue|reconcile))?$/);
  if(!match||!UUID.test(match[1]))fail(404,'not_found');const id=match[1];
  if(match[2]&&request.method==='POST')return issueAction(request,env,id,match[2]==='reconcile');
  if(match[2])fail(405,'method');
  if(request.method==='GET')return json({report:publicRow(await getReport(env,id),true)});
  const body=await readJSON(request),row=await getReport(env,id);
  if(!Number.isInteger(body.revision)||body.revision!==row.revision)fail(409,'revision');
  if(request.method==='PATCH'){
   if(!fields(body,['revision','status'])||!C.statuses.includes(body.status))fail(400,'status');
   const changed=await env.DB.prepare("UPDATE reports SET status=?,updated_at=?,revision=revision+1 WHERE id=? AND revision=? AND issue_state!='creating' AND expires_at>? RETURNING id").bind(body.status,seconds(),id,row.revision,seconds()).first();if(!changed)fail(409,'revision');
   return json({report:publicRow(await getReport(env,id),true)});
  }
  if(request.method==='DELETE'){
   if(!fields(body,['revision','confirmed'])||body.confirmed!==true)fail(400,'confirmation');
   const changed=await env.DB.prepare("DELETE FROM reports WHERE id=? AND revision=? AND issue_state!='creating' RETURNING id").bind(id,row.revision).first();if(!changed)fail(409,'revision');return json({ok:true});
  }
  fail(405,'method');
 }
 return {
  async fetch(request,env){
   let cors={};try{
    transport(request,env);const url=new URL(request.url);
    if(url.pathname==='/v1/config'||url.pathname==='/v1/reports'){
     cors=url.pathname==='/v1/config'&&request.method==='GET'&&!request.headers.has('origin')?{}:corsOrigin(request,env);
     if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,...cors,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}});
     let response;
     if(url.pathname==='/v1/config'&&request.method==='GET')response=publicReady(env)?json({enabled:true,siteKey:env.TURNSTILE_SITE_KEY,retentionDays:C.limits.retentionDays,mode:env.ENVIRONMENT==='local'?'local-demo':'production'}):json({error:'unavailable'},503);
     else if(url.pathname==='/v1/reports'&&request.method==='POST')response=await accept(request,env);else fail(405,'method');
     for(const [key,value] of Object.entries(cors))response.headers.set(key,value);return response;
    }
    if(url.pathname.startsWith('/v1/admin/'))return await adminAPI(request,env,url);
    if(url.pathname==='/admin'||url.pathname.startsWith('/admin/')){
     await authenticate(request,env);if(request.method!=='GET')fail(405,'method');
     const path=url.pathname.replace(/^\/admin\/?/,'')||'index.html';if(!['index.html','admin.js','admin.css'].includes(path))fail(404,'not_found');
     if(!env.ADMIN_ASSETS)fail(503,'admin_unavailable');
     const response=await env.ADMIN_ASSETS.fetch(new Request(new URL('/'+path,url),request)),out=new Response(response.body,response);
     for(const [key,value] of Object.entries(headers))out.headers.set(key,value);return out;
    }
    fail(404,'not_found');
   }catch(error){return json({error:error instanceof Failure?error.code:'unavailable'},error instanceof Failure?error.status:503,cors);}
  },
  async scheduled(_event,env){
   if(!env.DB)throw Error('Feedback storage unavailable');const t=seconds();
   await env.DB.batch(['DELETE FROM request_dedup WHERE expires_at<=?','DELETE FROM rate_buckets WHERE expires_at<=?','DELETE FROM used_challenges WHERE expires_at<=?','DELETE FROM reports WHERE expires_at<=?'].map(sql=>env.DB.prepare(sql).bind(t)));
  }
 };
}
export default createWorker();
