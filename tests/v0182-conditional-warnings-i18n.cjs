const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const cases=[
 ['特殊連続技の命中率は各回90%を基準に計算しています。命中・回避ランクや命中率補正アイテム・特性は未対応です。','Each hit of this special multi-hit move uses 90% base accuracy.'],
 ['ふくろだたきは入力された参加ポケモンの攻撃種族値で各ヒットを算出。参加可否は手動指定で、ヒット別急所・耐久特性・追加効果は未検証です。','Beat Up calculates each hit from the entered participants'],
 ['ドラゴンアローは選択した相手への2回分のダメージを表示します。相手2体のまもる・無効・対象判定は手動指定です。','Dragon Darts shows 2 hit(s)'],
 ['実測ダメージを確認し「技の使用を確定」を押してください。フィールド解除は確定時に反映されます。','Check the observed damage and select Confirm move use.'],
 ['攻守を入れ替えたため履歴を消去しました。','Battle history cleared because attacker and defender were swapped.']
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').selectOption('ja');
  await page.evaluate(list=>{
   const host=document.querySelector('#app');
   const holder=document.createElement('div');holder.id='conditional-i18n-fixture';
   list.forEach(([ja])=>{const p=document.createElement('p');p.textContent=ja;holder.append(p)});
   host.append(holder);
  },cases);
  await page.locator('#chloha-locale').selectOption('en');
  const en=await page.locator('#conditional-i18n-fixture p').allTextContents();
  cases.forEach(([,expected],i)=>assert(en[i].includes(expected),'English conditional message '+i+': '+en[i]));
  assert(en.every(x=>!/[ぁ-んァ-ヶ一-龯]/.test(x)),'English conditional warnings have no Japanese');
  await page.locator('#chloha-locale').selectOption('ja');
  const ja=await page.locator('#conditional-i18n-fixture p').allTextContents();
  assert.deepEqual(ja,cases.map(x=>x[0]),'Japanese warning round-trip');
  console.log('PASS conditional warning localization JA EN JA');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
