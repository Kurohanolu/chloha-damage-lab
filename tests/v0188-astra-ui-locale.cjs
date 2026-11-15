'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const samples=[
 '攻撃側 攻撃能力ポイント','防御側 特防能力ポイント','HPの性格補正','特攻能力ポイントのスライダー',
 '攻撃側の6能力ポイント','防御側の6能力ポイント','攻撃側 攻撃 20ポイント。編集する',
 '攻撃側 H32/A32/S2','防御側 全て0','計算機の操作','攻撃側と防御側を入れ替える','天候・フィールド・壁をなしに戻す','計算結果の要約'
];
const source=process.argv.includes('--baseline')
 ?require('node:child_process').execFileSync('git',['show','4f068544e670a85a6a4d34dd2c26e2be66bd9cb7:i18n.js'],{cwd:require('node:path').resolve(__dirname,'..'),encoding:'utf8'})
 :fs.readFileSync(require.resolve('../i18n.js'),'utf8');
function translator(){
 const document={readyState:'loading',addEventListener(){},createTreeWalker(root){let i=0;return {nextNode:()=>root.texts[i++]||null};}};
 const scope={window:{},document,NodeFilter:{SHOW_TEXT:4},localStorage:{getItem:()=>null}};
 const anchor='function initialize(){';assert.equal(source.split(anchor).length,2);
 vm.runInNewContext(source.replace(anchor,'window.__audit={set(value){locale=value},text:localizedUi,aria:translateAccessibilityLabel,translate};'+anchor),scope);
 return scope.window.__audit;
}
function fixture(){
 const nodes=samples.map(text=>({attrs:{'aria-label':text},nodeType:1,closest:()=>null,hasAttribute(key){return key in this.attrs;},getAttribute(key){return this.attrs[key];},setAttribute(key,value){this.attrs[key]=value;}}));
 const root={nodeType:1,hasAttribute:()=>false,closest:()=>null,querySelectorAll:()=>nodes,texts:[]};
 root.texts=[{nodeValue:'能力ポイント 20 / 66（残り46） · Lv.50 / 個体値31',parentElement:root}];
 return {root,nodes};
}
const forbidden=/Attacker|Defender|nature modifier|actual stat|stat points|six stats|points\. Edit|Calculator navigation|Clear weather|remaining|Reset all to 0/;
// Exercise actual DOM translation caching and attribute updates, not just tables.
let transitions=0;
for(let start=0;start<locales.length;start++){
 const api=translator(),{root,nodes}=fixture();
 for(let offset=0;offset<=locales.length;offset++){
  const locale=locales[(start+offset)%locales.length];api.set(locale);api.translate(root);transitions++;
  const values=nodes.map(node=>node.attrs['aria-label']);
  if(locale==='ja'){assert.deepEqual(values,samples,'Japanese attributes restore exactly');assert.equal(root.texts[0].nodeValue,'能力ポイント 20 / 66（残り46） · Lv.50 / 個体値31');}
  if(locale!=='ja'&&locale!=='en')for(const text of [...values,root.texts[0].nodeValue]){
   assert.doesNotMatch(text,forbidden,locale+': English control leaked: '+text);
   assert.doesNotMatch(text,/[ぁ-ゖァ-ヺ]/u,locale+': Japanese control leaked: '+text);
  }
  assert.match(values[6],/20/,'dynamic edit preserves count');assert.match(values[7],/H32\/A32\/S2/,'preset allocation is unchanged');
  assert.match(root.texts[0].nodeValue,/20 \/ 66/,'budget total is unchanged');assert.match(root.texts[0].nodeValue,/46/,'remaining points unchanged');
 }
}
const api=translator();api.set('fr');
assert.equal(api.text('Attacker Attackstat points'),'Attaquant Attaque points de statistique');
assert.equal(api.text('HP nature modifier'),'PV modificateur de nature');
assert.equal(api.text('Stat points 20 / 66（remaining 46） · Lv.50 / IV31'),'Points 20 / 66 (restants 46) · Lv.50 / IV31');
assert.equal(api.text('Stat points 70 / 66（remaining -4） · Lv.50 / IV31'),'Points 70 / 66 (restants -4) · Lv.50 / IV31','over-budget value is retained');
{
 const {root,nodes}=fixture();api.translate(root);
 // A calculator rerender replaces translated attributes/text with fresh
 // Japanese values. The same elements must remain translatable after that.
 nodes[6].attrs['aria-label']='攻撃側 攻撃 32ポイント。編集する';
 root.texts[0].nodeValue='能力ポイント 70 / 66（残り-4） · Lv.50 / 個体値31';
 api.translate(root);
 assert.equal(nodes[6].attrs['aria-label'],'Attaquant Attaque 32 points. Modifier');
 assert.equal(root.texts[0].nodeValue,'Points 70 / 66 (restants -4) · Lv.50 / IV31');
 api.set('ja');api.translate(root);
 assert.equal(nodes[6].attrs['aria-label'],'攻撃側 攻撃 32ポイント。編集する');
 assert.equal(root.texts[0].nodeValue,'能力ポイント 70 / 66（残り-4） · Lv.50 / 個体値31');
}
for(const locale of locales.filter(x=>!['ja','en'].includes(x))){
 api.set(locale);
 for(const stat of ['HP','Attack','Defense','Sp. Atk','Sp. Def','Speed'])for(const kind of ['stat points','nature modifier','actual stat','stat points slider'])for(const role of ['','Attacker ','Defender ']){
  const text=api.text(role+stat+kind);assert.doesNotMatch(text,forbidden,locale+'/'+role+stat+kind);assert.notEqual(text,role+stat+kind);
 }
}
console.log('PASS Astra UI locale: 90 real translator/cache transitions, composite stat controls, navigation, presets, budget and negative remainder');

