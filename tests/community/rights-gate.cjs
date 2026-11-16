'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {verify}=require('../../scripts/community/publication-gate.cjs');
const source=path.resolve(__dirname,'../../dist/community/site');
assert.equal(verify(source,{scope:'publicWeb'}).status,'passed');
assert.equal(verify(source,{scope:'communityZip'}).status,'passed');
const cases=[
 ['changed runtime',p=>fs.appendFileSync(path.join(p,'damage-engine-v0184.js'),'\n// unreviewed')],
 ['missing notice',p=>fs.unlinkSync(path.join(p,'licenses/Pokemon-Showdown-MIT.txt'))],
 ['unreviewed file',p=>fs.writeFileSync(path.join(p,'new-data.txt'),'not reviewed')],
 ['public ZIP',p=>fs.writeFileSync(path.join(p,'download.zip'),'not allowed')],
 ['wider permission',p=>{const f=path.join(p,'release.json'),o=JSON.parse(fs.readFileSync(f));o.distribution.publicArchive=true;fs.writeFileSync(f,JSON.stringify(o));}]
];
for(const [name,mutate] of cases){const p=fs.mkdtempSync(path.join(os.tmpdir(),'community-rights-'));try{fs.cpSync(source,p,{recursive:true});mutate(p);assert.throws(()=>verify(p),undefined,name);}finally{fs.rmSync(p,{recursive:true,force:true});}}
console.log('PASS rights gate: two scoped acceptances and five tampered artifacts rejected');
