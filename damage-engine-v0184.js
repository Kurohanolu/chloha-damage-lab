'use strict';
(()=>{
// DATA LAYER: future verified roster/move/item/ability records can be resolved here.
const {GameData,TYPE_PLATES,RESIST_BERRIES,TYPES,EFFECT,ATTACKER_ITEM_IDS,DEFENDER_ITEM_IDS}=window.ChlohaBattleData;
function moveTypeEffect(a,t){if(a.attAbility==='scrappy'&&t==='ゴースト'&&['ノーマル','かくとう'].includes(a.moveType))return 1;return a.moveMechanic==='freezeDry'&&t==='みず'?2:a.moveMechanic==='flyingPress'?(EFFECT['かくとう']?.[t]??1)*(EFFECT['ひこう']?.[t]??1):(EFFECT[a.moveType]?.[t]??1);}
const FP=4096;const fp=n=>Math.round(n*FP);const FIXED_MODS=Object.freeze({half:2048,threeQuarters:3072,onePointTwo:4915,onePointThree:5324,onePointFive:6144,double:8192});
// Round to nearest, ties down: check each mechanic independently against Champions.
const pokeRound=(value,mod)=>Math.floor((value*mod+2047)/FP);const floor=Math.floor;
const stage=(s)=>s>=0?(2+s)/2:2/(2-s);
const pipeline={power:[],stat:[],base:[],preRandom:[],postRandom:[],final:[]};
function registerModifier(layer,id,priority,applies,run){if(!Object.hasOwn(pipeline,layer))throw Error('Invalid layer');pipeline[layer].push({id,priority,applies,run});pipeline[layer].sort((a,b)=>a.priority-b.priority);}
// Within a modifier layer, combine 4096-based factors before rounding the value.
// Modifier composition rounds ties up; applying a factor rounds ties down.
function registerFixedModifier(layer,id,priority,applies,modifier){
 registerModifier(layer,id,priority,applies,(c,v)=>pokeRound(v,typeof modifier==='function'?modifier(c):modifier));
 pipeline[layer].find(p=>p.id===id).modifier=modifier;
}
function applyLayer(layer,ctx,value){
 let v=value,pending=[];
 const flush=()=>{if(!pending.length)return;let modifier=4096;for(const p of pending){const m=typeof p.modifier==='function'?p.modifier(ctx):p.modifier;modifier=floor((modifier*m+2048)/4096);}modifier=Math.max(layer==='stat'?410:41,Math.min(layer==='power'?2097152:131072,modifier));const old=v;v=pokeRound(layer==='final'?Math.max(1,v):v,modifier);ctx.trace.push(`${layer}/${pending.map(p=>p.id).join('+')}: ${old} → ${v}`);pending=[];};
 for(const p of pipeline[layer])if(p.applies(ctx)){if(p.modifier!==undefined)pending.push(p);else{flush();const old=v;v=p.run(ctx,v);ctx.trace.push(`${layer}/${p.id}: ${old} → ${v}`);}}
 flush();return v;
}
const hitsDefense=a=>a.category==='physical'||a.moveMechanic==='psyshock';
// Existing consumable resistance Berries and full-HP Shadow Shield only apply
// to the first damaging hit. Multiscale's explicit unsupported boundary stays.
function afterFirstHit(a){const berry=a.defItem==='autoResistBerry'||Object.hasOwn(RESIST_BERRIES,a.defItem);return berry||a.defAbility==='shadowShield'?{...a,defItem:berry?'none':a.defItem,defAbility:a.defAbility==='shadowShield'?'none':a.defAbility}:a;}
// stat stage: independent attack/defense layers. Only listed effects are supported.


registerFixedModifier('stat','purePower',12,c=>c.side==='attack'&&c.a.attAbility==='purePower'&&c.a.category==='physical',8192);
registerFixedModifier('stat','plusMinus',13,c=>c.side==='attack'&&['plus','minus'].includes(c.a.attAbility)&&c.a.partnerOppositePlusMinus===true&&c.a.category==='special',6144);
registerFixedModifier('stat','solarPower',13,c=>c.side==='attack'&&c.a.attAbility==='solarPower'&&c.a.category==='special'&&c.a.weather==='sun',6144);
registerFixedModifier('stat','defeatist',13,c=>c.side==='attack'&&c.a.attAbility==='defeatist'&&c.a.attCurrentHp*2<=c.a.attMaxHp,2048);
registerFixedModifier('stat','orichalcumPulse',13,c=>c.side==='attack'&&c.a.attAbility==='orichalcumPulse'&&c.a.category==='physical'&&c.a.weather==='sun',5461);
registerFixedModifier('stat','hadronEngine',13,c=>c.side==='attack'&&c.a.attAbility==='hadronEngine'&&c.a.category==='special'&&c.a.terrain==='electric',5461);
registerFixedModifier('stat','toxicBoost',13,c=>c.side==='attack'&&c.a.attAbility==='toxicBoost'&&c.a.category==='physical'&&c.a.poisoned,6144);
registerFixedModifier('stat','flareBoost',13,c=>c.side==='attack'&&c.a.attAbility==='flareBoost'&&c.a.category==='special'&&c.a.burn,6144);
registerModifier('stat','hustle',0,c=>c.side==='attack'&&c.a.attAbility==='hustle'&&c.a.category==='physical',(_,v)=>pokeRound(v,6144));
registerFixedModifier('stat','hugePower',12,c=>c.side==='attack'&&c.a.attAbility==='hugePower'&&c.a.category==='physical',8192);
registerFixedModifier('stat','grassPelt',10,c=>c.side==='defense'&&c.a.defAbility==='grassPelt'&&c.a.terrain==='grassy'&&hitsDefense(c.a),6144);
registerFixedModifier('stat','marvelScale',10,c=>c.side==='defense'&&c.a.defAbility==='marvelScale'&&hitsDefense(c.a)&&['burn','poison','paralysis','sleep','freeze'].includes(c.a.defStatus),6144);
registerFixedModifier('stat','furCoat',10,c=>c.side==='defense'&&c.a.defAbility==='furCoat'&&hitsDefense(c.a),8192);
registerFixedModifier('stat','thickFat',14,c=>c.side==='attack'&&c.a.defAbility==='thickFat'&&['ほのお','こおり'].includes(c.a.moveType),2048);
registerFixedModifier('stat','guts',14,c=>c.side==='attack'&&c.a.attAbility==='guts'&&(c.a.burn||c.a.poisoned||c.a.attParalyzed)&&c.a.category==='physical',6144);
registerFixedModifier('stat','choiceBand',15,c=>c.side==='attack'&&c.a.category==='physical'&&c.a.attItem==='choiceBand',6144);
registerFixedModifier('stat','choiceSpecs',16,c=>c.side==='attack'&&c.a.category==='special'&&c.a.attItem==='choiceSpecs',6144);
registerFixedModifier('stat','assaultVest',17,c=>c.side==='defense'&&c.a.category==='special'&&c.a.moveMechanic!=='psyshock'&&c.a.defItem==='assaultVest',6144);
registerModifier('stat','sandRockSpD',0,c=>c.side==='defense'&&c.a.category==='special'&&c.a.moveMechanic!=='psyshock'&&c.a.weather==='sand'&&c.a.defTypes.includes('いわ'),(_,v)=>pokeRound(v,6144));
registerModifier('stat','snowIceDef',0,c=>c.side==='defense'&&(c.a.category==='physical'||c.a.moveMechanic==='psyshock')&&c.a.weather==='snow'&&c.a.defTypes.includes('こおり'),(_,v)=>pokeRound(v,6144));

function isGrounded(a,side){
 const mode=a[side+'Grounding']||'auto';
 if(mode!=='auto')return mode==='grounded';
 return !a[side+'Types'].includes('ひこう')&&a[side+'Ability']!=='levitate';
}
// Standard terrain power effects; exact Champions rounding remains unverified.
// Stable move IDs: language-independent mechanics, not display-name matching.
const {SHEER_FORCE_VERIFIED_MOVES,MEGA_LAUNCHER_MOVES,SHARPNESS_MOVES,IRON_FIST_MOVES,STRONG_JAW_MOVES,TOUGH_CLAWS_CONTACT_MOVES,RECKLESS_MOVES,BULLETPROOF_BALL_MOVES,PUNK_ROCK_SOUND_MOVES,SKIN_TYPE_EXCLUDED_MOVES,SKIN_ABILITY_TYPES,MOVE_MECHANIC_IDS}=window.ChlohaMoveMechanicsData;
const {ABILITY_CATALOG,ABILITY_ID_BY_JA,MOLD_BREAKER_ABILITIES,MOLD_BREAKER_IGNORED_DEFENSE,TERRAIN_BY_ABILITY,WEATHER_BY_ABILITY,ATTACKER_ABILITY_IDS,DEFENDER_ABILITY_IDS}=window.ChlohaAbilityData;
const isContactMove=a=>a.moveId==='gw0169_s020'?a.category==='physical':TOUGH_CLAWS_CONTACT_MOVES.has(a.moveId);

registerFixedModifier('power','typePlate',22,c=>TYPE_PLATES[c.a.attItem]===c.a.moveType,4915);
registerFixedModifier('power','aura',14,c=>((c.a.moveType==='フェアリー'&&[c.a.attAbility,c.a.defAbility].includes('fairyAura'))||(c.a.moveType==='あく'&&[c.a.attAbility,c.a.defAbility].includes('darkAura'))),c=>[c.a.attAbility,c.a.defAbility].includes('auraBreak')?3072:5448);
registerFixedModifier('stat','waterBubble',13,c=>c.side==='attack'&&c.a.attAbility==='waterBubble'&&c.a.moveType==='みず',8192);
registerFixedModifier('power','skinAbility',18,c=>c.a.skinBoost===true,4915);
registerFixedModifier('stat','overgrow',13,c=>c.side==='attack'&&c.a.attAbility==='overgrow'&&c.a.moveType==='くさ'&&(c.a.forceLowHpAbility===true||c.a.attCurrentHp*3<=c.a.attMaxHp),6144);
registerFixedModifier('stat','blaze',13,c=>c.side==='attack'&&c.a.attAbility==='blaze'&&c.a.moveType==='ほのお'&&(c.a.forceLowHpAbility===true||c.a.attCurrentHp*3<=c.a.attMaxHp),6144);
registerFixedModifier('stat','torrent',13,c=>c.side==='attack'&&c.a.attAbility==='torrent'&&c.a.moveType==='みず'&&(c.a.forceLowHpAbility===true||c.a.attCurrentHp*3<=c.a.attMaxHp),6144);
registerFixedModifier('stat','swarm',13,c=>c.side==='attack'&&c.a.attAbility==='swarm'&&c.a.moveType==='むし'&&(c.a.forceLowHpAbility===true||c.a.attCurrentHp*3<=c.a.attMaxHp),6144);
registerFixedModifier('power','steelSpirit',12,c=>c.a.attAbility==='steelSpirit'&&c.a.moveType==='はがね',6144);
registerFixedModifier('stat','fireMane',13,c=>c.side==='attack'&&c.a.attAbility==='fireMane'&&c.a.moveType==='ほのお',6144);
registerFixedModifier('stat','steelworker',13,c=>c.side==='attack'&&c.a.attAbility==='steelworker'&&c.a.moveType==='はがね',6144);
registerFixedModifier('power','punkRock',15,c=>c.a.attAbility==='punkRock'&&PUNK_ROCK_SOUND_MOVES.has(c.a.moveId),5325);
registerFixedModifier('power','sandForce',15,c=>c.a.attAbility==='sandForce'&&c.a.weather==='sand'&&['いわ','じめん','はがね'].includes(c.a.moveType),5325);
registerFixedModifier('stat','rockyPayload',13,c=>c.side==='attack'&&c.a.attAbility==='rockyPayload'&&c.a.moveType==='いわ',6144);
registerFixedModifier('power','toughClaws',15,c=>c.a.attAbility==='toughClaws'&&isContactMove(c.a),5325);
registerFixedModifier('power','reckless',19,c=>c.a.attAbility==='reckless'&&RECKLESS_MOVES.has(c.a.moveId),4915);
registerFixedModifier('stat','transistor',13,c=>c.side==='attack'&&c.a.attAbility==='transistor'&&c.a.moveType==='でんき',5325);
registerFixedModifier('stat','dragonsMaw',13,c=>c.side==='attack'&&c.a.attAbility==='dragonsMaw'&&c.a.moveType==='ドラゴン',6144);
registerFixedModifier('power','ironFist',19,c=>c.a.attAbility==='ironFist'&&IRON_FIST_MOVES.has(c.a.moveId),4915);
registerFixedModifier('power','strongJaw',12,c=>c.a.attAbility==='strongJaw'&&STRONG_JAW_MOVES.has(c.a.moveId),6144);
registerFixedModifier('power','megaLauncher',12,c=>c.a.attAbility==='megaLauncher'&&MEGA_LAUNCHER_MOVES.has(c.a.moveId),6144);
registerFixedModifier('power','sharpness',12,c=>c.a.attAbility==='sharpness'&&SHARPNESS_MOVES.has(c.a.moveId),6144);
registerFixedModifier('power','sheerForce',15,c=>c.a.attAbility==='sheerForce'&&SHEER_FORCE_VERIFIED_MOVES.has(c.a.moveId),5325);
registerFixedModifier('power','technician',12,c=>c.a.attAbility==='technician'&&c.effectivePower<=60,6144);
registerFixedModifier('power','terrainBoost',11,c=>isGrounded(c.a,'att')&&({electric:'でんき',grassy:'くさ',psychic:'エスパー'})[c.a.terrain]===c.a.moveType,5325);
registerFixedModifier('power','mistyDragon',11,c=>c.a.terrain==='misty'&&c.a.moveType==='ドラゴン'&&isGrounded(c.a,'def'),2048);
registerFixedModifier('power','grassyEarthquake',11,c=>c.a.terrain==='grassy'&&c.a.moveId==='earthquake'&&isGrounded(c.a,'def'),2048);
registerFixedModifier('power','helpingHand',10,c=>c.a.helpingHand,6144);
registerModifier('preRandom','spread',10,c=>c.a.battleFormat==='doubles'&&c.a.spread==='spread',(_,v)=>pokeRound(v,3072));
registerModifier('preRandom','weather',20,c=>((c.a.weather==='sun'||c.a.weather==='rain')&&['ほのお','みず'].includes(c.a.moveType)),(c,v)=>{const boost=(c.a.moveType==='ほのお'&&c.a.weather==='sun')||(c.a.moveType==='みず'&&c.a.weather==='rain');return pokeRound(v,boost?6144:2048)});
registerFixedModifier('final','sniper',25,c=>c.a.critical&&c.a.attAbility==='sniper',6144);
registerModifier('preRandom','critical',30,c=>c.a.critical,(_,v)=>floor(v*1.5));
registerModifier('postRandom','stab',10,c=>c.stab!==1,(c,v)=>pokeRound(v,fp(c.stab)));
// Type effectiveness: combine both defending types, then apply once; test against game data before claiming exact Champions parity.
registerModifier('postRandom','type',20,()=>true,(c,v)=>floor(v*c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)));

// Explicit late modifiers: no blanket multiplication. The exact game rounding is
// still subject to independent test vectors; trace exposes each step.
// The screen and Friend Guard reductions share the final-damage modifier chain.
// Combine fixed-point modifiers before applying once to avoid intermediate rounding.
const hasActiveScreen=a=>a.attAbility!=='infiltrator'&&!a.critical&&((a.screen==='reflect'&&a.category==='physical')||(a.screen==='lightScreen'&&a.category==='special'));
registerFixedModifier('final','friendGuard',60,c=>c.a.friendGuardCount>0,3072);
registerModifier('final','burn',0,c=>c.a.burn&&c.a.category==='physical'&&!['guts','waterBubble'].includes(c.a.attAbility)&&c.a.moveMechanic!=='facade',(_,v)=>floor(v/2));
registerFixedModifier('final','screen',20,c=>hasActiveScreen(c.a),c=>c.a.battleFormat==='singles'?2048:2732);

registerFixedModifier('final','fluffyContact',40,c=>c.a.defAbility==='fluffy'&&isContactMove(c.a),2048);
registerFixedModifier('final','fluffyFire',61,c=>c.a.defAbility==='fluffy'&&c.a.moveType==='ほのお',8192);
registerFixedModifier('final','auraGuard',40,c=>c.a.defAbility==='auraGuard'&&isContactMove(c.a),2048);
registerFixedModifier('final','punkRockDefense',40,c=>c.a.defAbility==='punkRock'&&PUNK_ROCK_SOUND_MOVES.has(c.a.moveId),2048);
registerFixedModifier('final','iceScales',40,c=>c.a.defAbility==='iceScales'&&c.a.category==='special',2048);
registerFixedModifier('final','resistBerry',80,c=>(c.a.defItem==='autoResistBerry'||RESIST_BERRIES[c.a.defItem]===c.a.moveType)&&(c.a.moveType==='ノーマル'?(c.a.defItem==='autoResistBerry'||c.a.defItem==='chilanBerry'):c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>1),2048);
registerFixedModifier('stat','purifyingSalt',14,c=>c.side==='attack'&&c.a.defAbility==='purifyingSalt'&&c.a.moveType==='ゴースト',2048);
registerFixedModifier('power','drySkinFire',20,c=>c.a.defAbility==='drySkin'&&c.a.moveType==='ほのお',5120);
registerFixedModifier('stat','heatproof',14,c=>c.side==='attack'&&c.a.defAbility==='heatproof'&&c.a.moveType==='ほのお',2048);
registerFixedModifier('stat','waterBubbleDefense',14,c=>c.side==='attack'&&c.a.defAbility==='waterBubble'&&c.a.moveType==='ほのお',2048);
registerFixedModifier('final','shadowShield',30,c=>c.a.defAbility==='shadowShield'&&c.a.currentHp===c.a.hp,2048);
registerFixedModifier('final','multiscale',30,c=>c.a.defAbility==='multiscale'&&c.a.currentHp===c.a.hp,2048);
registerFixedModifier('power','supremeOverlord',21,c=>c.a.attAbility==='supremeOverlord'&&(c.a.supremeOverlordFainted||0)>0,c=>[4096,4506,4915,5325,5734,6144][Math.min(5,c.a.supremeOverlordFainted)]);
registerFixedModifier('stat','flashFireBoost',13,c=>c.side==='attack'&&c.a.attAbility==='flashFire'&&c.a.flashFireActivated===true&&c.a.moveType==='ほのお',6144);
registerFixedModifier('power','battery',16,c=>c.a.allyBattery===true&&c.a.category==='special',5325);
registerFixedModifier('power','powerSpot',17,c=>c.a.allyPowerSpot===true,5325);
registerFixedModifier('final','neuroforce',25,c=>c.a.attAbility==='neuroforce'&&c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>1,5120);
registerFixedModifier('stat','stakeout',13,c=>c.side==='attack'&&c.a.attAbility==='stakeout'&&c.a.targetSwitchedIn===true,8192);
registerFixedModifier('power','analytic',15,c=>c.a.attAbility==='analytic',5325);
registerFixedModifier('final','tintedLens',25,c=>c.a.attAbility==='tintedLens'&&c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>0&&c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)<1,8192);
registerFixedModifier('final','prismArmor',50,c=>c.a.defAbility==='prismArmor'&&c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>1,3072);
registerFixedModifier('final','filter',50,c=>['filter','solidRock'].includes(c.a.defAbility)&&c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>1,3072);
registerFixedModifier('final','expertBelt',70,c=>c.a.attItem==='expertBelt'&&c.a.defTypes.reduce((m,t)=>m*moveTypeEffect(c.a,t),1)>1,4915);
registerFixedModifier('final','lifeOrb',70,c=>c.a.attItem==='lifeOrb',5324);
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
for(const k of ['level','power','attack','defense','hp'])if(!Number.isSafeInteger(a[k])||a[k]<1)throw Error(k+' は1以上の整数を入力');if(!Number.isSafeInteger(a.currentHp)||a.currentHp<0)throw Error('現在HPは0以上の整数を入力');if(a.level!==50||a.power>500||a.attack>9999||a.defense>9999||a.hp>9999||a.currentHp>a.hp)throw Error('入力範囲またはHPを確認');for(const k of ['attackStage','defenseStage'])if(!Number.isInteger(a[k])||a[k]<-6||a[k]>6)throw Error('能力ランクは-6〜+6');if(typeof a.attAbility!=='string'||typeof a.defAbility!=='string')throw Error('特性の入力が不正');if(a.attAbility.startsWith('unsupported:')||a.defAbility.startsWith('unsupported:'))throw Error('選択した特性は計算未対応です。未適用を選ぶか、対応特性を選択してください');if(!Number.isSafeInteger(a.attCurrentHp)||a.attCurrentHp<1||a.attCurrentHp>a.attMaxHp)throw Error('攻撃側現在HPが不正です');if(typeof a.helpingHand!=='boolean'||!Number.isInteger(a.friendGuardCount)||a.friendGuardCount<0||a.friendGuardCount>1)throw Error('味方の支援設定が不正');if(a.battleFormat==='singles'&&(a.friendGuardCount>0||a.helpingHand||a.spread==='spread'))throw Error('シングルでは味方支援・複数対象の範囲技補正を指定できません');if(!ATTACKER_ITEM_IDS.includes(a.attItem)||!DEFENDER_ITEM_IDS.includes(a.defItem)||!ATTACKER_ABILITY_IDS.includes(a.attAbility)||!DEFENDER_ABILITY_IDS.includes(a.defAbility)||!['auto','none'].includes(a.stabMode))throw Error('持ち物・特性・タイプ一致補正の指定が不正');if(!Number.isSafeInteger(a.attMaxHp)||a.attMaxHp<1||a.attMaxHp>9999||a.attCurrentHp>a.attMaxHp)throw Error('攻撃側HPの入力が不正');if(typeof a.burn!=='boolean'||typeof a.critical!=='boolean')throw Error('状態異常・急所設定が不正');if(!MOVE_MECHANIC_IDS.includes(a.moveMechanic||'none'))throw Error('技固有効果が不正');if(!['singles','doubles'].includes(a.battleFormat)||!['single','spread'].includes(a.spread)||!['none','sun','rain','sand','snow'].includes(a.weather)||!['physical','special'].includes(a.category)||!['none','reflect','lightScreen'].includes(a.screen))throw Error('対戦条件が不正');if(!Array.isArray(a.attTypes)||!Array.isArray(a.defTypes)||!TYPES.includes(a.moveType)||a.attTypes.some(t=>!TYPES.includes(t))||a.defTypes.some(t=>!TYPES.includes(t))||a.defTypes.length===0||a.defTypes.length>2||a.attTypes.length===0||a.attTypes.length>2||new Set(a.defTypes).size!==a.defTypes.length||new Set(a.attTypes).size!==a.attTypes.length)throw Error('タイプが不正');}
function effectiveSpeed(base,rank,paralyzed,tailwind){if(!Number.isSafeInteger(base)||base<1||base>9999||!Number.isInteger(rank)||rank< -6||rank>6||typeof paralyzed!=='boolean'||typeof tailwind!=='boolean')throw Error('素早さ設定が不正です');let v=Math.max(1,Math.floor(base*stage(rank)));if(paralyzed)v=Math.max(1,Math.floor(v/2));if(tailwind)v*=2;return v;}
function electroBallPower(att,def){if(!Number.isSafeInteger(att)||!Number.isSafeInteger(def)||att<1||def<1)throw Error('素早さ比が不正です');if(att>=4*def)return 150;if(att>=3*def)return 120;if(att>=2*def)return 80;if(att>=def)return 60;return 40;}
function hpScaledPower(current,max){if(!Number.isSafeInteger(current)||!Number.isSafeInteger(max)||max<1||current<1||current>max)throw Error('攻撃側HPの指定が不正');return Math.max(1,Math.floor(150*current/max));}
function calculate(a){
 if(MOLD_BREAKER_ABILITIES.has(a.attAbility)&&MOLD_BREAKER_IGNORED_DEFENSE.has(a.defAbility))a={...a,defAbility:'none'};
 if(a.terrain==='none'){const inferred=TERRAIN_BY_ABILITY[a.attAbility]||TERRAIN_BY_ABILITY[a.defAbility];if(inferred)a={...a,terrain:inferred};}if(a.weather==='none'){const inferred=WEATHER_BY_ABILITY[a.attAbility]||WEATHER_BY_ABILITY[a.defAbility];if(inferred)a={...a,weather:inferred};}if(a.attAbility==='rattled'&&a.rattledActivated)a={...a,attSpeedStage:Math.min(6,(a.attSpeedStage??0)+1)};if(a.attAbility==='thermalExchange'&&a.thermalExchangeActivated&&a.category==='physical')a={...a,attackStage:Math.min(6,a.attackStage+1)};if(a.attAbility==='angerPoint'&&a.angerPointActivated&&a.category==='physical')a={...a,attackStage:6};if(a.moveMechanic==='auraWheel')a={...a,moveType:a.auraWheelForm==='hangry'?'あく':'でんき'};if(a.moveMechanic==='ragingBull'){const types={combat:'かくとう',blaze:'ほのお',aqua:'みず'};if(!Object.hasOwn(types,a.ragingBullForm))throw Error('レイジングブルのフォルムが不正です');a={...a,moveType:types[a.ragingBullForm]};}if(a.moveMechanic==='weatherBall'){const type={sun:'ほのお',rain:'みず',sand:'いわ',snow:'こおり'}[a.weather];a={...a,moveType:type||'ノーマル',power:type?100:50};}if(a.moveMechanic==='terrainPulse'){const type={electric:'でんき',grassy:'くさ',misty:'フェアリー',psychic:'エスパー'}[a.terrain];const active=!!type&&isGrounded(a,'att');a={...a,moveType:active?type:'ノーマル',power:active?100:50};}if(a.category!=='status'&&!['weatherBall','terrainPulse'].includes(a.moveMechanic)&&!SKIN_TYPE_EXCLUDED_MOVES.has(a.moveId)){if(a.attAbility==='normalize'){a={...a,moveType:'ノーマル',skinBoost:true};}else if(a.moveType==='ノーマル'&&Object.hasOwn(SKIN_ABILITY_TYPES,a.attAbility)){a={...a,moveType:SKIN_ABILITY_TYPES[a.attAbility],skinBoost:true};}}if(a.moveMechanic==='ironRoller'&&!['electric','grassy','misty','psychic'].includes(a.terrain))throw Error('アイアンローラーはフィールドがないと失敗します。フィールドを選択してください。');if(a.moveMechanic==='dualWingbeat'&&a.defAbility==='multiscale')throw Error('ダブルウイングとマルチスケイルの2発目の相互作用は未対応です。');if(a.moveMechanic==='forcedCritical')a={...a,critical:true};if(['shellArmor','battleArmor'].includes(a.defAbility)&&a.critical)a={...a,critical:false};validate(a);const ctx={a,trace:[],side:'attack'};let as=a.attackStage,ds=a.defenseStage;if(a.attAbility==='unaware')ds=0;if(a.moveMechanic==='chargeSpABoost')as=Math.min(6,as+1);if(a.moveMechanic==='foulPlay')as=a.foulPlayTargetStage??0;if(a.moveMechanic==='bodyPress')as=a.bodyPressDefenseStage??0;if(a.defAbility==='unaware')as=0;if(a.defAbility==='intimidate'&&a.category==='physical'&&!['bodyPress','foulPlay'].includes(a.moveMechanic)&&!['clearBody','whiteSmoke','hyperCutter','fullMetalBody','innerFocus','oblivious','ownTempo','scrappy'].includes(a.attAbility))as=Math.max(-6,as-1);if(a.critical){as=Math.max(0,as);ds=Math.min(0,ds);}if(a.moveMechanic==='sacredSword')ds=0;let attack=applyLayer('stat',ctx,Math.max(1,floor(a.attack*stage(as))));ctx.side='defense';let defense=applyLayer('stat',ctx,Math.max(1,floor(a.defense*stage(ds))));
const effectivePower=a.moveMechanic==='mistyExplosion'&&a.terrain==='misty'&&isGrounded(a,'att')?Math.floor(a.power*1.5):a.moveMechanic==='risingVoltage'&&a.terrain==='electric'&&isGrounded(a,'def')?a.power*2:a.moveMechanic==='expandingForce'&&a.terrain==='psychic'&&isGrounded(a,'att')?Math.floor(a.power*1.5):a.moveMechanic==='gravApple'&&a.conditionalPower?Math.floor(a.power*1.5):a.moveMechanic==='knockOff'&&a.conditionalPower?Math.floor(a.power*1.5):['stompingTantrum','hex','facade','venoshock','barbBarrage','infernalParade','assurance','payback','avalanche','lashOut','temperFlare','round','fickleBeam'].includes(a.moveMechanic)&&a.conditionalPower?a.power*2:a.moveMechanic==='hardPress'?Math.max(1,Math.floor(100*a.currentHp/a.hp)):a.moveMechanic==='hpScaledPower'?hpScaledPower(a.attCurrentHp,a.attMaxHp):a.moveMechanic==='electroBall'?electroBallPower(effectiveSpeed(a.attSpeed,a.attSpeedStage,a.attParalyzed,a.attTailwind),effectiveSpeed(a.defSpeed,a.defSpeedStage,a.defParalyzed,a.defTailwind)):a.moveMechanic==='rageFist'?window.ChlohaVariablePower.rageFist(a.hitsTaken):a.moveMechanic==='reversal'?window.ChlohaVariablePower.reversal(a.attCurrentHp,a.attMaxHp):a.moveMechanic==='lastRespects'?window.ChlohaVariablePower.lastRespects(a.faintedAllies):a.moveMechanic==='gyroBall'?window.ChlohaVariablePower.gyroBall(effectiveSpeed(a.attSpeed,a.attSpeedStage,a.attParalyzed,a.attTailwind),effectiveSpeed(a.defSpeed,a.defSpeedStage,a.defParalyzed,a.defTailwind)):a.moveMechanic==='storedPower'?window.ChlohaVariablePower.storedPower(a.storedPowerBoosts):a.moveMechanic==='acrobatics'&&a.attItem==='none'?a.power*2:a.power;if(a.moveMechanic==='chargeSpABoost')ctx.trace.push('攻撃前の特攻+1段階を自動反映（入力ランクは使用前）。'+(a.moveType==='でんき'&&a.weather==='rain'?'雨のため即時攻撃':'溜めターン後の攻撃')+'。');if(a.moveMechanic==='mistyExplosion')ctx.trace.push('ミストバースト: '+(a.terrain==='misty'&&isGrounded(a,'att')?'ミストフィールド＋使用者接地（威力1.5倍）':'通常威力')+'。使用後の自身のひんしは自動反映しません');if(a.moveMechanic==='risingVoltage')ctx.trace.push('ライジングボルト: '+(a.terrain==='electric'&&isGrounded(a,'def')?'エレキフィールド＋対象接地（威力2倍）':'通常威力'));if(a.moveMechanic==='expandingForce')ctx.trace.push('ワイドフォース: '+(a.terrain==='psychic'&&isGrounded(a,'att')?'接地＋サイコフィールド（威力1.5倍・範囲化）':'通常威力・単体対象'));if(a.moveMechanic==='rageFist')ctx.trace.push('ふんどのこぶし: 被攻撃回数 '+a.hitsTaken+' → 威力 '+effectivePower);if(a.moveMechanic==='reversal'||a.moveMechanic==='lastRespects')ctx.trace.push((a.moveMechanic==='reversal'?'HP依存威力':'おはかまいり')+': 威力 '+effectivePower);if(a.moveMechanic==='gyroBall'||a.moveMechanic==='storedPower')ctx.trace.push((a.moveMechanic==='gyroBall'?'ジャイロボール':'アシストパワー')+': 威力 '+effectivePower);if(a.moveMechanic==='electroBall')ctx.trace.push(`エレキボール: 素早さ ${effectiveSpeed(a.attSpeed,a.attSpeedStage,a.attParalyzed,a.attTailwind)} / ${effectiveSpeed(a.defSpeed,a.defSpeedStage,a.defParalyzed,a.defTailwind)} → 威力 ${effectivePower}`);if(a.moveMechanic==='acrobatics')ctx.trace.push('アクロバット: 持ち物 '+(a.attItem==='none'?'なし（威力2倍）':'あり（通常威力）'));if(a.moveMechanic==='forcedCritical')ctx.trace.push(a.critical?'確定急所: 急所補正を強制適用':'確定急所: 防御側の急所無効特性により急所補正なし');if(a.moveMechanic==='hpScaledPower')ctx.trace.push(`HP依存威力: ${a.attCurrentHp}/${a.attMaxHp} → ${effectivePower}`);
ctx.effectivePower=effectivePower;const modifiedPower=Math.max(1,applyLayer('power',ctx,effectivePower));
let base=floor(floor(floor((floor(2*a.level/5)+2)*modifiedPower*attack/defense)/50)+2);base=applyLayer('base',ctx,base);base=applyLayer('preRandom',ctx,base);base=Math.max(1,base);
ctx.stab=a.stabMode==='none'?1:a.attTypes.includes(a.moveType)?(a.attAbility==='adaptability'?2:1.5):1;
const immune=a.defTypes.some(t=>moveTypeEffect(a,t)===0)||(a.defAbility==='levitate'&&a.moveType==='じめん')||(a.defAbility==='waterAbsorb'&&a.moveType==='みず')||(a.defAbility==='drySkin'&&a.moveType==='みず')||(a.defAbility==='wonderGuard'&&a.defTypes.reduce((m,t)=>m*moveTypeEffect(a,t),1)<=1)||(['voltAbsorb','lightningRod','motorDrive'].includes(a.defAbility)&&a.moveType==='でんき')||(a.defAbility==='sapSipper'&&a.moveType==='くさ')||(a.defAbility==='stormDrain'&&a.moveType==='みず')||(a.defAbility==='earthEater'&&a.moveType==='じめん')||(a.defAbility==='wellBakedBody'&&a.moveType==='ほのお')||(a.defAbility==='flashFire'&&a.moveType==='ほのお')||(a.defAbility==='bulletproof'&&BULLETPROOF_BALL_MOVES.has(a.moveId))||(a.defAbility==='soundproof'&&PUNK_ROCK_SOUND_MOVES.has(a.moveId));const rolls=[];for(let r=85;r<=100;r++){if(immune){rolls.push(0);continue;}let d=floor(base*r/100);d=applyLayer('postRandom',{...ctx,trace:[]},d);d=applyLayer('final',{...ctx,trace:[]},d);rolls.push(Math.max(1,d));}
let hitRolls=null,secondHitRolls=null,koProbability=null;if(a.moveMechanic==='dualWingbeat'){
 hitRolls=rolls.slice();const laterInput=afterFirstHit(a);secondHitRolls=laterInput===a?hitRolls:calculate({...laterInput,moveMechanic:'none'}).rolls;const totals=[];let koCount=0;
 for(const first of hitRolls)for(const second of secondHitRolls){const total=first+second;totals.push(total);if(total>=a.currentHp)koCount++;}
 koProbability=a.currentHp===0?null:koCount/256;
 rolls.splice(0,rolls.length,...totals.sort((x,y)=>x-y));
 ctx.trace.push('ダブルウイング: 各ヒットを威力40で独立計算（各16乱数、計256組）');
 ctx.trace.push('2発合計の最小〜最大: '+Math.min(...totals)+'〜'+Math.max(...totals));
 ctx.trace.push('2発合計KO率（256組）: '+(koProbability===null?'対象がひんし':(koProbability*100).toFixed(2)+'%'));
 }
const probe={...ctx,trace:ctx.trace};let d=base;if(immune){ctx.trace.push('無効判定: タイプまたは特性によってダメージ0');d=0;}else{d=applyLayer('postRandom',probe,d);d=applyLayer('final',probe,d);d=Math.max(1,d);}ctx.trace.push(`最終ダメージ（乱数100${hitRolls?'・2発合計':''}）: ${hitRolls?d+secondHitRolls[15]:d}`);return {rolls,hitRolls,koProbability,trace:ctx.trace,attack,defense,base,effectivePower,stab:ctx.stab,effectiveness:a.defTypes.reduce((x,t)=>x*moveTypeEffect(a,t),1)};}
const DamageEngine=Object.freeze({calculate,hpScaledPower,effectiveSpeed,electroBallPower,registerModifier,afterFirstHit,GameData,pokeRound,isGrounded,FIXED_MODS,version:'0.184'});window.ChlohaDamageEngine=DamageEngine;
})();
