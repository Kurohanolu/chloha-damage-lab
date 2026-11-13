/* v0.183 initial nine-language UI catalog; stable keys, no gameplay changes. */
'use strict';
const ChlohaLocaleCatalog=Object.freeze({
 ja:Object.freeze({language:'言語',attacker:'攻撃側',defender:'防御側',pokemon:'ポケモン',move:'技',ability:'特性',item:'持ち物',weather:'天候',terrain:'フィールド',damage:'ダメージ',calculate:'計算',noResults:'該当する結果がありません'}),
 en:Object.freeze({language:'Language',attacker:'Attacker',defender:'Defender',pokemon:'Pokémon',move:'Move',ability:'Ability',item:'Held item',weather:'Weather',terrain:'Terrain',damage:'Damage',calculate:'Calculate',noResults:'No matching results'}),
 fr:Object.freeze({language:'Langue',attacker:'Attaquant',defender:'Défenseur',pokemon:'Pokémon',move:'Capacité',ability:'Talent',item:'Objet tenu',weather:'Météo',terrain:'Champ',damage:'Dégâts',calculate:'Calculer',noResults:'Aucun résultat'}),
 de:Object.freeze({language:'Sprache',attacker:'Angreifer',defender:'Verteidiger',pokemon:'Pokémon',move:'Attacke',ability:'Fähigkeit',item:'Getragenes Item',weather:'Wetter',terrain:'Feld',damage:'Schaden',calculate:'Berechnen',noResults:'Keine Ergebnisse'}),
 es:Object.freeze({language:'Idioma',attacker:'Atacante',defender:'Defensor',pokemon:'Pokémon',move:'Movimiento',ability:'Habilidad',item:'Objeto equipado',weather:'Clima',terrain:'Campo',damage:'Daño',calculate:'Calcular',noResults:'Sin resultados'}),
 it:Object.freeze({language:'Lingua',attacker:'Attaccante',defender:'Difensore',pokemon:'Pokémon',move:'Mossa',ability:'Abilità',item:'Strumento',weather:'Meteo',terrain:'Campo',damage:'Danno',calculate:'Calcola',noResults:'Nessun risultato'}),
 ko:Object.freeze({language:'언어',attacker:'공격 측',defender:'방어 측',pokemon:'포켓몬',move:'기술',ability:'특성',item:'지닌물건',weather:'날씨',terrain:'필드',damage:'데미지',calculate:'계산',noResults:'검색 결과 없음'}),
 'zh-Hans':Object.freeze({language:'语言',attacker:'攻击方',defender:'防御方',pokemon:'宝可梦',move:'招式',ability:'特性',item:'携带道具',weather:'天气',terrain:'场地',damage:'伤害',calculate:'计算',noResults:'没有匹配结果'}),
 'zh-Hant':Object.freeze({language:'語言',attacker:'攻擊方',defender:'防禦方',pokemon:'寶可夢',move:'招式',ability:'特性',item:'攜帶道具',weather:'天氣',terrain:'場地',damage:'傷害',calculate:'計算',noResults:'沒有符合的結果'})
});
if(typeof module!=='undefined'&&module.exports)module.exports=ChlohaLocaleCatalog;
if(typeof globalThis!=='undefined')globalThis.ChlohaLocaleCatalog=ChlohaLocaleCatalog;
