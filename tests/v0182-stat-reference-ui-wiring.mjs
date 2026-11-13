import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto('file://'+resolve(root,'index.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>document.querySelector('#dbMove')?.options.length>0);
 const result=await page.evaluate(()=>{
  const $=id=>document.getElementById(id);
  const set=(id,value)=>{const el=$(id);el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));};
  const out=[];
  for(const [name,mechanic] of [['ボディプレス','bodyPress'],['イカサマ','foulPlay'],['サイコショック','psyshock'],['こおりのいぶき','forcedCritical'],['トリックフラワー','forcedCritical']]){
   const option=[...$('dbMove').options].find(o=>o.textContent.includes(name));
   if(!option){out.push({name,missing:true});continue;}
   set('dbMove',option.value);
   const first=window.ChlohaLastCalculation;
   const record={name,mechanic,selected:window.ChlohaMoveMechanic,hidden:$('output').hidden,error:$('error').textContent,first:first?{a:first.a,r:first.r}:null};
   if(mechanic==='bodyPress'||mechanic==='foulPlay'){
    set('attackStage',-2);
    const minus=window.ChlohaLastCalculation;
    set('attackStage',2);
    const plus=window.ChlohaLastCalculation;
    record.minus=minus?{a:minus.a,r:minus.r}:null;
    record.plus=plus?{a:plus.a,r:plus.r}:null;
    set('attackStage',0);
   }
   out.push(record);
  }
  return out;
 });
 for(const r of result){
  assert.equal(r.missing,undefined,'missing move '+r.name);
  assert.equal(r.selected,r.mechanic,r.name+' mechanic wiring');
  assert.equal(r.hidden,false,r.name+' must render: '+r.error);
  assert.ok(r.first?.r?.rolls?.length===16,r.name+' must calculate 16 rolls');
  if(r.mechanic==='bodyPress'||r.mechanic==='foulPlay'){
   assert.equal(r.minus?.a?.attackStage,-2,r.name+' stage -2 input');
   assert.equal(r.plus?.a?.attackStage,2,r.name+' stage +2 input');
   assert.equal(r.minus?.a?.[r.mechanic==='bodyPress'?'bodyPressDefenseStage':'foulPlayTargetStage'],-2,r.name+' reference stage -2');
   assert.equal(r.plus?.a?.[r.mechanic==='bodyPress'?'bodyPressDefenseStage':'foulPlayTargetStage'],2,r.name+' reference stage +2');
   assert.ok(Math.max(...r.minus.r.rolls)<Math.min(...r.plus.r.rolls),r.name+' stage must change damage');
  }
  if(r.mechanic==='forcedCritical')assert.equal(r.first.a.moveMechanic,'forcedCritical');
  console.log('PASS UI move wiring '+r.name);
 }
}finally{await browser.close();}
