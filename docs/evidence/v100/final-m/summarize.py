import json, hashlib, statistics, collections, pathlib, datetime

HERE = pathlib.Path(__file__).resolve().parent
EXPECTED = '0b270c1452505268364659edd402209b00b28673'
TREE = '239c4cbd37aa6389f16dc81e7f9a861c09a723f2'
BASELINE = '4f068544e670a85a6a4d34dd2c26e2be66bd9cb7'
def read(name): return json.loads((HERE / name).read_text())
def stats(values):
    a=sorted(values); n=len(a); assert n
    k=n//2; lo=a[:k] or a; hi=a[-k:] if k else a
    q1=statistics.median(lo);q3=statistics.median(hi)
    return dict(n=n,median=statistics.median(a),min=a[0],max=a[-1],q1=q1,q3=q3,iqr=q3-q1)
def slope(values):
    x=list(range(len(values)));xm=statistics.mean(x);ym=statistics.mean(values)
    return sum((i-xm)*(y-ym) for i,y in zip(x,values))/sum((i-xm)**2 for i in x)
def source_ok(commit,tree):
    assert commit==EXPECTED,(commit,EXPECTED)
    assert tree==TREE,(tree,TREE)
def fstat(s, unit=''):
    return f"{s['median']:.2f}{unit} ({s['min']:.2f}–{s['max']:.2f}; IQR {s['iqr']:.2f}; n={s['n']})"

g=read('performance/browser-performance.json')
f=read('quality/reports/v0188/continued-feedback-performance.json')
m=read('memory/memory.json')
t=read('quality/reports/v0188/test-run.json')
p=read('performance/public-performance.json')
pr=read('artifact-provenance.json')
source_ok(g['candidateRevision']['commit'],g['candidateRevision']['tree'])
source_ok(f['sourceCommit'],f['sourceTree'])
source_ok(m['candidate']['commit'],m['candidate']['tree'])
assert t['sourceCommit']==EXPECTED
assert g['baselineCommit']==BASELINE==m['baseline']['commit']
assert g['candidateRevision']['dirty'] is False
assert not m['candidate']['workingTreeChanges']
assert m['status']=='PASS' and not m['issues']
assert g['productionRequests']==f['productionRequests']==t['productionMutations']==p['productionMutations']==0
assert not any(z['realDevice'] for z in [g,f,p])
assert t['failed']==0 and all(z['status']=='passed' and z['exitCode']==0 for z in t['tests'])
feedback_test=[z for z in t['tests'] if z['file']=='tests/v0188-continued-state-performance.cjs']
assert len(feedback_test)==1

out={'schemaVersion':1,'recomputedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
 'sourceCommit':EXPECTED,'sourceTree':TREE,'baselineCommit':BASELINE,
 'runId':43701633753,'runUrl':'https://github.com/Kurohanolu/chloha-damage-lab/actions/runs/43701633753',
 'quantiles':'Median averages the two middle observations for even n. Q1/Q3 are medians of the lower/upper halves, excluding the middle for odd n; IQR=Q3-Q1.',
 'provenance':pr,'sourceChecks':'All performance/feedback/memory candidate commit and tree fields directly match final main M; quality runner commit matches M; clean checkout; archived ZIP SHA-256 and files verified.',
 'general':{'measuredAt':g['measuredAt'],'conditions':g['conditions'],'browser':g['browser'],'profiles':{}},
 'feedback':{'measuredAt':f['measuredAt'],'mode':f['mode'],'environment':f['environment'],'test':feedback_test[0],'profiles':{}},
 'memory':{'startedAt':m['startedAt'],'environment':m['environment'],'protocol':m['protocol'],'profiles':{},'contexts':[],
           'harnessStatus':m['status'],'issues':m['issues'],'limitations':m['limitations'],'elapsedMs':m['elapsedMs']},
 'publicObservation':{k:v for k,v in p.items() if k!='profiles'},'rawFiles':{}}
