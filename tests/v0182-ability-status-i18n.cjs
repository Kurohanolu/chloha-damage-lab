const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('file://'+path.resolve(__dirname,'../index.html'));
  await page.locator('#chloha-locale').selectOption('ja');
  await page.evaluate(()=>{
   const select=document.createElement('select');
   select.id='ability-translation-fixture';
   for(const [value,label] of [
    ['sheerForce','ちからずく（一部技のみ対応）'],
    ['technician','テクニシャン（対応）'],
    ['purePower','ヨガパワー（対応）'],
    ['hustle','はりきり（一部技のみ対応）'],
    ['solarPower','サンパワー（対応）'],
    ['flareBoost','ねつぼうそう（対応）'],
    ['waterBubble','すいほう（一部技のみ対応）'],
    ['ironFist','てつのこぶし（一部技のみ対応）'],
    ['strongJaw','がんじょうあご（一部技のみ対応）'],
    ['transistor','トランジスタ（対応）'],
    ['dragonsMaw','りゅうのあぎと（対応）'],
    ['analytic','アナライズ（一部技のみ対応）'],
    ['steelworker','はがねつかい（対応）'],
    ['rockyPayload','いわはこび（対応）'],
    ['sandForce','すなのちから（対応）'],
    ['punkRock','パンクロック（一部技のみ対応）'],
    ['pixilate','フェアリースキン（対応）'],
    ['aerilate','スカイスキン（対応）'],
    ['refrigerate','フリーズスキン（対応）'],
    ['galvanize','エレキスキン（対応）'],
    ['dragonize','ドラゴンスキン（対応）'],
    ['normalize','ノーマルスキン（対応）'],
    ['overgrow','しんりょく（対応）'],
    ['blaze','もうか（対応）'],
    ['torrent','げきりゅう（対応）'],
    ['swarm','むしのしらせ（対応）'],
    ['unknown','未知の特性（効果未対応）']
   ]){const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}
   document.getElementById('app').append(select);
  });
  const read=()=>page.locator('#ability-translation-fixture option').allTextContents();
  const ja=['ちからずく（一部技のみ対応）','テクニシャン（対応）','ヨガパワー（対応）','はりきり（一部技のみ対応）','サンパワー（対応）','ねつぼうそう（対応）','すいほう（一部技のみ対応）','てつのこぶし（一部技のみ対応）','がんじょうあご（一部技のみ対応）','トランジスタ（対応）','りゅうのあぎと（対応）','アナライズ（一部技のみ対応）','はがねつかい（対応）','いわはこび（対応）','すなのちから（対応）','パンクロック（一部技のみ対応）','フェアリースキン（対応）','スカイスキン（対応）','フリーズスキン（対応）','エレキスキン（対応）','ドラゴンスキン（対応）','ノーマルスキン（対応）','しんりょく（対応）','もうか（対応）','げきりゅう（対応）','むしのしらせ（対応）','未知の特性（効果未対応）'];
  assert.deepEqual(await read(),ja);
  await page.locator('#chloha-locale').selectOption('en');
  const en=await read();
  assert.match(en[0],/Sheer Force \(partially supported\)$/);
  assert.match(en[1],/Technician \(supported\)$/);
  assert.match(en[2],/Pure Power \(supported\)$/);
  assert.match(en[3],/Hustle \(partially supported\)$/);
  assert.match(en[4],/Solar Power \(supported\)$/);
  assert.match(en[5],/Flare Boost \(supported\)$/);
  assert.match(en[6],/Water Bubble \\(partially supported\\)$/);
  en.splice(5,2);
  assert.match(en[5],/Iron Fist \(partially supported\)$/);
  assert.match(en[6],/Strong Jaw \(partially supported\)$/);
  assert.match(en[7],/Transistor \(supported\)$/);
  assert.match(en[8],/Dragon's Maw \(supported\)$/);
  assert.match(en[9],/Analytic \(partially supported\)$/);
  assert.match(en[10],/Steelworker \(supported\)$/);
  assert.match(en[11],/Rocky Payload \(supported\)$/);
  assert.match(en[12],/Sand Force \(supported\)$/);
  assert.match(en[13],/Punk Rock \(partially supported\)$/);
  assert.match(en[14],/Pixilate \(supported\)$/);
  assert.match(en[15],/Aerilate \(supported\)$/);
  assert.match(en[16],/Refrigerate \(supported\)$/);
  assert.match(en[17],/Galvanize \(supported\)$/);
  assert.match(en[18],/Dragonize \(supported\)$/);
  assert.match(en[19],/Normalize \(supported\)$/);
  assert.match(en[20],/Overgrow \(supported\)$/);
  assert.match(en[21],/Blaze \(supported\)$/);
  assert.match(en[22],/Torrent \(supported\)$/);
  assert.match(en[23],/Swarm \(supported\)$/);
  assert.match(en[24],/\(unsupported\)$/);
  await page.locator('#chloha-locale').selectOption('ja');
  assert.deepEqual(await read(),ja);
  console.log('PASS ability support status labels JA EN JA');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
