'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const policy=JSON.parse(fs.readFileSync(path.join(root,'community/release-policy.json')));
const arg=process.argv.indexOf('--scope');
const selected=arg<0?'all':process.argv[arg+1];
if(!['all','publicWeb','communityZip'].includes(selected)){console.error('Unknown delivery scope; no publication permitted.');process.exit(2);}
const scopes=selected==='all'?['publicWeb','communityZip']:[selected];
const blockers=[];
const d=policy.distribution;
if(d?.mode!=='community-limited'||['publicArchive','publicDownloadLink','publicApplicationRepository','outsideRedistribution','publicModifiedVersions','commercialSale'].some(k=>d[k]!==false))blockers.push('Public package delivery or wider use is not authorized by owner policy.');
if(d?.preserveExistingLicenses!==true)blockers.push('Existing third-party and prior license grants must remain intact.');
for(const scope of scopes){
 const audit=policy.rightsAssessments?.[scope];
 if(audit?.status!=='cleared')blockers.push(scope+': independent rights clearance is incomplete.');
 for(const reason of audit?.blockers||[])blockers.push(scope+': '+reason);
 if(policy.acceptanceStatus?.[scope]!=='ready')blockers.push(scope+': no accepted candidate and exact-commit evidence.');
// A permissive flag alone is never sufficient evidence to publish.
for(const file of ['docs/community/rights-clearance-'+scope+'.json','docs/community/accepted-release-'+scope+'.json']){
 if(!fs.existsSync(path.join(root,file)))blockers.push('Missing reviewed evidence: '+file);
}
}
if(blockers.length){console.error('BLOCKED — '+selected+' delivery not permitted\n'+blockers.map(x=>'- '+x).join('\n'));process.exitCode=1;}
else{console.error('BLOCKED — the candidate-only publication gate requires a reviewed release implementation.');process.exitCode=1;}
