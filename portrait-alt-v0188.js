/* v0.188: portrait descriptions follow the existing canonical name resolver. */
'use strict';
(function(root){
 const descriptions=Object.freeze({
  ja:name=>name+'の画像',
  en:name=>'Image of '+name,
  fr:name=>'Image de '+name,
  de:name=>'Bild von '+name,
  es:name=>'Imagen de '+name,
  'es-LA':name=>'Imagen de '+name,
  it:name=>'Immagine di '+name,
  ko:name=>name+' 이미지',
  'zh-Hans':name=>name+'的图片',
  'zh-Hant':name=>name+'的圖片'
 });
 const unavailable=Object.freeze({
  ja:'ポケモンの画像（選択言語の名前が未登録です）',
  en:'Pokémon image (name unavailable in the selected language)',
  fr:'Image de Pokémon (nom indisponible dans la langue sélectionnée)',
  de:'Pokémon-Bild (Name in der ausgewählten Sprache nicht verfügbar)',
  es:'Imagen de Pokémon (nombre no disponible en el idioma seleccionado)',
  'es-LA':'Imagen de Pokémon (nombre no disponible en el idioma seleccionado)',
  it:'Immagine di Pokémon (nome non disponibile nella lingua selezionata)',
  ko:'포켓몬 이미지 (선택한 언어의 이름이 등록되지 않았습니다)',
  'zh-Hans':'宝可梦图片（所选语言的名称尚未收录）',
  'zh-Hant':'寶可夢圖片（所選語言的名稱尚未收錄）'
 });
 function describe(id,japaneseName,locale,resolve){
  const code=Object.hasOwn(descriptions,locale)?locale:'ja';
  const name=code==='ja'?japaneseName:resolve?.(id,code);
  // An absent translation is explicit; a Japanese/English name is never silently substituted.
  return typeof name==='string'&&name.trim()?descriptions[code](name):unavailable[code];
 }
 function update(img,pokemon){
  if(pokemon){
   if(img.dataset.pokemon!==pokemon.id)img.dataset.pokemon=pokemon.id;
   if(img.dataset.pokemonJa!==pokemon.name)img.dataset.pokemonJa=pokemon.name;
  }
  const locale=root.ChlohaLocale?.get?.()||'ja';
  const description=describe(img.dataset.pokemon,img.dataset.pokemonJa,locale,root.ChlohaLocalePokemonName);
  if(img.alt!==description)img.alt=description;
 }
 function refresh(){
  for(const img of root.document?.querySelectorAll('#attPortrait,#defPortrait')||[])update(img);
 }
 const api=Object.freeze({describe,update,refresh});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.SingularityPortraitAlt=api;
 if(!root.document)return;
 root.document.addEventListener('chloha:localechange',refresh);
 // The portrait may render asynchronously after the restored locale is applied.
 const observer=new MutationObserver(refresh);
 for(const img of root.document.querySelectorAll('#attPortrait,#defPortrait'))observer.observe(img,{attributes:true,attributeFilter:['data-pokemon','data-pokemon-ja']});
 refresh();
})(typeof window!=='undefined'?window:globalThis);
