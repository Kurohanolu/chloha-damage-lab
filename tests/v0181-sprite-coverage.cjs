'use strict';
// Audit missing Pokémon sprite IDs; intentionally no guessed form-to-image mapping.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const rosterMatch=html.match(/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s);
const spriteMatch=html.match(/window\.ChlohaSpriteIds=(\{.*?\});window\.ChlohaLocalSprites=/s);
assert.ok(rosterMatch&&spriteMatch,'Roster/sprite data not found');
const pokemon=JSON.parse(rosterMatch[1]).pokemon, sprites=JSON.parse(spriteMatch[1]);
const missing=pokemon.filter(p=>!sprites[p.id]).map(p=>({id:p.id,name:p.name}));
const report={total:pokemon.length,mapped:pokemon.length-missing.length,missing:missing.length,missingPokemon:missing};
console.log(JSON.stringify(report,null,2));
if(process.env.SPRITE_AUDIT_REPORT)fs.writeFileSync(process.env.SPRITE_AUDIT_REPORT,JSON.stringify(report,null,2)+'\n');
