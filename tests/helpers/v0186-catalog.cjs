'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const {root,context,reference,typeName}=require('./v0186-reference.cjs');
const html=fs.readFileSync(root+'/index.html','utf8');
const pokemonDB=JSON.parse(html.match(/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s)[1]);
const moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const policies=JSON.parse(html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/)[1]);
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','pokemon-weights-v0181.js','weight-power.js'])vm.runInContext(fs.readFileSync(root+'/'+file,'utf8'),context,{filename:file});
const names=context.ChlohaNames,weights=context.ChlohaPokemonWeights;
function speciesCandidates(name){
 const special={'Paldean Tauros (Combat Breed)':'Tauros-Paldea-Combat','Paldean Tauros (Blaze Breed)':'Tauros-Paldea-Blaze','Paldean Tauros (Aqua Breed)':'Tauros-Paldea-Aqua',
 'Aegislash (Shield Forme)':'Aegislash-Shield','Aegislash (Blade Forme)':'Aegislash-Blade',
 'Indeedee (Male)':'Indeedee','Indeedee (Female)':'Indeedee-F','Basculegion (Male)':'Basculegion','Basculegion (Female)':'Basculegion-F',
 'Toxtricity (Amped Form)':'Toxtricity','Toxtricity (Low Key Form)':'Toxtricity-Low-Key',
 'Squawkabilly (Green Plumage)':'Squawkabilly','Squawkabilly (Blue Plumage)':'Squawkabilly-Blue','Squawkabilly (Yellow Plumage)':'Squawkabilly-Yellow','Squawkabilly (White Plumage)':'Squawkabilly-White',
 'Mega Meowstic (Male)':'Meowstic-M-Mega','Mega Meowstic (Female)':'Meowstic-F-Mega','Meowstic (Male)':'Meowstic','Meowstic (Female)':'Meowstic-F',
 'Floette (Eternal Flower)':'Floette-Eternal','Palafin (Zero Form)':'Palafin','Palafin (Hero Form)':'Palafin-Hero'};
 let canonical=special[name]||name;
 canonical=canonical.replace(/^Mega (.+?)(?: ([XYZ]))?$/,(_,s,f)=>s+'-Mega'+(f?'-'+f:''));
 canonical=canonical.replace(/^(Alolan|Galarian|Hisuian|Paldean) (.+)$/,(_,r,s)=>s+'-'+({Alolan:'Alola',Galarian:'Galar',Hisuian:'Hisui',Paldean:'Paldea'}[r]));
 canonical=canonical.replace(/ \((.+)\)$/,'-$1');
 return [canonical,name].map(reference.toID);
}
function findSpecies(p,generation){
 const gen=reference.Generations.get(generation);
 return speciesCandidates(names.pokemon[p.id]||'').map(id=>gen.species.get(id)).find(Boolean)||null;
}
function ready(m){
 const p=policies[m.id];
 if(!['physical','special'].includes(m.category)||p?.priority==='P0')return false;
 if(context.ChlohaMultiHit.hitDistribution(m.name)||context.ChlohaMultiHit.specialMoveSpec(m.name))return true;
 if(p?.standardDamageSupported===false)return false;
 if(p?.standardDamageSupported===true&&p.mechanic)return true;
 if(['けたぐり','くさむすび','ヘビーボンバー','ヒートスタンプ'].includes(m.name))return true;
 return m.calculationSupported===true;
}
const statNames={hp:'hp',attack:'atk',defense:'def',specialAttack:'spa',specialDefense:'spd',speed:'spe'};
function speciesDifference(p,ref){
 if(!ref)return ['no independent record'];
 const differences=[];
 for(const [local,key] of Object.entries(statNames))if(p.baseStats[local]!==ref.baseStats[key])differences.push(local+': '+p.baseStats[local]+' vs '+ref.baseStats[key]);
 if(JSON.stringify(p.types.map(t=>typeName[t]).sort())!==JSON.stringify([...ref.types].sort()))differences.push('types: '+p.types.map(t=>typeName[t]).join('/')+' vs '+ref.types.join('/'));
 if(weights[p.id]!==ref.weightkg)differences.push('weight: '+weights[p.id]+' vs '+ref.weightkg);
 return differences;
}
module.exports={html,pokemonDB,pokemon:pokemonDB.pokemon,moves,policies,names,weights,ready,findSpecies,speciesDifference,statNames};
