'use strict';
// Generate a reviewed weight mapping candidate from Pokémon Showdown; never silently
// substitute a base-form weight for an unmatched Mega or regional form.
// Usage: node scripts/v0181-import-showdown-weights.cjs [pokedex.ts file]
// Output: reports/v0181-weight-candidates.json (local only, not applied to UI).
const fs=require('node:fs'),path=require('node:path'),https=require('node:https');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const roster=JSON.parse(html.match(/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s)[1]).pokemon;
const catalog=fs.readFileSync(path.join(root,'names-catalog-v0179.js'),'utf8');
const additional=JSON.parse(catalog.match(/const additional=(\{.*?\});/s)[1]);
const overrides={mega_charizard_x:'Charizard-Mega-X',mega_charizard_y:'Charizard-Mega-Y',mega_venusaur:'Venusaur-Mega',mega_blastoise:'Blastoise-Mega'};
function key(name){return String(name||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
function download(url){return new Promise((resolve,reject)=>https.get(url,res=>{if(res.statusCode!==200){res.resume();return reject(Error('HTTP '+res.statusCode));}let data='';res.setEncoding('utf8');res.on('data',x=>data+=x);res.on('end',()=>resolve(data));}).on('error',reject));}
(async()=>{
 const raw=process.argv[2]?fs.readFileSync(process.argv[2],'utf8'):await download('https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/pokedex.ts');
 const records=new Map();
 const regex=/^\s*([a-z0-9]+):\s*\{([\s\S]*?)(?=^\s*\},)/gm;
 for(const m of raw.matchAll(regex)){
   const name=m[2].match(/\bname:\s*["']([^"']+)["']/);
   const weight=m[2].match(/\bweightkg:\s*([\d.]+)/);
   if(name&&weight&&Number(weight[1])>0)records.set(key(name[1]),{showdownName:name[1],weightKg:Number(weight[1])});
 }
 const matched={},unresolved=[];
 for(const p of roster){
   const english=overrides[p.id]||additional.pokemon?.[p.id];
   const record=english&&records.get(key(english));
   if(record)matched[p.id]={...record,match:'exactEnglishName'};
   else unresolved.push({id:p.id,japaneseName:p.name,englishCandidate:english||null});
 }
 const result={source:'Pokemon Showdown data/pokedex.ts',generatedAt:new Date().toISOString(),total:roster.length,matched:Object.keys(matched).length,unresolved:unresolved.length,matchedWeights:matched,unresolvedPokemon:unresolved};
 const out=path.join(root,'reports/v0181-weight-candidates.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
 console.log('Showdown weight candidates:',result.matched+'/'+result.total,'unresolved:',result.unresolved,'output:',out);
})().catch(e=>{console.error(e);process.exitCode=1;});
