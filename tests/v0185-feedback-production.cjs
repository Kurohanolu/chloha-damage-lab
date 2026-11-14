const assert=require('node:assert/strict');
const {checkProduction}=require('../scripts/feedback-production-check.cjs');
const origin='https://kurohanolu.github.io',apiBase='https://feedback.example.com';
function mock(options={}){
 const calls=[];
 return {calls,fetchImpl:async(url,request)=>{
  calls.push({url,request});const path=new URL(url).pathname;
  assert.equal(request.method,'GET');assert.equal(request.credentials,'omit');assert.equal(request.redirect,'manual');assert.equal(request.headers.Origin,origin);assert.equal(request.body,undefined);
  if(options.offline)throw Error('simulated outage');
  if(path==='/v1/config')return options.malformed?new Response('not json',{status:200}):Response.json({enabled:true,mode:'production',siteKey:'production-site-key-placeholder',retentionDays:90,...options.config},{status:options.status||200,headers:{'Access-Control-Allow-Origin':options.cors||origin,'Cache-Control':options.cache||'no-store'}});
  if(path==='/v1/reports')return new Response(null,{status:options.publicListing?200:405});
  return options.redirect?new Response(null,{status:302,headers:{Location:options.redirect}}):new Response(null,{status:options.adminPublic?200:401});
 }};
}
(async()=>{
 for(const api of ['',undefined,'http://feedback.chloha.net','https://127.0.0.1','https://localhost','https://service.internal','https://feedback.chloha.net/path','https://feedback.chloha.net/','https://user:secret@feedback.chloha.net']){
  const service=mock();const result=await checkProduction({apiBase:api,publicOrigin:origin,fetchImpl:service.fetchImpl});assert.equal(result.ready,false,api);assert.equal(service.calls.length,0,'Invalid configuration must not trigger network access');
 }
 for(const options of [{status:503},{offline:true},{malformed:true},{config:{enabled:false}},{config:{mode:'local-demo'}},{config:{siteKey:'1x00000000000000000000AA'}},{config:{retentionDays:30}},{cors:'*'},{cache:'public,max-age=60'},{adminPublic:true},{publicListing:true},{redirect:'https://attacker.invalid/login'}]){
  const service=mock(options);assert.equal((await checkProduction({apiBase,publicOrigin:origin,fetchImpl:service.fetchImpl})).ready,false,JSON.stringify(options));
 }
 for(const options of [{},{redirect:'https://owner.cloudflareaccess.com/cdn-cgi/access/login/feedback.chloha.net'}]){
  const service=mock(options),result=await checkProduction({apiBase,publicOrigin:origin,fetchImpl:service.fetchImpl});assert.equal(result.ready,true,JSON.stringify(result));assert.equal(service.calls.length,5);
 }
 console.log('PASS v0.185 production gate: unset/offline/demo/unsafe/public-admin configurations block release; read-only checks send no reports or credentials');
})().catch(e=>{console.error(e);process.exitCode=1;});
