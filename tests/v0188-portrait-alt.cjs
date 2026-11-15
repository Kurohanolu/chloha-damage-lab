'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const context={};vm.createContext(context);
for(const file of ['locale-names-pokeapi-v0183.js','locale-names-v0183.js'])vm.runInContext(read(file),context);
const catalogs=vm.runInContext('({primary:ChlohaLocalizedNames.pokemon,bulk:ChlohaPokeAPILocalizedNames.pokemon})',context);
let locale='ja';const handlers={};
const portraits=[{dataset:{pokemon:'garchomp',pokemonJa:'ガブリアス'}},{dataset:{pokemon:'tyranitar',pokemonJa:'バンギラス'}}];
const root={document:{querySelectorAll:()=>portraits,addEventListener:(name,fn)=>handlers[name]=fn},ChlohaLocale:{get:()=>locale},ChlohaLocalePokemonName:(id,code)=>catalogs.primary[id]?.[code]||catalogs.bulk[id]?.[code]};
vm.runInNewContext(read('portrait-alt-v0188.js'),{window:root,MutationObserver:class{observe(){}}});
const names={ja:['ガブリアス','バンギラス'],en:['Garchomp','Tyranitar'],fr:['Carchacrok','Tyranocif'],de:['Knakrack','Despotar'],es:['Garchomp','Tyranitar'],it:['Garchomp','Tyranitar'],ko:['한카리아스','마기라스'],'zh-Hans':['烈咬陆鲨','班基拉斯'],'zh-Hant':['烈咬陸鯊','班基拉斯']};
for(const [code,expected] of Object.entries(names)){
 locale=code;handlers['chloha:localechange']();
 for(let i=0;i<portraits.length;i++){
  assert.ok(portraits[i].alt.includes(expected[i]),code+' localized name');
  if(code!=='ja')assert.ok(!portraits[i].alt.includes('の画像'),code+' no Japanese phrase');
 }
 const missing=root.SingularityPortraitAlt.describe('missing',code==='ja'?null:'日本語名',code,()=>null);
 assert.ok(!missing.includes('日本語名'),'missing '+code+' must not silently fallback');
 assert.ok(missing.length>8,'missing '+code+' has explicit localized description');
}
locale='de';root.SingularityPortraitAlt.update(portraits[0],{id:'tyranitar',name:'バンギラス'});
assert.equal(portraits[0].alt,'Bild von Despotar','species change uses canonical name');
// Reinitializing under an already-restored locale also updates initial portraits.
locale='fr';vm.runInNewContext(read('portrait-alt-v0188.js'),{window:root,MutationObserver:class{observe(){}}});
assert.equal(portraits[0].alt,'Image de Tyranocif');
console.log('PASS v0.188 portrait alt: canonical nine-language names, locale events, species switch, restored locale and explicit missing names');
