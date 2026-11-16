/* Community display adapter; never changes calculation values or saved input. */
(()=>{
 'use strict';
 const text={
  "ja": [
    "最終固定版のポケモン ダメージ計算機",
    "v1.0.0を保存した旧製品です。今後のSingularityには自動追従しません。",
    "利用案内・コミュニティ版",
    "使い方・改造ガイド",
    "利用条件・権利",
    "現在のSingularity",
    "v1.0.0の最終固定版です。入力はブラウザ内で処理されます。Web版のURLには誰でもアクセスできます。",
    "現状有姿（AS IS）で提供します。動作・計算精度・完全性・特定目的への適合性を保証しません。適用法令で認められる最大限の範囲で責任を制限します。派生版はChloha Labs／Singularityの公式製品ではありません。第三者の権利・ライセンス条件を遵守してください。",
    "画像は同梱していません。計算はオフラインで動作します。",
    "言語",
    "完成版ZIPはオーナーと所属メンバーへの限定配布です。個人利用・改造とコミュニティ内の改造版共有を許可し、外部再配布・改造版の一般公開・商用販売を禁止します。既存の第三者ライセンスは維持します。このページにZIPの取得リンクはありません。"
  ],
  "en": [
    "Preserved Pokémon Damage Calculator",
    "A frozen legacy v1.0.0 edition. It does not automatically follow Singularity updates.",
    "Help and community edition",
    "Start and customize",
    "Terms and rights",
    "Current Singularity",
    "Final frozen v1.0.0 edition. Inputs stay in your browser. The Web address is publicly accessible.",
    "Provided AS IS, without warranties of operation, accuracy, completeness or fitness for purpose. Liability is limited to the maximum extent permitted by applicable law. Derivatives are not official Chloha Labs or Singularity products. Respect third-party rights and licenses.",
    "Artwork is excluded. Calculations work offline.",
    "Language",
    "The complete ZIP is for the owner and recognized community members. Personal use, customization and member-only sharing of modifications are permitted. Outside redistribution, public modified versions and commercial sale are prohibited, subject to existing third-party licenses. There is no ZIP download link on this page."
  ],
  "fr": [
    "Calculateur de dégâts Pokémon conservé",
    "Ancienne édition figée en v1.0.0, sans mise à jour automatique depuis Singularity.",
    "Aide et édition communautaire",
    "Démarrer et personnaliser",
    "Conditions et droits",
    "Singularity actuel",
    "Édition finale figée en v1.0.0. Les saisies restent dans votre navigateur. Le site Web est accessible au public.",
    "Fourni EN L’ÉTAT, sans garantie de fonctionnement, d’exactitude, d’exhaustivité ou d’adéquation. Responsabilité limitée dans la mesure autorisée par la loi. Les dérivés ne sont pas des produits officiels Chloha Labs ou Singularity. Respectez les droits et licences tiers.",
    "Illustrations exclues. Calculs disponibles hors ligne.",
    "Langue",
    "Le ZIP complet est réservé au propriétaire et aux membres reconnus. Usage personnel, personnalisation et partage interne des versions modifiées sont autorisés. Redistribution externe, publication des versions modifiées et vente commerciale sont interdites, sous réserve des licences tierces existantes. Cette page ne propose aucun lien vers le ZIP."
  ],
  "de": [
    "Archivierter Pokémon-Schadensrechner",
    "Festgeschriebene ältere Ausgabe v1.0.0, ohne automatische Singularity-Updates.",
    "Hilfe und Community-Ausgabe",
    "Starten und anpassen",
    "Bedingungen und Rechte",
    "Aktuelles Singularity",
    "Endgültige, eingefrorene Ausgabe v1.0.0. Eingaben bleiben im Browser. Die Webadresse ist öffentlich zugänglich.",
    "Bereitgestellt WIE BESEHEN, ohne Gewähr für Betrieb, Genauigkeit, Vollständigkeit oder Eignung. Haftung nur im gesetzlich zulässigen Umfang beschränkt. Ableitungen sind keine offiziellen Produkte von Chloha Labs oder Singularity. Rechte und Lizenzen Dritter beachten.",
    "Grafiken ausgeschlossen. Berechnungen funktionieren offline.",
    "Sprache",
    "Die vollständige ZIP ist für den Eigentümer und anerkannte Mitglieder bestimmt. Persönliche Nutzung, Anpassung und internes Teilen geänderter Fassungen sind erlaubt. Externe Weiterverteilung, öffentliche geänderte Fassungen und kommerzieller Verkauf sind untersagt; bestehende Drittlizenzen bleiben gültig. Hier gibt es keinen ZIP-Downloadlink."
  ],
  "es": [
    "Calculadora de daño Pokémon conservada",
    "Edición antigua fijada en v1.0.0, sin actualizaciones automáticas de Singularity.",
    "Ayuda y edición comunitaria",
    "Iniciar y personalizar",
    "Condiciones y derechos",
    "Singularity actual",
    "Edición final fijada en v1.0.0. Los datos introducidos permanecen en el navegador. La dirección web es pública.",
    "Se proporciona TAL CUAL, sin garantías de funcionamiento, exactitud, integridad o idoneidad. Responsabilidad limitada en la medida permitida por la ley. Las versiones derivadas no son productos oficiales de Chloha Labs ni Singularity. Respeta los derechos y licencias de terceros.",
    "Ilustraciones excluidas. Los cálculos funcionan sin conexión.",
    "Idioma",
    "El ZIP completo es para el propietario y los miembros reconocidos. Se permiten el uso personal, la personalización y compartir modificaciones dentro de la comunidad. Se prohíben la redistribución externa, la publicación de versiones modificadas y la venta comercial, respetando las licencias de terceros existentes. Esta página no incluye enlace al ZIP."
  ],
  "it": [
    "Calcolatore di danni Pokémon conservato",
    "Edizione precedente fissata alla v1.0.0, senza aggiornamenti automatici da Singularity.",
    "Guida ed edizione community",
    "Avvio e personalizzazione",
    "Condizioni e diritti",
    "Singularity attuale",
    "Edizione finale fissata alla v1.0.0. I dati inseriti restano nel browser. Il sito web è accessibile al pubblico.",
    "Fornito COSÌ COM’È, senza garanzie di funzionamento, precisione, completezza o idoneità. Responsabilità limitata nella misura consentita dalla legge. Le versioni derivate non sono prodotti ufficiali di Chloha Labs o Singularity. Rispettare diritti e licenze di terzi.",
    "Illustrazioni escluse. I calcoli funzionano offline.",
    "Lingua",
    "Lo ZIP completo è riservato al proprietario e ai membri riconosciuti. Sono consentiti uso personale, personalizzazione e condivisione interna delle modifiche. Sono vietate ridistribuzione esterna, pubblicazione delle versioni modificate e vendita commerciale, nel rispetto delle licenze di terzi esistenti. Questa pagina non contiene un link allo ZIP."
  ],
  "ko": [
    "보존용 포켓몬 데미지 계산기",
    "v1.0.0으로 고정된 구버전입니다. Singularity 업데이트를 자동으로 적용하지 않습니다.",
    "이용 안내 및 커뮤니티 버전",
    "시작 및 수정 안내",
    "이용 조건과 권리",
    "최신 Singularity",
    "v1.0.0 최종 고정 버전입니다. 입력은 브라우저 내부에서 처리됩니다. 웹 주소에는 누구나 접근할 수 있습니다.",
    "현 상태(AS IS)로 제공하며 작동, 정확성, 완전성, 특정 목적 적합성을 보증하지 않습니다. 책임 제한은 관련 법률이 허용하는 최대 범위에만 적용됩니다. 파생 버전은 Chloha Labs 또는 Singularity의 공식 제품이 아닙니다. 제삼자의 권리와 라이선스를 준수하세요.",
    "이미지는 제외했습니다. 오프라인 계산이 가능합니다.",
    "언어",
    "완성 ZIP은 소유자와 승인된 커뮤니티 구성원에게만 배포합니다. 개인 이용·수정과 내부 수정본 공유는 허용하며, 외부 재배포·수정본의 일반 공개·상업적 판매는 금지합니다. 기존 제삼자 라이선스는 유지됩니다. 이 페이지에는 ZIP 다운로드 링크가 없습니다."
  ],
  "zh-Hans": [
    "保留版宝可梦伤害计算器",
    "固定为v1.0.0的旧版，不会自动跟随Singularity更新。",
    "使用说明与社区版",
    "启动与修改指南",
    "使用条件与权利",
    "当前Singularity",
    "v1.0.0最终固定版。输入在浏览器内处理。任何人都可访问网页版地址。",
    "按现状（AS IS）提供，不保证运行、准确性、完整性或特定用途适用性。责任仅在适用法律允许的最大范围内受到限制。衍生版本并非Chloha Labs或Singularity的官方产品。请遵守第三方权利及许可证。",
    "不包含图片。可离线计算。",
    "语言",
    "完整ZIP仅提供给所有者及认可的社区成员。允许个人使用、修改及社区内部分享修改版；禁止向外再分发、公开修改版及商业销售。保留既有第三方许可。本页不提供ZIP下载链接。"
  ],
  "zh-Hant": [
    "保留版寶可夢傷害計算器",
    "固定為v1.0.0的舊版，不會自動跟隨Singularity更新。",
    "使用說明與社群版",
    "啟動與修改指南",
    "使用條件與權利",
    "目前的Singularity",
    "v1.0.0最終固定版。輸入在瀏覽器內處理。任何人都可存取網頁版網址。",
    "按現狀（AS IS）提供，不保證運作、準確性、完整性或特定用途適用性。責任僅在適用法律允許的最大範圍內受到限制。衍生版本並非Chloha Labs或Singularity的官方產品。請遵守第三方權利及授權條款。",
    "不包含圖片。可離線計算。",
    "語言",
    "完整ZIP僅提供給擁有者及認可的社群成員。允許個人使用、修改及社群內部分享修改版；禁止對外再散布、公開修改版及商業銷售。保留既有第三方授權。本頁不提供ZIP下載連結。"
  ]
};
 function update(){
  const t=text[window.ChlohaLocale?.get?.()||'ja']||text.ja;
  if(!document.querySelector('#community-information')){
   const panel=document.createElement('section');panel.id='community-information';panel.className='community-panel';panel.dataset.noTranslate='';
   panel.innerHTML='<h2 data-community-copy="2"></h2><p class="community-frozen" data-community-copy="1"></p><p class="community-distribution" data-community-copy="10"></p><p class="community-state" data-community-copy="6"></p><nav class="community-links" aria-label="Community Edition"><a href="./README.html" data-community-copy="3"></a><a href="./TERMS.html" data-community-copy="4"></a><a href="https://kurohanolu.github.io/singularity/" target="_blank" rel="noopener noreferrer" data-community-copy="5"></a></nav><p data-community-copy="8"></p><p class="community-legal" data-community-copy="7"></p>';
   document.querySelector('#app')?.append(panel);
  }
  document.title='Chloha Damage Lab — Community Edition v1.0.0 Stable';
  document.querySelectorAll('[data-community-copy]').forEach(n=>{n.textContent=t[Number(n.dataset.communityCopy)];});
  const brand=document.querySelector('.lab-header .brand');if(brand)brand.setAttribute('aria-label','Chloha Damage Lab — '+t[0]);
  const description=document.querySelector('[data-singularity="description"]');if(description)description.textContent=t[0];
  const credit=document.querySelector('[data-singularity="credit"]');if(credit)credit.textContent='Chloha Labs';
  const label=document.querySelector('#chloha-locale-control');if(label){label.dataset.noTranslate='';if(label.firstChild?.nodeType===3)label.firstChild.nodeValue=t[9]+' ';}
  document.querySelector('#chloha-locale')?.setAttribute('aria-label',t[9]);
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content='Chloha Damage Lab — '+t[0]+'. Community Edition v1.0.0 Stable.';
 }
 document.addEventListener('chloha:localechange',update);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});else update();
})();
