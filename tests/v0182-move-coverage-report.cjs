// Report move-catalog coverage without conflating searchability with calculability.
// Usage: node tests/v0182-move-coverage-report.cjs
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const match=html.match(/const ChlohaMovesDB = (\{[^\n]+\});/);
assert.ok(match,'move catalog exists');
const db=JSON.parse(match[1]);
const moves=db.moves;
const seen=new Set();
const report={total:moves.length,damaging:0,status:0,flaggedSupported:0,flaggedUnsupported:0,unsupported:[]};
for(const m of moves){
 assert.ok(m.id&&!seen.has(m.id),'unique move ID: '+m.id);
 seen.add(m.id);
 if(m.category==='status'){report.status++;continue;}
 report.damaging++;
 if(m.calculationSupported===true)report.flaggedSupported++;
 else {report.flaggedUnsupported++;report.unsupported.push({id:m.id,name:m.name,power:m.power,reason:m.catalogNote||'not classified'});}
}
report.unsupported.sort((a,b)=>a.name.localeCompare(b.name,'ja'));
console.log(JSON.stringify(report,null,2));
