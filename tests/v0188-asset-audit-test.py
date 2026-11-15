#!/usr/bin/env python3
"""Offline negative/positive tests for the public asset audit helpers."""
import importlib.util
import io
from pathlib import Path
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('asset_audit', Path(__file__).resolve().parents[1] / 'scripts/v0188-audit-public-assets.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

class AuditTests(unittest.TestCase):
    def archive(self, data=b'known bytes', name='chloha-damage-lab/file.js', comment=b'1' * 40):
        out = io.BytesIO()
        with zipfile.ZipFile(out, 'w') as z:
            z.writestr(name, data)
            z.comment = comment
        return out.getvalue()

    def test_paths_reject_traversal_and_absolute_or_external_urls(self):
        for path in ['../index.html', './a/../index.html', '/index.html', 'https://host/file.js', 'a//b.js']:
            with self.subTest(path=path), self.assertRaises(ValueError):
                audit.safe_relative(path)
        self.assertEqual(audit.safe_relative('./assets/icon.png?v=1#x'), 'assets/icon.png')

    def test_zip_checks_bytes_entries_and_commit_comment(self):
        a = self.archive()
        self.assertTrue(audit.compare_zip(a, a, '1' * 40)['bytesExact'])
        self.assertTrue(audit.compare_zip(a, a, '1' * 40)['archiveCommentMatchesCommit'])
        different = self.archive(b'corrupted')
        self.assertFalse(audit.compare_zip(a, different, '1' * 40)['allEntryPathsAndBytesEqual'])
        renamed = self.archive(name='chloha-damage-lab/other.js')
        self.assertFalse(audit.compare_zip(a, renamed, '1' * 40)['allEntryPathsAndBytesEqual'])
        self.assertFalse(audit.compare_zip(a, a, '2' * 40)['archiveCommentMatchesCommit'])

    def test_embedded_and_external_sprites_have_distinct_provenance(self):
        html = 'window.ChlohaSpriteIds={"local":1,"remote":2};window.ChlohaLocalSprites={"local":"data:image/png;base64,aGVsbG8="};'
        data = audit.sprite_inventory(html)
        self.assertEqual(data['embedded'][0]['sha256'], audit.digest(b'hello'))
        self.assertEqual(data['external'], [{'species':'remote', 'url':'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png'}])
        self.assertIn('mutable', data['externalIntegrityLimit'])

if __name__ == '__main__':
    unittest.main()
