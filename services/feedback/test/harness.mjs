// Local/CI only: real SQLite, real signed Access-shaped JWTs, deterministic external services.
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,basename} from 'node:path';
import {generateKeyPair,exportJWK,SignJWT} from 'jose';
import {createWorker} from '../src/worker.js';

export const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
class Statement{
 constructor(db,sql,args=[]){this.db=db;this.sql=sql;this.args=args;}
 bind(...args){return new Statement(this.db,this.sql,args);}
 execute(){
  const statement=this.db.sqlite.prepare(this.sql),results=statement.all(...this.args).map(x=>({...x}));
  return {success:true,results,meta:{changes:Number(this.db.sqlite.prepare('SELECT changes() n').get().n)}};
 }
 async all(){return this.execute();}
 async first(column){const row=this.execute().results[0]||null;return column?(row?.[column]??null):row;}
 async run(){return this.execute();}
}
export class SQLiteD1{
 constructor(){this.sqlite=new DatabaseSync(':memory:');this.sqlite.exec('PRAGMA foreign_keys=ON');this.sqlite.exec(readFileSync(resolve(root,'services/feedback/migrations/0001_feedback.sql'),'utf8'));}
 prepare(sql){return new Statement(this,sql);}
 async batch(statements){this.sqlite.exec('BEGIN IMMEDIATE');try{const results=statements.map(s=>s.execute());this.sqlite.exec('COMMIT');return results;}catch(e){this.sqlite.exec('ROLLBACK');throw e;}}
 close(){this.sqlite.close();}
}
export async function createHarness(){
 const db=new SQLiteD1(),clock={ms:Date.now()},calls={siteverify:[],github:[],issues:[]},state={github:'success',challenge:'success'};
 const {privateKey,publicKey}=await generateKeyPair('RS256',{modulusLength:2048});const jwk=await exportJWK(publicKey);jwk.kid='local-test-key';jwk.alg='RS256';
 const env={ENVIRONMENT:'local',INTAKE_ENABLED:'true',ALLOWED_ORIGINS:'http://127.0.0.1:8787',TURNSTILE_HOSTNAMES:'127.0.0.1',TURNSTILE_SITE_KEY:'local-test-site-key',TURNSTILE_SECRET:'local-test-turnstile-secret',RATE_LIMIT_SECRET:'local-test-rate-secret-at-least-32-characters',ACCESS_ISSUER:'https://chloha-local-test.cloudflareaccess.com',ACCESS_AUDIENCE:'local-test-audience',ADMIN_EMAILS:'owner@example.test',GITHUB_REPOSITORY:'Kurohanolu/chloha-damage-lab',GITHUB_TOKEN:'local-test-github-credential',DB:db,
 ADMIN_ASSETS:{async fetch(request){const name=basename(new URL(request.url).pathname);const body=await readFile(resolve(root,'services/feedback/admin',name));return new Response(body,{headers:{'Content-Type':name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html'}});}}};
 const externalFetch=async(input,options={})=>{
  const url=String(input);
  if(url===env.ACCESS_ISSUER+'/cdn-cgi/access/certs')return Response.json({keys:[jwk]});
  if(url==='https://challenges.cloudflare.com/turnstile/v0/siteverify'){
   const body=JSON.parse(options.body);calls.siteverify.push(body);if(state.challenge==='offline')throw Error('test unavailable');
   return Response.json({success:body.response.startsWith('valid-')&&state.challenge!=='failed',hostname:state.challenge==='hostname'?'attacker.invalid':'127.0.0.1',action:state.challenge==='action'?'login':'feedback',challenge_ts:new Date(clock.ms-(state.challenge==='expired'?360000:0)).toISOString()});
  }
  if(url.startsWith('https://api.github.com/repos/Kurohanolu/chloha-damage-lab/issues')){
   calls.github.push({url,method:options.method||'GET',body:options.body?JSON.parse(options.body):null});
   if(options.method==='POST'){
    if(state.github==='forbidden')return Response.json({message:'test forbidden'},{status:403});
    if(state.github==='server-error')return Response.json({message:'test ambiguous failure'},{status:500});
    const issue={...JSON.parse(options.body),number:calls.issues.length+100,html_url:'https://github.com/Kurohanolu/chloha-damage-lab/issues/'+(calls.issues.length+100)};calls.issues.unshift(issue);
    if(state.github==='timeout-after-create')throw Error('test connection lost after creation');
    if(state.github==='malformed')return new Response('not json',{status:201});
    return Response.json(issue,{status:201});
   }
   return Response.json(calls.issues);
  }
  throw Error('Unexpected external URL in test: '+url);
 };
 const worker=createWorker({externalFetch,now:()=>clock.ms});
 const token=async(overrides={},options={})=>new SignJWT({email:'owner@example.test',type:'app',...overrides}).setProtectedHeader({alg:'RS256',kid:'local-test-key'}).setSubject('local-owner').setIssuer(options.issuer||env.ACCESS_ISSUER).setAudience(options.audience||env.ACCESS_AUDIENCE).setIssuedAt(Math.floor(clock.ms/1000)).setExpirationTime(options.expiration||Math.floor(clock.ms/1000)+3600).sign(privateKey);
 async function request(path,{method='GET',body,admin=false,headers={},raw}={}){
  const actual={'Origin':env.ALLOWED_ORIGINS.split(',')[0],'CF-Connecting-IP':'203.0.113.2',...headers};
  if(admin){actual['Cf-Access-Jwt-Assertion']=typeof admin==='string'?admin:await token();if(method!=='GET'){actual['Origin']='http://127.0.0.1:8787';actual['X-Chloha-Admin']='1';}}
  if(body!==undefined||raw!==undefined)actual['Content-Type']='application/json';
  const req=new Request('http://127.0.0.1:8787'+path,{method,headers:actual,body:raw??(body===undefined?undefined:JSON.stringify(body))});return worker.fetch(req,env);
 }
 return {worker,env,db,clock,calls,state,token,request,close:()=>db.close()};
}
export const reportBody=(overrides={})=>({requestId:crypto.randomUUID(),category:'bug',description:'The displayed damage differs from the expected value.',email:'',locale:'en',appVersion:'v0.184 Pre-Release 30',snapshot:null,turnstileToken:'valid-'+crypto.randomUUID(),website:'',...overrides});
export async function startLocalApp({adminEdge=false,demoWidget=false}={}){
 const h=await createHarness();let origin='';const edgeToken=await h.token();
 const server=createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,origin);let response;
   if(url.pathname.startsWith('/v1/')||url.pathname==='/admin'||url.pathname.startsWith('/admin/')){
    const chunks=[];let bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>65536){res.writeHead(413);res.end();return;}chunks.push(chunk);}
    const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(','):value);
    headers.set('CF-Connecting-IP','127.0.0.1');
    if(adminEdge&&(url.pathname.startsWith('/admin')||url.pathname.startsWith('/v1/admin/')))headers.set('Cf-Access-Jwt-Assertion',edgeToken);
    const request=new Request(url,{method:req.method,headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)});response=await h.worker.fetch(request,h.env);
   }else if(demoWidget&&url.pathname==='/local-test-widget.js'){
    response=new Response(await readFile(resolve(root,'services/feedback/test/local-widget.js')),{headers:{'Content-Type':'text/javascript'}});
   }else if(url.pathname==='/feedback-config-v0185.js'){
    response=new Response('window.ChlohaFeedbackConfig=Object.freeze({apiBase:'+JSON.stringify(origin)+'});',{headers:{'Content-Type':'text/javascript'}});
   }else{
    const path=url.pathname==='/'?'index.html':url.pathname.slice(1);
    if(!/^[a-zA-Z0-9_.-]+\.(html|js|css)$/.test(path)||path.startsWith('.')){res.writeHead(404);res.end();return;}
    let body=await readFile(resolve(root,path));if(demoWidget&&path==='index.html')body=Buffer.from(body.toString().replace('</head>','<script src="/local-test-widget.js"></script></head>'));response=new Response(body,{headers:{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html'}});
   }
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Local test server error');}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});origin='http://127.0.0.1:'+server.address().port;h.env.ALLOWED_ORIGINS=origin;
 return {...h,origin,close:async()=>{await new Promise(resolve=>server.close(resolve));h.close();}};
}
