'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {startLab,launchBrowser,ready,mockFeedback}=require('./helpers/v0188-browser-lab.cjs');
const locales=['ja','en','fr','de','es','it','ko','zh-Hans','zh-Hant'];
const searches=[['moveSearch','moveSuggestions','Dragon'],['attSearch','attSuggestions','Charizard'],['defSearch','defSuggestions','Charizard']];
const numeric=page=>page.evaluate(()=>JSON.stringify({a:window.ChlohaLastCalculation.a,r:window.ChlohaLastCalculation.r}));
const selected=page=>page.evaluate(()=>['dbMove','dbAttPokemon','dbDefPokemon'].map(id=>document.getElementById(id).value));
const focused=page=>page.evaluate(()=>document.activeElement.id);
const canonicalNotice=fs.readFileSync('index.html','utf8').match(/<p class="dbnote" id="versionProvenance">([^<]+)<\/p>/)[1];
const noticeBindings={version:canonicalNotice.match(/画面の「([^」]+)」/)[1],core:canonicalNotice.match(/内部API識別子は「([^」]+)」/)[1],regression:canonicalNotice.match(/(v[\d.]+)の自動回帰監査/)[1]};
// Independently specified factual fragments, not equality to generated production copy.
const noticeFacts={
 ja:['実機精度の検証完了を意味しません','体重依存技4種類と連続技のブラウザ検証','Showdown差分テストは合格済み','連続技のマルチスケイル処理など一部条件は未対応','Showdownを計算仕様の検証基準','仕様差異が確認された場合は個別に対応'],
 en:['does not mean that verification of accuracy on hardware is complete','four weight-dependent moves and multi-hit moves','Showdown differential tests have passed','Multiscale handling for multi-hit moves, are unsupported','Showdown is the calculation-specification reference','confirmed Pokémon Champions-specific differences will be handled separately'],
 fr:['ne signifie pas que la vérification de la précision sur console est terminée','quatre capacités dépendant du poids et des capacités à coups multiples','tests différentiels avec Showdown ont réussi','Multiécaille pour les capacités à coups multiples, ne sont pas prises en charge','Showdown sert de référence pour les règles de calcul','lorsqu’elles seront confirmées'],
 de:['bedeutet nicht, dass die Genauigkeitsprüfung auf echter Hardware abgeschlossen ist','vier gewichtsabhängige Attacken und Mehrfachtreffer-Attacken','Showdown-Differenztests wurden bestanden','Multischuppe bei Mehrfachtreffer-Attacken, werden nicht unterstützt','Showdown dient als Referenz für die Berechnungsregeln','bestätigte Besonderheiten von Pokémon Champions werden gesondert behandelt'],
 es:['no significa que se haya completado la verificación de precisión en consola','cuatro movimientos dependientes del peso y de movimientos de varios golpes','pruebas diferenciales con Showdown','Multiescamas en movimientos de varios golpes, no están implementadas','Showdown es la referencia para las reglas de cálculo','se tratarán por separado cuando se confirmen'],
 it:['non significa che la verifica della precisione su console sia completa','quattro mosse dipendenti dal peso e delle mosse multicolpo','test differenziali con Showdown','Multisquame nelle mosse multicolpo, non sono supportate','Showdown è il riferimento per le regole di calcolo','verranno gestite separatamente quando saranno confermate'],
 ko:['실기기 기준 정확도 검증이 완료되었다는 뜻이 아닙니다','체중에 따라 달라지는 기술 4종과 연속 공격 기술의 브라우저 검사','Showdown 차등 테스트는 통과했습니다','멀티스케일 처리 등 일부 조건은 지원하지 않습니다','Showdown을 계산 규칙 검증의 기준으로 사용','사양 차이가 확인되면 개별적으로 대응합니다'],
 'zh-Hans':['不代表已完成实机精度验证','4种依赖体重的招式及多段招式的浏览器测试','Showdown差分测试均已通过','多重鳞片处理等部分条件尚不支持','以Showdown作为计算规则验证的基准','确认Pokémon Champions特有的机制差异后，将另行处理'],
 'zh-Hant':['不代表已完成實機精度驗證','4種依賴體重的招式及多段招式的瀏覽器測試','Showdown差分測試均已通過','多重鱗片處理等部分條件尚不支援','以Showdown作為計算規則驗證的基準','確認Pokémon Champions特有的機制差異後，將另行處理']
};
const obsoleteHardwareClaims=/Only some conditions have been compared|Seules certaines conditions ont été comparées|Nur einige Bedingungen wurden|Solo se han contrastado algunas condiciones|Solo alcune condizioni sono state confrontate|일부 조건만 Pokémon Champions 실기기와 비교했으며|僅部分條件與Pokémon Champions實機比較過|仅部分条件与Pokémon Champions实机比较过/;
function checkNotice(text,locale,bindings=noticeBindings){
 for(const value of Object.values(bindings))assert.ok(text.includes(value),'version/core/regression binding: '+locale+'/'+value);
 for(const fact of noticeFacts[locale])assert.ok(text.includes(fact),'FINAL-L02 canonical factual scope: '+locale+'/'+fact);
 assert.doesNotMatch(text,/\b54\b/,'no fabricated comparison count');
 assert.doesNotMatch(text,obsoleteHardwareClaims,'no ungrounded partial hardware comparison claim');
 if(locale==='ko'){
  assert.ok(text.startsWith('버전 안내: 화면에 표시되는 “'+bindings.version+'”는 공개 UI 버전입니다.'),'FINAL-L01 complete Korean prefix');
  assert.doesNotMatch(text,/The on-screen|About versions:/);
 }
}
function sourceNoticeRegression(){
 const vm=require('node:vm');
 const load=source=>{const scope={window:{},document:{readyState:'loading',addEventListener(){},getElementById:id=>id==='app'?{}:null,querySelectorAll:()=>[]},localStorage:{getItem:()=>null}};vm.runInNewContext(source.replace('function initialize(){','window.__noticeAudit={set(value){locale=value},text:localizedUi};function initialize(){'),scope);return scope.window.__noticeAudit;};
 const current=load(fs.readFileSync('i18n.js','utf8'));
 const prior=load(execFileSync('git',['show','5f88e471d5a8a3374181ce0d37deb211c1dd9f26:i18n.js'],{encoding:'utf8',maxBuffer:16*1024*1024}));
 const synthetic=canonicalNotice.replace(noticeBindings.version,'v7.321 Pre-Release 9').replace('内部API識別子は「'+noticeBindings.core+'」','内部API識別子は「v8.765」').replace(noticeBindings.regression+'の自動回帰監査','v9.876の自動回帰監査');
 const syntheticBindings={version:'v7.321 Pre-Release 9',core:'v8.765',regression:'v9.876'};
 for(const locale of locales){
  current.set(locale);prior.set(locale);checkNotice(current.text(canonicalNotice),locale);checkNotice(current.text(synthetic),locale,syntheticBindings);
  if(locale==='ja')assert.equal(current.text(canonicalNotice),canonicalNotice,'Japanese canonical notice is unmodified');
  else assert.throws(()=>checkNotice(prior.text(canonicalNotice),locale),'prior non-Japanese notice must reproduce the factual-scope defect');
 }
 console.log('PASS FINAL-L01/L02 source functions: nine canonical notices and dynamic version/core/regression identities; eight prior factual-scope failures reproduced.');
}
sourceNoticeRegression();
async function named(locator,role){
 const snapshot=await locator.ariaSnapshot();
 assert.match(snapshot,new RegExp('(?:^|\\n)- '+role+' "[^"\\n]+"'),'computed accessible name for '+role+': '+snapshot);
 return snapshot.split('\n')[0];
}
async function composingSearch(page,inputId,listId,query){
 const input=page.locator('#'+inputId),options=page.locator('#'+listId+' [role=option]');
 await page.mouse.move(0,0);await input.fill(query);
 assert.ok(await options.count()>1,'multiple search results: '+inputId);
 const original=await numeric(page),values=await selected(page),name=await named(input,'combobox');
 // Exercise both browser isComposing and the application composition-session guard.
 // Synthetic DOM events are not evidence of a real OS IME/device interaction.
 for(const session of [false,true]){
  if(session)await input.dispatchEvent('compositionstart',{data:''});
  for(const key of ['ArrowDown','ArrowUp','Enter']){
   await input.dispatchEvent('keydown',{key,isComposing:!session,bubbles:true,cancelable:true});
   assert.equal(await input.getAttribute('aria-activedescendant'),null,'composition must not navigate: '+inputId+'/'+key+'/'+session);
   assert.deepEqual(await selected(page),values,'composition must not commit a selected value');
   assert.equal(await numeric(page),original,'composition must not recalculate');
  }
  if(session)await input.dispatchEvent('compositionend',{data:query});
 }
 await input.press('ArrowDown');
 assert.equal(await input.getAttribute('aria-activedescendant'),await options.first().getAttribute('id'),'normal navigation resumes after compositionend');
 await input.press('Escape');
 assert.equal(await input.getAttribute('aria-expanded'),'false');
 assert.equal(await input.getAttribute('aria-activedescendant'),null);
 assert.equal(await focused(page),inputId,'Escape retains focus in combobox');
 assert.equal(await numeric(page),original);
 return name;
}
if(!process.argv.includes('--source-only'))(async()=>{
 const lab=await startLab();let browser;
 const out='reports/v0188-final';fs.mkdirSync(out,{recursive:true});
 const evidence={candidateCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),mode:'Chromium browser automation; synthetic composition events; local feedback fixture',realDevice:false,productionMutations:0,reportPosts:0,cases:[],screenshots:[],limits:['No physical device or OS IME verification','No native screen-reader verification','Accessible names checked for presence/label association, not native-language accuracy','Not a complete contrast audit']};
 try{
  browser=await launchBrowser();
  for(const locale of locales){
   const width=locale==='ja'?320:locale==='zh-Hant'?1440:390;
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768,reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await mockFeedback(context,lab.origin);
   await context.route('**/v1/reports',route=>{evidence.reportPosts++;return route.abort();});
   await context.addInitScript(value=>localStorage.setItem('chloha.damageLab.locale',value),locale);
   try{
    await page.goto(lab.origin+'/candidate/');await ready(page);
    const original=await numeric(page),names={};
    let versionNotice;
    for(const state of ['restored','switched','reloaded']){
     if(state==='switched'){await page.selectOption('#chloha-locale',locale==='en'?'ja':'en');await page.selectOption('#chloha-locale',locale);}
     if(state==='reloaded'){await page.reload();await ready(page);}
     versionNotice=await page.locator('#versionProvenance').innerText();checkNotice(versionNotice,locale);
     assert.equal(await numeric(page),original,'version notice '+locale+'/'+state+' preserves complete numeric result');
    }
    for(const [input,list,query] of searches)names[input]=await composingSearch(page,input,list,query);
    names.feedbackButton=await named(page.locator('#feedbackButton'),'button');
    await page.locator('#feedbackButton').click();
    assert.equal(await page.locator('#feedbackButton').getAttribute('aria-expanded'),'true');
    assert.equal(await focused(page),'feedbackCategory','opening the nonmodal feedback region focuses category');
    const title=await page.locator('#feedbackTitle').innerText();assert.ok(title.trim());
    assert.equal(await page.getByRole('region',{name:title,exact:true}).count(),1,'feedback region is named by heading');
    for(const [id,role] of [['feedbackCategory','combobox'],['feedbackDescription','textbox'],['feedbackEmail','textbox'],['feedbackAttach','checkbox'],['feedbackClose','button'],['feedbackSubmit','button']])names[id]=await named(page.locator('#'+id),role);
    await page.locator('#feedbackDescription').fill('Local accessibility fixture; never submitted.');
    await page.locator('#feedbackDescription').press('Escape');
    assert.equal(await page.locator('#feedbackPanel').isVisible(),false);
    assert.equal(await page.locator('#feedbackButton').getAttribute('aria-expanded'),'false');
    assert.equal(await focused(page),'feedbackButton','Escape restores trigger focus');
    await page.locator('#feedbackButton').press('Enter');
    assert.equal(await focused(page),'feedbackCategory','keyboard reopen focuses category');
    assert.equal(await page.locator('#feedbackDescription').inputValue(),'Local accessibility fixture; never submitted.');
    await page.locator('#feedbackClose').click();
    assert.equal(await focused(page),'feedbackButton','close button restores trigger focus');
    assert.equal(await numeric(page),original,'search navigation and feedback focus/typing preserve calculation');
    assert.deepEqual(errors,[],'no uncaught page errors');
    if(['ja','ko','zh-Hant'].includes(locale)){
     await page.evaluate(()=>scrollTo(0,0));
     const file=out+'/ui-'+locale+'-'+width+'.png';await page.screenshot({path:file,fullPage:true});evidence.screenshots.push(file);
    }
    evidence.cases.push({locale,width,comboboxCompositionCases:3,names,versionNotice,passed:true});
   }finally{await context.close();}
  }
  assert.equal(evidence.reportPosts,0,'no report submissions');evidence.passed=true;
  console.log('Final accessibility: 27 synthetic IME combobox cases and 9 feedback name/focus cycles passed; 3 screenshots captured.');
 }catch(error){evidence.passed=false;evidence.error=error.message;throw error;}
 finally{fs.writeFileSync(out+'/accessibility.json',JSON.stringify(evidence,null,2)+'\n');if(browser)await browser.close();await lab.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
