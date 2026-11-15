import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHarness,reportBody} from './harness.mjs';
import '../../../feedback-release-v100.js';

// Local SQLite/service mocks only. Never submits a production report or Issue.
test('ES-LA intake preserves internal locale, full candidate version and private snapshot',async()=>{
 const h=await createHarness();
 try{
  const title='Singularity v1.1.0 Pre-Release 1',R=globalThis.ChlohaFeedbackRelease,identity=R.identify(title);
  const input=JSON.parse(fs.readFileSync(new URL('../../../tests/fixtures/v0184-public-baseline.json',import.meta.url))).cases.find(x=>x.name==='neutral').input;
  const snapshot={schemaVersion:1,appVersion:identity.wireVersion,engineVersion:'0.184',locale:'es-LA',selection:{attacker:'garchomp',defender:'tyranitar',move:'earthquake'},controls:{dbAttNature:'neutral',power:'100',critical:false},engineInput:input,result:{minimumDamage:1,maximumDamage:100,koProbability:null}};
  const body=reportBody({locale:'es-LA',appVersion:identity.wireVersion,description:R.description(title,'Prueba local de idioma.'),snapshot});
  const response=await h.request('/v1/reports',{method:'POST',body});assert.equal(response.status,201);
  const receipt=(await response.json()).receipt;
  assert.equal((await h.request('/v1/admin/reports/'+receipt)).status,401,'Private details require administrator authentication');
  const detail=(await (await h.request('/v1/admin/reports/'+receipt,{admin:true})).json()).report;
  assert.equal(detail.locale,'es-LA');assert.equal(detail.appVersion,'v1.1 Pre-Release 1');assert.equal(detail.snapshot.locale,'es-LA');assert.deepEqual(detail.snapshot.engineInput,input);
  assert.equal(detail.description,'[Singularity release: v1.1.0 Pre-Release 1]\n\nPrueba local de idioma.');
  assert.equal(h.calls.github.length,0,'Anonymous reports never create a public Issue');
 }finally{h.close();}
});
test('ES-LA does not permit arbitrary locale aliases, privacy fields or mismatched snapshot versions',async()=>{
 for(const mutate of [b=>b.locale='es-419',b=>b.locale='es-XX',b=>b.snapshot={schemaVersion:1,email:'private@example.test'},b=>b.appVersion='v1.1.0 Pre-Release 1']){
  const h=await createHarness();try{const body=reportBody({locale:'es-LA',appVersion:'v1.1 Pre-Release 1'});mutate(body);assert.equal((await h.request('/v1/reports',{method:'POST',body})).status,400);assert.equal(h.db.sqlite.prepare('SELECT count(*) n FROM reports').get().n,0);}finally{h.close();}
 }
});

// The release preflight uses this read-only capability instead of creating a report.
test('public configuration declares the same locales enforced by intake',async()=>{
 const h=await createHarness();
 try{
  const response=await h.request('/v1/config');assert.equal(response.status,200);
  const config=await response.json();
  assert.deepEqual(config.supportedLocales,[...globalThis.ChlohaFeedbackContract.locales]);
  assert.ok(config.supportedLocales.includes('es-LA'));
  assert.ok(!config.supportedLocales.includes('es-419'));
 }finally{h.close();}
});
