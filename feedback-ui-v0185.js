(()=>{
 'use strict';
 function initialize(){
  const app=document.getElementById('app');if(!app||document.getElementById('feedbackPanel'))return;
  const C=window.ChlohaFeedbackContract,L=window.ChlohaFeedbackLocales;
  const locale=()=>window.ChlohaLocale?.get?.()||'ja',t=key=>L.text(locale(),key);
  const button=document.createElement('button');button.id='feedbackButton';button.type='button';button.dataset.noTranslate='';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','feedbackPanel');
  const panel=document.createElement('section');panel.id='feedbackPanel';panel.hidden=true;panel.dataset.noTranslate='';panel.className='panel';panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','feedbackTitle');
  // All markup is constant. Report text, server data and previews use value/textContent only.
  panel.innerHTML=`<div class="feedback-heading"><h2 id="feedbackTitle" data-fb="title"></h2><button id="feedbackClose" type="button" data-fb="close"></button></div><p data-fb="intro"></p>
<form id="feedbackForm" novalidate><fieldset id="feedbackFields"><label for="feedbackCategory" data-fb="category"></label><select id="feedbackCategory" required><option value="" data-fb="choose"></option><option value="bug" data-fb="bug"></option><option value="calculation" data-fb="calculation"></option><option value="translation" data-fb="translation"></option><option value="feature" data-fb="feature"></option></select>
<label for="feedbackDescription" data-fb="description"></label><p id="feedbackDescriptionHelp" data-fb="descriptionHelp"></p><textarea id="feedbackDescription" rows="6" maxlength="5000" required aria-describedby="feedbackDescriptionHelp"></textarea>
<label for="feedbackEmail" data-fb="email"></label><p id="feedbackEmailHelp" data-fb="emailHelp"></p><input id="feedbackEmail" type="email" maxlength="254" autocomplete="email" aria-describedby="feedbackEmailHelp">
<label class="feedback-check"><input id="feedbackAttach" type="checkbox" aria-describedby="feedbackAttachHelp"><span data-fb="attach"></span></label><p id="feedbackAttachHelp" data-fb="attachHelp"></p>
<div id="feedbackAttachment" hidden><h3 data-fb="preview"></h3><p id="feedbackStale" data-fb="stale" hidden></p><pre id="feedbackPreview" tabindex="0"></pre><button id="feedbackRefresh" type="button" data-fb="refresh"></button><label class="feedback-check"><input id="feedbackConfirm" type="checkbox"><span data-fb="confirm"></span></label></div>
</fieldset><div class="feedback-trap" aria-hidden="true"><label>Website<input id="feedbackWebsite" name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
<p id="feedbackPrivacy" data-fb="privacy"></p><a id="feedbackProviderPrivacy" href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" data-fb="providerPrivacy"></a>
<p id="feedbackMode" data-fb="localNotice" hidden></p><div id="feedbackChallenge"></div><p id="feedbackErrors" role="alert" hidden></p><p id="feedbackStatus" role="status" aria-live="polite"></p><button id="feedbackSubmit" type="submit" data-fb="submit"></button></form>`;
  const style=document.createElement('style');style.textContent=`#feedbackPanel{margin:24px 0;scroll-margin-top:80px;background:#fff;color:#25324a;border-color:#d6dce6;color-scheme:light}#feedbackPanel[hidden],#feedbackPanel [hidden]{display:none!important}#feedbackPanel fieldset{border:0;padding:0;margin:0;min-width:0}#feedbackPanel label:not(.feedback-check){display:block;font-weight:650;margin:18px 0 6px;color:#2c3e56}#feedbackPanel input:not([type=checkbox]),#feedbackPanel select,#feedbackPanel textarea{display:block;width:100%;max-width:100%;font:inherit;box-sizing:border-box;background:#fff;color:#25324a;border:1px solid #8793a7;border-radius:8px;padding:10px}#feedbackPanel textarea{resize:vertical;min-height:130px}#feedbackPanel p{line-height:1.65;overflow-wrap:anywhere;color:#526079}#feedbackPanel pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow:auto;padding:12px;background:#f5f7fb;color:#25324a;border-radius:8px}#feedbackPanel button,#feedbackButton{min-height:44px;white-space:normal}#feedbackPanel button{background:#fff;color:#334155;border:1px solid #c7ceda}#feedbackPanel #feedbackSubmit{background:#b72f50;color:#fff;border-color:#b72f50}#feedbackPanel h2,#feedbackPanel h3{color:#25324a}#feedbackPanel a{color:#982747;text-decoration:underline}#feedbackPanel input,#feedbackPanel textarea,#feedbackPanel select{scroll-margin-top:80px}#feedbackPanel input[type=checkbox]{accent-color:#b72f50}#feedbackPanel button:disabled{opacity:.55;cursor:default}.feedback-heading{display:flex;align-items:start;justify-content:space-between;gap:12px}.feedback-heading h2{margin:0}.feedback-check{display:flex;align-items:start;gap:10px;margin:18px 0 6px;flex-direction:row;color:#2c3e56}.feedback-check input{width:22px;height:22px;flex-shrink:0;margin:0}.feedback-trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}#feedbackPanel #feedbackErrors,#feedbackPanel #feedbackStale{color:#9a3412}#feedbackStatus{white-space:pre-wrap;min-height:24px;color:#334155}#feedbackPanel :focus-visible,#feedbackButton:focus-visible{outline:3px solid #982747;outline-offset:3px}#feedbackPanel [aria-invalid=true]{border-color:#b42318}#feedbackButton{margin:12px 0}#feedbackPanel [disabled]{cursor:default}@media(max-width:550px){#feedbackPanel{padding:14px}#feedbackSubmit,#feedbackRefresh{width:100%}.feedback-heading{flex-wrap:wrap}}`;
  document.head.append(style);const footer=app.querySelector('.lab-footer');if(footer){footer.before(panel);footer.append(button);}else app.append(panel,button);
  const $=id=>document.getElementById('feedback'+id);
  let ready=false,preparing=false,busy=false,delivered=false,mode='',siteKey='',token='',widget=null,scriptPromise=null,base='',snapshot=null,stale=false,submission=null,statusKey='unavailable',errorKey='',receipt='';
  const controls=()=>{$('Fields').disabled=busy;$('Submit').disabled=busy||!ready||delivered;$('Submit').textContent=t(busy?'sending':'submit');};
  function messages(){
   $('Status').textContent=(statusKey?t(statusKey):'')+(receipt?'\n'+t('reference')+': '+receipt:'');
   $('Errors').hidden=!errorKey;$('Errors').textContent=errorKey?t(errorKey):'';controls();
  }
  function renderLocale(){button.textContent=t('button');for(const node of panel.querySelectorAll('[data-fb]')){const text=t(node.dataset.fb);node.textContent=text;if(node.tagName==='OPTION')node.label=text;}messages();if(ready&&!busy)renderWidget();}
  function dirty(){if(busy)return;submission=null;delivered=false;receipt='';errorKey='';statusKey=ready?'':preparing?'preparing':'unavailable';messages();}
  function attachment(){
   $('Attachment').hidden=!$('Attach').checked;snapshot=null;stale=false;$('Stale').hidden=true;$('Confirm').checked=false;
   if($('Attach').checked){try{snapshot=window.ChlohaFeedbackSnapshot.capture();$('Preview').textContent=JSON.stringify(snapshot,null,2);}catch{$('Preview').textContent='';errorKey='attachmentUnavailable';}}
   messages();
  }
  const langMap={'zh-Hans':'zh-cn','zh-Hant':'zh-tw'};
  function renderWidget(){
   if(!window.turnstile||!ready)return;
   token='';if(widget!==null)window.turnstile.remove(widget);
   widget=window.turnstile.render($('Challenge'),{sitekey:siteKey,action:'feedback',language:langMap[locale()]||locale(),retry:'never',callback:value=>{token=typeof value==='string'&&value.length<=2048?value:'';},'expired-callback':()=>{token='';},'error-callback':()=>{token='';errorKey='challengeError';messages();return true;}});
  }
  function loadWidgetScript(){
   if(window.turnstile)return Promise.resolve();if(scriptPromise)return scriptPromise;
   scriptPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
    const timer=setTimeout(()=>{script.remove();scriptPromise=null;reject(Error('challenge'));},10000);
    script.onload=()=>{clearTimeout(timer);if(window.turnstile)resolve();else{scriptPromise=null;reject(Error('challenge'));}};
    script.onerror=()=>{clearTimeout(timer);scriptPromise=null;script.remove();reject(Error('challenge'));};document.head.append(script);
   });return scriptPromise;
  }
  async function connect(){
   if(ready||preparing)return;
   try{
    const configured=window.ChlohaFeedbackConfig?.apiBase;if(!configured)throw Error('unavailable');
    const url=new URL(configured);if(url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname)||!(url.protocol==='https:'||(url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname))))throw Error('unavailable');
    base=url.origin;preparing=true;statusKey='preparing';messages();
    const response=await fetch(base+'/v1/config',{credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)});
    const config=await response.json();if(!response.ok||config.enabled!==true||typeof config.siteKey!=='string'||!config.siteKey||config.retentionDays!==C.limits.retentionDays||!['production','local-demo'].includes(config.mode))throw Error('unavailable');
    siteKey=config.siteKey;mode=config.mode;await loadWidgetScript();ready=true;statusKey='';$('Mode').hidden=mode!=='local-demo';renderWidget();
   }catch{ready=false;statusKey='unavailable';}finally{preparing=false;messages();}
  }
  function open(){panel.hidden=false;button.setAttribute('aria-expanded','true');$('Category').focus();connect();}
  function close(){panel.hidden=true;button.setAttribute('aria-expanded','false');button.focus();}
  button.addEventListener('click',()=>panel.hidden?open():close());$('Close').addEventListener('click',close);
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();}});
  $('Form').addEventListener('input',dirty);$('Form').addEventListener('change',dirty);
  $('Attach').addEventListener('change',attachment);$('Refresh').addEventListener('click',()=>{dirty();attachment();});
  for(const event of ['input','change'])document.addEventListener(event,e=>{
   if(panel.contains(e.target)||e.target.id==='chloha-locale'||!C.controlIds.includes(e.target.id))return;
   if(snapshot){stale=true;$('Stale').hidden=false;$('Confirm').checked=false;dirty();}
  });
  function invalid(key,id){errorKey=key;messages();if(id){$(id).setAttribute('aria-invalid','true');$(id).focus();}}
  $('Form').addEventListener('submit',async event=>{
   event.preventDefault();if(busy||delivered)return;
   for(const id of ['Category','Description','Email'])$(id).removeAttribute('aria-invalid');
   if(!C.categories.includes($('Category').value))return invalid('requiredCategory','Category');
   if(!$('Description').value.trim())return invalid('requiredDescription','Description');
   if($('Description').value.length>C.limits.description)return invalid('tooLong','Description');
   const email=$('Email').value.trim();if(email&&(email.length>C.limits.email||!/^[^\s@<>]{1,64}@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/.test(email)))return invalid('emailError','Email');
   if($('Attach').checked&&(!snapshot||stale||!$('Confirm').checked))return invalid('attachmentError','Confirm');
   if(!ready)return invalid('unavailable');if(!token)return invalid('challengeRequired');
   if(!submission)submission={requestId:crypto.randomUUID(),category:$('Category').value,description:$('Description').value.trim(),email,locale:locale(),appVersion:document.title.match(/v\d+\.\d+(?: Pre-Release \d+)?/)?.[0]||'',snapshot:$('Attach').checked?structuredClone(snapshot):null,website:$('Website').value};
   const payload={...submission,turnstileToken:token};busy=true;errorKey='';statusKey='sending';messages();
   try{
    const response=await fetch(base+'/v1/reports',{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
    let data;try{data=await response.json();}catch{throw Error('failure');}
    if(response.status!==201||data.ok!==true||typeof data.receipt!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.receipt)){
     const errors={rate_limited:'rateLimited',request_conflict:'conflict',challenge:'challengeError',email:'emailError',description:'requiredDescription',snapshot:'attachmentError',unavailable:'failure'};throw Error(errors[data.error]||'failure');
    }
    receipt=data.receipt;delivered=true;statusKey=mode==='local-demo'?'localSuccess':'success';
   }catch(e){statusKey='';errorKey=L.keys.includes(e.message)?e.message:'failure';}
   finally{busy=false;token='';messages();if(ready)renderWidget();}
  });
  document.addEventListener('chloha:localechange',renderLocale);renderLocale();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
