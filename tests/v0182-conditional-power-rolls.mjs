// Independent 16-roll arithmetic for conditional-power and terrain mechanics.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const db=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const policies=JSON.parse(html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/)[1]);
const conditional=['lashOut','barbBarrage','fickleBeam','hex','infernalParade','round','temperFlare','avalanche','stompingTantrum','payback','assurance','venoshock'];
const terrain=[['risingVoltage','electric',2],['mistyExplosion','misty',1.5]];
const cases=[
 ...conditional.map(mechanic=>({mechanic,boost:'conditionalPower',multiplier:2})),
 ...terrain.map(([mechanic,value,multiplier])=>({mechanic,boost:'terrain',value,multiplier}))
];
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();await page.goto('about:blank');await page.setContent(html,{waitUntil:'load'});
 await page.waitForFunction(()=>!!window.ChlohaDamageEngine?.calculate);
 for(const c of cases){
  const move=db.find(m=>policies[m.id]?.mechanic===c.mechanic&&policies[m.id]?.standardDamageSupported===true);
  assert.ok(move&&move.power>0,c.mechanic+' policy move exists');
  const base={level:50,power:move.power,attack:150,defense:100,hp:200,currentHp:200,attCurrentHp:200,attMaxHp:200,attackStage:0,defenseStage:0,moveType:'ノーマル',category:move.category,attTypes:['みず'],defTypes:['みず'],attItem:'none',defItem:'none',attAbility:'none',defAbility:'none',terrain:'none',weather:'none',spread:'single',battleFormat:'singles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'none',moveMechanic:c.mechanic,conditionalPower:false};
  const boosted={...base,[c.boost]:c.boost==='terrain'?c.value:true};
  const normal=await page.evaluate(a=>window.ChlohaDamageEngine.calculate(a),base);
  const enhanced=await page.evaluate(a=>window.ChlohaDamageEngine.calculate(a),boosted);
  const powerBoost=Math.floor(move.power*c.multiplier);
  assert.equal(normal.effectivePower,move.power,c.mechanic+' base power');
  assert.equal(enhanced.effectivePower,powerBoost,c.mechanic+' enhanced power');
  for(const [label,result,power] of [['normal',normal,move.power],['enhanced',enhanced,powerBoost]]){
   const damageBase=Math.floor(Math.floor(Math.floor((Math.floor(2*50/5)+2)*power*150/100)/50)+2);
   const expected=Array.from({length:16},(_,i)=>Math.max(1,Math.floor(damageBase*(85+i)/100)));
   assert.deepEqual(result.rolls,expected,c.mechanic+' '+label+' independent 16-roll formula');
  }
  console.log('PASS independent 16 rolls',move.name,c.mechanic,move.power,'→',powerBoost);
 }
}finally{await browser.close();}
