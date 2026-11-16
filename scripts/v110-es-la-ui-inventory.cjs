'use strict';
// Reproducible UI-source inventory. Runtime files are evaluated in a DOM-free VM;
// no browser, production service, private data or calculation code is executed.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),target='docs/data/v110-es-la-ui-inventory.json';
const tables=['nativeOptionTranslations','expandedSettingsTranslations','expandedLongTextTranslations','expandedPanelTranslations','localeUiPhrases','screenshotLocalePhrases','localizedControlPhrases','localizedItemOptionPhrases','localizedPlateOptions','localizedTypeNames','battlefieldNames'];
const DYNAMIC_CASES=[
 ['damage-range','123〜145 ダメージ'],
 ['ko-current-hp','現在HP 147 / KO率 25%'],
 ['ko-not-applicable','現在HP 147 / KO率 対象外'],
 ['ko-mini','乱数KO · 25%'],
 ['max-hp-percent','最大HPに対する割合：60.5%'],
 ['survival-percent','確定耐え · 75%'],
 ['battlefield','現在の盤面：天候 雨 ／ フィールド サイコフィールド ／ 壁 ひかりのかべ'],
 ['stat-overview','Attacker six stats'],
 ['stat-edit','Defender Sp. Def 27 points. Edit'],
 ['stat-preset','Attacker H32/A32/S2'],
 ['stat-preset-reset','Defender Reset all to 0'],
 ['stat-compound','Attacker Attack stat points'],
 ['stat-compound-normalized','Defender Defenseactual stat'],
 ['swap','⇄ Swap sides'],
 ['two-hit-roll-heading','256 two-hit damage combinations (including duplicates)'],
 ['estimated-hits','2〜3発（目安・回復等なし）'],
 ['type-effectiveness','タイプ相性 ×2 / STAB ×1.5'],
 ['ohko-percent','現在HPに対する1発KO率: 25%'],
 ['verification-status','検証状況：未実機検証'],
 ['base-stat','種族値 123'],
 ['numeric-stat','Attack 187'],
 ['stat-budget','能力ポイント 32 / 66（残り 34）'],
 ['version-provenance','バージョンについて：画面の「v1.1.0 Pre-Release 4」は公開UI版。計算コアの内部API識別子は「v0.184」。v0.184の自動回帰監査'],
 ['selected-move-warning','選択技「じしん」の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。'],
 ['selected-move-warning-full-earthquake','選択技「じしん（じめん / 100）［計算試算・実機未照合］」の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。'],
 ['selected-move-warning-full-dragon-darts','選択技「ドラゴンアロー（ドラゴン / 50）［計算試算・実機未照合］」の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。'],
 ['selected-move-warning-full-variable','選択技「エレキボール（でんき / 可変）［基本ダメージのみ・実機未照合］」の習得可否・技固有効果・威力変動・命中率は検証されていません。実機のダメージ値と照合するまでは暫定値として扱ってください。'],
 ['battle-summary','Garchomp Earthquake (187) → Tyranitar (130 / HP 200)'],
 ['dragon-darts-count','ドラゴンアローは選択した相手への2回分のダメージを表示します。相手2体のまもる・無効・対象判定は手動指定です。'],
 ['misty-explosion-boost','ミストバースト: ミストフィールド＋使用者接地（威力1.5倍）。使用後の自身のひんしは自動反映しません'],
 ['misty-explosion-normal','ミストバースト: 通常威力。使用後の自身のひんしは自動反映しません'],
 ['rising-voltage-boost','ライジングボルト: エレキフィールド＋対象接地（威力2倍）'],
 ['rising-voltage-normal','ライジングボルト: 通常威力'],
 ['expanding-force-boost','ワイドフォース: 接地＋サイコフィールド（威力1.5倍・範囲化）'],
 ['expanding-force-normal','ワイドフォース: 通常威力・単体対象'],
 ['electro-ball-speed','エレキボール: 素早さ 123 / 62 → 威力 80'],
 ['acrobatics-no-item','アクロバット: 持ち物 なし（威力2倍）'],
 ['acrobatics-item','アクロバット: 持ち物 あり（通常威力）'],
 ['hp-scaled-power','HP依存威力: 100'],
 ['two-hit-range','2発合計の最小〜最大: 120〜140'],
 ['two-hit-ko','2発合計KO率（256組）: 25%'],
 ['two-hit-ko-fainted','2発合計KO率（256組）: 対象がひんし'],
 ['final-roll','最終ダメージ（乱数100）: 123'],
 ['critical-forced','確定急所: 急所補正を強制適用'],
 ['dual-wingbeat-trace','ダブルウイング: 各ヒットを威力40で独立計算（各16乱数、計256組）'],
 ['immunity-trace','無効判定: タイプまたは特性によってダメージ0'],
 ['additional-multiplier','追加倍率×1.2を最終ダメージに適用しています。既存補正との二重適用に注意してください。'],
 ['selection-summary','選択中：ガブリアス じしん（じめん / 100）'],
 ['hp-dependent-note','HP依存威力技：しおふき。攻撃側現在HPを変更すると威力が再計算されます。'],
 ['alternative-stat-note','特殊能力値参照技：ボディプレス。攻撃ランク欄は参照能力のランクとして扱います。'],
 ['move-audit','技監査 未対応（自動計算を停止）'],
 ['input-error','入力エラー: 最大HP範囲外'],
 ['trace-lines','攻撃実数値: 123\n防御実数値: 145\n乱数前: 62\n最終ダメージ（乱数100）: 62'],
 ['attack-trace','攻撃実数値: 123'],
 ['defense-trace','防御実数値: 145'],
 ['before-roll-trace','乱数前: 62'],
 ['battle-history','1手目：じしん（じめん / 100）［基本ダメージのみ・実機未照合］ / 123ダメージ / フィールド解除 / 予測と不一致・要照合'],
 ['battle-confirmation','じしん（じめん / 100）［基本ダメージのみ・実機未照合］を確定。相手HP 123 → 12、フィールド：なし。予測と不一致です。条件・実測値を記録して照合してください。'],
 ['punk-rock-note','パンクロック：音技の威力1.3倍に対応しています。音技の被ダメージ半減は防御側特性として未対応です。'],
 ['tough-claws-note','かたいツメ：登録済み335技の接触判定をShowdownデータで照合し、接触技に威力1.3倍を適用します。'],
 ['reckless-note','すてみ：反動ダメージを受ける確認済みの攻撃技のみ威力1.2倍です。反動以外のHP消費技は対象外です。'],
 ['analytic-note','アナライズ：発動条件を満たした前提でダメージを1.3倍にしています。行動順や交代の自動判定は行いません。'],
 ['hp-power-ratio','HP依存威力: 100/200 → 75'],
 ['hp-power-explicit','HP依存威力: 威力 150'],
 ['last-respects-power','おはかまいり: 威力 250'],
 ['gyro-ball-power','ジャイロボール: 威力 101'],
 ['stored-power-detail','アシストパワー: 威力 140'],
 ['rage-fist-count','ふんどのこぶし: 被攻撃回数 3 → 威力 200'],
 ['final-roll-two-hit','最終ダメージ（乱数100・2発合計）: 278'],
 ['all-hit-ko','現在HPに対する連続技合計KO率: 12.50%'],
 ['critical-prevented','確定急所: 防御側の急所無効特性により急所補正なし'],
 ['charge-boost-rain','攻撃前の特攻+1段階を自動反映（入力ランクは使用前）。雨のため即時攻撃。'],
 ['charge-boost-turn','攻撃前の特攻+1段階を自動反映（入力ランクは使用前）。溜めターン後の攻撃。'],
 ['shell-side-arm-physical','シェルアームズ: 物理・特殊の能力比を比較し、物理方式を採用（同値は特殊）。'],
 ['shell-side-arm-special','シェルアームズ: 物理・特殊の能力比を比較し、特殊方式を採用（同値は特殊）。'],
 ['battle-history-hp','2手目：じしん（じめん / 100）［基本ダメージのみ・実機未照合］ / 87ダメージ / HP 156→69'],
 ['battle-confirmation-hp','じしん（じめん / 100）［基本ダメージのみ・実機未照合］を確定。相手HP 69 / 200、フィールド：なし'],
 ['hp-chip','HP 0'],
 ['modifier-trace','stat/purePower+choiceBand: 123 → 369']
];
// Bounded source inspection of the real result/rolls/history DOM. These labels
// must occur literally in index.html; this is not a claim of a complete parser.
const DOM_LABEL_CASES=[
 ['multi-hit-rolls','連続技の合計ダメージ（各値の発生確率）'],
 ['multi-hit-ko-hint','命中・連続ヒットを含むKO率を参照'],
 ['single-hit-rolls','16通りのダメージ'],
 ['two-hit-rolls','2発合計の256通りのダメージ（重複を含む）'],
 ['trace-summary','計算トレースを表示'],
 ['battle-heading','盤面引き継ぎ（手動確定）'],
 ['battle-help','計算結果を確認後、実際に出たダメージを入力して確定。相手HPとフィールドを次の計算へ引き継ぎます。'],
 ['observed-damage','実際のダメージ'],
 ['battle-commit','技の使用を確定'],
 ['battle-undo','1手戻す'],
 ['battle-reset','履歴を消去'],
 ['battle-no-calculation','有効なダメージ計算結果がありません。'],
 ['battle-stale','盤面が変更されています。再計算してから確定してください。'],
 ['battle-fainted','相手は既にひんし状態です。技の使用を確定できません。'],
 ['battle-invalid-damage','実際のダメージは0〜9999の整数で入力してください。'],
 ['battle-stale-undo','HPまたはフィールドが手動変更されています。取り消し前に確定直後の状態へ戻すか、履歴を消去してください。'],
 ['battle-undone','直前の1手を取り消しました。'],
 ['battle-cleared','履歴を消去しました。現在のHP・フィールドは維持しています。'],
 ['manual-move','手入力技'],
 ['result-eyebrow','DAMAGE ESTIMATE'],
 ['result-heading','計算結果'],
 ['result-link','結果 ↓'],
 ['invalid-input','入力を確認してください'],
 ['verification-heading','検証状況'],
 ['ko-fainted','対象はすでにひんし'],
 ['ko-fainted-not-applicable','対象は既にひんし（KO率の算出対象外）'],
 ['fainted-zero-hp','ひんし（HP 0）'],
 ['immune','無効'],
 ['one-hit','確定1発'],
 ['ko-guaranteed','確定KO'],
 ['ko-possible','乱数KO'],
 ['no-damage','ダメージなし'],
 ['guaranteed-survival','確定耐え']
];
// This scanner only extracts explicitly named, trusted object/array literals in
// our own source. It is not a general JavaScript parser. New layouts fail closed.
function literalAfter(source,marker,start=0){
 const at=source.indexOf(marker,start);assert.ok(at>=0,'Missing inventory anchor: '+marker);
 let i=at+marker.length;while(/\s/.test(source[i]))i++;
 assert.ok(source[i]==='{'||source[i]==='[','Inventory anchor must start a literal: '+marker);
 const begin=i,stack=[];let quote=null;
 for(;i<source.length;i++){
  const ch=source[i];if(quote){if(ch==='\\'){i++;continue;}if(ch===quote)quote=null;continue;}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}
  if(ch==='{'||ch==='[')stack.push(ch);
  else if(ch==='}'||ch===']'){assert.equal(stack.pop(),ch==='}'?'{':'[');if(!stack.length)return {expression:source.slice(begin,i+1),line:source.slice(0,begin).split('\n').length};}
 }
 throw Error('Unclosed inventory literal: '+marker);
}
function buildInventory({readFile=file=>fs.readFileSync(path.join(root,file),'utf8')}={}){
 const hashes={},read=file=>{const value=readFile(file);hashes[file]=crypto.createHash('sha256').update(value).digest('hex');return value;};
 let optionFixture=[];
 const c=vm.createContext({document:{readyState:'loading',addEventListener(){},getElementById:id=>id==='app'?{}:null,querySelectorAll:selector=>selector==='select'?optionFixture:[]},localStorage:{getItem:()=>null}});c.window=c;
 const load=file=>vm.runInContext(read(file),c,{filename:file,timeout:10000});
 for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-pokeapi-v0183.js','locale-form-species-v0183.js','locale-names-v0183.js','locale-registry.js','locale-catalog.js','feedback-locales-v0185.js','locale-es-la-data-v110.js','locale-es-la-v110.js','locale-ui-es-la-v110.js'])load(file);
 const code=read('i18n.js'),anchor='function initialize(){';assert.equal(code.split(anchor).length,2,'Unique bootstrap anchor');
 vm.runInContext(code.replace(anchor,`window.__ui={tables:{${tables.join(',')}},esLaUiCopy,dictionary,selectLabels,attributeLabels,uiTerms,text:localizedUi,options:translateOptions,english:translateRuntime,set(value){locale=value}};${anchor}`),c,{filename:'i18n.js',timeout:10000});c.__ui.set('es-LA');
 const records=[];const neutral=new Set(['HP','Pokémon','N/A','STAB']);
 function add(source,group,obj,origin,extra={}){for(const [key,value] of Object.entries(obj)){
  assert.equal(typeof value,'string',source+'/'+group+'/'+key);
  records.push({id:source+':'+group+':'+key,source,group,canonicalKey:key,text:value,status:'provisional',origin,officialGameNameEvidence:false,...extra});
 }}
 add('locale-catalog.js','catalog',c.ChlohaLocaleCatalog['es-LA'],'explicit-es-reuse');
 add('feedback-locales-v0185.js','feedback',c.ChlohaFeedbackLocales.catalogs['es-LA'],'authored-or-explicit-es-reuse');
 add('locale-ui-es-la-v110.js','exact-ui',c.ChlohaEsLaUi.phrases,'authored-ui');
 add('i18n.js','esLaUiCopy',c.__ui.esLaUiCopy,'authored-ui');
 for(const [group,table]of Object.entries(c.__ui.tables))add('i18n.js',group,Object.fromEntries(Object.entries(table).filter(([,v])=>typeof v.es==='string').map(([key,v])=>[key,v.es])),'reviewed-es-template-reuse');
 load('brand-v0187.js');add('brand-v0187.js','brand',Object.fromEntries(['descriptions','credits','languages','scopeNotices'].map(key=>[key,c.SingularityBrand[key]['es-LA']])),'authored-or-explicit-es-reuse');
 const persistence=read('persistence-v0188.js'),persistAnchor=' const object=x=>';assert.equal(persistence.split(persistAnchor).length,2);
 vm.runInContext(persistence.replace(persistAnchor," root.__PersistenceCopy=COPY['es-LA'];\n"+persistAnchor),c);
 add('persistence-v0188.js','persistence',Object.fromEntries(['reset','retention','resetDone','storageUnavailable'].map((key,i)=>[key,c.__PersistenceCopy[i]])),'authored-ui');
 const isolated=vm.createContext({});vm.runInContext(read('portrait-alt-v0188.js'),isolated);
 add('portrait-alt-v0188.js','portrait',{description:isolated.SingularityPortraitAlt.describe('id','name','es-LA',()=>'{name}'),unavailable:isolated.SingularityPortraitAlt.describe('id','name','es-LA',()=>null)},'explicit-es-reuse');
 const quality=read('locale-quality-v0188.js'),qualityAnchor=' const language=';assert.equal(quality.split(qualityAnchor).length,2);
 vm.runInContext(quality.replace(qualityAnchor," globalThis.__QualityWords=words['es-LA'];\n"+qualityAnchor),isolated);
 add('locale-quality-v0188.js','quality',Object.fromEntries(Object.entries(isolated.__QualityWords).map(([key,value])=>[key,typeof value==='function'?value(key==='title'?'{move}':key==='count'?'{count}':'{power}'):value])),'explicit-es-reuse');
 const initialScopedCount=records.length;
 // Retain the original scoped records, then add omitted source sites. Sites are
 // intentionally not deduplicated across files/tables, and game terms overlap.
 load('feedback-release-v100.js');add('feedback-release-v100.js','release-copy',Object.fromEntries(Object.keys(c.ChlohaFeedbackRelease.copy['es-LA']).map(key=>[key,c.ChlohaFeedbackRelease.text('es-LA',key,'Singularity v1.1.0 Pre-Release 4')])),'authored-or-explicit-es-reuse');
 // These dictionaries contain source templates with named game-entity slots.
 // Inventory the actual renderer result and its real error/audit wrapper, not
 // only the unresolved Spanish template or a copy of it made by this script.
 for(const [group,property,wrap]of [
  ['authored-reasons','reasons',key=>'技監査 P1：'+key],
  ['authored-errors','errors',key=>'入力エラー: '+key]
 ]){
  assert.ok(c.ChlohaEsLaUi[property]&&typeof c.ChlohaEsLaUi[property]==='object','Missing runtime UI dictionary '+property);
  for(const [key,sourceTemplate]of Object.entries(c.ChlohaEsLaUi[property])){
   const wrapped=wrap(key);
   add('locale-ui-es-la-v110.js',group,{[key]:c.__ui.text(key)},'executed-authored-dynamic-copy',{sourceTemplate,canonicalInput:key,englishReference:c.__ui.english(key),outputVerified:true,renderPath:'localizedUi → ChlohaEsLaUi.dynamic',witnesses:[{canonicalInput:wrapped,text:c.__ui.text(wrapped)}]});
  }
 }
 // Every policy reason in the current app participates, including new reasons
 // that have no authored translation yet. Missing coverage remains visible.
 const html=read('index.html'),policyLiteral=literalAfter(html,'const ChlohaMovePolicy = ');
 const policy=vm.runInNewContext('('+policyLiteral.expression+')',{}, {timeout:1000});
 const policyReasons=[...new Set(Object.values(policy).map(entry=>entry?.reason).filter(reason=>typeof reason==='string'))];
 const unmappedPolicyReasons=policyReasons.filter(reason=>!Object.hasOwn(c.ChlohaEsLaUi.reasons,reason));
 for(const key of unmappedPolicyReasons)add('index.html','unmapped-policy-reason',{[key]:c.__ui.text('技監査 P1：'+key)},'missing-authored-reason',{canonicalInput:'技監査 P1：'+key,englishReference:c.__ui.english('技監査 P1：'+key),outputVerified:true,renderPath:'localizedUi → ChlohaEsLaUi.dynamic'});
 for(const [id,input]of DOM_LABEL_CASES){
  const at=html.indexOf(input);assert.ok(at>=0,'Missing result DOM source label: '+id);
  add('index.html','result-dom-label',{[id]:c.__ui.text(input)},'executed-result-dom-source',{canonicalInput:input,englishReference:c.__ui.english(input),outputVerified:true,renderPath:'localizedUi',sourceLine:html.slice(0,at).split('\n').length});
 }
 for(const group of ['dictionary','selectLabels','attributeLabels','uiTerms']){
  for(const [key,english]of Object.entries(c.__ui[group])){
   let text=c.__ui.text(key),renderPath='localizedUi';
   if(group==='selectLabels'){
    const id=/（(?:一部技のみ対応|対応|効果未対応|未対応)）$/.test(key)?'attAbility':/のみ|チョッキ|たま|ハチマキ|メガネ|おび/.test(key)?'attItem':c.ChlohaEsLaData.entries.forms[key]?'ragingBullForm':'inventoryOption';
    const option={value:'inventory-fixture',textContent:key,label:''};optionFixture=[{id,options:[option],closest:()=>null}];c.__ui.options();text=option.textContent;assert.equal(option.label,text);optionFixture=[];renderPath='translateOptions';
   }
   let gameNameReference=null;
   for(const [category,rows]of Object.entries(c.ChlohaPokeAPILocalizedNames||{})){
    const match=Object.entries(rows||{}).find(([id,row])=>id===key||row?.ja===key);
    if(match){const [id,row]=match;gameNameReference={category,key:id,expectedEsLA:c.ChlohaEsLa.entity(category,id,row.es||row.en||null)};break;}
   }
   add('i18n.js','canonical-'+group,{[key]:text},'executed-canonical-ui-key',{canonicalInput:key,englishReference:english,outputVerified:true,renderPath,gameNameReference});
  }
 }
 function local(name,marker,{after='',shape='rows',index=2,extra={}}={}){
  const from=after?code.indexOf(after):0;assert.ok(from>=0,'Missing scope '+after);
  const extracted=literalAfter(code,marker,from),table=vm.runInNewContext('('+extracted.expression+')',{v:'{publicVersion}',c:'{engineVersion}',r:'{regressionVersion}'},{timeout:1000});
  const values=shape==='locale'?Object.fromEntries((Array.isArray(table.es)?table.es:[table.es]).map((v,i)=>[String(i),v])):shape==='columns'?Object.fromEntries(Object.entries(table).map(([key,v])=>[key,v[index]])):shape==='prefixes'?Object.fromEntries(table.map(([key,v])=>[key,v.es])):Object.fromEntries(Object.entries(table).map(([key,v])=>[key,v.es]));
  add('i18n.js',name,values,'function-local-es-template-reuse',{sourceLine:extracted.line,...extra});
 }
 local('reviewed-ui',' const reviewed=',{after:'function localizedUiTemplate',shape:'columns'});
 local('option-item-effect-fragments',' const itemEffectSuffix=',{after:'function translateOptions',shape:'locale'});
 local('option-ability-status',' const abilityStatusLabels=',{after:'function translateOptions',shape:'locale'});
 local('option-move-status',' const moveStatusLocalized=',{after:'function translateOptions'});
 local('dynamic-stat-names',' const statNames=',{after:'function localizedDynamicControl',shape:'columns'});
 local('dynamic-roles',' const roles=',{after:'function localizedDynamicControl',shape:'columns'});
 local('dynamic-stat-kinds',' const kinds=',{after:'function localizedDynamicControl',shape:'columns'});
 local('dynamic-stat-extra-labels',' const labels=',{after:'const extra=normalized.match',shape:'columns'});
 local('form-labels',' const formLabels=',{after:'function localizedProvisionalForm'});
 local('form-additional-labels',' const additionalFormLabels=',{after:'function localizedProvisionalForm'});
 local('regional-prefixes',' const prefix=',{after:'function localizedProvisionalForm',shape:'prefixes'});
 local('mega-prefix',' const prefix=',{after:'function localizedMegaForm',shape:'locale'});
 local('battlefield-heading-fragments','const battlefieldHeadings=',{shape:'locale'});
 local('damage-range-suffix','const damageRangeSuffix=',{shape:'locale'});
 const staticCount=records.length;
 for(const [id,input]of DYNAMIC_CASES){
  const text=c.__ui.text(input),englishReference=c.__ui.english(input);
  add('i18n.js','dynamic-template',{[id]:text},'executed-dynamic-template',{templateId:id,canonicalInput:input,englishReference,outputVerified:true,inventoryUnit:'one sampled renderer branch, not every possible output'});
 }
 const dynamicRendererRegistry=Array.from(c.ChlohaEsLaUi.dynamicTemplates||[],({id,pattern})=>{
  const regex=new RegExp(pattern),witnesses=DYNAMIC_CASES.filter(([,input])=>regex.test(input)).map(([caseId,input])=>({caseId,input,output:c.__ui.text(input)}));
  return {id,pattern,witnesses,coveredByWitness:witnesses.length>0};
 });
 const warnings={feedback:['stale','attachmentUnavailable','requiredCategory','requiredDescription','tooLong','emailError','attachmentError','challengeRequired','challengeError','failure','unavailable','rateLimited','conflict','errorSummary'],quality:['missing','invalidStats','budget','budgetAtt','budgetDef','error'],persistence:['storageUnavailable'],brand:['scopeNotices'],portrait:['unavailable'],'release-copy':['unsupported'],'result-dom-label':['battle-no-calculation','battle-stale','battle-fainted','battle-invalid-damage','battle-stale-undo','invalid-input']};
 const gaps=[];
 for(const record of records){
  record.sourceUrl='https://github.com/Kurohanolu/chloha-damage-lab/blob/feature/v110-es-la-localization/'+record.source;record.checkedAt='2026-11-15';record.targetGame=null;
  record.warningOrError=!!(record.group==='authored-errors'||warnings[record.group]?.includes(record.canonicalKey)||/unverified|unsupported|not verified|not guaranteed|cannot|not supported|not available|provisional|Check your inputs|warning|error|verification|mismatch/i.test(record.canonicalKey)||/未対応|未検証|未照合|エラー|範囲外|予測と不一致|検証されていません/.test(record.canonicalInput||'')||record.group==='esLaUiCopy'&&['能力ポイントは0〜32の整数で入力してください','能力ポイント合計は66以内','攻撃側の能力ポイント合計は66以内','防御側の能力ポイント合計は66以内','計算未対応'].includes(record.canonicalKey));
  if(record.outputVerified){
   const reasons=[];
   if(/[\u3040-\u30ff\u3400-\u9fff]/u.test(record.text))reasons.push('Japanese/CJK remains in executed ES-LA UI output.');
   if((record.witnesses||[]).some(witness=>/[\u3040-\u30ff\u3400-\u9fff]|\{\w+\}/u.test(witness.text)))reasons.push('A real wrapped renderer witness retains Japanese or an unresolved template slot.');
   if(/\{\w+\}/u.test(record.text))reasons.push('An authored template slot remains unresolved in executed ES-LA UI output.');
   if(record.text===record.englishReference&&!neutral.has(record.text.trim())&&record.text!==record.gameNameReference?.expectedEsLA)reasons.push('Executed ES-LA output equals English fallback; no regional UI translation established.');
   if(reasons.length){record.status='unverified';record.remainingGap=reasons;gaps.push({id:record.id,input:record.canonicalInput,output:record.text,reasons});}
  }
  // Source templates can intentionally contain old Spanish names. Preserve the
  // raw template and also expose the rendered ES-LA variant when a key resolves.
  if(record.group==='exact-ui')record.renderedText=c.ChlohaEsLaUi.text(record.canonicalKey,record.canonicalKey);
 }
 assert.equal(new Set(records.map(r=>r.id)).size,records.length,'Unique source-site identities');
 const groups=Object.fromEntries([...new Set(records.map(r=>r.group))].map(group=>[group,records.filter(r=>r.group===group).length]));
 // Hash only authored source modules. The generated names file embeds this
 // inventory's coverage and would create a circular regeneration dependency.
 delete hashes['locale-es-la-data-v110.js'];
 read('docs/data/v110-es-la-source-records.json');
 const manifest={schemaVersion:2,locale:'es-LA',browserLocale:'es-419',date:'2026-11-15',scope:'Static source-key sites plus explicitly sampled dynamic renderer branches. Counts overlap across aliases/templates and game-name references; they are not deduplicated semantic phrases, all possible output strings, or official terminology confirmation.',counts:{enumeratedRecords:records.length,warningOrErrorSubset:records.filter(r=>r.warningOrError).length,originalScopedRecords:initialScopedCount,additionalStaticSites:staticCount-initialScopedCount,dynamicTemplateBranches:DYNAMIC_CASES.length,provisional:records.filter(r=>r.status==='provisional').length,unverified:records.filter(r=>r.status==='unverified').length,official:0,groups},sourceSha256:hashes,policyReasonInventory:{registeredReasons:policyReasons.length,authoredReasons:Object.keys(c.ChlohaEsLaUi.reasons).length,unmappedPolicyReasons},dynamicRendererRegistry,remainingGaps:gaps,remainingScopeLimits:[
  'Dynamic branches are represented by concrete witness inputs; arbitrary values and every branch combination are not exhaustively enumerated.',
  'Static markup and JavaScript DOM-template literals in index.html are not independently exhaustively parsed; the canonical dictionaries and browser tests cover their known rendered paths.',
  'Function-local literal extraction uses explicit checked anchors, not a general JavaScript AST; new unnamed translation tables require an inventory update.',
  'UI wording remains provisional authored/reused copy. Game-name verification is tracked in the separate canonical source ledger.',
  'A warning/error flag is an explicit-plus-pattern classification; it is not a proof that every warning in the application has been enumerated.'
 ],records};
 return JSON.parse(JSON.stringify(manifest));
}
if(require.main===module){const manifest=buildInventory(),content=JSON.stringify(manifest,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path.join(root,target),'utf8'),content,'UI inventory is stale; run scripts/v110-es-la-ui-inventory.cjs');else fs.writeFileSync(path.join(root,target),content);console.log(JSON.stringify({status:'PASS',...manifest.counts,remainingGaps:manifest.remainingGaps.length},null,2));}
module.exports={buildInventory,DYNAMIC_CASES,DOM_LABEL_CASES,literalAfter};
