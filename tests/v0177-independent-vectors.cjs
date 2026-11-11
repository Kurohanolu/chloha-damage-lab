// Independent arithmetic oracle for a neutral level-50 single-hit case.
// This validates the app against a separately expressed damage formula,
// not against a second call to the same engine. Champions parity is unverified.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#attStats .stat-row').first().waitFor();
  const choose=async(side,name,id)=>{
   await page.locator('#'+side+'Search').fill(name);
   await page.locator('#'+side+'Suggestions').getByRole('option',{name,exact:true}).click();
   assert.equal(await page.locator('#db'+(side==='att'?'Att':'Def')+'Pokemon').inputValue(),id);
  };
  await choose('att','リザードン','charizard');
  await choose('def','フシギバナ','venusaur');
  await page.locator('.move-list-fallback summary').click();
  await page.locator('#dbMove').selectOption('flamethrower');
  await page.locator('#att-specialAttack-nature').selectOption('neutral');
  await page.locator('#def-specialDefense-nature').selectOption('neutral');
  await page.locator('#attPresets button[aria-label="攻撃側 全て0"]').click();
  await page.locator('#defPresets button[aria-label="防御側 全て0"]').click();
  const state=await page.evaluate(()=>window.ChlohaLastCalculation);
  assert.ok(state,'calculation exists');
  const {a,r}=state;
  assert.equal(a.level,50);
  assert.equal(a.attack,129);
  assert.equal(a.defense,120);
  assert.equal(a.power,90);
  assert.equal(r.effectivePower,90);
  assert.equal(r.stab,1.5);
  assert.equal(r.effectiveness,2);
  assert.equal(a.weather,'none');
  assert.equal(a.terrain,'none');
  assert.equal(a.critical,false);
  // Independent arithmetic: base = floor(floor((22*90*129)/120)/50)+2 = 44.
  const expectedBase=44;
  assert.equal(r.base,expectedBase);
  // Fixed-point STAB is rounded to nearest (ties down), followed by 2x type.
  const expected=Array.from({length:16},(_,i)=>{
   const random=Math.floor(expectedBase*(85+i)/100);
   const stab=Math.floor((random*6144+2047)/4096);
   return stab*2;
  });
  assert.deepEqual(r.rolls,expected,'all 16 rolls match independent arithmetic');
  // Type immunity must zero all rolls, not leave a minimum-one damage artifact.
  const immune=await page.evaluate(()=>{
   const original=window.ChlohaLastCalculation.a;
   return window.ChlohaDamageEngine.calculate({...original,moveType:'じめん',defTypes:['ひこう'],attTypes:['じめん'],moveMechanic:'none',power:80});
  });
  assert.deepEqual(immune.rolls,Array(16).fill(0),'Flying immune to Ground');
  console.log('PASS v0.177 independent baseline and immunity vectors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
