'use strict';
// DATA LAYER: future verified roster/move/item/ability records can be resolved here.
const GameData=Object.freeze({species:new Map(),moves:new Map(),abilities:new Map(),items:new Map()});
const TYPE_PLATES=Object.freeze({flamePlate:'ほのお',splashPlate:'みず',zapPlate:'でんき',meadowPlate:'くさ',iciclePlate:'こおり',fistPlate:'かくとう',toxicPlate:'どく',earthPlate:'じめん',skyPlate:'ひこう',mindPlate:'エスパー',insectPlate:'むし',stonePlate:'いわ',spookyPlate:'ゴースト',dracoPlate:'ドラゴン',dreadPlate:'あく',ironPlate:'はがね',pixiePlate:'フェアリー'});
const RESIST_BERRIES=Object.freeze({chilanBerry:'ノーマル',occaBerry:'ほのお',passhoBerry:'みず',wacanBerry:'でんき',rindoBerry:'くさ',yacheBerry:'こおり',chopleBerry:'かくとう',kebiaBerry:'どく',shucaBerry:'じめん',cobaBerry:'ひこう',payapaBerry:'エスパー',tangaBerry:'むし',chartiBerry:'いわ',kasibBerry:'ゴースト',habanBerry:'ドラゴン',colburBerry:'あく',babiriBerry:'はがね',roseliBerry:'フェアリー'});
const TYPES=['ノーマル','ほのお','みず','でんき','くさ','こおり','かくとう','どく','じめん','ひこう','エスパー','むし','いわ','ゴースト','ドラゴン','あく','はがね','フェアリー'];
function moveTypeEffect(a,t){if(a.attAbility==='scrappy'&&t==='ゴースト'&&['ノーマル','かくとう'].includes(a.moveType))return 1;return a.moveMechanic==='freezeDry'&&t==='みず'?2:a.moveMechanic==='flyingPress'?(EFFECT['かくとう']?.[t]??1)*(EFFECT['ひこう']?.[t]??1):(EFFECT[a.moveType]?.[t]??1);}
const EFFECT={ノーマル:{いわ:.5,ゴースト:0,はがね:.5},ほのお:{ほのお:.5,みず:.5,くさ:2,こおり:2,むし:2,いわ:.5,ドラゴン:.5,はがね:2},みず:{ほのお:2,みず:.5,くさ:.5,じめん:2,いわ:2,ドラゴン:.5},でんき:{みず:2,でんき:.5,くさ:.5,じめん:0,ひこう:2,ドラゴン:.5},くさ:{ほのお:.5,みず:2,くさ:.5,どく:.5,じめん:2,ひこう:.5,むし:.5,いわ:2,ドラゴン:.5,はがね:.5},こおり:{ほのお:.5,みず:.5,くさ:2,こおり:.5,じめん:2,ひこう:2,ドラゴン:2,はがね:.5},かくとう:{ノーマル:2,こおり:2,どく:.5,ひこう:.5,エスパー:.5,むし:.5,いわ:2,ゴースト:0,あく:2,はがね:2,フェアリー:.5},どく:{くさ:2,どく:.5,じめん:.5,いわ:.5,ゴースト:.5,はがね:0,フェアリー:2},じめん:{ほのお:2,でんき:2,くさ:.5,どく:2,ひこう:0,むし:.5,いわ:2,はがね:2},ひこう:{でんき:.5,くさ:2,かくとう:2,むし:2,いわ:.5,はがね:.5},エスパー:{かくとう:2,どく:2,エスパー:.5,あく:0,はがね:.5},むし:{ほのお:.5,くさ:2,かくとう:.5,どく:.5,ひこう:.5,エスパー:2,ゴースト:.5,あく:2,はがね:.5,フェアリー:.5},いわ:{ほのお:2,こおり:2,かくとう:.5,じめん:.5,ひこう:2,むし:2,はがね:.5},ゴースト:{ノーマル:0,エスパー:2,ゴースト:2,あく:.5},ドラゴン:{ドラゴン:2,はがね:.5,フェアリー:0},あく:{かくとう:.5,エスパー:2,ゴースト:2,あく:.5,フェアリー:.5},はがね:{ほのお:.5,みず:.5,でんき:.5,こおり:2,いわ:2,はがね:.5,フェアリー:2},フェアリー:{ほのお:.5,かくとう:2,どく:.5,ドラゴン:2,あく:2,はがね:.5}};
const FP=4096;const fp=n=>Math.round(n*FP);const FIXED_MODS=Object.freeze({half:2048,threeQuarters:3072,onePointTwo:4915,onePointThree:5324,onePointFive:6144,double:8192});
// Round to nearest, ties down: check each mechanic independently against Champions.
const pokeRound=(value,mod)=>Math.floor((value*mod+2047)/FP);const floor=Math.floor;
const stage=(s)=>s>=0?(2+s)/2:2/(2-s);
const pipeline={power:[],stat:[],base:[],preRandom:[],postRandom:[],final:[]};
function registerModifier(layer,id,priority,applies,run){if(!Object.hasOwn(pipeline,layer))throw Error('Invalid layer');pipeline[layer].push({id,priority,applies,run});pipeline[layer].sort((a,b)=>a.priority-b.priority);}
function applyLayer(layer,ctx,value){let v=value;for(const p of pipeline[layer]){if(p.applies(ctx)){const old=v;v=p.run(ctx,v);ctx.trace.push(`${layer}/${p.id}: ${old} → ${v}`);}}return v;}
// stat stage: independent attack/defense layers. Only listed effects are supported.


