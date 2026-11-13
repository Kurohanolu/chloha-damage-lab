// Four catalog-disabled moves: verify the policy-to-engine contract and numerical power.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const match=html.match(/const ChlohaMovesDB = (\{[^\n]+\});/);
const policyMatch=html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/);
assert.ok(match&&policyMatch,'move database and policy exist');
const moves=JSON.parse(match[1]).moves,policies=JSON.parse(policyMatch[1]);
const cases=[
 {name:'からげんき',mechanic:'facade',id:'gw0169_p021',power:70,normal:70,boosted:140,flag:'conditionalPower'},
 {name:'はたきおとす',mechanic:'knockOff',id:'gw0170_u014',power:65,normal:65,boosted:97,flag:'conditionalPower'},
 {name:'ワイドフォース',mechanic:'expandingForce',id:'gw0170_u060',power:80,normal:80,boosted:120,flag:'terrain'},
 {name:'アクロバット',mechanic:'acrobatics',id:'v096_080',power:55,normal:55,boosted:110,flag:'attItem'}
];
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('about:blank');await page.setContent(html,{waitUntil:'load'});
 await page.waitForFunction(()=>!!window.ChlohaDamageEngine?.calculate);
 for(const c of cases){
  const move=moves.find(m=>m.id===c.id);
  assert.equal(move?.name,c.name);
  assert.equal(move.calculationSupported,false,'catalog flag remains conservative');
  assert.equal(policies[c.id]?.standardDamageSupported,true,'runtime policy explicitly supports damage');
  assert.equal(policies[c.id]?.mechanic,c.mechanic,'runtime policy routes to expected mechanic');
  const base={level:50,power:c.power,attack:150,defense:100,hp:200,currentHp:200,attCurrentHp:200,attMaxHp:200,attackStage:0,defenseStage:0,moveType:c.name==='ワイドフォース'?'エスパー':c.name==='はたきおとす'?'あく':c.name==='アクロバット'?'ひこう':'ノーマル',category:'physical',attTypes:['みず'],defTypes:['みず'],attItem:'lifeOrb',defItem:'none',attAbility:'none',defAbility:'none',terrain:'none',weather:'none',spread:'single',battleFormat:'singles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'auto',moveMechanic:c.mechanic,conditionalPower:false};
  if(c.name==='ワイドフォース')base.category='special';
  if(c.name==='アクロバット')base.attItem='lifeOrb';
  const regular=await page.evaluate(a=>window.ChlohaDamageEngine.calculate(a),base);
  const active={...base};
  if(c.flag==='conditionalPower')active.conditionalPower=true;
  if(c.flag==='terrain')active.terrain='psychic';
  if(c.flag==='attItem')active.attItem='none';
  const enhanced=await page.evaluate(a=>window.ChlohaDamageEngine.calculate(a),active);
  assert.equal(regular.effectivePower,c.normal,c.name+' normal power');
  assert.equal(enhanced.effectivePower,c.boosted,c.name+' enhanced power');
  assert.ok(Array.isArray(regular.rolls)&&regular.rolls.length===16,'normal 16 rolls');
  assert.ok(Array.isArray(enhanced.rolls)&&enhanced.rolls.length===16,'enhanced 16 rolls');
  assert.ok(enhanced.rolls[0]>regular.rolls[0],c.name+' enhanced damage');
  console.log('PASS policy and engine numeric',c.name,regular.effectivePower,'→',enhanced.effectivePower);
 }
}finally{await browser.close();}
