/* v0.179 catalog inventory. Reports gaps without claiming unverified translations. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function embedded(name){
 const start=html.indexOf('const '+name+' = ');if(start<0)throw Error('Missing '+name);
 const i=html.indexOf('{',start);let depth=0,quoted=false,escaped=false;
 for(let j=i;j<html.length;j++){const c=html[j];if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;}else{if(c==='"')quoted=true;else if(c==='{')depth++;else if(c==='}'&&!--depth)return JSON.parse(html.slice(i,j+1));}}
 throw Error('Unterminated '+name);
}
const pokemon=embedded('ChlohaPokemonDB').pokemon;
const moves=embedded('ChlohaMovesDB').moves;
const context={window:{}};vm.createContext(context);
for(const file of ['names-v0179.js','names-ja-en.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context,{filename:file});
const names=context.window.ChlohaNames;
const abilities=[...new Set(pokemon.flatMap(p=>p.abilities||[]))].sort();
const inventories=[
 {kind:'pokemon',entries:pokemon.map(p=>({id:p.id,ja:p.name})),map:names.pokemon,key:p=>p.id},
 {kind:'moves',entries:moves.map(m=>({id:m.id,ja:m.name})),map:names.moves,key:m=>m.ja},
 {kind:'abilities',entries:abilities.map(a=>({id:a,ja:a})),map:names.abilities,key:a=>a.ja}
];
const report={version:'0.179',generatedAt:new Date().toISOString(),categories:{}};
for(const {kind,entries,map,key} of inventories){
 const missing=entries.filter(e=>!map[key(e)]||map[key(e)]===e.ja);
 report.categories[kind]={total:entries.length,translated:entries.length-missing.length,missing:missing.map(e=>({id:e.id,ja:e.ja}))};
 console.log(kind+': '+(entries.length-missing.length)+'/'+entries.length+' translated; '+missing.length+' missing');
}
fs.mkdirSync(path.join(__dirname,'../reports'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'../reports/v0179-localization-coverage.json'),JSON.stringify(report,null,2)+'\n');
if(process.argv.includes('--strict')&&Object.values(report.categories).some(c=>c.missing.length))process.exitCode=1;
