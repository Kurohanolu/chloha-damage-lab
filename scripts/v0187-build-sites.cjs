'use strict';
// Offline artifact preparation only. No GitHub/Cloudflare/network mutations.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const legacyCommit='4b2cde61f92610c5bb970618d34147a2c16a8d7b';
const digest=body=>crypto.createHash('sha256').update(body).digest('hex');
function localPath(url){
 if(/^(?:[a-z]+:|\/\/|\/)/i.test(url))throw Error('Only relative local assets are packaged: '+url);
 const file=url.split(/[?#]/)[0].replace(/^\.\//,'');
 if(file==='.nojekyll')return file;
 if(!/^[a-zA-Z0-9_./-]+$/.test(file)||file.split('/').some(p=>p==='..'||p.startsWith('.')))throw Error('Unsafe public asset path');
 return file;
}
function dependencies(html){
 return [...new Set([...html.matchAll(/<(?:script|link|img)\b[^>]*\b(?:src|href)=["'](\.\/[^"']+)["']/g)].map(m=>localPath(m[1])))];
}
function buildSites(output){
 const out=path.resolve(output);if(out===root||root.startsWith(out+path.sep))throw Error('Output must not replace the source tree');
 if(fs.existsSync(out)&&fs.readdirSync(out).length)throw Error('Use an empty output directory');
 fs.mkdirSync(out,{recursive:true});
 const inventory={};
 const write=(site,file,body)=>{localPath(file);const dest=path.join(out,site,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,body);inventory[site+'/'+file]=digest(Buffer.from(body));};
 const read=file=>fs.readFileSync(path.join(root,localPath(file)));
 const old=file=>execFileSync('git',['show',legacyCommit+':'+localPath(file)],{cwd:root,maxBuffer:16*1024*1024});
 const html=read('index.html').toString(),release=JSON.parse(read('release.json'));
 write('singularity','index.html',html);write('singularity','release.json',read('release.json'));
 for(const file of new Set([...dependencies(html),...Object.values(release.branding)]))write('singularity',file,read(file));
 write('singularity','brand-preview.html',read('brand-preview.html'));write('singularity','.nojekyll','');
 const original=old('index.html').toString(),legacyRelease=JSON.parse(old('release.json')),cache=legacyRelease.tag.slice(1);
 const noticeCSS='./legacy-notice-v0187.css?v='+cache,noticeJS='./legacy-notice-v0187.js?v='+cache;
 const legacyHTML=original.replace('</head>','<link rel="stylesheet" href="'+noticeCSS+'"></head>').replace('</body>','<script defer src="'+noticeJS+'"></script></body>');
 write('chloha-damage-lab','index.html',legacyHTML);write('chloha-damage-lab','release.json',old('release.json'));
 for(const file of dependencies(original))write('chloha-damage-lab',file,old(file));
 write('chloha-damage-lab','legacy-notice-v0187.css',read('migration/legacy-notice-v0187.css'));
 write('chloha-damage-lab','legacy-notice-v0187.js',read('migration/legacy-notice-v0187.js'));write('chloha-damage-lab','.nojekyll','');
 const dirty=Boolean(execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim());
 const manifest={schemaVersion:1,mode:'approval-required-preview',sourceCommit:dirty?null:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),uncommittedPreview:dirty,legacyCommit,publicCutoverPerformed:false,files:inventory};
 fs.writeFileSync(path.join(out,'migration-artifacts.json'),JSON.stringify(manifest,null,2)+'\n');
 return {out,manifest};
}
module.exports={buildSites,dependencies,legacyCommit};
if(require.main===module){const option=process.argv.indexOf('--output'),out=option<0?'dist/v0187':process.argv[option+1];if(!out)throw Error('--output requires a path');const result=buildSites(out);console.log('Prepared '+Object.keys(result.manifest.files).length+' public artifact files in '+result.out+'; no deployment performed');}
