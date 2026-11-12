// v0.177: ensure the shared move-readiness gate is consistent with visible labels.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.waitForFunction(()=>document.querySelector('#dbMove')?.options.length>0);
  const result=await page.evaluate(()=>{
   const choices=[...document.querySelector('#dbMove').options];
   const source=ChlohaMovesDB.moves;
   const policy=ChlohaMovePolicy;
   const byId=new Map(source.map(m=>[m.id,m]));
   return {total:choices.length,entries:choices.map(o=>{
    const m=byId.get(o.value),p=policy[o.value];
    const ready=moveCalculationReady(m);
    return {name:o.textContent,ready};
   })};
  });
  assert.ok(result.total>50,'move catalog loaded');
  for(const e of result.entries){
   assert.equal(e.name.includes('［計算未対応］'),!e.ready,'move selector label: '+e.name);
  }
  console.log('PASS v0.177 move readiness selector consistency',result.total);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
