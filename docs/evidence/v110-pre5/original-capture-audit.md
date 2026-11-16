# Batch 3 original-capture audit

Date: 2026-11-16

An independent Dot evidence-audit worker retrieved the seven owner-provided original JPEGs from Library, visually inspected their ability titles and visible Mega Pokémon identities, and independently computed their SHA-256 hashes. This is an original-image evidence audit, not the Sol release audit; it does not claim that Sol viewed the private image pixels. Original images are not included in this repository.

The canonical associations below were checked against the existing main inventory at `61d87e82995bc60d4564aaf57a52dfc1fd859e4c` and PR #71. All seven already exist in the 245-ability display inventory. An `unsupported:` ID denotes an existing display-only association, not supported calculation mechanics.

| Original | Visible Pokémon | Visible ability name | Existing canonical ID |
|---|---|---|---|
| 32751.jpg | Mega-Lucario Z | Aura Protectora | `auraGuard` |
| 32753.jpg | Mega-Pyroar | Melena de Fuego | `fireMane` |
| 32755.jpg | Mega-Meganium | Megasolar | `unsupported:メガソーラー` |
| 32757.jpg | Mega-Eelektross | Impulso Anguila | `unsupported:うなぎのぼり` |
| 32759.jpg | Mega-Feraligatr | Piel Dracónica | `dragonize` |
| 32761.jpg | Mega-Excadrill | Turbotaladro | `unsupported:かんつうドリル` |
| 32763.jpg | Mega-Scovillain | Salpicante | `unsupported:とびだすハバネロ` |

## Independently computed original SHA-256

```text
03d8f20e563eefb83e38e9daf19a1d29463d1de20a478d8ee6cbbc8572d9b112  32751.jpg
84d285d033769a3f48b0bc563fe71d25316ea1641e3248e8e6efec3e154ed0e0  32753.jpg
5abd38196e87d1b400dd43e04374c4f4a63ab4b7ff6a856bcf5ff91cdbdee84c  32755.jpg
51d88f4065d251c6eda44f3af4f9ced86e10a0acebaf7fbea95cdd65c49686ca  32757.jpg
2b6d2d2066016c8b763ae323aa6eeb3d745514cb3dce3050fdec18812295ed60  32759.jpg
942ff8605d6d8efdc9468e48bce8bee4e97d44fa3302442323b4925806d3ec71  32761.jpg
45d0a209dc3645c8b3796d179f23b3f5d9866c6ffae6fb93329dcb9db10bfcd0  32763.jpg
```

PR #71's original ledger omitted `3af` from the 32757.jpg hash immediately after `51d88f4065d251c6eda44f`. The 64-character value above was computed from the actual original, not inferred by padding. The other six original hashes match that ledger.

## Evidence limits and scope

- The visible titles and Pokémon associations are pixel-verified. The images do not show a locale-settings screen or build/capture timestamp. ES-LA region remains owner-attested, not independently proven by those pixels.
- No additional screenshots were requested or needed for these seven name confirmations.
- This audit supports translation provenance only. It does not approve calculation behavior or expansion of supported abilities. In particular, Turbotaladro must not be conflated with Unseen Fist, nor Impulso Anguila with Levitate.
- Relative to the audited main baseline, Megasolar and Piel Dracónica were already official-confirmed. The expected integration delta is five additional official-confirmed entries and two fewer unverified entries, with no change to the seven displayed names or inventory denominator. Candidate regression, CI, release authorization, and production checks are separate requirements.
