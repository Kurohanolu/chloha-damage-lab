// v0.166 regression: deterministic app behavior, NOT proof of Pokémon Champions game parity.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../index.html'),{waitUntil:'load'});
  await page.locator('#attStats .stat-row').first().waitFor({state:'attached',timeout:15000});
  async function choose(side,query,label,id){
   const search=page.locator('#'+side+'Search');
   await search.fill(query);
   await page.locator('#'+side+'Suggestions').getByRole('option',{name:label,exact:true}).click();
   assert.equal(await page.locator('#'+(side==='att'?'dbAttPokemon':'dbDefPokemon')).inputValue(),id);
  }
  const snapshot=()=>page.evaluate(()=>{
   const r=window.ChlohaLastCalculation;
   if(!r)return null;
   return {a:r.a,rolls:r.r.rolls,min:Math.min(...r.r.rolls),max:Math.max(...r.r.rolls),effectiveness:r.r.effectiveness,stab:r.r.stab};
  });
  async function expectValid(name){
   const r=await snapshot();
   assert.ok(r,name+': calculation must exist');
   assert.equal(await page.locator('#error').isHidden(),true,name+': no validation errors');
   assert.equal(r.rolls.length,16,name+': 16 rolls');
   assert.ok(r.rolls.every(n=>Number.isInteger(n)&&n>=0),name+': nonnegative integer damage');
   assert.ok(r.min<=r.max,name+': sorted range');
   return r;
  }
  // First field comparison: Charizard Flamethrower into Venusaur, 0 points, neutral nature.
  await choose('att','リザードン','リザードン','charizard');
  await choose('def','フシギバナ','フシギバナ','venusaur');
  await page.locator('#dbMove').selectOption('flamethrower');
  await page.locator('#att-specialAttack-nature').selectOption('neutral');
  await page.locator('#def-specialDefense-nature').selectOption('neutral');
  await page.locator('#attPresets button[aria-label="攻撃側 全て0"]').click();
  await page.locator('#defPresets button[aria-label="防御側 全て0"]').click();
  const base=await expectValid('TC01 neutral baseline');
  assert.equal(base.a.attack,129,'Charizard special attack, no points');
  assert.equal(base.a.defense,120,'Venusaur special defense, no points');
  assert.equal(base.a.hp,155,'Venusaur HP, no points');
  assert.equal(base.effectiveness,2);
  assert.equal(base.stab,1.5);
  assert.equal(base.a.weather,'none');
  assert.equal(base.a.terrain,'none');
  console.log('FIELD_CASE_01',JSON.stringify({attacker:'リザードン',move:'かえんほうしゃ',defender:'フシギバナ',points:0,attSpA:base.a.attack,defSpD:base.a.defense,defHp:base.a.hp,min:base.min,max:base.max,rolls:base.rolls}));
  // Changing attack allocation must update both the derived stat and displayed damage.
  await page.locator('#attPresets button[aria-label="攻撃側 H32/C32/S2"]').click();
  const boosted=await expectValid('TC02 attacker points');
  assert.ok(boosted.a.attack>base.a.attack,'points must increase special attack');
  assert.ok(boosted.min>base.min,'damage must increase');
  // Defensive 66-point preset must increase HP and special defense, lowering incoming damage.
  await page.locator('#defPresets button[aria-label="防御側 H32/D32/B2"]').click();
  const bulky=await expectValid('TC03 defender points');
  assert.ok(bulky.a.hp>boosted.a.hp,'defender HP increases');
  assert.ok(bulky.a.defense>boosted.a.defense,'defender SpD increases');
  assert.ok(bulky.max<boosted.max,'damage falls after defense points');
  console.log('FIELD_CASE_02',JSON.stringify({attacker:'リザードン',move:'かえんほうしゃ',defender:'フシギバナ',attPoints:'H32/C32/S2',defPoints:'H32/D32/B2',attSpA:bulky.a.attack,defSpD:bulky.a.defense,defHp:bulky.a.hp,min:bulky.min,max:bulky.max,rolls:bulky.rolls}));
  // Different target and then type-advantage move should recompute instantly.
  await choose('def','カメックス','カメックス','blastoise');
  const water=await expectValid('TC04 switch defender');
  assert.equal(water.effectiveness,0.5);
  assert.ok(water.max<bulky.max,'Fire into Water should be resisted');
  await page.locator('#dbMove').selectOption('thunderbolt');
  const electric=await expectValid('TC05 switch attack');
  assert.equal(electric.effectiveness,2);
  assert.ok(electric.max>water.max,'Electric into Water should be stronger');
  // Reject allocation exceeding 66 and allow user recovery.
  await page.locator('#att-attack-points').fill('32');
  assert.equal(await page.locator('#output').isHidden(),true,'invalid 98 point allocation stops calculation');
  assert.match(await page.locator('#error').innerText(),/66/);
  await page.locator('#attPresets button[aria-label="攻撃側 全て0"]').click();
  await expectValid('TC06 recover from invalid points');
  assert.deepEqual(errors,[],'uncaught browser errors');
  console.log('PASS damage regression cases TC01-TC06');
  await page.close();
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1});
