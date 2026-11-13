'use strict';
// Inventory is a metadata audit, not a claim of in-game damage parity.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const match=html.match(/const ChlohaMovesDB = (\{[^\n]+\});/);
assert.ok(match,'move catalog must exist');
const moves=JSON.parse(match[1]).moves;
const unsupported=moves.filter(m=>m.calculationSupported!==true);
const supported=moves.filter(m=>m.calculationSupported===true);
const noStatus=moves.filter(m=>m.category!=='status');
const breakdown=Object.fromEntries(['physical','special','status'].map(cat=>[cat,{total:moves.filter(m=>m.category===cat).length,flaggedSupported:supported.filter(m=>m.category===cat).length,flaggedUnsupported:unsupported.filter(m=>m.category===cat).length}]));
// Triage only: these names are known mechanic families to review against engine wiring.
// Classification does not assert the move is implemented or safe to enable.
const families={
 multiHit:['ダブルウイング','スイープビンタ','スケイルショット','タネマシンガン','ダブルアタック','つららばり','ドラゴンアロー','ツインビーム','みずしゅりけん','ネズミざん','ボーンラッシュ','ミサイルばり','ロックブラスト','トリプルアクセル'],
 variablePower:['エレキボール','けたぐり','くさむすび','ヒートスタンプ','ヘビーボンバー','からげんき','アクロバット','はたきおとす','ワイドフォース','ライジングボルト','たたりめ','ベノムショック','じだんだ','しっぺがえし','ダメおし','やけっぱち','ゆきなだれ','うっぷんばらし'],
 nonstandardDamage:['いかりのまえば','カウンター','がむしゃら','じわれ','いのちがけ','ぜったいれいど','ナイトヘッド','ミラーコート','ハサミギロチン','ほうふく','メタルバースト','ちきゅうなげ','つのドリル']
};
const byName=new Map(unsupported.map(m=>[m.name,m]));
const familyOf=new Map();
for(const [family,names] of Object.entries(families))for(const name of names){
 assert.ok(byName.has(name),'triage entry no longer flagged unsupported: '+name);
 assert.ok(!familyOf.has(name),'duplicate triage: '+name);
 familyOf.set(name,family);
}
const triage={familyCounts:Object.fromEntries(Object.entries(families).map(([key,names])=>[key,names.length])),needsManualReview:unsupported.filter(m=>!familyOf.has(m.name)).map(m=>m.name),classified:unsupported.map(m=>({name:m.name,family:familyOf.get(m.name)||'manualReview'}))};
assert.equal(triage.classified.length,unsupported.length);
const report={version:'v0.182',scope:'catalog metadata only; not game-hardware verified',total:moves.length,flaggedSupported:supported.length,flaggedUnsupported:unsupported.length,damagingMoves:noStatus.length,breakdown,triage,unsupported:unsupported.map(m=>({id:m.id,name:m.name,category:m.category,power:m.power,verificationStatus:m.verificationStatus||null}))};
assert.equal(report.flaggedSupported+report.flaggedUnsupported,report.total);
assert.equal(report.total,335,'Unexpected move catalog size: review inventory assumptions');
assert.equal(report.damagingMoves,334);
fs.mkdirSync(path.join(__dirname,'../reports'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'../reports/v0182-move-coverage-inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log('PASS v0.182 move metadata inventory',JSON.stringify({total:report.total,flaggedSupported:report.flaggedSupported,flaggedUnsupported:report.flaggedUnsupported,breakdown}));
console.log('TRIAGE',JSON.stringify({familyCounts:triage.familyCounts,manualReview:triage.needsManualReview.length,names:triage.needsManualReview}));
console.log('NOTE calculationSupported is a catalog flag, not evidence of hardware parity or full mechanic coverage');
