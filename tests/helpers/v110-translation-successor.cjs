'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const ref='88439ff3881e30da8e7b4986513b82b94b664a23',tree='d5925abb7b6c39128ceac663ccee882a41659d0d';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024}),old=p=>git('show',ref+':'+p),hash=b=>require('node:crypto').createHash('sha256').update(b).digest('hex');
function expectedHTML(){return old('index.html').replaceAll('Pre-Release 11','Pre-Release 13').replaceAll('1.1.0-pre.11','1.1.0-pre.13').replace(/((?:src|href)="\.\/([^"?]+)\?v=1\.1\.0-pre\.13)(?:&h=[a-f0-9]+)?/g,(_,prefix,file)=>prefix+(/\.(?:js|css)$/.test(file)?'&h='+hash(fs.readFileSync(file)).slice(0,16):''));}
function historicalHTML(bytes){assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);assert.equal(bytes.toString(),expectedHTML(),'Only exact provisional pre.13 identity/cache delta is permitted');return Buffer.from(old('index.html'));}
module.exports={ref,tree,git,old,hash,expectedHTML,historicalHTML};
