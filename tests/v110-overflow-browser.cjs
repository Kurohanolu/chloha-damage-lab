'use strict';
const assert = require('node:assert/strict');
const {startLab, launchBrowser, ready} = require('./helpers/v0188-browser-lab.cjs');
const witness = require('../docs/verification/v110-final-audit/ko-discriminator.json');
(async()=>{
 const lab = await startLab();
 const browser = await launchBrowser();
 try {
  const page = await browser.newPage();
  await page.goto(lab.origin+'/candidate/');
  await ready(page);
  const display = await page.evaluate(a=>{
   const el=id=>document.getElementById(id);
   const fields={...a,attType1:a.attTypes[0],attType2:a.attTypes[1],defType1:a.defTypes[0],defType2:a.defTypes[1]};
   for(const [key,value] of Object.entries(a.storedPowerBoosts))fields['storedPower_'+key]=value;
   for(const [key,value] of Object.entries(fields)){
    const control=el(key);
    if(!control || typeof value==='object')continue;
    if(control.type==='checkbox')control.checked=value;
    else control.value=value;
   }
   window.ChlohaMoveMechanic=a.moveMechanic;
   render();
   ChlohaUI.refresh();
   return {rolls:Array.from(el('rolls').children,n=>Number(n.textContent)),ko:el('ko').textContent,damage:el('damage').textContent,verdict:el('koSummary').dataset.outcome};
  },witness.input);
  assert.deepEqual(display.rolls,witness.expected);
  assert.match(display.damage,/57〜64839/);
  assert.match(display.ko,/93\.75%/);
  assert.equal(display.verdict,'possible');
  console.log(JSON.stringify(display));
 } finally {await browser.close();await lab.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
