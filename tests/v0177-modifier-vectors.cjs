// v0.177: independent modifier vectors, not game-device parity.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const round=(n,m)=>Math.floor((n*m+2047)/4096);
const oracle=(a)=>{
 const stage=s=>s>=0?(2+s)/2:2/(2-s);
 const atkStage=a.critical?Math.max(0,a.attackStage):a.attackStage;
 const defStage=a.critical?Math.min(0,a.defenseStage):a.defenseStage;
 const atk=Math.max(1,Math.floor(a.attack*stage(atkStage)));
 const def=Math.max(1,Math.floor(a.defense*stage(defStage)));
 let base=Math.floor(Math.floor((Math.floor(2*a.level/5)+2)*a.power*atk/def)/50)+2;
 if(a.battleFormat==='doubles'&&a.spread==='spread')base=round(base,3072);
 if((a.weather==='sun'||a.weather==='rain')&&['ほのお','みず'].includes(a.moveType))
  base=round(base,(a.weather==='sun'&&a.moveType==='ほのお')||(a.weather==='rain'&&a.moveType==='みず')?6144:2048);
 if(a.critical)base=Math.floor(base*1.5);
 const stab=a.attTypes.includes(a.moveType)?6144:4096;
 const effectiveness=a.moveType==='ほのお'&&a.defTypes.includes('くさ')?2:1;
 return Array.from({length:16},(_,i)=>{
  let n=Math.floor(base*(85+i)/100);
  n=round(n,stab);
  n=Math.floor(n*effectiveness);
  if(a.burn&&a.category==='physical'&&a.moveMechanic!=='facade')n=Math.floor(n/2);
  if(!a.critical&&((a.screen==='reflect'&&a.category==='physical')||(a.screen==='lightScreen'&&a.category==='special')))
   n=round(n,a.battleFormat==='singles'?2048:2732);
  return Math.max(1,n);
 });
};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#attStats .stat-row').first().waitFor();
  const results=await page.evaluate(()=>{
   const original=window.ChlohaLastCalculation.a;
   const base={...original,level:50,power:90,attack:129,defense:120,attackStage:0,defenseStage:0,
    moveType:'ほのお',attTypes:['ほのお'],defTypes:['くさ'],category:'special',moveMechanic:'none',
    weather:'none',terrain:'none',spread:'single',battleFormat:'doubles',critical:false,burn:false,
    screen:'none',attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',friendGuardCount:0,
    helpingHand:false,customMultiplier:1};
   const cases=[
    ['neutral',{}],
    ['sun',{weather:'sun'}],
    ['rain',{weather:'rain'}],
    ['critical',{critical:true}],
    ['critical_negative_attack',{critical:true,attackStage:-2}],
    ['critical_positive_defense',{critical:true,defenseStage:2}],
    ['burn_physical',{category:'physical',burn:true}],
    ['reflect_physical',{category:'physical',screen:'reflect'}],
    ['light_screen_special',{screen:'lightScreen'}],
    ['critical_ignores_screen',{critical:true,screen:'lightScreen'}],
    ['spread',{spread:'spread'}],
    ['sun_spread_critical',{weather:'sun',spread:'spread',critical:true}]
   ];
   return cases.map(([name,changes])=>{const a={...base,...changes};return {name,a,rolls:window.ChlohaDamageEngine.calculate(a).rolls};});
  });
  for(const {name,a,rolls} of results){
   assert.deepEqual(rolls,oracle(a),name+': all 16 rolls match independent oracle');
  }
  assert.deepEqual(results.find(x=>x.name==='critical').rolls,results.find(x=>x.name==='critical_negative_attack').rolls,'critical ignores negative attack stage');
  assert.deepEqual(results.find(x=>x.name==='critical').rolls,results.find(x=>x.name==='critical_positive_defense').rolls,'critical ignores positive defense stage');
  console.log('PASS v0.177 modifier vectors',results.length,'cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
