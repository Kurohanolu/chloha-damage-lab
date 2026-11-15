'use strict';
// Execute the real renderer without a browser; compare all legacy outputs to
// the immutable release and exercise concrete variable values/source recovery.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {DYNAMIC_CASES}=require('../scripts/v110-es-la-ui-inventory.cjs');
const root=path.resolve(__dirname,'..'),baseline='0b270c1452505268364659edd402209b00b28673';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const previous=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const files=['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-pokeapi-v0183.js','locale-form-species-v0183.js','locale-names-v0183.js','locale-registry.js','locale-catalog.js','locale-es-la-data-v110.js','locale-es-la-v110.js','locale-ui-es-la-v110.js'];
function context(source){
 const c=vm.createContext({document:{readyState:'loading',addEventListener(){}},localStorage:{getItem:()=>null}});c.window=c;
 for(const file of files)vm.runInContext(read(file),c,{filename:file});
 const anchor='function initialize(){';assert.equal(source.split(anchor).length,2);
 vm.runInContext(source.replace(anchor,`window.__ui={text:localizedUi,normalize:normalizeFreshLocaleText,english:translateRuntime,types:localizedTypeNames,tables:[dictionary,selectLabels,attributeLabels,uiTerms,nativeOptionTranslations,expandedSettingsTranslations,expandedLongTextTranslations,expandedPanelTranslations,localeUiPhrases,screenshotLocalePhrases,localizedControlPhrases,localizedItemOptionPhrases,localizedPlateOptions,localizedTypeNames,battlefieldNames],set(value){locale=value}};${anchor}`),c,{filename:'i18n.js'});
 return c;
}
const now=context(read('i18n.js')),old=context(execFileSync('git',['show',baseline+':i18n.js'],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}));
const cases=[...DYNAMIC_CASES,
 ['hp-ratio','HP依存威力: 73/181 → 60'],['hp-power-prefix','HP依存威力: 威力 150'],
 ['last-respects','おはかまいり: 威力 250'],['gyro-ball','ジャイロボール: 威力 101'],['stored-power','アシストパワー: 威力 140'],
 ['rage-fist','ふんどのこぶし: 被攻撃回数 3 → 威力 200'],['final-two-hit','最終ダメージ（乱数100・2発合計）: 278'],
 ['multi-hit-ko','現在HPに対する連続技合計KO率: 12.50%'],['critical-blocked','確定急所: 防御側の急所無効特性により急所補正なし'],
 ['charge-rain','攻撃前の特攻+1段階を自動反映（入力ランクは使用前）。雨のため即時攻撃。'],
 ['charge-turn','攻撃前の特攻+1段階を自動反映（入力ランクは使用前）。溜めターン後の攻撃。'],
 ['physical-shell','シェルアームズ: 物理・特殊の能力比を比較し、物理方式を採用（同値は特殊）。'],
 ['special-shell','シェルアームズ: 物理・特殊の能力比を比較し、特殊方式を採用（同値は特殊）。'],
 ['history-hp','2手目：じしん（じめん / 100）［基本ダメージのみ・実機未照合］ / 87ダメージ / HP 156→69'],
 ['history-estimated','1手目：エレキボール（でんき / 可変）［計算試算・実機未照合］ / 100ダメージ / HP 200→100'],
 ['history-unsupported','1手目：じしん（じめん / 100）［計算未対応］ / 0ダメージ / HP 200→200'],
 ['history-localized-collision','1手目：Carámbano (Hielo / 85) [Estimado; sin verificar en consola] / 100ダメージ / HP 200→100'],
 ['confirmation-hp','じしん（じめん / 100）［基本ダメージのみ・実機未照合］を確定。相手HP 69 / 200、フィールド：なし'],
 ['hp-chip','HP 0'],['result-eyebrow','DAMAGE ESTIMATE'],['image-failure','画像未登録'],
 ['multi-hit-distribution-heading','連続技の合計ダメージ（各値の発生確率）'],
 ['multi-hit-ko-reference','命中・連続ヒットを含むKO率を参照'],['manual-move','手入力技'],
 ['manual-history','1手目：手入力技 / 100ダメージ / HP 200→100'],
 ['manual-confirmation','手入力技を確定。相手HP 100 / 200、フィールド：なし'],
 ['fainted-hits','ひんし（HP 0）'],['immune-hits','無効'],['guaranteed-one-hit','確定1発']
];
const historyStatuses={ja:['計算未対応','基本ダメージのみ・実機未照合','計算試算・実機未照合'],en:['Unsupported','Basic damage only; unverified','Estimated; not hardware-verified'],fr:['Non pris en charge','Dégâts de base uniquement ; non vérifié','Estimation ; non vérifiée'],de:['Nicht unterstützt','Nur Grundschaden; ungeprüft','Schätzung; ungeprüft'],es:['No compatible','Solo daño básico; sin verificar','Estimado; sin verificar'],it:['Non supportato','Solo danno base; non verificato','Stima; non verificata'],ko:['미지원','기본 데미지만; 미검증','추정치; 미검증'],'zh-Hans':['暂不支持','仅基础伤害；未经验证','估算；未经验证'],'zh-Hant':['暫不支援','僅基礎傷害；未經驗證','估算；未經驗證']};
const variable={ja:'可変',en:'Variable',fr:'Variable',de:'Variabel',es:'Variable',it:'Variabile',ko:'가변','zh-Hans':'可变','zh-Hant':'可變'};
for(const locale of previous)for(const [i,status]of historyStatuses[locale].entries()){
 const row=now.ChlohaLocalizedNames.moves['エレキボール']||now.ChlohaPokeAPILocalizedNames.moves['エレキボール'];
 const move=locale==='ja'?'エレキボール':row[locale]||row.en,type=locale==='ja'?'でんき':now.__ui.types['でんき'][locale]||'Electric';
 cases.push(['native-history-'+locale+'-'+i,`1手目：${move} (${type} / ${variable[locale]}) [${status}] / 100ダメージ / HP 200→100`]);
}
for(const [i,reason]of Object.keys(now.ChlohaEsLaUi.reasons).entries()){
 cases.push(['reason-'+i,reason],['audit-'+i,'技監査 P1：'+reason],['special-note-'+i,'特殊能力値参照技：'+reason+'。攻撃ランク欄は参照能力のランクとして扱います。']);
}
for(const [i,error]of Object.keys(now.ChlohaEsLaUi.errors).entries())cases.push(['error-'+i,error],['wrapped-error-'+i,'入力エラー: '+error]);
const modifiers=[...read('damage-engine-v0184.js').matchAll(/register(?:Fixed)?Modifier\('([^']+)','([^']+)'/g)].map(m=>[m[1],m[2]]);
for(const [layer,id]of modifiers)cases.push(['modifier-'+layer+'-'+id,layer+'/'+id+': 123 → 151']);
cases.push(['combined-modifiers','stat/purePower+choiceBand: 123 → 369']);
const kana=/[\u3040-\u30ff\u3400-\u9fff]/u,numbers=value=>value.match(/\d+(?:\.\d+)?/g)||[];
let regionalCases=0,roundtrips=0;
for(const [id,input]of cases){
 now.__ui.set('es-LA');const output=now.__ui.text(input);
 assert.ok(!kana.test(output),id+': Japanese remains: '+output);
 if(id.startsWith('native-history-'))assert.match(output,/Electrobola \(Eléctrico \/ Variable\)/,id+': native history did not resolve its canonical move/type');
 if(now.ChlohaEsLaUi.dynamic(input)!==null){
  assert.deepEqual(numbers(output),numbers(input),id+': numeric tokens changed');
  assert.equal(now.ChlohaEsLaUi.source(output),input,id+': canonical dynamic source lost');
  for(const target of ['en','es','ja','es-LA']){
   const recovered=now.ChlohaEsLaUi.source(output);now.__ui.set(target);
   assert.equal(now.__ui.text(recovered),now.__ui.text(input),id+': roundtrip to '+target);roundtrips++;
  }
  regionalCases++;
 }
}
// Canonical IDs and false-positive guards: never translate arbitrary mentions.
for(const unknown of ['Dragon Darts in user notes','Earthquake Ltd.','stat/userSuppliedAbility: 12 → 20','HP is a company name','選択中：未知の文字列'])assert.equal(now.ChlohaEsLaUi.dynamic(unknown),null,unknown);
now.__ui.set('es-LA');assert.match(now.__ui.text('アクロバット: 持ち物 なし（威力2倍）'),/^Acrobacia:/);assert.match(now.__ui.text('エレキボール: 素早さ 123 \/ 62 → 威力 80'),/^Electrobola:/);
assert.match(now.ChlohaEsLaUi.dynamic('1手目：Carámbano (Hielo / 85) / 100ダメージ'),/^Turno 1: Carámbano \(Hielo \/ 85\)/,'Regional Spanish alias collisions must never identify another canonical move');
// A 512-entry cache must evict old values and preserve recent source recovery.
const first='HP依存威力: 10000',firstOutput=now.ChlohaEsLaUi.dynamic(first);
for(let n=10001;n<16000;n++)now.ChlohaEsLaUi.dynamic('HP依存威力: '+n);
assert.equal(now.ChlohaEsLaUi.source(firstOutput),firstOutput,'Old variable values must be evicted');
for(let n=15488;n<16000;n++)assert.equal(now.ChlohaEsLaUi.source('Potencia según los PS: '+n),'HP依存威力: '+n,'Recent 512 values retained');
assert.equal(now.ChlohaEsLaUi.source('Potencia según los PS: 15487'),'Potencia según los PS: 15487','Cache bounded to 512');
// Use the stable renderer, rather than regenerated expected strings, as oracle.
const sourceKeys=new Set(cases.map(([,input])=>input));
for(const table of now.__ui.tables)for(const [key,entry]of Object.entries(table)){sourceKeys.add(key);for(const value of typeof entry==='string'?[entry]:Object.values(entry))if(typeof value==='string')sourceKeys.add(value);}
let legacyComparisons=0;
for(const locale of previous){now.__ui.set(locale);old.__ui.set(locale);for(const input of sourceKeys){assert.equal(now.__ui.text(input),old.__ui.text(input),'Stable output changed: '+locale+'/'+input);legacyComparisons++;}}
const result={passed:true,baseline,dynamicAndStaticWitnesses:cases.length,regionalCases,roundtrips,legacyComparisons,cacheLimit:512,numericTokensPreserved:true,canonicalNamesOnly:true};
fs.mkdirSync(path.join(root,'reports/v110'),{recursive:true});fs.writeFileSync(path.join(root,'reports/v110/dynamic-ui.json'),JSON.stringify(result,null,2)+'\n');
console.log('PASS v1.1.0 dynamic ES-LA UI '+JSON.stringify(result));
