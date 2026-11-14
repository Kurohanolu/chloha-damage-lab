'use strict';
// Generate a complete, reproducible inventory of registered audit units.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {root,context,reference,flags,abilityName}=require('../tests/helpers/v0186-reference.cjs');
const {html,pokemon,moves,policies,ready,findSpecies,isMega,speciesDifference}=require('../tests/helpers/v0186-catalog.cjs');
const moveEvidence=JSON.parse(fs.readFileSync(root+'/reports/v0186/move-differential.json','utf8'));
const flagEvidence=JSON.parse(fs.readFileSync(root+'/reports/v0186/move-flag-audit.json','utf8'));
const seedEvidence=JSON.parse(fs.readFileSync(root+'/reports/v0186/seeded-differential.json','utf8'));
assert.equal(moveEvidence.mismatches,0);assert.equal(flagEvidence.differences.length,0);assert.equal(seedEvidence.mismatches,0);
const statuses=['Verified','Unverified','Incorrect','Partial','Unsupported','Not Applicable'];
const rows=[];
const add=(kind,id,name,status,evidence,hardware='なし')=>{assert.ok(statuses.includes(status));rows.push({kind,id,name,status,evidence,hardware});};
for(const p of pokemon){
 const zero=findSpecies(p,0),ref=zero||findSpecies(p,9),differences=speciesDifference(p,ref);
 add('Pokémon / forms',p.id,p.name,differences.length?'Unverified':'Verified',differences.length?'SpA 58/85の資料不一致。値を維持し実機確認待ち。':'6種族値・タイプ集合・体重 / '+(zero?'Champions':'Gen9')+'データ一致',p.screenshotStatsAbilitiesConfirmed===true?'過去の能力画面確認フラグ。今回再実測なし。':'なし');
}
const independentlyTested=new Set(Object.keys(moveEvidence.tested));
for(const m of moves){
 const mechanic=policies[m.id]?.mechanic||'none';
 const multi=!!context.ChlohaMultiHit.hitDistribution(m.name)||!!context.ChlohaMultiHit.specialMoveSpec(m.name);
 const weight=['けたぐり','くさむすび','ヘビーボンバー','ヒートスタンプ'].includes(m.name);
 const variable=['rageFist','lastRespects','storedPower'].includes(mechanic);
 const status=!ready(m)?'Not Applicable':multi?'Partial':independentlyTested.has(m.id)||weight||variable?'Verified':'Partial';
 const evidence=!ready(m)?'既存方針で標準ダメージ計算対象外':multi?'126分布照合。マルチスケイルとの組合せは従来どおり明示的未対応。':weight?'体重2,068条件照合。':variable?'既存の変動威力境界テスト＋PSコールバックの仕様照合。':independentlyTested.has(m.id)?'固定版の独立16乱数照合。定義済み条件内。':'基礎データ一致・既存回帰あり。発動条件の手動指定／仮定、全相互作用未検証。';
 add('Moves',m.id,m.name,status,evidence);
}
const partial=new Set(Object.entries(context.ChlohaAbilityData.ABILITY_CATALOG).filter(([,a])=>a.coverage==='partial').map(([id])=>id));
partial.add('skillLink');partial.add('multiscale');partial.add('guts');
const defenseNames=vm.runInNewContext('('+html.match(/const defensiveAbilities=(\{[^\n]+\});/)[1]+')');
const idsByJa={...context.ChlohaAbilityData.ABILITY_ID_BY_JA,...defenseNames};
for(const [role,ids] of [['Attack abilities',context.ChlohaAbilityData.ATTACKER_ABILITY_IDS],['Defense abilities',context.ChlohaAbilityData.DEFENDER_ABILITY_IDS]])for(const id of ids){
 if(id==='none')continue;
 const na=role==='Defense abilities'&&['overcoat','clearBody'].includes(id);
 add(role,id,abilityName(id),na?'Not Applicable':partial.has(id)?'Partial':'Verified',na?'この単発直接ダメージの対象外。':'役割別321条件。Skill Linkは126分布。Partialは宣言済みの一部動作／前提条件。');
}
const allAbilityNames=[...new Set(pokemon.flatMap(p=>p.abilities))].sort();
for(const name of allAbilityNames){
 const id=idsByJa[name];
 const known=id&&(context.ChlohaAbilityData.ATTACKER_ABILITY_IDS.includes(id)||context.ChlohaAbilityData.DEFENDER_ABILITY_IDS.includes(id)||['battery','powerSpot'].includes(id));
 add('Roster ability names',name,name,!known?'Unsupported':partial.has(id)?'Partial':'Verified',!known?'登録名は存在。計算未対応として拒否。新規実装せず将来課題へ。':'上記の役割別範囲のみ。全役割・全世代の効果保証ではない。');
}
for(const [kind,ids] of [['Attack items',context.ChlohaBattleData.ATTACKER_ITEM_IDS],['Defense items',context.ChlohaBattleData.DEFENDER_ITEM_IDS]])for(const id of ids){
 if(id==='none')continue;
 add(kind,id,id,id==='loadedDice'?'Partial':'Verified',id==='loadedDice'?'126分布。命中・回避ランク、マルチスケイル等は対象外。':'82アイテム条件＋半減きのみ不発18条件。多段の消費も別途照合。');
}
for(const type of context.ChlohaBattleData.TYPES)add('Type chart',type,type,'Verified','18×18セルと各16乱数。複合タイプは別途組合せテスト。');
const direct=new Set(['none','psyshock','forcedCritical','bodyPress','foulPlay','sacredSword','hpScaledPower','electroBall','gyroBall','acrobatics','reversal','weatherBall','terrainPulse','freezeDry','flyingPress','risingVoltage','mistyExplosion','expandingForce','hardPress','chargeSpABoost','gravApple','rageFist','lastRespects','storedPower']);
for(const id of [...context.ChlohaMoveMechanicsData.MOVE_MECHANIC_IDS,'shellSideArm'])add('Core / routed mechanics',id,id,direct.has(id)?'Verified':'Partial',id==='shellSideArm'?'独立8条件。能力比・接触を修正。同値は従来の特殊採用規約。':direct.has(id)?'独立差分／境界テスト／受付契約。実機とは別。':'既存の手動発動・使用成功前提・参加条件等の範囲。未検証の相互作用あり。');
for(const id of ['sun','rain','sand','snow'])add('Weather',id,id,'Verified','役割別・固定シード差分。砂の特防、雪の防御も対象。');
for(const id of ['electric','grassy','misty','psychic'])add('Terrain',id,id,'Verified','固定シード・技別・接地条件の差分。');
for(const id of ['base_formula','sixteen_rolls','fixed_point_rounding','modifier_order','STAB','critical_rank_bypass','Reflect','Light_Screen','Friend_Guard','Helping_Hand','burn','type_immunity','ability_immunity','Mold_Breaker','stat_sources','HP_thresholds','ability_activation_flags','stat_point_formula'])add('Shared calculations',id,id,'Verified','独立差分・15,360丸め・221,562能力値・既存300契約の該当範囲。');
add('Shared calculations','manual_multiplier','追加倍率','Partial','利用者指定の実験用倍率。公式対戦効果との同一性は対象外。');
add('Shared calculations','extreme_manual_stats','極端な手入力値','Unverified','1〜9999の入力受付は検査。実戦範囲外の全オーバーフロー挙動までは独立認証しない。');
for(const locale of ['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'])add('Locale regression',locale,locale,'Verified','9起点90遷移・9再読込・2,250既知ベクトル。表示/検索は既存9言語CI、フォームはv0.185の専用回帰。CI成功が条件。');
add('Feedback regression','v0185','匿名フィードバック','Verified','既存API・管理者権限・非公開データ・9言語ブラウザー回帰。モック環境のみ。本番無変更。');
const count=list=>Object.fromEntries(statuses.map(s=>[s,list.filter(r=>r.status===s).length]));
const totals=count(rows),eligible=rows.length-totals['Not Applicable'];
const implemented=eligible-totals.Unsupported;
const percent=(n,d)=>d?(100*n/d).toFixed(2)+'%':'—';
const summary={total:rows.length,statuses:totals,eligible,implemented,presenceRate:percent(implemented,eligible),verificationOfImplemented:percent(totals.Verified,implemented),verificationOfEligible:percent(totals.Verified,eligible),pokemon:pokemon.length,megaForms:pokemon.filter(isMega).length,rosterAbilityNames:allAbilityNames.length,readyMoves:moves.filter(ready).length,damagingMoves:moves.filter(m=>m.category!=='status').length,historicalStatScreenFlags:pokemon.filter(p=>p.screenshotStatsAbilitiesConfirmed===true).length,sourceConflicts:1,sheerForce:flagEvidence.sheerForce};
const lines=['# v0.186 Mechanics Coverage','',
'生成元: `scripts/v0186-mechanics-coverage.cjs`。Issue #61 / Draft PR #62。新機能・新しいID・対応ルールの追加を目的としない監査。',
'',
'**検証単位を分ける。** Pokémon行は6種族値・タイプ集合・体重、Move行は基礎データと記載条件のダメージ、Ability名行は登録名の対応範囲、役割別Ability/Item行は該当モデルの検査である。同じ実体が異なる役割に現れるため、総数はユニークな対戦効果数ではない。試験ケース数を分母にして検証率を水増ししない。',
'',
'Verifiedは記載した自動検証の範囲内であり、Championsの全状況や実機一致の認証ではない。対応する最新コミットの必須CIが未完了・失敗なら、この表だけで公開可能とは判定しない。Partialは制限や手動前提が残る。Unsupportedは今回追加しない。',
'',
'## 集計','',
'| 状態 | 件数 |','|---|---:|',...statuses.map(s=>'| '+s+' | '+totals[s]+' |'),'| 合計 | '+rows.length+' |','',
'- 評価対象（Not Applicableを除く）: **'+eligible+'**。実装存在数（Partial/Unverified/Incorrectを含む）: **'+implemented+'**。存在としての対応率: **'+percent(implemented,eligible)+'**。',
'- 完全にVerifiedとした項目 / 実装存在数: **'+totals.Verified+'/'+implemented+' = '+percent(totals.Verified,implemented)+'**。PartialをVerifiedに足さない。評価対象全体での検証率: **'+percent(totals.Verified,eligible)+'**。',
'- Pokémon/form **373**（メガ形態 **'+summary.megaForms+'**）: データ一致372、資料不一致1。335技のタイプ・分類・基礎威力は固定版のChampions/Gen9参照に一致。',
'- 計算可能な既存技: **'+summary.readyMoves+'/'+summary.damagingMoves+' = '+percent(summary.readyMoves,summary.damagingMoves)+'**。残り13は従来から標準計算対象外。別に変化技1。除外技の新規実装はしない。',
'- 役割付き特性: 攻撃70 / 防御39、持ち物: 攻撃22 / 防御20（noneを除く）。名簿中の特性名: **'+allAbilityNames.length+'**。',
'- 過去の能力画面確認フラグ: **'+summary.historicalStatScreenFlags+'**。これを実機ダメージ一致件数に加算しない。今回新たに収集した実機ダメージ証拠: **0**。',
'- Sheer Force: 明示的な既存5技ホワイトリストを維持。参照の対象候補'+flagEvidence.sheerForce.referenceEligible+'技に拡張せず **Partial** とする。',
'',
'## カテゴリ別件数','',
'| カテゴリ | 総数 | Verified | Unverified | Incorrect | Partial | Unsupported | Not Applicable |','|---|---:|---:|---:|---:|---:|---:|---:|'];
const kinds=[...new Set(rows.map(r=>r.kind))];
for(const kind of kinds){const list=rows.filter(r=>r.kind===kind),c=count(list);lines.push('| '+kind+' | '+list.length+' | '+statuses.map(s=>c[s]).join(' | ')+' |');}
lines.push('','## 証拠・制限','',
'- [不具合台帳](v0186-defect-register.md): 修正の入力・旧結果・期待結果・出典と24件の分類。原本300件を保持し、269件不変・26数値訂正・5トレース/付随情報訂正。',
'- 独立参照: `@smogon/calc@0.12.0` / `d7a69cf40616057ef40faf7623df7a628e58b535`。Champions generation 0 と Gen9 を区別する。',
'- 固定シード `0x0186ac`: 4,000条件 / Champions '+seedEvidence.generations[0]+'、Gen9 '+seedEvidence.generations[9]+'。登録技'+moveEvidence.moves+'件・'+moveEvidence.comparisons+'条件を追加照合。',
'- 役割別特性321条件、タグ2,680所属＋2,672数値、連続技126分布、体重2,068条件。これらの件数は上の項目検証率の分母に使わない。',
'- [Champions差分](v0186-champions-parity.md) / [実機検証計画](v0186-hardware-test-plan.md)。ノココッチの特攻58/85は推測で変更しない。',
'- 極端な非実戦手入力値、未表現の状態変化・命中補正・全ヒット別能力変化は一律に検証済みとしない。',
'','## 全数台帳','');
const escape=s=>String(s).replaceAll('|','/').replaceAll('\n',' ');
for(const kind of kinds){lines.push('### '+kind,'','| ID | 名前 | 状態 | 自動検証の範囲・制限 | 実機証拠 |','|---|---|---|---|---|');for(const r of rows.filter(r=>r.kind===kind))lines.push('| '+[r.id,r.name,r.status,r.evidence,r.hardware].map(escape).join(' | ')+' |');lines.push('');}
const markdown=lines.join('\n').trimEnd()+'\n',target=root+'/docs/v0186-mechanics-coverage.md';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8'),markdown,'regenerate the complete coverage document after reviewing scope changes');
else fs.writeFileSync(target,markdown);
fs.mkdirSync(root+'/reports/v0186',{recursive:true});fs.writeFileSync(root+'/reports/v0186/mechanics-coverage.json',JSON.stringify({summary,rows},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
