'use strict';
// Resolve the public contract from the same source tree as the deployed HTML.
// Older PR bases have the original baseline only; corrected releases also have
// explicit, digest-checked errata. The frozen original is never rewritten.
const fs=require('node:fs');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const baselinePath='tests/fixtures/v0184-public-baseline.json';
const errataPath='tests/fixtures/v0186-baseline-corrections.json';
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
function loadPublicContracts({readFile=file=>fs.readFileSync(file),exists=fs.existsSync}={}){
 const raw=readFile(baselinePath),baseline=JSON.parse(raw);
 if(!exists(errataPath))return baseline;
 const errata=JSON.parse(readFile(errataPath));
 assert.equal(digest(raw),errata.frozenBaselineSha256,'release errata must match the immutable baseline');
 const weatherPath='tests/fixtures/v110-weather-corrections.json';
 const weather=exists(weatherPath)?JSON.parse(readFile(weatherPath)):{frozenBaselineSha256:errata.frozenBaselineSha256,cases:[]};
 assert.equal(digest(raw),weather.frozenBaselineSha256,'weather erratum must match the immutable baseline');
 const all=[...errata.cases,...weather.cases];
 const corrections=new Map(all.map(item=>[item.name,item]));
 assert.equal(corrections.size,all.length,'duplicate release erratum');
 assert.ok([...corrections.keys()].every(name=>baseline.cases.some(item=>item.name===name)),'unknown release erratum');
 return {...baseline,cases:baseline.cases.map(fixture=>{
  const correction=corrections.get(fixture.name);
  if(!correction)return fixture;
  assert.equal(digest(JSON.stringify(fixture.expected)),correction.originalExpectedSha256,'original release evidence: '+fixture.name);
  assert.ok(correction.reason&&correction.expected,'complete justified release erratum: '+fixture.name);
  return {...fixture,expected:correction.expected};
 })};
}
module.exports={loadPublicContracts};
