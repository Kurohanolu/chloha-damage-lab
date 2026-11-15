'use strict';
// Promotion equivalence is distinct from game accuracy. The exact reviewed
// candidate is an immutable comparison, never regenerated from current output.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const reviewedCommit='c9c52e1f7598fa6f7642a784a88e9bc3a4c7e095';
const reviewedTree='bcf11e2ce7b2ff9a74db62309a33c0e3032a3c2b';
const SEED=0x100c9c;
const runtimeFiles=['battle-data-v0184.js','move-mechanics-data-v0184.js','ability-data-v0184.js','damage-engine-v0184.js','damage-calculator-v0184.js','damage-ui-adapter-v0184.js','multi-hit.js','variable-power.js'];
const protectedFiles=[...runtimeFiles,'pokemon-weights-v0181.js','weight-power.js','persistence-v0188.js','tests/fixtures/v0184-public-baseline.json','tests/fixtures/v0186-baseline-corrections.json','tests/reference/package-lock.json'];
const git=(...args)=>execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024});
const historical=file=>git('show',reviewedCommit+':'+file);
const current=file=>fs.readFileSync(path.join(root,file));
const hash=body=>crypto.createHash('sha256').update(body).digest('hex');
const normalize=value=>JSON.parse(JSON.stringify(value,(_,item)=>Object.prototype.toString.call(item)==='[object Map]'?{mapEntries:[...item]}:item));
const scriptOrder=html=>[...html.matchAll(/<script\b[^>]*\bsrc=["'](?:\.\/)?([^"']+)["'][^>]*>/g)].map(m=>m[1].split(/[?#]/)[0]).filter(file=>runtimeFiles.includes(file));
// Keep every inline calculation/model handler identical. Only the existing
// presentation template may contain the new stable product wording.
const inlineRuntime=html=>[...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].replace(/app\.innerHTML=`[\s\S]*?<\/aside>`;/,'/* presentation template */'));
function load(reader,order){
 const context=vm.createContext({});vm.runInContext('window=globalThis',context);
 for(const file of order)vm.runInContext(reader(file).toString(),context,{filename:file,timeout:1000});
 assert.equal(typeof context.ChlohaDamageEngine?.calculate,'function');
 assert.equal(typeof context.ChlohaDamageCalculator?.calculate,'function');
 return context;
}
function observe(context,entry,input,options={}){
 const snapshot=structuredClone({input,options});let result;
 try{result={output:normalize(entry==='core'?context.ChlohaDamageEngine.calculate(input):context.ChlohaDamageCalculator.calculate(input,options))};}
 catch(error){result={error:{name:error.name,message:error.message}};}
 assert.deepEqual({input,options},snapshot,'Input/options must not be mutated');
 return result;
}
const report={audit:'v1.0.0 numeric promotion equivalence',reviewedCommit,reviewedTree,sourceCommit:git('rev-parse','HEAD').toString().trim(),sourceTree:git('rev-parse','HEAD^{tree}').toString().trim(),uncommittedPreview:!!git('status','--porcelain').toString().trim(),physicalGameVerified:false,seed:SEED,protectedFiles:{},fixedContracts:0,documentedCorrections:0,screenCases:0,speedBoundaries:0,seededInputs:0,seededComparisons:0,multiHitComparisons:0,unsupportedWitnesses:0,completeOutputComparisons:0,status:'RUNNING'};
try{
 assert.equal(git('rev-parse',reviewedCommit+'^{tree}').toString().trim(),reviewedTree,'Reviewed baseline identity must remain exact');
 for(const file of protectedFiles){
  const before=historical(file),after=current(file);
  assert.deepEqual(after,before,'Stable promotion requires a separate justified review for numeric/data/persistence changes: '+file);
  report.protectedFiles[file]=hash(after);
 }
 const oldHTML=historical('index.html').toString(),newHTML=current('index.html').toString();
 const oldOrder=scriptOrder(oldHTML),newOrder=scriptOrder(newHTML);
 assert.equal(new Set(oldOrder).size,runtimeFiles.length);assert.equal(oldOrder.length,runtimeFiles.length);
 assert.deepEqual(newOrder,oldOrder,'Numeric dependency order must remain unchanged');
 assert.deepEqual(inlineRuntime(newHTML),inlineRuntime(oldHTML),'Stable public wording must not alter inline numerical/model behavior');
 report.inlineRuntimeSha256=hash(JSON.stringify(inlineRuntime(newHTML)));report.numericScriptOrder=newOrder;
 const old=load(historical,oldOrder),candidate=load(current,newOrder);
 function compare(label,entry,input,options={},expectSuccess=true){
  const expected=observe(old,entry,structuredClone(input),structuredClone(options));
  const actual=observe(candidate,entry,structuredClone(input),structuredClone(options));
  assert.deepEqual(actual,expected,'Promotion parity: '+label);
  if(expectSuccess){assert.ok(actual.output,'Supported witness must produce output: '+label+' '+JSON.stringify({input,error:actual.error}));if(entry==='core')assert.equal(actual.output.rolls.length,16,'All sixteen random rolls: '+label);}
  report.completeOutputComparisons++;return actual;
 }
 const fixtures=JSON.parse(current('tests/fixtures/v0184-public-baseline.json'));
 const errata=JSON.parse(current('tests/fixtures/v0186-baseline-corrections.json'));
 assert.equal(fixtures.cases.length,300);assert.equal(errata.cases.length,31);
 assert.equal(hash(current('tests/fixtures/v0184-public-baseline.json')),errata.frozenBaselineSha256);
 const corrections=new Map(errata.cases.map(c=>[c.name,c]));assert.equal(corrections.size,31);
 for(const fixture of fixtures.cases){
  const actual=compare(fixture.name,fixture.entry,fixture.input,fixture.options,false),correction=corrections.get(fixture.name);
  if(correction){assert.equal(hash(JSON.stringify(fixture.expected)),correction.originalExpectedSha256);assert.ok(correction.reason);assert.notDeepEqual(correction.expected,fixture.expected);report.documentedCorrections++;}
  assert.deepEqual(actual,correction?.expected||fixture.expected,'Original or documented-correction contract: '+fixture.name);report.fixedContracts++;
 }
 const base={...structuredClone(fixtures.cases[0].input),attTypes:['ノーマル'],defTypes:['ノーマル'],moveType:'ノーマル',stabMode:'none',attack:153,defense:117};
 const screens=[{id:'gw0169_p022',type:'かくとう',power:75,witness:[76,76,78,78,80,80,80,82,82,84,84,86,86,88,88,90]},{id:'v096_085',type:'エスパー',power:85,witness:[42,43,43,44,44,45,45,46,46,47,47,48,48,49,49,50]}];
 for(const move of screens)for(const screen of ['none','reflect','lightScreen'])for(const battleFormat of ['singles','doubles'])for(const critical of [false,true])for(const ranks of [[-6,6],[0,0],[6,-6]]){
  const input={...structuredClone(base),moveId:move.id,moveType:move.type,power:move.power,screen,battleFormat,critical,attackStage:ranks[0],defenseStage:ranks[1]};
  const actual=compare('screen '+JSON.stringify(input),'core',input);report.screenCases++;
  if(!critical&&ranks[0]===0)assert.deepEqual(actual.output.rolls,move.witness,'Previously independently established screen-removal witness');
 }
 // Direct, independent integer arithmetic for neutral Speed thresholds. This
 // checks both sides, strict ratio boundaries and the Gyro Ball cap, not just
 // equality of two copies of an implementation.
 const speedPairs=[[1,9999],[9999,1],[99,100],[100,100],[199,100],[200,100],[299,100],[300,100],[399,100],[400,100],[122,81],[200,81],[200,240],[300,240]];
 const neutralRolls=power=>{const n=22n*BigInt(power)*150n/100n/50n+2n;return Array.from({length:16},(_,i)=>Number(n*BigInt(85+i)/100n));};
 for(const moveMechanic of ['electroBall','gyroBall'])for(const [attSpeed,defSpeed] of speedPairs){
  const power=moveMechanic==='gyroBall'?Math.min(150,Math.floor(25*defSpeed/attSpeed)+1):attSpeed<defSpeed?40:attSpeed<defSpeed*2?60:attSpeed<defSpeed*3?80:attSpeed<defSpeed*4?120:150;
  const input={...structuredClone(base),power:1,attack:150,defense:100,moveMechanic,attSpeed,defSpeed};
  const actual=compare(moveMechanic+' '+attSpeed+'/'+defSpeed,'core',input);assert.equal(actual.output.effectivePower,power);assert.deepEqual(actual.output.rolls,neutralRolls(power));report.speedBoundaries++;
 }
 let state=SEED;const random=n=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)%n;};const pick=a=>a[random(a.length)];
 const types=Array.from(old.ChlohaBattleData.TYPES);
 for(let index=0;index<2048;index++){
  const input={...structuredClone(base),power:pick([1,2,40,59,60,61,99,100,101,250,500]),attack:1+random(350),defense:1+random(350),attackStage:random(13)-6,defenseStage:random(13)-6,category:pick(['physical','special']),critical:!!random(2),moveType:pick(types),attTypes:[pick(types)],defTypes:[pick(types)],weather:pick(['none','sun','rain','sand','snow']),terrain:pick(['none','electric','grassy','misty','psychic']),screen:pick(['none','reflect','lightScreen']),battleFormat:pick(['singles','doubles']),spread:pick(['single','spread']),burn:!!random(2),attAbility:pick(['none','technician','adaptability','hugePower','sniper','infiltrator','unaware']),defAbility:pick(['none','thickFat','furCoat','filter','levitate','iceScales','battleArmor','unaware']),attItem:pick(['none','lifeOrb','choiceBand','choiceSpecs','expertBelt']),defItem:pick(['none','assaultVest','autoResistBerry']),moveMechanic:pick(['none','foulPlay','bodyPress','gyroBall','electroBall','storedPower','rageFist']),attSpeed:1+random(400),defSpeed:1+random(400),attSpeedStage:random(13)-6,defSpeedStage:random(13)-6,attParalyzed:!!random(2),defParalyzed:!!random(2),attTailwind:!!random(2),defTailwind:!!random(2)};
  input.stabMode=pick(['none','auto']);input.bodyPressDefenseStage=random(13)-6;input.foulPlayTargetStage=random(13)-6;
  if(input.battleFormat==='singles')input.spread='single';
  else{input.helpingHand=!!random(2);input.friendGuardCount=random(2);}
  for(const entry of ['core','move']){compare('seed '+index+'/'+entry,entry,input);report.seededComparisons++;}report.seededInputs++;
 }
 for(const [multiHitMove,power] of [['ドラゴンアロー',50],['タネマシンガン',25],['ボーンラッシュ',25]])for(const mode of ['none','skillLink','loadedDice'])for(const defAbility of ['none','shadowShield']){
  const input={...structuredClone(base),power,attAbility:mode==='skillLink'?mode:'none',attItem:mode==='loadedDice'?mode:'none',defAbility};
  const actual=compare('multi-hit '+multiHitMove+'/'+mode+'/'+defAbility,'move',input,{multiHitMove});
  assert.ok(actual.output.multiHitDistribution,'Witness must exercise complete multi-hit probabilities');report.multiHitComparisons++;
 }
 for(const beatUpStats of ['100','1,255','100,80,120,130,90,70']){
  const actual=compare('Beat Up '+beatUpStats,'move',{...structuredClone(base),moveMechanic:'beatUpManual'},{beatUpStats});assert.ok(actual.output.multiHitDistribution);report.multiHitComparisons++;
 }
 // Preserve declared unsupported semantics; promotion is not new coverage.
 const unsupported=compare('multihit Multiscale remains unsupported','move',{...structuredClone(base),defAbility:'multiscale'},{multiHitMove:'ドラゴンアロー'},false);
 assert.ok(unsupported.error);report.unsupportedWitnesses++;
 const noScreen=compare('Raging Bull unsupported screen-removal/no screen','core',{...structuredClone(base),moveMechanic:'ragingBull',power:90});
 const screened=compare('Raging Bull unsupported screen-removal/Reflect','core',{...structuredClone(base),moveMechanic:'ragingBull',power:90,screen:'reflect'});
 assert.notDeepEqual(screened.output.rolls,noScreen.output.rolls);report.unsupportedWitnesses++;
 report.status='PASS';report.unexplainedDifferences=0;
 console.log('PASS v1.0.0 numeric promotion: '+JSON.stringify({fixedContracts:report.fixedContracts,documentedCorrections:report.documentedCorrections,screenCases:report.screenCases,speedBoundaries:report.speedBoundaries,seededInputs:report.seededInputs,seededComparisons:report.seededComparisons,multiHitComparisons:report.multiHitComparisons,completeOutputComparisons:report.completeOutputComparisons,protectedFiles:protectedFiles.length,uncommittedPreview:report.uncommittedPreview}));
}catch(error){report.status='FAIL';report.failure=error.stack;throw error;}
finally{const out=path.join(root,'reports/v100');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'engine-promotion.json'),JSON.stringify(report,null,2)+'\n');}
