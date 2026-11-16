#!/usr/bin/env python3
"""Deterministic, allowlisted stable frontend packaging. Never deploys."""
import argparse
import hashlib
import html as escape
import json
from pathlib import Path
import re
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[2]
BASELINE = '0b270c1452505268364659edd402209b00b28673'
ZIP_NAME = 'Chloha-Damage-Lab-v1.0.0-Community-Edition.zip'

def sha(body):
    return hashlib.sha256(body).hexdigest()

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)

def original(name):
    return git('show', BASELINE + ':' + name)

def json_bytes(obj):
    return (json.dumps(obj, ensure_ascii=False, indent=2) + '\n').encode()

def substitute(text, old, new, count=1):
    if text.count(old) != count:
        raise ValueError('Unexpected immutable baseline occurrence count: ' + old[:90])
    return text.replace(old, new)

def render_doc(title, text):
    # Escape all source; documents are readable offline without a Markdown/CDN dependency.
    return ('<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>'+escape.escape(title)+'</title><style>body{font:16px/1.8 system-ui,sans-serif;max-width:900px;margin:32px auto;padding:0 20px;color:#242833;background:#fcfafb}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}a{color:#a22c50}</style>'
            '<a href="./index.html">← Chloha Damage Lab</a><h1>'+escape.escape(title)+'</h1><pre>'+escape.escape(text)+'</pre></html>').encode()

def classify(file):
    if file == 'index.html':
        return {'origin':'Chloha Labs application with embedded GameWith/AppMedia-referenced registries','condition':'Original code only: MIT; registry redistribution rights unresolved','status':'unresolved','evidence':'THIRD-PARTY-NOTICES.md'}
    if file in ['locale-names-pokeapi-v0183.js','names-catalog-v0179.js']:
        return {'origin':'PokeAPI/pokeapi data/v2/csv name tables; project ID mapping','condition':'BSD-3-Clause; retain notice; trademarks excluded','status':'upstream-license-identified','evidence':'licenses/PokeAPI-BSD-3-Clause.txt'}
    if file in ['names-forms-v0179.js','locale-form-species-v0183.js','locale-names-v0183.js','names-ja-en.js','names-v0179.js']:
        return {'origin':'Supplemental form/ability/entity name mappings in stable source history','condition':'Per-record source verification incomplete; no blanket MIT sublicense','status':'unresolved','evidence':'THIRD-PARTY-NOTICES.md'}
    if file in ['pokemon-weights-v0181.js','ability-data-v0184.js','move-mechanics-data-v0184.js']:
        return {'origin':'Chloha Labs mappings; Pokemon Showdown-derived weights/move flags','condition':'MIT, retaining upstream copyright notice','status':'upstream-license-identified','evidence':'licenses/Pokemon-Showdown-MIT.txt'}
    if file.startswith('licenses/'):
        return {'origin':'Upstream license notice','condition':'Retain verbatim','status':'notice','evidence':file}
    return {'origin':'Chloha Labs source/documentation; game names and brands excluded from grant','condition':'MIT for original contributions; third-party notices apply','status':'original-contribution','evidence':'LICENSE'}

