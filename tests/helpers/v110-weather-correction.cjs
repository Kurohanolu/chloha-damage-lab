'use strict';
const assert=require('node:assert/strict');
const correctedName='rejection {"defAbility":"drizzle"}';
const comment='// Field setters are valid on either side. Derive weather IDs from the same map\n// used for inference so UI-selected setters cannot fail engine validation.\n';
function originalAbilitySource(source){assert.equal(source.split(comment).length,2);assert.equal(source.split(',...Object.keys(WEATHER_BY_ABILITY)').length,2);return source.replace(comment,'').replace(',...Object.keys(WEATHER_BY_ABILITY)','');}
function correctedInput(fixture){if(fixture.name!==correctedName)return null;assert.deepEqual(fixture.expected,{error:{name:'Error',message:'持ち物・特性・タイプ一致補正の指定が不正'}});assert.equal(fixture.input.defAbility,'drizzle');assert.equal(fixture.input.attAbility,'none');assert.equal(fixture.input.weather,'none');return {...fixture.input,defAbility:'none',weather:'rain'};}
function checkCorrectedResult(actual){assert.ok(actual.output);assert.deepEqual(actual.output.rolls,[58,58,60,60,60,61,61,63,63,64,64,66,66,67,67,69]);assert.equal(actual.output.attack,150);assert.equal(actual.output.defense,120);assert.equal(actual.output.base,46);assert.equal(actual.output.effectivePower,80);}
module.exports={correctedName,correctedInput,checkCorrectedResult,originalAbilitySource};
