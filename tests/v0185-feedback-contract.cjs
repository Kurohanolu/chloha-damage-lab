const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context=vm.createContext({console});
for(const file of ['locale-registry.js','feedback-contract-v0185.js','feedback-locales-v0185.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
const C=context.ChlohaFeedbackContract,L=context.ChlohaFeedbackLocales;
assert.equal(C.locales.length,9);assert.equal(C.categories.length,4);assert.equal(C.statuses.length,5);
for(const locale of C.locales){
 const own=L.catalogs[locale];assert.deepEqual(Object.keys(own).sort(),[...L.keys].sort());
 for(const key of L.keys){assert.ok(own[key].trim(),locale+'/'+key);assert.equal(L.text(locale,key),own[key],locale+'/'+key+' must not fall back');if(locale!=='ja')assert.ok(!/[\u3040-\u30ff]/.test(own[key]),locale+'/'+key+' contains Japanese kana');}
 if(!['ja','en'].includes(locale))for(const key of ['title','category','description','privacy','requiredDescription','success','failure'])assert.notEqual(own[key],L.catalogs.en[key],locale+'/'+key+' unexpected English fallback');
}
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/v0184-public-baseline.json','utf8')).cases.find(x=>x.name==='neutral');
context.sample=JSON.parse(JSON.stringify({schemaVersion:1,appVersion:'v0.184 Pre-Release 30',engineVersion:'0.184',locale:'en',selection:{attacker:'garchomp',defender:'tyranitar',move:'earthquake'},controls:{dbAttNature:'neutral',power:'100',critical:false},engineInput:fixture.input,result:{minimumDamage:1,maximumDamage:100,koProbability:null}}));
// Recreate the input in the contract's realm, as real browser/server JSON parsing does.
vm.runInContext('sample=JSON.parse(JSON.stringify(sample))',context);assert.equal(C.validateSnapshot(context.sample),true);
const before=JSON.stringify(context.sample);assert.equal(C.validateSnapshot(context.sample),true);assert.equal(JSON.stringify(context.sample),before);
for(const mutation of ["sample.email='private@example.test'","sample.controls.feedbackEmail='private@example.test'","sample.controls.pokemonSearch='private query'","sample.controls.dbAttPokemon='private@example.test'","sample.engineInput.ip='127.0.0.1'","sample.result.rawTrace='<script>bad</script>'","sample.engineInput.attack=NaN"]){vm.runInContext('sample=JSON.parse('+JSON.stringify(before)+');'+mutation,context);assert.equal(C.validateSnapshot(context.sample),false,mutation);}
const ui=fs.readFileSync('feedback-ui-v0185.js','utf8');assert.ok(!ui.includes('localStorage'));assert.ok(ui.includes("response.status!==201"));assert.ok(!fs.readFileSync('feedback-config-v0185.js','utf8').includes('GITHUB_TOKEN'));
console.log('PASS v0.185 shared contract, '+L.keys.length+' complete keys × nine locales, private snapshot allowlist, and immutable validation');
