'use strict';
// Read-only release gate. Never posts a report, solves a challenge, or supplies admin credentials.
const fs=require('node:fs');
const vm=require('node:vm');
// Identify this application honestly; workers.dev can reject generic library agents.
const USER_AGENT='ChlohaDamageLab-ReleaseCheck/0.185 (+https://github.com/Kurohanolu/chloha-damage-lab)';

function readSettings(){
 const context=vm.createContext({window:{}});
 vm.runInContext(fs.readFileSync('feedback-config-v0185.js','utf8'),context,{timeout:1000});
 return {apiBase:context.window.ChlohaFeedbackConfig?.apiBase,publicOrigin:new URL(JSON.parse(fs.readFileSync('release.json','utf8')).publicUrl).origin};
}
async function checkProduction({apiBase,publicOrigin,fetchImpl=globalThis.fetch}={}){
 const checks=[],blockers=[];
 const check=(name,ok)=>{checks.push({name,passed:Boolean(ok)});if(!ok)blockers.push(name);return Boolean(ok);};
 let api;
 try{api=new URL(apiBase);}catch{check('Approved HTTPS feedback API origin is configured',false);return {ready:false,checks,blockers};}
 const safe=api.protocol==='https:'&&api.origin===apiBase&&!api.username&&!api.password&&!api.search&&!api.hash&&/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(api.hostname)&&!/(?:^|\.)(?:localhost|local|internal|test|invalid|example)$/.test(api.hostname);
 if(!check('Approved HTTPS feedback API origin is configured',safe))return {ready:false,checks,blockers};
 let origin;
 try{origin=new URL(publicOrigin);if(origin.origin!==publicOrigin||origin.protocol!=='https:')throw Error();}catch{check('Public frontend origin is HTTPS',false);return {ready:false,checks,blockers};}
 const get=path=>fetchImpl(api.origin+path,{method:'GET',redirect:'manual',credentials:'omit',cache:'no-store',headers:{Origin:publicOrigin,'User-Agent':USER_AGENT},signal:AbortSignal.timeout(10000)});
 try{
  const response=await get('/v1/config');
  if(!check('Public intake configuration is reachable without login',response.status===200))return {ready:false,checks,blockers};
  const config=await response.json();
  check('Production intake is enabled without a known Turnstile test key',config.enabled===true&&config.mode==='production'&&typeof config.siteKey==='string'&&config.siteKey.length>=10&&!/^[123]x0{10,}/.test(config.siteKey));
  check('Published retention policy matches the API',config.retentionDays===90);
  check('Public API permits the exact frontend origin',response.headers.get('access-control-allow-origin')===publicOrigin);
  check('Public configuration is not cached',/\bno-store\b/i.test(response.headers.get('cache-control')||''));
 }catch{check('Public intake configuration can be verified',false);return {ready:false,checks,blockers};}
 for(const path of ['/v1/admin/reports','/admin/','/admin/admin.js']){
  try{
   const response=await get(path);let denied=[401,403].includes(response.status);
   if([302,303,307,308].includes(response.status)){
    const location=new URL(response.headers.get('location'),api.origin);
    denied=location.protocol==='https:'&&(location.hostname.endsWith('.cloudflareaccess.com')||location.origin===api.origin)&&location.pathname.startsWith('/cdn-cgi/access/');
   }
   check('Anonymous access is denied: '+path,denied);
  }catch{check('Anonymous access is denied: '+path,false);}
 }
 try{check('Reports have no public listing', (await get('/v1/reports')).status===405);}catch{check('Reports have no public listing',false);}
 return {ready:blockers.length===0,checks,blockers};
}
module.exports={readSettings,checkProduction};
if(require.main===module)(async()=>{const result=await checkProduction(readSettings());console.log(JSON.stringify(result,null,2));if(!result.ready)process.exitCode=1;})().catch(()=>{console.error('Production feedback readiness could not be verified. No submission was sent.');process.exitCode=1;});
