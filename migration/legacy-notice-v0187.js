/* Legacy-site artifact only. No redirect and no automatic input/snapshot transfer. */
(()=>{
 'use strict';
 const labels={
  ja:['Damage LabからSingularityへ','新しい計算機を別タブで開けます。この旧版も引き続き使えます。入力や未送信の報告は自動転送しません。','Singularityを開く'],
  en:['Damage Lab is moving to Singularity','Open the new calculator in another tab. This legacy calculator remains usable. Inputs and unsent reports are not transferred automatically.','Open Singularity'],
  fr:['Damage Lab devient Singularity','Ouvrez le nouveau calculateur dans un autre onglet. Cette version reste utilisable. Les saisies et signalements non envoyés ne sont pas transférés automatiquement.','Ouvrir Singularity'],
  de:['Damage Lab wird zu Singularity','Öffnen Sie den neuen Rechner in einem weiteren Tab. Diese Version bleibt nutzbar. Eingaben und ungesendete Meldungen werden nicht automatisch übertragen.','Singularity öffnen'],
  es:['Damage Lab pasa a ser Singularity','Abre la nueva calculadora en otra pestaña. Esta versión sigue disponible. Los datos y los informes sin enviar no se transfieren automáticamente.','Abrir Singularity'],
  it:['Damage Lab diventa Singularity','Apri il nuovo calcolatore in un’altra scheda. Questa versione resta utilizzabile. Dati e segnalazioni non inviate non vengono trasferiti automaticamente.','Apri Singularity'],
  ko:['Damage Lab이 Singularity로 이전합니다','새 계산기를 다른 탭에서 열 수 있습니다. 이 이전 버전도 계속 사용할 수 있습니다. 입력과 미전송 신고는 자동으로 이전되지 않습니다.','Singularity 열기'],
  'zh-Hans':['Damage Lab 将迁移至 Singularity','可在新标签页打开新计算器。本旧版仍可使用。输入内容和未发送的反馈不会自动转移。','打开 Singularity'],
  'zh-Hant':['Damage Lab 將遷移至 Singularity','可在新分頁開啟新計算器。本舊版仍可使用。輸入內容及未傳送的回饋不會自動轉移。','開啟 Singularity']
 };
 function init(){
  const notice=document.createElement('aside');notice.id='singularityMigrationNotice';notice.className='singularity-migration-notice';notice.dataset.noTranslate='';
  const title=document.createElement('strong'),text=document.createElement('p'),link=document.createElement('a');
  link.href='../singularity/';link.target='_blank';link.rel='noopener noreferrer';notice.append(title,text,link);document.body.prepend(notice);
  const refresh=()=>{const locale=window.ChlohaLocale?.get?.()||'ja',[a,b,c]=labels[locale]||labels.ja;title.textContent=a;text.textContent=b;link.textContent=c;notice.setAttribute('aria-label',a);};
  document.addEventListener('chloha:localechange',refresh);refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