registerModifier('stat','purePower',12,c=>c.side==='attack'&&c.a.attAbility==='purePower'&&c.a.category==='physical'&&!['bodyPress','foulPlay'].includes(c.a.moveMechanic),(_,v)=>floor(v*2));
registerModifier('stat','plusMinus',13,c=>c.side==='attack'&&['plus','minus'].includes(c.a.attAbility)&&c.a.partnerOppositePlusMinus===true&&c.a.category==='special',(_,v)=>pokeRound(v,6144));
registerModifier('stat','solarPower',13,c=>c.side==='attack'&&c.a.attAbility==='solarPower'&&c.a.category==='special'&&c.a.weather==='sun',(_,v)=>pokeRound(v,6144));
registerModifier('stat','defeatist',11,c=>c.side==='attack'&&c.a.attAbility==='defeatist'&&c.a.attCurrentHp*2<=c.a.attMaxHp&&!['bodyPress','foulPlay'].includes(c.a.moveMechanic),(_,v)=>floor(v/2));
registerModifier('stat','orichalcumPulse',13,c=>c.side==='attack'&&c.a.attAbility==='orichalcumPulse'&&c.a.category==='physical'&&c.a.weather==='sun'&&!['bodyPress','foulPlay'].includes(c.a.moveMechanic),(_,v)=>pokeRound(v,5461));
registerModifier('stat','hadronEngine',13,c=>c.side==='attack'&&c.a.attAbility==='hadronEngine'&&c.a.category==='special'&&c.a.terrain==='electric',(_,v)=>pokeRound(v,5461));
registerModifier('stat','toxicBoost',13,c=>c.side==='attack'&&c.a.attAbility==='toxicBoost'&&c.a.category==='physical'&&c.a.poisoned,(_,v)=>pokeRound(v,6144));
registerModifier('stat','flareBoost',13,c=>c.side==='attack'&&c.a.attAbility==='flareBoost'&&c.a.category==='special'&&c.a.burn,(_,v)=>pokeRound(v,6144));
registerModifier('stat','hustle',13,c=>c.side==='attack'&&c.a.attAbility==='hustle'&&c.a.category==='physical'&&!['bodyPress','foulPlay'].includes(c.a.moveMechanic),(_,v)=>pokeRound(v,6144));
registerModifier('stat','hugePower',12,c=>c.side==='attack'&&c.a.attAbility==='hugePower'&&c.a.category==='physical'&&!['bodyPress','foulPlay'].includes(c.a.moveMechanic),(_,v)=>floor(v*2));
registerModifier('stat','grassPelt',10,c=>c.side==='defense'&&c.a.defAbility==='grassPelt'&&c.a.terrain==='grassy',(_,v)=>pokeRound(v,6144));
registerModifier('stat','marvelScale',10,c=>c.side==='defense'&&c.a.defAbility==='marvelScale'&&['burn','poison','paralysis','sleep','freeze'].includes(c.a.defStatus),(_,v)=>pokeRound(v,6144));
registerModifier('stat','furCoat',10,c=>c.side==='defense'&&c.a.defAbility==='furCoat'&&c.a.category==='physical',(_,v)=>floor(v*2));
registerModifier('stat','thickFat',11,c=>c.side==='attack'&&c.a.defAbility==='thickFat'&&['ほのお','こおり'].includes(c.a.moveType),(_,v)=>pokeRound(v,2048));
registerModifier('stat','guts',14,c=>c.side==='attack'&&c.a.attAbility==='guts'&&c.a.burn&&c.a.category==='physical'&&c.a.moveMechanic!=='bodyPress',(_,v)=>pokeRound(v,6144));
registerModifier('stat','choiceBand',15,c=>c.side==='attack'&&c.a.category==='physical'&&c.a.attItem==='choiceBand'&&!['bodyPress','foulPlay'].includes(c.a.moveMechanic),(_,v)=>pokeRound(v,6144));
registerModifier('stat','choiceSpecs',16,c=>c.side==='attack'&&c.a.category==='special'&&c.a.attItem==='choiceSpecs',(_,v)=>pokeRound(v,6144));
registerModifier('stat','assaultVest',17,c=>c.side==='defense'&&c.a.category==='special'&&c.a.moveMechanic!=='psyshock'&&c.a.defItem==='assaultVest',(_,v)=>pokeRound(v,6144));
registerModifier('stat','sandRockSpD',20,c=>c.side==='defense'&&c.a.category==='special'&&c.a.moveMechanic!=='psyshock'&&c.a.weather==='sand'&&c.a.defTypes.includes('いわ'),(_,v)=>pokeRound(v,6144));
registerModifier('stat','snowIceDef',21,c=>c.side==='defense'&&(c.a.category==='physical'||c.a.moveMechanic==='psyshock')&&c.a.weather==='snow'&&c.a.defTypes.includes('こおり'),(_,v)=>pokeRound(v,6144));

