'use strict';
// The pre.6 frontend was genuinely deployed and accepted before an independent
// Community restoration changed the other URL. This pin is a public observation
// baseline, not a claim that the aborted GitHub Release was published.
const assert=require('node:assert/strict'),path=require('node:path'),{execFileSync}=require('node:child_process');
const commit='a3eeebfc4f4ad9c4c341047ca7ef7af7cc71f8b9',tree='604f0632eaf2d28e2fbd40012d68133050f72f30',policy='community-pinned-v1';
const git=args=>execFileSync('git',args,{cwd:path.resolve(__dirname,'../..'),encoding:'utf8'}).trim();
function manifest(){assert.equal(git(['rev-parse',commit+'^{tree}']),tree);const r=JSON.parse(git(['show',commit+':release.json']));assert.equal(r.tag,'v1.1.0-pre.6');assert.equal(r.migration.liveTargetVerified,true);assert.equal(r.qualityReview.reviewedSourceCommit,'e0eb6ce87834fa80c874a764c78908da20476542');assert.equal(r.migration.liveAcceptanceSourceCommit,'979bac851c8af861f9b0f8f8965732931589f166');assert.equal(r.migration.legacyPolicy,undefined);return r;}
module.exports={commit,tree,policy,manifest};
