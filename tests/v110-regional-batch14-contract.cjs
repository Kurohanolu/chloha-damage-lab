'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const baseline='016c5801bd63ed891c4c359d02748b3a66c26d0f';
const old=p=>cp.execFileSync('git',['show',baseline+':'+p],{maxBuffer:32*1024*1024});
const before=JSON.parse(old('docs/data/v110-es-la-coverage.json')),after=JSON.parse(fs.readFileSync('docs/data/v110-es-la-coverage.json'));
const manifest=JSON.parse(fs.readFileSync('docs/data/v110-es-la-regional-batch14.json'));
assert.equal(manifest.baselineCommit,baseline);assert.equal(manifest.records.length,1);assert.equal(manifest.sources.length,1);
const r=manifest.records[0],s=manifest.sources[0];
assert.equal(r.esLA,'Fitoimpulso');assert.equal(r.canonicalEnglish,'Grassy Glide');assert.equal(r.status,'official');
assert.equal(r.officialChampions,false);assert.equal(r.targetGame,'Pokémon Sword and Pokémon Shield');assert.equal(r.verificationScope,'official-publication-not-physical-game-test');
assert.deepEqual(r.canonicalMatches,[{category:'moves',key:'グラススライダー',canonicalIds:['gw0169_p036']}]);
assert.equal(s.url,'https://swordshield.pokemon.com/es-mx/expansionpass/features/');assert.equal(s.englishIdentityUrl,'https://swordshield.pokemon.com/en-us/expansionpass/features/');assert.equal(s.localeEvidence.regionControlObserved,true);
for(const k of ['rawSha256','englishRawSha256'])assert.match(s[k],/^[a-f0-9]{64}$/);
const sourceBefore=JSON.parse(old('docs/data/v110-es-la-source-records.json')),sourceAfter=JSON.parse(fs.readFileSync('docs/data/v110-es-la-source-records.json'));
const expected=structuredClone(sourceBefore);expected.sources.push(s);expected.records.push(r);assert.deepEqual(sourceAfter,expected,'Only exact additive evidence');
for(const [cat,entries] of Object.entries(before.entries))for(const [k,b] of Object.entries(entries)){
 const a=after.entries[cat][k];assert.equal(a.name,b.name);assert.deepEqual(a.aliases,b.aliases);assert.deepEqual(a.canonicalIds,b.canonicalIds);assert.equal(a.officialChampions,b.officialChampions);
 if(cat==='moves'&&k==='グラススライダー'){assert.equal(b.status,'unverified');assert.equal(a.status,'official');assert.deepEqual(a.sourceIds,[s.id]);assert.deepEqual(a.recordIds,[r.id]);assert.equal(a.targetGame,r.targetGame);}else assert.deepEqual(a,b,cat+'/'+k);
}
const rows=Object.entries(after.entries).filter(([c])=>c!=='forms').flatMap(([,e])=>Object.values(e));assert.equal(rows.length,1029);assert.equal(rows.filter(e=>e.status==='official').length,519);assert.equal(rows.filter(e=>e.status==='unverified').length,354);assert.equal(rows.filter(e=>e.officialChampions).length,195);
for(const p of ['i18n.js','battle-data-v0184.js','ability-data-v0184.js','feedback-config-v0185.js','services/feedback/src/worker.js','.github/workflows/v110-es-la-localization.yml','scripts/v110-es-la-coverage.cjs'])assert.deepEqual(fs.readFileSync(p),old(p),p+' unchanged');
assert.equal(fs.readFileSync('index.html','utf8'),require('./helpers/v110-translation-successor.cjs').expectedHTML(),'Exact version/cache delta only');
console.log('PASS batch14: exactly one active move historical attestation; 519/1029 official, 354 unverified, 195 Champions; all displays, aliases, IDs, other entries, engine unchanged; exact successor identity/cache');