function isGrounded(a,side){
 const mode=a[side+'Grounding']||'auto';
 if(mode!=='auto')return mode==='grounded';
 return !a[side+'Types'].includes('ひこう')&&a[side+'Ability']!=='levitate';
}
// Standard terrain power effects; exact Champions rounding remains unverified.
// Stable move IDs: language-independent mechanics, not display-name matching.
const SHEER_FORCE_VERIFIED_MOVES=new Set(['flamethrower','fireBlast','iceBeam','thunderbolt','sludgeBomb']);
const MEGA_LAUNCHER_MOVES=new Set(['darkPulse','auraSphere','gw0169_s059','gw0169_s065','gw0169_s027']);
const SHARPNESS_MOVES=new Set(['airSlash','gw0170b_019','gw0170_s055','gw0169_p044','gw0170b_013','v096_086','v096_076','gw0169_p061','v095_63','xScissor','gw0169_p039','gw0169_p031','gw0169_p054','gw0169_p075','gw0170_s020','gw0170_u008','gw0170_s047','gw0169_p023','v096_088','dragonClaw']);
const IRON_FIST_MOVES=new Set(['v096_096','gw0169_p019','gw0169_p026','gw0169_p042','gw0169_p049','gw0170_s004','gw0170_s012','gw0170_u031','gw0170_s038','gw0170_s044','gw0170_s057','gw0170b_004']);
const STRONG_JAW_MOVES=new Set(['crunch','v096_085','gw0169_p017','gw0169_p018','gw0169_p073','gw0170_s037','gw0170b_002']);
const TOUGH_CLAWS_CONTACT_MOVES=new Set(["dragonClaw","outrage","crunch","highHorsepower","ddLariat","closeCombat","waterfall","flareBlitz","woodHammer","ironHead","braveBird","suckerPunch","playRough","bodyPress","liquidation","poisonJab","xScissor","wildCharge","v096_073","v096_074","v096_075","v096_077","v096_078","v096_079","v096_081","v096_082","v096_083","v096_084","v096_085","v096_086","v096_087","v096_088","v096_089","v096_090","v096_091","v096_093","v096_095","v096_096","v096_097","v096_098","gw0169_p002","gw0169_p003","gw0169_p004","gw0169_p005","gw0169_p007","gw0169_p009","gw0169_p010","gw0169_p015","gw0169_p017","gw0169_p018","gw0169_p019","gw0169_p021","gw0169_p022","gw0169_p023","gw0169_p026","gw0169_p027","gw0169_p029","gw0169_p030","gw0169_p031","gw0169_p032","gw0169_p033","gw0169_p035","gw0169_p036","gw0169_p037","gw0169_p038","gw0169_p039","gw0169_p042","gw0169_p043","gw0169_p045","gw0169_p047","gw0169_p049","gw0169_p051","gw0169_p053","gw0169_p054","gw0169_p056","gw0169_p060","gw0169_p061","gw0169_p064","gw0169_p066","gw0169_p067","gw0169_p068","gw0169_p069","gw0169_p070","gw0169_p071","gw0169_p072","gw0169_p073","gw0169_p075","gw0169_p078","gw0169_p079","gw0169_s035","gw0169_s042","gw0169_s055","gw0170_s002","gw0170_s003","gw0170_s004","gw0170_s005","gw0170_s006","gw0170_s007","gw0170_u008","gw0170_s009","gw0170_s010","gw0170_s011","gw0170_s012","gw0170_u013","gw0170_u014","gw0170_s015","gw0170_u017","gw0170_s018","gw0170_s020","gw0170_s022","gw0170_s024","gw0170_s027","gw0170_u028","gw0170_s029","gw0170_s030","gw0170_s032","gw0170_s035","gw0170_s036","gw0170_s037","gw0170_s038","gw0170_s039","gw0170_s041","gw0170_s043","gw0170_s044","gw0170_s046","gw0170_s047","gw0170_s048","gw0170_s049","gw0170_s051","gw0170_u053","gw0170_s055","gw0170_u056","gw0170_s057","gw0170_s059","gw0170b_001","gw0170b_002","gw0170b_004","gw0170b_006","gw0170b_013","gw0170b_014","gw0170b_016","gw0170b_017","gw0170b_019","gw0170b_020","gw0170b_021","gw0170b_022","gw0170b_023","gw0170b_024","gw0170b_026"]);
const RECKLESS_MOVES=new Set(['flareBlitz','woodHammer','braveBird','wildCharge','v096_090','gw0169_p007','gw0170_s041','gw0170_s051']);
// Pokemon Showdown data/moves.ts flags.bullet, mapped by Japanese move name to local catalog IDs.
const BULLETPROOF_BALL_MOVES=new Set(["v095_61","auraSphere","gw0169_p034","gw0169_p059","electroBall","energyBall","gw0169_s013","gw0169_p048","gw0169_s012","gw0169_p014","gw0170_u058","gw0169_p025","v096_092","shadowBall","sludgeBomb","gw0169_s056","gw0169_s005","gw0169_s032"]);
// Pokemon Showdown data/moves.ts flags.sound, mapped by Japanese move name to local catalog IDs.
const PUNK_ROCK_SOUND_MOVES=new Set(["gw0169_s062","gw0169_s041","bugBuzz","gw0169_s025","gw0169_s050","hyperVoice","gw0169_s010","gw0169_s018","gw0169_s067","gw0169_s046","gw0169_s004","gw0169_s007","gw0169_s053","gw0169_s019"]);
const SKIN_TYPE_EXCLUDED_MOVES=new Set(['judgment','multiattack','naturalgift','revelationdance','technoblast','struggle']);
const SKIN_ABILITY_TYPES=Object.freeze({pixilate:'フェアリー',aerilate:'ひこう',refrigerate:'こおり',galvanize:'でんき',dragonize:'ドラゴン'});
const ABILITY_CATALOG=Object.freeze({
 moldBreaker:{ja:'かたやぶり',en:'Mold Breaker',coverage:'supported'},
 teravolt:{ja:'テラボルテージ',en:'Teravolt',coverage:'supported'},
 turboblaze:{ja:'ターボブレイズ',en:'Turboblaze',coverage:'supported'},
 skillLink:{ja:'スキルリンク',en:'Skill Link',coverage:'supported'},
 technician:{ja:'テクニシャン',en:'Technician',coverage:'supported'},
 sheerForce:{ja:'ちからずく',en:'Sheer Force',coverage:'partial'},
 megaLauncher:{ja:'メガランチャー',en:'Mega Launcher',coverage:'partial'},
 sharpness:{ja:'きれあじ',en:'Sharpness',coverage:'partial'},
 hugePower:{ja:'ちからもち',en:'Huge Power',coverage:'supported'},
 purePower:{ja:'ヨガパワー',en:'Pure Power',coverage:'supported'},
 hustle:{ja:'はりきり',en:'Hustle',coverage:'partial'},
 solarPower:{ja:'サンパワー',en:'Solar Power',coverage:'supported'},
 flareBoost:{ja:'ねつぼうそう',en:'Flare Boost',coverage:'supported'},
 toxicBoost:{ja:'どくぼうそう',en:'Toxic Boost',coverage:'supported'},
 fireMane:{ja:'ほのおのたてがみ',en:'Fire Mane',coverage:'supported'},
 flashFire:{ja:'もらいび',en:'Flash Fire',coverage:'partial'},
 defeatist:{ja:'よわき',en:'Defeatist',coverage:'supported'},
 orichalcumPulse:{ja:'ひひいろのこどう',en:'Orichalcum Pulse',coverage:'partial'},
 hadronEngine:{ja:'ハドロンエンジン',en:'Hadron Engine',coverage:'partial'},
 waterBubble:{ja:'すいほう',en:'Water Bubble',coverage:'partial'},
 fairyAura:{ja:'フェアリーオーラ',en:'Fairy Aura',coverage:'partial'},
 darkAura:{ja:'ダークオーラ',en:'Dark Aura',coverage:'partial'},
 auraBreak:{ja:'オーラブレイク',en:'Aura Break',coverage:'partial'},
 ironFist:{ja:'てつのこぶし',en:'Iron Fist',coverage:'partial'},
 strongJaw:{ja:'がんじょうあご',en:'Strong Jaw',coverage:'partial'},
 transistor:{ja:'トランジスタ',en:'Transistor',coverage:'supported'},
 dragonsMaw:{ja:'りゅうのあぎと',en:"Dragon's Maw",coverage:'supported'},
 analytic:{ja:'アナライズ',en:'Analytic',coverage:'partial'},
 reckless:{ja:'すてみ',en:'Reckless',coverage:'partial'},
 toughClaws:{ja:'かたいツメ',en:'Tough Claws',coverage:'supported'},
 steelworker:{ja:'はがねつかい',en:'Steelworker',coverage:'supported'},
 steelSpirit:{ja:'はがねのせいしん',en:'Steely Spirit',coverage:'partial'},
 infiltrator:{ja:'すりぬけ',en:'Infiltrator',coverage:'partial'},
 scrappy:{ja:'きもったま',en:'Scrappy',coverage:'supported'},
 thermalExchange:{ja:'ねつこうかん',en:'Thermal Exchange',coverage:'partial'},
 angerPoint:{ja:'いかりのつぼ',en:'Anger Point',coverage:'partial'},
 rattled:{ja:'びびり',en:'Rattled',coverage:'partial'},
 drizzle:{ja:'あめふらし',en:'Drizzle',coverage:'partial'},
 drought:{ja:'ひでり',en:'Drought',coverage:'partial'},
 sandStream:{ja:'すなおこし',en:'Sand Stream',coverage:'partial'},
 snowWarning:{ja:'ゆきふらし',en:'Snow Warning',coverage:'partial'},
 electricSurge:{ja:'エレキメイカー',en:'Electric Surge',coverage:'partial'},
 grassySurge:{ja:'グラスメイカー',en:'Grassy Surge',coverage:'partial'},
 mistySurge:{ja:'ミストメイカー',en:'Misty Surge',coverage:'partial'},
 psychicSurge:{ja:'サイコメイカー',en:'Psychic Surge',coverage:'partial'},
 sniper:{ja:'スナイパー',en:'Sniper',coverage:'supported'},
 neuroforce:{ja:'ブレインフォース',en:'Neuroforce',coverage:'supported'},
 stakeout:{ja:'はりこみ',en:'Stakeout',coverage:'partial'},
 supremeOverlord:{ja:'そうだいしょう',en:'Supreme Overlord',coverage:'supported'},
 battery:{ja:'バッテリー',en:'Battery',coverage:'partial'},
 powerSpot:{ja:'パワースポット',en:'Power Spot',coverage:'partial'},
 plus:{ja:'プラス',en:'Plus',coverage:'partial'},
 minus:{ja:'マイナス',en:'Minus',coverage:'partial'},
 rockyPayload:{ja:'いわはこび',en:'Rocky Payload',coverage:'supported'},
 sandForce:{ja:'すなのちから',en:'Sand Force',coverage:'supported'},
 punkRock:{ja:'パンクロック',en:'Punk Rock',coverage:'partial'},
 pixilate:{ja:'フェアリースキン',en:'Pixilate',coverage:'supported'},
 aerilate:{ja:'スカイスキン',en:'Aerilate',coverage:'supported'},
 refrigerate:{ja:'フリーズスキン',en:'Refrigerate',coverage:'supported'},
 galvanize:{ja:'エレキスキン',en:'Galvanize',coverage:'supported'},
 dragonize:{ja:'ドラゴンスキン',en:'Dragonize',coverage:'supported'},
 normalize:{ja:'ノーマルスキン',en:'Normalize',coverage:'supported'},
 overgrow:{ja:'しんりょく',en:'Overgrow',coverage:'supported'},
 blaze:{ja:'もうか',en:'Blaze',coverage:'supported'},
 torrent:{ja:'げきりゅう',en:'Torrent',coverage:'supported'},
 swarm:{ja:'むしのしらせ',en:'Swarm',coverage:'supported'},
 guts:{ja:'こんじょう',en:'Guts',coverage:'supported'},
 adaptability:{ja:'てきおうりょく',en:'Adaptability',coverage:'supported'},
 tintedLens:{ja:'いろめがね',en:'Tinted Lens',coverage:'supported'},
 levitate:{ja:'ふゆう',en:'Levitate',coverage:'supported'}
});
const ABILITY_ID_BY_JA=Object.freeze(Object.fromEntries(Object.entries(ABILITY_CATALOG).map(([id,data])=>[data.ja,id])));

