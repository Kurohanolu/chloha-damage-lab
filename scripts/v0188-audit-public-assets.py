#!/usr/bin/env python3
"""Read-only public audit against an immutable source checkout. No API mutations."""
import argparse
import base64
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import urllib.parse
import urllib.request
import zipfile

BASELINE = '7210be99c39d75b49ea8200aad91d75801eb300a'
BASES = {'singularity': 'https://kurohanolu.github.io/singularity/',
         'chloha-damage-lab': 'https://kurohanolu.github.io/chloha-damage-lab/'}

def digest(data):
    return hashlib.sha256(data).hexdigest()

def safe_relative(value):
    file = value.split('?', 1)[0].split('#', 1)[0].removeprefix('./')
    if not re.fullmatch(r'[a-zA-Z0-9_./-]+', file) or any(p in ('', '..', '.') for p in file.split('/')):
        raise ValueError('Unsafe relative asset path')
    return file

def request(url):
    last = None
    for _ in range(2):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Singularity-Independent-Asset-Audit/0.188', 'Cache-Control': 'no-cache'})
            with urllib.request.urlopen(req, timeout=30) as response:
                body = response.read()
                return {'status': response.status, 'sha256': digest(body), 'bytes': len(body),
                        'cacheControl': response.headers.get('Cache-Control'), 'etag': response.headers.get('ETag')}, body
        except Exception as exc:
            last = exc
    return {'error': type(last).__name__ + ': ' + str(last)}, None

def compare_zip(actual, expected, commit):
    with zipfile.ZipFile(io.BytesIO(actual)) as downloaded, zipfile.ZipFile(io.BytesIO(expected)) as generated:
        a = {x.filename: digest(downloaded.read(x)) for x in downloaded.infolist() if not x.is_dir()}
        e = {x.filename: digest(generated.read(x)) for x in generated.infolist() if not x.is_dir()}
        return {'downloadSHA256': digest(actual), 'generatedSHA256': digest(expected),
                'bytesExact': actual == expected, 'allEntryPathsAndBytesEqual': a == e,
                'files': len(a), 'archiveCommentMatchesCommit': downloaded.comment.decode() == commit}

