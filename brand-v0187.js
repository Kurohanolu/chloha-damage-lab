/* Singularity presentation only. Engine/data APIs and existing locale keys stay stable. */
(()=>{
 'use strict';
 const descriptions=Object.freeze({ja:'ポケモン ダメージ計算機',en:'Pokémon Damage Calculator',fr:'Calculateur de dégâts Pokémon',de:'Pokémon-Schadensrechner',es:'Calculadora de daño Pokémon',it:'Calcolatore di danni Pokémon',ko:'포켓몬 데미지 계산기','zh-Hans':'宝可梦伤害计算器','zh-Hant':'寶可夢傷害計算器'});
 const credits=Object.freeze({ja:'開発元：Chloha Labs',en:'Developed by Chloha Labs',fr:'Développé par Chloha Labs',de:'Entwickelt von Chloha Labs',es:'Desarrollado por Chloha Labs',it:'Sviluppato da Chloha Labs',ko:'개발: Chloha Labs','zh-Hans':'开发：Chloha Labs','zh-Hant':'開發：Chloha Labs'});
 const languages=Object.freeze({ja:'言語',en:'Language',fr:'Langue',de:'Sprache',es:'Idioma',it:'Lingua',ko:'언어','zh-Hans':'语言','zh-Hant':'語言'});
 function refresh(){
  const locale=window.ChlohaLocale?.get?.()||'ja',description=descriptions[locale]||descriptions.ja;
  document.querySelectorAll('[data-singularity="description"]').forEach(node=>{node.textContent=description;});
  document.querySelectorAll('[data-singularity="credit"]').forEach(node=>{node.textContent=credits[locale]||credits.ja;});
  const brand=document.querySelector('.lab-header .brand');if(brand)brand.setAttribute('aria-label','Singularity — '+description);
  const label=document.getElementById('chloha-locale-control'),select=document.getElementById('chloha-locale');
  if(label)label.dataset.noTranslate='';
  if(label?.firstChild?.nodeType===3)label.firstChild.nodeValue=(languages[locale]||languages.ja)+' ';
  if(select)select.setAttribute('aria-label',languages[locale]||languages.ja);
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content='Singularity — '+description+'. Chloha Labs.';
 }
 document.addEventListener('chloha:localechange',refresh);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
 window.SingularityBrand=Object.freeze({product:'Singularity',developer:'Chloha Labs',descriptions,credits,languages});
})();
