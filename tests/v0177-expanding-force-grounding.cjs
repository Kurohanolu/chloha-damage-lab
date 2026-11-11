// Independent Expanding Force attacker/defender grounding and Levitate matrix.
// Checks implementation consistency, not verified Champions game parity.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const round=(v,m)=>Math.floor((v*m+2047)/4096);
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#attStats .stat-row').first().waitFor();
  const cases=await page.evaluate(()=>{
   const o=window.ChlohaLastCalculation.a;
   const base={...o,level:50,attack:130,defense:110,attackStage:0,defenseStage:0,
    moveMechanic:'expandingForce',power:80,moveType:'エスパー',category:'special',
    attTypes:['ノーマル'],defTypes:['ノーマル'],terrain:'psychic',battleFormat:'doubles',
    spread:'single',weather:'none',critical:false,burn:false,screen:'none',
    attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',
    friendGuardCount:0,helpingHand:false,customMultiplier:1,stabMode:'none',
    attGrounding:'auto',defGrounding:'auto'};
   const matrix=[
    ['both_grounded',{attGrounding:'grounded',defGrounding:'grounded'},true],
    ['def_airborne',{attGrounding:'grounded',defGrounding:'airborne'},true],
    ['att_airborne',{attGrounding:'airborne',defGrounding:'grounded'},false],
    ['both_airborne',{attGrounding:'airborne',defGrounding:'airborne'},false],
    ['att_auto_normal',{attGrounding:'auto'},true],
    ['att_auto_flying',{attGrounding:'auto',attTypes:['ひこう']},false],
    ['att_auto_levitate',{attGrounding:'auto',attAbility:'levitate'},false],
    ['att_forced_grounded_flying',{attGrounding:'grounded',attTypes:['ひこう']},true],
    ['att_forced_airborne_normal',{attGrounding:'airborne'},false],
    ['def_auto_flying',{defTypes:['ひこう']},true],
    ['def_auto_levitate',{defAbility:'levitate'},true]
   ];
   return matrix.map(([name,changes,grounded])=>{
    const a={...base,...changes,spread:grounded?'spread':'single'};
    const r=window.ChlohaDamageEngine.calculate(a);
    return {name,a,grounded,power:r.effectivePower,rolls:r.rolls};
   });
  });
  for(const {name,a,grounded,power,rolls} of cases){
   const effective=grounded?120:80;
   assert.equal(power,effective,name+' effective power');
   const boosted=grounded?round(effective,5325):effective;
   let base=Math.floor(Math.floor(22*boosted*a.attack/a.defense)/50)+2;
   if(grounded)base=round(base,3072);
   const expected=Array.from({length:16},(_,i)=>Math.max(1,Math.floor(base*(85+i)/100)));
   assert.deepEqual(rolls,expected,name+' 16 rolls');
   console.log('CASE',name,grounded?'boosted spread':'ordinary single');
  }
  console.log('PASS Expanding Force grounding/ability matrix',cases.length);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
