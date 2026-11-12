'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  // Ability choices are species-dependent. Isolate the visibility control by
  // supplying its supported values instead of waiting for a specific species.
  await page.evaluate(()=>{
   const select=document.getElementById('attAbility');
   for(const ability of ['overgrow','blaze','torrent','swarm']){
    if(!Array.from(select.options).some(option=>option.value===ability)){
     select.add(new Option(ability,ability));
    }
   }
  });
  const ui=await page.evaluate(()=>{
   const select=document.getElementById('attAbility');
   const label=document.getElementById('lowHpAbilityForceLabel');
   const checkbox=document.getElementById('forceLowHpAbility');
   const setAbility=value=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));};
   return ['overgrow','blaze','torrent','swarm'].map(ability=>{
    setAbility(ability);
    const shown=!label.hidden;
    checkbox.checked=true;
    setAbility('none');
    const hidden=label.hidden;
    const reset=!checkbox.checked;
    return {ability,shown,hidden,reset};
   });
  });
  for(const result of ui){
   assert.deepEqual(result,{ability:result.ability,shown:true,hidden:true,reset:true},result.ability+' checkbox visibility and reset');
  }
  const results=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:201,attCurrentHp:67,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'くさ',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['くさ'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'auto',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const run=x=>window.ChlohaDamageEngine.calculate({...base,...x});
   return ['overgrow','blaze','torrent','swarm'].map((ability,i)=>{
    const type=['くさ','ほのお','みず','むし'][i];
    return {ability,
     active:run({attAbility:ability,moveType:type}),
     inactive:run({attAbility:ability,moveType:type,attCurrentHp:68}),
     wrongType:run({attAbility:ability,moveType:'ノーマル'}),
     forced:run({attAbility:ability,moveType:type,attCurrentHp:201,forceLowHpAbility:true})};
   });
  });
  for(const {ability,active,inactive,wrongType,forced} of results){
   assert.ok(active.trace.some(x=>x.includes('power/'+ability+': 80 → 120')),ability+' boosts at exactly 1/3 HP');
   assert.ok(!inactive.trace.some(x=>x.includes('power/'+ability)),ability+' inactive above threshold');
   assert.ok(!wrongType.trace.some(x=>x.includes('power/'+ability)),ability+' ignores other types');
   assert.ok(forced.trace.some(x=>x.includes('power/'+ability+': 80 → 120')),ability+' checkbox overrides HP');
   assert.deepEqual(forced.rolls,active.rolls,ability+' forced rolls equal natural activation');
   assert.ok(active.rolls[0]>inactive.rolls[0],ability+' increases actual damage');
  }
  const flare=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ゴースト',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ゴースト'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   // Normal typing is immune to Ghost; use a neutral defender for numeric comparison.
   base.defTypes=['みず'];
   const calc=extra=>window.ChlohaDamageEngine.calculate({...base,...extra});
   return {normal:calc({}),burned:calc({attAbility:'flareBoost',burn:true}),
    unburned:calc({attAbility:'flareBoost'}),
    physical:calc({attAbility:'flareBoost',burn:true,category:'physical'}),
    solar:calc({attAbility:'solarPower',weather:'sun'})};
  });
  assert.deepEqual(flare.unburned.rolls,flare.normal.rolls,'Flare Boost requires burn');
  assert.deepEqual(flare.burned.rolls,flare.solar.rolls,'Flare Boost special stat matches Solar Power 1.5x');
  assert.ok(flare.burned.rolls[0]>flare.normal.rolls[0],'Flare Boost increases special damage');
  assert.ok(!flare.physical.trace.some(x=>x.includes('stat/flareBoost')),'Flare Boost does not modify physical attack');
  const bubble=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'みず',moveId:'testMove',moveMechanic:'none',
    category:'physical',attTypes:['みず'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x});
   return {normal:calc({}),water:calc({attAbility:'waterBubble'}),
    other:calc({attAbility:'waterBubble',moveType:'くさ'}),
    otherNormal:calc({moveType:'くさ'}),
    burned:calc({attAbility:'waterBubble',burn:true}),
    burnedNormal:calc({burn:true})};
  });
  assert.ok(bubble.water.trace.some(x=>x.includes('power/waterBubble: 80 → 160')),'Water Bubble doubles Water move power');
  assert.ok(bubble.water.rolls[0]>bubble.normal.rolls[0],'Water Bubble increases Water damage');
  assert.deepEqual(bubble.other.rolls,bubble.otherNormal.rolls,'Water Bubble does not boost other types');
  assert.deepEqual(bubble.burned.rolls,bubble.water.rolls,'Water Bubble ignores physical burn penalty');
  assert.ok(bubble.burnedNormal.rolls[0]<bubble.normal.rolls[0],'ordinary burn penalty still applies');
  const trio=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ノーマル',moveId:'testMove',moveMechanic:'none',
    category:'physical',attTypes:['ノーマル'],defTypes:['みず'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x});
   return {normal:calc({}),defeat:calc({attAbility:'defeatist',attCurrentHp:100}),
    healthy:calc({attAbility:'defeatist',attCurrentHp:101}),
    defeatSpecial:calc({attAbility:'defeatist',attCurrentHp:100,category:'special'}),
    pulse:calc({attAbility:'orichalcumPulse',weather:'sun'}),
    pulseNoSun:calc({attAbility:'orichalcumPulse'}),
    pulseSpecial:calc({attAbility:'orichalcumPulse',weather:'sun',category:'special'}),
    hadron:calc({attAbility:'hadronEngine',terrain:'electric',category:'special'}),
    hadronNoTerrain:calc({attAbility:'hadronEngine',category:'special'}),
    hadronPhysical:calc({attAbility:'hadronEngine',terrain:'electric'})};
  });
  assert.ok(trio.defeat.rolls[0]<trio.normal.rolls[0],'Defeatist halves physical attack at 50% HP');
  assert.deepEqual(trio.healthy.rolls,trio.normal.rolls,'Defeatist inactive above 50% HP');
  assert.ok(trio.defeatSpecial.trace.some(x=>x.includes('stat/defeatist')),'Defeatist affects special attack');
  assert.ok(trio.pulse.rolls[0]>trio.pulseNoSun.rolls[0],'Orichalcum Pulse boosts physical attack in sun');
  assert.ok(!trio.pulseSpecial.trace.some(x=>x.includes('stat/orichalcumPulse')),'Orichalcum Pulse excludes special attack');
  assert.ok(trio.hadron.rolls[0]>trio.hadronNoTerrain.rolls[0],'Hadron Engine boosts special attack in Electric Terrain');
  assert.ok(!trio.hadronPhysical.trace.some(x=>x.includes('stat/hadronEngine')),'Hadron Engine excludes physical attack');
  const aura=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'フェアリー',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ノーマル'],defTypes:['みず'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x});
   return {neutral:calc({}),fairy:calc({attAbility:'fairyAura'}),
    fairyDef:calc({defAbility:'fairyAura'}),dark:calc({attAbility:'darkAura',moveType:'あく'}),
    wrong:calc({attAbility:'darkAura'}),darkNeutral:calc({moveType:'あく'}),
    broken:calc({attAbility:'fairyAura',defAbility:'auraBreak'})};
  });
  assert.ok(aura.fairy.trace.some(x=>x.includes('power/aura: 80 → 106')),'Fairy Aura applies 1.33x power');
  assert.deepEqual(aura.fairy.rolls,aura.fairyDef.rolls,'defender Fairy Aura also affects attacker');
  assert.ok(aura.fairy.rolls[0]>aura.neutral.rolls[0],'Fairy Aura increases Fairy damage');
  assert.ok(aura.dark.rolls[0]>aura.darkNeutral.rolls[0],'Dark Aura increases Dark damage');
  assert.deepEqual(aura.wrong.rolls,aura.neutral.rolls,'Dark Aura ignores Fairy attacks');
  assert.ok(aura.broken.trace.some(x=>x.includes('power/aura: 80 → 60')),'Aura Break replaces 1.33x with 0.75x');
  assert.ok(aura.broken.rolls[0]<aura.neutral.rolls[0],'Aura Break reduces damage');
  const trio3=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'はがね',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ノーマル'],defTypes:['みず'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x});
   return {normal:calc({}),steel:calc({attAbility:'steelSpirit'}),
    steelOther:calc({attAbility:'steelSpirit',moveType:'くさ'}),
    otherNormal:calc({moveType:'くさ'}),
    plus:calc({attAbility:'plus',partnerOppositePlusMinus:true}),
    minus:calc({attAbility:'minus',partnerOppositePlusMinus:true}),
    plusSolo:calc({attAbility:'plus'}),
    plusPhysical:calc({attAbility:'plus',partnerOppositePlusMinus:true,category:'physical'})};
  });
  assert.ok(trio3.steel.trace.some(x=>x.includes('power/steelSpirit: 80 → 120')),'Steely Spirit boosts Steel power');
  assert.ok(trio3.steel.rolls[0]>trio3.normal.rolls[0],'Steely Spirit increases Steel damage');
  assert.deepEqual(trio3.steelOther.rolls,trio3.otherNormal.rolls,'Steely Spirit ignores non-Steel');
  assert.ok(trio3.plus.rolls[0]>trio3.normal.rolls[0],'Plus boosts special attack with Minus ally');
  assert.deepEqual(trio3.plus.rolls,trio3.minus.rolls,'Plus and Minus have equal modifiers');
  assert.deepEqual(trio3.plusSolo.rolls,trio3.normal.rolls,'Plus requires partner');
  assert.ok(!trio3.plusPhysical.trace.some(x=>x.includes('stat/plusMinus')),'Plus excludes physical attacks');
  const trio4=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ほのお',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ノーマル'],defTypes:['くさ'],
    weather:'none',terrain:'none',battleFormat:'singles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x});
   return {crit:calc({critical:true}),sniper:calc({critical:true,attAbility:'sniper'}),
    sniperNoCrit:calc({attAbility:'sniper'}),normal:calc({}),
    neuro:calc({attAbility:'neuroforce'}),
    neuroNeutral:calc({attAbility:'neuroforce',moveType:'ノーマル',defTypes:['みず']}),
    neutral:calc({moveType:'ノーマル',defTypes:['みず']}),
    stakeout:calc({attAbility:'stakeout',targetSwitchedIn:true}),
    stakeoutOff:calc({attAbility:'stakeout'})};
  });
  assert.ok(trio4.sniper.rolls[0]>trio4.crit.rolls[0],'Sniper boosts critical damage');
  assert.deepEqual(trio4.sniperNoCrit.rolls,trio4.normal.rolls,'Sniper requires critical hit');
  assert.ok(trio4.neuro.rolls[0]>trio4.normal.rolls[0],'Neuroforce boosts super effective damage');
  assert.deepEqual(trio4.neuroNeutral.rolls,trio4.neutral.rolls,'Neuroforce ignores neutral effectiveness');
  assert.ok(trio4.stakeout.rolls[0]>trio4.normal.rolls[0],'Stakeout boosts switched-in target');
  assert.deepEqual(trio4.stakeoutOff.rolls,trio4.normal.rolls,'Stakeout requires switch-in flag');
  const trio5=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ノーマル',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ノーマル'],defTypes:['みず'],
    weather:'none',terrain:'none',battleFormat:'doubles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x});
   return {normal:calc({}),overlord:calc({attAbility:'supremeOverlord',supremeOverlordFainted:5}),
    overlordZero:calc({attAbility:'supremeOverlord',supremeOverlordFainted:0}),
    battery:calc({allyBattery:true}),batteryPhysical:calc({allyBattery:true,category:'physical'}),
    physical:calc({category:'physical'}),spot:calc({allyPowerSpot:true})};
  });
  assert.ok(trio5.overlord.rolls[0]>trio5.normal.rolls[0],'Supreme Overlord boosts damage with fainted allies');
  assert.deepEqual(trio5.overlordZero.rolls,trio5.normal.rolls,'Supreme Overlord zero allies is neutral');
  assert.ok(trio5.battery.rolls[0]>trio5.normal.rolls[0],'Battery boosts special damage');
  assert.deepEqual(trio5.batteryPhysical.rolls,trio5.physical.rolls,'Battery does not boost physical');
  assert.ok(trio5.spot.rolls[0]>trio5.normal.rolls[0],'Power Spot boosts damage');
  const trio6=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ほのお',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ノーマル'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'doubles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x}).rolls;
   return {base:calc({}),mane:calc({attAbility:'fireMane'}),
    maneWater:calc({attAbility:'fireMane',moveType:'みず'}),water:calc({moveType:'みず'}),
    toxic:calc({attAbility:'toxicBoost',poisoned:true,category:'physical'}),
    physical:calc({category:'physical'}),
    toxicOff:calc({attAbility:'toxicBoost',poisoned:false,category:'physical'}),
    flash:calc({attAbility:'flashFire',flashFireActivated:true}),
    flashOff:calc({attAbility:'flashFire',flashFireActivated:false})};
  });
  assert.ok(trio6.mane[0]>trio6.base[0],'Fire Mane boosts Fire attacks');
  assert.deepEqual(trio6.maneWater,trio6.water,'Fire Mane does not boost Water');
  assert.ok(trio6.toxic[0]>trio6.physical[0],'Toxic Boost boosts poisoned physical attacks');
  assert.deepEqual(trio6.toxicOff,trio6.physical,'Toxic Boost inactive without poison');
  assert.ok(trio6.flash[0]>trio6.base[0],'Activated Flash Fire boosts Fire');
  assert.deepEqual(trio6.flashOff,trio6.base,'Flash Fire inactive without activation');
  const bypass=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ノーマル',moveId:'testMove',moveMechanic:'none',
    category:'physical',attTypes:['ノーマル'],defTypes:['ゴースト'],
    weather:'none',terrain:'none',battleFormat:'doubles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x}).rolls;
   return {immune:calc({}),scrappy:calc({attAbility:'scrappy'}),
    scrappyFight:calc({attAbility:'scrappy',moveType:'かくとう'}),
    immuneFight:calc({moveType:'かくとう'}),
    scrappyPsychic:calc({attAbility:'scrappy',moveType:'エスパー'}),
    psychic:calc({moveType:'エスパー'}),
    unscreened:calc({defTypes:['ノーマル']}),
    reflect:calc({defTypes:['ノーマル'],screen:'reflect'}),
    infiltratorReflect:calc({defTypes:['ノーマル'],screen:'reflect',attAbility:'infiltrator'}),
    light:calc({defTypes:['ノーマル'],screen:'lightScreen',category:'special'}),
    infiltratorLight:calc({defTypes:['ノーマル'],screen:'lightScreen',category:'special',attAbility:'infiltrator'}),
    special:calc({defTypes:['ノーマル'],category:'special'})};
  });
  assert.equal(bypass.immune[15],0,'Normal move remains immune against Ghost');
  assert.equal(bypass.immuneFight[15],0,'Fighting move remains immune against Ghost');
  assert.ok(bypass.scrappy[0]>0,'Scrappy Normal hits Ghost');
  assert.ok(bypass.scrappyFight[0]>0,'Scrappy Fighting hits Ghost');
  assert.deepEqual(bypass.scrappyPsychic,bypass.psychic,'Scrappy does not change Psychic matchup');
  assert.ok(bypass.reflect[15]<bypass.unscreened[15],'Reflect reduces physical damage');
  assert.deepEqual(bypass.infiltratorReflect,bypass.unscreened,'Infiltrator ignores Reflect');
  assert.ok(bypass.light[15]<bypass.special[15],'Light Screen reduces special damage');
  assert.deepEqual(bypass.infiltratorLight,bypass.special,'Infiltrator ignores Light Screen');
  const triggered=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'ノーマル',moveId:'testMove',moveMechanic:'none',
    category:'physical',attTypes:['ノーマル'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'doubles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x}).rolls;
   return {normal:calc({}),thermal:calc({attAbility:'thermalExchange',thermalExchangeActivated:true}),
    thermalOff:calc({attAbility:'thermalExchange',thermalExchangeActivated:false}),
    anger:calc({attAbility:'angerPoint',angerPointActivated:true}),
    angerOff:calc({attAbility:'angerPoint',angerPointActivated:false}),
    rattled:calc({attAbility:'rattled',rattledActivated:true})};
  });
  assert.ok(triggered.thermal[0]>triggered.normal[0],'Thermal Exchange boosts physical damage');
  assert.deepEqual(triggered.thermalOff,triggered.normal,'Thermal Exchange inactive without trigger');
  assert.ok(triggered.anger[0]>triggered.thermal[0],'Anger Point reaches +6 Attack');
  assert.deepEqual(triggered.angerOff,triggered.normal,'Anger Point inactive without trigger');
  assert.deepEqual(triggered.rattled,triggered.normal,'Rattled does not directly boost damage');
  const weatherAbilities=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'みず',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ノーマル'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'doubles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x}).rolls;
   return {normal:calc({}),rain:calc({weather:'rain'}),drizzle:calc({attAbility:'drizzle'}),
    drought:calc({attAbility:'drought'}),sun:calc({weather:'sun'}),
    sand:calc({weather:'sand',moveType:'いわ'}),
    sandStream:calc({attAbility:'sandStream',moveType:'いわ'}),
    snow:calc({weather:'snow',category:'physical',defTypes:['こおり']}),
    snowWarning:calc({attAbility:'snowWarning',category:'physical',defTypes:['こおり']}),
    override:calc({attAbility:'drizzle',weather:'sun'})};
  });
  assert.deepEqual(weatherAbilities.drizzle,weatherAbilities.rain,'Drizzle sets rain');
  assert.deepEqual(weatherAbilities.drought,weatherAbilities.sun,'Drought sets sun');
  assert.deepEqual(weatherAbilities.sandStream,weatherAbilities.sand,'Sand Stream sets sand weather');
  assert.deepEqual(weatherAbilities.snowWarning,weatherAbilities.snow,'Snow Warning sets snow');
  assert.deepEqual(weatherAbilities.override,weatherAbilities.sun,'Explicit weather overrides inferred ability weather');
  const terrainAbilities=await page.evaluate(()=>{
   const base={level:50,power:80,attack:150,defense:100,hp:200,currentHp:200,
    attMaxHp:200,attCurrentHp:200,attackStage:0,defenseStage:0,
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    moveType:'でんき',moveId:'testMove',moveMechanic:'none',
    category:'special',attTypes:['ノーマル'],defTypes:['ノーマル'],
    weather:'none',terrain:'none',battleFormat:'doubles',spread:'single',
    screen:'none',stabMode:'none',burn:false,critical:false,
    attGrounding:'grounded',defGrounding:'grounded',
    friendGuardCount:0,helpingHand:false,customMultiplier:1};
   const calc=x=>window.ChlohaDamageEngine.calculate({...base,...x}).rolls;
   return {electric:calc({terrain:'electric'}),electricSurge:calc({attAbility:'electricSurge'}),
    grassy:calc({terrain:'grassy',moveType:'くさ'}),grassySurge:calc({attAbility:'grassySurge',moveType:'くさ'}),
    misty:calc({terrain:'misty',moveType:'ドラゴン'}),mistySurge:calc({attAbility:'mistySurge',moveType:'ドラゴン'}),
    psychic:calc({terrain:'psychic',moveType:'エスパー'}),psychicSurge:calc({attAbility:'psychicSurge',moveType:'エスパー'}),
    manual:calc({attAbility:'electricSurge',terrain:'grassy',moveType:'くさ'}),
    explicitGrassy:calc({terrain:'grassy',moveType:'くさ'})};
  });
  assert.deepEqual(terrainAbilities.electricSurge,terrainAbilities.electric,'Electric Surge sets terrain');
  assert.deepEqual(terrainAbilities.grassySurge,terrainAbilities.grassy,'Grassy Surge sets terrain');
  assert.deepEqual(terrainAbilities.mistySurge,terrainAbilities.misty,'Misty Surge sets terrain');
  assert.deepEqual(terrainAbilities.psychicSurge,terrainAbilities.psychic,'Psychic Surge sets terrain');
  assert.deepEqual(terrainAbilities.manual,terrainAbilities.explicitGrassy,'Manual terrain takes precedence');
  console.log('PASS v0.182 four Surge abilities and manual terrain precedence');
  console.log('PASS v0.182 weather-setting abilities and manual weather precedence');
  console.log('PASS v0.182 Thermal Exchange, Anger Point and Rattled checks');
  console.log('PASS v0.182 Infiltrator and Scrappy immunity/screen numeric checks');
  console.log('PASS v0.182 Fire Mane, Toxic Boost and Flash Fire numeric checks');
  console.log('PASS v0.182 Supreme Overlord, Battery and Power Spot numeric checks');
  console.log('PASS v0.182 Sniper, Neuroforce and Stakeout numeric checks');
  console.log('PASS v0.182 Steely Spirit, Plus and Minus numeric checks');
  console.log('PASS v0.182 Fairy Aura, Dark Aura and Aura Break numeric checks');
  console.log('PASS v0.182 three offensive abilities threshold/weather/terrain checks');
  console.log('PASS v0.182 Water Bubble offensive and burn numeric checks');
  console.log('PASS v0.182 Flare Boost burn and category numeric checks');
  console.log('PASS v0.182 four low HP ability numeric thresholds');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
