// Independent fixed-point oracle for stacked Expanding Force modifiers.
// Confirms arithmetic and ordering, not Pokémon Champions game parity.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const round=(v,m)=>Math.floor((v*m+2047)/4096);
(async()=>{
 // v0.186: compose factors before rounding the value (independent reference util.chainMods).
const chain=mods=>mods.reduce((m,n)=>Math.floor((m*n+2048)/4096),4096);
const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#attStats .stat-row').first().waitFor();
  const results=await page.evaluate(()=>{
   const o=window.ChlohaLastCalculation.a;
   const base={...o,level:50,attack:147,defense:113,attackStage:0,defenseStage:0,
    moveMechanic:'expandingForce',power:80,moveType:'エスパー',category:'special',
    attTypes:['エスパー'],defTypes:['ノーマル'],terrain:'psychic',battleFormat:'doubles',
    spread:'spread',weather:'none',critical:false,burn:false,screen:'none',
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    friendGuardCount:0,helpingHand:false,customMultiplier:1,stabMode:'auto',
    attGrounding:'grounded',defGrounding:'grounded'};
   const matrix=[
    ['terrain_spread_stab',{}],
    ['plus_helping_hand',{helpingHand:true}],
    ['plus_critical',{critical:true}],
    ['helping_hand_critical',{helpingHand:true,critical:true}],
    ['no_stab',{stabMode:'none'}],
    ['no_stab_helping_critical',{stabMode:'none',helpingHand:true,critical:true}],
    ['life_orb',{attItem:'lifeOrb'}],
    ['all_four',{helpingHand:true,critical:true,attItem:'lifeOrb'}],
    ['airborne_all',{attGrounding:'airborne',spread:'single',helpingHand:true,critical:true,attItem:'lifeOrb'}],
    ['singles_all',{battleFormat:'singles',spread:'single',helpingHand:false,critical:true,attItem:'lifeOrb'}]
   ];
   return matrix.map(([name,changes])=>{
    const a={...base,...changes};
    const r=window.ChlohaDamageEngine.calculate(a);
    return {name,a,power:r.effectivePower,rolls:r.rolls};
   });
  });
  for(const {name,a,power,rolls} of results){
   const grounded=a.attGrounding==='grounded';
   const effective=grounded?120:80;
   assert.equal(power,effective,name+' conditional power');
   const modified=round(effective,chain([...(a.helpingHand?[6144]:[]),...(grounded?[5325]:[])]));
   let damage=Math.floor(Math.floor(22*modified*a.attack/a.defense)/50)+2;
   if(a.battleFormat==='doubles'&&a.spread==='spread')damage=round(damage,3072);
   if(a.critical)damage=Math.floor(damage*1.5);
   const stab=a.stabMode==='none'?4096:6144;
   const expected=Array.from({length:16},(_,i)=>{
    let value=Math.floor(damage*(85+i)/100);
    value=round(value,stab);
    if(a.attItem==='lifeOrb')value=round(value,5324);
    return Math.max(1,value);
   });
   assert.deepEqual(rolls,expected,name+' independent 16-roll oracle');
   console.log('CASE',name,Math.min(...rolls),Math.max(...rolls));
  }
  console.log('PASS Expanding Force stacked modifier oracle',results.length);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