for file in [HERE/'performance/browser-performance.json',HERE/'performance/public-performance.json',HERE/'memory/memory.json',HERE/'quality/reports/v0188/continued-feedback-performance.json',HERE/'quality/reports/v0188/test-run.json']:
    b=file.read_bytes();out['rawFiles'][str(file.relative_to(HERE))]={'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)}

for profile in g['profiles']:
    d={};out['general']['profiles'][profile['profile']['name']]={'profile':profile['profile'],'versions':d}
    for version in ['baseline','candidate']:
        samples=profile[version];assert len(samples)==5
        x={}
        for key in ['calculationToFrameMs','localeToFrameMs']:
            values=[v for sample in samples for v in sample[key]]; assert len(values)==60
            x[key]=stats(values)
        for phase in ['cold','warm']:
            for key in ['firstContentfulPaintMs','domContentLoadedMs','loadEventMs']:
                x[phase+'.'+key]=stats([s[phase][key] for s in samples])
        for phase in ['heapBefore','heapAfter']:
            x[phase+'.JSHeapUsedSize']=stats([s[phase]['JSHeapUsedSize'] for s in samples])
        d[version]=x

for profile in f['profiles']:
    d={};out['feedback']['profiles'][profile['profile']['name']]={'profile':profile['profile'],'variants':d}
    for variant in ['before','after']:
        runs=profile['runs'][variant];assert len(runs)==5
        values=[v for r in runs for v in r['durations']];assert len(values)==100
        mutations=[v for r in runs for v in r['calculatorDOMMutations']];assert len(mutations)==100
        assert all(v>=4 if variant=='before' else v==0 for v in mutations)
        d[variant]={'durationMs':stats(values),'mutationRecords':stats(mutations),'totalMutationRecords':sum(mutations)}
    d['improvementPercent']=100*(d['before']['durationMs']['median']-d['after']['durationMs']['median'])/d['before']['durationMs']['median']

assert len(m['contexts'])==12
for c in m['contexts']:
    checkpoints=c['checkpoints']; measured=[x for x in checkpoints if x['round']>=0]
    assert len(checkpoints)==8 and len(measured)==6 and len(c['reloads'])==3
    assert c['status']=='COMPLETE' and not c['pageErrors'] and not c['mutatingRequests']
    assert c['calibration']=={'held':{'node':True,'object':True},'released':{'node':False,'object':False}}
    d={k:c[k] for k in ['version','profile','sample','status','calibration']}
    d.update({'measuredCheckpoints':6,'metrics':{},'reloads':{},'elapsedSinceRunStartMs':checkpoints[-1]['elapsedMs'],
              'measuredWindowMs':measured[-1]['elapsedMs']-measured[0]['elapsedMs'],
              'totalProbes':checkpoints[-1]['totalProbes'],'collectedProbes':checkpoints[-1]['collectedProbes'],
              'retainedProbeEntries':checkpoints[-1]['retainedProbeEntries'],
              'agedRetainedProbes':c['summary']['agedRetainedProbes'],
              'detachedTrees':len(c['detachedDom'].get('trees',[])),
              'detachedNames':dict(collections.Counter(x['nodeName'] for x in c['detachedDom'].get('trees',[]))),
              'removedElements':c['summary']['removedElements'],'sampledElements':c['summary']['sampledElements'],
              'skippedElements':c['summary']['skippedElements'],'calculationProbes':c['summary']['calculationProbes']})
    for label,fn in [('heapBytes',lambda x:x['heap']['usedSize']),('documents',lambda x:x['dom']['documents']),
                     ('nodes',lambda x:x['dom']['nodes']),('listeners',lambda x:x['dom']['jsEventListeners']),
                     ('connectedElements',lambda x:x['connectedElements'])]:
        vals=[fn(x) for x in measured];d['metrics'][label]={**stats(vals),'first':vals[0],'last':vals[-1],'delta':vals[-1]-vals[0],'slopePerRound':slope(vals)}
        vals=[fn(x) for x in c['reloads']];d['reloads'][label]={**stats(vals),'first':vals[0],'last':vals[-1],'delta':vals[-1]-vals[0]}
    out['memory']['contexts'].append(d)
for profile in ['desktop','mobile-emulation']:
    d={};out['memory']['profiles'][profile]=d
    for version in ['baseline','candidate']:
        cs=[c for c in out['memory']['contexts'] if c['profile']==profile and c['version']==version];assert len(cs)==3
        d[version]={'contexts':3,'heapMedianOfContextMediansBytes':stats([c['metrics']['heapBytes']['median'] for c in cs]),
                    'heapFirstLastDeltaBytes':stats([c['metrics']['heapBytes']['delta'] for c in cs]),
                    'heapSlopeBytesPerRound':stats([c['metrics']['heapBytes']['slopePerRound'] for c in cs]),
                    'reloadHeapFirstLastDeltaBytes':stats([c['reloads']['heapBytes']['delta'] for c in cs]),
                    'measuredWindowMs':stats([c['measuredWindowMs'] for c in cs])}
        for key in ['documents','nodes','listeners','connectedElements']:
            d[version][key+'Delta']=stats([c['metrics'][key]['delta'] for c in cs])
cs=out['memory']['contexts']
out['memory']['aggregate']={'contextCount':len(cs),'measuredRounds':sum(c['measuredCheckpoints'] for c in cs),'reloads':sum(3 for c in cs),
   **{key:sum(c[key] for c in cs) for key in ['totalProbes','collectedProbes','retainedProbeEntries','agedRetainedProbes','removedElements','sampledElements','skippedElements','calculationProbes']},
   'detachedTreeCounts':sorted(set(c['detachedTrees'] for c in cs)),
   'allCalibrationControlsPassed':True,'allContextStatusPassed':True}
out['memory']['aggregate']['measuredWindowMs']=stats([c['measuredWindowMs'] for c in cs])
out['memory']['interpretation']='Bounded sampled-retention check only. All probes in the finite sampled set clearing does not establish universal object collection, a heap plateau, absence of memory leaks, or hours-long real-device stability. Positive post-GC heap/reload growth is retained in the statistics. Fixed detached OPTION trees require source/retainer interpretation; a count alone does not establish their identity or harmlessness.'

out['publicObservation']['profileStatistics']={}
for profile in p['profiles']:
    samples=profile['samples'];s={}
    for key in ['calculationToFrameMs','localeToFrameMs']:
        s[key]=stats([v for sample in samples for v in sample[key]])
    for phase in ['cold','warm']:
        for key in ['FCPMs','domContentLoadedMs','loadMs']:s[phase+'.'+key]=stats([sample[phase][key] for sample in samples])
    out['publicObservation']['profileStatistics'][profile['profile']['name']]=s

lines=['# Singularity v1.0.0 final main M — performance and finite memory evidence','',
 f"Source `{EXPECTED}`; tree `{TREE}`. Baseline `{BASELINE}`. Fresh push/main [quality run 43701633753]({out['runUrl']}). All three artifact and raw candidate identities are checked directly against M. No R2 timing data is reused.",'',
 'The tables use independently recomputed conventional medians from raw samples. Parentheses contain min–max, IQR and n; Q1/Q3 use medians of the lower/upper halves. GitHub-hosted runner measurements are emulation, not physical-device results.','',
 '## Artifact provenance','',
 '|Artifact|ID|ZIP SHA-256|','|---|---:|---|']
for a in pr['artifacts']:lines.append(f"|{a['name']}|{a['id']}|`{a['localSha256']}`|")
lines+=['','API head SHA is M, recorded digest equals downloaded ZIP digest, and retained raw files match their archive entries. See `artifact-provenance.json` and the summary JSON for receipt metadata and per-file hashes.','',
 '## Feedback input / calculator DOM updates','',
 f"Controlled guard reversal: {f['mode']}. Five independent contexts × 20 input operations = 100 timings per variant/profile. Only the C-P01 feedback-input guard is reversed for the before variant; this is a same-candidate causal check, not a historical-run timing comparison.",'',
 '|Profile|Guard reversed (before), ms|Final M guard (after), ms|Median reduction|DOM records before → after|','|---|---|---|---:|---:|']
for profile,d in out['feedback']['profiles'].items():
    b=d['variants']['before'];a=d['variants']['after']
    lines.append(f"|{profile}|{fstat(b['durationMs'])}|{fstat(a['durationMs'])}|{d['variants']['improvementPercent']:.2f}%|{b['totalMutationRecords']} → {a['totalMutationRecords']}|")
lines+=['', 'Every before input produced at least four calculator child-list mutation records; every after input produced zero. The test passed with exit 0 and asserts unchanged calculation input, all damage rolls, saved state, expected feedback text, and no page errors. Zero production requests. Mutation records are observer notifications for four calculator panels, not a count of every possible DOM write.','',
 'Feedback environment: `'+json.dumps(f['environment'],ensure_ascii=False)+'`','',
 '## Calculation, language switch and render','',
 'Five contexts per version/profile, 12 calculation and 12 locale operations each: n=60 per interaction metric. Cold and warm render metrics each use n=5 navigations. Baseline/candidate contexts alternate.','',
 '|Profile / metric|Baseline|Final M|','|---|---|---|']
for profile,d in out['general']['profiles'].items():
    b=d['versions']['baseline'];a=d['versions']['candidate']
    for key in ['calculationToFrameMs','localeToFrameMs','cold.firstContentfulPaintMs','cold.domContentLoadedMs','cold.loadEventMs','warm.firstContentfulPaintMs','warm.domContentLoadedMs','warm.loadEventMs']:
        lines.append(f"|{profile} / {key}|{fstat(b[key])}|{fstat(a[key])}|")
lines+=['','Values above are milliseconds. Environment: `'+json.dumps({**g['conditions'],'browser':g['browser']},ensure_ascii=False)+'`',
 '','Uncontrolled post-operation JS heap is diagnostic only; it is not comparable to a forced-GC retention result:','', '|Profile|Baseline heap bytes|Final M heap bytes|','|---|---|---|']
for profile,d in out['general']['profiles'].items():lines.append(f"|{profile}|{fstat(d['versions']['baseline']['heapAfter.JSHeapUsedSize'])}|{fstat(d['versions']['candidate']['heapAfter.JSHeapUsedSize'])}|")
lines+=['','## Controlled GC and bounded retention','',
 'Two profiles × two versions × three independent contexts = 12 contexts. Each runs two warmup rounds plus six measured rounds, then three reload checks: 72 measured rounds and 36 reloads. Each round exercises allocation, all nine locales with numeric parity, local feedback interaction and persistence settling. Two full CDP GCs and task boundaries precede weak-probe pruning, then one cleanup GC precedes heap/counter capture.','',
 '|Profile / version|Context heap medians, bytes|First→last measured heap delta, bytes|Heap slope, bytes/round|Reload heap delta, bytes|','|---|---|---|---|---|']
for profile,d in out['memory']['profiles'].items():
    for version,s in d.items():lines.append(f"|{profile} / {version}|{fstat(s['heapMedianOfContextMediansBytes'])}|{fstat(s['heapFirstLastDeltaBytes'])}|{fstat(s['heapSlopeBytesPerRound'])}|{fstat(s['reloadHeapFirstLastDeltaBytes'])}|")
ag=out['memory']['aggregate']
lines+=['',f"All 12 calibration controls and finite scenarios passed. Sampled retired probes: {ag['totalProbes']:,}; collected by each context's final checkpoint: {ag['collectedProbes']:,}; retained entries: {ag['retainedProbeEntries']}; aged retained probes: {ag['agedRetainedProbes']}. Removed element instances: {ag['removedElements']:,}; sampled: {ag['sampledElements']:,}; outside the cap: {ag['skippedElements']:,}; calculation probes: {ag['calculationProbes']:,}. Detached-tree counts observed across contexts: {ag['detachedTreeCounts']}.",'',
 f"The full memory harness lasted {m['elapsedMs']/1000:.2f} seconds. The six measured checkpoints span {ag['measuredWindowMs']['min']/1000:.2f}–{ag['measuredWindowMs']['max']/1000:.2f} seconds per context; this is finite repetition, not a long-running soak. Document, DOM-node and event-listener first-to-last deltas are recorded per context in the JSON.",'',
 out['memory']['interpretation'],'',
 'Memory environment: `'+json.dumps(m['environment'],ensure_ascii=False)+'`','',
 'Raw memory protocol, context-level document/node/listener/connected-element trends, reload statistics, and harness limitations are retained in the summary JSON.','',
 '## Public observation and operational limits','',
 'The performance job also made a read-only public observation. Its actual observed release metadata is `'+json.dumps(p['observedPublicRelease'],ensure_ascii=False)+'`. Three samples per profile and 12 operations per sample are separate CDN observations; they are not an identical-environment baseline/candidate comparison or by themselves full publication acceptance. Zero production mutations and zero feedback forms opened.','',
 'Public availability and boundary behavior are separate from authenticated Cloudflare management verification. The prior safe browser check reached the Cloudflare sign-in wall; current Workers/D1/Access/Turnstile management settings remain unverified. No login bypass, private report access, new production report, backend deployment, or authentication change was performed for this evidence task. Physical Android/iOS, native screen readers and OS IME, unrestricted long-session memory, and all Champions mechanics remain outside this bounded performance evidence.','']

(HERE.parent/'v100-final-m-performance-summary.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n')
(HERE.parent/'v100-final-m-performance-summary.md').write_text('\n'.join(lines))
print(json.dumps({'source':EXPECTED,'feedback':out['feedback']['profiles'],'memoryAggregate':ag,'paths':['v100-final-m-performance-summary.md','v100-final-m-performance-summary.json']},indent=2))
