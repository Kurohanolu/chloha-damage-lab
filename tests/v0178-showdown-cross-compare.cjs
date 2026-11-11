// Cross-implementation comparison: Chloha vs @smogon/calc (Showdown engine).
// A mismatch is reported, not automatically treated as Champions game parity.
const {chromium}=require('playwright');
const {calculate,Generations,Pokemon,Move,Field}=require('@smogon/calc');
const fs=require('node:fs');
const path=require('node:path');
const gen=Generations.get(9);
const rows=[];
const normalize=d=>Array.isArray(d)?d.flat(Infinity).map(Number).sort((a,b)=>a-b):[Number(d)];
const base={level:50,attackStage:0,defenseStage:0,weather:'none',terrain:'none',
 battleFormat:'singles',spread:'single',critical:false,burn:false,screen:'none',
 attAbility:'none',defAbility:'none',attItem:'none',defItem:'none',friendGuardCount:0,
 helpingHand:false,customMultiplier:1,stabMode:'auto',attGrounding:'grounded',
 defGrounding:'grounded',moveMechanic:'none'};
const seedCases=[
 {id:'flamethrower-neutral',att:'Charizard',def:'Venusaur',move:'Flamethrower',power:90,type:'ほのお',category:'special',attTypes:['ほのお','ひこう'],defTypes:['くさ','どく'],attack:129,defense:120},
 {id:'flamethrower-sun',att:'Charizard',def:'Venusaur',move:'Flamethrower',power:90,type:'ほのお',category:'special',attTypes:['ほのお','ひこう'],defTypes:['くさ','どく'],attack:129,defense:120,weather:'sun'},
 {id:'flamethrower-rain',att:'Charizard',def:'Venusaur',move:'Flamethrower',power:90,type:'ほのお',category:'special',attTypes:['ほのお','ひこう'],defTypes:['くさ','どく'],attack:129,defense:120,weather:'rain'},
 {id:'expanding-force-no-terrain',att:'Alakazam',def:'Venusaur',move:'Expanding Force',power:80,type:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['くさ','どく'],attack:155,defense:120,moveMechanic:'expandingForce',battleFormat:'doubles'},
 {id:'expanding-force-psychic-spread',att:'Alakazam',def:'Venusaur',move:'Expanding Force',power:80,type:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['くさ','どく'],attack:155,defense:120,moveMechanic:'expandingForce',battleFormat:'doubles',terrain:'psychic',spread:'spread'},
 {id:'expanding-force-psychic-single',att:'Alakazam',def:'Venusaur',move:'Expanding Force',power:80,type:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['くさ','どく'],attack:155,defense:120,moveMechanic:'expandingForce',battleFormat:'singles',terrain:'psychic'}
];
// Expand to 54 distinct cross-engine scenarios while retaining the six reviewed seeds.
// Each variant is an independent comparison, never a self-referential oracle.
const cases=[...seedCases];
for(const weather of ['none','sun','rain']){
 for(const crit of [false,true]){
  for(const lifeOrb of [false,true]){
   for(const helpingHand of [false,true]){
    cases.push({...seedCases[0],id:'flame-'+weather+'-crit'+Number(crit)+'-orb'+Number(lifeOrb)+'-help'+Number(helpingHand),
     weather,critical:crit,attItem:lifeOrb?'lifeOrb':'none',helpingHand});
   }
  }
 }
}
for(const terrain of ['none','psychic']){
 for(const format of ['singles','doubles']){
  for(const crit of [false,true]){
   for(const lifeOrb of [false,true]){
    for(const helpingHand of (format==='singles'?[false]:[false,true])){
     cases.push({...seedCases[3],id:'expanding-'+terrain+'-'+format+'-crit'+Number(crit)+'-orb'+Number(lifeOrb)+'-help'+Number(helpingHand),
      terrain,battleFormat:format,spread:terrain==='psychic'&&format==='doubles'?'spread':'single',
      critical:crit,attItem:lifeOrb?'lifeOrb':'none',helpingHand});
    }
   }
  }
 }
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#attStats .stat-row').first().waitFor();
  for(const c of cases){
   const chloha=await page.evaluate(({base,c})=>{
    const a={...window.ChlohaLastCalculation.a,...base,level:50,attack:c.attack,defense:c.defense,
      power:c.power,moveType:c.type,category:c.category,attTypes:c.attTypes,
      defTypes:c.defTypes,moveMechanic:c.moveMechanic||'none',weather:c.weather||'none',
      terrain:c.terrain||'none',battleFormat:c.battleFormat||'singles',spread:c.spread||'single',critical:!!c.critical,helpingHand:!!c.helpingHand,attItem:c.attItem||'none'};
    return window.ChlohaDamageEngine.calculate(a).rolls;
   },{base,c});
   const attacker=new Pokemon(gen,c.att,{level:50,evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0},nature:'Hardy',item:c.attItem==='lifeOrb'?'Life Orb':undefined});
   const defender=new Pokemon(gen,c.def,{level:50,evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0},nature:'Hardy'});
   const move=new Move(gen,c.move,{isCrit:!!c.critical});
   const field=new Field({gameType:c.battleFormat==='doubles'?'Doubles':'Singles',
    weather:c.weather==='sun'?'Sun':c.weather==='rain'?'Rain':undefined,
    terrain:c.terrain==='psychic'?'Psychic':undefined,
    attackerSide:{isHelpingHand:!!c.helpingHand}});
   const showdown=normalize(calculate(gen,attacker,defender,move,field).damage);
   const actual=normalize(chloha);
   const same=JSON.stringify(actual)===JSON.stringify(showdown);
   const row={case:c.id,comparison:'Showdown Gen9 reference (Champions parity unverified)',match:same,
    chloha:[Math.min(...actual),Math.max(...actual)],showdown:[Math.min(...showdown),Math.max(...showdown)],
    chlohaRolls:actual,showdownRolls:showdown};
   rows.push(row);
   console.log((same?'MATCH ':'DIFF ')+JSON.stringify(row));
  }
  const out=path.resolve(__dirname,'../cross-calculator-report.json');
  fs.writeFileSync(out,JSON.stringify({source:'@smogon/calc Gen9; not Champions game oracle',cases:rows},null,2));
  if(rows.some(x=>!x.match))console.log('REVIEW_REQUIRED: discrepancies must be investigated; no automatic game-parity claim');
  console.log('SUMMARY '+JSON.stringify({total:rows.length,matches:rows.filter(x=>x.match).length,differences:rows.filter(x=>!x.match).length}));
  console.log('PASS cross-calculator comparison completed',rows.length,'cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
