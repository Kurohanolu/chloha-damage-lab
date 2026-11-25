'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {context,baseInput}=require('./helpers/v0186-reference.cjs');
const checkout=fs.realpathSync(process.env.CHAMPIONS_REFERENCE);
assert.equal(require('node:child_process').execFileSync('git',['-C',checkout,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),'abdce0c64597284c8c463b7f71a38dc4dc55cd10');
const ref=require(path.join(checkout,'calc/dist')),gen=ref.Generations.get(0);
const dir=process.env.AUDIT_OUTPUT||'reports/v110-independent';
fs.mkdirSync(dir,{recursive:true});
const rows=[];
for(const fast of [false,true]) for(const abilityOn of [false,true]) for(const switching of [false,true]){
 const attack=new ref.Pokemon(gen,'Clefable',{level:50,ability:'Analytic',abilityOn,evs:{spe:fast?32:0}});
 const defense=new ref.Pokemon(gen,'Clefable',{level:50,ability:'No Ability',evs:{spe:fast?0:32}});
 const move=new ref.Move(gen,'Flamethrower');
 const field=new ref.Field({defenderSide:{isSwitching:switching?'out':undefined}});
 const reference=ref.calculate(gen,attack,defense,move,field).damage;
 const active=!fast||switching||abilityOn;
 const input={...baseInput,power:90,moveType:'ほのお',moveId:'flamethrower',category:'special',attTypes:['フェアリー'],defTypes:['フェアリー'],attack:attack.rawStats.spa,defense:defense.rawStats.spd,attAbility:active?'analytic':'none'};
 const actual=Array.from(context.ChlohaDamageEngine.calculate(input).rolls);
 assert.deepEqual(actual,reference);
 rows.push({fast,abilityOn,switching,active,input,actual,reference});
}
const syntheticInputs=['airLock','cloudNine'].map(ability=>{
 const input={...baseInput,weather:'rain',attAbility:ability};
 assert.throws(()=>context.ChlohaDamageEngine.calculate(input));
 return {ability,application:'unavailable as attacker effect',referenceClearsWeather:true};
});
const weatherUtil=require(path.join(checkout,'calc/dist/mechanics/util'));
for(const {ability} of syntheticInputs){
 const mon=new ref.Pokemon(gen,'Clefable',{ability:ability==='airLock'?'Air Lock':'Cloud Nine'});
 const field=new ref.Field({weather:'Rain'});
 weatherUtil.checkAirLock(mon,field);
 assert.equal(field.weather,undefined);
}
fs.writeFileSync(path.join(dir,'input-contract.json'),JSON.stringify({analytic:rows,unavailableWeatherAbilities:syntheticInputs}));
console.log('PASS eight Analytic activation cases and two weather-neutralization scope checks');
