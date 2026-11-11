// v0.177 conditional-power independent arithmetic vectors.
// These tests do not establish Pokémon Champions game parity.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const round=(v,m)=>Math.floor((v*m+2047)/4096);
function expected(power,attack,defense,stab=4096){
 const base=Math.floor(Math.floor(22*power*attack/defense)/50)+2;
 return Array.from({length:16},(_,i)=>Math.max(1,round(Math.floor(base*(85+i)/100),stab)));
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#attStats .stat-row').first().waitFor();
  const results=await page.evaluate(()=>{
   const original=window.ChlohaLastCalculation.a;
   const base={...original,level:50,attack:130,defense:110,attackStage:0,defenseStage:0,
    moveType:'ノーマル',attTypes:['ノーマル'],defTypes:['ノーマル'],category:'physical',
    weather:'none',terrain:'none',spread:'single',battleFormat:'singles',critical:false,burn:false,
    screen:'none',attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',friendGuardCount:0,
    helpingHand:false,customMultiplier:1,conditionalPower:false,attGrounding:'grounded',defGrounding:'grounded'};
   const cases=[
    ['facade_off',{moveMechanic:'facade',power:70},70],
    ['facade_on',{moveMechanic:'facade',power:70,conditionalPower:true},140],
    ['hex_off',{moveMechanic:'hex',power:65},65],
    ['hex_on',{moveMechanic:'hex',power:65,conditionalPower:true},130],
    ['venoshock_off',{moveMechanic:'venoshock',power:65},65],
    ['venoshock_on',{moveMechanic:'venoshock',power:65,conditionalPower:true},130],
    ['knock_off_off',{moveMechanic:'knockOff',power:65},65],
    ['knock_off_on',{moveMechanic:'knockOff',power:65,conditionalPower:true},97],
    ['acrobatics_item',{moveMechanic:'acrobatics',power:55,attItem:'lifeOrb'},55],
    ['acrobatics_no_item',{moveMechanic:'acrobatics',power:55},110],
    ['expanding_force_off',{moveMechanic:'expandingForce',power:80},80],
    ['expanding_force_on',{moveMechanic:'expandingForce',power:80,terrain:'psychic'},120],
    ['rising_voltage_off',{moveMechanic:'risingVoltage',power:70},70],
    ['rising_voltage_on',{moveMechanic:'risingVoltage',power:70,terrain:'electric'},140],
    ['misty_explosion_off',{moveMechanic:'mistyExplosion',power:100},100],
    ['misty_explosion_on',{moveMechanic:'mistyExplosion',power:100,terrain:'misty'},150]
   ];
   return cases.map(([name,changes,expectedPower])=>{
    const a={...base,...changes};
    const r=window.ChlohaDamageEngine.calculate(a);
    return {name,a,effectivePower:r.effectivePower,rolls:r.rolls,expectedPower};
   });
  });
  for(const {name,a,effectivePower,rolls,expectedPower} of results){
   assert.equal(effectivePower,expectedPower,name+': effective power');
   // Acrobatics with Life Orb also applies a final damage modifier, so power is checked separately.
   if(name==='acrobatics_item')continue;
   assert.deepEqual(rolls,expected(expectedPower,a.attack,a.defense,6144),name+': independent 16-roll oracle');
  }
  console.log('PASS v0.177 conditional power vectors',results.length,'cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
