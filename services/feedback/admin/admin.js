(()=>{
 'use strict';
 const $=id=>document.getElementById(id);let report=null,next=null,busy=false;
 const messages={unauthorized:'Your administrator session is missing or expired. Sign in through Cloudflare Access and reload.',forbidden:'This identity is not authorized.',origin:'The request origin was rejected.',revision:'This report changed. Reload the details before retrying.',private_information:'The public summary contains an email address or possible credential. Remove private information.',issue_state:'The report must be Accepted, unexpired, and have no previous or uncertain Issue creation.',issue_uncertain:'GitHub may have created the Issue. Do not submit again. Use the check button to reconcile.',issue_unconfirmed:'No matching Issue was found in the latest 1,000 Issues. No new Issue was created. Investigate the repository before taking further action.',github_unavailable:'GitHub is unavailable or its credentials are not configured.',admin_unavailable:'Administrator authentication or storage is not configured.',issue_summary:'Enter a public title and technical summary, then approve the exact preview.',unavailable:'The service is unavailable. The action was not confirmed.'};
 const say=text=>{$('message').textContent=text;};
 async function api(path,method='GET',body){
  const response=await fetch('/v1/admin/reports'+path,{method,credentials:'same-origin',cache:'no-store',headers:method==='GET'?{}:{'Content-Type':'application/json','X-Chloha-Admin':'1'},body:body===undefined?undefined:JSON.stringify(body)});
  let data;try{data=await response.json();}catch{throw Error('Administrator response was not confirmed. Reload after signing in.');}
  if(!response.ok)throw Error(messages[data.error]||'Request failed ('+response.status+').');return data;
 }
 async function action(fn){if(busy)return;busy=true;controls();try{await fn();}catch(e){say(e.message);}finally{busy=false;controls();}}
 function controls(){
  for(const id of ['reload','next','saveStatus','reconcile','publish','delete'])$(id).disabled=busy;
  $('next').disabled=busy||!next;
  $('publish').disabled=busy||!report||report.status!=='Accepted'||report.issueState!=='none';
  $('delete').disabled=busy||!report||report.issueState==='creating'||!$('deleteConfirm').checked;
 }
 async function loadList(cursor=null){
  const query=new URLSearchParams();for(const key of ['category','status'])if($(key).value)query.set(key,$(key).value);
  if(cursor){query.set('before',cursor.before);query.set('beforeId',cursor.beforeId);}
  const result=await api('?'+query);next=result.next;$('reports').replaceChildren();
  for(const row of result.reports){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=row.category+' · '+row.status+' · '+new Date(row.createdAt*1000).toISOString()+' · '+row.id;button.addEventListener('click',()=>action(()=>loadDetail(row.id)));li.append(button);$('reports').append(li);}
  if(!result.reports.length){const li=document.createElement('li');li.textContent='No reports in this view.';$('reports').append(li);}controls();
 }
 async function loadDetail(id){
  report=(await api('/'+id)).report;$('detail').hidden=false;
  $('metadata').textContent=report.id+' · '+report.category+' · '+report.locale+' · '+report.appVersion+' · expires '+new Date(report.expiresAt*1000).toISOString();
  $('description').textContent=report.description;$('email').textContent=report.email||'Not provided';$('snapshot').textContent=report.snapshot?JSON.stringify(report.snapshot,null,2):'Not attached';
  $('reviewStatus').value=report.status;$('issueState').textContent='Issue state: '+report.issueState;
  $('issueLink').hidden=!report.issueUrl;if(report.issueUrl)$('issueLink').href=report.issueUrl;
  $('reconcile').hidden=!['creating','uncertain'].includes(report.issueState);
  $('deleteConfirm').checked=false;$('reviewed').checked=false;$('issueTitle').value='';$('issueBody').value='';preview();controls();
 }
 function preview(){
  $('reviewed').checked=false;
  $('issuePreview').textContent=JSON.stringify({title:$('issueTitle').value.trim(),body:$('issueBody').value.trim()+(report?'\n\n<!-- chloha-feedback:'+report.id+' -->':'')},null,2);
 }
 $('reload').addEventListener('click',()=>action(async()=>{await loadList();say('Private report list loaded.');}));
 $('next').addEventListener('click',()=>action(()=>loadList(next)));
 $('saveStatus').addEventListener('click',()=>action(async()=>{await api('/'+report.id,'PATCH',{revision:report.revision,status:$('reviewStatus').value});await loadDetail(report.id);await loadList();say('Status saved.');}));
 $('deleteConfirm').addEventListener('change',controls);
 $('delete').addEventListener('click',()=>action(async()=>{const id=report.id;await api('/'+id,'DELETE',{revision:report.revision,confirmed:$('deleteConfirm').checked});report=null;$('detail').hidden=true;await loadList();say('Private report deleted. Published GitHub Issues were retained.');}));
 for(const id of ['issueTitle','issueBody'])$(id).addEventListener('input',preview);
 $('issueForm').addEventListener('submit',event=>{event.preventDefault();action(async()=>{
  if(!$('reviewed').checked||!$('issueTitle').value.trim()||!$('issueBody').value.trim())throw Error(messages.issue_summary);
  try{const result=await api('/'+report.id+'/issue','POST',{revision:report.revision,reviewed:true,title:$('issueTitle').value,body:$('issueBody').value});await loadDetail(report.id);await loadList();say('Public GitHub Issue #'+result.issueNumber+' created.');}
  catch(e){await loadDetail(report.id);throw e;}
 });});
 $('reconcile').addEventListener('click',()=>action(async()=>{const result=await api('/'+report.id+'/reconcile','POST',{revision:report.revision});await loadDetail(report.id);say('Existing GitHub Issue #'+result.issueNumber+' linked. No duplicate was created.');}));
 action(()=>loadList());
})();
