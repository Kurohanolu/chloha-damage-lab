'use strict';
// Current candidate scope guard against the immutable published pre.9 baseline.
// Historical batch-6 Worker freeze remains untouched and mandatory.
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const ref='46f930797e662be0d01e974f98ddde6de7b414c0',tree='1ea3163c8a8f4de8d68951b28c061a855461468c';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
assert.equal(git('rev-parse',ref+'^{tree}').trim(),tree);
const worker='services/feedback/src/worker.js',old=git('show',ref+':'+worker),current=fs.readFileSync(worker,'utf8');
const original="json({enabled:true,siteKey:env.TURNSTILE_SITE_KEY,retentionDays:C.limits.retentionDays,mode:env.ENVIRONMENT==='local'?'local-demo':'production'})";
const replacement=original.replace('enabled:true,','enabled:true,supportedLocales:[...C.locales],');
assert.equal(old.split(original).length,2,'The original public config expression must be unique');
function checkWorker(candidate){assert.equal(candidate,old.replace(original,replacement),'Only public supportedLocales from the actual validator is permitted in Worker');}
checkWorker(current);
assert.throws(()=>checkWorker(old),'A missing capability export is not an accepted successor');
assert.throws(()=>checkWorker(current.replace('supportedLocales:[...C.locales]','supportedLocales:["es-LA"]')),'Do not advertise fabricated capabilities');
assert.throws(()=>checkWorker(current+'\n// unreviewed server change\n'),'Additional server changes require a separately reviewed contract');
// Freeze production server inventory and bytes, including Wrangler settings,
// dependencies, migration schemas and shared validators. Tests may be additive.
const scope=f=>f.startsWith('services/feedback/')&&!f.startsWith('services/feedback/test/')&&f!==worker;
const historical=git('ls-tree','-r','--name-only',ref).trim().split('\n').filter(scope).sort();
const candidate=git('ls-files').trim().split('\n').filter(scope).sort();
assert.deepEqual(candidate,historical,'Production server inventory must be unchanged');
for(const file of historical)assert.equal(fs.readFileSync(file,'utf8'),git('show',ref+':'+file),file+' remains frozen');
// Worker imports this root-level contract, outside services/feedback/.
const contractFile='feedback-contract-v0185.js',contractBefore=git('show',ref+':'+contractFile);
function checkContract(bytes){assert.equal(bytes,contractBefore,'Shared validator and accepted locales remain byte-for-byte frozen');}
checkContract(fs.readFileSync(contractFile,'utf8'));
const changedContract=contractBefore.replace("'zh-Hant','es-LA'","'zh-Hant','es-LA','xx'");
assert.notEqual(changedContract,contractBefore,'Mutation must actually change the validator');
assert.throws(()=>checkContract(changedContract),'Reject extra accepted locale even when Worker export copies C.locales');
assert.throws(()=>checkContract(contractBefore+'\n// additional validator edit\n'),'Reject unrelated validator edits');
assert.equal(fs.readFileSync('feedback-config-v0185.js','utf8'),git('show',ref+':feedback-config-v0185.js'),'Production pause/config remains unchanged');
assert.equal(fs.readFileSync('tests/v110-regional-batch6-contract.cjs','utf8').split('// BEGIN UNMODIFIED HISTORICAL PRE9 TEST\n')[1],git('show',ref+':tests/v110-regional-batch6-contract.cjs'),'Historical batch-6 contract is not relaxed');
// Current candidate protection is independent of historical test execution.
const protectedScope=f=>f.startsWith('data/')||f.startsWith('docs/data/')||(/^[^/]+\.js$/.test(f)&&!['feedback-ui-v0185.js','feedback-release-v100.js'].includes(f));
const protectedBefore=git('ls-tree','-r','--name-only',ref).trim().split('\n').filter(protectedScope).sort();
assert.deepEqual(git('ls-files').trim().split('\n').filter(protectedScope).sort(),protectedBefore,'Current data/runtime inventory is unchanged');
for(const file of protectedBefore)assert.equal(fs.readFileSync(file,'utf8'),git('show',ref+':'+file),'Current calculation/data/nine-locale source frozen: '+file);
const report={passed:true,scope:'preparation-only narrow Worker delta',referenceCommit:ref,referenceTree:tree,referenceIsPublishedBaseline:true,allowedChange:'public config supportedLocales copies validator C.locales',serverFilesPreserved:historical.length,sharedValidatorPreserved:true,productionPausePreserved:true,historicalBatch6ContractUnchanged:true};
fs.mkdirSync('reports/v110',{recursive:true});fs.writeFileSync('reports/v110/feedback-worker-scope.json',JSON.stringify(report,null,2)+'\n');console.log('PASS narrow feedback Worker scope; no publication approval implied');
