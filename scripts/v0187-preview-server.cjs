'use strict';
// Loopback-only server for generated static preview artifacts; never deploys.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
async function startPreview(directory,{port=0}={}){
 const root=path.resolve(directory),manifest=JSON.parse(fs.readFileSync(path.join(root,'migration-artifacts.json')));
 const files=new Set(Object.keys(manifest.files));
 const server=http.createServer((req,res)=>{
  try{
   const url=new URL(req.url,'http://127.0.0.1');
   if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
   if(url.pathname==='/'||['/singularity','/chloha-damage-lab'].includes(url.pathname)){res.writeHead(302,{Location:url.pathname==='/'?'/singularity/':url.pathname+'/'});res.end();return;}
   let file=decodeURIComponent(url.pathname).replace(/^\//,'');if(file.endsWith('/'))file+='index.html';
   if(!files.has(file)){res.writeHead(404);res.end('Not found');return;}
   const body=fs.readFileSync(path.join(root,file));res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(400);res.end('Invalid request');}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 return {origin:'http://127.0.0.1:'+server.address().port,close:()=>new Promise(resolve=>server.close(resolve))};
}
module.exports={startPreview};
if(require.main===module)startPreview(process.argv[2]||'dist/v0187',{port:Number(process.env.SINGULARITY_PREVIEW_PORT||8788)}).then(app=>console.log('Preview only: '+app.origin+'/singularity/ ; legacy: '+app.origin+'/chloha-damage-lab/')).catch(error=>{console.error(error.message);process.exitCode=1;});
