/* Explicit compatibility with the unchanged feedback service's two-part version field. */
(()=>{
 'use strict';
 const wireDescriptionLimit=5000;
 const stableTitle='Singularity v1.0.0',stableVersion='v1.0.0',wireVersion='v1.0';
 // Only explicitly supported releases may use the historical two-part wire format.
 const candidates=new Map([1,2,3,4,5,6,7].map(number=>{
  const fullVersion='v1.1.0 Pre-Release '+number,wireVersion='v1.1 Pre-Release '+number;
  return ['Singularity '+fullVersion,Object.freeze({fullVersion,wireVersion,prefix:'[Singularity release: '+fullVersion+']\n\n'})];
 }));
 const stablePrefix='[Singularity release: v1.0.0]\n\n';
 const copy=Object.freeze({
  ja:Object.freeze({label:'報告する製品版',header:'以下の版情報は、添付の有無にかかわらず本文に自動で付加されます。',compatibility:'添付内のappVersion「v1.0」は互換送信用の識別子です。完全な製品版はv1.0.0です。',unsupported:'この製品版の報告形式には未対応です。内容は送信されていません。'}),
  en:Object.freeze({label:'Reported product version',header:'The version header below is added to the description, with or without an attachment.',compatibility:'The attachment appVersion “v1.0” is a compatibility identifier. The full product version is v1.0.0.',unsupported:'Reporting is not supported for this product version. Nothing was sent.'}),
  fr:Object.freeze({label:'Version du produit signalée',header:'L’en-tête de version ci-dessous est ajouté à la description, avec ou sans pièce jointe.',compatibility:'Le champ appVersion « v1.0 » de la pièce jointe est un identifiant de compatibilité. La version complète du produit est v1.0.0.',unsupported:'Le signalement n’est pas pris en charge pour cette version du produit. Rien n’a été envoyé.'}),
  de:Object.freeze({label:'Gemeldete Produktversion',header:'Die Versionszeile unten wird der Beschreibung mit oder ohne Anhang hinzugefügt.',compatibility:'Das Feld appVersion „v1.0“ im Anhang ist eine Kompatibilitätskennung. Die vollständige Produktversion ist v1.0.0.',unsupported:'Meldungen für diese Produktversion werden nicht unterstützt. Es wurde nichts gesendet.'}),
  es:Object.freeze({label:'Versión del producto notificada',header:'La cabecera de versión siguiente se añade a la descripción, con o sin archivo adjunto.',compatibility:'El campo appVersion «v1.0» del adjunto es un identificador de compatibilidad. La versión completa del producto es v1.0.0.',unsupported:'No se admiten informes para esta versión del producto. No se ha enviado nada.'}),
  'es-LA':Object.freeze({label:'Versión del producto reportada',header:'El encabezado de versión siguiente se agrega a la descripción, con o sin archivo adjunto.',compatibility:'El campo appVersion «v1.0» del adjunto es un identificador de compatibilidad. La versión completa del producto es v1.0.0.',unsupported:'No se admiten reportes para esta versión del producto. No se envió nada.'}),
  it:Object.freeze({label:'Versione del prodotto segnalata',header:'L’intestazione di versione seguente viene aggiunta alla descrizione, con o senza allegato.',compatibility:'Il campo appVersion «v1.0» dell’allegato è un identificatore di compatibilità. La versione completa del prodotto è v1.0.0.',unsupported:'Le segnalazioni non sono supportate per questa versione del prodotto. Non è stato inviato nulla.'}),
  ko:Object.freeze({label:'보고하는 제품 버전',header:'첨부 여부와 관계없이 아래 버전 정보가 설명에 자동으로 추가됩니다.',compatibility:'첨부 내용의 appVersion “v1.0”은 호환 전송용 식별자입니다. 전체 제품 버전은 v1.0.0입니다.',unsupported:'이 제품 버전의 보고 형식은 지원하지 않습니다. 내용은 전송되지 않았습니다.'}),
  'zh-Hans':Object.freeze({label:'报告的产品版本',header:'无论是否附加计算条件，以下版本信息都会自动添加到说明中。',compatibility:'附件中的appVersion“v1.0”是兼容传输标识。完整产品版本为v1.0.0。',unsupported:'尚不支持此产品版本的报告格式。内容未发送。'}),
  'zh-Hant':Object.freeze({label:'回報的產品版本',header:'無論是否附加計算條件，以下版本資訊都會自動加入說明中。',compatibility:'附件中的appVersion「v1.0」是相容傳輸識別碼。完整產品版本為v1.0.0。',unsupported:'尚不支援此產品版本的回報格式。內容未傳送。'})
 });
 function identify(title){
  const candidate=candidates.get(title);
  if(candidate)return Object.freeze({...candidate,descriptionLimit:wireDescriptionLimit-candidate.prefix.length,compatibility:true});
  if(title===stableTitle)return Object.freeze({fullVersion:stableVersion,wireVersion,prefix:stablePrefix,descriptionLimit:wireDescriptionLimit-stablePrefix.length,compatibility:true});
  // Historical prereleases keep their exact existing wire identity. In
  // particular, no prefix/partial match may silently truncate v1.0.1 or 1.0.0.
  const historical=typeof title==='string'&&title.match(/^(?:Singularity|Chloha Damage Lab) (v0\.(?:0|[1-9]\d*) Pre-Release [1-9]\d*)$/);
  if(historical)return Object.freeze({fullVersion:historical[1],wireVersion:historical[1],prefix:'',descriptionLimit:wireDescriptionLimit,compatibility:false});
  throw Error('unsupported_report_version');
 }
 function description(title,value){
  const identity=identify(title);
  if(typeof value!=='string'||!value.trim())throw Error('requiredDescription');
  if(value.length>identity.descriptionLimit)throw Error('tooLong');
  return identity.prefix+value.trim();
 }
 function text(locale,key,title){
  const value=(copy[locale]||copy.en)[key];
  const candidate=candidates.get(title);
  if(!candidate||typeof value!=='string')return value;
  // Replace only the two exact identity literals; never truncate arbitrary versions.
  return value.replaceAll(stableVersion,'{fullVersion}').replaceAll(wireVersion,candidate.wireVersion).replaceAll('{fullVersion}',candidate.fullVersion);
 }
 globalThis.ChlohaFeedbackRelease=Object.freeze({identify,description,text,copy,wireDescriptionLimit});
})();
