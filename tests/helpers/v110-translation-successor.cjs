'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const published='cace126d0244f2d748b3c162a3e7cb5f9441932d',publishedTree='7f4a6078575346b36f74ab6bcea941dc629e81ec';
const ref='7e651aebc3d92d2d6d6096bf8607f7fc4bbc762c',tree='eda29cf665b6bdcf33a3e9049b56a04d0e25284f';
const historical='fbec6fd45b841c3465be903b25a14e909cc80ba5';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024}),old=p=>git('show',ref+':'+p),live=p=>git('show',published+':'+p),hash=b=>require('node:crypto').createHash('sha256').update(b).digest('hex');
function expectedHTML(){return live('index.html').replaceAll('Pre-Release 14','Pre-Release 15').replaceAll('1.1.0-pre.14','1.1.0-pre.15').replace(/((?:src|href)="\.\/([^"?]+)\?v=1\.1\.0-pre\.15)(?:&h=[a-f0-9]+)?/g,(_,prefix,file)=>prefix+(/\.(?:js|css)$/.test(file)?'&h='+hash(fs.readFileSync(file)).slice(0,16):''));}
function historicalHTML(bytes){assert.equal(git('rev-parse',published+'^{tree}').trim(),publishedTree);assert.equal(bytes.toString(),expectedHTML(),'Only exact pre.14 to pre.15 identity/cache delta permitted');return Buffer.from(git('show',historical+':index.html'));}
module.exports={published,publishedTree,ref,tree,git,old,live,hash,expectedHTML,historicalHTML};
