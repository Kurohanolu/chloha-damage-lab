// Browser audit: all 38 conservative catalog flags with explicit runtime policies.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const dbMatch=html.match(/const ChlohaMovesDB = (\{[^\n]+\});/);
const policyMatch=html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/);
assert.ok(dbMatch&&policyMatch);
const moves=JSON.parse(dbMatch[1]).moves,policies=JSON.parse(policyMatch[1]);
const excluded=new Set(['からげんき','はたきおとす','ワイドフォース','アクロバット']);
const candidates=moves.filter(m=>!m.calculationSupported&&!excluded.has(m.name)&&['physical','special'].includes(m.category)&&policies[m.id]?.standardDamageSupported===true&&!!policies[m.id]?.mechanic);
assert.equal(candidates.length,38,'38 runtime-policy moves under audit (including Spit Up)');
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('about:blank');await page.setContent(html,{waitUntil:'load'});
 await page.waitForFunction(()=>!!window.ChlohaDamageEngine?.calculate);
 const results=[];
 for(const m of candidates){
  const r=await page.evaluate(id=>{
   const sel=document.getElementById('dbMove');sel.value=id;
   sel.dispatchEvent(new Event('input',{bubbles:true}));
   sel.dispatchEvent(new Event('change',{bubbles:true}));
   const label=sel.selectedOptions[0]?.textContent||'';
   const status=document.getElementById('dbStatus')?.textContent||'';
   const mechanic=window.ChlohaMoveMechanic;
   const power=Number(document.getElementById('power')?.value);
   return {id:sel.value,label,status,mechanic,power};
  },m.id);
  assert.equal(r.id,m.id,m.name+' selection');
  assert.equal(r.mechanic,policies[m.id].mechanic,m.name+' mechanic wiring');
  assert.ok(!r.label.includes('［計算未対応］'),m.name+' false unsupported label');
  assert.ok(!r.status.includes('計算未対応'),m.name+' unsupported status');
  if(m.power>0)assert.equal(r.power,m.power,m.name+' base power');
  results.push({name:m.name,mechanic:r.mechanic,power:r.power,uiConnected:true});
 }
 console.log('PASS all 38 runtime-policy moves select and wire to engine',JSON.stringify(results));
}finally{await browser.close();}
