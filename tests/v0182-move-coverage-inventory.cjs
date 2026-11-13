'use strict';
// Inventory is a metadata audit, not a claim of in-game damage parity.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const match=html.match(/const ChlohaMovesDB = (\{[^\n]+\});/);
assert.ok(match,'move catalog must exist');
const moves=JSON.parse(match[1]).moves;
const unsupported=moves.filter(m=>m.calculationSupported!==true);
const supported=moves.filter(m=>m.calculationSupported===true);
const noStatus=moves.filter(m=>m.category!=='status');
const breakdown=Object.fromEntries(['physical','special','status'].map(cat=>[cat,{total:moves.filter(m=>m.category===cat).length,flaggedSupported:supported.filter(m=>m.category===cat).length,flaggedUnsupported:unsupported.filter(m=>m.category===cat).length}]));
const report={version:'v0.182',scope:'catalog metadata only; not game-hardware verified',total:moves.length,flaggedSupported:supported.length,flaggedUnsupported:unsupported.length,damagingMoves:noStatus.length,breakdown,unsupported:unsupported.map(m=>({id:m.id,name:m.name,category:m.category,power:m.power,verificationStatus:m.verificationStatus||null}))};
assert.equal(report.flaggedSupported+report.flaggedUnsupported,report.total);
assert.equal(report.total,335,'Unexpected move catalog size: review inventory assumptions');
assert.equal(report.damagingMoves,334);
fs.mkdirSync(path.join(__dirname,'../reports'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'../reports/v0182-move-coverage-inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log('PASS v0.182 move metadata inventory',JSON.stringify({total:report.total,flaggedSupported:report.flaggedSupported,flaggedUnsupported:report.flaggedUnsupported,breakdown}));
console.log('NOTE calculationSupported is a catalog flag, not evidence of hardware parity or full mechanic coverage');
