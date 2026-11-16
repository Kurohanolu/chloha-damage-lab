'use strict';
// Deterministic ES-LA name compilation. Display availability is not verification.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const sourceFile='docs/data/v110-es-la-source-records.json';
const source=JSON.parse(read(sourceFile)),html=read('index.html'),i18n=read('i18n.js');
const context=vm.createContext({});vm.runInContext('window=globalThis',context);
for(const file of ['names-v0179.js','names-ja-en.js','names-catalog-v0179.js','names-forms-v0179.js','locale-names-pokeapi-v0183.js','locale-form-species-v0183.js','locale-names-v0183.js','battle-data-v0184.js','ability-data-v0184.js'])vm.runInContext(read(file),context,{filename:file});
const pokemon=JSON.parse(html.match(/const ChlohaPokemonDB = (\{.*?\});\s*const ChlohaMovesDB/s)[1]).pokemon;
const moves=JSON.parse(html.match(/const ChlohaMovesDB = (\{[^\n]+\});/)[1]).moves;
const types=JSON.parse(i18n.match(/const localizedTypeNames=(\{[^;]+\});/)[1]);
const names=context.ChlohaNames,bulk=context.ChlohaPokeAPILocalizedNames,curated=context.ChlohaLocalizedNames;
const fold=value=>String(value||'').normalize('NFKC').trim().toLocaleLowerCase('und');
const identity=value=>fold(value).replace(/[^a-z0-9]/g,'');
const gameEnglish=value=>String(value||'').replace(/^(.+)-Mega(?:-([XYZ]))?$/i,(_,name,affix)=>'Mega '+name+(affix?' '+affix:''));
const entries={pokemon:{},moves:{},abilities:{},items:{},types:{},forms:{},natures:{},stats:{}};
const matchedRecords=new Map(),candidateMatches=new Map(),conflicts=[];
const row=(category,key)=>{
 const exact={...bulk[category]?.[key],...curated[category]?.[key]};
 if(Object.keys(exact).length)return exact;
 // Existing Japanese keys sometimes differ only by full-width digits/Latin letters.
 // NFKC exact canonical spelling is allowed only when it has one unique match.
 const variants=Object.keys(bulk[category]||{}).filter(candidate=>fold(candidate)===fold(key));
 return variants.length===1?bulk[category][variants[0]]:{};
};
const exactCandidates=(category,english,es)=>source.records.filter(record=>{
 if(record.category!==category)return false;
 // A known identity outranks spelling agreement: the same regional label must
 // never merge two different entities. Only sources without a canonical English
 // identity may use the existing exact Spanish-name match.
 if(record.canonicalEnglish&&english)return identity(gameEnglish(record.canonicalEnglish))===identity(english);
 return !!es&&!!record.sourceEs&&fold(record.sourceEs)===fold(es);
});
function add(category,key,{ja=key,en='',es='',canonicalIds=[],form=false}={}){
 assert.equal(entries[category][key],undefined,'duplicate canonical key '+category+'/'+key);
 const candidates=exactCandidates(category,en,es);
 if(form)candidates.push(...exactCandidates('forms',en,es));
 for(const record of candidates){const matches=candidateMatches.get(record.id)||[];if(!matches.some(match=>match.category===category&&match.key===key))matches.push({category,key});candidateMatches.set(record.id,matches);}
 const rank=record=>record.status==='official'&&record.officialChampions===true?4:record.status==='verified-secondary'&&record.targetGame==='Pokémon Champions'?3:record.status==='official'?2:record.status==='verified-secondary'?1:record.status==='provisional'&&record.ownerSelected===true&&record.verificationScope==='owner-selected-provisional-name'&&!record.officialChampions?0.5:0;
 // An observed abbreviation attests that short form, not an unobserved full
 // display name. Keep it searchable without upgrading the full-name coverage.
 const displayCandidates=candidates.filter(record=>record.nameForm!=='abbreviation');
 const priority=Math.max(0,...displayCandidates.map(rank));
 const selected=displayCandidates.filter(record=>priority>0&&rank(record)===priority);
 const spellings=[...new Set(selected.map(r=>r.esLA.toLocaleLowerCase('es-419')))];
 if(spellings.length>1)conflicts.push({category,key,spellings,recordIds:selected.map(r=>r.id)});
 assert.ok(spellings.length<=1,'unresolved source spelling conflict '+category+'/'+key+': '+spellings.join(' / '));
 // Case-only differences are recorded variants. Prefer actual game-field case
 // over prose case, while genuinely different same-priority names still fail.
 const hasCaseVariants=new Set(selected.map(r=>r.esLA)).size>1;
 const chosen=(hasCaseVariants&&selected.find(r=>r.verificationScope==='owner-provided-game-capture-name-only'))||selected[0];
 const result={name:chosen?.esLA||es||en||ja,ja,en,es,canonicalIds:[...new Set(canonicalIds)],status:chosen?.status||'unverified',sourceIds:[...new Set(selected.flatMap(r=>r.sourceIds))],recordIds:selected.map(r=>r.id),relatedRecordIds:[...new Set(candidates.map(r=>r.id))],targetGame:chosen?.targetGame||null,officialChampions:!!chosen?.officialChampions,fallback:!chosen,aliases:[...new Set([es,...candidates.flatMap(r=>[r.esLA,...(r.searchAliases||[])])].filter(Boolean))]};
 const abbreviationRecords=candidates.filter(r=>r.nameForm==='abbreviation');
 if(abbreviationRecords.length)result.abbreviationEvidence=abbreviationRecords.map(r=>({recordId:r.id,name:r.esLA,sourceIds:r.sourceIds,status:r.status,officialChampions:r.officialChampions}));
 if(form)result.form=true;
 if(!chosen)result.reason=es?'Existing ES-ES display fallback; ES-LA spelling not individually attested.':'Existing English/Japanese display fallback; ES-LA spelling not individually attested.';
 if(chosen?.verificationScope)result.verificationScope=chosen.verificationScope;
 // Preserve the historical single scope while retaining every selected
 // attestation scope in the full audit; runtime names remain compact.
 const verificationScopes=[...new Set(selected.map(record=>record.verificationScope).filter(Boolean))];
 if(verificationScopes.length)result.verificationScopes=verificationScopes;
 for(const record of selected){const keys=matchedRecords.get(record.id)||[];keys.push({category,key});matchedRecords.set(record.id,keys);}
 entries[category][key]=result;
 return result;
}
const formPrefixes=vm.runInNewContext('('+html.match(/const formPrefixes=(\{[\s\S]*?\n \});/)[1]+')');
const formLabels=vm.runInNewContext('('+html.match(/const formLabels=(\{[\s\S]*?\n \});/)[1]+')');
function speciesEs(p){
 const direct=row('pokemon',p.id).es;if(direct)return direct;
 const derived=context.ChlohaFormSpeciesBases[p.id];if(!derived)return '';
 const raw=p.name,prefix=Object.keys(formPrefixes).find(k=>raw.startsWith(k)&&raw.length>k.length),suffix=raw.match(/\(([^)]+)\)$/)?.[1]||null;
 const base=derived.base?.es;if(!base)return '';
 const label=suffix?(formLabels[suffix]?.es||suffix):'',affix=raw.match(/[XYZ]$/)?.[0]||'';
 const withForm=base+(affix?' '+affix:'')+(label?' ('+label+')':'');
 return !prefix?withForm:prefix==='メガ'?formPrefixes[prefix].es+withForm:withForm+' '+formPrefixes[prefix].es.trim();
}
for(const p of pokemon){
 const isForm=!!context.ChlohaFormSpeciesBases[p.id];
 const record=add('pokemon',p.id,{ja:p.name,en:names.pokemon[p.id]||row('pokemon',p.id).en,es:speciesEs(p),canonicalIds:[p.id],form:isForm});
 if(isForm)entries.forms[p.id]={...record};
}
const auditedMoves=vm.runInNewContext('('+html.match(/const auditedMoveNames=(\{[\s\S]*?\n \});/)[1]+')');
for(const move of moves)add('moves',move.name,{en:names.moves[move.name]||row('moves',move.name).en,es:auditedMoves[move.name]?.es||row('moves',move.name).es,canonicalIds:[move.id]});
const abilityIds=new Map();
for(const [id,value] of Object.entries(context.ChlohaAbilityData.ABILITY_CATALOG))abilityIds.set(value.ja,[id]);
const defensive=vm.runInNewContext('('+html.match(/const defensiveAbilities=(\{[^;]+\});/)[1]+')');
for(const [ja,id] of Object.entries(defensive))abilityIds.set(ja,[...new Set([...(abilityIds.get(ja)||[]),id])]);
for(const p of pokemon)for(const ja of p.abilities||[])if(!abilityIds.has(ja))abilityIds.set(ja,['unsupported:'+ja]);
for(const [ja,ids] of abilityIds){
 const definition=Object.values(context.ChlohaAbilityData.ABILITY_CATALOG).find(record=>record.ja===ja);
 // The legacy name cache incorrectly aliases this distinct Champions ability to Aura Break.
 // Preserve all existing dictionaries, but do not import that mapping as ES-LA evidence.
 const explicitChampionsIdentity={'はどうのぼうご':'Aura Guard','うなぎのぼり':'Eelevate'}[ja];
 add('abilities',ja,{en:explicitChampionsIdentity||definition?.en||names.abilities[ja]||row('abilities',ja).en,es:explicitChampionsIdentity?'':row('abilities',ja).es,canonicalIds:ids});
}
const itemIds=new Map();
for(const selectId of ['attItem','defItem']){
 const select=html.match(new RegExp('<select id="'+selectId+'">([\\s\\S]*?)<\\/select>'))[1];
 for(const option of select.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)){
  if(['none','autoResistBerry'].includes(option[1]))continue;
  itemIds.set(option[2].replace(/（.*$/,''),[option[1]]);
 }
}
// These named berries are supported by the engine contract, including automatic selection.
for(const id of Object.keys(context.ChlohaBattleData.RESIST_BERRIES)){
 const expected=id.replace(/([a-z])([A-Z])/g,'$1 $2');
 const matches=Object.entries(names.items).filter(([,en])=>identity(en)===identity(expected));
 assert.equal(matches.length,1,'unique named berry '+id);
 itemIds.set(matches[0][0],[id]);
}
for(const [ja,ids] of itemIds)add('items',ja,{en:names.items[ja]||row('items',ja).en,es:row('items',ja).es,canonicalIds:ids});
for(const [ja,value] of Object.entries(types))add('types',ja,{en:value.en,es:value.es,canonicalIds:[ja]});
const formOptions={
 'コンバット種（かくとう）':{en:'Combat Breed (Fighting)',es:'Raza Combatiente (Lucha)',id:'combat'},
 'ブレイズ種（ほのお）':{en:'Blaze Breed (Fire)',es:'Raza Ardiente (Fuego)',id:'blaze'},
 'ウォーター種（みず）':{en:'Aqua Breed (Water)',es:'Raza Acuática (Agua)',id:'aqua'},
 'まんぷくもよう（でんき）':{en:'Full Belly Mode (Electric)',es:'Forma Saciada (Eléctrico)',id:'full'},
 'はらぺこもよう（あく）':{en:'Hangry Mode (Dark)',es:'Forma Voraz (Siniestro)',id:'hangry'}
};
for(const [ja,value] of Object.entries(formOptions)){
 const record=add('forms',ja,{en:value.en,es:value.es,canonicalIds:[value.id]});
 // The form label remains unverified; the parenthesized type uses its own attestation.
 record.name=record.name.replace('(Lucha)','('+entries.types['かくとう'].name+')');
}
const natures={まじめ:['Serious','Seria'],いじっぱり:['Adamant','Firme'],ひかえめ:['Modest','Modesta'],ようき:['Jolly','Alegre'],おくびょう:['Timid','Miedosa'],ずぶとい:['Bold','Osada'],おだやか:['Calm','Serena'],わんぱく:['Impish','Agitada'],しんちょう:['Careful','Cauta'],ゆうかん:['Brave','Audaz'],れいせい:['Quiet','Mansa']};
for(const [ja,[en,es]] of Object.entries(natures))add('natures',ja,{en,es,canonicalIds:[ja==='まじめ'?'neutral':en.toLowerCase()]});
const stats={HP:['HP','PS'],こうげき:['Attack','Ataque'],ぼうぎょ:['Defense','Defensa'],とくこう:['Special Attack','Ataque Especial'],とくぼう:['Special Defense','Defensa Especial'],すばやさ:['Speed','Velocidad']};
for(const [ja,[en,es]] of Object.entries(stats))add('stats',ja,{en,es,canonicalIds:[en]});
const statuses=['official','verified-secondary','provisional','unverified'];
const summarize=records=>{
 const total=records.length,counts=Object.fromEntries(statuses.map(status=>[status,records.filter(row=>row.status===status).length]));
 return {total,...counts,officialChampions:records.filter(row=>row.officialChampions).length,displayAvailable:records.filter(row=>row.name).length,individuallyAttested:counts.official+counts['verified-secondary'],individuallyAttestedPercent:Number(((counts.official+counts['verified-secondary'])/total*100).toFixed(2)),officialPercent:Number((counts.official/total*100).toFixed(2)),officialChampionsPercent:Number((records.filter(row=>row.officialChampions).length/total*100).toFixed(2))};
};
const coverage=Object.fromEntries(Object.entries(entries).map(([category,rows])=>[category,summarize(Object.values(rows))]));
const uiInventory=JSON.parse(read('docs/data/v110-es-la-ui-inventory.json'));
const uiRows=uiInventory.records.map(record=>({...record,name:record.text}));
coverage.ui=summarize(uiRows);
coverage.warnings=summarize(uiRows.filter(record=>record.warningOrError));
// Runtime carries compact identity/provenance fields; full evidence remains in the audit JSON.
const runtimeEntries=Object.fromEntries(Object.entries(entries).map(([category,rows])=>[category,Object.fromEntries(Object.entries(rows).map(([key,value])=>[key,{name:value.name,status:value.status,sourceIds:value.sourceIds,targetGame:value.targetGame,officialChampions:value.officialChampions,fallback:value.fallback,aliases:value.aliases,canonicalIds:value.canonicalIds}]))]));
const data={schemaVersion:1,locale:'es-LA',browserLocale:'es-419',checkedAt:source.checkedAt,sourceSha256:crypto.createHash('sha256').update(read(sourceFile)).digest('hex'),sources:source.sources.map(({id,url,checkedAt,targetGame,authority})=>({id,url,checkedAt,targetGame,authority})),entries:runtimeEntries,coverage};
const unresolved=Object.entries(entries).flatMap(([category,rows])=>Object.entries(rows).filter(([,r])=>r.status==='unverified').map(([key,r])=>({category,key,canonicalIds:r.canonicalIds,ja:r.ja,es:r.es,candidate:r.name,reason:r.reason,whereToVerify:category==='pokemon'||category==='forms'?'Pokémon Champions ES-LA: Pokémon summary / form selection.':category==='moves'?'Pokémon Champions ES-LA: move selection / move summary.':category==='abilities'?'Pokémon Champions ES-LA: Pokémon ability summary.':category==='items'?'Pokémon Champions ES-LA: held-item selection / item description.':'Pokémon Champions ES-LA: corresponding battle / summary text.'})));
const report={schemaVersion:1,baselineCommit:'0b270c1452505268364659edd402209b00b28673',locale:data.locale,checkedAt:data.checkedAt,sourceSha256:data.sourceSha256,scope:{pokemon:'All registered candidate roster records, including unconfirmed game availability.',moves:'All registered move records, including unsupported mechanics.',abilities:'Union of registered roster abilities, supported attacker catalog and defender catalog.',items:'Selectable named items plus all 18 supported resistance berries; none/automatic selection are UI controls, not game items.',types:'All 18 types.',forms:'Overlaps Pokémon: 129 form records plus five form selector labels. Do not sum as unique entities.',natures:'11 nature identities used by calculator presets; display generally uses stat modifiers.',stats:'Six battle stat labels.',ui:'Reproducible source-key sites and sampled dynamic renderer branches. Overlapping aliases are not distinct semantic phrases; index.html DOM-template literals are not independently exhaustively parsed. English/Japanese output gaps remain unverified.'},coverage,entries,mappedSourceRecords:[...matchedRecords].map(([id,canonicalMatches])=>({id,canonicalMatches})),unmatchedSourceRecords:source.records.filter(r=>!matchedRecords.has(r.id)).map(r=>({id:r.id,category:r.category,esLA:r.esLA,canonicalMatches:candidateMatches.get(r.id)||[],selectionReason:candidateMatches.has(r.id)&&r.nameForm==='abbreviation'?'abbreviation-only-evidence':candidateMatches.has(r.id)?'superseded-by-higher-priority-evidence':'no-runtime-canonical-match',reason:candidateMatches.has(r.id)&&r.nameForm==='abbreviation'?'Observed short form retained as alias-only evidence; full display-name coverage is not promoted.':candidateMatches.has(r.id)?'Canonical identity matched; higher-priority evidence selected. This attestation remains in relatedRecordIds and aliases.':'Not present in declared runtime inventory or no exact canonical spelling match.'})),conflicts,unresolved};
const table=Object.entries(coverage).map(([category,c])=>`| ${category} | ${c.total} | ${c.official} | ${c['verified-secondary']} | ${c.provisional} | ${c.unverified} | ${c.individuallyAttestedPercent}% | ${c.officialPercent}% | ${c.officialChampions} (${c.officialChampionsPercent}%) |`).join('\n');
report.uiInventory={...uiInventory,sha256:crypto.createHash('sha256').update(read('docs/data/v110-es-la-ui-inventory.json')).digest('hex')};
const markdown=`# Singularity v1.1.0 ES-LA translation coverage\n\nChecked: ${data.checkedAt}. Baseline: \`${report.baselineCommit}\`. Rebuild with \`node scripts/v110-es-la-coverage.cjs\`; verify generated bytes with \`--check\`.\n\n## Meaning of the counts\n\nNames are tied to existing canonical IDs. \`official\` means the exact spelling is attested in official material within the stated scope (Champions, Z-A, or the generic official Pokémon franchise), including visually reviewed owner-provided game captures. Capture evidence verifies visible system wording only; it does not establish damage accuracy, mechanics support or physical-device testing of this calculator. The final column separately counts official Champions evidence; the same counts and percentages are preserved in the JSON. \`verified-secondary\` means a named third-party source attests it for the stated game; Z-A evidence does not establish Champions correctness. Existing ES-ES/English fallback remains \`unverified\`. No omitted Pokéxperto term is counted as agreement. General UI wording is authored software copy and is not game terminology.\n\n| Category | Total | Official | Secondary | Provisional | Unverified | Individually attested | Official rate | Official Champions |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n${table}\n\nThe UI denominator is ${coverage.ui.total} source-key/template sites, including ${uiInventory.counts.dynamicTemplateBranches || 0} sampled dynamic renderer branches; the warning/error denominator is its ${coverage.warnings.total} flagged sites. ${coverage.ui.provisional} UI sites contain provisional authored/reused copy and ${coverage.ui.unverified} remain unverified. Executed English or Japanese fallbacks are recorded in the inventory's remainingGaps and are not counted as completed ES-LA UI. Game-name verification remains separate. UI and warning counts overlap, and aliases/source sites are not deduplicated semantic-key totals. Rebuild the UI inventory first with \`node scripts/v110-es-la-ui-inventory.cjs\`; its source hashes and actual renderer witnesses are checked by \`tests/v110-ui-inventory.cjs\`. The inventory explicitly retains limits for unparsed index.html DOM-template literals, arbitrary dynamic combinations and new unnamed tables.\n\nEvery inventoried name has a display fallback. That display availability is **not** ES-LA translation completion. The form category overlaps Pokémon records. Items count actual supported identities, not thousands of unrelated entries in the upstream name cache. Generic no-item/automatic-berry controls belong to UI.\n\n## Traceable inventory\n\nThe complete unresolved list (canonical ID, Japanese, ES-ES, displayed candidate, reason and location to check) is in [v110-es-la-coverage.json](data/v110-es-la-coverage.json). The same file records selected source records and unselected records. For compatibility, the latter remain under unmatchedSourceRecords, with canonicalMatches and selectionReason distinguishing lower-priority evidence from actual missing runtime identities. [Source records](data/v110-es-la-source-records.json) preserve the source URLs, dates, target game and independent numeric namespaces.\n\nSelection priority for the same canonical identity is official Champions, explicit secondary Champions, official non-Champions material, then secondary Z-A. Generic franchise spelling evidence is explicitly labeled Generic Pokémon franchise and never counts as Champions verification. Explicit owner-selected provisional names rank below every verified source and above an unverified fallback; they remain provisional and never count as official or independently attested. Newer game-specific Champions terminology can differ from Z-A even when the latter is official. Conflicting spellings at the chosen evidence level fail the generator, except exact case-only variants; the observed game-field case takes precedence over prose case. Abbreviation-only attestations remain separate from full display-name evidence. An explicit canonical English identity must match even when the ES-ES spelling happens to agree; a translated label cannot override a known identity mismatch. Searches may retain both regional spellings as aliases; translated strings never become calculation IDs.\n\n## Remaining limitations\n\nThe [fifth-batch Pokédex manifest](data/v110-es-la-official-pokedex-batch5.json) adds 225 exact existing species names as generic official Latin American publication evidence, with one overlapping Z-A corroboration. Display names and aliases do not change; Champions confirmation does not increase. Numbered names were retrieved from the official /el/pokedex search index, not direct HTML. The official es-MX press site explicitly links Pokemon.com/LATAM to /el; the Pokédex-specific footer and current rendered page were not retrieved. No forms, mechanics, availability, ability names or type names are inferred.\n\nThe [Expert Belt capture manifest](data/v110-es-la-expert-belt-capture.json) confirms Cinturón de Experto for the existing expertBelt identity and retains Cinta Experto as a search alias. Six other visible names add one corroboration and five off-runtime references without changing the denominator. Earlier checkpoints below remain historical.\n\nThe [fourth-batch official-publication manifest](data/v110-es-la-official-publications-batch4.json) adds only directly observed names with existing canonical IDs. Champions, Z-A and generic franchise scopes remain distinct; names and aliases are unchanged. Prior capture checkpoints below are historical.\n\nThe current source collection cannot establish every registered term as official Champions ES-LA. The additive [third-batch manifest](data/v110-es-la-owner-captures-batch3.json) and [seven-ability audit](v110-es-la-owner-abilities-batch3.md) extend the private capture total to 27. All seven new captures match existing translation IDs: three supported calculation abilities and four roster-only unsupported identities. Five names gain official Champions status and two add corroboration; no names, aliases or mechanics change. The 32757 hash was corrected from the original private bytes. The following first/second-batch counts remain historical and exclude these seven new witnesses. The immutable [first-batch manifest](data/v110-es-la-owner-captures.json) and additive [second-batch manifest](data/v110-es-la-owner-captures-batch2.json) identify all 20 privately retained, visually reviewed screenshots. The first batch has 65 distinct system terms (41 registered); the second has 58 (56 registered, including three abbreviation-only witnesses). Across batches there are 109 distinct system-name identities, 84 registered and 25 off-runtime; repeated images, form overlap and prior attestations do not increase the denominator. Six editable party-name labels remain context only. Baya Anjiro is excluded from the clipped first-batch row but accepted from the fully visible second-batch row. Expl. Metálica, At. Esp. and Def. Esp. are recorded as short-form evidence and aliases without promoting unseen full names. Firme adopts the observed initial capital; Floette (Flor Eterna) retains existing display punctuation while its unparenthesized joined form is searchable. Game UI labels do not upgrade authored software UI. See [the 20-image audit](v110-es-la-owner-screenshot-evidence.md) for per-image bindings, effects, before/after counts and unresolved scope. No additional owner screenshots are requested. The full coverage entries retain the union of selected verification scopes while the historical singular scope remains compatible. Unverified fallback remains disclosed in the ES-LA product notice. Existing nine-language dictionaries and calculation data are not modified by this generated name layer.\n`;
const outputs={
 'locale-es-la-data-v110.js':'/* Generated ES-LA names/provenance. Do not edit; run scripts/v110-es-la-coverage.cjs. */\n\'use strict\';\nconst ChlohaEsLaData='+JSON.stringify(data)+';\nif(typeof module!==\'undefined\'&&module.exports)module.exports=ChlohaEsLaData;\nif(typeof globalThis!==\'undefined\')globalThis.ChlohaEsLaData=ChlohaEsLaData;\n',
 'docs/data/v110-es-la-coverage.json':JSON.stringify(report,null,2)+'\n',
 'docs/v110-es-la-translation-coverage.md':markdown
};
for(const [file,content] of Object.entries(outputs)){
 if(process.argv.includes('--check'))assert.equal(read(file),content,'Generated ES-LA evidence is stale: '+file);
 else fs.writeFileSync(path.join(root,file),content);
}
console.log(JSON.stringify({status:'PASS',sourceRecords:source.records.length,mappedSourceRecords:matchedRecords.size,coverage},null,2));
