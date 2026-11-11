// v0.177 Expanding Force field/grounding/format/spread matrix.
// Checks UI targeting and independent damage arithmetic; not game parity.
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
  const set=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{
   if(!Array.from(el.options).some(o=>o.value===v))throw Error('missing option '+id+':'+v);
   el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));
  },value);
  // Select a known non-immune target; the default defender can be Dark-type.
  const choose=async(side,name,id)=>{
   await page.locator('#'+side+'Search').fill(name);
   await page.locator('#'+side+'Suggestions').getByRole('option',{name,exact:true}).click();
   assert.equal(await page.locator('#db'+(side==='att'?'Att':'Def')+'Pokemon').inputValue(),id);
  };
  await choose('att','リザードン','charizard');
  await choose('def','フシギバナ','venusaur');
  await set('dbMove','gw0170_u060');
  const cases=[
   ['doubles_no_field','doubles','none','grounded',80,'single'],
   ['doubles_psychic_grounded','doubles','psychic','grounded',120,'spread'],
   ['doubles_psychic_airborne','doubles','psychic','airborne',80,'single'],
   ['singles_psychic_grounded','singles','psychic','grounded',120,'single'],
   ['singles_psychic_airborne','singles','psychic','airborne',80,'single']
  ];
  for(const [name,format,terrain,grounding,power,spread] of cases){
   await set('battleFormat',format);
   await set('terrain',terrain);
   await set('attGrounding',grounding);
   const state=await page.evaluate(()=>{
    const {a,r}=window.ChlohaLastCalculation;
    return {a:{...a},rolls:r.rolls,power:r.effectivePower};
   });
   assert.equal(state.power,power,name+' effective power');
   assert.equal(state.a.spread,spread,name+' targeting');
   // Independent damage oracle for this case, including the 0.75 spread multiplier.
   const a=state.a;
   const stage=s=>s>=0?(2+s)/2:2/(2-s);
   const atk=Math.floor(a.attack*stage(a.attackStage));
   const def=Math.floor(a.defense*stage(a.defenseStage));
   // Independent Gen 9-style oracle: terrain boosts move power before base damage.
   // Fixed-point 5325/4096 (approximately 1.3x), with rounding at this stage.
   const boostedPower=terrain==='psychic'&&grounding==='grounded'?round(power,5325):power;
   let base=Math.floor(Math.floor(22*boostedPower*atk/def)/50)+2;
   if(spread==='spread')base=round(base,3072);
   const stab=a.attTypes.includes(a.moveType)?6144:4096;
   const effectiveness=a.defTypes.reduce((m,t)=>m*(a.moveType==='エスパー'&&t==='どく'?2:1),1);
   const expected=Array.from({length:16},(_,i)=>Math.max(1,Math.floor(round(Math.floor(base*(85+i)/100),stab)*effectiveness)));
   assert.deepEqual(state.rolls,expected,name+' all 16 damage rolls (including terrain/spread)');
   console.log('CASE',name,JSON.stringify({power,spread,min:Math.min(...state.rolls),max:Math.max(...state.rolls)}));
  }
  console.log('PASS Expanding Force matrix');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
