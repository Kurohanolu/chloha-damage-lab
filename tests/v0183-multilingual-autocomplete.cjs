'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  const move=page.locator('#moveSearch');
  const moveResults=page.locator('#moveSuggestions [role="option"]');
  await move.fill('Erdbeben');
  assert.ok((await moveResults.allTextContents()).some(t=>t.includes('じしん')),'German query must find Earthquake in Japanese UI');
  await move.fill('지진');
  assert.ok((await moveResults.count())>0,'Korean move query must match');
  await move.fill('地震');
  assert.ok((await moveResults.count())>0,'Chinese move query must match');
  const pokemon=page.locator('#attSearch');
  const pokemonResults=page.locator('#attSuggestions [role="option"]');
  await pokemon.fill('Dracolosse');
  assert.ok((await pokemonResults.count())>0,'French Dragonite query must match');
  await pokemon.fill('망나뇽');
  assert.ok((await pokemonResults.count())>0,'Korean Dragonite query must match');
  // The existing language selector is bilingual until the nine-language UI control lands.
  await page.locator('#chloha-locale').selectOption('en');
  await move.fill('Erdbeben');
  assert.ok((await moveResults.allTextContents()).some(t=>t.includes('Earthquake')),'English UI label should remain English');
  console.log('PASS v0.183 multilingual autocomplete Pokémon and moves');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
