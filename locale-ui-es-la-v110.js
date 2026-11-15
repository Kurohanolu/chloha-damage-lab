/* v1.1.0 authored ES-LA UI copy. Provisional wording, not official game-name evidence.
 * These exact UI phrases extend the Spanish templates without changing the original nine locales.
 * Historical version/count notices keep their original facts when rendered. */
(function(root){
 'use strict';
 const phrases=Object.freeze({
  'Stored Power / Power Trip: attacker stat stages':'Poder Reserva / Chulería: niveles de estadísticas del atacante',
  'v0.162: 373 entries registered (including unconfirmed and unverified candidates). Hardware accuracy is unverified.':'v0.162: 373 entradas registradas, incluidas opciones sin confirmar o verificar. La precisión en consola no está verificada.',
  'v0.162 Pre-Release 1 — Limited testing':'v0.162 Pre-Release 1 — Pruebas limitadas',
  'Results have not been fully compared against Pokémon Champions hardware. The 373 entries are candidates; availability, learnsets and damage accuracy are not guaranteed. Do not use for definitive competitive decisions.':'Los resultados no se han comparado por completo con Pokémon Champions en consola. Las 373 entradas son opciones provisionales; no se garantizan su disponibilidad, los movimientos que pueden aprender ni la precisión del daño. No uses estos resultados para tomar decisiones competitivas definitivas.',
  'Record verified observed damage together with move, stats, HP, weather, terrain and other conditions. Do not include personal information or account IDs.':'Registra el daño observado y verificado junto con el movimiento, las estadísticas, los PS, el clima, el campo y las demás condiciones. No incluyas información personal ni identificadores de cuenta.',
  'v0.162 Under verification':'v0.162 En verificación',
  ': 373 registered entries. Unconfirmed Pokémon remain listed. Learnsets and hardware damage accuracy are unverified.':': 373 entradas registradas. La lista conserva Pokémon sin confirmar. Los movimientos que pueden aprender y la precisión del daño en consola no están verificados.',
  'v0.162 Development build — Accuracy not guaranteed':'v0.162 Versión de desarrollo — Precisión no garantizada',
  '373 Pokémon / 335 moves registered, including unverified candidates and roster-only entries. Learnsets, all ability/item modifiers and hardware accuracy are unverified. Do not use for definitive battle decisions.':'373 Pokémon y 335 movimientos registrados, incluidas opciones sin verificar y entradas que solo figuran en la lista. No se han verificado los movimientos que pueden aprender, todos los modificadores de habilidades y objetos ni la precisión en consola. No los uses para tomar decisiones definitivas de combate.',
  'Data verification status':'Estado de verificación de los datos',
  '373 entries registered. Individual data verification is incomplete.':'373 entradas registradas. La verificación individual de los datos está incompleta.',
  'Champions roster (GameWith)':'Lista de Pokémon en Champions (GameWith)',
  'Roster data verification is ongoing.':'La verificación de los datos de la lista continúa.',
  'Each hit of this special multi-hit move uses 90% base accuracy. Accuracy/evasion stages and modifiers from items or abilities are unsupported.':'Cada golpe de este movimiento de varios golpes usa una precisión base del 90 %. No se admiten los niveles de precisión o evasión ni sus modificadores por objetos o habilidades.',
  "Beat Up calculates each hit from the entered participants' base Attack stats. Eligibility is manual; per-hit critical hits, defensive abilities and secondary effects are unverified.":'Paliza calcula cada golpe a partir del Ataque base ingresado de los participantes. La participación se indica manualmente; los golpes críticos individuales, las habilidades defensivas y los efectos secundarios no están verificados.',
  'Check the observed damage and select Confirm move use. Terrain removal is applied on confirmation.':'Revisa el daño observado y selecciona Confirmar uso del movimiento. El campo se elimina al confirmar.',
  'Battle history cleared because attacker and defender were swapped.':'Se borró el historial de combate porque se intercambiaron el atacante y el defensor.',
  'Weather, terrain and screens were reset to None. Battle format and other settings were preserved.':'Se restablecieron el clima, el campo y las pantallas a Ninguno. Se conservaron el formato de combate y las demás opciones.',
  'This stat value cannot be reached with the current nature and 0–32 points. Disable auto-fill in Input mode to enter it manually.':'Este valor no se puede obtener con la naturaleza actual y entre 0 y 32 puntos. Desactiva el llenado automático en Modo de entrada para ingresarlo manualmente.',
  'Attacker and defender swapped. Move, weather, terrain and screens were preserved. Calculation stops if an unsupported ability or item is selected.':'Se intercambiaron el atacante y el defensor. Se conservaron el movimiento, el clima, el campo y las pantallas. El cálculo se detiene si se selecciona una habilidad o un objeto no compatible.',
  'Pokémon Champions damage calculator — experimental build (hardware accuracy unverified)':'Calculadora de daño para Pokémon Champions — Versión experimental (precisión en consola sin verificar)',
  'Experimental engine. Champions stat-point allocation is supported, but damage accuracy has not been fully verified on hardware. Some abilities, moves and items remain unsupported. Do not rely on this tool for definitive competitive decisions.':'Motor experimental. Se admite la distribución de puntos de estadísticas de Champions, pero la precisión del daño no se ha verificado por completo en consola. Algunas habilidades, movimientos y objetos aún no son compatibles. No uses esta herramienta como única base para decisiones competitivas definitivas.',
  'The 373 candidate entries include unverified data; hardware accuracy is not guaranteed. Additional forms require verification. Move learnsets are provisional and not guaranteed. Level 50 and IV 31 are fixed; actual stats are calculated from stat points (0–32 each, up to 66 total).':'Las 373 entradas provisionales incluyen datos sin verificar; no se garantiza la precisión en consola. Otras formas requieren verificación. Los movimientos que pueden aprender son provisionales y no están garantizados. Se fijan el nivel 50 y los IV en 31; las estadísticas se calculan con puntos (de 0 a 32 por estadística y hasta 66 en total).',
  '⚔ Attacker':'⚔ Atacante','🛡 Defender':'🛡 Defensor','🛡 Defender / Field':'🛡 Defensor / Campo',
  'Target Attack points for Foul Play':'Puntos de Ataque del objetivo para Juego Sucio',
  'Target Attack nature modifier':'Modificador de naturaleza del Ataque del objetivo',
  'Points for unshown stats are omitted. The entered total must not exceed 66. Blank fields count as zero. Nature modifiers apply only to the referenced stat in each field. Keep all allocations within 66 points.':'Se omiten los puntos de las estadísticas que no se muestran. El total ingresado no debe superar 66. Los campos vacíos cuentan como cero. Los modificadores de naturaleza solo se aplican a la estadística correspondiente de cada campo. Mantén la distribución total dentro de 66 puntos.',
  'Ability selection is available, but automatic calculations support only a subset. Unsupported abilities stop calculation. Mega Evolutions must be selected as separate forms. Bronzong, Porygon2 and Porygon-Z are provisional future entries. All moves can be selected, but learnsets in Champions are unverified. Some move-specific effects are supported; accuracy and secondary effects are not. Choice-item move locking and Assault Vest status-move restrictions are not simulated. Results are provisional pending audit and hardware comparison.':'Puedes seleccionar habilidades, pero el cálculo automático solo admite algunas. Las habilidades no compatibles detienen el cálculo. Las megaevoluciones se seleccionan como formas separadas. Bronzong, Porygon2 y Porygon-Z son entradas futuras provisionales. Se pueden seleccionar todos los movimientos, pero no se ha verificado cuáles pueden aprender en Champions. Se admiten algunos efectos propios de movimientos; la precisión y los efectos secundarios no. No se simulan el bloqueo de movimientos de los objetos Elección ni la restricción de movimientos de estado del Chaleco Asalto. Los resultados son provisionales, pendientes de auditoría y comparación en consola.',
  "Weather and terrain are shared by both sides. Verify grounding. Terrain power modifiers and Misty Terrain's Dragon damage reduction are supported. Priority immunity, status prevention, recovery and certain move-specific terrain effects (e.g. Terrain Pulse) are unsupported.":'El clima y el campo son comunes a ambos lados. Verifica si cada Pokémon está en el suelo. Se admiten los modificadores de potencia del campo y la reducción del daño Dragón del Campo de Niebla. No se admiten la inmunidad a movimientos con prioridad, la prevención de estados, la recuperación ni ciertos efectos del campo propios de movimientos, como Pulso de Campo.',
  'Additional multiplier applies to final damage. Avoid duplicating existing item, ability or weather modifiers.':'El multiplicador adicional se aplica al daño final. Evita duplicar los modificadores existentes de objetos, habilidades o clima.',
  'Loaded Dice (4–5 hits)':'Dado Trucado (4–5 golpes)',
  'Life Orb (damage ×1.3)':'Vidasfera (daño ×1,3)',
  'Choice Band (physical Attack ×1.5)':'Cinta Elección (Ataque físico ×1,5)',
  'Choice Specs (special Attack ×1.5)':'Gafas Elección (Ataque Especial ×1,5)',
  'Expert Belt (super-effective damage ×1.2)':'Cinta Experto (daño supereficaz ×1,2)',
  'Assault Vest (Sp. Def ×1.5)':'Chaleco Asalto (Def. Esp. ×1,5)',
  '1 ally':'1 aliado',
  'Helping Hand and Friend Guard must be entered explicitly as ally support. In doubles, at most one Friend Guard ally is supported; spread reduction applies only when multiple targets are present. Reflect Intimidate in the Attack stage (automatic activation unsupported). Ability and item support is limited. Choice-item move locking and Assault Vest status-move restrictions are not simulated. Complex ability interactions and Terastallization are unsupported except for certain move-specific effects. Only some defensive abilities with explicit activation conditions are supported.':'Refuerzo y Compiescolta se indican explícitamente como apoyo aliado. En combates dobles se admite como máximo un aliado con Compiescolta; la reducción por ataque de área solo se aplica cuando hay varios objetivos. Refleja Intimidación en el nivel de Ataque (no se admite su activación automática). La compatibilidad con habilidades y objetos es limitada. No se simulan el bloqueo de movimientos de los objetos Elección ni la restricción de movimientos de estado del Chaleco Asalto. No se admiten las interacciones complejas entre habilidades ni la teracristalización, salvo ciertos efectos propios de movimientos. Solo se admiten algunas habilidades defensivas con condiciones de activación explícitas.',
  'Chloha Official Sites — Unofficial experimental tool. Inputs are processed in your browser.':'Chloha Official Sites — Herramienta experimental no oficial. Los datos se procesan en tu navegador.',
  'Additional move name, power and type reference:':'Referencia adicional de nombres, potencia y tipos de movimientos:',
  'Defender advanced settings ':'Configuración avanzada del defensor ',
  'Attacker advanced settings ':'Configuración avanzada del atacante ',
  'The selected Pokémon is a provisional entry. Its base stats and abilities require verification.':'El Pokémon seleccionado es una entrada provisional. Sus estadísticas base y habilidades requieren verificación.',
  'Manual mode: move-specific effects remain active, but stats, types, category and power are not updated automatically. Enter the relevant stat for Body Press, Foul Play and similar moves.':'Modo manual: los efectos propios del movimiento siguen activos, pero las estadísticas, los tipos, la categoría y la potencia no se actualizan automáticamente. Ingresa la estadística correspondiente para Plancha Corporal, Juego Sucio y movimientos similares.',
  'Terrain: grounding and power modifiers are supported. Priority immunity, recovery, status and certain move effects are not supported. Hardware rounding remains unverified.':'Campo: se admiten las condiciones de contacto con el suelo y los modificadores de potencia. No se admiten la inmunidad a movimientos con prioridad, la recuperación, los estados ni ciertos efectos de movimientos. El redondeo en consola sigue sin verificarse.',
  'Steel Roller: calculation requires active terrain. Enter observed damage and confirm the move to remove terrain.':'Allanador Férreo: el cálculo requiere un campo activo. Ingresa el daño observado y confirma el movimiento para eliminar el campo.',
  'Dual Wingbeat: KO chance uses 256 independent two-hit roll combinations. Accuracy and ability changes before the second hit are unsupported.':'Ala Bis: la probabilidad de K.O. usa 256 combinaciones independientes de daño de dos golpes. No se admiten la precisión ni los cambios de habilidad antes del segundo golpe.',
  'Electro Ball power changes with Speed ratio (40/60/80/120/150). Speed modifiers other than paralysis, Tailwind and stages are unsupported.':'La potencia de Bola Voltio cambia según la proporción de Velocidad (40/60/80/120/150). No se admiten otros modificadores de Velocidad aparte de parálisis, Viento Afín y niveles de estadísticas.',
  'Guaranteed-critical moves: critical modifiers apply automatically. Interactions with critical-hit immunity abilities are unsupported.':'Movimientos de golpe crítico garantizado: el modificador de crítico se aplica automáticamente. No se admiten las interacciones con habilidades que impiden los golpes críticos.',
  'Acrobatics: power doubles only when held item is None / Not applied. Consumed-item scenarios remain unverified.':'Acróbata: la potencia se duplica solo cuando el objeto equipado es Ninguno / No aplicado. Los casos de objetos consumidos siguen sin verificarse.',
  'Same-type attack bonus (STAB) is manually disabled.':'El bono por coincidencia de tipo (STAB) está desactivado manualmente.',
  'Critical-hit exceptions and ability interactions are not hardware-verified.':'Las excepciones de golpes críticos y las interacciones con habilidades no se han verificado en consola.',
  'Calculate':'Calcular','Single target':'Objetivo único','Spread move':'Movimiento de área',
  'Poisoned / badly poisoned (Toxic Boost)':'Envenenado / gravemente envenenado (Toxic Boost)',
  'Flash Fire activated (hit by a Fire move)':'Absorbe Fuego activado (recibió un movimiento de tipo Fuego)',
  'Thermal Exchange activated (Attack +1)':'Termoconversión activada (Ataque +1)',
  'Anger Point activated (Attack +6)':'Irascible activada (Ataque +6)',
  'Rattled activated (Speed +1; no direct damage boost)':'Cobardía activada (Velocidad +1; sin aumento directo del daño)',
  'Defender / Field':'Defensor / Campo','Shared battle conditions':'Condiciones de combate comunes',
  'Reflect':'Reflejo','Light Screen':'Pantalla de Luz','Grounded':'En el suelo','Airborne':'En el aire',
  'Auto from type / ability':'Automático según tipo y habilidad','Auto from types':'Automático según los tipos',
  'Attacker max HP':'PS máximos del atacante','Attacker remaining HP':'PS restantes del atacante',
  'Relevant stat nature modifier':'Modificador de naturaleza de la estadística usada',
  'Attacker relevant stat points (0–32)':'Puntos de la estadística usada del atacante (0–32)',
  'Defender relevant stat points (0–32)':'Puntos de la estadística usada del defensor (0–32)',
  'Pokémon and move selection (v0.162)':'Selección de Pokémon y movimiento (v0.162)',
  'Pokémon selection':'Selección de Pokémon','Calculation model notes':'Notas sobre el modelo de cálculo',
  'Verification status':'Estado de verificación','Conditional power boost':'Aumento condicional de potencia',
  'Calculating at normal power':'Calculando con la potencia normal','Steel Roller: confirm use':'Allanador Férreo: confirmar uso',
  'Ally Battery (special damage ×1.3)':'Batería de un aliado (daño especial ×1,3)',
  'Ally Power Spot (damage ×1.3)':'Power Spot de un aliado (daño ×1,3)',
  'Supreme Overlord: fainted allies (0–5)':'General Supremo: aliados debilitados (0–5)',
  'Target switched in this turn (Stakeout)':'El objetivo entró por un cambio en este turno (Vigilante)',
  'Ally has opposite ability (Plus / Minus)':'Un aliado tiene la habilidad opuesta (Más / Menos)',
  'Spread move (multiple targets)':'Movimiento de área (varios objetivos)',
  'Pokémon and move selection':'Selección de Pokémon y movimiento',
  'Changing the move resets this option. Not hardware-verified.':'Cambiar el movimiento restablece esta opción. Sin verificar en consola.',
  'Set the condition manually. Checked: boosted power; unchecked: normal power.':'Indica la condición manualmente. Marcada: potencia aumentada; sin marcar: potencia normal.',
  'Attacker HP':'PS del atacante','Advanced settings':'Configuración avanzada',
  'Sun':'Sol','Rain':'Lluvia','Sandstorm':'Tormenta de arena','Snow':'Nieve',
  'Protect':'Protección','Friend Guard':'Compiescolta','Expanding Force':'Vasta Fuerza',
  'Public UI release; calculation core based on v0.162':'Versión pública de la interfaz; motor de cálculo basado en v0.162',
  'Copied to clipboard':'Copiado al portapapeles','Copy failed':'No se pudo copiar',
  'Manual mode: edit stats, types and power. Selected move effects remain active.':'Modo manual: puedes editar las estadísticas, los tipos y la potencia. Los efectos del movimiento seleccionado siguen activos.',
  'Inputs validated. Damage results updated.':'Datos validados. Se actualizaron los resultados del daño.',
  'Before random factor':'Antes del factor aleatorio','Current battlefield':'Estado actual del combate','Base stats':'Estadísticas base',
  'Check your inputs':'Revisa los datos ingresados',
  'No valid damage calculation is available.':'No hay un cálculo de daño válido disponible.',
  'The battle state has changed. Recalculate before confirming.':'El estado del combate cambió. Vuelve a calcular antes de confirmar.',
  'The target has already fainted. Cannot confirm move use.':'El objetivo ya está debilitado. No se puede confirmar el uso del movimiento.',
  'Enter observed damage as an integer from 0 to 9999.':'Ingresa el daño observado como un número entero entre 0 y 9999.',
  'HP or terrain was changed manually. Restore the state after confirmation or clear history before undoing.':'Los PS o el campo se cambiaron manualmente. Restablece el estado posterior a la confirmación o borra el historial antes de deshacer.',
  'Undid the previous turn.':'Se deshizo el turno anterior.',
  'History cleared. Current HP and terrain were preserved.':'Se borró el historial. Se conservaron los PS actuales y el campo.',
  'Target has already fainted (KO probability not applicable)':'El objetivo ya está debilitado (no corresponde calcular la probabilidad de K.O.)',
  'DAMAGE ESTIMATE':'ESTIMACIÓN DE DAÑO',
  '連続技の合計ダメージ（各値の発生確率）':'Daño total de movimientos de varios golpes (probabilidad de cada valor)',
  '命中・連続ヒットを含むKO率を参照':'Consulta la probabilidad de K.O., que incluye la precisión y los golpes consecutivos',
  '手入力技':'Movimiento ingresado manualmente',
  'ひんし（HP 0）':'Debilitado (PS 0)',
  '無効':'Inmune',
  '確定1発':'K.O. garantizado en 1 golpe',
  '画像未登録':'Imagen no disponible',
  '補正＋（1.1倍）':'Aumento (×1.1)','補正－（0.9倍）':'Reducción (×0.9)',
  'stat points':'puntos de estadísticas','nature modifier':'modificador de naturaleza','slider':'control deslizante',
  'GameWith physical moves':'Movimientos físicos de GameWith','Special moves':'Movimientos especiales',
  'Learnsets are unverified':'No se ha verificado qué movimientos puede aprender cada Pokémon',
  'Only supported moves can be calculated':'Solo se pueden calcular los movimientos compatibles',
  'roll':'valor aleatorio','Unofficial experimental tool':'Herramienta experimental no oficial',
  'Inputs are processed locally in your browser':'Los datos se procesan localmente en tu navegador',
  'Damage values and rounding order have not been verified against Pokémon Champions hardware':'Los valores de daño y el orden del redondeo no se han verificado en Pokémon Champions'
 });
 // Known game-name spans are resolved only inside their exact UI template.
 // Missing ES-LA records keep the existing Spanish name (or explicit English fallback).
 const bindings={
  'Stored Power / Power Trip: attacker stat stages':[['moves','アシストパワー','Poder Reserva'],['moves','つけあがる','Chulería']],
  'Target Attack points for Foul Play':[['moves','イカサマ','Juego Sucio']],
  'Loaded Dice (4–5 hits)':[['items','いかさまダイス','Dado Trucado']],
  'Life Orb (damage ×1.3)':[['items','いのちのたま','Vidasfera']],
  'Choice Band (physical Attack ×1.5)':[['items','こだわりハチマキ','Cinta Elección']],
  'Choice Specs (special Attack ×1.5)':[['items','こだわりメガネ','Gafas Elección']],
  'Expert Belt (super-effective damage ×1.2)':[['items','たつじんのおび','Cinta Experto']],
  'Assault Vest (Sp. Def ×1.5)':[['items','とつげきチョッキ','Chaleco Asalto']],
  'Steel Roller: confirm use':[['moves','アイアンローラー','Allanador Férreo']],
  'Poisoned / badly poisoned (Toxic Boost)':[['abilities','どくぼうそう','Toxic Boost']],
  'Flash Fire activated (hit by a Fire move)':[['abilities','もらいび','Absorbe Fuego']],
  'Thermal Exchange activated (Attack +1)':[['abilities','ねつこうかん','Termoconversión']],
  'Anger Point activated (Attack +6)':[['abilities','いかりのつぼ','Irascible']],
  'Rattled activated (Speed +1; no direct damage boost)':[['abilities','びびり','Cobardía']],
  'Reflect':[['moves','リフレクター','Reflejo']],'Light Screen':[['moves','ひかりのかべ','Pantalla de Luz']],
  'Ally Battery (special damage ×1.3)':[['abilities','バッテリー','Batería']],
  'Ally Power Spot (damage ×1.3)':[['abilities','パワースポット','Power Spot']],
  'Supreme Overlord: fainted allies (0–5)':[['abilities','そうだいしょう','General Supremo']],
  'Target switched in this turn (Stakeout)':[['abilities','はりこみ','Vigilante']],
  'Ally has opposite ability (Plus / Minus)':[['abilities','プラス','Más'],['abilities','マイナス','Menos']],
  'Protect':[['moves','まもる','Protección']],'Friend Guard':[['abilities','フレンドガード','Compiescolta']],
  'Expanding Force':[['moves','ワイドフォース','Vasta Fuerza']]
 };
 const longBindings=[
  ['Beat Up calculates each hit', [['moves','ふくろだたき','Paliza']]],
  ['Ability selection is available', [['items','とつげきチョッキ','Chaleco Asalto']]],
  ['Weather and terrain are shared', [['moves','だいちのはどう','Pulso de Campo'],['types','ドラゴン','Dragón']]],
  ['Helping Hand and Friend Guard', [['moves','てだすけ','Refuerzo'],['abilities','フレンドガード','Compiescolta'],['abilities','いかく','Intimidación'],['items','とつげきチョッキ','Chaleco Asalto']]],
  ['Manual mode: move-specific', [['moves','ボディプレス','Plancha Corporal'],['moves','イカサマ','Juego Sucio']]],
  ['Steel Roller: calculation', [['moves','アイアンローラー','Allanador Férreo']]],
  ['Dual Wingbeat: KO chance', [['moves','ダブルウイング','Ala Bis']]],
  ['Electro Ball power changes', [['moves','エレキボール','Bola Voltio'],['moves','おいかぜ','Viento Afín']]],
  ['Acrobatics: power doubles', [['moves','アクロバット','Acróbata']]]
 ];
 for(const [prefix,terms] of longBindings){const key=Object.keys(phrases).find(key=>key.startsWith(prefix));if(key)bindings[key]=terms;}
 const records=Object.freeze(Object.entries(phrases).map(([key,text])=>Object.freeze({id:key,text,status:'provisional',origin:'authored-ui',gameNameStatus:bindings[key]?'unverified-es-fallback':'not-applicable'})));
 const reverse=new Map(Object.entries(phrases).map(([key,text])=>[text,key]));
 function text(value,base){
  const key=Object.hasOwn(phrases,base)?base:Object.hasOwn(phrases,value)?value:null;
  if(key===null)return value;
  let result=phrases[key];
  for(const [category,id,fallback] of bindings[key]||[]){
   const name=root.ChlohaEsLa?.entity?.(category,id,fallback)||fallback;
   result=result.split(fallback).join(name);
  }
  reverse.set(result,key);
  return result;
 }
 // Dynamic UI is matched against complete canonical templates. Names are looked
 // up by exact canonical IDs/aliases, never replaced as arbitrary substrings.
 // These are authored UI translations, not evidence of official game wording.
 const dynamicReverse=new Map(),dynamicReverseLimit=512;
 function remember(result,base){
  dynamicReverse.delete(result);dynamicReverse.set(result,base);
  if(dynamicReverse.size>dynamicReverseLimit)dynamicReverse.delete(dynamicReverse.keys().next().value);
  return result;
 }
 // References outside the registered move roster have no ES-LA evidence.
 // Stockpile keeps the English source name; Refuerzo is reused from the
 // existing Spanish support label. Neither is a translated game-name row.
 const outsideRosterNames=Object.freeze({'たくわえる':'Stockpile','てだすけ':'Refuerzo'});
 let typeNames={};
 function name(category,value){
  const tables=[root.ChlohaLocalizedNames?.[category],root.ChlohaPokeAPILocalizedNames?.[category],category==='types'?typeNames:null];
  const candidates=new Map();
  for(const table of tables){
   const direct=table?.[value];
   if(direct)return root.ChlohaEsLa?.entity?.(category,value,direct.es||direct.en||value)||direct.es||direct.en||value;
   for(const [id,row]of Object.entries(table||{}))if(row&&Object.values(row).includes(value)&&!candidates.has(id))candidates.set(id,row);
  }
  // Include the regional dictionary in ambiguity checks. Carámbano denotes
  // different canonical moves in Spain and Latin America, so it stays intact.
  for(const [id,row]of Object.entries(root.ChlohaEsLaData?.entries?.[category]||{}))if(row.name===value&&!candidates.has(id))candidates.set(id,{});
  if(candidates.size===1){const [id,row]=candidates.entries().next().value;return root.ChlohaEsLa?.entity?.(category,id,row.es||row.en||value)||row.es||row.en||value;}
  const fallback=category==='moves'?(outsideRosterNames[value]||value):value;
  return root.ChlohaEsLa?.entity?.(category,value,fallback)||fallback;
 }
 const move=id=>name('moves',id),ability=id=>name('abilities',id);
 const terrainNames={なし:'Sin campo',エレキフィールド:'Campo Eléctrico',グラスフィールド:'Campo de Hierba',ミストフィールド:'Campo de Niebla',サイコフィールド:'Campo Psíquico'};
 const annotations={
  '基本ダメージのみ・実機未照合':'Solo daño básico; sin verificar en consola',
  '通常ダメージ・実機未照合':'Daño normal; sin verificar en consola',
  '計算未対応':'No compatible con el cálculo',
  '計算試算・実機未照合':'Estimación; sin verificar en consola',
  'Basic damage only; unverified':'Solo daño básico; sin verificar en consola',
  'Estimated; not hardware-verified':'Estimación; sin verificar en consola',
  'Unsupported':'No compatible con el cálculo'
 };
 for(const [translated,variants]of [
  ['No compatible con el cálculo',['Non pris en charge','Nicht unterstützt','No compatible','Non supportato','미지원','暂不支持','暫不支援']],
  ['Solo daño básico; sin verificar en consola',['Dégâts de base uniquement ; non vérifié','Nur Grundschaden; ungeprüft','Solo daño básico; sin verificar','Solo danno base; non verificato','기본 데미지만; 미검증','仅基础伤害；未经验证','僅基礎傷害；未經驗證']],
  ['Estimación; sin verificar en consola',['Estimation ; non vérifiée','Schätzung; ungeprüft','Estimado; sin verificar','Stima; non verificata','추정치; 미검증','估算；未经验证','估算；未經驗證']]
 ])for(const variant of variants)annotations[variant]=translated;
 function moveLabel(value){
  const m=value.match(/^(.+?)[（(]([^()（）]+?)\s*\/\s*(\d+|可変|Variable|Variabel|Variabile|가변|可变|可變)[）)](?:\s*[［[]([^\]］]+)[］\]])?$/);
  if(!m)return Object.hasOwn(phrases,value)?text(value,value):move(value);
  const suffix=m[4]?' ['+(annotations[m[4]]||m[4])+']':'';
  return move(m[1].trim())+' ('+name('types',m[2].trim())+' / '+(/^\d+$/.test(m[3])?m[3]:'Variable')+')'+suffix;
 }
 const reasons=Object.freeze({
  'undefined':'No se especificó una explicación para este movimiento',
  'パルデアケンタロスのフォルムに応じて技タイプを変更。壁破壊効果は計算対象外':'El tipo del movimiento cambia según la forma de Tauros de Paldea. No se calcula la eliminación de pantallas',
  'モルペコのまんぷく／はらぺこフォルムで技タイプを変更':'El tipo del movimiento cambia según la forma de Morpeko',
  'かくとう技の相性にひこう技の相性を乗算':'Se multiplican las efectividades de los tipos {fightingType} y {flyingType}',
  '天候またはフィールドによる威力とタイプの変化':'La potencia y el tipo cambian según el clima o el campo',
  'みずタイプに対する特殊な相性補正を適用':'Se aplica la efectividad especial contra el tipo Agua',
  '能力ランク上昇合計に応じて威力20+20×上昇段階数':'Potencia: 20+20×la suma de los aumentos de estadísticas',
  '相手の残りHP割合に応じて威力1〜100':'La potencia varía de 1 a 100 según la proporción de PS restantes del objetivo',
  '対象の防御ランク上昇を無視して計算':'El cálculo ignora los aumentos de Defensa del objetivo',
  '確定急所として計算':'Se calcula como un golpe crítico garantizado',
  '使用者がどく・もうどく・まひ・やけどの場合に威力2倍。やけどの物理ダメージ半減は適用しない。チェックで手動指定（状態異常入力は未統合）':'Potencia ×2 si el usuario está envenenado, gravemente envenenado, paralizado o quemado. La quemadura no reduce el daño físico a la mitad. Indícalo manualmente con la casilla (sin integración con el estado ingresado)',
  '相手がどく・もうどく状態場合に威力2倍。チェックで手動指定。実機照合未実施':'Potencia ×2 si el objetivo está envenenado o gravemente envenenado. Indícalo con la casilla. Sin verificar en consola',
  '相手が状態異常場合に威力2倍。チェックで手動指定。実機照合未実施':'Potencia ×2 si el objetivo tiene un problema de estado. Indícalo con la casilla. Sin verificar en consola',
  '同じターンに相手がすでにダメージを受けた場合に威力2倍。チェックで手動指定。実機照合未実施':'Potencia ×2 si el objetivo ya recibió daño en este turno. Indícalo con la casilla. Sin verificar en consola',
  '相手より後に行動した場合に威力2倍。チェックで手動指定。実機照合未実施':'Potencia ×2 si el usuario actúa después del objetivo. Indícalo con la casilla. Sin verificar en consola',
  'そのターンに対象からダメージを受けた場合に威力2倍。チェックで手動指定。実機照合未実施':'Potencia ×2 si el usuario recibió daño del objetivo en este turno. Indícalo con la casilla. Sin verificar en consola',
  'そのターンに自分の能力が下がった場合に威力2倍。チェックで手動指定。実機照合未実施':'Potencia ×2 si alguna estadística del usuario bajó en este turno. Indícalo con la casilla. Sin verificar en consola',
  '前のターンに自分の技が失敗した場合に威力2倍。チェックで手動指定。実機照合未実施':'Potencia ×2 si el movimiento del usuario falló en el turno anterior. Indícalo con la casilla. Sin verificar en consola',
  '同じターンに別のポケモンが先にりんしょうを使用した場合に威力2倍。チェックで手動指定。実機照合未実施':'Potencia ×2 si otro Pokémon ya usó {round} en este turno. Indícalo con la casilla. Sin verificar en consola',
  '前のターンに技が失敗した場合に威力2倍。チェックで手動指定':'Potencia ×2 si el movimiento falló en el turno anterior. Indícalo con la casilla',
  '対象が状態異常の場合に威力2倍。チェックで手動指定':'Potencia ×2 si el objetivo tiene un problema de estado. Indícalo con la casilla',
  'ミストフィールド中に使用者が接地している場合、威力1.5倍。使用後の自身のひんし・味方へのダメージ・特性による失敗は盤面に自動反映しない':'Potencia ×1.5 si el usuario está en contacto con el suelo bajo Campo de Niebla. No se aplican automáticamente al estado del combate el debilitamiento del usuario, el daño a aliados ni los fallos por habilidades',
  'エレキフィールド中に対象が接地している場合は威力2倍。使用者へのフィールド補正は既存処理を適用。実機丸め未照合':'Potencia ×2 si el objetivo está en contacto con el suelo bajo Campo Eléctrico. Se aplica el modificador habitual del campo al usuario. Redondeo sin verificar en consola',
  'サイコフィールド中かつ使用者が接地している場合、威力1.5倍・ダブルでは範囲技化。フィールド自体のエスパー威力補正は既存処理を使用。実機丸め未照合':'Potencia ×1.5 si el usuario está en contacto con el suelo bajo Campo Psíquico; en combates dobles afecta a varios objetivos. Se aplica el modificador habitual del campo al tipo Psíquico. Redondeo sin verificar en consola',
  '相手が現在対応している持ち物（とつげきチョッキ）を保持する場合のみ威力補正。除去不可アイテムや特性の相互作用は未検証':'La potencia solo se modifica si el objetivo lleva un objeto compatible ({assaultVest}). No se han verificado los objetos que no pueden quitarse ni las interacciones con habilidades',
  '変化技：ダメージ計算対象外':'Movimiento de estado: fuera del cálculo de daño',
  '攻撃側と防御側の実効素早さ比で威力が変動。未対応の素早さ補正は手動入力で調整':'La potencia depende de la relación entre las velocidades efectivas del atacante y el defensor. Ajusta manualmente los modificadores de Velocidad no compatibles',
  '攻撃側現在HP÷最大HPで威力変動。実機の丸め順序は未照合':'La potencia depende de PS actuales÷PS máximos del atacante. Orden del redondeo sin verificar en consola',
  '特殊技だが相手の防御を参照。特性・追加効果は実機未照合':'Es un movimiento especial que usa la Defensa del objetivo. Habilidades y efectos adicionales sin verificar en consola',
  '使用者の防御を攻撃値として参照。能力変化と一部特性の相互作用は実機未照合':'Usa la Defensa del usuario como valor ofensivo. Interacciones entre cambios de estadísticas y algunas habilidades sin verificar en consola',
  '相手の攻撃と攻撃ランクを参照。特性・状態異常との相互作用は実機未照合':'Usa el Ataque y sus niveles del objetivo. Interacciones con habilidades y problemas de estado sin verificar en consola',
  '持ち物なしで威力2倍。消費済みアイテム・特殊な持ち物状態は未対応':'Potencia ×2 sin objeto equipado. No se contemplan objetos consumidos ni estados especiales de los objetos',
  '2回攻撃を独立乱数として計算。各ヒット間のHP依存特性・追加効果・命中判定は未対応':'Se calculan 2 golpes con factores aleatorios independientes. No se contemplan habilidades dependientes de PS entre golpes, efectos adicionales ni comprobaciones de precisión',
  '確定急所：トリックフラワー。急所無効特性などは未対応':'Golpe crítico garantizado: {flowerTrick}. No se contemplan habilidades que impiden los críticos ni otras excepciones',
  '確定急所：こおりのいぶき。急所無効特性などは未対応':'Golpe crítico garantizado: {frostBreath}. No se contemplan habilidades que impiden los críticos ni otras excepciones',
  'フィールドが存在する場合のみ成功。使用確定時にフィールド除去。解除後の技は再計算が必要':'Solo funciona si hay un campo activo. El campo se elimina al confirmar el uso. Vuelve a calcular los movimientos posteriores',
  '攻撃前に特攻+1段階を自動反映。入力ランクは使用前':'Se aplica automáticamente Ataque Especial +1 antes de atacar. El nivel ingresado es el anterior al uso',
  '攻撃前に特攻+1段階を自動反映。雨では溜めなし':'Se aplica automáticamente Ataque Especial +1 antes de atacar. No requiere cargar bajo la lluvia',
  '天候による威力変化・溜め未対応':'No se contemplan los cambios de potencia por clima ni el turno de carga',
  'ねこだましの使用条件未対応':'No se contemplan las condiciones de uso de {fakeOut}',
  'ふいうちの成功条件未対応':'No se contemplan las condiciones de éxito de {suckerPunch}',
  '先制行動順未対応（命中時の基礎ダメージは通常）':'No se contempla la prioridad de actuación (se calcula el daño básico normal al acertar)',
  'Gのちからはじゅうりょく時威力1.5倍。チェックで手動指定（Champions向けShowdown画像で確認）':'{gravApple} tiene potencia ×1.5 bajo el efecto de gravedad. Indícalo con la casilla (contrastado con una imagen de Showdown para Champions)',
  '技の発動・使用条件を満たした前提で通常ダメージ計算。溜め・反動・継続・自己ひんし・タイプ変更・使用制限等の状態遷移は計算しない':'Se calcula el daño normal suponiendo que se cumplen las condiciones de uso. No se calculan cambios de estado del combate como carga, retroceso, duración, debilitamiento propio, cambios de tipo o restricciones de uso',
  '通常の威力・攻撃・防御によるダメージ計算対象外（仕様上除外）':'Fuera del cálculo normal basado en potencia, Ataque y Defensa (excluido por diseño)',
  '一撃必殺技：通常のダメージ計算対象外':'Movimiento de K.O. de un golpe: fuera del cálculo normal de daño',
  'たくわえる1〜3回を手動選択し威力100/200/300で通常ダメージ計算':'Selecciona manualmente 1 a 3 usos de {stockpile}; se calcula el daño normal con potencia 100/200/300',
  '威力2倍の発動を手動チェックで指定（通常80・強化160）。確率抽選は計算対象外':'Marca manualmente la activación de potencia ×2 (normal 80; aumentada 160). No se calcula la selección aleatoria',
  'なげつけるの威力を手動選択。持ち物の所持・消費・追加効果は対象外':'Selecciona manualmente la potencia de {fling}. No se contemplan la posesión, el consumo ni los efectos adicionales del objeto',
  'みらいよちは着弾成立を前提に通常ダメージ計算。遅延・交代・着弾時の特殊判定は計算対象外':'Se calcula el daño normal de {futureSight} suponiendo que acierta. No se contemplan la demora, los cambios ni las comprobaciones especiales al impactar',
  '物理・特殊のダメージ比較で攻撃方式を自動選択（実機未照合）':'Se elige automáticamente la categoría comparando el daño físico y especial (sin verificar en consola)',
  '参加する1〜6匹の攻撃種族値を手動指定。ひんし・状態異常のポケモンは入力から除外':'Ingresa manualmente el Ataque base de 1 a 6 participantes. Excluye los Pokémon debilitados o con problemas de estado'
 });
 const reasonBindings={fightingType:['types','かくとう'],flyingType:['types','ひこう'],round:['moves','りんしょう'],assaultVest:['items','とつげきチョッキ'],flowerTrick:['moves','トリックフラワー'],frostBreath:['moves','こおりのいぶき'],fakeOut:['moves','ねこだまし'],suckerPunch:['moves','ふいうち'],gravApple:['moves','Gのちから'],gravity:['moves','じゅうりょく'],stockpile:['moves','たくわえる'],fling:['moves','なげつける'],futureSight:['moves','みらいよち']};
 function reason(value){
  const translated=reasons[value];
  if(translated)return translated.replace(/\{(\w+)\}/g,(_,key)=>name(...reasonBindings[key]));
  return move(value);
 }
 const errors=Object.freeze({
  '最大HP範囲外':'Los PS máximos están fuera de rango',
  '入力範囲またはHPを確認':'Revisa el rango de los valores ingresados y los PS',
  '現在HPは0以上の整数を入力':'Ingresa los PS actuales como un número entero de 0 o más',
  '能力ランクは-6〜+6':'Los niveles de estadísticas deben estar entre -6 y +6',
  '追加倍率は0.01〜10で入力してください':'Ingresa un multiplicador adicional entre 0.01 y 10',
  '攻撃種族値は1〜255の範囲で入力してください':'Ingresa el Ataque base entre 1 y 255',
  '選択した特性は計算未対応です。未適用を選ぶか、対応特性を選択してください':'La habilidad seleccionada no es compatible con el cálculo. Elige No aplicada o una habilidad compatible',
  'シングルでは味方支援・複数対象の範囲技補正を指定できません':'Los combates individuales no permiten apoyo de aliados ni modificadores de área con varios objetivos',
  'アイアンローラーはフィールドがないと失敗します。フィールドを選択してください。':'{ironRoller} falla si no hay un campo activo. Selecciona un campo.',
  'ダブルウイングとマルチスケイルの2発目の相互作用は未対応です。':'No se contempla la interacción del 2.º golpe de {dualWingbeat} con {multiscale}.',
  'ふくろだたきとマルチスケイルのヒット別処理は未対応です':'No se contempla la interacción de cada golpe de {beatUp} con {multiscale}',
  'ふくろだたきは参加1〜6匹の攻撃種族値をカンマ区切りで入力してください':'Para {beatUp}, ingresa el Ataque base de 1 a 6 participantes separado por comas',
  '特殊連続技とマルチスケイルのヒット別処理は未対応です':'No se contempla la interacción de cada golpe de movimientos múltiples especiales con {multiscale}',
  '連続技とマルチスケイルのヒット別処理は未対応です':'No se contempla la interacción de cada golpe de movimientos múltiples con {multiscale}',
  'シェルアームズの能力値が不正です':'Las estadísticas de {shellSideArm} no son válidas',
  'シェルアームズはポケモンDBの能力値設定で計算してください':'Calcula {shellSideArm} usando las estadísticas de la base de datos de Pokémon',
  'HP条件特性の強制発動設定が不正':'La activación forzada de habilidades dependientes de los PS no es válida',
  'そうだいしょうのひんし数が不正':'La cantidad de aliados debilitados para {supremeOverlord} no es válida',
  'どく状態が不正':'El estado de envenenamiento no es válido','はりこみ交代条件が不正':'La condición de cambio para {stakeout} no es válida',
  'もらいび条件が不正':'La condición de {flashFire} no es válida','タイプが不正':'El tipo no es válido',
  'バッテリー条件が不正':'La condición de {battery} no es válida','パワースポット条件が不正':'La condición de {powerSpot} no es válida',
  'フィールドが不正':'El campo no es válido','レイジングブルのフォルムが不正です':'La forma para {ragingBull} no es válida',
  '味方の支援設定が不正':'El apoyo de aliados no es válido','味方プラス／マイナス設定が不正':'La configuración de {plus}/{minus} del aliado no es válida',
  '対戦条件が不正':'Las condiciones de combate no son válidas','技固有効果が不正':'El efecto propio del movimiento no es válido',
  '持ち物・特性・タイプ一致補正の指定が不正':'La selección de objeto, habilidad o bonificación por mismo tipo no es válida',
  '接地設定が不正':'La configuración de contacto con el suelo no es válida',
  '攻撃側HPの入力が不正':'Los PS ingresados del atacante no son válidos','攻撃側HPの指定が不正':'La selección de PS del atacante no es válida',
  '攻撃側現在HPが不正です':'Los PS actuales del atacante no son válidos','特性の入力が不正':'La habilidad ingresada no es válida',
  '特性発動条件が不正':'Las condiciones de activación de la habilidad no son válidas','状態異常・急所設定が不正':'La configuración de problemas de estado o críticos no es válida',
  '素早さ比が不正です':'La relación entre velocidades no es válida','素早さ設定が不正です':'La configuración de Velocidad no es válida',
  '防御側の状態異常が不正':'El problema de estado del defensor no es válido'
 });
 const errorBindings={ironRoller:['moves','アイアンローラー'],dualWingbeat:['moves','ダブルウイング'],multiscale:['abilities','マルチスケイル'],beatUp:['moves','ふくろだたき'],shellSideArm:['moves','シェルアームズ'],supremeOverlord:['abilities','そうだいしょう'],stakeout:['abilities','はりこみ'],flashFire:['abilities','もらいび'],battery:['abilities','バッテリー'],powerSpot:['abilities','パワースポット'],ragingBull:['moves','レイジングブル'],plus:['abilities','プラス'],minus:['abilities','マイナス']};
 function error(value){return errors[value]?.replace(/\{(\w+)\}/g,(_,key)=>name(...errorBindings[key]))||null;}
 const traceNames=Object.freeze({
  burn:'Quemadura',customMultiplier:'Multiplicador adicional',screen:'Pantalla',resistBerry:'Baya reductora de daño',stab:'Bonificación por mismo tipo',type:'Efectividad de tipos',
  aura:'Aura',grassyEarthquake:'Reducción por Campo de Hierba',mistyDragon:'Reducción por Campo de Niebla',terrainBoost:'Aumento por campo',typePlate:'Tabla de tipo',
  critical:'Golpe crítico',spread:'Varios objetivos',weather:'Clima',sandRockSpD:'Defensa Especial de Roca bajo tormenta de arena',snowIceDef:'Defensa de Hielo bajo nieve',
  skinAbility:'Habilidad que cambia el tipo',plusMinus:'Habilidades complementarias del aliado'
 });
 const traceAbilities=Object.freeze({
  auraGuard:'はどうのぼうご',filter:'フィルター',fluffyContact:'もふもふ',fluffyFire:'もふもふ',friendGuard:'フレンドガード',iceScales:'こおりのりんぷん',multiscale:'マルチスケイル',neuroforce:'ブレインフォース',prismArmor:'プリズムアーマー',punkRockDefense:'パンクロック',shadowShield:'ファントムガード',sniper:'スナイパー',tintedLens:'いろめがね',analytic:'アナライズ',battery:'バッテリー',drySkinFire:'かんそうはだ',ironFist:'てつのこぶし',megaLauncher:'メガランチャー',powerSpot:'パワースポット',punkRock:'パンクロック',reckless:'すてみ',sandForce:'すなのちから',sharpness:'きれあじ',sheerForce:'ちからずく',steelSpirit:'はがねのせいしん',strongJaw:'がんじょうあご',supremeOverlord:'そうだいしょう',technician:'テクニシャン',toughClaws:'かたいツメ',blaze:'もうか',defeatist:'よわき',dragonsMaw:'りゅうのあぎと',fireMane:'ほのおのたてがみ',flareBoost:'ねつぼうそう',flashFireBoost:'もらいび',furCoat:'ファーコート',grassPelt:'くさのけがわ',guts:'こんじょう',hadronEngine:'ハドロンエンジン',heatproof:'たいねつ',hugePower:'ちからもち',hustle:'はりきり',marvelScale:'ふしぎなうろこ',orichalcumPulse:'ひひいろのこどう',overgrow:'しんりょく',purePower:'ヨガパワー',purifyingSalt:'きよめのしお',rockyPayload:'いわはこび',solarPower:'サンパワー',stakeout:'はりこみ',steelworker:'はがねつかい',swarm:'むしのしらせ',thickFat:'あついしぼう',torrent:'げきりゅう',toxicBoost:'どくぼうそう',transistor:'トランジスタ',waterBubble:'すいほう',waterBubbleDefense:'すいほう'
 });
 const traceItems=Object.freeze({expertBelt:'たつじんのおび',lifeOrb:'いのちのたま',assaultVest:'とつげきチョッキ',choiceBand:'こだわりハチマキ',choiceSpecs:'こだわりメガネ'});
 function traceName(id){return traceNames[id]||(traceAbilities[id]?ability(traceAbilities[id]):traceItems[id]?name('items',traceItems[id]):id==='helpingHand'?move('てだすけ'):null);}
 const dynamicTemplates=Object.freeze([
  ['dragon-darts',/^ドラゴンアローは選択した相手への(\d+)回分のダメージを表示します。相手(\d+)体のまもる・無効・対象判定は手動指定です。$/,m=>`${move('ドラゴンアロー')} muestra el daño de ${m[1]} golpes al objetivo seleccionado. Indica manualmente ${move('まもる')}, las inmunidades y la selección de objetivos entre los ${m[2]} rivales.`],
  ['misty-explosion',/^ミストバースト: (ミストフィールド＋使用者接地（威力1\.5倍）|通常威力)。使用後の自身のひんしは自動反映しません$/,m=>`${move('ミストバースト')}: ${m[1]==='通常威力'?'potencia normal':'Campo de Niebla y usuario en contacto con el suelo (potencia ×1.5)'}. El debilitamiento del usuario tras usarlo no se aplica automáticamente`],
  ['rising-voltage',/^ライジングボルト: (エレキフィールド＋対象接地（威力2倍）|通常威力)$/,m=>`${move('ライジングボルト')}: ${m[1]==='通常威力'?'potencia normal':'Campo Eléctrico y objetivo en contacto con el suelo (potencia ×2)'}`],
  ['expanding-force',/^ワイドフォース: (接地＋サイコフィールド（威力1\.5倍・範囲化）|通常威力・単体対象)$/,m=>`${move('ワイドフォース')}: ${m[1]==='通常威力・単体対象'?'potencia normal, un objetivo':'usuario en contacto con el suelo y Campo Psíquico (potencia ×1.5, varios objetivos)'}`],
  ['electro-ball',/^エレキボール: 素早さ (\d+) \/ (\d+) → 威力 (\d+)$/,m=>`${move('エレキボール')}: Velocidad ${m[1]} / ${m[2]} → potencia ${m[3]}`],
  ['acrobatics',/^アクロバット: 持ち物 (なし（威力2倍）|あり（通常威力）)$/,m=>`${move('アクロバット')}: ${m[1].startsWith('なし')?'sin objeto (potencia ×2)':'con objeto (potencia normal)'}`],
  ['hp-power',/^HP依存威力: (威力 )?(\d+(?:\/\d+ → \d+)?)$/,m=>`Potencia según los PS: ${m[2]}`],
  ['move-power',/^(おはかまいり|ジャイロボール|アシストパワー): 威力 (\d+)$/,m=>`${move(m[1])}: potencia ${m[2]}`],
  ['rage-fist',/^ふんどのこぶし: 被攻撃回数 (\d+) → 威力 (\d+)$/,m=>`${move('ふんどのこぶし')}: golpes recibidos ${m[1]} → potencia ${m[2]}`],
  ['two-hit-range',/^(\d+)発合計の最小〜最大: (\d+)〜(\d+)$/,m=>`Daño total de ${m[1]} golpes, mínimo–máximo: ${m[2]}–${m[3]}`],
  ['two-hit-ko',/^(\d+)発合計KO率（(\d+)組）: (\d+(?:\.\d+)?%|対象がひんし)$/,m=>`Probabilidad de K.O. con ${m[1]} golpes (${m[2]} combinaciones): ${m[3]==='対象がひんし'?'el objetivo ya está debilitado':m[3]}`],
  ['final-roll',/^最終ダメージ（乱数(\d+)(?:・(\d+)発合計)?）: (\d+)$/,m=>`Daño final (factor aleatorio ${m[1]}${m[2]?'; total de '+m[2]+' golpes':''}): ${m[3]}`],
  ['trace-stat',/^(攻撃実数値|防御実数値|乱数前): (\d+)$/,m=>`${{攻撃実数値:'Estadística ofensiva',防御実数値:'Estadística defensiva',乱数前:'Antes del factor aleatorio'}[m[1]]}: ${m[2]}`],
  ['forced-critical',/^確定急所: (急所補正を強制適用|防御側の急所無効特性により急所補正なし)$/,m=>`Golpe crítico garantizado: ${m[1]==='急所補正を強制適用'?'se aplica el modificador de crítico':'la habilidad del defensor impide el modificador de crítico'}`],
  ['dual-wingbeat',/^ダブルウイング: 各ヒットを威力(\d+)で独立計算（各(\d+)乱数、計(\d+)組）$/,m=>`${move('ダブルウイング')}: cada golpe se calcula por separado con potencia ${m[1]} (${m[2]} valores aleatorios por golpe; ${m[3]} combinaciones)`],
  ['immunity',/^無効判定: タイプまたは特性によってダメージ(\d+)$/,m=>`Inmunidad: el tipo o la habilidad reduce el daño a ${m[1]}`],
  ['additional-multiplier',/^追加倍率×(\d+(?:\.\d+)?)を最終ダメージに適用しています。既存補正との二重適用に注意してください。$/,m=>`Se aplica un multiplicador adicional ×${m[1]} al daño final. Evita duplicar los modificadores existentes.`],
  ['hp-note',/^HP依存威力技：(.+)。攻撃側現在HPを変更すると威力が再計算されます。$/,m=>`Movimiento con potencia según los PS: ${reason(m[1])}. La potencia se recalcula al cambiar los PS actuales del atacante.`],
  ['stat-note',/^特殊能力値参照技：(.+)。攻撃ランク欄は参照能力のランクとして扱います。$/,m=>`Movimiento con cálculo especial: ${reason(m[1])}. El campo de nivel de Ataque representa el nivel de la estadística utilizada.`],
  ['move-audit',/^技監査 (P[012]|未対応)(?:：(.+?))?(（自動計算を停止）)?$/,m=>`Auditoría del movimiento ${m[1]==='未対応'?'no compatible':m[1]}${m[2]?': '+reason(m[2]):''}${m[3]?' (cálculo automático detenido)':''}`],
  ['multi-hit-ko',/^現在HPに対する連続技合計KO率: (\d+(?:\.\d+)?%)$/,m=>`Probabilidad de K.O. con todos los golpes frente a los PS actuales: ${m[1]}`],
  ['hp-chip',/^HP (\d+)$/,m=>`PS ${m[1]}`],
  ['modifier-trace',/^(power|stat|base|preRandom|postRandom|final)\/([A-Za-z]+(?:\+[A-Za-z]+)*): (\d+) → (\d+)$/,m=>{const modifiers=m[2].split('+').map(traceName);return modifiers.every(Boolean)?`${{power:'Potencia',stat:'Estadística',base:'Daño base',preRandom:'Antes del factor aleatorio',postRandom:'Después del factor aleatorio',final:'Daño final'}[m[1]]}/${modifiers.join('+')}: ${m[3]} → ${m[4]}`:null;}],
  ['shell-side-arm',/^シェルアームズ: 物理・特殊の能力比を比較し、(物理|特殊)方式を採用（同値は特殊）。$/,m=>`${move('シェルアームズ')}: se comparan las proporciones de estadísticas físicas y especiales; se elige daño ${m[1]==='物理'?'físico':'especial'} (especial en caso de empate).`],
  ['charge-boost',/^攻撃前の特攻\+(\d+)段階を自動反映（入力ランクは使用前）。(雨のため即時攻撃|溜めターン後の攻撃)。$/,m=>`Se aplica automáticamente Ataque Especial +${m[1]} antes de atacar (el nivel ingresado es el anterior al uso). ${m[2]==='雨のため即時攻撃'?'Ataque inmediato por la lluvia':'Ataque después del turno de carga'}.`],
  ['battle-history',/^(\d+)手目：(.+?) \/ (\d+)ダメージ( \/ HP \d+→\d+)?( \/ フィールド解除)?( \/ 予測と不一致・要照合)?$/,m=>`Turno ${m[1]}: ${moveLabel(m[2])} / ${m[3]} de daño${m[4]?m[4].replace('HP','PS'):''}${m[5]?' / Campo eliminado':''}${m[6]?' / No coincide con la predicción; verificar':''}`],
  ['battle-confirmation',/^(.+?)を確定。相手HP (\d+\s*(?:→|\/)\s*\d+)、フィールド：([^。]+)(。予測と不一致です。条件・実測値を記録して照合してください。|。)?$/,m=>`${moveLabel(m[1])} confirmado. PS del objetivo ${m[2]}, campo: ${terrainNames[m[3]]||move(m[3])}${m[4]?.length>1?'. No coincide con la predicción. Registra y verifica las condiciones y el daño observado.':'.'}`]
 ]);
 function dynamic(base,knownTypes){
  if(knownTypes)typeNames=knownTypes;
  let result=null;
  if(Object.hasOwn(reasons,base))result=reason(base);
  else if(Object.hasOwn(errors,base))result=error(base);
  else if(base.includes('\n')&&base.includes('最終ダメージ（乱数'))result=base.split('\n').map(line=>dynamic(line)??line).join('\n');
  else if(Object.hasOwn(root.ChlohaLocalizedNames?.moves||{},base)||Object.hasOwn(root.ChlohaPokeAPILocalizedNames?.moves||{},base))result=move(base);
  else if(base.startsWith('選択中：')){
   const value=base.slice(4),label=value.match(/^(.+?) (.+[（(].+[）)](?:[［[].+[］\]])?)$/);
   if(label)result='Seleccionado: '+name('pokemon',label[1])+' '+moveLabel(label[2]);
  } else if(base.startsWith('入力エラー: ')){const body=error(base.slice('入力エラー: '.length));if(body)result='Error de entrada: '+body;}
  if(result===null){for(const [,pattern,render]of dynamicTemplates){const match=base.match(pattern);if(match){result=render(match);break;}}}
  return result===null?null:remember(result,base);
 }
 root.ChlohaEsLaUi=Object.freeze({phrases,records,reasons,errors,dynamicTemplates:Object.freeze(dynamicTemplates.map(([id,pattern])=>Object.freeze({id,pattern:pattern.source,status:'provisional',origin:'authored-ui',officialGameNameEvidence:false}))),text,dynamic,source:value=>dynamicReverse.get(value)||reverse.get(value)||value});
})(typeof window!=='undefined'?window:globalThis);
