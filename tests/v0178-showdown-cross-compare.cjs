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
const cases=[
 {id:'flamethrower-neutral',att:'Charizard',def:'Venusaur',move:'Flamethrower',power:90,type:'ほのお',category:'special',attTypes:['ほのお','ひこう'],defTypes:['くさ','どく'],attack:129,defense:120},
 {id:'flamethrower-sun',att:'Charizard',def:'Venusaur',move:'Flamethrower',power:90,type:'ほのお',category:'special',attTypes:['ほのお','ひこう'],defTypes:['くさ','どく'],attack:129,defense:120,weather:'sun'},
 {id:'flamethrower-rain',att:'Charizard',def:'Venusaur',move:'Flamethrower',power:90,type:'ほのお',category:'special',attTypes:['ほのお','ひこう'],defTypes:['くさ','どく'],attack:129,defense:120,weather:'rain'},
 {id:'expanding-force-no-terrain',att:'Alakazam',def:'Venusaur',move:'Expanding Force',power:80,type:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['くさ','どく'],attack:155,defense:120,moveMechanic:'expandingForce',battleFormat:'doubles'},
 {id:'expanding-force-psychic-spread',att:'Alakazam',def:'Venusaur',move:'Expanding Force',power:80,type:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['くさ','どく'],attack:155,defense:120,moveMechanic:'expandingForce',battleFormat:'doubles',terrain:'psychic',spread:'spread'},
 {id:'expanding-force-psychic-single',att:'Alakazam',def:'Venusaur',move:'Expanding Force',power:80,type:'エスパー',category:'special',attTypes:['エスパー'],defTypes:['くさ','どく'],attack:155,defense:120,moveMechanic:'expandingForce',battleFormat:'singles',terrain:'psychic'}
];
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
      terrain:c.terrain||'none',battleFormat:c.battleFormat||'singles',spread:c.spread||'single'};
    return window.ChlohaDamageEngine.calculate(a).rolls;
   },{base,c});
   const attacker=new Pokemon(gen,c.att,{level:50,evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0},nature:'Hardy'});
   const defender=new Pokemon(gen,c.def,{level:50,evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0},nature:'Hardy'});
   const move=new Move(gen,c.move,{isCrit:false});
   const field=new Field({gameType:c.battleFormat==='doubles'?'Doubles':'Singles',
    weather:c.weather==='sun'?'Sun':c.weather==='rain'?'Rain':undefined,
    terrain:c.terrain==='psychic'?'Psychic':undefined});
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
  console.log('PASS cross-calculator comparison completed',rows.length,'cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
