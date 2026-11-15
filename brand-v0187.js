/* Singularity presentation only. Engine/data APIs and existing locale keys stay stable. */
(()=>{
 'use strict';
 const descriptions=Object.freeze({ja:'ポケモン ダメージ計算機',en:'Pokémon Damage Calculator',fr:'Calculateur de dégâts Pokémon',de:'Pokémon-Schadensrechner',es:'Calculadora de daño Pokémon','es-LA':'Calculadora de daño Pokémon',it:'Calcolatore di danni Pokémon',ko:'포켓몬 데미지 계산기','zh-Hans':'宝可梦伤害计算器','zh-Hant':'寶可夢傷害計算器'});
 const credits=Object.freeze({ja:'開発元：Chloha Labs',en:'Developed by Chloha Labs',fr:'Développé par Chloha Labs',de:'Entwickelt von Chloha Labs',es:'Desarrollado por Chloha Labs','es-LA':'Desarrollado por Chloha Labs',it:'Sviluppato da Chloha Labs',ko:'개발: Chloha Labs','zh-Hans':'开发：Chloha Labs','zh-Hant':'開發：Chloha Labs'});
 const languages=Object.freeze({ja:'言語',en:'Language',fr:'Langue',de:'Sprache',es:'Idioma','es-LA':'Idioma',it:'Lingua',ko:'언어','zh-Hans':'语言','zh-Hant':'語言'});
 const scopeNotices=Object.freeze({
  ja:'対応範囲と制限をご確認ください。実機精度・収録・習得技には未検証の項目があります。',
  en:'Check the supported scope and limitations. Some aspects of accuracy on game hardware, availability and learnsets remain unverified.',
  fr:'Consultez les fonctionnalités prises en charge et leurs limites. Certains aspects de la précision sur console, de la disponibilité et des capacités apprises restent à vérifier.',
  de:'Beachte den unterstützten Umfang und die Einschränkungen. Einige Aspekte der Genauigkeit auf echter Hardware, der Verfügbarkeit und der erlernbaren Attacken sind noch ungeprüft.',
  es:'Consulta las funciones compatibles y sus limitaciones. Algunos aspectos de la precisión en consola, la disponibilidad y los movimientos que se pueden aprender siguen sin verificarse.',
  'es-LA':'Consulta las funciones compatibles y sus limitaciones. Algunas mecánicas siguen sin verificarse en Pokémon Champions. La localización ES-LA está en revisión; los nombres sin confirmar pueden mostrarse en español de España.',
  it:'Consulta le funzioni supportate e i relativi limiti. Alcuni aspetti della precisione su console, della disponibilità e delle mosse apprendibili restano da verificare.',
  ko:'지원 범위와 제한 사항을 확인하세요. 실기기 정확도, 등장 여부 및 배울 수 있는 기술에는 아직 검증되지 않은 항목이 있습니다.',
  'zh-Hans':'请确认支持范围与限制。实机精度、登场情况和可习得招式中仍有未经验证的项目。',
  'zh-Hant':'請確認支援範圍與限制。實機精度、登場情況和可習得招式中仍有未經驗證的項目。'
 });
 function refresh(){
  const locale=window.ChlohaLocale?.get?.()||'ja',description=descriptions[locale]||descriptions.ja;
  document.querySelectorAll('[data-singularity="description"]').forEach(node=>{node.textContent=description;});
  document.querySelectorAll('[data-singularity="credit"]').forEach(node=>{node.textContent=credits[locale]||credits.ja;});
  document.querySelectorAll('[data-singularity="scope"]').forEach(node=>{node.textContent=scopeNotices[locale]||scopeNotices.ja;});
  const brand=document.querySelector('.lab-header .brand');if(brand)brand.setAttribute('aria-label','Singularity — '+description);
  const label=document.getElementById('chloha-locale-control'),select=document.getElementById('chloha-locale');
  if(label)label.dataset.noTranslate='';
  if(label?.firstChild?.nodeType===3)label.firstChild.nodeValue=(languages[locale]||languages.ja)+' ';
  if(select)select.setAttribute('aria-label',languages[locale]||languages.ja);
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content='Singularity — '+description+'. Chloha Labs.';
 }
 document.addEventListener('chloha:localechange',refresh);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
 window.SingularityBrand=Object.freeze({product:'Singularity',developer:'Chloha Labs',descriptions,credits,languages,scopeNotices});
})();
