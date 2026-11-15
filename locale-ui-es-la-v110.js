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
  'Target has already fainted (KO probability not applicable)':'El objetivo ya está debilitado (no corresponde calcular la probabilidad de K.O.)'
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
 root.ChlohaEsLaUi=Object.freeze({phrases,records,text,source:value=>reverse.get(value)||value});
})(typeof window!=='undefined'?window:globalThis);
