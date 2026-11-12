import {chromium} from '@playwright/test';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
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
   ['Overcoat does not reduce direct attack damage',same(rolls({defAbility:'overcoat',moveId:'earthquake'}),rolls({moveId:'earthquake'}))],
   ['Defender Unaware ignores attacker +2',same(rolls({defAbility:'unaware',attackStage:2}),rolls({attackStage:0}))],
   ['Defender Unaware ignores attacker -2',same(rolls({defAbility:'unaware',attackStage:-2}),rolls({attackStage:0}))],
   ['Attacker Unaware ignores defender +2',same(rolls({attAbility:'unaware',defenseStage:2}),rolls({defenseStage:0}))],
   ['Attacker Unaware ignores defender -2',same(rolls({attAbility:'unaware',defenseStage:-2}),rolls({defenseStage:0}))],
   ['Clear Body does not erase pre-existing defense stages',same(rolls({defAbility:'clearBody',defenseStage:-1}),rolls({defenseStage:-1}))],
   ['Friend Guard reduces incoming damage',rolls({friendGuardCount:1}).every((n,i)=>n<rolls({})[i])],
   ['Friend Guard and Reflect stack',rolls({friendGuardCount:1,screen:'reflect'}).every((n,i)=>n<=rolls({screen:'reflect'})[i])],
   ['Wonder Guard blocks neutral',rolls({defAbility:'wonderGuard'}).every(n=>n===0)],
   ['Wonder Guard allows super effective',same(rolls({defAbility:'wonderGuard',moveType:'かくとう',defTypes:['ノーマル']}),rolls({moveType:'かくとう',defTypes:['ノーマル']}))],
   ['Wonder Guard blocks resisted',rolls({defAbility:'wonderGuard',moveType:'ほのお',defTypes:['みず']}).every(n=>n===0)],
   ['Wonder Guard allows dual-type net super effective',same(rolls({defAbility:'wonderGuard',moveType:'ほのお',defTypes:['くさ','はがね']}),rolls({moveType:'ほのお',defTypes:['くさ','はがね']}))],
   ['Dry Skin absorbs Water',rolls({defAbility:'drySkin',moveType:'みず'}).every(n=>n===0)],
   ['Dry Skin boosts Fire damage',rolls({defAbility:'drySkin',moveType:'ほのお'}).every((n,i)=>n>rolls({moveType:'ほのお'})[i])],
   ['Dry Skin neutral damage unchanged',same(rolls({defAbility:'drySkin'}),rolls({}))],
   ['Levitate blocks Ground',rolls({defAbility:'levitate',moveType:'じめん'}).every(n=>n===0)],
   ['Water Absorb blocks Water',rolls({defAbility:'waterAbsorb',moveType:'みず'}).every(n=>n===0)],
   ['Volt Absorb blocks Electric',rolls({defAbility:'voltAbsorb',moveType:'でんき'}).every(n=>n===0)],
   ['Sap Sipper blocks Grass',rolls({defAbility:'sapSipper',moveType:'くさ'}).every(n=>n===0)],
   ['Lightning Rod blocks Electric',rolls({defAbility:'lightningRod',moveType:'でんき'}).every(n=>n===0)],
   ['Motor Drive blocks Electric',rolls({defAbility:'motorDrive',moveType:'でんき'}).every(n=>n===0)],
   ['Storm Drain blocks Water',rolls({defAbility:'stormDrain',moveType:'みず'}).every(n=>n===0)],
   ['Earth Eater blocks Ground',rolls({defAbility:'earthEater',moveType:'じめん'}).every(n=>n===0)],
   ['Well-Baked Body blocks Fire',rolls({defAbility:'wellBakedBody',moveType:'ほのお'}).every(n=>n===0)],
   ['Sap Sipper leaves Fire unchanged',same(rolls({defAbility:'sapSipper',moveType:'ほのお'}),rolls({moveType:'ほのお'}))],
   ['Motor Drive leaves Water unchanged',same(rolls({defAbility:'motorDrive',moveType:'みず'}),rolls({moveType:'みず'}))],
   ['Grass Pelt boosts defense on Grassy Terrain',rolls({defAbility:'grassPelt',terrain:'grassy'}).every((v,i)=>v<rolls({terrain:'grassy'})[i])],
   ['Grass Pelt inactive without terrain',same(rolls({defAbility:'grassPelt'}),rolls({}))],
   ['Marvel Scale boosts defense with burn',rolls({defAbility:'marvelScale',defStatus:'burn'}).every((v,i)=>v<rolls({})[i])],
   ['Marvel Scale boosts defense with paralysis',rolls({defAbility:'marvelScale',defStatus:'paralysis'}).every((v,i)=>v<rolls({})[i])],
   ['Marvel Scale inactive without status',same(rolls({defAbility:'marvelScale',defStatus:'none'}),rolls({}))],
   ['Marvel Scale inactive without specified status',same(rolls({defAbility:'marvelScale'}),rolls({}))],
   ['Intimidate lowers physical attack one stage',same(rolls({defAbility:'intimidate'}),rolls({attackStage:-1}))],
   ['Intimidate stacks with existing attack stage',same(rolls({defAbility:'intimidate',attackStage:2}),rolls({attackStage:1}))],
   ['Intimidate does not alter special damage',same(rolls({defAbility:'intimidate',category:'special'}),rolls({category:'special'}))],
   ['Intimidate does not lower Body Press',same(rolls({defAbility:'intimidate',moveMechanic:'bodyPress'}),rolls({moveMechanic:'bodyPress'}))],
   ['Intimidate does not lower Foul Play',same(rolls({defAbility:'intimidate',moveMechanic:'foulPlay'}),rolls({moveMechanic:'foulPlay'}))],
   ['Critical hit ignores Intimidate negative stage',same(rolls({defAbility:'intimidate',critical:true}),rolls({critical:true}))],
   ['Yache Berry halves super-effective Ice',rolls({defItem:'yacheBerry',moveType:'こおり',defTypes:['ドラゴン']}).every((v,i)=>v<rolls({moveType:'こおり',defTypes:['ドラゴン']})[i])],
   ['Yache Berry inactive on neutral Ice',same(rolls({defItem:'yacheBerry',moveType:'こおり',defTypes:['ほのお']}),rolls({moveType:'こおり',defTypes:['ほのお']}))],
   ['Shuca Berry halves super-effective Ground',rolls({defItem:'shucaBerry',moveType:'じめん',defTypes:['ほのお']}).every((v,i)=>v<rolls({moveType:'じめん',defTypes:['ほのお']})[i])],
   ['Resist Berry does not activate on mismatched type',same(rolls({defItem:'yacheBerry',moveType:'ほのお',defTypes:['くさ']}),rolls({moveType:'ほのお',defTypes:['くさ']}))],
   ['Chilan Berry halves neutral Normal',rolls({defItem:'chilanBerry',moveType:'ノーマル',defTypes:['ほのお']}).every((v,i)=>v<rolls({moveType:'ノーマル',defTypes:['ほのお']})[i])],
   ['Chilan Berry does not halve Ghost immunity',rolls({defItem:'chilanBerry',moveType:'ノーマル',defTypes:['ゴースト']}).every(v=>v===0)],
   ['Purifying Salt halves Ghost damage',rolls({defAbility:'purifyingSalt',moveType:'ゴースト',defTypes:['ほのお']}).every((v,i)=>v<rolls({moveType:'ゴースト',defTypes:['ほのお']})[i])],
   ['Purifying Salt leaves non-Ghost damage unchanged',same(rolls({defAbility:'purifyingSalt',moveType:'ほのお'}),rolls({moveType:'ほのお'}))],
   ['Shell Armor prevents critical damage',same(rolls({defAbility:'shellArmor',critical:true}),rolls({critical:false}))],
   ['Battle Armor prevents critical damage',same(rolls({defAbility:'battleArmor',critical:true}),rolls({critical:false}))],
   ['Shell Armor critical prevention preserves stage drops',same(rolls({defAbility:'shellArmor',critical:true,attackStage:-2}),rolls({critical:false,attackStage:-2}))],
   ['Battle Armor critical prevention preserves screen reduction',same(rolls({defAbility:'battleArmor',critical:true,screen:'reflect'}),rolls({critical:false,screen:'reflect'}))]
  ];
 });
 // Audit all 18 defensive resist berries and bilingual select rendering.
 const berryNames={chilanBerry:'Chilan Berry',occaBerry:'Occa Berry',passhoBerry:'Passho Berry',wacanBerry:'Wacan Berry',rindoBerry:'Rindo Berry',yacheBerry:'Yache Berry',chopleBerry:'Chople Berry',kebiaBerry:'Kebia Berry',shucaBerry:'Shuca Berry',cobaBerry:'Coba Berry',payapaBerry:'Payapa Berry',tangaBerry:'Tanga Berry',chartiBerry:'Charti Berry',kasibBerry:'Kasib Berry',habanBerry:'Haban Berry',colburBerry:'Colbur Berry',babiriBerry:'Babiri Berry',roseliBerry:'Roseli Berry'};
 const berryOptions=page.locator('#defItem option');
 const originalBerries=await page.evaluate(()=>[...document.querySelectorAll('#defItem option')].filter(o=>o.value.endsWith('Berry')).map(o=>({id:o.value,label:o.textContent})));
 assert.equal(originalBerries.length,18,'Expected all 18 resist berries in defender item select');
 assert.deepEqual(originalBerries.map(o=>o.id).sort(),Object.keys(berryNames).sort(),'Defender berry option IDs');
 await page.locator('#chloha-locale').selectOption('en');
 for(const [id,name] of Object.entries(berryNames)){
  const label=await page.locator('#defItem option[value="'+id+'"]').textContent();
  assert.ok(label.startsWith(name+' ('),'Missing translated berry: '+id+' / '+label);
  assert.ok(label.includes('damage ×0.5'),'Missing English berry effect: '+id);
 }
 await page.locator('#chloha-locale').selectOption('ja');
 const restoredBerries=await page.evaluate(()=>[...document.querySelectorAll('#defItem option')].filter(o=>o.value.endsWith('Berry')).map(o=>({id:o.value,label:o.textContent})));
 assert.deepEqual(restoredBerries,originalBerries,'Resist berry JA/EN/JA roundtrip');
 console.log('PASS all 18 resist berry item labels and JA/EN/JA roundtrip');
 // Guard every supported defensive ability against missing English labels and stale JA/EN/JA options.
 const html=readFileSync(resolve(root,'index.html'),'utf8');
 const catalogSource=html.match(/const defensiveAbilities=(\{[^;]+\});/);
 assert.ok(catalogSource,'defensive ability catalog missing');
 const entries=[...catalogSource[1].matchAll(/'([^']+)':'([^']+)'/g)].map(([,ja,id])=>({ja,id}));
 assert.ok(entries.length>=40,'defensive ability catalog unexpectedly small');
 await page.evaluate(entries=>{
  const select=document.createElement('select');select.id='defAbilityTranslationAudit';
  for(const {ja,id} of entries){const option=document.createElement('option');option.value=id;option.textContent=ja+'（対応）';select.append(option);}
  document.getElementById('app').append(select);
 },entries);
 const labels=()=>page.locator('#defAbilityTranslationAudit option').allTextContents();
 const jaLabels=entries.map(({ja})=>ja+'（対応）');
 assert.deepEqual(await labels(),jaLabels,'Japanese defensive ability labels');
 await page.locator('#chloha-locale').selectOption('en');
 const englishLabels=await labels();
 const expected=await page.evaluate(entries=>entries.map(({ja})=>window.ChlohaNames?.abilities?.[ja]||null),entries);
 for(let i=0;i<entries.length;i++){
  assert.ok(expected[i] && !/[ぁ-んァ-ヶ一-龯]/.test(expected[i]),'Missing English translation: '+entries[i].ja);
  assert.equal(englishLabels[i],expected[i]+' (supported)','Incorrect English defensive ability label: '+entries[i].ja);
 }
 await page.locator('#chloha-locale').selectOption('ja');
 assert.deepEqual(await labels(),jaLabels,'Japanese defensive ability labels after locale roundtrip');
 console.log('PASS defensive ability translation coverage and JA/EN/JA roundtrip ('+entries.length+' abilities)');
 for(const [name,ok] of results)console.log((ok?'PASS':'FAIL')+' '+name);
 if(results.some(([,ok])=>!ok))process.exitCode=1;
}finally{await browser.close();}
