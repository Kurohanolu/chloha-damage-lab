'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const published='a68b987d25d392076f36413e7f626ea3b71391c2',publishedTree='c8292fafb8b927985d88ae7865ea8d755efdca76';
const ref='7e651aebc3d92d2d6d6096bf8607f7fc4bbc762c',tree='eda29cf665b6bdcf33a3e9049b56a04d0e25284f';
const historical='fbec6fd45b841c3465be903b25a14e909cc80ba5';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024}),old=p=>git('show',ref+':'+p),live=p=>git('show',published+':'+p),hash=b=>require('node:crypto').createHash('sha256').update(b).digest('hex');
function expectedHTML(){return live('index.html').replaceAll('Pre-Release 16','Pre-Release 17').replaceAll('1.1.0-pre.16','1.1.0-pre.17').replace(/((?:src|href)="\.\/([^"?]+)\?v=1\.1\.0-pre\.17)(?:&h=[a-f0-9]+)?/g,(_,prefix,file)=>prefix+(/\.(?:js|css)$/.test(file)?'&h='+hash(fs.readFileSync(file)).slice(0,16):''));}
function historicalHTML(bytes){assert.equal(git('rev-parse',published+'^{tree}').trim(),publishedTree);assert.equal(bytes.toString(),expectedHTML(),'Only exact pre.16 to pre.17 identity/cache delta permitted');return Buffer.from(git('show',historical+':index.html'));}
module.exports={published,publishedTree,ref,tree,git,old,live,hash,expectedHTML,historicalHTML};