registerModifier('power','typePlate',0,c=>TYPE_PLATES[c.a.attItem]===c.a.moveType,(_,v)=>pokeRound(v,4915));
registerModifier('power','aura',0,c=>((c.a.moveType==='フェアリー'&&[c.a.attAbility,c.a.defAbility].includes('fairyAura'))||(c.a.moveType==='あく'&&[c.a.attAbility,c.a.defAbility].includes('darkAura'))),(c,v)=>pokeRound(v,[c.a.attAbility,c.a.defAbility].includes('auraBreak')?3072:5448));
registerModifier('power','waterBubble',0,c=>c.a.attAbility==='waterBubble'&&c.a.moveType==='みず',(_,v)=>floor(v*2));
registerModifier('power','skinAbility',0,c=>c.a.skinBoost===true,(_,v)=>pokeRound(v,4915));
registerModifier('power','overgrow',1,c=>c.a.attAbility==='overgrow'&&c.a.moveType==='くさ'&&(c.a.forceLowHpAbility===true||c.a.attCurrentHp*3<=c.a.attMaxHp),(_,v)=>pokeRound(v,6144));
registerModifier('power','blaze',1,c=>c.a.attAbility==='blaze'&&c.a.moveType==='ほのお'&&(c.a.forceLowHpAbility===true||c.a.attCurrentHp*3<=c.a.attMaxHp),(_,v)=>pokeRound(v,6144));
registerModifier('power','torrent',1,c=>c.a.attAbility==='torrent'&&c.a.moveType==='みず'&&(c.a.forceLowHpAbility===true||c.a.attCurrentHp*3<=c.a.attMaxHp),(_,v)=>pokeRound(v,6144));
registerModifier('power','swarm',1,c=>c.a.attAbility==='swarm'&&c.a.moveType==='むし'&&(c.a.forceLowHpAbility===true||c.a.attCurrentHp*3<=c.a.attMaxHp),(_,v)=>pokeRound(v,6144));
registerModifier('power','steelSpirit',1,c=>c.a.attAbility==='steelSpirit'&&c.a.moveType==='はがね',(_,v)=>pokeRound(v,6144));
registerModifier('power','fireMane',1,c=>c.a.attAbility==='fireMane'&&c.a.moveType==='ほのお',(_,v)=>pokeRound(v,6144));
registerModifier('power','steelworker',1,c=>c.a.attAbility==='steelworker'&&c.a.moveType==='はがね',(_,v)=>pokeRound(v,6144));
registerModifier('power','punkRock',1,c=>c.a.attAbility==='punkRock'&&PUNK_ROCK_SOUND_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,5325));
registerModifier('power','sandForce',1,c=>c.a.attAbility==='sandForce'&&c.a.weather==='sand'&&['いわ','じめん','はがね'].includes(c.a.moveType),(_,v)=>pokeRound(v,5325));
registerModifier('power','rockyPayload',1,c=>c.a.attAbility==='rockyPayload'&&c.a.moveType==='いわ',(_,v)=>pokeRound(v,6144));
registerModifier('power','toughClaws',1,c=>c.a.attAbility==='toughClaws'&&TOUGH_CLAWS_CONTACT_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,5325));
registerModifier('power','reckless',1,c=>c.a.attAbility==='reckless'&&RECKLESS_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,4915));
registerModifier('power','transistor',1,c=>c.a.attAbility==='transistor'&&c.a.moveType==='でんき',(_,v)=>pokeRound(v,5325));
registerModifier('power','dragonsMaw',1,c=>c.a.attAbility==='dragonsMaw'&&c.a.moveType==='ドラゴン',(_,v)=>pokeRound(v,6144));
registerModifier('power','ironFist',1,c=>c.a.attAbility==='ironFist'&&IRON_FIST_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,4915));
registerModifier('power','strongJaw',1,c=>c.a.attAbility==='strongJaw'&&STRONG_JAW_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,6144));
registerModifier('power','megaLauncher',2,c=>c.a.attAbility==='megaLauncher'&&MEGA_LAUNCHER_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,6144));
registerModifier('power','sharpness',3,c=>c.a.attAbility==='sharpness'&&SHARPNESS_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,6144));
registerModifier('power','sheerForce',4,c=>c.a.attAbility==='sheerForce'&&SHEER_FORCE_VERIFIED_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,5325));
registerModifier('power','technician',5,c=>c.a.attAbility==='technician'&&c.a.power>0,(c,v)=>v<=60?pokeRound(v,6144):v);
registerModifier('power','terrainBoost',10,c=>isGrounded(c.a,'att')&&({electric:'でんき',grassy:'くさ',psychic:'エスパー'})[c.a.terrain]===c.a.moveType,(_,v)=>pokeRound(v,5325));
registerModifier('power','mistyDragon',20,c=>c.a.terrain==='misty'&&c.a.moveType==='ドラゴン'&&isGrounded(c.a,'def'),(_,v)=>pokeRound(v,2048));
registerModifier('power','grassyEarthquake',21,c=>c.a.terrain==='grassy'&&c.a.moveId==='earthquake'&&isGrounded(c.a,'def'),(_,v)=>pokeRound(v,2048));
registerModifier('power','helpingHand',30,c=>c.a.helpingHand,(_,v)=>pokeRound(v,6144));
registerModifier('preRandom','spread',10,c=>c.a.battleFormat==='doubles'&&c.a.spread==='spread',(_,v)=>pokeRound(v,3072));
registerModifier('preRandom','weather',20,c=>((c.a.weather==='sun'||c.a.weather==='rain')&&['ほのお','みず'].includes(c.a.moveType)),(c,v)=>{const boost=(c.a.moveType==='ほのお'&&c.a.weather==='sun')||(c.a.moveType==='みず'&&c.a.weather==='rain');return pokeRound(v,boost?6144:2048)});
registerModifier('preRandom','sniper',31,c=>c.a.critical&&c.a.attAbility==='sniper',(_,v)=>pokeRound(v,6144));
registerModifier('preRandom','critical',30,c=>c.a.critical,(_,v)=>pokeRound(v,6144));
registerModifier('postRandom','stab',10,c=>c.stab!==1,(c,v)=>pokeRound(v,fp(c.stab)));
// Type effectiveness: combine both defending types, then apply once; test against game data before claiming exact Champions parity.
registerModifier('postRandom','type',20,()=>true,(c,v)=>floor(v*c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)));