async function browserAudit(){
 const {startLab,launchBrowser,ready,blockExternal}=require('./helpers/v0188-browser-lab.cjs');
 const lab=await startLab();let browser;
 try{
  browser=await launchBrowser();
  for(const width of [320,360,390,430,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768}),page=await context.newPage();await blockExternal(context,page);
   await page.goto(lab.origin+'/candidate/');await ready(page);
   const result=()=>page.evaluate(()=>JSON.stringify({a:window.ChlohaLastCalculation.a,r:window.ChlohaLastCalculation.r}));
   if(!await page.locator('#att-attack-points').isVisible())await page.locator('#attStatsToggle').click();
   await page.locator('#att-attack-points').fill('20');const baseline=await result();
   for(const locale of locales){
    await page.selectOption('#chloha-locale',locale);
    // Detailed stat controls are named by native wrapping <label> elements,
    // not aria-label attributes. Assert each real family separately so deleting
    // a label/control cannot silently reduce the inspected population.
    const groups=await page.evaluate(()=>{
     const aria=selector=>Array.from(document.querySelectorAll(selector),node=>node.getAttribute('aria-label'));
     const stats=[];
     for(const side of ['att','def'])for(const stat of ['hp','attack','defense','specialAttack','specialDefense','speed'])for(const kind of ['points','range','nature','actual']){
      const id=side+'-'+stat+'-'+kind,node=document.getElementById(id);
      stats.push({id,exists:!!node,label:node?.labels?.[0]?.querySelector('.sr-only')?.textContent});
     }
     return {stats,previews:aria('#attStatOverview > button, #defStatOverview > button'),presets:aria('#attPresets > button, #defPresets > button'),overviews:aria('#attStatOverview, #defStatOverview'),navigation:aria('.quick-nav, #swapSides, #resetBoard, .mobile-result')};
    });
    assert.equal(groups.stats.length,48,'two sides × six stats × four native labels');
    for(const row of groups.stats){assert.ok(row.exists,'stat control exists: '+row.id);assert.ok(row.label?.trim(),'native accessible label exists: '+row.id);}
    for(const [kind,count] of Object.entries({previews:12,presets:10,overviews:2,navigation:4})){
     assert.equal(groups[kind].length,count,'expected accessible '+kind+' controls');
     for(const label of groups[kind])assert.ok(label?.trim(),'nonempty '+kind+' accessible name');
    }
    const labels=[...groups.stats.map(row=>row.label),...groups.previews,...groups.presets,...groups.overviews,...groups.navigation];
    if(!['ja','en'].includes(locale))for(const label of labels)assert.doesNotMatch(label,forbidden,locale+'/'+width+'/'+label);
    if(!['ja','en'].includes(locale))assert.doesNotMatch(await page.locator('#attBudget').textContent(),forbidden);
    assert.equal(await result(),baseline,'a11y changes preserve 16 rolls and inputs');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no overflow '+locale+'/'+width);
   }
   await page.reload();await ready(page);assert.equal(await result(),baseline,'reload preserves numbers');
   await context.close();
  }
  console.log('PASS Astra UI browser: 54 locale/viewport combinations, accessible names, no overflow, unchanged numbers and reload');
 }finally{await browser?.close();await lab.close();}
}
if(process.argv.includes('--browser'))browserAudit().catch(error=>{console.error(error);process.exitCode=1;});
