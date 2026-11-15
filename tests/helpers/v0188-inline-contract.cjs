'use strict';
const assert=require('node:assert/strict');
const changes=require('../fixtures/v0188-ui-inline-patches.json');
// Reverse only explicitly reviewed complete UI blocks. A one-byte difference in
// a block, an additional insertion, or any mechanics/control change fails below.
function normalizeUI(source){
 for(const patch of changes.patches){
  assert.equal(source.split(patch.after).length-1,1,'Exact UI patch required: '+patch.purpose);
  source=source.replace(patch.after,patch.before);
 }
 return source;
}
const inline=source=>[...source.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].replace(/app\.innerHTML=`[\s\S]*?<\/aside>`;/,'/* presentation template */'));
function verifyInline(candidate,baseline){assert.deepEqual(inline(normalizeUI(candidate)),inline(baseline),'All inline code outside exact v0.188 UI patches must remain byte-identical');}
module.exports={normalizeUI,verifyInline};
