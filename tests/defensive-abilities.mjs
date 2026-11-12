import {chromium} from '@playwright/test';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage();
 await page.goto('file://'+resolve(root,'index.html'));
 await page.waitForFunction(()=>Boolean(window.ChlohaDamageEngine?.calculate));
 const results=await page.evaluate(()=>{
  const calc=window.ChlohaDamageEngine.calculate;
  const base={level:50,power:100,attack:150,defense:100,hp:200,currentHp:200,attackStage:0,defenseStage:0,moveType:'ノーマル',category:'physical',attTypes:['ノーマル'],defTypes:['ノーマル'],attItem:'none',attAbility:'none',defItem:'none',defAbility:'none',attCurrentHp:200,attMaxHp:200,moveId:'',customMultiplier:1,attGrounding:'auto',defGrounding:'auto',terrain:'none',weather:'none',spread:'single',battleFormat:'doubles',screen:'none',helpingHand:false,friendGuardCount:0,burn:false,critical:false,stabMode:'auto',moveMechanic:'none',conditionalPower:false,bodyPressDefenseStage:0,foulPlayTargetStage:0,attSpeed:100,defSpeed:100,attSpeedStage:0,defSpeedStage:0,attParalyzed:false,defParalyzed:false,attTailwind:false,defTailwind:false};
  const rolls=o=>calc({...base,...o}).rolls;
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  return [
   ['Fur Coat physical doubles defense',same(rolls({defAbility:'furCoat'}),rolls({defense:200}))],
   ['Fur Coat special unchanged',same(rolls({defAbility:'furCoat',category:'special'}),rolls({category:'special'}))],
   ['Ice Scales physical unchanged',same(rolls({defAbility:'iceScales'}),rolls({}))],
   ['Ice Scales special reduces damage',rolls({defAbility:'iceScales',category:'special'}).every((n,i)=>n<=rolls({category:'special'})[i])],
   ['Multiscale full HP reduces damage',rolls({defAbility:'multiscale'}).every((n,i)=>n<=rolls({})[i])],
   ['Multiscale damaged HP unchanged',same(rolls({defAbility:'multiscale',currentHp:199}),rolls({currentHp:199}))],
   ['Heatproof halves Fire damage',rolls({defAbility:'heatproof',moveType:'ほのお'}).every((n,i)=>n<=rolls({moveType:'ほのお'})[i])],
   ['Heatproof non-Fire unchanged',same(rolls({defAbility:'heatproof'}),rolls({}))],
   ['Water Bubble halves Fire damage',rolls({defAbility:'waterBubble',moveType:'ほのお'}).every((n,i)=>n<=rolls({moveType:'ほのお'})[i])],
   ['Water Bubble non-Fire unchanged',same(rolls({defAbility:'waterBubble'}),rolls({}))],
   ['Prism Armor reduces super effective',rolls({defAbility:'prismArmor',moveType:'かくとう',defTypes:['ノーマル']}).every((n,i)=>n<=rolls({moveType:'かくとう',defTypes:['ノーマル']})[i])],
   ['Prism Armor neutral unchanged',same(rolls({defAbility:'prismArmor'}),rolls({}))],
   ['Shadow Shield full HP reduces damage',rolls({defAbility:'shadowShield'}).every((n,i)=>n<=rolls({})[i])],
   ['Shadow Shield damaged HP unchanged',same(rolls({defAbility:'shadowShield',currentHp:199}),rolls({currentHp:199}))],
   ['Punk Rock halves registered sound move',rolls({defAbility:'punkRock',moveId:'hyperVoice',category:'special'}).every((n,i)=>n<rolls({moveId:'hyperVoice',category:'special'})[i])],
   ['Punk Rock ignores non-sound moves',same(rolls({defAbility:'punkRock',moveId:'tackle'}),rolls({moveId:'tackle'}))],
   ['Punk Rock halves registered sound move even physical category',rolls({defAbility:'punkRock',moveId:'bugBuzz'}).every((n,i)=>n<rolls({moveId:'bugBuzz'})[i])],
   ['Fluffy halves contact moves',rolls({defAbility:'fluffy',moveId:'closeCombat'}).every((n,i)=>n<rolls({moveId:'closeCombat'})[i])],
   ['Fluffy does not reduce non-contact moves',same(rolls({defAbility:'fluffy',moveId:'earthquake'}),rolls({moveId:'earthquake'}))],
   ['Fluffy doubles Fire damage',rolls({defAbility:'fluffy',moveId:'flamethrower',moveType:'ほのお',category:'special'}).every((n,i)=>n>rolls({moveId:'flamethrower',moveType:'ほのお',category:'special'})[i])],
   ['Fluffy contact Fire multipliers approximately cancel (rounding allowed)',rolls({defAbility:'fluffy',moveId:'flareBlitz',moveType:'ほのお'}).every((n,i)=>Math.abs(n-rolls({moveId:'flareBlitz',moveType:'ほのお'})[i])<=2)],
   ['Aura Guard halves contact moves',rolls({defAbility:'auraGuard',moveId:'closeCombat'}).every((n,i)=>n<rolls({moveId:'closeCombat'})[i])],
   ['Aura Guard does not reduce non-contact moves',same(rolls({defAbility:'auraGuard',moveId:'earthquake'}),rolls({moveId:'earthquake'}))],
   ['Aura Guard does not double Fire damage',same(rolls({defAbility:'auraGuard',moveId:'flamethrower',moveType:'ほのお',category:'special'}),rolls({moveId:'flamethrower',moveType:'ほのお',category:'special'}))],
   ['Bulletproof blocks Aura Sphere',rolls({defAbility:'bulletproof',moveId:'auraSphere',category:'special'}).every(n=>n===0)],
   ['Bulletproof does not block Hyper Voice',same(rolls({defAbility:'bulletproof',moveId:'hyperVoice',category:'special'}),rolls({moveId:'hyperVoice',category:'special'}))],
   ['Soundproof blocks Hyper Voice',rolls({defAbility:'soundproof',moveId:'hyperVoice',category:'special'}).every(n=>n===0)],
   ['Soundproof does not block Aura Sphere',same(rolls({defAbility:'soundproof',moveId:'auraSphere',category:'special'}),rolls({moveId:'auraSphere',category:'special'}))],
   ['Overcoat does not reduce direct attack damage',same(rolls({defAbility:'overcoat',moveId:'earthquake'}),rolls({moveId:'earthquake'}))]
  ];
 });
 for(const [name,ok] of results)console.log((ok?'PASS':'FAIL')+' '+name);
 if(results.some(([,ok])=>!ok))process.exitCode=1;
}finally{await browser.close();}
