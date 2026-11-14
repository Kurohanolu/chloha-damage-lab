'use strict';
// Explicit legacy UI bindings. Calculation internals stay inside the core module.
const DamageEngine=window.ChlohaDamageEngine;
const {TYPES,TYPE_PLATES}=window.ChlohaBattleData;
const {ABILITY_CATALOG,ABILITY_ID_BY_JA}=window.ChlohaAbilityData;
const {pokeRound,isGrounded}=DamageEngine;
