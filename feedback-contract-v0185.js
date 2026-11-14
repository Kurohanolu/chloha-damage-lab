/* Shared, data-only feedback contract. No calculator mutation or personal-data discovery. */
(()=>{
 'use strict';
 const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
 const categories=['bug','calculation','translation','feature'];
 const statuses=['New','Reviewing','Accepted','Resolved','Rejected'];
 const numbers='hitsTaken faintedAllies level power attack defense hp currentHp attackStage defenseStage attCurrentHp attMaxHp supremeOverlordFainted customMultiplier friendGuardCount bodyPressDefenseStage foulPlayTargetStage attSpeed defSpeed attSpeedStage defSpeedStage'.split(' ');
 const booleans='forceLowHpAbility partnerOppositePlusMinus allyBattery allyPowerSpot targetSwitchedIn helpingHand burn poisoned flashFireActivated thermalExchangeActivated angerPointActivated rattledActivated critical conditionalPower attParalyzed defParalyzed attTailwind defTailwind'.split(' ');
 const identifiers='ragingBullForm auraWheelForm category attItem attAbility defItem defAbility defStatus moveId attGrounding defGrounding terrain weather spread battleFormat screen stabMode moveMechanic'.split(' ');
 const types=['ノーマル','ほのお','みず','でんき','くさ','こおり','かくとう','どく','じめん','ひこう','エスパー','むし','いわ','ゴースト','ドラゴン','あく','はがね','フェアリー'];
 const controlIds='dbAuto dbAttPokemon dbDefPokemon dbMove dbAttEv dbDefEv dbHpEv dbAttHpEv dbAttSpeedEv dbDefSpeedEv dbAttNature dbDefNature dbAttSpeedNature dbDefSpeedNature dbFoulAttackEv dbFoulAttackNature level power attack defense hp currentHp attMaxHp attCurrentHp attSpeed defSpeed attackStage defenseStage attSpeedStage defSpeedStage attItem defItem attAbility defAbility defStatus moveType category attType1 attType2 defType1 defType2 terrain weather screen spread battleFormat customMultiplier attGrounding defGrounding stabMode conditionalPower burn poisoned critical helpingHand friendGuardCount forceLowHpAbility partnerOppositePlusMinus allyBattery allyPowerSpot supremeOverlordFainted targetSwitchedIn flashFireActivated thermalExchangeActivated angerPointActivated rattledActivated attParalyzed defParalyzed attTailwind defTailwind ragingBullForm auraWheelForm rageFistHits faintedAllies beatUpStats dragonDartsHits flingPower spitUpCount storedPower_atk storedPower_def storedPower_spa storedPower_spd storedPower_spe storedPower_accuracy storedPower_evasion'.split(' ');
 const engineKeys=[...numbers,...booleans,...identifiers,'moveType','attTypes','defTypes','storedPowerBoosts'];
 const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
 const known=(x,keys)=>plain(x)&&Object.keys(x).every(k=>keys.includes(k));
 const finite=x=>typeof x==='number'&&Number.isFinite(x)&&Math.abs(x)<=1e9;
 const id=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(x);
 const safeControl=x=>typeof x==='boolean'||(typeof x==='string'&&x.length<=160&&(/^[a-zA-Z0-9_.,+\s-]*$/.test(x)||types.includes(x)||x==='なし'));
 function validateSnapshot(x){
  if(!known(x,['schemaVersion','appVersion','engineVersion','locale','selection','controls','engineInput','result'])||x.schemaVersion!==1||!locales.includes(x.locale))return false;
  if(typeof x.appVersion!=='string'||!/^v\d+\.\d+(?: Pre-Release \d+)?$/.test(x.appVersion)||typeof x.engineVersion!=='string'||!/^\d+\.\d+$/.test(x.engineVersion))return false;
  if(!known(x.selection,['attacker','defender','move'])||!Object.values(x.selection).every(id))return false;
  if(!known(x.controls,controlIds)||!Object.values(x.controls).every(safeControl))return false;
  if(x.engineInput!==null){
   if(!known(x.engineInput,engineKeys))return false;
   for(const [key,value] of Object.entries(x.engineInput)){
    if(numbers.includes(key)&&!finite(value))return false;
    if(booleans.includes(key)&&typeof value!=='boolean')return false;
    if(identifiers.includes(key)&&!(key==='moveId'&&value==='')&&!id(value))return false;
    if(key==='moveType'&&!types.includes(value))return false;
    if(['attTypes','defTypes'].includes(key)&&(!Array.isArray(value)||value.length>2||!value.every(t=>types.includes(t))))return false;
    if(key==='storedPowerBoosts'&&(!known(value,['atk','def','spa','spd','spe','accuracy','evasion'])||!Object.values(value).every(v=>Number.isInteger(v)&&v>=-6&&v<=6)))return false;
   }
  }
  return x.result===null||(known(x.result,['minimumDamage','maximumDamage','koProbability','baseDamage','attackStat','defenseStat','effectivePower'])&&Object.values(x.result).every(v=>v===null||finite(v)));
 }
 globalThis.ChlohaFeedbackContract=Object.freeze({locales:Object.freeze(locales),categories:Object.freeze(categories),statuses:Object.freeze(statuses),controlIds:Object.freeze(controlIds),engineKeys:Object.freeze(engineKeys),validateSnapshot,limits:Object.freeze({description:5000,email:254,bodyBytes:32768,retentionDays:90})});
})();
