/* Verified initial Japanese-English display names; identifiers remain unchanged. */
(()=>{
 const names={
 pokemon:{
 charizard:'Charizard',garchomp:'Garchomp',tyranitar:'Tyranitar',dragonite:'Dragonite',
 venusaur:'Venusaur',blastoise:'Blastoise',meganium:'Meganium',feraligatr:'Feraligatr',
 dragapult:'Dragapult',hydreigon:'Hydreigon',archaludon:'Archaludon',
 pelipper:'Pelipper',ceruledge:'Ceruledge',sneasler:'Sneasler',
 goodra:'Goodra',kommo_o:'Kommo-o',delphox:'Delphox',
 'リザードン':'Charizard','マフォクシー':'Delphox','ガブリアス':'Garchomp',
 'カイリュー':'Dragonite','バンギラス':'Tyranitar'
 },
 moves:{
 'ワイドフォース':'Expanding Force','じしん':'Earthquake','からげんき':'Facade',
 '10まんボルト':'Thunderbolt','まもる':'Protect','ねっぷう':'Heat Wave',
 'ハイドロポンプ':'Hydro Pump','れいとうビーム':'Ice Beam',
 'シャドーボール':'Shadow Ball','サイコキネシス':'Psychic',
 'インファイト':'Close Combat','ムーンフォース':'Moonblast',
 'かえんほうしゃ':'Flamethrower','だいちのちから':'Earth Power',
 'ボルトチェンジ':'Volt Switch','とんぼがえり':'U-turn'
 },
 abilities:{
 'フレンドガード':'Friend Guard','ふゆう':'Levitate','いかく':'Intimidate',
 'ひでり':'Drought','あめふらし':'Drizzle','もらいび':'Flash Fire',
 'てんねん':'Unaware','マルチスケイル':'Multiscale',
 'すいすい':'Swift Swim','ようりょくそ':'Chlorophyll'
 },
 items:{
 'いのちのたま':'Life Orb','こだわりメガネ':'Choice Specs',
 'こだわりハチマキ':'Choice Band','こだわりスカーフ':'Choice Scarf',
 'きあいのタスキ':'Focus Sash','たべのこし':'Leftovers',
 'とつげきチョッキ':'Assault Vest','オボンのみ':'Sitrus Berry',
 'クリアチャーム':'Clear Amulet','ぼうじんゴーグル':'Safety Goggles'
 }
 };
 window.ChlohaNames=Object.freeze(Object.fromEntries(Object.entries(names).map(([k,v])=>[k,Object.freeze(v)])));
})();
