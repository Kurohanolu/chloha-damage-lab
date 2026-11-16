'use strict';
// Isolated same-origin frontend snapshots. Never serves secrets or production APIs.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..');
// Follow-up measurements compare to the already published v0.188, not to an
// older migration baseline. Removing the draft marker after owner approval must
// not silently change the pre.2 comparison. Preserve original pre.1 history.
const release=JSON.parse(fs.readFileSync(path.join(root,'release.json'),'utf8'));
const baselineForRelease=metadata=>metadata.tag==='v1.1.0-pre.4'?'082ab180bc8835304d959f583d4968e0565bdea3':metadata.tag==='v1.1.0-pre.3'?'aba2d0558948e2a4dd375074fb11fd428edf6222':metadata.tag==='v1.1.0-pre.2'?'83af29133927a19fc7e0f9273c0e194c54384ae5':metadata.tag==='v1.1.0-pre.1'?'0b270c1452505268364659edd402209b00b28673':(metadata.followupAudit||['v0.188-pre.2','v1.0.0'].includes(metadata.tag))?'4f068544e670a85a6a4d34dd2c26e2be66bd9cb7':'7210be99c39d75b49ea8200aad91d75801eb300a';
const baseline=baselineForRelease(release);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.json':'application/json'};
function frontend(ref){
 const read=file=>ref?execFileSync('git',['show',ref+':'+file],{cwd:root,maxBuffer:16*1024*1024}):fs.readFileSync(path.join(root,file));
 const html=read('index.html'),release=JSON.parse(read('release.json'));
 const files=new Set(['index.html','release.json',...Object.values(release.branding),...[...html.toString().matchAll(/<(?:script|link|img)\b[^>]*\b(?:src|href)=["'](\.\/[^"']+)["']/g)].map(m=>m[1].split(/[?#]/)[0].slice(2))]);
 return new Map([...files].map(file=>[file,read(file)]));
}
async function startLab({compare=false}={}){
 const snapshots=new Map([['candidate',frontend()]]);if(compare)snapshots.set('baseline',frontend(baseline));
 const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const url=new URL(req.url,'http://127.0.0.1'),match=url.pathname.match(/^\/(candidate|baseline)\/(.*)$/),file=match&&(match[2]||'index.html'),body=match&&snapshots.get(match[1])?.get(file);
  if(!body){res.writeHead(404);res.end('Not found');return;}
  const etag='"'+crypto.createHash('sha256').update(body).digest('hex')+'"';
  const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'public, max-age=600','ETag':etag,'X-Content-Type-Options':'nosniff'};
  if(req.headers['if-none-match']===etag){res.writeHead(304,headers);res.end();return;}
  res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:body);
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 return {origin:'http://127.0.0.1:'+server.address().port,close:()=>new Promise(resolve=>server.close(resolve)),baseline};
}
const launchBrowser=()=>chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
const ready=page=>page.waitForFunction(()=>!!window.ChlohaLastCalculation&&!!window.ChlohaLocale);
async function blockExternal(context,page){
 const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setBlockedURLs',{urls:['https://*']});return cdp;
}
async function mockFeedback(context,origin){
 // A client-only fixture: does not exercise the real Worker/Turnstile.
 await context.route('**/feedback-config-v0185.js*',route=>route.fulfill({contentType:'text/javascript',body:'window.ChlohaFeedbackConfig={apiBase:'+JSON.stringify(origin)+'};'}));
 await context.route('**/v1/config',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({enabled:true,siteKey:'local-fixture',retentionDays:90,mode:'local-demo'})}));
 await context.route('https://challenges.cloudflare.com/**',route=>route.fulfill({contentType:'text/javascript',body:'window.turnstile={render(n,o){queueMicrotask(()=>o.callback("local-fixture-token"));return "fixture"},remove(){},reset(){}};'}));
 await context.route('**/v1/reports',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"unavailable"}'}));
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin||route.request().url().startsWith('https://challenges.cloudflare.com/')?route.fallback():route.abort());
}
module.exports={root,baseline,baselineForRelease,startLab,launchBrowser,ready,blockExternal,mockFeedback};
