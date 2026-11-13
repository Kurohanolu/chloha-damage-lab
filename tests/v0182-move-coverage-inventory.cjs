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
// Runtime policy can explicitly enable conditional damage despite conservative catalog metadata.
// Keep catalog flags unchanged: they describe baseline coverage, not full-mechanic parity.
const policyMatch=html.match(/const ChlohaMovePolicy = (\{[^\n]+\});/);
assert.ok(policyMatch,'runtime move policy must exist');
const policies=JSON.parse(policyMatch[1]);
const policyEnabled=moves.filter(m=>m.calculationSupported!==true&&['physical','special'].includes(m.category)&&policies[m.id]?.priority!=='P0'&&policies[m.id]?.standardDamageSupported===true&&!!policies[m.id]?.mechanic);
const fourVerified=[
 ['からげんき','facade'],['はたきおとす','knockOff'],['ワイドフォース','expandingForce'],['アクロバット','acrobatics']
];
for(const [name,mechanic] of fourVerified){
 const m=moves.find(x=>x.name===name);
 assert.ok(m,'verified move exists: '+name);
 assert.ok(policyEnabled.some(x=>x.id===m.id),'verified move has runtime override: '+name);
 assert.equal(policies[m.id].mechanic,mechanic,'verified mechanic: '+name);
}
// Triage the remaining 37 runtime-policy overrides by the mechanism being modeled.
const verifiedNames=new Set(fourVerified.map(([name])=>name));
const mechanismGroups={
 'activation-assumed':new Set(['activationAssumed']),
 'conditional-power':new Set(['lashOut','barbBarrage','fickleBeam','hex','infernalParade','risingVoltage','round','temperFlare','avalanche','stompingTantrum','payback','assurance','venoshock']),
 'stat-or-critical':new Set(['psyshock','forcedCritical','bodyPress','foulPlay']),
 'speed-or-terrain':new Set(['electroBall','ironRoller','mistyExplosion']),
 'multi-hit-or-manual':new Set(['dualWingbeat','beatUpManual'])
};
const remaining=policyEnabled.filter(m=>!verifiedNames.has(m.name)&&m.name!=='はきだす');
assert.equal(remaining.length,37,'37 runtime policy moves remain after four browser-verified cases');
const grouped=Object.fromEntries(Object.keys(mechanismGroups).map(group=>[group,[]]));
for(const m of remaining){
 const mechanic=policies[m.id].mechanic;
 const group=Object.keys(mechanismGroups).find(k=>mechanismGroups[k].has(mechanic));
 assert.ok(group,'Unclassified runtime mechanic: '+m.name+' / '+mechanic);
 grouped[group].push({id:m.id,name:m.name,mechanic,power:m.power,review:'UI-to-engine and scenario-specific numerical regression pending'});
}
assert.equal(Object.values(grouped).reduce((sum,list)=>sum+list.length,0),37);
const runtimePolicyAudit={
 remainingByMechanicGroup:grouped,
 meaning:'catalog flag is conservative; runtime policy enables conditional calculations, not hardware-verified full support',
 count:policyEnabled.length,
 verifiedByFourMoveBrowserRegression:fourVerified.map(([name,mechanic])=>({name,mechanic})),
 otherPolicyEnabled:policyEnabled.filter(m=>!fourVerified.some(([name])=>name===m.name)).map(m=>({id:m.id,name:m.name,mechanic:policies[m.id].mechanic,reason:policies[m.id].reason||null}))
};
// An explicit catalog/engine consistency signal, not an automatic activation.
const engineMechanics=[
 ['からげんき',"a.moveMechanic==='facade'"],
 ['はたきおとす',"a.moveMechanic==='knockOff'"],
 ['ワイドフォース',"a.moveMechanic==='expandingForce'"],
 ['アクロバット',"a.moveMechanic==='acrobatics'"]
];
const apparentMismatches=engineMechanics.filter(([name,token])=>byName.has(name)&&html.includes(token)).map(([name,token])=>({name,engineToken:token,status:'review-required: catalog false while mechanic code present'}));
const triage={runtimePolicyAudit,apparentMismatches,familyCounts:Object.fromEntries(Object.entries(families).map(([key,names])=>[key,names.length])),needsManualReview:unsupported.filter(m=>!familyOf.has(m.name)).map(m=>m.name),classified:unsupported.map(m=>({name:m.name,family:familyOf.get(m.name)||'manualReview'}))};
assert.equal(triage.classified.length,unsupported.length);
const report={version:'v0.182',scope:'catalog metadata only; not game-hardware verified',total:moves.length,flaggedSupported:supported.length,flaggedUnsupported:unsupported.length,damagingMoves:noStatus.length,breakdown,triage,unsupported:unsupported.map(m=>({id:m.id,name:m.name,category:m.category,power:m.power,verificationStatus:m.verificationStatus||null}))};
assert.equal(report.flaggedSupported+report.flaggedUnsupported,report.total);
assert.equal(report.total,335,'Unexpected move catalog size: review inventory assumptions');
assert.equal(report.damagingMoves,334);
fs.mkdirSync(path.join(__dirname,'../reports'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'../reports/v0182-move-coverage-inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log('PASS v0.182 move metadata inventory',JSON.stringify({total:report.total,flaggedSupported:report.flaggedSupported,flaggedUnsupported:report.flaggedUnsupported,breakdown}));
console.log('REMAINING_37_GROUPS',JSON.stringify(Object.fromEntries(Object.entries(grouped).map(([k,v])=>[k,v.length]))));
console.log('RUNTIME_POLICY_OVERRIDES',JSON.stringify({count:runtimePolicyAudit.count,fourBrowserVerified:runtimePolicyAudit.verifiedByFourMoveBrowserRegression.length}));
console.log('CATALOG_ENGINE_MISMATCHES',JSON.stringify(apparentMismatches));
console.log('TRIAGE',JSON.stringify({familyCounts:triage.familyCounts,manualReview:triage.needsManualReview.length,names:triage.needsManualReview}));
console.log('NOTE calculationSupported is a catalog flag, not evidence of hardware parity or full mechanic coverage');
