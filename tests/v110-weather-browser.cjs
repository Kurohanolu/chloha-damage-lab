'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {startLab,launchBrowser,ready,mockFeedback}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant','es-LA'];
const setters={drizzle:'rain',drought:'sun',sandStream:'sand',snowWarning:'snow'};
const names={drizzle:'あめふらし',drought:'ひでり',sandStream:'すなおこし',snowWarning:'ゆきふらし'};
const set=(page,id,value)=>page.locator('#'+id).evaluate((node,value)=>{node.value=value;if(node.value!==value)throw Error('Unavailable '+node.id+'='+value);node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}));},value);
const snap=page=>page.evaluate(()=>({a:ChlohaLastCalculation.a,r:JSON.parse(JSON.stringify(ChlohaLastCalculation.r)),ability:document.getElementById('defAbility').value,weather:document.getElementById('weather').value}));
(async()=>{const lab=await startLab(),browser=await launchBrowser(),report={passed:false,cases:[],errors:[],locales,widths:[320,390]};
 try{for(const width of report.widths){const ctx=await browser.newContext({viewport:{width,height:900},isMobile:true,hasTouch:true}),page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(e.message));await mockFeedback(ctx,lab.origin);await page.goto(lab.origin+'/candidate/');await ready(page);
  const roster=await page.evaluate(()=>ChlohaPokemonDB.pokemon),moves=await page.evaluate(()=>ChlohaMovesDB.moves),spout=moves.find(m=>m.name==='しおふき');assert.ok(spout);
  await set(page,'dbAttPokemon','garchomp');await set(page,'dbMove',spout.id);await set(page,'attAbility','none');
  const snow=roster.filter(p=>p.abilities.includes('ゆきふらし'));assert.equal(snow.length,6);
  const cases=Object.keys(setters).map(ability=>({ability,p:roster.find(p=>p.abilities.includes(names[ability]))}));
  for(const name of ['メガバンギラス','カバルドン']){const p=roster.find(p=>p.name===name);assert.ok(p&&p.abilities.includes('すなおこし'),'Reported sand reproduction species '+name);if(!cases.some(c=>c.p.id===p.id))cases.push({ability:'sandStream',p});}
  for(const p of snow)if(!cases.some(c=>c.p.id===p.id&&c.ability==='snowWarning'))cases.push({ability:'snowWarning',p});
  for(const {ability,p} of cases){assert.ok(p);await set(page,'dbDefPokemon',p.id);await set(page,'defAbility',ability);await set(page,'weather','none');const before=await snap(page);assert.ok(before.r);assert.equal(before.r.rolls.length,16);assert.equal(before.ability,ability);
   const expected=await page.evaluate(weather=>ChlohaDamageEngine.calculate({...ChlohaLastCalculation.a,defAbility:'none',weather}).rolls,setters[ability]);assert.deepEqual(before.r.rolls,expected,'Setter equals explicit weather '+p.name);
   for(const locale of locales){await page.locator('#chloha-locale').selectOption(locale);await page.evaluate(()=>new Promise(requestAnimationFrame));assert.deepEqual(await snap(page),before,'Locale cannot change input/16 rolls '+locale+'/'+p.name);
    const label=await page.locator('#defAbility option:checked').textContent();assert.ok(label.trim());if(locale==='ja')assert.ok(label.includes(names[ability]));else assert.doesNotMatch(label,/[\u3040-\u30ff]/u);
    assert.equal(await page.evaluate(()=>ChlohaPersistence.save()),true);await page.reload();await ready(page);assert.equal(await page.locator('#chloha-locale').inputValue(),locale);assert.deepEqual(await snap(page),before,'Reload preserves inferred weather '+locale+'/'+p.name);assert.ok((await page.locator('#damage').textContent()).trim());assert.ok((await page.locator('#koVerdict').textContent()).trim());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile page fits '+width);report.cases.push({width,locale,species:p.id,ability,rolls:before.r.rolls});
   }
   await set(page,'weather','rain');const manual=await snap(page);await page.evaluate(()=>ChlohaPersistence.save());await page.reload();await ready(page);assert.deepEqual(await snap(page),manual,'Explicit override survives reload');assert.equal(manual.weather,'rain');
  }
  await page.locator('#chloha-locale').selectOption('ja');await set(page,'dbDefPokemon','roster_v0104_026');assert.ok(await page.locator('#defAbility option[value="snowWarning"]').count());await set(page,'dbDefPokemon','roster_v0105_011');assert.equal(await page.locator('#defAbility option[value="snowWarning"]').count(),0,'Normal Froslass never inherits Mega Snow Warning');assert.notEqual(await page.locator('#defAbility').inputValue(),'snowWarning');assert.ok((await snap(page)).r);await ctx.close();
 }assert.deepEqual(report.errors,[]);report.passed=true;console.log('PASS weather browser '+report.cases.length+' locale/reload/mobile cases');}
 finally{fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/weather-browser.json',JSON.stringify(report,null,2)+'\n');await browser.close();await lab.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
