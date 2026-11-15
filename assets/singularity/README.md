# Orbital S review assets

The owner approved these exact Orbital S reference/adaptations and the reviewed UI on 2026-11-15 JST. See [approval scope](../../docs/v0187-owner-approval.md). The original-versus-adaptation limits below remain applicable; adoption does not imply pixel-identical reconstruction or completed publication.

| File | Purpose | Export |
|---|---|---|
| orbital-s-reference.png | User-supplied full logo, symbol + wordmark + subtitle | Original1536×1024 bytes preserved |
| orbital-s-icon.webp | Square icon adaptation | 512×512, lossless WebP encoding after deterministic downscale |
| header.webp | Compact horizontal adaptation | 600×200, lossless WebP encoding after deterministic downscale |
| favicon.png | Small tab icon from the square adaptation | 64×64 PNG |
| apple-touch-icon.png | Mobile home-screen icon export | 180×180 PNG |

The supplied reference SHA256 is `21f3c4ae7b0216936a227979134236dd51a1ecbe8028d7db39ba2f1865f1969c`. It is unchanged. The header and square icon were prepared with the built-in image generation/editing tool using that reference. Curves, glow and letterforms are approximate adaptations, not pixel-identical extraction. The favicon is a deterministic small-size export of the icon; no unrelated official Pokémon logo is incorporated. The product description is ordinary text, not an official Pokémon wordmark.

The original image is used on the review page, not as a heavy calculator background. The required header is approximately31KB; color, theme and layout are implemented in CSS independently of the engine. No external font is loaded.

## Square icon prompt

Use case: precise-object-edit / logo-brand. Asset type: square app icon for the Singularity Pokémon Damage Calculator. Image 1 is the edit target and authoritative brand reference. Extract and retain ONLY its existing upper Orbital S symbol: the exact white streamlined italic S, vivid neon-pink tilted orbital ring crossing behind/around it, and one small pink sphere on the upper-right orbit. Remove all lettering and subtitle. Center the preserved symbol with comfortable equal padding on a pure black square background. Keep the original shape, orbit angle, sphere placement, white/pink/purple glow and visual identity as faithfully as possible. No new shape, no alternate S, no Pokémon official logo, no extra planet, no letters or words, no watermark. This is an icon adaptation for design review; do not redesign it.

## Horizontal header prompt

Use case: precise-object-edit / logo-brand. Asset type: compact horizontal header logo on pure black. Image 1 is the authoritative edit target: preserve its exact Orbital S white streamlined shape, neon-pink tilted orbital ring and small upper-right pink sphere, and its italic white 'Singularity' wordmark. Rearrange only the layout into one clean wide horizontal lockup: small Orbital S on the left, the same 'Singularity' lettering to its right, vertically centered. Remove the 'Pokémon Damage Calculator' subtitle and decorative underline strokes. Tight practical padding, wide approximately 3:1 canvas, black background, restrained original pink/purple glow. Text verbatim: 'Singularity'. Keep the reference logo's identity and letterforms as faithfully as possible. No alternate symbol, no extra sphere, no additional slogan, no watermark or UI mockup. This is a header adaptation for design review.
