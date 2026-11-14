import {startLocalApp} from './harness.mjs';
const app=await startLocalApp({adminEdge:true,demoWidget:true});
console.log('LOCAL DEMO ONLY — in-memory synthetic intake; mocked Bot verification and GitHub; automatic local administrator. No production messages.');
console.log('Calculator: '+app.origin+'/');console.log('Local administrator: '+app.origin+'/admin/');
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});