// Explicit late modifiers: no blanket multiplication. The exact game rounding is
// still subject to independent test vectors; trace exposes each step.
// The screen and Friend Guard reductions share the final-damage modifier chain.
// Combine fixed-point modifiers before applying once to avoid intermediate rounding.
const hasActiveScreen=a=>a.attAbility!=='infiltrator'&&!a.critical&&((a.screen==='reflect'&&a.category==='physical')||(a.screen==='lightScreen'&&a.category==='special'));
registerModifier('final','friendGuard',5,c=>c.a.friendGuardCount>0&&!hasActiveScreen(c.a),(c,v)=>{for(let i=0;i<c.a.friendGuardCount;i++)v=pokeRound(v,3072);return v;});
registerModifier('final','burn',10,c=>c.a.burn&&c.a.category==='physical'&&!['guts','waterBubble'].includes(c.a.attAbility)&&c.a.moveMechanic!=='facade',(_,v)=>pokeRound(v,2048));
registerModifier('final','screen',20,c=>hasActiveScreen(c.a),(c,v)=>{let modifier=c.a.battleFormat==='singles'?2048:2732;for(let i=0;i<c.a.friendGuardCount;i++)modifier=pokeRound(modifier,3072);return pokeRound(v,modifier);});

registerModifier('final','fluffyContact',40,c=>c.a.defAbility==='fluffy'&&TOUGH_CLAWS_CONTACT_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,2048));
registerModifier('final','fluffyFire',40,c=>c.a.defAbility==='fluffy'&&c.a.moveType==='ほのお',(_,v)=>pokeRound(v,8192));
registerModifier('final','auraGuard',40,c=>c.a.defAbility==='auraGuard'&&TOUGH_CLAWS_CONTACT_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,2048));
registerModifier('final','punkRockDefense',40,c=>c.a.defAbility==='punkRock'&&PUNK_ROCK_SOUND_MOVES.has(c.a.moveId),(_,v)=>pokeRound(v,2048));
registerModifier('final','iceScales',40,c=>c.a.defAbility==='iceScales'&&c.a.category==='special',(_,v)=>pokeRound(v,2048));
registerModifier('final','resistBerry',39,c=>(c.a.defItem==='autoResistBerry'||RESIST_BERRIES[c.a.defItem]===c.a.moveType)&&(c.a.moveType==='ノーマル'?(c.a.defItem==='autoResistBerry'||c.a.defItem==='chilanBerry'):c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>1),(_,v)=>pokeRound(v,2048));
registerModifier('final','purifyingSalt',40,c=>c.a.defAbility==='purifyingSalt'&&c.a.moveType==='ゴースト',(_,v)=>pokeRound(v,2048));
registerModifier('final','drySkinFire',40,c=>c.a.defAbility==='drySkin'&&c.a.moveType==='ほのお',(_,v)=>pokeRound(v,5120));
registerModifier('final','heatproof',40,c=>c.a.defAbility==='heatproof'&&c.a.moveType==='ほのお',(_,v)=>pokeRound(v,2048));
registerModifier('final','waterBubbleDefense',40,c=>c.a.defAbility==='waterBubble'&&c.a.moveType==='ほのお',(_,v)=>pokeRound(v,2048));
registerModifier('final','shadowShield',40,c=>c.a.defAbility==='shadowShield'&&c.a.currentHp===c.a.hp,(_,v)=>pokeRound(v,2048));
registerModifier('final','multiscale',40,c=>c.a.defAbility==='multiscale'&&c.a.currentHp===c.a.hp,(_,v)=>pokeRound(v,2048));
registerModifier('final','supremeOverlord',37,c=>c.a.attAbility==='supremeOverlord'&&(c.a.supremeOverlordFainted||0)>0,(c,v)=>pokeRound(v,4096+Math.round(409.6*Math.min(5,c.a.supremeOverlordFainted))));
registerModifier('final','flashFireBoost',38,c=>c.a.attAbility==='flashFire'&&c.a.flashFireActivated===true&&c.a.moveType==='ほのお',(_,v)=>pokeRound(v,6144));
registerModifier('final','battery',38,c=>c.a.allyBattery===true&&c.a.category==='special',(_,v)=>pokeRound(v,5325));
registerModifier('final','powerSpot',38,c=>c.a.allyPowerSpot===true,(_,v)=>pokeRound(v,5325));
registerModifier('final','neuroforce',39,c=>c.a.attAbility==='neuroforce'&&c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>1,(_,v)=>pokeRound(v,5120));
registerModifier('final','stakeout',39,c=>c.a.attAbility==='stakeout'&&c.a.targetSwitchedIn===true,(_,v)=>pokeRound(v,8192));
registerModifier('final','analytic',41,c=>c.a.attAbility==='analytic',(_,v)=>pokeRound(v,5325));
registerModifier('final','tintedLens',42,c=>c.a.attAbility==='tintedLens'&&c.a.defTypes.reduce((m,t)=>m*(EFFECT[c.a.moveType]?.[t]??1),1)>0&&c.a.defTypes.reduce((m,t)=>m*(EFFECT[c.a.moveType]?.[t]??1),1)<1,(_,v)=>pokeRound(v,8192));
registerModifier('final','prismArmor',43,c=>c.a.defAbility==='prismArmor'&&c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>1,(_,v)=>pokeRound(v,3072));
registerModifier('final','filter',43,c=>['filter','solidRock'].includes(c.a.defAbility)&&c.a.defTypes.reduce((m,t)=>m*(EFFECT[c.a.moveType]?.[t]??1),1)>1,(_,v)=>pokeRound(v,3072));
registerModifier('final','expertBelt',45,c=>c.a.attItem==='expertBelt'&&c.a.defTypes.reduce((m,t)=>m*(EFFECT[c.a.moveType]?.[t]??1),1)>1,(_,v)=>pokeRound(v,4915));
registerModifier('final','lifeOrb',50,c=>c.a.attItem==='lifeOrb',(_,v)=>pokeRound(v,5324));
registerModifier('final','customMultiplier',90,c=>(c.a.customMultiplier??1)!==1,(c,v)=>pokeRound(v,fp(c.a.customMultiplier)));
function validate(a){
 if(a.defStatus!==undefined&&!['none','burn','poison','paralysis','sleep','freeze'].includes(a.defStatus))throw Error('防御側の状態異常が不正');
 for(const k of ['thermalExchangeActivated','angerPointActivated','rattledActivated'])if(a[k]!==undefined&&typeof a[k]!=='boolean')throw Error('特性発動条件が不正');
 if(a.poisoned!==undefined&&typeof a.poisoned!=='boolean')throw Error('どく状態が不正');
 if(a.flashFireActivated!==undefined&&typeof a.flashFireActivated!=='boolean')throw Error('もらいび条件が不正');
 if(a.allyBattery!==undefined&&typeof a.allyBattery!=='boolean')throw Error('バッテリー条件が不正');
 if(a.allyPowerSpot!==undefined&&typeof a.allyPowerSpot!=='boolean')throw Error('パワースポット条件が不正');
 if(a.supremeOverlordFainted!==undefined&&(!Number.isInteger(a.supremeOverlordFainted)||a.supremeOverlordFainted<0||a.supremeOverlordFainted>5))throw Error('そうだいしょうのひんし数が不正');
 if(a.targetSwitchedIn!==undefined&&typeof a.targetSwitchedIn!=='boolean')throw Error('はりこみ交代条件が不正');
 if(a.partnerOppositePlusMinus!==undefined&&typeof a.partnerOppositePlusMinus!=='boolean')throw Error('味方プラス／マイナス設定が不正');
 if(a.forceLowHpAbility!==undefined&&typeof a.forceLowHpAbility!=='boolean')throw Error('HP条件特性の強制発動設定が不正');
 if(!Number.isFinite(a.customMultiplier??1)||(a.customMultiplier??1)<.01||(a.customMultiplier??1)>10)throw Error('追加倍率は0.01〜10で入力してください');
 if(!['none','electric','grassy','misty','psychic'].includes(a.terrain))throw Error('フィールドが不正');
 for(const side of ['att','def'])if(!['auto','grounded','airborne'].includes(a[side+'Grounding']||'auto'))throw Error('接地設定が不正');
for(const k of ['level','power','attack','defense','hp'])if(!Number.isSafeInteger(a[k])||a[k]<1)throw Error(k+' は1以上の整数を入力');if(!Number.isSafeInteger(a.currentHp)||a.currentHp<0)throw Error('現在HPは0以上の整数を入力');if(a.level!==50||a.power>500||a.attack>9999||a.defense>9999||a.hp>9999||a.currentHp>a.hp)throw Error('入力範囲またはHPを確認');for(const k of ['attackStage','defenseStage'])if(!Number.isInteger(a[k])||a[k]<-6||a[k]>6)throw Error('能力ランクは-6〜+6');if(typeof a.attAbility!=='string'||typeof a.defAbility!=='string')throw Error('特性の入力が不正');if(a.attAbility.startsWith('unsupported:')||a.defAbility.startsWith('unsupported:'))throw Error('選択した特性は計算未対応です。未適用を選ぶか、対応特性を選択してください');if(!Number.isSafeInteger(a.attCurrentHp)||a.attCurrentHp<1||a.attCurrentHp>a.attMaxHp)throw Error('攻撃側現在HPが不正です');if(typeof a.helpingHand!=='boolean'||!Number.isInteger(a.friendGuardCount)||a.friendGuardCount<0||a.friendGuardCount>1)throw Error('味方の支援設定が不正');if(a.battleFormat==='singles'&&(a.friendGuardCount>0||a.helpingHand||a.spread==='spread'))throw Error('シングルでは味方支援・複数対象の範囲技補正を指定できません');if(!['none','loadedDice','lifeOrb','choiceBand','choiceSpecs','expertBelt',...Object.keys(TYPE_PLATES)].includes(a.attItem)||!['none','assaultVest','autoResistBerry',...Object.keys(RESIST_BERRIES)].includes(a.defItem)||!['none','moldBreaker','teravolt','turboblaze','skillLink','technician','sheerForce','megaLauncher','sharpness','hugePower','purePower','hustle','solarPower','flareBoost','toxicBoost','fireMane','flashFire','defeatist','orichalcumPulse','hadronEngine','waterBubble','fairyAura','darkAura','auraBreak','ironFist','strongJaw','transistor','dragonsMaw','analytic','reckless','toughClaws','steelworker','steelSpirit','plus','minus','infiltrator','scrappy','thermalExchange','angerPoint','rattled','drizzle','drought','sandStream','snowWarning','electricSurge','grassySurge','mistySurge','psychicSurge','sniper','neuroforce','stakeout','supremeOverlord','rockyPayload','sandForce','punkRock','pixilate','aerilate','refrigerate','galvanize','dragonize','normalize','overgrow','blaze','torrent','swarm','guts','adaptability','tintedLens','levitate','unaware','clearBody'].includes(a.attAbility)||!['none','thickFat','multiscale','furCoat','iceScales','punkRock','fluffy','auraGuard','bulletproof','soundproof','overcoat','unaware','clearBody','intimidate','purifyingSalt','shellArmor','battleArmor','grassPelt','marvelScale','wonderGuard','drySkin','heatproof','waterBubble','prismArmor','shadowShield','levitate','waterAbsorb','voltAbsorb','lightningRod','motorDrive','sapSipper','stormDrain','earthEater','wellBakedBody','flashFire','filter','solidRock','fairyAura','darkAura','auraBreak'].includes(a.defAbility)||!['auto','none'].includes(a.stabMode))throw Error('持ち物・特性・タイプ一致補正の指定が不正');if(!Number.isSafeInteger(a.attMaxHp)||a.attMaxHp<1||a.attMaxHp>9999||a.attCurrentHp>a.attMaxHp)throw Error('攻撃側HPの入力が不正');if(typeof a.burn!=='boolean'||typeof a.critical!=='boolean')throw Error('状態異常・急所設定が不正');if(!['rageFist','reversal','lastRespects','gyroBall','storedPower','none','psyshock','bodyPress','foulPlay','hpScaledPower','electroBall','forcedCritical','sacredSword','activationAssumed','weatherBall','terrainPulse','auraWheel','ragingBull','flyingPress','freezeDry','hardPress','acrobatics','ironRoller','dualWingbeat','knockOff','stompingTantrum','hex','facade','venoshock','barbBarrage','infernalParade','assurance','payback','avalanche','lashOut','temperFlare','round','fickleBeam','expandingForce','risingVoltage','mistyExplosion','beatUpManual','flingManual','spitUp','chargeSpABoost'].includes(a.moveMechanic||'none'))throw Error('技固有効果が不正');if(!['singles','doubles'].includes(a.battleFormat)||!['single','spread'].includes(a.spread)||!['none','sun','rain','sand','snow'].includes(a.weather)||!['physical','special'].includes(a.category)||!['none','reflect','lightScreen'].includes(a.screen))throw Error('対戦条件が不正');if(!Array.isArray(a.attTypes)||!Array.isArray(a.defTypes)||!TYPES.includes(a.moveType)||a.attTypes.some(t=>!TYPES.includes(t))||a.defTypes.some(t=>!TYPES.includes(t))||a.defTypes.length===0||a.defTypes.length>2||a.attTypes.length===0||a.attTypes.length>2||new Set(a.defTypes).size!==a.defTypes.length||new Set(a.attTypes).size!==a.attTypes.length)throw Error('タイプが不正');}
function effectiveSpeed(base,rank,paralyzed,tailwind){if(!Number.isSafeInteger(base)||base<1||base>9999||!Number.isInteger(rank)||rank< -6||rank>6||typeof paralyzed!=='boolean'||typeof tailwind!=='boolean')throw Error('素早さ設定が不正です');let v=Math.max(1,Math.floor(base*stage(rank)));if(paralyzed)v=Math.max(1,Math.floor(v/2));if(tailwind)v*=2;return v;}
function electroBallPower(att,def){if(!Number.isSafeInteger(att)||!Number.isSafeInteger(def)||att<1||def<1)throw Error('素早さ比が不正です');if(att>=4*def)return 150;if(att>=3*def)return 120;if(att>=2*def)return 80;if(att>=def)return 60;return 40;}
function hpScaledPower(current,max){if(!Number.isSafeInteger(current)||!Number.isSafeInteger(max)||max<1||current<1||current>max)throw Error('攻撃側HPの指定が不正');return Math.max(1,Math.floor(150*current/max));}
const MOLD_BREAKER_ABILITIES=new Set(['moldBreaker','teravolt','turboblaze']);
const MOLD_BREAKER_IGNORED_DEFENSE=new Set(['multiscale','furCoat','iceScales','punkRock','fluffy','auraGuard','bulletproof','soundproof','unaware','purifyingSalt','shellArmor','battleArmor','grassPelt','marvelScale','wonderGuard','drySkin','heatproof','waterBubble','thickFat','levitate','waterAbsorb','stormDrain','sapSipper','lightningRod','motorDrive','earthEater','wellBakedBody','voltAbsorb','flashFire','filter','solidRock']);
function calculate(a){
 if(MOLD_BREAKER_ABILITIES.has(a.attAbility)&&MOLD_BREAKER_IGNORED_DEFENSE.has(a.defAbility))a={...a,defAbility:'none'};
 if(a.terrain==='none'){const terrainByAbility={electricSurge:'electric',grassySurge:'grassy',mistySurge:'misty',psychicSurge:'psychic'};const inferred=terrainByAbility[a.attAbility]||terrainByAbility[a.defAbility];if(inferred)a={...a,terrain:inferred};}if(a.weather==='none'){const weatherByAbility={drizzle:'rain',drought:'sun',sandStream:'sand',snowWarning:'snow'};const inferred=weatherByAbility[a.attAbility]||weatherByAbility[a.defAbility];if(inferred)a={...a,weather:inferred};}if(a.attAbility==='rattled'&&a.rattledActivated)a={...a,attSpeedStage:Math.min(6,(a.attSpeedStage??0)+1)};if(a.attAbility==='thermalExchange'&&a.thermalExchangeActivated&&a.category==='physical')a={...a,attackStage:Math.min(6,a.attackStage+1)};if(a.attAbility==='angerPoint'&&a.angerPointActivated&&a.category==='physical')a={...a,attackStage:6};if(a.moveMechanic==='auraWheel')a={...a,moveType:a.auraWheelForm==='hangry'?'あく':'でんき'};if(a.moveMechanic==='ragingBull'){const types={combat:'かくとう',blaze:'ほのお',aqua:'みず'};if(!Object.hasOwn(types,a.ragingBullForm))throw Error('レイジングブルのフォルムが不正です');a={...a,moveType:types[a.ragingBullForm]};}if(a.moveMechanic==='weatherBall'){const type={sun:'ほのお',rain:'みず',sand:'いわ',snow:'こおり'}[a.weather];a={...a,moveType:type||'ノーマル',power:type?100:50};}if(a.moveMechanic==='terrainPulse'){const type={electric:'でんき',grassy:'くさ',misty:'フェアリー',psychic:'エスパー'}[a.terrain];const active=!!type&&isGrounded(a,'att');a={...a,moveType:active?type:'ノーマル',power:active?100:50};}if(a.category!=='status'&&!['weatherBall','terrainPulse'].includes(a.moveMechanic)&&!SKIN_TYPE_EXCLUDED_MOVES.has(a.moveId)){if(a.attAbility==='normalize'){a={...a,moveType:'ノーマル',skinBoost:true};}else if(a.moveType==='ノーマル'&&Object.hasOwn(SKIN_ABILITY_TYPES,a.attAbility)){a={...a,moveType:SKIN_ABILITY_TYPES[a.attAbility],skinBoost:true};}}if(a.moveMechanic==='ironRoller'&&!['electric','grassy','misty','psychic'].includes(a.terrain))throw Error('アイアンローラーはフィールドがないと失敗します。フィールドを選択してください。');if(a.moveMechanic==='dualWingbeat'&&a.defAbility==='multiscale')throw Error('ダブルウイングとマルチスケイルの2発目の相互作用は未対応です。');if(a.moveMechanic==='forcedCritical')a={...a,critical:true};if(['shellArmor','battleArmor'].includes(a.defAbility)&&a.critical)a={...a,critical:false};validate(a);const ctx={a,trace:[],side:'attack'};let as=a.attackStage,ds=a.defenseStage;if(a.defAbility==='unaware')as=0;if(a.attAbility==='unaware')ds=0;if(a.moveMechanic==='chargeSpABoost')as=Math.min(6,as+1);if(a.moveMechanic==='foulPlay')as=a.foulPlayTargetStage??0;if(a.moveMechanic==='bodyPress')as=a.bodyPressDefenseStage??0;if(a.defAbility==='intimidate'&&a.category==='physical'&&!['bodyPress','foulPlay'].includes(a.moveMechanic)&&!['clearBody','whiteSmoke','hyperCutter','fullMetalBody','innerFocus','oblivious','ownTempo','scrappy'].includes(a.attAbility))as=Math.max(-6,as-1);if(a.critical){as=Math.max(0,as);ds=Math.min(0,ds);}if(a.moveMechanic==='sacredSword')ds=Math.min(0,ds);let attack=applyLayer('stat',ctx,Math.max(1,floor(a.attack*stage(as))));ctx.side='defense';let defense=applyLayer('stat',ctx,Math.max(1,floor(a.defense*stage(ds))));
const effectivePower=a.moveMechanic==='mistyExplosion'&&a.terrain==='misty'&&isGrounded(a,'att')?Math.floor(a.power*1.5):a.moveMechanic==='risingVoltage'&&a.terrain==='electric'&&isGrounded(a,'def')?a.power*2:a.moveMechanic==='expandingForce'&&a.terrain==='psychic'&&isGrounded(a,'att')?Math.floor(a.power*1.5):a.moveMechanic==='gravApple'&&a.conditionalPower?Math.floor(a.power*1.5):a.moveMechanic==='knockOff'&&a.conditionalPower?Math.floor(a.power*1.5):['stompingTantrum','hex','facade','venoshock','barbBarrage','infernalParade','assurance','payback','avalanche','lashOut','temperFlare','round','fickleBeam'].includes(a.moveMechanic)&&a.conditionalPower?a.power*2:a.moveMechanic==='hardPress'?Math.max(1,Math.floor(100*a.currentHp/a.hp)):a.moveMechanic==='hpScaledPower'?hpScaledPower(a.attCurrentHp,a.attMaxHp):a.moveMechanic==='electroBall'?electroBallPower(effectiveSpeed(a.attSpeed,a.attSpeedStage,a.attParalyzed,a.attTailwind),effectiveSpeed(a.defSpeed,a.defSpeedStage,a.defParalyzed,a.defTailwind)):a.moveMechanic==='rageFist'?window.ChlohaVariablePower.rageFist(a.hitsTaken):a.moveMechanic==='reversal'?window.ChlohaVariablePower.reversal(a.attCurrentHp,a.attMaxHp):a.moveMechanic==='lastRespects'?window.ChlohaVariablePower.lastRespects(a.faintedAllies):a.moveMechanic==='gyroBall'?window.ChlohaVariablePower.gyroBall(effectiveSpeed(a.attSpeed,a.attSpeedStage,a.attParalyzed,a.attTailwind),effectiveSpeed(a.defSpeed,a.defSpeedStage,a.defParalyzed,a.defTailwind)):a.moveMechanic==='storedPower'?window.ChlohaVariablePower.storedPower(a.storedPowerBoosts):a.moveMechanic==='acrobatics'&&a.attItem==='none'?a.power*2:a.power;if(a.moveMechanic==='chargeSpABoost')ctx.trace.push('攻撃前の特攻+1段階を自動反映（入力ランクは使用前）。'+(a.moveType==='でんき'&&a.weather==='rain'?'雨のため即時攻撃':'溜めターン後の攻撃')+'。');if(a.moveMechanic==='mistyExplosion')ctx.trace.push('ミストバースト: '+(a.terrain==='misty'&&isGrounded(a,'att')?'ミストフィールド＋使用者接地（威力1.5倍）':'通常威力')+'。使用後の自身のひんしは自動反映しません');if(a.moveMechanic==='risingVoltage')ctx.trace.push('ライジングボルト: '+(a.terrain==='electric'&&isGrounded(a,'def')?'エレキフィールド＋対象接地（威力2倍）':'通常威力'));if(a.moveMechanic==='expandingForce')ctx.trace.push('ワイドフォース: '+(a.terrain==='psychic'&&isGrounded(a,'att')?'接地＋サイコフィールド（威力1.5倍・範囲化）':'通常威力・単体対象'));if(a.moveMechanic==='rageFist')ctx.trace.push('ふんどのこぶし: 被攻撃回数 '+a.hitsTaken+' → 威力 '+effectivePower);if(a.moveMechanic==='reversal'||a.moveMechanic==='lastRespects')ctx.trace.push((a.moveMechanic==='reversal'?'HP依存威力':'おはかまいり')+': 威力 '+effectivePower);if(a.moveMechanic==='gyroBall'||a.moveMechanic==='storedPower')ctx.trace.push((a.moveMechanic==='gyroBall'?'ジャイロボール':'アシストパワー')+': 威力 '+effectivePower);if(a.moveMechanic==='electroBall')ctx.trace.push(`エレキボール: 素早さ ${effectiveSpeed(a.attSpeed,a.attSpeedStage,a.attParalyzed,a.attTailwind)} / ${effectiveSpeed(a.defSpeed,a.defSpeedStage,a.defParalyzed,a.defTailwind)} → 威力 ${effectivePower}`);if(a.moveMechanic==='acrobatics')ctx.trace.push('アクロバット: 持ち物 '+(a.attItem==='none'?'なし（威力2倍）':'あり（通常威力）'));if(a.moveMechanic==='forcedCritical')ctx.trace.push(a.critical?'確定急所: 急所補正を強制適用':'確定急所: 防御側の急所無効特性により急所補正なし');if(a.moveMechanic==='hpScaledPower')ctx.trace.push(`HP依存威力: ${a.attCurrentHp}/${a.attMaxHp} → ${effectivePower}`);
const modifiedPower=Math.max(1,applyLayer('power',ctx,effectivePower));
let base=floor(floor(floor((floor(2*a.level/5)+2)*modifiedPower*attack/defense)/50)+2);base=applyLayer('base',ctx,base);base=applyLayer('preRandom',ctx,base);base=Math.max(1,base);
ctx.stab=a.stabMode==='none'?1:a.attTypes.includes(a.moveType)?(a.attAbility==='adaptability'?2:1.5):1;
const immune=a.defTypes.some(t=>moveTypeEffect(a,t)===0)||(a.defAbility==='levitate'&&a.moveType==='じめん')||(a.defAbility==='waterAbsorb'&&a.moveType==='みず')||(a.defAbility==='drySkin'&&a.moveType==='みず')||(a.defAbility==='wonderGuard'&&a.defTypes.reduce((m,t)=>m*moveTypeEffect(a,t),1)<=1)||(['voltAbsorb','lightningRod','motorDrive'].includes(a.defAbility)&&a.moveType==='でんき')||(a.defAbility==='sapSipper'&&a.moveType==='くさ')||(a.defAbility==='stormDrain'&&a.moveType==='みず')||(a.defAbility==='earthEater'&&a.moveType==='じめん')||(a.defAbility==='wellBakedBody'&&a.moveType==='ほのお')||(a.defAbility==='flashFire'&&a.moveType==='ほのお')||(a.defAbility==='bulletproof'&&BULLETPROOF_BALL_MOVES.has(a.moveId))||(a.defAbility==='soundproof'&&PUNK_ROCK_SOUND_MOVES.has(a.moveId));const rolls=[];for(let r=85;r<=100;r++){if(immune){rolls.push(0);continue;}let d=floor(base*r/100);d=applyLayer('postRandom',{...ctx,trace:[]},d);d=applyLayer('final',{...ctx,trace:[]},d);rolls.push(Math.max(1,d));}
let hitRolls=null,koProbability=null;if(a.moveMechanic==='dualWingbeat'){
 hitRolls=rolls.slice();const totals=[];let koCount=0;
 for(const first of hitRolls)for(const second of hitRolls){const total=first+second;totals.push(total);if(total>=a.currentHp)koCount++;}
 koProbability=a.currentHp===0?null:koCount/256;
 rolls.splice(0,rolls.length,...totals.sort((x,y)=>x-y));
 ctx.trace.push('ダブルウイング: 各ヒットを威力40で独立計算（各16乱数、計256組）');
 ctx.trace.push('2発合計の最小〜最大: '+Math.min(...totals)+'〜'+Math.max(...totals));
 ctx.trace.push('2発合計KO率（256組）: '+(koProbability===null?'対象がひんし':(koProbability*100).toFixed(2)+'%'));
 }
const probe={...ctx,trace:ctx.trace};let d=base;if(immune){ctx.trace.push('無効判定: タイプまたは特性によってダメージ0');d=0;}else{d=applyLayer('postRandom',probe,d);d=applyLayer('final',probe,d);d=Math.max(1,d);}ctx.trace.push(`最終ダメージ（乱数100${hitRolls?'・2発合計':''}）: ${hitRolls?d*2:d}`);return {rolls,hitRolls,koProbability,trace:ctx.trace,attack,defense,base,effectivePower,stab:ctx.stab,effectiveness:a.defTypes.reduce((x,t)=>x*(EFFECT[a.moveType]?.[t]??1),1)};}
const DamageEngine=Object.freeze({calculate,hpScaledPower,effectiveSpeed,electroBallPower,registerModifier,GameData,pokeRound,FIXED_MODS,version:'0.162'});window.ChlohaDamageEngine=DamageEngine;