def build(out, review_only):
    policy = json.loads((ROOT/'community/release-policy.json').read_text())
    if git('rev-parse','v1.0.0').decode().strip() != BASELINE:
        raise ValueError('Existing stable tag must resolve to the immutable baseline')
    if policy['baselineCommit'] != BASELINE:
        raise ValueError('Policy baseline mismatch')
    if policy['rightsStatus'] != 'cleared' and not review_only:
        raise ValueError('Publication blocked: unresolved third-party rights. --review-only prepares a local candidate, not permission.')
    if policy['rightsStatus'] == 'cleared':
        raise ValueError('Candidate-only builder: publication requires reviewed rights evidence and a separately reviewed release implementation')
    if out.exists():
        raise ValueError('Use a fresh output directory; existing output is never overwritten')
    app = {}
    html = original('index.html').decode()
    refs = set(re.findall(r'<(?:script|link|img)\b[^>]*\b(?:src|href)=[\"\']\./([^\"\']+)', html))
    excluded=[]
    for ref in sorted(refs):
        file=ref.split('?')[0]
        if file.startswith(('feedback-','assets/singularity/')) or file == 'singularity-v0187.css':
            excluded.append(file)
            continue
        if not re.fullmatch(r'[A-Za-z0-9_-]+\.(js|css)',file):
            raise ValueError('Unreviewed frontend dependency: '+file)
        app[file]=original(file)
    # Only presentation, artwork URLs and optional private feedback are changed.
    html=re.sub(r'<script\b[^>]*\bsrc=[\"\']\./feedback-[^\"\']+[\"\'][^>]*></script>','',html)
    html=re.sub(r'<link\b[^>]*\bhref=[\"\']\./(?:assets/singularity/[^\"\']+|singularity-v0187\.css[^\"\']*)[\"\'][^>]*>','',html)
    html=substitute(html,'<title>Singularity v1.0.0</title>','<title>Chloha Damage Lab — Community Edition v1.0.0 Stable</title>')
    html=substitute(html,'<img class="brand-logo" src="./assets/singularity/header.webp?v=1.0.0" alt="Singularity" width="300" height="100" decoding="async">','<span class="community-wordmark"><span class="community-mark" aria-hidden="true">D</span><span>Chloha Damage Lab</span></span>')
    html=substitute(html,'aria-label="Singularity"','aria-label="Chloha Damage Lab"')
    html=substitute(html,'<h1 data-no-translate>Singularity</h1>','<h1 data-no-translate>Chloha Damage Lab</h1>')
    html=substitute(html,'<span class="version" data-no-translate>v1.0.0</span>','<span class="version" data-no-translate>Community Edition<br>v1.0.0 Stable</span>')
    html,n=re.subn(r'window\.ChlohaSpriteIds=\{[^\n]+\};','window.ChlohaSpriteIds={}; // Artwork excluded from the Community Edition.',html)
    if n!=1:raise ValueError('Sprite-map replacement must be exact')
    html=substitute(html,'<p>ポケモン画像：PokeAPI / Pokémon sprites。画像を取得できない場合も計算できます。</p>','<p data-no-translate data-community-copy="8">画像は同梱していません。計算はオフラインで動作します。</p>')
    html=substitute(html,'</head>','<meta http-equiv="Content-Security-Policy" content="default-src \'self\' data:; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; connect-src \'none\'; img-src \'self\' data:; object-src \'none\'; base-uri \'none\'"><link rel="stylesheet" href="./community.css"></head>')
    html=substitute(html,'</body>','<script defer src="./community.js"></script></body>')
    app['index.html']=html.encode()
    for f in ['community.css','community.js']:
        app[f]=(ROOT/'community'/f).read_bytes()
    app['release.json']=json_bytes(policy)
    app['.nojekyll']=b''
    hashes={file:sha(body) for file,body in sorted(app.items())}
    canonical=''.join(f'{digest}  {file}\n' for file,digest in hashes.items()).encode()
    manifest={'schemaVersion':1,'baselineCommit':BASELINE,'baselineArchiveSHA256':policy['baselineArchiveSHA256'],'product':policy['product'],'version':'1.0.0','edition':'Community Edition','publicationStatus':'blocked','reviewOnly':True,'applicationHashMethod':'SHA-256 of sorted UTF-8 lines: <file SHA-256><two spaces><relative path><LF>','applicationSHA256':sha(canonical),'files':hashes,'excluded':sorted(set(excluded))}
    package=dict(app)
    package['application-manifest.json']=json_bytes(manifest)
    for f in ['README.md','LICENSE','THIRD-PARTY-NOTICES.md']:
        package[f]=(ROOT/'community'/f).read_bytes()
    for f in sorted((ROOT/'community/licenses').glob('*')):
        package['licenses/'+f.name]=f.read_bytes()
    package['README.html']=render_doc('使い方・改造ガイド',package['README.md'].decode())
    package['TERMS.html']=render_doc('利用条件・権利・免責',package['THIRD-PARTY-NOTICES.md'].decode()+'\n\n'+package['LICENSE'].decode())
    inventory={f:{'sha256':sha(b),**classify(f)} for f,b in sorted(package.items())}
    inventory['rights-inventory.json']={'origin':'Generated inventory (this file)','condition':'MIT for original metadata','status':'original-contribution','evidence':'LICENSE','sha256':None,'hashReason':'Self-reference excluded; whole-package ZIP hash covers this file'}
    package['rights-inventory.json']=json_bytes({'publicationStatus':'blocked','files':inventory})
    site=out/'site';site.mkdir(parents=True)
    for f,b in sorted(package.items()):
        p=site/f;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
    archive=out/ZIP_NAME
    with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for f,b in sorted(package.items()):
            info=zipfile.ZipInfo('Chloha-Damage-Lab/'+f,date_time=(2026,11,15,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,b,compresslevel=9)
    digest=sha(archive.read_bytes());(out/(ZIP_NAME+'.sha256')).write_text(digest+'  '+ZIP_NAME+'\n')
    receipt={'publicationStatus':'blocked','reviewOnly':True,'baselineCommit':BASELINE,'applicationSHA256':manifest['applicationSHA256'],'applicationFiles':len(app),'packageFiles':len(package),'zipSHA256':digest,'zipFile':ZIP_NAME}
    (out/'build-receipt.json').write_bytes(json_bytes(receipt));print(json.dumps(receipt,indent=2))
    return receipt

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--output',type=Path,default=ROOT/'dist/community');p.add_argument('--review-only',action='store_true');args=p.parse_args();build(args.output.resolve(),args.review_only)
