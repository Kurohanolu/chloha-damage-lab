'use strict';
// A deterministic per-move triage ledger; metadata is not hardware-parity evidence.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const policy=JSON.parse(html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/)[1]);
const groups={
 multiHit:new Set(['ダブルウイング','スイープビンタ','スケイルショット','タネマシンガン','ダブルアタック','つららばり','ドラゴンアロー','ツインビーム','みずしゅりけん','ネズミざん','ボーンラッシュ','ミサイルばり','ロックブラスト','トリプルアクセル']),
 variablePower:new Set(['エレキボール','けたぐり','くさむすび','ヒートスタンプ','ヘビーボンバー','からげんき','アクロバット','はたきおとす','ワイドフォース','ライジングボルト','たたりめ','ベノムショック','じだんだ','しっぺがえし','ダメおし','やけっぱち','ゆきなだれ','うっぷんばらし']),
 nonstandardDamage:new Set(['いかりのまえば','カウンター','がむしゃら','じわれ','いのちがけ','ぜったいれいど','ナイトヘッド','ミラーコート','ハサミギロチン','ほうふく','メタルバースト','ちきゅうなげ','つのドリル'])
};
const names=new Set(),ids=new Set();
const ledger=moves.map(m=>{
 assert.ok(!names.has(m.name),'duplicate move name '+m.name);
 assert.ok(!ids.has(m.id),'duplicate move id '+m.id);
 names.add(m.name);ids.add(m.id);
 const catalogSupported=m.calculationSupported===true;
 const runtimeEnabled=!catalogSupported&&['physical','special'].includes(m.category)&&policy[m.id]?.priority!=='P0'&&policy[m.id]?.standardDamageSupported===true&&!!policy[m.id]?.mechanic;
 const family=Object.entries(groups).find(([,set])=>set.has(m.name))?.[0]||'manualReview';
 return {id:m.id,name:m.name,category:m.category,power:m.power,catalogSupported,runtimeEnabled,mechanic:runtimeEnabled?policy[m.id].mechanic:null,family:catalogSupported?'catalogSupported':family,reviewState:catalogSupported?'metadataSupported':runtimeEnabled?'runtimeConditionalNeedsParity':'unsupportedNeedsReview'};
});
const summary={total:ledger.length,catalogSupported:ledger.filter(x=>x.catalogSupported).length,catalogUnsupported:ledger.filter(x=>!x.catalogSupported).length,runtimeConditional:ledger.filter(x=>x.runtimeEnabled).length,remainingWithoutRuntimeOverride:ledger.filter(x=>!x.catalogSupported&&!x.runtimeEnabled).length,byReviewState:Object.fromEntries(['metadataSupported','runtimeConditionalNeedsParity','unsupportedNeedsReview'].map(s=>[s,ledger.filter(x=>x.reviewState===s).length])),byFamily:Object.fromEntries([...Object.keys(groups),'manualReview'].map(s=>[s,ledger.filter(x=>!x.catalogSupported&&x.family===s).length]))};
assert.equal(summary.total,335,'unexpected catalog size');
assert.equal(summary.catalogSupported,262,'catalog metadata changed; review counts');
assert.equal(summary.catalogUnsupported,73,'unsupported metadata changed; review counts');
assert.equal(summary.runtimeConditional,42,'runtime overrides changed; review counts');
assert.equal(summary.remainingWithoutRuntimeOverride,31,'unhandled inventory changed; review counts');
assert.equal(summary.catalogSupported+summary.runtimeConditional+summary.remainingWithoutRuntimeOverride,summary.total);
const withoutOverride=ledger.filter(x=>!x.catalogSupported&&!x.runtimeEnabled);
const intentionalExclusions=withoutOverride.filter(x=>policy[x.id]?.priority==='P0');
const actionable=withoutOverride.filter(x=>policy[x.id]?.priority!=='P0');
assert.equal(intentionalExclusions.length,14,'intentional exclusions changed; review policies');
assert.equal(actionable.length,17,'actionable move audit queue changed');
summary.intentionalExclusions=intentionalExclusions.length;
summary.actionableWithoutRuntimeOverride=actionable.length;
const report={version:'v0.182',meaning:'Per-move audit queue. No category here implies hardware-tested parity.',summary,intentionalExclusions,actionableWithoutRuntimeOverride:actionable,unresolved:ledger.filter(x=>!x.catalogSupported),allMoves:ledger};
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports/v0182-move-triage-ledger.json'),JSON.stringify(report,null,2)+'\n');
console.log('PASS v0.182 per-move triage ledger',JSON.stringify(summary));
console.log('ACTIONABLE_17',JSON.stringify(actionable.map(x=>x.name)));\nconsole.log('INTENTIONALLY_EXCLUDED_14',JSON.stringify(intentionalExclusions.map(x=>x.name)));