def sprite_inventory(html):
    local = re.search(r'window\.ChlohaLocalSprites=(\{.*?\});', html)
    ids = re.search(r'window\.ChlohaSpriteIds=(\{.*?\});', html)
    sprites = json.loads(local.group(1)) if local else {}
    keys = json.loads(ids.group(1)) if ids else {}
    embedded = []
    for species, uri in sprites.items():
        kind, raw = uri.split(',', 1)
        body = base64.b64decode(raw, validate=True)
        embedded.append({'species': species, 'mime': kind, 'bytes': len(body), 'sha256': digest(body)})
    external = [{'species': species, 'url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + str(key) + '.png'} for species, key in keys.items() if species not in sprites]
    return {'embedded': embedded, 'external': external,
            'externalIntegrityLimit': 'External sprites use mutable master URLs, not blobs bundled/pinned by the application commit. Inventory is reproducible, but source SHA-256 equivalence cannot be established from this application source.'}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--commit', default=BASELINE)
    parser.add_argument('--repository', default=str(Path(__file__).resolve().parent.parent))
    parser.add_argument('--output', default='reports/v0188/public-assets-v0187.json')
    parser.add_argument('--external-sprites', action='store_true', help='Also read every configured external sprite; measured hashes are time-of-audit observations, not expected source hashes.')
    args = parser.parse_args()
    repo = str(Path(args.repository).resolve())
    # Commit must exist and be a full immutable SHA; never audit moving branch text.
    commit = subprocess.check_output(['git', 'rev-parse', args.commit + '^{commit}'], cwd=repo, text=True).strip()
    if not re.fullmatch(r'[a-f0-9]{40}', commit):
        raise ValueError('Immutable source commit required')
    report = {'schemaVersion': 1, 'auditStartedUTC': datetime.now(timezone.utc).isoformat(),
              'sourceCommit': commit, 'productionMutations': 0, 'networkMethod': 'GET only; public resources; no credentials',
              'staticAssets': [], 'notPublicMetadata': [], 'unverified': []}
    with tempfile.TemporaryDirectory(prefix='singularity-asset-audit-') as temporary:
        source = Path(temporary) / 'source'
        subprocess.run(['git', 'clone', '--shared', '--no-checkout', '--quiet', repo, str(source)], check=True)
        subprocess.run(['git', 'checkout', '--quiet', '--detach', commit], cwd=source, check=True)
        output = Path(temporary) / 'generated'
        subprocess.run(['node', 'scripts/v0187-build-sites.cjs', '--output', str(output)], cwd=source, check=True, stdout=subprocess.DEVNULL)
        manifest = json.loads((output / 'migration-artifacts.json').read_text())
        report['sourceTree'] = subprocess.check_output(['git', 'rev-parse', 'HEAD^{tree}'], cwd=source, text=True).strip()
        refs = {}
        for site, base in BASES.items():
            html = (output / site / 'index.html').read_text()
            for ref in re.findall(r'<(?:script|link|img)\b[^>]*\b(?:src|href)=[\"\'](\./[^\"\']+)[\"\']', html):
                file = site + '/' + safe_relative(ref)
                refs.setdefault(file, set()).add(urllib.parse.urljoin(base, ref).split('#', 1)[0])
        jobs = []
        for file, expected in sorted(manifest['files'].items()):
            site, relative = file.split('/', 1)
            if relative == '.nojekyll':
                report['notPublicMetadata'].append({'file': file, 'sha256': expected, 'reason': 'GitHub Pages build marker, not an application asset'})
                continue
            local = (output / file).read_bytes()
            if digest(local) != expected:
                raise AssertionError('Generated manifest mismatch: ' + file)
            raw = urllib.parse.urljoin(BASES[site], '' if relative == 'index.html' else relative)
            fresh = raw + '?independent-audit=' + expected[:16]
            for url in sorted({raw, fresh} | refs.get(file, set())):
                jobs.append((file, expected, url))
        def check(job):
            file, expected, url = job
            info, _ = request(url)
            return {'file': file, 'url': url, 'expectedSHA256': expected, **info,
                    'matched': info.get('status') == 200 and info.get('sha256') == expected}
        with ThreadPoolExecutor(max_workers=8) as pool:
            report['staticAssets'] = list(pool.map(check, jobs))
        report['staticSummary'] = {'packagedPublicFiles': len({x['file'] for x in report['staticAssets']}),
                                   'requests': len(jobs), 'matchedRequests': sum(x['matched'] for x in report['staticAssets']),
                                   'allMatched': all(x['matched'] for x in report['staticAssets'])}
        report['sprites'] = sprite_inventory((output / 'singularity/index.html').read_text())
        if args.external_sprites:
            def observe(sprite):
                info, _ = request(sprite['url'])
                return {**sprite, **info, 'sourceMatchEstablished': False}
            with ThreadPoolExecutor(max_workers=8) as pool:
                report['sprites']['observations'] = list(pool.map(observe, report['sprites']['external']))
            observations = report['sprites']['observations']
            report['sprites']['availabilitySummary'] = {'observed': len(observations), 'http200': sum(x.get('status') == 200 for x in observations), 'allHTTP200': all(x.get('status') == 200 for x in observations), 'sourceMatchEstablished': False}
        else:
            report['unverified'].append('External mutable PokeAPI sprites inventoried but not downloaded; no application-source digest exists for them.')
        release = json.loads((source / 'release.json').read_text())
        tag = release['tag']
        release_base = 'https://github.com/Kurohanolu/chloha-damage-lab/releases/download/' + tag + '/' + tag + '.zip'
        zip_info, actual = request(release_base)
        checksum_info, checksum = request(release_base + '.sha256')
        report['release'] = {'tag': tag, 'url': release_base, 'download': zip_info, 'checksumDownload': checksum_info}
        if actual is not None:
            env = dict(os.environ, TZ='UTC')
            expected = subprocess.check_output(['git', 'archive', '--format=zip', '--prefix=chloha-damage-lab/', commit], cwd=source, env=env)
            try:
                report['release'].update(compare_zip(actual, expected, commit))
            except (zipfile.BadZipFile, UnicodeError) as exc:
                report['release']['archiveError'] = type(exc).__name__
            checksum_match = re.fullmatch(rb'([a-f0-9]{64})  ([^\r\n]+)\n?', checksum or b'')
            report['release']['publishedChecksumMatches'] = bool(checksum_match and checksum_match.group(1).decode() == digest(actual) and checksum_match.group(2).decode() == tag + '.zip')
        else:
            report['unverified'].append('GitHub Release ZIP bytes unavailable; metadata is not a replacement for byte comparison.')
    report['auditCompletedUTC'] = datetime.now(timezone.utc).isoformat()
    target = Path(args.output)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'output': str(target), 'sourceCommit': commit, 'staticSummary': report['staticSummary'],
                      'embeddedSprites': len(report['sprites']['embedded']), 'externalSprites': len(report['sprites']['external']), 'externalAvailability': report['sprites'].get('availabilitySummary'),
                      'release': {k: report['release'].get(k) for k in ['bytesExact', 'allEntryPathsAndBytesEqual', 'files', 'publishedChecksumMatches']},
                      'unverified': report['unverified']}, ensure_ascii=False))
    return 0 if report['staticSummary']['allMatched'] and report['release'].get('bytesExact') and report['release'].get('publishedChecksumMatches') and (not args.external_sprites or report['sprites']['availabilitySummary']['allHTTP200']) else 1

if __name__ == '__main__':
    raise SystemExit(main())
