'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const policy=JSON.parse(fs.readFileSync(path.join(root,'community/release-policy.json')));
const blockers=[...policy.blockers];
if(policy.rightsStatus!=='cleared')blockers.push('File/record-level redistribution audit has not cleared.');
if(policy.publicationStatus!=='ready')blockers.push('No accepted production candidate and exact-commit CI/deployment evidence.');
// A permissive flag alone is never sufficient evidence to publish.
for(const file of ['docs/community/rights-clearance.json','docs/community/accepted-release.json']){
 if(!fs.existsSync(path.join(root,file)))blockers.push('Missing reviewed evidence: '+file);
}
if(blockers.length){console.error('BLOCKED — no publication permitted\n'+blockers.map(x=>'- '+x).join('\n'));process.exitCode=1;}
else{console.error('BLOCKED — the candidate-only publication gate requires a reviewed release implementation.');process.exitCode=1;}
